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
root.Fil52LessonGuides={renderPreparation,renderTroubleshooting,renderPatchwork,diagram};
})(globalThis);
