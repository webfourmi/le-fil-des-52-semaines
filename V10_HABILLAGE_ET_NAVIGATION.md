# Identité visuelle et navigation culturelle, proposition V1.0

## Les images retenues
Les trois icônes proviennent des fichiers sources choisis explicitement par l’utilisatrice :
- `icone_site.png` : bobine rose, aiguille dorée, scène mère-fille pour l'application et le logo de l'atelier ;
- `icone_couture.png` : machine à coudre ancienne fleurie pour la carte Couture ;
- `icone_patchwork.png` : étoile de patchwork, fleurs et aiguille pour la carte Patchwork.

Les fichiers `assets/icon-app.svg`, `assets/icon-couture.svg` et `assets/icon-patchwork.svg` contiennent une version WebP légère intégrée dans une enveloppe SVG, sans lien tiers. Ils sont mis en cache pour le fonctionnement hors connexion. Les icônes installables `assets/pwa-icon-{180,192,512}.png` ont été recréées à partir de la première image sélectionnée et remplacent les anciennes. L'icône SVG et l'icône iOS ont également été actualisées.

## Changements demandés
1. Accueil : suppression du paragraphe « Un rendez-vous créatif à deux… ».
2. Accueil : « L'atelier dans votre poche » est un panneau HTML `details` fermé par défaut. Son contenu reste entièrement utilisable lorsqu'il est ouvert.
3. Mes cours : suppression de l'introduction générique « Chaque cours est adapté à deux adultes… ».
4. Voyage textile : suppression de l'introduction « Des photographies de vrais objets… ».
5. Voyage textile : deux boutons **icônes seulement**, avec labels accessibles : `Coutures du monde` (articles actuels) et `Histoire de la couture` (aiguille préhistorique). Les deux contenus restent disponibles et aucun article n'est supprimé.

## Précautions
- Les deux profils et leurs données ne sont pas modifiés.
- Aucun nouveau service tiers ou transfert de photo personnelle.
- Les fichiers d'icônes sont intégrés dans le site pour éviter un chargement externe.
- Le cache PWA est renouvelé en V1.0 pour déclencher l'actualisation lors de la prochaine ouverture.

## Validation
`tests/aesthetic-icons.cjs`, `tests/navigation-travel.cjs` et `tests/home-progress.cjs` valident le rendu du site et les interactions. `tests/pwa-smoke.cjs` vérifie les contrôles cachés sous le panneau replié. Tous les tests existants de progression, sauvegarde et PWA doivent rester verts.

**Aucune fusion ni publication sans autorisation.**
