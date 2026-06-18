import { FormRegistro } from "@/components/auth/FormRegistro";
import { obtenerDic } from "@/lib/i18n/servidor";

export function generateMetadata() {
  return { title: obtenerDic().auth.registro.meta };
}

export default function RegistroPage() {
  return <FormRegistro />;
}
