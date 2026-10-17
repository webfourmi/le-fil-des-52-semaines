/* V0.5 : vérifications d'ergonomie en WebKit mobile (moteur de Safari).
 * Cela ne remplace pas l'installation réelle sur un iPhone.
 */
'use strict';
const {webkit, devices} = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const BASE = process.env.TEST_BASE_URL || 'http://127.0.0.1:8765/';

async function createPhoto(page){
 const raw=await page.evaluate(async()=>{
   const canvas=document.createElement('canvas');
   canvas.width=120;canvas.height=120;
   const context=canvas.getContext('2d');
   context.fillStyle='#809888';context.fillRect(0,0,120,120);
   context.fillStyle='#d4a89c';context.fillRect(25,25,70,70);
   const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
   return Array.from(new Uint8Array(await blob.arrayBuffer()));
 });
 return Buffer.from(raw);
}

async function run(){
 const browser=await webkit.launch({headless:true});
 try{
   const context=await browser.newContext({...devices['iPhone 13'],acceptDownloads:true});
   const page=await context.newPage();
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(BASE,{waitUntil:'domcontentloaded'});
   const info=await page.evaluate(()=>({
     width:document.documentElement.scrollWidth,
     viewport:innerWidth,
     manifest:document.querySelector('link[rel="manifest"]')?.href,
     icon:document.querySelector('link[rel="apple-touch-icon"]')?.href
   }));
   assert.ok(info.width<=info.viewport+2,'Débordement horizontal sur iPhone');
   assert.ok(info.manifest?.includes('manifest.webmanifest'));
   assert.ok(info.icon?.includes('pwa-icon-180.png'));
   await page.getByRole('button',{name:'Viera',exact:true}).click();
   await page.locator('details.pwa-panel > summary').click();
   await page.getByRole('button',{name:'Comment l’installer ?'}).click();
   await page.getByText('Sur l’écran d’accueil',{exact:false}).waitFor();
   console.log('OK Safari WebKit : accueil et instructions iPhone');
   await page.locator('#bottomnav [data-page="journal"]').click();
   await page.locator('[data-note="1"]').fill('Essai WebKit et sauvegarde personnelle.');
   await page.locator('[data-gallery-upload="block"]').setInputFiles({
     name:'patchwork.png',mimeType:'image/png',buffer:await createPhoto(page)
   });
   await page.locator('#journal-gallery img').first().waitFor({state:'visible',timeout:12000});
   assert.ok((await page.locator('#journal-gallery img').first().getAttribute('src')).startsWith('data:image/jpeg'));
   await page.reload({waitUntil:'domcontentloaded'});
   await page.locator('#bottomnav [data-page="journal"]').click();
   await page.locator('#journal-gallery img').first().waitFor({state:'visible',timeout:12000});
   assert.equal(await page.locator('[data-note="1"]').inputValue(),'Essai WebKit et sauvegarde personnelle.');
   console.log('OK Safari WebKit : photographie et note préservées après réouverture');
   await page.getByRole('button',{name:'Sauvegarder mon journal'}).click();
   const pending=page.waitForEvent('download',{timeout:12000});
   await page.locator('#backup-export').click();
   const download=await pending;
   const backup=JSON.parse(await fs.readFile(await download.path(),'utf8'));
   assert.equal(backup.profile,'m');
   assert.equal(backup.photos.length,1);
   assert.equal(backup.data.notes['1'],'Essai WebKit et sauvegarde personnelle.');
   console.log('OK Safari WebKit : téléchargement JSON individuel avec photo');
   assert.deepEqual(errors,[],errors.join('; '));
   await context.close();
 }finally{await browser.close()}
}
run().catch(e=>{console.error('Échec Safari WebKit :',e.stack||e);process.exitCode=1});
