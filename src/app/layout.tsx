import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { obtenerLocale } from "@/lib/i18n/servidor";
import { obtenerDiccionario } from "@/lib/i18n/diccionario";
import { ProveedorIdioma } from "@/lib/i18n/cliente";

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

export async function generateMetadata(): Promise<Metadata> {
  const dic = obtenerDiccionario(obtenerLocale());
  const m = dic.common.meta;
  return {
    title: m.title,
    description: m.description,
    openGraph: {
      title: m.ogTitle,
      description: m.ogDescription,
      type: "website",
    },
  };
}

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
  const locale = obtenerLocale();
  const dic = obtenerDiccionario(locale);

  return (
    <html
      lang={locale === "es" ? "es-MX" : "en-US"}
      className={`${inter.variable} ${sora.variable}`}
    >
      <body>
        <ProveedorIdioma locale={locale} dic={dic}>
          {children}
        </ProveedorIdioma>
      </body>
    </html>
  );
}
