import {
  BookOpen, Boxes, Receipt, Users, Clock, DollarSign, BarChart3,
  Megaphone, Settings, Mail, ArrowRight, Lightbulb, QrCode,
} from "lucide-react";

export const metadata = { title: "Manual · Admin" };

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

const INDICE = [
  { id: "herramientas", texto: "Cargar herramientas", Icono: Boxes },
  { id: "clientes", texto: "Clientes y comprobantes", Icono: Receipt },
  { id: "miembros", texto: "Miembros", Icono: Users },
  { id: "prestamos", texto: "Préstamos (72 hs)", Icono: Clock },
  { id: "pagos", texto: "Pagos y cargos", Icono: DollarSign },
  { id: "reportes", texto: "Reportes", Icono: BarChart3 },
  { id: "anunciantes", texto: "Anunciantes", Icono: Megaphone },
  { id: "config", texto: "Configuración", Icono: Settings },
  { id: "mails", texto: "Correos", Icono: Mail },
];

export default function ManualPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Encabezado */}
      <div>
        <h1 className="flex items-center gap-2 font-display text-2xl font-extrabold text-marca-marino">
          <BookOpen className="h-6 w-6 text-marca-azul" /> Manual del administrador
        </h1>
        <p className="mt-1 text-tenue">Cómo funciona cada parte de My Borrow Box, paso a paso.</p>
      </div>

      {/* Ciclo de vida del miembro */}
      <div className="rounded-2xl border border-borde bg-superficie p-6 shadow-suave">
        <h2 className="font-display text-lg font-bold text-marca-marino">El flujo en pocas palabras</h2>
        <p className="mt-1 text-sm text-tenue">
          Así pasa un cliente de registrarse a poder sacar herramientas:
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm font-medium">
          <span className="rounded-full bg-amber-100 px-3 py-1.5 text-amber-700">1. Se registra → Pendiente de pago</span>
          <ArrowRight className="h-4 w-4 text-tenue" />
          <span className="rounded-full bg-amber-100 px-3 py-1.5 text-amber-700">2. Sube comprobante → En revisión</span>
          <ArrowRight className="h-4 w-4 text-tenue" />
          <span className="rounded-full bg-marca-azul/10 px-3 py-1.5 text-marca-azul">3. Tú lo apruebas</span>
          <ArrowRight className="h-4 w-4 text-tenue" />
          <span className="rounded-full bg-green-100 px-3 py-1.5 text-green-700">4. Activo → ya saca herramientas</span>
        </div>
      </div>

      {/* Índice */}
      <div className="rounded-2xl border border-borde bg-superficie p-4 shadow-suave">
        <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-tenue">Índice</p>
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
          {INDICE.map((i) => (
            <a key={i.id} href={`#${i.id}`} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-tenue transition-colors hover:bg-fondo hover:text-marca-azul">
              <i.Icono className="h-4 w-4" /> {i.texto}
            </a>
          ))}
        </div>
      </div>

      {/* 1. Herramientas */}
      <Seccion id="herramientas" Icono={Boxes} titulo="Cargar una herramienta" intro="Cómo agregar herramientas al inventario y su QR.">
        <ol className="space-y-3">
          <Paso n={1}>Entra a <strong>Herramientas</strong> en el menú y toca <strong>“Nueva herramienta”</strong>.</Paso>
          <Paso n={2}>Completa los datos: <strong>número de inventario</strong> (ej. INV-021, único), <strong>nombre</strong>, descripción, categoría, condición, <strong>valor de reemplazo</strong> (lo que se le cobra si la pierden o la roban) y estado.</Paso>
          <Paso n={3}>Subí la <strong>foto</strong>: arrastrá una imagen al recuadro o tocá para elegirla. (También podés pegar una URL en “…o pegar una URL”.)</Paso>
          <Paso n={4}>Tocá <strong>“Crear y generar QR”</strong>. El sistema crea la herramienta y le <strong>genera su QR único automáticamente</strong>.</Paso>
          <Paso n={5}>Para imprimir el QR: en la fila de la herramienta tocá el ícono <QrCode className="inline h-4 w-4 text-marca-azul" /> → <strong>“Imprimir QR”</strong>. Pegá ese QR en la herramienta física.</Paso>
        </ol>
        <Tip>
          El <strong>estado</strong> de la herramienta cambia solo: pasa a <em>Prestada</em> cuando un miembro la saca y vuelve a <em>Disponible</em> al devolverla. Vos solo lo tocás a mano para marcar <em>En reparación</em> o <em>Perdida</em>.
        </Tip>
      </Seccion>

      {/* 2. Clientes y comprobantes */}
      <Seccion id="clientes" Icono={Receipt} titulo="Cliente nuevo y comprobantes de pago" intro="Qué pasa cuando alguien se registra y manda su pago.">
        <ol className="space-y-3">
          <Paso n={1}>El cliente se registra en la web (datos, persona autorizada y fotos de identificación). Queda con estado <strong className="text-amber-700">Pendiente de pago</strong> y ya aparece en <strong>Miembros</strong>.</Paso>
          <Paso n={2}>El cliente transfiere la membresía a tu cuenta y, desde su perfil, <strong>sube el comprobante</strong>. En ese momento su estado pasa solo a <strong className="text-amber-700">En revisión</strong>.</Paso>
          <Paso n={3}>El comprobante te aparece en <strong>Comprobantes</strong> (el menú muestra un <span className="rounded-full bg-marca-ambar px-1.5 text-xs font-bold text-marca-marino">número</span> con los pendientes). Ahí ves la <strong>imagen del comprobante</strong>, el nombre y el monto.</Paso>
          <Paso n={4}><strong>Aprobar:</strong> tocá <strong>“Aprobar”</strong> → el miembro pasa a <strong className="text-green-700">Activo</strong>, se registra el ingreso de la membresía y le llega un <strong>correo</strong> avisando que ya tiene acceso.</Paso>
          <Paso n={5}><strong>Rechazar:</strong> tocá <strong>“Rechazar”</strong>, escribí el motivo (opcional) → el miembro vuelve a <em>Pendiente de pago</em> y recibe un correo para volver a subir el comprobante.</Paso>
        </ol>
        <Tip>
          Tocá la imagen del comprobante para verla en grande. Las identificaciones del miembro las ves en su ficha (Miembros → tocá al miembro).
        </Tip>
      </Seccion>

      {/* 3. Miembros */}
      <Seccion id="miembros" Icono={Users} titulo="Gestionar miembros" intro="Ver, filtrar y cambiar el estado de cada miembro.">
        <ol className="space-y-3">
          <Paso n={1}>En <strong>Miembros</strong> ves la lista. Filtrá por <strong>Activos, En revisión, Pendientes, Suspendidos o Cancelados</strong> con los botones de arriba.</Paso>
          <Paso n={2}>Tocá un miembro para ver su <strong>ficha completa</strong>: datos, <strong>fotos de identificación</strong> (titular y autorizada), sus préstamos y sus cargos.</Paso>
          <Paso n={3}>Para cambiar su estado, usá el selector <strong>“Cambiar estado”</strong> (ej. <em>Suspendido</em> si debe dinero, <em>Cancelado</em> si se da de baja). El cambio es inmediato.</Paso>
        </ol>
        <Tip>
          Un miembro <strong>Suspendido</strong> o <strong>Cancelado</strong> no puede entrar a la bodega ni sacar herramientas, aunque tenga sesión iniciada.
        </Tip>
      </Seccion>

      {/* 4. Préstamos */}
      <Seccion id="prestamos" Icono={Clock} titulo="Préstamos: cómo funciona el 72 horas" intro="Lo que hace el miembro y cómo se generan los cargos.">
        <ol className="space-y-3">
          <Paso n={1}>El miembro activo entra a la bodega con el <strong>código de la puerta</strong> y <strong>escanea el QR</strong> de la herramienta para sacarla (máximo <strong>5 a la vez</strong>).</Paso>
          <Paso n={2}>Al escanear, la herramienta queda asignada a su cuenta y arranca un <strong>temporizador de 72 horas</strong> (verde → por vencer → vencido).</Paso>
          <Paso n={3}>Para devolverla, vuelve a <strong>escanear el QR</strong> (modo Devolver) y el préstamo se cierra; la herramienta vuelve a <em>Disponible</em>.</Paso>
          <Paso n={4}>Si se pasa de las 72 hs, el sistema genera un cargo de <strong>$5 por día</strong> de retraso (hasta 5 días). Pasados los 5 días, genera el cargo por el <strong>valor de reemplazo</strong> completo.</Paso>
        </ol>
        <Tip>
          Ese cargo es una <strong>deuda</strong> en la cuenta del miembro (no se le descuenta de ninguna tarjeta). La cobranza es manual: él paga por transferencia y vos lo marcás como pagado en <strong>Pagos</strong>.
        </Tip>
      </Seccion>

      {/* 5. Pagos */}
      <Seccion id="pagos" Icono={DollarSign} titulo="Pagos y cargos" intro="Membresías, retrasos y reemplazos en un solo lugar.">
        <ol className="space-y-3">
          <Paso n={1}>En <strong>Pagos</strong> ves todos los cargos: <strong>Membresía</strong>, <strong>Retraso</strong> y <strong>Reemplazo</strong>, con el miembro, el monto y la fecha.</Paso>
          <Paso n={2}>Arriba tenés los totales: <strong>Cobrado</strong>, <strong>Pendiente</strong>, ingresos por membresías y por penalidades.</Paso>
          <Paso n={3}>Cuando recibís un pago, tocá <strong>“Marcar pagado”</strong> en ese cargo. (Si te equivocaste, volvés a tocarlo para dejarlo pendiente.)</Paso>
        </ol>
      </Seccion>

      {/* 6. Reportes */}
      <Seccion id="reportes" Icono={BarChart3} titulo="Reportes" intro="Métricas de uso e ingresos.">
        <ol className="space-y-3">
          <Paso n={1}>En <strong>Reportes</strong> ves las <strong>herramientas más usadas</strong>, los <strong>miembros más activos</strong> y los <strong>ingresos</strong> por membresía y por penalidades.</Paso>
          <Paso n={2}>Abajo está el <strong>historial de movimientos</strong> (qué herramienta sacó cada miembro y cuándo).</Paso>
        </ol>
      </Seccion>

      {/* 7. Anunciantes */}
      <Seccion id="anunciantes" Icono={Megaphone} titulo="Anunciantes locales" intro="Las empresas que aparecen en la página pública.">
        <ol className="space-y-3">
          <Paso n={1}>En <strong>Anunciantes</strong> tocá <strong>“Nuevo anunciante”</strong> y cargá nombre, categoría (HVAC, Plomería, etc.), teléfono, sitio web, logo y descripción.</Paso>
          <Paso n={2}>Marcá <strong>Activo</strong> para que se vea en la home. Desmarcalo para ocultarlo sin borrarlo.</Paso>
          <Paso n={3}>Con los íconos de cada tarjeta podés <strong>editar</strong> o <strong>eliminar</strong>.</Paso>
        </ol>
      </Seccion>

      {/* 8. Configuración */}
      <Seccion id="config" Icono={Settings} titulo="Configuración" intro="Cambiá los datos del negocio sin tocar código.">
        <ol className="space-y-3">
          <Paso n={1}><strong>Datos bancarios:</strong> el banco, número de cuenta y Zelle/alias que ve el cliente para pagar. Cambialos por los tuyos.</Paso>
          <Paso n={2}><strong>Membresía y préstamos:</strong> monto de la membresía, horas de préstamo (72), máximo de herramientas (5), penalidad diaria ($5) y días antes de cobrar el reemplazo (5).</Paso>
          <Paso n={3}><strong>Código de la puerta</strong> de la bodega (hoy <strong>1234</strong>). Cambialo cuando quieras; solo los miembros activos lo ven.</Paso>
          <Paso n={4}>Tocá <strong>“Guardar cambios”</strong>. Aplica de inmediato en toda la app.</Paso>
        </ol>
      </Seccion>

      {/* 9. Mails */}
      <Seccion id="mails" Icono={Mail} titulo="Correos automáticos" intro="Qué mails se envían y cuándo.">
        <ol className="space-y-3">
          <Paso n={1}>Al <strong>aprobar</strong> un comprobante → mail “tu membresía está activa”.</Paso>
          <Paso n={2}>Al <strong>rechazar</strong> → mail para volver a subir el comprobante.</Paso>
          <Paso n={3}><strong>Recordatorio</strong> antes de vencer un préstamo y <strong>aviso de retraso</strong> cuando se vence (los dispara una tarea automática periódica).</Paso>
        </ol>
        <Tip>
          Si no configuraste el servicio de correo, los mails quedan registrados en los <strong>logs</strong> (no se envían). Cuando agregues la clave de Resend, empiezan a salir de verdad.
        </Tip>
      </Seccion>
    </div>
  );
}
