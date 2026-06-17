import Link from "next/link";
import { Wrench } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-10">
      <div className="mesh-fondo absolute inset-0 -z-10 animate-mesh opacity-60" />

      <Link href="/" className="mb-8 flex items-center gap-2 font-display text-xl font-extrabold text-marca-marino">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradiente-marca text-white shadow-glow">
          <Wrench className="h-5 w-5" />
        </span>
        My Borrow Box
      </Link>

      <div className="w-full max-w-md">{children}</div>

      <Link href="/" className="mt-8 text-sm text-tenue hover:text-marca-azul">
        ← Volver al inicio
      </Link>
    </div>
  );
}
