/**
 * Textos del área "home" (landing pública). El inglés es la fuente de la forma
 * del diccionario; el español sigue la misma estructura (`satisfies typeof en`).
 */
const en = {
  hero: {
    badge: "Sahuarita, Arizona · Monthly membership",
    titular: "Stop buying tools you'll only use once.",
    subtitulo:
      "Become a member, scan the QR code, and take it home. Grab it from the tool library when you need it and bring it back within 72 hours. It's that easy.",
    ctaPrimario: "Become a member for $29.99/mo",
    ctaSecundario: "See how it works",
    notaPie: "No buying · No clutter at home · Cancel anytime",
  },
  comoFunciona: {
    etiqueta: "How it works",
    titulo: "Your tool in 4 steps",
    subtitulo:
      "No hassle. Sign up once and grab what you need, whenever you need it.",
    pasos: {
      inscribete: {
        titulo: "Sign up and pay",
        texto:
          "Create your account and pay the $29.99/mo membership by transfer or Zelle. Upload your receipt and we'll approve it.",
      },
      codigo: {
        titulo: "Get your access code",
        texto:
          "Once you're active, you'll unlock the tool library access code. Let yourself in whenever you need to.",
      },
      escanea: {
        titulo: "Scan the QR code and take it",
        texto:
          "Scan the QR code on up to 5 tools at once and they're checked out to you instantly.",
      },
      devuelve: {
        titulo: "Return it within 72 hrs",
        texto:
          "You get 3 days of use. Scan the QR code again to return it and close out the loan.",
      },
    },
  },
  contadores: {
    herramientasDisponibles: "Tools available",
    miembrosActivos: "Active members",
    usoPorPrestamo: "Of use per loan",
    herramientasQueCompraste: "Tools you had to buy",
    sufijoHoras: " hrs",
  },
  quienesSomos: {
    etiqueta: "About us",
    titulo: "A local business serving Sahuarita",
    parrafo1Antes: "At ",
    parrafo1Despues:
      " we believe you don't have to buy a new tool for every project around the house. We're a local company that lends our community everything you need, from a hammer to a ladder.",
    misionTitulo: "Our mission",
    misionTexto:
      "To offer most of the tools you need for home projects — hammers, screwdrivers, ladders, brooms, leaf blowers, and much more — so you can grab what you need, get your project done, and that's it.",
    beneficios: {
      ahorra: {
        titulo: "Save money",
        texto:
          "Don't drop $120 on a drill you'll use for one afternoon. Pay your membership and you're set.",
      },
      espacio: {
        titulo: "Save space",
        texto:
          "Stop filling up the garage with tools you barely ever use.",
      },
      todoEnUnLugar: {
        titulo: "All in one place",
        texto:
          "From a hammer to a ladder or a generator. You'll find it at the tool library.",
      },
      siempreListas: {
        titulo: "Always ready",
        texto:
          "Tools kept in good shape and inspected, so your project turns out great.",
      },
    },
  },
  catalogo: {
    etiqueta: "Catalog",
    titulo: "Available tools",
    subtitulo:
      "Built for your projects at home: the everyday ones and the big ones too, like generators or demolition hammers.",
    filtroTodas: "All",
    categoriaGeneral: "General",
    valorReemplazo: "Replacement value:",
    demo: {
      martillo: {
        nombre: "16oz claw hammer",
        descripcion: "For nails and light demolition.",
        categoria: "Construction",
        condicion: "Good",
      },
      taladro: {
        nombre: "20V cordless drill",
        descripcion: "With battery and charger.",
        categoria: "Power tools",
        condicion: "New",
      },
      escalera: {
        nombre: "6 ft step ladder",
        descripcion: "Aluminum, holds up to 250 lb.",
        categoria: "Construction",
        condicion: "Good",
      },
      weedEater: {
        nombre: "Weed eater",
        descripcion: "Gas-powered string trimmer.",
        categoria: "Gardening",
        condicion: "Used",
      },
    },
  },
  anunciantes: {
    etiqueta: "Local partners",
    titulo: "Trusted businesses in your area",
    subtitulo:
      "Need a pro for your project? These local businesses can help you out.",
    sitioWeb: "Website",
    anunciaAntes: "Want to advertise your business here? ",
    anunciaEnlace: "Get in touch",
    demo: {
      hvac: { descripcion: "Air conditioning in Sahuarita and Green Valley." },
      roofing: { descripcion: "New roofs and repairs." },
      plumbing: { descripcion: "24/7 residential plumbing." },
    },
  },
  ctaFinal: {
    titulo: "Your next project starts today",
    subtitulo:
      "Become a My Borrow Box member and stop buying tools you'll only use once. Scan it, take it home, and return it within 72 hours.",
    ctaPrimario: "Become a member for $29.99/mo",
    ctaSecundario: "I already have an account",
    beneficioMembresia: "Monthly membership, cancel anytime",
    beneficioCantidad: "Up to 5 tools at a time",
    beneficioHoras: "72 hours of use",
  },
};

const es = {
  hero: {
    badge: "Sahuarita, Arizona · Membresía mensual",
    titular: "Deja de comprar herramientas que usas una sola vez.",
    subtitulo:
      "Hazte miembro, escanea el QR y llévatela. La sacas de la bodega cuando la necesitas y la devuelves en 72 horas. Así de fácil.",
    ctaPrimario: "Hazte miembro por $29.99/mes",
    ctaSecundario: "Ver cómo funciona",
    notaPie: "Sin compras · Sin ocupar espacio en casa · Cancela cuando quieras",
  },
  comoFunciona: {
    etiqueta: "Cómo funciona",
    titulo: "Tu herramienta en 4 pasos",
    subtitulo:
      "Sin complicaciones. Te inscribes una vez y sacas lo que necesitas, cuando lo necesitas.",
    pasos: {
      inscribete: {
        titulo: "Inscríbete y paga",
        texto:
          "Crea tu cuenta y paga la membresía de $29.99/mes por transferencia o Zelle. Subes tu comprobante y lo aprobamos.",
      },
      codigo: {
        titulo: "Recibe tu código",
        texto:
          "Al activarte, desbloqueas el código de acceso a la bodega. Entras por tu cuenta cuando lo necesites.",
      },
      escanea: {
        titulo: "Escanea el QR y llévatela",
        texto:
          "Escanea el QR de hasta 5 herramientas a la vez y quedan asignadas a ti al instante.",
      },
      devuelve: {
        titulo: "Devuélvela en 72 hs",
        texto:
          "Tienes 3 días de uso. Vuelves a escanear el QR para devolverla y cierras el préstamo.",
      },
    },
  },
  contadores: {
    herramientasDisponibles: "Herramientas disponibles",
    miembrosActivos: "Miembros activos",
    usoPorPrestamo: "De uso por préstamo",
    herramientasQueCompraste: "Herramientas que tuviste que comprar",
    sufijoHoras: " hs",
  },
  quienesSomos: {
    etiqueta: "Quiénes somos",
    titulo: "Una empresa local que sirve a Sahuarita",
    parrafo1Antes: "En ",
    parrafo1Despues:
      " creemos que no necesitas comprar cada herramienta para cada proyecto en casa. Somos una compañía local que le presta a su comunidad todo lo que necesitas, desde un martillo hasta una escalera.",
    misionTitulo: "Nuestra misión",
    misionTexto:
      "Ofrecer la mayoría de las herramientas para proyectos en casa —martillo, desarmadores, escalera, escoba, sopladora de hojas y mucho más— para que uses la que necesitas, hagas tu proyecto y listo.",
    beneficios: {
      ahorra: {
        titulo: "Ahorra dinero",
        texto:
          "No gastes $120 en un taladro que usas una tarde. Pagas tu membresía y ya.",
      },
      espacio: {
        titulo: "No ocupes espacio",
        texto:
          "Olvídate de llenar la cochera de herramientas que casi no usas.",
      },
      todoEnUnLugar: {
        titulo: "Todo en un lugar",
        texto:
          "Desde un martillo hasta una escalera o un generador. Lo encuentras en la bodega.",
      },
      siempreListas: {
        titulo: "Siempre listas",
        texto:
          "Herramientas en buen estado y revisadas, para que tu proyecto salga bien.",
      },
    },
  },
  catalogo: {
    etiqueta: "Catálogo",
    titulo: "Herramientas disponibles",
    subtitulo:
      "Pensadas para tus proyectos en casa: comunes y también las grandes, como generadores o martillos demoledores.",
    filtroTodas: "Todas",
    categoriaGeneral: "General",
    valorReemplazo: "Valor de reemplazo:",
    demo: {
      martillo: {
        nombre: "Martillo de uña 16oz",
        descripcion: "Para clavos y demolición ligera.",
        categoria: "Construcción",
        condicion: "Buena",
      },
      taladro: {
        nombre: "Taladro inalámbrico 20V",
        descripcion: "Con batería y cargador.",
        categoria: "Eléctrica",
        condicion: "Nueva",
      },
      escalera: {
        nombre: "Escalera de tijera 6 ft",
        descripcion: "Aluminio, hasta 250 lb.",
        categoria: "Construcción",
        condicion: "Buena",
      },
      weedEater: {
        nombre: "Weed eater",
        descripcion: "Desbrozadora a gasolina.",
        categoria: "Jardinería",
        condicion: "Usada",
      },
    },
  },
  anunciantes: {
    etiqueta: "Aliados locales",
    titulo: "Empresas de confianza en tu zona",
    subtitulo:
      "¿Tu proyecto necesita un profesional? Estos negocios locales te pueden ayudar.",
    sitioWeb: "Sitio web",
    anunciaAntes: "¿Quieres anunciar tu negocio aquí? ",
    anunciaEnlace: "Escríbenos",
    demo: {
      hvac: { descripcion: "Aire acondicionado en Sahuarita y Green Valley." },
      roofing: { descripcion: "Techos nuevos y reparaciones." },
      plumbing: { descripcion: "Plomería residencial 24/7." },
    },
  },
  ctaFinal: {
    titulo: "Tu próximo proyecto empieza hoy",
    subtitulo:
      "Hazte miembro de My Borrow Box y deja de comprar herramientas que usas una sola vez. Escanea, llévatela y devuélvela en 72 horas.",
    ctaPrimario: "Hazte miembro por $29.99/mes",
    ctaSecundario: "Ya tengo cuenta",
    beneficioMembresia: "Membresía mensual, cancela cuando quieras",
    beneficioCantidad: "Hasta 5 herramientas a la vez",
    beneficioHoras: "72 horas de uso",
  },
} satisfies typeof en;

export const home = { en, es };
