"use client";

/**
 * Contexto de i18n para client components. El `ProveedorIdioma` se monta en el
 * layout raíz con el idioma y el diccionario ya resueltos en el servidor, así
 * que cualquier client component puede leer textos con `useDic()` sin esperas.
 */
import { createContext, useContext } from "react";
import type { Locale } from "./config";
import type { Diccionario } from "./diccionario";

type ValorContexto = { locale: Locale; dic: Diccionario };

const ContextoIdioma = createContext<ValorContexto | null>(null);

export function ProveedorIdioma({
  locale,
  dic,
  children,
}: {
  locale: Locale;
  dic: Diccionario;
  children: React.ReactNode;
}) {
  return (
    <ContextoIdioma.Provider value={{ locale, dic }}>
      {children}
    </ContextoIdioma.Provider>
  );
}

function useContextoIdioma(): ValorContexto {
  const ctx = useContext(ContextoIdioma);
  if (!ctx) {
    throw new Error("useDic/useLocale deben usarse dentro de <ProveedorIdioma>");
  }
  return ctx;
}

/** Diccionario completo del idioma activo. */
export function useDic(): Diccionario {
  return useContextoIdioma().dic;
}

/** Idioma activo ("en" | "es"). */
export function useLocale(): Locale {
  return useContextoIdioma().locale;
}
