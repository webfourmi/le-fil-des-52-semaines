# Reprendre un cours — V0.9.6

Dans le cours, un bouton propose de commencer, de reprendre à la première étape non cochée ou d’aller à la validation quand toutes les étapes sont cochées. Un cours déjà validé peut être relu depuis sa première étape. Le défilement et le focus visent l’étape, sans cocher la case automatiquement.

L’accueil conserve ses boutons compacts Cours / Patchwork. Si un cours est commencé, son bouton et sa carte reprennent la première étape ouverte. La carte indique le nombre d’étapes cochées sur le total.

Le compteur utilise uniquement les identifiants d’étapes du cours concerné et du profil courant. Cela corrige aussi le compteur du cours 1, qui comptait auparavant les étapes des autres semaines. Le premier trou est repris même si des étapes ultérieures sont cochées.

La reprise est calculée à partir des coches existantes : aucun nouvel état de sauvegarde, aucune migration et aucune validation automatique de l’ouvrage. Les cours non publiés n’ont pas de bouton de reprise. Le mode hors connexion utilise les mêmes données locales et les éditions en cache. Shell PWA V0.9.6.

Le nouveau test course-resume.cjs est ajouté à la CI : démarrage, étapes non consécutives, comptage isolé, focus et visibilité à 320 px, reprise depuis l’accueil, validation distincte, relecture, semaine non publiée, profils séparés et rechargement hors connexion.
