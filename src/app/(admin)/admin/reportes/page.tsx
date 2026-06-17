import { BarChart3, Wrench, Users, DollarSign } from "lucide-react";
import { crearClienteAdmin } from "@/lib/supabase/admin";
import { formatoDinero, formatoFecha } from "@/lib/utils";

export const metadata = { title: "Reportes · Admin" };

export default async function ReportesPage() {
  const admin = crearClienteAdmin();

  const [{ data: prestamos }, { data: cargos }] = await Promise.all([
    admin.from("prestamos").select("id, fecha_prestamo, herramienta_id, perfil_id, herramientas(nombre), perfiles(nombre_completo)").order("fecha_prestamo", { ascending: false }),
    admin.from("cargos").select("tipo, monto, estado"),
  ]);

  const P = (prestamos ?? []) as any[];
  const C = (cargos ?? []) as any[];

  // Herramientas más usadas
  const usoHerr = new Map<string, number>();
  P.forEach((p) => { const n = p.herramientas?.nombre ?? "—"; usoHerr.set(n, (usoHerr.get(n) ?? 0) + 1); });
  const masUsadas = Array.from(usoHerr.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8);

  // Miembros más activos
  const actMiembro = new Map<string, number>();
  P.forEach((p) => { const n = p.perfiles?.nombre_completo ?? "—"; actMiembro.set(n, (actMiembro.get(n) ?? 0) + 1); });
  const masActivos = Array.from(actMiembro.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8);

  // Ingresos
  const ingresosMembresia = C.filter((c) => c.tipo === "membresia" && c.estado === "pagado").reduce((s, c) => s + Number(c.monto), 0);
  const ingresosPenalidades = C.filter((c) => (c.tipo === "retraso" || c.tipo === "reemplazo") && c.estado === "pagado").reduce((s, c) => s + Number(c.monto), 0);

  const maxUso = masUsadas[0]?.[1] ?? 1;
  const maxAct = masActivos[0]?.[1] ?? 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 font-display text-2xl font-extrabold text-marca-marino">
          <BarChart3 className="h-6 w-6 text-marca-azul" /> Reportes
        </h1>
        <p className="mt-1 text-tenue">Métricas de uso e ingresos.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Tarjeta Icono={DollarSign} etiqueta="Ingresos por membresía" valor={formatoDinero(ingresosMembresia)} />
        <Tarjeta Icono={DollarSign} etiqueta="Ingresos por penalidades" valor={formatoDinero(ingresosPenalidades)} />
        <Tarjeta Icono={Wrench} etiqueta="Préstamos totales" valor={String(P.length)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Ranking titulo="Herramientas más usadas" Icono={Wrench} datos={masUsadas} max={maxUso} sufijo=" préstamos" />
        <Ranking titulo="Miembros más activos" Icono={Users} datos={masActivos} max={maxAct} sufijo=" préstamos" />
      </div>

      <div className="rounded-2xl border border-borde bg-superficie p-6 shadow-suave">
        <h2 className="font-display text-lg font-bold text-marca-marino">Historial de movimientos</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-tenue">
              <tr><th className="pb-2 font-medium">Herramienta</th><th className="pb-2 font-medium">Miembro</th><th className="pb-2 font-medium">Fecha</th></tr>
            </thead>
            <tbody className="divide-y divide-borde">
              {P.slice(0, 12).map((p) => (
                <tr key={p.id}>
                  <td className="py-2.5 text-marca-marino">{p.herramientas?.nombre ?? "—"}</td>
                  <td className="py-2.5 text-tenue">{p.perfiles?.nombre_completo ?? "—"}</td>
                  <td className="py-2.5 text-tenue">{formatoFecha(p.fecha_prestamo)}</td>
                </tr>
              ))}
              {P.length === 0 && <tr><td colSpan={3} className="py-6 text-center text-tenue">Sin movimientos.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Tarjeta({ Icono, etiqueta, valor }: { Icono: React.ComponentType<{ className?: string }>; etiqueta: string; valor: string }) {
  return (
    <div className="rounded-2xl border border-borde bg-superficie p-5 shadow-suave">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-marca-azul/10 text-marca-azul"><Icono className="h-6 w-6" /></span>
      <p className="mt-3 text-sm text-tenue">{etiqueta}</p>
      <p className="font-display text-2xl font-extrabold text-marca-marino">{valor}</p>
    </div>
  );
}

function Ranking({ titulo, Icono, datos, max, sufijo }: { titulo: string; Icono: React.ComponentType<{ className?: string }>; datos: [string, number][]; max: number; sufijo: string }) {
  return (
    <div className="rounded-2xl border border-borde bg-superficie p-6 shadow-suave">
      <h2 className="flex items-center gap-2 font-display text-lg font-bold text-marca-marino"><Icono className="h-5 w-5 text-marca-azul" /> {titulo}</h2>
      {datos.length === 0 ? (
        <p className="mt-4 text-sm text-tenue">Sin datos todavía.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {datos.map(([nombre, n]) => (
            <li key={nombre}>
              <div className="flex justify-between text-sm">
                <span className="text-marca-marino">{nombre}</span>
                <span className="text-tenue">{n}{sufijo}</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-fondo">
                <div className="h-full rounded-full bg-gradiente-marca" style={{ width: `${(n / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
