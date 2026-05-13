# ✅ Checklist de finalisation du site

Cochez les éléments au fur et à mesure que vous les complétez.

## 📸 Images à fournir

### Obligatoires
- [ ] **Logo** (`public/images/logo.png`)
  - Format : PNG avec fond transparent
  - Dimensions : environ 300x300px
  - Utilisé dans Hero et Footer

- [ ] **Photo Hero** (`public/images/hero-running.jpg`)
  - Format : JPG optimisé
  - Dimensions : 1920x1080px minimum
  - Sujet : Coureurs sur les quais de Seine ou paysage dynamique
  - Utilisée en arrière-plan du Hero

### Recommandées (Section "Pourquoi participer")
- [ ] **parcours.jpg** - Photo du parcours le long de la Seine
- [ ] **ambiance.jpg** - Photo d'ambiance avec des coureurs
- [ ] **access.jpg** - Photo illustrant l'accessibilité (transport, ville)
- [ ] **runners.jpg** - Photo de coureurs de tous niveaux

> **Note** : Si vous n'avez pas toutes ces images, le site fonctionnera quand même mais affichera des erreurs d'image. Vous pouvez utiliser des photos de stock temporaires ou générer des images avec Midjourney/DALL-E.

## 🔧 Configuration technique

### Google Sheets
- [ ] Google Sheet créé avec colonnes `email` et `date`
- [ ] Google Apps Script créé et configuré
- [ ] Script déployé en tant que Web App
- [ ] URL du script récupérée
- [ ] Fichier `.env.local` créé en local avec `GOOGLE_SCRIPT_URL`
- [ ] Test d'inscription effectué et email reçu dans le Sheet

### Variables d'environnement Vercel
- [ ] Compte Vercel créé
- [ ] Repository connecté à Vercel
- [ ] Variable `GOOGLE_SCRIPT_URL` ajoutée dans Vercel
- [ ] Premier déploiement réussi

## ✍️ Contenu à finaliser

### Textes
- [ ] Vérifier et ajuster les textes du Hero
- [ ] Personnaliser les 4 raisons dans "Pourquoi participer"
- [ ] Ajouter/modifier les questions dans la FAQ
- [ ] Vérifier les infos du Footer

### Informations de la course
- [ ] Date précise confirmée (si disponible, sinon laisser "Mars 2027")
- [ ] Parcours GPS vérifié sur la carte
- [ ] Tarifs décidés (mentionnés dans FAQ si nécessaire)
- [ ] Modalités d'inscription définies

## 🎨 Personnalisation (optionnel)

- [ ] Ajuster les couleurs si nécessaire (`app/globals.css`)
- [ ] Modifier le compte à rebours avec la date exacte
- [ ] Ajouter des métadonnées OpenGraph personnalisées
- [ ] Créer une image OG pour les réseaux sociaux

## 🧪 Tests

### En local
- [ ] Site lance sans erreur (`npm run dev`)
- [ ] Navigation fluide sur toutes les sections
- [ ] Formulaires d'email fonctionnent (3 emplacements)
- [ ] Carte interactive s'affiche correctement
- [ ] Compte à rebours fonctionne
- [ ] FAQ s'ouvre/ferme correctement
- [ ] Responsive testé sur mobile

### En production
- [ ] Site accessible sur l'URL Vercel
- [ ] Test d'inscription depuis la prod
- [ ] Email bien enregistré dans Google Sheet
- [ ] Performance Lighthouse > 90
- [ ] Test sur différents navigateurs (Chrome, Safari, Firefox)
- [ ] Test sur mobile réel

## 🚀 Mise en ligne

- [ ] Nom de domaine acheté (optionnel)
- [ ] Domaine configuré sur Vercel (si applicable)
- [ ] SSL/HTTPS activé (automatique sur Vercel)
- [ ] Site testé sur le domaine final
- [ ] Google Analytics configuré (optionnel)

## 📢 Communication

- [ ] Annonce sur les réseaux sociaux préparée
- [ ] Email de lancement rédigé (pour futurs inscrits)
- [ ] QR Code créé pour supports print (optionnel)
- [ ] Flyers/affiches avec le lien du site (optionnel)

## 📊 Suivi

- [ ] Accès au Google Sheet partagé avec l'équipe
- [ ] Notifications configurées pour nouveaux emails (optionnel)
- [ ] Tableau de bord Analytics (optionnel)

---

## 🎯 Notes et actions

Utilisez cet espace pour noter vos actions spécifiques ou remarques :

```
Date : ___________
Actions à faire :
-
-
-

Remarques :
-
-
```

---

**Bravo !** 🎉 Une fois tous les éléments cochés, votre site est prêt pour collecter des inscriptions !
