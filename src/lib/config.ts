/**
 * Constantes de configuración con valores por defecto.
 *
 * Estos valores son el FALLBACK: la fuente de verdad vive en la tabla
 * `configuracion` de Supabase (editable desde el panel admin). Usá
 * `obtenerConfig()` para leer desde la BD cuando sea posible y caé a estos
 * valores si no hay fila.
 */
export const CONFIG_DEFECTO = {
  // Acceso a la bodega (después se conecta a una cerradura real).
  codigo_puerta: "1234",
  // Membresía y préstamos.
  monto_membresia: 29.99,
  horas_prestamo: 72,
  max_herramientas: 5,
  // Penalidades. El contrato dice $10/día, pero el cliente definió $5/día.
  penalidad_diaria: 5,
  dias_penalidad_max: 5,
  // Datos bancarios de ejemplo (se editan desde el admin).
  banco_nombre: "Bank of America",
  banco_routing: "122000661",
  banco_cuenta: "000123456789",
  zelle_email: "pagos@myborrowbox.com",
} as const;

export type ClaveConfig = keyof typeof CONFIG_DEFECTO;

/** Categorías de anunciantes locales. */
export const CATEGORIAS_ANUNCIANTES = [
  "HVAC",
  "Roofing",
  "Plumbing",
  "Electrical",
  "Solar",
  "Pools",
  "Garage Doors",
] as const;

/** Estados de usuario, con etiqueta en español y color para badges. */
export const ESTADOS_USUARIO = {
  pendiente_pago: { etiqueta: "Pendiente de pago", color: "alerta" },
  comprobante_en_revision: { etiqueta: "En revisión", color: "alerta" },
  activo: { etiqueta: "Activo", color: "exito" },
  suspendido: { etiqueta: "Suspendido", color: "peligro" },
  cancelado: { etiqueta: "Cancelado", color: "peligro" },
} as const;

/** Estados de herramienta. */
export const ESTADOS_HERRAMIENTA = {
  disponible: { etiqueta: "Disponible", color: "exito" },
  prestada: { etiqueta: "Prestada", color: "alerta" },
  en_reparacion: { etiqueta: "En reparación", color: "alerta" },
  perdida: { etiqueta: "Perdida", color: "peligro" },
} as const;
