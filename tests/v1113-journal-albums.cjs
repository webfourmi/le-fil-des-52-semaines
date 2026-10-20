'use strict';
const assert=require('node:assert/strict');
const {chromium}=require('playwright'),fs=require('node:fs/promises');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  for(const width of [320,390,1280]){
   const ctx=await browser.newContext({viewport:{width,height:width>850?900:840},acceptDownloads:true}),page=await ctx.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded'});
   await page.getByRole('button',{name:'Viera',exact:true}).click();
   const nav=width<=850?'#bottomnav':'#nav';
   await page.locator(nav+' [data-page="journal"]').click();
   assert.equal(await page.locator('[data-journal-kind]').count(),3,'Couture Patchwork Voyage');
   assert.equal(await page.locator('[data-journal-kind="sewing"]').getAttribute('aria-pressed'),'true');
   assert.equal(await page.locator('#journal-week option').count(),52);
   await page.locator('[data-note="1"]').fill('Notre joli marque-page réversible.');
   const sample=await page.evaluate(()=>{
    const c=document.createElement('canvas');c.width=30;c.height=32;
    c.getContext('2d').fillRect(0,0,30,32);
    return c.toDataURL('image/png').split(',')[1];
   });
   const photo={name:'cousette.png',mimeType:'image/png',buffer:Buffer.from(sample,'base64')};
   for(let i=1;i<=5;i++){
    await page.locator('[data-journal-photo-upload]').setInputFiles(photo);
    await page.waitForFunction(n=>document.querySelectorAll('.journal-photo-card').length===n,i);
   }
   assert.equal(await page.locator('.journal-photo-card').count(),5,'Cinq photos par projet couture');
   assert.equal(await page.locator('[data-journal-photo-upload]').count(),0,'Capacité maximale atteinte');
   assert.equal(await page.locator('[data-journal-photo-share]').count(),5,'Partage volontaire par photo');
   await page.locator('[data-journal-kind="patchwork"]').click();
   assert.equal(await page.locator('#journal-item option').count(),52);
   assert.equal(await page.locator('.journal-photo-card').count(),0,'Le bloc possède un album indépendant');
   await page.locator('[data-journal-block="1"]').check();
   await page.locator('[data-journal-other-note]').fill('Carré à quatre pièces.');
   await page.locator('[data-journal-photo-upload]').setInputFiles(photo);
   await page.locator('.journal-photo-card').first().waitFor();
   await page.locator('[data-journal-kind="voyage"]').click();
   assert.ok(await page.locator('#journal-item option').count()>=4,'Voyages et histoire disponibles');
   await page.locator('#journal-item').selectOption('world:halloween');
   await page.locator('[data-journal-other-note]').fill('Visage de la citrouille à reprendre.');
   await page.locator('[data-journal-photo-upload]').setInputFiles(photo);
   await page.locator('.journal-photo-card').first().waitFor();
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'Aucun débordement '+width);
   await page.getByRole('button',{name:/Sauvegarder mon journal/}).click();
   const pending=page.waitForEvent('download');
   await page.locator('#backup-export').click();
   const download=await pending,data=JSON.parse(await fs.readFile(await download.path(),'utf8'));
   assert.equal(data.schema,6);
   assert.equal(data.journalPhotos.length,7);
   assert.equal(data.data.journalNotes['patchwork:1'],'Carré à quatre pièces.');
   assert.equal(data.data.journalNotes['voyage:world:halloween'],'Visage de la citrouille à reprendre.');
   assert.equal(data.data.notes['1'],'Notre joli marque-page réversible.');
   assert.equal(data.data.blocks.includes(1),true);
   await page.reload({waitUntil:'domcontentloaded'});
   await page.locator(nav+' [data-page="journal"]').click();
   await page.waitForFunction(()=>document.querySelectorAll('.journal-photo-card').length===5);
   assert.equal(await page.locator('[data-note="1"]').inputValue(),'Notre joli marque-page réversible.');
   assert.deepEqual(errors,[]);
   await ctx.close();
   console.log('OK V1.1.13 '+width+'px : onglets, 5 photos, albums indépendants, partage et sauvegarde V6');
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1});
