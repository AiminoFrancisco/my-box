import { crearClienteServidor } from "@/lib/supabase/server";

/** Tipos ligeros usados en la UI pública. */
export type HerramientaPublica = {
  id: string;
  numero_inventario: string;
  nombre: string;
  descripcion: string | null;
  categoria: string | null;
  condicion: string | null;
  valor_reemplazo: number;
  estado: "disponible" | "prestada" | "perdida" | "en_reparacion";
  foto_url: string | null;
};

export type AnuncianteUI = {
  id: string;
  nombre: string;
  categoria: string;
  logo_url: string | null;
  telefono: string | null;
  sitio_web: string | null;
  descripcion: string | null;
};

/**
 * Trae herramientas para el catálogo público.
 * Si la BD aún no está lista (sin migraciones), devuelve [] sin romper la página.
 */
export async function obtenerHerramientas(): Promise<HerramientaPublica[]> {
  try {
    const supabase = crearClienteServidor();
    const { data, error } = await supabase
      .from("herramientas")
      .select(
        "id, numero_inventario, nombre, descripcion, categoria, condicion, valor_reemplazo, estado, foto_url"
      )
      .order("numero_inventario", { ascending: true });
    if (error) throw error;
    return (data ?? []) as unknown as HerramientaPublica[];
  } catch {
    return [];
  }
}

/** Trae anunciantes activos. Devuelve [] si la BD no está lista. */
export async function obtenerAnunciantes(): Promise<AnuncianteUI[]> {
  try {
    const supabase = crearClienteServidor();
    const { data, error } = await supabase
      .from("anunciantes")
      .select("id, nombre, categoria, logo_url, telefono, sitio_web, descripcion")
      .eq("activo", true)
      .order("categoria", { ascending: true });
    if (error) throw error;
    return (data ?? []) as unknown as AnuncianteUI[];
  } catch {
    return [];
  }
}

/** Conteos para los contadores animados de la home. */
export async function obtenerMetricasPublicas() {
  try {
    const supabase = crearClienteServidor();
    const [{ count: totalHerr }, { count: miembrosActivos }] = await Promise.all([
      supabase.from("herramientas").select("*", { count: "exact", head: true }),
      supabase
        .from("perfiles")
        .select("*", { count: "exact", head: true })
        .eq("estado", "activo"),
    ]);
    return {
      totalHerramientas: totalHerr ?? 0,
      miembrosActivos: miembrosActivos ?? 0,
    };
  } catch {
    return { totalHerramientas: 0, miembrosActivos: 0 };
  }
}
