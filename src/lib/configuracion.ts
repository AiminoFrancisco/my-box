import { crearClienteServidor } from "@/lib/supabase/server";
import { crearClienteAdmin } from "@/lib/supabase/admin";
import { CONFIG_DEFECTO } from "@/lib/config";

/**
 * Lee la configuración pública (datos bancarios, montos) desde la tabla
 * `configuracion`. Cae a los valores por defecto si la BD no responde.
 */
export async function obtenerConfigPublica(): Promise<Record<string, string>> {
  const base: Record<string, string> = Object.fromEntries(
    Object.entries(CONFIG_DEFECTO).map(([k, v]) => [k, String(v)])
  );
  try {
    const supabase = crearClienteServidor();
    const { data } = await supabase.from("configuracion").select("clave, valor");
    for (const fila of (data ?? []) as { clave: string; valor: string }[]) {
      if (fila.valor != null) base[fila.clave] = fila.valor;
    }
  } catch {
    /* usa defaults */
  }
  return base;
}

/**
 * Devuelve el código de la puerta SOLO si el usuario está activo.
 * Usa el cliente admin para leer la clave (que no es pública) tras validar estado.
 */
export async function obtenerCodigoPuerta(perfilId: string): Promise<string | null> {
  try {
    const admin = crearClienteAdmin();
    const { data: perfil } = await admin
      .from("perfiles")
      .select("estado")
      .eq("id", perfilId)
      .single();
    if (perfil?.estado !== "activo") return null;

    const { data } = await admin
      .from("configuracion")
      .select("valor")
      .eq("clave", "codigo_puerta")
      .single();
    return data?.valor ?? CONFIG_DEFECTO.codigo_puerta;
  } catch {
    return null;
  }
}
