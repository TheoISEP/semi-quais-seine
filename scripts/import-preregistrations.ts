// Importe l'export CSV du Google Sheet des pré-inscrits dans Neon.
//
//   1. Google Sheet → Fichier → Télécharger → CSV
//   2. Enregistrer le fichier sous scripts/preinscriptions.csv (ignoré par git)
//   3. npm run import:prereg          (ou : npm run import:prereg -- chemin/vers/fichier.csv)
//
// Colonnes reconnues : une colonne contenant « email » (obligatoire) et, si présente,
// une colonne contenant « date » (la date d'origine est conservée).
// Le script est idempotent : une adresse déjà en base n'est pas modifiée.
import "./load-env";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { db } from "../lib/db";

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  const delimiter = detectDelimiter(text);

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === delimiter) {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((v) => v.trim() !== ""));
}

function detectDelimiter(text: string): string {
  const firstLine = text.split(/\r?\n/, 1)[0] ?? "";
  const counts = [",", ";", "\t"].map((d) => [d, firstLine.split(d).length - 1] as const);
  return counts.sort((a, b) => b[1] - a[1])[0][0];
}

function parseDate(value: string): Date | null {
  const v = value.trim();
  if (!v) return null;
  const iso = new Date(v);
  if (!Number.isNaN(iso.getTime())) return iso;
  // Formats français : 23/09/2026 14:05:00 ou 23/09/2026
  const m = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
  if (m) {
    const [, d, mo, y, h = "0", mi = "0", s = "0"] = m;
    const date = new Date(Date.UTC(+y, +mo - 1, +d, +h - 1, +mi, +s)); // heure de Paris ≈ UTC+1/+2
    return Number.isNaN(date.getTime()) ? null : date;
  }
  return null;
}

async function main() {
  const file = resolve(process.cwd(), process.argv[2] ?? "scripts/preinscriptions.csv");
  const text = readFileSync(file, "utf8").replace(/^﻿/, "");
  const rows = parseCsv(text);
  if (rows.length < 2) {
    console.error("Fichier vide ou sans ligne de données :", file);
    process.exit(1);
  }

  const header = rows[0].map((h) => h.trim().toLowerCase());
  const emailCol = header.findIndex((h) => h.includes("email") || h.includes("mail"));
  const dateCol = header.findIndex((h) => h.includes("date"));
  if (emailCol === -1) {
    console.error("Aucune colonne email trouvée. En-têtes :", header.join(" | "));
    process.exit(1);
  }

  let created = 0;
  let skipped = 0;
  let invalid = 0;
  const seen = new Set<string>();

  for (const row of rows.slice(1)) {
    const email = (row[emailCol] ?? "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      invalid++;
      continue;
    }
    if (seen.has(email)) {
      skipped++;
      continue;
    }
    seen.add(email);
    const createdAt = dateCol !== -1 ? parseDate(row[dateCol] ?? "") : null;

    const existing = await db.preregistration.findUnique({ where: { email }, select: { id: true } });
    if (existing) {
      skipped++;
      continue;
    }
    await db.preregistration.create({
      data: { email, source: "SHEET", ...(createdAt ? { createdAt } : {}) },
    });
    created++;
  }

  console.log(`Import terminé : ${created} créée(s), ${skipped} déjà présente(s) ou en double, ${invalid} invalide(s).`);
  console.log(`Total en base : ${await db.preregistration.count()}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
