import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Hero } from "@/components/home/Hero";
import { ComoFunciona } from "@/components/home/ComoFunciona";
import { Contadores } from "@/components/home/Contadores";
import { QuienesSomos } from "@/components/home/QuienesSomos";
import { CatalogoHerramientas } from "@/components/home/CatalogoHerramientas";
import { Anunciantes } from "@/components/home/Anunciantes";
import { CtaFinal } from "@/components/home/CtaFinal";
import { obtenerHerramientas, obtenerAnunciantes, obtenerMetricasPublicas } from "@/lib/datos";

// Revalida el contenido público cada 60s.
export const revalidate = 60;

export default async function Home() {
  // Datos desde Supabase (con fallback seguro si la BD aún no está lista).
  const [herramientas, anunciantes, metricas] = await Promise.all([
    obtenerHerramientas(),
    obtenerAnunciantes(),
    obtenerMetricasPublicas(),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ComoFunciona />
        <Contadores
          totalHerramientas={metricas.totalHerramientas}
          miembrosActivos={metricas.miembrosActivos}
        />
        <QuienesSomos />
        <CatalogoHerramientas herramientas={herramientas} />
        <Anunciantes anunciantes={anunciantes} />
        <CtaFinal />
      </main>
      <Footer />
    </>
  );
}
