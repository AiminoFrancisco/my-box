import { Megaphone, Globe, Phone } from "lucide-react";
import { crearClienteAdmin } from "@/lib/supabase/admin";
import { ModalAnunciante } from "@/components/admin/ModalAnunciante";
import { BotonEliminar } from "@/components/admin/BotonEliminar";
import { eliminarAnunciante } from "@/app/(admin)/acciones";
import { BadgeEstado } from "@/components/ui/BadgeEstado";
import { obtenerDic } from "@/lib/i18n/servidor";
import type { Anunciante } from "@/types/modelos";

export function generateMetadata() {
  return { title: obtenerDic().admin.meta.anunciantes };
}

export default async function AnunciantesPage() {
  const dic = obtenerDic();
  const admin = crearClienteAdmin();
  const { data } = await admin.from("anunciantes").select("*").order("categoria", { ascending: true });
  const anunciantes = (data ?? []) as unknown as Anunciante[];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 font-display text-2xl font-extrabold text-marca-marino">
            <Megaphone className="h-6 w-6 text-marca-azul" /> {dic.admin.anunciantes.titulo}
          </h1>
          <p className="mt-1 text-tenue">{dic.admin.anunciantes.subtitulo}</p>
        </div>
        <ModalAnunciante />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {anunciantes.map((a) => (
          <div key={a.id} className="rounded-2xl border border-borde bg-superficie p-5 shadow-suave">
            <div className="flex items-start gap-3">
              {a.logo_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={a.logo_url} alt={a.nombre} className="h-12 w-12 rounded-lg object-cover" />
              )}
              <div className="min-w-0 flex-1">
                <span className="text-xs font-semibold uppercase text-marca-azul">{a.categoria}</span>
                <h3 className="truncate font-display font-bold text-marca-marino">{a.nombre}</h3>
              </div>
              <div className="flex items-center">
                <ModalAnunciante anunciante={a} />
                <BotonEliminar accion={eliminarAnunciante} id={a.id} />
              </div>
            </div>
            {a.descripcion && <p className="mt-2 line-clamp-2 text-sm text-tenue">{a.descripcion}</p>}
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-tenue">
              {a.telefono && <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {a.telefono}</span>}
              {a.sitio_web && <span className="inline-flex items-center gap-1"><Globe className="h-3.5 w-3.5" /> {dic.admin.anunciantes.web}</span>}
              <BadgeEstado color={a.activo ? "exito" : "neutro"}>{a.activo ? dic.admin.anunciantes.activo : dic.admin.anunciantes.oculto}</BadgeEstado>
            </div>
          </div>
        ))}
        {anunciantes.length === 0 && <p className="text-sm text-tenue">{dic.admin.anunciantes.sinAnunciantes}</p>}
      </div>
    </div>
  );
}
