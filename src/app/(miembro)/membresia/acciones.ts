"use server";

import { revalidatePath } from "next/cache";
import { crearClienteServidor } from "@/lib/supabase/server";
import { obtenerConfigPublica } from "@/lib/configuracion";
import { obtenerDic } from "@/lib/i18n/servidor";

export type EstadoComprobanteForm = { error?: string; ok?: boolean };

/** El miembro sube su comprobante de pago y queda "en revisión". */
export async function subirComprobante(
  _prev: EstadoComprobanteForm,
  formData: FormData
): Promise<EstadoComprobanteForm> {
  const dic = obtenerDic();
  const supabase = crearClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: dic.member.comprobanteAccion.sesionExpirada };

  const archivo = formData.get("comprobante") as File | null;
  if (!archivo || archivo.size === 0) return { error: dic.member.comprobanteAccion.seleccionaArchivo };
  if (archivo.size > 10 * 1024 * 1024) return { error: dic.member.comprobanteAccion.archivoGrande };

  const config = await obtenerConfigPublica();
  const monto = Number(config.monto_membresia ?? 29.99);

  // 1) Subir al bucket privado (ruta <userId>/...).
  const ext = (archivo.name.split(".").pop() ?? "jpg").toLowerCase();
  const ruta = `${user.id}/comprobante-${Date.now()}.${ext}`;
  const { error: errUp } = await supabase.storage
    .from("comprobantes")
    .upload(ruta, archivo, { contentType: archivo.type || "image/jpeg", upsert: false });
  if (errUp) return { error: dic.member.comprobanteAccion.errorSubida };

  // 2) Registrar el comprobante (RLS permite insertar el propio).
  //    El trigger `trg_comprobante_en_revision` mueve el perfil a "en revisión".
  const { error: errIns } = await supabase
    .from("comprobantes_pago")
    .insert({ perfil_id: user.id, url_archivo: ruta, monto, estado: "pendiente" });
  if (errIns) return { error: dic.member.comprobanteAccion.errorRegistro };

  revalidatePath("/membresia");
  revalidatePath("/panel");
  return { ok: true };
}
