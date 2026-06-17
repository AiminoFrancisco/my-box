import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, llaveSecreta } from "./llaves";

/**
 * Cliente con llave SECRETA (secret/service_role). ¡Solo en el servidor!
 * Salta RLS por completo, así que NUNCA debe importarse en código del cliente.
 * Se usa para: aprobar comprobantes, generar QR, tareas administrativas y el seed.
 */
export function crearClienteAdmin() {
  return createClient(SUPABASE_URL, llaveSecreta(), {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
