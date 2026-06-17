"use client";

import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, X, Loader2, AlertCircle } from "lucide-react";
import { crearHerramienta, actualizarHerramienta } from "@/app/(admin)/acciones";
import { CampoImagen } from "@/components/admin/CampoImagen";
import { ESTADOS_HERRAMIENTA } from "@/lib/config";
import type { Herramienta } from "@/types/modelos";

const CATEGORIAS = ["Construcción", "Eléctrica", "Jardinería", "Automotriz", "Manual", "Limpieza", "Medición"];

export function ModalHerramienta({ herramienta }: { herramienta?: Herramienta }) {
  const router = useRouter();
  const esEdicion = !!herramienta;
  const [abierto, setAbierto] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendiente, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const r = esEdicion ? await actualizarHerramienta(herramienta!.id, fd) : await crearHerramienta(fd);
      if (r.error) setError(r.error);
      else { setAbierto(false); router.refresh(); }
    });
  }

  return (
    <>
      {esEdicion ? (
        <button onClick={() => setAbierto(true)} className="rounded-lg p-2 text-tenue hover:bg-fondo hover:text-marca-azul" title="Editar">
          <Pencil className="h-4 w-4" />
        </button>
      ) : (
        <button onClick={() => setAbierto(true)} className="inline-flex items-center gap-2 rounded-full bg-gradiente-cta px-5 py-2.5 text-sm font-semibold text-marca-marino shadow-suave transition-all hover:shadow-glow active:scale-95">
          <Plus className="h-4 w-4" /> Nueva herramienta
        </button>
      )}

      {abierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setAbierto(false)} />
          <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-superficie p-6 shadow-glow">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-marca-marino">
                {esEdicion ? "Editar herramienta" : "Nueva herramienta"}
              </h2>
              <button onClick={() => setAbierto(false)} className="text-tenue hover:text-marca-marino"><X className="h-5 w-5" /></button>
            </div>

            <form ref={formRef} onSubmit={enviar} className="space-y-3">
              {!esEdicion && (
                <Campo etiqueta="Número de inventario *" name="numero_inventario" required placeholder="INV-021" />
              )}
              <Campo etiqueta="Nombre *" name="nombre" required defaultValue={herramienta?.nombre} placeholder="Taladro inalámbrico" />
              <div>
                <span className="mb-1 block text-sm font-medium text-marca-marino">Descripción</span>
                <textarea name="descripcion" rows={2} defaultValue={herramienta?.descripcion ?? ""} className="w-full rounded-xl border border-borde bg-fondo px-3 py-2 text-sm outline-none focus:border-marca-azul" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="mb-1 block text-sm font-medium text-marca-marino">Categoría</span>
                  <input name="categoria" list="categorias" defaultValue={herramienta?.categoria ?? ""} className="w-full rounded-xl border border-borde bg-fondo px-3 py-2 text-sm outline-none focus:border-marca-azul" />
                  <datalist id="categorias">{CATEGORIAS.map((c) => <option key={c} value={c} />)}</datalist>
                </div>
                <Campo etiqueta="Condición" name="condicion" defaultValue={herramienta?.condicion ?? ""} placeholder="Buena" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Campo etiqueta="Valor reemplazo ($)" name="valor_reemplazo" type="number" step="0.01" defaultValue={herramienta?.valor_reemplazo} />
                <Campo etiqueta="Precio ($)" name="precio" type="number" step="0.01" defaultValue={herramienta?.precio ?? 0} />
              </div>
              <div>
                <span className="mb-1 block text-sm font-medium text-marca-marino">Estado</span>
                <select name="estado" defaultValue={herramienta?.estado ?? "disponible"} className="w-full rounded-xl border border-borde bg-fondo px-3 py-2 text-sm outline-none focus:border-marca-azul">
                  {Object.entries(ESTADOS_HERRAMIENTA).map(([v, m]) => <option key={v} value={v}>{m.etiqueta}</option>)}
                </select>
              </div>
              <CampoImagen fotoActual={herramienta?.foto_url} />
              <details className="text-sm">
                <summary className="cursor-pointer text-tenue">…o pegar una URL de imagen</summary>
                <input name="foto_url" defaultValue={herramienta?.foto_url ?? ""} placeholder="https://…" className="mt-2 w-full rounded-xl border border-borde bg-fondo px-3 py-2 text-sm outline-none focus:border-marca-azul" />
              </details>

              {error && (
                <p className="flex items-center gap-2 rounded-lg bg-peligro/10 px-3 py-2 text-sm text-peligro">
                  <AlertCircle className="h-4 w-4" /> {error}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setAbierto(false)} className="rounded-full px-4 py-2 text-sm font-medium text-tenue hover:text-marca-marino">Cancelar</button>
                <button type="submit" disabled={pendiente} className="inline-flex items-center gap-2 rounded-full bg-marca-azul px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">
                  {pendiente && <Loader2 className="h-4 w-4 animate-spin" />}
                  {esEdicion ? "Guardar" : "Crear y generar QR"}
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
