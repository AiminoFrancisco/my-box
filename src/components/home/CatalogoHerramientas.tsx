"use client";

import { useMemo, useState } from "react";
import { BadgeEstado } from "@/components/ui/BadgeEstado";
import { ImagenHerramienta } from "@/components/ui/ImagenHerramienta";
import { ESTADOS_HERRAMIENTA } from "@/lib/config";
import { formatoDinero, cn } from "@/lib/utils";
import { useDic } from "@/lib/i18n/cliente";
import type { HerramientaPublica } from "@/lib/datos";

export function CatalogoHerramientas({ herramientas }: { herramientas: HerramientaPublica[] }) {
  const dic = useDic();
  const cat0 = dic.home.catalogo;
  const TODAS = cat0.filtroTodas;

  // Fallback para mostrar la sección con vida si la BD aún no tiene datos.
  const DEMO: HerramientaPublica[] = [
    { id: "d1", numero_inventario: "INV-001", nombre: cat0.demo.martillo.nombre, descripcion: cat0.demo.martillo.descripcion, categoria: cat0.demo.martillo.categoria, condicion: cat0.demo.martillo.condicion, valor_reemplazo: 25, estado: "disponible", foto_url: "https://placehold.co/600x400/2B9FE6/FFFFFF?text=Martillo" },
    { id: "d2", numero_inventario: "INV-002", nombre: cat0.demo.taladro.nombre, descripcion: cat0.demo.taladro.descripcion, categoria: cat0.demo.taladro.categoria, condicion: cat0.demo.taladro.condicion, valor_reemplazo: 120, estado: "prestada", foto_url: "https://placehold.co/600x400/0B2A4A/FFFFFF?text=Taladro" },
    { id: "d3", numero_inventario: "INV-003", nombre: cat0.demo.escalera.nombre, descripcion: cat0.demo.escalera.descripcion, categoria: cat0.demo.escalera.categoria, condicion: cat0.demo.escalera.condicion, valor_reemplazo: 85, estado: "disponible", foto_url: "https://placehold.co/600x400/F5A623/0B2A4A?text=Escalera" },
    { id: "d4", numero_inventario: "INV-004", nombre: cat0.demo.weedEater.nombre, descripcion: cat0.demo.weedEater.descripcion, categoria: cat0.demo.weedEater.categoria, condicion: cat0.demo.weedEater.condicion, valor_reemplazo: 150, estado: "disponible", foto_url: "https://placehold.co/600x400/16A34A/FFFFFF?text=Weed+Eater" },
  ];

  const lista = herramientas.length > 0 ? herramientas : DEMO;

  const categorias = useMemo(() => {
    const set = new Set(lista.map((h) => h.categoria).filter(Boolean) as string[]);
    return [TODAS, ...Array.from(set).sort()];
  }, [lista, TODAS]);

  const [cat, setCat] = useState(TODAS);
  const visibles = cat === TODAS ? lista : lista.filter((h) => h.categoria === cat);

  return (
    <section id="catalogo" className="scroll-mt-20 bg-fondo py-24">
      <div className="contenedor">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-marca-azul">
            {cat0.etiqueta}
          </span>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-marca-marino sm:text-4xl">
            {cat0.titulo}
          </h2>
          <p className="mt-4 text-tenue">
            {cat0.subtitulo}
          </p>
        </div>

        {/* Filtros por categoría */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {categorias.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-all",
                cat === c
                  ? "bg-marca-marino text-white shadow-suave"
                  : "border border-borde bg-superficie text-tenue hover:border-marca-azul hover:text-marca-azul"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibles.map((h) => {
            const meta = ESTADOS_HERRAMIENTA[h.estado];
            return (
              <article
                key={h.id}
                className="group overflow-hidden rounded-2xl border border-borde bg-superficie shadow-suave transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow"
              >
                <div className="relative aspect-[3/2] overflow-hidden bg-fondo">
                  <ImagenHerramienta
                    src={h.foto_url}
                    alt={h.nombre}
                    categoria={h.categoria}
                    className="transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute left-3 top-3">
                    <BadgeEstado color={meta.color as "exito" | "alerta" | "peligro"}>
                      {dic.common.estados.herramienta[h.estado]}
                    </BadgeEstado>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wide text-marca-azul">
                      {h.categoria ?? cat0.categoriaGeneral}
                    </span>
                    <span className="text-xs text-tenue">{h.numero_inventario}</span>
                  </div>
                  <h3 className="mt-1.5 font-display font-bold text-marca-marino">{h.nombre}</h3>
                  {h.descripcion && (
                    <p className="mt-1 line-clamp-2 text-sm text-tenue">{h.descripcion}</p>
                  )}
                  <p className="mt-3 text-sm text-tenue">
                    {cat0.valorReemplazo}{" "}
                    <strong className="text-marca-marino">{formatoDinero(h.valor_reemplazo)}</strong>
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
