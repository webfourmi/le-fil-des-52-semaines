/* V1.1.11 · signalement des versions de l'application indépendamment des cours approuvés. */
(function(){
'use strict';
let deferred=null, worker=null, waiting=null, updateAccepted=false;
let previouslyControlled=false;
const APP_BUILD='1.1.14';
const el=id=>document.getElementById(id);
const updateUI=()=>{
 const install=el('pwa-install');
 if(install)install.hidden=!deferred;
 const version=el('pwa-version');if(version)version.textContent='Version de l’application : '+APP_BUILD;
};
const notice=(message,action,click)=>{
 const box=el('pwa-notice');if(!box)return;
 el('pwa-notice-message').textContent=message;
 const button=el('pwa-notice-action');button.textContent=action||'';button.hidden=!action;
 button.onclick=action?click:null;
 box.hidden=false;
};
const dismiss=()=>{const b=el('pwa-notice');if(b)b.hidden=true;};
function showGuide(){
 const b=el('pwa-help');if(b)b.hidden=!b.hidden;
}
async function install(){
 if(!deferred){showGuide();return}
 const prompt=deferred;deferred=null;updateUI();
 await prompt.prompt();
 await prompt.userChoice;
}
function releaseUpdate(){
 // Seule une action explicite de l'utilisatrice autorise le rechargement.
 updateAccepted=true;
 if(waiting && waiting.state==='installed')waiting.postMessage({type:'SKIP_WAITING'});
 else location.reload();
}
async function requestAppUpdate(){
 try{
  const registration=worker||(('serviceWorker' in navigator)?await navigator.serviceWorker.getRegistration('./'):null);
  if(!registration){notice('Ouvre l’application depuis son raccourci puis vérifie à nouveau la connexion.');return}
  await registration.update();
  if(registration.waiting){showWorker(registration.waiting);return}
  if(registration.installing){notice('La mise à jour est en cours de téléchargement. Tu seras avertie dès qu’elle sera prête.');return}
  notice('La nouvelle version est signalée, mais le navigateur n’a pas encore terminé son téléchargement. Ferme et rouvre l’application, puis réessaie.');
 }catch(_){notice('Impossible de télécharger la nouvelle version. Vérifie la connexion et réessaie.')}
}
async function checkEdition(showCurrent=false){
 // Ne pas masquer une alerte technique par la liste des cours.
 if(waiting)return 'update';
 if(!navigator.onLine){
   if(showCurrent)notice('Hors connexion : les nouveautés seront vérifiées au prochain accès à Internet.');
   return 'offline';
 }
 try{
  const response=await fetch('./data/editions.json',{cache:'no-store'});
  if(!response.ok)throw Error('Service inaccessible');
  const d=await response.json();
  if(!Array.isArray(d.published)||!d.published.length||!d.published.every(n=>Number.isInteger(n)&&n>0&&n<=52))throw Error('Éditions invalides');
  // La version technique évolue même lorsque seuls les articles, patrons ou recherches changent.
  if(typeof d.appRelease==='string'&&d.appRelease.trim()&&d.appRelease!==APP_BUILD){
    notice('Nouvelle version de De fil en aiguille : '+d.appRelease+'. '+(d.appReleaseNotes||'De nouvelles améliorations sont disponibles.'),'Mettre à jour',requestAppUpdate);
    return 'app-update';
  }
  const approved=Array.isArray(d.approved?.sewing)?d.approved.sewing.filter(n=>Number.isInteger(n)&&n>=1&&d.published.includes(n)):[1];
  const newest=Math.max(1,...approved);
  const prev=Number(localStorage.getItem('fil52.seen.latest')||0);
  const seen=Math.min(prev,newest);
  if(prev!==seen)localStorage.setItem('fil52.seen.latest',String(seen));
  if(newest>seen&&seen>0){
   notice('Le cours n° '+String(newest).padStart(2,'0')+' est désormais validé !','Voir le cours',()=>{
     dismiss();localStorage.setItem('fil52.seen.latest',String(newest));
     if(typeof window.Fil52OpenEdition==='function')window.Fil52OpenEdition(d,newest);
     else location.reload();
   });
    return 'new';
  } else {
    if(!seen)localStorage.setItem('fil52.seen.latest',String(newest));
    if(showCurrent)notice('Ton application (version '+APP_BUILD+') est à jour. Aucun nouveau cours validé pour le moment.');
    return 'current';
  }
 }catch(_){
   if(showCurrent)notice('Impossible de vérifier les cours. Réessaie lorsque la connexion fonctionne.');
   return 'error';
 }
}
async function checkUpdates(){
 if(!navigator.onLine){
   notice('Hors connexion : les nouveautés seront vérifiées dès ton retour sur Internet.');
   return;
 }
 const check=el('pwa-check');
 if(check){check.disabled=true;check.textContent='Vérification…'}
 try{
   const registration=worker||(('serviceWorker' in navigator)?await navigator.serviceWorker.getRegistration('./'):null);
   if(registration){
     await registration.update();
     if(registration.waiting){showWorker(registration.waiting);return}
     if(registration.installing){
       // Le service worker annoncera lui-même son installation.
       notice('Une nouvelle version est en cours de préparation.');return;
     }
   }
   await checkEdition(true);
 }catch(_){notice('Vérification impossible pour le moment. Réessaie plus tard.')}
 finally{if(check){check.disabled=false;check.textContent='Vérifier les nouveautés'}}
}
function register(){
 if(!('serviceWorker' in navigator)||!window.isSecureContext)return;
 navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'}).then(reg=>{
   worker=reg;
   if(reg.waiting)showWorker(reg.waiting);
   reg.addEventListener('updatefound',()=>{
      const next=reg.installing;if(!next)return;
      next.addEventListener('statechange',()=>{
        if(next.state==='installed'&&navigator.serviceWorker.controller)showWorker(next);
      });
   });
   // Vérifier dès l'ouverture au lieu d'attendre la prochaine visite du navigateur.
   reg.update().catch(()=>{});
 }).catch(()=>{});
}
function showWorker(w){
 if(updateAccepted)return;
 waiting=w;
 notice('Une nouvelle version de l’application est prête.','Mettre à jour',releaseUpdate);
}
document.addEventListener('DOMContentLoaded',()=>{
 document.addEventListener('click',e=>{
  if(e.target.closest('#pwa-install')) install();
  else if(e.target.closest('#pwa-help-toggle')) showGuide();
  else if(e.target.closest('#pwa-check')) checkUpdates();
 });
 el('pwa-notice-close')?.addEventListener('click',dismiss);
 window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;updateUI()});
 window.addEventListener('appinstalled',()=>{deferred=null;updateUI();dismiss()});
 previouslyControlled=!!navigator.serviceWorker?.controller;
 navigator.serviceWorker?.addEventListener('controllerchange',()=>{
   if(updateAccepted){location.reload();return}
   // Première installation : le service worker prend le contrôle sans interrompre l'atelier.
   // Actualisation provenant d'un autre onglet : demander confirmation.
   if(previouslyControlled){
     waiting=null;
     notice('L’application a été actualisée dans un autre onglet.','Actualiser',()=>{
       updateAccepted=true;location.reload();
     });
   }
   previouslyControlled=true;
 });
 updateUI();register();checkEdition();
 new MutationObserver(()=>updateUI()).observe(el('app'),{childList:true,subtree:false});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden){checkEdition();worker?.update().catch(()=>{})}});
});
})();
