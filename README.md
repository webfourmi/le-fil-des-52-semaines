# Le fil des 52 semaines · V0.3 (proposition)

Application de couture progressive en 52 semaines : projets de récupération, apprentissage de la **Janome Cherry 21**, patronnerie, 52 blocs de patchwork par personne, et rubriques culturelles documentées.

## Deux maisons, les mêmes cours

Le site GitHub Pages partage **les mêmes contenus pédagogiques** : cours, patrons, fiches techniques, articles historiques et photos patrimoniales sourcées.

Au premier lancement sur un navigateur, choisir **Moi** ou **Mathilde**. Le choix est conservé localement. L'interface permet ensuite d'éditer **uniquement le parcours choisi**. Chaque personne dispose de son propre journal, de ses coches et de sa couverture de 52 blocs.

**Attention :** ce choix n'est pas une authentification. L'application ne crée pas encore de comptes, n'isole pas cryptographiquement les données, et ne synchronise pas les appareils. Utiliser deux navigateurs/appareils distincts pour les deux couturières.

## V0.3 : journal personnel et sauvegarde individuelle

- **Mon journal :** projet de la semaine terminé, bloc terminé, difficulté de 1 à 5, notes par semaine.
- **Sauvegardes :** export JSON du **seul profil choisi**, avec coche des fournitures, étapes, projets, blocs, notes et évaluations.
- **Restauration :** validation du format et de l'identité dans le fichier. Un profil « Moi » ne peut pas importer une sauvegarde « Mathilde », et inversement.
- La restauration **remplace** la progression locale du profil sélectionné. Une confirmation est demandée. Exporter une sauvegarde récente avant de remplacer les données.
- Les fichiers restent sur l'appareil : aucun transfert des progressions à un serveur.
- **Il n'y a pas de synchronisation automatique** : pour changer d'appareil, exporter puis importer son propre fichier.
- Les notes et données peuvent disparaître si le stockage du navigateur est effacé. Les sauvegardes JSON sont donc importantes.

### Contrôles effectués sur la branche

Tests de logique réalisés sur la sauvegarde et une interface simulée : deux identités sur appareils séparés, coches indépendantes, notes sauvegardées après réouverture, sélection de semaine dans le journal, refus de restauration croisée, validation d'entrées incorrectes.

**À faire avant fusion :** essais manuels sur mobile et ordinateur (saisie de notes, boutons, import/export, mise en page, impression des patrons). La PR reste en brouillon tant que ces vérifications ne sont pas terminées.

## Structure

- `index.html` : application interactive responsive et patrons A4 imprimables.
- `assets/backup.js` : validation, export et restauration JSON des parcours personnels.
- `assets/atelier.webp` : illustration d'ambiance (pas une photo historique).
- `data/editions.json` : liste des numéros publiés et contenu des futures éditions.

L'application est hébergée via GitHub Pages à https://webfourmi.github.io/le-fil-des-52-semaines/. Les mises à jour se font par commits et sont publiées après intégration à la branche principale.

## Règles éditoriales permanentes

- **Toutes les listes de fournitures sont pour un seul ouvrage**, et jamais pour les deux personnes ensemble.
- Chaque numéro contient un projet couture et un bloc patchwork progressif, une fiche technique et les gabarits imprimables nécessaires.
- Chaque personne construit sa **propre couverture de 52 blocs**, complétée de quatre carrés unis.
- Les rubriques « Histoire de la couture » et « Coutures du monde » utilisent des sources vérifiées et des photographies documentaires avec crédits et licences.
- Les 51 semaines encore non publiées ne sont pour l'instant qu'un programme prévisionnel, pas des tutoriels détaillés.

## Crédits des photographies documentaires du n° 01

- `Aiguille os 246.1 Global.jpg` : Didier Descouens, CC BY-SA 4.0, Muséum de Toulouse.
- `Boro textile from Japan, with sashiko.jpg` : Karl Zetterström / Statens museer för världskultur, CC BY 4.0.
- `Sashiko by volunteers, 2012 - Textile Museum of Canada` : Daderot, CC0.
