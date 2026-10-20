'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const url='http://127.0.0.1:8765/';
async function main(){
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  const context=await browser.newContext({viewport:{width:390,height:844},acceptDownloads:true});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.getByRole('button',{name:'Viera',exact:true}).click();
  await page.locator('#bottomnav [data-page="journal"]').click();
  await page.getByRole('button',{name:/Mes projets personnels|Mes projets persos/}).click();
  await page.locator('#personal-new-name').fill('Patchwork photo : plusieurs étapes');
  await page.getByRole('button',{name:'Ajouter ce projet'}).click();
  const limit=await page.evaluate(()=>({max:Fil52PersonalPhotos.MAX_PHOTOS,per:Fil52PersonalPhotos.MAX_PER_PROJECT}));
  assert.deepEqual(limit,{max:100,per:20});
  const sample=await page.evaluate(async()=>{
    const cv=document.createElement('canvas');cv.width=80;cv.height=80;
    const ctx=cv.getContext('2d');ctx.fillStyle='#98745f';ctx.fillRect(0,0,80,80);
    const blob=await new Promise(resolve=>cv.toBlob(resolve,'image/png'));
    return Array.from(new Uint8Array(await blob.arrayBuffer()));
  });
  const files=Array.from({length:21},(_,i)=>({
    name:'ouvrage-'+String(i+1)+'.png',mimeType:'image/png',buffer:Buffer.from(sample)
  }));
  await page.locator('[data-personal-upload]').setInputFiles(files);
  await page.waitForFunction(()=>document.querySelectorAll('.personal-thumb img').length===20,{timeout:25000});
  assert.equal(await page.locator('.personal-thumb img').count(),20);
  assert.ok(await page.locator('[data-personal-upload]').isDisabled());
  console.log('OK : 20 photos par projet, la 21e est refusée sans effacer les autres.');
  await page.reload({waitUntil:'domcontentloaded'});
  await page.locator('#bottomnav [data-page="journal"]').click();
  await page.getByRole('button',{name:/Mes projets personnels|Mes projets persos/}).click();
  await page.waitForFunction(()=>document.querySelectorAll('.personal-thumb img').length===20,{timeout:12000});
  console.log('OK : 20 photos conservées après réouverture mobile.');
  await page.getByRole('button',{name:'Sauvegarder mes créations'}).click();
  const waiting=page.waitForEvent('download',{timeout:15000});
  await page.locator('#backup-export').click();
  const download=await waiting,backup=JSON.parse(await fs.readFile(await download.path(),'utf8'));
  assert.equal(backup.schema,6);
  assert.equal(backup.personalPhotos.length,20);
  console.log('OK : le fichier JSON conserve les 20 photographies et reste au format V0.6.');
  assert.deepEqual(errors,[],errors.join('; '));
  await context.close();
 }finally{await browser.close()}
}
main().catch(error=>{console.error('Échec augmentation de galerie :',error.stack||error);process.exitCode=1});
