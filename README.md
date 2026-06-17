# 🧰 My Borrow Box

Plataforma web para **My Borrow Box** — una empresa local en **Sahuarita, Arizona** que presta/renta herramientas a sus miembros mediante membresía mensual.

> En lugar de comprar una herramienta que usas una sola vez, te haces miembro, escaneas el QR y la sacas de la bodega. La devuelves en 72 horas y listo.

Interfaz 100% en **español mexicano**, mobile-first, con estética premium tipo startup tech.

---

## 🧱 Stack

- **Next.js 14** (App Router) + **React** + **TypeScript**
- **Tailwind CSS** + **Framer Motion** (animaciones)
- **Supabase** (Postgres + Auth + Storage + RLS)
- **Resend** (mails transaccionales)
- **qrcode** + **html5-qrcode** (generar y leer QR)
- **lucide-react** (iconos) · Fuentes **Sora** + **Inter** vía `next/font`

> ⚠️ **Pagos:** la membresía se paga **manualmente** por transferencia/Zelle. **No** hay pasarela de pago. Solo web responsive (no hay app de tiendas).

---

## ✅ Requisitos previos

- **Node.js 18.17 o superior** (este proyecto NO corre en Node 16).
  Si tienes Node viejo, instalá [nvm](https://github.com/nvm-sh/nvm) y luego:
  ```bash
  nvm install 20
  nvm use 20
  ```
- Una cuenta gratis en [Supabase](https://supabase.com).
- (Opcional) Una cuenta en [Resend](https://resend.com) para enviar mails de verdad.

---

## 🚀 Puesta en marcha (local)

### 1) Instalar dependencias
```bash
npm install
```

### 2) Crear el proyecto en Supabase
1. Entrá a [supabase.com](https://supabase.com) → **New project**.
2. Elegí nombre, contraseña de base de datos y región (cercana a Arizona, ej. `us-west-1`).
3. Esperá a que termine de provisionar (~2 min).

### 3) Configurar variables de entorno
```bash
cp .env.example .env.local
```
Completá en `.env.local` (los valores salen de **Project Settings → API** en Supabase):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (¡secreta!)
- `SUPABASE_DB_URL` (Project Settings → Database → Connection string)
- `ADMIN_EMAIL`, `ADMIN_PASSWORD` (para el usuario admin del seed)
- `RESEND_API_KEY` (opcional; si la dejás vacía, los mails se loguean en consola)

### 4) Correr las migraciones

**Opción A — Un solo archivo (la más simple):**
Abrí **SQL Editor** en el dashboard de Supabase y pegá/ejecutá el archivo
`supabase/setup_completo.sql`. Incluye **todas las migraciones (0001 → 0009) + el
seed estático** (ubicación, configuración, herramientas y anunciantes) en un solo paso.

**Opción B — Migraciones por separado:**
Pegá en orden los archivos de `supabase/migrations/` (0001 → 0009) y luego `supabase/seed.sql`.

**Opción C — Supabase CLI:**
```bash
npx supabase link --project-ref TU-PROJECT-REF
npx supabase db push
```

### 5) Correr el seed (datos de prueba)
La parte estática ya quedó cargada en el paso 4 (vía `setup_completo.sql` o `seed.sql`).
Falta la parte que crea los **usuarios de Auth + QR + préstamos + cargos**:

```bash
# Requiere SUPABASE_SECRET_KEY en .env.local
npm run seed:auth
```

El seed crea: 1 admin, 5 miembros con distintos estados (activo, en revisión,
suspendido, pendiente), 20 herramientas con su QR generado, préstamos activos y
vencidos, cargos por retraso/reemplazo, membresías y 7 anunciantes.

**Credenciales de prueba** (se imprimen al terminar `seed:auth`):
- **Admin:** `ADMIN_EMAIL` / `ADMIN_PASSWORD` de tu `.env.local`.
- **Miembros:** `maria.gonzalez@example.com`, `juan.perez@example.com`,
  `lucia.ramirez@example.com`, `carlos.mendez@example.com`,
  `ana.torres@example.com` — todos con la clave `Miembro1234!`.

> **Resetear:** el seed es idempotente (lo podés volver a correr). Para empezar
> de cero, borrá los usuarios en Auth y truncá las tablas, o recreá el proyecto.

### 6) Levantar el proyecto
```bash
npm run dev
```
Abrí [http://localhost:3000](http://localhost:3000).

---

## 📂 Estructura del proyecto

```
src/
  app/            # rutas (App Router): home, (auth), (miembro), (admin), api
  components/     # ui/, home/, miembro/, admin/, shared/
  lib/            # supabase/ (client, server, admin), config, utils, qr, resend
  emails/         # plantillas de mails
  types/          # tipos de la BD
supabase/
  migrations/     # 0001..0008 SQL (tablas, RLS, funciones, storage)
  seed.sql        # datos de prueba
  seed/           # script TS (usuarios Auth + QR)
```

---

## 🔧 Configuración editable (sin tocar código)

Estos valores viven en la tabla `configuracion` (editables desde el panel admin):
- **Datos bancarios** del pago (banco, routing, cuenta, Zelle).
- **Código de la puerta** de la bodega (por ahora `1234`).
- **Monto de membresía** (`$29.99`).
- **Penalidad diaria** por retraso (`$5/día`, hasta 5 días; luego costo de reemplazo).
- **Máximo de herramientas** por miembro (`5`).
- **Horas de préstamo** (`72`).

> El código por defecto también está en `src/lib/config.ts` como fallback.

---

## 📦 Estado de construcción

- [x] **Bloque 1** — Setup (Next + Tailwind + Supabase clients + env + README)
- [x] **Bloque 2** — Migraciones SQL + seed (RLS, Storage, funciones, datos de prueba)
- [x] **Bloque 3** — Home pública con animaciones (hero, scroll reveal, contadores, catálogo)
- [x] **Bloque 4** — Auth + registro multi-paso + subida de comprobante
- [x] **Bloque 5** — Panel de miembro (escáner QR, préstamos 72h, cargos, código de puerta)
- [x] **Bloque 6** — Panel admin (dashboard, comprobantes, miembros, herramientas+QR, pagos, reportes, anunciantes, config)
- [x] **Bloque 7** — Mails con Resend (aprobación, rechazo, recordatorio, retraso)

## 📧 Mails (Resend) y cron

- Configura `RESEND_API_KEY` para enviar de verdad; si lo dejas vacío, los mails se
  **loguean en consola** (modo dev).
- Mails: comprobante **aprobado**/**rechazado** (al revisar en el admin),
  **recordatorio** de vencimiento y **aviso de retraso**.
- Los dos últimos los dispara el endpoint **`/api/cargos/recalcular`** (marca vencidos,
  genera cargos y manda recordatorios/avisos). Llámalo periódicamente con un cron
  (ej. Vercel Cron cada hora) y, si quieres, protégelo con `CRON_SECRET`:
  ```
  curl -H "Authorization: Bearer $CRON_SECRET" https://TU-SITIO/api/cargos/recalcular
  ```

> **Importante (Auth):** el registro crea usuarios ya confirmados (la aprobación es
> manual). No necesitas activar verificación por correo en Supabase.
