"use client";

/**
 * Selector de idioma (English / Español). Guarda la elección en cookie vía
 * server action y refresca para que los server components se re-rendericen en
 * el nuevo idioma. Inglés es el idioma por defecto.
 */
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { cambiarIdioma } from "@/lib/i18n/acciones";
import { LOCALES, ETIQUETAS_LOCALE, type Locale } from "@/lib/i18n/config";
import { useLocale } from "@/lib/i18n/cliente";
import { cn } from "@/lib/utils";

export function SelectorIdioma({
  className,
  tono = "claro",
}: {
  className?: string;
  /** "claro" sobre fondos claros, "oscuro" sobre fondos oscuros (footer). */
  tono?: "claro" | "oscuro";
}) {
  const locale = useLocale();
  const router = useRouter();
  const [pendiente, iniciar] = useTransition();

  function seleccionar(nuevo: Locale) {
    if (nuevo === locale || pendiente) return;
    iniciar(async () => {
      await cambiarIdioma(nuevo);
      router.refresh();
    });
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full p-0.5 text-xs font-medium ring-1",
        tono === "oscuro"
          ? "bg-white/10 ring-white/15"
          : "bg-superficie/70 ring-borde backdrop-blur",
        pendiente && "opacity-60",
        className
      )}
    >
      <Globe
        className={cn(
          "ml-1.5 h-3.5 w-3.5",
          tono === "oscuro" ? "text-white/60" : "text-tenue"
        )}
        aria-hidden
      />
      {LOCALES.map((l) => {
        const activo = l === locale;
        return (
          <button
            key={l}
            type="button"
            onClick={() => seleccionar(l)}
            disabled={pendiente}
            aria-pressed={activo}
            className={cn(
              "rounded-full px-2.5 py-1 transition-colors",
              activo
                ? "bg-marca-azul text-white shadow-sm"
                : tono === "oscuro"
                  ? "text-white/70 hover:text-white"
                  : "text-tenue hover:text-marca-azul"
            )}
          >
            {l.toUpperCase()}
            <span className="sr-only"> — {ETIQUETAS_LOCALE[l]}</span>
          </button>
        );
      })}
    </div>
  );
}
