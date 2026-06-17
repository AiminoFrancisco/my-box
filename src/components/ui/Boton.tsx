import Link from "next/link";
import { cn } from "@/lib/utils";

type Variante = "primario" | "secundario" | "fantasma" | "marino";
type Tamano = "sm" | "md" | "lg";

const VARIANTES: Record<Variante, string> = {
  // CTA principal ámbar "construcción"
  primario:
    "bg-gradiente-cta text-marca-marino shadow-suave hover:shadow-glow hover:brightness-105",
  // Azul de marca
  secundario:
    "bg-marca-azul text-white shadow-suave hover:shadow-glow hover:brightness-105",
  // Contorno
  fantasma:
    "border border-borde bg-superficie/60 text-contenido hover:border-marca-azul hover:text-marca-azul backdrop-blur",
  // Azul marino sólido
  marino: "bg-marca-marino text-white hover:bg-marca-marino/90 shadow-suave",
};

const TAMANOS: Record<Tamano, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm sm:text-base",
  lg: "px-7 py-3.5 text-base sm:text-lg",
};

type PropsBase = {
  variante?: Variante;
  tamano?: Tamano;
  className?: string;
  children: React.ReactNode;
};

const claseBase =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-marca-azul focus-visible:ring-offset-2";

/** Botón como <Link> (navegación). */
export function BotonLink({
  href,
  variante = "primario",
  tamano = "md",
  className,
  children,
  ...rest
}: PropsBase & { href: string } & React.ComponentProps<typeof Link>) {
  return (
    <Link
      href={href}
      className={cn(claseBase, VARIANTES[variante], TAMANOS[tamano], className)}
      {...rest}
    >
      {children}
    </Link>
  );
}

/** Botón como <button> (acciones). */
export function Boton({
  variante = "primario",
  tamano = "md",
  className,
  children,
  ...rest
}: PropsBase & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(claseBase, VARIANTES[variante], TAMANOS[tamano], className)}
      {...rest}
    >
      {children}
    </button>
  );
}
