import QRCode from "qrcode";
import { crearClienteAdmin } from "@/lib/supabase/admin";

/**
 * Genera el PNG del QR de una herramienta (codifica la URL de escaneo con su token),
 * lo sube al bucket público `qr` y devuelve la URL pública.
 */
export async function generarYSubirQR(
  numeroInventario: string,
  qrToken: string
): Promise<string | null> {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const payload = `${site}/escanear?token=${qrToken}`;

  const png = await QRCode.toBuffer(payload, {
    width: 512,
    margin: 2,
    color: { dark: "#0B2A4A", light: "#FFFFFF" },
  });

  const admin = crearClienteAdmin();
  const ruta = `herramientas/${numeroInventario}.png`;
  const { error } = await admin.storage
    .from("qr")
    .upload(ruta, png, { contentType: "image/png", upsert: true });
  if (error) return null;

  const { data } = admin.storage.from("qr").getPublicUrl(ruta);
  return data.publicUrl;
}
