"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Wrench, Menu, X } from "lucide-react";
import { BotonLink } from "@/components/ui/Boton";
import { SelectorIdioma } from "@/components/shared/SelectorIdioma";
import { useDic } from "@/lib/i18n/cliente";
import { cn } from "@/lib/utils";

export function Navbar() {
  const dic = useDic();
  const [abierto, setAbierto] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const enlaces = [
    { href: "/#como-funciona", texto: dic.common.nav.comoFunciona },
    { href: "/#catalogo", texto: dic.common.nav.herramientas },
    { href: "/#quienes-somos", texto: dic.common.nav.quienesSomos },
    { href: "/#anunciantes", texto: dic.common.nav.aliados },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-borde bg-superficie/80 backdrop-blur-lg shadow-suave"
          : "bg-transparent"
      )}
    >
      <nav className="contenedor flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display font-extrabold">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradiente-marca text-white">
            <Wrench className="h-5 w-5" />
          </span>
          <span className={cn(scrolled ? "text-contenido" : "text-marca-marino")}>
            My Borrow Box
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-7 md:flex">
          {enlaces.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              className="text-sm font-medium text-tenue transition-colors hover:text-marca-azul"
            >
              {e.texto}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <SelectorIdioma />
          <BotonLink href="/login" variante="fantasma" tamano="sm">
            {dic.common.nav.iniciarSesion}
          </BotonLink>
          <BotonLink href="/registro" variante="primario" tamano="sm">
            {dic.common.nav.hazteMiembro}
          </BotonLink>
        </div>

        {/* Mobile toggle */}
        <button
          className="rounded-lg p-2 text-contenido md:hidden"
          onClick={() => setAbierto((v) => !v)}
          aria-label={dic.common.nav.menu}
        >
          {abierto ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {abierto && (
        <div className="border-t border-borde bg-superficie md:hidden">
          <div className="contenedor flex flex-col gap-1 py-4">
            {enlaces.map((e) => (
              <Link
                key={e.href}
                href={e.href}
                onClick={() => setAbierto(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-tenue hover:bg-fondo hover:text-marca-azul"
              >
                {e.texto}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              <BotonLink href="/login" variante="fantasma" tamano="sm">
                {dic.common.nav.iniciarSesion}
              </BotonLink>
              <BotonLink href="/registro" variante="primario" tamano="sm">
                {dic.common.nav.hazteMiembro}
              </BotonLink>
              <div className="mt-2 flex justify-center">
                <SelectorIdioma />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
