'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const {chromium}=require('playwright');
async function main(){
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 await fs.mkdir('tests/screenshots',{recursive:true});
 try{
  for(const width of [320,390,1280]){
   const ctx=await browser.newContext({viewport:{width,height:width>850?900:844}});
   const page=await ctx.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded'});
   await page.getByRole('button',{name:'Viera',exact:true}).click();
   const nav=width<=850?'#bottomnav':'#nav';
   await page.locator(nav+' [data-page="learn"]').click();
   await page.getByRole('heading',{name:'Le premier point'}).waitFor();
   assert.equal(await page.locator('input[data-toggle="steps"]').count(),9,'9 étapes');
   const steps=await page.locator('input[data-toggle="steps"]').evaluateAll(items=>items.map(el=>Number(el.dataset.val)));
   assert.deepEqual(steps,[0,1,2,3,8,4,5,6,7],'Identifiants de progression des 8 étapes existantes intacts');
   assert.ok((await page.locator('.step').nth(4).innerText()).includes('Vlieseline H630'),'Renfort en cinquième étape');
   assert.ok((await page.locator('.sewing-variants').innerText()).includes('ruban'));
   assert.ok((await page.locator('.sewing-variants').innerText()).includes('matelassé'));
   assert.equal(await page.locator('.sewing-variant-diagram').count(),2);
   assert.ok((await page.locator('.material').allTextContents()).some(t=>t.includes('Vlieseline H630')));
   await page.locator('.sewing-course-tools [data-dico-toggle]').click();
   assert.equal(await page.locator('.sewing-term').count(),8);
   for(const term of ['Droit-fil','Surfilage','Molleton','Matelassage']){
    const item=page.locator('.sewing-term').filter({has:page.locator('summary', {hasText:term})});
    assert.equal(await item.count(),1,'Entrée manquante du dictionnaire : '+term);
    await item.locator('summary').click();
    assert.ok((await item.innerText()).length>80,'Définition trop courte : '+term);
   }
   await page.locator('input[data-toggle="steps"][data-val="4"]').check();
   await page.locator('input[data-toggle="steps"][data-val="8"]').check();
   await page.reload({waitUntil:'domcontentloaded'});
   await page.locator(nav+' [data-page="learn"]').click();
   await page.getByRole('heading',{name:'Le premier point'}).waitFor();
   assert.ok(await page.locator('input[data-toggle="steps"][data-val="4"]').isChecked(),'ancienne progression conservée');
   assert.ok(await page.locator('input[data-toggle="steps"][data-val="8"]').isChecked(),'nouveau renfort coché');
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'Débordement horizontal : '+width);
   if(width===390)await page.screenshot({path:'tests/screenshots/cours01-h630-mobile.png',fullPage:true});
   if(width===1280)await page.screenshot({path:'tests/screenshots/cours01-h630-desktop.png',fullPage:true});
   assert.deepEqual(errors,[],'Erreurs JavaScript');
   await ctx.close();
   console.log('OK : H630, ruban, matelassage, dico et sauvegarde, largeur '+width);
  }
 }finally{await browser.close()}
}
main().catch(e=>{console.error(e.stack||e);process.exitCode=1});