import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, User, Mail, Phone, MapPin, Cake, UserCheck } from "lucide-react";
import { crearClienteAdmin } from "@/lib/supabase/admin";
import { SelectorEstadoMiembro } from "@/components/admin/SelectorEstadoMiembro";
import { BadgeEstado } from "@/components/ui/BadgeEstado";
import { ESTADOS_USUARIO } from "@/lib/config";
import { obtenerDic } from "@/lib/i18n/servidor";
import { formatoDinero, formatoFecha } from "@/lib/utils";
import type { Perfil, TipoPersona, EstadoPrestamo } from "@/types/modelos";

type IdRow = { id: string; tipo_persona: string; url_imagen: string };

export default async function DetalleMiembro({ params }: { params: { id: string } }) {
  const dic = obtenerDic();
  const admin = crearClienteAdmin();
  const { data } = await admin.from("perfiles").select("*").eq("id", params.id).single();
  if (!data) notFound();
  const perfil = data as unknown as Perfil;

  const [{ data: ids }, { data: prestamos }, { data: cargos }] = await Promise.all([
    admin.from("identificaciones").select("id, tipo_persona, url_imagen").eq("perfil_id", params.id),
    admin.from("prestamos").select("id, estado, fecha_prestamo, herramientas(nombre)").eq("perfil_id", params.id).order("fecha_prestamo", { ascending: false }).limit(10),
    admin.from("cargos").select("id, tipo, monto, estado, creado_en").eq("perfil_id", params.id).order("creado_en", { ascending: false }),
  ]);

  const idsFirmadas = ((ids ?? []) as IdRow[]).map((i) => ({ ...i, src: `/api/identificacion/${i.id}` }));
  const meta = ESTADOS_USUARIO[perfil.estado];
  const totalPendiente = ((cargos ?? []) as any[]).filter((c) => c.estado === "pendiente").reduce((s, c) => s + Number(c.monto), 0);

  return (
    <div className="space-y-6">
      <Link href="/admin/miembros" className="inline-flex items-center gap-1 text-sm text-tenue hover:text-marca-azul">
        <ArrowLeft className="h-4 w-4" /> {dic.admin.miembros.detalle.volver}
      </Link>

      <div className="flex flex-col gap-4 rounded-2xl border border-borde bg-superficie p-6 shadow-suave sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-marca-marino">{perfil.nombre_completo}</h1>
          <div className="mt-2"><BadgeEstado color={meta.color as "exito" | "alerta" | "peligro"}>{dic.common.estados.usuario[perfil.estado]}</BadgeEstado></div>
        </div>
        <div>
          <p className="mb-1.5 text-xs text-tenue">{dic.admin.miembros.detalle.cambiarEstado}</p>
          <SelectorEstadoMiembro perfilId={perfil.id} estadoActual={perfil.estado} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-borde bg-superficie p-6 shadow-suave">
          <h2 className="font-display text-lg font-bold text-marca-marino">{dic.admin.miembros.detalle.datos}</h2>
          <div className="mt-4 space-y-3 text-sm">
            <Fila Icono={Mail} v={perfil.email ?? "—"} />
            <Fila Icono={Phone} v={perfil.telefono ?? "—"} />
            <Fila Icono={MapPin} v={perfil.direccion ?? "—"} />
            <Fila Icono={Cake} v={perfil.fecha_nacimiento ?? "—"} />
            <Fila Icono={UserCheck} v={dic.admin.miembros.detalle.autorizada.replace("{nombre}", perfil.persona_autorizada_nombre ?? "—")} />
            <Fila Icono={User} v={dic.admin.miembros.detalle.miembroDesde.replace("{fecha}", formatoFecha(perfil.creado_en))} />
          </div>
        </div>

        <div className="rounded-2xl border border-borde bg-superficie p-6 shadow-suave">
          <h2 className="font-display text-lg font-bold text-marca-marino">{dic.admin.miembros.detalle.identificaciones}</h2>
          {idsFirmadas.length === 0 ? (
            <p className="mt-3 text-sm text-tenue">{dic.admin.miembros.detalle.sinIdentificaciones}</p>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-3">
              {idsFirmadas.map((i) => {
                const tipoLabel = dic.admin.miembros.tipoPersona[i.tipo_persona as TipoPersona] ?? i.tipo_persona;
                return (
                <a key={i.id} href={i.src} target="_blank" rel="noopener noreferrer">
                  <p className="mb-1 text-xs font-medium text-tenue">{tipoLabel}</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={i.src} alt={tipoLabel} className="h-28 w-full rounded-lg border border-borde object-cover" />
                </a>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-borde bg-superficie p-6 shadow-suave">
          <h2 className="font-display text-lg font-bold text-marca-marino">{dic.admin.miembros.detalle.prestamosRecientes}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {((prestamos ?? []) as any[]).map((p) => (
              <li key={p.id} className="flex justify-between">
                <span className="text-marca-marino">{p.herramientas?.nombre ?? "—"}</span>
                <span className="text-tenue">{dic.admin.estadoPrestamo[p.estado as EstadoPrestamo] ?? p.estado}</span>
              </li>
            ))}
            {(!prestamos || prestamos.length === 0) && <li className="text-tenue">{dic.admin.miembros.detalle.sinPrestamos}</li>}
          </ul>
        </div>

        <div className="rounded-2xl border border-borde bg-superficie p-6 shadow-suave">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-marca-marino">{dic.admin.miembros.detalle.cargos}</h2>
            {totalPendiente > 0 && <span className="text-sm font-semibold text-peligro">{dic.admin.miembros.detalle.pendiente.replace("{monto}", formatoDinero(totalPendiente))}</span>}
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            {((cargos ?? []) as any[]).map((c) => (
              <li key={c.id} className="flex justify-between">
                <span className="text-marca-marino">{dic.admin.pagos.tipo[c.tipo as keyof typeof dic.admin.pagos.tipo] ?? c.tipo} · {formatoDinero(c.monto)}</span>
                <span className={c.estado === "pagado" ? "text-exito" : "text-amber-700"}>{c.estado === "pagado" ? dic.admin.cargoEstado.pagado : dic.admin.cargoEstado.pendiente}</span>
              </li>
            ))}
            {(!cargos || cargos.length === 0) && <li className="text-tenue">{dic.admin.miembros.detalle.sinCargos}</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Fila({ Icono, v }: { Icono: React.ComponentType<{ className?: string }>; v: string }) {
  return (
    <p className="flex items-center gap-2 text-tenue">
      <Icono className="h-4 w-4 flex-shrink-0 text-marca-azul" /> <span className="text-marca-marino">{v}</span>
    </p>
  );
}
