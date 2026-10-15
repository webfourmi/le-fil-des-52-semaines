# Le fil des 52 semaines · V0.2

Application pédagogique de couture, patchwork et histoire textile. Deux parcours personnels : **Moi** et **Mathilde**.

## Site GitHub Pages

1. Créer un dépôt nommé `le-fil-des-52-semaines` (public pour GitHub Pages gratuit).
2. Envoyer **tout le contenu du ZIP** à la racine du dépôt (`index.html`, dossiers `assets/` et `data/`).
3. Dans **Settings > Pages > Build and deployment**, choisir **Deploy from a branch**, `main`, `/ (root)`, puis **Save**.
4. L'adresse sera du type `https://PSEUDO.github.io/le-fil-des-52-semaines/`.

À chaque ajout de cours dans `data/editions.json`, la version publiée se mettra à jour quand GitHub Pages redéploiera. Le site charge les cours du JSON lorsque l'application est ouverte par HTTP(S). Les cours à venir ne s'ajoutent pas automatiquement : il faut rédiger les fiches et les publier.

## Organisation

- `index.html` : application interactive, menus, cours n° 01 et patrons A4 directement imprimables.
- `assets/atelier.webp` : **illustration d'ambiance**, créée pour le projet ; ce n'est pas une photographie documentaire historique.
- `data/editions.json` : fichier de publication des futures semaines ; les champs `materials` doivent toujours décrire **un seul ouvrage**.
- Les photographies culturelles sont référencées depuis Wikimedia Commons, avec attribution et renvois aux fichiers/licences. Elles nécessitent une connexion Internet.

## Points importants

- État local : `localStorage` du navigateur. Les progressions « Moi » et « Mathilde » sont distinctes **sur un même navigateur**, mais il n'existe pas encore de synchronisation entre deux téléphones.
- Les patrons se trouvent dans **Patrons**, avec impression à 100 % (vérifier les carrés de contrôle).
- Les cours n° 02 à 52 affichent actuellement un programme prévisionnel, non pas des leçons déjà rédigées.
- Ne pas mettre de photos personnelles ou d'informations privées dans le dépôt public.
- Il n'y a pas encore d'authentification, de gestion automatique des cours ou de sauvegarde distante.

## Crédits photos documentaires

- *Aiguille os 246.1 Global.jpg*, Didier Descouens, CC BY-SA 4.0, Muséum de Toulouse ; notice Wikimedia Commons.
- *Boro textile from Japan, with sashiko.jpg*, Karl Zetterström / Statens museer för världskultur, CC BY 4.0 ; notice Wikimedia Commons.
- *Sashiko by volunteers, 2012 - Textile Museum of Canada*, Daderot, CC0 ; notice Wikimedia Commons.
