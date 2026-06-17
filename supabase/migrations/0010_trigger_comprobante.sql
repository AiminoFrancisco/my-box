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
