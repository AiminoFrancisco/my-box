"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Loader2 } from "lucide-react";
import { aprobarComprobante, rechazarComprobante } from "@/app/(admin)/acciones";
import { useDic } from "@/lib/i18n/cliente";

export function AccionesComprobante({ comprobanteId }: { comprobanteId: string }) {
  const dic = useDic();
  const router = useRouter();
  const [pendiente, startTransition] = useTransition();
  const [rechazando, setRechazando] = useState(false);
  const [nota, setNota] = useState("");
  const [error, setError] = useState<string | null>(null);

  function aprobar() {
    setError(null);
    startTransition(async () => {
      const r = await aprobarComprobante(comprobanteId);
      if (r.error) setError(r.error);
      else router.refresh();
    });
  }

  function rechazar() {
    setError(null);
    startTransition(async () => {
      const r = await rechazarComprobante(comprobanteId, nota.trim() || dic.admin.acciones.motivoNoEspecificado);
      if (r.error) setError(r.error);
      else { setRechazando(false); router.refresh(); }
    });
  }

  return (
    <div className="space-y-2">
      {!rechazando ? (
        <div className="flex gap-2">
          <button
            onClick={aprobar}
            disabled={pendiente}
            className="inline-flex items-center gap-1.5 rounded-full bg-exito px-4 py-2 text-sm font-semibold text-white transition-all hover:brightness-105 active:scale-95 disabled:opacity-50"
          >
            {pendiente ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} {dic.admin.accionesComprobante.aprobar}
          </button>
          <button
            onClick={() => setRechazando(true)}
            disabled={pendiente}
            className="inline-flex items-center gap-1.5 rounded-full border border-peligro/40 px-4 py-2 text-sm font-semibold text-peligro transition-colors hover:bg-peligro/10 disabled:opacity-50"
          >
            <X className="h-4 w-4" /> {dic.admin.accionesComprobante.rechazar}
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <input
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder={dic.admin.accionesComprobante.placeholderMotivo}
            className="w-full rounded-lg border border-borde bg-fondo px-3 py-2 text-sm outline-none focus:border-marca-azul"
          />
          <div className="flex gap-2">
            <button
              onClick={rechazar}
              disabled={pendiente}
              className="inline-flex items-center gap-1.5 rounded-full bg-peligro px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {pendiente ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />} {dic.admin.accionesComprobante.confirmarRechazo}
            </button>
            <button onClick={() => setRechazando(false)} className="rounded-full px-4 py-2 text-sm font-medium text-tenue hover:text-marca-marino">
              {dic.admin.accionesComprobante.cancelar}
            </button>
          </div>
        </div>
      )}
      {error && <p className="text-xs text-peligro">{error}</p>}
    </div>
  );
}
