import { db } from "@/lib/db";
import { countConsumedByTier, resolveTiers } from "@/lib/pricing";
import { formatDate, formatEuros, toParisLocalInput } from "@/lib/utils";
import {
  deletePriceTier,
  deleteRace,
  savePriceTier,
  saveRace,
  setRegistrationOpen,
  updateEdition,
} from "@/lib/actions/admin";
import { ActionForm, ConfirmButton, Field, SubmitButton, inputClass } from "@/components/admin/forms";

export const metadata = { title: "Édition & courses" };

export default async function EditionPage() {
  const edition = await db.edition.findFirst({
    orderBy: { year: "desc" },
    include: {
      races: { orderBy: { sortOrder: "asc" }, include: { priceTiers: { orderBy: { sortOrder: "asc" } } } },
    },
  });

  if (!edition) {
    return (
      <div className="mx-auto max-w-5xl">
        <h1 className="text-2xl font-semibold tracking-tight">Édition &amp; courses</h1>
        <p className="mt-2 text-sm text-slate-500">
          Aucune édition en base : lance <code className="rounded bg-slate-100 px-1">npm run db:seed</code>.
        </p>
      </div>
    );
  }

  const soldByRace = new Map<string, Map<string, number>>();
  for (const race of edition.races) soldByRace.set(race.id, await countConsumedByTier(race.id));

  const now = new Date();
  const closed = edition.registrationClosesAt != null && edition.registrationClosesAt <= now;
  const effectivelyOpen = edition.registrationOpen && !closed;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Édition &amp; courses</h1>
        <p className="text-sm text-slate-500">
          {edition.name} — course le {formatDate(edition.raceDate)}.
        </p>
      </div>

      {/* Ouverture des inscriptions */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold">Inscriptions</h2>
            <p className="mt-1 text-sm text-slate-600">
              {effectivelyOpen ? (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-medium text-emerald-800">Ouvertes</span>
              ) : edition.registrationOpen && closed ? (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-800">
                  Clôturées automatiquement le {formatDate(edition.registrationClosesAt!, true)}
                </span>
              ) : (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-800">Fermées</span>
              )}
              {edition.registrationOpenedAt && (
                <span className="ml-2 text-xs text-slate-400">
                  première ouverture le {formatDate(edition.registrationOpenedAt, true)}
                </span>
              )}
            </p>
            <p className="mt-2 max-w-xl text-xs text-slate-500">
              Ouvrir affiche le bandeau « Les inscriptions sont ouvertes » et le bouton S&rsquo;inscrire sur le
              site, et active le tunnel d&rsquo;inscription. Le site se met à jour en moins d&rsquo;une minute.
            </p>
          </div>
          {edition.registrationOpen ? (
            <ConfirmButton action={setRegistrationOpen.bind(null, edition.id, false)} confirmLabel="Fermer les inscriptions ?">
              Fermer les inscriptions
            </ConfirmButton>
          ) : (
            <ConfirmButton
              action={setRegistrationOpen.bind(null, edition.id, true)}
              confirmLabel="C'est parti ? Confirmer l'ouverture"
              variant="primary"
            >
              Ouvrir les inscriptions
            </ConfirmButton>
          )}
        </div>
      </section>

      {/* Paramètres de l'édition */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-semibold">Paramètres de l&rsquo;édition</h2>
        <ActionForm action={updateEdition}>
          <input type="hidden" name="id" value={edition.id} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nom" className="sm:col-span-2">
              <input name="name" defaultValue={edition.name} required className={inputClass} />
            </Field>
            <Field label="Date de la course">
              <input type="date" name="raceDate" defaultValue={toParisLocalInput(edition.raceDate, false)} required className={inputClass} />
            </Field>
            <Field label="Clôture automatique des inscriptions" hint="Laisser vide pour fermer à la main.">
              <input
                type="datetime-local"
                name="registrationClosesAt"
                defaultValue={toParisLocalInput(edition.registrationClosesAt)}
                className={inputClass}
              />
            </Field>
            <Field label="Frais de gestion (%)" hint="0 = pas de frais. Ajoutés au panier, ligne séparée.">
              <input name="feePercent" defaultValue={Number(edition.feePercent).toString()} inputMode="decimal" className={inputClass} />
            </Field>
            <Field label="Validité des codes -10 % pré-inscrits (jours)" hint="À partir de l'ouverture des inscriptions.">
              <input name="preregCodeValidDays" type="number" min={1} max={365} defaultValue={edition.preregCodeValidDays} className={inputClass} />
            </Field>
            <label className="flex items-center gap-2 text-sm sm:col-span-2">
              <input type="checkbox" name="tshirtEnabled" defaultChecked={edition.tshirtEnabled} className="h-4 w-4 rounded border-slate-300" />
              T-shirts en vente (la taille est demandée pour chaque coureur qui en commande un)
            </label>
          </div>
          <SubmitButton>Enregistrer</SubmitButton>
        </ActionForm>
      </section>

      {/* Courses */}
      <section className="space-y-6">
        <h2 className="text-base font-semibold">Courses et paliers de prix</h2>

        {edition.races.map((race) => {
          const { statuses, current } = resolveTiers(race.priceTiers, soldByRace.get(race.id) ?? new Map());
          const totalSold = statuses.reduce((n, s) => n + s.sold, 0);
          return (
            <div key={race.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold">
                    {race.name}{" "}
                    {!race.active && <span className="ml-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">inactive</span>}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {totalSold} dossard{totalSold > 1 ? "s" : ""} pris{race.capacity ? ` sur ${race.capacity}` : ""} ·{" "}
                    {current ? (
                      <>
                        prix courant <strong>{formatEuros(current.priceCents)}</strong> ({current.label})
                      </>
                    ) : (
                      <span className="text-red-700">aucun palier disponible (complet ou non configuré)</span>
                    )}
                  </p>
                </div>
                <ConfirmButton action={deleteRace.bind(null, race.id)} confirmLabel="Supprimer la course ?">
                  Supprimer
                </ConfirmButton>
              </div>

              <ActionForm action={saveRace}>
                <input type="hidden" name="id" value={race.id} />
                <input type="hidden" name="editionId" value={edition.id} />
                <div className="grid gap-3 sm:grid-cols-3">
                  <Field label="Nom">
                    <input name="name" defaultValue={race.name} required className={inputClass} />
                  </Field>
                  <Field label="Slug (URL)">
                    <input name="slug" defaultValue={race.slug} className={inputClass} />
                  </Field>
                  <Field label="Distance (km)">
                    <input name="distanceKm" defaultValue={Number(race.distanceKm).toString()} inputMode="decimal" className={inputClass} />
                  </Field>
                  <Field label="Heure de départ">
                    <input name="startTime" defaultValue={race.startTime ?? ""} placeholder="09:00" className={inputClass} />
                  </Field>
                  <Field label="Lieu de départ">
                    <input name="startPlace" defaultValue={race.startPlace ?? ""} className={inputClass} />
                  </Field>
                  <Field label="Lieu d'arrivée">
                    <input name="finishPlace" defaultValue={race.finishPlace ?? ""} className={inputClass} />
                  </Field>
                  <Field label="Capacité (dossards)" hint="Vide = illimité.">
                    <input name="capacity" type="number" min={1} defaultValue={race.capacity ?? ""} className={inputClass} />
                  </Field>
                  <Field label="Ordre d'affichage">
                    <input name="sortOrder" type="number" defaultValue={race.sortOrder} className={inputClass} />
                  </Field>
                  <label className="flex items-center gap-2 self-end pb-2 text-sm">
                    <input type="checkbox" name="active" defaultChecked={race.active} className="h-4 w-4 rounded border-slate-300" />
                    Course active (visible et ouverte à la vente)
                  </label>
                  <Field label="Description" className="sm:col-span-3">
                    <textarea name="description" defaultValue={race.description ?? ""} rows={2} className={inputClass} />
                  </Field>
                </div>
                <SubmitButton variant="secondary">Enregistrer la course</SubmitButton>
              </ActionForm>

              {/* Paliers */}
              <div className="mt-6">
                <h4 className="mb-2 text-sm font-semibold text-slate-700">Paliers de prix</h4>
                <p className="mb-3 text-xs text-slate-500">
                  Le prix affiché est celui du premier palier, dans l&rsquo;ordre, qui n&rsquo;est ni épuisé ni expiré.
                  Quantité vide = sans limite (tarif plein), date vide = sans limite de date.
                </p>
                <div className="space-y-2">
                  {statuses.map(({ tier, sold, remaining, expired, exhausted }) => {
                    const isCurrent = current?.id === tier.id;
                    return (
                      <ActionForm
                        key={tier.id}
                        action={savePriceTier}
                        className={`rounded-xl border p-3 ${isCurrent ? "border-emerald-300 bg-emerald-50/40" : "border-slate-200"}`}
                      >
                        <input type="hidden" name="id" value={tier.id} />
                        <input type="hidden" name="raceId" value={race.id} />
                        <div className="grid items-end gap-2 sm:grid-cols-[1fr_110px_110px_190px_80px_auto]">
                          <Field label="Libellé">
                            <input name="label" defaultValue={tier.label} required className={inputClass} />
                          </Field>
                          <Field label="Prix (€)">
                            <input name="price" defaultValue={(tier.priceCents / 100).toFixed(2)} inputMode="decimal" className={inputClass} />
                          </Field>
                          <Field label="Quantité">
                            <input name="maxQuantity" type="number" min={1} defaultValue={tier.maxQuantity ?? ""} className={inputClass} />
                          </Field>
                          <Field label="Fin (heure de Paris)">
                            <input type="datetime-local" name="endsAt" defaultValue={toParisLocalInput(tier.endsAt)} className={inputClass} />
                          </Field>
                          <Field label="Ordre">
                            <input name="sortOrder" type="number" defaultValue={tier.sortOrder} className={inputClass} />
                          </Field>
                          <div className="flex gap-2 pb-0.5">
                            <SubmitButton variant="secondary">OK</SubmitButton>
                            <ConfirmButton action={deletePriceTier.bind(null, tier.id)} confirmLabel="Supprimer ?">
                              ✕
                            </ConfirmButton>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500">
                          {sold} vendu{sold > 1 ? "s" : ""}
                          {remaining != null && ` · ${remaining} restant${remaining > 1 ? "s" : ""}`}
                          {isCurrent && <span className="ml-2 font-medium text-emerald-700">← palier courant</span>}
                          {exhausted && <span className="ml-2 text-slate-400">épuisé</span>}
                          {expired && <span className="ml-2 text-slate-400">expiré</span>}
                        </p>
                      </ActionForm>
                    );
                  })}
                </div>

                <details className="mt-3 rounded-xl border border-dashed border-slate-300 p-3">
                  <summary className="cursor-pointer text-sm font-medium text-slate-700">+ Ajouter un palier</summary>
                  <ActionForm action={savePriceTier} resetOnSuccess className="mt-3">
                    <input type="hidden" name="raceId" value={race.id} />
                    <div className="grid items-end gap-2 sm:grid-cols-[1fr_110px_110px_190px_80px_auto]">
                      <Field label="Libellé">
                        <input name="label" placeholder="Tarif de dernière minute" required className={inputClass} />
                      </Field>
                      <Field label="Prix (€)">
                        <input name="price" placeholder="59" inputMode="decimal" className={inputClass} />
                      </Field>
                      <Field label="Quantité">
                        <input name="maxQuantity" type="number" min={1} className={inputClass} />
                      </Field>
                      <Field label="Fin (heure de Paris)">
                        <input type="datetime-local" name="endsAt" className={inputClass} />
                      </Field>
                      <Field label="Ordre">
                        <input name="sortOrder" type="number" defaultValue={race.priceTiers.length + 1} className={inputClass} />
                      </Field>
                      <SubmitButton>Ajouter</SubmitButton>
                    </div>
                  </ActionForm>
                </details>
              </div>
            </div>
          );
        })}

        <details className="rounded-2xl border border-dashed border-slate-300 bg-white p-5">
          <summary className="cursor-pointer text-sm font-semibold text-slate-700">+ Ajouter une course</summary>
          <ActionForm action={saveRace} resetOnSuccess className="mt-4">
            <input type="hidden" name="editionId" value={edition.id} />
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Nom">
                <input name="name" placeholder="Marche nordique" required className={inputClass} />
              </Field>
              <Field label="Distance (km)">
                <input name="distanceKm" placeholder="5" inputMode="decimal" className={inputClass} />
              </Field>
              <Field label="Heure de départ">
                <input name="startTime" placeholder="10:00" className={inputClass} />
              </Field>
              <Field label="Lieu de départ">
                <input name="startPlace" className={inputClass} />
              </Field>
              <Field label="Lieu d'arrivée">
                <input name="finishPlace" className={inputClass} />
              </Field>
              <Field label="Capacité">
                <input name="capacity" type="number" min={1} className={inputClass} />
              </Field>
              <Field label="Ordre d'affichage">
                <input name="sortOrder" type="number" defaultValue={edition.races.length + 1} className={inputClass} />
              </Field>
              <label className="flex items-center gap-2 self-end pb-2 text-sm">
                <input type="checkbox" name="active" defaultChecked className="h-4 w-4 rounded border-slate-300" />
                Course active
              </label>
            </div>
            <SubmitButton>Créer la course</SubmitButton>
          </ActionForm>
        </details>
      </section>
    </div>
  );
}
