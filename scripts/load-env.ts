// Charge .env.local puis .env (sans écraser les variables déjà présentes),
// pour les scripts lancés avec tsx en dehors de Next.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

for (const file of [".env.local", ".env"]) {
  let content: string;
  try {
    content = readFileSync(resolve(process.cwd(), file), "utf8");
  } catch {
    continue;
  }
  for (const raw of content.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}
