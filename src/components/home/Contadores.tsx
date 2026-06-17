import { Contador } from "@/components/ui/Contador";
import { Revelar } from "@/components/ui/Revelar";

export function Contadores({
  totalHerramientas,
  miembrosActivos,
}: {
  totalHerramientas: number;
  miembrosActivos: number;
}) {
  // Fallbacks lindos si la BD aún no tiene datos.
  const herr = totalHerramientas > 0 ? totalHerramientas : 200;
  const miembros = miembrosActivos > 0 ? miembrosActivos : 120;

  const METRICAS = [
    { valor: herr, sufijo: "+", etiqueta: "Herramientas disponibles" },
    { valor: miembros, sufijo: "+", etiqueta: "Miembros activos" },
    { valor: 72, sufijo: " hs", etiqueta: "De uso por préstamo" },
    { valor: 0, sufijo: "", etiqueta: "Herramientas que tuviste que comprar" },
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
