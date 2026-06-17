import { cn } from "@/lib/utils";

type Color = "exito" | "alerta" | "peligro" | "neutro" | "azul";

const COLORES: Record<Color, string> = {
  exito: "bg-exito/10 text-exito ring-exito/20",
  alerta: "bg-alerta/10 text-amber-700 ring-alerta/20",
  peligro: "bg-peligro/10 text-peligro ring-peligro/20",
  neutro: "bg-tenue/10 text-tenue ring-tenue/20",
  azul: "bg-marca-azul/10 text-marca-azul ring-marca-azul/20",
};

export function BadgeEstado({
  color = "neutro",
  children,
  className,
}: {
  color?: Color;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        COLORES[color],
        className
      )}
    >
      {children}
    </span>
  );
}
