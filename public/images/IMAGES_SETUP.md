# 📸 Configuration des images

Pour que le site s'affiche correctement, vous devez ajouter les images suivantes dans ce dossier (`public/images/`).

## Images obligatoires

### 1. logo.png
- **Source** : Image #2 et #4 (logo couleur avec bleu et or)
- **Utilisation** :
  - Header (logo principal)
  - Favicon du site
  - Image OpenGraph (réseaux sociaux)
- **Format recommandé** : PNG avec fond transparent
- **Dimensions** : 512x512px minimum
- **Poids** : < 200KB

### 2. logo-gray.png
- **Source** : Image #3 (logo en niveaux de gris)
- **Utilisation** : Footer uniquement
- **Format recommandé** : PNG avec fond transparent
- **Dimensions** : 512x512px minimum
- **Poids** : < 200KB

### 3. hero-running.jpg
- **Description** : Photo de fond pour la section hero
- **Sujet** : Coureurs sur les quais de Seine ou paysage dynamique
- **Format** : JPG optimisé
- **Dimensions** : 1920x1080px minimum (format paysage)
- **Poids** : < 500KB

## Images recommandées (pour les cards "Pourquoi participer")

### 4. parcours.jpg
- **Description** : Photo du parcours le long de la Seine
- **Dimensions** : 800x600px minimum
- **Poids** : < 300KB

### 5. ambiance.jpg
- **Description** : Photo d'ambiance avec des coureurs
- **Dimensions** : 800x600px minimum
- **Poids** : < 300KB

### 6. access.jpg
- **Description** : Photo illustrant l'accessibilité (RER, ville, transport)
- **Dimensions** : 800x600px minimum
- **Poids** : < 300KB

### 7. runners.jpg
- **Description** : Photo de coureurs de tous niveaux
- **Dimensions** : 800x600px minimum
- **Poids** : < 300KB

## Instructions

### Étape 1 : Enregistrer les logos

Depuis les images fournies dans votre brief :
1. **Image #2** (logo couleur) → Enregistrer sous `logo.png`
2. **Image #3** (logo gris) → Enregistrer sous `logo-gray.png`
3. **Image #4** (logo couleur) → C'est le même que #2, donc pas besoin de dupliquer

### Étape 2 : Optimiser les images

Avant d'ajouter vos images :
1. Redimensionnez-les aux bonnes dimensions
2. Compressez-les avec :
   - **TinyPNG** : https://tinypng.com/ (pour PNG et JPG)
   - **Squoosh** : https://squoosh.app/ (outil avancé)

### Étape 3 : Placer les fichiers

Copiez tous vos fichiers dans :
```
/Users/theochauland-lottet/DOC-MAC/SemiDesQuaisDeSeine/semi-quais-seine/public/images/
```

### Étape 4 : Vérifier

Une fois les fichiers ajoutés :
1. Le serveur de dev se rechargera automatiquement
2. Rechargez votre navigateur
3. Vérifiez que :
   - Le header affiche le logo couleur
   - Le footer affiche le logo gris
   - Le favicon s'affiche dans l'onglet du navigateur
   - Les photos de fond des cards s'affichent

## Structure finale attendue

```
public/images/
├── logo.png              ✅ Obligatoire
├── logo-gray.png         ✅ Obligatoire
├── hero-running.jpg      ✅ Obligatoire
├── parcours.jpg          ⚠️  Recommandé
├── ambiance.jpg          ⚠️  Recommandé
├── access.jpg            ⚠️  Recommandé
└── runners.jpg           ⚠️  Recommandé
```

## Dépannage

### Le logo ne s'affiche pas
- Vérifiez que le fichier s'appelle exactement `logo.png` (sensible à la casse)
- Vérifiez qu'il est bien dans `public/images/`
- Redémarrez le serveur de dev (`npm run dev`)

### Le favicon ne change pas
- Videz le cache du navigateur (Cmd+Shift+R sur Mac)
- Le favicon peut prendre quelques secondes à se mettre à jour

### Les images sont floues
- Assurez-vous d'utiliser des images haute résolution
- Vérifiez que vous n'avez pas trop compressé (< 60% de qualité)

---

**Note** : Sans ces images, le site fonctionnera mais affichera des erreurs d'image dans la console. Ajoutez au minimum `logo.png`, `logo-gray.png` et `hero-running.jpg` pour un rendu professionnel.
