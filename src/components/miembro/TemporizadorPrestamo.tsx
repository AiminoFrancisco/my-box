"use client";

import { useEffect, useState } from "react";
import { Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { calcularTemporizador } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useDic } from "@/lib/i18n/cliente";
import { interpolar } from "@/lib/i18n/interpolar";

const HORAS_TOTAL = 72;

export function TemporizadorPrestamo({
  fechaLimite,
  devuelto = false,
}: {
  fechaLimite: string;
  devuelto?: boolean;
}) {
  const dic = useDic();
  const [ahora, setAhora] = useState<Date | null>(null);

  useEffect(() => {
    setAhora(new Date());
    const id = setInterval(() => setAhora(new Date()), 60_000); // cada minuto
    return () => clearInterval(id);
  }, []);

  if (devuelto) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-exito/10 px-3 py-1 text-xs font-medium text-exito">
        <CheckCircle2 className="h-3.5 w-3.5" /> {dic.member.temporizador.devuelta}
      </span>
    );
  }

  if (!ahora) {
    // Evita mismatch de hidratación: placeholder hasta montar.
    return <span className="inline-block h-6 w-32 animate-pulse rounded-full bg-borde" />;
  }

  const { estado, horasRestantes, dias, horas } = calcularTemporizador(fechaLimite, ahora);

  const limite = new Date(fechaLimite).getTime();
  const inicio = limite - HORAS_TOTAL * 3600 * 1000;
  const progreso = Math.min(100, Math.max(0, ((ahora.getTime() - inicio) / (limite - inicio)) * 100));

  const estilos = {
    verde: { barra: "bg-exito", chip: "bg-exito/10 text-exito", Icono: Clock, texto: interpolar(dic.member.temporizador.quedan, { dias, horas }) },
    por_vencer: { barra: "bg-alerta", chip: "bg-alerta/10 text-amber-700", Icono: AlertTriangle, texto: interpolar(dic.member.temporizador.porVencer, { horas }) },
    vencido: { barra: "bg-peligro", chip: "bg-peligro/10 text-peligro", Icono: AlertTriangle, texto: interpolar(dic.member.temporizador.vencido, { dias, horas }) },
  }[estado];

  return (
    <div className="space-y-1.5">
      <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium", estilos.chip)}>
        <estilos.Icono className="h-3.5 w-3.5" /> {estilos.texto}
      </span>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-borde">
        <div
          className={cn("h-full rounded-full transition-all", estilos.barra)}
          style={{ width: `${estado === "vencido" ? 100 : progreso}%` }}
        />
      </div>
    </div>
  );
}
