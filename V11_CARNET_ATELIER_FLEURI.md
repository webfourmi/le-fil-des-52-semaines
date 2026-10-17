# V1.1 · Carnet d’atelier fleuri

## Intention artistique
Un carnet de couture ancien, délicat, romantique et pratique : illustrations florales légères, papier ivoire, bordures en pointillé rappelant une couture, étiquettes de tissu et cartes à effet fiche cartonnée. Le texte reste très lisible et l’esthétique n’ajoute aucun service externe.

## Palette
| Nuance | Couleur | Usage |
|---|---|---|
| Papier écru | `#F7F0E7` | Fond de l’application |
| Ivoire | `#FFFAF3` | Surfaces de lecture |
| Rose poudré | `#D9A5A0` | Fleurs et accents |
| Vert sauge | `#8FA998` | Patchwork et progression |
| Or vieilli | `#B58B59` | Aiguilles et étiquettes |
| Encre velours | `#334F45` | En-têtes et texte sombre |

## Réalisation
1. **Style commun** : feuille `assets/romantic-theme.css` chargée en dernier ; variables d’interface centralisées, boutons harmonisés, contrastes et focus visibles.
2. **Accueil** : hero avec composition végétale dessinée `assets/romantic-botanical.svg`, cartes Couture/Patchwork à cadre de papier et détails coutures ; volet PWA à bordure cousue.
3. **Mes cours** : entête façon cahier, choix de semaine et étiquettes adoucies, étapes numérotées en pastilles, conseils et listes de matériel harmonisés. Schémas et contenus inchangés.
4. **Patchwork** : cadre de couverture façon coton tissé, marquage des blocs et progression conservés.
5. **Journal / Projets persos** : albums et photos sur cartes ivoire, bordures de scrapbooking. Galerie personnelle inchangée.
6. **Voyage textile** : fiches et images encadrées, onglets illustrés sans texte visible (Coutures du monde / Histoire de la couture). Crédit des photos et sources conservés.
7. **PWA** : couleurs mises à jour dans `manifest.webmanifest`, nouveaux fichiers disponibles hors connexion, cache `fil52-shell-v1.1.0`.

## Ergonomie et retenue
- Une seule petite illustration florale sur l’en-tête principal et quelques liserés, sans recouvrir les textes.
- Le texte courant garde sa police sans empattement ; titres Georgia ; aucune police téléchargée.
- Contrastes, indicateurs de focus, cibles tactiles, et option système « réduire les animations » conservés.
- Respect du mode impression, des petits écrans (320 et 390 px) et du mode hors connexion.

## Données protégées
Aucune modification des formats de sauvegarde JSON, de l’IndexedDB, du localStorage, des profils séparés « Moi » et « Mathilde », des images et galeries personnelles ni de la progression. Rien de personnel n’est publié.

## Vérification
`tests/romantic-theme.cjs` : 320, 390, 1440 px ; en-têtes, illustrations, palette, six/huit icônes, rubriques, accès hors ligne, fichiers requis, sans débordement. Captures d’écran accessibles en artefacts du workflow `V1.1 - Carnet d'atelier fleuri`. Réexécuter les CI existantes (PWA, cours, photos, patchwork, sauvegardes).

**Ne fusionner ni publier avant approbation expresse de l’utilisatrice.**
