/**
 * Textos del área de miembro (experiencia del miembro autenticado).
 * El inglés es la fuente de la forma del diccionario; el español debe seguir
 * la misma estructura (`satisfies typeof en`).
 */
const en = {
  shell: {
    admin: "Admin",
    cerrarSesion: "Log out",
    nav: {
      inicio: "Dashboard",
      herramientas: "Tools",
      escanear: "Scan",
      misPrestamos: "My Loans",
      bodega: "Tool library",
      membresia: "Membership",
      perfil: "Profile",
    },
    tabs: {
      inicio: "Dashboard",
      herramientas: "Tools",
      escanear: "Scan",
      misPrestamos: "Loans",
      perfil: "Profile",
    },
  },

  layout: {
    nombreFallback: "Member",
  },

  panel: {
    metaTitle: "Dashboard · My Borrow Box",
    saludo: "Hi, {nombre}! 👋",
    subtitulo: "Here's your snapshot for today.",
    metricas: {
      activasCorta: "Active",
      activasLarga: "Active tools",
      disponiblesCorta: "Available",
      disponiblesLarga: "You can borrow",
      cargosCorta: "Charges",
      cargosLarga: "Pending charges",
    },
    accesos: {
      escanearTitulo: "Scan QR",
      escanearTexto: "Check out or return a tool",
      herramientasTitulo: "Browse tools",
      herramientasTexto: "Explore the catalog",
      bodegaTitulo: "Tool library access",
      bodegaTexto: "Your door code",
    },
    activos: {
      titulo: "Your active loans",
      verTodos: "View all",
      vacio: "You don't have any tools out right now.",
      herramientaFallback: "Tool",
    },
  },

  perfil: {
    metaTitle: "Profile · My Borrow Box",
    titulo: "My profile",
    datosTitular: "Account holder details",
    nombre: "Name",
    correo: "Email",
    telefono: "Phone",
    nacimiento: "Date of birth",
    direccion: "Address",
    personaAutorizada: "Authorized person",
    miembroDesde: "Member since {fecha}",
    identificaciones: "IDs",
    sinIdentificaciones: "You haven't uploaded any IDs yet.",
    noDisponible: "Not available",
    tipoPersona: {
      titular: "Account holder",
      autorizada: "Authorized person",
    },
    ctaTitulo: "My membership and payments",
    ctaTexto: "Status, bank details, and payment proofs",
  },

  membresia: {
    metaTitle: "Membership · My Borrow Box",
    titulo: "My membership",
    subtitulo: "Your status and your monthly membership payment.",
    estadoCuenta: "Account status",
    membresiaMensual: "Monthly membership",
    activa: {
      titulo: "Your membership is active!",
      texto: "You can now access the tool library and borrow tools.",
    },
    pago: {
      titulo: "Make your payment",
      instruccion: "Transfer {monto} to the account below and upload your payment proof.",
      banco: "Bank",
      routing: "Routing number",
      cuenta: "Account number",
      zelle: "Zelle",
    },
    comprobante: {
      titulo: "Upload your payment proof",
      texto: "Upload a screenshot or PDF of your transfer. We'll review it and activate your account.",
    },
    historial: {
      titulo: "Payment proof history",
      aprobado: "Approved",
      rechazado: "Rejected",
      enRevision: "Under review",
    },
  },

  herramientas: {
    metaTitle: "Tools · My Borrow Box",
    titulo: "Tools",
    subtitulo: "Borrow up to {max} at a time. You currently have {activas} out.",
    reemplazo: "Replacement: {monto}",
    activaMembresia: "Activate membership",
    noDisponible: "Not available",
  },

  escanear: {
    metaTitle: "Scan QR · My Borrow Box",
    titulo: "Scan a tool",
    subtitulo: "Scan the QR code to check out or return a tool.",
  },

  prestamos: {
    metaTitle: "My Loans · My Borrow Box",
    titulo: "My Loans",
    subtitulo: "Your tools, time remaining, and your charges.",
    herramientaFallback: "Tool",
    activos: "Active ({n})",
    activosVacio: "You don't have any active loans.",
    desde: "Since {fecha}",
    cargos: "Charges",
    cargosVacio: "You don't have any charges. Nice work! 🎉",
    historial: "History ({n})",
    devuelta: "Returned {fecha}",
    tipoCargo: {
      retraso: "Late fee",
      reemplazo: "Replacement",
      membresia: "Membership",
    },
    estadoCargo: {
      pagado: "Paid",
      pendiente: "Pending",
    },
  },

  bodega: {
    metaTitle: "Tool library access · My Borrow Box",
    titulo: "Tool library access",
    subtitulo: "Use this code on the door lock.",
    ultimosAccesos: "Your recent visits",
    entrada: "Check-in",
    salida: "Check-out",
  },

  acciones: {
    qrInvalido: "Invalid QR code.",
    herramientaNoEncontrada: "We couldn't find that tool. Double-check the QR code.",
    sesionExpirada: "Your session has expired.",
    sacarOk: "Tool checked out! You have 72 hours to return it.",
    devolverOk: "Tool returned! Thank you.",
    accesoError: "We couldn't log your visit. Is your membership active?",
    entradaRegistrada: "Check-in logged.",
    salidaRegistrada: "Check-out logged.",
    errores: {
      noActiva: "Your membership isn't active yet.",
      noDisponible: "That tool isn't available right now.",
      maximo: "You already have the maximum of 5 tools. Return one to borrow another.",
      noTienes: "You don't have that tool on loan.",
      generico: "We couldn't complete the action. Please try again.",
    },
  },

  comprobanteForm: {
    enviadoTitulo: "Payment proof submitted!",
    enviadoTexto: "We're reviewing it. We'll email you once your membership is active.",
    subir: "Upload payment proof (image or PDF)",
    enviando: "Sending…",
    enviar: "Submit payment proof",
  },

  comprobanteAccion: {
    sesionExpirada: "Your session has expired. Please log in again.",
    seleccionaArchivo: "Choose your payment proof file.",
    archivoGrande: "That file is too large (10 MB max).",
    errorSubida: "We couldn't upload the file. Please try again.",
    errorRegistro: "We couldn't save your payment proof.",
  },

  aviso: {
    pendiente_pago: {
      titulo: "Your membership payment is pending",
      texto: "Make your payment and upload your proof to activate your account and start borrowing tools.",
    },
    comprobante_en_revision: {
      titulo: "We're reviewing your payment proof",
      texto: "As soon as we approve it, we'll email you and unlock everything.",
    },
    suspendido: {
      titulo: "Your membership is suspended",
      texto: "You have pending charges or an account issue. Settle your payment to reactivate it.",
    },
    cancelado: {
      titulo: "Your membership is canceled",
      texto: "Reactivate your membership to keep using the tool library.",
    },
  },

  botonQR: {
    sacar: "Check out",
    devolver: "Return",
    listo: "Done",
    error: "Error",
  },

  codigoPuerta: {
    bloqueadoTitulo: "Code locked",
    bloqueadoTexto: "Only active members can see the door code.",
    etiqueta: "Door lock code",
    ocultar: "Hide code",
    ver: "Show door code",
    registrarEntrada: "Log check-in",
    registrarSalida: "Log check-out",
    listo: "Done",
    error: "Error",
  },

  escaner: {
    inactivaTitulo: "Your membership isn't active",
    inactivaTexto: "Activate it to scan and check out tools.",
    resultadoOk: "All set!",
    resultadoError: "Something went wrong",
    escanearOtra: "Scan another",
    valorReemplazo: "Replacement value:",
    categoriaFallback: "General",
    confirmarSacar: "Are you sure you want to check out this tool? You'll have 72 hours to return it.",
    confirmarDevolver: "Confirm the return of this tool?",
    siSacar: "Yes, check it out",
    siDevolver: "Yes, return it",
    cancelar: "Cancel",
    modoSacar: "Check out",
    modoDevolver: "Return",
    buscando: "Looking up the tool…",
    apunta: "Point the camera at the QR code.",
    abrirCamara: "Open camera",
    detenerCamara: "Stop camera",
    errorCamara: "We couldn't open the camera. Use manual entry instead.",
    errorBusquedaFallback: "We couldn't find that tool.",
    manualLabel: "Camera not working? Paste the token",
    manualPlaceholder: "QR token",
    buscar: "Look up",
  },

  temporizador: {
    devuelta: "Returned",
    quedan: "{dias}d {horas}h left",
    porVencer: "Due soon! {horas}h",
    vencido: "Overdue by {dias}d {horas}h",
  },
};

const es = {
  shell: {
    admin: "Admin",
    cerrarSesion: "Cerrar sesión",
    nav: {
      inicio: "Inicio",
      herramientas: "Herramientas",
      escanear: "Escanear",
      misPrestamos: "Mis préstamos",
      bodega: "Bodega",
      membresia: "Membresía",
      perfil: "Perfil",
    },
    tabs: {
      inicio: "Inicio",
      herramientas: "Herram.",
      escanear: "Escanear",
      misPrestamos: "Préstamos",
      perfil: "Perfil",
    },
  },

  layout: {
    nombreFallback: "Miembro",
  },

  panel: {
    metaTitle: "Mi panel · My Borrow Box",
    saludo: "¡Hola, {nombre}! 👋",
    subtitulo: "Este es tu resumen de hoy.",
    metricas: {
      activasCorta: "Activas",
      activasLarga: "Herramientas activas",
      disponiblesCorta: "Disponibles",
      disponiblesLarga: "Puedes sacar",
      cargosCorta: "Cargos",
      cargosLarga: "Cargos pendientes",
    },
    accesos: {
      escanearTitulo: "Escanear QR",
      escanearTexto: "Saca o devuelve una herramienta",
      herramientasTitulo: "Ver herramientas",
      herramientasTexto: "Explora el catálogo",
      bodegaTitulo: "Acceso a bodega",
      bodegaTexto: "Tu código de la puerta",
    },
    activos: {
      titulo: "Tus préstamos activos",
      verTodos: "Ver todos",
      vacio: "No tienes herramientas prestadas ahora mismo.",
      herramientaFallback: "Herramienta",
    },
  },

  perfil: {
    metaTitle: "Mi perfil · My Borrow Box",
    titulo: "Mi perfil",
    datosTitular: "Datos del titular",
    nombre: "Nombre",
    correo: "Correo",
    telefono: "Teléfono",
    nacimiento: "Nacimiento",
    direccion: "Dirección",
    personaAutorizada: "Persona autorizada",
    miembroDesde: "Miembro desde {fecha}",
    identificaciones: "Identificaciones",
    sinIdentificaciones: "Aún no subiste identificaciones.",
    noDisponible: "No disponible",
    tipoPersona: {
      titular: "Titular",
      autorizada: "Autorizada",
    },
    ctaTitulo: "Mi membresía y pagos",
    ctaTexto: "Estado, datos bancarios y comprobantes",
  },

  membresia: {
    metaTitle: "Mi membresía · My Borrow Box",
    titulo: "Mi membresía",
    subtitulo: "Tu estado y el pago de tu membresía mensual.",
    estadoCuenta: "Estado de tu cuenta",
    membresiaMensual: "Membresía mensual",
    activa: {
      titulo: "¡Tu membresía está activa!",
      texto: "Ya puedes acceder a la bodega y sacar herramientas.",
    },
    pago: {
      titulo: "Realiza tu pago",
      instruccion: "Transfiere {monto} a la siguiente cuenta y sube tu comprobante.",
      banco: "Banco",
      routing: "Routing number",
      cuenta: "Número de cuenta",
      zelle: "Zelle",
    },
    comprobante: {
      titulo: "Sube tu comprobante",
      texto: "Sube la captura o PDF de tu transferencia. Lo revisamos y activamos tu cuenta.",
    },
    historial: {
      titulo: "Historial de comprobantes",
      aprobado: "Aprobado",
      rechazado: "Rechazado",
      enRevision: "En revisión",
    },
  },

  herramientas: {
    metaTitle: "Herramientas · My Borrow Box",
    titulo: "Herramientas",
    subtitulo: "Saca hasta {max} a la vez. Llevas {activas} activas.",
    reemplazo: "Reemplazo: {monto}",
    activaMembresia: "Activa membresía",
    noDisponible: "No disponible",
  },

  escanear: {
    metaTitle: "Escanear QR · My Borrow Box",
    titulo: "Escanear herramienta",
    subtitulo: "Escanea el QR para sacar o devolver una herramienta.",
  },

  prestamos: {
    metaTitle: "Mis préstamos · My Borrow Box",
    titulo: "Mis préstamos",
    subtitulo: "Tus herramientas, el tiempo restante y tus cargos.",
    herramientaFallback: "Herramienta",
    activos: "Activos ({n})",
    activosVacio: "No tienes préstamos activos.",
    desde: "Desde {fecha}",
    cargos: "Cargos",
    cargosVacio: "No tienes cargos. ¡Bien hecho! 🎉",
    historial: "Historial ({n})",
    devuelta: "Devuelta {fecha}",
    tipoCargo: {
      retraso: "Retraso",
      reemplazo: "Reemplazo",
      membresia: "Membresía",
    },
    estadoCargo: {
      pagado: "Pagado",
      pendiente: "Pendiente",
    },
  },

  bodega: {
    metaTitle: "Acceso a bodega · My Borrow Box",
    titulo: "Acceso a la bodega",
    subtitulo: "Usa este código en el candado de la puerta.",
    ultimosAccesos: "Tus últimos accesos",
    entrada: "Entrada",
    salida: "Salida",
  },

  acciones: {
    qrInvalido: "Código QR inválido.",
    herramientaNoEncontrada: "No encontramos esa herramienta. Revisa el QR.",
    sesionExpirada: "Sesión expirada.",
    sacarOk: "¡Herramienta asignada! Tienes 72 horas para devolverla.",
    devolverOk: "¡Herramienta devuelta! Gracias.",
    accesoError: "No se pudo registrar el acceso. ¿Tu membresía está activa?",
    entradaRegistrada: "Entrada registrada.",
    salidaRegistrada: "Salida registrada.",
    errores: {
      noActiva: "Tu membresía no está activa todavía.",
      noDisponible: "Esa herramienta no está disponible ahora.",
      maximo: "Ya tienes el máximo de 5 herramientas. Devuelve una para sacar otra.",
      noTienes: "No tienes esa herramienta prestada.",
      generico: "No se pudo completar la operación. Intenta de nuevo.",
    },
  },

  comprobanteForm: {
    enviadoTitulo: "¡Comprobante enviado!",
    enviadoTexto: "Lo estamos revisando. Te avisaremos por correo cuando se active tu membresía.",
    subir: "Subir comprobante (imagen o PDF)",
    enviando: "Enviando…",
    enviar: "Enviar comprobante",
  },

  comprobanteAccion: {
    sesionExpirada: "Tu sesión expiró. Inicia sesión de nuevo.",
    seleccionaArchivo: "Selecciona el archivo del comprobante.",
    archivoGrande: "El archivo es muy grande (máx. 10 MB).",
    errorSubida: "No se pudo subir el archivo. Intenta de nuevo.",
    errorRegistro: "No se pudo registrar el comprobante.",
  },

  aviso: {
    pendiente_pago: {
      titulo: "Tu membresía está pendiente de pago",
      texto: "Realiza el pago y sube tu comprobante para activar tu cuenta y empezar a sacar herramientas.",
    },
    comprobante_en_revision: {
      titulo: "Estamos revisando tu comprobante",
      texto: "En cuanto lo aprobemos, te avisaremos por correo y desbloquearás todo.",
    },
    suspendido: {
      titulo: "Tu membresía está suspendida",
      texto: "Tienes cargos pendientes o un tema con tu cuenta. Regulariza tu pago para reactivarla.",
    },
    cancelado: {
      titulo: "Tu membresía está cancelada",
      texto: "Vuelve a activar tu membresía para seguir usando la bodega.",
    },
  },

  botonQR: {
    sacar: "Sacar",
    devolver: "Devolver",
    listo: "Listo",
    error: "Error",
  },

  codigoPuerta: {
    bloqueadoTitulo: "Código bloqueado",
    bloqueadoTexto: "Solo los miembros activos pueden ver el código de la puerta.",
    etiqueta: "Código del candado de la puerta",
    ocultar: "Ocultar código",
    ver: "Ver código del candado",
    registrarEntrada: "Registrar entrada",
    registrarSalida: "Registrar salida",
    listo: "Listo",
    error: "Error",
  },

  escaner: {
    inactivaTitulo: "Tu membresía no está activa",
    inactivaTexto: "Actívala para escanear y sacar herramientas.",
    resultadoOk: "¡Listo!",
    resultadoError: "No se pudo",
    escanearOtra: "Escanear otra",
    valorReemplazo: "Valor de reemplazo:",
    categoriaFallback: "General",
    confirmarSacar: "¿Seguro que quieres sacar esta herramienta? Tendrás 72 horas para devolverla.",
    confirmarDevolver: "¿Confirmas la devolución de esta herramienta?",
    siSacar: "Sí, sacar herramienta",
    siDevolver: "Sí, devolver",
    cancelar: "Cancelar",
    modoSacar: "Sacar",
    modoDevolver: "Devolver",
    buscando: "Buscando herramienta…",
    apunta: "Apunta la cámara al código QR.",
    abrirCamara: "Abrir cámara",
    detenerCamara: "Detener cámara",
    errorCamara: "No pudimos abrir la cámara. Usa el ingreso manual.",
    errorBusquedaFallback: "No encontramos esa herramienta.",
    manualLabel: "¿No jala la cámara? Pega el token",
    manualPlaceholder: "Token del QR",
    buscar: "Buscar",
  },

  temporizador: {
    devuelta: "Devuelta",
    quedan: "Quedan {dias}d {horas}h",
    porVencer: "¡Por vencer! {horas}h",
    vencido: "Vencido hace {dias}d {horas}h",
  },
} satisfies typeof en;

export const member = { en, es };
