# Google Drive personnel · préparation de la V0.4

Cette branche expérimente un stockage **individuel** dans le Google Drive de chaque couturière. Les leçons restent communes sur GitHub Pages. Elle dépend des changements de la V0.3 (PR n° 1).

## Configuration nécessaire (par la propriétaire du site)

1. Ouvrir [Google Cloud Console](https://console.cloud.google.com/) et créer un projet dédié « Le fil des 52 semaines ».
2. Activer **Google Drive API**.
3. Configurer **Google Auth Platform** (écran de consentement OAuth). Pour une application réservée à deux personnes, configurer l'audience externe en mode test si nécessaire et ajouter les deux comptes aux utilisateurs de test. Vérifier les limites et les conditions de ce mode dans Google Cloud.
4. Créer un **Client OAuth 2.0** de type **Application Web**. Ajouter exactement les origines JavaScript autorisées :
   - `https://webfourmi.github.io`
   - éventuellement `http://localhost:8000` pour tester en local avec un serveur.
5. Ajouter la permission minimale **`https://www.googleapis.com/auth/drive.file`**.
6. Copier **uniquement le Client ID public** dans `config/google.js`. Ne jamais mettre de client secret, mot de passe, jeton ou photo privée dans GitHub.

Cette fonctionnalité ne fonctionne pas tant que le Client ID reste vide. Les actions Google nécessitent une connexion à Internet et un consentement explicite de chaque personne.

## Comportement proposé

- Chacune sélectionne sa propre identité (« Moi » ou « Mathilde ») sur son appareil et utilise **son propre compte Google**.
- Bouton de connexion OAuth Google via Google Identity Services.
- Dossier privé dédié « Le fil des 52 semaines », créé avec l'autorisation `drive.file`.
- Sauvegardes individuelles en JSON **horodatées**, sans suppression ni écrasement automatique des versions précédentes.
- Affichage des dernières sauvegardes du carnet choisi.
- Restauration manuelle, validée et confirmée avant modification de la progression locale.
- Les jetons OAuth sont gardés en mémoire et expirent. Une reconnexion peut être nécessaire à la prochaine visite.
- Le fichier JSON local reste utilisable comme solution de secours.

## Limitations de sécurité et de fonctionnement

Le choix de profil n'est **pas une authentification** : c'est la connexion Google qui détermine à quel Drive l'application accède. L'application ne dispose pas encore d'une association vérifiée entre « Moi » et une adresse Google précise, donc il faut choisir le bon compte Google lors de la connexion. Pour éviter de confondre les deux carnets, le format sauvegardé contient aussi le profil choisi et sa restauration est vérifiée.

Les sauvegardes ne sont **pas synchronisées en direct** : chaque action de sauvegarde crée une nouvelle version datée. Cela évite un écrasement silencieux entre deux appareils. La gestion des conflits et une synchronisation automatique peuvent être ajoutées plus tard.

Les **photographies personnelles ne sont pas encore prises en charge** dans cette V0.4. Elles nécessiteront un module de téléversement, d'optimisation et de visualisation respectant les droits d'accès.

Ne jamais publier de données de progression ou de photos personnelles dans un dépôt GitHub public.

## Tests

- Scripts contrôlés syntaxiquement.
- Flux OAuth / dossier / sauvegarde testé avec une API Google simulée.
- **Reste à faire avant fusion :** authentification et essais Drive réels avec le projet OAuth configuré, essai mobile, expiration du jeton, import d'une sauvegarde réelle et vérification des droits.
