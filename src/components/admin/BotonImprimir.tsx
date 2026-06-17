"use client";

import { Printer } from "lucide-react";

export function BotonImprimir() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-full bg-marca-azul px-5 py-2.5 text-sm font-semibold text-white shadow-suave transition-all hover:shadow-glow active:scale-95 print:hidden"
    >
      <Printer className="h-4 w-4" /> Imprimir QR
    </button>
  );
}
