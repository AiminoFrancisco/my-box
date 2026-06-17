-- ===== supabase/migrations/0001_extensiones.sql =====
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

-- ===== supabase/migrations/0002_tablas_core.sql =====
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

-- ===== supabase/migrations/0003_herramientas_prestamos.sql =====
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

-- ===== supabase/migrations/0004_pagos_cargos_accesos.sql =====
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

-- ===== supabase/migrations/0005_anunciantes.sql =====
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

-- ===== supabase/migrations/0006_storage_buckets.sql =====
-- =====================================================================
-- 0006 · Buckets de Storage + políticas
-- =====================================================================
-- Buckets:
--   identificaciones (privado) · comprobantes (privado)
--   herramientas (público) · anunciantes (público) · qr (público)
-- Convención de rutas privadas: <bucket>/<user_id>/<archivo>
--   así el primer segmento de la ruta identifica al dueño.

insert into storage.buckets (id, name, public)
values
  ('identificaciones', 'identificaciones', false),
  ('comprobantes',     'comprobantes',     false),
  ('herramientas',     'herramientas',     true),
  ('anunciantes',      'anunciantes',      true),
  ('qr',               'qr',               true)
on conflict (id) do nothing;

-- ---------- Buckets públicos: lectura libre, escritura solo admin ----------
do $$
declare b text;
begin
  foreach b in array array['herramientas','anunciantes','qr'] loop
    execute format($f$
      drop policy if exists "lectura publica %1$s" on storage.objects;
      create policy "lectura publica %1$s" on storage.objects
        for select using (bucket_id = %1$L);

      drop policy if exists "admin escribe %1$s" on storage.objects;
      create policy "admin escribe %1$s" on storage.objects
        for insert with check (bucket_id = %1$L and public.es_admin());

      drop policy if exists "admin actualiza %1$s" on storage.objects;
      create policy "admin actualiza %1$s" on storage.objects
        for update using (bucket_id = %1$L and public.es_admin());

      drop policy if exists "admin borra %1$s" on storage.objects;
      create policy "admin borra %1$s" on storage.objects
        for delete using (bucket_id = %1$L and public.es_admin());
    $f$, b);
  end loop;
end $$;

-- ---------- Buckets privados: cada quien sube/ve lo suyo; admin ve todo ----------
do $$
declare b text;
begin
  foreach b in array array['identificaciones','comprobantes'] loop
    execute format($f$
      drop policy if exists "dueño sube %1$s" on storage.objects;
      create policy "dueño sube %1$s" on storage.objects
        for insert with check (
          bucket_id = %1$L
          and (storage.foldername(name))[1] = auth.uid()::text
        );

      drop policy if exists "dueño ve %1$s" on storage.objects;
      create policy "dueño ve %1$s" on storage.objects
        for select using (
          bucket_id = %1$L
          and ((storage.foldername(name))[1] = auth.uid()::text or public.es_admin())
        );

      drop policy if exists "dueño borra %1$s" on storage.objects;
      create policy "dueño borra %1$s" on storage.objects
        for delete using (
          bucket_id = %1$L
          and ((storage.foldername(name))[1] = auth.uid()::text or public.es_admin())
        );
    $f$, b);
  end loop;
end $$;

-- ===== supabase/migrations/0007_funciones_triggers.sql =====
-- =====================================================================
-- 0007 · Funciones de negocio y triggers
-- =====================================================================

-- ---------------------------------------------------------------------
-- Al crear un usuario en auth.users -> crear su perfil automáticamente.
-- Los datos del registro llegan en raw_user_meta_data.
-- ---------------------------------------------------------------------
create or replace function public.manejar_nuevo_usuario()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.perfiles (
    id, nombre_completo, email, telefono, direccion,
    fecha_nacimiento, persona_autorizada_nombre
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nombre_completo', ''),
    new.email,
    new.raw_user_meta_data->>'telefono',
    new.raw_user_meta_data->>'direccion',
    nullif(new.raw_user_meta_data->>'fecha_nacimiento', '')::date,
    new.raw_user_meta_data->>'persona_autorizada_nombre'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.manejar_nuevo_usuario();

-- ---------------------------------------------------------------------
-- Lee un valor numérico de configuracion con fallback.
-- ---------------------------------------------------------------------
create or replace function public.config_num(p_clave text, p_default numeric)
returns numeric
language sql
stable
set search_path = public
as $$
  select coalesce((select nullif(valor, '')::numeric from public.configuracion where clave = p_clave), p_default);
$$;

-- ---------------------------------------------------------------------
-- SACAR herramienta por su qr_token. Valida todo de forma atómica.
-- ---------------------------------------------------------------------
create or replace function public.sacar_herramienta(p_qr_token uuid)
returns public.prestamos
language plpgsql
security definer
set search_path = public
as $$
declare
  v_perfil   public.perfiles;
  v_herr     public.herramientas;
  v_horas    int;
  v_max      int;
  v_activos  int;
  v_prestamo public.prestamos;
begin
  select * into v_perfil from public.perfiles where id = auth.uid();
  if v_perfil.id is null then
    raise exception 'No autenticado';
  end if;
  if v_perfil.estado <> 'activo' then
    raise exception 'Tu membresía no está activa';
  end if;

  select * into v_herr from public.herramientas where qr_token = p_qr_token;
  if v_herr.id is null then
    raise exception 'Herramienta no encontrada';
  end if;
  if v_herr.estado <> 'disponible' then
    raise exception 'La herramienta no está disponible (estado: %)', v_herr.estado;
  end if;

  v_max := public.config_num('max_herramientas', 5)::int;
  select count(*) into v_activos
    from public.prestamos
    where perfil_id = v_perfil.id and estado in ('activo', 'vencido');
  if v_activos >= v_max then
    raise exception 'Ya tienes el máximo de % herramientas activas', v_max;
  end if;

  v_horas := public.config_num('horas_prestamo', 72)::int;

  insert into public.prestamos (herramienta_id, perfil_id, fecha_limite)
  values (v_herr.id, v_perfil.id, now() + (v_horas || ' hours')::interval)
  returning * into v_prestamo;

  update public.herramientas set estado = 'prestada' where id = v_herr.id;

  return v_prestamo;
end;
$$;

-- ---------------------------------------------------------------------
-- DEVOLVER herramienta por su qr_token. Cierra el préstamo del usuario.
-- ---------------------------------------------------------------------
create or replace function public.devolver_herramienta(p_qr_token uuid)
returns public.prestamos
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid      uuid := auth.uid();
  v_herr     public.herramientas;
  v_prestamo public.prestamos;
  v_dias     int;
begin
  select * into v_herr from public.herramientas where qr_token = p_qr_token;
  if v_herr.id is null then
    raise exception 'Herramienta no encontrada';
  end if;

  select * into v_prestamo
    from public.prestamos
    where herramienta_id = v_herr.id
      and perfil_id = v_uid
      and estado in ('activo', 'vencido')
    order by fecha_prestamo desc
    limit 1;
  if v_prestamo.id is null then
    raise exception 'No tienes esta herramienta prestada';
  end if;

  v_dias := greatest(0, ceil(extract(epoch from (now() - v_prestamo.fecha_limite)) / 86400.0)::int);

  update public.prestamos
    set estado = 'devuelto', fecha_devolucion = now(), dias_retraso = v_dias
    where id = v_prestamo.id
    returning * into v_prestamo;

  update public.herramientas set estado = 'disponible' where id = v_herr.id;

  return v_prestamo;
end;
$$;

-- ---------------------------------------------------------------------
-- RECALCULAR vencidos: marca préstamos vencidos y genera/actualiza cargos.
-- $penalidad_diaria/día hasta dias_penalidad_max; luego costo de reemplazo.
-- La llama un cron / route handler periódicamente.
-- ---------------------------------------------------------------------
create or replace function public.recalcular_vencidos()
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pen      numeric := public.config_num('penalidad_diaria', 5);
  v_max_dias int     := public.config_num('dias_penalidad_max', 5)::int;
  r          record;
  v_dias     int;
  v_monto    numeric;
  v_tipo     tipo_cargo;
  v_count    int := 0;
begin
  for r in
    select p.id, p.perfil_id, p.fecha_limite, h.valor_reemplazo
    from public.prestamos p
    join public.herramientas h on h.id = p.herramienta_id
    where p.estado in ('activo', 'vencido')
      and p.fecha_devolucion is null
      and now() > p.fecha_limite
  loop
    v_dias := greatest(1, ceil(extract(epoch from (now() - r.fecha_limite)) / 86400.0)::int);

    update public.prestamos
      set estado = 'vencido', dias_retraso = v_dias, cargo_generado = true
      where id = r.id;

    if v_dias <= v_max_dias then
      v_tipo := 'retraso';
      v_monto := v_dias * v_pen;
    else
      v_tipo := 'reemplazo';
      v_monto := r.valor_reemplazo;
    end if;

    -- Un solo cargo por préstamo: se actualiza si ya existe.
    if exists (select 1 from public.cargos where prestamo_id = r.id and tipo in ('retraso', 'reemplazo')) then
      update public.cargos
        set tipo = v_tipo, monto = v_monto
        where prestamo_id = r.id and tipo in ('retraso', 'reemplazo');
    else
      insert into public.cargos (perfil_id, prestamo_id, tipo, monto, descripcion)
      values (r.perfil_id, r.id, v_tipo, v_monto,
              'Cargo automático por ' || v_tipo);
    end if;

    v_count := v_count + 1;
  end loop;

  return v_count;
end;
$$;

-- Permisos de ejecución
grant execute on function public.sacar_herramienta(uuid)    to authenticated;
grant execute on function public.devolver_herramienta(uuid) to authenticated;
grant execute on function public.recalcular_vencidos()      to authenticated, service_role;
grant execute on function public.config_num(text, numeric)  to authenticated, anon;

-- ===== supabase/migrations/0008_rls_policies.sql =====
-- =====================================================================
-- 0008 · Row Level Security (RLS) y políticas
-- =====================================================================
-- Regla general: un miembro solo ve/edita lo suyo; el admin ve/edita todo.
-- Las operaciones de préstamo pasan por funciones SECURITY DEFINER (0007).

-- Habilitar RLS en todas las tablas
alter table public.perfiles           enable row level security;
alter table public.ubicaciones        enable row level security;
alter table public.configuracion      enable row level security;
alter table public.herramientas       enable row level security;
alter table public.prestamos          enable row level security;
alter table public.identificaciones   enable row level security;
alter table public.comprobantes_pago  enable row level security;
alter table public.cargos             enable row level security;
alter table public.accesos_bodega     enable row level security;
alter table public.anunciantes        enable row level security;

-- ---------------------------------------------------------------------
-- PERFILES
-- ---------------------------------------------------------------------
drop policy if exists "perfil propio o admin lee" on public.perfiles;
create policy "perfil propio o admin lee" on public.perfiles
  for select using (id = auth.uid() or public.es_admin());

drop policy if exists "perfil propio actualiza" on public.perfiles;
create policy "perfil propio actualiza" on public.perfiles
  for update using (id = auth.uid() or public.es_admin());

drop policy if exists "admin inserta perfil" on public.perfiles;
create policy "admin inserta perfil" on public.perfiles
  for insert with check (public.es_admin());

-- Evita que un miembro se auto-promueva (cambie rol/estado).
-- Para no-admins, forzamos rol/estado a sus valores anteriores.
create or replace function public.proteger_perfil()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- auth.uid() null = contexto service_role (seed/admin server); RLS ya
  -- impide que un anónimo llegue hasta acá. Solo blindamos a miembros logueados.
  if auth.uid() is not null and not public.es_admin() then
    new.rol := old.rol;
    new.estado := old.estado;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_proteger_perfil on public.perfiles;
create trigger trg_proteger_perfil
  before update on public.perfiles
  for each row execute function public.proteger_perfil();

-- ---------------------------------------------------------------------
-- UBICACIONES (lectura pública; escritura admin)
-- ---------------------------------------------------------------------
drop policy if exists "ubicaciones lectura publica" on public.ubicaciones;
create policy "ubicaciones lectura publica" on public.ubicaciones
  for select using (true);

drop policy if exists "ubicaciones admin escribe" on public.ubicaciones;
create policy "ubicaciones admin escribe" on public.ubicaciones
  for all using (public.es_admin()) with check (public.es_admin());

-- ---------------------------------------------------------------------
-- CONFIGURACION (claves públicas visibles; codigo_puerta NO es pública)
-- ---------------------------------------------------------------------
drop policy if exists "config lectura" on public.configuracion;
create policy "config lectura" on public.configuracion
  for select using (publica = true or public.es_admin());

drop policy if exists "config admin escribe" on public.configuracion;
create policy "config admin escribe" on public.configuracion
  for all using (public.es_admin()) with check (public.es_admin());

-- ---------------------------------------------------------------------
-- HERRAMIENTAS (catálogo público; escritura admin)
-- ---------------------------------------------------------------------
drop policy if exists "herramientas lectura publica" on public.herramientas;
create policy "herramientas lectura publica" on public.herramientas
  for select using (true);

drop policy if exists "herramientas admin escribe" on public.herramientas;
create policy "herramientas admin escribe" on public.herramientas
  for all using (public.es_admin()) with check (public.es_admin());

-- ---------------------------------------------------------------------
-- PRESTAMOS (miembro ve los suyos; crear/devolver vía funciones)
-- ---------------------------------------------------------------------
drop policy if exists "prestamos propios o admin" on public.prestamos;
create policy "prestamos propios o admin" on public.prestamos
  for select using (perfil_id = auth.uid() or public.es_admin());

drop policy if exists "prestamos admin escribe" on public.prestamos;
create policy "prestamos admin escribe" on public.prestamos
  for all using (public.es_admin()) with check (public.es_admin());

-- ---------------------------------------------------------------------
-- IDENTIFICACIONES (propias; admin lee todo)
-- ---------------------------------------------------------------------
drop policy if exists "identificaciones lee propio o admin" on public.identificaciones;
create policy "identificaciones lee propio o admin" on public.identificaciones
  for select using (perfil_id = auth.uid() or public.es_admin());

drop policy if exists "identificaciones inserta propio" on public.identificaciones;
create policy "identificaciones inserta propio" on public.identificaciones
  for insert with check (perfil_id = auth.uid());

drop policy if exists "identificaciones admin gestiona" on public.identificaciones;
create policy "identificaciones admin gestiona" on public.identificaciones
  for all using (public.es_admin()) with check (public.es_admin());

-- ---------------------------------------------------------------------
-- COMPROBANTES DE PAGO (propios; admin aprueba)
-- ---------------------------------------------------------------------
drop policy if exists "comprobantes lee propio o admin" on public.comprobantes_pago;
create policy "comprobantes lee propio o admin" on public.comprobantes_pago
  for select using (perfil_id = auth.uid() or public.es_admin());

drop policy if exists "comprobantes inserta propio" on public.comprobantes_pago;
create policy "comprobantes inserta propio" on public.comprobantes_pago
  for insert with check (perfil_id = auth.uid());

drop policy if exists "comprobantes admin gestiona" on public.comprobantes_pago;
create policy "comprobantes admin gestiona" on public.comprobantes_pago
  for all using (public.es_admin()) with check (public.es_admin());

-- ---------------------------------------------------------------------
-- CARGOS (miembro ve los suyos; admin gestiona)
-- ---------------------------------------------------------------------
drop policy if exists "cargos lee propio o admin" on public.cargos;
create policy "cargos lee propio o admin" on public.cargos
  for select using (perfil_id = auth.uid() or public.es_admin());

drop policy if exists "cargos admin gestiona" on public.cargos;
create policy "cargos admin gestiona" on public.cargos
  for all using (public.es_admin()) with check (public.es_admin());

-- ---------------------------------------------------------------------
-- ACCESOS A BODEGA (registra el propio si está activo; admin ve todo)
-- ---------------------------------------------------------------------
drop policy if exists "accesos lee propio o admin" on public.accesos_bodega;
create policy "accesos lee propio o admin" on public.accesos_bodega
  for select using (perfil_id = auth.uid() or public.es_admin());

drop policy if exists "accesos inserta propio activo" on public.accesos_bodega;
create policy "accesos inserta propio activo" on public.accesos_bodega
  for insert with check (perfil_id = auth.uid() and public.es_activo());

-- ---------------------------------------------------------------------
-- ANUNCIANTES (público ve los activos; admin gestiona)
-- ---------------------------------------------------------------------
drop policy if exists "anunciantes lectura activos" on public.anunciantes;
create policy "anunciantes lectura activos" on public.anunciantes
  for select using (activo = true or public.es_admin());

drop policy if exists "anunciantes admin escribe" on public.anunciantes;
create policy "anunciantes admin escribe" on public.anunciantes
  for all using (public.es_admin()) with check (public.es_admin());

-- ===== supabase/migrations/0009_recordatorios.sql =====
-- =====================================================================
-- 0009 · Flags anti-duplicado para los mails de préstamos
-- =====================================================================
-- Evitan reenviar el mismo recordatorio/aviso en cada corrida del cron.

alter table public.prestamos
  add column if not exists recordatorio_enviado boolean not null default false,
  add column if not exists aviso_retraso_enviado boolean not null default false;

-- ===== supabase/migrations/0010_trigger_comprobante.sql =====
-- =====================================================================
-- 0010 · Al subir comprobante -> pasar el perfil a "en revisión"
-- =====================================================================
-- Hace el cambio de estado en la BD (atómico, sin depender de la app ni de
-- la llave secreta). Solo afecta a quien estaba en 'pendiente_pago'.

create or replace function public.al_subir_comprobante()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.perfiles
    set estado = 'comprobante_en_revision'
    where id = new.perfil_id and estado = 'pendiente_pago';
  return new;
end;
$$;

drop trigger if exists trg_comprobante_en_revision on public.comprobantes_pago;
create trigger trg_comprobante_en_revision
  after insert on public.comprobantes_pago
  for each row execute function public.al_subir_comprobante();

-- ===== supabase/seed.sql =====
-- =====================================================================
-- SEED (parte 1/2) · Datos estáticos
-- =====================================================================
-- Corré este archivo en el SQL Editor de Supabase ANTES del script TS.
-- Es idempotente (ON CONFLICT). Carga: ubicación, configuración,
-- herramientas y anunciantes.
--
-- La parte 2/2 (usuarios de Auth, perfiles, préstamos, cargos y QR) la
-- crea el script TS:  npm run seed:auth
-- =====================================================================

-- ---------- UBICACIÓN (1 bodega; el modelo soporta varias) ----------
insert into public.ubicaciones (id, nombre, direccion, activa)
values ('11111111-1111-1111-1111-111111111111',
        'Bodega Sahuarita', '123 W Calle Tool, Sahuarita, AZ 85629', true)
on conflict (id) do nothing;

-- ---------- CONFIGURACIÓN (editable desde el admin) ----------
insert into public.configuracion (clave, valor, descripcion, publica) values
  ('banco_nombre',      'Bank of America',         'Banco para transferencia',          true),
  ('banco_routing',     '122000661',               'Routing number',                    true),
  ('banco_cuenta',      '000123456789',            'Número de cuenta',                  true),
  ('zelle_email',       'pagos@myborrowbox.com',   'Email/Zelle para pago',             true),
  ('monto_membresia',   '29.99',                   'Membresía mensual (USD)',           true),
  ('horas_prestamo',    '72',                      'Horas de préstamo',                 true),
  ('max_herramientas',  '5',                       'Máx. herramientas por miembro',     true),
  ('penalidad_diaria',  '5',                       'Penalidad por día de retraso (USD)',true),
  ('dias_penalidad_max','5',                       'Días máx. antes de cobrar reemplazo',true),
  ('codigo_puerta',     '1234',                    'Código del candado de la bodega',   false)
on conflict (clave) do update
  set valor = excluded.valor, descripcion = excluded.descripcion, publica = excluded.publica;

-- ---------- HERRAMIENTAS (20 variadas) ----------
-- qr_token se autogenera; url_qr lo llena el script TS al subir el PNG.
insert into public.herramientas
  (numero_inventario, nombre, descripcion, categoria, condicion, valor_reemplazo, precio, estado, foto_url, ubicacion_id)
values
  ('INV-001','Martillo de uña 16oz','Martillo clásico para clavos y demolición ligera.','Construcción','Buena',25,25,'disponible','https://placehold.co/600x400/2B9FE6/FFFFFF?text=Martillo','11111111-1111-1111-1111-111111111111'),
  ('INV-002','Taladro inalámbrico 20V','Taladro/atornillador con batería de litio y cargador.','Eléctrica','Nueva',120,120,'disponible','https://placehold.co/600x400/0B2A4A/FFFFFF?text=Taladro','11111111-1111-1111-1111-111111111111'),
  ('INV-003','Escalera de tijera 6 ft','Escalera de aluminio, 6 pies, hasta 250 lb.','Construcción','Buena',85,85,'disponible','https://placehold.co/600x400/F5A623/0B2A4A?text=Escalera','11111111-1111-1111-1111-111111111111'),
  ('INV-004','Weed eater (desbrozadora)','Desbrozadora a gasolina para orillas y maleza.','Jardinería','Usada',150,150,'disponible','https://placehold.co/600x400/16A34A/FFFFFF?text=Weed+Eater','11111111-1111-1111-1111-111111111111'),
  ('INV-005','Floor jack (gato hidráulico) 2T','Gato hidráulico de piso, 2 toneladas.','Automotriz','Buena',95,95,'disponible','https://placehold.co/600x400/2B9FE6/FFFFFF?text=Floor+Jack','11111111-1111-1111-1111-111111111111'),
  ('INV-006','Sopladora de hojas','Sopladora eléctrica para hojas y escombros.','Jardinería','Buena',70,70,'disponible','https://placehold.co/600x400/0B2A4A/FFFFFF?text=Sopladora','11111111-1111-1111-1111-111111111111'),
  ('INV-007','Martillo demoledor hidráulico','Rompedora/demoledora para concreto. Herramienta grande.','Construcción','Buena',650,650,'disponible','https://placehold.co/600x400/DC2626/FFFFFF?text=Demoledor','11111111-1111-1111-1111-111111111111'),
  ('INV-008','Sierra circular 7-1/4"','Sierra circular para madera, 15 amp.','Eléctrica','Buena',110,110,'disponible','https://placehold.co/600x400/2B9FE6/FFFFFF?text=Sierra','11111111-1111-1111-1111-111111111111'),
  ('INV-009','Lijadora orbital','Lijadora de acabado para superficies finas.','Eléctrica','Buena',55,55,'disponible','https://placehold.co/600x400/0B2A4A/FFFFFF?text=Lijadora','11111111-1111-1111-1111-111111111111'),
  ('INV-010','Compresor de aire 6 gal','Compresor portátil tipo pancake, 150 psi.','Eléctrica','Buena',180,180,'disponible','https://placehold.co/600x400/F5A623/0B2A4A?text=Compresor','11111111-1111-1111-1111-111111111111'),
  ('INV-011','Generador portátil 3500W','Generador a gasolina para emergencias y obra.','Eléctrica','Buena',450,450,'disponible','https://placehold.co/600x400/16A34A/FFFFFF?text=Generador','11111111-1111-1111-1111-111111111111'),
  ('INV-012','Juego de desarmadores','Set de 20 desarmadores planos y de cruz.','Manual','Nueva',35,35,'disponible','https://placehold.co/600x400/2B9FE6/FFFFFF?text=Desarmadores','11111111-1111-1111-1111-111111111111'),
  ('INV-013','Llave de impacto 1/2"','Llave de impacto eléctrica para tuercas.','Automotriz','Buena',130,130,'disponible','https://placehold.co/600x400/0B2A4A/FFFFFF?text=Impacto','11111111-1111-1111-1111-111111111111'),
  ('INV-014','Cortadora de azulejo','Cortadora manual de cerámica y azulejo.','Construcción','Buena',75,75,'disponible','https://placehold.co/600x400/F5A623/0B2A4A?text=Cortadora','11111111-1111-1111-1111-111111111111'),
  ('INV-015','Escoba industrial','Escoba de cerdas duras para taller/exterior.','Limpieza','Buena',18,18,'disponible','https://placehold.co/600x400/16A34A/FFFFFF?text=Escoba','11111111-1111-1111-1111-111111111111'),
  ('INV-016','Carretilla','Carretilla de una rueda para acarreo.','Construcción','Usada',90,90,'en_reparacion','https://placehold.co/600x400/F59E0B/FFFFFF?text=Carretilla','11111111-1111-1111-1111-111111111111'),
  ('INV-017','Pistola de calor','Pistola de calor para pintura y soldadura.','Eléctrica','Buena',45,45,'disponible','https://placehold.co/600x400/2B9FE6/FFFFFF?text=Pistola+Calor','11111111-1111-1111-1111-111111111111'),
  ('INV-018','Nivel láser','Nivel láser autonivelante de líneas cruzadas.','Medición','Nueva',95,95,'disponible','https://placehold.co/600x400/0B2A4A/FFFFFF?text=Nivel+Laser','11111111-1111-1111-1111-111111111111'),
  ('INV-019','Esmeriladora angular 4-1/2"','Pulidora/esmeriladora para metal y concreto.','Eléctrica','Buena',60,60,'perdida','https://placehold.co/600x400/DC2626/FFFFFF?text=Esmeriladora','11111111-1111-1111-1111-111111111111'),
  ('INV-020','Hidrolavadora 2000 psi','Hidrolavadora eléctrica para limpieza a presión.','Limpieza','Buena',160,160,'disponible','https://placehold.co/600x400/16A34A/FFFFFF?text=Hidrolavadora','11111111-1111-1111-1111-111111111111')
on conflict (numero_inventario) do nothing;

-- ---------- ANUNCIANTES (6, varias categorías) ----------
insert into public.anunciantes (nombre, categoria, logo_url, telefono, sitio_web, descripcion, activo) values
  ('Desert Air HVAC',        'HVAC',         'https://placehold.co/200x200/2B9FE6/FFFFFF?text=HVAC',    '+1 520-555-0101', 'https://desertairhvac.example.com',  'Instalación y reparación de aire acondicionado en Sahuarita y Green Valley.', true),
  ('Sahuarita Roofing Pros', 'Roofing',      'https://placehold.co/200x200/0B2A4A/FFFFFF?text=Roof',    '+1 520-555-0102', 'https://sahuaritaroofing.example.com','Techos nuevos, reparaciones y mantenimiento. Presupuesto gratis.', true),
  ('Green Valley Plumbing',  'Plumbing',     'https://placehold.co/200x200/F5A623/0B2A4A?text=Plumb',   '+1 520-555-0103', 'https://gvplumbing.example.com',     'Plomería residencial 24/7. Fugas, calentadores y drenajes.', true),
  ('Bright Spark Electrical','Electrical',   'https://placehold.co/200x200/16A34A/FFFFFF?text=Elec',    '+1 520-555-0104', 'https://brightspark.example.com',    'Electricistas con licencia. Paneles, cableado y EV chargers.', true),
  ('Sonoran Solar',          'Solar',        'https://placehold.co/200x200/2B9FE6/FFFFFF?text=Solar',   '+1 520-555-0105', 'https://sonoransolar.example.com',   'Paneles solares y baterías. Ahorra en tu recibo de luz.', true),
  ('Blue Wave Pools',        'Pools',        'https://placehold.co/200x200/0B2A4A/FFFFFF?text=Pools',   '+1 520-555-0106', 'https://bluewavepools.example.com',  'Construcción y mantenimiento de albercas en el sur de Tucson.', true),
  ('AZ Garage Doors',        'Garage Doors', 'https://placehold.co/200x200/F5A623/0B2A4A?text=Garage',  '+1 520-555-0107', 'https://azgaragedoors.example.com',  'Reparación e instalación de puertas de cochera y motores.', true)
on conflict (nombre) do nothing;
