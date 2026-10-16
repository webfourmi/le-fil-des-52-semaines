'use strict';
const {chromium}=require('playwright');const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({headless:true});try{
 const context=await browser.newContext({viewport:{width:320,height:740}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded'});await page.getByRole('button',{name:'Moi',exact:true}).click();
 await page.waitForFunction(()=>homeNext('projectsDone')===1 && !!upcomingEditions[2]);
 const home=async()=>page.locator('#bottomnav [data-page="home"]').click();
 const expectTargets=async(course,patch)=>{assert.equal(await page.locator('.home-course').getAttribute('data-week'),course===null?null:String(course));assert.equal(await page.locator('.home-patch').getAttribute('data-home-patch'),patch===null?null:String(patch));};
 await expectTargets(1,1);await page.screenshot({path:'../home-progress-mobile.png'});assert.equal(await page.locator('.hero-actions [data-page="world"],.feature-grid [data-page="world"]').count(),0);assert.equal(await page.locator('#bottomnav [data-page="world"]').count(),1);
 // Le choix d'une semaine ne change pas les raccourcis personnels.
 await page.locator('.home-course').click();assert.equal(await page.locator('#week-select').inputValue(),'1');
 for(const box of await page.locator('[data-toggle="steps"]').all())await box.check();
 await home();await expectTargets(1,1);
 await page.locator('.home-course').click();await page.locator('[data-journal-complete="1"]').check();await home();await expectTargets(2,1);
 assert.match(await page.locator('.feature-sew h3').innerText(),/Dessous de verre/);
 await page.locator('.home-patch').click();assert.equal(await page.locator('#week-select').inputValue(),'1');assert.ok(await page.locator('.patchwork-one').evaluate(el=>el===document.activeElement));
 await page.locator('.patchwork-one [data-quilt-block="1"]').click();await home();await expectTargets(2,2);
 await page.locator('.home-patch').click();assert.equal(await page.locator('#week-select').inputValue(),'2');assert.ok(await page.locator('[data-lesson-patch="2"]').evaluate(el=>el===document.activeElement));
 await page.locator('#week-select').selectOption('1');await page.locator('[data-journal-complete="1"]').uncheck();await home();await expectTargets(1,2);
 // Validations non consécutives : reprendre le premier trou, sans sauter de cours.
 await page.evaluate(()=>{state.projectsDone.m=[2,3];state.blocks.m=[2,3];save();render()});await expectTargets(1,1);
 // Fin des éditions disponibles : ne pas envoyer vers la semaine 7 non publiée.
 await page.evaluate(()=>{state.projectsDone.m=[1,2,3,4,5,6];state.blocks.m=[1,2,3,4,5,6];save();render()});await expectTargets(null,null);assert.equal(await page.locator('.home-course').getAttribute('data-page'),'learn');assert.equal(await page.locator('.home-patch').getAttribute('data-page'),'quilt');
 await page.evaluate(()=>{state.projectsDone.m=[1];state.blocks.m=[];save();render()});await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>!!upcomingEditions[2]);await expectTargets(2,1);
 await page.waitForFunction(()=>!!navigator.serviceWorker.controller);await context.setOffline(true);await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>!!upcomingEditions[2]);await expectTargets(2,1);
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);
 await context.setOffline(false);const other=await browser.newContext();const q=await other.newPage();await q.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded'});await q.getByRole('button',{name:'Mathilde',exact:true}).click();assert.equal(await q.locator('.home-course').getAttribute('data-week'),'1');assert.equal(await q.locator('.home-patch').getAttribute('data-home-patch'),'1');await other.close();
 console.log('OK : accueil personnalisé, validations indépendantes, liens ciblés, trous, fin des publications, profils et hors connexion');
 }finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
