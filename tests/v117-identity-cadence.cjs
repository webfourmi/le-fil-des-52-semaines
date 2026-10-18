'use strict';
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const fs=require('node:fs/promises');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  await fs.mkdir('tests/screenshots',{recursive:true});
  for(const width of [320,390,1280]){
   const context=await browser.newContext({viewport:{width,height:width>850?900:844}}),page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded'});
   await page.getByRole('button',{name:'Viera',exact:true}).click();
   assert.match(await page.title(),/^De fil en aiguille/);
   assert.match(await page.locator('.brand strong').innerText(),/De fil en\\s*aiguille/);
   const manifest=await (await page.request.get('http://127.0.0.1:8765/manifest.webmanifest')).json();
   assert.equal(manifest.id,'/le-fil-des-52-semaines/','Identité PWA préservée');
   assert.equal(manifest.name,'De fil en aiguille');
   assert.equal(manifest.short_name,'De fil en aiguille');
   assert.match(manifest.description,/15 jours/);
   assert.equal(await page.locator('meta[name="apple-mobile-web-app-title"]').getAttribute('content'),'De fil en aiguille');
   assert.equal(await page.locator('.cadence-links button').count(),4,'Couture + Patchwork + Monde + Histoire');
   assert.match(await page.locator('.cadence-panel').innerText(),/tous les 15 jours/i);
   assert.match(await page.locator('.cadence-panel').innerText(),/environ deux ans/i);
   assert.doesNotMatch(await page.locator('#app').innerText(),/52 semaines|chaque jeudi|atelier de la semaine/i);
   await page.locator('[data-culture-home-tab="history"]').click();
   assert.equal(await page.locator('[data-culture-tab="history"]').getAttribute('aria-pressed'),'true');
   await page.locator((width<=850?'#bottomnav':'#nav')+' [data-page="home"]').click();
   await page.locator('[data-culture-home-tab="world"]').click();
   assert.equal(await page.locator('[data-culture-tab="world"]').getAttribute('aria-pressed'),'true');
   const nav=width<=850?'#bottomnav':'#nav';
   await page.locator(nav+' [data-page="learn"]').click();
   assert.equal(await page.locator('#week-select option').count(),52);
   assert.match(await page.locator('#week-select option').first().innerText(),/^Cours 01/);
   assert.equal(await page.locator('#week-select').getAttribute('aria-label'),'Choisir un cours de couture');
   await page.locator('#week-select').selectOption('2');
   await page.waitForFunction(()=>!!upcomingEditions[2]);await page.locator('[data-toggle="steps"]').first().check();
   await page.locator(nav+' [data-page="quilt"]').click();
   assert.equal(await page.locator('#patch-week-select option').count(),52);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'Pas de débordement : '+width);
   if(width===390)await page.screenshot({path:'tests/screenshots/v117-identite-390.png',fullPage:false});
   await page.waitForFunction(()=>!!navigator.serviceWorker.controller,{timeout:15000});
   await context.setOffline(true);await page.reload({waitUntil:'domcontentloaded'});
   await page.locator(nav+' [data-page="learn"]').click();
   await page.locator('#week-select').selectOption('2');
   assert.ok(await page.locator('[data-toggle="steps"]').first().isChecked(),'Ancienne progression conservée');
   assert.deepEqual(errors,[],'Aucune erreur JavaScript');
   await context.setOffline(false);await context.close();
   console.log('OK : nom, quinzaine, 4 ateliers, navigation, PWA, progression à '+width+'px');
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1});
