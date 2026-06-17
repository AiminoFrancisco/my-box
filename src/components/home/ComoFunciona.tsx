import { ClipboardCheck, KeyRound, ScanLine, Timer } from "lucide-react";
import { Revelar, RevelarLista, ItemLista } from "@/components/ui/Revelar";

const PASOS = [
  {
    Icono: ClipboardCheck,
    titulo: "Inscríbete y paga",
    texto: "Crea tu cuenta y paga la membresía de $29.99/mes por transferencia o Zelle. Subes tu comprobante y lo aprobamos.",
  },
  {
    Icono: KeyRound,
    titulo: "Recibe tu código",
    texto: "Al activarte, desbloqueas el código de acceso a la bodega. Entras por tu cuenta cuando lo necesites.",
  },
  {
    Icono: ScanLine,
    titulo: "Escanea el QR y llévatela",
    texto: "Escanea el QR de hasta 5 herramientas a la vez y quedan asignadas a ti al instante.",
  },
  {
    Icono: Timer,
    titulo: "Devuélvela en 72 hs",
    texto: "Tienes 3 días de uso. Vuelves a escanear el QR para devolverla y cierras el préstamo.",
  },
];

export function ComoFunciona() {
  return (
    <section id="como-funciona" className="contenedor scroll-mt-20 py-24">
      <Revelar className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold uppercase tracking-wider text-marca-azul">
          Cómo funciona
        </span>
        <h2 className="mt-3 font-display text-3xl font-extrabold text-marca-marino sm:text-4xl">
          Tu herramienta en 4 pasos
        </h2>
        <p className="mt-4 text-tenue">
          Sin complicaciones. Te inscribes una vez y sacas lo que necesitas, cuando lo
          necesitas.
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
