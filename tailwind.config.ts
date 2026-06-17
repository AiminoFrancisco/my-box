import type { Config } from "tailwindcss";

/**
 * Configuración de Tailwind para My Borrow Box.
 * La paleta sale del logo: azul brillante + azul marino + ámbar "construcción".
 * Los colores se exponen como variables CSS (definidas en globals.css) para
 * poder prender el modo oscuro fácilmente más adelante.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/emails/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Marca
        marca: {
          azul: "#2B9FE6", // azul brillante (primario)
          marino: "#0B2A4A", // azul marino profundo
          ambar: "#F5A623", // ámbar CTA "construcción"
        },
        // Tokens semánticos vía variables CSS (cambian en dark mode)
        fondo: "rgb(var(--fondo) / <alpha-value>)",
        superficie: "rgb(var(--superficie) / <alpha-value>)",
        contenido: "rgb(var(--contenido) / <alpha-value>)",
        tenue: "rgb(var(--tenue) / <alpha-value>)",
        borde: "rgb(var(--borde) / <alpha-value>)",
        // Estados (semáforo de préstamos)
        exito: "#16A34A",
        alerta: "#F59E0B",
        peligro: "#DC2626",
      },
      fontFamily: {
        // Cargadas con next/font en layout.tsx
        sans: ["var(--fuente-inter)", "system-ui", "sans-serif"],
        display: ["var(--fuente-sora)", "var(--fuente-inter)", "sans-serif"],
      },
      boxShadow: {
        suave: "0 8px 30px -12px rgba(11, 42, 74, 0.18)",
        glow: "0 0 0 1px rgba(43, 159, 230, 0.25), 0 12px 40px -12px rgba(43, 159, 230, 0.45)",
        glassmorph: "0 8px 32px -8px rgba(11, 42, 74, 0.25)",
      },
      backgroundImage: {
        "gradiente-marca": "linear-gradient(135deg, #2B9FE6 0%, #0B2A4A 100%)",
        "gradiente-cta": "linear-gradient(135deg, #F5A623 0%, #f08c00 100%)",
      },
      keyframes: {
        "mesh-mover": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(3%, -4%) scale(1.05)" },
          "66%": { transform: "translate(-3%, 3%) scale(0.97)" },
        },
        "brillo-paso": {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(120%)" },
        },
        flotar: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        mesh: "mesh-mover 18s ease-in-out infinite",
        brillo: "brillo-paso 1.2s ease-in-out",
        flotar: "flotar 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
