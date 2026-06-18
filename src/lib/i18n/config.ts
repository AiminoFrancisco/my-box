/**
 * Configuración base de internacionalización (i18n).
 *
 * El sitio es bilingüe: inglés por defecto (público de Arizona) con opción a
 * español. El idioma elegido se guarda en la cookie `idioma` y se resuelve
 * tanto en server components (vía `obtenerLocale`) como en client components
 * (vía el contexto `ProveedorIdioma`).
 */
export type Locale = "en" | "es";

export const LOCALES: Locale[] = ["en", "es"];
export const LOCALE_DEFECTO: Locale = "en";
export const COOKIE_IDIOMA = "idioma";
/** Un año en segundos (vida de la cookie de idioma). */
export const MAX_EDAD_COOKIE = 60 * 60 * 24 * 365;

/** Etiquetas del propio selector de idioma. */
export const ETIQUETAS_LOCALE: Record<Locale, string> = {
  en: "English",
  es: "Español",
};

/** Normaliza cualquier valor a un Locale válido, cayendo al idioma por defecto. */
export function normalizarLocale(valor: string | undefined | null): Locale {
  return valor === "es" ? "es" : "en";
}
