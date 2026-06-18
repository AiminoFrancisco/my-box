import { FormLoginAdmin } from "@/components/auth/FormLoginAdmin";
import { obtenerDic } from "@/lib/i18n/servidor";

export function generateMetadata() {
  return { title: obtenerDic().auth.adminLogin.meta };
}

export default function AdminLoginPage() {
  return <FormLoginAdmin />;
}
