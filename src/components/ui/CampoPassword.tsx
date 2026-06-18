"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useDic } from "@/lib/i18n/cliente";

/** Input de contraseña con botón de mostrar/ocultar (el ojito 👁️). */
export function CampoPassword({
  etiqueta,
  name = "password",
  ...props
}: { etiqueta: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const dic = useDic();
  const [visible, setVisible] = useState(false);

  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-marca-marino">{etiqueta}</span>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          name={name}
          className="w-full rounded-xl border border-borde bg-superficie px-4 py-2.5 pr-11 text-contenido shadow-sm outline-none transition-all placeholder:text-tenue/60 focus:border-marca-azul focus:ring-2 focus:ring-marca-azul/20"
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-tenue transition-colors hover:text-marca-azul"
          aria-label={visible ? dic.common.password.ocultar : dic.common.password.mostrar}
          tabIndex={-1}
        >
          {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
    </label>
  );
}
