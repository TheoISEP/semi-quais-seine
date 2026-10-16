import Link from "next/link";
import { Download, Search } from "lucide-react";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Pré-inscrits" };

const PAGE_SIZE = 50;

const sourceLabel: Record<string, string> = {
  SITE: "Site",
  SHEET: "Google Sheet",
  MANUAL: "Manuel",
};

export default async function PreregistrationsPage({
  params,
  searchParams,
}: {
  params: Promise<{ adminSlug: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { adminSlug } = await params;
  const { q = "", page: pageParam } = await searchParams;
  const page = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);
  const query = q.trim();

  const where: Prisma.PreregistrationWhereInput = query
    ? { email: { contains: query, mode: "insensitive" } }
    : {};

  const [total, rows] = await Promise.all([
    db.preregistration.count({ where }),
    db.preregistration.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: { id: true, email: true, source: true, createdAt: true, codeSentAt: true },
    }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const base = `/${adminSlug}/pre-inscrits`;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pré-inscrits</h1>
          <p className="text-sm text-slate-500">
            {total.toLocaleString("fr-FR")} adresse{total > 1 ? "s" : ""} — elles recevront un code -10 % à
            l&rsquo;ouverture des inscriptions.
          </p>
        </div>
        <a
          href={`${base}/export${query ? `?q=${encodeURIComponent(query)}` : ""}`}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <Download className="h-4 w-4" />
          Exporter en CSV
        </a>
      </div>

      <form className="flex max-w-md items-center gap-2" action={base}>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Rechercher un email"
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-navy-dark focus:ring-2 focus:ring-navy-dark/20"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-navy-dark px-3 py-2 text-sm font-medium text-white transition hover:bg-navy-medium"
        >
          Rechercher
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium">Code -10 %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-slate-500">
                  {query ? "Aucune adresse ne correspond." : "Aucune pré-inscription pour l'instant."}
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className="px-4 py-2.5 font-medium text-slate-800">{r.email}</td>
                <td className="px-4 py-2.5 text-slate-600">{formatDate(r.createdAt, true)}</td>
                <td className="px-4 py-2.5 text-slate-600">{sourceLabel[r.source] ?? r.source}</td>
                <td className="px-4 py-2.5 text-slate-600">
                  {r.codeSentAt ? `Envoyé le ${formatDate(r.codeSentAt)}` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <nav className="flex items-center justify-between text-sm text-slate-600">
          <span>
            Page {page} / {pages}
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`${base}?${new URLSearchParams({ ...(query ? { q: query } : {}), page: String(page - 1) })}`}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 hover:bg-slate-50"
              >
                Précédent
              </Link>
            )}
            {page < pages && (
              <Link
                href={`${base}?${new URLSearchParams({ ...(query ? { q: query } : {}), page: String(page + 1) })}`}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 hover:bg-slate-50"
              >
                Suivant
              </Link>
            )}
          </div>
        </nav>
      )}
    </div>
  );
}
