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
  if(old){if(!baseline.has(file))baseline.set(file,execFileSync('git',['show','4469fb1:'+file],{cwd:root,maxBuffer:20e6,stdio:['ignore','pipe','ignore']}));bytes=baseline.get(file)}else bytes=fs.readFileSync(target);
  res.writeHead(200,{'Content-Type':(mime[path.extname(file)]||'application/octet-stream')+'; charset=utf-8','Cache-Control':'no-store'});res.end(bytes);
 }catch{res.writeHead(404);res.end()}
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const url='http://127.0.0.1:'+server.address().port+'/';
 const browser=await chromium.launch({headless:true,channel:process.env.TEST_BROWSER_CHANNEL||undefined});
 try{
  for(const width of [1366,390,320]){
   const context=await browser.newContext({viewport:{width,height:844},isMobile:width<600,hasTouch:width<600});
   const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(url);await page.getByRole('button',{name:'Viera',exact:true}).click();
   const nav=width<600?'#bottomnav':'#nav';
   await page.locator(nav+' [data-page="world"]').click();
   for(const tab of ['world','history']){
    await page.locator('[data-culture-tab="'+tab+'"]').click();
    assert.equal(await page.locator('#travel-search').isVisible(),false);
    assert.equal(await page.locator('#culture-article-select').isVisible(),false);
    assert.equal(await page.locator('.culture-tabs button').count(),4);assert.ok(await page.locator('.culture-tabs button').evaluateAll(xs=>{const ys=xs.map(x=>x.getBoundingClientRect().top);return Math.max(...ys)-Math.min(...ys)<10}));
    await page.locator('[data-travel-panel="search"]').click();
    assert.equal(await page.locator('#travel-search').evaluate(el=>el===document.activeElement),true);
    await page.locator('#travel-search').fill(tab==='world'?'Japon':'aiguille');
    assert.ok(await page.locator('[data-travel-search-hit]').count()>0);
    await page.locator('[data-travel-search-hit]').first().click();
    await page.locator('[data-travel-panel="search"]').click();
    assert.equal(await page.locator('#travel-search').isVisible(),false);
    await page.locator('[data-travel-panel="choice"]').click();
    assert.equal(await page.locator('#culture-article-select').isVisible(),true);
    assert.equal(await page.locator('#travel-search').isVisible(),false);
    const options=await page.locator('#culture-article-select option').evaluateAll(xs=>xs.map(x=>x.value));
    for(const value of options){
     await page.locator('#culture-article-select').selectOption(value);
     assert.equal(await page.locator('article h2 [data-culture-favorite]').count(),1);
     assert.equal(await page.locator('.culture-reading-actions,.culture-status-hint,.culture-read-state').count(),0);
     const star=page.locator('[data-culture-favorite]');const before=await star.getAttribute('aria-pressed');
     await star.click();assert.notEqual(await star.getAttribute('aria-pressed'),before);
     await page.getByRole('checkbox',{name:'Article lu',exact:true}).check();
     assert.equal(await page.getByRole('checkbox',{name:'Article lu',exact:true}).isChecked(),true);
     assert.equal(await star.getAttribute('aria-pressed'),before==='true'?'false':'true');
    }
    await page.locator('[data-travel-panel="choice"]').click();
    assert.equal(await page.locator('#culture-article-select').isVisible(),false);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    if(tab==='world')await page.screenshot({path:'../voyage-'+width+'.png',fullPage:false});

   }
   for(const section of ['home','learn','quilt','embroidery','crochet','journal']){
    await page.locator(nav+' [data-page="'+section+'"]').click();
    assert.doesNotMatch(await page.locator('#app').innerText(),/valid[ée](?:e|s)?(?: à)?\s*100\s*%|Projet validé/i);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal overflow '+section+' '+width);
   }
   await page.locator(nav+' [data-page="learn"]').click();
   await page.locator('#week-select').selectOption('1');assert.equal(await page.locator('.editorial-writing').count(),0);
   await page.locator('#week-select').selectOption('5');assert.ok(await page.locator('.editorial-writing').count()>0);
   await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
   await page.reload();assert.equal(await page.locator('#pwa-changelog-overlay').count(),0);await page.locator(nav+' [data-page="world"]').click();assert.equal(await page.locator('#travel-search').isVisible(),false);assert.equal(await page.locator('#culture-article-select').isVisible(),false);assert.equal(await page.getByRole('checkbox',{name:'Article lu',exact:true}).isChecked(),true);
   assert.deepEqual(errors,[]);await context.close();console.log('OK navigation, tools, statuses, layout '+width+'px');
  }
  old=true;
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const page=await context.newPage();
  await page.goto(url);await page.getByRole('button',{name:'Viera',exact:true}).click();
  await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
  if(await page.locator('#pwa-changelog-overlay').count())await page.getByRole('button',{name:'Fermer',exact:true}).click();
  await page.locator('#bottomnav [data-page="journal"]').click();
  await page.locator('[data-note="1"]').fill('Note conservée après mise à jour');
  await page.evaluate(()=>window.beforeUpdate=true);
  old=false;await page.evaluate(async()=>{await (await navigator.serviceWorker.ready).update()});
  await page.getByRole('button',{name:'Installer la mise à jour',exact:true}).waitFor();
  assert.match(await page.locator('#pwa-changelog-overlay').innerText(),/1\.3\.57/);
  assert.match(await page.locator('#pwa-changelog-overlay').innerText(),/quatre icônes/);
  assert.equal(await page.evaluate(()=>window.beforeUpdate),true);
  await page.getByRole('button',{name:'Installer la mise à jour',exact:true}).click();
  await page.waitForFunction(()=>!window.beforeUpdate);
  await page.waitForFunction(()=>document.querySelector('#pwa-version')?.textContent.includes('1.3.57'));
  for(let i=0;i<2;i++){await page.reload();await page.waitForTimeout(1200);assert.equal(await page.locator('#pwa-changelog-overlay').count(),0);assert.equal(await page.locator('#pwa-notice').isVisible(),false)}
  await page.locator('#bottomnav [data-page="journal"]').click();assert.equal(await page.locator('[data-note="1"]').inputValue(),'Note conservée après mise à jour');
  await context.setOffline(true);await page.reload();await page.locator('#bottomnav [data-page="world"]').click();assert.ok(await page.locator('.culture-read-complete').isVisible());
  await context.close();console.log('OK update 1.3.56 → 1.3.57, consent, notes, no repeated notice, offline');
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);server.close();process.exitCode=1});
