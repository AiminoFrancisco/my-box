// Crea una herramienta de demo subiendo una foto real al bucket `herramientas`
// y generando su QR — replica lo que hace la acción crearHerramienta del admin.
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import QRCode from "qrcode";
import { readFileSync } from "node:fs";

config({ path: ".env.local" });

const a = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, { auth: { persistSession: false } });
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const INV = "INV-021";

// Idempotente: borra la demo previa si existe.
await a.from("herramientas").delete().eq("numero_inventario", INV);

// 1) Subir la foto al bucket público `herramientas`.
const jpg = readFileSync("/tmp/tool.jpg");
const rutaFoto = `fotos/${INV}-${Date.now()}.jpg`;
const up = await a.storage.from("herramientas").upload(rutaFoto, jpg, { contentType: "image/jpeg", upsert: true });
if (up.error) { console.error("Error subiendo foto:", up.error.message); process.exit(1); }
const fotoUrl = a.storage.from("herramientas").getPublicUrl(rutaFoto).data.publicUrl;
console.log("✅ Foto subida:", fotoUrl);

// 2) Insertar la herramienta.
const { data: creada, error } = await a.from("herramientas").insert({
  numero_inventario: INV,
  nombre: "Taladro percutor 20V (DEMO)",
  descripcion: "Taladro inalámbrico con batería de litio, ideal para concreto y madera.",
  categoria: "Eléctrica",
  condicion: "Nueva",
  valor_reemplazo: 135,
  precio: 135,
  estado: "disponible",
  foto_url: fotoUrl,
}).select("id, numero_inventario, qr_token").single();
if (error) { console.error("Error insertando:", error.message); process.exit(1); }
console.log("✅ Herramienta creada:", creada.numero_inventario, creada.id);

// 3) Generar y subir el QR.
const png = await QRCode.toBuffer(`${SITE}/escanear?token=${creada.qr_token}`, { width: 512, margin: 2, color: { dark: "#0B2A4A", light: "#FFFFFF" } });
const rutaQr = `herramientas/${INV}.png`;
await a.storage.from("qr").upload(rutaQr, png, { contentType: "image/png", upsert: true });
const qrUrl = a.storage.from("qr").getPublicUrl(rutaQr).data.publicUrl;
await a.from("herramientas").update({ url_qr: qrUrl }).eq("id", creada.id);
console.log("✅ QR generado:", qrUrl);
console.log("\n🎉 Listo. La herramienta DEMO ya está en el catálogo.");
