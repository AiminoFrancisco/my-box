-- =====================================================================
-- 0005 · Anunciantes locales (espacios pagos en la home)
-- =====================================================================

create table if not exists public.anunciantes (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null unique,
  categoria   text not null,          -- HVAC, Roofing, Plumbing, Electrical, Solar, Pools, Garage Doors
  logo_url    text,
  telefono    text,
  sitio_web   text,
  descripcion text,
  activo      boolean not null default true,
  creado_en   timestamptz not null default now()
);

create index if not exists idx_anunciantes_categoria on public.anunciantes(categoria);
create index if not exists idx_anunciantes_activo on public.anunciantes(activo);
