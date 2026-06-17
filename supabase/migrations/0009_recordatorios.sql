-- =====================================================================
-- 0009 · Flags anti-duplicado para los mails de préstamos
-- =====================================================================
-- Evitan reenviar el mismo recordatorio/aviso en cada corrida del cron.

alter table public.prestamos
  add column if not exists recordatorio_enviado boolean not null default false,
  add column if not exists aviso_retraso_enviado boolean not null default false;
