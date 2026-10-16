# Cours de patchwork repliables — V0.9.9

La page de couverture réunit désormais le cours 0 de préparation et les 52 blocs dans des volets natifs details/summary, accessibles au clavier. Le bloc 1 est ouvert initialement ; les autres se déplient au choix. Les blocs publiés 1 à 6 réutilisent les fiches et galeries existantes. Les suivants indiquent « À venir » sans inventer d’instructions.

Le cours 0 explique les tissus et chutes, la règle et les angles droits, les outils de coupe, le fil et l’aiguille, les épingles, le repassage et le rangement. Il distingue l’indispensable des fournitures de finition qui peuvent attendre, puis rappelle la marge de 7,5 mm et les dimensions de 21,5 cm avant assemblage et 20 cm fini. Il ne crée aucun bloc supplémentaire ni donnée de validation.

Les coches des blocs sont celles de la couverture. L’état ouvert des volets est conservé pendant les rendus et les changements de coche, uniquement en mémoire : aucun changement de sauvegarde. Les raccourcis patchwork de l’accueil ouvrent maintenant la page patchwork, déplient le bon volet et donnent le focus à sa fiche. Les fiches intégrées aux cours couture restent disponibles.

Le chargement des éditions recalcule aussi la page patchwork pour rendre les blocs 2 à 6 accessibles après ouverture ou rechargement hors connexion. Les JS/CSS sont précachés dans le shell V0.9.9.

Tests : patchwork-courses.cjs ajouté à la CI, contrôlant 53 volets (cours 0 et 52 blocs), clavier, six fiches publiées, matériel, conservation des volets ouverts, coches synchronisées, mobile, profils et hors connexion. Les tests des liens d’accueil, des cours et des photos ont été adaptés à l’affichage de plusieurs fiches sur la page.
