import { NextResponse, type NextRequest } from "next/server";
import { crearClienteAdmin } from "@/lib/supabase/admin";
import { enviarMail } from "@/lib/resend";
import { mailRecordatorioVencimiento, mailAvisoRetraso } from "@/lib/plantillas-mail";
import { CONFIG_DEFECTO } from "@/lib/config";

/**
 * Job periódico (cron) que:
 *  1. Marca préstamos vencidos y genera/actualiza sus cargos (recalcular_vencidos).
 *  2. Envía recordatorio a quienes les quedan <= 12 h.
 *  3. Envía aviso de retraso a los recién vencidos.
 *
 * Protección opcional: si defines CRON_SECRET, hay que pasar
 *   Authorization: Bearer <CRON_SECRET>  (o ?secret=<CRON_SECRET>).
 *
 * Configúralo en Vercel Cron, Supabase Scheduled Functions, etc.
 */
export const dynamic = "force-dynamic";

async function manejar(request: NextRequest) {
  const secreto = process.env.CRON_SECRET;
  if (secreto) {
    const auth = request.headers.get("authorization");
    const qs = new URL(request.url).searchParams.get("secret");
    if (auth !== `Bearer ${secreto}` && qs !== secreto) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
  }

  const admin = crearClienteAdmin();

  // 1) Recalcular vencidos (marca estado + genera cargos).
  const { data: nVencidos } = await admin.rpc("recalcular_vencidos");

  // Config de penalidades.
  const { data: cfg } = await admin.from("configuracion").select("clave, valor");
  const mapa: Record<string, string> = {};
  for (const f of (cfg ?? []) as { clave: string; valor: string }[]) mapa[f.clave] = f.valor;
  const pen = Number(mapa.penalidad_diaria ?? CONFIG_DEFECTO.penalidad_diaria);
  const diasMax = Number(mapa.dias_penalidad_max ?? CONFIG_DEFECTO.dias_penalidad_max);

  // 2 y 3) Recorrer préstamos abiertos.
  const { data: prestamos } = await admin
    .from("prestamos")
    .select("id, fecha_limite, estado, dias_retraso, recordatorio_enviado, aviso_retraso_enviado, herramientas(nombre, valor_reemplazo), perfiles(nombre_completo, email)")
    .is("fecha_devolucion", null)
    .in("estado", ["activo", "vencido"]);

  const ahora = Date.now();
  let recordatorios = 0;
  let avisos = 0;

  for (const p of (prestamos ?? []) as any[]) {
    const email = p.perfiles?.email;
    const nombre = p.perfiles?.nombre_completo?.split(" ")[0] ?? "miembro";
    const herr = p.herramientas?.nombre ?? "tu herramienta";
    if (!email) continue;

    const msRestante = new Date(p.fecha_limite).getTime() - ahora;
    const horasRestante = msRestante / 3_600_000;

    // Recordatorio: quedan entre 0 y 12 h, aún activo, no enviado.
    if (p.estado === "activo" && horasRestante > 0 && horasRestante <= 12 && !p.recordatorio_enviado) {
      const m = mailRecordatorioVencimiento(nombre, herr, Math.ceil(horasRestante));
      await enviarMail({ para: email, asunto: m.asunto, html: m.html });
      await admin.from("prestamos").update({ recordatorio_enviado: true }).eq("id", p.id);
      recordatorios++;
    }

    // Aviso de retraso: vencido y no avisado.
    if (p.estado === "vencido" && !p.aviso_retraso_enviado) {
      const dias = p.dias_retraso || Math.max(1, Math.ceil(-horasRestante / 24));
      const monto = dias <= diasMax ? dias * pen : Number(p.herramientas?.valor_reemplazo ?? 0);
      const m = mailAvisoRetraso(nombre, herr, dias, monto);
      await enviarMail({ para: email, asunto: m.asunto, html: m.html });
      await admin.from("prestamos").update({ aviso_retraso_enviado: true }).eq("id", p.id);
      avisos++;
    }
  }

  return NextResponse.json({
    ok: true,
    vencidos_recalculados: nVencidos ?? 0,
    recordatorios_enviados: recordatorios,
    avisos_enviados: avisos,
  });
}

export async function GET(request: NextRequest) {
  return manejar(request);
}
export async function POST(request: NextRequest) {
  return manejar(request);
}
