'use strict';
const {chromium}=require('playwright');const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({headless:true});try{
 const context=await browser.newContext({viewport:{width:320,height:740}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('https://fonts.googleapis.com/**',r=>r.abort());await page.route('https://fonts.gstatic.com/**',r=>r.abort());
 await page.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded'});await page.getByRole('button',{name:'Moi',exact:true}).click();await page.waitForFunction(()=>!!upcomingEditions[6]);
 await page.locator('#bottomnav [data-page="learn"]').click();await page.locator('.course-patchwork button').click();
 assert.equal(await page.locator('[data-patch-course]').count(),53);assert.equal(await page.locator('.quilt button[data-quilt-block]').count(),52);
 const panel=n=>page.locator('[data-patch-course="'+n+'"]');assert.equal(await panel(0).evaluate(el=>el.open),false);
 await panel(0).locator('summary').focus();await page.keyboard.press('Enter');await page.waitForFunction(()=>document.querySelector('[data-patch-course="0"]').open);
 assert.ok(await panel(0).getByRole('heading',{name:'Le nécessaire pour commencer'}).count());assert.match(await panel(0).innerText(),/7,5 mm/);assert.match(await panel(0).innerText(),/21,5 × 21,5 cm/);assert.equal(await panel(0).locator('[data-quilt-block]').count(),0);
 for(let w=1;w<=6;w++){if(!(await panel(w).evaluate(el=>el.open)))await panel(w).locator('summary').click();assert.equal(await panel(w).locator('.lesson-patch-done').count(),1);assert.equal(await panel(w).locator('.patchwork-photo-gallery figure').count(),1)}
 await panel(2).locator('.lesson-patch-done').click();assert.equal(await panel(2).locator('.lesson-patch-done').getAttribute('aria-pressed'),'true');assert.equal(await page.locator('.quilt [data-quilt-block="2"]').getAttribute('aria-pressed'),'true');assert.equal(await panel(0).evaluate(el=>el.open),true);assert.equal(await panel(3).evaluate(el=>el.open),true);
 await panel(7).locator('summary').click();assert.equal(await panel(7).locator('.lesson-patch-done').count(),0);assert.match(await panel(7).innerText(),/À venir/);
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.waitForFunction(()=>!!navigator.serviceWorker.controller);await context.setOffline(true);await page.reload({waitUntil:'domcontentloaded'});await page.locator('#bottomnav [data-page="learn"]').click();await page.locator('.course-patchwork button').click();await page.waitForFunction(()=>!!document.querySelector('[data-patch-course="6"] .lesson-patch-done'));
 await panel(2).locator('summary').click();assert.equal(await panel(2).locator('.lesson-patch-done').getAttribute('aria-pressed'),'true');assert.equal(await panel(2).locator('.sewing-photo-gallery').count(),0);
 await page.screenshot({path:'../patchwork-courses-mobile.png'});assert.deepEqual(errors,[]);await context.setOffline(false);
 const other=await browser.newContext({viewport:{width:390,height:844}});const q=await other.newPage();await q.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded'});await q.getByRole('button',{name:'Mathilde',exact:true}).click();await q.waitForFunction(()=>!!upcomingEditions[2]);await q.locator('#bottomnav [data-page="learn"]').click();await q.locator('.course-patchwork button').click();assert.equal(await q.locator('.quilt [data-quilt-block="2"]').getAttribute('aria-pressed'),'false');await other.close();
 console.log('OK : cours 0 matériel, 52 volets, clavier, fiches publiées, ouverts conservés, coches, mobile, profils et hors connexion');
 }finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
