import Link from "next/link";
import { Boxes, QrCode } from "lucide-react";
import { crearClienteAdmin } from "@/lib/supabase/admin";
import { ModalHerramienta } from "@/components/admin/ModalHerramienta";
import { BotonEliminar } from "@/components/admin/BotonEliminar";
import { eliminarHerramienta } from "@/app/(admin)/acciones";
import { BadgeEstado } from "@/components/ui/BadgeEstado";
import { ImagenHerramienta } from "@/components/ui/ImagenHerramienta";
import { ESTADOS_HERRAMIENTA } from "@/lib/config";
import { formatoDinero } from "@/lib/utils";
import type { Herramienta } from "@/types/modelos";

export const metadata = { title: "Herramientas · Admin" };

export default async function HerramientasAdminPage() {
  const admin = crearClienteAdmin();
  const { data } = await admin.from("herramientas").select("*").order("numero_inventario", { ascending: true });
  const herramientas = (data ?? []) as unknown as Herramienta[];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 font-display text-2xl font-extrabold text-marca-marino">
            <Boxes className="h-6 w-6 text-marca-azul" /> Herramientas
          </h1>
          <p className="mt-1 text-tenue">{herramientas.length} herramientas en inventario.</p>
        </div>
        <ModalHerramienta />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-borde bg-superficie shadow-suave">
        <table className="w-full text-sm">
          <thead className="border-b border-borde text-left text-tenue">
            <tr>
              <th className="px-4 py-3 font-medium">QR</th>
              <th className="px-4 py-3 font-medium">Inventario</th>
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Categoría</th>
              <th className="px-4 py-3 font-medium">Reemplazo</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 text-right font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-borde">
            {herramientas.map((h) => {
              const meta = ESTADOS_HERRAMIENTA[h.estado];
              return (
                <tr key={h.id} className="hover:bg-fondo">
                  <td className="px-4 py-3">
                    {h.url_qr ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={h.url_qr} alt="QR" className="h-10 w-10 rounded" />
                    ) : (
                      <QrCode className="h-6 w-6 text-tenue" />
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-tenue">{h.numero_inventario}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-lg">
                        <ImagenHerramienta src={h.foto_url} alt={h.nombre} categoria={h.categoria} />
                      </div>
                      <span className="font-medium text-marca-marino">{h.nombre}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-tenue">{h.categoria ?? "—"}</td>
                  <td className="px-4 py-3 text-tenue">{formatoDinero(h.valor_reemplazo)}</td>
                  <td className="px-4 py-3"><BadgeEstado color={meta.color as "exito" | "alerta" | "peligro"}>{meta.etiqueta}</BadgeEstado></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/herramientas/${h.id}/qr`} className="rounded-lg p-2 text-tenue hover:bg-fondo hover:text-marca-azul" title="Ver/imprimir QR">
                        <QrCode className="h-4 w-4" />
                      </Link>
                      <ModalHerramienta herramienta={h} />
                      <BotonEliminar accion={eliminarHerramienta} id={h.id} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
