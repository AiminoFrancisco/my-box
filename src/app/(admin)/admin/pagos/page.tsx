import { DollarSign } from "lucide-react";
import { crearClienteAdmin } from "@/lib/supabase/admin";
import { BotonCargoPagado } from "@/components/admin/BotonCargoPagado";
import { obtenerDic } from "@/lib/i18n/servidor";
import { formatoDinero, formatoFecha } from "@/lib/utils";

export function generateMetadata() {
  return { title: obtenerDic().admin.meta.pagos };
}

export default async function PagosPage() {
  const dic = obtenerDic();
  const ETIQUETA = dic.admin.pagos.tipo;
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
          <DollarSign className="h-6 w-6 text-marca-azul" /> {dic.admin.pagos.titulo}
        </h1>
        <p className="mt-1 text-tenue">{dic.admin.pagos.subtitulo}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Resumen etiqueta={dic.admin.pagos.resumen.cobrado} valor={total("pagado")} color="text-exito" />
        <Resumen etiqueta={dic.admin.pagos.resumen.pendiente} valor={total("pendiente")} color="text-peligro" />
        <Resumen etiqueta={dic.admin.pagos.resumen.membresias} valor={porTipo("membresia")} color="text-marca-azul" />
        <Resumen etiqueta={dic.admin.pagos.resumen.retrasosReemplazos} valor={porTipo("retraso") + porTipo("reemplazo")} color="text-amber-700" />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-borde bg-superficie shadow-suave">
        <table className="w-full text-sm">
          <thead className="border-b border-borde text-left text-tenue">
            <tr>
              <th className="px-4 py-3 font-medium">{dic.admin.pagos.colMiembro}</th>
              <th className="px-4 py-3 font-medium">{dic.admin.pagos.colConcepto}</th>
              <th className="px-4 py-3 font-medium">{dic.admin.pagos.colMonto}</th>
              <th className="px-4 py-3 font-medium">{dic.admin.pagos.colFecha}</th>
              <th className="px-4 py-3 text-right font-medium">{dic.admin.pagos.colEstado}</th>
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
            {cargos.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-tenue">{dic.admin.pagos.sinCargos}</td></tr>}
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
