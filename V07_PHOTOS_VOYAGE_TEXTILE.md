# V0.7 · Photos et Voyage textile

## Projets personnels : plus d'images
- Maximum **20 photographies par projet personnel** au lieu de 6.
- Maximum **100 photos personnelles par carnet** au lieu de 60.
- Jusqu'à 40 projets personnels, inchangé.
- Les photos continuent à être compressées sur le téléphone dans une image JPEG d'au plus environ 420 000 caractères encodés, soit environ 300 Ko avant intégration au JSON.
- Le fichier JSON de sauvegarde reste au **schéma 4**, compatible avec les sauvegardes V0.6. Les images et notes déjà stockées sont conservées. Le plafond de fichier reste 96 Mio, compatible avec les limites ci-dessus et celles de la galerie des 52 cours.
- Les images sont **locales**, jamais automatiquement envoyées vers GitHub ou Google Drive.

## Voyage textile : trois escales en lecture développée
Chaque article comporte une introduction, trois sections historiques et techniques, une galerie légendée, un lexique et un petit atelier pédagogique distinct des techniques traditionnelles authentiques.

### Japon : sashiko et boro
- Distinguer la technique de points avant sashiko des textiles réparés boro.
- Faire le lien entre réparations utilitaires, réemploi, indigo, couches de tissu et pratique contemporaine.
- Trois images : panneau boro (musée suédois), panneau de sashiko au Textile Museum of Canada et veste historique du Metropolitan Museum of Art.
- Recherche historique : [V&A, Japanese boro bag](https://www.vam.ac.uk/articles/make-your-own-japanese-boro-bag).

### Bengale (Inde / Bangladesh) : kantha
- Quilting plat de tissus réemployés, lignes de points avant, motifs narratifs et utilitaires.
- Deux images : quilt du LACMA (domaine public) et broderie photographiée (CC BY-SA 4.0).
- Référence principale : [V&A, Kantha – a South Asian quilting tradition](https://www.vam.ac.uk/articles/kantha-a-south-asian-quilting-tradition).

### Corée : bojagi et jogakbo
- Distinguer tissu d'emballage bojagi de son assemblage de chutes jogakbo.
- Histoire du réemploi pendant Joseon, textiles de soie/ramie, assemblage et effet de transparence.
- Deux images du Metropolitan Museum of Art (CC0).
- Références principales : [V&A, Jogakbo](https://www.vam.ac.uk/articles/jogakbo-traditional-korean-patchwork) et [LACMA, Bojagi](https://unframed.lacma.org/2014/01/02/bojagi-the-korean-wrapping-cloth).

## Photographies et droits
Les sept photographies ont un lien vers leur fiche Wikimedia Commons, leur collection et une mention de licence (CC0, CC BY, CC BY-SA ou domaine public selon la photographie). Le chargement se fait à la demande avec une largeur optimisée et nécessite **Internet** lors de la première consultation ; le texte reste disponible hors connexion après installation.

Aucune photographie privée du journal ne figure dans le dépôt public.

## Tests
- `tests/photo-capacity.cjs` : limite de vingt photos avec refus de la 21e sans perte, rechargement et export JSON contenant vingt images.
- `tests/textile-travel.cjs` : trois articles, sept illustrations avec attribution, textes et exercices, vérification du débordement mobile.
- Régression : `tests/personal-projects.cjs` et `tests/browser-smoke.cjs`, plus la suite PWA déjà en place.
- Ne pas fusionner avant que la CI soit entièrement verte et que l'utilisatrice confirme.
