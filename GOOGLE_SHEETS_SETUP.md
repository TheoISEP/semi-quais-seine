# Configuration Google Sheets

Ce guide explique comment configurer Google Sheets pour collecter les emails depuis le site.

## Méthode recommandée : Google Apps Script

C'est la méthode la plus simple, ne nécessitant pas de service account ni de clés d'API complexes.

## Étapes de configuration

### 1. Préparer votre Google Sheet

1. Ouvrez votre Google Sheet : https://docs.google.com/spreadsheets/d/193KW5PnrJKBorrbkyLDyxgj_QMz3DgcY8JbmImRBZXg/edit
2. Assurez-vous que la première feuille (onglet) contient deux colonnes :
   - Colonne A : **email**
   - Colonne B : **date**
3. La première ligne doit contenir les en-têtes : `email` et `date`

### 2. Créer le Google Apps Script

1. Dans votre Google Sheet, cliquez sur **Extensions** > **Apps Script**
2. Supprimez tout le code par défaut
3. Copiez-collez le code suivant :

```javascript
function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    const email = data.email;
    const date = data.date;

    // Open the spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Check if email already exists
    const existingEmails = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
    const emailExists = existingEmails.some(row => row[0] === email);

    if (emailExists) {
      return ContentService.createTextOutput(
        JSON.stringify({ success: false, message: "Email already exists" })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // Append the new row
    sheet.appendRow([email, date]);

    // Return success response
    return ContentService.createTextOutput(
      JSON.stringify({ success: true, message: "Email saved successfully" })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: Test function
function testDoPost() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        email: "test@example.com",
        date: new Date().toISOString()
      })
    }
  };

  const result = doPost(testData);
  Logger.log(result.getContent());
}
```

4. Cliquez sur **Enregistrer** (icône disquette) et donnez un nom au projet (ex: "Semi Quais Seine Emails")

### 3. Déployer le script comme Web App

1. Cliquez sur le bouton **Déployer** > **Nouveau déploiement**
2. Cliquez sur l'icône **⚙️** à côté de "Sélectionner un type" et choisissez **Application Web**
3. Configurez les paramètres :
   - **Description** : "Email collection API" (ou ce que vous voulez)
   - **Exécuter en tant que** : **Moi** (votre compte Google)
   - **Qui a accès** : **Tout le monde**
4. Cliquez sur **Déployer**
5. **IMPORTANT** : Vous devrez autoriser l'application. Cliquez sur "Autoriser l'accès", connectez-vous avec votre compte Google, puis cliquez sur "Avancé" et "Accéder à [nom du projet] (non sécurisé)" pour autoriser.
6. **Copiez l'URL Web App** qui apparaît (elle ressemble à : `https://script.google.com/macros/s/AKfycbz.../exec`)

### 4. Configurer l'URL dans votre projet Next.js

#### En local

1. Créez un fichier `.env.local` à la racine du projet `semi-quais-seine`
2. Ajoutez cette ligne en remplaçant par votre URL :
```
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/VOTRE_ID_DE_SCRIPT/exec
```

#### Sur Vercel (après déploiement)

1. Allez sur https://vercel.com/
2. Sélectionnez votre projet
3. Allez dans **Settings** > **Environment Variables**
4. Ajoutez une nouvelle variable :
   - **Name** : `GOOGLE_SCRIPT_URL`
   - **Value** : L'URL de votre Web App (copiée à l'étape 3.6)
   - **Environment** : Sélectionnez "Production", "Preview" et "Development"
5. Cliquez sur **Save**
6. **Redéployez votre site** pour que la variable soit prise en compte

### 5. Tester la configuration

1. Lancez votre site en local : `npm run dev`
2. Essayez de soumettre un email via le formulaire
3. Vérifiez que l'email apparaît dans votre Google Sheet

## Dépannage

### Erreur "Configuration manquante"
- Vérifiez que vous avez bien créé le fichier `.env.local` avec la variable `GOOGLE_SCRIPT_URL`
- Vérifiez que l'URL est correcte et se termine par `/exec`

### Les emails n'arrivent pas dans le Sheet
1. Vérifiez que le script Apps Script est bien déployé
2. Vérifiez que vous avez autorisé l'accès lors du déploiement
3. Testez le script directement dans Apps Script avec la fonction `testDoPost()`
4. Vérifiez que les colonnes de votre Sheet sont bien nommées `email` et `date`

### Erreur CORS
- Cette méthode ne devrait pas avoir de problèmes CORS car Google Apps Script les gère automatiquement

### Je veux redéployer après avoir modifié le script
1. Retournez dans Apps Script
2. Cliquez sur **Déployer** > **Gérer les déploiements**
3. Cliquez sur l'icône **✏️** du déploiement existant
4. Changez la version en **Nouvelle version**
5. Cliquez sur **Déployer**
6. L'URL reste la même, pas besoin de la changer dans vos variables d'environnement

## Sécurité

- Les emails sont stockés uniquement dans votre Google Sheet privé
- Personne d'autre que vous ne peut voir les emails collectés
- Le script ne peut être modifié que par vous
- Seule l'opération d'ajout d'email est possible via l'API publique

## Alternative : Service Account (plus complexe)

Si vous préférez utiliser un Service Account au lieu de Google Apps Script, consultez la documentation Google Sheets API : https://developers.google.com/sheets/api/guides/authorizing

Cette méthode nécessite :
- Créer un projet Google Cloud
- Activer l'API Google Sheets
- Créer un Service Account
- Télécharger la clé JSON
- Configurer les credentials dans votre projet Next.js
- Installer le package npm `googleapis`

La méthode Apps Script recommandée ci-dessus est beaucoup plus simple et suffit pour ce cas d'usage.
