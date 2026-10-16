# V0.7 · Projets persos et voyage textile

## Fonctionnement
- **Mon journal → Mes projets persos**, aussi accessible depuis l'accueil et la navigation sur ordinateur.
- Chaque personne crée ses **ouvrages hors des 52 cours** : vestes, cadeaux, vêtements, réparations, créations spontanées, etc.
- Chaque projet possède un nom modifiable, des notes et jusqu'à **20 photos** JPEG, PNG ou WebP.
- Jusqu'à **40 projets et 100 photographies** personnelles par appareil et par profil pour protéger le stockage mobile.
- Les photos sont compressées localement (960 px côté long, JPEG), sauvegardées dans IndexedDB et jamais transférées vers GitHub.
- Supprimer une photo ne supprime pas le projet ; supprimer un projet demande confirmation et supprime ses photos.

## Indépendance et sauvegardes
- « Moi » et « Mathilde » ont des listes et albums séparés. Le contenu public de GitHub ne contient pas les créations personnelles.
- Le fichier de sauvegarde JSON **schéma 4** inclut les données des 52 semaines, leurs photos, les projets persos et leurs photos.
- Importer une ancienne sauvegarde V0.4 (schéma 3) ou V0.3 (schéma 2) conserve les projets personnels existants. Le schéma 2 conserve aussi les photos des cours déjà enregistrées.
- Restaurer une sauvegarde V0.6 remplace les projets et photographies personnels **du seul profil choisi**, après confirmation.
- **Toujours conserver le dernier export JSON dans un Google Drive personnel**, surtout avant de vider le cache ou de changer de téléphone.
- Un nouveau service worker V0.6 et un nouveau fichier JS sont nécessaires : attendre la proposition de mise à jour et l'accepter avant d'exporter un carnet V0.6.

## Limites
- Le dossier personnel est un album local, **pas un espace de partage ni un service cloud**.
- 40 projets, 20 photos par projet, 100 photos perso au total. Limite totale de sauvegarde : 96 Mio. Les photographies sont compressées à environ 420 Ko de texte encodé maximum par image.
- Le stockage IndexedDB dépend du navigateur et peut être effacé en cas de suppression des données du site.
- Le nombre de photos a été plafonné pour éviter qu'un carnet contenant les 104 images des 52 cours et les créations libres n'explose la mémoire du téléphone.

## Validation
- Tester ajout de deux photos, notes, rechargement et fonctionnement hors connexion.
- Tester sauvegarde V0.6 et restauration sur un autre navigateur pour le profil « Moi ».
- Tester import ancien V0.4 qui conserve les projets persos, et refus de l'import depuis « Mathilde ».
- Tester suppression indépendante d'une photographie et d'un projet.
- Régression : tests PWA V0.5 et journal des 52 semaines.

Aucune fusion sans approbation explicite.
