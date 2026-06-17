// Regenera los QR de TODAS las herramientas apuntando a la URL de producción,
// y verifica (decodifica) un QR antes y después.
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import QRCode from "qrcode";
import jsQR from "jsqr";
import { PNG } from "pngjs";

config({ path: ".env.local" });

const SITE = process.argv[2]; // URL de producción como argumento
if (!SITE) { console.error("Uso: node scripts/regenerar-qr.mjs https://tu-sitio.vercel.app"); process.exit(1); }

const a = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, { auth: { persistSession: false } });

async function decodificar(url) {
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  const png = PNG.sync.read(buf);
  const code = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
  return code?.data ?? "(no se pudo decodificar)";
}

// 1) Decodificar el QR de una herramienta ANTES
const { data: muestra } = await a.from("herramientas").select("numero_inventario, url_qr").not("url_qr", "is", null).limit(1).single();
console.log("ANTES  →", muestra.numero_inventario, ":", await decodificar(muestra.url_qr));

// 2) Regenerar TODOS
const { data: herrs } = await a.from("herramientas").select("id, numero_inventario, qr_token");
let n = 0;
for (const h of herrs) {
  const payload = `${SITE}/escanear?token=${h.qr_token}`;
  const png = await QRCode.toBuffer(payload, { width: 512, margin: 2, color: { dark: "#0B2A4A", light: "#FFFFFF" } });
  const ruta = `herramientas/${h.numero_inventario}.png`;
  const up = await a.storage.from("qr").upload(ruta, png, { contentType: "image/png", upsert: true });
  if (up.error) { console.warn("  ⚠️", h.numero_inventario, up.error.message); continue; }
  const pub = a.storage.from("qr").getPublicUrl(ruta).data.publicUrl;
  await a.from("herramientas").update({ url_qr: pub }).eq("id", h.id);
  n++;
}
console.log(`Regenerados: ${n}/${herrs.length}`);

// 3) Decodificar DESPUÉS (mismo path, hay que evitar caché agregando ?v=)
const urlVerif = `${a.storage.from("qr").getPublicUrl(`herramientas/${muestra.numero_inventario}.png`).data.publicUrl}?v=${n}`;
console.log("DESPUÉS →", muestra.numero_inventario, ":", await decodificar(urlVerif));
