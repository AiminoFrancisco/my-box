import { Settings } from "lucide-react";
import { crearClienteAdmin } from "@/lib/supabase/admin";
import { FormConfiguracion } from "@/components/admin/FormConfiguracion";
import { CONFIG_DEFECTO } from "@/lib/config";
import { obtenerDic } from "@/lib/i18n/servidor";

export function generateMetadata() {
  return { title: obtenerDic().admin.meta.configuracion };
}

export default async function ConfiguracionPage() {
  const dic = obtenerDic();
  const admin = crearClienteAdmin();
  const { data } = await admin.from("configuracion").select("clave, valor");

  const valores: Record<string, string> = Object.fromEntries(
    Object.entries(CONFIG_DEFECTO).map(([k, v]) => [k, String(v)])
  );
  for (const fila of (data ?? []) as { clave: string; valor: string }[]) {
    if (fila.valor != null) valores[fila.clave] = fila.valor;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 font-display text-2xl font-extrabold text-marca-marino">
          <Settings className="h-6 w-6 text-marca-azul" /> {dic.admin.config.titulo}
        </h1>
        <p className="mt-1 text-tenue">{dic.admin.config.subtitulo}</p>
      </div>

      <FormConfiguracion valores={valores} />
    </div>
  );
}
