'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
async function photo(page,color){
 const array=await page.evaluate(async c=>{
  const canvas=document.createElement('canvas');canvas.width=96;canvas.height=96;
  const ctx=canvas.getContext('2d');ctx.fillStyle=c;ctx.fillRect(0,0,96,96);
  const blob=await new Promise(r=>canvas.toBlob(r,'image/png'));
  return Array.from(new Uint8Array(await blob.arrayBuffer()));
 },color);
 return Buffer.from(array);
}
async function launch(browser,profile){
 const ctx=await browser.newContext({viewport:{width:390,height:844},acceptDownloads:true});
 const page=await ctx.newPage();const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded'});
 await page.getByRole('button',{name:profile,exact:true}).click();
 return {ctx,page,errors};
}
async function toPersonal(page){
 await page.locator('#bottomnav [data-page="journal"]').click();
 await page.getByRole('button',{name:/Mes projets persos/}).click();
 await page.getByRole('heading',{name:'Projets persos'}).waitFor();
}
async function backupJSON(page){
 await page.getByRole('button',{name:'Sauvegarder mes créations'}).click();
 const promise=page.waitForEvent('download',{timeout:20000});
 await page.locator('#backup-export').click();
 const download=await promise;
 return JSON.parse(await fs.readFile(await download.path(),'utf8'));
}
async function importJSON(page,data){
 await page.locator('#backup-file').setInputFiles({
  name:'mon-carnet.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))
 });
 await page.waitForFunction(()=>{
  const button=document.getElementById('backup-restore');
  const preview=document.getElementById('backup-preview');
  return !button?.disabled || /Import refusé/.test(preview?.textContent||'');
 },{timeout:10000});
 assert.ok(await page.locator('#backup-restore').isEnabled(),await page.locator('#backup-preview').textContent());
 page.once('dialog',d=>d.accept());
 await page.locator('#backup-restore').click();
 await page.getByText('Carnet et galeries restaurés.').waitFor({timeout:10000});
}
async function main(){
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const holders=[];
 try{
  const one=await launch(browser,'Viera');holders.push(one);
  const p=one.page;await toPersonal(p);
  await p.locator('#personal-new-name').fill('Ma veste en velours');
  await p.getByRole('button',{name:'Ajouter ce projet'}).click();
  await p.locator('[data-personal-notes]').fill('Veste réalisée hors programme de 52 semaines.');
  const photo1=await photo(p,'#8e7165'),photo2=await photo(p,'#618d6b');
  await p.locator('[data-personal-upload]').setInputFiles({name:'devant.png',mimeType:'image/png',buffer:photo1});
  await p.locator('.personal-thumb img').first().waitFor({state:'visible',timeout:15000});
  await p.locator('[data-personal-upload]').setInputFiles({name:'dos.png',mimeType:'image/png',buffer:photo2});
  await p.waitForFunction(()=>document.querySelectorAll('.personal-thumb img').length===2,{timeout:15000});
  assert.equal(await p.locator('.personal-thumb img').count(),2);
  console.log('OK : projet libre et deux photos ajoutés');
  await p.waitForFunction(()=>!!navigator.serviceWorker.controller,{timeout:15000});
  await one.ctx.setOffline(true);
  await p.reload({waitUntil:'domcontentloaded'});
  await toPersonal(p);
  await p.locator('.personal-thumb img').first().waitFor({state:'visible',timeout:15000});
  assert.equal(await p.locator('.personal-thumb img').count(),2);
  assert.equal(await p.locator('[data-personal-notes]').inputValue(),'Veste réalisée hors programme de 52 semaines.');
  console.log('OK : projets libres, notes et photos hors connexion');
  const saved=await backupJSON(p);
  assert.equal(saved.schema,4);assert.equal(saved.profile,'m');
  assert.equal(saved.data.personalProjects.length,1);
  assert.equal(saved.personalPhotos.length,2);
  assert.ok(saved.personalPhotos.every(x=>x.dataUrl.startsWith('data:image/jpeg')));
  console.log('OK : archive V0.6 avec toutes les photos personnelles, exportée hors ligne');
  await one.ctx.setOffline(false);
  const two=await launch(browser,'Viera');holders.push(two);
  await toPersonal(two.page);
  assert.equal(await two.page.locator('.personal-card').count(),0);
  await two.page.getByRole('button',{name:'Sauvegarder mes créations'}).click();
  await importJSON(two.page,saved);
  await toPersonal(two.page);
  await two.page.locator('.personal-thumb img').first().waitFor({state:'visible',timeout:15000});
  assert.equal(await two.page.locator('.personal-thumb img').count(),2);
  assert.equal(await two.page.locator('[data-personal-notes]').inputValue(),'Veste réalisée hors programme de 52 semaines.');
  console.log('OK : restauration des projets libres sur un second navigateur');
  const old={...saved,schema:3,data:{...saved.data}};
  delete old.data.personalProjects;delete old.personalPhotos;
  await two.page.getByRole('button',{name:'Sauvegarder mes créations'}).click();
  await importJSON(two.page,old);
  await toPersonal(two.page);
  await two.page.locator('.personal-thumb img').first().waitFor({state:'visible',timeout:15000});
  assert.equal(await two.page.locator('.personal-thumb img').count(),2);
  console.log('OK : restauration ancien fichier V0.4 préserve les projets persos');
  const daughter=await launch(browser,'Mathilde');holders.push(daughter);
  await toPersonal(daughter.page);
  assert.equal(await daughter.page.locator('.personal-card').count(),0);
  await daughter.page.getByRole('button',{name:'Sauvegarder mes créations'}).click();
  await daughter.page.locator('#backup-file').setInputFiles({name:'sauvegarde.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(saved))});
  await daughter.page.getByText('Import refusé :').waitFor({timeout:10000});
  assert.ok(await daughter.page.locator('#backup-restore').isDisabled());
  console.log('OK : isolement Mathilde / Viera et refus du mauvais profil');
  await p.locator('#bottomnav [data-page="journal"]').click();
  await p.waitForFunction(()=>document.querySelectorAll('#journal-gallery .gallery-slot').length===2);
  await p.getByRole('button',{name:/Mes projets persos/}).click();
  p.once('dialog',dialog=>dialog.accept());
  await p.locator('[data-personal-photo-delete]').first().click();
  await p.waitForFunction(()=>document.querySelectorAll('.personal-thumb img').length===1);
  p.once('dialog',dialog=>dialog.accept());
  await p.locator('[data-personal-delete]').click();
  await p.waitForFunction(()=>document.querySelectorAll('.personal-card').length===0);
  console.log('OK : suppression d’une photo puis d’un projet sans toucher au journal des cours');
  for(const holder of holders)assert.deepEqual(holder.errors,[]);
 }finally{for(const holder of holders)await holder.ctx.close();await browser.close()}
}
main().catch(e=>{console.error('Échec test projets persos :',e.stack||e);process.exitCode=1});
