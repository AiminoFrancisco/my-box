/**
 * SEED (parte 2/2) · Usuarios de Auth + datos que dependen de ellos + QR.
 *
 * Crea:
 *  - 1 admin + 5 miembros (estados variados) en Supabase Auth
 *  - Completa sus perfiles (datos, rol, estado)
 *  - Identificaciones y un comprobante en revisión (placeholders)
 *  - Genera el PNG del QR de cada herramienta, lo sube al bucket `qr`
 *    y guarda la url en herramientas.url_qr
 *  - Préstamos activos y vencidos + cargos (vía recalcular_vencidos)
 *
 * Uso:  npm run seed:auth   (corré ANTES supabase/seed.sql)
 * Requiere en .env.local: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
 *                         ADMIN_EMAIL, ADMIN_PASSWORD, NEXT_PUBLIC_SITE_URL
 *
 * Idempotente: si los usuarios ya existen, los reutiliza.
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import QRCode from "qrcode";

// Carga .env.local (y .env como respaldo)
config({ path: ".env.local" });
config();

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Acepta el formato nuevo (sb_secret_...) o el viejo (service_role JWT).
const SERVICE_KEY =
  process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@myborrowbox.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Admin1234!";

if (!URL || !SERVICE_KEY) {
  console.error("❌ Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SECRET_KEY (o SUPABASE_SERVICE_ROLE_KEY) en .env.local");
  process.exit(1);
}

const supabase = createClient(URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const CLAVE_MIEMBROS = "Miembro1234!"; // contraseña común para los miembros de prueba

type SemillaUsuario = {
  email: string;
  password: string;
  rol: "admin" | "miembro";
  estado: "pendiente_pago" | "comprobante_en_revision" | "activo" | "suspendido" | "cancelado";
  nombre_completo: string;
  direccion: string;
  telefono: string;
  fecha_nacimiento: string;
  persona_autorizada_nombre?: string;
};

const USUARIOS: SemillaUsuario[] = [
  {
    email: ADMIN_EMAIL, password: ADMIN_PASSWORD, rol: "admin", estado: "activo",
    nombre_completo: "Admin My Borrow Box", direccion: "123 W Calle Tool, Sahuarita, AZ",
    telefono: "+1 520-555-0000", fecha_nacimiento: "1985-01-01",
  },
  {
    email: "maria.gonzalez@example.com", password: CLAVE_MIEMBROS, rol: "miembro", estado: "activo",
    nombre_completo: "María González", direccion: "456 E Quail Crossing, Sahuarita, AZ",
    telefono: "+1 520-555-0201", fecha_nacimiento: "1990-05-12",
    persona_autorizada_nombre: "José González",
  },
  {
    email: "juan.perez@example.com", password: CLAVE_MIEMBROS, rol: "miembro", estado: "activo",
    nombre_completo: "Juan Pérez", direccion: "789 S Rancho Sahuarita Blvd, Sahuarita, AZ",
    telefono: "+1 520-555-0202", fecha_nacimiento: "1982-09-30",
    persona_autorizada_nombre: "Carmen Pérez",
  },
  {
    email: "lucia.ramirez@example.com", password: CLAVE_MIEMBROS, rol: "miembro", estado: "comprobante_en_revision",
    nombre_completo: "Lucía Ramírez", direccion: "321 W Camino Verde, Sahuarita, AZ",
    telefono: "+1 520-555-0203", fecha_nacimiento: "1995-02-18",
    persona_autorizada_nombre: "Diego Ramírez",
  },
  {
    email: "carlos.mendez@example.com", password: CLAVE_MIEMBROS, rol: "miembro", estado: "suspendido",
    nombre_completo: "Carlos Méndez", direccion: "654 N Abrego Dr, Green Valley, AZ",
    telefono: "+1 520-555-0204", fecha_nacimiento: "1978-11-05",
    persona_autorizada_nombre: "Rosa Méndez",
  },
  {
    email: "ana.torres@example.com", password: CLAVE_MIEMBROS, rol: "miembro", estado: "pendiente_pago",
    nombre_completo: "Ana Torres", direccion: "987 E Sahuarita Rd, Sahuarita, AZ",
    telefono: "+1 520-555-0205", fecha_nacimiento: "1998-07-22",
  },
];

/** Crea el usuario o devuelve el existente (idempotente). */
async function crearOObtenerUsuario(u: SemillaUsuario): Promise<string> {
  const { data, error } = await supabase.auth.admin.createUser({
    email: u.email,
    password: u.password,
    email_confirm: true,
    user_metadata: {
      nombre_completo: u.nombre_completo,
      direccion: u.direccion,
      telefono: u.telefono,
      fecha_nacimiento: u.fecha_nacimiento,
      persona_autorizada_nombre: u.persona_autorizada_nombre ?? null,
    },
  });

  if (data?.user) return data.user.id;

  // Ya existe: buscarlo paginando la lista de usuarios.
  if (error && /already|exists|registered/i.test(error.message)) {
    let page = 1;
    while (true) {
      const { data: lista, error: e2 } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
      if (e2) throw e2;
      const found = lista.users.find((x) => x.email?.toLowerCase() === u.email.toLowerCase());
      if (found) return found.id;
      if (lista.users.length < 200) break;
      page++;
    }
  }
  throw error ?? new Error(`No se pudo crear/obtener ${u.email}`);
}

/** Completa el perfil con rol/estado/datos (el trigger lo creó al registrar). */
async function actualizarPerfil(id: string, u: SemillaUsuario) {
  const { error } = await supabase
    .from("perfiles")
    .update({
      nombre_completo: u.nombre_completo,
      email: u.email,
      direccion: u.direccion,
      telefono: u.telefono,
      fecha_nacimiento: u.fecha_nacimiento,
      persona_autorizada_nombre: u.persona_autorizada_nombre ?? null,
      rol: u.rol,
      estado: u.estado,
      acepto_contrato: true,
      fecha_aceptacion: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw error;
}

async function main() {
  console.log("🌱 Seed parte 2/2 — usuarios, QR, préstamos y cargos\n");

  // 1) Usuarios + perfiles
  const ids: Record<string, string> = {};
  for (const u of USUARIOS) {
    const id = await crearOObtenerUsuario(u);
    await actualizarPerfil(id, u);
    ids[u.email] = id;
    console.log(`  ✅ ${u.nombre_completo.padEnd(22)} [${u.estado}]  ${u.email}`);
  }

  // 2) Identificaciones (placeholders) para titular + autorizada de quienes la tienen
  for (const u of USUARIOS.filter((x) => x.rol === "miembro")) {
    const filas = [
      { perfil_id: ids[u.email], tipo_persona: "titular", url_imagen: "https://placehold.co/600x380/0B2A4A/FFFFFF?text=ID+Titular" },
    ];
    if (u.persona_autorizada_nombre) {
      filas.push({ perfil_id: ids[u.email], tipo_persona: "autorizada", url_imagen: "https://placehold.co/600x380/2B9FE6/FFFFFF?text=ID+Autorizada" });
    }
    // Evita duplicar si ya hay identificaciones para el perfil
    const { count } = await supabase.from("identificaciones").select("*", { count: "exact", head: true }).eq("perfil_id", ids[u.email]);
    if (!count) await supabase.from("identificaciones").insert(filas);
  }

  // 3) Comprobante en revisión para Lucía
  const lucia = ids["lucia.ramirez@example.com"];
  const { count: cCount } = await supabase.from("comprobantes_pago").select("*", { count: "exact", head: true }).eq("perfil_id", lucia);
  if (!cCount) {
    await supabase.from("comprobantes_pago").insert({
      perfil_id: lucia, monto: 29.99, estado: "pendiente",
      url_archivo: "https://placehold.co/700x900/F5A623/0B2A4A?text=Comprobante+Zelle",
    });
  }
  console.log("\n  ✅ Identificaciones y comprobante en revisión cargados");

  // 4) QR de cada herramienta -> subir al bucket `qr`
  const { data: herramientas, error: hErr } = await supabase.from("herramientas").select("id, numero_inventario, qr_token, url_qr");
  if (hErr) throw hErr;
  if (!herramientas?.length) {
    console.warn("\n⚠️  No hay herramientas. ¿Corriste supabase/seed.sql primero?");
  } else {
    let nuevos = 0;
    for (const h of herramientas) {
      if (h.url_qr) continue; // ya tiene QR
      const payload = `${SITE_URL}/escanear?token=${h.qr_token}`;
      const png = await QRCode.toBuffer(payload, { width: 512, margin: 2, color: { dark: "#0B2A4A", light: "#FFFFFF" } });
      const ruta = `herramientas/${h.numero_inventario}.png`;
      const { error: upErr } = await supabase.storage.from("qr").upload(ruta, png, { contentType: "image/png", upsert: true });
      if (upErr) { console.warn(`  ⚠️  QR ${h.numero_inventario}: ${upErr.message}`); continue; }
      const { data: pub } = supabase.storage.from("qr").getPublicUrl(ruta);
      await supabase.from("herramientas").update({ url_qr: pub.publicUrl }).eq("id", h.id);
      nuevos++;
    }
    console.log(`  ✅ QR generados/subidos: ${nuevos} (de ${herramientas.length} herramientas)`);
  }

  // 5) Préstamos: activos y vencidos
  const maria = ids["maria.gonzalez@example.com"];
  const juan = ids["juan.perez@example.com"];

  const hora = 3600 * 1000;
  const ahora = Date.now();

  // helper: id de herramienta por número de inventario
  async function herrId(inv: string): Promise<string | null> {
    const { data } = await supabase.from("herramientas").select("id").eq("numero_inventario", inv).single();
    return data?.id ?? null;
  }

  type SemillaPrestamo = { perfil: string; inv: string; offsetPrestamoH: number; estado: "activo" };
  // offsetPrestamoH negativo = en el pasado. fecha_limite = prestamo + 72h.
  const PRESTAMOS: SemillaPrestamo[] = [
    { perfil: maria, inv: "INV-002", offsetPrestamoH: -40, estado: "activo" }, // en curso (verde)
    { perfil: juan,  inv: "INV-004", offsetPrestamoH: -66, estado: "activo" }, // por vencer (<12h)
    { perfil: maria, inv: "INV-008", offsetPrestamoH: -120, estado: "activo" }, // vencido ~2 días
    { perfil: juan,  inv: "INV-010", offsetPrestamoH: -240, estado: "activo" }, // vencido ~7 días -> reemplazo
  ];

  for (const p of PRESTAMOS) {
    const hid = await herrId(p.inv);
    if (!hid) continue;
    // ¿ya hay préstamo abierto de esta herramienta?
    const { count } = await supabase.from("prestamos").select("*", { count: "exact", head: true }).eq("herramienta_id", hid).in("estado", ["activo", "vencido"]);
    if (count) continue;

    const fechaPrestamo = new Date(ahora + p.offsetPrestamoH * hora);
    const fechaLimite = new Date(fechaPrestamo.getTime() + 72 * hora);
    await supabase.from("prestamos").insert({
      herramienta_id: hid, perfil_id: p.perfil,
      fecha_prestamo: fechaPrestamo.toISOString(),
      fecha_limite: fechaLimite.toISOString(),
      estado: "activo",
    });
    await supabase.from("herramientas").update({ estado: "prestada" }).eq("id", hid);
  }
  console.log("  ✅ Préstamos cargados (activos + vencidos)");

  // 6) Generar cargos de los vencidos reutilizando la función de negocio
  const { data: nVencidos, error: rErr } = await supabase.rpc("recalcular_vencidos");
  if (rErr) console.warn("  ⚠️  recalcular_vencidos:", rErr.message);
  else console.log(`  ✅ recalcular_vencidos() marcó ${nVencidos} préstamo(s) vencido(s) y generó sus cargos`);

  // 7) Cargo de membresía pagado para los activos (historial de ingresos)
  for (const email of ["maria.gonzalez@example.com", "juan.perez@example.com"]) {
    const pid = ids[email];
    const { count } = await supabase.from("cargos").select("*", { count: "exact", head: true }).eq("perfil_id", pid).eq("tipo", "membresia");
    if (!count) {
      await supabase.from("cargos").insert({ perfil_id: pid, tipo: "membresia", monto: 29.99, estado: "pagado", descripcion: "Membresía mensual" });
    }
  }
  console.log("  ✅ Cargos de membresía (pagados) para activos");

  console.log("\n🎉 Seed completo.\n");
  console.log("──────────── Credenciales de prueba ────────────");
  console.log(`  ADMIN     ${ADMIN_EMAIL}  /  ${ADMIN_PASSWORD}`);
  console.log(`  MIEMBROS  (todos con la clave: ${CLAVE_MIEMBROS})`);
  for (const u of USUARIOS.filter((x) => x.rol === "miembro")) {
    console.log(`    · ${u.email.padEnd(34)} [${u.estado}]`);
  }
  console.log("─────────────────────────────────────────────────");
}

main().catch((e) => {
  console.error("\n❌ Error en el seed:", e);
  process.exit(1);
});
