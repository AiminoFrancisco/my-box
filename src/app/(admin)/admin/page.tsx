import Link from "next/link";
import { Users, Boxes, DollarSign, Receipt, ArrowRight, TrendingUp } from "lucide-react";
import { obtenerMetricasAdmin } from "@/lib/admin";
import { crearClienteAdmin } from "@/lib/supabase/admin";
import { formatoDinero, formatoFecha } from "@/lib/utils";

export const metadata = { title: "Dashboard · Admin" };

export default async function AdminDashboard() {
  const m = await obtenerMetricasAdmin();
  const admin = crearClienteAdmin();

  const { data: ultimosPrestamos } = await admin
    .from("prestamos")
    .select("id, fecha_prestamo, estado, herramientas(nombre), perfiles(nombre_completo)")
    .order("fecha_prestamo", { ascending: false })
    .limit(6);

  const METRICAS = [
    { etiqueta: "Miembros activos", valor: String(m.miembrosActivos), Icono: Users, color: "bg-marca-azul/10 text-marca-azul" },
    { etiqueta: "Herramientas prestadas", valor: String(m.herramientasPrestadas), Icono: Boxes, color: "bg-exito/10 text-exito" },
    { etiqueta: "Ingresos del mes", valor: formatoDinero(m.ingresosMes), Icono: DollarSign, color: "bg-marca-ambar/15 text-amber-700" },
    { etiqueta: "Comprobantes pendientes", valor: String(m.comprobantesPendientes), Icono: Receipt, color: "bg-peligro/10 text-peligro" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-marca-marino">Dashboard</h1>
        <p className="mt-1 text-tenue">Resumen de la operación de My Borrow Box.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {METRICAS.map((x) => (
          <div key={x.etiqueta} className="rounded-2xl border border-borde bg-superficie p-5 shadow-suave">
            <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${x.color}`}>
              <x.Icono className="h-6 w-6" />
            </span>
            <p className="mt-3 text-sm text-tenue">{x.etiqueta}</p>
            <p className="font-display text-2xl font-extrabold text-marca-marino">{x.valor}</p>
          </div>
        ))}
      </div>

      {m.comprobantesPendientes > 0 && (
        <Link href="/admin/comprobantes" className="flex items-center justify-between rounded-2xl border border-marca-ambar/40 bg-marca-ambar/10 p-5 transition-colors hover:bg-marca-ambar/15">
          <div>
            <p className="font-semibold text-marca-marino">Tienes {m.comprobantesPendientes} comprobante(s) por revisar</p>
            <p className="text-sm text-tenue">Apruébalos para activar a esos miembros.</p>
          </div>
          <ArrowRight className="h-5 w-5 text-amber-700" />
        </Link>
      )}

      <div className="rounded-2xl border border-borde bg-superficie p-6 shadow-suave">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold text-marca-marino">
          <TrendingUp className="h-5 w-5 text-marca-azul" /> Últimos movimientos
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-tenue">
                <th className="pb-2 font-medium">Herramienta</th>
                <th className="pb-2 font-medium">Miembro</th>
                <th className="pb-2 font-medium">Estado</th>
                <th className="pb-2 font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borde">
              {((ultimosPrestamos ?? []) as any[]).map((p) => (
                <tr key={p.id}>
                  <td className="py-2.5 text-marca-marino">{p.herramientas?.nombre ?? "—"}</td>
                  <td className="py-2.5 text-tenue">{p.perfiles?.nombre_completo ?? "—"}</td>
                  <td className="py-2.5 capitalize text-tenue">{p.estado}</td>
                  <td className="py-2.5 text-tenue">{formatoFecha(p.fecha_prestamo)}</td>
                </tr>
              ))}
              {(!ultimosPrestamos || ultimosPrestamos.length === 0) && (
                <tr><td colSpan={4} className="py-6 text-center text-tenue">Sin movimientos todavía.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
