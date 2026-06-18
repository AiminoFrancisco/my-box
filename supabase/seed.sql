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
  ('INV-001','16 oz Claw Hammer','Classic hammer for nails and light demolition.','Construction','Good',25,25,'disponible','https://placehold.co/600x400/2B9FE6/FFFFFF?text=Claw+Hammer','11111111-1111-1111-1111-111111111111'),
  ('INV-002','20V Cordless Drill','Drill/driver with a lithium battery and charger.','Power tools','New',120,120,'disponible','https://placehold.co/600x400/0B2A4A/FFFFFF?text=Drill','11111111-1111-1111-1111-111111111111'),
  ('INV-003','6 ft Step Ladder','Aluminum ladder, 6 ft, holds up to 250 lb.','Construction','Good',85,85,'disponible','https://placehold.co/600x400/F5A623/0B2A4A?text=Ladder','11111111-1111-1111-1111-111111111111'),
  ('INV-004','Weed Eater (String Trimmer)','Gas-powered trimmer for edges and weeds.','Lawn & Garden','Used',150,150,'disponible','https://placehold.co/600x400/16A34A/FFFFFF?text=Weed+Eater','11111111-1111-1111-1111-111111111111'),
  ('INV-005','2-Ton Floor Jack','Hydraulic floor jack, 2 tons.','Automotive','Good',95,95,'disponible','https://placehold.co/600x400/2B9FE6/FFFFFF?text=Floor+Jack','11111111-1111-1111-1111-111111111111'),
  ('INV-006','Leaf Blower','Electric blower for leaves and debris.','Lawn & Garden','Good',70,70,'disponible','https://placehold.co/600x400/0B2A4A/FFFFFF?text=Leaf+Blower','11111111-1111-1111-1111-111111111111'),
  ('INV-007','Hydraulic Demolition Hammer','Breaker/demolition hammer for concrete. Large tool.','Construction','Good',650,650,'disponible','https://placehold.co/600x400/DC2626/FFFFFF?text=Demo+Hammer','11111111-1111-1111-1111-111111111111'),
  ('INV-008','7-1/4" Circular Saw','Circular saw for wood, 15 amp.','Power tools','Good',110,110,'disponible','https://placehold.co/600x400/2B9FE6/FFFFFF?text=Circular+Saw','11111111-1111-1111-1111-111111111111'),
  ('INV-009','Orbital Sander','Finishing sander for smooth surfaces.','Power tools','Good',55,55,'disponible','https://placehold.co/600x400/0B2A4A/FFFFFF?text=Sander','11111111-1111-1111-1111-111111111111'),
  ('INV-010','6 gal Air Compressor','Portable pancake compressor, 150 psi.','Power tools','Good',180,180,'disponible','https://placehold.co/600x400/F5A623/0B2A4A?text=Compressor','11111111-1111-1111-1111-111111111111'),
  ('INV-011','3500W Portable Generator','Gas generator for emergencies and job sites.','Power tools','Good',450,450,'disponible','https://placehold.co/600x400/16A34A/FFFFFF?text=Generator','11111111-1111-1111-1111-111111111111'),
  ('INV-012','Screwdriver Set','Set of 20 flathead and Phillips screwdrivers.','Hand tools','New',35,35,'disponible','https://placehold.co/600x400/2B9FE6/FFFFFF?text=Screwdrivers','11111111-1111-1111-1111-111111111111'),
  ('INV-013','1/2" Impact Wrench','Electric impact wrench for lug nuts.','Automotive','Good',130,130,'disponible','https://placehold.co/600x400/0B2A4A/FFFFFF?text=Impact+Wrench','11111111-1111-1111-1111-111111111111'),
  ('INV-014','Tile Cutter','Manual cutter for ceramic and tile.','Construction','Good',75,75,'disponible','https://placehold.co/600x400/F5A623/0B2A4A?text=Tile+Cutter','11111111-1111-1111-1111-111111111111'),
  ('INV-015','Heavy-Duty Push Broom','Stiff-bristle broom for shop or outdoor use.','Cleaning','Good',18,18,'disponible','https://placehold.co/600x400/16A34A/FFFFFF?text=Push+Broom','11111111-1111-1111-1111-111111111111'),
  ('INV-016','Wheelbarrow','Single-wheel wheelbarrow for hauling.','Construction','Used',90,90,'en_reparacion','https://placehold.co/600x400/F59E0B/FFFFFF?text=Wheelbarrow','11111111-1111-1111-1111-111111111111'),
  ('INV-017','Heat Gun','Heat gun for paint stripping and soldering.','Power tools','Good',45,45,'disponible','https://placehold.co/600x400/2B9FE6/FFFFFF?text=Heat+Gun','11111111-1111-1111-1111-111111111111'),
  ('INV-018','Laser Level','Self-leveling cross-line laser level.','Measuring','New',95,95,'disponible','https://placehold.co/600x400/0B2A4A/FFFFFF?text=Laser+Level','11111111-1111-1111-1111-111111111111'),
  ('INV-019','4-1/2" Angle Grinder','Grinder for metal and concrete.','Power tools','Good',60,60,'perdida','https://placehold.co/600x400/DC2626/FFFFFF?text=Angle+Grinder','11111111-1111-1111-1111-111111111111'),
  ('INV-020','2000 psi Pressure Washer','Electric pressure washer for cleaning.','Cleaning','Good',160,160,'disponible','https://placehold.co/600x400/16A34A/FFFFFF?text=Pressure+Washer','11111111-1111-1111-1111-111111111111')
on conflict (numero_inventario) do nothing;

-- ---------- ANUNCIANTES (6, varias categorías) ----------
insert into public.anunciantes (nombre, categoria, logo_url, telefono, sitio_web, descripcion, activo) values
  ('Desert Air HVAC',        'HVAC',         'https://placehold.co/200x200/2B9FE6/FFFFFF?text=HVAC',    '+1 520-555-0101', 'https://desertairhvac.example.com',  'AC installation and repair in Sahuarita and Green Valley.', true),
  ('Sahuarita Roofing Pros', 'Roofing',      'https://placehold.co/200x200/0B2A4A/FFFFFF?text=Roof',    '+1 520-555-0102', 'https://sahuaritaroofing.example.com','New roofs, repairs, and maintenance. Free estimates.', true),
  ('Green Valley Plumbing',  'Plumbing',     'https://placehold.co/200x200/F5A623/0B2A4A?text=Plumb',   '+1 520-555-0103', 'https://gvplumbing.example.com',     '24/7 residential plumbing. Leaks, water heaters, and drains.', true),
  ('Bright Spark Electrical','Electrical',   'https://placehold.co/200x200/16A34A/FFFFFF?text=Elec',    '+1 520-555-0104', 'https://brightspark.example.com',    'Licensed electricians. Panels, wiring, and EV chargers.', true),
  ('Sonoran Solar',          'Solar',        'https://placehold.co/200x200/2B9FE6/FFFFFF?text=Solar',   '+1 520-555-0105', 'https://sonoransolar.example.com',   'Solar panels and batteries. Save on your electric bill.', true),
  ('Blue Wave Pools',        'Pools',        'https://placehold.co/200x200/0B2A4A/FFFFFF?text=Pools',   '+1 520-555-0106', 'https://bluewavepools.example.com',  'Pool construction and maintenance in south Tucson.', true),
  ('AZ Garage Doors',        'Garage Doors', 'https://placehold.co/200x200/F5A623/0B2A4A?text=Garage',  '+1 520-555-0107', 'https://azgaragedoors.example.com',  'Garage door and opener repair and installation.', true)
on conflict (nombre) do nothing;
