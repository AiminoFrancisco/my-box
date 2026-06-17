import { redirect } from "next/navigation";
import { ScanLine } from "lucide-react";
import { obtenerPerfil } from "@/lib/auth";
import { EscanerQR } from "@/components/miembro/EscanerQR";

export const metadata = { title: "Escanear QR · My Borrow Box" };

export default async function EscanearPage() {
  const perfil = await obtenerPerfil();
  // Solo miembros activos pueden escanear/sacar herramientas.
  if (perfil && perfil.estado !== "activo") redirect("/membresia");
  const activo = perfil?.estado === "activo";

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradiente-marca text-white shadow-glow">
          <ScanLine className="h-6 w-6" />
        </span>
        <h1 className="mt-3 font-display text-2xl font-extrabold text-marca-marino">Escanear herramienta</h1>
        <p className="mt-1 text-tenue">Escanea el QR para sacar o devolver una herramienta.</p>
      </div>

      <EscanerQR activo={activo} />
    </div>
  );
}
