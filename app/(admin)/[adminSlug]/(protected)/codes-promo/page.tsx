import { db } from "@/lib/db";
import { formatDate, formatEuros, toParisLocalInput } from "@/lib/utils";
import { deletePromoCode, savePromoCode, togglePromoCode } from "@/lib/actions/admin";
import { ActionForm, ConfirmButton, Field, SubmitButton, inputClass } from "@/components/admin/forms";

export const metadata = { title: "Codes promo" };

export default async function PromoCodesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; origin?: string }>;
}) {
  const { q = "", origin = "" } = await searchParams;
  const query = q.trim().toUpperCase();

  const now = new Date();
  const [edition, codes, preregCount] = await Promise.all([
    db.edition.findFirst({ orderBy: { year: "desc" }, include: { races: { orderBy: { sortOrder: "asc" } } } }),
    db.promoCode.findMany({
      where: {
        ...(query ? { code: { contains: query } } : {}),
        ...(origin === "MANUAL" || origin === "PREREG" ? { origin } : origin ? {} : { origin: "MANUAL" }),
      },
      orderBy: { createdAt: "desc" },
      take: 200,
      include: { _count: { select: { orders: true } } },
    }),
    db.promoCode.count({ where: { origin: "PREREG" } }),
  ]);
  const raceName = new Map((edition?.races ?? []).map((r) => [r.id, r.name]));

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Codes promo</h1>
        <p className="text-sm text-slate-500">
          Codes manuels (partenaires, clubs, rattrapages) et codes -10 % des pré-inscrits ({preregCount.toLocaleString("fr-FR")}{" "}
          générés, voir la page Pré-inscrits).
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-semibold">Nouveau code</h2>
        <ActionForm action={savePromoCode} resetOnSuccess>
          <div className="grid gap-3 sm:grid-cols-4">
            <Field label="Code">
              <input name="code" placeholder="CLUB-HOUILLES" required className={`${inputClass} uppercase`} />
            </Field>
            <Field label="Type">
              <select name="type" defaultValue="PERCENT" className={inputClass}>
                <option value="PERCENT">Pourcentage</option>
                <option value="FIXED">Montant fixe (€)</option>
              </select>
            </Field>
            <Field label="Valeur" hint="10 pour 10 %, ou 5 pour 5 €.">
              <input name="value" placeholder="10" inputMode="decimal" required className={inputClass} />
            </Field>
            <Field label="Usages max" hint="Vide = illimité.">
              <input name="maxUses" type="number" min={1} className={inputClass} />
            </Field>
            <Field label="Réservé à l'email" hint="Vide = tout le monde.">
              <input name="boundEmail" type="email" className={inputClass} />
            </Field>
            <Field label="Expire le (heure de Paris)">
              <input type="datetime-local" name="expiresAt" className={inputClass} />
            </Field>
            <Field label="Courses concernées" hint="Aucune cochée = toutes." className="sm:col-span-2">
              <div className="flex flex-wrap gap-3 pt-1">
                {(edition?.races ?? []).map((r) => (
                  <label key={r.id} className="flex items-center gap-1.5 text-sm">
                    <input type="checkbox" name="raceIds" value={r.id} className="h-4 w-4 rounded border-slate-300" />
                    {r.name}
                  </label>
                ))}
              </div>
            </Field>
            <label className="flex items-center gap-2 text-sm sm:col-span-4">
              <input type="checkbox" name="active" defaultChecked className="h-4 w-4 rounded border-slate-300" />
              Actif
            </label>
          </div>
          <SubmitButton>Créer le code</SubmitButton>
        </ActionForm>
      </section>

      <section className="space-y-3">
        <form className="flex flex-wrap items-center gap-2" action="">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Rechercher un code"
            className={`${inputClass} max-w-xs uppercase`}
          />
          <select name="origin" defaultValue={origin} className={`${inputClass} w-auto`}>
            <option value="">Codes manuels</option>
            <option value="PREREG">Codes pré-inscrits</option>
            <option value="ALL">Tous</option>
          </select>
          <SubmitButton variant="secondary">Filtrer</SubmitButton>
        </form>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Remise</th>
                <th className="px-4 py-3 font-medium">Usages</th>
                <th className="px-4 py-3 font-medium">Restrictions</th>
                <th className="px-4 py-3 font-medium">Expire</th>
                <th className="px-4 py-3 font-medium">État</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {codes.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    Aucun code.
                  </td>
                </tr>
              )}
              {codes.map((c) => {
                const expired = c.expiresAt != null && c.expiresAt <= now;
                const exhausted = c.maxUses != null && c.usedCount >= c.maxUses;
                return (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5 font-mono font-medium text-slate-800">{c.code}</td>
                    <td className="px-4 py-2.5">{c.type === "PERCENT" ? `-${c.value} %` : `-${formatEuros(c.value)}`}</td>
                    <td className="px-4 py-2.5 text-slate-600">
                      {c.usedCount}
                      {c.maxUses != null && ` / ${c.maxUses}`}
                      {c._count.orders > 0 && <span className="ml-1 text-xs text-slate-400">({c._count.orders} cmd)</span>}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-slate-600">
                      {c.boundEmail && <div>{c.boundEmail}</div>}
                      {c.raceIds.length > 0 && <div>{c.raceIds.map((id) => raceName.get(id) ?? "?").join(", ")}</div>}
                      {!c.boundEmail && c.raceIds.length === 0 && "—"}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-slate-600">{c.expiresAt ? formatDate(c.expiresAt, true) : "—"}</td>
                    <td className="px-4 py-2.5 text-xs">
                      {!c.active ? (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">désactivé</span>
                      ) : expired ? (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">expiré</span>
                      ) : exhausted ? (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">épuisé</span>
                      ) : (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-800">actif</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex justify-end gap-2">
                        <ConfirmButton
                          action={togglePromoCode.bind(null, c.id, !c.active)}
                          confirmLabel={c.active ? "Désactiver ?" : "Activer ?"}
                          variant="secondary"
                          className="px-2 py-1 text-xs"
                        >
                          {c.active ? "Désactiver" : "Activer"}
                        </ConfirmButton>
                        {c.origin === "MANUAL" && (
                          <ConfirmButton action={deletePromoCode.bind(null, c.id)} confirmLabel="Supprimer ?" className="px-2 py-1 text-xs">
                            Supprimer
                          </ConfirmButton>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
      <p className="text-xs text-slate-400">
        Les codes expirent à la date indiquée ({toParisLocalInput(now).replace("T", " ")} actuellement à Paris).
      </p>
    </div>
  );
}
