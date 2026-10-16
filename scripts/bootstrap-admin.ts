// Crée (ou réinitialise le mot de passe de) l'unique compte admin.
//
//   npm run admin:create -- theocl@photorunning.com "mot-de-passe-de-12-caracteres-minimum"
//
// Nécessite DATABASE_URL / DIRECT_DATABASE_URL / BETTER_AUTH_SECRET dans .env.local.
import "./load-env";
import { auth } from "../lib/auth";
import { db } from "../lib/db";

async function main() {
  const [email, password, name = "Admin"] = process.argv.slice(2);
  if (!email || !password) {
    console.error('Usage : npm run admin:create -- <email> "<mot de passe>" [nom]');
    process.exit(1);
  }
  if (password.length < 12) {
    console.error("Le mot de passe doit faire au moins 12 caractères.");
    process.exit(1);
  }

  const ctx = await auth.$context;
  const hashed = await ctx.password.hash(password);
  const normalized = email.trim().toLowerCase();

  const existing = await db.user.findUnique({ where: { email: normalized } });
  if (existing) {
    await ctx.internalAdapter.updatePassword(existing.id, hashed);
    console.log(`Mot de passe réinitialisé pour ${normalized}.`);
  } else {
    const user = await ctx.internalAdapter.createUser({ email: normalized, name, emailVerified: true });
    await ctx.internalAdapter.linkAccount({
      userId: user.id,
      providerId: "credential",
      accountId: user.id,
      password: hashed,
    });
    console.log(`Compte admin créé : ${normalized}`);
  }

  const count = await db.user.count();
  console.log(`${count} compte(s) en base.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
