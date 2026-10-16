"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function LogoutButton({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    await authClient.signOut();
    router.replace(redirectTo);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-60"
    >
      <LogOut className="h-4 w-4" />
      Déconnexion
    </button>
  );
}
