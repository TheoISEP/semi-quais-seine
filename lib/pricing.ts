import type { PriceTier } from "@prisma/client";
import { db } from "./db";

/** Durée pendant laquelle une commande PENDING réserve ses places (session Stripe). */
export const PENDING_HOLD_MINUTES = 30;

/**
 * Nombre de dossards consommés sur une course : inscriptions payées (actives)
 * + inscriptions en attente de paiement de moins de 30 minutes.
 */
export async function countConsumed(raceId: string): Promise<number> {
  const holdSince = new Date(Date.now() - PENDING_HOLD_MINUTES * 60_000);
  return db.registration.count({
    where: {
      raceId,
      status: "ACTIVE",
      OR: [
        { order: { status: "PAID" } },
        { order: { status: "PENDING", createdAt: { gte: holdSince } } },
      ],
    },
  });
}

/** Même comptage, mais par palier (pour la jauge de l'admin). */
export async function countConsumedByTier(raceId: string): Promise<Map<string, number>> {
  const holdSince = new Date(Date.now() - PENDING_HOLD_MINUTES * 60_000);
  const rows = await db.registration.groupBy({
    by: ["priceTierId"],
    where: {
      raceId,
      status: "ACTIVE",
      OR: [
        { order: { status: "PAID" } },
        { order: { status: "PENDING", createdAt: { gte: holdSince } } },
      ],
    },
    _count: { _all: true },
  });
  const map = new Map<string, number>();
  for (const r of rows) if (r.priceTierId) map.set(r.priceTierId, r._count._all);
  return map;
}

export type TierStatus = {
  tier: PriceTier;
  sold: number;
  remaining: number | null;
  expired: boolean;
  exhausted: boolean;
};

/**
 * Palier courant = premier palier (par ordre) ni expiré ni épuisé.
 * Les quantités des paliers sont cumulatives dans l'ordre : le palier 2
 * s'ouvre quand le palier 1 est épuisé, etc.
 */
export function resolveTiers(
  tiers: PriceTier[],
  soldByTier: Map<string, number>,
  now = new Date(),
): { statuses: TierStatus[]; current: PriceTier | null } {
  const ordered = [...tiers].sort((a, b) => a.sortOrder - b.sortOrder);
  const statuses: TierStatus[] = ordered.map((tier) => {
    const sold = soldByTier.get(tier.id) ?? 0;
    const remaining = tier.maxQuantity == null ? null : Math.max(0, tier.maxQuantity - sold);
    return {
      tier,
      sold,
      remaining,
      expired: tier.endsAt != null && tier.endsAt.getTime() <= now.getTime(),
      exhausted: remaining != null && remaining <= 0,
    };
  });
  const current = statuses.find((s) => !s.expired && !s.exhausted)?.tier ?? null;
  return { statuses, current };
}

export async function getCurrentTier(raceId: string) {
  const [tiers, soldByTier] = await Promise.all([
    db.priceTier.findMany({ where: { raceId } }),
    countConsumedByTier(raceId),
  ]);
  return resolveTiers(tiers, soldByTier);
}
