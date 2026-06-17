"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { cambiarEstadoMiembro } from "@/app/(admin)/acciones";
import type { EstadoUsuario } from "@/types/modelos";

const OPCIONES: { valor: EstadoUsuario; etiqueta: string }[] = [
  { valor: "pendiente_pago", etiqueta: "Pendiente de pago" },
  { valor: "comprobante_en_revision", etiqueta: "En revisión" },
  { valor: "activo", etiqueta: "Activo" },
  { valor: "suspendido", etiqueta: "Suspendido" },
  { valor: "cancelado", etiqueta: "Cancelado" },
];

export function SelectorEstadoMiembro({
  perfilId,
  estadoActual,
}: {
  perfilId: string;
  estadoActual: EstadoUsuario;
}) {
  const router = useRouter();
  const [pendiente, startTransition] = useTransition();

  function cambiar(nuevo: EstadoUsuario) {
    if (nuevo === estadoActual) return;
    startTransition(async () => {
      await cambiarEstadoMiembro(perfilId, nuevo);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-2">
      <select
        defaultValue={estadoActual}
        onChange={(e) => cambiar(e.target.value as EstadoUsuario)}
        disabled={pendiente}
        className="rounded-xl border border-borde bg-superficie px-3 py-2 text-sm outline-none focus:border-marca-azul disabled:opacity-50"
      >
        {OPCIONES.map((o) => (
          <option key={o.valor} value={o.valor}>{o.etiqueta}</option>
        ))}
      </select>
      {pendiente && <Loader2 className="h-4 w-4 animate-spin text-marca-azul" />}
    </div>
  );
}
