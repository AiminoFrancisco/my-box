"use client";

import { useState, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { AlertCircle, ArrowLeft, ArrowRight, Check, Upload, UserPlus, FileText } from "lucide-react";
import { registrarse, type EstadoForm } from "@/app/(auth)/acciones";
import { CampoTexto, CampoArea } from "@/components/ui/CampoTexto";
import { CampoPassword } from "@/components/ui/CampoPassword";
import { formatoDinero, cn } from "@/lib/utils";
import { useDic } from "@/lib/i18n/cliente";

function BotonEnviar({ habilitado }: { habilitado: boolean }) {
  const dic = useDic();
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || !habilitado}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-gradiente-cta px-6 py-3 font-semibold text-marca-marino shadow-suave transition-all hover:shadow-glow active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Check className="h-5 w-5" />
      {pending ? dic.auth.registro.botonCreando : dic.auth.registro.botonCrear}
    </button>
  );
}

/** Input de archivo con preview de nombre. */
function CampoArchivo({ etiqueta, name, onCambio }: { etiqueta: string; name: string; onCambio: (ok: boolean) => void }) {
  const dic = useDic();
  const [nombre, setNombre] = useState<string | null>(null);
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-marca-marino">{etiqueta}</span>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className={cn(
          "flex w-full items-center gap-3 rounded-xl border border-dashed px-4 py-3 text-left text-sm transition-colors",
          nombre ? "border-marca-azul bg-marca-azul/5 text-marca-marino" : "border-borde bg-superficie text-tenue hover:border-marca-azul"
        )}
      >
        <Upload className="h-5 w-5 flex-shrink-0 text-marca-azul" />
        <span className="truncate">{nombre ?? dic.auth.registro.archivoPlaceholder}</span>
      </button>
      <input
        ref={ref}
        type="file"
        name={name}
        accept="image/*,application/pdf"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          setNombre(f ? f.name : null);
          onCambio(!!f);
        }}
      />
    </div>
  );
}

export function FormRegistro() {
  const dic = useDic();
  const PASOS = [
    dic.auth.registro.pasos.titular,
    dic.auth.registro.pasos.autorizadaIds,
    dic.auth.registro.pasos.contrato,
  ];
  const [estado, accion] = useFormState<EstadoForm, FormData>(registrarse, {});
  const [paso, setPaso] = useState(0);
  const [acepto, setAcepto] = useState(false);
  const [tieneTitular, setTieneTitular] = useState(false);
  const [tieneAutorizada, setTieneAutorizada] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  // Valida los campos del paso actual antes de avanzar (usa validación nativa).
  function avanzar() {
    const form = formRef.current;
    if (!form) return;
    const requeridosPorPaso: Record<number, string[]> = {
      0: ["nombre_completo", "direccion", "telefono", "email", "password", "fecha_nacimiento"],
      1: ["persona_autorizada_nombre"],
    };
    const campos = requeridosPorPaso[paso] ?? [];
    for (const nombre of campos) {
      const el = form.elements.namedItem(nombre) as HTMLInputElement | null;
      if (el && !el.checkValidity()) {
        el.reportValidity();
        return;
      }
    }
    if (paso === 1 && (!tieneTitular || !tieneAutorizada)) {
      alert(dic.auth.registro.faltanIds);
      return;
    }
    setPaso((p) => Math.min(p + 1, PASOS.length - 1));
  }

  return (
    <div className="tarjeta-glass p-7">
      {/* Stepper */}
      <div className="mb-6 flex items-center gap-2">
        {PASOS.map((p, i) => (
          <div key={p} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
                i < paso ? "bg-exito text-white" : i === paso ? "bg-marca-azul text-white" : "bg-borde text-tenue"
              )}
            >
              {i < paso ? <Check className="h-4 w-4" /> : i + 1}
            </span>
            {i < PASOS.length - 1 && (
              <span className={cn("h-0.5 flex-1 rounded", i < paso ? "bg-exito" : "bg-borde")} />
            )}
          </div>
        ))}
      </div>

      <h1 className="flex items-center gap-2 font-display text-2xl font-extrabold text-marca-marino">
        <UserPlus className="h-6 w-6 text-marca-azul" /> {dic.auth.registro.titulo}
      </h1>
      <p className="mt-1 text-sm text-tenue">
        {dic.auth.registro.pasoDe
          .replace("{actual}", String(paso + 1))
          .replace("{total}", String(PASOS.length))
          .replace("{nombre}", PASOS[paso])}
      </p>

      <form ref={formRef} action={accion} className="mt-6 space-y-4">
        {/* PASO 1 · Titular */}
        <div className={cn("space-y-4", paso !== 0 && "hidden")}>
          <CampoTexto etiqueta={dic.auth.registro.nombreCompleto} name="nombre_completo" required placeholder={dic.auth.registro.nombreCompletoPlaceholder} />
          <CampoArea etiqueta={dic.auth.registro.direccion} name="direccion" required rows={2} placeholder={dic.auth.registro.direccionPlaceholder} />
          <div className="grid gap-4 sm:grid-cols-2">
            <CampoTexto etiqueta={dic.auth.registro.telefono} name="telefono" type="tel" required placeholder={dic.auth.registro.telefonoPlaceholder} />
            <CampoTexto etiqueta={dic.auth.registro.fechaNacimiento} name="fecha_nacimiento" type="date" required />
          </div>
          <CampoTexto etiqueta={dic.auth.registro.email} name="email" type="email" required placeholder={dic.auth.registro.emailPlaceholder} autoComplete="email" />
          <CampoPassword etiqueta={dic.auth.registro.password} name="password" required minLength={8} placeholder={dic.auth.registro.passwordPlaceholder} autoComplete="new-password" />
        </div>

        {/* PASO 2 · Autorizada + IDs */}
        <div className={cn("space-y-4", paso !== 1 && "hidden")}>
          <div className="rounded-xl bg-marca-azul/5 p-3 text-sm text-tenue">
            {dic.auth.registro.notaMismaDireccion.antes}
            <strong className="text-marca-marino">{dic.auth.registro.notaMismaDireccion.resaltado}</strong>
            {dic.auth.registro.notaMismaDireccion.despues}
          </div>
          <CampoTexto etiqueta={dic.auth.registro.personaAutorizada} name="persona_autorizada_nombre" required placeholder={dic.auth.registro.personaAutorizadaPlaceholder} />
          <CampoArchivo etiqueta={dic.auth.registro.idTitular} name="id_titular" onCambio={setTieneTitular} />
          <CampoArchivo etiqueta={dic.auth.registro.idAutorizada} name="id_autorizada" onCambio={setTieneAutorizada} />
        </div>

        {/* PASO 3 · Contrato */}
        <div className={cn("space-y-4", paso !== 2 && "hidden")}>
          <div className="max-h-56 overflow-y-auto rounded-xl border border-borde bg-superficie p-4 text-sm text-tenue">
            <h3 className="flex items-center gap-2 font-display font-bold text-marca-marino">
              <FileText className="h-4 w-4" /> {dic.auth.registro.contratoTitulo}
            </h3>
            <ul className="mt-3 list-inside list-decimal space-y-2">
              {dic.auth.registro.clausulas.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
            <h4 className="mt-4 font-semibold text-marca-marino">{dic.auth.registro.costosTitulo}</h4>
            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
              {dic.auth.registro.costosReemplazo.map((c) => (
                <div key={c.nombre} className="flex justify-between border-b border-borde/60 py-0.5">
                  <span>{c.nombre}</span>
                  <span className="font-medium text-marca-marino">{formatoDinero(c.costo)}</span>
                </div>
              ))}
            </div>
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-borde p-3">
            <input
              type="checkbox"
              name="acepto"
              checked={acepto}
              onChange={(e) => setAcepto(e.target.checked)}
              className="mt-0.5 h-5 w-5 rounded border-borde text-marca-azul focus:ring-marca-azul"
            />
            <span className="text-sm text-contenido">
              {dic.auth.registro.aceptoContrato}
            </span>
          </label>
        </div>

        {estado.error && (
          <p className="flex items-center gap-2 rounded-lg bg-peligro/10 px-3 py-2 text-sm text-peligro">
            <AlertCircle className="h-4 w-4 flex-shrink-0" /> {estado.error}
          </p>
        )}

        {/* Navegación */}
        <div className="flex items-center justify-between pt-2">
          {paso > 0 ? (
            <button type="button" onClick={() => setPaso((p) => p - 1)} className="inline-flex items-center gap-1 text-sm font-medium text-tenue hover:text-marca-azul">
              <ArrowLeft className="h-4 w-4" /> {dic.auth.registro.atras}
            </button>
          ) : (
            <span />
          )}

          {paso < PASOS.length - 1 ? (
            <button
              type="button"
              onClick={avanzar}
              className="inline-flex items-center gap-2 rounded-full bg-marca-azul px-6 py-3 font-semibold text-white shadow-suave transition-all hover:shadow-glow active:scale-[0.98]"
            >
              {dic.auth.registro.siguiente} <ArrowRight className="h-5 w-5" />
            </button>
          ) : (
            <BotonEnviar habilitado={acepto} />
          )}
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-tenue">
        {dic.auth.registro.yaTienesCuenta}{" "}
        <Link href="/login" className="font-semibold text-marca-azul hover:underline">
          {dic.auth.registro.iniciarSesion}
        </Link>
      </p>
    </div>
  );
}
