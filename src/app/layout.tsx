import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";

// Tipografías modernas: Sora para títulos, Inter para cuerpo/UI.
const inter = Inter({
  subsets: ["latin"],
  variable: "--fuente-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--fuente-sora",
  display: "swap",
});

export const metadata: Metadata = {
  title: "My Borrow Box — Renta herramientas, no las compres",
  description:
    "Hazte miembro en Sahuarita, AZ. Escanea el QR, llévate la herramienta que necesitas y devuélvela en 72 horas. Deja de comprar herramientas que usas una sola vez.",
  openGraph: {
    title: "My Borrow Box",
    description:
      "Tu bodega de herramientas por membresía en Sahuarita, Arizona.",
    type: "website",
    locale: "es_MX",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B2A4A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-MX" className={`${inter.variable} ${sora.variable}`}>
      <body>{children}</body>
    </html>
  );
}
