"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

/**
 * Número que cuenta desde 0 hasta `valor` cuando entra en viewport.
 */
export function Contador({
  valor,
  prefijo = "",
  sufijo = "",
  duracion = 1.6,
}: {
  valor: number;
  prefijo?: string;
  sufijo?: string;
  duracion?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const enVista = useInView(ref, { once: true, margin: "-40px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!enVista) return;
    const controles = animate(0, valor, {
      duration: duracion,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controles.stop();
  }, [enVista, valor, duracion]);

  return (
    <span ref={ref}>
      {prefijo}
      {n.toLocaleString("es-MX")}
      {sufijo}
    </span>
  );
}
