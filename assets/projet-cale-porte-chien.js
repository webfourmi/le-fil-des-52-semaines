/* De fil en aiguille · Création originale : cale-porte en forme de chien, projet bonus. */
(function(root){
'use strict';
const steps=[
['Découper les pièces','Imprime le patron A4 en taille réelle (100 %), sans « adapter ». Vérifie le carré témoin de 5 × 5 cm. Coupe deux silhouettes en coton épais, en retournant le gabarit pour la seconde face. Découpe deux oreilles et une queue en feutrine ; deux carrés de coton solide de 12 × 12 cm pour la poche lestée. Les marges de 1 cm sont déjà incluses sur la silhouette et le petit sac de lest.'],
['Préparer son visage','Brode un œil et le nez sur chaque silhouette, avec un fil noir solide. Pose une oreille de feutrine de chaque côté près du haut de la tête. Fixe-la au point de feston visible ou au petit zigzag ; laisse sa pointe retomber. Pas de boutons ni d’yeux plastiques : ce sont des pièces pouvant se détacher.'],
['Coudre la poche de lest','Superpose les deux carrés de coton solide endroit contre endroit. Pique à 1 cm, en conservant une ouverture de 3 cm. Retourne, verse environ 500 à 700 g de graviers propres, arrondis et parfaitement secs ou de granulés de lest. Ferme soigneusement l’ouverture avec un point arrière serré, puis renforce au point droit en tenant les graviers éloignés de l’aiguille. Vérifie l’absence de fuite.'],
['Assembler le corps','Place les deux silhouettes endroit contre endroit. Si tu utilises la queue en feutrine, glisse seulement son pied entre les tissus au haut de la croupe ; le reste est dirigé vers l’intérieur. Épingle, puis pique tout le contour à 1 cm du bord, en laissant une ouverture de 8 cm au milieu du dessous rectiligne. Renforce les points autour de l’ouverture et de la queue.'],
['Dégarnir les courbes','Fais de petites encoches dans les courbes rentrantes (sous la tête et au cou) et retire de très fins triangles de marge dans les arrondis extérieurs. Arrête-toi à 2 ou 3 mm de la couture. Ne coupe jamais la piqûre.'],
['Former le dessous plat','Pour une base stable, le corps étant encore sur l’envers, écarte les tissus à chaque coin inférieur en alignant la couture du dessous avec celle du côté et trace une ligne de 5 cm perpendiculaire à la pointe. Pique sur ce trait, puis répète à l’autre extrémité du dessous. Les deux petits coins cousus créent une base d’environ 5 cm de profondeur.'],
['Retourner et lester','Retourne le corps sur l’endroit par l’ouverture de 8 cm. Place la poche lestée tout en bas, centrée dans la base, sans forcer sur les coutures. Ajoute progressivement 60 à 100 g de ouate dans la tête, le dos et autour de la poche pour conserver une jolie silhouette.'],
['Fermer et tester','Rentre les marges de l’ouverture sur 1 cm puis ferme au point invisible (point d’échelle). Pose le chien au sol et teste-le sur une porte intérieure légère. Si le lest ne suffit pas, adapte le poids en fabriquant une poche correctement dimensionnée. Ne bloque jamais une porte coupe-feu ou une issue de secours.']
];
const dogIllustration=`<svg viewBox="0 0 660 355" role="img" aria-label="Le nouveau teckel du patron : tête arrondie, museau allongé, pattes courtes, oreilles tombantes et queue relevée" xmlns="http://www.w3.org/2000/svg">
<defs><linearGradient id="dogcoat" x1="0" x2="1"><stop stop-color="#c98c58"/><stop offset="1" stop-color="#aa6a46"/></linearGradient></defs>
<rect width="660" height="355" rx="21" fill="#f3eee5"/>
<path d="M590 0V330" stroke="#d0c6b9" stroke-width="10"/><rect x="590" y="0" width="70" height="330" fill="#e4d6c6" opacity=".55"/>
<ellipse cx="286" cy="328" rx="230" ry="17" fill="#aa9988" opacity=".22"/>
<g transform="translate(20 -210) scale(2.5)">
<path d="M 18.25 127.15 C 22.10 126.10 28.40 126.10 33.65 124.35 C 39.95 122.25 40.30 114.20 48.00 110.00 C 53.60 106.85 60.95 106.50 66.90 108.25 C 76.35 111.05 81.95 119.80 82.65 128.55 C 83.00 136.60 80.90 139.75 86.15 145.00 C 93.85 153.40 106.80 156.90 118.35 157.60 C 136.55 159.70 152.30 152.70 164.20 154.45 C 169.80 155.15 173.65 157.95 177.15 161.10 C 183.10 167.40 186.25 172.30 188.00 177.90 C 189.40 185.25 187.30 191.20 182.40 197.50 C 178.20 202.75 178.55 208.00 176.45 210.80 C 174.70 213.60 170.85 213.25 166.65 213.25 L 46.60 213.25 C 44.50 212.90 44.50 210.80 46.25 207.65 C 49.05 203.10 52.90 201.35 52.55 198.55 C 52.20 195.75 47.65 193.65 45.20 188.05 C 41.70 180.70 42.75 175.45 44.85 167.40 C 46.60 160.75 49.40 151.65 46.25 147.80 C 43.80 144.65 38.20 144.65 34.35 143.95 C 25.25 142.90 20.70 138.70 18.60 133.10 C 16.85 128.90 17.20 127.85 18.25 127.15 Z" fill="url(#dogcoat)" stroke="#915d47" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<g transform="translate(13 19) scale(.35)">
<path d="M469 406 C484 387 493 356 492 329 C491 322 488 310 493 311 C501 310 513 329 515 345 C519 372 505 405 488 422" fill="none" stroke="#9d694c" stroke-width="14" stroke-linecap="round"/>
<path d="M125 272 C137 285 131 308 122 331 C110 354 108 373 119 386 C130 400 156 394 176 381 C196 367 200 345 199 329" fill="none" stroke="#6f4b3d" stroke-width="8" stroke-linecap="round"/>
<circle cx="98" cy="298" r="5" fill="#2e3430"/><path d="M15 309 Q20 312 21 319 Q14 329 15 309Z" fill="#2e3430"/>
<path d="M17 329 Q26 338 32 333" fill="none" stroke="#78503a" stroke-width="3"/>
<path d="M105 546 Q107 552 107 555 M119 544 Q118 551 118 555 M136 544 Q132 552 132 555 M427 545 Q425 552 425 555 M443 545 Q440 551 440 555" stroke="#734d3d" stroke-width="2.5" fill="none"/>
</g></g>
<text x="520" y="40" fill="#506a55" font-size="16" font-family="Georgia,serif" text-anchor="end">Petit teckel de garde</text>
</svg>`;
function render(){
 return `<div class="dog-course"><span class="eyebrow">Couture · Projet bonus indépendant</span><h1>Cale-porte en forme de chien</h1>
 <p class="lead">Un petit teckel en tissu, tout rond et bien lesté, pour empêcher une porte intérieure légère de se refermer. Une création qui permet d'apprendre les courbes, le rembourrage et la fermeture au point invisible.</p>
 <figure class="dog-course-hero">${dogIllustration}<figcaption>Illustration de la nouvelle silhouette du patron. Un prototype en tissu reste recommandé pour vérifier les proportions et le lest.</figcaption></figure>
 <div class="dog-course-meta"><span>Niveau : intermédiaire débutante</span><span>Durée indicative : 2 h à 3 h</span><span>Pièce unique · sans calendrier</span></div>
 <div class="card section dog-course-actions"><h2>Le patron à imprimer</h2><p>Deux pages A4 vectorielles, silhouette de chien à découper deux fois en miroir, oreilles, queue et poche de lest. Les marges de 1 cm sont comprises là où elles sont nécessaires, avec un carré de contrôle de 5 × 5 cm.</p><div class="actions"><a class="primary course-pattern-link" href="./assets/patron-cale-porte-chien.html" data-pattern-preview="dog" rel="noopener noreferrer">✂ Consulter le patron A4</a><button type="button" class="secondary" data-dog-add-personal>Ajouter à mes projets persos</button></div></div>
 <section class="card section"><h2>Matériel pour un seul cale-porte</h2><ul class="dog-materials">
 <li>Une chute de toile de coton épaisse ou de jean souple d'environ <b>35 × 50 cm</b> pour les deux faces du corps.</li>
 <li>Une chute de <b>feutrine de 12 × 18 cm</b> pour deux oreilles et une queue, plus un peu de fil noir pour broder les yeux et le museau.</li>
 <li><b>Deux carrés de coton solide de 12 × 12 cm</b> pour la poche de lest intérieure.</li>
 <li>Environ <b>500 à 700 g de petits graviers propres et parfaitement secs</b> ou de granulés de lest adaptés ; ajuste en fonction de la porte.</li>
 <li>Environ <b>60 à 100 g de ouate</b> de rembourrage, fil résistant, épingles, ciseaux, craie, fer à repasser et une aiguille à main.</li>
 <li>Janome Cherry 21 : point droit de longueur indicative <b>2,5 mm</b> ; aiguille universelle 90/14 pour la toile épaisse, à essayer sur une chute.</li></ul>
 <p class="small">Privilégie un lest minéral bien sec plutôt que du riz ou des graines, sensibles à l'humidité et aux nuisibles. Le poids doit être enfermé dans une poche intérieure solide et vérifiée.</p></section>
 <section class="card section"><h2>La réalisation pas à pas</h2><ol class="dog-steps">${steps.map(([title,body])=>`<li><strong>${title}</strong><p>${body}</p></li>`).join('')}</ol>
 <div class="dog-technique-figure"><svg viewBox="0 0 570 175" role="img" aria-label="Illustration du coin inférieur replié et piqué sur 5 centimètres pour créer une base plate">
 <rect x="8" y="10" width="554" height="153" rx="13" fill="#f6f1e8"/>
 <path d="M48 125 L145 34 L238 125 Z" fill="#dbb293" stroke="#8b6651" stroke-width="3"/>
 <path d="M74 101 L211 101" stroke="#536d5b" stroke-width="4" stroke-dasharray="8 5"/>
 <text x="142" y="92" text-anchor="middle" font-size="15" fill="#3e644b">5 cm</text>
 <text x="290" y="70" font-size="15" fill="#465c50">Coin aplati, coutures alignées</text>
 <text x="290" y="95" font-size="14" fill="#465c50">Piquer sur la ligne puis répéter</text>
 <text x="290" y="120" font-size="14" fill="#465c50">au second coin inférieur.</text>
 </svg><p class="small">Schéma de principe du fond « en boîte » : cette couture donne un fond d'environ 5 cm de profondeur.</p></div>
 </section>
 <section class="card section"><h2>Finitions et précautions</h2><p>Brode les yeux plutôt que d'ajouter des boutons détachables. Ne mets jamais les granulés directement dans le chien : la <b>poche cousue et fermée</b> évite les fuites. Ce cale-porte n'est pas un jouet et ne convient pas aux portes coupe-feu, aux issues de secours ni aux portes nécessitant une fermeture automatique.</p>
 <p><b>Variante :</b> réalise les oreilles au point de feston apparent avec deux ou trois brins de mouliné et ajoute un petit foulard en tissu récupéré.</p><p class="small">Sources pratiques consultées : <a href="https://hellosewing.com/door-stopper/" target="_blank" rel="noopener noreferrer">Hello Sewing, lest et ouate</a> ; <a href="https://consumer.guetermann.com/wp-content/uploads/2024/03/Instructions-BUTOIR-DE-PORTE__FR.pdf" target="_blank" rel="noopener noreferrer">Gütermann, butoir textile et toile renforcée</a>. Le dessin de ce chien et le patron sont originaux.</p></section>
 <div class="actions"><button type="button" class="secondary" data-page="learn">← Retour aux cours couture</button><button type="button" class="secondary" data-page="print">Retrouver le patron dans la bibliothèque</button></div></div>`;
}
root.Fil52DogDoorstop={render,steps};
})(globalThis);
