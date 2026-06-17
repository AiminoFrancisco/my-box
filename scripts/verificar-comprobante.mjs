// Verifica que la imagen del comprobante cargue en el admin (vía /api/comprobante).
import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = "http://localhost:3000";

const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new", args: ["--no-sandbox", "--hide-scrollbars"] });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1000, deviceScaleFactor: 2 });

  // Login admin
  await page.goto(`${BASE}/admin/login`, { waitUntil: "networkidle2" });
  await page.type('input[name="email"]', "admin@myborrowbox.com");
  await page.type('input[name="password"]', "Admin1234!");
  await Promise.all([page.waitForNavigation({ waitUntil: "networkidle2" }).catch(() => {}), page.click('button[type="submit"]')]);

  await page.goto(`${BASE}/admin/comprobantes`, { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 2500));

  // ¿Cargaron las imágenes servidas por /api/comprobante?
  const info = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll("img")).filter((i) => i.src.includes("/api/comprobante/"));
    return imgs.map((i) => ({ ok: i.complete && i.naturalWidth > 0, w: i.naturalWidth }));
  });
  console.log("imágenes /api/comprobante:", JSON.stringify(info));
  console.log(info.length && info.every((x) => x.ok) ? "✅ TODAS cargaron" : info.length ? "⚠️ alguna no cargó" : "no hay comprobantes con imagen proxy");

  await page.screenshot({ path: "/tmp/shot-comprobantes.png" });
  console.log("📸 /tmp/shot-comprobantes.png");
} catch (e) {
  console.error("Error:", e.message);
} finally {
  await browser.close();
}
