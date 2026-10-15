# V0.5 · Installation mobile et alertes de mises à jour

## Installation
Le site possède un manifeste PWA, une icône SVG et un service worker. Sur Android, ouvrir dans Chrome et chercher **Installer l'application** ou **Ajouter à l'écran d'accueil** dans le menu. Sur iPhone, ouvrir dans Safari, **Partager → Sur l'écran d'accueil → Ajouter**.

**Icônes disponibles :** SVG, PNG 192 × 192, PNG 512 × 512 et Apple Touch Icon 180 × 180. Leur rendu exact sur iOS et Android doit encore être validé sur un appareil réel. Le bouton d'installation Android n'est affiché que si le navigateur émet `beforeinstallprompt`. Le guide manuel reste accessible en permanence.

## Mises à jour
- Lorsqu'un nouveau service worker est installé, un bandeau propose **Mettre à jour** et attend une action de l'utilisatrice avant de recharger.
- Lorsqu'une nouvelle édition est détectée dans `data/editions.json`, le bandeau propose d'ouvrir le nouveau cours.
- Les vérifications ont lieu lors de l'ouverture et lorsque l'onglet redevient visible. En l'absence d'Internet, le dernier contenu mis en cache peut être utilisé.
- **Ce ne sont pas des notifications push** : aucune alerte ne sera reçue lorsque l'application est complètement fermée.
- Aucune inscription, aucun serveur et aucune permission de notification ne sont nécessaires.

## Essai sur les deux téléphones (après publication autorisée)
1. Faire une sauvegarde JSON depuis **Sauvegardes** avant toute installation.
2. Ouvrir le site dans Chrome (Android) ou Safari (iPhone), puis **Ajouter à l'écran d'accueil**.
3. Lancer le raccourci installé, choisir le bon carnet et vérifier les notes déjà présentes. Selon le navigateur et le système, une application installée peut utiliser un stockage séparé : **si les notes ne sont pas visibles, réimporter la sauvegarde** au lieu de repartir de zéro.
4. Ajouter une photo d'un ouvrage dans le journal, fermer et rouvrir l'application, puis vérifier la photo.
5. Activer le mode avion. Vérifier l'ouverture des cours déjà consultés, de la galerie et la possibilité de télécharger la sauvegarde. Désactiver le mode avion.
6. Dans l'accueil, utiliser **Vérifier les nouveautés**. Lors d'une future publication, contrôler la proposition de mise à jour et la conservation des notes.

**Important :** effacer les données du site ou désinstaller l'application peut supprimer les notes et photos locales. Les sauvegardes manuelles sur chaque Google Drive restent indispensables.

## Points à vérifier
- Test Android Chrome et iOS Safari de l'installation.
- Test réel de la mise à jour du service worker après incrément de sa version.
- Test de nouvelle édition et préservation des notes en cours de saisie.
- Vérification des chemins et du cache sur GitHub Pages, y compris hors ligne.
- Tester les icônes PNG et la proposition d'installation sur Android et iOS.

La branche n'est pas fusionnée.