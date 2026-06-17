import { ArrowRight, Clock, ShieldCheck, ScanLine } from "lucide-react";
import { BotonLink } from "@/components/ui/Boton";
import { Revelar } from "@/components/ui/Revelar";

export function CtaFinal() {
  return (
    <section className="contenedor py-24">
      <Revelar>
        <div className="relative overflow-hidden rounded-3xl bg-gradiente-marca px-6 py-16 text-center text-white shadow-glow sm:px-12">
          <div className="mesh-fondo absolute inset-0 opacity-30" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-display text-3xl font-extrabold sm:text-5xl">
              Tu próximo proyecto empieza hoy
            </h2>
            <p className="mt-5 text-lg text-white/85">
              Hazte miembro de My Borrow Box y deja de comprar herramientas que usas una
              sola vez. Escanea, llévatela y devuélvela en 72 horas.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <BotonLink href="/registro" variante="primario" tamano="lg" className="w-full sm:w-auto">
                Hazte miembro por $29.99/mes <ArrowRight className="h-5 w-5" />
              </BotonLink>
              <BotonLink href="/login" variante="fantasma" tamano="lg" className="w-full border-white/40 bg-white/10 text-white hover:border-white hover:text-white sm:w-auto">
                Ya tengo cuenta
              </BotonLink>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-white/80">
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Membresía mensual, cancela cuando quieras</span>
              <span className="inline-flex items-center gap-2"><ScanLine className="h-4 w-4" /> Hasta 5 herramientas a la vez</span>
              <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4" /> 72 horas de uso</span>
            </div>
          </div>
        </div>
      </Revelar>
    </section>
  );
}
