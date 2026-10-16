# Accueil suivant la progression — V0.9.3

L’accueil propose le premier cours publié non validé et le premier bloc publié non terminé du profil ouvert. Les deux parcours avancent séparément. La sélection d’une autre semaine ou les coches des étapes ne constituent pas une validation de l’ouvrage.

La validation du cours réutilise projectsDone et la coche « Projet couture terminé » du journal. Cette même case est maintenant accessible en bas des cours publiés. Le patchwork réutilise blocks. Décocher ramène le raccourci au premier élément restant à terminer. Aucun nouveau champ ni migration de sauvegarde.

Les boutons et cartes de l’accueil suivent ces choix ; le raccourci patchwork ouvre la semaine correspondante, fait défiler sa fiche et lui donne le focus. Le bouton Voyage textile et sa carte en doublon ont été retirés du bandeau et des cartes principales ; le globe reste dans la barre de navigation.

Les futurs cours non publiés ne sont jamais proposés comme prochaine réalisation. Quand toutes les éditions disponibles sont terminées, l’accueil donne accès aux cours et à la couverture, avec un message d’attente des prochaines publications. Le chargement des éditions recalcule l’accueil même si le numéro de version était déjà mémorisé. Le service worker passe à V0.9.3.

Tests : home-progress.cjs couvre les validations séparées, le premier cours restant (y compris des validations non consécutives), l’absence d’avancement à la simple coche des étapes, les liens précis, la dévalidation, la fin des cours publiés, le rechargement hors connexion et l’indépendance des profils. Il est ajouté à la CI existante.
