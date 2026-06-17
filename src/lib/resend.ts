import { Resend } from "resend";

/**
 * Wrapper de envío de mails transaccionales con Resend.
 * Si no hay RESEND_API_KEY (modo dev), loguea el mail en consola en vez de fallar.
 */

const apiKey = process.env.RESEND_API_KEY;
const remitente = process.env.RESEND_FROM ?? "My Borrow Box <onboarding@resend.dev>";

const resend = apiKey ? new Resend(apiKey) : null;

export type ParamsMail = {
  para: string;
  asunto: string;
  html: string;
};

export async function enviarMail({ para, asunto, html }: ParamsMail) {
  if (!resend) {
    // Fallback de desarrollo: no se rompe nada si falta la API key.
    console.log("📧 [DEV — sin RESEND_API_KEY] Mail simulado:");
    console.log(`   Para:    ${para}`);
    console.log(`   Asunto:  ${asunto}`);
    console.log(`   HTML:    ${html.slice(0, 200)}...`);
    return { ok: true, simulado: true as const };
  }

  const { data, error } = await resend.emails.send({
    from: remitente,
    to: para,
    subject: asunto,
    html,
  });

  if (error) {
    console.error("❌ Error enviando mail con Resend:", error);
    return { ok: false as const, error };
  }

  return { ok: true as const, id: data?.id };
}
