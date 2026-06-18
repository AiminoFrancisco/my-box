"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DoorOpen, Eye, EyeOff, LogIn, LogOut, Lock } from "lucide-react";
import { registrarAcceso } from "@/app/(miembro)/acciones";
import { useDic } from "@/lib/i18n/cliente";

export function CodigoPuerta({ codigo }: { codigo: string | null }) {
  const dic = useDic();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [pendiente, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  function acceso(tipo: "entrada" | "salida") {
    setMsg(null);
    startTransition(async () => {
      const r = await registrarAcceso(tipo);
      setMsg(r.ok ? r.mensaje ?? dic.member.codigoPuerta.listo : r.error ?? dic.member.codigoPuerta.error);
      if (r.ok) router.refresh();
    });
  }

  if (!codigo) {
    return (
      <div className="rounded-2xl border border-alerta/30 bg-alerta/5 p-6 text-center">
        <Lock className="mx-auto h-8 w-8 text-amber-700" />
        <p className="mt-2 font-semibold text-marca-marino">{dic.member.codigoPuerta.bloqueadoTitulo}</p>
        <p className="text-sm text-tenue">{dic.member.codigoPuerta.bloqueadoTexto}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-2xl bg-gradiente-marca p-8 text-center text-white shadow-glow">
        <div className="mesh-fondo absolute inset-0 opacity-30" />
        <div className="relative">
          <DoorOpen className="mx-auto h-10 w-10" />
          <p className="mt-2 text-sm text-white/80">{dic.member.codigoPuerta.etiqueta}</p>
          <div className="mt-3 font-display text-5xl font-extrabold tracking-[0.3em]">
            {visible ? codigo : "••••"}
          </div>
          <button
            onClick={() => setVisible((v) => !v)}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur transition-colors hover:bg-white/25"
          >
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {visible ? dic.member.codigoPuerta.ocultar : dic.member.codigoPuerta.ver}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => acceso("entrada")}
          disabled={pendiente}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-exito/10 px-4 py-3 font-semibold text-exito transition-colors hover:bg-exito/20 disabled:opacity-50"
        >
          <LogIn className="h-5 w-5" /> {dic.member.codigoPuerta.registrarEntrada}
        </button>
        <button
          onClick={() => acceso("salida")}
          disabled={pendiente}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-marca-marino/5 px-4 py-3 font-semibold text-marca-marino transition-colors hover:bg-marca-marino/10 disabled:opacity-50"
        >
          <LogOut className="h-5 w-5" /> {dic.member.codigoPuerta.registrarSalida}
        </button>
      </div>

      {msg && <p className="text-center text-sm text-tenue">{msg}</p>}
    </div>
  );
}
