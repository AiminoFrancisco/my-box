"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { AlertCircle, ShieldCheck, Lock } from "lucide-react";
import { iniciarSesionAdmin, type EstadoForm } from "@/app/(auth)/acciones";
import { CampoPassword } from "@/components/ui/CampoPassword";
import { useDic } from "@/lib/i18n/cliente";

function BotonEnviar() {
  const dic = useDic();
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-marca-azul px-6 py-3 font-semibold text-white shadow-suave transition-all hover:shadow-glow active:scale-[0.98] disabled:opacity-60"
    >
      <Lock className="h-5 w-5" />
      {pending ? dic.auth.adminLogin.botonVerificando : dic.auth.adminLogin.botonEntrar}
    </button>
  );
}

export function FormLoginAdmin() {
  const dic = useDic();
  const [estado, accion] = useFormState<EstadoForm, FormData>(iniciarSesionAdmin, {});

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-7 shadow-glow backdrop-blur-xl">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-marca-azul/20 text-marca-azul ring-1 ring-marca-azul/30">
          <ShieldCheck className="h-6 w-6" />
        </span>
        <div>
          <h1 className="font-display text-xl font-extrabold text-white">{dic.auth.adminLogin.titulo}</h1>
          <p className="text-sm text-white/50">{dic.auth.adminLogin.subtitulo}</p>
        </div>
      </div>

      <form action={accion} className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-white/80">{dic.auth.adminLogin.email}</span>
          <input
            type="email"
            name="email"
            required
            placeholder={dic.auth.adminLogin.emailPlaceholder}
            autoComplete="email"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none transition-all placeholder:text-white/30 focus:border-marca-azul focus:ring-2 focus:ring-marca-azul/30"
          />
        </label>

        {/* Reutilizamos el campo con ojito, pero en tema oscuro va con su estilo propio */}
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-white/80">{dic.auth.adminLogin.password}</span>
          <div className="[&_input]:border-white/10 [&_input]:bg-white/5 [&_input]:text-white [&_input]:placeholder:text-white/30 [&_span]:hidden">
            <CampoPassword etiqueta="" name="password" required placeholder="••••••••" autoComplete="current-password" />
          </div>
        </label>

        {estado.error && (
          <p className="flex items-center gap-2 rounded-lg bg-peligro/20 px-3 py-2 text-sm text-red-300">
            <AlertCircle className="h-4 w-4 flex-shrink-0" /> {estado.error}
          </p>
        )}

        <BotonEnviar />
      </form>

      <p className="mt-6 text-center text-sm text-white/40">
        {dic.auth.adminLogin.eresMiembro}{" "}
        <Link href="/login" className="font-semibold text-marca-azul hover:underline">
          {dic.auth.adminLogin.entraPorAqui}
        </Link>
      </p>
    </div>
  );
}
