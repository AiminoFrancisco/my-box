"use server";

/**
 * Server action para cambiar el idioma. Guarda la elección en la cookie
 * `idioma`; el `router.refresh()` del cliente re-renderiza los server
 * components con el nuevo diccionario.
 */
import { cookies } from "next/headers";
import { COOKIE_IDIOMA, MAX_EDAD_COOKIE, normalizarLocale } from "./config";

export async function cambiarIdioma(valor: string) {
  cookies().set(COOKIE_IDIOMA, normalizarLocale(valor), {
    path: "/",
    maxAge: MAX_EDAD_COOKIE,
    sameSite: "lax",
  });
}
