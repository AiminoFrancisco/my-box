import { redirect } from "next/navigation";
import { crearClienteServidor } from "@/lib/supabase/server";
import type { Perfil } from "@/types/modelos";

/** Usuario autenticado (o null). */
export async function obtenerUsuario() {
  const supabase = crearClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Perfil del usuario autenticado (o null si no hay sesión / no existe). */
export async function obtenerPerfil(): Promise<Perfil | null> {
  const supabase = crearClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("perfiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (data as unknown as Perfil) ?? null;
}

/** Exige sesión; redirige a /login si no hay. Devuelve el perfil. */
export async function requerirPerfil(rutaActual?: string): Promise<Perfil> {
  const perfil = await obtenerPerfil();
  if (!perfil) {
    redirect(rutaActual ? `/login?redirigir=${encodeURIComponent(rutaActual)}` : "/login");
  }
  return perfil;
}

/** Exige rol admin; redirige a la puerta de admin si no hay sesión, o a /panel si no es admin. */
export async function requerirAdmin(): Promise<Perfil> {
  const perfil = await obtenerPerfil();
  if (!perfil) redirect("/admin/login");
  if (perfil.rol !== "admin") redirect("/panel");
  return perfil;
}
