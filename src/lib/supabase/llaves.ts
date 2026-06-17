/**
 * Resolución de llaves de Supabase.
 *
 * Supabase migró del formato viejo (anon/service_role JWT) al nuevo
 * (sb_publishable_... / sb_secret_...). Este helper acepta ambos para que
 * el proyecto funcione sin importar cuál tengas en .env.local.
 *
 * Nota: las NEXT_PUBLIC_* se referencian de forma literal para que Next.js
 * las pueda inlinear en el bundle del cliente.
 */

/** Llave pública (publishable/anon) — segura para el navegador. */
export const LLAVE_PUBLICA =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "";

/** URL del proyecto Supabase. */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

/** Llave secreta (secret/service_role) — SOLO server. */
export function llaveSecreta(): string {
  const k =
    process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!k) {
    throw new Error(
      "Falta SUPABASE_SECRET_KEY (o SUPABASE_SERVICE_ROLE_KEY) en el entorno."
    );
  }
  return k;
}
