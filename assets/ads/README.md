# Visuels Meta — Semi des Quais de Seine

Générés avec Gemini le 16 octobre 2026 à partir de `docs/PROMPTS-META-GEMINI.md` (le numéro dans le nom du fichier = le numéro du prompt). Le prompt 9 (vue drone du parcours) n'a pas été produit ; le bonus 12 (selfie) le remplace.

Ces fichiers sont les **créas sources** pour les campagnes Meta. Ils iront dans la médiathèque de l'admin (S3) en phase 3 ; en attendant, ils vivent ici (pas dans `public/`, ils ne sont pas servis par le site).

| Fichier | Format | Usage |
|---|---|---|
| `story-10-pre-inscription-moins-10.jpg` | Story 9:16 | **À diffuser maintenant** : collecte d'emails (-10 %) avant l'ouverture |
| `story-01-rendez-vous-28-fevrier.jpg` | Story 9:16 | Notoriété, dès maintenant |
| `feed-02-votre-defi-de-l-hiver.jpg` | Feed 4:5 | Acquisition feed |
| `feed-05-inscriptions-ouvertes.jpg` | Feed 4:5 | Jour de l'ouverture des inscriptions |
| `feed-08-tarif-de-lancement.jpg` | Feed 4:5 | Paliers de prix (500 premiers dossards) |
| `story-04-semi-marathon-21km.jpg` | Story 9:16 | Story « produit » semi (à décliner pour le 10 km) |
| `story-06-depart-massif-fiche-course.jpg` | Story 9:16 | Style annuaire de courses |
| `story-07-medaille-prochain-semi.jpg` | Story 9:16 | Émotion / finisher |
| `story-03-derniere-ligne-droite.jpg` | Story 9:16 | Dernières semaines avant fermeture |
| `story-12-ugc-selfie-je-l-ai-fait.jpg` | Story 9:16 | Couverture de Reel / UGC |

## Avant de les mettre en ligne

- **Résolution** : les exports font 768 × 1376 (stories) et 928 × 1152 (feed). Meta recommande 1080 × 1920 et 1080 × 1350. Retélécharger depuis Gemini en taille maximale si possible, sinon agrandir ×1,4 (Gemini « upscale », Photoshop, ou `sips`/`magick`) — à cette taille Meta compresse peu et le rendu reste net.
- **Textes à vérifier** sur chaque visuel : dossards et banderoles lisibles ? Sur `story-06`, l'arche affiche « START » au lieu de « DÉPART » et certains dossards sont illisibles de près (acceptable en story, flou de mouvement) ; sur `story-04`, le texte des dossards est approximatif. Relancer dans Gemini avec « Keep everything, fix the arch text to “DÉPART” » si besoin.
- **Zones libres** : sur les stories, garder le bas pour le bouton « S'inscrire » (déjà prévu sur la plupart).
- Les bibs et le ruban portent bien « SEMI DES QUAIS DE SEINE », le logo est intact : OK pour la marque.
