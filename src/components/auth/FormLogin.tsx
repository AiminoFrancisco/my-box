"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { AlertCircle, LogIn } from "lucide-react";
import { iniciarSesion, type EstadoForm } from "@/app/(auth)/acciones";
import { CampoTexto } from "@/components/ui/CampoTexto";
import { CampoPassword } from "@/components/ui/CampoPassword";

function BotonEnviar() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradiente-cta px-6 py-3 font-semibold text-marca-marino shadow-suave transition-all hover:shadow-glow active:scale-[0.98] disabled:opacity-60"
    >
      <LogIn className="h-5 w-5" />
      {pending ? "Entrando…" : "Iniciar sesión"}
    </button>
  );
}

export function FormLogin({ redirigir }: { redirigir?: string }) {
  const [estado, accion] = useFormState<EstadoForm, FormData>(iniciarSesion, {});

  return (
    <div className="tarjeta-glass p-7">
      <h1 className="font-display text-2xl font-extrabold text-marca-marino">Bienvenido de vuelta</h1>
      <p className="mt-1 text-sm text-tenue">Entra a tu cuenta de My Borrow Box.</p>

      <form action={accion} className="mt-6 space-y-4">
        {redirigir && <input type="hidden" name="redirigir" value={redirigir} />}
        <CampoTexto etiqueta="Correo electrónico" type="email" name="email" required placeholder="tu@correo.com" autoComplete="email" />
        <CampoPassword etiqueta="Contraseña" name="password" required placeholder="••••••••" autoComplete="current-password" />

        {estado.error && (
          <p className="flex items-center gap-2 rounded-lg bg-peligro/10 px-3 py-2 text-sm text-peligro">
            <AlertCircle className="h-4 w-4 flex-shrink-0" /> {estado.error}
          </p>
        )}

        <BotonEnviar />
      </form>

      <p className="mt-6 text-center text-sm text-tenue">
        ¿No tienes cuenta?{" "}
        <Link href="/registro" className="font-semibold text-marca-azul hover:underline">
          Hazte miembro
        </Link>
      </p>
    </div>
  );
}
