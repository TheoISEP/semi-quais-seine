import Image from "next/image";
import { redirect } from "next/navigation";
import { adminPath, getSession } from "@/lib/admin";
import LoginForm from "@/components/admin/LoginForm";

export const metadata = { title: "Connexion" };

export default async function LoginPage({
  params,
}: {
  params: Promise<{ adminSlug: string }>;
}) {
  const { adminSlug } = await params;
  const session = await getSession();
  if (session) redirect(adminPath(adminSlug));

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Image src="/images/logo.png" alt="Semi des Quais de Seine" width={72} height={72} priority />
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Administration</h1>
            <p className="text-sm text-slate-500">Semi des Quais de Seine</p>
          </div>
        </div>
        <LoginForm redirectTo={adminPath(adminSlug)} />
      </div>
    </main>
  );
}
