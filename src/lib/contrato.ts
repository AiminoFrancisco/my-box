/** Texto del contrato de membresía y lista de costos de reemplazo. */

export const CLAUSULAS_CONTRATO = [
  "La membresía de My Borrow Box tiene un costo de $29.99 USD mensuales, pagaderos por transferencia bancaria o Zelle. El acceso se activa una vez aprobado tu comprobante de pago.",
  "Como miembro activo puedes tomar prestadas hasta 5 herramientas a la vez, escaneando el código QR de cada una en la bodega.",
  "El período de préstamo es de 72 horas (3 días). Debes devolver cada herramienta escaneando nuevamente su QR antes de la fecha límite.",
  "Por cada día de retraso se cobra una penalidad de $5 USD por herramienta, hasta un máximo de 5 días. Pasado ese límite, se cobrará el costo total de reemplazo de la herramienta.",
  "Eres responsable del buen uso y cuidado de cada herramienta. Daños, pérdida o robo se cobran al costo de reemplazo indicado en el catálogo.",
  "La persona autorizada que registres debe vivir en la misma dirección registrada y queda sujeta a las mismas condiciones de este contrato.",
  "El acceso a la bodega es personal e intransferible. No compartas el código de acceso con terceros.",
  "My Borrow Box puede suspender o cancelar tu membresía por incumplimiento de estas condiciones.",
];

/** Costos de reemplazo de referencia (resumen mostrado al inscribirse). */
export const COSTOS_REEMPLAZO_EJEMPLO: { nombre: string; costo: number }[] = [
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
];
