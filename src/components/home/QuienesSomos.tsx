import { Home, PiggyBank, Boxes, Sparkles, MapPin } from "lucide-react";
import { Revelar, RevelarLista, ItemLista } from "@/components/ui/Revelar";
import { obtenerDic } from "@/lib/i18n/servidor";

const ICONOS_BENEFICIOS = [PiggyBank, Home, Boxes, Sparkles] as const;

export function QuienesSomos() {
  const dic = obtenerDic();
  const qs = dic.home.quienesSomos;
  const BENEFICIOS = [
    { Icono: ICONOS_BENEFICIOS[0], ...qs.beneficios.ahorra },
    { Icono: ICONOS_BENEFICIOS[1], ...qs.beneficios.espacio },
    { Icono: ICONOS_BENEFICIOS[2], ...qs.beneficios.todoEnUnLugar },
    { Icono: ICONOS_BENEFICIOS[3], ...qs.beneficios.siempreListas },
  ];
  return (
    <section id="quienes-somos" className="contenedor scroll-mt-20 py-24">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Revelar>
          <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-marca-azul">
            <MapPin className="h-4 w-4" /> {qs.etiqueta}
          </span>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-marca-marino sm:text-4xl">
            {qs.titulo}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-tenue">
            {qs.parrafo1Antes}
            <strong className="text-marca-marino">My Borrow Box</strong>
            {qs.parrafo1Despues}
          </p>
          <div className="mt-6 rounded-2xl border border-marca-azul/20 bg-marca-azul/5 p-5">
            <h3 className="font-display font-bold text-marca-marino">{qs.misionTitulo}</h3>
            <p className="mt-2 text-tenue">
              {qs.misionTexto}
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
