"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Camera, CameraOff, Keyboard, CheckCircle2, AlertCircle, PackageMinus,
  PackagePlus, RefreshCw, ArrowRight, X,
} from "lucide-react";
import {
  buscarHerramienta, sacarHerramienta, devolverHerramienta,
  type ResultadoAccion, type HerramientaEscaneada,
} from "@/app/(miembro)/acciones";
import { BadgeEstado } from "@/components/ui/BadgeEstado";
import { ImagenHerramienta } from "@/components/ui/ImagenHerramienta";
import { ESTADOS_HERRAMIENTA } from "@/lib/config";
import { formatoDinero, cn } from "@/lib/utils";

type Modo = "sacar" | "devolver";
type Fase = "inicio" | "escaneando" | "buscando" | "preview" | "resultado";
const ID_LECTOR = "lector-qr";

export function EscanerQR({ activo }: { activo: boolean }) {
  const router = useRouter();
  const [modo, setModo] = useState<Modo>("sacar");
  const [fase, setFase] = useState<Fase>("inicio");
  const [manual, setManual] = useState("");
  const [herr, setHerr] = useState<HerramientaEscaneada | null>(null);
  const [resultado, setResultado] = useState<ResultadoAccion | null>(null);
  const [errorBusqueda, setErrorBusqueda] = useState<string | null>(null);
  const [pendiente, startTransition] = useTransition();

  const escanerRef = useRef<{ stop: () => Promise<void>; clear: () => void } | null>(null);
  const procesandoRef = useRef(false);

  useEffect(() => () => { escanerRef.current?.stop().catch(() => {}); }, []);

  async function detener() {
    try {
      await escanerRef.current?.stop();
      escanerRef.current?.clear();
    } catch { /* noop */ }
    escanerRef.current = null;
  }

  // Paso 1: detectar token -> buscar info -> mostrar preview.
  async function alDetectar(texto: string) {
    if (procesandoRef.current) return;
    procesandoRef.current = true;
    await detener();
    setFase("buscando");
    setErrorBusqueda(null);
    const r = await buscarHerramienta(texto);
    procesandoRef.current = false;
    if (r.herramienta) {
      setHerr(r.herramienta);
      setFase("preview");
    } else {
      setErrorBusqueda(r.error ?? "No encontramos esa herramienta.");
      setFase("inicio");
    }
  }

  // Paso 2: confirmar -> sacar/devolver.
  function confirmar() {
    if (!herr) return;
    startTransition(async () => {
      const fn = modo === "sacar" ? sacarHerramienta : devolverHerramienta;
      const r = await fn(herr.qr_token);
      setResultado(r);
      setFase("resultado");
      if (r.ok) router.refresh();
    });
  }

  async function iniciarCamara() {
    setErrorBusqueda(null);
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const escaner = new Html5Qrcode(ID_LECTOR);
      escanerRef.current = escaner as unknown as { stop: () => Promise<void>; clear: () => void };
      setFase("escaneando");
      await escaner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (texto) => alDetectar(texto),
        () => {}
      );
    } catch {
      setFase("inicio");
      setErrorBusqueda("No pudimos abrir la cámara. Usa el ingreso manual.");
    }
  }

  function reiniciar() {
    setHerr(null);
    setResultado(null);
    setErrorBusqueda(null);
    setManual("");
    setFase("inicio");
  }

  if (!activo) {
    return (
      <div className="rounded-3xl border border-alerta/30 bg-alerta/5 p-8 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-amber-700" />
        <p className="mt-3 text-lg font-semibold text-marca-marino">Tu membresía no está activa</p>
        <p className="mt-1 text-sm text-tenue">Actívala para escanear y sacar herramientas.</p>
      </div>
    );
  }

  // ---------- Vista RESULTADO ----------
  if (fase === "resultado" && resultado) {
    return (
      <div className="text-center">
        <div className={cn(
          "mx-auto flex h-20 w-20 items-center justify-center rounded-full",
          resultado.ok ? "bg-exito/15 text-exito" : "bg-peligro/15 text-peligro"
        )}>
          {resultado.ok ? <CheckCircle2 className="h-11 w-11" /> : <AlertCircle className="h-11 w-11" />}
        </div>
        <h2 className="mt-4 font-display text-xl font-extrabold text-marca-marino">
          {resultado.ok ? "¡Listo!" : "No se pudo"}
        </h2>
        <p className="mt-1 text-tenue">{resultado.ok ? resultado.mensaje : resultado.error}</p>
        {herr && <p className="mt-1 text-sm font-medium text-marca-marino">{herr.nombre}</p>}
        <button
          onClick={reiniciar}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradiente-cta px-6 py-4 text-base font-semibold text-marca-marino shadow-suave active:scale-[0.98]"
        >
          <RefreshCw className="h-5 w-5" /> Escanear otra
        </button>
      </div>
    );
  }

  // ---------- Vista PREVIEW (confirmación) ----------
  if (fase === "preview" && herr) {
    const meta = ESTADOS_HERRAMIENTA[herr.estado];
    return (
      <div className="space-y-5">
        <div className="overflow-hidden rounded-3xl border border-borde bg-superficie shadow-glow">
          <div className="relative aspect-video bg-fondo">
            <ImagenHerramienta src={herr.foto_url} alt={herr.nombre} categoria={herr.categoria} />
            <div className="absolute left-3 top-3">
              <BadgeEstado color={meta.color as "exito" | "alerta" | "peligro"}>{meta.etiqueta}</BadgeEstado>
            </div>
          </div>
          <div className="p-5">
            <span className="text-xs font-semibold uppercase tracking-wide text-marca-azul">{herr.categoria ?? "General"}</span>
            <h2 className="mt-0.5 font-display text-xl font-extrabold text-marca-marino">{herr.nombre}</h2>
            <p className="font-mono text-xs text-tenue">{herr.numero_inventario}</p>
            {herr.descripcion && <p className="mt-2 text-sm text-tenue">{herr.descripcion}</p>}
            <p className="mt-3 text-sm text-tenue">Valor de reemplazo: <strong className="text-marca-marino">{formatoDinero(herr.valor_reemplazo)}</strong></p>
          </div>
        </div>

        <div className="rounded-2xl bg-marca-azul/5 p-4 text-center text-sm text-marca-marino">
          {modo === "sacar"
            ? "¿Seguro que quieres sacar esta herramienta? Tendrás 72 horas para devolverla."
            : "¿Confirmas la devolución de esta herramienta?"}
        </div>

        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={confirmar}
            disabled={pendiente}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-bold text-white shadow-suave transition-all active:scale-[0.98] disabled:opacity-60",
              modo === "sacar" ? "bg-marca-azul hover:shadow-glow" : "bg-marca-marino"
            )}
          >
            {pendiente ? <RefreshCw className="h-5 w-5 animate-spin" /> : modo === "sacar" ? <PackageMinus className="h-5 w-5" /> : <PackagePlus className="h-5 w-5" />}
            {modo === "sacar" ? "Sí, sacar herramienta" : "Sí, devolver"} <ArrowRight className="h-5 w-5" />
          </button>
          <button onClick={reiniciar} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-borde px-6 py-3 text-sm font-semibold text-tenue active:scale-[0.98]">
            <X className="h-4 w-4" /> Cancelar
          </button>
        </div>
      </div>
    );
  }

  // ---------- Vista INICIO / ESCANEANDO ----------
  return (
    <div className="space-y-5">
      {/* Selector de modo */}
      <div className="grid grid-cols-2 gap-2 rounded-2xl bg-fondo p-1.5">
        {(["sacar", "devolver"] as Modo[]).map((m) => (
          <button
            key={m}
            onClick={() => { setModo(m); setErrorBusqueda(null); }}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all",
              modo === m ? "bg-superficie text-marca-marino shadow-suave" : "text-tenue"
            )}
          >
            {m === "sacar" ? <PackageMinus className="h-4 w-4" /> : <PackagePlus className="h-4 w-4" />}
            {m === "sacar" ? "Sacar" : "Devolver"}
          </button>
        ))}
      </div>

      {errorBusqueda && (
        <div className="flex items-start gap-3 rounded-xl bg-peligro/10 p-4 text-sm text-peligro">
          <AlertCircle className="h-5 w-5 flex-shrink-0" /> <p>{errorBusqueda}</p>
        </div>
      )}

      {/* Visor */}
      <div className="overflow-hidden rounded-3xl border border-borde bg-marca-marino/5">
        <div id={ID_LECTOR} className="mx-auto w-full" />
        {fase !== "escaneando" && (
          <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradiente-marca text-white shadow-glow">
              <Camera className="h-8 w-8" />
            </span>
            <p className="text-sm text-tenue">
              {fase === "buscando" ? "Buscando herramienta…" : "Apunta la cámara al código QR."}
            </p>
            <button
              onClick={iniciarCamara}
              disabled={fase === "buscando"}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-marca-azul px-6 py-4 text-base font-semibold text-white shadow-suave transition-all hover:shadow-glow active:scale-[0.98] disabled:opacity-60"
            >
              <Camera className="h-5 w-5" /> Abrir cámara
            </button>
          </div>
        )}
      </div>

      {fase === "escaneando" && (
        <button onClick={() => { detener(); setFase("inicio"); }} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-borde px-5 py-3 text-sm font-semibold text-tenue active:scale-[0.98]">
          <CameraOff className="h-4 w-4" /> Detener cámara
        </button>
      )}

      {/* Manual */}
      <form
        onSubmit={(e) => { e.preventDefault(); if (manual.trim()) alDetectar(manual.trim()); }}
        className="rounded-2xl border border-borde bg-superficie p-4"
      >
        <label className="flex items-center gap-2 text-sm font-medium text-marca-marino">
          <Keyboard className="h-4 w-4 text-marca-azul" /> ¿No jala la cámara? Pega el token
        </label>
        <div className="mt-2 flex gap-2">
          <input
            value={manual}
            onChange={(e) => setManual(e.target.value)}
            placeholder="Token del QR"
            className="flex-1 rounded-xl border border-borde bg-fondo px-3 py-2.5 text-sm outline-none focus:border-marca-azul focus:ring-2 focus:ring-marca-azul/20"
          />
          <button type="submit" disabled={!manual.trim()} className="inline-flex items-center gap-1.5 rounded-xl bg-marca-marino px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
            Buscar
          </button>
        </div>
      </form>
    </div>
  );
}
