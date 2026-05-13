# Le Semi des Quais de Seine - Site Vitrine

[![GitHub](https://img.shields.io/badge/GitHub-TheoISEP%2Fsemi--quais--seine-blue?logo=github)](https://github.com/TheoISEP/semi-quais-seine)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FTheoISEP%2Fsemi-quais-seine)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)

Site web officiel de la première édition du Semi des Quais de Seine (Mars 2027).

## 📋 Vue d'ensemble

Landing page moderne et responsive pour promouvoir la première édition du Semi des Quais de Seine, une course à pied exceptionnelle le long de la Seine entre Bezons et La Frette-sur-Seine.

### Objectifs du site
- ✨ Teaser l'événement de Mars 2027
- 📧 Collecter des emails pour informer de l'ouverture des inscriptions
- 🎁 Offrir une réduction de 10% aux inscrits early-bird
- 🗺️ Présenter le parcours avec une carte interactive
- 📱 Expérience optimale sur tous les appareils

## 🚀 Stack Technique

- **Framework** : Next.js 15 (App Router)
- **Language** : TypeScript
- **Styling** : Tailwind CSS v4
- **Animations** : Framer Motion
- **Carte** : React-Leaflet
- **Déploiement** : Vercel
- **Backend** : Google Sheets via Google Apps Script

## 📦 Installation

### Prérequis
- Node.js 18+ installé
- npm ou yarn
- Un compte Google (pour Google Sheets)

### Étapes

1. **Cloner le repository** (ou naviguer dans le dossier)
```bash
cd semi-quais-seine
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer Google Sheets**

Suivez le guide détaillé dans [GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md) pour :
- Créer le Google Apps Script
- Déployer l'API Web App
- Récupérer l'URL du script

4. **Configurer les variables d'environnement**

Créez un fichier `.env.local` à la racine :
```bash
cp .env.local.example .env.local
```

Éditez `.env.local` et ajoutez votre URL Google Apps Script :
```
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/VOTRE_ID_DE_SCRIPT/exec
```

5. **Lancer le serveur de développement**
```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📁 Structure du projet

```
semi-quais-seine/
├── app/
│   ├── api/
│   │   └── subscribe/
│   │       └── route.ts          # API route pour collecter les emails
│   ├── layout.tsx                # Layout global (metadata, fonts)
│   ├── page.tsx                  # Page d'accueil
│   └── globals.css               # Styles globaux et variables CSS
├── components/
│   ├── Hero.tsx                  # Section hero avec logo et CTA principal
│   ├── WhyParticipate.tsx        # Section "Pourquoi participer"
│   ├── Parcours.tsx              # Section parcours avec carte
│   ├── MapComponent.tsx          # Carte interactive Leaflet
│   ├── Countdown.tsx             # Compte à rebours vers Mars 2027
│   ├── FAQ.tsx                   # Questions fréquentes
│   ├── EmailForm.tsx             # Formulaire de collecte d'email (réutilisable)
│   └── Footer.tsx                # Footer avec infos et dernier CTA
├── public/
│   └── images/                   # Images du site (à ajouter)
│       ├── logo.png              # Logo de la course
│       ├── hero-running.jpg      # Photo hero
│       ├── parcours.jpg          # Photos pour "Pourquoi participer"
│       ├── ambiance.jpg
│       ├── access.jpg
│       └── runners.jpg
├── .env.local                    # Variables d'environnement (non versionné)
├── .env.local.example            # Template des variables d'environnement
├── GOOGLE_SHEETS_SETUP.md        # Guide de configuration Google Sheets
├── package.json
└── README.md                     # Ce fichier
```

## 🎨 Ajouter vos images

Le site nécessite les images suivantes dans `public/images/` :

### Obligatoires
- **logo.png** : Le logo de la course (environ 300x300px)
- **hero-running.jpg** : Photo principale pour le hero (haute résolution, paysage)

### Recommandées (pour "Pourquoi participer")
- **parcours.jpg** : Photo du parcours le long de la Seine
- **ambiance.jpg** : Photo d'ambiance avec des coureurs
- **access.jpg** : Photo illustrant l'accessibilité
- **runners.jpg** : Photo de coureurs de tous niveaux

### Format recommandé
- Format : JPG optimisé (ou WebP pour de meilleures performances)
- Dimensions : 1920x1080px ou plus pour les photos hero
- Dimensions : 800x600px minimum pour les autres
- Poids : < 500KB par image (utilisez un outil de compression comme TinyPNG)

### Optimisation
Next.js optimise automatiquement les images avec le composant `<Image>`, mais préférez des images déjà compressées pour de meilleures performances.

## 🚀 Déploiement sur Vercel

### Première fois

1. **Créer un compte Vercel** (si ce n'est pas déjà fait) : https://vercel.com

2. **Connecter votre repository GitHub**
   - Poussez votre code sur GitHub
   - Sur Vercel, cliquez sur "Add New Project"
   - Importez votre repository

3. **Configurer les variables d'environnement**
   - Dans les paramètres du projet Vercel
   - Ajoutez `GOOGLE_SCRIPT_URL` avec votre URL Google Apps Script
   - Disponible pour Production, Preview et Development

4. **Déployer**
   - Vercel déploie automatiquement
   - Votre site sera disponible sur `votre-projet.vercel.app`

### Déploiements suivants

Vercel redéploie automatiquement à chaque push sur la branche principale (main/master).

#### Configuration avec GitHub

Pour que les déploiements automatiques fonctionnent :

1. **Dans votre repository GitHub**, aucune configuration n'est nécessaire
2. **Dans Vercel** :
   - Settings > Git
   - La branche de production est automatiquement détectée
   - Chaque push sur `main` ou `master` déclenche un déploiement

#### Variables d'environnement depuis GitHub

Les variables d'environnement sont gérées dans Vercel, pas dans GitHub :
- Ne JAMAIS committer le fichier `.env.local`
- Toujours configurer les variables dans l'interface Vercel
- Les variables sont automatiquement injectées lors du build

## 🛠️ Scripts disponibles

```bash
# Développement
npm run dev          # Lance le serveur de dev sur localhost:3000

# Production
npm run build        # Compile le site pour la production
npm run start        # Lance le serveur de production

# Qualité du code
npm run lint         # Vérifie le code avec ESLint
```

## 📝 Personnalisation du contenu

### Modifier les textes

Les textes sont directement dans les composants :
- **Hero** : `components/Hero.tsx`
- **Pourquoi participer** : `components/WhyParticipate.tsx` (tableau `reasons`)
- **FAQ** : `components/FAQ.tsx` (tableau `faqs`)
- **Métadonnées SEO** : `app/layout.tsx`

### Modifier les couleurs

Les couleurs sont définies dans `app/globals.css` (variables CSS) :
```css
--navy-dark: #0A2540;      /* Bleu marine foncé */
--navy-medium: #1a3a5c;    /* Bleu marine moyen */
--blue-light: #5B9BD5;     /* Bleu clair */
--gold: #C5A572;           /* Or */
--gold-light: #D4B78E;     /* Or clair */
```

### Modifier le parcours de la carte

La carte est dans `components/MapComponent.tsx`. Ajustez les coordonnées GPS dans les tableaux `outboundPath` et `returnPath`.

### Modifier la date du compte à rebours

Dans `components/Countdown.tsx`, ligne 16 :
```typescript
const targetDate = new Date("2027-03-01T09:00:00").getTime();
```

## 🔍 SEO et Performance

Le site est optimisé pour :
- ✅ SEO (métadonnées, balises OpenGraph)
- ✅ Performance (images optimisées, lazy loading)
- ✅ Accessibilité (sémantique HTML, ARIA)
- ✅ Responsive design (mobile-first)

Objectif Lighthouse : > 90/100 sur tous les critères

## 🐛 Dépannage

### Le formulaire ne fonctionne pas
1. Vérifiez que `GOOGLE_SCRIPT_URL` est bien configuré
2. Vérifiez que le Google Apps Script est déployé
3. Consultez la console du navigateur pour les erreurs

### La carte ne s'affiche pas
1. Vérifiez que Leaflet CSS est bien importé (`app/globals.css`)
2. Vérifiez qu'il n'y a pas d'erreur dans la console
3. La carte est chargée dynamiquement (SSR désactivé), c'est normal qu'elle mette 1-2 secondes

### Les images ne s'affichent pas
1. Vérifiez que les images sont bien dans `public/images/`
2. Vérifiez le nom des fichiers (sensible à la casse)
3. Attendez le rebuild automatique en dev (ou redémarrez `npm run dev`)

## 📞 Support

Pour toute question ou problème :
1. Consultez [GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md)
2. Vérifiez les logs dans la console du navigateur
3. Vérifiez les logs Vercel (pour les problèmes en production)

## 📄 Checklist avant mise en production

- [ ] Toutes les images sont ajoutées et optimisées
- [ ] Le logo est en place
- [ ] Google Sheets est configuré et testé
- [ ] Variable `GOOGLE_SCRIPT_URL` configurée sur Vercel
- [ ] Les textes sont finalisés (dates, descriptions, FAQ)
- [ ] Les coordonnées du parcours sont correctes
- [ ] Le site est testé sur mobile et desktop
- [ ] Test du formulaire d'inscription (vérifie que les emails arrivent bien)
- [ ] Vérification Lighthouse (Performance > 90)
- [ ] Nom de domaine configuré (optionnel)

## 🎯 Prochaines étapes

Une fois le site en ligne :
1. Partagez le lien sur les réseaux sociaux
2. Suivez les inscriptions dans votre Google Sheet
3. Préparez l'email d'annonce de l'ouverture des inscriptions
4. Testez régulièrement le formulaire

---

Développé avec ❤️ pour Le Semi des Quais de Seine • Mars 2027
