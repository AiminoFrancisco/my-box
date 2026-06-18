import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, QrCode } from "lucide-react";
import { crearClienteAdmin } from "@/lib/supabase/admin";
import { BotonImprimir } from "@/components/admin/BotonImprimir";
import { obtenerDic } from "@/lib/i18n/servidor";
import { formatoDinero } from "@/lib/utils";
import type { Herramienta } from "@/types/modelos";

export function generateMetadata() {
  return { title: obtenerDic().admin.meta.qr };
}

export default async function QrHerramienta({ params }: { params: { id: string } }) {
  const dic = obtenerDic();
  const admin = crearClienteAdmin();
  const { data } = await admin.from("herramientas").select("*").eq("id", params.id).single();
  if (!data) notFound();
  const h = data as unknown as Herramienta;

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="flex items-center justify-between print:hidden">
        <Link href="/admin/herramientas" className="inline-flex items-center gap-1 text-sm text-tenue hover:text-marca-azul">
          <ArrowLeft className="h-4 w-4" /> {dic.admin.herramientas.qr.volver}
        </Link>
        <BotonImprimir />
      </div>

      {/* Etiqueta imprimible */}
      <div className="rounded-2xl border-2 border-marca-marino bg-white p-8 text-center">
        <div className="flex items-center justify-center gap-2 font-display text-lg font-extrabold text-marca-marino">
          🧰 My Borrow Box
        </div>
        <div className="mx-auto mt-5 flex h-64 w-64 items-center justify-center">
          {h.url_qr ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={h.url_qr} alt={dic.admin.herramientas.qr.altQr.replace("{nombre}", h.nombre)} className="h-full w-full object-contain" />
          ) : (
            <div className="flex flex-col items-center text-tenue">
              <QrCode className="h-16 w-16" />
              <p className="mt-2 text-xs">{dic.admin.herramientas.qr.noGenerado}</p>
            </div>
          )}
        </div>
        <h1 className="mt-4 font-display text-xl font-bold text-marca-marino">{h.nombre}</h1>
        <p className="font-mono text-sm text-tenue">{h.numero_inventario}</p>
        <p className="mt-1 text-xs text-tenue">{dic.admin.herramientas.qr.reemplazo.replace("{monto}", formatoDinero(h.valor_reemplazo))}</p>
        <p className="mt-4 text-xs text-tenue">{dic.admin.herramientas.qr.instruccion}</p>
      </div>
    </div>
  );
}
