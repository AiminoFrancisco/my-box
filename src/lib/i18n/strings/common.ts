/**
 * Textos compartidos: navbar, footer, etiquetas de estado y otros literales
 * usados en toda la app. El inglés es la fuente de la forma del diccionario;
 * el español debe seguir la misma estructura (`satisfies typeof en`).
 */
const en = {
  marca: "My Borrow Box",
  meta: {
    title: "My Borrow Box — Rent tools, don't buy them",
    description:
      "Become a member in Sahuarita, AZ. Scan the QR code, grab the tool you need, and return it within 72 hours. Stop buying tools you'll only use once.",
    ogTitle: "My Borrow Box",
    ogDescription:
      "Your membership tool library in Sahuarita, Arizona.",
  },
  nav: {
    comoFunciona: "How it works",
    herramientas: "Tools",
    quienesSomos: "About us",
    aliados: "Partners",
    iniciarSesion: "Log in",
    hazteMiembro: "Become a member",
    menu: "Menu",
  },
  footer: {
    tagline:
      "Your membership tool library in Sahuarita, Arizona. Borrow what you need, return it, and you're done.",
    navega: "Explore",
    aliadosLocales: "Local partners",
    cuenta: "Account",
    miMembresia: "My membership",
    contacto: "Contact",
    direccion: "Sahuarita, AZ 85629",
    derechos: "All rights reserved.",
    hecho: "Made with 🛠️ for the Sahuarita community.",
  },
  estados: {
    usuario: {
      pendiente_pago: "Payment pending",
      comprobante_en_revision: "Under review",
      activo: "Active",
      suspendido: "Suspended",
      cancelado: "Canceled",
    },
    herramienta: {
      disponible: "Available",
      prestada: "On loan",
      en_reparacion: "Under repair",
      perdida: "Lost",
    },
  },
  password: {
    mostrar: "Show password",
    ocultar: "Hide password",
  },
  idioma: {
    etiqueta: "Language",
  },
};

const es = {
  marca: "My Borrow Box",
  meta: {
    title: "My Borrow Box — Renta herramientas, no las compres",
    description:
      "Hazte miembro en Sahuarita, AZ. Escanea el QR, llévate la herramienta que necesitas y devuélvela en 72 horas. Deja de comprar herramientas que usas una sola vez.",
    ogTitle: "My Borrow Box",
    ogDescription:
      "Tu bodega de herramientas por membresía en Sahuarita, Arizona.",
  },
  nav: {
    comoFunciona: "Cómo funciona",
    herramientas: "Herramientas",
    quienesSomos: "Quiénes somos",
    aliados: "Aliados",
    iniciarSesion: "Iniciar sesión",
    hazteMiembro: "Hazte miembro",
    menu: "Menú",
  },
  footer: {
    tagline:
      "Tu bodega de herramientas por membresía en Sahuarita, Arizona. Renta lo que necesitas, devuélvelo y listo.",
    navega: "Navega",
    aliadosLocales: "Aliados locales",
    cuenta: "Cuenta",
    miMembresia: "Mi membresía",
    contacto: "Contacto",
    direccion: "Sahuarita, AZ 85629",
    derechos: "Todos los derechos reservados.",
    hecho: "Hecho con 🛠️ para la comunidad de Sahuarita.",
  },
  estados: {
    usuario: {
      pendiente_pago: "Pendiente de pago",
      comprobante_en_revision: "En revisión",
      activo: "Activo",
      suspendido: "Suspendido",
      cancelado: "Cancelado",
    },
    herramienta: {
      disponible: "Disponible",
      prestada: "Prestada",
      en_reparacion: "En reparación",
      perdida: "Perdida",
    },
  },
  password: {
    mostrar: "Mostrar contraseña",
    ocultar: "Ocultar contraseña",
  },
  idioma: {
    etiqueta: "Idioma",
  },
} satisfies typeof en;

export const common = { en, es };
