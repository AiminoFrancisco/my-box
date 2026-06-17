"use server";

import { revalidatePath } from "next/cache";
import { crearClienteServidor } from "@/lib/supabase/server";

export type ResultadoAccion = { ok?: boolean; error?: string; mensaje?: string };

/** Normaliza un valor escaneado: acepta el token suelto o una URL con ?token=. */
function extraerToken(entrada: string): string {
  const v = entrada.trim();
  try {
    const url = new URL(v);
    return url.searchParams.get("token") ?? v;
  } catch {
    return v;
  }
}

export type HerramientaEscaneada = {
  nombre: string;
  numero_inventario: string;
  foto_url: string | null;
  categoria: string | null;
  descripcion: string | null;
  valor_reemplazo: number;
  estado: "disponible" | "prestada" | "perdida" | "en_reparacion";
  qr_token: string;
};

/** Busca la info de una herramienta por su QR (para mostrarla antes de confirmar). */
export async function buscarHerramienta(
  qr: string
): Promise<{ herramienta?: HerramientaEscaneada; error?: string }> {
  const token = extraerToken(qr);
  if (!token) return { error: "Código QR inválido." };

  const supabase = crearClienteServidor();
  const { data, error } = await supabase
    .from("herramientas")
    .select("nombre, numero_inventario, foto_url, categoria, descripcion, valor_reemplazo, estado, qr_token")
    .eq("qr_token", token)
    .single();

  if (error || !data) return { error: "No encontramos esa herramienta. Revisa el QR." };
  return { herramienta: data as unknown as HerramientaEscaneada };
}

/** Saca una herramienta por su QR (token). Llama a la función SQL atómica. */
export async function sacarHerramienta(qr: string): Promise<ResultadoAccion> {
  const token = extraerToken(qr);
  if (!token) return { error: "Código QR inválido." };

  const supabase = crearClienteServidor();
  const { error } = await supabase.rpc("sacar_herramienta", { p_qr_token: token });

  if (error) return { error: traducirError(error.message) };

  revalidatePath("/mis-prestamos");
  revalidatePath("/herramientas");
  revalidatePath("/panel");
  return { ok: true, mensaje: "¡Herramienta asignada! Tienes 72 horas para devolverla." };
}

/** Devuelve una herramienta por su QR (token). */
export async function devolverHerramienta(qr: string): Promise<ResultadoAccion> {
  const token = extraerToken(qr);
  if (!token) return { error: "Código QR inválido." };

  const supabase = crearClienteServidor();
  const { error } = await supabase.rpc("devolver_herramienta", { p_qr_token: token });

  if (error) return { error: traducirError(error.message) };

  revalidatePath("/mis-prestamos");
  revalidatePath("/herramientas");
  revalidatePath("/panel");
  return { ok: true, mensaje: "¡Herramienta devuelta! Gracias." };
}

/** Registra entrada o salida de la bodega (solo miembros activos por RLS). */
export async function registrarAcceso(tipo: "entrada" | "salida"): Promise<ResultadoAccion> {
  const supabase = crearClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesión expirada." };

  const { error } = await supabase.from("accesos_bodega").insert({ perfil_id: user.id, tipo });
  if (error) return { error: "No se pudo registrar el acceso. ¿Tu membresía está activa?" };

  revalidatePath("/bodega");
  return { ok: true, mensaje: tipo === "entrada" ? "Entrada registrada." : "Salida registrada." };
}

/** Traduce mensajes técnicos de Postgres a algo claro en español. */
function traducirError(msg: string): string {
  if (/no está activa/i.test(msg)) return "Tu membresía no está activa todavía.";
  if (/no encontrada/i.test(msg)) return "No encontramos esa herramienta. Revisa el QR.";
  if (/no está disponible/i.test(msg)) return "Esa herramienta no está disponible ahora.";
  if (/máximo/i.test(msg)) return "Ya tienes el máximo de 5 herramientas. Devuelve una para sacar otra.";
  if (/no tienes esta herramienta/i.test(msg)) return "No tienes esa herramienta prestada.";
  return "No se pudo completar la operación. Intenta de nuevo.";
}
