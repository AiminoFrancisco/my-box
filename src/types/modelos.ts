/** Tipos de dominio usados en toda la app (alineados con el esquema SQL). */

export type RolUsuario = "miembro" | "admin";

export type EstadoUsuario =
  | "pendiente_pago"
  | "comprobante_en_revision"
  | "activo"
  | "suspendido"
  | "cancelado";

export type EstadoHerramienta = "disponible" | "prestada" | "perdida" | "en_reparacion";
export type EstadoPrestamo = "activo" | "devuelto" | "vencido";
export type TipoCargo = "retraso" | "reemplazo" | "membresia";
export type EstadoCargo = "pendiente" | "pagado";
export type EstadoComprobante = "pendiente" | "aprobado" | "rechazado";
export type TipoPersona = "titular" | "autorizada";

export type Perfil = {
  id: string;
  nombre_completo: string;
  direccion: string | null;
  telefono: string | null;
  email: string | null;
  fecha_nacimiento: string | null;
  rol: RolUsuario;
  estado: EstadoUsuario;
  persona_autorizada_nombre: string | null;
  acepto_contrato: boolean;
  fecha_aceptacion: string | null;
  creado_en: string;
  actualizado_en: string;
};

export type Herramienta = {
  id: string;
  numero_inventario: string;
  nombre: string;
  descripcion: string | null;
  categoria: string | null;
  condicion: string | null;
  valor_reemplazo: number;
  precio: number | null;
  estado: EstadoHerramienta;
  qr_token: string;
  url_qr: string | null;
  foto_url: string | null;
  ubicacion_id: string | null;
  creado_en: string;
  actualizado_en: string;
};

export type Prestamo = {
  id: string;
  herramienta_id: string;
  perfil_id: string;
  fecha_prestamo: string;
  fecha_limite: string;
  fecha_devolucion: string | null;
  estado: EstadoPrestamo;
  dias_retraso: number;
  cargo_generado: boolean;
  creado_en: string;
};

export type PrestamoConHerramienta = Prestamo & {
  herramientas: Pick<
    Herramienta,
    "id" | "nombre" | "numero_inventario" | "foto_url" | "categoria" | "valor_reemplazo" | "qr_token"
  > | null;
};

export type Cargo = {
  id: string;
  perfil_id: string;
  prestamo_id: string | null;
  tipo: TipoCargo;
  monto: number;
  estado: EstadoCargo;
  descripcion: string | null;
  creado_en: string;
};

export type ComprobantePago = {
  id: string;
  perfil_id: string;
  url_archivo: string;
  monto: number;
  estado: EstadoComprobante;
  nota_admin: string | null;
  revisado_por: string | null;
  revisado_en: string | null;
  creado_en: string;
};

export type Anunciante = {
  id: string;
  nombre: string;
  categoria: string;
  logo_url: string | null;
  telefono: string | null;
  sitio_web: string | null;
  descripcion: string | null;
  activo: boolean;
  creado_en: string;
};
