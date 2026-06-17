import { crearClienteAdmin } from "@/lib/supabase/admin";

/**
 * Helpers de datos para el panel admin.
 * Usan el cliente con llave secreta (el layout ya verificó rol=admin),
 * así ven todo sin depender de RLS.
 */

export async function obtenerMetricasAdmin() {
  const admin = crearClienteAdmin();
  const inicioMes = new Date();
  inicioMes.setDate(1);
  inicioMes.setHours(0, 0, 0, 0);

  const [activos, prestadas, comprobantes, cargosMes] = await Promise.all([
    admin.from("perfiles").select("*", { count: "exact", head: true }).eq("estado", "activo"),
    admin.from("herramientas").select("*", { count: "exact", head: true }).eq("estado", "prestada"),
    admin.from("comprobantes_pago").select("*", { count: "exact", head: true }).eq("estado", "pendiente"),
    admin.from("cargos").select("monto, estado, creado_en").eq("estado", "pagado").gte("creado_en", inicioMes.toISOString()),
  ]);

  const ingresosMes = ((cargosMes.data ?? []) as { monto: number }[]).reduce(
    (s, c) => s + Number(c.monto),
    0
  );

  return {
    miembrosActivos: activos.count ?? 0,
    herramientasPrestadas: prestadas.count ?? 0,
    comprobantesPendientes: comprobantes.count ?? 0,
    ingresosMes,
  };
}

/** Cuenta de comprobantes pendientes (para el badge del nav). */
export async function contarComprobantesPendientes(): Promise<number> {
  try {
    const admin = crearClienteAdmin();
    const { count } = await admin
      .from("comprobantes_pago")
      .select("*", { count: "exact", head: true })
      .eq("estado", "pendiente");
    return count ?? 0;
  } catch {
    return 0;
  }
}
