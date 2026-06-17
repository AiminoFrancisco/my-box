import { requerirPerfil } from "@/lib/auth";
import { MiembroShell } from "@/components/miembro/MiembroShell";

// Área autenticada: siempre dinámica (lee sesión y datos en cada request).
export const dynamic = "force-dynamic";

export default async function MiembroLayout({ children }: { children: React.ReactNode }) {
  const perfil = await requerirPerfil("/panel");

  return (
    <MiembroShell
      nombre={perfil.nombre_completo || "Miembro"}
      estado={perfil.estado}
      esAdmin={perfil.rol === "admin"}
    >
      {children}
    </MiembroShell>
  );
}
