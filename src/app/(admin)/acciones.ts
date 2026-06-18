"use server";

import { revalidatePath } from "next/cache";
import { crearClienteServidor } from "@/lib/supabase/server";
import { crearClienteAdmin } from "@/lib/supabase/admin";
import { generarYSubirQR } from "@/lib/qr";
import { subirImagenHerramienta } from "@/lib/imagenes";
import { enviarMail } from "@/lib/resend";
import { mailComprobanteAprobado, mailComprobanteRechazado } from "@/lib/plantillas-mail";
import { obtenerDic } from "@/lib/i18n/servidor";
import type { EstadoUsuario } from "@/types/modelos";

export type Resp = { ok?: boolean; error?: string };

/** Verifica que quien llama sea admin. Devuelve el cliente admin. */
async function exigirAdmin() {
  const dic = obtenerDic();
  const supabase = crearClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error(dic.admin.acciones.noAutenticado);
  const admin = crearClienteAdmin();
  const { data } = await admin.from("perfiles").select("rol").eq("id", user.id).single();
  if (data?.rol !== "admin") throw new Error(dic.admin.acciones.noAutorizado);
  return { admin, userId: user.id };
}

// ------------------------- Comprobantes -------------------------

export async function aprobarComprobante(comprobanteId: string): Promise<Resp> {
  try {
    const dic = obtenerDic();
    const { admin, userId } = await exigirAdmin();

    const { data: comp } = await admin
      .from("comprobantes_pago")
      .select("id, perfil_id, monto")
      .eq("id", comprobanteId)
      .single();
    if (!comp) return { error: dic.admin.acciones.comprobanteNoEncontrado };

    await admin
      .from("comprobantes_pago")
      .update({ estado: "aprobado", revisado_por: userId, revisado_en: new Date().toISOString() })
      .eq("id", comprobanteId);

    await admin.from("perfiles").update({ estado: "activo" }).eq("id", comp.perfil_id);

    // Registra el ingreso de la membresía.
    await admin.from("cargos").insert({
      perfil_id: comp.perfil_id,
      tipo: "membresia",
      monto: comp.monto,
      estado: "pagado",
      descripcion: dic.admin.acciones.descripcionMembresia,
    });

    // Mail de aprobación.
    const { data: perfil } = await admin
      .from("perfiles")
      .select("nombre_completo, email")
      .eq("id", comp.perfil_id)
      .single();
    if (perfil?.email) {
      const m = mailComprobanteAprobado(perfil.nombre_completo?.split(" ")[0] ?? "miembro");
      await enviarMail({ para: perfil.email, asunto: m.asunto, html: m.html });
    }

    revalidatePath("/admin/comprobantes");
    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function rechazarComprobante(comprobanteId: string, nota: string): Promise<Resp> {
  try {
    const dic = obtenerDic();
    const { admin, userId } = await exigirAdmin();

    const { data: comp } = await admin
      .from("comprobantes_pago")
      .select("perfil_id")
      .eq("id", comprobanteId)
      .single();
    if (!comp) return { error: dic.admin.acciones.comprobanteNoEncontrado };

    await admin
      .from("comprobantes_pago")
      .update({ estado: "rechazado", nota_admin: nota, revisado_por: userId, revisado_en: new Date().toISOString() })
      .eq("id", comprobanteId);

    // Vuelve a pendiente de pago para que suba otro.
    await admin
      .from("perfiles")
      .update({ estado: "pendiente_pago" })
      .eq("id", comp.perfil_id)
      .eq("estado", "comprobante_en_revision");

    const { data: perfil } = await admin
      .from("perfiles")
      .select("nombre_completo, email")
      .eq("id", comp.perfil_id)
      .single();
    if (perfil?.email) {
      const m = mailComprobanteRechazado(perfil.nombre_completo?.split(" ")[0] ?? "miembro", nota);
      await enviarMail({ para: perfil.email, asunto: m.asunto, html: m.html });
    }

    revalidatePath("/admin/comprobantes");
    return { ok: true };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

// ------------------------- Miembros -------------------------

export async function cambiarEstadoMiembro(perfilId: string, estado: EstadoUsuario): Promise<Resp> {
  try {
    const { admin } = await exigirAdmin();
    await admin.from("perfiles").update({ estado }).eq("id", perfilId);
    revalidatePath("/admin/miembros");
    revalidatePath(`/admin/miembros/${perfilId}`);
    return { ok: true };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

// ------------------------- Herramientas -------------------------

export async function crearHerramienta(formData: FormData): Promise<Resp> {
  try {
    const { admin } = await exigirAdmin();

    const fila = {
      numero_inventario: String(formData.get("numero_inventario") ?? "").trim(),
      nombre: String(formData.get("nombre") ?? "").trim(),
      descripcion: String(formData.get("descripcion") ?? "").trim() || null,
      categoria: String(formData.get("categoria") ?? "").trim() || null,
      condicion: String(formData.get("condicion") ?? "").trim() || null,
      valor_reemplazo: Number(formData.get("valor_reemplazo") ?? 0),
      precio: Number(formData.get("precio") ?? 0),
      estado: String(formData.get("estado") ?? "disponible"),
      foto_url: String(formData.get("foto_url") ?? "").trim() || null,
    };
    if (!fila.numero_inventario || !fila.nombre) return { error: obtenerDic().admin.acciones.inventarioNombreObligatorios };

    // Si subieron una imagen (arrastrada o seleccionada), la guardamos y usamos su URL.
    const foto = formData.get("foto_archivo") as File | null;
    if (foto && foto.size > 0) {
      const url = await subirImagenHerramienta(foto, fila.numero_inventario);
      if (url) fila.foto_url = url;
    }

    const { data: creada, error } = await admin.from("herramientas").insert(fila).select("id, numero_inventario, qr_token").single();
    if (error || !creada) return { error: obtenerDic().admin.acciones.noSePudoCrear };

    // Genera y guarda el QR.
    const urlQr = await generarYSubirQR(creada.numero_inventario, creada.qr_token);
    if (urlQr) await admin.from("herramientas").update({ url_qr: urlQr }).eq("id", creada.id);

    revalidatePath("/admin/herramientas");
    return { ok: true };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function actualizarHerramienta(id: string, formData: FormData): Promise<Resp> {
  try {
    const { admin } = await exigirAdmin();
    const cambios: Record<string, unknown> = {
      nombre: String(formData.get("nombre") ?? "").trim(),
      descripcion: String(formData.get("descripcion") ?? "").trim() || null,
      categoria: String(formData.get("categoria") ?? "").trim() || null,
      condicion: String(formData.get("condicion") ?? "").trim() || null,
      valor_reemplazo: Number(formData.get("valor_reemplazo") ?? 0),
      precio: Number(formData.get("precio") ?? 0),
      estado: String(formData.get("estado") ?? "disponible"),
    };

    const foto = formData.get("foto_archivo") as File | null;
    const fotoUrlTexto = String(formData.get("foto_url") ?? "").trim();
    if (foto && foto.size > 0) {
      const url = await subirImagenHerramienta(foto, id);
      if (url) cambios.foto_url = url;
    } else if (fotoUrlTexto) {
      cambios.foto_url = fotoUrlTexto;
    }

    await admin.from("herramientas").update(cambios).eq("id", id);
    revalidatePath("/admin/herramientas");
    return { ok: true };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function eliminarHerramienta(id: string): Promise<Resp> {
  try {
    const { admin } = await exigirAdmin();
    const { error } = await admin.from("herramientas").delete().eq("id", id);
    if (error) return { error: obtenerDic().admin.acciones.noSePudoEliminarHerramienta };
    revalidatePath("/admin/herramientas");
    return { ok: true };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

// ------------------------- Configuración -------------------------

export async function guardarConfiguracion(formData: FormData): Promise<Resp> {
  try {
    const { admin } = await exigirAdmin();
    const claves = [
      "banco_nombre", "banco_routing", "banco_cuenta", "zelle_email",
      "monto_membresia", "penalidad_diaria", "dias_penalidad_max",
      "max_herramientas", "horas_prestamo", "codigo_puerta",
    ];
    for (const clave of claves) {
      const valor = formData.get(clave);
      if (valor !== null) {
        await admin.from("configuracion").update({ valor: String(valor), actualizado_en: new Date().toISOString() }).eq("clave", clave);
      }
    }
    revalidatePath("/admin/configuracion");
    return { ok: true };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

// ------------------------- Anunciantes -------------------------

export async function guardarAnunciante(id: string | null, formData: FormData): Promise<Resp> {
  try {
    const { admin } = await exigirAdmin();
    const fila = {
      nombre: String(formData.get("nombre") ?? "").trim(),
      categoria: String(formData.get("categoria") ?? "").trim(),
      logo_url: String(formData.get("logo_url") ?? "").trim() || null,
      telefono: String(formData.get("telefono") ?? "").trim() || null,
      sitio_web: String(formData.get("sitio_web") ?? "").trim() || null,
      descripcion: String(formData.get("descripcion") ?? "").trim() || null,
      activo: formData.get("activo") === "on" || formData.get("activo") === "true",
    };
    if (!fila.nombre || !fila.categoria) return { error: obtenerDic().admin.acciones.nombreCategoriaObligatorios };

    if (id) await admin.from("anunciantes").update(fila).eq("id", id);
    else await admin.from("anunciantes").insert(fila);

    revalidatePath("/admin/anunciantes");
    return { ok: true };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function eliminarAnunciante(id: string): Promise<Resp> {
  try {
    const { admin } = await exigirAdmin();
    await admin.from("anunciantes").delete().eq("id", id);
    revalidatePath("/admin/anunciantes");
    return { ok: true };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

// ------------------------- Pagos / cargos -------------------------

export async function alternarCargoPagado(id: string, pagado: boolean): Promise<Resp> {
  try {
    const { admin } = await exigirAdmin();
    await admin.from("cargos").update({ estado: pagado ? "pagado" : "pendiente" }).eq("id", id);
    revalidatePath("/admin/pagos");
    return { ok: true };
  } catch (e) {
    return { error: (e as Error).message };
  }
}
