"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, CheckCircle2, Building2, CreditCard, DoorOpen } from "lucide-react";
import { guardarConfiguracion } from "@/app/(admin)/acciones";

export function FormConfiguracion({ valores }: { valores: Record<string, string> }) {
  const router = useRouter();
  const [pendiente, startTransition] = useTransition();
  const [ok, setOk] = useState(false);

  function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setOk(false);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const r = await guardarConfiguracion(fd);
      if (r.ok) { setOk(true); router.refresh(); }
    });
  }

  return (
    <form onSubmit={enviar} className="space-y-6">
      <Grupo titulo="Datos bancarios para el pago" Icono={Building2}>
        <Campo etiqueta="Banco" name="banco_nombre" defaultValue={valores.banco_nombre} />
        <Campo etiqueta="Routing number" name="banco_routing" defaultValue={valores.banco_routing} />
        <Campo etiqueta="Número de cuenta" name="banco_cuenta" defaultValue={valores.banco_cuenta} />
        <Campo etiqueta="Zelle / email" name="zelle_email" defaultValue={valores.zelle_email} />
      </Grupo>

      <Grupo titulo="Membresía y préstamos" Icono={CreditCard}>
        <Campo etiqueta="Monto de membresía ($)" name="monto_membresia" type="number" step="0.01" defaultValue={valores.monto_membresia} />
        <Campo etiqueta="Horas de préstamo" name="horas_prestamo" type="number" defaultValue={valores.horas_prestamo} />
        <Campo etiqueta="Máx. herramientas por miembro" name="max_herramientas" type="number" defaultValue={valores.max_herramientas} />
        <Campo etiqueta="Penalidad diaria ($)" name="penalidad_diaria" type="number" step="0.01" defaultValue={valores.penalidad_diaria} />
        <Campo etiqueta="Días máx. antes de cobrar reemplazo" name="dias_penalidad_max" type="number" defaultValue={valores.dias_penalidad_max} />
      </Grupo>

      <Grupo titulo="Acceso a la bodega" Icono={DoorOpen}>
        <Campo etiqueta="Código del candado" name="codigo_puerta" defaultValue={valores.codigo_puerta} />
      </Grupo>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={pendiente} className="inline-flex items-center gap-2 rounded-full bg-gradiente-cta px-6 py-3 font-semibold text-marca-marino shadow-suave transition-all hover:shadow-glow disabled:opacity-50">
          {pendiente ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />} Guardar cambios
        </button>
        {ok && <span className="inline-flex items-center gap-1 text-sm text-exito"><CheckCircle2 className="h-4 w-4" /> Guardado</span>}
      </div>
    </form>
  );
}

function Grupo({ titulo, Icono, children }: { titulo: string; Icono: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-borde bg-superficie p-6 shadow-suave">
      <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-marca-marino">
        <Icono className="h-5 w-5 text-marca-azul" /> {titulo}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function Campo({ etiqueta, ...props }: { etiqueta: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-marca-marino">{etiqueta}</span>
      <input {...props} className="w-full rounded-xl border border-borde bg-fondo px-3 py-2 text-sm outline-none focus:border-marca-azul" />
    </label>
  );
}
