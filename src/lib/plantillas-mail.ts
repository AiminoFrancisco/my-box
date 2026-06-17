/** Plantillas HTML de los mails transaccionales (en español). */

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Envoltura con estilo de marca. */
function envoltura(titulo: string, cuerpo: string, cta?: { texto: string; href: string }) {
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
        My Borrow Box · Sahuarita, Arizona
      </div>
    </div>
  </div>`;
}

export function mailComprobanteAprobado(nombre: string) {
  return {
    asunto: "¡Tu membresía está activa! 🎉",
    html: envoltura(
      `¡Bienvenido, ${nombre}!`,
      `Aprobamos tu comprobante de pago y tu membresía de My Borrow Box ya está <strong>activa</strong>.
       <br/><br/>Ya puedes ver el código de acceso a la bodega y empezar a sacar herramientas escaneando su QR.`,
      { texto: "Entrar a mi panel", href: `${SITE}/panel` }
    ),
  };
}

export function mailComprobanteRechazado(nombre: string, nota?: string) {
  return {
    asunto: "Sobre tu comprobante de pago",
    html: envoltura(
      `Hola, ${nombre}`,
      `Revisamos tu comprobante y no pudimos aprobarlo todavía.
       ${nota ? `<br/><br/><strong>Motivo:</strong> ${nota}` : ""}
       <br/><br/>Sube de nuevo tu comprobante desde tu cuenta y lo revisamos enseguida.`,
      { texto: "Subir comprobante", href: `${SITE}/membresia` }
    ),
  };
}

export function mailRecordatorioVencimiento(nombre: string, herramienta: string, horas: number) {
  return {
    asunto: `Recordatorio: devuelve "${herramienta}" pronto`,
    html: envoltura(
      `Hola, ${nombre}`,
      `Tu préstamo de <strong>${herramienta}</strong> vence en aproximadamente <strong>${horas} horas</strong>.
       <br/><br/>Devuélvela a tiempo para no generar cargos por retraso ($5/día).`,
      { texto: "Ver mis préstamos", href: `${SITE}/mis-prestamos` }
    ),
  };
}

export function mailAvisoRetraso(nombre: string, herramienta: string, dias: number, cargo: number) {
  return {
    asunto: `Tu préstamo de "${herramienta}" está vencido`,
    html: envoltura(
      `Hola, ${nombre}`,
      `Tu préstamo de <strong>${herramienta}</strong> está vencido por <strong>${dias} día(s)</strong>.
       Se generó un cargo de <strong>$${cargo.toFixed(2)}</strong>.
       <br/><br/>Por favor devuélvela cuanto antes para evitar cargos adicionales.`,
      { texto: "Ver mis préstamos", href: `${SITE}/mis-prestamos` }
    ),
  };
}
