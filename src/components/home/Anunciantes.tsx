import { Phone, Globe, Building2 } from "lucide-react";
import { Revelar, RevelarLista, ItemLista } from "@/components/ui/Revelar";
import type { AnuncianteUI } from "@/lib/datos";

const DEMO: AnuncianteUI[] = [
  { id: "a1", nombre: "Desert Air HVAC", categoria: "HVAC", logo_url: "https://placehold.co/200x200/2B9FE6/FFFFFF?text=HVAC", telefono: "+1 520-555-0101", sitio_web: "https://desertairhvac.example.com", descripcion: "Aire acondicionado en Sahuarita y Green Valley." },
  { id: "a2", nombre: "Sahuarita Roofing Pros", categoria: "Roofing", logo_url: "https://placehold.co/200x200/0B2A4A/FFFFFF?text=Roof", telefono: "+1 520-555-0102", sitio_web: "https://sahuaritaroofing.example.com", descripcion: "Techos nuevos y reparaciones." },
  { id: "a3", nombre: "Green Valley Plumbing", categoria: "Plumbing", logo_url: "https://placehold.co/200x200/F5A623/0B2A4A?text=Plumb", telefono: "+1 520-555-0103", sitio_web: "https://gvplumbing.example.com", descripcion: "Plomería residencial 24/7." },
];

export function Anunciantes({ anunciantes }: { anunciantes: AnuncianteUI[] }) {
  const lista = anunciantes.length > 0 ? anunciantes : DEMO;

  return (
    <section id="anunciantes" className="contenedor scroll-mt-20 py-24">
      <Revelar className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-marca-azul">
          <Building2 className="h-4 w-4" /> Aliados locales
        </span>
        <h2 className="mt-3 font-display text-3xl font-extrabold text-marca-marino sm:text-4xl">
          Empresas de confianza en tu zona
        </h2>
        <p className="mt-4 text-tenue">
          ¿Tu proyecto necesita un profesional? Estos negocios locales te pueden ayudar.
        </p>
      </Revelar>

      <RevelarLista className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {lista.map((a) => (
          <ItemLista key={a.id}>
            <div className="flex h-full gap-4 rounded-2xl border border-borde bg-superficie p-5 shadow-suave transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">
              {a.logo_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={a.logo_url}
                  alt={a.nombre}
                  className="h-16 w-16 flex-shrink-0 rounded-xl object-cover"
                />
              )}
              <div className="min-w-0">
                <span className="text-xs font-semibold uppercase tracking-wide text-marca-azul">
                  {a.categoria}
                </span>
                <h3 className="font-display font-bold text-marca-marino">{a.nombre}</h3>
                {a.descripcion && (
                  <p className="mt-1 line-clamp-2 text-sm text-tenue">{a.descripcion}</p>
                )}
                <div className="mt-3 flex flex-wrap gap-3 text-sm">
                  {a.telefono && (
                    <a href={`tel:${a.telefono}`} className="inline-flex items-center gap-1 text-tenue hover:text-marca-azul">
                      <Phone className="h-4 w-4" /> {a.telefono}
                    </a>
                  )}
                  {a.sitio_web && (
                    <a href={a.sitio_web} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-tenue hover:text-marca-azul">
                      <Globe className="h-4 w-4" /> Sitio web
                    </a>
                  )}
                </div>
              </div>
            </div>
          </ItemLista>
        ))}
      </RevelarLista>

      <Revelar className="mt-10 text-center">
        <p className="text-sm text-tenue">
          ¿Quieres anunciar tu negocio aquí?{" "}
          <a href="mailto:hola@myborrowbox.com" className="font-semibold text-marca-azul hover:underline">
            Escríbenos
          </a>
        </p>
      </Revelar>
    </section>
  );
}
