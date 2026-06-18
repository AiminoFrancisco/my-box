import { FormLogin } from "@/components/auth/FormLogin";
import { obtenerDic } from "@/lib/i18n/servidor";

export function generateMetadata() {
  return { title: obtenerDic().auth.login.meta };
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirigir?: string };
}) {
  return <FormLogin redirigir={searchParams.redirigir} />;
}
