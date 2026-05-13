#!/usr/bin/env node

/**
 * Script de test pour vérifier l'intégration Google Sheets
 * Usage: node test-google-sheets.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load environment variables
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ Fichier .env.local non trouvé');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const scriptUrlMatch = envContent.match(/GOOGLE_SCRIPT_URL=(.+)/);

if (!scriptUrlMatch) {
  console.error('❌ GOOGLE_SCRIPT_URL non trouvé dans .env.local');
  process.exit(1);
}

const scriptUrl = scriptUrlMatch[1].trim();
console.log('🔍 URL du script:', scriptUrl);

// Test data
const testEmail = `test-${Date.now()}@example.com`;
const testData = JSON.stringify({
  email: testEmail,
  date: new Date().toISOString()
});

console.log('\n📧 Envoi d\'un email de test:', testEmail);
console.log('⏳ En attente de la réponse...\n');

function makeRequest(url, data, redirectCount = 0) {
  if (redirectCount > 5) {
    console.error('\n❌ Trop de redirections');
    process.exit(1);
  }

  const parsedUrl = new URL(url);
  const options = {
    hostname: parsedUrl.hostname,
    path: parsedUrl.pathname + parsedUrl.search,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };

  const req = https.request(options, (res) => {
    let responseData = '';

    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      if (redirectCount === 0) {
        console.log('📊 Status code:', res.statusCode);
      }

      // Handle redirects
      if (res.statusCode === 302 || res.statusCode === 301) {
        const location = res.headers.location;
        if (location) {
          if (redirectCount === 0) {
            console.log('🔄 Suivi de la redirection...\n');
          }
          makeRequest(location, data, redirectCount + 1);
          return;
        }
      }

      console.log('📝 Réponse:', responseData);

      if (res.statusCode >= 200 && res.statusCode < 300) {
        console.log('\n✅ Test réussi! L\'email a été envoyé vers Google Sheets.');
        console.log('🔍 Vérifiez votre Google Sheet pour confirmer que l\'email est bien enregistré:');
        console.log('   https://docs.google.com/spreadsheets/d/193KW5PnrJKBorrbkyLDyxgj_QMz3DgcY8JbmImRBZXg/edit');
      } else {
        console.log('\n⚠️  Le serveur a répondu mais avec un code d\'erreur.');
        console.log('Vérifiez que le Google Apps Script est bien déployé et accessible.');
      }
    });
  });

  req.on('error', (error) => {
    console.error('\n❌ Erreur lors de l\'envoi:', error.message);
    console.log('\nVérifiez:');
    console.log('1. Que l\'URL du script est correcte dans .env.local');
    console.log('2. Que le Google Apps Script est bien déployé');
    console.log('3. Que vous avez autorisé l\'accès lors du déploiement');
    process.exit(1);
  });

  req.write(data);
  req.end();
}

makeRequest(scriptUrl, testData);
