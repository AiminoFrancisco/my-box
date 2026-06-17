import Link from "next/link";
import { Boxes, Clock, DollarSign, ScanLine, DoorOpen, ArrowRight } from "lucide-react";
import { obtenerPerfil } from "@/lib/auth";
import { obtenerMisPrestamos, obtenerMisCargos, contarActivos } from "@/lib/miembro";
import { AvisoMembresia } from "@/components/miembro/AvisoMembresia";
import { TemporizadorPrestamo } from "@/components/miembro/TemporizadorPrestamo";
import { CONFIG_DEFECTO } from "@/lib/config";
import { formatoDinero } from "@/lib/utils";

export const metadata = { title: "Mi panel · My Borrow Box" };

export default async function PanelPage() {
  const perfil = await obtenerPerfil();
  const [prestamos, cargos] = await Promise.all([obtenerMisPrestamos(), obtenerMisCargos()]);

  const activos = prestamos.filter((p) => p.estado === "activo" || p.estado === "vencido");
  const nActivos = contarActivos(prestamos);
  const restantes = Math.max(0, CONFIG_DEFECTO.max_herramientas - nActivos);
  const cargosPendientes = cargos.filter((c) => c.estado === "pendiente");
  const totalPendiente = cargosPendientes.reduce((s, c) => s + Number(c.monto), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-marca-marino">
          ¡Hola, {perfil?.nombre_completo.split(" ")[0]}! 👋
        </h1>
        <p className="mt-1 text-tenue">Este es tu resumen de hoy.</p>
      </div>

      {perfil && <AvisoMembresia estado={perfil.estado} />}

      {/* Métricas */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <TarjetaMetrica Icono={Boxes} etiqueta="Activas" etiquetaLarga="Herramientas activas" valor={`${nActivos}/${CONFIG_DEFECTO.max_herramientas}`} color="azul" />
        <TarjetaMetrica Icono={ScanLine} etiqueta="Disponibles" etiquetaLarga="Puedes sacar" valor={`${restantes}`} color="exito" />
        <TarjetaMetrica Icono={DollarSign} etiqueta="Cargos" etiquetaLarga="Cargos pendientes" valor={formatoDinero(totalPendiente)} color={totalPendiente > 0 ? "peligro" : "neutro"} />
      </div>

      {/* Accesos rápidos */}
      <div className="grid gap-4 sm:grid-cols-3">
        <AccesoRapido href="/escanear" Icono={ScanLine} titulo="Escanear QR" texto="Saca o devuelve una herramienta" />
        <AccesoRapido href="/herramientas" Icono={Boxes} titulo="Ver herramientas" texto="Explora el catálogo" />
        <AccesoRapido href="/bodega" Icono={DoorOpen} titulo="Acceso a bodega" texto="Tu código de la puerta" />
      </div>

      {/* Préstamos activos */}
      <div className="rounded-2xl border border-borde bg-superficie p-6 shadow-suave">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-marca-marino">
            <Clock className="h-5 w-5 text-marca-azul" /> Tus préstamos activos
          </h2>
          <Link href="/mis-prestamos" className="inline-flex items-center gap-1 text-sm font-medium text-marca-azul hover:underline">
            Ver todos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {activos.length === 0 ? (
          <p className="mt-4 rounded-xl bg-fondo px-4 py-6 text-center text-sm text-tenue">
            No tienes herramientas prestadas ahora mismo.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {activos.slice(0, 4).map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-4 rounded-xl bg-fondo px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-marca-marino">{p.herramientas?.nombre ?? "Herramienta"}</p>
                  <p className="text-xs text-tenue">{p.herramientas?.numero_inventario}</p>
                </div>
                <TemporizadorPrestamo fechaLimite={p.fecha_limite} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function TarjetaMetrica({
  Icono,
  etiqueta,
  etiquetaLarga,
  valor,
  color,
}: {
  Icono: React.ComponentType<{ className?: string }>;
  etiqueta: string;
  etiquetaLarga?: string;
  valor: string;
  color: "azul" | "exito" | "peligro" | "neutro";
}) {
  const colores = {
    azul: "bg-marca-azul/10 text-marca-azul",
    exito: "bg-exito/10 text-exito",
    peligro: "bg-peligro/10 text-peligro",
    neutro: "bg-tenue/10 text-tenue",
  }[color];
  return (
    <div className="rounded-2xl border border-borde bg-superficie p-3 shadow-suave sm:p-5">
      <span className={`flex h-9 w-9 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${colores}`}>
        <Icono className="h-5 w-5 sm:h-6 sm:w-6" />
      </span>
      <p className="mt-2 truncate text-xs text-tenue sm:mt-3 sm:text-sm">
        {/* Etiqueta corta en móvil, larga en escritorio */}
        <span className="sm:hidden">{etiqueta}</span>
        <span className="hidden sm:inline">{etiquetaLarga ?? etiqueta}</span>
      </p>
      <p className="font-display text-lg font-extrabold text-marca-marino sm:text-2xl">{valor}</p>
    </div>
  );
}

function AccesoRapido({
  href,
  Icono,
  titulo,
  texto,
}: {
  href: string;
  Icono: React.ComponentType<{ className?: string }>;
  titulo: string;
  texto: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-borde bg-superficie p-5 shadow-suave transition-all hover:-translate-y-0.5 hover:shadow-glow"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradiente-marca text-white transition-transform group-hover:scale-110">
        <Icono className="h-6 w-6" />
      </span>
      <div>
        <p className="font-semibold text-marca-marino">{titulo}</p>
        <p className="text-sm text-tenue">{texto}</p>
      </div>
    </Link>
  );
}
