/* Contenu éditorial commun : aucune écriture dans le carnet personnel. */
(function(root){
'use strict';
const captions={
1:['Le poste de couture : patron 8 × 22 cm, deux tissus, ciseaux, épingles et Janome Cherry 21','Deux tissus épinglés endroit contre endroit ; ligne de couture tracée à 1 cm et ouverture de retournement','Après la couture, dégarnir les angles sans couper les points, avant de retourner','Le marque-page retourné est surpiqué près du bord avec la Janome Cherry 21','Le marque-page terminé, côté imprimé Union Jack et surpiqûre visible','Bloc 1 : damier à quatre carrés'],
2:['Patron A4 : deux pièces de 12 × 12 cm aux coins arrondis, faces A imprimée et B unie','Deux faces endroit contre endroit ; une ouverture de 4 cm sur un côté droit','Piquer à 1 cm en suivant les courbes, puis couper de petites encoches en V dans leurs marges','Retourner les arrondis, repasser puis surpiquer pour fermer','Le même dessous de verre aux coins arrondis, utilisé côté A puis côté B','Bloc 2 : deux bandes verticales'],
3:['Le rectangle de coton de 15 × 19 cm et le matériel','Réaliser les ourlets des deux côtés','Replier les côtés pour former une ouverture croisée','Coudre les côtés puis retourner','L’étui terminé avec ses mouchoirs','Bloc 3 : bandes horizontales'],
4:['La bande de coton de 45 × 10 cm et l’élastique','Plier et coudre le tube de tissu','Retourner et passer l’élastique','Assembler l’élastique puis fermer le tissu','Le chouchou terminé','Bloc 4 : carré central simple'],
5:['Les deux faces de 13 × 16 cm et la lavande','Piquer le contour en réservant une ouverture','Dégarnir les coins puis retourner','Remplir de lavande et fermer à la main','Le sachet de lavande terminé','Bloc 5 : nine-patch à neuf carrés'],
6:['Les deux rectangles de 22 × 27 cm et les deux cordons','Assembler le corps du pochon','Former et coudre la coulisse','Passer les cordons dans la coulisse','Le pochon terminé, ouvert et fermé','Bloc 6 : coins contrastés']};
const roles=['Matériel','Étape clé 1','Étape clé 2','Étape clé 3','Résultat','Bloc de patchwork'];
const lessons=Object.fromEntries(Object.entries(captions).map(([w,items])=>[w,items.map((caption,i)=>({id:'week-'+w+'-'+(i+1),role:roles[i],caption,image:null}))]));
// Photographies fournies pour le cours n° 1, dans l'ordre de la réalisation.
const photosCoursUn=[
 ['01-materiel.webp','Patron 8 × 22 cm, deux tissus, machine Janome Cherry 21, ciseaux et épingles',120,160],
 ['02-epinglage.webp','Pièces de tissu épinglées endroit contre endroit et ligne de couture tracée',120,160],
 ['03-coins-degarnis.webp','Coins dégarnis après piqûre pour faciliter le retournement du marque-page',120,160],
 ['04-surpiqure.webp','Pied de la Janome Cherry 21 et surpiqûre près du bord du marque-page',120,160],
 ['05-marque-page-termine.webp','Marque-page en coton imprimé Union Jack terminé, surpiqûre visible',61,160]
];
photosCoursUn.forEach(([file,alt,width,height],i)=>{
 lessons[1][i].image={src:'./assets/cours-01/'+file,alt,width,height};
});
// Photographie originale fournie pour le cours patchwork n° 2, conservée dans sa définition native.
lessons[2][5].image={src:'./assets/patchwork-02/bloc-02-reel.jpg',alt:'Véritable bloc de patchwork 2 photographié : tissu gris clair à gauche et chats porte-bonheur japonais à droite, couture centrale verticale',width:1514,height:1536};
// Photographies originales du cours couture 2, correspondant aux étapes du dessous de verre.
lessons[2][0].caption="Deux pièces de coton à coins arrondis : face A bleue à motif d'oiseau, face B claire unie.";
lessons[2][0].image={src:'./assets/cours-02/photo-1.jpg',alt:"Tissus découpés à coins arrondis, imprimé bleu à oiseau et tissu clair",width:1450,height:782};
lessons[2][1].caption="H630 positionné sur l’envers de la face imprimée, en laissant les marges de couture libres.";
lessons[2][1].image={src:'./assets/cours-02/photo-2.jpg',alt:"Envers du tissu imprimé avec molleton thermocollant H630 centré",width:1363,height:1450};
lessons[2][2].caption="Piqûre du contour à la machine, avec une ouverture de retournement sur le côté droit.";
lessons[2][2].image={src:'./assets/cours-02/photo-3.jpg',alt:"Dessous de verre à coins arrondis en cours de piqûre sur la machine à coudre",width:1087,height:1450};
lessons[2][3].caption="Petites encoches dans les marges des arrondis, à distance de la ligne de couture.";
lessons[2][3].image={src:'./assets/cours-02/photo-4.jpg',alt:"Envers de la pièce bleue, molleton H630 et marges de couture crantées dans les courbes",width:1450,height:1088};
lessons[2][4].caption="Surpiqûre de finition au bord, après retournement de l’ouvrage.";
lessons[2][4].image={src:'./assets/cours-02/photo-5.jpg',alt:"Dessous de verre imprimé bleu sous le pied de la machine pour la surpiqûre",width:1087,height:1450};
lessons[2][6]={id:'week-2-photo-6',role:'Résultat final',caption:"Dessous de verre terminé, côté imprimé bleu avec l’oiseau et surpiqûre visible.",image:null};
lessons[2][6].image={src:'./assets/cours-02/photo-6.jpg',alt:"Dessous de verre terminé, coton bleu à oiseau et bord arrondi surpiqué",width:1087,height:1450};


// Photographies réelles du cours couture 3, prises par la couturière, conservées lisibles et zoomables.
lessons[3][0].role="Découpe";
lessons[3][0].caption="Rectangle de coton imprimé découpé et contrôlé à la règle avant de réaliser les ourlets.";
lessons[3][0].image={src:'./assets/cours-03/photo-1.jpg',alt:"Rectangle de coton blanc imprimé de personnages, avec une règle d’écolier sur deux côtés",width:1050,height:1400};
lessons[3][1].role="Ourlets";
lessons[3][1].caption="Sur l’envers du tissu, les deux petits bords sont repliés et piqués pour former les ourlets doubles.";
lessons[3][1].image={src:'./assets/cours-03/photo-2.jpg',alt:"Envers du coton imprimé, avec les deux bords opposés repliés et cousus",width:1050,height:1400};
lessons[3][2].role="Ouverture croisée";
lessons[3][2].caption="Les bords ourlés sont rabattus l’un sur l’autre vers le centre, puis maintenus avec des épingles.";
lessons[3][2].image={src:'./assets/cours-03/photo-3.jpg',alt:"Tissu replié à ouverture centrale croisée et maintenu avec des épingles, une règle contrôlant le pliage",width:1050,height:1400};
lessons[3][3].role="Couture des côtés";
lessons[3][3].caption="Les épaisseurs sont maintenues avec une épingle ; la couture latérale fixe le pliage.";
lessons[3][3].image={src:'./assets/cours-03/photo-4.jpg',alt:"Gros plan de l’envers du tissu replié et cousu sur le côté, épingle jaune et découd-vite visibles",width:1050,height:1400};
lessons[3][4].role="Résultat final";
lessons[3][4].caption="L’étui terminé, retourné sur l’endroit, avec son ouverture croisée centrale.";
lessons[3][4].image={src:'./assets/cours-03/photo-5.jpg',alt:"Étui à mouchoirs terminé en coton imprimé coloré, ouverture centrale croisée visible",width:1050,height:1400};
// Photo fournie pour le damier du cours patchwork 1 (quatre tissus Halloween).
lessons[1][5].image={src:'./assets/patchwork-01/bloc-01-halloween.jpg',alt:'Bloc 1 damier Halloween : deux carrés de coton clair et deux carrés noirs imprimés, disposés en diagonale',width:1536,height:1437};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Les chemins locaux garantissent la compatibilité GitHub Pages et le cache PWA.
function source(src){return typeof src==='string' && /^\.\/assets\/[a-zA-Z0-9_./-]+\.(webp|avif|png|jpe?g)$/.test(src) && !src.includes('..')?src:'';}
function render(w,patchwork=false){
 const all=lessons[w];if(!all)return '';
 const indices=patchwork?[5]:(w===2?[0,1,2,3,4,6]:[0,1,2,3,4]),slots=indices.map(i=>all[i]).filter(Boolean),title=patchwork?'Photos du patchwork':'Photos du cours couture';
 return '<section class="card section lesson-gallery '+(patchwork?'patchwork-photo-gallery':'sewing-photo-gallery')+'" aria-label="'+title+', projet n° '+w+'"><h3>'+title+'</h3><p class="small">'+(patchwork?'Le carré terminé, avant son assemblage dans la couverture.':'Le matériel, les étapes clés et le résultat du projet couture.')+(slots.some(slot=>slot.image)?' Voici les vraies photos de cet ouvrage, dans l’ordre des étapes.':' Les vraies photos seront ajoutées prochainement.')+'</p><div class="lesson-photo-grid">'+slots.map((slot,i)=>{
 const img=slot.image,src=source(img?.src);
 const media=src?'<button type="button" class="lesson-photo-open" data-lesson-photo="'+w+':'+indices[i]+'" aria-label="'+esc('Agrandir : '+slot.caption)+'"><img loading="lazy" decoding="async" src="'+esc(src)+'" alt="'+esc(img.alt||slot.caption)+'"'+(Number.isInteger(img.width)&&img.width>0?' width="'+img.width+'"':'')+(Number.isInteger(img.height)&&img.height>0?' height="'+img.height+'"':'')+'></button>':'<div class="lesson-photo-empty">Photo à venir</div>';
 return '<figure>'+media+'<figcaption><b>'+esc(slot.role)+'</b><span>'+esc(slot.caption)+'</span></figcaption></figure>';
 }).join('')+'</div></section>';
}
let dialog,opener;
function close(){dialog.close();if(opener?.isConnected)opener.focus();}
document.addEventListener('click',event=>{
 const button=event.target.closest('[data-lesson-photo]');if(!button)return;
 const [w,i]=button.dataset.lessonPhoto.split(':'),slot=lessons[w]?.[i],img=slot?.image;
 if(!source(img?.src))return;
 if(!dialog){dialog=document.createElement('dialog');dialog.className='lesson-photo-dialog';dialog.setAttribute('aria-label','Photo du cours agrandie');document.body.append(dialog);dialog.addEventListener('cancel',event=>{event.preventDefault();close()});dialog.addEventListener('click',event=>{const zoom=event.target.closest('[data-zoom-photo]');if(zoom){const active=dialog.classList.toggle('photo-zoomed');zoom.setAttribute('aria-pressed',String(active));zoom.textContent=active?'Ajuster à l’écran':'Voir les détails à 100 %';return;}if(event.target===dialog||event.target.closest('[data-close-photo]'))close()});}
 opener=button;
 dialog.classList.remove('photo-zoomed');
 dialog.innerHTML='<div class="lesson-photo-actions"><button type="button" class="secondary" data-close-photo autofocus>Fermer la photo</button><button type="button" class="secondary" data-zoom-photo aria-pressed="false">Voir les détails à 100 %</button></div><figure><img src="'+esc(source(img.full)||img.src)+'" alt="'+esc(img.alt||slot.caption)+'"><figcaption>'+esc(slot.caption)+'</figcaption></figure>';
 dialog.showModal();dialog.querySelector('button').focus();
});
// Une ressource absente doit rester honnête et lisible, même hors connexion.
document.addEventListener('error',event=>{
 const img=event.target;if(img.tagName!=='IMG')return;
 const button=img.closest('.lesson-photo-open');
 if(button){const empty=document.createElement('div');empty.className='lesson-photo-empty';empty.textContent='Photo indisponible';button.replaceWith(empty);}
 else if(img.closest('.lesson-photo-dialog')){const message=document.createElement('p');message.textContent='Photo indisponible hors connexion ou introuvable.';img.replaceWith(message);}
},true);
function renderSewingStep2(stepIndex){
 const index=[0,1,2,3,-1,4,6][stepIndex];if(index===undefined||index<0)return '';
 const slot=lessons[2][index],img=slot?.image,src=source(img?.src);if(!src)return '';
 return '<figure class="sewing-two-photo"><button type="button" class="lesson-photo-open sewing-two-photo-open" data-lesson-photo="2:'+index+'" aria-label="'+esc('Agrandir : '+slot.caption)+'"><img loading="lazy" decoding="async" src="'+esc(src)+'" alt="'+esc(img.alt)+'" width="'+img.width+'" height="'+img.height+'"></button><figcaption>'+esc(slot.caption)+'</figcaption></figure>';
}
function renderSewingStep3(stepIndex){
 const index=[0,-1,1,2,3,-1,4][stepIndex];
 if(index===undefined||index<0)return '';
 const slot=lessons[3][index],img=slot?.image,src=source(img?.src);if(!src)return '';
 return '<figure class="sewing-two-photo"><button type="button" class="lesson-photo-open sewing-two-photo-open" data-lesson-photo="3:'+index+'" aria-label="'+esc('Agrandir : '+slot.caption)+'"><img loading="lazy" decoding="async" src="'+esc(src)+'" alt="'+esc(img.alt)+'" width="'+img.width+'" height="'+img.height+'"></button><figcaption>'+esc(slot.caption)+'</figcaption></figure>';
}
root.Fil52LessonPhotos={lessons,render,renderPatchwork:w=>render(w,true),renderSewingStep2,renderSewingStep3};
})(globalThis);
