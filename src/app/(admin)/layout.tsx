import { requerirAdmin } from "@/lib/auth";
import { contarComprobantesPendientes } from "@/lib/admin";
import { AdminShell } from "@/components/admin/AdminShell";

// Área autenticada: siempre dinámica (lee sesión y datos en cada request).
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const perfil = await requerirAdmin();
  const pendientes = await contarComprobantesPendientes();

  return (
    <AdminShell nombre={perfil.nombre_completo || "Admin"} comprobantesPendientes={pendientes}>
      {children}
    </AdminShell>
  );
}
