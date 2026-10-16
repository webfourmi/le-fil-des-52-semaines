/* Illustrations pédagogiques autonomes et fiches avancées des cours 2 à 6. */
(function(root){
'use strict';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rect=(x,y,w,h,fill,stroke='#65766b')=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="3" fill="'+fill+'" stroke="'+stroke+'" stroke-width="2"/>';
const line=(x,y,X,Y,dash='')=>'<line x1="'+x+'" y1="'+y+'" x2="'+X+'" y2="'+Y+'" stroke="#a15e4e" stroke-width="3" '+(dash?'stroke-dasharray="'+dash+'"':'')+'/>';
const label=(x,y,s)=>'<text x="'+x+'" y="'+y+'" font-family="sans-serif" font-size="15" fill="#334b40" text-anchor="middle">'+esc(s)+'</text>';
const A='#d3a190',B='#8eada0',C='#eedbc3',D='#738f80';
function diagram(w,patch){
 let shapes='',title=patch?'Schéma du bloc de patchwork, semaine '+w:'Schéma des gestes du projet couture, semaine '+w;
 if(patch){
  if(w===2){shapes=rect(175,25,126,170,A)+rect(301,25,126,170,B)+line(301,25,301,195,'5 4')+label(301,220,'2 bandes verticales · bloc brut 21,5 cm');}
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
  if(w===2){shapes=rect(55,42,150,150,A)+rect(225,42,150,150,B)+label(131,218,'2 carrés 12 × 12 cm')+label(300,218,'puis piquer à 1 cm');shapes+=rect(418,63,125,125,C)+line(433,75,528,75,'6 4')+label(480,218,'retourner / surpiquer');}
  if(w===3){shapes=rect(55,28,170,167,C)+label(138,219,'15 × 19 cm')+rect(263,52,140,125,A)+line(277,96,390,96,'7 4')+label(332,219,'bords repliés')+rect(444,70,115,90,B)+line(501,70,501,160,'7 4')+label(500,219,'ouverture croisée');}
  if(w===4){shapes=rect(38,93,223,64,A)+line(38,143,261,143,'6 4')+label(150,219,'45 × 10 cm → tube')+
   '<ellipse cx="434" cy="122" rx="102" ry="67" fill="'+B+'" stroke="#65766b" stroke-width="2"/>'+
   '<ellipse cx="434" cy="122" rx="59" ry="33" fill="#fff8ed" stroke="#fff8ed" stroke-width="3"/>'+
   label(430,219,'insérer élastique, fermer');}
  if(w===5){shapes=rect(95,32,149,157,C)+rect(280,32,149,157,A)+line(288,45,416,45,'6 4')+label(167,215,'2 faces · 13 × 16 cm')+label(355,215,'remplir puis fermer');}
  if(w===6){shapes=rect(83,28,150,173,A)+rect(267,28,150,173,B)+line(83,62,233,62,'5 4')+line(267,62,417,62,'5 4')+label(158,221,'2 faces · 22 × 27 cm')+label(341,221,'coulisse de 2 cm')+line(455,62,555,62,'5 4')+label(510,124,'2 cordons');}
 }
 if(!shapes)return '';
 return '<figure class="lesson-figure"><svg viewBox="0 0 600 250" role="img" aria-label="'+esc(title)+'" xmlns="http://www.w3.org/2000/svg">'+shapes+'</svg><figcaption>Schéma de principe, non à l’échelle. Utilise les cotes indiquées dans le texte pour découper.</figcaption></figure>';
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
function renderPatchwork(d,w,p,done){
 if(!d.patchCuts?.length)return '';
 const complete=done.includes(w);
 return '<section class="card section lesson-extra" data-lesson-patch="'+w+'">'+
 '<span class="eyebrow">Un carré, une histoire · Bloc n° '+w+'</span><h3>'+esc(d.patchworkTitle)+'</h3>'+
 '<p>Un bloc <b>fini de 20 × 20 cm</b> après son assemblage dans la couverture. Conserve <b>21,5 × 21,5 cm avant assemblage</b> pour tenir compte des marges de 7,5 mm.</p>'+
 diagram(w,true)+
 '<h4>Découpe pour un seul bloc</h4>'+list(d.patchCuts)+
 '<h4>Montage du bloc</h4>'+list(d.patchSteps,true)+
 '<div class="tip"><b>Astuce de précision :</b> '+esc(d.patchTip)+'</div>'+
 '<button class="secondary lesson-patch-done" type="button" data-quilt-person="'+esc(p)+'" data-quilt-block="'+w+'" aria-pressed="'+(complete?'true':'false')+'">'+(complete?'✓ Bloc n° '+w+' terminé · décocher':'□ Marquer mon bloc n° '+w+' comme terminé')+'</button>'+
 '<p class="small">Cette coche est personnelle et se retrouvera aussi dans ta couverture des 52 blocs.</p></section>';
}

function renderFirstPatchwork(p,done){
 const complete=done.includes(1);
 return `<section class="card section lesson-extra patchwork-one" aria-label="Tutoriel détaillé du bloc 1"><span class="eyebrow">Fiche technique du n° 01 · pour un seul bloc</span><h2>Le damier à quatre carrés</h2><p>Tu vas assembler quatre petits carrés pour obtenir un damier : deux tissus clairs et deux tissus foncés. Prévois environ 45 à 60 minutes pour ce premier essai, en prenant le temps de mesurer et de repasser.</p>
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
 <div class="actions"><button class="primary" data-page="print">Imprimer le gabarit →</button><button class="secondary lesson-patch-done" type="button" data-quilt-person="${esc(p)}" data-quilt-block="1" aria-pressed="${complete?'true':'false'}">${complete?'✓ Bloc n° 1 terminé · décocher':'□ Marquer mon bloc n° 1 comme terminé'}</button></div><p class="small">Le gabarit s’imprime à 100 %. Vérifie son carré de contrôle de 5 cm avant de couper. La coche reste personnelle et se retrouve dans ta couverture.</p></section>`;
}

root.Fil52LessonGuides={renderFirstPatchwork,renderPreparation,renderTroubleshooting,renderPatchwork,diagram};
})(globalThis);
