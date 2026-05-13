# 🔧 Guide complet de configuration Google Sheets

## Étape 1: Ouvrir votre Google Sheet

1. Ouvrez ce lien: https://docs.google.com/spreadsheets/d/193KW5PnrJKBorrbkyLDyxgj_QMz3DgcY8JbmImRBZXg/edit
2. Assurez-vous que la première feuille a ces colonnes en ligne 1:
   - Colonne A: `email`
   - Colonne B: `date`

## Étape 2: Créer le Google Apps Script

1. Dans votre Google Sheet, cliquez sur **Extensions** (en haut) > **Apps Script**
2. Une nouvelle fenêtre s'ouvre avec un éditeur de code
3. **Supprimez tout le code existant** (sélectionnez tout et supprimez)
4. **Copiez-collez exactement ce code**:

```javascript
function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    const email = data.email;
    const date = data.date;

    // Open the spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Check if email already exists (skip header row)
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const existingEmails = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
      const emailExists = existingEmails.some(row => row[0] === email);

      if (emailExists) {
        return ContentService.createTextOutput(
          JSON.stringify({ success: false, message: "Email already exists" })
        ).setMimeType(ContentService.MimeType.JSON);
      }
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

// Test function - you can run this to test
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

5. Cliquez sur l'icône **💾 (Enregistrer)** ou `Ctrl+S` / `Cmd+S`
6. Donnez un nom au projet: "Email Collection API"

## Étape 3: TESTER le script avant de le déployer

1. Dans l'éditeur Apps Script, sélectionnez la fonction `testDoPost` dans le menu déroulant en haut
2. Cliquez sur le bouton **▶️ Exécuter**
3. Si c'est la première fois, une popup apparaît pour autoriser le script:
   - Cliquez sur **Vérifier les autorisations**
   - Sélectionnez votre compte Google
   - Cliquez sur **Avancé**
   - Cliquez sur **Accéder à Email Collection API (non sécurisé)**
   - Cliquez sur **Autoriser**
4. Vérifiez dans votre Google Sheet: vous devriez voir une nouvelle ligne avec "test@example.com"
5. ✅ Si ça fonctionne, passez à l'étape suivante!

## Étape 4: Déployer le script comme Web App

🚨 **IMPORTANT: C'est l'étape critique!**

1. Dans l'éditeur Apps Script, cliquez sur le bouton **Déployer** (en haut à droite) > **Nouveau déploiement**

2. À côté de "Sélectionner un type", cliquez sur l'icône **⚙️ (roue dentée)**

3. Sélectionnez **Application Web**

4. Configurez EXACTEMENT comme ceci:
   - **Description**: "API de collection d'emails" (ou ce que vous voulez)
   - **Exécuter en tant que**: **Moi** (votre email doit apparaître)
   - **Qui a accès**: **Tout le monde** (TRÈS IMPORTANT!)

5. Cliquez sur **Déployer**

6. Une nouvelle popup apparaît avec votre **URL de Web App**
   - L'URL ressemble à: `https://script.google.com/macros/s/AKfycby...xyz/exec`
   - **⚠️ IMPORTANT: Copiez cette URL complète!**

## Étape 5: Mettre à jour votre fichier .env.local

1. Ouvrez le fichier `.env.local` dans le projet `semi-quais-seine`
2. Remplacez la ligne entière par:
```
GOOGLE_SCRIPT_URL=VOTRE_URL_COPIEE_ICI
```
3. **Enregistrez le fichier**

## Étape 6: Tester l'intégration

```bash
# Dans le terminal, depuis le dossier semi-quais-seine
node test-google-sheets.js
```

Vous devriez voir:
```
✅ Test réussi! L'email a été envoyé vers Google Sheets.
```

Vérifiez votre Google Sheet - le nouvel email devrait apparaître!

## 🐛 Problèmes courants

### Erreur "Page introuvable" / "Impossible d'ouvrir le fichier"

**Cause**: Le script n'est PAS déployé comme "Application Web"

**Solution**:
1. Retournez dans Apps Script
2. Cliquez sur **Déployer** > **Gérer les déploiements**
3. Si la liste est vide, refaites l'Étape 4 complètement
4. Si un déploiement existe:
   - Cliquez sur l'icône **✏️ (crayon)**
   - Vérifiez que "Type de déploiement" = **Application Web**
   - Vérifiez que "Qui a accès" = **Tout le monde**
   - Changez la version en **Nouvelle version**
   - Cliquez sur **Déployer**

### Erreur "Configuration manquante"

**Cause**: Le fichier `.env.local` n'a pas la bonne variable

**Solution**:
1. Vérifiez que `.env.local` existe bien dans le dossier `semi-quais-seine`
2. Vérifiez que la ligne commence par `GOOGLE_SCRIPT_URL=`
3. Vérifiez que l'URL se termine par `/exec`

### Erreur 403 / "Non autorisé"

**Cause**: Les permissions ne sont pas correctes

**Solution**:
1. Dans Apps Script, Déployer > Gérer les déploiements
2. Cliquez sur l'icône **✏️ (crayon)**
3. Changez "Qui a accès" en **Tout le monde**
4. Créez une **Nouvelle version**
5. Déployez

### Les emails n'apparaissent pas dans le Sheet

**Cause**: Mauvais nom de colonnes ou mauvaise feuille

**Solution**:
1. Vérifiez que la première ligne de votre Sheet contient exactement: `email` et `date`
2. Vérifiez que vous modifiez bien la première feuille (premier onglet en bas)

## 📝 Notes importantes

- L'URL du déploiement ne change JAMAIS, même si vous modifiez le code
- Si vous modifiez le code, il faut créer une "Nouvelle version" dans "Gérer les déploiements"
- Le script ne peut être modifié que par vous
- Les données sont privées dans votre Google Sheet
- "Tout le monde" peut uniquement AJOUTER des emails via l'API, pas les voir

## ✅ Vérification finale

Après avoir tout configuré, testez depuis le site:

```bash
npm run dev
```

Ouvrez http://localhost:3000 et inscrivez-vous avec votre vrai email.

Vérifiez dans votre Google Sheet que l'email est bien enregistré!
