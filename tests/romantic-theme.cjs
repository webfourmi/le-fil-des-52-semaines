'use strict';
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const fs=require('node:fs/promises');
const url='http://127.0.0.1:8765/';
const must=(x,why)=>assert.ok(x,why);
async function main(){
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 await fs.mkdir('tests/screenshots',{recursive:true});
 try{
  for(const width of [320,390,1440]){
   const ctx=await browser.newContext({viewport:{width,height:width>850?900:844},deviceScaleFactor:1});
   const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(url,{waitUntil:'domcontentloaded'});
   await page.getByRole('button',{name:'Moi',exact:true}).click();
   const theme=await page.evaluate(()=>({
     loaded:[...document.styleSheets].some(s=>s.href?.includes('romantic-theme.css')),
     paper:getComputedStyle(document.documentElement).getPropertyValue('--paper').trim(),
     button:getComputedStyle(document.querySelector('.home-course')).borderRadius,
     stitch:getComputedStyle(document.querySelector('.pwa-panel')).borderTopStyle,
     flowers:getComputedStyle(document.querySelector('.hero-copy'),'::before').backgroundImage
   }));
   must(theme.loaded,'La feuille de style V1.1 doit être chargée.');
   assert.equal(theme.paper.toLowerCase(),'#f7f0e7');
   must(theme.stitch==='dashed','Bordure cousue du volet installation');
   must(theme.flowers.includes('romantic-botanical.svg'),'Fleurs dans le bandeau');
   for(const path of ['romantic-theme.css','romantic-botanical.svg','nav-history.svg']){
    const res=await page.request.get(url+'assets/'+path);assert.equal(res.status(),200,'Fichier manquant : '+path);
   }
   await page.screenshot({path:'tests/screenshots/v11-accueil-'+width+'.png',fullPage:width===390});
   const nav=width<=850?'#bottomnav':'#nav';
   assert.equal(await page.locator(nav+' .nav-art').count(),width<=850?6:8);
   await page.locator(nav+' [data-page="learn"]').click();
   await page.getByRole('heading',{name:'Mes cours'}).waitFor();
   must(await page.locator('.weektop').count()===1,'Entête du cours conservé');
   if(width===390)await page.screenshot({path:'tests/screenshots/v11-cours-mobile.png',fullPage:false});
   await page.locator(nav+' [data-page="quilt"]').click();
   await page.getByRole('heading',{name:'Ma couverture de 52 blocs'}).waitFor();
   must(await page.locator('.quilt .block').count()===56,'56 cases de couverture préservées');
   if(width===390)await page.screenshot({path:'tests/screenshots/v11-patchwork-mobile.png',fullPage:false});
   await page.locator(nav+' [data-page="world"]').click();
   await page.locator('.culture-tab img').first().waitFor();
   assert.equal(await page.locator('.culture-tab img').count(),2);
   for(const im of await page.locator('.culture-tab img').all()){
    must(await im.evaluate(e=>e.complete&&e.naturalWidth>0),'Bouton culturel illustré visible');
   }
   await page.locator('[data-culture-tab="history"]').click();
   await page.getByRole('heading',{name:/Bien avant nos machines/}).waitFor();
   if(width===390)await page.screenshot({path:'tests/screenshots/v11-voyage-mobile.png',fullPage:false});
   await page.locator(nav+' [data-page="journal"]').click();
   await page.getByRole('heading',{name:'Mon journal de couture'}).waitFor();
   if(width===390)await page.screenshot({path:'tests/screenshots/v11-journal-mobile.png',fullPage:false});
   if(width>850){
     await page.locator(nav+' [data-page="personal"]').click();
     await page.getByRole('heading',{name:'Projets persos'}).waitFor();
     await page.screenshot({path:'tests/screenshots/v11-projets-desktop.png',fullPage:false});
   }
   must(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'Aucun débordement horizontal, '+width+' px');
   await page.locator(nav+' [data-page="home"]').click();
   await page.waitForFunction(()=>navigator.serviceWorker.controller!==null,{timeout:15000});
   await ctx.setOffline(true);await page.reload({waitUntil:'domcontentloaded'});
   const offline=await page.evaluate(()=>{
     const color=getComputedStyle(document.documentElement).getPropertyValue('--paper').trim();
     const flowers=getComputedStyle(document.querySelector('.hero-copy'),'::before').backgroundImage;
     return {color,flowers,nav:document.querySelectorAll('#bottomnav img.nav-art').length};
   });
   assert.equal(offline.color.toLowerCase(),'#f7f0e7');
   must(offline.flowers.includes('romantic-botanical.svg'),'Fleurs hors connexion');
   assert.equal(offline.nav,6);
   await ctx.setOffline(false);assert.deepEqual(errors,[],errors.join('; '));
   await ctx.close();console.log('OK : carnet romantique et PWA à '+width+' px');
  }
 }finally{await browser.close()}
}
main().catch(e=>{console.error('Test V1.1 :',e.stack||e);process.exitCode=1});
