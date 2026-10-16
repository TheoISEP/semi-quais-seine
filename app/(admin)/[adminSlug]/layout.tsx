import type { Metadata } from "next";
import { assertAdminSlug } from "@/lib/admin";

export const metadata: Metadata = {
  title: { default: "Administration", template: "%s · Administration" },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export const dynamic = "force-dynamic";

export default async function AdminRootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ adminSlug: string }>;
}) {
  const { adminSlug } = await params;
  assertAdminSlug(adminSlug);

  return (
    <div data-admin className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      {children}
    </div>
  );
}
