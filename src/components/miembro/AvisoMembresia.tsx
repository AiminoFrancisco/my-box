import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";
import type { EstadoUsuario } from "@/types/modelos";

const MENSAJES: Partial<Record<EstadoUsuario, { titulo: string; texto: string }>> = {
  pendiente_pago: {
    titulo: "Tu membresía está pendiente de pago",
    texto: "Realiza el pago y sube tu comprobante para activar tu cuenta y empezar a sacar herramientas.",
  },
  comprobante_en_revision: {
    titulo: "Estamos revisando tu comprobante",
    texto: "En cuanto lo aprobemos, te avisaremos por correo y desbloquearás todo.",
  },
  suspendido: {
    titulo: "Tu membresía está suspendida",
    texto: "Tienes cargos pendientes o un tema con tu cuenta. Regulariza tu pago para reactivarla.",
  },
  cancelado: {
    titulo: "Tu membresía está cancelada",
    texto: "Vuelve a activar tu membresía para seguir usando la bodega.",
  },
};

/** Banner de aviso para miembros que NO están activos. */
export function AvisoMembresia({ estado }: { estado: EstadoUsuario }) {
  if (estado === "activo") return null;
  const m = MENSAJES[estado];
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
