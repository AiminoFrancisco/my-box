import { DoorOpen, History } from "lucide-react";
import { obtenerPerfil } from "@/lib/auth";
import { obtenerCodigoPuerta } from "@/lib/configuracion";
import { crearClienteServidor } from "@/lib/supabase/server";
import { CodigoPuerta } from "@/components/miembro/CodigoPuerta";
import { AvisoMembresia } from "@/components/miembro/AvisoMembresia";
import { formatoFecha } from "@/lib/utils";

export const metadata = { title: "Acceso a bodega · My Borrow Box" };

type Acceso = { id: string; tipo: "entrada" | "salida"; creado_en: string };

export default async function BodegaPage() {
  const perfil = await obtenerPerfil();
  const codigo = perfil ? await obtenerCodigoPuerta(perfil.id) : null;

  const supabase = crearClienteServidor();
  const { data } = await supabase
    .from("accesos_bodega")
    .select("id, tipo, creado_en")
    .order("creado_en", { ascending: false })
    .limit(8);
  const accesos = (data ?? []) as unknown as Acceso[];

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradiente-marca text-white shadow-glow">
          <DoorOpen className="h-6 w-6" />
        </span>
        <h1 className="mt-3 font-display text-2xl font-extrabold text-marca-marino">Acceso a la bodega</h1>
        <p className="mt-1 text-tenue">Usa este código en el candado de la puerta.</p>
      </div>

      {perfil && <AvisoMembresia estado={perfil.estado} />}

      <CodigoPuerta codigo={codigo} />

      {accesos.length > 0 && (
        <div className="rounded-2xl border border-borde bg-superficie p-5 shadow-suave">
          <h2 className="flex items-center gap-2 font-display font-bold text-marca-marino">
            <History className="h-4 w-4 text-marca-azul" /> Tus últimos accesos
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {accesos.map((a) => (
              <li key={a.id} className="flex items-center justify-between">
                <span className={a.tipo === "entrada" ? "text-exito" : "text-tenue"}>
                  {a.tipo === "entrada" ? "Entrada" : "Salida"}
                </span>
                <span className="text-tenue">{formatoFecha(a.creado_en)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
