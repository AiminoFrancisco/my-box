-- =====================================================================
-- 0003 · Herramientas y préstamos
-- =====================================================================

create table if not exists public.herramientas (
  id                uuid primary key default gen_random_uuid(),
  numero_inventario text unique not null,
  nombre            text not null,
  descripcion       text,
  categoria         text,
  condicion         text,                          -- "Nueva", "Buena", "Usada"...
  valor_reemplazo   numeric(10,2) not null default 0,
  precio            numeric(10,2) default 0,        -- costo/valor de referencia
  estado            estado_herramienta not null default 'disponible',
  qr_token          uuid unique not null default gen_random_uuid(),
  url_qr            text,                           -- imagen del QR en Storage
  foto_url          text,
  ubicacion_id      uuid references public.ubicaciones(id) on delete set null,
  creado_en         timestamptz not null default now(),
  actualizado_en    timestamptz not null default now()
);

create index if not exists idx_herramientas_estado on public.herramientas(estado);
create index if not exists idx_herramientas_categoria on public.herramientas(categoria);

drop trigger if exists trg_herramientas_actualizado on public.herramientas;
create trigger trg_herramientas_actualizado
  before update on public.herramientas
  for each row execute function public.set_actualizado_en();

create table if not exists public.prestamos (
  id                uuid primary key default gen_random_uuid(),
  herramienta_id    uuid not null references public.herramientas(id) on delete cascade,
  perfil_id         uuid not null references public.perfiles(id) on delete cascade,
  fecha_prestamo    timestamptz not null default now(),
  fecha_limite      timestamptz not null,           -- = fecha_prestamo + 72h
  fecha_devolucion  timestamptz,
  estado            estado_prestamo not null default 'activo',
  dias_retraso      int not null default 0,
  cargo_generado    boolean not null default false,
  creado_en         timestamptz not null default now()
);

create index if not exists idx_prestamos_perfil on public.prestamos(perfil_id);
create index if not exists idx_prestamos_herramienta on public.prestamos(herramienta_id);
create index if not exists idx_prestamos_estado on public.prestamos(estado);
