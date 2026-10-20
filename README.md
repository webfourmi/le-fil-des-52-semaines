# De fil en aiguille · V1.1.8

Application de couture et patchwork organisée en **52 projets sans calendrier imposé** : projets de récupération, apprentissage de la **Janome Cherry 21**, patronnerie, 52 blocs de patchwork par personne, et rubriques culturelles documentées.

## V1.1.13 : journal Couture, Patchwork et Voyage

Le **journal** propose désormais trois onglets en haut : Couture, Patchwork, Voyage, puis un menu déroulant propre à la rubrique. Les 52 projets couture et les 52 blocs patchwork restent distincts ; l'onglet Voyage propose les articles disponibles dans Voyage → Monde et Histoire.

Chaque réalisation dispose de son **album personnel de 1 à 5 photos** (ou aucune tant qu'elle n'est pas photographiée), avec ajout, suppression et bouton « Partager » pour **envoyer une photo choisie via le partage du téléphone ou télécharger une copie**. Ce partage externe ne crée **aucune galerie publique** ni transfert automatique vers le site. Les anciennes photos uniques des cours 1–52 restent visibles dans leur nouvel album.

Le partage permanent **à l'intérieur de l'application entre deux appareils** exigerait des comptes ou invitations, un stockage sécurisé et des permissions explicites. Cette V1.1.13 **ne fournit pas de galerie synchronisée**, afin de ne rendre aucune photo publique par surprise.

Les photos supplémentaires utilisent IndexedDB et les notes séparées Patchwork/Voyage sont conservées localement. La **sauvegarde JSON v6** inclut ces données et accepte les anciennes sauvegardes v2–v5. Les albums et notes de Viera et Mathilde restent indépendants.

## Nouveauté V1.1.12 : cinq vraies photos du marque-page

Le cours **Couture 1** présente désormais cinq photographies authentiques fournies par la créatrice, dans l'ordre : (1) matériel et patron, (2) superposition/épinglage, (3) angles dégarnis, (4) surpiqûre à la Janome Cherry 21, (5) marque-page terminé. Les légendes sont spécifiques à chaque photographie.

Les cinq fichiers WebP légers sont placés dans `assets/cours-01/` et mis en cache hors connexion. Les photos détaillées d'origine sont conservées dans le dossier de préparation de l'utilisatrice ; la galerie publique emploie des versions de prévisualisation légères. Le cours 1 reste **validé à 100 %**, et les photos du patchwork restent dans une galerie distincte.

## Nouveauté V1.1.10 : recherche, consultation des patrons et silhouettes Halloween

- **Couture** et **Patchwork** disposent chacun d'une recherche par mots-clés sans tenir compte des majuscules ni des accents. La recherche figure juste au-dessus du sélecteur des 52 cours ou blocs et affiche des résultats cliquables.
- La bibliothèque **Patrons** propose les 3 ateliers Halloween (sac à bonbons, mini-quilt, guirlande), avec consultation sur place et navigation latérale/inférieure conservée. Une page dédiée peut être ouverte pour imprimer à **100 %**, sans régler l'échelle dans l'aperçu.
- **Chat** redessiné : assis de profil, une silhouette entière à découper, dos arrondi et queue recourbée ; **fantôme** redessiné : tête arrondie, petits bras ouverts, bas ondulé ; yeux et bouche à broder, non à découper.
- **Halloween est « En cours d’écriture »**, mais ses trois ateliers et patrons restent consultables. Japon, Bengale et Corée demeurent validés.
- Cache PWA mis à jour vers `fil52-shell-v1.1.10`.

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
- **Voyage → Monde** : les trois articles Japon (sashiko/boro), Bengale (kantha), Corée (bojagi/jogakbo). **États-Unis : Halloween, citrouilles, tissus et quilts** reste **en cours d’écriture**.

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
