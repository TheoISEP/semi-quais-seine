# Prompt pour Claude (extension Chrome) — campagne Meta « Pré-inscription -10 % »

À coller dans le panneau Claude de Chrome, avec Ads Manager (adsmanager.facebook.com) ouvert dans un onglet, connecté au compte qui gère le portefeuille **PhotoRunning Ads**.

Avant de lancer : les deux visuels à utiliser sont prêts en taille Meta dans `assets/ads/` :
- `story-10-pre-inscription-moins-10-1080x1920.jpg` (stories / reels, 9:16)
- `feed-02-votre-defi-de-l-hiver-1080x1350.jpg` (fils d'actualité, 4:5)

Et la politique de confidentialité exigée par Meta pour un formulaire instantané doit être en ligne : `https://www.semiquaisdeseine.fr/confidentialite` (déployée avec la phase 1).

---

```
Tu es dans Meta Ads Manager (onglet déjà ouvert). Tu vas préparer puis publier une campagne de collecte d'emails (prospects / formulaire instantané) pour la course « Le Semi des Quais de Seine ». Réponds-moi en français. Travaille étape par étape, en vérifiant à l'écran chaque action avant de passer à la suivante. Ne clique JAMAIS sur « Publier » ni sur un bouton de paiement sans me demander explicitement « je publie ? » et attendre mon oui. Si une étape bloque (droit manquant, carte à saisir, vérification demandée), arrête-toi et explique-moi ce qu'il faut faire.

CONTEXTE
- Portefeuille business : « PhotoRunning Ads » (il contient déjà les comptes publicitaires « MyPhotoRace Ads » et « PhotoRunning Ads »).
- La Page Facebook « Le Semi des Quais de Seine » et le compte Instagram du Semi des Quais de Seine existent déjà et sont gérés par mon compte.
- Course : Le Semi des Quais de Seine, 1re édition, dimanche 28 février 2027, semi-marathon (21,1 km) et 10 km le long de la Seine, départ gare de Houilles – Carrières-sur-Seine, arrivée au port Seine Parisii à Cormeilles-en-Parisis (ouest de Paris). Site : https://www.semiquaisdeseine.fr. Les inscriptions ouvrent en novembre ; d'ici là on collecte des emails en promettant -10 % sur le dossard.
- Objectif de cette campagne : des prospects (prénom, nom, email, distance envisagée) via un formulaire instantané Meta, 15 € par jour, sans date de fin.

ÉTAPE 1 — Préparer les ressources dans les Paramètres de l'entreprise (business.facebook.com/settings) du portefeuille PhotoRunning Ads
1. Comptes → Pages : vérifier que « Le Semi des Quais de Seine » y figure. Sinon : Ajouter → « Ajouter une Page » → la sélectionner.
2. Comptes → Comptes Instagram : vérifier que le compte Instagram du Semi des Quais de Seine y figure. Sinon : Ajouter → se connecter avec ce compte Instagram.
3. Comptes → Comptes publicitaires → Ajouter → « Créer un compte publicitaire » :
   - Nom : « Semi des Quais de Seine Ads »
   - Fuseau horaire : (GMT+01:00) Paris ; Devise : EUR
   - Ce compte publicitaire sera utilisé pour : « Mon entreprise »
   - Ajouter mon compte (moi) en tant qu'administrateur (Gérer le compte publicitaire).
   Si Meta refuse de créer un nouveau compte publicitaire (limite atteinte), arrête-toi et dis-le moi : on utilisera alors « PhotoRunning Ads » (ID 1700601741240730).
4. Toujours dans Comptes publicitaires, sélectionner « Semi des Quais de Seine Ads » → Ajouter des ressources : attribuer la Page « Le Semi des Quais de Seine » et le compte Instagram du Semi des Quais de Seine à ce compte publicitaire.
5. Facturation et paiements : ouvrir les moyens de paiement du nouveau compte publicitaire. Si un moyen de paiement du portefeuille peut être réutilisé (carte déjà utilisée pour MyPhotoRace Ads ou PhotoRunning Ads), l'ajouter au nouveau compte. S'il faut saisir une carte, ARRÊTE-TOI et demande-moi.
6. Vérifier (Page → Paramètres → Comptes liés) que l'Instagram est bien relié à la Page Facebook. Sinon, me l'indiquer.

ÉTAPE 2 — Créer la campagne (Ads Manager, sélectionner le compte « Semi des Quais de Seine Ads » dans le sélecteur en haut à gauche)
1. + Créer → Objectif « Prospects » → configuration manuelle (pas la configuration simplifiée). Continuer.
2. Campagne :
   - Nom : « SQS 2027 – Pré-inscription -10 % – Prospects »
   - Catégories publicitaires spéciales : aucune
   - Budget de campagne Advantage+ : ACTIVÉ, budget quotidien 15,00 €, stratégie « Volume le plus élevé »
3. Ensemble de publicités :
   - Nom : « Coureurs Île-de-France – formulaire »
   - Lieu de conversion : « Formulaires instantanés »
   - Page Facebook : « Le Semi des Quais de Seine »
   - Objectif de performance : « Maximiser le nombre de prospects »
   - Calendrier : démarrer dès la publication, pas de date de fin
   - Audience : lieu = France, puis cibler uniquement : Paris + rayon de 40 km autour de Houilles (78800) ; en complément, ajouter les départements Val-d'Oise (95), Yvelines (78), Hauts-de-Seine (92), Seine-Saint-Denis (93), Val-de-Marne (94) et Paris (75). Âge 20 à 60 ans. Tous les genres. Langue : français.
   - Si « Audience Advantage+ » est proposée : la garder activée et ajouter comme suggestions de centres d'intérêt : course à pied, running, jogging, semi-marathon, marathon, trail, Strava, Garmin, Nike Running, adidas Running, Decathlon, Salomon, Hoka, ASICS.
   - Placements : Advantage+ (automatiques).
4. Publicité :
   - Nom : « Story -10 % – shoe tying »
   - Identité : Page « Le Semi des Quais de Seine » + compte Instagram du Semi des Quais de Seine
   - Format : image unique
   - Média : importer le fichier /Users/theomacstudio/Desktop/DEV/semi-quais-seine/assets/ads/story-10-pre-inscription-moins-10-1080x1920.jpg. Puis, dans « Modifier par placement » (ou « Recadrer / optimiser par placement »), utiliser /Users/theomacstudio/Desktop/DEV/semi-quais-seine/assets/ads/feed-02-votre-defi-de-l-hiver-1080x1350.jpg pour les placements fil d'actualité Facebook et Instagram (4:5), et garder le 9:16 pour Stories et Reels. Si l'import de fichier depuis mon ordinateur n'est pas possible depuis l'extension, arrête-toi et dis-le moi : je glisserai les fichiers moi-même, puis tu reprendras.
   - Texte principal : « 🏃 Première édition du Semi des Quais de Seine, dimanche 28 février 2027 : semi-marathon ou 10 km, 100 % le long de la Seine. Départ gare de Houilles, arrivée au port Seine Parisii à Cormeilles-en-Parisis. Laissez votre email et recevez -10 % sur votre dossard à l'ouverture des inscriptions, en novembre. »
   - Titre : « -10 % sur votre dossard »
   - Description : « Semi-marathon · 10 km · 28 février 2027 »
   - Bouton d'appel à l'action : « S'inscrire »
   - Destination : Formulaire instantané → « Créer un formulaire » :
       · Nom du formulaire : « Pré-inscription -10 % – Semi des Quais de Seine »
       · Type : « Volume plus élevé »
       · Présentation (intro) : titre « -10 % sur votre dossard », image = celle de la publicité ; description en paragraphe : « Laissez vos coordonnées : vous recevrez votre code de réduction de 10 % par email dès l'ouverture des inscriptions, en novembre. Semi-marathon (21,1 km) ou 10 km, le dimanche 28 février 2027, le long de la Seine. »
       · Questions : Prénom, Nom, E-mail (champs préremplis Meta), puis une question personnalisée à choix multiple : « Quelle distance vous intéresse ? » avec les réponses « Semi-marathon (21,1 km) », « 10 km », « Je ne sais pas encore ».
       · Politique de confidentialité : texte du lien « Politique de confidentialité », URL https://www.semiquaisdeseine.fr/confidentialite
       · Message de fin : titre « Merci, c'est noté ! » ; texte « Vous recevrez votre code -10 % par email dès l'ouverture des inscriptions. Rendez-vous le 28 février 2027 sur les quais de Seine ! » ; bouton « Voir le site » → https://www.semiquaisdeseine.fr
       · Paramètres du formulaire : langue « Français » ; partage « Restreint » (seules les personnes qui voient la publicité peuvent remplir le formulaire). Enregistrer le formulaire.
   - Suivi : rien à configurer (pas de pixel nécessaire pour un formulaire instantané).
5. Vérifier l'aperçu sur Instagram Stories, Reels et fil d'actualité Facebook : le texte « -10 % SUR VOTRE DOSSARD » et le logo ne doivent pas être masqués par l'interface. Si un placement recadre mal, désactiver ce placement.

ÉTAPE 3 — Avant publication
Fais-moi un récapitulatif complet (compte publicitaire, Page, Instagram, budget, audience, placements, textes, questions du formulaire, URL de confidentialité) et demande-moi « je publie ? ». Publie seulement après mon oui, puis confirme-moi le statut (« En cours d'examen ») et l'identifiant de la campagne.

ÉTAPE 4 — Après publication
Explique-moi en 3 lignes où récupérer les prospects (Meta Business Suite → Toutes les ressources → Formulaires instantanés → Télécharger, ou le Centre de prospects) et comment en télécharger un CSV ; je l'importerai dans notre base avec notre script.
```

---

## Après la mise en ligne

- Récupération des prospects : Business Suite → Toutes les ressources → Formulaires instantanés → « Télécharger » (CSV). Le fichier contient une colonne `email` : il s'importe tel quel avec `npm run import:prereg -- chemin/vers/le-fichier.csv` (les doublons avec le site sont ignorés).
- Suivi : coût par prospect visé < 1 € (MyPhotoRace est à 0,93 €). Au-delà de 2 €, changer de visuel (essayer `story-01` ou `feed-05`) avant de toucher à l'audience.
- Plus tard (phase 3) : connecter les prospects Meta directement à Neon via un webhook, pour ne plus importer à la main.
