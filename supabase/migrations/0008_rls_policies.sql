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
