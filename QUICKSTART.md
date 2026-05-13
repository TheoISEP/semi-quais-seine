# 🚀 Démarrage rapide

## Prochaines étapes immédiates

Votre site est prêt ! Voici ce que vous devez faire maintenant :

### 1. Tester le site en local (5 min)

```bash
cd semi-quais-seine
npm run dev
```

Ouvrez http://localhost:3000 dans votre navigateur.

**Note** : Les images ne s'afficheront pas encore (c'est normal), mais vous pouvez voir la structure complète du site.

### 2. Configurer Google Sheets (15 min)

**Important** : Sans cette étape, les formulaires d'inscription ne fonctionneront pas.

1. Ouvrez [GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md)
2. Suivez les instructions pas à pas
3. Récupérez votre URL de script
4. Mettez à jour `.env.local` avec cette URL

### 3. Ajouter vos images (10 min)

**Minimum requis :**
- Logo de la course → `public/images/logo.png`
- Photo hero → `public/images/hero-running.jpg`

Voir [public/images/README.md](./public/images/README.md) pour la liste complète.

**Où trouver des images temporaires :**
- Unsplash : https://unsplash.com/s/photos/running-paris
- Pexels : https://www.pexels.com/search/marathon/

### 4. Tester l'inscription (5 min)

1. Avec le site en local (`npm run dev`)
2. Remplissez le formulaire d'email
3. Vérifiez que l'email apparaît dans votre Google Sheet

### 5. Déployer sur Vercel (10 min)

```bash
# 1. Créer un compte sur vercel.com
# 2. Pousser votre code sur GitHub
git init
git add .
git commit -m "Initial commit - Le Semi des Quais de Seine"
git branch -M main
git remote add origin <votre-repo-github>
git push -u origin main

# 3. Sur Vercel :
# - Importer votre repository
# - Ajouter GOOGLE_SCRIPT_URL dans les variables d'environnement
# - Déployer !
```

## ✅ Checklist essentielle

Avant de partager votre site :

- [ ] Google Sheets configuré et testé
- [ ] Logo ajouté
- [ ] Photo hero ajoutée
- [ ] Test d'inscription OK (email reçu dans le Sheet)
- [ ] Déployé sur Vercel
- [ ] Variable GOOGLE_SCRIPT_URL configurée sur Vercel
- [ ] Test d'inscription depuis la production OK

## 📚 Documentation complète

- **[README.md](./README.md)** - Documentation complète du projet
- **[GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md)** - Configuration Google Sheets détaillée
- **[CHECKLIST.md](./CHECKLIST.md)** - Liste complète de tous les éléments à finaliser

## 🆘 Problèmes fréquents

### Le site ne démarre pas
```bash
# Réinstallez les dépendances
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Les formulaires ne fonctionnent pas
1. Vérifiez que `.env.local` existe avec `GOOGLE_SCRIPT_URL`
2. Vérifiez que le Google Apps Script est bien déployé
3. Consultez [GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md)

### Les images ne s'affichent pas
1. Vérifiez qu'elles sont dans `public/images/`
2. Vérifiez le nom exact des fichiers (sensible à la casse)
3. Redémarrez le serveur de dev

## 📞 Besoin d'aide ?

Consultez la section "Dépannage" du [README.md](./README.md) ou vérifiez les logs de la console du navigateur pour voir les erreurs exactes.

---

**Temps total estimé pour avoir un site fonctionnel : ~45 minutes**

Bon courage ! 🎉
