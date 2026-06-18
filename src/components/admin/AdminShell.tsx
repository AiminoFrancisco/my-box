"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Wrench, LayoutDashboard, Receipt, Users, Boxes, DollarSign,
  BarChart3, Megaphone, Settings, LogOut, Menu, X, ExternalLink, BookOpen,
} from "lucide-react";
import { cerrarSesion } from "@/app/(auth)/acciones";
import { useDic } from "@/lib/i18n/cliente";
import { cn } from "@/lib/utils";

export function AdminShell({
  nombre,
  comprobantesPendientes,
  children,
}: {
  nombre: string;
  comprobantesPendientes: number;
  children: React.ReactNode;
}) {
  const dic = useDic();
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);

  const ENLACES = [
    { href: "/admin", texto: dic.admin.shell.nav.dashboard, Icono: LayoutDashboard },
    { href: "/admin/comprobantes", texto: dic.admin.shell.nav.comprobantes, Icono: Receipt },
    { href: "/admin/miembros", texto: dic.admin.shell.nav.miembros, Icono: Users },
    { href: "/admin/herramientas", texto: dic.admin.shell.nav.herramientas, Icono: Boxes },
    { href: "/admin/pagos", texto: dic.admin.shell.nav.pagos, Icono: DollarSign },
    { href: "/admin/reportes", texto: dic.admin.shell.nav.reportes, Icono: BarChart3 },
    { href: "/admin/anunciantes", texto: dic.admin.shell.nav.anunciantes, Icono: Megaphone },
    { href: "/admin/configuracion", texto: dic.admin.shell.nav.configuracion, Icono: Settings },
    { href: "/admin/manual", texto: dic.admin.shell.nav.manual, Icono: BookOpen },
  ];

  const Nav = ({ enCajon = false }: { enCajon?: boolean }) => (
    <nav className="space-y-1">
      {ENLACES.map((e) => {
        const activo = e.href === "/admin" ? pathname === "/admin" : pathname.startsWith(e.href);
        return (
          <Link
            key={e.href}
            href={e.href}
            onClick={() => enCajon && setAbierto(false)}
            className={cn(
              "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
              activo ? "bg-marca-azul/10 text-marca-azul" : "text-white/70 hover:bg-white/5 hover:text-white"
            )}
          >
            <span className="flex items-center gap-3">
              <e.Icono className="h-5 w-5" /> {e.texto}
            </span>
            {e.href === "/admin/comprobantes" && comprobantesPendientes > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-marca-ambar px-1.5 text-xs font-bold text-marca-marino">
                {comprobantesPendientes}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-fondo lg:flex">
      {/* Sidebar desktop */}
      <aside className="hidden w-64 flex-shrink-0 flex-col bg-marca-marino p-4 lg:flex">
        <Link href="/admin" className="mb-6 flex items-center gap-2 px-2 font-display font-extrabold text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradiente-marca">
            <Wrench className="h-5 w-5" />
          </span>
          My Borrow Box
        </Link>
        <Nav />
        <div className="mt-auto space-y-1 pt-4">
          <Link href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white">
            <ExternalLink className="h-5 w-5" /> {dic.admin.shell.verSitio}
          </Link>
          <form action={cerrarSesion}>
            <button className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-peligro">
              <LogOut className="h-5 w-5" /> {dic.admin.shell.cerrarSesion}
            </button>
          </form>
        </div>
      </aside>

      {/* Topbar móvil */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-borde bg-marca-marino px-4 py-3 lg:hidden">
        <Link href="/admin" className="flex items-center gap-2 font-display font-extrabold text-white">
          <Wrench className="h-5 w-5" /> {dic.admin.shell.adminCorto}
        </Link>
        <button onClick={() => setAbierto(true)} className="text-white">
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {/* Cajón móvil */}
      {abierto && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setAbierto(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-marca-marino p-4">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-display font-extrabold text-white">My Borrow Box</span>
              <button onClick={() => setAbierto(false)} className="text-white">
                <X className="h-6 w-6" />
              </button>
            </div>
            <Nav enCajon />
            <form action={cerrarSesion} className="mt-4">
              <button className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/70 hover:text-peligro">
                <LogOut className="h-5 w-5" /> {dic.admin.shell.cerrarSesion}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Contenido */}
      <div className="flex-1">
        <div className="hidden items-center justify-between border-b border-borde bg-superficie px-8 py-4 lg:flex">
          <p className="text-sm text-tenue">{dic.admin.shell.panel}</p>
          <p className="text-sm font-medium text-marca-marino">{nombre}</p>
        </div>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
