// Captura la card de la herramienta DEMO esperando a que la FOTO cargue.
import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = "http://localhost:3000";

async function esperarImgDemo(page) {
  // Trae la card DEMO a viewport y espera a que su <img> termine de cargar.
  await page.evaluate(() => {
    const arts = Array.from(document.querySelectorAll("article"));
    arts.find((el) => el.textContent?.includes("DEMO"))?.scrollIntoView({ block: "center" });
  });
  await page.waitForFunction(() => {
    const arts = Array.from(document.querySelectorAll("article"));
    const a = arts.find((el) => el.textContent?.includes("DEMO"));
    const img = a?.querySelector("img");
    return img && img.complete && img.naturalWidth > 0;
  }, { timeout: 15000 });
}

const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new", args: ["--no-sandbox", "--hide-scrollbars"] });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });

  await page.goto(`${BASE}/login`, { waitUntil: "networkidle2" });
  await page.type('input[name="email"]', "maria.gonzalez@example.com");
  await page.type('input[name="password"]', "Miembro1234!");
  await Promise.all([page.waitForNavigation({ waitUntil: "networkidle2" }).catch(() => {}), page.click('button[type="submit"]')]);

  await page.goto(`${BASE}/herramientas`, { waitUntil: "networkidle2" });
  await esperarImgDemo(page);
  await new Promise((r) => setTimeout(r, 400));
  const art = await page.evaluateHandle(() => Array.from(document.querySelectorAll("article")).find((el) => el.textContent?.includes("DEMO")));
  await art.asElement().screenshot({ path: "/tmp/shot-demo-card.png" });
  console.log("✅ card demo -> /tmp/shot-demo-card.png");

  // Mobile: 2 columnas con la DEMO arriba
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
  await page.goto(`${BASE}/herramientas`, { waitUntil: "networkidle2" });
  await esperarImgDemo(page);
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: "/tmp/shot-demo-mobile.png" });
  console.log("✅ demo mobile -> /tmp/shot-demo-mobile.png");
} catch (e) {
  console.error("Error:", e.message);
} finally {
  await browser.close();
}
