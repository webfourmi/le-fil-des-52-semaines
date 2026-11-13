(function(root){'use strict';
const details={
title:'Le dindon d’automne · housse de coussin Thanksgiving',
materials:['1 carré de coton 42 × 42 cm pour le devant.','2 rectangles de coton 42 × 30 cm pour le dos portefeuille.','Chutes de coton d’automne (8 à 12 motifs), environ 30 × 40 cm au total.','Thermocollant double face pour appliqué, environ 30 × 40 cm.','Fil assorti, fil à broder brun, crème et orangé, aiguille, épingles et fer.','1 coussin de garnissage 40 × 40 cm.'],
steps:[
['Préparer le fond','Coupe le devant de 42 × 42 cm et les deux dos de 42 × 30 cm. Repasse le devant et marque légèrement son axe. Prévois au moins 7 cm de dégagement entre le motif et les bords de coupe.'],
['Reporter les gabarits','Imprime le patron à 100 %, contrôle le carré de 5 cm, et reporte les pièces sur le papier du thermocollant. Pour les pièces asymétriques, inverse le tracé sur l’envers afin que le motif final regarde vers la droite. Les pièces ne comprennent pas de marge de couture.'],
['Préparer les tissus','Thermocolle chaque chute selon la notice du fabricant puis découpe les sept plumes de queue, les six plumes du ventre, le corps, la tête et le cou, le bec, la caroncule et l’aile. Choisis de préférence des imprimés variés mais harmonieux.'],
['Composer l’éventail','Dispose d’abord les sept grandes plumes sur le devant, pointe vers l’extérieur, bases regroupées derrière le futur corps. Vérifie l’équilibre général avant de retirer le papier protecteur.'],
['Poser le corps et les petites plumes','Place le corps brun sur les bases de l’éventail. Dispose les six petites plumes sur son ventre en les superposant légèrement, puis ajoute l’aile. Pose ensuite la tête et le cou rouges, le bec jaune et la caroncule orangée.'],
['Fixer et broder','Quand le placement te convient, fixe les appliqués au fer selon la notice du thermocollant. Couds les contours au point de feston main ou zigzag machine étroit. Brode les nervures de plumes au point arrière ou au point de tige, l’œil au point de nœud ou avec quelques points noirs et les deux pattes au point de tige.'],
['Faire les ourlets du dos','Sur un long côté de chaque panneau de dos (42 cm), repasse un premier rentré de 1 cm, puis un second de 1 cm. Pique à 2 ou 3 mm du pli. Les panneaux mesurent alors 42 × 28 cm.'],
['Assembler la housse portefeuille','Pose le devant endroit vers toi. Superpose les deux dos endroit contre endroit avec le devant, bords ourlés dirigés vers le centre et se chevauchant de 14 cm. Aligne les quatre bords extérieurs de 42 cm. Épingle puis pique tout autour à 1 cm.'],
['Retourner et terminer','Surfile les marges, dégarnis les coins sans couper la couture et retourne par l’ouverture du dos. Forme les angles, repasse sur l’envers avec une pattemouille si nécessaire, puis insère le coussin de 40 × 40 cm.']
],
variations:['Country : carreaux, petites fleurs et tons rouille, moutarde et olive.','Folk art : contour des appliqués au point de feston contrastant.','Patchwork : encadrer le motif de bandes de tissu avant la coupe définitive du devant, en conservant 42 × 42 cm.'],
photos:['Vue des fournitures et des chutes automnales','Plumes découpées et disposées en éventail','Superposition du corps, de la tête et des petites plumes','Gros plan sur le point de feston et les nervures brodées','Les deux dos et leur chevauchement','Coussin terminé, face et dos']
};
const e=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
root.Fil52Thanksgiving={render(){return `<section class="weektop"><div><span class="eyebrow">🦃 Bonus saisonnier · Projet en cours d’écriture</span><h1>${e(details.title)}</h1><p class="lead">Un coussin de 40 × 40 cm, dindon aux plumes d’automne et fermeture portefeuille sans zip. Motif d’appliqué inspiré de la photographie de référence.</p></div></section>
<section class="card section"><div class="actions"><button class="secondary" type="button" data-page="bonus">← Tous les bonus</button><a class="primary course-pattern-link" href="./assets/thanksgiving-dindon-patron.html" target="_blank" rel="noopener">⎙ Patron A4 à taille réelle</a></div>
<h2>Résultat et dimensions</h2><p>Housse finie 40 × 40 cm, marges de couture de 1 cm pour l’enveloppe ; dos portefeuille à ouverture centrale. L’appliqué est indépendant du patron de housse.</p>
<h2>Fournitures pour un seul coussin</h2><ul>${details.materials.map(x=>`<li>${e(x)}</li>`).join('')}</ul>
<h2>Réalisation pas à pas</h2><ol>${details.steps.map(([a,b])=>`<li style="margin-bottom:14px"><b>${e(a)}</b><p>${e(b)}</p></li>`).join('')}</ol>
<h2>Variantes</h2><ul>${details.variations.map(x=>`<li>${e(x)}</li>`).join('')}</ul>
<h2>Photographies à prendre</h2><ol>${details.photos.map(x=>`<li>${e(x)}</li>`).join('')}</ol>
<p class="tip"><b>À savoir :</b> teste le thermocollant sur une chute ; les ailes et le bec doivent rester bien fixés aux extrémités. Pour un appliqué aux bords rentrés, ajoute 4 à 5 mm aux gabarits et rentre le tissu à l’aiguille. Patron de travail à tester avant validation.</p>
<p class="small"><b>Projet en cours d’écriture.</b> Aucune validation éditoriale ni progression personnelle modifiée.</p></section>`}};})(globalThis);