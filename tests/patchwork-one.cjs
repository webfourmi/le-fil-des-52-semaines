'use strict';
const {chromium}=require('playwright');const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({headless:true});try{
 const context=await browser.newContext({viewport:{width:320,height:740}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded'});await page.getByRole('button',{name:'Moi',exact:true}).click();await page.locator('#bottomnav [data-page="learn"]').click();
 await page.locator('#week-select').selectOption('1');
 const guide=page.locator('.patchwork-one');await guide.waitFor();assert.equal(await guide.count(),1);assert.equal(await guide.locator('.patchwork-one-steps>li').count(),9);
 assert.match(await guide.innerText(),/21,5 × 21,5 cm/);assert.match(await guide.innerText(),/20 × 20 cm/);assert.equal(await guide.locator('svg[aria-label]').count(),1);assert.equal(await guide.locator('.lesson-problem').count(),3);
 for(const problem of await guide.locator('details').all())await problem.locator('summary').click();
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await guide.locator('[data-quilt-block="1"]').click();assert.equal(await guide.locator('[data-quilt-block="1"]').getAttribute('aria-pressed'),'true');
 await page.locator('.course-patchwork button').click();assert.equal(await page.locator('.patchwork-one').count(),1);assert.equal(await page.locator('.patchwork-one [data-quilt-block="1"]').getAttribute('aria-pressed'),'true');
 await page.waitForFunction(()=>!!navigator.serviceWorker.controller);await context.setOffline(true);await page.reload({waitUntil:'domcontentloaded'});await page.locator('#bottomnav [data-page="learn"]').click();await page.locator('.course-patchwork button').click();await page.getByRole('heading',{name:'Le damier à quatre carrés',exact:true}).waitFor();assert.equal(await page.locator('.patchwork-one-steps>li').count(),9);assert.equal(await page.locator('.patchwork-one [data-quilt-block="1"]').getAttribute('aria-pressed'),'true');
 await page.setViewportSize({width:1280,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 assert.deepEqual(errors,[]);console.log('OK : neuf étapes du bloc 1, cotes, diagnostics, mobile, coche synchronisée et hors connexion');
 }finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
