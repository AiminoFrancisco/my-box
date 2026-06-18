/** Plantillas HTML de los mails transaccionales (bilingües: inglés por defecto). */

import type { Locale } from "@/lib/i18n/config";
import { obtenerDiccionario } from "@/lib/i18n/diccionario";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Sustituye marcadores `{token}` por sus valores. */
function interpolar(plantilla: string, valores: Record<string, string | number>) {
  let salida = plantilla;
  for (const [clave, valor] of Object.entries(valores)) {
    salida = salida.replaceAll(`{${clave}}`, String(valor));
  }
  return salida;
}

/** Envoltura con estilo de marca. */
function envoltura(titulo: string, cuerpo: string, footer: string, cta?: { texto: string; href: string }) {
  return `
  <div style="font-family:Inter,Arial,sans-serif;background:#F6F8FB;padding:32px">
    <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px -12px rgba(11,42,74,.18)">
      <div style="background:linear-gradient(135deg,#2B9FE6,#0B2A4A);padding:24px 32px;color:#fff">
        <h1 style="margin:0;font-size:20px">🧰 My Borrow Box</h1>
      </div>
      <div style="padding:32px">
        <h2 style="margin:0 0 12px;color:#0B2A4A;font-size:22px">${titulo}</h2>
        <div style="color:#475569;font-size:15px;line-height:1.6">${cuerpo}</div>
        ${
          cta
            ? `<a href="${cta.href}" style="display:inline-block;margin-top:24px;background:linear-gradient(135deg,#F5A623,#f08c00);color:#0B2A4A;text-decoration:none;font-weight:700;padding:12px 24px;border-radius:999px">${cta.texto}</a>`
            : ""
        }
      </div>
      <div style="padding:16px 32px;border-top:1px solid #E2E8F0;color:#94A3B8;font-size:12px">
        ${footer}
      </div>
    </div>
  </div>`;
}

export function mailComprobanteAprobado(nombre: string, locale: Locale = "en") {
  const t = obtenerDiccionario(locale).emails;
  const s = t.comprobanteAprobado;
  return {
    asunto: s.asunto,
    html: envoltura(
      interpolar(s.titulo, { nombre }),
      s.cuerpo,
      t.footer,
      { texto: s.cta, href: `${SITE}/panel` }
    ),
  };
}

export function mailComprobanteRechazado(nombre: string, nota?: string, locale: Locale = "en") {
  const t = obtenerDiccionario(locale).emails;
  const s = t.comprobanteRechazado;
  const cuerpo =
    s.cuerpoBase +
    (nota ? interpolar(s.motivo, { nota }) : "") +
    s.cuerpoCola;
  return {
    asunto: s.asunto,
    html: envoltura(
      interpolar(s.titulo, { nombre }),
      cuerpo,
      t.footer,
      { texto: s.cta, href: `${SITE}/membresia` }
    ),
  };
}

export function mailRecordatorioVencimiento(
  nombre: string,
  herramienta: string,
  horas: number,
  locale: Locale = "en"
) {
  const t = obtenerDiccionario(locale).emails;
  const s = t.recordatorio;
  return {
    asunto: interpolar(s.asunto, { herramienta }),
    html: envoltura(
      interpolar(s.titulo, { nombre }),
      interpolar(s.cuerpo, { herramienta, horas }),
      t.footer,
      { texto: s.cta, href: `${SITE}/mis-prestamos` }
    ),
  };
}

export function mailAvisoRetraso(
  nombre: string,
  herramienta: string,
  dias: number,
  cargo: number,
  locale: Locale = "en"
) {
  const t = obtenerDiccionario(locale).emails;
  const s = t.retraso;
  return {
    asunto: interpolar(s.asunto, { herramienta }),
    html: envoltura(
      interpolar(s.titulo, { nombre }),
      interpolar(s.cuerpo, { herramienta, dias, cargo: cargo.toFixed(2) }),
      t.footer,
      { texto: s.cta, href: `${SITE}/mis-prestamos` }
    ),
  };
}
