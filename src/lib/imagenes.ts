import { crearClienteAdmin } from "@/lib/supabase/admin";

/**
 * Sube una imagen al bucket público `herramientas` y devuelve su URL pública.
 * `slug` se usa para nombrar el archivo (ej. número de inventario o id).
 */
export async function subirImagenHerramienta(
  archivo: File,
  slug: string
): Promise<string | null> {
  const ext = (archivo.name.split(".").pop() ?? "jpg").toLowerCase();
  const limpio = slug.replace(/[^a-zA-Z0-9_-]/g, "_");
  const ruta = `fotos/${limpio}-${Date.now()}.${ext}`;

  const admin = crearClienteAdmin();
  const buffer = Buffer.from(await archivo.arrayBuffer());
  const { error } = await admin.storage
    .from("herramientas")
    .upload(ruta, buffer, { contentType: archivo.type || "image/jpeg", upsert: true });
  if (error) return null;

  const { data } = admin.storage.from("herramientas").getPublicUrl(ruta);
  return data.publicUrl;
}
