import { DollarSign } from "lucide-react";
import { crearClienteAdmin } from "@/lib/supabase/admin";
import { BotonCargoPagado } from "@/components/admin/BotonCargoPagado";
import { formatoDinero, formatoFecha } from "@/lib/utils";

export const metadata = { title: "Pagos · Admin" };

const ETIQUETA = { membresia: "Membresía", retraso: "Retraso", reemplazo: "Reemplazo" } as const;

export default async function PagosPage() {
  const admin = crearClienteAdmin();
  const { data } = await admin
    .from("cargos")
    .select("id, tipo, monto, estado, descripcion, creado_en, perfiles(nombre_completo)")
    .order("creado_en", { ascending: false });
  const cargos = (data ?? []) as any[];

  const total = (estado: string) => cargos.filter((c) => c.estado === estado).reduce((s, c) => s + Number(c.monto), 0);
  const porTipo = (tipo: string) => cargos.filter((c) => c.tipo === tipo).reduce((s, c) => s + Number(c.monto), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 font-display text-2xl font-extrabold text-marca-marino">
          <DollarSign className="h-6 w-6 text-marca-azul" /> Pagos y cargos
        </h1>
        <p className="mt-1 text-tenue">Membresías, retrasos y reemplazos.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Resumen etiqueta="Cobrado" valor={total("pagado")} color="text-exito" />
        <Resumen etiqueta="Pendiente" valor={total("pendiente")} color="text-peligro" />
        <Resumen etiqueta="Membresías" valor={porTipo("membresia")} color="text-marca-azul" />
        <Resumen etiqueta="Retrasos + reemplazos" valor={porTipo("retraso") + porTipo("reemplazo")} color="text-amber-700" />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-borde bg-superficie shadow-suave">
        <table className="w-full text-sm">
          <thead className="border-b border-borde text-left text-tenue">
            <tr>
              <th className="px-4 py-3 font-medium">Miembro</th>
              <th className="px-4 py-3 font-medium">Concepto</th>
              <th className="px-4 py-3 font-medium">Monto</th>
              <th className="px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3 text-right font-medium">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-borde">
            {cargos.map((c) => (
              <tr key={c.id} className="hover:bg-fondo">
                <td className="px-4 py-3 text-marca-marino">{c.perfiles?.nombre_completo ?? "—"}</td>
                <td className="px-4 py-3 text-tenue">{ETIQUETA[c.tipo as keyof typeof ETIQUETA]}</td>
                <td className="px-4 py-3 font-medium text-marca-marino">{formatoDinero(c.monto)}</td>
                <td className="px-4 py-3 text-tenue">{formatoFecha(c.creado_en)}</td>
                <td className="px-4 py-3 text-right"><BotonCargoPagado id={c.id} pagado={c.estado === "pagado"} /></td>
              </tr>
            ))}
            {cargos.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-tenue">Sin cargos.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Resumen({ etiqueta, valor, color }: { etiqueta: string; valor: number; color: string }) {
  return (
    <div className="rounded-2xl border border-borde bg-superficie p-5 shadow-suave">
      <p className="text-sm text-tenue">{etiqueta}</p>
      <p className={`font-display text-2xl font-extrabold ${color}`}>{formatoDinero(valor)}</p>
    </div>
  );
}
