/**
 * Textos del área de autenticación: login de miembros, registro, login de
 * administradores y mensajes de las server actions. El inglés es la fuente de
 * la forma del diccionario; el español sigue la misma estructura
 * (`satisfies typeof en`).
 */
const en = {
  // Layouts compartidos del área auth.
  layout: {
    volverInicio: "← Back to home",
  },

  login: {
    meta: "Log in · My Borrow Box",
    titulo: "Welcome back",
    subtitulo: "Sign in to your My Borrow Box account.",
    email: "Email",
    emailPlaceholder: "you@email.com",
    password: "Password",
    botonEntrar: "Log in",
    botonEntrando: "Signing in…",
    sinCuenta: "Don't have an account?",
    hazteMiembro: "Become a member",
  },

  registro: {
    meta: "Become a member · My Borrow Box",
    titulo: "Become a member",
    pasoDe: "Step {actual} of {total}: {nombre}",
    pasos: {
      titular: "Account holder",
      autorizadaIds: "Authorized person & IDs",
      contrato: "Agreement",
    },
    // Paso 1 · Titular
    nombreCompleto: "Full name",
    nombreCompletoPlaceholder: "Your first and last name",
    direccion: "Address",
    direccionPlaceholder: "Street, city, state, ZIP",
    telefono: "Phone",
    telefonoPlaceholder: "+1 520-555-0000",
    fechaNacimiento: "Date of birth",
    email: "Email",
    emailPlaceholder: "you@email.com",
    password: "Password",
    passwordPlaceholder: "At least 8 characters",
    // Paso 2 · Persona autorizada + IDs
    notaMismaDireccion: {
      antes: "The authorized person must live at the ",
      resaltado: "same address",
      despues: " you registered.",
    },
    personaAutorizada: "Authorized person's name",
    personaAutorizadaPlaceholder: "First and last name",
    idTitular: "Account holder's ID",
    idAutorizada: "Authorized person's ID",
    archivoPlaceholder: "Take a photo or upload an image/PDF",
    faltanIds: "Please upload both the account holder's and the authorized person's ID.",
    // Paso 3 · Contrato
    contratoTitulo: "Membership agreement",
    costosTitulo: "Replacement costs (for reference)",
    clausulas: [
      "My Borrow Box membership costs $29.99 USD per month, payable by bank transfer or Zelle. Your access is activated once we approve your payment proof.",
      "As an active member, you can borrow up to 5 tools at a time by scanning each tool's QR code at the tool library.",
      "The loan period is 72 hours (3 days). You must return each tool by scanning its QR code again before the due date.",
      "For each day a tool is late, there is a $5 USD late fee per tool, up to a maximum of 5 days. After that, you'll be charged the tool's full replacement cost.",
      "You're responsible for the proper use and care of every tool. Damage, loss, or theft is charged at the replacement cost listed in the catalog.",
      "Any authorized person you register must live at the same registered address and is bound by the same terms of this agreement.",
      "Access to the tool library is personal and non-transferable. Do not share the access code with anyone else.",
      "My Borrow Box may suspend or cancel your membership if these terms are not met.",
    ],
    costosReemplazo: [
      { nombre: "Claw hammer", costo: 25 },
      { nombre: "Screwdriver set", costo: 35 },
      { nombre: "Orbital sander", costo: 55 },
      { nombre: "Leaf blower", costo: 70 },
      { nombre: "6 ft step ladder", costo: 85 },
      { nombre: "2-ton floor jack", costo: 95 },
      { nombre: "Circular saw", costo: 110 },
      { nombre: "Cordless drill", costo: 120 },
      { nombre: "Impact wrench", costo: 130 },
      { nombre: "Weed eater", costo: 150 },
      { nombre: "Pressure washer", costo: 160 },
      { nombre: "Air compressor", costo: 180 },
      { nombre: "Portable generator", costo: 450 },
      { nombre: "Hydraulic demolition hammer", costo: 650 },
    ],
    aceptoContrato:
      "I have read and accept the membership agreement and the replacement cost list.",
    // Botones / navegación
    botonCrear: "Create account",
    botonCreando: "Creating your account…",
    atras: "Back",
    siguiente: "Next",
    yaTienesCuenta: "Already have an account?",
    iniciarSesion: "Log in",
  },

  adminLogin: {
    meta: "Admin access · My Borrow Box",
    titulo: "Admin access",
    subtitulo: "My Borrow Box staff only.",
    email: "Email",
    emailPlaceholder: "admin@myborrowbox.com",
    password: "Password",
    botonEntrar: "Enter dashboard",
    botonVerificando: "Verifying…",
    eresMiembro: "Are you a member?",
    entraPorAqui: "Log in here",
  },

  // Mensajes de error / validación devueltos por las server actions.
  errores: {
    completaCredenciales: "Please enter your email and password.",
    credencialesIncorrectas: "Incorrect email or password.",
    noEsAdmin: "This account isn't an admin account. Please use the member login.",
    faltanDatosTitular: "Some required account holder details are missing.",
    passwordCorta: "Your password must be at least 8 characters long.",
    indicaFechaNacimiento: "Please enter your date of birth.",
    indicaPersonaAutorizada: "Please enter the authorized person's name.",
    debesAceptarContrato: "You must accept the membership agreement to continue.",
    subeIdTitular: "Please upload a photo of the account holder's ID.",
    subeIdAutorizada: "Please upload a photo of the authorized person's ID.",
    cuentaYaExiste: "An account with that email already exists. Please log in.",
    noSePudoCrear: "We couldn't create your account. Please try again.",
    falloSubidaIds:
      "Your account was created, but uploading the IDs failed. You can upload them from your profile.",
  },
};

const es = {
  layout: {
    volverInicio: "← Volver al inicio",
  },

  login: {
    meta: "Iniciar sesión · My Borrow Box",
    titulo: "Bienvenido de vuelta",
    subtitulo: "Entra a tu cuenta de My Borrow Box.",
    email: "Correo electrónico",
    emailPlaceholder: "tu@correo.com",
    password: "Contraseña",
    botonEntrar: "Iniciar sesión",
    botonEntrando: "Entrando…",
    sinCuenta: "¿No tienes cuenta?",
    hazteMiembro: "Hazte miembro",
  },

  registro: {
    meta: "Hazte miembro · My Borrow Box",
    titulo: "Hazte miembro",
    pasoDe: "Paso {actual} de {total}: {nombre}",
    pasos: {
      titular: "Titular",
      autorizadaIds: "Autorizada e IDs",
      contrato: "Contrato",
    },
    nombreCompleto: "Nombre completo",
    nombreCompletoPlaceholder: "Tu nombre y apellidos",
    direccion: "Dirección",
    direccionPlaceholder: "Calle, ciudad, estado, ZIP",
    telefono: "Teléfono",
    telefonoPlaceholder: "+1 520-555-0000",
    fechaNacimiento: "Fecha de nacimiento",
    email: "Correo electrónico",
    emailPlaceholder: "tu@correo.com",
    password: "Contraseña",
    passwordPlaceholder: "Mínimo 8 caracteres",
    notaMismaDireccion: {
      antes: "La persona autorizada debe vivir en la ",
      resaltado: "misma dirección",
      despues: " que registraste.",
    },
    personaAutorizada: "Nombre de la persona autorizada",
    personaAutorizadaPlaceholder: "Nombre y apellidos",
    idTitular: "Identificación del titular",
    idAutorizada: "Identificación de la persona autorizada",
    archivoPlaceholder: "Tomar foto o subir imagen/PDF",
    faltanIds: "Sube la identificación del titular y de la persona autorizada.",
    contratoTitulo: "Contrato de membresía",
    costosTitulo: "Costos de reemplazo (referencia)",
    clausulas: [
      "La membresía de My Borrow Box tiene un costo de $29.99 USD mensuales, pagaderos por transferencia bancaria o Zelle. El acceso se activa una vez aprobado tu comprobante de pago.",
      "Como miembro activo puedes tomar prestadas hasta 5 herramientas a la vez, escaneando el código QR de cada una en la bodega.",
      "El período de préstamo es de 72 horas (3 días). Debes devolver cada herramienta escaneando nuevamente su QR antes de la fecha límite.",
      "Por cada día de retraso se cobra una penalidad de $5 USD por herramienta, hasta un máximo de 5 días. Pasado ese límite, se cobrará el costo total de reemplazo de la herramienta.",
      "Eres responsable del buen uso y cuidado de cada herramienta. Daños, pérdida o robo se cobran al costo de reemplazo indicado en el catálogo.",
      "La persona autorizada que registres debe vivir en la misma dirección registrada y queda sujeta a las mismas condiciones de este contrato.",
      "El acceso a la bodega es personal e intransferible. No compartas el código de acceso con terceros.",
      "My Borrow Box puede suspender o cancelar tu membresía por incumplimiento de estas condiciones.",
    ],
    costosReemplazo: [
      { nombre: "Martillo de uña", costo: 25 },
      { nombre: "Juego de desarmadores", costo: 35 },
      { nombre: "Lijadora orbital", costo: 55 },
      { nombre: "Sopladora de hojas", costo: 70 },
      { nombre: "Escalera de tijera 6 ft", costo: 85 },
      { nombre: "Floor jack 2T", costo: 95 },
      { nombre: "Sierra circular", costo: 110 },
      { nombre: "Taladro inalámbrico", costo: 120 },
      { nombre: "Llave de impacto", costo: 130 },
      { nombre: "Weed eater", costo: 150 },
      { nombre: "Hidrolavadora", costo: 160 },
      { nombre: "Compresor de aire", costo: 180 },
      { nombre: "Generador portátil", costo: 450 },
      { nombre: "Martillo demoledor hidráulico", costo: 650 },
    ],
    aceptoContrato:
      "He leído y acepto el contrato de membresía y la lista de costos de reemplazo.",
    botonCrear: "Crear cuenta",
    botonCreando: "Creando tu cuenta…",
    atras: "Atrás",
    siguiente: "Siguiente",
    yaTienesCuenta: "¿Ya tienes cuenta?",
    iniciarSesion: "Inicia sesión",
  },

  adminLogin: {
    meta: "Acceso admin · My Borrow Box",
    titulo: "Acceso administrativo",
    subtitulo: "Solo personal de My Borrow Box.",
    email: "Correo",
    emailPlaceholder: "admin@myborrowbox.com",
    password: "Contraseña",
    botonEntrar: "Entrar al panel",
    botonVerificando: "Verificando…",
    eresMiembro: "¿Eres miembro?",
    entraPorAqui: "Entra por aquí",
  },

  errores: {
    completaCredenciales: "Completa tu correo y contraseña.",
    credencialesIncorrectas: "Correo o contraseña incorrectos.",
    noEsAdmin: "Esta cuenta no es de administrador. Usa el acceso de miembros.",
    faltanDatosTitular: "Faltan datos obligatorios del titular.",
    passwordCorta: "La contraseña debe tener al menos 8 caracteres.",
    indicaFechaNacimiento: "Indica tu fecha de nacimiento.",
    indicaPersonaAutorizada: "Indica el nombre de la persona autorizada.",
    debesAceptarContrato: "Debes aceptar el contrato de membresía para continuar.",
    subeIdTitular: "Sube la foto de la identificación del titular.",
    subeIdAutorizada: "Sube la foto de la identificación de la persona autorizada.",
    cuentaYaExiste: "Ya existe una cuenta con ese correo. Inicia sesión.",
    noSePudoCrear: "No se pudo crear la cuenta. Intenta de nuevo.",
    falloSubidaIds:
      "La cuenta se creó pero falló la subida de identificaciones. Súbelas desde tu perfil.",
  },
} satisfies typeof en;

export const auth = { en, es };
