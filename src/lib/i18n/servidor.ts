/**
 * Helpers de i18n para server components y server actions.
 * Leen el idioma desde la cookie `idioma` (cae a inglés por defecto).
 */
import { cookies } from "next/headers";
import { COOKIE_IDIOMA, normalizarLocale, type Locale } from "./config";
import { obtenerDiccionario, type Diccionario } from "./diccionario";

/** Idioma activo según la cookie (en server components / actions). */
export function obtenerLocale(): Locale {
  return normalizarLocale(cookies().get(COOKIE_IDIOMA)?.value);
}

/** Diccionario completo para el idioma activo. */
export function obtenerDic(): Diccionario {
  return obtenerDiccionario(obtenerLocale());
}
