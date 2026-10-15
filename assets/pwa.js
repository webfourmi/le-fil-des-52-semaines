/* V0.5 · installation et alertes non intrusives pendant l'utilisation. */
(function(){
'use strict';
let deferred=null, worker=null, waiting=null;
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
 if(waiting)waiting.postMessage({type:'SKIP_WAITING'});
 else location.reload();
}
async function checkEdition(){
 if(!navigator.onLine)return;
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
     if(typeof selectWeek==='function')selectWeek(newest);
   });
  } else if(!seen){localStorage.setItem('fil52.seen.latest',String(newest))}
 }catch(_){}
}
function register(){
 if(!('serviceWorker' in navigator)||location.protocol!=='https:')return;
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
 waiting=w;
 notice('Une nouvelle version de l’application est prête.','Mettre à jour',releaseUpdate);
}
document.addEventListener('DOMContentLoaded',()=>{
 el('pwa-install')?.addEventListener('click',install);
 el('pwa-help-toggle')?.addEventListener('click',showGuide);
 el('pwa-notice-close')?.addEventListener('click',dismiss);
 window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;updateUI()});
 window.addEventListener('appinstalled',()=>{deferred=null;updateUI();dismiss()});
 navigator.serviceWorker?.addEventListener('controllerchange',()=>location.reload());
 updateUI();register();checkEdition();
 document.addEventListener('visibilitychange',()=>{if(!document.hidden){checkEdition();worker?.update().catch(()=>{})}});
});
})();
