import { cn } from "@/lib/utils";

/** Input de texto con etiqueta, estilo consistente. */
export function CampoTexto({
  etiqueta,
  className,
  ...props
}: { etiqueta: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-marca-marino">{etiqueta}</span>
      <input
        className={cn(
          "w-full rounded-xl border border-borde bg-superficie px-4 py-2.5 text-contenido shadow-sm outline-none transition-all placeholder:text-tenue/60 focus:border-marca-azul focus:ring-2 focus:ring-marca-azul/20",
          className
        )}
        {...props}
      />
    </label>
  );
}

/** Textarea con etiqueta. */
export function CampoArea({
  etiqueta,
  className,
  ...props
}: { etiqueta: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-marca-marino">{etiqueta}</span>
      <textarea
        className={cn(
          "w-full rounded-xl border border-borde bg-superficie px-4 py-2.5 text-contenido shadow-sm outline-none transition-all placeholder:text-tenue/60 focus:border-marca-azul focus:ring-2 focus:ring-marca-azul/20",
          className
        )}
        {...props}
      />
    </label>
  );
}
