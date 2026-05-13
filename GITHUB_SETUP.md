# 🚀 Configuration GitHub

## Étape 1: Authentification GitHub CLI

Exécutez cette commande dans votre terminal:

```bash
gh auth login
```

**Sélectionnez:**
1. **GitHub.com** (appuyez sur Entrée)
2. **HTTPS** (appuyez sur Entrée)
3. **Yes** pour authentifier Git avec vos credentials GitHub (appuyez sur Y puis Entrée)
4. **Login with a web browser** (appuyez sur Entrée)

Vous verrez un code de 8 caractères. Copiez-le.

5. Appuyez sur Entrée pour ouvrir votre navigateur
6. Collez le code dans la page GitHub qui s'ouvre
7. Cliquez sur **Authorize github**
8. ✅ Vous êtes authentifié!

## Étape 2: Créer le repository GitHub

Une fois authentifié, exécutez ces commandes:

```bash
# Créer le repo GitHub (public)
gh repo create semi-quais-seine --public --source=. --remote=origin --push

# Ou si vous préférez un repo privé:
# gh repo create semi-quais-seine --private --source=. --remote=origin --push
```

Cette commande va:
- Créer un nouveau repo sur GitHub nommé `semi-quais-seine`
- Le définir comme `origin` remote
- Pousser automatiquement votre code

## Étape 3: Vérifier

Visitez: `https://github.com/VOTRE_USERNAME/semi-quais-seine`

Vous devriez voir tout votre code sur GitHub! 🎉

## Commandes Git utiles pour la suite

```bash
# Voir l'état de votre repo
git status

# Ajouter des changements
git add .

# Faire un commit
git commit -m "Description de vos changements"

# Pousser vers GitHub
git push origin master

# Voir l'historique
git log --oneline

# Créer une nouvelle branche
git checkout -b nom-de-la-branche

# Changer de branche
git checkout master
```

## Notes importantes

- Le fichier `.env.local` n'est PAS poussé sur GitHub (il est dans `.gitignore`)
- C'est normal et c'est pour la sécurité (il contient votre URL Google Script)
- Vous devrez configurer les variables d'environnement séparément sur Vercel lors du déploiement

## Déploiement sur Vercel (optionnel)

Une fois sur GitHub, vous pouvez facilement déployer sur Vercel:

1. Allez sur https://vercel.com
2. Cliquez sur **Add New** > **Project**
3. Importez votre repo GitHub `semi-quais-seine`
4. Dans **Environment Variables**, ajoutez:
   - Name: `GOOGLE_SCRIPT_URL`
   - Value: Votre URL Google Apps Script
5. Cliquez sur **Deploy**

Votre site sera en ligne en quelques minutes! 🚀
