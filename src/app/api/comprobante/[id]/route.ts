import { NextResponse, type NextRequest } from "next/server";
import { crearClienteServidor } from "@/lib/supabase/server";
import { crearClienteAdmin } from "@/lib/supabase/admin";
import { obtenerDic } from "@/lib/i18n/servidor";

export const dynamic = "force-dynamic";

/**
 * Sirve el archivo de un comprobante (bucket privado) sin URLs firmadas.
 * Lo descarga con la llave secreta y valida que el solicitante sea admin o dueño.
 * Evita por completo el problema de "InvalidJWT / exp" de las signed URLs.
 */
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const sis = obtenerDic().emails.sistema;
  const supabase = crearClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new NextResponse(sis.noAutorizado, { status: 401 });

  const admin = crearClienteAdmin();
  const { data: comp } = await admin
    .from("comprobantes_pago")
    .select("perfil_id, url_archivo")
    .eq("id", params.id)
    .single();
  if (!comp) return new NextResponse(sis.noEncontrado, { status: 404 });

  // Admin o dueño del comprobante.
  const { data: perfil } = await admin.from("perfiles").select("rol").eq("id", user.id).single();
  const esAdmin = perfil?.rol === "admin";
  if (!esAdmin && comp.perfil_id !== user.id) return new NextResponse(sis.prohibido, { status: 403 });

  // Compatibilidad: datos de seed con URL http directa.
  if (/^https?:\/\//.test(comp.url_archivo)) return NextResponse.redirect(comp.url_archivo);

  const { data: blob, error } = await admin.storage.from("comprobantes").download(comp.url_archivo);
  if (error || !blob) return new NextResponse(sis.archivoNoDisponible, { status: 404 });

  const buffer = Buffer.from(await blob.arrayBuffer());
  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      "Content-Type": blob.type || "image/jpeg",
      "Cache-Control": "private, max-age=120",
    },
  });
}
