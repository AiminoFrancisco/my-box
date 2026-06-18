"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { alternarCargoPagado } from "@/app/(admin)/acciones";
import { useDic } from "@/lib/i18n/cliente";

export function BotonCargoPagado({ id, pagado }: { id: string; pagado: boolean }) {
  const dic = useDic();
  const router = useRouter();
  const [pendiente, startTransition] = useTransition();

  function alternar() {
    startTransition(async () => {
      await alternarCargoPagado(id, !pagado);
      router.refresh();
    });
  }

  return (
    <button
      onClick={alternar}
      disabled={pendiente}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors disabled:opacity-50 ${
        pagado ? "bg-exito/10 text-exito hover:bg-exito/20" : "bg-amber-100 text-amber-700 hover:bg-amber-200"
      }`}
    >
      {pendiente && <Loader2 className="h-3 w-3 animate-spin" />}
      {pagado ? dic.admin.botonCargo.pagado : dic.admin.botonCargo.marcarPagado}
    </button>
  );
}
