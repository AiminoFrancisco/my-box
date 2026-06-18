// Cadenas de los mails transaccionales y mensajes de las API user-facing.
const en = {
  /** Línea de marca del pie de los correos. */
  footer: "My Borrow Box · Sahuarita, Arizona",

  comprobanteAprobado: {
    asunto: "Your membership is active! 🎉",
    titulo: "Welcome, {nombre}!",
    cuerpo:
      `We've approved your payment proof and your My Borrow Box membership is now <strong>active</strong>.
       <br/><br/>You can now view your tool library access code and start checking out tools by scanning their QR codes.`,
    cta: "Go to my dashboard",
  },

  comprobanteRechazado: {
    asunto: "About your payment proof",
    titulo: "Hi, {nombre}",
    cuerpoBase:
      `We reviewed your payment proof and weren't able to approve it just yet.`,
    motivo: `<br/><br/><strong>Reason:</strong> {nota}`,
    cuerpoCola:
      `<br/><br/>Just upload your payment proof again from your account and we'll review it right away.`,
    cta: "Upload payment proof",
  },

  recordatorio: {
    asunto: `Reminder: return "{herramienta}" soon`,
    titulo: "Hi, {nombre}",
    cuerpo:
      `Your loan of <strong>{herramienta}</strong> is due in about <strong>{horas} hours</strong>.
       <br/><br/>Return it on time to avoid late fees ($5/day).`,
    cta: "View my loans",
  },

  retraso: {
    asunto: `Your loan of "{herramienta}" is overdue`,
    titulo: "Hi, {nombre}",
    cuerpo:
      `Your loan of <strong>{herramienta}</strong> is overdue by <strong>{dias} day(s)</strong>.
       A late fee of <strong>\${cargo}</strong> has been charged.
       <br/><br/>Please return it as soon as possible to avoid additional charges.`,
    cta: "View my loans",
  },

  sistema: {
    noAutorizado: "Unauthorized",
    noEncontrado: "Not found",
    prohibido: "Forbidden",
    archivoNoDisponible: "File not available",
  },
};

const es = {
  footer: "My Borrow Box · Sahuarita, Arizona",

  comprobanteAprobado: {
    asunto: "¡Tu membresía está activa! 🎉",
    titulo: "¡Bienvenido, {nombre}!",
    cuerpo:
      `Aprobamos tu comprobante de pago y tu membresía de My Borrow Box ya está <strong>activa</strong>.
       <br/><br/>Ya puedes ver el código de acceso a la bodega y empezar a sacar herramientas escaneando su QR.`,
    cta: "Entrar a mi panel",
  },

  comprobanteRechazado: {
    asunto: "Sobre tu comprobante de pago",
    titulo: "Hola, {nombre}",
    cuerpoBase:
      `Revisamos tu comprobante y no pudimos aprobarlo todavía.`,
    motivo: `<br/><br/><strong>Motivo:</strong> {nota}`,
    cuerpoCola:
      `<br/><br/>Sube de nuevo tu comprobante desde tu cuenta y lo revisamos enseguida.`,
    cta: "Subir comprobante",
  },

  recordatorio: {
    asunto: `Recordatorio: devuelve "{herramienta}" pronto`,
    titulo: "Hola, {nombre}",
    cuerpo:
      `Tu préstamo de <strong>{herramienta}</strong> vence en aproximadamente <strong>{horas} horas</strong>.
       <br/><br/>Devuélvela a tiempo para no generar cargos por retraso ($5/día).`,
    cta: "Ver mis préstamos",
  },

  retraso: {
    asunto: `Tu préstamo de "{herramienta}" está vencido`,
    titulo: "Hola, {nombre}",
    cuerpo:
      `Tu préstamo de <strong>{herramienta}</strong> está vencido por <strong>{dias} día(s)</strong>.
       Se generó un cargo de <strong>\${cargo}</strong>.
       <br/><br/>Por favor devuélvela cuanto antes para evitar cargos adicionales.`,
    cta: "Ver mis préstamos",
  },

  sistema: {
    noAutorizado: "No autorizado",
    noEncontrado: "No encontrado",
    prohibido: "Prohibido",
    archivoNoDisponible: "Archivo no disponible",
  },
} satisfies typeof en;

export const emails = { en, es };
