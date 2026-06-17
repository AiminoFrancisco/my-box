-- =====================================================================
-- 0001 · Extensiones y tipos (ENUMS)
-- =====================================================================
-- Idempotente: se puede correr varias veces sin error.

create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- Cada enum se envuelve para no fallar si ya existe.
do $$ begin
  create type rol_usuario as enum ('miembro', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type estado_usuario as enum (
    'pendiente_pago', 'comprobante_en_revision', 'activo', 'suspendido', 'cancelado'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type tipo_persona as enum ('titular', 'autorizada');
exception when duplicate_object then null; end $$;

do $$ begin
  create type estado_comprobante as enum ('pendiente', 'aprobado', 'rechazado');
exception when duplicate_object then null; end $$;

do $$ begin
  create type estado_herramienta as enum ('disponible', 'prestada', 'perdida', 'en_reparacion');
exception when duplicate_object then null; end $$;

do $$ begin
  create type estado_prestamo as enum ('activo', 'devuelto', 'vencido');
exception when duplicate_object then null; end $$;

do $$ begin
  create type tipo_cargo as enum ('retraso', 'reemplazo', 'membresia');
exception when duplicate_object then null; end $$;

do $$ begin
  create type estado_cargo as enum ('pendiente', 'pagado');
exception when duplicate_object then null; end $$;

do $$ begin
  create type tipo_acceso as enum ('entrada', 'salida');
exception when duplicate_object then null; end $$;
