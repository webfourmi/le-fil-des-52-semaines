/* V1.1.11 · signalement des versions de l'application indépendamment des cours approuvés. */
(function(){
'use strict';
let deferred=null, worker=null, waiting=null, updateAccepted=false;
let previouslyControlled=false;
const APP_BUILD='1.3.16';
const el=id=>document.getElementById(id);
const updateUI=()=>{
 const install=el('pwa-install');
 if(install)install.hidden=!deferred;
 const version=el('pwa-version');if(version)version.textContent='Version de l’application : '+APP_BUILD;
};
/* Notes de version, consultables même sans nouvelle installation. */
const FALLBACK_RELEASE={version:APP_BUILD,title:'Nouveautés de l’atelier',changes:[
 'Affichage automatique de la liste des nouveautés à chaque nouvelle version.',
 'Historique des mises à jour accessible depuis « Vérifier les nouveautés ».'
]};
let latestNotes=FALLBACK_RELEASE;
async function loadReleaseNotes(){
 try{
  const response=await fetch('./data/changelog.json',{cache:'no-store'});
  if(!response.ok)throw Error('Notes indisponibles');
  const data=await response.json();
  if(!Array.isArray(data.releases)||!data.releases.length)throw Error('Format invalide');
  const release=data.releases.find(r=>r.version===data.current)||data.releases[0];
  if(!release||!Array.isArray(release.changes))throw Error('Notes incomplètes');
  latestNotes={...release,history:data.releases};
 }catch(_){latestNotes=FALLBACK_RELEASE}
 return latestNotes;
}
async function showReleaseNotes(hasUpdate=false,version=''){
 const notes=await loadReleaseNotes();
 const selected=(notes.history||[notes]).find(r=>r.version===version)||notes;
 if(selected.version===APP_BUILD){try{localStorage.setItem('fil52.changelog.seenVersion',APP_BUILD)}catch(_){}}
 document.getElementById('pwa-changelog-overlay')?.remove();
 const overlay=document.createElement('div');overlay.id='pwa-changelog-overlay';overlay.className='pwa-changelog-overlay';
 overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-labelledby','pwa-changelog-title');
 const panel=document.createElement('section');panel.className='pwa-changelog-dialog';
 const heading=document.createElement('h2');heading.id='pwa-changelog-title';heading.textContent='✂ Les nouveautés de De fil en aiguille';
 const info=document.createElement('p');info.className='small';info.textContent='Version '+selected.version+(hasUpdate?' · mise à jour disponible':' · journal des améliorations');
 const title=document.createElement('h3');title.textContent=selected.title||'Les nouveautés';
 const list=document.createElement('ul');list.className='pwa-changelog-list';
 for(const change of selected.changes){const item=document.createElement('li');item.textContent=String(change);list.append(item)}
 const buttons=document.createElement('div');buttons.className='pwa-actions';
 const close=document.createElement('button');close.type='button';close.className='secondary';close.textContent=hasUpdate?'Plus tard':'Fermer';
 close.addEventListener('click',()=>overlay.remove());buttons.append(close);
 if(hasUpdate){
  const update=document.createElement('button');update.type='button';update.className='primary';update.textContent='Installer la mise à jour';
  update.addEventListener('click',()=>{overlay.remove();releaseUpdate()});buttons.append(update);
 }
 if(Array.isArray(notes.history)&&notes.history.length>1){
  const historyHeading=document.createElement('p');historyHeading.className='small';historyHeading.textContent='Versions précédentes :';
  const versions=document.createElement('select');versions.className='selection';versions.setAttribute('aria-label','Choisir une version à consulter');
  for(const rel of notes.history){const opt=document.createElement('option');opt.value=rel.version;opt.textContent='Version '+rel.version;opt.selected=rel.version===selected.version;versions.append(opt)}
  versions.addEventListener('change',()=>showReleaseNotes(hasUpdate,versions.value));
  panel.append(heading,info,title,list,historyHeading,versions,buttons);
 }else panel.append(heading,info,title,list,buttons);
 overlay.append(panel);overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.remove()});
 overlay.addEventListener('keydown',e=>{if(e.key==='Escape')overlay.remove()});
 document.body.append(overlay);close.focus();
}
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
    notice('Nouvelle version de De fil en aiguille : '+d.appRelease+'. Consulte les nouveautés avant de l’installer.','Voir les nouveautés',()=>showReleaseNotes(true,d.appRelease));
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
    if(showCurrent)notice('Ton application (version '+APP_BUILD+') est à jour. Tu peux consulter les dernières nouveautés.','Voir les nouveautés',()=>showReleaseNotes(false));
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
 notice('Une nouvelle version de l’application est prête.','Voir les nouveautés',()=>showReleaseNotes(true));
 showReleaseNotes(true).catch(()=>{});
}
document.addEventListener('DOMContentLoaded',()=>{
 document.addEventListener('click',e=>{
  if(e.target.closest('#pwa-install')) install();
  else if(e.target.closest('#pwa-help-toggle')) showGuide();
  else if(e.target.closest('#pwa-check')) checkUpdates();
  else if(e.target.closest('#pwa-changelog-open')) showReleaseNotes(false);
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
 updateUI();register();loadReleaseNotes().then(()=>{
   checkEdition();
   // Après l'installation, présenter une seule fois le contenu de la version fraîchement reçue.
   let last='';try{last=localStorage.getItem('fil52.changelog.seenVersion')||''}catch(_){}
   if(last!==APP_BUILD)showReleaseNotes(false,APP_BUILD).catch(()=>{});
 });
 new MutationObserver(()=>updateUI()).observe(el('app'),{childList:true,subtree:false});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden){checkEdition();worker?.update().catch(()=>{})}});
});
})();
