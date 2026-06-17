// Screenshots del catálogo del miembro (desktop + mobile) tras loguear.
import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = "http://localhost:3000";
const EMAIL = "maria.gonzalez@example.com";
const PASS = "Miembro1234!";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--hide-scrollbars"],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });

  // Login
  await page.goto(`${BASE}/login`, { waitUntil: "networkidle2" });
  await page.type('input[name="email"]', EMAIL);
  await page.type('input[name="password"]', PASS);
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle2" }).catch(() => {}),
    page.click('button[type="submit"]'),
  ]);

  // Catálogo del miembro (desktop)
  await page.goto(`${BASE}/herramientas`, { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1500)); // que carguen las imágenes
  await page.screenshot({ path: "/tmp/shot-herramientas-desktop.png" });
  console.log("✅ desktop -> /tmp/shot-herramientas-desktop.png");

  // Mismo, en móvil (iPhone)
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
  await page.goto(`${BASE}/herramientas`, { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: "/tmp/shot-herramientas-mobile.png" });
  console.log("✅ mobile  -> /tmp/shot-herramientas-mobile.png");

  // Panel del miembro en móvil (para ver la barra inferior + métricas)
  await page.goto(`${BASE}/panel`, { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: "/tmp/shot-panel-mobile.png" });
  console.log("✅ panel mobile -> /tmp/shot-panel-mobile.png");
} catch (e) {
  console.error("Error:", e.message);
  process.exit(1);
} finally {
  await browser.close();
}
