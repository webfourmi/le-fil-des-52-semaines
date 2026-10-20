/* De fil en aiguille · Dossier documentaire Halloween USA en cours d’écriture.
 * Photos historiques réelles, identifiées par leurs notices patrimoniales.
 * L'article et les trois ateliers sont indépendants du parcours numéroté.
 */
(function(root){'use strict';
const enc=file=>encodeURIComponent(file);
const link=file=>'https://commons.wikimedia.org/wiki/File:'+enc(file).replace(/%20/g,'_');
const image=file=>'https://commons.wikimedia.org/wiki/Special:FilePath/'+enc(file)+'?width=960';
const photos=[
 {file:'Children at a Halloween Party, Los Angeles, 1935.jpg',alt:'Enfants et adulte déguisés lors d’une fête d’Halloween à Los Angeles en 1935',caption:'Fête d’Halloween à Los Angeles, 1935. Photographie d’archives, collection Los Angeles Times / UCLA, reproduite sur Wikimedia Commons.',credit:'Los Angeles Times / UCLA, Wikimedia Commons · consulter la notice et ses droits.'},
 {file:'Halloween party for the pre-kindergarten class at the Jewish Educational Center (4419522822).jpg',alt:'Enfants costumés lors d’une fête d’Halloween à Saint Paul dans le Minnesota en 1939',caption:'Fête d’une classe maternelle à Saint Paul (Minnesota), 1939.',credit:'Minnesota Historical Society / Flickr Commons · pas de restrictions connues.'},
 {file:'Halloween Vintage 02.JPG',alt:'Décoration d’Halloween ancienne en papier, datant approximativement de 1920 à 1950',caption:'Décoration américaine d’Halloween en papier, vers 1920-1950.',credit:'Collection de décoration ancienne · Wikimedia Commons, consulter la fiche de réutilisation.'},
 {file:'Chintz appliquéd quilt MET DT1815.jpg',alt:'Quilt américain du XIXe siècle avec arbre fleuri en appliqué',caption:'Mary Malvina Cook Taft, quilt à appliqués de chintz, vers 1835-1840.',credit:'The Metropolitan Museum of Art, New York · domaine public (CC0).'}
];
const sourceItems=[
 ['Library of Congress · The Origins of Halloween Traditions','https://blogs.loc.gov/headlinesandheroes/2021/10/the-origins-of-halloween-traditions/'],
 ['Smithsonian Gardens · Ghosts of Pumpkins Past','https://gardens.si.edu/american-garden-story/ghosts-of-pumpkins-past/'],
 ['Smithsonian · Halloween highlights arise from the museum vaults','https://americanhistory.si.edu/explore/stories/halloween-highlights-arise-museum-vaults'],
 ['Metropolitan Museum · American Quilts and Coverlets','https://www.metmuseum.org/essays/american-quilts-and-coverlets'],
 ['Metropolitan Museum · Mary Malvina Cook Taft, quilt, vers 1835-1840','https://www.metmuseum.org/art/collection/search/13869'],
 ['Metropolitan Museum · Quilt de Marie D. Webster, vers 1915','https://www.metmuseum.org/art/collection/search/855675']
];
const workshops=[
 {title:'Le sac à bonbons à coulisse',time:'1 h 15 à 1 h 45',level:'Débutante',size:'24 × 25 cm environ',supplies:[
 '2 rectangles de coton de 26 × 30 cm, un pour chaque face du sac.',
 '2 cordons souples de 100 cm, ou deux rubans résistants de longueur équivalente.',
 '1 chute de coton orange de 12 × 10 cm au minimum pour la citrouille ; feutrine noire pour deux yeux, un nez et une bouche.',
 'Pour la version machine : fil orange ou noir, aiguille universelle 80/12, craie, ciseaux, épingles et fer.',
 'Pour la variante main : aiguille à broder, 2 ou 3 brins de mouliné écru, noir ou orange, aiguille fine et fil solide pour les coutures du sac.',
 'Facultatif : thermocollant double face pour appliqué ; H630 de 24 × 24 cm pour rigidifier le devant.'
 ],steps:[
 'Repasser et découper les deux rectangles à la règle. Les marges de couture de 1 cm sont comprises dans les dimensions.',
 'Imprimer la planche 1 à 100 % et contrôler son carré témoin de 5 cm. Découper la citrouille orange et, séparément, les 2 yeux triangulaires de 15 × 12 mm, le nez de 12 × 10 mm et la bouche de 48 × 18 mm. Centrer la citrouille sous la coulisse. Poser le visage sans le fixer, en alignant les yeux, le nez et la bouche sur l’axe du dessin.',
 'Fixer la citrouille et les quatre éléments du visage au petit zigzag, ou opter pour la variante entièrement cousue à la main (point de feston visible). Vérifier les deux yeux à la même hauteur, le nez et la bouche centrés avant de coudre.',
 'Poser devant et dos endroit contre endroit. À 1 cm du bord, coudre le fond et chaque côté en s’arrêtant à 5 cm du haut : les entrées des coulisses restent ouvertes.',
 'Sur les quatre bords courts ouverts, replier 1 cm vers l’envers et piquer pour éviter l’effilochage.',
 'Sur chaque face, replier le haut de 1 cm puis encore de 3 cm ; piquer horizontalement au bord inférieur du repli pour former deux tunnels indépendants.',
 'Enfiler le premier cordon dans les deux tunnels pour le faire sortir du côté droit ; enfiler le second en sens inverse, sortie côté gauche. Nouer chaque paire d’extrémités.',
 'Tirer doucement sur les deux cordons et vérifier la fermeture, les coins, l’appliqué et la résistance des coutures.'
 ],note:'Janome Cherry 21 : point droit ≈ 2,5 mm pour les assemblages ; petit zigzag de 2-3 mm de large et 1-1,5 mm de long pour l’appliqué, à ajuster après essai. Visage : deux yeux parfaitement symétriques, petit nez central et bouche souriante à trois dents.',
 hand:{
  supplies:[
   '1 aiguille à broder à bout pointu et 2 ou 3 brins de mouliné écru ou noir contrastant, ou du coton perlé fin.',
   '1 citrouille orange en feutrine souple, 2 yeux, 1 nez et 1 bouche en feutrine noire (voir la planche 1).',
   'Aiguille à main, fil polyester solide pour l’assemblage, dé ou petit protège-doigt si besoin.',
   'Facultatif pour une citrouille en coton : thermocollant double face ou petits ourlets rentrés pour limiter l’effilochage.'
  ],
  steps:[
   'Avant de couper, imprime la planche 1 à 100 % et mesure son carré de contrôle de 5 cm. Découpe les cinq pièces : citrouille, deux yeux, nez et bouche. Le tracé pointillé sur la grande citrouille n’est qu’un guide de position.',
   'Pose la citrouille orange bien centrée sur la face avant du sac. Maintiens-la par quelques petits points de bâti ou une très légère fixation thermocollante adaptée au tissu.',
   'Pour le point de feston (*blanket stitch*), fais sortir le fil sur l’endroit, près du bord de la citrouille. Entre à environ 3 mm vers l’intérieur de la pièce, ressors juste en dehors du bord dans le tissu de fond ; place le fil sous la pointe de l’aiguille avant de tirer doucement. Une petite boucle borde le tissu.',
   'Répète le geste tous les 3 à 4 mm, en gardant la même hauteur et sans serrer. Tu obtiens une succession de petits traits perpendiculaires au bord, reliés par une boucle continue. Suis la courbe des lobes sans tirer.',
   'Place ensuite les yeux noirs exactement à la même hauteur, le nez au centre, et la bouche dentée juste sous le nez. Bâtis d’abord les quatre formes puis couds-les au petit point de feston ; sur les pointes des triangles, réduis un peu l’espacement.',
   'Si les plus petites dents de la bouche sont difficiles à festonner, fixe-les par de minuscules points arrière noirs bien réguliers. Ajoute éventuellement trois lignes de points avant écrus sur la citrouille, simplement décoratives.',
   'Pour réaliser aussi le SAC entièrement à la main, assemble fond et côtés par un point arrière serré (solide), en laissant les 5 cm supérieurs ouverts ; replie et fixe les bords de l’ouverture et les deux coulisses par un point arrière. Enfile ensuite les deux cordons en sens opposé, comme dans le tutoriel principal.',
   'Vérifie la fermeture du sac, puis passe légèrement la main sur les coutures : les boucles doivent être souples, l’appliqué stable, les petits éléments solidement fixés.'
  ],
  note:'Le point de feston visible crée une finition de style « primitive folk art » américain. C’est une inspiration artisanale contemporaine, pas une technique réservée aux poupées anciennes. La feutrine ne s’effiloche pas ; pour du coton, stabilise ou rentre ses bords. Le point arrière est préférable au point avant pour les coutures structurelles du sac.'
 }},
 {title:'Mini-quilt « Nuit d’Halloween »',time:'1 h 30 à 2 h',level:'Débutante avec appliqués',size:'20 × 20 cm finis, indépendant de la couverture',supplies:[
 '1 carré de coton clair de 22 × 22 cm pour le devant et 1 carré de 22 × 22 cm pour le dos.',
 '1 carré de molleton thermocollant H630 de 20 × 20 cm.',
 'Chutes de tissu noir (chat), orange (citrouille), jaune (lune), et éventuellement un petit morceau clair (étoile).',
 'Fil assorti, aiguille universelle 80/12, fer, ciseaux, pinces et craie.',
 'Facultatif : thermocollant double face pour l’appliqué et 25 cm de cordon de suspension.'
 ],steps:[
 'Découper les deux carrés de tissu. Imprimer la planche 2 à taille réelle et reporter les motifs sur les chutes sans marge : chat assis de profil en une seule pièce noire, lune, citrouille et étoile facultative.',
 'Composer le décor : lune en haut à gauche, chat noir de profil avec queue arrondie sur la droite, citrouille en bas à gauche. Laisser au moins 2 cm jusqu’aux bords bruts. Ne pas couper de petits détails à l’intérieur du chat.',
 'Bâtir ou thermocoller les silhouettes ; fixer chacune au petit zigzag. Pour la citrouille, broder les lignes de côtes au lieu de les découper.',
 'Centrer le H630 sur l’envers du devant et le thermocoller conformément à la notice du fabricant, après essai.',
 'Assembler endroit contre endroit à 1 cm du bord, en laissant 6 cm ouverts. Cranter prudemment les angles, retourner, repasser.',
 'Refermer l’ouverture et surpiquer tout autour à 2 ou 3 mm du bord. Matelasser deux ou trois lignes pour solidariser les trois épaisseurs.',
 'Si souhaité, coudre solidement un cordon de suspension au dos des deux angles supérieurs.'
 ],note:'Avec deux carrés coupés à 22 × 22 cm et une marge de 1 cm, le panneau fini mesure environ 20 × 20 cm. Ce mini-quilt décoratif ne valide PAS un bloc de la couverture annuelle.'},
 {title:'La guirlande de trois fanions',time:'1 h à 1 h 30',level:'Débutante',size:'3 triangles de 16 × 19 cm bruts, bande 110 cm',supplies:[
 '6 chutes de coton assez grandes pour couper 6 triangles de 16 × 19 cm, soit 3 devants et 3 dos.',
 '1 bande de coton de 110 × 5 cm, ou 1,10 m de biais préplié adapté.',
 'Chutes orange, crème et jaune pour citrouille, fantôme et étoile.',
 'Fil assorti, aiguille universelle 80/12, règle, craie, pinces et fer.'
 ],steps:[
 'Imprimer la planche 3 à 100 % et contrôler le carré de 5 cm. Découper le triangle 16 × 19 cm sur le contour : marges déjà comprises.',
 'Couper trois devants et trois dos. Imprimer les appliqués de la planche 4 et préparer une citrouille, un fantôme aux bras ouverts et une étoile. Le visage du fantôme en pointillés indique une broderie facultative, pas une découpe.',
 'Fixer un motif sur chaque devant, à 2 cm minimum des bords, avec un petit zigzag testé sur une chute. Pour le fantôme, broder ensuite les deux yeux et le sourire au point arrière, ou dessiner le visage au feutre textile adapté.',
 'Assembler chaque devant et son dos endroit contre endroit, piquer les deux côtés obliques à 1 cm et laisser le haut ouvert.',
 'Dégarnir sans sectionner la couture, retourner, former la pointe à l’aide d’un outil non tranchant et repasser.',
 'Replier la bande de 110 × 5 cm en biais double : rentrer les deux longs bords vers le centre puis replier en deux. Repasser.',
 'Positionner les trois hauts de fanions dans la bande : environ 23 cm aux extrémités et 8 cm entre eux. La marge de 1 cm du fanion se retrouve prisonnière de la bande.',
 'Piquer le long de la bande en traversant toutes les épaisseurs ; vérifier que chaque fanion est bien retenu.'
 ],note:'Astuce récupération : chaque fanion peut être d’un tissu différent. Le fantôme se prête bien à une chute de coton blanc ou crème.'}
];
const safe=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const figure=(p,i)=>`<figure class="halloween-archive"><a href="${link(p.file)}" target="_blank" rel="noopener noreferrer"><img src="${image(p.file)}" loading="lazy" alt="${safe(p.alt)}" decoding="async"></a><figcaption><b>${safe(p.caption)}</b><small>${safe(p.credit)}</small><a target="_blank" rel="noopener noreferrer" href="${link(p.file)}">Notice, crédit et licence ↗</a></figcaption></figure>`;
const festonSvg=`<figure class="halloween-feston-diagram"><svg viewBox="0 0 540 175" role="img" aria-label="Schéma du point de feston : petits points perpendiculaires et boucle continue le long du bord de la feutrine" xmlns="http://www.w3.org/2000/svg"><rect x="12" y="12" width="516" height="151" rx="13" fill="#f6ede1"/><rect x="55" y="20" width="430" height="115" rx="8" fill="#da934f"/><path d="M55 135 H485" stroke="#81461f" stroke-width="2"/><path d="M83 89 V137 H130 V89 M130 137 H177 V89 M177 137 H224 V89 M224 137 H271 V89 M271 137 H318 V89 M318 137 H365 V89 M365 137 H412 V89 M412 137 H459 V89" fill="none" stroke="#fff2ca" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><text x="270" y="58" text-anchor="middle" font-size="17" fill="#593817">Feutrine orange</text><text x="270" y="157" text-anchor="middle" font-size="13" fill="#52655c">Boucles le long du bord, espacées de 3 à 4 mm</text></svg><figcaption>Point de feston, vu de dessus : un petit trait perpendiculaire au bord et une boucle qui suit ce bord. Le dessin agrandit le geste.</figcaption></figure>`;
const renderHand=w=>!w.hand?'':`<details class="halloween-hand-variant"><summary><strong>🪡 Variante entièrement à la main · point de feston visible</strong><small>Style folk art américain, sans machine</small></summary><div class="halloween-hand-content"><p>Une autre finition pour le même sac et le même patron : un contour écru contrastant et de petites coutures apparentes, inspirés des poupées de chiffon de style « primitive Americana ».</p><h4>Fournitures supplémentaires pour un seul sac</h4><ul>${w.hand.supplies.map(x=>'<li>'+safe(x)+'</li>').join('')}</ul><h4>Le point de feston (*blanket stitch*)</h4>${festonSvg}<ol>${w.hand.steps.map(x=>'<li>'+safe(x)+'</li>').join('')}</ol><p class="tip"><b>Pourquoi ces points ?</b> ${safe(w.hand.note)}</p></div></details>`;
const workshop=(w,i)=>`<details class="card halloween-workshop" data-halloween-workshop="${i+1}"><summary><span class="culture-label">Atelier ${i+1} · ${safe(w.level)}</span><strong>${safe(w.title)}</strong><small>${safe(w.size)} · ${safe(w.time)}</small></summary><div class="halloween-workshop-body"><h3>Fournitures pour un seul ouvrage</h3><ul>${w.supplies.map(x=>'<li>'+safe(x)+'</li>').join('')}</ul><h3>Le tutoriel pas à pas</h3><ol>${w.steps.map(x=>'<li>'+safe(x)+'</li>').join('')}</ol>${renderHand(w)}<div class="tip"><b>À retenir :</b> ${safe(w.note)}</div><p><a class="secondary halloween-print-link" href="./assets/halloween-patrons.html" data-pattern-preview="halloween" data-pattern-section="${['sac','mini','guirlande'][i]}" rel="noopener noreferrer">✂ Consulter le patron A4 (navigation conservée) ↗</a></p></div></details>`;
function render(){
 return `<article class="card section travel-article travel-halloween" data-travel="halloween">
 <header class="travel-article-heading"><span class="culture-label">États-Unis · Escale spéciale Halloween</span><h2>Halloween : citrouilles, tissus et quilts</h2><small>Une tradition d’automne, des documents d’archives et trois ateliers libres</small></header>
 <p class="travel-lead">Un soir d’octobre aux États-Unis : des enfants costumés, des lanternes sculptées, des décorations de papier et, tout près, l’histoire plus ancienne des tissus assemblés et des quilts familiaux. Cette escapade mêle récits documentés et créations contemporaines originales.</p>
 <section class="travel-chapter"><h3>1. Une fête aux origines multiples</h3><p>Halloween s’est façonnée à partir de coutumes différentes : pratiques saisonnières gaéliques associées à Samhain, célébrations chrétiennes de la Toussaint et du souvenir des morts, puis traditions de déguisement et de porte-à-porte. Il serait trompeur d’imaginer une fête restée identique depuis l’Antiquité. Les migrations et les usages populaires nord-américains l’ont profondément transformée.</p><p>Les récits irlandais sur Stingy Jack évoquent des lanternes taillées dans des racines, notamment des navets. Aux États-Unis, la citrouille est devenue un support particulièrement apprécié. Les fêtes de voisinage et la pratique du <i>trick-or-treat</i> se sont développées au XXe siècle.</p></section>
 <div class="halloween-archives">${figure(photos[0],0)}${figure(photos[1],1)}${figure(photos[2],2)}</div>
 <section class="travel-chapter"><h3>2. Les costumes et la maison en fête</h3><p>Au cours des années 1900-1950, les fêtes d’enfants, les masques, les costumes improvisés et les décorations en papier se diffusent aux États-Unis. Certains musées conservent des objets en tissu, carton peint ou métal qui montrent comment les familles se déguisaient et décoraient leur intérieur. Les photos ci-dessus sont de véritables documents historiques, et non des images reconstituées.</p><p>Observe les matières et les détails : masques, chapeaux pointus, tissus récupérés et petits accessoires. Quels éléments pourrais-tu reproduire avec les coupons du placard, sans acheter de tissu neuf ?</p></section>
 <section class="travel-chapter"><h3>3. Bien avant les citrouilles : les quilts américains</h3><p>Le <b>patchwork</b> assemble des pièces de tissu par les coutures. L’<b>appliqué</b> fixe une silhouette découpée sur une étoffe de fond. Un <b>quilt</b> superpose habituellement un dessus, une couche intermédiaire et un dos reliés par matelassage. Les trois techniques se complètent mais ne sont pas synonymes.</p><p>Au XIXe siècle, des quilts américains présentent des motifs floraux, des oiseaux, des arbres, des bordures travaillées et parfois des signatures. Mary Malvina Cook Taft réalisa vers 1835-1840 un quilt avec un arbre de vie appliqué, conservé au Metropolitan Museum of Art. Notre motif de citrouille et de chat est, lui, une <b>interprétation Halloween contemporaine</b>, et non un motif ancien traditionnel.</p></section>
 <div class="halloween-archives halloween-archive-wide">${figure(photos[3],3)}</div>
 <section class="halloween-choice"><span class="eyebrow">À essayer dans notre atelier</span><h3>Trois créations, entièrement au choix</h3><p>Tu peux réaliser une, deux, les trois, ou aucune. Ces projets ne remplacent pas les cours numérotés ni les blocs de chacune des couvertures.</p><p><b>Patrons prêts à imprimer :</b> quatre planches A4 vectorielles aux dimensions réelles, avec visage de citrouille recentré, pièces noires séparées, chat assis de profil et fantôme à bras ouverts. Vérifie le carré témoin de 5 × 5 cm, et choisis <b>taille réelle / 100 %</b> à l’impression.</p><p><a class="primary halloween-print-link" href="./assets/halloween-patrons.html" data-pattern-preview="halloween" rel="noopener noreferrer">✂ Consulter les quatre planches Halloween ↗</a></p></section>
 <div class="halloween-workshops">${workshops.map(workshop).join('')}</div>
 <section class="travel-vocabulary"><h3>Quelques mots en anglais</h3><dl><div><dt>Quilt</dt><dd>Ouvrage textile matelassé.</dd></div><div><dt>Appliqué</dt><dd>Forme cousue sur un fond.</dd></div><div><dt>Jack-o’-lantern</dt><dd>Lanterne sculptée, souvent dans une citrouille.</dd></div><div><dt>Trick-or-treat</dt><dd>Formule de collecte de friandises, « des bonbons ou un sort ».</dd></div></dl></section>
 <section class="travel-chapter"><h3>Le savais-tu ? Trois questions</h3><details><summary>Dans quel légume taillait-on certaines anciennes lanternes irlandaises ?</summary><p>Le navet, et d’autres légumes-racines.</p></details><details><summary>Un quilt appliqué est-il obligatoirement fait de triangles ?</summary><p>Non. L’appliqué fixe une forme sur un tissu de fond, même si des patchworks assemblés existent aussi.</p></details><details><summary>Pourquoi parle-t-on de quilts historiques dans cette escale ?</summary><p>Ils montrent les techniques textiles américaines anciennes qui inspirent librement nos projets décoratifs modernes, sans être nécessairement liés à Halloween.</p></details></section>
 <section class="travel-sources"><h3>Sources historiques et collections à visiter</h3><ul>${sourceItems.map(([name,url])=>'<li><a href="'+url+'" target="_blank" rel="noopener noreferrer">'+safe(name)+' ↗</a></li>').join('')}</ul><p class="small">Photographies : les crédits et licences propres à chaque image sont accessibles par leurs notices Wikimedia Commons. Une connexion peut être nécessaire. Aucun visuel généré par IA n’est présenté comme photographie d’archive.</p></section>
 </article>`;
}
root.Fil52Halloween={render,photos,workshops};
})(globalThis);
