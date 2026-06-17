import { FormLogin } from "@/components/auth/FormLogin";

export const metadata = { title: "Iniciar sesión · My Borrow Box" };

export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirigir?: string };
}) {
  return <FormLogin redirigir={searchParams.redirigir} />;
}
