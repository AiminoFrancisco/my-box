import {
  BookOpen, Boxes, Receipt, Users, Clock, DollarSign, BarChart3,
  Megaphone, Settings, Mail, ArrowRight, Lightbulb, QrCode,
} from "lucide-react";
import { obtenerDic } from "@/lib/i18n/servidor";

export function generateMetadata() {
  return { title: obtenerDic().admin.meta.manual };
}

/** Un paso numerado dentro de una sección. */
function Paso({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-marca-azul/10 text-sm font-bold text-marca-azul">
        {n}
      </span>
      <div className="pt-0.5 text-sm leading-relaxed text-contenido">{children}</div>
    </li>
  );
}

/** Caja de tip/nota. */
function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-3 flex items-start gap-2 rounded-xl bg-marca-ambar/10 p-3 text-sm text-amber-800">
      <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
      <p>{children}</p>
    </div>
  );
}

/** Sección con encabezado e ícono. */
function Seccion({
  id,
  Icono,
  titulo,
  intro,
  children,
}: {
  id: string;
  Icono: React.ComponentType<{ className?: string }>;
  titulo: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 rounded-2xl border border-borde bg-superficie p-6 shadow-suave">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradiente-marca text-white">
          <Icono className="h-6 w-6" />
        </span>
        <div>
          <h2 className="font-display text-lg font-bold text-marca-marino">{titulo}</h2>
          <p className="text-sm text-tenue">{intro}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export default function ManualPage() {
  const dic = obtenerDic();
  const t = dic.admin.manual;

  const INDICE = [
    { id: "herramientas", texto: t.indiceItems.herramientas, Icono: Boxes },
    { id: "clientes", texto: t.indiceItems.clientes, Icono: Receipt },
    { id: "miembros", texto: t.indiceItems.miembros, Icono: Users },
    { id: "prestamos", texto: t.indiceItems.prestamos, Icono: Clock },
    { id: "pagos", texto: t.indiceItems.pagos, Icono: DollarSign },
    { id: "reportes", texto: t.indiceItems.reportes, Icono: BarChart3 },
    { id: "anunciantes", texto: t.indiceItems.anunciantes, Icono: Megaphone },
    { id: "config", texto: t.indiceItems.config, Icono: Settings },
    { id: "mails", texto: t.indiceItems.mails, Icono: Mail },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Encabezado */}
      <div>
        <h1 className="flex items-center gap-2 font-display text-2xl font-extrabold text-marca-marino">
          <BookOpen className="h-6 w-6 text-marca-azul" /> {t.titulo}
        </h1>
        <p className="mt-1 text-tenue">{t.subtitulo}</p>
      </div>

      {/* Ciclo de vida del miembro */}
      <div className="rounded-2xl border border-borde bg-superficie p-6 shadow-suave">
        <h2 className="font-display text-lg font-bold text-marca-marino">{t.flujoTitulo}</h2>
        <p className="mt-1 text-sm text-tenue">
          {t.flujoIntro}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm font-medium">
          <span className="rounded-full bg-amber-100 px-3 py-1.5 text-amber-700">{t.flujoPaso1}</span>
          <ArrowRight className="h-4 w-4 text-tenue" />
          <span className="rounded-full bg-amber-100 px-3 py-1.5 text-amber-700">{t.flujoPaso2}</span>
          <ArrowRight className="h-4 w-4 text-tenue" />
          <span className="rounded-full bg-marca-azul/10 px-3 py-1.5 text-marca-azul">{t.flujoPaso3}</span>
          <ArrowRight className="h-4 w-4 text-tenue" />
          <span className="rounded-full bg-green-100 px-3 py-1.5 text-green-700">{t.flujoPaso4}</span>
        </div>
      </div>

      {/* Índice */}
      <div className="rounded-2xl border border-borde bg-superficie p-4 shadow-suave">
        <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-tenue">{t.indice}</p>
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
          {INDICE.map((i) => (
            <a key={i.id} href={`#${i.id}`} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-tenue transition-colors hover:bg-fondo hover:text-marca-azul">
              <i.Icono className="h-4 w-4" /> {i.texto}
            </a>
          ))}
        </div>
      </div>

      {/* 1. Herramientas */}
      <Seccion id="herramientas" Icono={Boxes} titulo={t.herramientas.titulo} intro={t.herramientas.intro}>
        <ol className="space-y-3">
          <Paso n={1}>{t.herramientas.paso1a}<strong>{t.herramientas.paso1Herramientas}</strong>{t.herramientas.paso1b}<strong>{t.herramientas.paso1Nueva}</strong>{t.herramientas.paso1c}</Paso>
          <Paso n={2}>{t.herramientas.paso2a}<strong>{t.herramientas.paso2Inventario}</strong>{t.herramientas.paso2b}<strong>{t.herramientas.paso2Nombre}</strong>{t.herramientas.paso2c}<strong>{t.herramientas.paso2Reemplazo}</strong>{t.herramientas.paso2d}</Paso>
          <Paso n={3}>{t.herramientas.paso3a}<strong>{t.herramientas.paso3Foto}</strong>{t.herramientas.paso3b}</Paso>
          <Paso n={4}>{t.herramientas.paso4a}<strong>{t.herramientas.paso4Crear}</strong>{t.herramientas.paso4b}<strong>{t.herramientas.paso4Genera}</strong>{t.herramientas.paso4c}</Paso>
          <Paso n={5}>{t.herramientas.paso5a}<QrCode className="inline h-4 w-4 text-marca-azul" />{t.herramientas.paso5b}<strong>{t.herramientas.paso5Imprimir}</strong>{t.herramientas.paso5c}</Paso>
        </ol>
        <Tip>
          {t.herramientas.tipA}<strong>{t.herramientas.tipEstado}</strong>{t.herramientas.tipB}<em>{t.herramientas.tipPrestada}</em>{t.herramientas.tipC}<em>{t.herramientas.tipDisponible}</em>{t.herramientas.tipD}<em>{t.herramientas.tipReparacion}</em>{t.herramientas.tipE}<em>{t.herramientas.tipPerdida}</em>{t.herramientas.tipF}
        </Tip>
      </Seccion>

      {/* 2. Clientes y comprobantes */}
      <Seccion id="clientes" Icono={Receipt} titulo={t.clientes.titulo} intro={t.clientes.intro}>
        <ol className="space-y-3">
          <Paso n={1}>{t.clientes.paso1a}<strong className="text-amber-700">{t.clientes.paso1Estado}</strong>{t.clientes.paso1b}<strong>{t.clientes.paso1Miembros}</strong>{t.clientes.paso1c}</Paso>
          <Paso n={2}>{t.clientes.paso2a}<strong>{t.clientes.paso2Sube}</strong>{t.clientes.paso2b}<strong className="text-amber-700">{t.clientes.paso2Estado}</strong>{t.clientes.paso2c}</Paso>
          <Paso n={3}>{t.clientes.paso3a}<strong>{t.clientes.paso3Comprobantes}</strong>{t.clientes.paso3b}<span className="rounded-full bg-marca-ambar px-1.5 text-xs font-bold text-marca-marino">{t.clientes.paso3Numero}</span>{t.clientes.paso3c}<strong>{t.clientes.paso3Imagen}</strong>{t.clientes.paso3d}</Paso>
          <Paso n={4}><strong>{t.clientes.paso4Aprobar}</strong>{t.clientes.paso4a}<strong>{t.clientes.paso4Boton}</strong>{t.clientes.paso4b}<strong className="text-green-700">{t.clientes.paso4Estado}</strong>{t.clientes.paso4c}<strong>{t.clientes.paso4Email}</strong>{t.clientes.paso4d}</Paso>
          <Paso n={5}><strong>{t.clientes.paso5Rechazar}</strong>{t.clientes.paso5a}<strong>{t.clientes.paso5Boton}</strong>{t.clientes.paso5b}<em>{t.clientes.paso5Estado}</em>{t.clientes.paso5c}</Paso>
        </ol>
        <Tip>
          {t.clientes.tipA}
        </Tip>
      </Seccion>

      {/* 3. Miembros */}
      <Seccion id="miembros" Icono={Users} titulo={t.miembros.titulo} intro={t.miembros.intro}>
        <ol className="space-y-3">
          <Paso n={1}>{t.miembros.paso1a}<strong>{t.miembros.paso1Miembros}</strong>{t.miembros.paso1b}<strong>{t.miembros.paso1Filtros}</strong>{t.miembros.paso1c}</Paso>
          <Paso n={2}>{t.miembros.paso2a}<strong>{t.miembros.paso2Ficha}</strong>{t.miembros.paso2b}<strong>{t.miembros.paso2Fotos}</strong>{t.miembros.paso2c}</Paso>
          <Paso n={3}>{t.miembros.paso3a}<strong>{t.miembros.paso3Selector}</strong>{t.miembros.paso3b}<em>{t.miembros.paso3Suspendido}</em>{t.miembros.paso3c}<em>{t.miembros.paso3Cancelado}</em>{t.miembros.paso3d}</Paso>
        </ol>
        <Tip>
          {t.miembros.tipA}<strong>{t.miembros.tipSuspendido}</strong>{t.miembros.tipB}<strong>{t.miembros.tipCancelado}</strong>{t.miembros.tipC}
        </Tip>
      </Seccion>

      {/* 4. Préstamos */}
      <Seccion id="prestamos" Icono={Clock} titulo={t.prestamos.titulo} intro={t.prestamos.intro}>
        <ol className="space-y-3">
          <Paso n={1}>{t.prestamos.paso1a}<strong>{t.prestamos.paso1Codigo}</strong>{t.prestamos.paso1b}<strong>{t.prestamos.paso1Escanea}</strong>{t.prestamos.paso1c}<strong>{t.prestamos.paso1Max}</strong>{t.prestamos.paso1d}</Paso>
          <Paso n={2}>{t.prestamos.paso2a}<strong>{t.prestamos.paso2Timer}</strong>{t.prestamos.paso2b}</Paso>
          <Paso n={3}>{t.prestamos.paso3a}<strong>{t.prestamos.paso3Escanea}</strong>{t.prestamos.paso3b}<em>{t.prestamos.paso3Disponible}</em>{t.prestamos.paso3c}</Paso>
          <Paso n={4}>{t.prestamos.paso4a}<strong>{t.prestamos.paso4Cargo}</strong>{t.prestamos.paso4b}<strong>{t.prestamos.paso4Reemplazo}</strong>{t.prestamos.paso4c}</Paso>
        </ol>
        <Tip>
          {t.prestamos.tipA}<strong>{t.prestamos.tipDeuda}</strong>{t.prestamos.tipB}<strong>{t.prestamos.tipPagos}</strong>{t.prestamos.tipC}
        </Tip>
      </Seccion>

      {/* 5. Pagos */}
      <Seccion id="pagos" Icono={DollarSign} titulo={t.pagos.titulo} intro={t.pagos.intro}>
        <ol className="space-y-3">
          <Paso n={1}>{t.pagos.paso1a}<strong>{t.pagos.paso1Pagos}</strong>{t.pagos.paso1b}<strong>{t.pagos.paso1Membresia}</strong>{t.pagos.paso1c}<strong>{t.pagos.paso1Retraso}</strong>{t.pagos.paso1d}<strong>{t.pagos.paso1Reemplazo}</strong>{t.pagos.paso1e}</Paso>
          <Paso n={2}>{t.pagos.paso2a}<strong>{t.pagos.paso2Cobrado}</strong>{t.pagos.paso2b}<strong>{t.pagos.paso2Pendiente}</strong>{t.pagos.paso2c}</Paso>
          <Paso n={3}>{t.pagos.paso3a}<strong>{t.pagos.paso3Marcar}</strong>{t.pagos.paso3b}</Paso>
        </ol>
      </Seccion>

      {/* 6. Reportes */}
      <Seccion id="reportes" Icono={BarChart3} titulo={t.reportes.titulo} intro={t.reportes.intro}>
        <ol className="space-y-3">
          <Paso n={1}>{t.reportes.paso1a}<strong>{t.reportes.paso1Reportes}</strong>{t.reportes.paso1b}<strong>{t.reportes.paso1MasUsadas}</strong>{t.reportes.paso1c}<strong>{t.reportes.paso1MasActivos}</strong>{t.reportes.paso1d}<strong>{t.reportes.paso1Ingresos}</strong>{t.reportes.paso1e}</Paso>
          <Paso n={2}>{t.reportes.paso2a}<strong>{t.reportes.paso2Historial}</strong>{t.reportes.paso2b}</Paso>
        </ol>
      </Seccion>

      {/* 7. Anunciantes */}
      <Seccion id="anunciantes" Icono={Megaphone} titulo={t.anunciantes.titulo} intro={t.anunciantes.intro}>
        <ol className="space-y-3">
          <Paso n={1}>{t.anunciantes.paso1a}<strong>{t.anunciantes.paso1Anunciantes}</strong>{t.anunciantes.paso1b}<strong>{t.anunciantes.paso1Nuevo}</strong>{t.anunciantes.paso1c}</Paso>
          <Paso n={2}>{t.anunciantes.paso2a}<strong>{t.anunciantes.paso2Activo}</strong>{t.anunciantes.paso2b}</Paso>
          <Paso n={3}>{t.anunciantes.paso3a}<strong>{t.anunciantes.paso3Editar}</strong>{t.anunciantes.paso3b}<strong>{t.anunciantes.paso3Eliminar}</strong>{t.anunciantes.paso3c}</Paso>
        </ol>
      </Seccion>

      {/* 8. Configuración */}
      <Seccion id="config" Icono={Settings} titulo={t.config.titulo} intro={t.config.intro}>
        <ol className="space-y-3">
          <Paso n={1}><strong>{t.config.paso1Bancarios}</strong>{t.config.paso1a}</Paso>
          <Paso n={2}><strong>{t.config.paso2Membresia}</strong>{t.config.paso2a}</Paso>
          <Paso n={3}><strong>{t.config.paso3Codigo}</strong>{t.config.paso3a}<strong>{t.config.paso3Valor}</strong>{t.config.paso3b}</Paso>
          <Paso n={4}>{t.config.paso4a}<strong>{t.config.paso4Guardar}</strong>{t.config.paso4b}</Paso>
        </ol>
      </Seccion>

      {/* 9. Mails */}
      <Seccion id="mails" Icono={Mail} titulo={t.mails.titulo} intro={t.mails.intro}>
        <ol className="space-y-3">
          <Paso n={1}>{t.mails.paso1a}<strong>{t.mails.paso1Aprobar}</strong>{t.mails.paso1b}</Paso>
          <Paso n={2}>{t.mails.paso2a}<strong>{t.mails.paso2Rechazar}</strong>{t.mails.paso2b}</Paso>
          <Paso n={3}><strong>{t.mails.paso3Recordatorio}</strong>{t.mails.paso3a}<strong>{t.mails.paso3Aviso}</strong>{t.mails.paso3b}</Paso>
        </ol>
        <Tip>
          {t.mails.tipA}<strong>{t.mails.tipLogs}</strong>{t.mails.tipB}
        </Tip>
      </Seccion>
    </div>
  );
}
