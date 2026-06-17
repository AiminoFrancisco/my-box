-- =====================================================================
-- 0002 · Tablas core: ubicaciones, configuracion, perfiles + helpers
-- =====================================================================

-- --- Helper: marcar actualizado_en en cada UPDATE ---
create or replace function public.set_actualizado_en()
returns trigger
language plpgsql
as $$
begin
  new.actualizado_en = now();
  return new;
end;
$$;

-- --- UBICACIONES (preparado para múltiples bodegas / franquicias) ---
create table if not exists public.ubicaciones (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  direccion   text,
  activa      boolean not null default true,
  creado_en   timestamptz not null default now()
);

-- --- CONFIGURACION (clave/valor editable desde el admin) ---
create table if not exists public.configuracion (
  clave           text primary key,
  valor           text,
  descripcion     text,
  -- ¿se puede leer sin ser admin? (datos bancarios sí, para el flujo de pago)
  publica         boolean not null default false,
  actualizado_en  timestamptz not null default now()
);

-- --- PERFILES (extiende auth.users) ---
create table if not exists public.perfiles (
  id                          uuid primary key references auth.users(id) on delete cascade,
  nombre_completo             text not null default '',
  direccion                   text,
  telefono                    text,
  email                       text,
  fecha_nacimiento            date,
  rol                         rol_usuario not null default 'miembro',
  estado                      estado_usuario not null default 'pendiente_pago',
  persona_autorizada_nombre   text,
  acepto_contrato             boolean not null default false,
  fecha_aceptacion            timestamptz,
  creado_en                   timestamptz not null default now(),
  actualizado_en              timestamptz not null default now()
);

drop trigger if exists trg_perfiles_actualizado on public.perfiles;
create trigger trg_perfiles_actualizado
  before update on public.perfiles
  for each row execute function public.set_actualizado_en();

-- --- Helpers de autorización (SECURITY DEFINER: saltan RLS sin recursión) ---
create or replace function public.es_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.perfiles
    where id = auth.uid() and rol = 'admin'
  );
$$;

create or replace function public.es_activo()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.perfiles
    where id = auth.uid() and estado = 'activo'
  );
$$;
