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
