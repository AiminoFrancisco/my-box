import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Diagnóstico de entorno (temporal). NO expone valores secretos, solo si están
 * presentes, su longitud y un prefijo no sensible para detectar errores de pegado.
 * Útil para verificar la config en Vercel. Borralo después de depurar.
 */
export async function GET() {
  const secret = process.env.SUPABASE_SECRET_KEY ?? "";
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  const pub =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    "";

  return NextResponse.json({
    marcador: "diag-v3",
    commit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
    entorno_vercel: process.env.VERCEL_ENV ?? null,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? null,
    tiene_publishable: !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    tiene_anon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    publishable_prefijo: pub.slice(0, 14),
    tiene_secret_key: !!process.env.SUPABASE_SECRET_KEY,
    tiene_service_role: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    secret_largo: (secret || service).length,
    secret_prefijo: (secret || service).slice(0, 10), // "sb_secret_" o "eyJ..." si es JWT
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? null,
  });
}
