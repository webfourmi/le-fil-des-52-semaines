/* Illustrations pédagogiques autonomes et fiches avancées des cours 2 à 6. */
(function(root){
'use strict';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rect=(x,y,w,h,fill,stroke='#65766b')=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="3" fill="'+fill+'" stroke="'+stroke+'" stroke-width="2"/>';
const line=(x,y,X,Y,dash='')=>'<line x1="'+x+'" y1="'+y+'" x2="'+X+'" y2="'+Y+'" stroke="#a15e4e" stroke-width="3" '+(dash?'stroke-dasharray="'+dash+'"':'')+'/>';
const label=(x,y,s)=>'<text x="'+x+'" y="'+y+'" font-family="sans-serif" font-size="15" fill="#334b40" text-anchor="middle">'+esc(s)+'</text>';
const A='#d3a190',B='#8eada0',C='#eedbc3',D='#738f80';
function diagram(w,patch){
 let shapes='',title=patch?'Schéma du bloc de patchwork n° '+w:'Schéma des gestes du projet couture n° '+w;
 if(patch){
  if(w===2){shapes=rect(205,15,95,190,A)+rect(300,15,95,190,B)+line(300,15,300,205,'5 4')+label(252,113,'A · clair')+label(348,113,'B · foncé')+label(300,232,'2 bandes verticales · bloc brut 21,5 × 21,5 cm');}
  if(w===3){shapes=rect(180,25,240,85,A)+rect(180,110,240,85,B)+line(180,110,420,110,'5 4')+label(300,220,'2 bandes horizontales · bloc brut 21,5 cm');}
  if(w===4){shapes=rect(180,24,240,180,A)+rect(245,67,110,95,B)+label(300,220,'Carré central + 4 bandes');}
  if(w===5){for(let r=0;r<3;r++)for(let c=0;c<3;c++)shapes+=rect(210+c*61,23+r*61,61,61,(r+c)%2===0?A:B);shapes+=label(301,225,'9 carrés alternés · équerrez à 21,5 cm');}
  if(w===6){shapes=rect(206,22,188,186,C)+
   '<polygon points="206,22 270,22 206,86" fill="'+A+'" stroke="#65766b" stroke-width="2"/>'+
   '<polygon points="394,22 330,22 394,86" fill="'+B+'" stroke="#65766b" stroke-width="2"/>'+
   '<polygon points="206,208 270,208 206,144" fill="'+B+'" stroke="#65766b" stroke-width="2"/>'+
   '<polygon points="394,208 330,208 394,144" fill="'+A+'" stroke="#65766b" stroke-width="2"/>'+
   label(301,226,'4 coins cousus en diagonale');}
 }else{
  if(w===2){
   // Vue des deux côtés du MÊME dessous de verre, une fois assemblé puis retourné.
   const flower=(x,y)=>'<g transform="translate('+x+' '+y+')"><circle r="9" fill="#c97c71" opacity=".9"/><circle cx="-8" cy="-3" r="7" fill="#e2a78e"/><circle cx="8" cy="-3" r="7" fill="#e2a78e"/><circle cx="0" cy="-9" r="7" fill="#e2a78e"/><circle r="4.5" fill="#fbe6b3"/></g>';
   shapes='<rect x="72" y="30" width="165" height="165" rx="23" fill="#fae8d9" stroke="#65766b" stroke-width="2"/>'+
    flower(112,73)+flower(196,76)+flower(150,140)+flower(105,170)+flower(211,151)+
    '<rect x="82" y="40" width="145" height="145" rx="14" fill="none" stroke="#875f53" stroke-width="2.3" stroke-dasharray="5 4"/>'+
    '<rect x="365" y="30" width="165" height="165" rx="23" fill="#85a99b" stroke="#65766b" stroke-width="2"/>'+
    '<rect x="375" y="40" width="145" height="145" rx="14" fill="none" stroke="#304e41" stroke-width="2.3" stroke-dasharray="5 4"/>'+
    '<path d="M259 105 H340 M331 96 L341 105 L331 114 M269 96 L259 105 L269 114" fill="none" stroke="#a15e4e" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>'+
    label(300,83,'Retourne-moi !')+
    label(154,220,'FACE A · coton imprimé')+
    label(447,220,'FACE B · coton uni')+
    label(301,244,'Un seul objet · deux faces utilisables');
  }
  if(w===3){shapes=rect(55,28,170,167,C)+label(138,219,'15 × 19 cm')+rect(263,52,140,125,A)+line(277,96,390,96,'7 4')+label(332,219,'bords repliés')+rect(444,70,115,90,B)+line(501,70,501,160,'7 4')+label(500,219,'ouverture croisée');}
  if(w===4){shapes=rect(38,93,223,64,A)+line(38,143,261,143,'6 4')+label(150,219,'45 × 10 cm → tube')+
   '<ellipse cx="434" cy="122" rx="102" ry="67" fill="'+B+'" stroke="#65766b" stroke-width="2"/>'+
   '<ellipse cx="434" cy="122" rx="59" ry="33" fill="#fff8ed" stroke="#fff8ed" stroke-width="3"/>'+
   label(430,219,'insérer élastique, fermer');}
  if(w===5){shapes=rect(95,32,149,157,C)+rect(280,32,149,157,A)+line(288,45,416,45,'6 4')+label(167,215,'2 faces · 13 × 16 cm')+label(355,215,'remplir puis fermer');}
  if(w===6){shapes=rect(83,28,150,173,A)+rect(267,28,150,173,B)+line(83,62,233,62,'5 4')+line(267,62,417,62,'5 4')+label(158,221,'2 faces · 22 × 27 cm')+label(341,221,'coulisse de 2 cm')+line(455,62,555,62,'5 4')+label(510,124,'2 cordons');}
 }
 if(!shapes)return '';
 return '<figure class="lesson-figure"><svg viewBox="0 0 600 250" role="img" aria-label="'+esc(title)+'" xmlns="http://www.w3.org/2000/svg">'+shapes+'</svg><figcaption>'+(patch&&w===2?'Bloc 2 : deux bandes de même largeur assemblées verticalement pour former un carré brut de 21,5 × 21,5 cm.':!patch&&w===2?'Vue du même dessous de verre aux coins arrondis : face A à motifs ou face B unie, au choix. Les surpiqûres sont visibles des deux côtés.':'Schéma de principe, non à l’échelle. Utilise les cotes indiquées dans le texte pour découper.')+'</figcaption></figure>';
}
function list(items,ordered=false){return '<'+(ordered?'ol':'ul')+'>'+items.map(s=>'<li>'+esc(s)+'</li>').join('')+'</'+(ordered?'ol':'ul')+'>';}
function renderPreparation(d,w){
 if(!d.objective)return '';
 const dSafety=d.safety?'<p class="lesson-caution"><b>À l’atelier :</b> '+esc(d.safety)+'</p>':'';
 const details=(d.prep||[]).map(s=>'<li>'+esc(s)+'</li>').join('');
 return '<section class="card section lesson-extra"><span class="eyebrow">Avant de sortir les ciseaux</span><h3>Ce que tu vas apprendre</h3><p>'+esc(d.objective)+'</p><p class="lesson-result"><b>Résultat attendu :</b> '+esc(d.result)+'</p>'+diagram(w,false)+'<h3>Petite préparation</h3><ul>'+details+'</ul>'+dSafety+'</section>';
}
function renderTroubleshooting(d,w){
 if(!d.mistakes?.length)return '';
 const rows=d.mistakes.map(([symptom,tip])=>'<details class="lesson-problem"><summary>'+esc(symptom)+'</summary><p>'+esc(tip)+'</p></details>').join('');
 const checkpoints=(d.checkpoint||[]).map(x=>'<li>'+esc(x)+'</li>').join('');
 const resources=(d.resources||[]).filter(x=>/^https:\/\//.test(x.url)).map(x=>'<a target="_blank" rel="noopener noreferrer" href="'+esc(x.url)+'">'+esc(x.title)+' ↗</a>').join(' · ');
 return '<section class="card section lesson-extra"><h3>Si cela ne se passe pas comme prévu…</h3><p>Ouvre la difficulté rencontrée pour trouver une correction.</p>'+rows+'<h3>Avant de déclarer mon ouvrage terminé</h3><ul class="lesson-checkpoints">'+checkpoints+'</ul>'+(resources?'<p class="small"><b>Ressources utiles :</b> '+resources+'</p>':'')+'</section>';
}
function patchStepChecklist(steps,w,checked){
 return '<div class="patch-steps" aria-label="Étapes du bloc '+w+'">'+(steps||[]).map((body,i)=>{
  const id=60000+w*100+i;
  return '<div class="step patch-step"><div class="stepnum">'+(i+1)+'</div><div class="patch-step-body"><label><input type="checkbox" data-toggle="steps" data-val="'+id+'" aria-label="Bloc '+w+' étape '+(i+1)+'" '+(checked.includes(id)?'checked':'')+'><span><b>Étape '+(i+1)+'</b><p>'+esc(body)+'</p></span></label></div></div>';
 }).join('')+'</div>';
}
function renderPatchwork(d,w,p,done,checkedSteps=[]){
 if(w===2)return renderSecondPatchwork(p,done,checkedSteps);
 if(!d.patchCuts?.length)return '';
 const complete=done.includes(w);
 return '<section class="card section lesson-extra" data-lesson-patch="'+w+'">'+
 '<span class="eyebrow">Un carré, une histoire · Bloc n° '+w+'</span><h3>'+esc(d.patchworkTitle)+'</h3>'+
 '<p>Un bloc <b>fini de 20 × 20 cm</b> après son assemblage dans la couverture. Conserve <b>21,5 × 21,5 cm avant assemblage</b> pour tenir compte des marges de 7,5 mm.</p>'+
 diagram(w,true)+
 (w===3?'<p class="eyebrow">✓ Bloc 3 · Validé 100 %</p><p><a class="primary course-pattern-link" href="./assets/patchwork-03-gabarit.html" data-pattern-preview="patchwork3">Consulter le patron A4 du bloc 3</a></p>':'')+
 (w===3?"<figure class=\"lesson-figure\"><img style=\"width:min(100%,380px);height:auto;border-radius:12px\" src=\"data:image/avif;base64,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\" alt=\"Photographie réelle du bloc 3 : bande supérieure écrue à petites fleurs dorées et bande inférieure rouge ornée de sapins de Noël\" loading=\"lazy\" decoding=\"async\"><figcaption>Notre bloc 3 après l’assemblage des deux bandes horizontales, photographie personnelle.</figcaption></figure>" : '')+
 (w===4?'<p><a class="primary course-pattern-link" href="./assets/patchwork-04-gabarit.html" data-pattern-preview="patchwork4">Consulter le patron A4 du bloc 4</a> <a class="secondary" href="./assets/patchwork-04-gabarit.pdf" target="_blank" rel="noopener">Télécharger le PDF</a></p>':'')+
 '<h4>Découpe pour un seul bloc</h4>'+list(d.patchCuts)+
 '<h4>Montage du bloc · étapes à cocher</h4>'+patchStepChecklist(d.patchSteps,w,checkedSteps)+
 '<div class="tip"><b>Astuce de précision :</b> '+esc(d.patchTip)+'</div>'+
 '<button class="secondary lesson-patch-done" type="button" data-quilt-person="'+esc(p)+'" data-quilt-block="'+w+'" aria-pressed="'+(complete?'true':'false')+'">'+(complete?'✓ Bloc n° '+w+' terminé · décocher':'□ Marquer mon bloc n° '+w+' comme terminé')+'</button>'+
 '<p class="small">Cette coche est personnelle et se retrouvera aussi dans ta couverture personnelle.</p></section>'+root.Fil52LessonPhotos.renderPatchwork(w);
}

/* Cours 2 : même niveau de détail que le bloc 1. Les identifiants historiques
   60200, 60201 et 60202 gardent leur sens pour préserver les coches existantes. */
function renderSecondPatchwork(p,done,checkedSteps=[]){
 const complete=done.includes(2);
 const tasks=[
  [60203,'Choisir et préparer les deux tissus','Prends deux cotons tissés non extensibles de poids comparable, l’un clair, l’autre foncé ou imprimé. Deux chutes suffisent, à condition qu’elles permettent chacune de couper une bande de 11,5 × 21,5 cm. Lave si nécessaire, sèche et repasse à plat. Repère l’endroit de chaque tissu.'],
  [60204,'Imprimer et vérifier le gabarit','Ouvre le gabarit A4 ci-dessous. Imprime à 100 %, sans « Adapter à la page » et sans mise à l’échelle. Mesure le carré témoin : il doit faire exactement 5 × 5 cm. Puis contrôle le rectangle extérieur : 11,5 × 21,5 cm. Seul le trait plein est un trait de coupe : ne coupe ni les pointillés de marge ni le carré témoin.'],
  [60205,'Tracer et couper deux bandes identiques','Sur l’envers de chaque tissu, reporte le rectangle extérieur une fois, en respectant si possible le droit-fil. Coupe une bande dans le tissu A et une dans le tissu B. Contrôle leur largeur de 11,5 cm, leur longueur de 21,5 cm et leurs angles droits. Les marges de couture de 7,5 mm sont déjà incluses : ne les ajoute pas.'],
  [60200,'Disposer les bandes puis les placer endroit contre endroit','Pose les deux bandes côte à côte, dans le sens de la hauteur, tissu A à gauche et tissu B à droite, pour visualiser le futur carré. Rabats la bande B sur A, <b>endroit contre endroit</b>, en superposant leurs grands bords de 21,5 cm. Aligne les extrémités et maintiens avec quelques pinces ou épingles sans étirer.'],
  [60201,'Tester et piquer la couture centrale','Sur deux chutes, règle la machine au point droit (longueur indicative de 2 à 2,5 mm) et teste une marge de <b>7,5 mm</b>, mesurée à la règle. Le bord du pied n’est pas forcément à 7,5 mm : trace la ligne sur l’envers si besoin. Pique sur toute la longueur de 21,5 cm, retire les épingles avant le pied et ne tire pas le tissu. Arrête proprement les extrémités.'],
  [60206,'Ouvrir et repasser sans déformer','Après la piqûre, déplie le bloc et retourne-le pour travailler <b>sur l’envers</b>. Écarte délicatement les deux marges de la couture centrale, une à gauche et l’autre à droite : <b>ouvre la couture au fer</b>, sans rabattre les deux marges du même côté. Si le tissu risque de lustrer, interpose une pattemouille en coton clair légèrement humidifiée et bien essorée. Presse sans faire glisser le fer et laisse refroidir à plat. Ne surpique pas le contour et ne replie pas les bords bruts : ils serviront à assembler la couverture.'],
  [60202,'Mesurer le vrai carré obtenu','Mesure le bloc à plat, après refroidissement : <b>21,5 × 21,5 cm</b>, marges extérieures comprises. Contrôle les quatre angles droits et la couture verticale, droite et parallèle aux bords. Calcul : 11,5 + 11,5 − 2 × 0,75 = 21,5 cm. Une fois intégré dans la couverture, le bloc présentera 20 × 20 cm visibles.'],
  [60207,'Photographier et ranger le bloc','Photographie ton carré, de préférence bien à plat et de face, puis ajoute-le si tu le souhaites à ton journal de patchwork. Range-le sans le retailler, avec une étiquette « Bloc 2 ». Quand tu es satisfait du résultat, utilise le bouton « Marquer mon bloc n° 2 comme terminé ». Cette coche est personnelle.']
 ];
 const stepImages={
  60205:[['etape-1-decoupe.webp','Découper deux rectangles de 11,5 × 21,5 cm dans deux tissus contrastants']],
  60200:[['etape-2-disposition.webp','Prévisualiser les bandes côte à côte'],['etape-3-superposition.webp','Superposer les bandes endroit contre endroit, puis pincer le grand côté']],
  60201:[['etape-4-couture.webp','Piquer à 7,5 mm sur le grand bord des bandes superposées']],
  60206:[['etape-5-repassage.webp','Déplier et coucher la couture vers le tissu imprimé']],
  60202:[['etape-6-controle.webp','Contrôler le carré brut de 21,5 × 21,5 cm']]
 };
 const photo=(file,caption)=>'<figure class="patchwork-two-photo"><button type="button" class="patchwork-two-photo-open" data-patch2-zoom aria-label="Agrandir l’illustration : '+esc(caption)+'"><img loading="lazy" decoding="async" src="./assets/patchwork-02/'+esc(file)+'" alt="'+esc(caption)+'" width="950" height="1187"></button><figcaption>'+esc(caption)+'</figcaption></figure>';
 const steps=tasks.map(([id,title,body],i)=>'<li><label class="patch-step-label"><input type="checkbox" data-toggle="steps" data-val="'+id+'" aria-label="Bloc 2 étape '+(i+1)+'" '+(checkedSteps.includes(id)?'checked':'')+'><span><h4>'+esc(title)+'</h4><p>'+body+'</p></span></label>'+((stepImages[id]||[]).length?'<div class="patchwork-two-step-photos">'+stepImages[id].map(([file,caption])=>photo(file,caption)).join('')+'</div>':'')+'</li>').join('');
 return `<section class="card section lesson-extra patchwork-two" aria-label="Tutoriel détaillé du bloc 2">
 <span class="eyebrow">Fiche technique du n° 02 · pour un seul bloc</span>
 <h2>Deux bandes verticales</h2>
 <figure class="patchwork-two-cover">
  <button type="button" class="patchwork-two-photo-open" data-patch2-zoom aria-label="Agrandir l’illustration d’ouverture du bloc 2"><img loading="lazy" decoding="async" width="950" height="1187" src="./assets/patchwork-02/illustration-bloc.webp" alt="Illustration de carnet créatif : deux bandes verticales et un carré de patchwork de 21,5 cm"></button>
  <figcaption>Notre inspiration : deux tissus contrastants pour former un carré de patchwork.</figcaption>
 </figure>
 <p>Avec seulement deux rectangles, tu vas réaliser un carré bicolore parfaitement droit. Ce bloc prolonge le damier n° 1 : même marge de couture de 7,5 mm, mais un seul assemblage à réaliser. Compte environ 30 à 45 minutes pour mesurer, couper, coudre et repasser soigneusement.</p>
 <div class="grid2"><div class="info"><b>À découper pour un seul bloc</b><br>1 bande A de <b>11,5 × 21,5 cm</b> et 1 bande B de <b>11,5 × 21,5 cm</b>. Choisis deux tissus contrastants ; toutes les marges sont comprises.</div><div class="info"><b>Résultat attendu</b><br>1 carré <b>brut de 21,5 × 21,5 cm</b>, avec une couture au milieu. La partie visible dans la couverture mesurera <b>20 × 20 cm</b>.</div></div>
 <h3>Le matériel à préparer</h3>
 <ul>
 <li>Deux coupons de coton tissé non extensible, clair et foncé ou deux motifs contrastants, assez grands pour découper 11,5 × 21,5 cm dans chacun ; des chutes de récupération conviennent.</li>
 <li>Fil assorti, canette, aiguille universelle 80/12 pour un coton courant, pied standard et machine à coudre Janome Cherry 21.</li>
 <li>Règle, équerre ou règle patchwork, crayon textile effaçable, ciseaux à tissu ou cutter rotatif avec règle et tapis adapté.</li>
 <li>Épingles ou pinces, fer à repasser, surface protégée et gabarit A4 du bloc 2.</li>
 </ul>
 <p class="tip"><b>Important :</b> les dimensions de coupe comprennent déjà la marge de <b>7,5 mm</b>. Pour l’assemblage central, tu couds sur le grand côté des bandes, pas sur leur petit côté. Ne reprends pas la marge de 1 cm des cours de couture.</p>
 <h3>Disposition avant couture</h3>
 <p>Sur l’endroit, la bande <b>A est à gauche</b> et la bande <b>B à droite</b>, avant superposition. Les illustrations montrent les gestes en gros plan ; les dimensions de coupe et la marge de 7,5 mm sont données dans le gabarit et les explications. Le bloc assemblé doit être <b>carré</b>.</p>
 <h3>Patron à taille réelle : gabarit A4 du bloc 2</h3>
 <p>Le patron comporte <b>un rectangle de 11,5 × 21,5 cm à reproduire deux fois</b>, les repères de couture à 7,5 mm et un carré témoin de 5 × 5 cm. Aucun assemblage de feuilles n’est nécessaire. Les traits intérieurs sont des repères, pas des pièces à découper.</p>
 <div class="actions"><a class="primary course-pattern-link" href="./assets/patchwork-02-gabarit.html" data-pattern-preview="patchwork2" rel="noopener noreferrer">⎙ Imprimer gabarit A4</a><a class="secondary" href="./assets/patchwork-02-gabarit.html" target="_blank" rel="noopener noreferrer">Ouvrir la planche seule ↗</a></div>
 <h3>Le montage, pas à pas</h3><ol class="patchwork-one-steps">${steps}</ol>
 <h3>Si le résultat ne correspond pas</h3>
 <details class="lesson-problem"><summary>Le bloc est trop étroit ou trop large</summary><p>Mesure les deux bandes d’origine et la marge réellement piquée. Au-delà de 7,5 mm, tu perds de la largeur ; en deçà, le carré devient trop grand. Découds et recommence la couture si la coupe est juste. Ne retaille pas un bloc trop petit.</p></details>
 <details class="lesson-problem"><summary>La couture centrale est de travers</summary><p>Vérifie que les grands bords ont été bien alignés, sans décalage, et que les coins sont droits. Découds si nécessaire, rebâtis et repique en guidant le tissu sans tirer. Trace un trait de couture à 7,5 mm pour retrouver une ligne régulière.</p></details>
 <details class="lesson-problem"><summary>Les bords ondulent après repassage</summary><p>Laisse refroidir à plat. Repose le fer en le soulevant plutôt qu’en le faisant glisser ; ne tire pas les bandes. Si les tissus n’ont pas le même poids ou le même retrait, utilise deux chutes plus semblables pour l’essai suivant.</p></details>
 <h3>Avant de ranger ton deuxième carré</h3>
 <ul class="lesson-checkpoints"><li>Les deux tissus forment un carré avec une seule ligne de couture verticale.</li><li>Le bloc mesure 21,5 × 21,5 cm avec quatre angles droits, sans plis ni déformation.</li><li>Le contour reste brut ; les marges extérieures de 7,5 mm sont réservées à la couverture.</li><li>Le gabarit imprimé a été vérifié grâce au carré témoin de 5 × 5 cm.</li></ul>
 <div class="actions"><a class="primary course-pattern-link" href="./assets/patchwork-02-gabarit.html" data-pattern-preview="patchwork2">⎙ Imprimer gabarit A4</a><button class="secondary lesson-patch-done" type="button" data-quilt-person="${esc(p)}" data-quilt-block="2" aria-pressed="${complete?'true':'false'}">${complete?'✓ Bloc n° 2 terminé · décocher':'□ Marquer mon bloc n° 2 comme terminé'}</button></div>
 <p class="small">Le gabarit est celui d’un seul ouvrage, et ta progression est conservée dans ton carnet personnel. Le cours reste en cours d’écriture jusqu’à validation éditoriale.</p>
 </section>${root.Fil52LessonPhotos.renderPatchwork(2)}`;
}

function renderFirstPatchwork(p,done,checkedSteps=[]){
 const complete=done.includes(1);
 const html=`<section class="card section lesson-extra patchwork-one" aria-label="Tutoriel détaillé du bloc 1"><span class="eyebrow">Fiche technique du n° 01 · pour un seul bloc</span><h2>Le damier à quatre carrés</h2><p>Tu vas assembler quatre petits carrés pour obtenir un damier : deux tissus clairs et deux tissus foncés. Prévois environ 45 à 60 minutes pour ce premier essai, en prenant le temps de mesurer et de repasser.</p>
 <div class="grid2"><div class="info"><b>À découper</b><br>4 carrés de 11,5 × 11,5 cm : 2 clairs et 2 foncés. Les marges sont déjà comprises.</div><div class="info"><b>À conserver après couture</b><br>Un bloc de 21,5 × 21,5 cm, marges extérieures comprises. Il mesurera 20 × 20 cm une fois cousu dans la couverture.</div></div>
 <h3>Le matériel à préparer</h3><ul><li>Deux cotons tissés non extensibles, de poids proche : une chute claire et une chute foncée. Évite le jersey pour débuter.</li><li>Fil assorti, aiguille universelle adaptée au coton (80/12 pour un coton courant), canette et pied standard.</li><li>Règle graduée, crayon textile, ciseaux à tissu ou matériel de coupe habituel, épingles ou pinces.</li><li>Fer et surface de repassage. Si tu utilises un cutter rotatif, protège la table avec un tapis de coupe et referme la lame après chaque coupe.</li></ul>
 <p class="tip"><b>Le repère essentiel : 7,5 mm.</b> Toutes les coutures de ce bloc se font à 7,5 mm du bord, soit 0,75 cm. Ne rajoute pas cette marge aux carrés de 11,5 cm et ne les couds pas à 1 cm comme le marque-page.</p>
 <h3>Disposition avant couture</h3><figure class="lesson-figure"><svg viewBox="0 0 560 280" role="img" aria-label="Damier vu sur l’endroit : A clair en haut à gauche et en bas à droite ; B foncé en haut à droite et en bas à gauche." xmlns="http://www.w3.org/2000/svg"><rect x="160" y="12" width="110" height="110" fill="#f2e2c7" stroke="#4c6255"/><rect x="270" y="12" width="110" height="110" fill="#567563" stroke="#4c6255"/><rect x="160" y="122" width="110" height="110" fill="#567563" stroke="#4c6255"/><rect x="270" y="122" width="110" height="110" fill="#f2e2c7" stroke="#4c6255"/><g text-anchor="middle" font-family="sans-serif" font-size="17"><text x="215" y="75" fill="#263e30">A · clair</text><text x="325" y="75" fill="white">B · foncé</text><text x="215" y="185" fill="white">B · foncé</text><text x="325" y="185" fill="#263e30">A · clair</text><text x="270" y="263" fill="#263e30">Rangée 1 : A–B · Rangée 2 : B–A</text></g></svg><figcaption>Schéma vu sur l’endroit, non à l’échelle. Les lettres permettent de repérer les tissus sans se fier uniquement à leur couleur.</figcaption></figure>
 <h3>Le montage, pas à pas</h3><ol class="patchwork-one-steps">
 <li><h4>Préparer les tissus</h4><p>Lave les tissus si leur retrait au lavage est inconnu, laisse-les sécher puis repasse-les. Le tissu doit être plat avant de mesurer. Repère l’endroit (la face que tu veux voir) et l’envers. Si les deux faces sont identiques, choisis une face et marque discrètement l’envers au crayon effaçable.</p></li>
 <li><h4>Tracer et couper les quatre carrés</h4><p>Sur l’envers, trace deux carrés de 11,5 cm de côté dans chaque tissu, avec des angles droits. Aligne si possible les côtés sur les fils du tissu. Coupe sur le trait puis mesure chaque pièce dans les deux sens. Une petite erreur répétée à chaque pièce se retrouve au centre du bloc : corrige la coupe avant de coudre.</p></li>
 <li><h4>Installer le damier et le guide de couture</h4><p>Dispose les pièces à plat comme sur le schéma : clair–foncé en haut, foncé–clair en bas. Photographie éventuellement cette disposition pour t’en souvenir. Sur une chute de même épaisseur, teste le point droit, longueur d’essai 2 à 2,5 mm, à vitesse lente. Mesure la distance entre la couture et le bord : elle doit être de 7,5 mm. Tu peux tracer la ligne de couture sur l’envers pour guider ce premier bloc ; le bord du pied n’indique pas forcément cette distance.</p></li>
 <li><h4>Assembler la première rangée</h4><p>Rabats le carré foncé de droite sur le carré clair de gauche, <b>endroit contre endroit</b>, comme si tu fermais un livre. Aligne leurs bords et maintiens-les. Pique le bord vertical de droite à 7,5 mm, du début à la fin. Retire chaque épingle avant que l’aiguille l’atteigne. Guide sans tirer et sécurise les extrémités par quelques petits points arrière. Ouvre : tu dois retrouver clair à gauche, foncé à droite.</p></li>
 <li><h4>Assembler la deuxième rangée</h4><p>Repars de la disposition foncé–clair. Rabats de nouveau le carré de droite sur celui de gauche, endroit contre endroit, et couds le bord droit à 7,5 mm. Ouvre et vérifie l’alternance. Chaque rangée mesure maintenant <b>21,5 cm de large et 11,5 cm de haut</b> : 11,5 + 11,5 − 1,5 = 21,5 cm.</p></li>
 <li><h4>Repasser les coutures des rangées</h4><p>Pose brièvement le fer sur la couture fermée, puis ouvre les pièces. Couche les deux marges ensemble vers le tissu foncé : vers la droite pour la rangée du haut et vers la gauche pour celle du bas, vues sur l’endroit. Pose et soulève le fer sans le faire glisser pour ne pas déformer les carrés. Les marges vont ainsi dans des sens opposés, ce qui aide à emboîter les coutures au centre.</p></li>
 <li><h4>Faire coïncider le croisement central</h4><p>Dispose à nouveau les deux rangées à plat. Rabats celle du haut sur celle du bas, endroit contre endroit, de façon que leurs bords qui se touchaient au milieu se retrouvent superposés. Fais correspondre les coutures centrales : les marges opposées peuvent se caler l’une contre l’autre. Épingle ce croisement puis les extrémités, sans étirer. Pour te rassurer, bâtis quelques points autour du centre à la main, ouvre pour vérifier l’alignement, puis replie.</p></li>
 <li><h4>Coudre les rangées et repasser</h4><p>Pique le bord d’assemblage entier à 7,5 mm. Retire les épingles au fur et à mesure et sécurise les extrémités. Ouvre pour contrôler le centre avant le repassage final. Retire le bâti s’il y en a un. Couche la dernière marge d’un côté et repasse en soulevant le fer. À cette étape, <b>ne surpique pas le contour et ne replie pas les bords extérieurs</b> : ils serviront à assembler les prochains blocs.</p></li>
 <li><h4>Mesurer, contrôler et conserver</h4><p>Mesure le bloc à plat, sans tirer : 21,5 × 21,5 cm. Vérifie les quatre angles droits, les bords et le croisement central. Conserve 7,5 mm de tissu tout autour pour la future couture de la couverture ; ne retaille surtout pas à 20 cm. Une fois satisfait, photographie ton carré pour ton journal, range-le à plat avec une étiquette « Bloc 1 » et marque-le comme terminé ci-dessous.</p></li></ol>
 <h3>Si le résultat ne correspond pas</h3>
 <details class="lesson-problem"><summary>Mon bloc est trop petit</summary><p>Vérifie d’abord les quatre coupes, puis la marge réellement cousue. Des coutures plus larges que 7,5 mm réduisent le bloc. Ne l’étire pas pour atteindre la cote et ne réduis pas les autres blocs pour compenser. Découds la couture concernée et reprends-la avec le bon repère si les pièces le permettent ; sinon, refais la pièce trop petite.</p></details>
 <details class="lesson-problem"><summary>Le centre forme une marche</summary><p>Découds seulement quelques centimètres de la dernière couture autour du centre. Replace les coutures des rangées face à face, emboîte les marges et bâtis pour contrôler. Reprends la couture en chevauchant légèrement les points restés en place.</p></details>
 <details class="lesson-problem"><summary>Le bloc gondole ou dépasse la dimension</summary><p>Laisse-le refroidir à plat après un repassage sans glissement. Vérifie les marges et les coupes. Une marge trop étroite peut expliquer un bloc trop grand. Corrige la couture en cause avant de retailler ; ne coupe que de minuscules fils ou irrégularités si le bloc reste bien carré à 21,5 cm. Un bloc plus petit ne se répare pas en le retaillant.</p></details>
 <h3>Avant de ranger mon premier carré</h3><ul class="lesson-checkpoints"><li>Les quatre pièces alternent clair et foncé, et se rejoignent au centre.</li><li>Le bloc est plat, carré et mesure 21,5 × 21,5 cm.</li><li>Les bords restent bruts, avec les marges nécessaires pour obtenir 20 × 20 cm dans la couverture.</li></ul>
 <div class="actions"><button class="primary" data-page="print">Imprimer le gabarit →</button><button class="secondary lesson-patch-done" type="button" data-quilt-person="${esc(p)}" data-quilt-block="1" aria-pressed="${complete?'true':'false'}">${complete?'✓ Bloc n° 1 terminé · décocher':'□ Marquer mon bloc n° 1 comme terminé'}</button></div><p class="small">Le gabarit s’imprime à 100 %. Vérifie son carré de contrôle de 5 cm avant de couper. La coche reste personnelle et se retrouve dans ta couverture.</p></section>${root.Fil52LessonPhotos.renderPatchwork(1)}`;
 return html.replace(/(<ol class="patchwork-one-steps">)([\s\S]*?)(<\/ol>)/,(_,open,items,close)=>{
  let i=0;
  const decorated=items.replace(/<li>(<h4>[\s\S]*?<\/h4><p>[\s\S]*?<\/p>)<\/li>/g,(_,body)=>{
   const id=60100+i++;
   return '<li><label class="patch-step-label"><input type="checkbox" data-toggle="steps" data-val="'+id+'" aria-label="Bloc 1 étape '+i+'" '+(checkedSteps.includes(id)?'checked':'')+'><span>'+body+'</span></label></li>';
  });
  return open+decorated+close;
 });
}

/* Agrandissement des illustrations du bloc 2 sans modifier les photographies personnelles. */
let patch2Dialog;
document.addEventListener('click',event=>{
 const opener=event.target.closest('[data-patch2-zoom]');if(!opener)return;
 const img=opener.querySelector('img');if(!img||!img.currentSrc)return;
 if(!patch2Dialog){
  patch2Dialog=document.createElement('dialog');patch2Dialog.className='patchwork-two-dialog';patch2Dialog.setAttribute('aria-label','Illustration du cours de patchwork 2 agrandie');
  document.body.append(patch2Dialog);
  patch2Dialog.addEventListener('click',e=>{
   if(e.target===patch2Dialog||e.target.closest('[data-close-patch2]'))patch2Dialog.close();
   const zoom=e.target.closest('[data-toggle-patch2-zoom]');if(zoom){const active=patch2Dialog.classList.toggle('zoom-full');zoom.textContent=active?'Ajuster à l’écran':'Zoom 100 %';}
  });
 }
 patch2Dialog.classList.remove('zoom-full');
 patch2Dialog.innerHTML='<div class="patchwork-two-dialog-tools"><button type="button" class="secondary" data-close-patch2>Fermer</button><button type="button" class="secondary" data-toggle-patch2-zoom>Zoom 100 %</button></div><img src="'+esc(img.getAttribute('src'))+'" alt="'+esc(img.alt)+'">';
 patch2Dialog.showModal();
 patch2Dialog.querySelector('[data-close-patch2]').focus();
});

root.Fil52LessonGuides={renderFirstPatchwork,renderPreparation,renderTroubleshooting,renderPatchwork,diagram};
})(globalThis);
