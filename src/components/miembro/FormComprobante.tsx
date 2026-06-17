"use client";

import { useState, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Upload, AlertCircle, CheckCircle2, Send } from "lucide-react";
import { subirComprobante, type EstadoComprobanteForm } from "@/app/(miembro)/membresia/acciones";

function BotonEnviar({ habilitado }: { habilitado: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || !habilitado}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-gradiente-cta px-6 py-3 font-semibold text-marca-marino shadow-suave transition-all hover:shadow-glow active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Send className="h-5 w-5" />
      {pending ? "Enviando…" : "Enviar comprobante"}
    </button>
  );
}

export function FormComprobante() {
  const [estado, accion] = useFormState<EstadoComprobanteForm, FormData>(subirComprobante, {});
  const [nombre, setNombre] = useState<string | null>(null);
  const ref = useRef<HTMLInputElement>(null);

  if (estado.ok) {
    return (
      <div className="flex items-start gap-3 rounded-xl bg-exito/10 p-4 text-sm text-exito">
        <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
        <div>
          <p className="font-semibold">¡Comprobante enviado!</p>
          <p className="text-exito/80">Lo estamos revisando. Te avisaremos por correo cuando se active tu membresía.</p>
        </div>
      </div>
    );
  }

  return (
    <form action={accion} className="space-y-4">
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className={`flex w-full items-center gap-3 rounded-xl border border-dashed px-4 py-4 text-left text-sm transition-colors ${
          nombre ? "border-marca-azul bg-marca-azul/5 text-marca-marino" : "border-borde bg-superficie text-tenue hover:border-marca-azul"
        }`}
      >
        <Upload className="h-5 w-5 flex-shrink-0 text-marca-azul" />
        <span className="truncate">{nombre ?? "Subir comprobante (imagen o PDF)"}</span>
      </button>
      <input
        ref={ref}
        type="file"
        name="comprobante"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => setNombre(e.target.files?.[0]?.name ?? null)}
      />

      {estado.error && (
        <p className="flex items-center gap-2 rounded-lg bg-peligro/10 px-3 py-2 text-sm text-peligro">
          <AlertCircle className="h-4 w-4 flex-shrink-0" /> {estado.error}
        </p>
      )}

      <BotonEnviar habilitado={!!nombre} />
    </form>
  );
}
