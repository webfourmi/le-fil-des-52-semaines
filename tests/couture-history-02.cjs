'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  for(const width of [320,390,1280]){
   const context=await browser.newContext({viewport:{width,height:width<500?844:900}});
   const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded'});
   await page.getByRole('button',{name:'Viera',exact:true}).click();
   const nav=width<=850?'#bottomnav':'#nav';
   await page.locator(nav+' [data-page="world"]').click();
   await page.locator('[data-culture-tab="history"]').click();
   await page.locator('#culture-article-select').selectOption('history:antiquity-02');
   const article=page.locator('article.antiquity-article');
   await article.getByRole('heading',{name:'La couture dans l’Antiquité'}).waitFor();
   assert.equal(await page.locator('.editorial-head-status').innerText(),'✓ Validé à 100 %');
   assert.equal(await article.locator('.antiquity-chapter').count(),7);
   assert.equal(await article.locator('.antiquity-pattern-card').count(),2);
   assert.equal(await article.locator('.antiquity-pattern-card img').count(),2);
   const text=await article.innerText();
   for(const part of ['Mésopotamie','Égypte','Grèce','Rome','tunique','toge','5,50','32 cm','20 cm','Sources et prolongements'])assert(text.includes(part),'Manquant : '+part);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'Horizontal overflow '+width);
   for(const p of ['assets/patrons-romains.html','assets/patron-toge-romaine.svg','assets/patron-tunique-romaine.svg']){const response=await page.request.get('http://127.0.0.1:8765/'+p);assert.equal(response.status(),200,p)}
   assert.deepEqual(errors,[]);
   await context.close();console.log('OK Antiquité '+width+' px');
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1});