import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { db } from "./db";

/**
 * Authentification de l'admin : un seul compte, email + mot de passe, sans 2FA.
 * L'inscription est désactivée ; le compte est créé par `npm run admin:create`.
 */
export const auth = betterAuth({
  appName: "Semi des Quais de Seine — Admin",
  baseURL: process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_SITE_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(db, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    autoSignIn: false,
    minPasswordLength: 12,
    maxPasswordLength: 128,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  rateLimit: {
    enabled: true,
    window: 30,
    max: 10,
    storage: "database",
    modelName: "rateLimit",
    customRules: {
      "/sign-in/email": { window: 30, max: 3 },
    },
  },
  advanced: {
    cookiePrefix: "sqs",
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
