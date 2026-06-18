import {
  Hammer, Drill, Wrench, Ruler, Sprout, Car, SprayCan, Construction,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Ícono según categoría (para el placeholder cuando no hay foto).
// Tolerante a inglés y español por si alguna fila no está traducida.
const ICONO_CATEGORIA: Record<string, LucideIcon> = {
  Construction: Hammer,
  "Power tools": Drill,
  "Lawn & Garden": Sprout,
  Automotive: Car,
  "Hand tools": Wrench,
  Cleaning: SprayCan,
  Measuring: Ruler,
  // Alias en español (datos antiguos).
  Construcción: Hammer,
  Eléctrica: Drill,
  Jardinería: Sprout,
  Automotriz: Car,
  Manual: Wrench,
  Limpieza: SprayCan,
  Medición: Ruler,
};

/**
 * Imagen de una herramienta. Si tiene foto, la muestra (object-cover).
 * Si no, dibuja un placeholder lindo con gradiente + ícono de la categoría.
 */
export function ImagenHerramienta({
  src,
  alt,
  categoria,
  className,
}: {
  src?: string | null;
  alt: string;
  categoria?: string | null;
  className?: string;
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }

  const Icono = (categoria && ICONO_CATEGORIA[categoria]) || Construction;
  return (
    <div className={cn("relative flex h-full w-full items-center justify-center overflow-hidden bg-gradiente-marca", className)}>
      {/* Patrón sutil */}
      <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:16px_16px]" />
      <Icono className="relative h-1/3 w-1/3 max-h-20 max-w-20 text-white/90" strokeWidth={1.4} />
    </div>
  );
}
