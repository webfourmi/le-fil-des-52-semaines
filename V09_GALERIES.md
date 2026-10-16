# V0.9 — étape 1 : galeries pédagogiques

Les six cours publiés possèdent chacun six emplacements : matériel, trois étapes clés, résultat et bloc de patchwork. Aucun fichier photo fictif n’est fourni. Les schémas existants restent disponibles.

Le contenu éditorial commun se trouve dans assets/lesson-photos.js : chaque emplacement possède id, role, caption et image (null tant que la vraie photo manque). Exemple futur : image: {src: './assets/cours/01-materiel.webp', full: './assets/cours/01-materiel-grand.webp', alt: 'Description précise du matériel visible', width: 800, height: 600}. full est facultatif ; src sert aussi pour l’agrandissement en son absence. Utiliser des fichiers optimisés locaux WebP/AVIF/JPEG/PNG et des dimensions réelles. Prévoir un texte alternatif précis. Ne pas utiliser les photos du journal personnel.

Pour rendre les futures photos disponibles dès la première installation hors connexion, ajouter leurs chemins dans CORE de sw.js et augmenter CACHE_VERSION. Les ressources consultées sont aussi mises en cache par le mécanisme existant. Une photo absente affiche un message explicite.

La grille conserve deux colonnes sur mobile. Un bouton accessible ouvre les vraies photos dans un dialogue natif : focus contenu, fermeture par Échap ou bouton, retour au bouton d’origine. Aucun bouton sur les emplacements vides.

Aucune migration ni modification du stockage personnel, d’IndexedDB ou du format de sauvegarde. Les nouveaux JS/CSS sont précachés avec le shell V0.9.0. Aucun déploiement ajouté. Cette étape prépare la structure uniquement ; l’intégration de vraies photos reste ultérieure.

Vérification : tests/lesson-photos.cjs avec Playwright et serveur local sur le port 8765. La CI V0.9 exécute aussi les tests des cours, projets personnels et sauvegardes existants. Les autres workflows PWA restent actifs.

Validation locale : les onze scripts de tests (les dix existants et lesson-photos.cjs) passent, y compris Safari WebKit, mise à jour PWA, sous-chemin GitHub Pages et sauvegardes V0.6.
