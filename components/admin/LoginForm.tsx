"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function LoginForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await authClient.signIn.email({ email, password });
    setLoading(false);
    if (error) {
      setError(
        error.status === 429
          ? "Trop de tentatives, réessayez dans quelques instants."
          : "Email ou mot de passe incorrect.",
      );
      return;
    }
    router.replace(redirectTo);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-navy-dark focus:ring-2 focus:ring-navy-dark/20"
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm font-medium text-slate-700">
          Mot de passe
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-navy-dark focus:ring-2 focus:ring-navy-dark/20"
        />
      </div>
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-navy-dark px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-medium disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
        Se connecter
      </button>
    </form>
  );
}
