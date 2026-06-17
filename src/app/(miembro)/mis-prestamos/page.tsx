import { Clock, DollarSign } from "lucide-react";
import { obtenerMisPrestamos, obtenerMisCargos } from "@/lib/miembro";
import { TemporizadorPrestamo } from "@/components/miembro/TemporizadorPrestamo";
import { BotonAccionQR } from "@/components/miembro/BotonAccionQR";
import { BadgeEstado } from "@/components/ui/BadgeEstado";
import { ImagenHerramienta } from "@/components/ui/ImagenHerramienta";
import { formatoDinero, formatoFecha } from "@/lib/utils";

export const metadata = { title: "Mis préstamos · My Borrow Box" };

const ETIQUETA_CARGO = { retraso: "Retraso", reemplazo: "Reemplazo", membresia: "Membresía" } as const;

export default async function MisPrestamosPage() {
  const [prestamos, cargos] = await Promise.all([obtenerMisPrestamos(), obtenerMisCargos()]);

  const activos = prestamos.filter((p) => p.estado === "activo" || p.estado === "vencido");
  const historial = prestamos.filter((p) => p.estado === "devuelto");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="flex items-center gap-2 font-display text-2xl font-extrabold text-marca-marino">
          <Clock className="h-6 w-6 text-marca-azul" /> Mis préstamos
        </h1>
        <p className="mt-1 text-tenue">Tus herramientas, el tiempo restante y tus cargos.</p>
      </div>

      {/* Activos */}
      <section>
        <h2 className="mb-3 font-display text-lg font-bold text-marca-marino">Activos ({activos.length})</h2>
        {activos.length === 0 ? (
          <p className="rounded-xl bg-superficie p-6 text-center text-sm text-tenue shadow-suave">
            No tienes préstamos activos.
          </p>
        ) : (
          <ul className="space-y-3">
            {activos.map((p) => (
              <li key={p.id} className="flex flex-col gap-3 rounded-2xl border border-borde bg-superficie p-4 shadow-suave sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl">
                    <ImagenHerramienta src={p.herramientas?.foto_url} alt={p.herramientas?.nombre ?? ""} categoria={p.herramientas?.categoria} />
                  </div>
                  <div>
                    <p className="font-medium text-marca-marino">{p.herramientas?.nombre ?? "Herramienta"}</p>
                    <p className="text-xs text-tenue">Desde {formatoFecha(p.fecha_prestamo)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <TemporizadorPrestamo fechaLimite={p.fecha_limite} />
                  {p.herramientas?.qr_token && (
                    <BotonAccionQR token={p.herramientas.qr_token} modo="devolver" />
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Cargos */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-marca-marino">
          <DollarSign className="h-5 w-5 text-marca-azul" /> Cargos
        </h2>
        {cargos.length === 0 ? (
          <p className="rounded-xl bg-superficie p-6 text-center text-sm text-tenue shadow-suave">
            No tienes cargos. ¡Bien hecho! 🎉
          </p>
        ) : (
          <ul className="divide-y divide-borde rounded-2xl border border-borde bg-superficie shadow-suave">
            {cargos.map((c) => (
              <li key={c.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-marca-marino">
                    {ETIQUETA_CARGO[c.tipo]} · {formatoDinero(c.monto)}
                  </p>
                  <p className="text-xs text-tenue">{c.descripcion ?? formatoFecha(c.creado_en)}</p>
                </div>
                <BadgeEstado color={c.estado === "pagado" ? "exito" : "alerta"}>
                  {c.estado === "pagado" ? "Pagado" : "Pendiente"}
                </BadgeEstado>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Historial */}
      {historial.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-lg font-bold text-marca-marino">Historial ({historial.length})</h2>
          <ul className="space-y-2">
            {historial.map((p) => (
              <li key={p.id} className="flex items-center justify-between rounded-xl bg-superficie px-4 py-3 text-sm shadow-suave">
                <span className="text-marca-marino">{p.herramientas?.nombre ?? "Herramienta"}</span>
                <span className="text-tenue">Devuelta {p.fecha_devolucion ? formatoFecha(p.fecha_devolucion) : ""}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
