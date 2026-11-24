(function(root){
'use strict';

const title='Une fleur de jardin anglais';
const pdf='./assets/une-fleur-de-jardin-anglais-a4.pdf';
const patternLink=`<a class="primary course-pattern-link" href="${pdf}" target="_blank" rel="noopener">Ouvrir le patron PDF A4</a>`;
const card={id:'royaume-uni',country:'Royaume-Uni',title:'Le patchwork et l’art des quilts britanniques'};
const source=(label,url)=>`<a href="${url}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`;
const va=source('Victoria and Albert Museum · Patchwork et matelassage','https://www.vam.ac.uk/articles/an-introduction-to-quilting-and-patchwork');
const chapters=[
 ['Patchwork et matelassage','Le <b>patchwork</b> assemble des morceaux de tissu pour former une surface. Le <b>matelassage</b> relie des épaisseurs par des points qui peuvent eux-mêmes dessiner un motif. Un <b>quilt</b> comporte généralement un dessus, un garnissage et un dos. Dans un quilt <i>wholecloth</i>, le dessus est fait d’une étoffe sans motif de patchwork, quitte à joindre plusieurs largeurs du même tissu.',va],
 ['Une couverture de soie datée de 1718','Le <i>Silk Patchwork Coverlet</i> compte parmi les plus anciens patchworks britanniques datés qui nous soient parvenus. Les 69 blocs sont assemblés sur des gabarits papier, avec des soies et quelques pièces de velours ou de peluche de laine. Le lin du revers est lui aussi assemblé. Les pièces du dessus dessinent des fleurs, des animaux et des motifs géométriques. Au centre figurent les initiales E. H. et la date 1718. L’identité de la personne qui l’a réalisé reste inconnue. Le réemploi comptait dans l’économie des foyers, et certains ouvrages emploient aussi des étoffes achetées pour l’occasion.',source('The Quilters’ Guild · Couverture de 1718','https://www.quiltmuseum.org.uk/collections/heritage/all/1700-1900/1718-coverlet.html')],
 ['L’essor du patchwork au XIXᵉ siècle','Le développement de l’industrie textile multiplie les cotonnades imprimées disponibles. Fleurs, rayures et petits motifs se prêtent aux jeux de répétition et de symétrie. On retrouve dans les collections des mosaïques d’hexagones, des étoiles, des damiers et des médaillons. À la fin du siècle, le <i>crazy patchwork</i> associe des pièces irrégulières, souvent soulignées de broderies.',va],
 ['Angleterre · L’assemblage sur papier','L’<i>English Paper Piecing</i> (EPP) consiste à replier le tissu autour de gabarits en papier, puis à réunir les bords repliés au surjet à la main. Des lettres et des imprimés réemployés comme gabarits donnent parfois des indices aux historiens. Six hexagones autour d’un septième forment une rosace, comme dans le projet proposé ci-dessous.',va],
 ['Nord-est de l’Angleterre · Le matelassage de Durham','Les quilts du nord de l’Angleterre présentent parfois un dessus uni où les points dessinent plumes, fleurs ou entrelacs. Amy Emms, formée par sa mère, a transmis cette tradition du <i>North Country quilting</i> au XXᵉ siècle.',source('Quilt Museum · Un ouvrage d’Amy Emms','https://www.quiltmuseum.org.uk/collections/wholecloth/amy-emms-wall-hanging.html')],
 ['Pays de Galles · Quilts et ressources locales','Les quilts gallois comprennent aussi bien des patchworks que des dessus unis. À Hendrehedog Fawr, dans le Carmarthenshire, la laine de la ferme a servi à tisser la flanelle d’un quilt daté d’environ 1860 à 1880. Ses points dessinent notamment des losanges, des spirales, des feuilles et des éventails.',source('Museum Wales · Quilt de Hendrehedog Fawr','https://museum.wales/collections/online/object/cb7a5d05-add5-350a-bdb0-7555066c0248/Quilt/?field0=string&field1=with_images&index=24&page=3&value0=quilt&value1=1')],
 ['Comté de Tyrone · La couverture d’Elizabeth Ferguson','En 1880, à Caledon dans l’actuelle Irlande du Nord, Elizabeth Ferguson réalise à l’adolescence une couverture de <i>crazy patchwork</i>. Soie, laine et velours y côtoient fleurs, oiseaux et insectes brodés.',source('Quilt Museum · Irish Crazy Patchwork Coverlet','https://www.quiltmuseum.org.uk/collections/heritage/irish-crazy-patchwork-coverlet.html')],
 ['Des ouvrages qui racontent une histoire','Entre 1842 et 1852, le maître tailleur R. James Williams assemble à Wrexham des milliers de pièces de laine foulée. Le <i>Wrexham Tailor’s Quilt</i> mêle des scènes bibliques et des réalisations de son époque, dont le pont suspendu de Menai et un train à vapeur sur le viaduc de Cefn.',source('Museum Wales · The Wrexham Tailor’s Quilt','https://museum.wales/blog/1377/The-Wrexham-Tailors-Quilt-1842-52/')],
 ['D’une rive de l’Atlantique à l’autre','Les savoir-faire apportés par des colons venus notamment d’Angleterre et des Pays-Bas ont participé à l’histoire du quilting en Amérique du Nord. Les ouvrages conservés témoignent de pratiques multiples, qui ont évolué selon les lieux et les générations.',va]
];
const steps=[
 ['Préparer les hexagones','Imprime à 100 % et vérifie le carré de 50 mm. Découpe sept gabarits papier sur les traits pleins. Découpe le tissu à 7 mm du bord de chaque gabarit, en suivant les pointillés du patron.'],
 ['Recouvrir les gabarits','Pose le papier sur l’envers du tissu. Replie les côtés autour du papier et maintiens chaque angle par quelques points de bâti dans les replis.'],
 ['Assembler au surjet','Place un pétale contre le cœur, endroit contre endroit. Aligne les bords et prends quelques fils de chaque repli avec de petits points de surjet. Laisse le papier libre.'],
 ['Former la fleur','Ajoute les autres pétales autour du cœur. Ferme les six coutures entre pétales voisins, y compris celle qui réunit le premier et le dernier.'],
 ['Retirer les papiers','Presse doucement la fleur, retire les fils de bâti si nécessaire et enlève les sept papiers. Garde les replis extérieurs en place.'],
 ['Appliquer la fleur','Centre la fleur sur le fond de 17 × 17 cm et bâtis-la. Couds son contour au point d’appliqué invisible en alternant une petite prise dans le fond et une prise dans le repli.'],
 ['Matelasser le bloc','Pose le dos envers vers le haut, puis le molleton et le dessus endroit vers le haut. Bâtis les trois épaisseurs. Couds au point avant à environ 3 mm de la fleur. Ajoute des lignes si nécessaire pour respecter l’espacement maximal indiqué pour ton molleton.'],
 ['Poser le biais','Égalise le bloc à 15 × 15 cm après le matelassage. Pose le biais en formant les angles, rabats-le au dos et fixe-le à petits points invisibles.']
];

function plate(file,alt,caption){
 const url='./assets/'+file+'.webp';
 return `<figure class="vietnam-tutorial-figure"><a href="${url}" target="_blank" rel="noopener noreferrer" aria-label="Agrandir la planche aquarellée"><img src="${url}" width="1055" height="1491" loading="lazy" decoding="async" alt="${alt}"></a><figcaption>${caption}</figcaption></figure>`;
}

function article(){
 return `<article class="card section travel-article" data-travel="royaume-uni">
 <header class="travel-article-heading"><span class="culture-label">Escale · Royaume-Uni</span><h2>${card.title}</h2></header>
 <div class="travel-content"><p class="travel-lead">Des cottages anglais aux fermes galloises, l’assemblage de pièces de tissu et le matelassage ont pris des formes très différentes selon les époques, les régions, les usages et les ressources des familles. Derrière ces couvertures se lisent des histoires de transmission, de commerce et de création.</p>
 ${chapters.map(([heading,body,reference])=>`<section class="travel-chapter"><h3>${heading}</h3><p>${body}</p><p class="small">${reference}</p></section>`).join('')}
 ${plate('patchwork-britannique','Aquarelle des traditions du patchwork et du matelassage en Angleterre, au pays de Galles et dans l’actuelle Irlande du Nord.','La carte situe les exemples abordés dans l’article. La vignette « 1718 » propose une évocation libre de la couverture de soie : la notice de la Quilters’ Guild montre l’ouvrage conservé. Le crazy patchwork est illustré par un exemple du Tyrone, parmi d’autres régions où il se pratique. Les quilts gallois peuvent aussi être en coton et présenter un dessus uni.')}
 <section class="travel-workshop"><h3>${title}</h3><p>Assemble une rosace de sept hexagones, puis applique-la sur un petit carré matelassé.</p><button type="button" class="primary" data-page="englishFlower">Voir le projet</button></section></div></article>`;
}

function project(status){
 return `<article class="card section travel-article"><header class="travel-article-heading"><h1>${title}</h1>${status}<p>Débutant · environ 2 à 3 heures · couture à la main · bloc fini de 15 × 15 cm</p></header>
 <div class="travel-content"><p>Six pétales fleuris, un cœur contrastant, un fond écru et une bordure assortie composent cette fleur inspirée des jardins anglais.</p>
 <section class="travel-chapter"><h2>Fournitures</h2><ul>
 <li>Six chutes de coton imprimé pour les pétales et une chute contrastante pour le cœur, chacune de 7 × 7 cm.</li>
 <li>Deux carrés de coton et un carré de molleton fin, chacun de 17 × 17 cm.</li>
 <li>Environ 70 cm de biais double pli de 12 mm une fois replié.</li>
 <li>Papier de 120 à 160 g/m², fil fin assorti, fil de matelassage, aiguille, ciseaux, épingles et règle.</li></ul></section>
 <section class="travel-chapter"><h2>Patron à imprimer</h2><p>Les sept gabarits papier ont un côté de 20 mm. Ils mesurent 40 mm de pointe à pointe et 34,641 mm entre plats. Les pointillés ajoutent 7 mm de marge au tissu. Contrôle le carré de 50 × 50 mm après impression à taille réelle.</p><div class="actions">${patternLink}</div></section>
 ${plate('fleur-de-jardin-anglais','Aquarelle en huit vignettes, de la découpe des sept hexagones à la finition du bloc matelassé.','À la vignette 4, les pièces sont ouvertes pour montrer la couture. Pour réaliser le surjet, place-les endroit contre endroit et saisis seulement quelques fils de chaque repli. À la vignette 5, ferme aussi les coutures entre pétales voisins. Le point d’appliqué de la vignette 7 complète les points listés au bas de la planche. Utilise le PDF pour découper à taille réelle.')}
 <section class="travel-chapter"><h2>Réalisation pas à pas</h2><ol>${steps.map(([heading,body])=>`<li><p><b>${heading}</b><br>${body}</p></li>`).join('')}</ol></section>
 <section class="travel-chapter"><h2>Variantes</h2><p>Applique la rosace sur un pique-épingles ou répète-la sur une housse de coussin. Pour un jardin de grand-mère, relie plusieurs rosaces par des hexagones de liaison. Pour un effet kaléidoscope, découpe les six pétales dans la même répétition de l’imprimé et oriente-les autour du cœur.</p><p>Les gabarits se réutilisent tant que leurs bords restent nets. En EPP, le tissu s’enroule autour de chaque gabarit. En <i>Foundation Paper Piecing</i>, les pièces se cousent sur un support selon des lignes tracées.</p></section>
 </div></article>`;
}
root.Fil52EnglishFlower={title,card,patternLink,article,project};
})(globalThis);
