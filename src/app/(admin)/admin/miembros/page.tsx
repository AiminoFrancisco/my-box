import Link from "next/link";
import { Users, ChevronRight } from "lucide-react";
import { crearClienteAdmin } from "@/lib/supabase/admin";
import { BadgeEstado } from "@/components/ui/BadgeEstado";
import { ESTADOS_USUARIO } from "@/lib/config";
import { obtenerDic } from "@/lib/i18n/servidor";
import { formatoFecha, cn } from "@/lib/utils";
import type { Perfil } from "@/types/modelos";

export function generateMetadata() {
  return { title: obtenerDic().admin.meta.miembros };
}

export default async function MiembrosPage({
  searchParams,
}: {
  searchParams: { estado?: string };
}) {
  const dic = obtenerDic();
  const FILTROS = [
    { valor: "todos", etiqueta: dic.admin.miembros.filtros.todos },
    { valor: "activo", etiqueta: dic.admin.miembros.filtros.activo },
    { valor: "comprobante_en_revision", etiqueta: dic.admin.miembros.filtros.comprobante_en_revision },
    { valor: "pendiente_pago", etiqueta: dic.admin.miembros.filtros.pendiente_pago },
    { valor: "suspendido", etiqueta: dic.admin.miembros.filtros.suspendido },
    { valor: "cancelado", etiqueta: dic.admin.miembros.filtros.cancelado },
  ];
  const filtro = searchParams.estado ?? "todos";
  const admin = crearClienteAdmin();
  let query = admin.from("perfiles").select("*").eq("rol", "miembro").order("creado_en", { ascending: false });
  if (filtro !== "todos") query = query.eq("estado", filtro);
  const { data } = await query;
  const miembros = (data ?? []) as unknown as Perfil[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 font-display text-2xl font-extrabold text-marca-marino">
          <Users className="h-6 w-6 text-marca-azul" /> {dic.admin.miembros.titulo}
        </h1>
        <p className="mt-1 text-tenue">{dic.admin.miembros.subtitulo}</p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        {FILTROS.map((f) => (
          <Link
            key={f.valor}
            href={f.valor === "todos" ? "/admin/miembros" : `/admin/miembros?estado=${f.valor}`}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-all",
              filtro === f.valor ? "bg-marca-marino text-white shadow-suave" : "border border-borde bg-superficie text-tenue hover:border-marca-azul hover:text-marca-azul"
            )}
          >
            {f.etiqueta}
          </Link>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-borde bg-superficie shadow-suave">
        {miembros.length === 0 ? (
          <p className="p-8 text-center text-sm text-tenue">{dic.admin.miembros.sinMiembros}</p>
        ) : (
          <ul className="divide-y divide-borde">
            {miembros.map((m) => {
              const meta = ESTADOS_USUARIO[m.estado];
              return (
                <li key={m.id}>
                  <Link href={`/admin/miembros/${m.id}`} className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-fondo">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-marca-marino">{m.nombre_completo}</p>
                      <p className="truncate text-sm text-tenue">{m.email} · {m.telefono}</p>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-4">
                      <span className="hidden text-xs text-tenue sm:block">{formatoFecha(m.creado_en)}</span>
                      <BadgeEstado color={meta.color as "exito" | "alerta" | "peligro"}>{dic.common.estados.usuario[m.estado]}</BadgeEstado>
                      <ChevronRight className="h-4 w-4 text-tenue" />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
