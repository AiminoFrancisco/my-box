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
