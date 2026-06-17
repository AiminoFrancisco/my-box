"use client";

import { motion, type Variants } from "framer-motion";
import { Wrench, Hammer, Ruler, Drill, PaintRoller, Plug, PackageOpen, ScanLine, ArrowRight } from "lucide-react";
import { BotonLink } from "@/components/ui/Boton";

const TITULAR = "Deja de comprar herramientas que usas una sola vez.".split(" ");

const contenedorTitular: Variants = {
  oculto: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const palabra: Variants = {
  oculto: { opacity: 0, y: 24, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

// Herramientas que "salen" del toolbox
const HERRAMIENTAS = [
  { Icono: Wrench, x: -120, y: -70, rot: -18, delay: 0.9 },
  { Icono: Hammer, x: 120, y: -80, rot: 20, delay: 1.0 },
  { Icono: Drill, x: -150, y: 30, rot: -10, delay: 1.1 },
  { Icono: Ruler, x: 150, y: 40, rot: 14, delay: 1.2 },
  { Icono: PaintRoller, x: -70, y: -130, rot: -8, delay: 1.3 },
  { Icono: Plug, x: 80, y: -140, rot: 12, delay: 1.4 },
];

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-16">
      {/* Fondo mesh animado + viñeta */}
      <div className="mesh-fondo absolute inset-0 -z-20 animate-mesh opacity-80" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-transparent to-fondo" />
      {/* Partículas finas */}
      <Particulas />

      <div className="contenedor grid items-center gap-12 py-16 lg:grid-cols-2">
        {/* Columna texto */}
        <div className="text-center lg:text-left">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-marca-azul/30 bg-white/60 px-4 py-1.5 text-sm font-medium text-marca-marino backdrop-blur"
          >
            <span className="flex h-2 w-2 rounded-full bg-exito" /> Sahuarita, Arizona · Membresía mensual
          </motion.span>

          <motion.h1
            variants={contenedorTitular}
            initial="oculto"
            animate="visible"
            className="mt-6 font-display text-4xl font-extrabold leading-[1.05] text-marca-marino sm:text-5xl lg:text-6xl"
          >
            {TITULAR.map((p, i) => (
              <motion.span key={i} variants={palabra} className="mr-[0.25em] inline-block">
                {p === "compras" || p === "comprar" ? (
                  <span className="texto-gradiente">{p}</span>
                ) : (
                  p
                )}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mx-auto mt-6 max-w-xl text-lg text-tenue lg:mx-0"
          >
            Hazte miembro, escanea el QR y llévatela. La sacas de la bodega cuando la
            necesitas y la devuelves en 72 horas. Así de fácil.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start lg:justify-start"
          >
            <BotonLink href="/registro" variante="primario" tamano="lg" className="w-full sm:w-auto">
              Hazte miembro por $29.99/mes <ArrowRight className="h-5 w-5" />
            </BotonLink>
            <BotonLink href="/#como-funciona" variante="fantasma" tamano="lg" className="w-full sm:w-auto">
              <ScanLine className="h-5 w-5" /> Ver cómo funciona
            </BotonLink>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-5 text-sm text-tenue"
          >
            Sin compras · Sin ocupar espacio en casa · Cancela cuando quieras
          </motion.p>
        </div>

        {/* Columna toolbox animado */}
        <div className="relative mx-auto hidden h-[420px] w-full max-w-md items-center justify-center lg:flex">
          <ToolboxAnimado />
        </div>
      </div>

      {/* Indicador de scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
      >
        <div className="flex h-9 w-6 items-start justify-center rounded-full border-2 border-marca-marino/30 p-1">
          <motion.span
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="h-2 w-1 rounded-full bg-marca-marino/40"
          />
        </div>
      </motion.div>
    </section>
  );
}

function ToolboxAnimado() {
  return (
    <div className="relative">
      {/* Glow detrás */}
      <div className="absolute inset-0 -z-10 rounded-full bg-marca-azul/30 blur-3xl" />

      {/* Herramientas que salen */}
      {HERRAMIENTAS.map(({ Icono, x, y, rot, delay }, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: 0, y: 0, scale: 0.4, rotate: 0 }}
          animate={{ opacity: 1, x, y, scale: 1, rotate: rot }}
          transition={{ delay, type: "spring", stiffness: 120, damping: 12 }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/50 bg-white/80 text-marca-marino shadow-glassmorph backdrop-blur"
          >
            <Icono className="h-8 w-8 text-marca-azul" />
          </motion.div>
        </motion.div>
      ))}

      {/* Caja (toolbox) que se abre */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0, rotate: -8 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 100, damping: 14 }}
        className="relative flex h-40 w-40 items-center justify-center rounded-3xl bg-gradiente-marca text-white shadow-glow"
      >
        <motion.div
          animate={{ rotate: [0, -3, 3, 0] }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <PackageOpen className="h-20 w-20" strokeWidth={1.4} />
        </motion.div>
      </motion.div>
    </div>
  );
}

/** Partículas finas flotando (puro CSS/Framer, livianas). */
function Particulas() {
  const puntos = Array.from({ length: 18 });
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {puntos.map((_, i) => {
        const izq = (i * 53) % 100;
        const arr = (i * 37) % 100;
        const dur = 6 + (i % 5);
        return (
          <motion.span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-marca-azul/40"
            style={{ left: `${izq}%`, top: `${arr}%` }}
            animate={{ y: [0, -20, 0], opacity: [0.2, 0.7, 0.2] }}
            transition={{ duration: dur, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
          />
        );
      })}
    </div>
  );
}
