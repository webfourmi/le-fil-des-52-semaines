'use strict';
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  for(const width of [320,390,1280]){
   const context=await browser.newContext({viewport:{width,height:width<900?830:900}});
   const page=await context.newPage();const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded'});
   const initial=page.locator('#first-profile-name');
   if(await initial.isVisible()){
    await initial.fill('Lecteur');
    await page.locator('[data-identity="m"]').click();
   }
   const note=page.locator('#pwa-changelog-overlay');
   await note.waitFor({state:'visible',timeout:3000}).catch(()=>{});
   if(await note.isVisible())await note.getByRole('button',{name:'Fermer',exact:true}).click();
   await page.locator((width<850?'#bottomnav':'#nav')+' [data-page="world"]').click();
   await page.locator('[data-culture-tab="history"]').click();
   const choice=page.locator('[data-travel-panel="choice"]');
   await choice.click();
   const selector=page.locator('#culture-article-select');
   const options=await selector.locator('option').evaluateAll(ns=>ns.map(n=>n.value));
   for(const id of ['history:needle-01','history:antiquity-02','history:medieval-03','history:houses-04','history:patents-05']){
     assert(options.includes(id),'Article absent : '+id);
   }
   await selector.selectOption('history:patents-05');
   const article=page.locator('article.patents-article');
   await article.locator('#patents-title').waitFor();
   assert.equal(await page.evaluate(()=>editorialIsApproved('history','patents-05')),true);
   assert.equal(await page.locator('.editorial-writing').count(),0,'Ne pas afficher en cours d’écriture sur un article validé');
   assert.equal(await article.locator('.patents-chapter').count(),9);
   assert.equal(await article.locator('.patents-figure').count(),5);
   assert.equal(await article.locator('.patents-figure img').count(),5);
   const images=await article.locator('.patents-figure').evaluateAll(ns=>ns.map(fig=>({
     img:fig.querySelector('img')?.getAttribute('src'),
     alt:fig.querySelector('img')?.getAttribute('alt'),
     credits:fig.querySelector('figcaption')?.textContent,
     source:fig.querySelector('figcaption a')?.getAttribute('href')
   })));
   assert(images.every(i=>i.img?.startsWith('https://') && i.alt?.length>20 && i.credits?.length>50 && i.source?.includes('commons.wikimedia.org')),'Photo ou légende incorrecte');
   const text=(await article.innerText()).toLowerCase();
   for(const term of ['thomas saint','barthélemy thimonnier','elias howe','isaac singer','walter hunt','greenough','1856','point de chaînette','point noué','200 points','pédale']){
     assert(text.includes(term.toLowerCase()),'Paragraphe historique manquant : '+term);
   }
   assert((await article.locator('.patents-sources li').count())>=9);
   assert.equal(await article.locator('.patents-workshop').count(),1);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+2),'Débordement horizontal à '+width+'px');
   assert.deepEqual(errors,[]);
   await context.close();
   console.log('OK histoire n° 05, images, crédits, statut et navigation '+width+'px');
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1});
