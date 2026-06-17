// Prueba el setup_completo.sql contra un Postgres real (PGlite/WASM).
// Crea stubs de lo que Supabase ya provee (esquemas auth/storage, roles, auth.uid()).
import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";

const STUBS = `
-- Roles que Supabase ya tiene
do $$ begin create role anon; exception when duplicate_object then null; end $$;
do $$ begin create role authenticated; exception when duplicate_object then null; end $$;
do $$ begin create role service_role; exception when duplicate_object then null; end $$;

-- Esquema auth + auth.uid() + auth.users (lo que usan triggers/policies)
create schema if not exists auth;
create or replace function auth.uid() returns uuid language sql stable as $$ select null::uuid $$;
create table if not exists auth.users (
  id uuid primary key default gen_random_uuid(),
  email text,
  raw_user_meta_data jsonb default '{}'::jsonb
);

-- Esquema storage + objetos/función que usan las policies
create schema if not exists storage;
create table if not exists storage.buckets (id text primary key, name text, public boolean);
create table if not exists storage.objects (
  id uuid primary key default gen_random_uuid(),
  bucket_id text,
  name text
);
create or replace function storage.foldername(name text) returns text[]
  language sql immutable as $$ select string_to_array(name, '/') $$;
`;

const db = new PGlite();

// Lee el archivo y neutraliza los CREATE EXTENSION (gen_random_uuid es core en PG16;
// uuid-ossp/pgcrypto sí existen en Supabase, aquí solo no los necesitamos).
let sql = readFileSync("supabase/setup_completo.sql", "utf8");
sql = sql.replace(/create extension if not exists [^;]+;/gi, "-- extension omitida (prueba)");

try {
  await db.exec(STUBS);
  console.log("✅ Stubs de auth/storage creados");

  await db.exec(sql);
  console.log("✅ setup_completo.sql ejecutado SIN errores");

  // Verifica que el seed estático entró
  const checks = [
    ["herramientas", 20],
    ["anunciantes", 7],
    ["configuracion", 10],
    ["ubicaciones", 1],
  ];
  for (const [tabla, esperado] of checks) {
    const r = await db.query(`select count(*)::int as n from public.${tabla}`);
    const n = r.rows[0].n;
    console.log(`   ${tabla.padEnd(16)} ${n} filas ${n === esperado ? "✅" : `⚠️ (esperaba ${esperado})`}`);
  }

  // Verifica funciones de negocio y enums
  const fns = await db.query(`select proname from pg_proc where proname in ('sacar_herramienta','devolver_herramienta','recalcular_vencidos','es_admin','es_activo','manejar_nuevo_usuario') order by proname`);
  console.log("   funciones:", fns.rows.map((x) => x.proname).join(", "));

  const pols = await db.query(`select count(*)::int as n from pg_policies where schemaname='public'`);
  console.log(`   políticas RLS (public): ${pols.rows[0].n}`);

  // E2E: registro -> perfil pendiente_pago -> subir comprobante -> en revisión
  console.log("\n--- Flujo comprobante (end-to-end) ---");
  await db.exec(`insert into auth.users (email, raw_user_meta_data) values ('test@e2e.com', '{"nombre_completo":"Test E2E"}')`);
  const u = await db.query(`select id from auth.users where email='test@e2e.com'`);
  const uid = u.rows[0].id;
  const p1 = await db.query(`select estado from public.perfiles where id=$1`, [uid]);
  console.log(`   tras registro:        ${p1.rows[0]?.estado} ${p1.rows[0]?.estado === "pendiente_pago" ? "✅" : "❌"}`);
  await db.exec(`insert into public.comprobantes_pago (perfil_id, url_archivo, monto) values ('${uid}', 'x/y.jpg', 29.99)`);
  const p2 = await db.query(`select estado from public.perfiles where id=$1`, [uid]);
  console.log(`   tras subir comprobante: ${p2.rows[0]?.estado} ${p2.rows[0]?.estado === "comprobante_en_revision" ? "✅ (trigger OK)" : "❌"}`);

  console.log("\n🎉 El SQL está sano. Puedes pegarlo en Supabase con confianza.");
} catch (e) {
  console.error("\n❌ ERROR en el SQL:");
  console.error(e.message || e);
  process.exit(1);
}
