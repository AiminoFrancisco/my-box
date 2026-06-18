import { ClipboardCheck, KeyRound, ScanLine, Timer } from "lucide-react";
import { Revelar, RevelarLista, ItemLista } from "@/components/ui/Revelar";
import { obtenerDic } from "@/lib/i18n/servidor";

const ICONOS_PASOS = [ClipboardCheck, KeyRound, ScanLine, Timer] as const;

export function ComoFunciona() {
  const dic = obtenerDic();
  const cf = dic.home.comoFunciona;
  const PASOS = [
    { Icono: ICONOS_PASOS[0], ...cf.pasos.inscribete },
    { Icono: ICONOS_PASOS[1], ...cf.pasos.codigo },
    { Icono: ICONOS_PASOS[2], ...cf.pasos.escanea },
    { Icono: ICONOS_PASOS[3], ...cf.pasos.devuelve },
  ];
  return (
    <section id="como-funciona" className="contenedor scroll-mt-20 py-24">
      <Revelar className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold uppercase tracking-wider text-marca-azul">
          {cf.etiqueta}
        </span>
        <h2 className="mt-3 font-display text-3xl font-extrabold text-marca-marino sm:text-4xl">
          {cf.titulo}
        </h2>
        <p className="mt-4 text-tenue">
          {cf.subtitulo}
        </p>
      </Revelar>

      <RevelarLista className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PASOS.map((p, i) => (
          <ItemLista key={i}>
            <div className="group relative h-full rounded-2xl border border-borde bg-superficie p-6 shadow-suave transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow">
              <span className="absolute right-5 top-5 font-display text-5xl font-extrabold text-marca-azul/10">
                {i + 1}
              </span>
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradiente-marca text-white shadow-suave transition-transform group-hover:scale-110">
                <p.Icono className="h-7 w-7" />
              </span>
              <h3 className="mt-5 font-display text-lg font-bold text-marca-marino">
                {p.titulo}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-tenue">{p.texto}</p>
            </div>
          </ItemLista>
        ))}
      </RevelarLista>
    </section>
  );
}
