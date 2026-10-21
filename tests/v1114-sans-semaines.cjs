'use strict';
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const fs=require('node:fs');
const ROOT='http://127.0.0.1:8765/';
const forbidden=/(52\s+semaines|52\s+rendez[- ]vous|rendez[- ]vous de 15 jours|chaque\s+quinzaine|tous les 15 jours|chaque jeudi)/i;
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  const backup=fs.readFileSync('assets/backup.js','utf8');
  assert.ok(backup.includes("FORMAT='le-fil-des-52-semaines.personnel'"),'Ancien format de sauvegarde préservé');
  const storage=fs.readFileSync('index.html','utf8');
  assert.ok(storage.includes("fil52.progress.v1"),'Clé localStorage conservée');
  const manifest=JSON.parse(fs.readFileSync('manifest.webmanifest','utf8'));
  assert.equal(manifest.id,'/le-fil-des-52-semaines/','Identité PWA installée conservée');
  assert.equal(manifest.name,'De fil en aiguille');
  for(const width of [320,390,1280]){
   const context=await browser.newContext({viewport:{width,height:860},acceptDownloads:true});
   const page=await context.newPage(),errs=[];
   page.on('pageerror',e=>errs.push(e.message));
   await page.goto(ROOT,{waitUntil:'domcontentloaded'});
   await page.getByRole('button',{name:'Viera',exact:true}).click();
   const nav=width<=850?'#bottomnav':'#nav';
   async function clean(name){
    const visible=await page.evaluate(()=>document.body.innerText);
    assert.doesNotMatch(visible,forbidden,name+' : calendriers révolus');
    assert.doesNotMatch(visible,/Avant les 52 semaines/i,name+' : appellation cours 0');
   }
   await clean('Accueil');
   assert.match(await page.locator('.topline').innerText(),/à votre rythme/i);
   await page.locator(nav+' [data-page="learn"]').click();
   await clean('Cours de couture');
   await page.locator('[data-page="machine"]').first().click();
   await clean('Cours 0 machine');
   assert.match(await page.locator('.machine-intro').innerText(),/Premiers pas avec la machine/);
   await page.locator(nav+' [data-page="quilt"]').click();
   await clean('Patchwork');
   await page.locator('[data-patch-zero]').first().click();
   await clean('Préparation patchwork');
   await page.locator(nav+' [data-page="quilt"]').click();
   await page.locator('[data-patch-cover]').click();
   await clean('Couverture patchwork');
   assert.match(await page.locator('#patch-cover-panel').innerText(),/52/,'Composition de couverture inchangée');
   await page.locator(nav+' [data-page="world"]').click();
   await clean('Voyages');
   await page.locator(nav+' [data-page="journal"]').click();
   await clean('Journal');
   await page.locator('[data-journal-kind="patchwork"]').click();
   await clean('Journal Patchwork');
   await page.locator('[data-journal-kind="voyage"]').click();
   await clean('Journal Voyage');
   await page.locator(nav+' [data-page="print"]').click();
   await clean('Patrons');
   await page.getByRole('button',{name:/Sauvegarder mon journal|Sauvegardes/}).first().count();
   assert.deepEqual(errs,[],'Pas d’erreur JavaScript '+width);
   await context.close();
   console.log('OK V1.1.14 : sans calendrier, avec anciens suivis et total des blocs conservés, '+width+' px');
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1});
