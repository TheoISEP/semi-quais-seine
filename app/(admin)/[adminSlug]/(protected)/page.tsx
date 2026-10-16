import Link from "next/link";
import { ArrowRight, CalendarDays, Mails, TrendingUp } from "lucide-react";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import StatCard from "@/components/admin/StatCard";

export const metadata = { title: "Tableau de bord" };

const DAYS = 14;

function dayKey(d: Date): string {
  return new Intl.DateTimeFormat("fr-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ adminSlug: string }>;
}) {
  const { adminSlug } = await params;
  const now = new Date();
  const since7 = new Date(now.getTime() - 7 * 86_400_000);
  const sinceSeries = new Date(now.getTime() - (DAYS - 1) * 86_400_000);
  const todayKey = dayKey(now);

  const [total, last7, recent, edition] = await Promise.all([
    db.preregistration.count(),
    db.preregistration.count({ where: { createdAt: { gte: since7 } } }),
    db.preregistration.findMany({
      where: { createdAt: { gte: new Date(sinceSeries.toDateString()) } },
      select: { createdAt: true },
    }),
    db.edition.findFirst({ orderBy: { year: "desc" }, include: { races: { orderBy: { sortOrder: "asc" } } } }),
  ]);

  const buckets = new Map<string, number>();
  for (let i = DAYS - 1; i >= 0; i--) {
    buckets.set(dayKey(new Date(now.getTime() - i * 86_400_000)), 0);
  }
  for (const { createdAt } of recent) {
    const k = dayKey(createdAt);
    if (buckets.has(k)) buckets.set(k, (buckets.get(k) ?? 0) + 1);
  }
  const series = [...buckets.entries()];
  const max = Math.max(1, ...series.map(([, n]) => n));
  const today = buckets.get(todayKey) ?? 0;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Tableau de bord</h1>
        <p className="text-sm text-slate-500">État de la pré-inscription et de l&rsquo;édition 2027.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Pré-inscrits" value={total} hint="emails collectés (-10 %)" icon={Mails} />
        <StatCard label="Aujourd'hui" value={today} hint="nouvelles adresses" icon={CalendarDays} />
        <StatCard label="7 derniers jours" value={last7} hint="nouvelles adresses" icon={TrendingUp} />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Pré-inscriptions par jour</h2>
          <span className="text-xs text-slate-500">{DAYS} derniers jours</span>
        </div>
        <div className="flex h-40 items-end gap-1.5">
          {series.map(([day, n]) => (
            <div key={day} className="group relative flex flex-1 flex-col items-center justify-end">
              <div
                className="w-full rounded-t bg-navy-dark/80 transition group-hover:bg-navy-dark"
                style={{ height: `${Math.max(2, (n / max) * 100)}%` }}
                title={`${day} : ${n}`}
              />
              <span className="mt-1 text-[10px] text-slate-400">{day.slice(8)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-base font-semibold">Édition {edition?.year ?? 2027}</h2>
        {edition ? (
          <div className="space-y-2 text-sm">
            <p>
              Course le <strong>{formatDate(edition.raceDate)}</strong> ·{" "}
              {edition.registrationOpen ? (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-medium text-emerald-800">
                  Inscriptions ouvertes
                </span>
              ) : (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-800">
                  Inscriptions fermées (pré-inscription en cours)
                </span>
              )}
            </p>
            <ul className="text-slate-600">
              {edition.races.map((r) => (
                <li key={r.id}>
                  {r.name} — {Number(r.distanceKm).toLocaleString("fr-FR")} km
                  {r.capacity ? ` · ${r.capacity} dossards max` : ""}
                </li>
              ))}
            </ul>
            <p className="text-xs text-slate-400">
              La gestion des courses, des paliers de prix et le bouton d&rsquo;ouverture arrivent en phase 2.
            </p>
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            Aucune édition en base : lancer <code className="rounded bg-slate-100 px-1">npm run db:seed</code> pour créer
            l&rsquo;édition 2027 avec ses deux courses et leurs paliers.
          </p>
        )}
      </section>

      <Link
        href={`/${adminSlug}/pre-inscrits`}
        className="inline-flex items-center gap-2 text-sm font-medium text-navy-dark hover:underline"
      >
        Voir la liste des pré-inscrits <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
