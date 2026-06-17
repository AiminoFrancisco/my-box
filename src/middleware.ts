import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_URL, LLAVE_PUBLICA } from "@/lib/supabase/llaves";

type CookieParaSetear = { name: string; value: string; options: CookieOptions };

/**
 * Middleware: refresca la sesión de Supabase en cada request y protege rutas.
 * - /panel, /perfil, /membresia, ... (miembro)  -> requieren sesión.
 * - /admin/*                                     -> requieren rol admin.
 * El chequeo fino de rol/estado se hace además en los layouts del servidor.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    SUPABASE_URL,
    LLAVE_PUBLICA,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesPorSetear: CookieParaSetear[]) {
          cookiesPorSetear.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesPorSetear.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const ruta = request.nextUrl.pathname;
  const rutasProtegidas = ["/panel", "/perfil", "/membresia", "/herramientas", "/escanear", "/mis-prestamos", "/bodega"];
  const esRutaProtegida = rutasProtegidas.some((r) => ruta.startsWith(r));
  // /admin/login es público (la puerta del admin); el resto de /admin va protegido.
  const esRutaAdmin = ruta.startsWith("/admin") && ruta !== "/admin/login";

  if ((esRutaProtegida || esRutaAdmin) && !user) {
    const url = request.nextUrl.clone();
    // Los no logueados a /admin van a la puerta de admin; el resto, al login de miembros.
    url.pathname = esRutaAdmin ? "/admin/login" : "/login";
    if (!esRutaAdmin) url.searchParams.set("redirigir", ruta);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  // Corre en todo menos assets estáticos.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
