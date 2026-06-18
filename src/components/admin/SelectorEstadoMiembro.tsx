"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { cambiarEstadoMiembro } from "@/app/(admin)/acciones";
import { useDic } from "@/lib/i18n/cliente";
import type { EstadoUsuario } from "@/types/modelos";

export function SelectorEstadoMiembro({
  perfilId,
  estadoActual,
}: {
  perfilId: string;
  estadoActual: EstadoUsuario;
}) {
  const dic = useDic();
  const OPCIONES: { valor: EstadoUsuario; etiqueta: string }[] = [
    { valor: "pendiente_pago", etiqueta: dic.admin.selectorEstado.pendiente_pago },
    { valor: "comprobante_en_revision", etiqueta: dic.admin.selectorEstado.comprobante_en_revision },
    { valor: "activo", etiqueta: dic.admin.selectorEstado.activo },
    { valor: "suspendido", etiqueta: dic.admin.selectorEstado.suspendido },
    { valor: "cancelado", etiqueta: dic.admin.selectorEstado.cancelado },
  ];
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
