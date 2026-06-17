import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_URL, LLAVE_PUBLICA } from "./llaves";

type CookieParaSetear = { name: string; value: string; options: CookieOptions };

/**
 * Cliente de Supabase para el servidor (Server Components, Route Handlers,
 * Server Actions). Lee/escribe la sesión desde las cookies.
 */
export function crearClienteServidor() {
  const almacenCookies = cookies();

  return createServerClient(
    SUPABASE_URL,
    LLAVE_PUBLICA,
    {
      cookies: {
        getAll() {
          return almacenCookies.getAll();
        },
        setAll(cookiesPorSetear: CookieParaSetear[]) {
          try {
            cookiesPorSetear.forEach(({ name, value, options }) =>
              almacenCookies.set(name, value, options)
            );
          } catch {
            // El set falla en Server Components puros; el middleware refresca
            // la sesión, así que se puede ignorar de forma segura.
          }
        },
      },
    }
  );
}
