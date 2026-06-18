/**
 * Agregador de diccionarios. Reúne todas las áreas en un único objeto por
 * idioma. La forma del inglés es la fuente de verdad del tipo `Diccionario`.
 */
import type { Locale } from "./config";
import { common } from "./strings/common";
import { home } from "./strings/home";
import { auth } from "./strings/auth";
import { member } from "./strings/member";
import { admin } from "./strings/admin";
import { emails } from "./strings/emails";

export const DICCIONARIOS = {
  en: {
    common: common.en,
    home: home.en,
    auth: auth.en,
    member: member.en,
    admin: admin.en,
    emails: emails.en,
  },
  es: {
    common: common.es,
    home: home.es,
    auth: auth.es,
    member: member.es,
    admin: admin.es,
    emails: emails.es,
  },
} as const;

export type Diccionario = (typeof DICCIONARIOS)["en"];

/** Devuelve el diccionario completo para un idioma, con tipo estable. */
export function obtenerDiccionario(locale: Locale): Diccionario {
  return DICCIONARIOS[locale] as Diccionario;
}
