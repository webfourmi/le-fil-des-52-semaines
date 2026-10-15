# V0.4 · Galerie locale et Google Drive manuel

Cette proposition se base sur la V0.3 (PR n° 1), sans connexion Google et sans frais.

## Pour chaque couturière
- Le site GitHub Pages partage les 52 cours, les patrons et les articles culturels.
- Lors du premier lancement, chaque appareil choisit **Moi** ou **Mathilde**.
- Le journal et les cases cochées restent individuels dans le navigateur.
- Chaque semaine accueille **une photo du projet et une du bloc patchwork** (deux emplacements, soit jusqu'à 104 photos par personne).
- Formats image JPEG, PNG, WebP ; maximum 12 Mo en entrée. Les photos sont redimensionnées à 960 pixels côté long et compressées en JPEG.
- Les photos sont stockées en **IndexedDB local**, pas sur GitHub ni dans Google Cloud.

## Sauvegarder gratuitement dans Google Drive
1. Dans l'application, ouvrir **Mon journal → Sauvegarder mon journal**.
2. Cliquer sur **Télécharger ma sauvegarde**.
3. Depuis le téléphone ou l'ordinateur, ouvrir [drive.google.com](https://drive.google.com/) ou l'application Google Drive.
4. Déposer le fichier `fil52-m-AAAA-MM-JJ.json` ou `fil52-f-AAAA-MM-JJ.json` dans un dossier privé « Couture ».
5. Pour restaurer depuis un autre appareil, télécharger le fichier de son propre Drive puis choisir **Restaurer mon carnet**.

Le fichier JSON V0.4 rassemble la progression du profil, les notes et les photos en données intégrées (format base64). La limite est d'environ 52 Mo. **Ne pas téléverser ce fichier sur le dépôt GitHub public.**

## Précautions
- **Pas de synchronisation automatique.** Tout se fait manuellement et individuellement.
- **Pas d'authentification** : deux personnes partageant le même navigateur ne bénéficient pas d'une isolation sécurisée. Utiliser des appareils/profils de navigateur séparés.
- Les photos sont enregistrées localement. Un effacement des données du site les supprime ; exporter régulièrement.
- Les restaurations du nouveau format remplacent le carnet et les photos du profil correspondant après confirmation. Les anciennes sauvegardes V0.3 (schéma 2, sans photos) sont acceptées, et conservent les photos présentes.
- La qualité de l'image est réduite pour limiter le poids des sauvegardes.
- Les photos des créations personnelles ne sont **jamais publiées** ni envoyées à Google automatiquement.

## Vérifications déjà effectuées
- Syntaxe des scripts HTML, sauvegarde et galerie : OK.
- Export/import du profil et des photos, refus du mauvais profil : OK.
- Compatibilité ancienne sauvegarde schéma 2 : OK.
- Il reste à valider le rendu visuel, le stockage IndexedDB et les sélecteurs photo dans un navigateur réel, ainsi que le comportement d'une sauvegarde volumineuse sur mobile.

## Branches GitHub
Cette fonctionnalité est proposée dans `feat/v0-4-galerie-locale-drive-manuel`, construite à partir de `feat/v0-3-sauvegarde-restauration`. Elle remplace la proposition OAuth V0.4 (PR n° 2), qui ne doit pas être fusionnée.
