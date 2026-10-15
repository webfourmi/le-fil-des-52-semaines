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

## Points à vérifier
- Test Android Chrome et iOS Safari de l'installation.
- Test réel de la mise à jour du service worker après incrément de sa version.
- Test de nouvelle édition et préservation des notes en cours de saisie.
- Vérification des chemins et du cache sur GitHub Pages, y compris hors ligne.
- Tester les icônes PNG et la proposition d'installation sur Android et iOS.

La branche n'est pas fusionnée.