// Crée l'édition 2027, ses deux courses et leurs paliers de prix.
// Idempotent : relançable sans doublons (les paliers ne sont créés que si la course n'en a aucun).
//
//   npm run db:seed
import "../scripts/load-env";
import { db } from "../lib/db";

const RACE_DATE = new Date("2027-02-28T09:00:00+01:00");

const races = [
  {
    slug: "semi-marathon",
    name: "Semi-marathon",
    distanceKm: 21.1,
    startTime: "09:00",
    startPlace: "Gare de Houilles – Carrières-sur-Seine",
    finishPlace: "Port de plaisance Seine Parisii, Cormeilles-en-Parisis",
    sortOrder: 1,
    tiers: [
      { label: "500 premiers dossards", priceCents: 4700, maxQuantity: 500 },
      { label: "500 suivants", priceCents: 4900, maxQuantity: 500 },
      { label: "500 suivants", priceCents: 5200, maxQuantity: 500 },
      { label: "Tarif plein", priceCents: 5500, maxQuantity: null },
    ],
  },
  {
    slug: "10-km",
    name: "10 km",
    distanceKm: 10,
    startTime: "09:30",
    startPlace: "Bords de Seine",
    finishPlace: "Port de plaisance Seine Parisii, Cormeilles-en-Parisis",
    sortOrder: 2,
    tiers: [
      { label: "500 premiers dossards", priceCents: 2400, maxQuantity: 500 },
      { label: "500 suivants", priceCents: 2600, maxQuantity: 500 },
      { label: "500 suivants", priceCents: 2900, maxQuantity: 500 },
      { label: "Tarif plein", priceCents: 3400, maxQuantity: null },
    ],
  },
];

async function main() {
  const edition = await db.edition.upsert({
    where: { year: 2027 },
    create: { year: 2027, name: "Semi des Quais de Seine 2027", raceDate: RACE_DATE },
    update: {},
  });

  for (const r of races) {
    const { tiers, ...data } = r;
    const race = await db.race.upsert({
      where: { editionId_slug: { editionId: edition.id, slug: r.slug } },
      create: { ...data, editionId: edition.id },
      update: {},
    });
    const existing = await db.priceTier.count({ where: { raceId: race.id } });
    if (existing === 0) {
      await db.priceTier.createMany({
        data: tiers.map((t, i) => ({ ...t, raceId: race.id, sortOrder: i + 1 })),
      });
      console.log(`${race.name} : ${tiers.length} paliers créés`);
    } else {
      console.log(`${race.name} : paliers déjà présents (${existing}), inchangés`);
    }
  }
  console.log("Édition 2027 prête.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
