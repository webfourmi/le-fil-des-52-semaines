'use strict';
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const fs=require('node:fs/promises');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 await fs.mkdir('tests/screenshots',{recursive:true});
 try{
 for(const width of [320,390,1280]){
  const ctx=await browser.newContext({viewport:{width,height:width>850?900:844}}),page=await ctx.newPage(),errors=[];
  page.on('pageerror',err=>errors.push(err.message));
  await page.route('https://commons.wikimedia.org/**',route=>route.fulfill({status:200,contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"/>'}));
  await page.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded'});
  await page.getByRole('button',{name:'Viera',exact:true}).click();
  const nav=width<=850?'#bottomnav':'#nav';
  assert.equal(await page.locator('.cadence-panel').count(),0,'Ancien bloc tous les 15 jours');
  assert.doesNotMatch(await page.locator('#app').innerText(),/tous les 15 jours|chaque jeudi|quinzaine/i);
  const edition=await page.evaluate(()=>({approved:EDITORIAL_APPROVED,homeNextSew:homeNext('projectsDone'),homeNextPatch:homeNext('blocks')}));
  assert.deepEqual(edition.approved.sewing,[0,1]);
  assert.deepEqual(edition.approved.patchwork,[0]);
  assert.deepEqual(edition.approved.world,['japon','bengale','coree','halloween']);
  assert.deepEqual(edition.approved.history,['needle-01']);
  assert.equal(edition.homeNextSew,1);assert.equal(edition.homeNextPatch,null);
  await page.locator(nav+' [data-page="learn"]').click();
  assert.equal(await page.locator('.editorial-head-status').innerText(),'✓ Validé à 100 %');
  await page.locator('#week-select').selectOption('2');
  assert.match(await page.locator('.editorial-head-status').innerText(),/En cours d’écriture/);
  await page.locator('[data-page="machine"]').first().click();
  assert.match(await page.locator('.editorial-head-status').innerText(),/Validé à 100/);
  await page.locator(nav+' [data-page="quilt"]').click();
  assert.match(await page.locator('.editorial-head-status').innerText(),/En cours d’écriture/);
  await page.locator('[data-patch-zero]').click();
  assert.match(await page.locator('.editorial-head-status').innerText(),/Validé à 100/);
  await page.locator(nav+' [data-page="world"]').click();
  assert.equal(await page.locator('#culture-article-select option').count(),4);
  await page.locator('#culture-article-select').selectOption('world:halloween');
  assert.match(await page.locator('.editorial-head-status').innerText(),/Validé à 100/);
  assert.equal(await page.locator('.travel-article[data-travel="halloween"]').count(),1);
  assert.equal(await page.locator('.halloween-archive img').count(),4,'Quatre images historiques identifiées');
  assert.equal(await page.locator('.halloween-workshop').count(),3,'Trois ateliers');
  for(let i=1;i<=3;i++){
   const w=page.locator('.halloween-workshop[data-halloween-workshop="'+i+'"]');
   await w.locator('summary').click();
   assert.ok(await w.locator('ol li').count()>=7,'Tutoriel complet n° '+i);
   assert.ok(await w.locator('ul li').count()>=4);
   assert.ok(await w.getByText('un seul ouvrage',{exact:false}).count());
  }
  const photos=await page.locator('.halloween-archive').evaluateAll(items=>items.map(e=>({alt:e.querySelector('img').alt,src:e.querySelector('img').src,credit:e.querySelector('figcaption').textContent,source:e.querySelector('a').href})));
  assert.ok(photos.every(p=>p.alt.length>15&&p.src.includes('commons.wikimedia.org')&&p.credit&&p.source.includes('commons.wikimedia.org')));
  await page.locator('.halloween-print-link').first().waitFor();
  assert.equal(await page.locator('.halloween-print-link').first().getAttribute('href'),'./assets/halloween-patrons.html');
  assert.ok(await page.locator('#culture-complete').isChecked()===false,'Lecture personnelle non cochée par approbation éditoriale');
  await page.locator('[data-culture-tab="history"]').click();
  assert.match(await page.locator('.editorial-head-status').innerText(),/Validé à 100/);
  assert.equal(await page.locator('.culture-history').count(),1);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'Pas de débordement '+width);
  if(width===390)await page.screenshot({path:'tests/screenshots/v118-halloween-mobile.png',fullPage:false});
  await page.goto('http://127.0.0.1:8765/assets/halloween-patrons.html',{waitUntil:'load'});
  assert.equal(await page.locator('.sheet').count(),4);
  const dims=await page.evaluate(()=>{
    const pages=[...document.querySelectorAll('.sheet svg')];
    const witness=pages[0].querySelector('rect.cut').getBBox();
    const triangle=pages[2].querySelector('path.cut').getBBox();
    return {witness:[witness.width,witness.height],triangle:[triangle.width,triangle.height],views:pages.map(x=>x.getAttribute('viewBox'))};
  });
  assert.deepEqual(dims.witness,[50,50],'Carré de 5 cm');
  assert.deepEqual(dims.triangle,[160,190],'Fanion de 16 × 19 cm');
  assert.ok(dims.views.every(x=>x==='0 0 210 297'),'Format A4');
  if(width===390)await page.screenshot({path:'tests/screenshots/v118-patron-mobile.png',fullPage:false});
  await page.waitForFunction(()=>!!navigator.serviceWorker.controller,{timeout:15000});
  await ctx.setOffline(true);
  await page.reload({waitUntil:'load'});
  assert.equal(await page.locator('.sheet').count(),4,'Patrons disponibles sans connexion');
  assert.deepEqual(errors,[],'Pas de plantage JavaScript');
  await ctx.setOffline(false);await ctx.close();
  console.log('OK v1.1.8 : '+width+'px, validations, trois ateliers, photos sourcées, A4 offline');
 }
 }finally{await browser.close()}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1});
