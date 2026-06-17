import { NextResponse, type NextRequest } from "next/server";
import { crearClienteServidor } from "@/lib/supabase/server";

/**
 * Callback de autenticación de Supabase.
 * Intercambia el `code` por una sesión (útil para links mágicos / OAuth a futuro).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const siguiente = searchParams.get("redirigir") ?? "/panel";

  if (code) {
    const supabase = crearClienteServidor();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${origin}${siguiente}`);
}
