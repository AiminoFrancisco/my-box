"use client";

import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, X, Loader2, AlertCircle } from "lucide-react";
import { crearHerramienta, actualizarHerramienta } from "@/app/(admin)/acciones";
import { CampoImagen } from "@/components/admin/CampoImagen";
import { ESTADOS_HERRAMIENTA } from "@/lib/config";
import { useDic } from "@/lib/i18n/cliente";
import type { Herramienta, EstadoHerramienta } from "@/types/modelos";

export function ModalHerramienta({ herramienta }: { herramienta?: Herramienta }) {
  const dic = useDic();
  const CATEGORIAS = dic.admin.modalHerramienta.categorias;
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
        <button onClick={() => setAbierto(true)} className="rounded-lg p-2 text-tenue hover:bg-fondo hover:text-marca-azul" title={dic.admin.modalHerramienta.editar}>
          <Pencil className="h-4 w-4" />
        </button>
      ) : (
        <button onClick={() => setAbierto(true)} className="inline-flex items-center gap-2 rounded-full bg-gradiente-cta px-5 py-2.5 text-sm font-semibold text-marca-marino shadow-suave transition-all hover:shadow-glow active:scale-95">
          <Plus className="h-4 w-4" /> {dic.admin.modalHerramienta.nueva}
        </button>
      )}

      {abierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setAbierto(false)} />
          <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-superficie p-6 shadow-glow">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-marca-marino">
                {esEdicion ? dic.admin.modalHerramienta.tituloEditar : dic.admin.modalHerramienta.tituloNueva}
              </h2>
              <button onClick={() => setAbierto(false)} className="text-tenue hover:text-marca-marino"><X className="h-5 w-5" /></button>
            </div>

            <form ref={formRef} onSubmit={enviar} className="space-y-3">
              {!esEdicion && (
                <Campo etiqueta={dic.admin.modalHerramienta.numeroInventario} name="numero_inventario" required placeholder={dic.admin.modalHerramienta.phNumeroInventario} />
              )}
              <Campo etiqueta={dic.admin.modalHerramienta.nombre} name="nombre" required defaultValue={herramienta?.nombre} placeholder={dic.admin.modalHerramienta.phNombre} />
              <div>
                <span className="mb-1 block text-sm font-medium text-marca-marino">{dic.admin.modalHerramienta.descripcion}</span>
                <textarea name="descripcion" rows={2} defaultValue={herramienta?.descripcion ?? ""} className="w-full rounded-xl border border-borde bg-fondo px-3 py-2 text-sm outline-none focus:border-marca-azul" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="mb-1 block text-sm font-medium text-marca-marino">{dic.admin.modalHerramienta.categoria}</span>
                  <input name="categoria" list="categorias" defaultValue={herramienta?.categoria ?? ""} className="w-full rounded-xl border border-borde bg-fondo px-3 py-2 text-sm outline-none focus:border-marca-azul" />
                  <datalist id="categorias">{CATEGORIAS.map((c) => <option key={c} value={c} />)}</datalist>
                </div>
                <Campo etiqueta={dic.admin.modalHerramienta.condicion} name="condicion" defaultValue={herramienta?.condicion ?? ""} placeholder={dic.admin.modalHerramienta.phCondicion} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Campo etiqueta={dic.admin.modalHerramienta.valorReemplazo} name="valor_reemplazo" type="number" step="0.01" defaultValue={herramienta?.valor_reemplazo} />
                <Campo etiqueta={dic.admin.modalHerramienta.precio} name="precio" type="number" step="0.01" defaultValue={herramienta?.precio ?? 0} />
              </div>
              <div>
                <span className="mb-1 block text-sm font-medium text-marca-marino">{dic.admin.modalHerramienta.estado}</span>
                <select name="estado" defaultValue={herramienta?.estado ?? "disponible"} className="w-full rounded-xl border border-borde bg-fondo px-3 py-2 text-sm outline-none focus:border-marca-azul">
                  {Object.keys(ESTADOS_HERRAMIENTA).map((v) => <option key={v} value={v}>{dic.common.estados.herramienta[v as EstadoHerramienta]}</option>)}
                </select>
              </div>
              <CampoImagen fotoActual={herramienta?.foto_url} />
              <details className="text-sm">
                <summary className="cursor-pointer text-tenue">{dic.admin.modalHerramienta.oPegarUrl}</summary>
                <input name="foto_url" defaultValue={herramienta?.foto_url ?? ""} placeholder={dic.admin.modalHerramienta.phUrl} className="mt-2 w-full rounded-xl border border-borde bg-fondo px-3 py-2 text-sm outline-none focus:border-marca-azul" />
              </details>

              {error && (
                <p className="flex items-center gap-2 rounded-lg bg-peligro/10 px-3 py-2 text-sm text-peligro">
                  <AlertCircle className="h-4 w-4" /> {error}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setAbierto(false)} className="rounded-full px-4 py-2 text-sm font-medium text-tenue hover:text-marca-marino">{dic.admin.modalHerramienta.cancelar}</button>
                <button type="submit" disabled={pendiente} className="inline-flex items-center gap-2 rounded-full bg-marca-azul px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">
                  {pendiente && <Loader2 className="h-4 w-4 animate-spin" />}
                  {esEdicion ? dic.admin.modalHerramienta.guardar : dic.admin.modalHerramienta.crearGenerarQr}
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
