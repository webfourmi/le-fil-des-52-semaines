# V1.1.1 · Retouches de Viera

Cette version **reprend intégralement V1.1** (encore non publiée) et applique les retours de Viera sur l'aperçu.

## Décisions validées
- Couleurs romantiques et thème de carnet conservés **sans modifications de la palette**.
- Le profil existant dont l'identifiant est `m` s'affiche désormais **Viera** au lieu de « Moi » ; Mathilde reste inchangée.
- Les anciennes données locales contenant `names.m === 'Moi'` s'affichent automatiquement sous le prénom Viera sans effacer les données ni changer les clés des profils. Un nom de profil personnalisé (autre que « Moi ») est préservé.
- La phrase de couverture devient « L'atelier de Mathilde & Viera » et le choix d'identité / avatar est actualisé.

## Accueil : Cours 1 et Patchwork 1
Les deux petits boutons de raccourci de l'en-tête sont désormais **des icônes sans texte visible** : une machine à coudre et un carré de patchwork. Ils conservent :
- leurs destinations personnalisées selon les cours / blocs réellement disponibles ;
- leurs noms accessibles `aria-label` (ex. « Ouvrir le cours 2 »), et un `title` au survol ;
- les grandes cartes de progression indiquant le nom du projet et les étapes restantes.

## Titres plus discrets
Le grand titre « Petits points, grandes idées » est réduit d'environ la moitié selon la taille d'écran ; les titres des autres rubriques sont légèrement resserrés pour garder une hiérarchie lisible.

## Icônes du bas
Les pictogrammes **Accueil, Couture et Patchwork** ont été redessinés à partir de silhouettes épurées inspirées par les trois icônes déjà approuvées **Voyage, Journal, Patrons** :
- trait d'épaisseur similaire, arrière-plan crème et bordure pointillée identiques ;
- silhouette lisible en format 30 à 39 px ;
- les anciennes illustrations riches restent sur les cartes de l'accueil et sur l'icône d'installation de la PWA.

## Sécurité et performances
- Pas de modification des contenus pédagogiques, fichiers des cours, photos, sauvegardes ou structures de données.
- Versions PWA: `fil52-shell-v1.1.1`; trois nouvelles images de navigation intégrées au cache hors connexion.
- Tests V1.1.1 : migrations du prénom et préservation notes/progression, boutons sans texte mais accessibles, tailles des titres, navigation mobile/ordinateur, rendu de captures et absence de débordement. Tous les tests antérieurs restent applicables.

**Cette proposition reste en branche et PR en brouillon. Aucun merge ou publication sans accord.**
