"use client";

import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { useDic } from "@/lib/i18n/cliente";
import { cn } from "@/lib/utils";

/**
 * Dropzone para la foto de la herramienta: arrastra y suelta, o toca para elegir.
 * Mantiene el archivo en un <input type=file name=foto_archivo> para que viaje
 * en el FormData del formulario.
 */
export function CampoImagen({ fotoActual }: { fotoActual?: string | null }) {
  const dic = useDic();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(fotoActual ?? null);
  const [arrastrando, setArrastrando] = useState(false);

  function setArchivo(file: File | null) {
    if (!file) return;
    // Pasa el archivo soltado al input para que se incluya en el FormData.
    if (inputRef.current) {
      const dt = new DataTransfer();
      dt.items.add(file);
      inputRef.current.files = dt.files;
    }
    setPreview(URL.createObjectURL(file));
  }

  function limpiar() {
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <span className="mb-1 block text-sm font-medium text-marca-marino">{dic.admin.campoImagen.fotoHerramienta}</span>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setArrastrando(true); }}
        onDragLeave={() => setArrastrando(false)}
        onDrop={(e) => {
          e.preventDefault();
          setArrastrando(false);
          setArchivo(e.dataTransfer.files?.[0] ?? null);
        }}
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-4 text-center transition-colors",
          arrastrando ? "border-marca-azul bg-marca-azul/10" : "border-borde bg-fondo hover:border-marca-azul"
        )}
      >
        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt={dic.admin.campoImagen.altPreview} className="h-32 w-full rounded-lg object-cover" />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); limpiar(); }}
              className="absolute right-2 top-2 rounded-full bg-marca-marino/80 p-1 text-white hover:bg-peligro"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <>
            <ImagePlus className="h-8 w-8 text-marca-azul" />
            <p className="text-sm text-tenue">{dic.admin.campoImagen.arrastra}<span className="font-semibold text-marca-azul">{dic.admin.campoImagen.tocaParaElegir}</span></p>
            <p className="text-xs text-tenue">{dic.admin.campoImagen.formatos}</p>
          </>
        )}
      </div>

      <input ref={inputRef} type="file" name="foto_archivo" accept="image/*" className="hidden" onChange={(e) => setArchivo(e.target.files?.[0] ?? null)} />
    </div>
  );
}
