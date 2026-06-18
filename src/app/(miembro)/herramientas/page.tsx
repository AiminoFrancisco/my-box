import { Boxes } from "lucide-react";
import { obtenerPerfil } from "@/lib/auth";
import { crearClienteServidor } from "@/lib/supabase/server";
import { obtenerMisPrestamos, contarActivos } from "@/lib/miembro";
import { BotonAccionQR } from "@/components/miembro/BotonAccionQR";
import { BadgeEstado } from "@/components/ui/BadgeEstado";
import { ImagenHerramienta } from "@/components/ui/ImagenHerramienta";
import { AvisoMembresia } from "@/components/miembro/AvisoMembresia";
import { ESTADOS_HERRAMIENTA, CONFIG_DEFECTO } from "@/lib/config";
import { formatoDinero } from "@/lib/utils";
import { obtenerDic } from "@/lib/i18n/servidor";
import { interpolar } from "@/lib/i18n/interpolar";
import type { Herramienta } from "@/types/modelos";

export const metadata = { title: "Tools · My Borrow Box" };

export default async function HerramientasPage() {
  const dic = obtenerDic();
  const perfil = await obtenerPerfil();
  const activo = perfil?.estado === "activo";

  const supabase = crearClienteServidor();
  const { data } = await supabase
    .from("herramientas")
    .select("id, numero_inventario, nombre, descripcion, categoria, estado, valor_reemplazo, foto_url, qr_token")
    .order("numero_inventario", { ascending: true });
  const herramientas = (data ?? []) as unknown as Herramienta[];

  const prestamos = await obtenerMisPrestamos();
  const nActivos = contarActivos(prestamos);
  const sinCupo = nActivos >= CONFIG_DEFECTO.max_herramientas;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 font-display text-2xl font-extrabold text-marca-marino">
          <Boxes className="h-6 w-6 text-marca-azul" /> {dic.member.herramientas.titulo}
        </h1>
        <p className="mt-1 text-tenue">
          {interpolar(dic.member.herramientas.subtitulo, { max: CONFIG_DEFECTO.max_herramientas, activas: nActivos })}
        </p>
      </div>

      {perfil && <AvisoMembresia estado={perfil.estado} />}

      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
        {herramientas.map((h) => {
          const meta = ESTADOS_HERRAMIENTA[h.estado];
          const disponible = h.estado === "disponible";
          return (
            <article key={h.id} className="overflow-hidden rounded-2xl border border-borde bg-superficie shadow-suave">
              <div className="relative aspect-[4/3] bg-fondo">
                <ImagenHerramienta src={h.foto_url} alt={h.nombre} categoria={h.categoria} />
                <div className="absolute left-3 top-3">
                  <BadgeEstado color={meta.color as "exito" | "alerta" | "peligro"}>{dic.common.estados.herramienta[h.estado]}</BadgeEstado>
                </div>
              </div>
              <div className="p-3 sm:p-4">
                <div className="flex items-center justify-between text-[10px] sm:text-xs">
                  <span className="truncate font-medium uppercase tracking-wide text-marca-azul">{h.categoria}</span>
                  <span className="hidden text-tenue sm:inline">{h.numero_inventario}</span>
                </div>
                <h3 className="mt-1 line-clamp-2 font-display text-sm font-bold text-marca-marino sm:text-base">{h.nombre}</h3>
                <p className="mt-0.5 text-[11px] text-tenue sm:text-xs">{interpolar(dic.member.herramientas.reemplazo, { monto: formatoDinero(h.valor_reemplazo) })}</p>

                <div className="mt-3 flex justify-end">
                  {activo && disponible ? (
                    <BotonAccionQR token={h.qr_token} modo="sacar" deshabilitado={sinCupo} />
                  ) : (
                    <span className="text-[11px] text-tenue sm:text-xs">
                      {!activo ? dic.member.herramientas.activaMembresia : dic.member.herramientas.noDisponible}
                    </span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
