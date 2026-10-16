import { requireSession } from "@/lib/admin";
import Sidebar from "@/components/admin/Sidebar";
import LogoutButton from "@/components/admin/LogoutButton";

export default async function ProtectedLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ adminSlug: string }>;
}) {
  const { adminSlug } = await params;
  const session = await requireSession(adminSlug);

  return (
    <div className="flex min-h-screen">
      <Sidebar slug={adminSlug} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
          <p className="text-sm text-slate-500">
            Connecté en tant que <span className="font-medium text-slate-800">{session.user.email}</span>
          </p>
          <LogoutButton redirectTo={`/${adminSlug}/login`} />
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
