'use strict';
/* Test de sécurité des carnets installés : photo IndexedDB et export JSON,
   y compris quand un appareil reste sans réseau. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
async function photoPNG(page){
  const bytes=await page.evaluate(async()=>{
    const canvas=document.createElement('canvas');canvas.width=128;canvas.height=128;
    const c=canvas.getContext('2d');c.fillStyle='#e4bb9b';c.fillRect(0,0,128,128);
    c.fillStyle='#436a5f';c.fillRect(18,18,92,92);
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
    return Array.from(new Uint8Array(await blob.arrayBuffer()));
  });
  return Buffer.from(bytes);
}
async function openJournal(page){
  await page.locator('#bottomnav [data-page="journal"]').click();
  await page.locator('[data-note="1"]').waitFor();
}
async function saveSnapshot(page){
  await page.getByRole('button',{name:'Sauvegarder mon journal'}).click();
  const pending=page.waitForEvent('download',{timeout:20000});
  await page.locator('#backup-export').click();
  const download=await pending;
  const fs=require('node:fs/promises');
  const raw=await fs.readFile(await download.path(),'utf8');
  return JSON.parse(raw);
}
(async()=>{
  const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  try{
    const context=await browser.newContext({viewport:{width:390,height:844},acceptDownloads:true});
    const page=await context.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded'});
    await page.getByRole('button',{name:'Viera',exact:true}).click();
    await openJournal(page);
    const note='Carré patchwork à fleurs, à garder même hors ligne.';
    await page.locator('[data-note="1"]').fill(note);
    await page.locator('[data-journal-photo-upload]').setInputFiles({
      name:'carre.png',mimeType:'image/png',buffer:await photoPNG(page)
    });
    await page.locator('#journal-gallery img').first().waitFor({state:'visible',timeout:15000});
    const originalPhoto=await page.locator('#journal-gallery img').first().getAttribute('src');
    assert.ok(originalPhoto.startsWith('data:image/jpeg;'));
    const before=await saveSnapshot(page);
    assert.equal(before.journalPhotos.length,1);
    assert.equal(before.data.notes['1'],note);
    await page.waitForFunction(()=>!!navigator.serviceWorker.controller,{timeout:15000});
    await context.setOffline(true);
    await page.reload({waitUntil:'domcontentloaded',timeout:20000});
    await openJournal(page);
    await page.locator('#journal-gallery img').first().waitFor({state:'visible',timeout:15000});
    assert.equal(await page.locator('[data-note="1"]').inputValue(),note);
    assert.equal(await page.locator('#journal-gallery img').first().getAttribute('src'),originalPhoto);
    console.log('OK : carnet, photo locale et note conservés après ouverture hors connexion.');
    const after=await saveSnapshot(page);
    assert.equal(after.profile,'m');
    assert.equal(after.data.notes['1'],note);
    assert.equal(after.journalPhotos.length,1);
    assert.equal(after.journalPhotos[0].dataUrl,before.journalPhotos[0].dataUrl);
    console.log('OK : sauvegarde personnelle JSON téléchargeable sans Internet, photo comprise.');
    assert.deepEqual(errors,[],'Erreurs navigateur : '+errors.join(', '));
    await context.close();
  }finally{await browser.close()}
})().catch(error=>{console.error('Échec du test album hors connexion',error.stack||error);process.exitCode=1});
