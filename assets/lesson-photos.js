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
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Les chemins locaux garantissent la compatibilité GitHub Pages et le cache PWA.
function source(src){return typeof src==='string' && /^\.\/assets\/[a-zA-Z0-9_./-]+\.(webp|avif|png|jpe?g)$/.test(src) && !src.includes('..')?src:'';}
function render(w,patchwork=false){
 const all=lessons[w];if(!all)return '';
 const slots=patchwork?all.slice(5):all.slice(0,5),title=patchwork?'Photos du patchwork':'Photos du cours couture';
 return '<section class="card section lesson-gallery '+(patchwork?'patchwork-photo-gallery':'sewing-photo-gallery')+'" aria-label="'+title+', semaine '+w+'"><h3>'+title+'</h3><p class="small">'+(patchwork?'Le carré terminé, avant son assemblage dans la couverture.':'Le matériel, les étapes clés et le résultat du projet couture.')+(slots.some(slot=>slot.image)?' Voici les vraies photos de cet ouvrage, dans l’ordre des étapes.':' Les vraies photos seront ajoutées prochainement.')+'</p><div class="lesson-photo-grid">'+slots.map((slot,i)=>{
 const img=slot.image,src=source(img?.src);
 const media=src?'<button type="button" class="lesson-photo-open" data-lesson-photo="'+w+':'+(patchwork?i+5:i)+'" aria-label="'+esc('Agrandir : '+slot.caption)+'"><img loading="lazy" decoding="async" src="'+esc(src)+'" alt="'+esc(img.alt||slot.caption)+'"'+(Number.isInteger(img.width)&&img.width>0?' width="'+img.width+'"':'')+(Number.isInteger(img.height)&&img.height>0?' height="'+img.height+'"':'')+'></button>':'<div class="lesson-photo-empty">Photo à venir</div>';
 return '<figure>'+media+'<figcaption><b>'+esc(slot.role)+'</b><span>'+esc(slot.caption)+'</span></figcaption></figure>';
 }).join('')+'</div></section>';
}
let dialog,opener;
function close(){dialog.close();if(opener?.isConnected)opener.focus();}
document.addEventListener('click',event=>{
 const button=event.target.closest('[data-lesson-photo]');if(!button)return;
 const [w,i]=button.dataset.lessonPhoto.split(':'),slot=lessons[w]?.[i],img=slot?.image;
 if(!source(img?.src))return;
 if(!dialog){dialog=document.createElement('dialog');dialog.className='lesson-photo-dialog';dialog.setAttribute('aria-label','Photo du cours agrandie');document.body.append(dialog);dialog.addEventListener('cancel',event=>{event.preventDefault();close()});dialog.addEventListener('click',event=>{if(event.target===dialog||event.target.closest('[data-close-photo]'))close()});}
 opener=button;
 dialog.innerHTML='<button type="button" class="secondary" data-close-photo autofocus>Fermer la photo</button><figure><img src="'+esc(source(img.full)||img.src)+'" alt="'+esc(img.alt||slot.caption)+'"><figcaption>'+esc(slot.caption)+'</figcaption></figure>';
 dialog.showModal();dialog.querySelector('button').focus();
});
// Une ressource absente doit rester honnête et lisible, même hors connexion.
document.addEventListener('error',event=>{
 const img=event.target;if(img.tagName!=='IMG')return;
 const button=img.closest('.lesson-photo-open');
 if(button){const empty=document.createElement('div');empty.className='lesson-photo-empty';empty.textContent='Photo indisponible';button.replaceWith(empty);}
 else if(img.closest('.lesson-photo-dialog')){const message=document.createElement('p');message.textContent='Photo indisponible hors connexion ou introuvable.';img.replaceWith(message);}
},true);
root.Fil52LessonPhotos={lessons,render,renderPatchwork:w=>render(w,true)};
})(globalThis);
