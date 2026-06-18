/**
 * Sustituye marcadores `{clave}` dentro de un texto del diccionario por sus
 * valores. Mantiene los diccionarios como datos puros (sólo strings), lo que
 * permite pasarlos serializados a client components.
 *
 *   interpolar("Hola, {nombre}", { nombre: "Ana" })  // "Hola, Ana"
 */
export function interpolar(
  plantilla: string,
  valores: Record<string, string | number>
): string {
  return plantilla.replace(/\{(\w+)\}/g, (_, clave) =>
    valores[clave] != null ? String(valores[clave]) : `{${clave}}`
  );
}
