import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { obtenerDic } from "@/lib/i18n/servidor";
import type { EstadoUsuario } from "@/types/modelos";

type ClaveAviso = "pendiente_pago" | "comprobante_en_revision" | "suspendido" | "cancelado";

/** Banner de aviso para miembros que NO están activos. */
export function AvisoMembresia({ estado }: { estado: EstadoUsuario }) {
  if (estado === "activo") return null;
  const dic = obtenerDic();
  const avisos = dic.member.aviso;
  const m = (estado in avisos ? avisos[estado as ClaveAviso] : null);
  if (!m) return null;

  return (
    <Link
      href="/membresia"
      className="group flex items-center gap-4 rounded-2xl border border-alerta/30 bg-alerta/5 p-5 transition-colors hover:bg-alerta/10"
    >
      <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-alerta/15 text-amber-700">
        <AlertTriangle className="h-6 w-6" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-marca-marino">{m.titulo}</p>
        <p className="text-sm text-tenue">{m.texto}</p>
      </div>
      <ArrowRight className="h-5 w-5 flex-shrink-0 text-amber-700 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}
