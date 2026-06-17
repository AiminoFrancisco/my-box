"use client";

import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_URL, LLAVE_PUBLICA } from "./llaves";

/**
 * Cliente de Supabase para el navegador (componentes "use client").
 * Usa la llave pública (publishable/anon) — la seguridad real vive en RLS.
 *
 * Nota: sin genérico (permisivo). Cuando generes los tipos con la CLI de
 * Supabase, podés tiparlo con createBrowserClient<Database>(...).
 */
export function crearClienteNavegador() {
  return createBrowserClient(SUPABASE_URL, LLAVE_PUBLICA);
}
