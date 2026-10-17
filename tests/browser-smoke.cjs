/* Vérifications navigateur de la V0.4.
   Aucun fichier image pré-encodé : un PNG est créé par canvas dans Chromium.
   Démarrer un serveur statique sur le port 8765, puis : node tests/browser-smoke.cjs
 */
'use strict';
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const BASE = process.env.TEST_BASE_URL || 'http://127.0.0.1:8765/';

async function makeTestImage(page) {
  const bytes = await page.evaluate(async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#9bac90';
    ctx.fillRect(0, 0, 64, 64);
    ctx.fillStyle = '#a45243';
    ctx.fillRect(12, 12, 40, 40);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    return Array.from(new Uint8Array(await blob.arrayBuffer()));
  });
  return Buffer.from(bytes);
}
async function start(browser, person, viewport={width:390,height:844}) {
  const context = await browser.newContext({viewport,acceptDownloads:true});
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.route('https://fonts.googleapis.com/**', r => r.abort());
  await page.route('https://fonts.gstatic.com/**', r => r.abort());
  await page.goto(BASE,{waitUntil:'domcontentloaded'});
  await page.getByRole('button',{name:person,exact:true}).click();
  return {context,page,errors};
}
async function journal(page){
  await page.locator('#bottomnav [data-page="journal"]').click();
  await page.getByRole('heading',{name:'Mon journal de couture'}).waitFor();
}
async function main(){
  const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const cases=[];const pass=(name)=>{cases.push(name);console.log('OK  '+name)};
  const contexts=[];let temp='';
  try {
    const moi=await start(browser,'Viera');contexts.push(moi.context);
    const p=moi.page;
    assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2));
    assert.equal(await p.locator('#bottomnav button').count(),6);
    pass('Navigation mobile 390 px : cinq onglets et aucun débordement');
    await journal(p);
    await p.locator('[data-journal-complete="1"]').check();
    await p.locator('[data-journal-block="1"]').check();
    await p.locator('[data-note="1"]').fill('Une chute de coton fleuri.');
    const img=await makeTestImage(p);
    await p.locator('[data-gallery-upload="project"]').setInputFiles({
      name:'coton.png',mimeType:'image/png',buffer:img
    });
    await p.locator('#journal-gallery img').first().waitFor({state:'visible',timeout:15000});
    pass('Photo JPEG issue de la compression du PNG visible dans le journal');
    await p.reload({waitUntil:'domcontentloaded'});
    await journal(p);
    await p.locator('#journal-gallery img').first().waitFor({state:'visible',timeout:15000});
    assert.ok(await p.locator('[data-journal-complete="1"]').isChecked());
    assert.ok(await p.locator('[data-journal-block="1"]').isChecked());
    assert.equal(await p.locator('[data-note="1"]').inputValue(),'Une chute de coton fleuri.');
    pass('Photo, notes et coches conservées après rechargement');
    await p.getByRole('button',{name:'Sauvegarder mon journal'}).click();
    const downloaded=p.waitForEvent('download');
    await p.locator('#backup-export').click();
    const download=await downloaded;
    assert.match(download.suggestedFilename(),/^fil52-moi-.*\.json$/);
    temp=path.join(os.tmpdir(),'fil52-test-'+Date.now()+'.json');
    await fs.copyFile(await download.path(),temp);
    const data=JSON.parse(await fs.readFile(temp,'utf8'));
    assert.equal(data.profile,'m');
    assert.equal(data.data.notes['1'],'Une chute de coton fleuri.');
    assert.equal(data.photos.length,1);
    assert.ok(data.photos[0].dataUrl.startsWith('data:image/jpeg;'));
    pass('Fichier téléchargé : notes + progression + photo personnelle');
    const fille=await start(browser,'Mathilde');contexts.push(fille.context);
    await journal(fille.page);
    assert.equal(await fille.page.locator('[data-note="1"]').inputValue(),'');
    assert.equal(await fille.page.locator('#journal-gallery img').count(),0);
    pass('Carnet Mathilde séparé sur un second navigateur');
    await fille.page.getByRole('button',{name:'Sauvegarder mon journal'}).click();
    await fille.page.locator('#backup-file').setInputFiles(temp);
    await fille.page.getByText('Import refusé :').waitFor({timeout:5000});
    assert.ok(await fille.page.locator('#backup-restore').isDisabled());
    pass('Fichier Viera refusé par le carnet Mathilde');
    const autre=await start(browser,'Viera');contexts.push(autre.context);
    await journal(autre.page);
    await autre.page.getByRole('button',{name:'Sauvegarder mon journal'}).click();
    await autre.page.locator('#backup-file').setInputFiles(temp);
    // prepareBackup() lit et valide le fichier de façon asynchrone.
    // Attendre la fin de ce traitement plutôt que constater son état initial.
    await autre.page.waitForFunction(() => {
      const b = document.getElementById('backup-restore');
      const preview = document.getElementById('backup-preview');
      return (b && !b.disabled) || (preview && /Import refusé/.test(preview.textContent));
    }, {timeout:10000});
    assert.ok(await autre.page.locator('#backup-restore').isEnabled(),
      'Import refusé : '+await autre.page.locator('#backup-preview').textContent());
    autre.page.once('dialog',dialog=>dialog.accept());
    await autre.page.locator('#backup-restore').click();
    await journal(autre.page);
    await autre.page.locator('#journal-gallery img').first().waitFor({state:'visible',timeout:15000});
    assert.equal(await autre.page.locator('[data-note="1"]').inputValue(),'Une chute de coton fleuri.');
    pass('Restauration sur un nouvel appareil : photo et notes récupérées');
    await autre.page.locator('#bottomnav [data-page="print"]').click();
    assert.ok(await autre.page.locator('.print-sheet').count()>=2);
    await autre.page.evaluate(()=>document.querySelector('#print-marker').classList.add('active'));
    const pdf=await autre.page.pdf({format:'A4',printBackground:true});
    assert.ok(pdf.toString('utf8',0,4)==='%PDF');
    pass('Patron A4 présent et imprimable en PDF');
    const desktop=await start(browser,'Viera',{width:1280,height:900});contexts.push(desktop.context);
    assert.ok(await desktop.page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2));
    pass('Aucun débordement à 1 280 px');
    for(const c of [moi,fille,autre,desktop]){
      assert.deepEqual(c.errors,[], 'Erreur JavaScript navigateur : '+c.errors.join(', '));
    }
    console.log('\n'+cases.length+' contrôles Chromium réussis.');
  } finally {
    for(const ctx of contexts)await ctx.close();
    if(temp)await fs.unlink(temp).catch(()=>{});
    await browser.close();
  }
}
main().catch(error=>{console.error('Échec Chromium :',error.stack||error);process.exitCode=1});
