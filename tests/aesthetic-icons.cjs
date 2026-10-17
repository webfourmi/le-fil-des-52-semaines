'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  const ctx=await browser.newContext({viewport:{width:360,height:780}}),page=await ctx.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded'});
  await page.getByRole('button',{name:'Viera',exact:true}).click();
  const pwa=page.locator('details.pwa-panel');
  assert.equal(await pwa.count(),1);
  assert.equal(await pwa.evaluate(e=>e.open),false,'PWA replié par défaut');
  assert.equal(await page.getByText('Un rendez-vous créatif à deux',{exact:false}).count(),0);
  await pwa.locator('summary').click();
  assert.equal(await pwa.evaluate(e=>e.open),true);
  await pwa.getByRole('button',{name:'Sauvegarder mon carnet'}).waitFor();
  await pwa.locator('summary').click();
  assert.equal(await pwa.evaluate(e=>e.open),false);
  for(const asset of ['app','couture','patchwork']){
    const response=await page.request.get('http://127.0.0.1:8765/assets/icon-'+asset+'.svg');
    assert.equal(response.status(),200,asset+' absent');
    const svg=await response.text();
    assert.match(svg,/data:image\/webp;base64,UklGR/,'Image attendue intégrée : '+asset);
    assert.ok(svg.length>5000);
  }
  const manifest=await (await page.request.get('http://127.0.0.1:8765/manifest.webmanifest')).json();
  for(const n of [192,512]){
    const path=manifest.icons.find(i=>i.sizes===n+'x'+n&&i.type==='image/png')?.src;
    assert.ok(path);
    const blob=await (await page.request.get(new URL(path,'http://127.0.0.1:8765/').href)).body();
    assert.equal(blob.readUInt32BE(16),n);
  }
  assert.equal(await page.locator('.feature-sew .brand-feature-icon img').count(),1);
  assert.equal(await page.locator('.feature-patch .brand-feature-icon img').count(),1);
  assert.equal(await page.locator('.brandmark img').count(),1);
  for(const element of await page.locator('.brand-feature-icon img,.brandmark img').all()){
   assert.ok(await element.evaluate(i=>i.complete&&i.naturalWidth>0),'Icône visible');
  }
  await page.locator('#bottomnav [data-page="learn"]').click();
  assert.equal(await page.getByText('Chaque cours est adapté à deux adultes',{exact:false}).count(),0);
  await page.locator('#bottomnav [data-page="world"]').click();
  assert.equal(await page.getByText('Des photographies de vrais objets',{exact:false}).count(),0);
  const tabs=page.locator('.culture-tab');
  assert.equal(await tabs.count(),2);
  assert.equal(await tabs.first().getAttribute('aria-label'),'Coutures du monde');
  assert.equal(await tabs.nth(1).getAttribute('aria-label'),'Histoire de la couture');
  assert.equal(await tabs.first().getAttribute('aria-pressed'),'true');
  assert.ok(await page.locator('.travel-article').count()>=3);
  await tabs.nth(1).click();
  assert.equal(await page.locator('.travel-article').count(),0);
  await page.getByRole('heading',{name:"Bien avant nos machines : l'aiguille à chas"}).waitFor();
  assert.equal(await page.locator('.culture-tab').nth(1).getAttribute('aria-pressed'),'true');
  assert.equal(await page.locator('.culture-tab').evaluateAll(a=>a.map(e=>e.textContent.trim()).join('')),'','Icônes sans texte visible');
  await page.locator('.culture-tab').first().click();
  await page.locator('.travel-article').first().waitFor();
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'Pas de débordement mobile');
  await ctx.close();
  assert.deepEqual(errors,[]);
  console.log('OK : trois icônes, PWA replié, textes supprimés, deux onglets Voyage textile, mobile accessible');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
