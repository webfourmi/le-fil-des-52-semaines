/* Bonus Couture · Boudin de porte anti-courant d’air · projet en cours d’écriture. */
(function(root){
'use strict';
const steps=[
 ['Mesurer la porte','Mesure la largeur de la porte au niveau du sol. Prévois un boudin fini 1 cm plus court pour éviter qu’il dépasse. Pour une porte de 83 cm : 82 cm finis.'],
 ['Découper les tissus','Découpe le grand rectangle : largeur de porte + 1 cm en longueur et 20 cm en hauteur. Pour 83 cm de porte : rectangle de 84 × 20 cm, marges de couture de 1 cm incluses. Découpe deux disques de 7,7 cm de diamètre avec le gabarit A4 ; marges déjà comprises.'],
 ['Préparer les repères','Sur l’envers du rectangle, trace les lignes de couture à 1 cm des bords. Sur un bord long, marque une ouverture de 12 cm au centre, qui restera non cousue. Épingle endroit contre endroit.'],
 ['Former le tube','Couds les deux grands bords endroit contre endroit à 1 cm du bord. Arrête la piqûre avant les 12 cm d’ouverture et reprends après ; fais un point d’arrêt à chaque extrémité. Tu obtiens un tube encore sur l’envers.'],
 ['Fermer les extrémités','Épingle chaque disque, endroit contre endroit, sur un bout du tube. Répartis le tissu régulièrement tout autour, puis pique lentement à 1 cm. Dégarnis légèrement les marges sans couper la couture.'],
 ['Retourner','Retourne le tube par l’ouverture de 12 cm. Repousse doucement les arrondis avec un outil non pointu, puis vérifie que les deux embouts sont bien cousus.'],
 ['Rembourrer','Insère progressivement des chutes textiles propres, souples et coupées en petits morceaux, en les répartissant sur toute la longueur. Complète avec de la ouate si besoin. Le boudin doit rester régulier, sans bosses, avec assez de tenue pour épouser le bas de la porte.'],
 ['Fermer et essayer','Rentre les marges de 1 cm de l’ouverture, puis ferme au point invisible. Pose le boudin contre le bas de la porte et vérifie qu’il couvre la zone de passage d’air sans gêner l’ouverture. Ne l’utilise pas pour obstruer une issue de secours ou une porte coupe-feu.']
];
const illustration=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 780 280" role="img" aria-label="Boudin de porte en tissu à motifs, long cylindre rembourré contre le bas d'une porte en bois">
<defs><linearGradient id="door" x1="0" x2="1"><stop stop-color="#eee0c8"/><stop offset="1" stop-color="#cfb58d"/></linearGradient><linearGradient id="tube" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#dfad8f"/><stop offset=".55" stop-color="#c98e74"/><stop offset="1" stop-color="#aa6d56"/></linearGradient></defs>
<rect width="780" height="280" rx="20" fill="#f3eee5"/>
<rect x="90" y="14" width="600" height="211" rx="3" fill="url(#door)" stroke="#b5a184" stroke-width="3"/>
<path d="M122 24V216 M658 24V216 M140 36H640V194H140Z" fill="none" stroke="#b89f81" stroke-width="4" opacity=".6"/>
<rect x="0" y="227" width="780" height="53" fill="#c9bda9"/><path d="M0 227H780" stroke="#8c8b77" stroke-width="5"/>
<rect x="88" y="205" width="607" height="43" rx="21" fill="url(#tube)" stroke="#915c4c" stroke-width="2.5"/>
<ellipse cx="100" cy="226.5" rx="21" ry="21.5" fill="#cf9f82" stroke="#915c4c" stroke-width="2.5"/>
<ellipse cx="679" cy="226.5" rx="16" ry="21.5" fill="#bb8669" stroke="#915c4c" stroke-width="2"/>
<g stroke="#f1d8ad" stroke-width="3" opacity=".93"><path d="M148 206l17 40 M237 206l16 40 M328 206l15 40 M420 206l16 40 M511 206l16 40 M601 206l16 40"/></g>
<path d="M112 214 Q380 202 657 215" stroke="#f7dfc4" opacity=".7" stroke-width="3" fill="none"/>
</svg>`;
function render(){
 return `<div class="dog-course"><span class="eyebrow">Couture · Bonus · ✎ Projet en cours d’écriture</span><h1>Boudin de porte anti-courant d’air</h1>
 <p class="lead">Un projet utile pour les journées fraîches : un long coussin cylindrique posé contre le bas de la porte, réalisé avec des tissus de récupération et ajusté exactement à la largeur nécessaire.</p>
 <figure class="dog-course-hero">${illustration}<figcaption>Modèle de principe : dimensions personnalisables, tissu au choix. Projet non encore validé.</figcaption></figure>
 <div class="dog-course-meta"><span>Niveau : débutante</span><span>Durée indicative : 1 h 30 à 2 h</span><span>Une pièce, dimensions sur mesure</span></div>
 <section class="card section"><h2>Patron à imprimer</h2><p>La feuille A4 contient le gabarit circulaire à taille réelle des deux embouts et un carré témoin de 5 × 5 cm. La longueur du grand rectangle dépend de la porte : elle se mesure directement sur le tissu.</p><div class="actions"><a class="primary course-pattern-link" href="./assets/patron-boudin-porte.html" data-pattern-preview="draftstopper">✂ Consulter le patron A4</a><button type="button" class="secondary" data-page="print">Bibliothèque des patrons</button></div></section>
 <section class="card section"><h2>Dimensions pour un seul boudin</h2><p>Mesure la largeur de la porte (L). Le boudin terminé sera long de <b>L − 1 cm</b>, avec un diamètre proche de <b>5,7 cm</b>. Marges de 1 cm comprises dans les pièces à couper.</p>
 <div class="tip"><b>Exemple pour une porte de 83 cm :</b> rectangle de <b>84 × 20 cm</b> et deux cercles de <b>7,7 cm de diamètre</b>. Longueur finie approximative : 82 cm.</div>
 <p class="small">Pour une porte beaucoup plus large, assembler deux bandes avant de couper le rectangle, ou adapter la longueur aux mesures réelles.</p></section>
 <section class="card section"><h2>Matériel</h2><ul>
 <li>Une bande de toile de coton, de jean souple ou de tissu d’ameublement léger, de <b>(L + 1) × 20 cm</b>.</li>
 <li>Deux petites chutes assorties pour les disques de <b>7,7 cm</b> de diamètre.</li>
 <li>Des chutes de tissu propres, coupées en petits morceaux, et éventuellement un peu de ouate pour compléter.</li>
 <li>Fil solide assorti, ciseaux, règle, épingles, craie ou feutre effaçable, fer, aiguille à main.</li>
 <li>Janome Cherry 21 : point droit, longueur indicative <b>2,5 mm</b>, aiguille 80/12 ou 90/14 suivant l’épaisseur ; tester sur une chute.</li>
 </ul><p class="small">Préférer les chutes textiles ou un rembourrage synthétique à des graines, sensibles à l’humidité. Si tu choisis un lest complémentaire, il doit être enfermé dans une poche intérieure résistante.</p></section>
 <section class="card section"><h2>Réalisation pas à pas</h2><ol class="dog-steps">${steps.map(([title,body])=>`<li><strong>${title}</strong><p>${body}</p></li>`).join('')}</ol></section>
 <section class="card section"><h2>Variante décorative</h2><p>Pour une petite touche de patchwork, assemble trois bandes de tissus contrastés sur la longueur, puis recoupe le panneau obtenu aux dimensions du rectangle. Surpique éventuellement les jonctions avant de monter le tube. Une toile unie à chaque embout donnera une finition nette.</p><p class="small">Les mesures, le confort de rembourrage et le glissement sur le sol restent à vérifier sur un premier exemplaire avant validation du projet.</p></section>
 <div class="actions"><button type="button" class="secondary" data-page="bonus">← Retour aux projets bonus</button></div>
 </div>`;
}
root.Fil52DraftStopper=Object.freeze({render,steps});
})(window);
