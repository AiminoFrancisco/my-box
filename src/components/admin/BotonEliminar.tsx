"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { useDic } from "@/lib/i18n/cliente";

/** Botón de borrar genérico con confirmación inline. */
export function BotonEliminar({
  accion,
  id,
  titulo,
}: {
  accion: (id: string) => Promise<{ ok?: boolean; error?: string }>;
  id: string;
  titulo?: string;
}) {
  const dic = useDic();
  const router = useRouter();
  const [confirmar, setConfirmar] = useState(false);
  const [pendiente, startTransition] = useTransition();

  function borrar() {
    startTransition(async () => {
      const r = await accion(id);
      if (r.ok) router.refresh();
      else { alert(r.error ?? dic.admin.botonEliminar.errorBorrar); setConfirmar(false); }
    });
  }

  if (confirmar) {
    return (
      <span className="inline-flex items-center gap-1">
        <button onClick={borrar} disabled={pendiente} className="rounded-lg bg-peligro px-2 py-1 text-xs font-semibold text-white disabled:opacity-50">
          {pendiente ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : dic.admin.botonEliminar.siBorrar}
        </button>
        <button onClick={() => setConfirmar(false)} className="rounded-lg px-2 py-1 text-xs text-tenue">{dic.admin.botonEliminar.no}</button>
      </span>
    );
  }

  return (
    <button onClick={() => setConfirmar(true)} className="rounded-lg p-2 text-tenue hover:bg-peligro/10 hover:text-peligro" title={titulo ?? dic.admin.botonEliminar.eliminar}>
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
