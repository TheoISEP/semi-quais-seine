"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { getSession } from "@/lib/admin";
import { EDITION_CACHE_TAG } from "@/lib/edition";
import { parseParisLocal } from "@/lib/utils";

export type ActionState = { ok: true; message?: string } | { ok: false; error: string } | null;

async function requireAdmin() {
  const session = await getSession();
  if (!session) throw new Error("Non autorisé");
  return session;
}

function invalidate() {
  revalidateTag(EDITION_CACHE_TAG, "max");
  revalidatePath("/", "layout");
}

const str = (v: FormDataEntryValue | null) => (typeof v === "string" ? v.trim() : "");
const optStr = (v: FormDataEntryValue | null) => str(v) || null;
const optInt = (v: FormDataEntryValue | null) => {
  const s = str(v);
  if (!s) return null;
  const n = Number.parseInt(s, 10);
  return Number.isFinite(n) ? n : null;
};
const euros = (v: FormDataEntryValue | null) => {
  const s = str(v).replace(",", ".").replace(/\s|€/g, "");
  const n = Number.parseFloat(s);
  return Number.isFinite(n) ? Math.round(n * 100) : Number.NaN;
};
const optDate = (v: FormDataEntryValue | null) => parseParisLocal(str(v));
const fail = (error: string): ActionState => ({ ok: false, error });

function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

// ---------------------------------------------------------------------------
// Édition
// ---------------------------------------------------------------------------

export async function updateEdition(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const schema = z.object({
    id: z.string().min(1),
    name: z.string().min(3),
    raceDate: z.string().min(1),
    feePercent: z.number().min(0).max(30),
    tshirtEnabled: z.boolean(),
    preregCodeValidDays: z.number().int().min(1).max(365),
  });
  const parsed = schema.safeParse({
    id: str(formData.get("id")),
    name: str(formData.get("name")),
    raceDate: str(formData.get("raceDate")),
    feePercent: Number.parseFloat(str(formData.get("feePercent")).replace(",", ".") || "0"),
    tshirtEnabled: formData.get("tshirtEnabled") === "on",
    preregCodeValidDays: Number.parseInt(str(formData.get("preregCodeValidDays")) || "15", 10),
  });
  if (!parsed.success) return fail("Vérifie les champs : " + parsed.error.issues.map((i) => i.path.join(".")).join(", "));
  const raceDate = parseParisLocal(`${parsed.data.raceDate}T09:00`);
  if (!raceDate) return fail("Date de course invalide.");

  await db.edition.update({
    where: { id: parsed.data.id },
    data: {
      name: parsed.data.name,
      raceDate,
      feePercent: parsed.data.feePercent,
      tshirtEnabled: parsed.data.tshirtEnabled,
      preregCodeValidDays: parsed.data.preregCodeValidDays,
      registrationClosesAt: optDate(formData.get("registrationClosesAt")),
    },
  });
  invalidate();
  return { ok: true, message: "Édition enregistrée." };
}

export async function setRegistrationOpen(editionId: string, open: boolean): Promise<ActionState> {
  await requireAdmin();
  const edition = await db.edition.findUnique({ where: { id: editionId }, include: { races: { include: { priceTiers: true } } } });
  if (!edition) return fail("Édition introuvable.");
  if (open) {
    const ready = edition.races.filter((r) => r.active && r.priceTiers.length > 0);
    if (ready.length === 0) return fail("Aucune course active avec un palier de prix : impossible d'ouvrir.");
  }
  await db.edition.update({
    where: { id: editionId },
    data: {
      registrationOpen: open,
      ...(open && !edition.registrationOpenedAt ? { registrationOpenedAt: new Date() } : {}),
    },
  });
  invalidate();
  return { ok: true, message: open ? "Les inscriptions sont ouvertes." : "Les inscriptions sont fermées." };
}

// ---------------------------------------------------------------------------
// Courses
// ---------------------------------------------------------------------------

export async function saveRace(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = optStr(formData.get("id"));
  const editionId = str(formData.get("editionId"));
  const name = str(formData.get("name"));
  const distanceKm = Number.parseFloat(str(formData.get("distanceKm")).replace(",", "."));
  if (!editionId) return fail("Édition manquante.");
  if (name.length < 2) return fail("Le nom de la course est obligatoire.");
  if (!Number.isFinite(distanceKm) || distanceKm <= 0) return fail("Distance invalide.");
  const slug = slugify(str(formData.get("slug")) || name);
  if (!slug) return fail("Slug invalide.");

  const data = {
    name,
    slug,
    distanceKm,
    startTime: optStr(formData.get("startTime")),
    startPlace: optStr(formData.get("startPlace")),
    finishPlace: optStr(formData.get("finishPlace")),
    description: optStr(formData.get("description")),
    capacity: optInt(formData.get("capacity")),
    sortOrder: optInt(formData.get("sortOrder")) ?? 0,
    active: formData.get("active") === "on",
  };
  try {
    if (id) await db.race.update({ where: { id }, data });
    else await db.race.create({ data: { ...data, editionId } });
  } catch (e) {
    if ((e as Prisma.PrismaClientKnownRequestError).code === "P2002") return fail("Une course a déjà ce slug.");
    throw e;
  }
  invalidate();
  return { ok: true, message: "Course enregistrée." };
}

export async function deleteRace(id: string): Promise<ActionState> {
  await requireAdmin();
  const count = await db.registration.count({ where: { raceId: id } });
  if (count > 0) return fail(`Impossible : ${count} inscription(s) sur cette course. Désactive-la plutôt.`);
  await db.race.delete({ where: { id } });
  invalidate();
  return { ok: true, message: "Course supprimée." };
}

// ---------------------------------------------------------------------------
// Paliers de prix
// ---------------------------------------------------------------------------

export async function savePriceTier(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = optStr(formData.get("id"));
  const raceId = str(formData.get("raceId"));
  const label = str(formData.get("label"));
  const priceCents = euros(formData.get("price"));
  if (!raceId) return fail("Course manquante.");
  if (!label) return fail("Le libellé du palier est obligatoire.");
  if (!Number.isFinite(priceCents) || priceCents < 0) return fail("Prix invalide.");
  const data = {
    label,
    priceCents,
    maxQuantity: optInt(formData.get("maxQuantity")),
    endsAt: optDate(formData.get("endsAt")),
    sortOrder: optInt(formData.get("sortOrder")) ?? 0,
  };
  if (id) await db.priceTier.update({ where: { id }, data });
  else await db.priceTier.create({ data: { ...data, raceId } });
  invalidate();
  return { ok: true, message: "Palier enregistré." };
}

export async function deletePriceTier(id: string): Promise<ActionState> {
  await requireAdmin();
  const count = await db.registration.count({ where: { priceTierId: id } });
  if (count > 0) return fail(`Impossible : ${count} inscription(s) à ce palier.`);
  await db.priceTier.delete({ where: { id } });
  invalidate();
  return { ok: true, message: "Palier supprimé." };
}

// ---------------------------------------------------------------------------
// Produits
// ---------------------------------------------------------------------------

export async function saveProduct(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = optStr(formData.get("id"));
  const editionId = str(formData.get("editionId"));
  const type = str(formData.get("type"));
  const name = str(formData.get("name"));
  const priceCents = euros(formData.get("price"));
  if (!editionId) return fail("Édition manquante.");
  if (!["TSHIRT", "PHOTO_PACK", "OTHER"].includes(type)) return fail("Type invalide.");
  if (name.length < 2) return fail("Le nom est obligatoire.");
  if (!Number.isFinite(priceCents) || priceCents < 0) return fail("Prix invalide.");
  const sizes = str(formData.get("sizes"))
    .split(/[,;\s]+/)
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);
  const data = {
    type: type as "TSHIRT" | "PHOTO_PACK" | "OTHER",
    name,
    description: optStr(formData.get("description")),
    priceCents,
    imageKey: optStr(formData.get("imageKey")),
    sizes: type === "TSHIRT" ? sizes : [],
    stock: optInt(formData.get("stock")),
    sortOrder: optInt(formData.get("sortOrder")) ?? 0,
    active: formData.get("active") === "on",
  };
  if (id) await db.product.update({ where: { id }, data });
  else await db.product.create({ data: { ...data, editionId } });
  invalidate();
  return { ok: true, message: "Produit enregistré." };
}

export async function deleteProduct(id: string): Promise<ActionState> {
  await requireAdmin();
  const count = await db.orderItem.count({ where: { productId: id } });
  if (count > 0) return fail(`Impossible : ${count} commande(s) contiennent ce produit. Désactive-le plutôt.`);
  await db.product.delete({ where: { id } });
  invalidate();
  return { ok: true, message: "Produit supprimé." };
}

// ---------------------------------------------------------------------------
// Codes promo
// ---------------------------------------------------------------------------

export async function savePromoCode(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = optStr(formData.get("id"));
  const code = str(formData.get("code")).toUpperCase().replace(/\s+/g, "");
  const type = str(formData.get("type"));
  if (!/^[A-Z0-9-]{3,32}$/.test(code)) return fail("Code invalide : lettres, chiffres et tirets, 3 à 32 caractères.");
  if (type !== "PERCENT" && type !== "FIXED") return fail("Type invalide.");
  let value: number;
  if (type === "PERCENT") {
    value = Number.parseInt(str(formData.get("value")), 10);
    if (!Number.isFinite(value) || value < 1 || value > 100) return fail("Pourcentage entre 1 et 100.");
  } else {
    value = euros(formData.get("value"));
    if (!Number.isFinite(value) || value <= 0) return fail("Montant invalide.");
  }
  const raceIds = formData.getAll("raceIds").map(String).filter(Boolean);
  const data = {
    code,
    type: type as "PERCENT" | "FIXED",
    value,
    maxUses: optInt(formData.get("maxUses")),
    boundEmail: optStr(formData.get("boundEmail"))?.toLowerCase() ?? null,
    expiresAt: optDate(formData.get("expiresAt")),
    raceIds,
    active: formData.get("active") === "on",
  };
  try {
    if (id) await db.promoCode.update({ where: { id }, data });
    else await db.promoCode.create({ data });
  } catch (e) {
    if ((e as Prisma.PrismaClientKnownRequestError).code === "P2002") return fail("Ce code existe déjà.");
    throw e;
  }
  revalidatePath("/", "layout");
  return { ok: true, message: "Code enregistré." };
}

export async function togglePromoCode(id: string, active: boolean): Promise<ActionState> {
  await requireAdmin();
  await db.promoCode.update({ where: { id }, data: { active } });
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deletePromoCode(id: string): Promise<ActionState> {
  await requireAdmin();
  const promo = await db.promoCode.findUnique({ where: { id }, include: { _count: { select: { orders: true } } } });
  if (!promo) return fail("Code introuvable.");
  if (promo._count.orders > 0) return fail("Ce code a été utilisé : désactive-le plutôt.");
  await db.promoCode.delete({ where: { id } });
  revalidatePath("/", "layout");
  return { ok: true, message: "Code supprimé." };
}

/**
 * Génère un code -10 % unique par pré-inscrit qui n'en a pas encore.
 * L'envoi par email arrive en phase 3 ; en attendant les codes sont visibles
 * dans la liste et l'export CSV des pré-inscrits.
 */
export async function generatePreregCodes(): Promise<ActionState> {
  await requireAdmin();
  const edition = await db.edition.findFirst({ orderBy: { year: "desc" } });
  if (!edition) return fail("Aucune édition.");
  const base = edition.registrationOpenedAt ?? new Date();
  const expiresAt = new Date(base.getTime() + edition.preregCodeValidDays * 86_400_000);

  const pending = await db.preregistration.findMany({ where: { promoCodeId: null }, select: { id: true, email: true } });
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const { randomInt } = await import("node:crypto");
  let created = 0;
  for (const p of pending) {
    for (let attempt = 0; attempt < 5; attempt++) {
      const suffix = Array.from({ length: 6 }, () => alphabet[randomInt(alphabet.length)]).join("");
      const code = `SEINE10-${suffix}`;
      try {
        await db.$transaction(async (tx) => {
          const promo = await tx.promoCode.create({
            data: { code, type: "PERCENT", value: 10, maxUses: 1, boundEmail: p.email, expiresAt, origin: "PREREG" },
          });
          await tx.preregistration.update({ where: { id: p.id }, data: { promoCodeId: promo.id } });
        });
        created++;
        break;
      } catch (e) {
        if ((e as Prisma.PrismaClientKnownRequestError).code !== "P2002") throw e;
      }
    }
  }
  revalidatePath("/", "layout");
  return { ok: true, message: `${created} code(s) -10 % généré(s), valables jusqu'au ${expiresAt.toLocaleDateString("fr-FR")}.` };
}
