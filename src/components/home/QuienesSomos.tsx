import { Home, PiggyBank, Boxes, Sparkles, MapPin } from "lucide-react";
import { Revelar, RevelarLista, ItemLista } from "@/components/ui/Revelar";

const BENEFICIOS = [
  {
    Icono: PiggyBank,
    titulo: "Ahorra dinero",
    texto: "No gastes $120 en un taladro que usas una tarde. Pagas tu membresía y ya.",
  },
  {
    Icono: Home,
    titulo: "No ocupes espacio",
    texto: "Olvídate de llenar la cochera de herramientas que casi no usas.",
  },
  {
    Icono: Boxes,
    titulo: "Todo en un lugar",
    texto: "Desde un martillo hasta una escalera o un generador. Lo encuentras en la bodega.",
  },
  {
    Icono: Sparkles,
    titulo: "Siempre listas",
    texto: "Herramientas en buen estado y revisadas, para que tu proyecto salga bien.",
  },
];

export function QuienesSomos() {
  return (
    <section id="quienes-somos" className="contenedor scroll-mt-20 py-24">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Revelar>
          <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-marca-azul">
            <MapPin className="h-4 w-4" /> Quiénes somos
          </span>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-marca-marino sm:text-4xl">
            Una empresa local que sirve a Sahuarita
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-tenue">
            En <strong className="text-marca-marino">My Borrow Box</strong> creemos que
            no necesitas comprar cada herramienta para cada proyecto en casa. Somos una
            compañía local que le presta a su comunidad todo lo que necesitas, desde un
            martillo hasta una escalera.
          </p>
          <div className="mt-6 rounded-2xl border border-marca-azul/20 bg-marca-azul/5 p-5">
            <h3 className="font-display font-bold text-marca-marino">Nuestra misión</h3>
            <p className="mt-2 text-tenue">
              Ofrecer la mayoría de las herramientas para proyectos en casa —martillo,
              desarmadores, escalera, escoba, sopladora de hojas y mucho más— para que
              uses la que necesitas, hagas tu proyecto y listo.
            </p>
          </div>
        </Revelar>

        <RevelarLista className="grid gap-5 sm:grid-cols-2">
          {BENEFICIOS.map((b, i) => (
            <ItemLista key={i}>
              <div className="tarjeta-glass h-full p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradiente-cta text-marca-marino shadow-suave">
                  <b.Icono className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-display font-bold text-marca-marino">{b.titulo}</h3>
                <p className="mt-1.5 text-sm text-tenue">{b.texto}</p>
              </div>
            </ItemLista>
          ))}
        </RevelarLista>
      </div>
    </section>
  );
}
