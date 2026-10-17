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
   await page.locator(nav+' [data-page="world"]').click();
   await page.locator('[data-culture-tab="history"]').click();
   const article=page.locator('article.culture-history');
   await article.getByRole('heading',{name:"Bien avant nos machines : l'aiguille à chas"}).waitFor();
   assert.equal(await article.locator('.history-section').count(),6);
   assert.equal(await article.locator('.history-timeline>div').count(),3);
   assert.equal(await article.locator('.history-steps>li').count(),4);
   const text=await article.innerText();
   for(const phrase of ['Paléolithique','poinçon','40 000 ans','Gourdan-Polignan','59 mm','MHNT.PRE.2009.0.246.1','Janome Cherry 21','À essayer en 5 minutes','Sources et prolongements']){
    assert.ok(text.includes(phrase),'Passage manquant : '+phrase);
   }
   assert.ok(text.length>4500,'Article trop court');
   const links=await article.locator('.history-sources a').evaluateAll(links=>links.map(a=>({href:a.href,rel:a.rel,target:a.target})));
   assert.equal(links.length,3);
   assert.ok(links.some(x=>x.href.includes('museum.toulouse-metropole.fr')));
   assert.ok(links.some(x=>x.href.includes('doi.org/10.1126/sciadv.adp2887')));
   assert.ok(links.some(x=>x.href.includes('commons.wikimedia.org')));
   assert.ok(links.every(x=>x.target==='_blank'&&x.rel.includes('noopener')));
   assert.equal(await article.locator('figure.history-object-photo img').count(),1);
   assert.equal(await page.locator('.culture-tab').count(),2);
   assert.equal(await page.locator('[data-culture-tab="history"]').getAttribute('aria-pressed'),'true');
   const dateColumns=await page.locator('.history-timeline').evaluate(n=>getComputedStyle(n).gridTemplateColumns.split(' ').length);
   assert.equal(dateColumns,width>700?3:1,'Grille des dates responsive');
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'Débordement horizontal : '+width);
   if(width===390)await page.screenshot({path:'tests/screenshots/histoire-couture-01-mobile.png',fullPage:true});
   if(width===1280)await page.screenshot({path:'tests/screenshots/histoire-couture-01-desktop.png',fullPage:true});
   await page.locator('[data-culture-tab="world"]').click();
   await page.locator('.travel-chapter').first().waitFor();
   await page.locator('[data-culture-tab="history"]').click();
   await article.getByRole('heading',{name:/L'objet à observer/}).waitFor();
   await page.waitForFunction(()=>!!navigator.serviceWorker.controller,{timeout:15000});
   await ctx.setOffline(true);
   await page.reload({waitUntil:'domcontentloaded'});
   await page.locator(nav+' [data-page="world"]').click();
   await page.locator('[data-culture-tab="history"]').click();
   await page.locator('article.culture-history .history-sources').waitFor();
   assert.ok((await article.innerText()).includes('59 mm'),'Texte disponible hors connexion');
   await ctx.setOffline(false);
   assert.deepEqual(errors,[]);
   await ctx.close();
   console.log('OK : article documenté, accessible, offline, 6 parties à '+width+'px');
  }
 }finally{await browser.close()}
}
main().catch(e=>{console.error('Histoire de la couture 01 :',e.stack||e);process.exitCode=1});
