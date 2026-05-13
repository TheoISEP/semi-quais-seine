# 🔧 Correction de l'intégration Google Sheets

## ⚠️ Problème identifié

Les emails ne s'enregistrent pas car le Google Apps Script n'est **pas correctement déployé comme Application Web**. Le test montre "Page introuvable".

## ✅ Solution (10 minutes)

### Étape 1: Ouvrir votre Google Sheet

1. Ouvrez ce lien:
   **https://docs.google.com/spreadsheets/d/193KW5PnrJKBorrbkyLDyxgj_QMz3DgcY8JbmImRBZXg/edit**

2. Vérifiez que votre Sheet a ces colonnes en ligne 1:
   - Colonne A: `email`
   - Colonne B: `date`

### Étape 2: Ouvrir Apps Script

1. Dans le menu du Sheet, cliquez sur **Extensions** > **Apps Script**
2. Une nouvelle fenêtre s'ouvre avec l'éditeur de code

### Étape 3: Vérifier/Ajouter le code

**Si le code existe déjà:** Passez à l'étape 4

**Si l'éditeur est vide:** Copiez-collez exactement ce code:

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
```

3. **Enregistrez** en cliquant sur l'icône 💾 ou `Cmd+S`
4. Nommez le projet: "Email Collection API"

### Étape 4: 🔑 DÉPLOYER comme Application Web (CRUCIAL!)

**C'est l'étape la plus importante!**

1. Dans l'éditeur Apps Script, cliquez sur **Déployer** (bouton bleu en haut à droite)

2. Dans le menu déroulant, cliquez sur **Nouveau déploiement**

3. **À côté de "Sélectionner un type"**, cliquez sur l'icône **⚙️ (roue dentée)**

4. Dans le menu qui s'ouvre, sélectionnez **Application Web**

5. **Configurez EXACTEMENT comme ceci:**
   - **Description**: "Email Collection API" (ou ce que vous voulez)
   - **Exécuter en tant que**: Sélectionnez **Moi (votre-email@gmail.com)**
   - **Qui a accès**: Sélectionnez **Tout le monde** ⚠️ **TRÈS IMPORTANT!**

6. Cliquez sur **Déployer**

7. **Si c'est votre première fois:**
   - Une popup "Autorisation requise" apparaît
   - Cliquez sur **Autoriser l'accès**
   - Sélectionnez votre compte Google
   - Vous verrez un avertissement "Google n'a pas validé cette application"
   - Cliquez sur **Avancé**
   - Cliquez sur **Accéder à Email Collection API (non sécurisé)**
   - Cliquez sur **Autoriser**

8. **COPIEZ L'URL COMPLÈTE** qui apparaît
   - Elle ressemble à: `https://script.google.com/macros/s/AKfycby...xyz/exec`
   - ⚠️ L'URL doit se terminer par `/exec`

### Étape 5: Mettre à jour l'URL

**Option A: Si vous avez déjà déployé sur Vercel**

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet `semi-quais-seine`
3. Allez dans **Settings** > **Environment Variables**
4. Trouvez `GOOGLE_SCRIPT_URL`
5. Cliquez sur les **3 points** à droite > **Edit**
6. Collez la **nouvelle URL** que vous avez copiée
7. Cliquez sur **Save**
8. Allez dans **Deployments** > Cliquez sur les **3 points** du dernier déploiement > **Redeploy**

**Option B: En local**

1. Ouvrez `.env.local`
2. Remplacez l'URL par la nouvelle:
   ```
   GOOGLE_SCRIPT_URL=VOTRE_NOUVELLE_URL_ICI
   ```
3. Enregistrez
4. Redémarrez `npm run dev`

### Étape 6: 🧪 Tester

**Test en ligne de commande:**

```bash
node test-google-sheets.js
```

Vous devriez voir:
```
✅ Test réussi! L'email a été envoyé vers Google Sheets.
```

**Test sur le site:**

1. Ouvrez votre site (local ou Vercel)
2. Entrez un email de test
3. Cliquez sur "Être informé"
4. Vérifiez votre Google Sheet - le nouvel email doit apparaître!

---

## 🐛 Si ça ne marche toujours pas

### Vérification 1: Le déploiement est-il correct?

1. Dans Apps Script, cliquez sur **Déployer** > **Gérer les déploiements**
2. Vous devriez voir un déploiement avec:
   - **Type**: Application Web
   - **Version**: Active
   - **Qui a accès**: Tout le monde

**Si vous ne voyez rien ou si c'est différent:**
- Recommencez l'Étape 4 depuis le début
- Assurez-vous de sélectionner **"Tout le monde"** pour "Qui a accès"

### Vérification 2: Testez directement le script

Dans Apps Script:
1. Ajoutez cette fonction de test:

```javascript
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

2. Sélectionnez `testDoPost` dans le menu déroulant en haut
3. Cliquez sur **▶️ Exécuter**
4. Vérifiez que "test@example.com" apparaît dans votre Sheet

### Vérification 3: L'URL est-elle correcte?

L'URL doit:
- ✅ Commencer par `https://script.google.com/macros/s/`
- ✅ Se terminer par `/exec`
- ✅ Être celle du déploiement "Application Web", pas celle de l'éditeur

---

## 📞 En cas de problème

Si après avoir suivi toutes ces étapes ça ne fonctionne toujours pas:

1. **Vérifiez les logs Vercel:**
   - Allez dans votre projet Vercel > Functions
   - Cherchez les erreurs de la fonction API `/api/subscribe`

2. **Testez l'URL directement:**
   - Dans votre terminal:
   ```bash
   node test-google-sheets.js
   ```
   - Si vous voyez "Page introuvable", le déploiement Apps Script n'est pas bon

3. **Recommencez depuis le début:**
   - Supprimez tous les déploiements dans Apps Script
   - Créez un nouveau déploiement en suivant **exactement** l'Étape 4

---

## ✅ Checklist finale

- [ ] Le Sheet a les colonnes `email` et `date` en ligne 1
- [ ] Le code Apps Script est copié et enregistré
- [ ] Un déploiement "Application Web" existe
- [ ] "Qui a accès" est défini sur "Tout le monde"
- [ ] L'URL du déploiement se termine par `/exec`
- [ ] L'URL est mise à jour dans `.env.local` ou Vercel
- [ ] Le test `node test-google-sheets.js` fonctionne
- [ ] Un email de test apparaît dans le Sheet

Une fois tous les ✅ cochés, votre intégration Google Sheets fonctionne! 🎉
