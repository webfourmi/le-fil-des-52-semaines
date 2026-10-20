'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
const context=await browser.newContext({viewport:{width:390,height:844}});
const page=await context.newPage();
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded'});
await page.getByRole('button',{name:'Viera',exact:true}).click();
const manifest=await page.locator('link[rel="manifest"]').getAttribute('href');
assert.equal(manifest,'./manifest.webmanifest');
const request=await page.request.get('http://127.0.0.1:8765/manifest.webmanifest');
assert.equal(request.status(),200);
const json=await request.json();
assert.equal(json.display,'standalone');
assert.ok(json.icons.some(i=>i.src.endsWith('.svg')));
for(const size of [192,512]){
  const icon=json.icons.find(i=>i.sizes===size+'x'+size&&i.type==='image/png');
  assert.ok(icon,'Icône '+size+' manquante');
  const response=await page.request.get(new URL(icon.src, 'http://127.0.0.1:8765/').href);
  assert.equal(response.status(),200);
  const image=await response.body();
  assert.equal(image.readUInt32BE(16),size);
  assert.equal(image.readUInt32BE(20),size);
}
const apple=await page.request.get('http://127.0.0.1:8765/assets/pwa-icon-180.png');
assert.equal(apple.status(),200);
assert.equal((await apple.body()).readUInt32BE(16),180);
await page.locator('details.pwa-panel > summary').click();
await page.getByRole('button',{name:'Comment l’installer ?'}).click();
assert.ok(await page.getByText('Sur l’écran d’accueil').count());
assert.ok(await page.getByText('Installer l’application',{exact:false}).count());
assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2));
// Contrôle que la présence d'un nouvel épisode déclenche une alerte sans perdre les notes.
await page.locator('#bottomnav [data-page="journal"]').click();
await page.locator('[data-note="1"]').fill('Notes personnelles avant la nouvelle édition.');
await page.evaluate(()=>{
  const previousFetch=window.fetch.bind(window);
  window.fetch=(input,options)=>{
    if(String(input).includes('data/editions.json')){
      return Promise.resolve(new Response(JSON.stringify({
        version:'0.8-test',
        published:[1,2,3,4,5,6,7], approved:{sewing:[0,1,7]}, 
        issues:{
          7:{title:'Serviette de table',intro:'Essai de publication',steps:[{title:'Découper',detail:'Préparer les tissus'}],materials:['Chutes de coton']}
        }
      }),{status:200,headers:{'Content-Type':'application/json'}}));
    }
    return previousFetch(input,options);
  };
  document.dispatchEvent(new Event('visibilitychange'));
});
await page.getByText('Le cours n° 07 est désormais validé !').waitFor({timeout:10000});
await page.getByRole('button',{name:'Voir le cours',exact:true}).click();
assert.equal(await page.locator('#week-select').inputValue(),'7');
assert.ok(await page.getByText('Essai de publication').count());
await page.locator('#bottomnav [data-page="journal"]').click();
await page.locator('#journal-week').selectOption('1');
assert.equal(await page.locator('[data-note="1"]').inputValue(),'Notes personnelles avant la nouvelle édition.');
console.log('OK : alerte nouvelle édition, ouverture du cours, notes préservées.');
await page.locator('#bottomnav [data-page="home"]').click();
// Test du bouton installer quand le navigateur annonce l'éligibilité.
await page.evaluate(()=>{
  const installEvent=new Event('beforeinstallprompt',{cancelable:true});
  installEvent.prompt=()=>Promise.resolve();
  installEvent.userChoice=Promise.resolve({outcome:'dismissed'});
  window.dispatchEvent(installEvent);
});
await page.locator('details.pwa-panel > summary').click();
await page.locator('#pwa-install').waitFor({state:'visible'});
await page.locator('#pwa-install').click();
console.log('OK : bouton installer visible et action de déclenchement prise en charge.');

// Vérifie le chargement hors connexion après installation du service worker.
await page.reload({waitUntil:'domcontentloaded'});
await page.waitForFunction(()=>navigator.serviceWorker.controller!==null,{timeout:15000});
await context.setOffline(true);
await page.locator('details.pwa-panel > summary').click();
await page.locator('#pwa-check').click();
await page.getByText('Hors connexion : les nouveautés seront vérifiées dès ton retour sur Internet.').waitFor();
await page.locator('#bottomnav [data-page="journal"]').click();
assert.equal(await page.locator('[data-note="1"]').inputValue(),'Notes personnelles avant la nouvelle édition.');
await page.locator('#bottomnav [data-page="home"]').click();
await page.reload({waitUntil:'domcontentloaded'});
assert.ok(await page.getByRole('heading',{name:/Petits points/i}).count());
assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2));
await context.setOffline(false);
await page.locator('details.pwa-panel > summary').click();
await page.locator('#pwa-check').click();
await page.getByText('Ton application (version 1.1.13) est à jour. Aucun nouveau cours validé pour le moment.').waitFor({timeout:10000});
assert.match(await page.locator('#pwa-version').innerText(),/1\.1\.13/,'Version affichée dans l’atelier');
const approvedBefore=await page.evaluate(()=>window.Fil52EditorialApproved.sewing.join(','));
assert.equal(approvedBefore,'0,1');
await page.evaluate(()=>{
 const oldFetch=window.fetch;
 window.fetch=(input,options)=>{
  if(String(input).includes('data/editions.json')){
   return Promise.resolve(new Response(JSON.stringify({
    version:'0.9',appRelease:'1.1.14',
    appReleaseNotes:'Nouveaux patrons et recherche sans validation de cours.',
    published:[1,2,3,4,5,6],approved:{sewing:[0,1]}
   }),{status:200,headers:{'Content-Type':'application/json'}}));
  }
  return oldFetch(input,options);
 };
 document.dispatchEvent(new Event('visibilitychange'));
});
await page.getByText('Nouvelle version de De fil en aiguille : 1.1.14.',{exact:false}).waitFor({timeout:10000});
assert.ok(await page.getByRole('button',{name:'Mettre à jour',exact:true}).isVisible(),'Alerte app sans nouveau cours validé');
assert.equal(await page.locator('#week-select').count(),0,'Aucune navigation imposée par la nouvelle version');

assert.deepEqual(errors,[]);
console.log('OK : manifeste, guide iPhone/Android, absence de débordement mobile.');
await context.close();
}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
