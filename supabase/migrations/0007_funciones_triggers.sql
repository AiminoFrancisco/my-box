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
