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
const dogIllustration=`<svg viewBox="0 0 660 355" role="img" aria-label="Cale-porte textile original : chien teckel roux à oreilles sombres et petit foulard vert, posé devant une porte" xmlns="http://www.w3.org/2000/svg">
<defs><linearGradient id="dogcoat" x1="0" x2="1"><stop stop-color="#c98c58"/><stop offset="1" stop-color="#aa6a46"/></linearGradient></defs>
<rect width="660" height="355" rx="21" fill="#f3eee5"/>
<path d="M560 0V324" stroke="#d0c6b9" stroke-width="9"/><rect x="556" y="0" width="80" height="320" fill="#e4d6c6" opacity=".55"/><ellipse cx="338" cy="321" rx="246" ry="23" fill="#b6ad9f" opacity=".28"/>
<path d="M132 204 C141 160 167 146 216 145 L458 147 Q513 147 515 193 L513 267 Q504 307 470 304 L454 303 L454 314 L413 314 L408 290 L237 293 L234 313 L183 313 L181 272 Q158 262 132 240 Z" fill="url(#dogcoat)" stroke="#915d47" stroke-width="5"/>
<path d="M140 176 Q153 150 139 132 C133 111 115 105 88 115 L58 137 Q48 143 55 153 Q68 164 97 153 L143 155Z" fill="#d9a273" stroke="#915d47" stroke-width="5"/>
<path d="M95 128 C108 128 130 133 139 154 Q149 192 133 222 Q119 231 109 210 L107 147Z" fill="#795743" stroke="#654735" stroke-width="4"/>
<circle cx="92" cy="135" r="5" fill="#2c302e"/><ellipse cx="56" cy="151" rx="11" ry="7" fill="#343335"/>
<path d="M171 192 Q205 205 220 175" stroke="#5a795f" stroke-width="17" fill="none" stroke-linecap="round"/>
<path d="M466 166 Q508 171 526 142 Q535 123 519 113" fill="none" stroke="#9b674c" stroke-width="14" stroke-linecap="round"/>
<path d="M195 288V306 M428 286V306" stroke="#7d5645" stroke-width="3" opacity=".6"/>
<path d="M255 285 Q327 290 390 287" stroke="#e7bb90" stroke-width="6" opacity=".5" fill="none"/>
<text x="38" y="43" fill="#506a55" font-size="16" font-family="Georgia,serif">Petit teckel de garde</text><text x="38" y="65" fill="#64756a" font-size="12" font-family="system-ui,sans-serif">Toile épaisse, feutrine, poche de lest intérieure</text>
</svg>`;
function render(){
 return `<div class="dog-course"><span class="eyebrow">Couture · Projet bonus indépendant</span><h1>Cale-porte en forme de chien</h1>
 <p class="lead">Un petit teckel en tissu, tout rond et bien lesté, pour empêcher une porte intérieure légère de se refermer. Une création qui permet d'apprendre les courbes, le rembourrage et la fermeture au point invisible.</p>
 <figure class="dog-course-hero">${dogIllustration}<figcaption>Illustration d'intention originale : le patron et le prototype sont à essayer avant validation définitive.</figcaption></figure>
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
