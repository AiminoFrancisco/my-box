"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { AlertCircle, LogIn } from "lucide-react";
import { iniciarSesion, type EstadoForm } from "@/app/(auth)/acciones";
import { CampoTexto } from "@/components/ui/CampoTexto";
import { CampoPassword } from "@/components/ui/CampoPassword";
import { useDic } from "@/lib/i18n/cliente";

function BotonEnviar() {
  const dic = useDic();
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradiente-cta px-6 py-3 font-semibold text-marca-marino shadow-suave transition-all hover:shadow-glow active:scale-[0.98] disabled:opacity-60"
    >
      <LogIn className="h-5 w-5" />
      {pending ? dic.auth.login.botonEntrando : dic.auth.login.botonEntrar}
    </button>
  );
}

export function FormLogin({ redirigir }: { redirigir?: string }) {
  const dic = useDic();
  const [estado, accion] = useFormState<EstadoForm, FormData>(iniciarSesion, {});

  return (
    <div className="tarjeta-glass p-7">
      <h1 className="font-display text-2xl font-extrabold text-marca-marino">{dic.auth.login.titulo}</h1>
      <p className="mt-1 text-sm text-tenue">{dic.auth.login.subtitulo}</p>

      <form action={accion} className="mt-6 space-y-4">
        {redirigir && <input type="hidden" name="redirigir" value={redirigir} />}
        <CampoTexto etiqueta={dic.auth.login.email} type="email" name="email" required placeholder={dic.auth.login.emailPlaceholder} autoComplete="email" />
        <CampoPassword etiqueta={dic.auth.login.password} name="password" required placeholder="••••••••" autoComplete="current-password" />

        {estado.error && (
          <p className="flex items-center gap-2 rounded-lg bg-peligro/10 px-3 py-2 text-sm text-peligro">
            <AlertCircle className="h-4 w-4 flex-shrink-0" /> {estado.error}
          </p>
        )}

        <BotonEnviar />
      </form>

      <p className="mt-6 text-center text-sm text-tenue">
        {dic.auth.login.sinCuenta}{" "}
        <Link href="/registro" className="font-semibold text-marca-azul hover:underline">
          {dic.auth.login.hazteMiembro}
        </Link>
      </p>
    </div>
  );
}
