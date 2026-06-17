"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PackageMinus, PackagePlus, Check, X, Loader2 } from "lucide-react";
import { sacarHerramienta, devolverHerramienta } from "@/app/(miembro)/acciones";
import { cn } from "@/lib/utils";

/** Botón que saca o devuelve una herramienta por su token, con feedback inline. */
export function BotonAccionQR({
  token,
  modo,
  deshabilitado = false,
  className,
}: {
  token: string;
  modo: "sacar" | "devolver";
  deshabilitado?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const [pendiente, startTransition] = useTransition();
  const [estado, setEstado] = useState<"idle" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  function ejecutar() {
    setEstado("idle");
    startTransition(async () => {
      const fn = modo === "sacar" ? sacarHerramienta : devolverHerramienta;
      const r = await fn(token);
      if (r.ok) {
        setEstado("ok");
        setMsg(r.mensaje ?? "Listo");
        router.refresh();
      } else {
        setEstado("error");
        setMsg(r.error ?? "Error");
      }
    });
  }

  const esSacar = modo === "sacar";

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={ejecutar}
        disabled={deshabilitado || pendiente}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50",
          esSacar ? "bg-marca-azul text-white hover:shadow-glow" : "bg-marca-marino text-white hover:bg-marca-marino/90",
          className
        )}
      >
        {pendiente ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : esSacar ? (
          <PackageMinus className="h-4 w-4" />
        ) : (
          <PackagePlus className="h-4 w-4" />
        )}
        {esSacar ? "Sacar" : "Devolver"}
      </button>
      {estado !== "idle" && (
        <span className={cn("flex items-center gap-1 text-xs", estado === "ok" ? "text-exito" : "text-peligro")}>
          {estado === "ok" ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />} {msg}
        </span>
      )}
    </div>
  );
}
