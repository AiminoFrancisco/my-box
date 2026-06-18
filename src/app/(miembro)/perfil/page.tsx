import Link from "next/link";
import { User, MapPin, Phone, Mail, Cake, UserCheck, IdCard, CreditCard } from "lucide-react";
import { obtenerPerfil } from "@/lib/auth";
import { crearClienteServidor } from "@/lib/supabase/server";
import { BadgeEstado } from "@/components/ui/BadgeEstado";
import { ESTADOS_USUARIO } from "@/lib/config";
import { formatoFecha } from "@/lib/utils";
import { obtenerDic } from "@/lib/i18n/servidor";
import { interpolar } from "@/lib/i18n/interpolar";

export const metadata = { title: "Profile · My Borrow Box" };

type IdRow = { id: string; tipo_persona: "titular" | "autorizada"; url_imagen: string };

export default async function PerfilPage() {
  const dic = obtenerDic();
  const perfil = await obtenerPerfil();
  if (!perfil) return null;

  const supabase = crearClienteServidor();
  const { data } = await supabase.from("identificaciones").select("id, tipo_persona, url_imagen");
  const ids = (data ?? []) as unknown as IdRow[];
  // Servidas por nuestra ruta (sin URLs firmadas que caduquen).
  const idsResueltas = ids.map((i) => ({ ...i, src: `/api/identificacion/${i.id}` }));

  const meta = ESTADOS_USUARIO[perfil.estado];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 font-display text-2xl font-extrabold text-marca-marino">
          <User className="h-6 w-6 text-marca-azul" /> {dic.member.perfil.titulo}
        </h1>
        <BadgeEstado color={meta.color as "exito" | "alerta" | "peligro"}>{dic.common.estados.usuario[perfil.estado]}</BadgeEstado>
      </div>

      {/* Datos del titular */}
      <div className="rounded-2xl border border-borde bg-superficie p-6 shadow-suave">
        <h2 className="font-display text-lg font-bold text-marca-marino">{dic.member.perfil.datosTitular}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Dato Icono={User} etiqueta={dic.member.perfil.nombre} valor={perfil.nombre_completo} />
          <Dato Icono={Mail} etiqueta={dic.member.perfil.correo} valor={perfil.email ?? "—"} />
          <Dato Icono={Phone} etiqueta={dic.member.perfil.telefono} valor={perfil.telefono ?? "—"} />
          <Dato Icono={Cake} etiqueta={dic.member.perfil.nacimiento} valor={perfil.fecha_nacimiento ?? "—"} />
          <Dato Icono={MapPin} etiqueta={dic.member.perfil.direccion} valor={perfil.direccion ?? "—"} />
          <Dato Icono={UserCheck} etiqueta={dic.member.perfil.personaAutorizada} valor={perfil.persona_autorizada_nombre ?? "—"} />
        </div>
        <p className="mt-4 text-xs text-tenue">
          {interpolar(dic.member.perfil.miembroDesde, { fecha: formatoFecha(perfil.creado_en) })}
        </p>
      </div>

      {/* Identificaciones */}
      <div className="rounded-2xl border border-borde bg-superficie p-6 shadow-suave">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold text-marca-marino">
          <IdCard className="h-5 w-5 text-marca-azul" /> {dic.member.perfil.identificaciones}
        </h2>
        {idsResueltas.length === 0 ? (
          <p className="mt-3 text-sm text-tenue">{dic.member.perfil.sinIdentificaciones}</p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {idsResueltas.map((i) => (
              <div key={i.id}>
                <p className="mb-1.5 text-sm font-medium capitalize text-marca-marino">{dic.member.perfil.tipoPersona[i.tipo_persona]}</p>
                {i.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={i.src} alt={dic.member.perfil.tipoPersona[i.tipo_persona]} className="h-40 w-full rounded-xl border border-borde object-cover" />
                ) : (
                  <div className="flex h-40 items-center justify-center rounded-xl bg-fondo text-sm text-tenue">{dic.member.perfil.noDisponible}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA membresía */}
      <Link
        href="/membresia"
        className="flex items-center justify-between rounded-2xl border border-borde bg-superficie p-5 shadow-suave transition-all hover:shadow-glow"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-marca-azul/10 text-marca-azul">
            <CreditCard className="h-6 w-6" />
          </span>
          <div>
            <p className="font-semibold text-marca-marino">{dic.member.perfil.ctaTitulo}</p>
            <p className="text-sm text-tenue">{dic.member.perfil.ctaTexto}</p>
          </div>
        </div>
        <span className="text-marca-azul">→</span>
      </Link>
    </div>
  );
}

function Dato({
  Icono,
  etiqueta,
  valor,
}: {
  Icono: React.ComponentType<{ className?: string }>;
  etiqueta: string;
  valor: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-fondo px-4 py-3">
      <Icono className="h-5 w-5 flex-shrink-0 text-marca-azul" />
      <div className="min-w-0">
        <p className="text-xs text-tenue">{etiqueta}</p>
        <p className="truncate font-medium text-marca-marino">{valor}</p>
      </div>
    </div>
  );
}
