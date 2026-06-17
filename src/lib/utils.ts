/** Utilidades compartidas: formato de moneda, fechas y cálculo de préstamos. */

/** Formatea un número como dólares (la empresa opera en EE.UU.). */
export function formatoDinero(monto: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(monto);
}

/** Formatea una fecha en español mexicano (ej. "16 jun 2026, 2:30 p.m."). */
export function formatoFecha(fecha: string | Date): string {
  const d = typeof fecha === "string" ? new Date(fecha) : fecha;
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

export type EstadoTemporizador = "verde" | "por_vencer" | "vencido";

/**
 * Calcula el estado y tiempo restante de un préstamo respecto a su fecha límite.
 * - verde: más de 12 h restantes
 * - por_vencer: 12 h o menos
 * - vencido: ya pasó la fecha límite
 */
export function calcularTemporizador(fechaLimite: string | Date, ahora = new Date()) {
  const limite = typeof fechaLimite === "string" ? new Date(fechaLimite) : fechaLimite;
  const msRestantes = limite.getTime() - ahora.getTime();
  const horasRestantes = msRestantes / (1000 * 60 * 60);

  let estado: EstadoTemporizador;
  if (msRestantes <= 0) estado = "vencido";
  else if (horasRestantes <= 12) estado = "por_vencer";
  else estado = "verde";

  const horasAbs = Math.floor(Math.abs(horasRestantes));
  const dias = Math.floor(horasAbs / 24);
  const horas = horasAbs % 24;

  return { estado, msRestantes, horasRestantes, dias, horas };
}

/**
 * Calcula los días de retraso y el cargo generado.
 * - $penalidadDiaria por día, hasta diasMax.
 * - Pasado diasMax: cargo por costo de reemplazo de la herramienta.
 */
export function calcularCargoRetraso(
  diasRetraso: number,
  penalidadDiaria: number,
  diasMax: number,
  valorReemplazo: number
): { tipo: "retraso" | "reemplazo"; monto: number } {
  if (diasRetraso <= 0) return { tipo: "retraso", monto: 0 };
  if (diasRetraso <= diasMax) {
    return { tipo: "retraso", monto: diasRetraso * penalidadDiaria };
  }
  return { tipo: "reemplazo", monto: valorReemplazo };
}

/** Une clases condicionalmente (mini helper tipo clsx). */
export function cn(...clases: Array<string | false | null | undefined>): string {
  return clases.filter(Boolean).join(" ");
}
