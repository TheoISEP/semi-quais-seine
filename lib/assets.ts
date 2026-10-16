/**
 * Résout l'URL d'affichage d'un visuel stocké dans `imageKey` :
 * - URL complète (http…) ou chemin du site (/images/…) → tel quel ;
 * - clé S3 → préfixée par S3_PUBLIC_BASE_URL (médiathèque, phase 3).
 */
export function resolveAssetUrl(key: string | null | undefined): string | null {
  if (!key) return null;
  if (/^https?:\/\//i.test(key) || key.startsWith("/")) return key;
  const base = process.env.S3_PUBLIC_BASE_URL?.replace(/\/+$/, "");
  if (!base) return null;
  return `${base}/${key.replace(/^\/+/, "")}`;
}
