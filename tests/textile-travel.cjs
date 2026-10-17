'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
async function main(){
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  const context=await browser.newContext({viewport:{width:390,height:844}});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  // Ne pas dépendre du réseau Wikimedia dans le test de mise en page.
  await page.route('https://commons.wikimedia.org/wiki/Special:FilePath/**',route=>route.fulfill({
   status:200,contentType:'image/svg+xml',
   body:'<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><rect width="160" height="160" fill="#dadfd3"/></svg>'
  }));
  await page.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded'});
  await page.getByRole('button',{name:'Viera',exact:true}).click();
  await page.locator('#bottomnav [data-page="world"]').click();
  await page.getByRole('heading',{name:'Histoires à coudre'}).waitFor();
  assert.equal(await page.locator('.travel-article').count(),3);
  assert.equal(await page.locator('.travel-photo img').count(),7);
  assert.equal(await page.locator('.travel-videos a').count(),2);
  assert.equal(await page.locator('.travel-content iframe').count(),0);
  for(const link of await page.locator('.travel-videos a').all()){
   assert.match(await link.getAttribute('href'),/^https:\/\//);
   assert.equal(await link.getAttribute('target'),'_blank');
   assert.match(await link.getAttribute('rel'),/noopener/);
  }
  const countries=['japon','bengale','coree'];
  for(const country of countries){
   const item=page.locator('.travel-article[data-travel="'+country+'"]');
   if(!(await item.evaluate(e=>e.open)))await item.locator('summary').click();
   assert.ok(await item.locator('.travel-chapter').count()>=6);
   assert.ok(await item.locator('.travel-vocabulary dt').count()>=3);
   assert.ok(await item.locator('.travel-workshop li').count()>=3);
   assert.ok(await item.locator('.travel-photo img').count()>=2);
   const photoData=await item.locator('.travel-photo').evaluateAll(elements=>elements.map(e=>({
     src:e.querySelector('img')?.getAttribute('src')||'',
     alt:e.querySelector('img')?.getAttribute('alt')||'',
     license:e.querySelector('figcaption')?.innerText||'',
     source:e.querySelector('a')?.href||''
   })));
   for(const p of photoData){
     assert.ok(p.src.includes('/wiki/Special:FilePath/'),p.src);
     assert.ok(p.alt.length>15,'Légende accessible trop courte');
     assert.ok(/CC|Domaine public/.test(p.license),'Licence manquante');
     assert.ok(p.source.includes('commons.wikimedia.org/wiki/File:'),'Source photo manquante');
   }
  }
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'Débordement mobile');
  assert.deepEqual(errors,[]);
  console.log('OK : trois articles détaillés, sept photos sourcées, lexiques et ateliers, sans débordement mobile.');
  await context.close();
 }finally{await browser.close()}
}
main().catch(error=>{console.error('Échec test Voyage textile :',error.stack||error);process.exitCode=1});
