'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
 const context=await browser.newContext({viewport:{width:320,height:740}});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8765/');
 await page.getByRole('button',{name:'Viera',exact:true}).click();
 await page.locator('#bottomnav [data-page="learn"]').click();
 for(let w=1;w<=6;w++){
 await page.locator('#week-select').selectOption(String(w));
 await page.locator('.sewing-photo-gallery').waitFor();
 assert.equal(await page.locator('.lesson-photo-grid figure').count(),5);
 assert.equal(await page.locator('.sewing-photo-gallery figure').count(),5);
 assert.equal(await page.locator('.patchwork-photo-gallery figure').count(),0);
 assert.equal(await page.locator('.patchwork-one,[data-lesson-patch]').count(),0);
 assert.equal(await page.locator('.lesson-photo-empty').count(),5);
 assert.equal(await page.locator('.lesson-photo-grid img, .lesson-photo-open').count(),0);
 assert.equal(await page.locator('.sewing-photo-gallery .lesson-photo-grid').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),2);
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 }
 await page.locator('#bottomnav [data-page="quilt"]').click();
 assert.equal(await page.locator('.sewing-photo-gallery').count(),0);
 assert.equal(await page.locator('.patchwork-photo-gallery figure').count(),1);
 assert.match(await page.locator('.patchwork-photo-gallery').innerText(),/damier à quatre carrés/);
 assert.doesNotMatch(await page.locator('.patchwork-photo-gallery').innerText(),/marque-page/);
 await page.locator('#bottomnav [data-page="learn"]').click();
 await page.locator('#week-select').selectOption('7');
 assert.equal(await page.locator('.lesson-gallery').count(),0);
 await page.locator('#week-select').selectOption('1');
 const before=await page.evaluate(()=>JSON.stringify(localStorage));
 // Visuel existant utilisé uniquement dans la session de test, sans modifier le contenu livré.
 await page.evaluate(()=>{Fil52LessonPhotos.lessons[1][0].image={src:'./assets/atelier.webp',alt:'Matériel de test',width:1,height:1};document.querySelector('.sewing-photo-gallery').outerHTML=Fil52LessonPhotos.render(1)});
 const open=page.getByRole('button',{name:/Agrandir/});await open.focus();await page.keyboard.press('Enter');
 await page.getByRole('dialog').waitFor();
 assert.equal(await page.locator('dialog img').getAttribute('alt'),'Matériel de test');
 await page.keyboard.press('Escape');assert.ok(await open.evaluate(el=>el===document.activeElement));
 await open.click();await page.getByRole('button',{name:'Fermer la photo'}).click();
 await page.locator('#bottomnav [data-page="quilt"]').click();await page.evaluate(()=>{Fil52LessonPhotos.lessons[1][5].image={src:'./assets/atelier.webp',alt:'Damier de test'};document.querySelector('.patchwork-photo-gallery').outerHTML=Fil52LessonPhotos.renderPatchwork(1)});
 await page.locator('.patchwork-photo-gallery .lesson-photo-open').click();
 assert.equal(await page.locator('dialog img').getAttribute('alt'),'Damier de test');
 assert.match(await page.locator('dialog figcaption').innerText(),/Bloc 1 : damier/);
 await page.keyboard.press('Escape');
 await page.locator('#bottomnav [data-page="learn"]').click();await page.evaluate(()=>{Fil52LessonPhotos.lessons[1][0].image={src:'./assets/atelier.webp',alt:'Matériel de test',width:1,height:1};document.querySelector('.sewing-photo-gallery').outerHTML=Fil52LessonPhotos.render(1)});await page.evaluate(()=>document.querySelector('.sewing-photo-gallery .lesson-photo-open img').dispatchEvent(new Event('error')));
 assert.equal(await page.getByText('Photo indisponible',{exact:true}).count(),1);
 assert.equal(await page.evaluate(()=>JSON.stringify(localStorage)),before);
 await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
 await context.setOffline(true);await page.reload();await page.locator('#bottomnav [data-page="learn"]').click();
 for(let w=1;w<=6;w++){await page.locator('#week-select').selectOption(String(w));assert.equal(await page.locator('.lesson-photo-empty').count(),5)}
 assert.deepEqual(errors,[]);console.log('OK : 36 emplacements, mobile, clavier, focus, stockage inchangé et hors connexion');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
