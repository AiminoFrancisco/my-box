"use server";

import { redirect } from "next/navigation";
import { crearClienteServidor } from "@/lib/supabase/server";
import { crearClienteAdmin } from "@/lib/supabase/admin";

export type EstadoForm = { error?: string };

/** Inicia sesión y redirige según rol/estado. */
export async function iniciarSesion(_prev: EstadoForm, formData: FormData): Promise<EstadoForm> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirigir = String(formData.get("redirigir") ?? "");

  if (!email || !password) return { error: "Completa tu correo y contraseña." };

  const supabase = crearClienteServidor();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Correo o contraseña incorrectos." };

  // Decide destino por rol.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let destino = redirigir || "/panel";
  if (user) {
    const { data: perfil } = await supabase
      .from("perfiles")
      .select("rol")
      .eq("id", user.id)
      .single();
    if (perfil?.rol === "admin") destino = redirigir || "/admin";
  }

  redirect(destino);
}

/** Login exclusivo de administradores. Si la cuenta no es admin, la rechaza. */
export async function iniciarSesionAdmin(_prev: EstadoForm, formData: FormData): Promise<EstadoForm> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { error: "Completa tu correo y contraseña." };

  const supabase = crearClienteServidor();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Correo o contraseña incorrectos." };

  // Verifica rol; si no es admin, cierra sesión y rechaza.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: perfil } = await supabase.from("perfiles").select("rol").eq("id", user?.id ?? "").single();
  if (perfil?.rol !== "admin") {
    await supabase.auth.signOut();
    return { error: "Esta cuenta no es de administrador. Usa el acceso de miembros." };
  }

  redirect("/admin");
}

/** Registra un nuevo miembro: crea cuenta, sube IDs y lo deja logueado. */
export async function registrarse(_prev: EstadoForm, formData: FormData): Promise<EstadoForm> {
  const nombre_completo = String(formData.get("nombre_completo") ?? "").trim();
  const direccion = String(formData.get("direccion") ?? "").trim();
  const telefono = String(formData.get("telefono") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fecha_nacimiento = String(formData.get("fecha_nacimiento") ?? "");
  const persona_autorizada_nombre = String(formData.get("persona_autorizada_nombre") ?? "").trim();
  const acepto = formData.get("acepto") === "on" || formData.get("acepto") === "true";
  const idTitular = formData.get("id_titular") as File | null;
  const idAutorizada = formData.get("id_autorizada") as File | null;

  // Validaciones
  if (!nombre_completo || !direccion || !telefono || !email || !password) {
    return { error: "Faltan datos obligatorios del titular." };
  }
  if (password.length < 8) return { error: "La contraseña debe tener al menos 8 caracteres." };
  if (!fecha_nacimiento) return { error: "Indica tu fecha de nacimiento." };
  if (!persona_autorizada_nombre) return { error: "Indica el nombre de la persona autorizada." };
  if (!acepto) return { error: "Debes aceptar el contrato de membresía para continuar." };
  if (!idTitular || idTitular.size === 0) return { error: "Sube la foto de la identificación del titular." };
  if (!idAutorizada || idAutorizada.size === 0) return { error: "Sube la foto de la identificación de la persona autorizada." };

  const admin = crearClienteAdmin();

  // 1) Crear usuario confirmado (sin verificación por correo; la aprobación es manual).
  const { data: creado, error: errCrear } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { nombre_completo, direccion, telefono, fecha_nacimiento, persona_autorizada_nombre },
  });

  if (errCrear || !creado?.user) {
    if (/already|registered|exists/i.test(errCrear?.message ?? "")) {
      return { error: "Ya existe una cuenta con ese correo. Inicia sesión." };
    }
    return { error: "No se pudo crear la cuenta. Intenta de nuevo." };
  }

  const userId = creado.user.id;

  // 2) Asegurar datos del perfil (por si el trigger corrió con metadata vacía) + aceptación.
  await admin
    .from("perfiles")
    .update({
      nombre_completo,
      direccion,
      telefono,
      email,
      fecha_nacimiento,
      persona_autorizada_nombre,
      acepto_contrato: true,
      fecha_aceptacion: new Date().toISOString(),
    })
    .eq("id", userId);

  // 3) Subir identificaciones (bucket privado, ruta <userId>/...).
  const subirID = async (archivo: File, tipo: "titular" | "autorizada") => {
    const ext = (archivo.name.split(".").pop() ?? "jpg").toLowerCase();
    const ruta = `${userId}/${tipo}.${ext}`;
    const { error } = await admin.storage
      .from("identificaciones")
      .upload(ruta, archivo, { contentType: archivo.type || "image/jpeg", upsert: true });
    if (error) throw error;
    await admin.from("identificaciones").insert({ perfil_id: userId, tipo_persona: tipo, url_imagen: ruta });
  };

  try {
    await subirID(idTitular, "titular");
    await subirID(idAutorizada, "autorizada");
  } catch {
    return { error: "La cuenta se creó pero falló la subida de identificaciones. Súbelas desde tu perfil." };
  }

  // 4) Iniciar sesión con cookies (deja al usuario logueado).
  const supabase = crearClienteServidor();
  await supabase.auth.signInWithPassword({ email, password });

  redirect("/membresia");
}

/** Cierra la sesión. */
export async function cerrarSesion(): Promise<void> {
  const supabase = crearClienteServidor();
  await supabase.auth.signOut();
  redirect("/login");
}
