import { unstable_cache } from "next/cache";
import { db } from "./db";
import { getCurrentTier } from "./pricing";

export const EDITION_CACHE_TAG = "edition";

export type PublicRace = {
  id: string;
  slug: string;
  name: string;
  distanceKm: number;
  startTime: string | null;
  startPlace: string | null;
  finishPlace: string | null;
  description: string | null;
  capacity: number | null;
  /** Prix courant en centimes, null si plus aucun palier (complet). */
  priceCents: number | null;
  tierLabel: string | null;
  /** Dossards restants au prix courant (null = pas de limite). */
  remainingAtPrice: number | null;
  soldOut: boolean;
};

export type PublicEditionState = {
  year: number;
  name: string;
  raceDate: string;
  registrationOpen: boolean;
  registrationClosesAt: string | null;
  feePercent: number;
  tshirtEnabled: boolean;
  races: PublicRace[];
};

async function loadEditionState(): Promise<PublicEditionState | null> {
  const edition = await db.edition.findFirst({
    orderBy: { year: "desc" },
    include: { races: { where: { active: true }, orderBy: { sortOrder: "asc" } } },
  });
  if (!edition) return null;

  const races: PublicRace[] = await Promise.all(
    edition.races.map(async (race) => {
      const { statuses, current } = await getCurrentTier(race.id);
      const currentStatus = statuses.find((s) => s.tier.id === current?.id);
      const totalSold = statuses.reduce((n, s) => n + s.sold, 0);
      const soldOut = (race.capacity != null && totalSold >= race.capacity) || current == null;
      return {
        id: race.id,
        slug: race.slug,
        name: race.name,
        distanceKm: Number(race.distanceKm),
        startTime: race.startTime,
        startPlace: race.startPlace,
        finishPlace: race.finishPlace,
        description: race.description,
        capacity: race.capacity,
        priceCents: current?.priceCents ?? null,
        tierLabel: current?.label ?? null,
        remainingAtPrice: currentStatus?.remaining ?? null,
        soldOut,
      };
    }),
  );

  const closed =
    edition.registrationClosesAt != null && edition.registrationClosesAt.getTime() <= Date.now();

  return {
    year: edition.year,
    name: edition.name,
    raceDate: edition.raceDate.toISOString(),
    registrationOpen: edition.registrationOpen && !closed,
    registrationClosesAt: edition.registrationClosesAt?.toISOString() ?? null,
    feePercent: Number(edition.feePercent),
    tshirtEnabled: edition.tshirtEnabled,
    races,
  };
}

/** État public de l'édition, mis en cache 60 s et invalidé par l'admin (tag « edition »). */
export const getPublicEditionState = unstable_cache(loadEditionState, ["public-edition-state"], {
  tags: [EDITION_CACHE_TAG],
  revalidate: 60,
});

/** Version sans cache, pour l'admin et le tunnel de paiement. */
export const getLiveEditionState = loadEditionState;
