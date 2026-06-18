"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Wrench, LayoutDashboard, Boxes, ScanLine, Clock, DoorOpen,
  CreditCard, User, LogOut, ShieldCheck,
} from "lucide-react";
import { cerrarSesion } from "@/app/(auth)/acciones";
import { BadgeEstado } from "@/components/ui/BadgeEstado";
import { ESTADOS_USUARIO } from "@/lib/config";
import { cn } from "@/lib/utils";
import { useDic } from "@/lib/i18n/cliente";
import type { EstadoUsuario } from "@/types/modelos";

export function MiembroShell({
  nombre,
  estado,
  esAdmin,
  children,
}: {
  nombre: string;
  estado: EstadoUsuario;
  esAdmin: boolean;
  children: React.ReactNode;
}) {
  const dic = useDic();
  const pathname = usePathname();
  const meta = ESTADOS_USUARIO[estado];

  // Navegación completa (escritorio)
  const ENLACES = [
    { href: "/panel", texto: dic.member.shell.nav.inicio, Icono: LayoutDashboard },
    { href: "/herramientas", texto: dic.member.shell.nav.herramientas, Icono: Boxes },
    { href: "/escanear", texto: dic.member.shell.nav.escanear, Icono: ScanLine },
    { href: "/mis-prestamos", texto: dic.member.shell.nav.misPrestamos, Icono: Clock },
    { href: "/bodega", texto: dic.member.shell.nav.bodega, Icono: DoorOpen },
    { href: "/membresia", texto: dic.member.shell.nav.membresia, Icono: CreditCard },
    { href: "/perfil", texto: dic.member.shell.nav.perfil, Icono: User },
  ];

  // Barra inferior (móvil) — 5 accesos, "Escanear" elevado al centro.
  const TABS = [
    { href: "/panel", texto: dic.member.shell.tabs.inicio, Icono: LayoutDashboard },
    { href: "/herramientas", texto: dic.member.shell.tabs.herramientas, Icono: Boxes },
    { href: "/escanear", texto: dic.member.shell.tabs.escanear, Icono: ScanLine, centro: true },
    { href: "/mis-prestamos", texto: dic.member.shell.tabs.misPrestamos, Icono: Clock },
    { href: "/perfil", texto: dic.member.shell.tabs.perfil, Icono: User },
  ];

  return (
    <div className="min-h-screen bg-fondo pb-24 lg:pb-0">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-borde bg-superficie/90 backdrop-blur-lg">
        <div className="contenedor flex h-16 items-center justify-between gap-3">
          <Link href="/panel" className="flex items-center gap-2 font-display font-extrabold text-marca-marino">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradiente-marca text-white">
              <Wrench className="h-5 w-5" />
            </span>
            <span className="hidden sm:inline">My Borrow Box</span>
          </Link>

          {/* Nav escritorio */}
          <nav className="hidden items-center gap-1 lg:flex">
            {ENLACES.map((e) => {
              const activo = pathname === e.href;
              return (
                <Link
                  key={e.href}
                  href={e.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                    activo ? "bg-marca-azul/10 text-marca-azul" : "text-tenue hover:bg-fondo hover:text-marca-marino"
                  )}
                >
                  <e.Icono className="h-4 w-4" /> {e.texto}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            {esAdmin && (
              <Link href="/admin" className="hidden items-center gap-1 rounded-full bg-marca-marino px-3 py-1.5 text-xs font-semibold text-white sm:inline-flex">
                <ShieldCheck className="h-3.5 w-3.5" /> {dic.member.shell.admin}
              </Link>
            )}
            {/* La etiqueta de estado lleva a la membresía (para pagar/ver estado) */}
            <Link href="/membresia" className="hidden sm:block">
              <BadgeEstado color={meta.color as "exito" | "alerta" | "peligro"}>{dic.common.estados.usuario[estado]}</BadgeEstado>
            </Link>
            <form action={cerrarSesion}>
              <button className="rounded-full p-2 text-tenue hover:bg-fondo hover:text-peligro" title={dic.member.shell.cerrarSesion} aria-label={dic.member.shell.cerrarSesion}>
                <LogOut className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="contenedor py-6 sm:py-8">{children}</main>

      {/* Barra inferior móvil (estilo app) */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-borde bg-superficie/95 backdrop-blur-lg lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5 items-end px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
          {TABS.map((t) => {
            const activo = pathname === t.href;
            if (t.centro) {
              return (
                <Link key={t.href} href={t.href} className="flex flex-col items-center">
                  <span className="-mt-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradiente-marca text-white shadow-glow ring-4 ring-fondo transition-transform active:scale-95">
                    <t.Icono className="h-7 w-7" />
                  </span>
                  <span className="mt-0.5 text-[10px] font-semibold text-marca-azul">{t.texto}</span>
                </Link>
              );
            }
            return (
              <Link key={t.href} href={t.href} className="flex flex-col items-center gap-0.5 py-1">
                <t.Icono className={cn("h-5 w-5", activo ? "text-marca-azul" : "text-tenue")} />
                <span className={cn("text-[10px] font-medium", activo ? "text-marca-azul" : "text-tenue")}>{t.texto}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
