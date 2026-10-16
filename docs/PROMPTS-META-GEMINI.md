# Prompts Gemini — visuels Meta (Instagram / Facebook) du Semi des Quais de Seine

12 prompts (10 principaux + 2 bonus), inspirés des pubs relevées sur Instagram (Voies Royales de Saint-Denis, Run in Lyon, Finishers, Genève Marathon, ASICS). Objectif : des visuels qui ressemblent à de la **vraie photo de course officielle**, pas à de l'IA, avec la marque « Semi des Quais de Seine » visible et des bords de Seine reconnaissables.

## Comment s'en servir dans Gemini

1. Ouvrir Gemini, mode création d'image (Nano Banana / « Créer une image »).
2. **Joindre `public/images/logofull.png`** à chaque conversation et écrire en tête : *« Use the attached logo exactly as it is (same shape, colors and text); never redraw it. »*
3. Coller le **bloc commun** ci-dessous, puis **un** prompt. Un prompt par conversation, sinon Gemini mélange.
4. Demander ensuite des variantes sans tout recommencer : *« Same image, replace the headline with … »*, *« Same scene, make it a 4:5 feed version »*, *« Less saturation, more overcast »*.
5. Les prompts sont en anglais (les modèles d'image sont nettement meilleurs en anglais) ; les textes à afficher sont en français entre guillemets, avec les accents. Vérifier chaque lettre du texte généré : si une lettre est fausse, relancer avec *« Fix the text: it must read exactly “…” »*.
6. **Astuce pro** : générer la photo **sans texte** (supprimer le paragraphe « Text overlay ») puis poser le texte dans Canva/Figma avec la vraie police Bebas Neue + Inter. Résultat plus propre, texte modifiable, et une seule photo sert pour 5 déclinaisons.

Formats : Story / Reel = **9:16 (1080 × 1920)**, Feed = **4:5 (1080 × 1350)**, carré = 1:1. Laisser 250 px libres en haut et 300 px en bas sur les stories (interface Instagram + bouton « S'inscrire »).

---

## Bloc commun (à coller avant chaque prompt)

```
BRAND — Event: "Le Semi des Quais de Seine", first edition, Sunday 28 February 2027, half-marathon (21.1 km) and 10 km. Course: start at the Houilles – Carrières-sur-Seine train station (west of Paris), then entirely along the banks of the Seine river, finish at the brand-new Seine Parisii marina in Cormeilles-en-Parisis. Brand colors: deep navy #0A2540, gold #C5A572, Seine blue #3498DB, white. Use the attached round logo exactly as provided whenever a logo is requested.

PHOTO REALISM — This must look like a real frame from an official race photographer, not an AI render and not a stock photo. Shot on a Canon EOS R5, 70-200 mm f/2.8 at f/2.8, 1/1600 s, ISO 400, natural light only. Season: late February in Île-de-France — low cool winter sun or soft overcast, bare plane trees, breath mist, runners in long sleeves, gloves, arm warmers, tights. Real amateur runners of mixed ages, body types and ethnicities, imperfect form, visible skin texture, sweat, a few headphones and watches; nobody is a model. Race infrastructure: metal crowd barriers with navy banners reading "SEMI DES QUAIS DE SEINE", white race bibs with a 4-digit number and the words "SEMI DES QUAIS DE SEINE", timing mats, inflatable navy start/finish arch, navy and gold event flags, volunteers in hi-vis vests. Scenery: Seine towpath (chemin de halage) with a low stone quay wall, moored barges (péniches), grey-blue water, villas and winter trees on the far bank. Slight natural motion blur in the background, mild film grain, neutral color grading, no HDR, no oversaturation, no perfect symmetry, no extra fingers or distorted limbs, no gibberish text anywhere except the text specified below.
```

---

## 1. Story « Rendez-vous le 28 février » (réf. Voies Royales – coureuse qui s'étire)

Usage : story sponsorisée de notoriété, dès maintenant.

```
Vertical 9:16 story. A woman in her thirties, black cap, ponytail, black long-sleeve top with navy arm sleeves, stretching her quad while holding a crowd barrier, seen from the side, looking away toward the river. The barrier carries a navy banner with the gold words "SEMI DES QUAIS DE SEINE". Behind her, slightly out of focus: the Seine towpath, a moored barge, bare plane trees, a few runners warming up, a navy inflatable arch reading "DÉPART". Cool early-morning light, long shadows.
Text overlay: a translucent light-lavender-to-white rounded band in the top third with bold condensed navy capitals on two lines "RENDEZ-VOUS LE 28 FÉVRIER" / "SUR LES QUAIS DE SEINE", and beneath the band, smaller navy capitals "SEMI-MARATHON · 10 KM". Place the attached logo small at the bottom center, above the free zone reserved for the Instagram "S'inscrire" button. Keep the top 250 px and bottom 300 px free of important content.
```

## 2. Feed « Votre défi de l'hiver » (réf. Voies Royales – post feed)

Usage : post sponsorisé feed, acquisition.

```
Vertical 4:5 feed post. Tight telephoto frame on a focused female runner in her late twenties, dark singlet over a long-sleeve base layer, white bib reading "SEMI DES QUAIS DE SEINE 4210", mid-stride on the asphalt towpath along the Seine, three or four other runners softly blurred around her, grey-blue river and a barge in the background, soft overcast winter light.
Text overlay: across the lower third, a solid band in Seine blue #3498DB at 90% opacity with white bold condensed capitals on three lines: "VOTRE DÉFI DE L'HIVER !" / "SEMI-MARATHON · 10 KM" / "28 FÉVRIER · QUAIS DE SEINE". Below the band, on the photo, the attached logo centered at about 20% of the width. Nothing else written.
```

## 3. Story « Dernière ligne droite pour s'inscrire » (réf. ruban d'arrivée)

Usage : dernières semaines avant la fermeture des inscriptions.

```
Vertical 9:16 story. A smiling man in his twenties, white and navy singlet, bib "SEMI DES QUAIS DE SEINE 0001", breaking a navy-and-gold finish tape that reads "SEMI DES QUAIS DE SEINE" at the Seine Parisii marina in Cormeilles-en-Parisis: behind him, slightly blurred, wooden pontoons with moored motorboats and sailboats, a modern capitainerie building, the Seine and bare trees. An inflatable navy arch reading "ARRIVÉE" frames the scene, spectators clapping behind barriers, a race photographer kneeling on the left. Crisp winter sunlight.
Text overlay: a translucent navy band across the lower third with white bold condensed capitals "DERNIÈRE LIGNE DROITE POUR S'INSCRIRE", then smaller gold capitals "SEMI-MARATHON · 10 KM" and white "28 FÉVRIER · HOUILLES → CORMEILLES-EN-PARISIS". The attached logo top-right, small. Top 250 px and bottom 300 px free.
```

## 4. Story « Semi-marathon – 21,1 km » (réf. ligne de départ + badges)

Usage : story « produit » pour le semi (dupliquer pour le 10 km).

```
Vertical 9:16 story. Start line moment: a dense front row of runners waiting, hands clasped, eyes forward, breath mist in the cold air. Center: a tall man with a short beard, black singlet, black arm sleeve, yellow digital watch, bib "SEMI DES QUAIS DE SEINE 0322"; around him runners in navy, orange and grey kit. Background: the forecourt of a suburban Paris train station (red-brick and stone façade, "GARE" signage without readable name), navy event flags, a volunteer in a hi-vis vest, low winter sun from the left.
Text overlay: lower half, left-aligned over a navy-to-transparent gradient: Seine-blue bold condensed capitals "SEMI-MARATHON – 21,1 KM", then lavender-white capitals "DIMANCHE 28 FÉVRIER 2027" / "HOUILLES → CORMEILLES-EN-PARISIS". Bottom right: the attached logo as a round badge, next to a second round badge in gold reading "1ÈRE ÉDITION". Keep the bottom 300 px free for the link button.
```

## 5. Feed « Inscriptions ouvertes » – peloton sur le pont (réf. Run in Lyon)

Usage : annonce d'ouverture des inscriptions, feed + story.

```
Vertical 4:5 feed post, wide 35 mm frame from a slightly elevated position on a modern concrete bridge crossing the Seine. A happy pack of about thirty runners coming toward the camera, several waving and smiling, mixed ages, mostly in navy event t-shirts with a small gold logo on the chest, some in their own colorful kit, bibs "SEMI DES QUAIS DE SEINE" with numbers, crowd barriers on both sides, the grey-blue Seine, bare winter trees and suburban houses behind. Overcast bright winter light, documentary feel.
Text overlay: in the upper third, a white rounded card with a navy border containing the attached logo on the left and, on the right, navy bold condensed capitals "INSCRIPTIONS OUVERTES" with a thin gold line and small navy text "semiquaisdeseine.fr". Nothing else written.
```

## 6. Story « Départ massif » style fiche course (réf. Finishers)

Usage : story sponsorisée type annuaire de courses.

```
Vertical 9:16 story. Wide shot of a dense mass start seen from a slightly elevated angle: two hundred runners filling the road between crowd barriers, most in navy event t-shirts with a gold logo, a few in orange and green, bibs "SEMI DES QUAIS DE SEINE", start arch in the background, suburban French street with a brasserie awning and plane trees, cold morning light, breath mist, a photographer on a ladder on the right. Documentary, slightly grainy, real.
Text overlay in the top third, centered, like a race-listing card: a small Seine-blue rounded label "ROUTE", then orange-gold small capitals "DIM. 28 FÉVRIER 2027" followed by white "– HOUILLES → CORMEILLES (FRANCE)", then very large white bold condensed capitals on two lines "SEMI DES QUAIS" / "DE SEINE 2027". The attached logo small at the very top center. Darken the photo slightly behind the text with a navy gradient. Bottom 300 px free.
```

## 7. Story « Votre prochain semi vous attend » – médaille (réf. Genève Marathon)

Usage : story émotion / finisher, pour les hésitants.

```
Vertical 9:16 story. Close-up on a finisher medal held up to the camera by a smiling woman in her forties, face softly out of focus behind the medal, pink long-sleeve top, finisher area with barriers and the Seine marina blurred behind. The medal is the hero, sharp: round, heavy, navy enamel and brushed gold, embossed Seine waves, a bridge silhouette and two runners, the words "SEMI DES QUAIS DE SEINE" around the rim and "1ÈRE ÉDITION · 2027" at the bottom, on a navy ribbon with gold "SEMI DES QUAIS DE SEINE" repeated. Natural winter daylight, shallow depth of field.
Text overlay: centered in the middle third, white bold condensed capitals on three lines "VOTRE PROCHAIN" / "SEMI-MARATHON" (this line on a solid Seine-blue block) / "VOUS ATTEND SUR LES QUAIS DE SEINE", then a smaller white line on a navy block "Les inscriptions sont ouvertes." Small white URL "semiquaisdeseine.fr" below. Attached logo top center. Bottom 300 px free.
```

## 8. Feed « Tarif de lancement – 500 premiers dossards » (réf. ASICS poster encadré)

Usage : annonce des paliers de prix.

```
Vertical 4:5 feed post with an editorial poster look: the photo sits inside a thin gold frame with a white margin, like a printed poster. Photo: a single male runner in his thirties, navy singlet over a white long-sleeve, bib "SEMI DES QUAIS DE SEINE 0500", running left to right on the Seine towpath, a low stone quay wall and a long moored barge behind him, bare plane trees in a row, soft golden winter sunrise, long shadow on the asphalt. Side-on telephoto shot, tack sharp on the runner.
Text overlay: at the bottom of the frame a solid navy block with gold bold condensed capitals "TARIF DE LANCEMENT" and white text on two lines "Les 500 premiers dossards à prix réduit" / "Semi-marathon · 10 km · 28 février 2027". Inside the top margin, the attached logo centered, small. Vertical small gold caption on the left edge reading "SEMI DES QUAIS DE SEINE" and on the right edge "1ÈRE ÉDITION".
```

## 9. Story « Parcours 100 % bords de Seine » – vue drone

Usage : story parcours, reassurance « plat et rapide ».

```
Vertical 9:16 story. Aerial drone photograph at about 80 m, early winter morning, of a wide bend of the Seine west of Paris: the river grey-blue, a long asphalt towpath along the left bank with a thin line of runners stretching into the distance, moored barges, rows of bare plane trees, suburban villas with gardens, a modern bridge far away, slight morning haze, low sun from the right. Real drone photo look (DJI Mavic 3), natural colors, no HDR.
Text overlay: a thin gold route line drawn along the towpath, with two small navy pins labeled in white capitals "DÉPART · HOUILLES" (far end) and "ARRIVÉE · PORT SEINE PARISII" (near end). Lower third: white bold condensed capitals "21,1 KM · 100 % BORDS DE SEINE" and a second line in gold "PLAT ET RAPIDE". The attached logo top center, small. Bottom 300 px free.
```

## 10. Story « -10 % en pré-inscription » (phase actuelle : collecte d'emails)

Usage : la pub à diffuser **maintenant**, avant l'ouverture des inscriptions.

```
Vertical 9:16 story. Intimate pre-dawn moment: a runner in her thirties crouched on one knee tying her shoe on the Seine quay, black tights, navy jacket, grey beanie, breath mist, phone armband; behind her the river at blue hour with the reflections of quay lamps, a barge, bare trees, the first orange light on the horizon. Shot at 35 mm, shallow depth of field, authentic, quiet, no race infrastructure yet except one navy "SEMI DES QUAIS DE SEINE" flag on the right, slightly out of focus.
Text overlay: upper middle, a rounded translucent white card with navy bold condensed capitals "-10 % SUR VOTRE DOSSARD" (the "-10 %" very large in gold), below it in navy regular text "Laissez votre email, recevez votre code" / "à l'ouverture des inscriptions en novembre". Under the card, small white capitals "SEMI-MARATHON · 10 KM · 28 FÉVRIER 2027". Attached logo bottom center, above the free zone. Bottom 300 px free.
```

---

## Bonus 11. Feed « T-shirt officiel » (visuel produit pour le tunnel d'inscription)

```
Square 1:1 product photo on a plain light-grey studio background, soft daylight from a window: a navy technical running t-shirt laid flat with slight natural wrinkles, small gold round logo (the attached logo) on the left chest, and on the back (shown in a second, smaller inset at the bottom right) the words "SEMI DES QUAIS DE SEINE · 28.02.2027" in gold condensed capitals across the shoulders. Fabric texture visible (micro-mesh polyester), real stitching, a woven size label. No model, no other text.
```

## Bonus 12. Story « UGC selfie » (format Reels / vidéo, image fixe de couverture)

```
Vertical 9:16 story. A smartphone selfie taken by a runner in his forties, grinning, slightly out of breath, sweat on his forehead, navy event t-shirt, bib "SEMI DES QUAIS DE SEINE 1287", finisher medal around his neck, arm extended toward the camera; behind him, friends laughing, the marina pontoons, boats and the Seine, bright winter midday. Phone camera look: wide lens distortion, slight overexposure of the sky, natural skin, not polished.
Text overlay: handwritten-style white sticker text in the upper third "JE L'AI FAIT 🙌" and a plain white Instagram-style text box lower "Rendez-vous le 28 février 2027 · semiquaisdeseine.fr". Attached logo as a small sticker top-left. Bottom 300 px free.
```

---

## Déclinaisons rapides (à demander après une image réussie)

- « Same image, replace the headline with “PLUS QUE 7 JOURS POUR S'INSCRIRE” »
- « Same scene, 10 km version: headline “10 KM DES QUAIS DE SEINE” »
- « Same image, no text at all, I will add the text myself »
- « Make it a 4:5 feed version, keep the same photo »
- « Overcast version, no sun » / « Golden sunrise version »
- « Replace the runner with a man in his fifties » (varier les cibles : 25-35 ans, 35-50 ans, groupes, couples, clubs)

## Ce qui fait « IA » à éviter (à surveiller sur chaque rendu)

Peau lisse et plastique, dents trop parfaites, mains à six doigts, dossards illisibles ou lettres inventées, arbres en feuilles en février, ciel orange saturé partout, symétrie parfaite, foule clonée (mêmes visages répétés), barrières qui fondent, logo redessiné. Si un défaut apparaît : relancer avec « keep everything, fix: … ».
