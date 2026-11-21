(function(root){
'use strict';

const materials=[
 '1 carré de coton de 42 × 42 cm pour le devant.',
 '2 rectangles de coton de 42 × 30 cm pour le dos portefeuille.',
 'Des chutes pour les sept plumes, le corps, l’aile, le bec et la caroncule, environ 30 × 40 cm au total.',
 'Du thermocollant double face pour appliqué, environ 30 × 40 cm.',
 'Du fil à coudre, du fil à broder noir et orangé, une aiguille, des épingles et un fer.',
 '1 coussin de garnissage de 40 × 40 cm.'
];

const photos=[
 ['01-pieces-decoupees.webp',1152,1536,'Plumes, corps rouille, aile rayée, bec jaune et caroncule rouge posés sur le coton brun.','La tête et le cou sont découpés avec le corps. Le petit ovale rayé formera l’aile.'],
 ['02-eventail.webp',1152,1536,'Sept plumes de tissu noir, écru, bleu et rouge cousues en éventail sur le fond brun.','Les arrondis dessinent le bord de la queue. Les pointes se rejoignent à l’endroit que le corps va recouvrir.'],
 ['03-corps-et-aile.webp',1536,1152,'Corps rouille posé devant les plumes et aile rayée cousue au centre.','Le corps masque la jonction des sept plumes. On distingue le zigzag clair qui borde le corps et l’aile.'],
 ['04-details-brodes.webp',1536,1152,'Détail du dindon avec son bec jaune, sa caroncule rouge, son œil noir et ses deux pattes orange.','Sous le bec, la petite pièce rouge forme la caroncule. Quelques points de fil orangé dessinent les pattes et les doigts.'],
 ['05-housse-a-plat.webp',1152,1536,'Housse carrée brune posée à plat sur la table, dindon visible sur le devant.','La housse retournée, avant d’y glisser le coussin.'],
 ['06-coussin-termine.webp',1152,1536,'Coussin garni sur un fauteuil, avec le dindon en appliqué sur fond brun.','Le coussin de Thanksgiving terminé.']
];
const lessonPhotos=root.Fil52LessonPhotos;
lessonPhotos.lessons.thanksgiving=photos.map(([file,width,height,alt,caption])=>({
 caption, image:{src:'./assets/thanksgiving/'+file,width,height,alt}
}));

const steps=[
 ['Préparer le fond','Coupe le devant de 42 × 42 cm et les deux dos de 42 × 30 cm. Repasse le devant et marque légèrement son axe. Prévois au moins 7 cm de dégagement entre le motif et les bords de coupe.'],
 ['Reporter les gabarits','Imprime le patron à 100 % et contrôle le carré de 5 cm. Reporte les pièces sur le papier du thermocollant. Pour que le dindon regarde vers la droite, inverse le tracé des pièces asymétriques lorsque tu les reportes sur l’envers. Les gabarits d’appliqué se découpent sans marge.'],
 ['Découper les pièces du dindon','Thermocolle chaque chute sur l’envers selon la notice du fabricant, puis découpe les sept plumes, le corps avec la tête et le cou d’un seul tenant, l’aile, le bec et la caroncule. Garde le papier protecteur jusqu’à l’essai de placement.',0],
 ['Coudre les sept plumes en éventail','Sur l’endroit du devant, dispose les plumes en éventail, les bouts arrondis vers l’extérieur. Fais converger les pointes et pose le corps par-dessus pour vérifier qu’il les couvre. Soulève le corps, retire le papier des plumes et fixe-les au fer dans cet ordre de superposition. Couds leurs bords visibles au point de feston à la main ou au zigzag étroit à la machine.',1],
 ['Poser le corps et l’aile','Replace le corps sur la jonction des plumes, la tête tournée vers la droite. Retire son papier, fixe-le au fer et couds son contour. Pose ensuite l’aile au milieu du corps et fixe-la de la même façon.',2],
 ['Ajouter le bec et broder les détails','Fixe le bec jaune devant la tête et la caroncule rouge juste au-dessous. Brode l’œil avec un point de nœud ou quelques petits points noirs. Sous le corps, brode deux pattes au point de tige avec du fil orangé et termine chacune par trois doigts. Tu peux aussi broder une nervure sur chaque plume.',3],
 ['Faire les ourlets du dos','Sur un long côté de chaque panneau de dos (42 cm), repasse un premier rentré de 1 cm, puis un second de 1 cm. Pique à 2 ou 3 mm du pli. Les panneaux mesurent alors 42 × 28 cm.'],
 ['Assembler la housse portefeuille','Pose le devant endroit vers toi. Superpose les deux dos endroit contre endroit avec le devant, bords ourlés dirigés vers le centre et se chevauchant de 14 cm. Aligne les quatre bords extérieurs de 42 cm. Épingle puis pique tout autour à 1 cm.'],
 ['Retourner la housse','Surfile les marges, dégarnis les coins sans couper la couture et retourne la housse par l’ouverture du dos. Forme les angles et repasse sur l’envers avec une pattemouille si nécessaire.',4],
 ['Glisser le coussin dans la housse','Insère le coussin de 40 × 40 cm par l’ouverture portefeuille. Répartis le garnissage dans les quatre angles, puis remets les deux pans du dos bien à plat.',5]
];
const variations=[
 'Pour une version country, assortis des carreaux et de petites fleurs dans des tons rouille, moutarde et olive.',
 'Un point de feston contrastant souligne le contour de chaque pièce.',
 'Pour un cadre en patchwork, ajoute des bandes autour du motif avant de recouper le devant à 42 × 42 cm.'
];
const e=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function render(){
 return `<section class="weektop"><div><span class="eyebrow">🦃 Bonus saisonnier · Thanksgiving</span><h1>Le dindon d’automne · housse de coussin Thanksgiving</h1>
 <p class="lead">Sept plumes découpées dans des chutes forment la queue de ce dindon en appliqué. Les pattes se brodent directement sur le devant de la housse.</p></div></section>
 <section class="card section"><div class="actions"><button class="secondary" type="button" data-page="bonus">← Tous les bonus</button><a class="primary course-pattern-link" href="./assets/thanksgiving-dindon-patron.html" target="_blank" rel="noopener">⎙ Patron A4 à taille réelle</a></div>
 <h2>Résultat et dimensions</h2><p>La housse terminée mesure 40 × 40 cm. Le dos s’ouvre en portefeuille. Les mesures de coupe du devant et des deux dos comprennent 1 cm de marge de couture.</p>
 <h2>Fournitures pour un seul coussin</h2><ul>${materials.map(item=>`<li>${e(item)}</li>`).join('')}</ul>
 <h2>Réalisation pas à pas</h2><ol>${steps.map(([title,instructions,photo])=>`<li style="margin-bottom:14px"><b>${e(title)}</b><p>${e(instructions)}</p>${photo===undefined?'':lessonPhotos.renderInlinePhoto('thanksgiving',photo)}</li>`).join('')}</ol>
 <h2>Variantes</h2><ul>${variations.map(item=>`<li>${e(item)}</li>`).join('')}</ul>
 <p class="tip"><b>À savoir</b><br>Teste le thermocollant sur une chute. Quelques points à la base et sur les bords du bec le maintiennent en place. Pour un appliqué aux bords rentrés, ajoute 4 à 5 mm aux gabarits et rentre le tissu à l’aiguille.</p></section>`;
}
root.Fil52Thanksgiving={render};
})(globalThis);
