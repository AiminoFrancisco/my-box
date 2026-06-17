"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, X, Loader2, AlertCircle } from "lucide-react";
import { guardarAnunciante } from "@/app/(admin)/acciones";
import { CATEGORIAS_ANUNCIANTES } from "@/lib/config";
import type { Anunciante } from "@/types/modelos";

export function ModalAnunciante({ anunciante }: { anunciante?: Anunciante }) {
  const router = useRouter();
  const esEdicion = !!anunciante;
  const [abierto, setAbierto] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendiente, startTransition] = useTransition();

  function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const r = await guardarAnunciante(anunciante?.id ?? null, fd);
      if (r.error) setError(r.error);
      else { setAbierto(false); router.refresh(); }
    });
  }

  return (
    <>
      {esEdicion ? (
        <button onClick={() => setAbierto(true)} className="rounded-lg p-2 text-tenue hover:bg-fondo hover:text-marca-azul" title="Editar"><Pencil className="h-4 w-4" /></button>
      ) : (
        <button onClick={() => setAbierto(true)} className="inline-flex items-center gap-2 rounded-full bg-gradiente-cta px-5 py-2.5 text-sm font-semibold text-marca-marino shadow-suave transition-all hover:shadow-glow active:scale-95">
          <Plus className="h-4 w-4" /> Nuevo anunciante
        </button>
      )}

      {abierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setAbierto(false)} />
          <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-superficie p-6 shadow-glow">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-marca-marino">{esEdicion ? "Editar anunciante" : "Nuevo anunciante"}</h2>
              <button onClick={() => setAbierto(false)} className="text-tenue hover:text-marca-marino"><X className="h-5 w-5" /></button>
            </div>

            <form onSubmit={enviar} className="space-y-3">
              <Campo etiqueta="Nombre *" name="nombre" required defaultValue={anunciante?.nombre} />
              <div>
                <span className="mb-1 block text-sm font-medium text-marca-marino">Categoría *</span>
                <select name="categoria" required defaultValue={anunciante?.categoria ?? ""} className="w-full rounded-xl border border-borde bg-fondo px-3 py-2 text-sm outline-none focus:border-marca-azul">
                  <option value="" disabled>Selecciona…</option>
                  {CATEGORIAS_ANUNCIANTES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <Campo etiqueta="Teléfono" name="telefono" defaultValue={anunciante?.telefono ?? ""} placeholder="+1 520-555-0000" />
              <Campo etiqueta="Sitio web" name="sitio_web" defaultValue={anunciante?.sitio_web ?? ""} placeholder="https://…" />
              <Campo etiqueta="URL del logo" name="logo_url" defaultValue={anunciante?.logo_url ?? ""} placeholder="https://…" />
              <div>
                <span className="mb-1 block text-sm font-medium text-marca-marino">Descripción</span>
                <textarea name="descripcion" rows={2} defaultValue={anunciante?.descripcion ?? ""} className="w-full rounded-xl border border-borde bg-fondo px-3 py-2 text-sm outline-none focus:border-marca-azul" />
              </div>
              <label className="flex items-center gap-2 text-sm text-marca-marino">
                <input type="checkbox" name="activo" defaultChecked={anunciante?.activo ?? true} className="h-4 w-4 rounded border-borde text-marca-azul" />
                Activo (visible en la home)
              </label>

              {error && <p className="flex items-center gap-2 rounded-lg bg-peligro/10 px-3 py-2 text-sm text-peligro"><AlertCircle className="h-4 w-4" /> {error}</p>}

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setAbierto(false)} className="rounded-full px-4 py-2 text-sm font-medium text-tenue hover:text-marca-marino">Cancelar</button>
                <button type="submit" disabled={pendiente} className="inline-flex items-center gap-2 rounded-full bg-marca-azul px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">
                  {pendiente && <Loader2 className="h-4 w-4 animate-spin" />} Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function Campo({ etiqueta, ...props }: { etiqueta: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-marca-marino">{etiqueta}</span>
      <input {...props} className="w-full rounded-xl border border-borde bg-fondo px-3 py-2 text-sm outline-none focus:border-marca-azul" />
    </label>
  );
}
