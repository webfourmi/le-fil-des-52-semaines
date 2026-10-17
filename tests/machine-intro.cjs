'use strict';
const {chromium}=require('playwright');const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({headless:true});try{
 const context=await browser.newContext({viewport:{width:320,height:740}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('https://fonts.googleapis.com/**',r=>r.abort());await page.route('https://fonts.gstatic.com/**',r=>r.abort());
 await page.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded'});await page.getByRole('button',{name:'Viera',exact:true}).click();await page.locator('#bottomnav [data-page="learn"]').click();
 assert.equal(await page.locator('#week-select option').count(),52);
 await page.locator('.machine-intro-entry button').click();await page.getByRole('heading',{name:'Prendre en main ma machine'}).waitFor();
 assert.equal(await page.locator('[data-toggle="steps"]').count(),9);assert.equal(await page.locator('iframe').count(),0);
 assert.equal(await page.locator('.lesson-problem').count(),4);assert.ok(await page.getByText('Machine à l’arrêt',{exact:false}).count());
 for(const a of await page.locator('#app a').all()){assert.match(await a.getAttribute('href'),/^https:\/\/(www\.janome\.fr|www7\.janome\.co\.jp|consumer\.guetermann\.com)\//);assert.equal(await a.getAttribute('target'),'_blank');assert.match(await a.getAttribute('rel'),/noopener/)}
 await page.locator('[data-val="90000"]').check();await page.locator('.course-resume').click();assert.equal(await page.evaluate(()=>document.activeElement.querySelector('input')?.dataset.val),'90001');
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 const snapshot=await page.evaluate(()=>{const file=Fil52Backup.exportData(state,state.profile);const parsed=Fil52Backup.parseBackup(JSON.stringify(file));return {schema:file.schema,steps:Fil52Backup.applyBackup(state,parsed,state.profile).steps[state.profile],blocks:parsed.data.blocks,projectsDone:parsed.data.projectsDone}});
 assert.equal(snapshot.schema,4);assert.ok(snapshot.steps.includes(90000));assert.deepEqual(snapshot.blocks,[]);assert.deepEqual(snapshot.projectsDone,[]);
 await page.getByRole('button',{name:'Passer au cours 1',exact:false}).click();assert.equal(await page.locator('#week-select').inputValue(),'1');assert.equal(await page.locator('[data-toggle="steps"]').first().isChecked(),false);assert.ok(await page.getByText('0 étape sur 8 terminées pour Viera',{exact:true}).count());
 await page.locator('[data-toggle="steps"][data-val="0"]').check();await page.locator('.machine-intro-entry button').click();assert.equal(await page.locator('[data-val="90000"]').isChecked(),true);
 await page.waitForFunction(()=>!!navigator.serviceWorker.controller);await context.setOffline(true);await page.reload({waitUntil:'domcontentloaded'});await page.locator('#bottomnav [data-page="learn"]').click();await page.locator('.machine-intro-entry button').click();assert.equal(await page.locator('[data-val="90000"]').isChecked(),true);
 for(const box of await page.locator('[data-toggle="steps"]').all())await box.check();assert.match(await page.locator('.course-resume').innerText(),/Revoir/);
 await page.locator('#bottomnav [data-page="home"]').click();assert.equal(await page.locator('.home-course').getAttribute('data-week'),'1');assert.equal(await page.locator('.home-patch').getAttribute('data-home-patch'),'1');assert.deepEqual(errors,[]);await context.setOffline(false);
 const other=await browser.newContext({viewport:{width:320,height:740}});const q=await other.newPage();await q.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded'});await q.getByRole('button',{name:'Mathilde',exact:true}).click();await q.locator('#bottomnav [data-page="learn"]').click();await q.locator('.machine-intro-entry button').click();assert.equal(await q.locator('[data-val="90000"]').isChecked(),false);await other.close();
 console.log('OK : cours 0, neuf étapes, reprise, sources Janome, sauvegarde inchangée, hors connexion et 52 semaines préservées');
 }finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
