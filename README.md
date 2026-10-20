# De fil en aiguille · V1.1.8

Application de couture et patchwork organisée en **52 projets sans calendrier imposé** : projets de récupération, apprentissage de la **Janome Cherry 21**, patronnerie, 52 blocs de patchwork par personne, et rubriques culturelles documentées.

## Nouveauté V1.1.9 : patrons arrondis et Halloween à la main

- Le **cours 2** reste en cours d’écriture. Son dessous de verre réversible est désormais à **coins arrondis**, avec deux faces différentes, un patron vectoriel A4 de 12 × 12 cm, marge de 1 cm et encoches en V sur les courbes. Fiche : `assets/cours-02-patron-arrondis.html`. Les 7 cases d’étapes existantes restent les mêmes.
- L’atelier **Halloween, sac à bonbons** ajoute un visage corrigé et symétrique sur la citrouille, des éléments noirs séparés sur `assets/halloween-patrons.html`, et un parcours au choix **machine ou entièrement à la main**, avec schéma et explications du point de feston apparent, et point arrière pour les assemblages résistants.
- PWA cache `fil52-shell-v1.1.9`.

## Publications libres et validation éditoriale

L'application **n'impose aucune périodicité**. Les 52 emplacements numérotés de couture et patchwork restent accessibles comme structure pédagogique, mais de nouveaux articles et ateliers spéciaux peuvent être ajoutés à tout moment, une fois approuvés.

Statut éditorial **validé à 100 %** par la responsable du projet :
- **Couture** : cours 0 (prise en main de la machine), cours 1 (marque-page).
- **Patchwork** : cours 0 (préparation des fournitures).
- **Voyage → Histoire** : fiche n°1 sur l'aiguille à chas.
- **Voyage → Monde** : les trois articles Japon (sashiko/boro), Bengale (kantha), Corée (bojagi/jogakbo), ainsi que **États-Unis : Halloween, citrouilles, tissus et quilts**.

**Tous les autres cours** portent le statut « En cours d’écriture ». Les brouillons consultables ne sont pas annoncés comme finalisés. Le statut éditorial ne modifie jamais les coches personnelles de Viera et Mathilde.

### Voyage spécial Halloween

L'article consacré aux États-Unis comprend une partie documentaire, quatre reproductions historiques issues des collections de Wikimedia Commons/Met/archives américaines, les crédits et liens de provenance, et trois ateliers **facultatifs** : sac à bonbons, mini-quilt décoratif de 20 × 20 cm et guirlande de trois fanions.

Les patrons sont accessibles via `assets/halloween-patrons.html`, **quatre pages SVG A4** à imprimer à 100 %, carré témoin de 5 × 5 cm et fanion de 16 × 19 cm. Ils ne remplacent aucun bloc obligatoire des deux couvertures.

## Deux maisons, les mêmes cours

Le site GitHub Pages partage **les mêmes contenus pédagogiques** : cours, patrons, fiches techniques, articles historiques et photos patrimoniales sourcées.

Au premier lancement sur un navigateur, choisir **Moi** ou **Mathilde**. Le choix est conservé localement. L'interface permet ensuite d'éditer **uniquement le parcours choisi**. Chaque personne dispose de son propre journal, de ses coches et de sa couverture de 52 blocs.

**Attention :** ce choix n'est pas une authentification. L'application ne crée pas encore de comptes, n'isole pas cryptographiquement les données, et ne synchronise pas les appareils. Utiliser deux navigateurs/appareils distincts pour les deux couturières.

## V0.3 : journal personnel et sauvegarde individuelle

- **Mon journal :** projet du numéro terminé, bloc terminé, difficulté de 1 à 5, notes par numéro.
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
- Les numéros restant à publier sont un programme prévisionnel : les tutoriels et fiches documentées ne seront disponibles que lorsqu'ils auront été ajoutés.

## Crédits des photographies documentaires du n° 01

- `Aiguille os 246.1 Global.jpg` : Didier Descouens, CC BY-SA 4.0, Muséum de Toulouse.
- `Boro textile from Japan, with sashiko.jpg` : Karl Zetterström / Statens museer för världskultur, CC BY 4.0.
- `Sashiko by volunteers, 2012 - Textile Museum of Canada` : Daderot, CC0.
