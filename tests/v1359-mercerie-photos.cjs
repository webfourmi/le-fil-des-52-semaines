const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
let old=false;
const baseline=new Map();
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp'};
const server=http.createServer((req,res)=>{
 try{
  const file=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\//,'')||'index.html';
  const target=path.resolve(root,file);if(!target.startsWith(root+path.sep))throw Error();
  let bytes;
  if(old){if(!baseline.has(file))baseline.set(file,execFileSync('git',['show','809beb3:'+file],{cwd:root,maxBuffer:20e6,stdio:['ignore','pipe','ignore']}));bytes=baseline.get(file)}else bytes=fs.readFileSync(target);
  res.writeHead(200,{'Content-Type':(mime[path.extname(file)]||'application/octet-stream')+'; charset=utf-8','Cache-Control':'no-store'});res.end(bytes);
 }catch{res.writeHead(404);res.end()}
});
async function fill(page,fields){for(const [name,value] of Object.entries(fields))await page.locator('#supply-new [name="'+name+'"]').fill(value)}
async function save(page){await page.locator('#supply-new [type=submit]').click();await page.locator('.supply-detail').waitFor()}
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const url='http://127.0.0.1:'+server.address().port+'/';
 const browser=await chromium.launch({headless:true,channel:process.env.TEST_BROWSER_CHANNEL||undefined});
 try{
  for(const width of [1366,390,320]){
   const context=await browser.newContext({viewport:{width,height:900},isMobile:width<600,hasTouch:width<600});
   const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(url);await page.getByRole('button',{name:'Viera',exact:true}).click();
   const nav=width<600?'#bottomnav':'#nav';
   await page.evaluate(()=>{
    localStorage.setItem('fil52.mercerie.v1.m',JSON.stringify([{id:'legacy1',name:'Ancien ruban',category:'Ruban',unit:'m',amount:1.5,color:'Or',location:'Tiroir 1',notes:'À conserver',photo:'',updatedAt:'2026-11-14T12:00:00Z'}]));
    Fil52Mercerie.add('f',{name:'Fil de Mathilde',category:'Fil',unit:'bobine',amount:2});
   });
   await page.locator(nav+' [data-page="supply"]').click();
   assert.equal(await page.locator('#supply-new').count(),0);
   assert.equal(await page.locator('#supply-search').isVisible(),false);
   await page.getByRole('button',{name:'Voir la fiche de Ancien ruban',exact:true}).click();
   assert.match(await page.locator('.supply-detail').innerText(),/1.5 m/);
   await page.getByRole('button',{name:'Modifier la fiche',exact:true}).click();
   await page.locator('#supply-new details').evaluate(el=>el.open=true);
   assert.equal(await page.locator('[name=amount]').inputValue(),'1.5');assert.equal(await page.locator('[name=unit]').inputValue(),'m');
   await fill(page,{amount:'2.25'});await page.locator('[name=unit]').selectOption('coupon');await save(page);
   assert.match(await page.locator('.supply-detail').innerText(),/2.25 coupon/);
   await page.getByRole('button',{name:'Ajouter une fourniture',exact:true}).click();
   assert.equal(await page.locator('#supply-new [required]').count(),2);
   await fill(page,{name:'Coton bleu'});await page.locator('[name=category]').selectOption('Tissu');await save(page);
   let item=await page.evaluate(()=>Fil52Mercerie.list('m').find(x=>x.name==='Coton bleu'));
   assert.equal(item.unit,'cm');assert.equal(item.width,null);assert.equal(item.length,null);
   await page.getByRole('button',{name:'Modifier la fiche',exact:true}).click();
   await fill(page,{name:'Lin fleuri',width:'140',length:'250.5',color:'Écru et rose',location:'Boîte verte',notes:'Composition : lin\nPour une robe'});
   await page.locator('[name=category]').selectOption('Autre');
   const photo=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=40;c.height=30;const ctx=c.getContext('2d');ctx.fillStyle='#d3947b';ctx.fillRect(0,0,40,30);return c.toDataURL('image/png').split(',')[1]});
   await page.locator('[name=initialPhoto]').setInputFiles({name:'coupon.png',mimeType:'image/png',buffer:Buffer.from(photo,'base64')});
   const cameraChooserPromise=page.waitForEvent('filechooser');await page.getByRole('button',{name:'Prendre une photo',exact:false}).click();const cameraChooser=await cameraChooserPromise;
   assert.equal(await cameraChooser.element().getAttribute('capture'),'environment');assert.equal(await cameraChooser.element().getAttribute('name'),'cameraPhoto');
   await cameraChooser.setFiles({name:'photo-camera.png',mimeType:'image/png',buffer:Buffer.from(photo,'base64')});
   assert.equal(await page.locator('[name=initialPhoto]').evaluate(el=>el.files.length),0);assert.match(await page.locator('#supply-photo-choice').innerText(),/Photo prise/);

   await save(page);
   item=await page.evaluate(()=>Fil52Mercerie.list('m').find(x=>x.name==='Lin fleuri'));
   assert.equal(item.amount,250.5);assert.equal(item.width,140);assert.equal(item.length,250.5);assert.equal(item.category,'Autre');assert.equal(item.color,'Écru et rose');assert.equal(item.location,'Boîte verte');assert.ok(item.photo.startsWith('data:image/jpeg;'));
   await page.evaluate(()=>{const before=Fil52Mercerie.list('m');Fil52Mercerie.importJSON('m',Fil52Mercerie.exportJSON('m'));if(JSON.stringify(before)!==JSON.stringify(Fil52Mercerie.list('m')))throw Error('Dimensions/photo backup mismatch')});
   await page.getByRole('button',{name:'Modifier la fiche',exact:true}).click();
   const fileChooserPromise=page.waitForEvent('filechooser');await page.getByRole('button',{name:'Choisir un fichier',exact:false}).click();const fileChooser=await fileChooserPromise;
   assert.equal(await fileChooser.element().getAttribute('capture'),null);assert.equal(await fileChooser.element().getAttribute('name'),'initialPhoto');
   await fileChooser.setFiles({name:'fichier-remplacement.png',mimeType:'image/png',buffer:Buffer.from(photo,'base64')});
   assert.equal(await page.locator('[name=cameraPhoto]').evaluate(el=>el.files.length),0);assert.match(await page.locator('#supply-photo-choice').innerText(),/Fichier choisi/);await save(page);

   await page.getByRole('button',{name:'Mes fournitures',exact:false}).first().click();
   assert.equal(await page.locator('.supply-tile-photo').count(),1);assert.equal(await page.locator('.supply-tile-placeholder').count(),1);
   const sizes=[];for(const size of ['small','medium','large']){await page.locator('#supply-catalog-size').selectOption(size);assert.equal(await page.locator('#supply-list').getAttribute('data-size'),size);sizes.push((await page.locator('.supply-tile-photo').boundingBox()).height);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:'../mercerie-'+width+'-'+size+'.png',fullPage:false})}
   assert.ok(sizes[0]<sizes[1]&&sizes[1]<sizes[2]);await page.locator('#supply-catalog-size').selectOption('small');assert.equal(await page.evaluate(()=>Fil52Mercerie.catalogSize('f')),'medium');

   await page.getByRole('button',{name:'Rechercher une fourniture',exact:true}).click();
   await page.locator('#supply-search').fill('ecru verte');assert.equal(await page.locator('[data-supply-card]:visible').count(),1);
   await page.getByRole('button',{name:'Rechercher une fourniture',exact:true}).click();assert.equal(await page.locator('#supply-search').isVisible(),false);assert.equal(await page.locator('[data-supply-card]:visible').count(),2);
   await page.getByRole('button',{name:'Voir la fiche de Lin fleuri',exact:true}).locator('img').click();assert.match(await page.locator('.supply-detail').innerText(),/250.5 cm/);
   await page.getByRole('button',{name:'Modifier la fiche',exact:true}).click();
   await fill(page,{color:'Modification annulée'});await page.getByRole('button',{name:'Annuler',exact:true}).click();
   assert.equal(await page.evaluate(()=>Fil52Mercerie.list('m').find(x=>x.name==='Lin fleuri').color),'Écru et rose');
   await page.getByRole('button',{name:'Modifier la fiche',exact:true}).click();
   await fill(page,{width:'',length:'',color:'',location:'',notes:''});await page.locator('[name=removePhoto]').check();await save(page);
   item=await page.evaluate(()=>Fil52Mercerie.list('m').find(x=>x.name==='Lin fleuri'));assert.equal(item.photo,'');assert.equal(item.width,null);assert.equal(item.length,null);assert.equal(item.color,'');
   await page.evaluate(()=>{const before=Fil52Mercerie.list('m');Fil52Mercerie.importJSON('m',Fil52Mercerie.exportJSON('m'));if(JSON.stringify(before)!==JSON.stringify(Fil52Mercerie.list('m')))throw Error('Backup mismatch');if(Fil52Mercerie.list('f').length!==1||Fil52Mercerie.list('f')[0].name!=='Fil de Mathilde')throw Error('Profile isolation');});
   await page.getByRole('button',{name:'Mes fournitures',exact:false}).first().click();
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'List layout '+width);await page.screenshot({path:'../mercerie-'+width+'.png',fullPage:false});
   await page.getByRole('button',{name:'Ajouter une fourniture',exact:true}).click();
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   await page.screenshot({path:'../mercerie-ajout-'+width+'.png',fullPage:false});
   await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
   await page.reload();await page.locator(nav+' [data-page="supply"]').click();assert.equal(await page.locator('#pwa-changelog-overlay').count(),0);assert.equal(await page.locator('#supply-search').isVisible(),false);
   assert.equal(await page.locator('[data-supply-card]').count(),2);assert.equal(await page.locator('#supply-catalog-size').inputValue(),'small');
   await context.setOffline(true);await page.reload();await page.locator(nav+' [data-page="supply"]').click();await page.getByRole('button',{name:'Voir la fiche de Lin fleuri',exact:true}).click();await page.getByRole('button',{name:'Modifier la fiche',exact:true}).click();await fill(page,{notes:'Modification hors connexion'});await save(page);
   assert.deepEqual(errors,[]);await context.close();console.log('OK camera/file choices, tile sizes and persistence; mercerie regression '+width+'px');
  }
  old=true;const context=await browser.newContext({viewport:{width:390,height:844}});const page=await context.newPage();
  await page.goto(url);await page.getByRole('button',{name:'Viera',exact:true}).click();await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
  await page.evaluate(()=>{Fil52Mercerie.add('m',{name:'Stock à garder',category:'Fil',unit:'bobine',amount:3});window.beforeUpdate=true});
  old=false;await page.evaluate(async()=>{await (await navigator.serviceWorker.ready).update()});
  await page.getByRole('button',{name:'Installer la mise à jour',exact:true}).waitFor();assert.match(await page.locator('#pwa-changelog-overlay').innerText(),/1\.3\.59/);assert.match(await page.locator('#pwa-changelog-overlay').innerText(),/Mercerie/);assert.equal(await page.evaluate(()=>window.beforeUpdate),true);
  await page.getByRole('button',{name:'Installer la mise à jour',exact:true}).click();await page.waitForFunction(()=>!window.beforeUpdate);await page.waitForFunction(()=>document.querySelector('#pwa-version')?.textContent.includes('1.3.59'));
  for(let i=0;i<2;i++){await page.reload();await page.waitForTimeout(1000);assert.equal(await page.locator('#pwa-changelog-overlay').count(),0);assert.equal(await page.locator('#pwa-notice').isVisible(),false)}
  assert.equal(await page.evaluate(()=>Fil52Mercerie.list('m')[0].amount),3);
  await context.close();console.log('OK update 1.3.58 → 1.3.59, preserved inventory, no repeated notice');
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);server.close();process.exitCode=1});
