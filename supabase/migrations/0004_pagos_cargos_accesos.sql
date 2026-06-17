-- =====================================================================
-- 0004 · Identificaciones, comprobantes de pago, cargos y accesos
-- =====================================================================

-- --- IDENTIFICACIONES (foto de ID del titular y de la persona autorizada) ---
create table if not exists public.identificaciones (
  id            uuid primary key default gen_random_uuid(),
  perfil_id     uuid not null references public.perfiles(id) on delete cascade,
  tipo_persona  tipo_persona not null,
  url_imagen    text not null,
  creado_en     timestamptz not null default now()
);

create index if not exists idx_identificaciones_perfil on public.identificaciones(perfil_id);

-- --- COMPROBANTES DE PAGO (el usuario sube imagen/PDF; admin aprueba) ---
create table if not exists public.comprobantes_pago (
  id            uuid primary key default gen_random_uuid(),
  perfil_id     uuid not null references public.perfiles(id) on delete cascade,
  url_archivo   text not null,
  monto         numeric(10,2) not null default 0,
  estado        estado_comprobante not null default 'pendiente',
  nota_admin    text,
  revisado_por  uuid references public.perfiles(id) on delete set null,
  revisado_en   timestamptz,
  creado_en     timestamptz not null default now()
);

create index if not exists idx_comprobantes_perfil on public.comprobantes_pago(perfil_id);
create index if not exists idx_comprobantes_estado on public.comprobantes_pago(estado);

-- --- CARGOS (membresía, retraso, reemplazo) ---
create table if not exists public.cargos (
  id            uuid primary key default gen_random_uuid(),
  perfil_id     uuid not null references public.perfiles(id) on delete cascade,
  prestamo_id   uuid references public.prestamos(id) on delete set null,
  tipo          tipo_cargo not null,
  monto         numeric(10,2) not null default 0,
  estado        estado_cargo not null default 'pendiente',
  descripcion   text,
  creado_en     timestamptz not null default now()
);

create index if not exists idx_cargos_perfil on public.cargos(perfil_id);
create index if not exists idx_cargos_estado on public.cargos(estado);

-- --- ACCESOS A LA BODEGA (entrada/salida) ---
create table if not exists public.accesos_bodega (
  id            uuid primary key default gen_random_uuid(),
  perfil_id     uuid not null references public.perfiles(id) on delete cascade,
  ubicacion_id  uuid references public.ubicaciones(id) on delete set null,
  tipo          tipo_acceso not null,
  creado_en     timestamptz not null default now()
);

create index if not exists idx_accesos_perfil on public.accesos_bodega(perfil_id);
