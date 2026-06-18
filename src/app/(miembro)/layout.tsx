import { requerirPerfil } from "@/lib/auth";
import { MiembroShell } from "@/components/miembro/MiembroShell";
import { obtenerDic } from "@/lib/i18n/servidor";

// Área autenticada: siempre dinámica (lee sesión y datos en cada request).
export const dynamic = "force-dynamic";

export default async function MiembroLayout({ children }: { children: React.ReactNode }) {
  const perfil = await requerirPerfil("/panel");
  const dic = obtenerDic();

  return (
    <MiembroShell
      nombre={perfil.nombre_completo || dic.member.layout.nombreFallback}
      estado={perfil.estado}
      esAdmin={perfil.rol === "admin"}
    >
      {children}
    </MiembroShell>
  );
}
