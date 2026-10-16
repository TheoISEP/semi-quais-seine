import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "./auth";

/**
 * Segment d'URL secret de l'admin (variable ADMIN_SLUG, ex. "gestion-sqs-k7x2m9").
 * Sans variable, l'admin n'est accessible nulle part.
 */
export function getAdminSlug(): string | null {
  const slug = process.env.ADMIN_SLUG?.trim();
  if (!slug || !/^[a-z0-9-]{8,64}$/i.test(slug)) return null;
  return slug;
}

/** 404 si le segment demandé n'est pas le bon : l'admin reste invisible. */
export function assertAdminSlug(slug: string): string {
  const expected = getAdminSlug();
  if (!expected || slug !== expected) notFound();
  return expected;
}

export function adminPath(slug: string, path = ""): string {
  return `/${slug}${path ? (path.startsWith("/") ? path : `/${path}`) : ""}`;
}

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

/** Redirige vers la page de connexion si personne n'est connecté. */
export async function requireSession(slug: string) {
  const session = await getSession();
  if (!session) redirect(adminPath(slug, "/login"));
  return session;
}
