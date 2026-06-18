import { Contador } from "@/components/ui/Contador";
import { Revelar } from "@/components/ui/Revelar";
import { obtenerDic } from "@/lib/i18n/servidor";

export function Contadores({
  totalHerramientas,
  miembrosActivos,
}: {
  totalHerramientas: number;
  miembrosActivos: number;
}) {
  const dic = obtenerDic();
  const c = dic.home.contadores;
  // Fallbacks lindos si la BD aún no tiene datos.
  const herr = totalHerramientas > 0 ? totalHerramientas : 200;
  const miembros = miembrosActivos > 0 ? miembrosActivos : 120;

  const METRICAS = [
    { valor: herr, sufijo: "+", etiqueta: c.herramientasDisponibles },
    { valor: miembros, sufijo: "+", etiqueta: c.miembrosActivos },
    { valor: 72, sufijo: c.sufijoHoras, etiqueta: c.usoPorPrestamo },
    { valor: 0, sufijo: "", etiqueta: c.herramientasQueCompraste },
  ];

  return (
    <section className="relative overflow-hidden bg-marca-marino py-20 text-white">
      <div className="mesh-fondo absolute inset-0 opacity-30" />
      <div className="contenedor relative grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
        {METRICAS.map((m, i) => (
          <Revelar key={i} delay={i * 0.1}>
            <div className="font-display text-5xl font-extrabold text-white">
              <Contador valor={m.valor} sufijo={m.sufijo} />
            </div>
            <p className="mt-2 text-sm text-white/70">{m.etiqueta}</p>
          </Revelar>
        ))}
      </div>
    </section>
  );
}
