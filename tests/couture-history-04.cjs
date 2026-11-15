'use strict';
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  for(const width of [320,390,1280]){
   const ctx=await browser.newContext({viewport:{width,height:width<850?850:900}});
   const page=await ctx.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded'});
   await page.getByRole('button',{name:'Viera',exact:true}).click();
   const notes=page.locator('#pwa-changelog-overlay');
   await notes.waitFor({state:'visible',timeout:4000}).catch(()=>{});
   if(await notes.isVisible())await notes.getByRole('button',{name:'Fermer',exact:true}).click();
   await page.locator((width<=850?'#bottomnav':'#nav')+' [data-page="world"]').click();
   await page.locator('[data-culture-tab="history"]').click();
   const selector=page.locator('#culture-article-select');
   const opts=await selector.locator('option').evaluateAll(ns=>ns.map(n=>n.value));
   for(const id of ['history:needle-01','history:antiquity-02','history:medieval-03','history:houses-04'])assert(opts.includes(id),'Article manquant '+id);
   await selector.selectOption('history:houses-04');
   const article=page.locator('article.couture-houses-article');
   await article.getByRole('heading',{name:"L'évolution des maisons de couture"}).waitFor();
   assert((await page.locator('.editorial-head-status').innerText()).includes('Validé à 100 %'));
   assert.equal(await article.locator('.couture-houses-chapter').count(),10);
   assert.equal(await article.locator('.couture-houses-figure img').count(),5);
   assert.equal(await article.locator('.couture-houses-exercises>div').count(),3);
   const text=await article.innerText();
   for(const v of ['Rose Bertin','Worth','Jeanne Paquin','Jeanne Lanvin','Poiret','Vionnet','Chanel','Schiaparelli','Dior','Balenciaga','Saint Laurent','atelier flou','tailleur','1945'])assert(text.toLowerCase().includes(v.toLowerCase()),'Manque '+v);
   const links=await article.locator('a[target="_blank"]').evaluateAll(ns=>ns.map(n=>({target:n.target,rel:n.rel,href:n.href})));
   assert(links.length>12);
   assert(links.every(x=>x.rel.includes('noopener')));
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'débordement horizontal '+width);
   assert.deepEqual(errors,[]);
   await ctx.close();console.log('OK article 04, images, sélection, statut validé à '+width+'px');
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1});