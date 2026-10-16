import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isValidEmail, normalizeEmail } from "@/lib/utils";

export const runtime = "nodejs";

/**
 * Pré-inscription (-10 %) : l'email est enregistré dans Neon.
 * Tant que GOOGLE_SCRIPT_URL existe, on recopie aussi dans le Google Sheet
 * (au cas où), sans bloquer la réponse si le Sheet échoue.
 */
export async function POST(request: NextRequest) {
  let email: string;
  try {
    const body = (await request.json()) as { email?: unknown };
    email = typeof body.email === "string" ? normalizeEmail(body.email) : "";
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  }

  try {
    await db.preregistration.upsert({
      where: { email },
      create: { email, source: "SITE" },
      update: {},
    });
  } catch (error) {
    console.error("Erreur enregistrement pré-inscription :", error);
    return NextResponse.json({ error: "Une erreur est survenue" }, { status: 500 });
  }

  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
  if (scriptUrl) {
    try {
      await fetch(scriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, date: new Date().toISOString() }),
      });
    } catch (error) {
      console.warn("Copie Google Sheet impossible :", error);
    }
  }

  return NextResponse.json({ message: "Inscription réussie" }, { status: 200 });
}
