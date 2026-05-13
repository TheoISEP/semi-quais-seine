# 💾 Comment sauvegarder vos logos

Voici les étapes exactes pour enregistrer les logos que vous m'avez envoyés.

## Logos à sauvegarder

Vous m'avez envoyé 4 images dans votre message :

### Image #1 et #2 (Logo couleur - identiques)
- **Couleurs** : Bleu marine (#0A2540), Bleu clair (#5B9BD5), Or (#C5A572)
- **À enregistrer sous** : `logo.png`
- **Emplacement** : `public/images/logo.png`
- **Utilisation** : Header + Favicon

### Image #3 (Logo gris/monochrome)
- **Couleurs** : Niveaux de gris
- **À enregistrer sous** : `logo-gray.png`
- **Emplacement** : `public/images/logo-gray.png`
- **Utilisation** : Footer

### Image #4 (Logo couleur)
- Même que Image #1 et #2, donc pas besoin de la sauvegarder à nouveau

## Instructions pas à pas

### Sur Mac

1. **Ouvrez l'image #2 (logo couleur)** dans votre conversation
2. **Clic droit** sur l'image → **Enregistrer l'image sous...**
3. **Nom** : `logo.png`
4. **Où** : Naviguez jusqu'à :
   ```
   /Users/theochauland-lottet/DOC-MAC/SemiDesQuaisDeSeine/semi-quais-seine/public/images/
   ```
5. Cliquez sur **Enregistrer**

6. **Répétez** avec l'image #3 (logo gris) :
   - Nom : `logo-gray.png`
   - Même dossier que ci-dessus

### Vérification

Une fois les fichiers enregistrés, vérifiez dans le Terminal :

```bash
ls -lh public/images/

# Vous devriez voir :
# logo.png
# logo-gray.png
```

### Alternative rapide (Glisser-Déposer)

1. Ouvrez le Finder et naviguez jusqu'à :
   ```
   /Users/theochauland-lottet/DOC-MAC/SemiDesQuaisDeSeine/semi-quais-seine/public/images/
   ```

2. Depuis votre conversation, **glissez-déposez** directement :
   - Image #2 → Renommez en `logo.png`
   - Image #3 → Renommez en `logo-gray.png`

## Résultat attendu

Une fois les logos en place :

### ✅ Header
- Logo couleur affiché en haut à gauche
- Se réduit légèrement au scroll
- Navigation fluide

### ✅ Footer
- Logo gris affiché en bas à gauche
- Légère opacité pour le rendre plus discret

### ✅ Favicon
- Icône du site dans l'onglet du navigateur
- Utilise le logo couleur

## Formats alternatifs

Si vous voulez optimiser les logos :

### Convertir en WebP (optionnel)
```bash
# Installer imagemagick si nécessaire
brew install imagemagick

# Convertir
convert public/images/logo.png -quality 90 public/images/logo.webp
convert public/images/logo-gray.png -quality 90 public/images/logo-gray.webp
```

### Créer un favicon.ico (optionnel)
```bash
# Créer un favicon.ico multi-tailles
convert public/images/logo.png -resize 256x256 -define icon:auto-resize=256,128,64,48,32,16 public/favicon.ico
```

Mais Next.js gère déjà le favicon avec `logo.png`, donc ce n'est pas nécessaire.

## Dépannage

### "Je ne trouve pas le dossier"
```bash
# Depuis la racine du projet
cd /Users/theochauland-lottet/DOC-MAC/SemiDesQuaisDeSeine/semi-quais-seine
open public/images
```

Cela ouvrira le dossier dans le Finder.

### "L'image n'apparaît pas"
1. Vérifiez le nom exact : `logo.png` (pas `Logo.png` ou `logo.PNG`)
2. Rechargez le navigateur : Cmd+Shift+R
3. Vérifiez la console du navigateur pour voir les erreurs

### "Le favicon ne change pas"
Le favicon est mis en cache agressivement par les navigateurs :
1. Videz complètement le cache du navigateur
2. Ouvrez le site en navigation privée
3. Patientez quelques minutes

---

**Temps estimé** : 2 minutes ⏱️

Une fois fait, rechargez votre navigateur et le site aura un header professionnel avec le logo !
