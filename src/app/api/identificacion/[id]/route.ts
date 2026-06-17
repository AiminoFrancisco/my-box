import { NextResponse, type NextRequest } from "next/server";
import { crearClienteServidor } from "@/lib/supabase/server";
import { crearClienteAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

/**
 * Sirve la imagen de una identificación (bucket privado) sin URLs firmadas.
 * Valida que el solicitante sea admin o dueño de la identificación.
 */
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = crearClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new NextResponse("No autorizado", { status: 401 });

  const admin = crearClienteAdmin();
  const { data: id } = await admin
    .from("identificaciones")
    .select("perfil_id, url_imagen")
    .eq("id", params.id)
    .single();
  if (!id) return new NextResponse("No encontrado", { status: 404 });

  const { data: perfil } = await admin.from("perfiles").select("rol").eq("id", user.id).single();
  const esAdmin = perfil?.rol === "admin";
  if (!esAdmin && id.perfil_id !== user.id) return new NextResponse("Prohibido", { status: 403 });

  if (/^https?:\/\//.test(id.url_imagen)) return NextResponse.redirect(id.url_imagen);

  const { data: blob, error } = await admin.storage.from("identificaciones").download(id.url_imagen);
  if (error || !blob) return new NextResponse("Archivo no disponible", { status: 404 });

  const buffer = Buffer.from(await blob.arrayBuffer());
  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      "Content-Type": blob.type || "image/jpeg",
      "Cache-Control": "private, max-age=120",
    },
  });
}
