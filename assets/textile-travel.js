/* Voyage textile V0.7. Collections documentées, crédits et sources conservés.
 * Les photographies proviennent de Wikimedia Commons ; une connexion est nécessaire
 * à leur premier affichage. Aucun ouvrage personnel n'est envoyé vers ces sources.
 */
(function(root){
'use strict';
const commons=file=>'https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(file)+'?width=720';
const source=file=>'https://commons.wikimedia.org/wiki/File:'+encodeURIComponent(file).replace(/%20/g,'_');
const photo=(file,alt,description,credit,license)=>({file,alt,description,credit,license});
const cards=[
 {
  id:'japon',country:'Japon',title:'Sashiko et boro : la beauté du tissu qui dure',era:'Du vêtement utilitaire au regard contemporain',
  lead:'Sur une pièce d’indigo délavé, des points blancs avancent en cadence. Sous la surface se superposent parfois plusieurs tissus : c’est la mémoire de réparations successives.',
  sections:[
   ['À quoi servaient ces coutures ?',`Le mot <b>sashiko</b> désigne une pratique japonaise de couture au point avant. Les points rapprochés peuvent solidariser des épaisseurs, renforcer un vêtement ou composer un décor géométrique. <b>Boro</b>, en revanche, évoque des textiles usés, assemblés, rapiécés et prolongés au fil du temps. Les deux se rencontrent souvent sur un même objet, mais ne sont pas synonymes. Un motif régulier de sashiko n’est pas nécessairement une réparation et toutes les pièces boro ne portent pas un motif décoratif.`],
   ['Une histoire de ressources',`Dans plusieurs régions rurales japonaises des XIX<sup>e</sup> et début XX<sup>e</sup> siècles, vêtements et literie pouvaient être rapiécés pendant des années. Des étoffes de chanvre, puis de coton teint à l’indigo, étaient préservées et réemployées. Une zone fragilisée recevait un renfort, une pièce rapportée ou une nouvelle couche de tissu. Cette accumulation racontait l’économie du foyer et la valeur du travail textile, bien avant que les galeries d’art ne s’intéressent à ces surfaces aux bleus irréguliers.`],
   ['Ce que l’œil de la couturière remarque',`Regarde l’endroit puis l’envers : la superposition est-elle visible ? Les coutures traversent-elles toutes les épaisseurs ? Les rangées de points suivent-elles une ligne droite, un quadrillage ou le contour d’un morceau rapporté ? Les marques du temps ne sont pas de simples ornements : elles donnent des indices sur l’usage et les réparations. Aujourd’hui, la création contemporaine réinterprète librement ces gestes, parfois avec des tissus neufs ; l’inspiration moderne se distingue donc des objets historiques.`]
  ],
  vocab:[['Sashiko','Points avant pouvant renforcer ou décorer un textile.'],['Boro','Textile usé et réparé, composé parfois de multiples pièces.'],['Indigo','Colorant associé à de nombreux textiles de travail japonais.']],
  workshop:{title:'Une réparation visible sur une chute',minutes:'20 à 30 min',material:'Deux chutes de coton, une aiguille à main, du fil contrastant, une règle.',steps:['Poser une petite pièce de 6 × 6 cm sur une base de 12 × 12 cm, avec au moins 1 cm de recouvrement.','Fixer la pièce par des points avant autour de son bord, puis tracer trois lignes parallèles et les parcourir au point avant.','Retourner l’ouvrage pour vérifier la tenue des couches ; noter ce qui est régulier ou non.'],note:'C’est un exercice de réparation visible inspiré de principes de réemploi, pas une reproduction complète d’une méthode traditionnelle.'},
  photos:[
   photo('Boro textile from Japan, with sashiko.jpg','Étoffe boro japonaise indigo recousue, détail','Boro japonais : superpositions de tissu et points de reprise.','Karl Zetterström / Musées des cultures du monde de Suède','CC BY 4.0'),
   photo('Sashiko by volunteers, 2012 - Textile Museum of Canada - DSC00807.JPG','Panneau muséal avec nombreux motifs de sashiko','Motifs de sashiko réalisés en 2012, présentés au Textile Museum of Canada.','Daderot / Textile Museum of Canada','CC0'),
   photo('日本と米国の国旗を纏った日本女性-Sashiko Jacket MET DP330790.jpg','Dos d’une veste japonaise historique en coton bleu brodé de blanc','Veste japonaise, seconde moitié du XIXᵉ siècle, coton indigo quilté et brodé.','Metropolitan Museum of Art, n° 67.172.1','CC0')
  ],
  resources:[['V&A : Japanese boro bag et histoire du réemploi','https://www.vam.ac.uk/articles/make-your-own-japanese-boro-bag'],['Metropolitan Museum of Art : veste sashiko historique','https://www.metmuseum.org/art/collection/search/50805']]
 },
 {
  id:'bengale',country:'Bengale · Inde et Bangladesh',title:'Kantha : recycler les étoffes et broder des récits',era:'L’art domestique d’assembler les tissus usés',
  lead:'De vieux saris deviennent une couverture légère ; le fil parcourt le coton en petites ondulations, tandis que des fleurs, des animaux ou des scènes quotidiennes apparaissent à la surface.',
  sections:[
   ['Un quilt sans rembourrage épais',`Dans le Bengale historique, aujourd’hui partagé entre l’Inde et le Bangladesh, le <b>kantha</b> désigne des textiles domestiques constitués de plusieurs épaisseurs de coton usagé. D’anciens saris ou dhotis pouvaient être superposés, puis maintenus par de nombreuses lignes de <b>points avant</b>. Contrairement à certains quilts épais, la réalisation traditionnelle n’avait pas forcément de molleton ajouté. Le textile fini servait de couverture, de tapis, de linge de protection ou d’enveloppe pour un objet précieux.`],
   ['Quand les aiguilles dessinent',`Le piquage peut entourer les motifs en lignes concentriques, créant un effet de vague parfois appelé <i>echo quilting</i>. Les motifs brodés sont variés : fleurs, plantes, animaux, formes géométriques, bateaux, personnages, scènes religieuses ou issues de la vie quotidienne. Les couturières pouvaient récupérer des fils colorés directement dans les bordures des étoffes usées. La composition n’est pas seulement jolie : elle exprime un usage, une habileté et parfois une histoire familiale.`],
   ['Tradition et création actuelle',`Le terme <b>kantha</b> est également utilisé de nos jours pour désigner un style de broderie, y compris sur des supports neufs. Cette évolution ne doit pas faire oublier la fonction ancienne de recyclage et de couverture. Les collections du Victoria and Albert Museum montrent des ouvrages très simples mais aussi de véritables scènes figuratives, fruits d’un travail de couture patient et minutieux. Dans un même territoire culturel, les techniques, les couleurs et les usages pouvaient varier d’un foyer à l’autre.`]
  ],
  vocab:[['Kantha','Ouvrage domestique matelassé ou brodé de couches de tissu.'],['Point avant','Petit point régulier qui progresse sur le tissu.'],['Piquage en écho','Lignes de couture répétées autour d’un motif.']],
  workshop:{title:'Petit carré kantha d’observation',minutes:'25 à 35 min',material:'Deux ou trois chutes de coton déjà lavées, aiguille, fil à broder, crayon textile.',steps:['Assembler deux ou trois chutes d’environ 14 × 14 cm sans molleton pour obtenir une surface souple.','Dessiner une fleur ou un cercle au centre et coudre deux à quatre lignes de points avant autour de ce motif.','Comparer le recto et le verso, observer les petites ondulations et garder une note dans le carnet.'],note:'Exercice libre inspiré de la superposition et du point avant ; les kanthas historiques possèdent une diversité de motifs et de procédés bien plus vaste.'},
  photos:[
   photo('Kantha (Quilt) LACMA AC1994.131.1.jpg','Ancien quilt kantha du Bengale décoré de motifs brodés','Kantha de l’Est du Bengale, XIXᵉ siècle, coton et broderie.','Los Angeles County Museum of Art, AC1994.131.1','Domaine public'),
   photo('Kantha embroidery of bengal.jpg','Exemple photographique de broderie kantha du Bengale','Broderie kantha photographiée au Bengale : observe les lignes de points.','தீப்தி செந்தில், Wikimedia Commons','CC BY-SA 4.0')
  ],
  resources:[['V&A : Kantha, une tradition de quilting en Asie du Sud','https://www.vam.ac.uk/articles/kantha-a-south-asian-quilting-tradition'],['V&A : panorama des broderies indiennes','https://www.vam.ac.uk/articles/indian-embroidery']]
 },
 {
  id:'coree',country:'Corée',title:'Bojagi et jogakbo : quand les chutes deviennent lumière',era:'Le tissu d’emballage, entre utilité et composition',
  lead:'Derrière certains carrés de soie translucide, la lumière passe comme à travers un vitrail. Chaque rectangle de couleur s’ajuste à son voisin pour former une étoffe plus grande.',
  sections:[
   ['Bojagi : emballer et protéger',`Un <b>bojagi</b> est un tissu traditionnel coréen utilisé pour envelopper, transporter, couvrir ou protéger des objets. Il peut être brodé, uni, décoré ou constitué de plusieurs morceaux assemblés. Le <b>jogakbo</b> désigne plus précisément un assemblage de chutes formant une étoffe, souvent employée comme bojagi. Les deux mots ne désignent donc pas exactement la même chose. Les linges d’emballage étaient présents dans différentes sphères de la vie quotidienne et cérémonielle.`],
   ['L’ingéniosité de la dynastie Joseon',`Pendant la dynastie Joseon (1392–1910), la récupération des chutes issues de vêtements et d’autres ouvrages permettait de composer de nouveaux linges. Selon les disponibilités, les assemblages utilisaient du coton, du chanvre, de la ramie ou de la soie. Certains tissus fins laissent passer la lumière, accentuant les couleurs et la géométrie irrégulière. Ce que nous lisons aujourd’hui comme une composition abstraite pouvait alors être un objet utile, fabriqué à partir de petits restes soigneusement conservés.`],
   ['Des coutures visibles des deux côtés',`Certains jogakbo utilisent une couture rabattue très soignée, parfois décrite sous le terme <i>gekki</i>, qui permet d’obtenir un assemblage net au recto comme au verso. Ce détail compte, puisque le tissu d’emballage peut être regardé et manipulé de tous côtés. Au musée, compare les rectangles : sont-ils symétriques ? Est-ce la largeur des bandes, le contraste des couleurs ou le placement des coutures qui donne le rythme ? Les textiles contemporains prolongent cette tradition tout en inventant de nouvelles formes.`]
  ],
  vocab:[['Bojagi','Tissu coréen destiné à envelopper, couvrir ou transporter.'],['Jogakbo','Assemblage de petites chutes de textile formant un patchwork.'],['Ramie','Fibre végétale pouvant produire une étoffe légère.']],
  workshop:{title:'Un vitrail de chutes pour le patchwork',minutes:'30 à 45 min',material:'Quatre à six chutes de coton de couleurs différentes, fil, règle et fer à repasser.',steps:['Disposer les chutes sur la table, rectangles de tailles variées, jusqu’à former un carré de 20 × 20 cm environ.','Assembler progressivement par des coutures droites et repasser les marges pour limiter les surépaisseurs.','Observer le recto et le verso ; si tu disposes de tissus fins, place la pièce devant une fenêtre pour comparer la lumière.'],note:'Ce petit patchwork est une interprétation libre. Les coutures de jogakbo traditionnel demandent des finitions spécifiques ; une simple couture de machine n’en est pas la reproduction.'},
  photos:[
   photo('Patchwork Bojagi (Wrapping Cloth) MET DP158238.jpg','Bojagi coréen en soie composé de rectangles de couleurs','Bojagi en patchwork de soie, Corée, milieu du XXᵉ siècle.','Metropolitan Museum of Art, n° 2007.151','CC0'),
   photo('조각보-Patchwork wrapping cloth (jogakbo) MET DP158239.jpg','Autre exemple de jogakbo coréen géométrique','Jogakbo en patchwork, collection coréenne du Metropolitan Museum.','Metropolitan Museum of Art, n° 2007.152','CC0')
  ],
  resources:[['V&A : Jogakbo, le patchwork coréen traditionnel','https://www.vam.ac.uk/articles/jogakbo-traditional-korean-patchwork'],['LACMA : Bojagi, le tissu d’emballage coréen','https://unframed.lacma.org/2014/01/02/bojagi-the-korean-wrapping-cloth']]
 }
];
const enrichments={
 "japon": {
  "sections": [
   [
    "Une réparation qui se construit avec l’usage",
    "Une étoffe réparée invite à regarder plusieurs moments à la fois : le tissu d’origine, une première pièce de renfort, puis un nouvel accroc. Une réparation peut chevaucher une couture plus ancienne. Pour lire l’objet, cherche les bords des pièces et les différences d’usure, sans supposer que chaque détail a une signification décorative. Le panneau raconte surtout des décisions prises pour continuer à utiliser ce qui était disponible."
   ],
   [
    "Arrêter le fil : plusieurs réponses possibles",
    "L’artisan Atsushi Futatsuya explique que, dans son apprentissage du sashiko, des points se chevauchant pouvaient maintenir le fil sans nœud afin de conserver une surface douce des deux côtés. Il précise aussi qu’une pièce très abîmée peut nécessiter d’autres choix, y compris des nœuds. Ce témoignage décrit une pratique située : il ne transforme pas une préférence d’atelier en règle universelle. Dans ton exercice, compare la souplesse et la tenue d’une ligne avant de décider comment arrêter ton fil."
   ],
   [
    "Petit laboratoire de tension",
    "Sur une chute solide, trace trois lignes espacées. Couds la première en tirant le fil après chaque point, la deuxième en laissant beaucoup de mou, puis la troisième en lissant le tissu après quelques points. Pose le travail à plat : quelle ligne fronce ? Où le fil forme-t-il des boucles ? Cherche une tension qui maintient les couches sans les comprimer. Cet essai personnel prépare une réparation plus confortable et aide à comprendre ce que les photographies seules ne montrent pas."
   ]
  ],
  "resources": [
   [
    "Atsushi Futatsuya : finitions, nœuds et contexte du sashiko",
    "https://upcyclestitches.com/sashiko-boro-knots/"
   ]
  ],
  "videos": [
   {
    "title": "Sashiko, boro et arrêts du fil",
    "url": "https://upcyclestitches.com/sashiko-boro-knots/",
    "author": "Atsushi Futatsuya · Upcycle Stitches",
    "language": "Anglais · page avec vidéo et transcription en anglais",
    "look": "Observer l’endroit et l’envers, puis écouter pourquoi le choix de la finition dépend de l’état du tissu."
   }
  ]
 },
 "bengale": {
  "sections": [
   [
    "Un objet offert et transmis",
    "Le Mingei International Museum rappelle que les kanthas pouvaient accompagner un mariage ou être offerts à un enfant. Certains réunissent le travail de plusieurs générations. Une couverture est donc aussi une relation : quelqu’un choisit une étoffe, passe du temps à la coudre et la destine à une personne. Les dimensions et l’usage comptent autant que le motif. Un petit emballage d’objet précieux ne répond pas aux mêmes contraintes qu’une grande couverture."
   ],
   [
    "Les noms et les récits dans le textile",
    "L’historien de l’art Pratapaditya Pal décrit des kanthas portant des inscriptions : noms de destinataires, noms de créatrices ou indications liées aux figures représentées. Ces traces permettent parfois de relier l’ouvrage à une personne précise. Elles ne donnent toutefois pas automatiquement toute son histoire. Devant un objet de musée, distingue ce que la notice établit, ce que l’on voit et ce que l’on imagine. Un bateau ou une fleur peuvent appeler plusieurs lectures ; mieux vaut garder une question ouverte qu’inventer une signification."
   ],
   [
    "Composer son propre récit en points",
    "Choisis un souvenir très simple : une plante du jardin, une tasse partagée ou le contour d’une maison. Dessine une silhouette facile à suivre, puis réserve autour d’elle une zone de lignes répétées. Bâtis les épaisseurs avant de broder pour limiter leurs déplacements. Après quelques lignes, pose le carré à plat et vérifie qu’il reste souple. Note dans ton carnet le tissu choisi et le souvenir associé. C’est une proposition contemporaine personnelle, qui reprend le principe d’un textile raconté sans prétendre reproduire un kantha historique."
   ]
  ],
  "resources": [
   [
    "Mingei International Museum : usages et transmission des kanthas",
    "https://mingei.org/exhibitions/kantha/"
   ],
   [
    "Pratapaditya Pal : inscriptions et récits des kanthas",
    "https://www.asianart.com/articles/kantha/index.html"
   ]
  ],
  "videos": []
 },
 "coree": {
  "sections": [
   [
    "Imaginer le tissu autour d’un objet",
    "Le LACMA décrit des bojagi employés pour le transport, le rangement, la protection d’objets et la couverture des aliments. Pour comprendre leur forme, imagine le carré soulevé par ses coins autour d’un petit volume. Les coutures doivent accompagner les plis et rester agréables à manipuler. Une composition observée à plat change quand elle est nouée : des couleurs disparaissent, des bandes deviennent des diagonales. L’objet utile et l’image géométrique sont deux façons complémentaires de regarder le même textile."
   ],
   [
    "Des destinataires et des usages précis",
    "L’Asian Art Museum explique que beaucoup de bojagi étaient fabriqués pour une personne ou une fonction déterminée, notamment par une mère pour sa fille avant un mariage. Le nom peut varier avec l’usage : un sang-bo, par exemple, sert à couvrir une table. Le jogakbo est la forme assemblée à partir de petits morceaux. Ces distinctions évitent de réduire tous les bojagi à un seul style multicolore. Un tissu uni, une pièce brodée et un patchwork peuvent appartenir à cette même famille d’objets d’emballage."
   ],
   [
    "S’exercer à la couture avant de composer",
    "Avant d’assembler un grand panneau, prépare deux petits rectangles de même tissu et teste une couture dont les bords sont enfermés. Le tutoriel de Mimi Shim présente une finition ssamsol à la machine puis à la main. Observe l’ordre des replis et le repassage ; ne transpose pas automatiquement les marges de ton bloc de couverture. Garde cet échantillon à part, regarde-le à contre-jour et plie-le plusieurs fois. Tu pourras ensuite choisir une matière et une finition adaptées à un petit ouvrage, sans mélanger l’exercice avec les dimensions du programme annuel."
   ]
  ],
  "resources": [
   [
    "Asian Art Museum : objets, destinataires et noms des bojagi",
    "https://searchcollection.asianart.org/objects/18653/wrapping-cloth-bojagi"
   ],
   [
    "Mimi Shim : présentation de la couture ssamsol",
    "https://mimishim.squarespace.com/"
   ]
  ],
  "videos": [
   {
    "title": "Jogakbo : couture ssamsol à la machine et à la main",
    "url": "https://www.youtube.com/watch?v=EmMLHgMDCf0",
    "author": "Mimi Shim Studio",
    "language": "Anglais · démonstration des gestes",
    "look": "Comparer les deux méthodes et observer comment les bords sont enfermés avant de commencer un échantillon."
   }
  ]
 }
};
for(const item of cards){const extra=enrichments[item.id];item.sections.push(...extra.sections);item.resources.push(...extra.resources);item.videos=extra.videos;}
function render(){
 const imageCard=item=>'<figure class="travel-photo photo-card"><img loading="lazy" decoding="async" src="'+commons(item.file)+'" alt="'+item.alt+'"><figcaption class="photo-caption"><b>'+item.description+'</b><small>'+item.credit+' · '+item.license+'</small><a href="'+source(item.file)+'" target="_blank" rel="noopener noreferrer">Objet, photo et licence ↗</a></figcaption></figure>';
 return '<section class="section travel-intro"><span class="eyebrow">Voyage textile · 3 escales documentées</span><h2>Le monde vu à travers ses coutures</h2><p>Trois traditions, trois façons de réparer, transmettre et transformer la matière. Chaque article présente son histoire, des photographies d’objets identifiés, un vocabulaire et un petit atelier libre à partir de chutes.</p><p class="small">Ouvre l’escale qui t’intéresse. Les photographies historiques peuvent nécessiter Internet ; les textes restent accessibles hors connexion après installation.</p></section>'+
 cards.map((item,i)=>'<details class="card section travel-article" '+(i===0?'open':'')+' data-travel="'+item.id+'"><summary><span class="culture-label">Escale '+(i+1)+' · '+item.country+'</span><strong>'+item.title+'</strong><small>'+item.era+'</small></summary><div class="travel-content"><p class="travel-lead">'+item.lead+'</p>'+
 item.sections.map(([title,body])=>'<section class="travel-chapter"><h3>'+title+'</h3><p>'+body+'</p></section>').join('')+
 '<div class="travel-gallery">'+item.photos.map(imageCard).join('')+'</div>'+
 '<section class="travel-vocabulary"><h3>Petit lexique</h3><dl>'+item.vocab.map(([word,definition])=>'<div><dt>'+word+'</dt><dd>'+definition+'</dd></div>').join('')+'</dl></section>'+
 '<section class="travel-workshop"><span class="eyebrow">À essayer dans notre atelier</span><h3>'+item.workshop.title+'</h3><p><b>Durée indicative : '+item.workshop.minutes+'.</b> <b>Matériel :</b> '+item.workshop.material+'</p><ol>'+item.workshop.steps.map(x=>'<li>'+x+'</li>').join('')+'</ol><p class="small">'+item.workshop.note+'</p></section>'+
 (item.videos.length?'<section class="travel-videos"><h3>Voir les gestes en vidéo</h3><p class="small">Liens externes : connexion Internet nécessaire. Ouverture dans un nouvel onglet.</p>'+item.videos.map(video=>'<article><h4><a target="_blank" rel="noopener noreferrer" href="'+video.url+'">'+video.title+' ↗</a></h4><p class="small">'+video.author+' · '+video.language+'</p><p>'+video.look+'</p></article>').join('')+'</section>':'')+
 '<p class="travel-sources"><b>Pour aller plus loin :</b> '+item.resources.map(([label,url])=>'<a target="_blank" rel="noopener noreferrer" href="'+url+'">'+label+' ↗</a>').join(' · ')+'</p></div></details>').join('');
}
root.Fil52Travel={cards,render};
})(globalThis);
