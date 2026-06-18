import { CreditCard, Building2, Hash, Mail, Banknote, CheckCircle2, Clock, XCircle } from "lucide-react";
import { obtenerPerfil } from "@/lib/auth";
import { obtenerConfigPublica } from "@/lib/configuracion";
import { crearClienteServidor } from "@/lib/supabase/server";
import { FormComprobante } from "@/components/miembro/FormComprobante";
import { BadgeEstado } from "@/components/ui/BadgeEstado";
import { ESTADOS_USUARIO } from "@/lib/config";
import { formatoDinero, formatoFecha } from "@/lib/utils";
import { obtenerDic } from "@/lib/i18n/servidor";
import { interpolar } from "@/lib/i18n/interpolar";
import type { ComprobantePago } from "@/types/modelos";

export const metadata = { title: "Membership · My Borrow Box" };

export default async function MembresiaPage() {
  const dic = obtenerDic();
  const perfil = await obtenerPerfil();
  const config = await obtenerConfigPublica();

  const supabase = crearClienteServidor();
  const { data: comprobantes } = await supabase
    .from("comprobantes_pago")
    .select("*")
    .order("creado_en", { ascending: false });

  const lista = (comprobantes ?? []) as unknown as ComprobantePago[];
  const monto = Number(config.monto_membresia ?? 29.99);
  const activo = perfil?.estado === "activo";
  const metaEstado = perfil ? ESTADOS_USUARIO[perfil.estado] : null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-marca-marino">{dic.member.membresia.titulo}</h1>
        <p className="mt-1 text-tenue">{dic.member.membresia.subtitulo}</p>
      </div>

      {/* Estado */}
      <div className="flex items-center justify-between rounded-2xl border border-borde bg-superficie p-5 shadow-suave">
        <div>
          <p className="text-sm text-tenue">{dic.member.membresia.estadoCuenta}</p>
          <div className="mt-1">
            {metaEstado && perfil && (
              <BadgeEstado color={metaEstado.color as "exito" | "alerta" | "peligro"}>
                {dic.common.estados.usuario[perfil.estado]}
              </BadgeEstado>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-tenue">{dic.member.membresia.membresiaMensual}</p>
          <p className="font-display text-2xl font-extrabold text-marca-marino">{formatoDinero(monto)}</p>
        </div>
      </div>

      {activo ? (
        <div className="flex items-start gap-3 rounded-2xl bg-exito/10 p-5 text-exito">
          <CheckCircle2 className="h-6 w-6 flex-shrink-0" />
          <div>
            <p className="font-semibold">{dic.member.membresia.activa.titulo}</p>
            <p className="text-sm text-exito/80">{dic.member.membresia.activa.texto}</p>
          </div>
        </div>
      ) : (
        <>
          {/* Datos bancarios */}
          <div className="rounded-2xl border border-borde bg-superficie p-6 shadow-suave">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-marca-marino">
              <Banknote className="h-5 w-5 text-marca-azul" /> {dic.member.membresia.pago.titulo}
            </h2>
            <p className="mt-1 text-sm text-tenue">
              {interpolar(dic.member.membresia.pago.instruccion, { monto: formatoDinero(monto) })}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <DatoBanco Icono={Building2} etiqueta={dic.member.membresia.pago.banco} valor={config.banco_nombre} />
              <DatoBanco Icono={Hash} etiqueta={dic.member.membresia.pago.routing} valor={config.banco_routing} />
              <DatoBanco Icono={Hash} etiqueta={dic.member.membresia.pago.cuenta} valor={config.banco_cuenta} />
              <DatoBanco Icono={Mail} etiqueta={dic.member.membresia.pago.zelle} valor={config.zelle_email} />
            </div>
          </div>

          {/* Subir comprobante */}
          <div className="rounded-2xl border border-borde bg-superficie p-6 shadow-suave">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-marca-marino">
              <CreditCard className="h-5 w-5 text-marca-azul" /> {dic.member.membresia.comprobante.titulo}
            </h2>
            <p className="mt-1 mb-4 text-sm text-tenue">
              {dic.member.membresia.comprobante.texto}
            </p>
            <FormComprobante />
          </div>
        </>
      )}

      {/* Historial de comprobantes */}
      {lista.length > 0 && (
        <div className="rounded-2xl border border-borde bg-superficie p-6 shadow-suave">
          <h2 className="font-display text-lg font-bold text-marca-marino">{dic.member.membresia.historial.titulo}</h2>
          <ul className="mt-4 space-y-3">
            {lista.map((c) => (
              <li key={c.id} className="flex items-center justify-between rounded-xl bg-fondo px-4 py-3">
                <div className="flex items-center gap-3">
                  {c.estado === "aprobado" ? (
                    <CheckCircle2 className="h-5 w-5 text-exito" />
                  ) : c.estado === "rechazado" ? (
                    <XCircle className="h-5 w-5 text-peligro" />
                  ) : (
                    <Clock className="h-5 w-5 text-alerta" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-marca-marino">{formatoDinero(c.monto)}</p>
                    <p className="text-xs text-tenue">{formatoFecha(c.creado_en)}</p>
                  </div>
                </div>
                <BadgeEstado color={c.estado === "aprobado" ? "exito" : c.estado === "rechazado" ? "peligro" : "alerta"}>
                  {c.estado === "aprobado" ? dic.member.membresia.historial.aprobado : c.estado === "rechazado" ? dic.member.membresia.historial.rechazado : dic.member.membresia.historial.enRevision}
                </BadgeEstado>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function DatoBanco({
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
