"use server";

import { revalidatePath } from "next/cache";
import { crearClienteServidor } from "@/lib/supabase/server";
import { obtenerDic } from "@/lib/i18n/servidor";

export type ResultadoAccion = { ok?: boolean; error?: string; mensaje?: string };

/** Normaliza un valor escaneado: acepta el token suelto o una URL con ?token=. */
function extraerToken(entrada: string): string {
  const v = entrada.trim();
  try {
    const url = new URL(v);
    return url.searchParams.get("token") ?? v;
  } catch {
    return v;
  }
}

export type HerramientaEscaneada = {
  nombre: string;
  numero_inventario: string;
  foto_url: string | null;
  categoria: string | null;
  descripcion: string | null;
  valor_reemplazo: number;
  estado: "disponible" | "prestada" | "perdida" | "en_reparacion";
  qr_token: string;
};

/** Busca la info de una herramienta por su QR (para mostrarla antes de confirmar). */
export async function buscarHerramienta(
  qr: string
): Promise<{ herramienta?: HerramientaEscaneada; error?: string }> {
  const dic = obtenerDic();
  const token = extraerToken(qr);
  if (!token) return { error: dic.member.acciones.qrInvalido };

  const supabase = crearClienteServidor();
  const { data, error } = await supabase
    .from("herramientas")
    .select("nombre, numero_inventario, foto_url, categoria, descripcion, valor_reemplazo, estado, qr_token")
    .eq("qr_token", token)
    .single();

  if (error || !data) return { error: dic.member.acciones.herramientaNoEncontrada };
  return { herramienta: data as unknown as HerramientaEscaneada };
}

/** Saca una herramienta por su QR (token). Llama a la función SQL atómica. */
export async function sacarHerramienta(qr: string): Promise<ResultadoAccion> {
  const dic = obtenerDic();
  const token = extraerToken(qr);
  if (!token) return { error: dic.member.acciones.qrInvalido };

  const supabase = crearClienteServidor();
  const { error } = await supabase.rpc("sacar_herramienta", { p_qr_token: token });

  if (error) return { error: traducirError(error.message) };

  revalidatePath("/mis-prestamos");
  revalidatePath("/herramientas");
  revalidatePath("/panel");
  return { ok: true, mensaje: dic.member.acciones.sacarOk };
}

/** Devuelve una herramienta por su QR (token). */
export async function devolverHerramienta(qr: string): Promise<ResultadoAccion> {
  const dic = obtenerDic();
  const token = extraerToken(qr);
  if (!token) return { error: dic.member.acciones.qrInvalido };

  const supabase = crearClienteServidor();
  const { error } = await supabase.rpc("devolver_herramienta", { p_qr_token: token });

  if (error) return { error: traducirError(error.message) };

  revalidatePath("/mis-prestamos");
  revalidatePath("/herramientas");
  revalidatePath("/panel");
  return { ok: true, mensaje: dic.member.acciones.devolverOk };
}

/** Registra entrada o salida de la bodega (solo miembros activos por RLS). */
export async function registrarAcceso(tipo: "entrada" | "salida"): Promise<ResultadoAccion> {
  const dic = obtenerDic();
  const supabase = crearClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: dic.member.acciones.sesionExpirada };

  const { error } = await supabase.from("accesos_bodega").insert({ perfil_id: user.id, tipo });
  if (error) return { error: dic.member.acciones.accesoError };

  revalidatePath("/bodega");
  return { ok: true, mensaje: tipo === "entrada" ? dic.member.acciones.entradaRegistrada : dic.member.acciones.salidaRegistrada };
}

/** Traduce mensajes técnicos de Postgres a un texto claro en el idioma activo. */
function traducirError(msg: string): string {
  const dic = obtenerDic();
  if (/no está activa/i.test(msg)) return dic.member.acciones.errores.noActiva;
  if (/no encontrada/i.test(msg)) return dic.member.acciones.herramientaNoEncontrada;
  if (/no está disponible/i.test(msg)) return dic.member.acciones.errores.noDisponible;
  if (/máximo/i.test(msg)) return dic.member.acciones.errores.maximo;
  if (/no tienes esta herramienta/i.test(msg)) return dic.member.acciones.errores.noTienes;
  return dic.member.acciones.errores.generico;
}
