/**
 * Traduce a inglés el catálogo demo ya cargado (herramientas + descripciones de
 * aliados). Idempotente: actualiza por `numero_inventario` / `nombre`, así que
 * se puede correr varias veces sin duplicar nada.
 *
 *   npx tsx supabase/seed/traducir-catalogo.ts
 *
 * Requiere en .env.local: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SECRET_KEY
 * (o SUPABASE_SERVICE_ROLE_KEY).
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY =
  process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL || !SERVICE_KEY) {
  console.error("❌ Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SECRET_KEY en .env.local");
  process.exit(1);
}

const supabase = createClient(URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

// numero_inventario -> { nombre, descripcion, categoria, condicion, foto_url }
const PH = "https://placehold.co/600x400";
const HERRAMIENTAS = [
  ["INV-001", "16 oz Claw Hammer", "Classic hammer for nails and light demolition.", "Construction", "Good", `${PH}/2B9FE6/FFFFFF?text=Claw+Hammer`],
  ["INV-002", "20V Cordless Drill", "Drill/driver with a lithium battery and charger.", "Power tools", "New", `${PH}/0B2A4A/FFFFFF?text=Drill`],
  ["INV-003", "6 ft Step Ladder", "Aluminum ladder, 6 ft, holds up to 250 lb.", "Construction", "Good", `${PH}/F5A623/0B2A4A?text=Ladder`],
  ["INV-004", "Weed Eater (String Trimmer)", "Gas-powered trimmer for edges and weeds.", "Lawn & Garden", "Used", `${PH}/16A34A/FFFFFF?text=Weed+Eater`],
  ["INV-005", "2-Ton Floor Jack", "Hydraulic floor jack, 2 tons.", "Automotive", "Good", `${PH}/2B9FE6/FFFFFF?text=Floor+Jack`],
  ["INV-006", "Leaf Blower", "Electric blower for leaves and debris.", "Lawn & Garden", "Good", `${PH}/0B2A4A/FFFFFF?text=Leaf+Blower`],
  ["INV-007", "Hydraulic Demolition Hammer", "Breaker/demolition hammer for concrete. Large tool.", "Construction", "Good", `${PH}/DC2626/FFFFFF?text=Demo+Hammer`],
  ["INV-008", '7-1/4" Circular Saw', "Circular saw for wood, 15 amp.", "Power tools", "Good", `${PH}/2B9FE6/FFFFFF?text=Circular+Saw`],
  ["INV-009", "Orbital Sander", "Finishing sander for smooth surfaces.", "Power tools", "Good", `${PH}/0B2A4A/FFFFFF?text=Sander`],
  ["INV-010", "6 gal Air Compressor", "Portable pancake compressor, 150 psi.", "Power tools", "Good", `${PH}/F5A623/0B2A4A?text=Compressor`],
  ["INV-011", "3500W Portable Generator", "Gas generator for emergencies and job sites.", "Power tools", "Good", `${PH}/16A34A/FFFFFF?text=Generator`],
  ["INV-012", "Screwdriver Set", "Set of 20 flathead and Phillips screwdrivers.", "Hand tools", "New", `${PH}/2B9FE6/FFFFFF?text=Screwdrivers`],
  ["INV-013", '1/2" Impact Wrench', "Electric impact wrench for lug nuts.", "Automotive", "Good", `${PH}/0B2A4A/FFFFFF?text=Impact+Wrench`],
  ["INV-014", "Tile Cutter", "Manual cutter for ceramic and tile.", "Construction", "Good", `${PH}/F5A623/0B2A4A?text=Tile+Cutter`],
  ["INV-015", "Heavy-Duty Push Broom", "Stiff-bristle broom for shop or outdoor use.", "Cleaning", "Good", `${PH}/16A34A/FFFFFF?text=Push+Broom`],
  ["INV-016", "Wheelbarrow", "Single-wheel wheelbarrow for hauling.", "Construction", "Used", `${PH}/F59E0B/FFFFFF?text=Wheelbarrow`],
  ["INV-017", "Heat Gun", "Heat gun for paint stripping and soldering.", "Power tools", "Good", `${PH}/2B9FE6/FFFFFF?text=Heat+Gun`],
  ["INV-018", "Laser Level", "Self-leveling cross-line laser level.", "Measuring", "New", `${PH}/0B2A4A/FFFFFF?text=Laser+Level`],
  ["INV-019", '4-1/2" Angle Grinder', "Grinder for metal and concrete.", "Power tools", "Good", `${PH}/DC2626/FFFFFF?text=Angle+Grinder`],
  ["INV-020", "2000 psi Pressure Washer", "Electric pressure washer for cleaning.", "Cleaning", "Good", `${PH}/16A34A/FFFFFF?text=Pressure+Washer`],
] as const;

// nombre -> descripcion (los nombres y categorías de aliados ya están en inglés)
const ANUNCIANTES: [string, string][] = [
  ["Desert Air HVAC", "AC installation and repair in Sahuarita and Green Valley."],
  ["Sahuarita Roofing Pros", "New roofs, repairs, and maintenance. Free estimates."],
  ["Green Valley Plumbing", "24/7 residential plumbing. Leaks, water heaters, and drains."],
  ["Bright Spark Electrical", "Licensed electricians. Panels, wiring, and EV chargers."],
  ["Sonoran Solar", "Solar panels and batteries. Save on your electric bill."],
  ["Blue Wave Pools", "Pool construction and maintenance in south Tucson."],
  ["AZ Garage Doors", "Garage door and opener repair and installation."],
];

async function main() {
  let ok = 0;
  for (const [numero_inventario, nombre, descripcion, categoria, condicion, foto_url] of HERRAMIENTAS) {
    const { error } = await supabase
      .from("herramientas")
      .update({ nombre, descripcion, categoria, condicion, foto_url })
      .eq("numero_inventario", numero_inventario);
    if (error) console.error(`⚠️  ${numero_inventario}: ${error.message}`);
    else ok++;
  }
  console.log(`✅ Herramientas actualizadas: ${ok}/${HERRAMIENTAS.length}`);

  let okA = 0;
  for (const [nombre, descripcion] of ANUNCIANTES) {
    const { error } = await supabase
      .from("anunciantes")
      .update({ descripcion })
      .eq("nombre", nombre);
    if (error) console.error(`⚠️  ${nombre}: ${error.message}`);
    else okA++;
  }
  console.log(`✅ Aliados actualizados: ${okA}/${ANUNCIANTES.length}`);
}

main().then(() => process.exit(0));
