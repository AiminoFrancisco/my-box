import { crearClienteServidor } from "@/lib/supabase/server";
import type { PrestamoConHerramienta, Cargo } from "@/types/modelos";

/** Préstamos del miembro autenticado (con datos de la herramienta). */
export async function obtenerMisPrestamos(): Promise<PrestamoConHerramienta[]> {
  const supabase = crearClienteServidor();
  const { data } = await supabase
    .from("prestamos")
    .select(
      "*, herramientas(id, nombre, numero_inventario, foto_url, categoria, valor_reemplazo, qr_token)"
    )
    .order("fecha_prestamo", { ascending: false });
  return (data ?? []) as unknown as PrestamoConHerramienta[];
}

/** Cargos del miembro autenticado. */
export async function obtenerMisCargos(): Promise<Cargo[]> {
  const supabase = crearClienteServidor();
  const { data } = await supabase
    .from("cargos")
    .select("*")
    .order("creado_en", { ascending: false });
  return (data ?? []) as unknown as Cargo[];
}

/** Cuenta préstamos activos/vencidos (para el límite de 5). */
export function contarActivos(prestamos: PrestamoConHerramienta[]): number {
  return prestamos.filter((p) => p.estado === "activo" || p.estado === "vencido").length;
}
