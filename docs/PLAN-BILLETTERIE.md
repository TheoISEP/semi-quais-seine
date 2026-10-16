# Semi des Quais de Seine — plan de la billetterie et de l'admin

Version du 16 octobre 2026. Course le dimanche 28 février 2027.
Parcours : départ gare de Houilles – Carrières-sur-Seine, descente sur les bords de Seine, arrivée au port de plaisance Seine Parisii (Cormeilles-en-Parisis, marina inaugurée le 10 juin 2026).

Ce document est la référence pour construire la vente des dossards sur notre propre plateforme (site + admin), avec Neon, Stripe, AWS S3 et SES.

---

## 1. Décisions structurantes

| Sujet | Décision | Pourquoi |
|---|---|---|
| Une seule application | Le site public, le tunnel d'inscription et l'admin vivent dans le **même projet Next.js** (dépôt `semi-quais-seine`, un seul déploiement Vercel, une seule base Neon). | Zéro duplication de modèle, une seule config, un seul domaine. L'admin est juste un groupe de routes protégé. |
| URL de l'admin | `https://www.semiquaisdeseine.fr/<segment-secret>/…` — le segment est lu dans la variable `ADMIN_SLUG` (ex. `gestion-sqs-k7x2m9`). Toute autre valeur renvoie un 404 identique au reste du site. `noindex`, exclu du sitemap, en-tête `X-Robots-Tag: noindex`. | Pas de `/admin` devinable ; on peut changer le segment sans toucher au code. |
| Authentification admin | **Better Auth** (même version que photorunning-admin), email + mot de passe, **sans 2FA**, inscription désactivée, un seul compte créé par un script de bootstrap. Session 7 jours. Limiteur de tentatives (3 essais / 30 s). | Ce que tu as demandé, avec le minimum de garde-fous. |
| Base de données | **Neon Postgres + Prisma 6** (`DATABASE_URL` poolée pour l'app, `DIRECT_DATABASE_URL` pour les migrations), comme les dépôts PhotoRunning. | Conventions déjà connues. |
| Paiement | **Stripe Checkout (page hébergée)** : on calcule le panier côté serveur, on crée une session avec des `price_data` à la volée, Stripe encaisse, le webhook `checkout.session.completed` valide la commande. | Le plus rapide et le plus sûr à mettre en prod ; pas de formulaire carte à maintenir ; 3DS géré. |
| Codes promo | **Moteur maison** (table `PromoCode`), appliqué côté serveur avant d'envoyer le montant à Stripe. Les -10 % des pré-inscrits = un code unique par email, généré au lancement. | On garde le contrôle (usage unique, lié à un email, expiration, statistiques dans l'admin). |
| Tarification | Par course, **paliers par quantité** (500 premiers, 500 suivants, 500 suivants, puis tarif plein) **et/ou par date** (early bird jusqu'au…). Le prix affiché est celui du premier palier non épuisé. | Couvre « les 500 premiers » et un early bird classique. |
| Frais de gestion | Pourcentage défini sur l'édition (0 = désactivé), ligne séparée « Frais de gestion (x %) » dans le récapitulatif. | Transparent pour le coureur, modifiable sans code. |
| Options | Produits de l'édition : **t-shirt** (activable ou non, visuel, tailles), **packs photos** (prévente), autres. Médaille incluse (affichée, pas vendue). | Ce que tu as décrit. |
| Pas d'espace coureur | Inscription « invité » : email + récap par mail. Modification d'une inscription = via l'admin (ou un lien signé plus tard si besoin). | Évite un système de comptes coureurs pour la première édition. |
| Emails | **AWS SES** depuis `inscriptions@semiquaisdeseine.fr`. Transactionnels (confirmation) + campagnes pilotées depuis l'admin (lancement, guides coureurs, relances). | Déjà en place chez PhotoRunning. |
| Médias | **S3** (bucket dédié, région Paris `eu-west-3`), upload direct depuis l'admin par URL présignée, médiathèque avec catégories (Pubs Meta, Site, Produits, Guides). | Visuels produits affichés dans le tunnel ; dépôt des créas Meta. |

---

## 2. Architecture des routes

```
app/
  (site)/
    page.tsx                    landing (existant) + bandeau « Les inscriptions sont ouvertes »
    semi-marathon/page.tsx      page SEO dédiée (parcours, horaires, tarifs du moment)
    10-km/page.tsx              page SEO dédiée
    parcours/page.tsx           carte, GPX, points clés, accès
    infos-pratiques/page.tsx    retrait des dossards, vestiaires, consignes, transports
    reglement/page.tsx          règlement de la course
    inscription/                tunnel (voir §4)
      page.tsx                  choix de la course + nb de coureurs
      coureurs/page.tsx         formulaire par coureur
      options/page.tsx          t-shirt, packs photos
      recap/page.tsx            récapitulatif, code promo, CGV → bouton Payer
      confirmation/page.tsx     retour Stripe (lecture de la session)
    mentions-legales, confidentialite, cgv
  (admin)/[adminSlug]/          404 si adminSlug ≠ ADMIN_SLUG
    login/page.tsx
    page.tsx                    tableau de bord
    pre-inscrits/
    edition/                    paramètres de l'édition, courses, paliers, lancement
    produits/
    codes-promo/
    commandes/ [id]
    inscrits/ [id]              liste filtrable, export CSV, dossards
    mediatheque/
    emails/                     campagnes + journal
    parametres/
  api/
    subscribe/route.ts          → Neon (remplace Google Sheets)
    auth/[...all]/route.ts      Better Auth
    checkout/route.ts           crée la session Stripe
    stripe/webhook/route.ts     valide la commande
    uploads/presign/route.ts    URL présignée S3 (admin)
lib/
  db.ts, auth.ts, auth-client.ts, stripe.ts, s3.ts, ses.ts, pricing.ts, promo.ts, email-templates/
prisma/
  schema.prisma, migrations/
scripts/
  bootstrap-admin.ts            crée l'unique compte admin (npm run admin:create)
  import-preregistrations.ts    importe l'export CSV du Google Sheet
```

Stack : Next 16 (déjà en place), Prisma 6, Better Auth 1.6, Stripe SDK, `@aws-sdk/client-s3` + `s3-request-presigner`, `@aws-sdk/client-sesv2`, zod, Tailwind 4, lucide-react. Pas de tRPC : server actions + route handlers suffisent ici.

---

## 3. Modèle de données (Prisma)

```
Edition         année, nom, date de course, feePercent, tshirtEnabled, registrationOpen (bool),
                registrationOpenedAt, registrationClosesAt, capacité globale optionnelle
Race            edition, nom (Semi-marathon / 10 km), distanceKm, heure de départ, lieu de départ,
                lieu d'arrivée, capacité, description, ordre, actif
PriceTier       race, libellé (« 500 premiers »), prix (centimes), quantité max (nullable),
                finLe (nullable), ordre        → prix courant = 1er palier non épuisé et non expiré
Product         edition, type (TSHIRT | PHOTO_PACK | OTHER), nom, description, prix, imageKey S3,
                tailles [] (si t-shirt), stock optionnel, actif
PromoCode       code, type (PERCENT | FIXED), valeur, maxUses, usedCount, emailLié (nullable),
                expireLe, racesConcernées [], actif, origine (PREREG | MANUEL)
Preregistration email (unique), créé le, source (SITE | SHEET), promoCodeId, consentement
Order           numéro (SQS-2027-000123), email, prénom/nom acheteur, téléphone, statut
                (PENDING | PAID | REFUNDED | CANCELLED | EXPIRED), sousTotal, remise, frais,
                total, promoCodeId, stripeSessionId, stripePaymentIntentId, payéLe, créé le
Registration    order, race, prénom, nom, date de naissance, sexe, email, téléphone, nationalité,
                club, ville, code postal, contact d'urgence (nom + tél), tailleTshirt (nullable),
                justificatif (PPS | LICENCE_FFA | CERTIFICAT), numéro de justificatif, priceTierId,
                prixUnitaire, dossard (nullable), statut (ACTIVE | CANCELLED | TRANSFERRED)
OrderItem       order, product, registration (nullable), quantité, prixUnitaire, taille
Asset           clé S3, url, nom de fichier, mime, taille, largeur/hauteur, catégorie
                (ADS | SITE | PRODUCT | GUIDE | OTHER), tags [], créé le
EmailCampaign   nom, objet, corps (markdown → HTML), audience (ALL_PAID | RACE:<id> | PREREG |
                TEST), statut (DRAFT | SENDING | SENT), envoyéLe, nbEnvoyés, nbErreurs
EmailLog        destinataire, type (CONFIRMATION | LAUNCH | CAMPAIGN | …), campaignId, sesMessageId,
                statut, erreur, créé le
StripeEvent     id Stripe (unique), type, traité le        → idempotence du webhook
User / Session / Account / Verification / RateLimit        → Better Auth
```

Indices utiles : `Registration(raceId, status)`, `Order(status, paidAt)`, `Preregistration(email)`, `PromoCode(code)`.

---

## 4. Tunnel d'inscription et règles de calcul

1. **Choix** : course (Semi ou 10 km) et nombre de coureurs (1 à 5 dans une même commande). Le prix du moment s'affiche avec le palier (« Tarif 500 premiers : 32 € — plus que 118 dossards à ce tarif »).
2. **Coureurs** : un formulaire par coureur (champs de `Registration`). Taille de t-shirt demandée uniquement si l'édition a `tshirtEnabled` et que le produit t-shirt est ajouté pour ce coureur. Case « j'accepte le règlement et les CGV ».
3. **Options** : t-shirt (avec visuel S3), packs photos, affichés avec image, prix et description.
4. **Récap** : lignes dossards (prix du palier), options, code promo (validé côté serveur), frais de gestion (x % du sous-total après remise), total TTC. Bouton « Payer » → `POST /api/checkout`.
5. **Serveur** (`/api/checkout`) : recalcule tout (jamais confiance au client), vérifie capacité et paliers, crée l'`Order` en `PENDING` + les `Registration`, crée la session Stripe (`customer_email`, `metadata.orderId`, `expires_at` +30 min, `line_items` en `price_data`), renvoie l'URL.
6. **Webhook** `checkout.session.completed` : vérifie la signature, idempotence via `StripeEvent`, passe l'`Order` en `PAID`, incrémente `PromoCode.usedCount`, envoie l'email de confirmation (SES). `checkout.session.expired` → `EXPIRED` (libère les places).
7. **Confirmation** : page qui lit la session Stripe et affiche le récap + « un email vient de vous être envoyé ».

Règles :
- **Palier courant** = premier `PriceTier` dont `quantité max` n'est pas atteinte par les inscriptions `PAID` + `PENDING` de moins de 30 min, et dont `finLe` n'est pas passé. Un léger dépassement d'un palier en cas d'achats simultanés est accepté (quelques unités, pas de verrou base).
- **Capacité** de la course = même comptage ; au-delà, la course est affichée « complet » et le serveur refuse.
- **Inscriptions ouvertes** = `Edition.registrationOpen`. Tant que c'est faux, `/inscription` affiche la pré-inscription (-10 %) et le site garde l'état actuel. Le jour du lancement, dans l'admin : bouton « Ouvrir les inscriptions » → passe le booléen, affiche le bandeau « C'est parti, les inscriptions sont ouvertes ! », active le CTA « S'inscrire » partout, et propose « Envoyer les codes -10 % aux pré-inscrits ».
- **Code -10 % pré-inscrits** : un code par email (`SEINE10-AB3K9Z`), 1 usage, lié à l'email de l'acheteur, valable jusqu'à une date choisie (ex. 15 jours après l'ouverture).
- **Remboursement / annulation** : depuis l'admin, remboursement Stripe (total ou partiel) → `REFUNDED`, place libérée.

---

## 5. Admin — pages et fonctions

| Page | Contenu |
|---|---|
| Tableau de bord | CA du jour / 7 jours / total (courbe par jour), nombre d'inscrits par course et par palier (jauges), panier moyen, part des options, dernières commandes, nombre de pré-inscrits, taux de conversion pré-inscrits → inscrits. |
| Pré-inscrits | Liste (email, date, source, code envoyé ?, converti ?), recherche, export CSV, bouton « Générer et envoyer les codes -10 % ». Import CSV du Google Sheet (une fois). |
| Édition & courses | Paramètres de l'édition (date, frais de gestion %, t-shirts oui/non, dates d'ouverture/fermeture), courses (nom, distance, horaires, capacité), paliers de prix par course (tableau éditable), **bouton Ouvrir / Fermer les inscriptions**. |
| Produits | T-shirt (visuel, tailles, prix), packs photos (prix, description), activer/désactiver. |
| Codes promo | Créer (code, % ou €, usages max, expiration, courses), voir l'usage, désactiver. |
| Commandes | Liste (numéro, date, acheteur, montant, statut), détail (lignes, coureurs, paiement Stripe), rembourser, renvoyer l'email de confirmation. |
| Inscrits | Table filtrable (course, statut, taille t-shirt, club…), détail et édition d'un coureur, **export CSV complet** (nom, prénom, naissance, sexe, email, tél, club, ville, taille, justificatif, dossard), attribution des dossards (par course, à partir d'un numéro). |
| Médiathèque | Upload (glisser-déposer, multi-fichiers) vers S3 par URL présignée, catégories (Pubs Meta / Site / Produits / Guides), aperçu, copie de l'URL, suppression. |
| Emails | Campagnes : nom, objet, corps (markdown avec variables `{{prenom}}`, `{{course}}`, `{{dossard}}`), audience, **envoi de test à mon adresse**, envoi réel (lots de 50 via SES, suivi dans `EmailLog`). Modèles : lancement / codes -10 %, guide coureur J-15, dernières infos J-3, résultats. Journal des envois et erreurs. |
| Paramètres | Changer le mot de passe, voir le segment d'URL, état des connexions (Neon, Stripe, S3, SES). |

---

## 6. Emails (SES)

Expéditeur : `Semi des Quais de Seine <inscriptions@semiquaisdeseine.fr>`, réponse à `contact@semiquaisdeseine.fr`.

Transactionnels : confirmation de commande (récap, coureurs, montant, lien reçu Stripe), confirmation de pré-inscription (déjà quasi existant : juste un accusé), remboursement.
Campagnes : lancement + code -10 %, guide coureur, rappels, résultats/photos (lien PhotoRunning).

Mise en place côté AWS (à faire tôt, l'approbation prend 24 à 48 h) :
1. SES → Identités → créer l'identité **domaine** `semiquaisdeseine.fr`, DKIM Easy (2048 bits) → 3 enregistrements CNAME à poser chez le registrar du domaine.
2. MAIL FROM personnalisé `mail.semiquaisdeseine.fr` → 1 MX + 1 TXT (SPF).
3. DMARC : TXT `_dmarc.semiquaisdeseine.fr` = `v=DMARC1; p=none; rua=mailto:contact@semiquaisdeseine.fr`.
4. **Demander la sortie du bac à sable** (Request production access) : décrire « emails transactionnels de confirmation d'inscription à une course à pied + informations pratiques aux inscrits, opt-in, lien de désinscription ». Sans ça, SES n'envoie qu'à des adresses vérifiées.
5. IAM : l'utilisateur de l'app a `ses:SendEmail` limité à cette identité.

---

## 7. Médias (S3)

- Bucket `semi-quais-seine-assets` (eu-west-3), Block Public Access **activé**, objets servis via une **distribution CloudFront** (ou, plus simple pour démarrer, politique de lecture publique limitée au préfixe `public/`).
- Préfixes : `public/products/`, `public/site/`, `ads/`, `guides/`.
- Upload depuis l'admin : le navigateur demande une URL présignée (`PUT`, 10 min, type MIME contraint), envoie directement vers S3, puis enregistre l'`Asset`.
- `next.config.ts` : `images.remotePatterns` pour le domaine S3/CloudFront.

---

## 8. SEO

- Pages dédiées (§2) avec un H1 par requête cible : « semi-marathon quais de Seine », « 10 km quais de Seine », « course à pied Houilles », « semi-marathon Val-d'Oise / Yvelines février 2027 ».
- `SportsEvent` JSON-LD enrichi : `subEvent` (Semi, 10 km), `offers` (prix du palier courant, `availability`, `validFrom`), `location` précise (départ gare de Houilles, arrivée Port Seine Parisii, Cormeilles-en-Parisis), `organizer`, `image` 1200×630.
- `FAQPage` JSON-LD sur la FAQ, `BreadcrumbList` sur les pages internes.
- Image Open Graph dédiée 1200×630 (pas le logo carré), générée dans `app/opengraph-image.tsx`.
- Sitemap avec toutes les pages publiques, `lastModified` ; admin et `/inscription/*` exclus ; `robots.txt` avec `Disallow: /<ADMIN_SLUG>/` **non listé** (on n'écrit pas le segment secret dans robots.txt ; on se contente du `noindex`).
- Performance : images déjà optimisées via `next/image`, polices locales, Lighthouse > 90 mobile.
- Contenu : une page « Le parcours » riche (villes traversées, points d'intérêt, ravitaillements, dénivelé), une page « Accès » (RER A / Transilien L et J à Houilles – Carrières-sur-Seine, retour depuis Cormeilles-en-Parisis par la ligne J), des liens entrants (mairies de Houilles, Carrières, Sartrouville, La Frette, Cormeilles ; calendriers de courses : Protiming, Jogging International, Kavval, Finishers, Running Addict, Klikego).
- Google Search Console + Business Profile « Semi des Quais de Seine » (événement).

---

## 9. Phases et calendrier

| Phase | Contenu | Durée | Variables Vercel à poser **avant** le déploiement de la phase |
|---|---|---|---|
| **0 — Comptes** (toi) | Neon, Stripe prod, AWS (IAM, S3, SES + DNS), export CSV du Google Sheet | 1 à 2 h de clics + attente SES | — |
| **1 — Socle** | Prisma + Neon, Better Auth, admin au segment secret, pré-inscriptions dans Neon (`/api/subscribe`), import du CSV, page Pré-inscrits + tableau de bord minimal, compte admin bootstrap | 1 session | `DATABASE_URL`, `DIRECT_DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `ADMIN_SLUG` |
| **2 — Catalogue & paiement** | Édition, courses, paliers, produits, codes promo (admin) ; tunnel d'inscription ; Stripe Checkout + webhook ; commandes et inscrits dans l'admin ; bouton « Ouvrir les inscriptions » + bandeau site | 2 à 3 sessions | `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, puis `STRIPE_WEBHOOK_SECRET` **après** le premier déploiement (le webhook a besoin de l'URL) |
| **3 — Emails & médias** | SES (confirmation, lancement -10 %, campagnes/guides coureurs), médiathèque S3, visuels produits dans le tunnel | 1 à 2 sessions | `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `S3_BUCKET`, `S3_PUBLIC_BASE_URL`, `SES_FROM_EMAIL`, `SES_REPLY_TO` |
| **4 — Pilotage & SEO** | Tableau de bord CA complet, exports, dossards, remboursements, pages SEO, OG image, JSON-LD enrichi, pages légales (CGV, confidentialité, règlement) | 1 à 2 sessions | — |
| **5 — Lancement** | Tests de bout en bout en Stripe **test** sur une preview Vercel (clés `sk_test`/`pk_test` dans l'environnement Preview), puis bascule des clés live en Production, commande réelle à 1 € remboursée, ouverture | ½ session | — |

Objectif réaliste : ouverture des inscriptions **mi-novembre 2026**, soit ~15 semaines avant la course.

---

## 10. Variables d'environnement — récapitulatif

Poser chaque variable dans Vercel → Settings → Environment Variables, pour **Production, Preview et Development** sauf mention contraire. Localement, les mêmes vont dans `.env.local` (jamais commité).

| Variable | Valeur | Quand |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://www.semiquaisdeseine.fr` | déjà là |
| `DATABASE_URL` | Neon, chaîne **poolée** (`…-pooler.…neon.tech/…?sslmode=require`) | phase 1 |
| `DIRECT_DATABASE_URL` | Neon, chaîne **directe** (sans `-pooler`) | phase 1 |
| `BETTER_AUTH_SECRET` | `openssl rand -base64 32` | phase 1 |
| `BETTER_AUTH_URL` | `https://www.semiquaisdeseine.fr` (Production) ; l'URL de la preview en Preview ; `http://localhost:3000` en Development | phase 1 |
| `ADMIN_SLUG` | ex. `gestion-sqs-k7x2m9` (lettres et chiffres, pas de `/`) | phase 1 |
| `STRIPE_SECRET_KEY` | `sk_live_…` en Production, `sk_test_…` en Preview/Development | phase 2 |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_…` / `pk_test_…` | phase 2 |
| `STRIPE_WEBHOOK_SECRET` | `whsec_…` créé dans Stripe → Developers → Webhooks, endpoint `https://www.semiquaisdeseine.fr/api/stripe/webhook`, événements `checkout.session.completed`, `checkout.session.expired`, `charge.refunded` | phase 2, après le 1er déploiement |
| `AWS_REGION` | `eu-west-3` | phase 3 |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | utilisateur IAM `semi-quais-seine-app` (S3 sur le bucket + `ses:SendEmail`) | phase 3 |
| `S3_BUCKET` | `semi-quais-seine-assets` | phase 3 |
| `S3_PUBLIC_BASE_URL` | `https://<distribution>.cloudfront.net` ou `https://semi-quais-seine-assets.s3.eu-west-3.amazonaws.com` | phase 3 |
| `SES_FROM_EMAIL` | `Semi des Quais de Seine <inscriptions@semiquaisdeseine.fr>` | phase 3 |
| `SES_REPLY_TO` | `contact@semiquaisdeseine.fr` | phase 3 |
| `GOOGLE_SCRIPT_URL` | — | à **supprimer** après l'import du CSV (phase 1) |

---

## 11. Phase 0 — ce que tu fais toi, dans l'ordre

1. **Neon** : nouveau projet `semi-quais-seine`, région Europe (Francfort), Postgres 17. Dans *Connection details*, copier la chaîne **Pooled connection** → `DATABASE_URL`, décocher *Pooled* → `DIRECT_DATABASE_URL`. Poser les deux dans Vercel maintenant.
2. **Secrets** : dans ton terminal, `openssl rand -base64 32` → `BETTER_AUTH_SECRET` ; choisir `ADMIN_SLUG`. Poser les deux + `BETTER_AUTH_URL` dans Vercel.
3. **Google Sheet** : Fichier → Télécharger → CSV, enregistrer sous `semi-quais-seine/scripts/preinscriptions.csv` (le fichier sera ignoré par git). Je m'occupe de l'import.
4. **Stripe** : compte au nom de l'entité qui organise la course (c'est elle qui apparaît sur les reçus et qui doit figurer dans les CGV). Activer le compte (KYC, IBAN). Developers → API keys → copier `pk_live` et `sk_live` ; créer aussi un jeu de clés **test**. Dans *Settings → Emails*, activer « reçus réussis » si tu veux que Stripe envoie ses propres reçus. Poser les clés dans Vercel en phase 2 (live en Production, test en Preview).
5. **AWS** : dans le compte PhotoRunning (ou un compte dédié), créer le bucket `semi-quais-seine-assets` (eu-west-3), l'utilisateur IAM `semi-quais-seine-app` avec une politique limitée au bucket + `ses:SendEmail`/`ses:SendRawEmail`, et lancer la vérification SES du domaine (§6) **dès maintenant** à cause du délai d'approbation. Les clés vont dans Vercel en phase 3.
6. **DNS** du domaine `semiquaisdeseine.fr` : poser les 3 CNAME DKIM, le MX + TXT du MAIL FROM, le TXT DMARC. Me dire chez qui est le domaine si tu veux que je te prépare les enregistrements exacts.

Quand 1 et 2 sont faits, je lance la phase 1.

---

## 12. Décisions prises le 16 octobre (réponses de Théo)

- **Jusqu'à 5 coureurs par commande** (un acheteur inscrit ses amis / sa famille en un paiement, un formulaire par coureur).
- **Justificatif facultatif** dans le tunnel (PPS / licence FFA / certificat) : on peut payer sans ; relance par email et complétion depuis l'admin (`Registration.justificatifType` nullable).
- **Paliers de prix** (par tranche de 500 dossards, puis tarif plein) :
  - Semi-marathon : 47 € · 49 € · 52 € · 55 €
  - 10 km : 24 € · 26 € · 29 € · 34 €
  (créés par `npm run db:seed`, modifiables dans l'admin en phase 2)
- **Phase 1 codée** le 16 octobre : schéma Prisma complet, Better Auth, admin au segment secret (login, tableau de bord, pré-inscrits + export CSV), `/api/subscribe` vers Neon, page `/confidentialite`, scripts `admin:create`, `import:prereg`, `db:seed`.
- Le compte admin se crée avec `npm run admin:create -- email "mot de passe"` (aucune variable de bootstrap nécessaire).

- **Entité qui vend les dossards : une association**, à créer. Le compte Stripe sera ouvert à son nom au dernier moment, juste avant l'ouverture des inscriptions ; d'ici là la phase 2b (tunnel + paiement) se code avec les clés de test.
- **Phase 2a livrée** le 16 octobre : pages admin Édition & courses (paliers, jauges, bouton Ouvrir/Fermer), Produits, Codes promo, génération des codes -10 % ; mode « inscriptions ouvertes » sur le site.

Reste à trancher : la date d'ouverture des inscriptions.
