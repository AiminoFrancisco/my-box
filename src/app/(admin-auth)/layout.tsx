import Link from "next/link";
import { Wrench } from "lucide-react";

// Layout oscuro para el acceso administrativo (separado del panel protegido).
export const dynamic = "force-dynamic";

export default function AdminAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-marca-marino px-4 py-10">
      <div className="mesh-fondo absolute inset-0 opacity-30" />

      <Link href="/" className="relative mb-8 flex items-center gap-2 font-display text-xl font-extrabold text-white">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradiente-marca text-white">
          <Wrench className="h-5 w-5" />
        </span>
        My Borrow Box
      </Link>

      <div className="relative w-full max-w-md">{children}</div>

      <Link href="/" className="relative mt-8 text-sm text-white/40 hover:text-white">
        ← Volver al inicio
      </Link>
    </div>
  );
}
