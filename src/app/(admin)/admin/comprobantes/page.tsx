import { Receipt, FileText, ExternalLink } from "lucide-react";
import { crearClienteAdmin } from "@/lib/supabase/admin";
import { AccionesComprobante } from "@/components/admin/AccionesComprobante";
import { BadgeEstado } from "@/components/ui/BadgeEstado";
import { formatoDinero, formatoFecha } from "@/lib/utils";

export const metadata = { title: "Comprobantes · Admin" };

type Row = {
  id: string;
  url_archivo: string;
  monto: number;
  estado: "pendiente" | "aprobado" | "rechazado";
  creado_en: string;
  nota_admin: string | null;
  perfiles: { nombre_completo: string; email: string } | null;
};

export default async function ComprobantesPage() {
  const admin = crearClienteAdmin();
  // perfiles!perfil_id desambigua: comprobantes_pago tiene 2 FKs a perfiles
  // (perfil_id y revisado_por).
  const { data } = await admin
    .from("comprobantes_pago")
    .select("id, url_archivo, monto, estado, creado_en, nota_admin, perfiles!perfil_id(nombre_completo, email)")
    .order("creado_en", { ascending: false });

  const rows = (data ?? []) as unknown as Row[];
  // El archivo se sirve por nuestra ruta (sin URLs firmadas que caduquen).
  const conUrl = rows.map((r) => ({ ...r, url: `/api/comprobante/${r.id}` }));
  const pendientes = conUrl.filter((r) => r.estado === "pendiente");
  const revisados = conUrl.filter((r) => r.estado !== "pendiente");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="flex items-center gap-2 font-display text-2xl font-extrabold text-marca-marino">
          <Receipt className="h-6 w-6 text-marca-azul" /> Comprobantes de pago
        </h1>
        <p className="mt-1 text-tenue">Aprueba o rechaza los pagos de membresía.</p>
      </div>

      <section>
        <h2 className="mb-3 font-display text-lg font-bold text-marca-marino">Pendientes ({pendientes.length})</h2>
        {pendientes.length === 0 ? (
          <p className="rounded-xl bg-superficie p-6 text-center text-sm text-tenue shadow-suave">Nada por revisar. 🎉</p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {pendientes.map((r) => (
              <div key={r.id} className="flex flex-col gap-4 rounded-2xl border border-borde bg-superficie p-5 shadow-suave sm:flex-row">
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="group relative h-32 w-full flex-shrink-0 overflow-hidden rounded-xl bg-fondo sm:w-28">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {r.url ? <img src={r.url} alt="Comprobante" className="h-full w-full object-cover" /> : <FileText className="m-auto mt-12 h-8 w-8 text-tenue" />}
                  <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                    <ExternalLink className="h-5 w-5" />
                  </span>
                </a>
                <div className="flex-1">
                  <p className="font-semibold text-marca-marino">{r.perfiles?.nombre_completo ?? "—"}</p>
                  <p className="text-xs text-tenue">{r.perfiles?.email}</p>
                  <p className="mt-1 text-sm text-marca-marino">{formatoDinero(r.monto)} · {formatoFecha(r.creado_en)}</p>
                  <div className="mt-3">
                    <AccionesComprobante comprobanteId={r.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {revisados.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-lg font-bold text-marca-marino">Revisados</h2>
          <div className="overflow-x-auto rounded-2xl border border-borde bg-superficie shadow-suave">
            <table className="w-full text-sm">
              <thead className="border-b border-borde text-left text-tenue">
                <tr>
                  <th className="px-4 py-3 font-medium">Miembro</th>
                  <th className="px-4 py-3 font-medium">Monto</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3 font-medium">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borde">
                {revisados.map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-3 text-marca-marino">{r.perfiles?.nombre_completo ?? "—"}</td>
                    <td className="px-4 py-3 text-tenue">{formatoDinero(r.monto)}</td>
                    <td className="px-4 py-3">
                      <BadgeEstado color={r.estado === "aprobado" ? "exito" : "peligro"}>
                        {r.estado === "aprobado" ? "Aprobado" : "Rechazado"}
                      </BadgeEstado>
                    </td>
                    <td className="px-4 py-3 text-tenue">{formatoFecha(r.creado_en)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
