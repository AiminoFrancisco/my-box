import Link from "next/link";
import { Wrench, MapPin, Mail, Phone } from "lucide-react";
import { SelectorIdioma } from "@/components/shared/SelectorIdioma";
import { obtenerDic } from "@/lib/i18n/servidor";

export function Footer() {
  const dic = obtenerDic();
  const { nav, footer } = dic.common;

  return (
    <footer className="border-t border-borde bg-marca-marino text-white/80">
      <div className="contenedor grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-extrabold text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradiente-marca">
              <Wrench className="h-5 w-5" />
            </span>
            My Borrow Box
          </Link>
          <p className="mt-4 text-sm text-white/60">{footer.tagline}</p>
          <div className="mt-5">
            <SelectorIdioma tono="oscuro" />
          </div>
        </div>

        <div>
          <h4 className="font-display font-semibold text-white">{footer.navega}</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/#como-funciona" className="hover:text-white">{nav.comoFunciona}</Link></li>
            <li><Link href="/#catalogo" className="hover:text-white">{nav.herramientas}</Link></li>
            <li><Link href="/#quienes-somos" className="hover:text-white">{nav.quienesSomos}</Link></li>
            <li><Link href="/#anunciantes" className="hover:text-white">{footer.aliadosLocales}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold text-white">{footer.cuenta}</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/registro" className="hover:text-white">{nav.hazteMiembro}</Link></li>
            <li><Link href="/login" className="hover:text-white">{nav.iniciarSesion}</Link></li>
            <li><Link href="/membresia" className="hover:text-white">{footer.miMembresia}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold text-white">{footer.contacto}</h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-marca-azul" /> {footer.direccion}</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-marca-azul" /> +1 520-555-0000</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-marca-azul" /> hola@myborrowbox.com</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="contenedor flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} My Borrow Box. {footer.derechos}</p>
          <p>{footer.hecho}</p>
        </div>
      </div>
    </footer>
  );
}
