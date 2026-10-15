/* V0.5 · installation et alertes non intrusives pendant l'utilisation. */
(function(){
'use strict';
let deferred=null, worker=null, waiting=null, updateAccepted=false;
let previouslyControlled=false;
const el=id=>document.getElementById(id);
const updateUI=()=>{
 const install=el('pwa-install');
 if(install)install.hidden=!deferred;
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
async function checkEdition(){
 // Ne pas masquer une alerte de mise à jour technique par une nouvelle édition.
 if(!navigator.onLine||waiting)return;
 try{
  const response=await fetch('./data/editions.json',{cache:'no-store'});
  if(!response.ok)return;
  const d=await response.json();
  if(!Array.isArray(d.published)||!d.published.every(n=>Number.isInteger(n)&&n>0&&n<=52))return;
  const newest=Math.max(1,...d.published);
  const seen=Number(localStorage.getItem('fil52.seen.latest')||0);
  if(newest>seen&&seen>0){
   notice('Le cours n° '+String(newest).padStart(2,'0')+' est disponible !','Voir le cours',()=>{
     dismiss();localStorage.setItem('fil52.seen.latest',String(newest));
     if(typeof window.Fil52OpenEdition==='function')window.Fil52OpenEdition(d,newest);
     else location.reload();
   });
  } else if(!seen){localStorage.setItem('fil52.seen.latest',String(newest))}
 }catch(_){}
}
function register(){
 if(!('serviceWorker' in navigator)||!window.isSecureContext)return;
 navigator.serviceWorker.register('./sw.js',{scope:'./'}).then(reg=>{
   worker=reg;
   if(reg.waiting)showWorker(reg.waiting);
   reg.addEventListener('updatefound',()=>{
      const next=reg.installing;if(!next)return;
      next.addEventListener('statechange',()=>{
        if(next.state==='installed'&&navigator.serviceWorker.controller)showWorker(next);
      });
   });
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
