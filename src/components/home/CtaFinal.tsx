import { ArrowRight, Clock, ShieldCheck, ScanLine } from "lucide-react";
import { BotonLink } from "@/components/ui/Boton";
import { Revelar } from "@/components/ui/Revelar";
import { obtenerDic } from "@/lib/i18n/servidor";

export function CtaFinal() {
  const dic = obtenerDic();
  const cta = dic.home.ctaFinal;
  return (
    <section className="contenedor py-24">
      <Revelar>
        <div className="relative overflow-hidden rounded-3xl bg-gradiente-marca px-6 py-16 text-center text-white shadow-glow sm:px-12">
          <div className="mesh-fondo absolute inset-0 opacity-30" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-display text-3xl font-extrabold sm:text-5xl">
              {cta.titulo}
            </h2>
            <p className="mt-5 text-lg text-white/85">
              {cta.subtitulo}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <BotonLink href="/registro" variante="primario" tamano="lg" className="w-full sm:w-auto">
                {cta.ctaPrimario} <ArrowRight className="h-5 w-5" />
              </BotonLink>
              <BotonLink href="/login" variante="fantasma" tamano="lg" className="w-full border-white/40 bg-white/10 text-white hover:border-white hover:text-white sm:w-auto">
                {cta.ctaSecundario}
              </BotonLink>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-white/80">
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> {cta.beneficioMembresia}</span>
              <span className="inline-flex items-center gap-2"><ScanLine className="h-4 w-4" /> {cta.beneficioCantidad}</span>
              <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4" /> {cta.beneficioHoras}</span>
            </div>
          </div>
        </div>
      </Revelar>
    </section>
  );
}
