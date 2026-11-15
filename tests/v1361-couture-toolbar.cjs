const {chromium}=require('playwright');
const assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),baseline=new Map();let old=false;
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp'};
const server=http.createServer((req,res)=>{try{const file=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\//,'')||'index.html',target=path.resolve(root,file);if(!target.startsWith(root+path.sep))throw Error();let bytes;if(old){if(!baseline.has(file))baseline.set(file,execFileSync('git',['show','682e44d:'+file],{cwd:root,maxBuffer:20e6,stdio:['ignore','pipe','ignore']}));bytes=baseline.get(file)}else bytes=fs.readFileSync(target);res.writeHead(200,{'Content-Type':(mime[path.extname(file)]||'application/octet-stream')+'; charset=utf-8','Cache-Control':'no-store'});res.end(bytes)}catch{res.writeHead(404);res.end()}});
async function toolbar(page){
 assert.equal(await page.locator('.sewing-section-tabs button').count(),7);
 assert.equal(await page.locator('.sewing-course-tools,.machine-intro-entry').count(),0);
 assert.equal(await page.locator('.sewing-section-tabs [data-page="machine"]').count(),0);
 assert.ok(await page.locator('.sewing-section-tabs').evaluate(x=>x.getBoundingClientRect().height<200));
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.locator('.sewing-section-tabs [data-dico-toggle]').click();await page.locator('#dico-search').fill('droit-fil');assert.ok(await page.locator('.sewing-term:visible').count()>0);await page.locator('#dico-search').fill('');await page.locator('.sewing-section-tabs [data-dico-toggle]').click();assert.equal(await page.locator('#dico-couture').count(),0);
 await page.locator('[data-sewing-patterns]').click();assert.equal(await page.locator('#pattern-category-select').inputValue(),'sewing');await page.goBack();await page.locator('.sewing-section-tabs').waitFor();
}
async function hidden(page){assert.equal(await page.locator('#sewing-search-panel').isVisible(),false);assert.equal(await page.locator('#sewing-choice-panel').isVisible(),false)}
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/';
 const browser=await chromium.launch({headless:true,channel:process.env.TEST_BROWSER_CHANNEL||undefined});
 try{
  for(const width of [1366,390,320]){
   const context=await browser.newContext({viewport:{width,height:844},isMobile:width<600,hasTouch:width<600}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(url);await page.getByRole('button',{name:'Viera',exact:true}).click();const nav=width<600?'#bottomnav':'#nav';await page.locator(nav+' [data-page="learn"]').click();
   await toolbar(page);await hidden(page);
   const progress=await page.evaluate(()=>JSON.stringify([state.steps,state.projectsDone,state.blocks]));
   await page.screenshot({path:'../couture-barre-'+width+'.png',fullPage:false});
   await page.locator('[data-sewing-panel="search"]').click();assert.equal(await page.locator('#sewing-course-search').evaluate(x=>x===document.activeElement),true);
   await page.locator('#sewing-course-search').fill('chouchou');await page.locator('[data-course-match="sewing"][data-course-index="4"]').click();
   const courseStar=page.locator('[data-sewing-favorite="course:4"]');await courseStar.click();assert.equal(await courseStar.getAttribute('aria-pressed'),'true');
   await page.locator('[data-sewing-panel="choice"]').click();assert.equal(await page.locator('#sewing-search-panel').isVisible(),false);assert.equal(await page.locator('#week-select option').first().getAttribute('value'),'4');assert.match(await page.locator('#week-select option').first().innerText(),/^★/);
   await page.locator('#week-select').selectOption('0');assert.equal(await page.evaluate(()=>state.page),'machine');await page.goBack();await page.locator('#week-select').selectOption('1');assert.equal(await page.locator('.lessonhead h2 [data-sewing-favorite="course:1"]').count(),1);
   await page.locator('[data-sewing-panel="choice"]').click();await hidden(page);
   await page.locator('[data-sewing-section="techniques"]').click();await toolbar(page);await hidden(page);
   await page.locator('[data-sewing-panel="search"]').click();await page.locator('#technique-search').fill('invisible');assert.equal(await page.locator('[data-technique-card]:visible').count(),1);
   const techniqueStar=page.locator('[data-sewing-favorite="technique:ourlet-invisible"]');await techniqueStar.click();assert.equal(await techniqueStar.getAttribute('aria-pressed'),'true');
   await page.locator('[data-sewing-panel="choice"]').click();assert.equal(await page.locator('#technique-select option').nth(1).getAttribute('value'),'ourlet-invisible');await page.locator('#technique-select').selectOption('ourlet-invisible');assert.equal(await page.locator('[data-technique-card]:visible').count(),1);
   await page.locator('[data-sewing-panel="choice"]').click();await hidden(page);
   await page.locator('[data-sewing-section="bonus"]').click();await toolbar(page);await hidden(page);
   await page.locator('[data-sewing-panel="search"]').click();await page.locator('#bonus-search').fill('teckel');assert.equal(await page.locator('[data-bonus-project]:visible').count(),1);
   await page.locator('[data-sewing-favorite="bonus:dog"]').click();
   await page.locator('[data-sewing-panel="choice"]').click();assert.equal(await page.locator('#bonus-select option').nth(1).getAttribute('value'),'dog');await page.locator('#bonus-select').selectOption('dog');
   await page.locator('[data-bonus-project="dog"] [data-page="dog"]').click();assert.equal(await page.locator('h1 [data-sewing-favorite="bonus:dog"]').getAttribute('aria-pressed'),'true');
   await page.locator('[data-sewing-favorite="bonus:dog"]').click();assert.equal(await page.locator('[data-sewing-favorite="bonus:dog"]').getAttribute('aria-pressed'),'false');await page.locator('[data-sewing-favorite="bonus:dog"]').click();
   await page.goBack();await page.locator('[data-sewing-section="bonus"]').waitFor();
   assert.equal(await page.evaluate(()=>JSON.stringify([state.steps,state.projectsDone,state.blocks])),progress);
   await page.evaluate(()=>{
    const file=Fil52Backup.exportData(state,'m'),parsed=Fil52Backup.parseBackup(JSON.stringify(file)),restored=Fil52Backup.applyBackup(state,parsed,'m');
    if(JSON.stringify(restored.sewingFavorites.m)!==JSON.stringify(state.sewingFavorites.m))throw Error('Favorites backup mismatch');
    delete file.data.sewingFavorites;const legacy=Fil52Backup.applyBackup(state,Fil52Backup.parseBackup(JSON.stringify(file)),'m');if(JSON.stringify(legacy.sewingFavorites.m)!==JSON.stringify(state.sewingFavorites.m))throw Error('Old backup erased favorites');
    if(state.sewingFavorites.f.length)throw Error('Profile isolation');
   });
   await page.waitForFunction(()=>!!navigator.serviceWorker.controller);await page.reload();await page.locator(nav+' [data-page="learn"]').click();await hidden(page);
   await page.locator('[data-sewing-panel="choice"]').click();assert.equal(await page.locator('#week-select option').first().getAttribute('value'),'4');
   await context.setOffline(true);await page.reload();await page.locator(nav+' [data-page="learn"]').click();await page.locator('[data-sewing-panel="choice"]').click();await page.locator('#week-select').selectOption('4');assert.equal(await page.locator('[data-sewing-favorite="course:4"]').getAttribute('aria-pressed'),'true');
   await page.locator('[data-sewing-favorite="course:4"]').click();assert.equal(await page.locator('[data-sewing-favorite="course:4"]').getAttribute('aria-pressed'),'false');
   assert.deepEqual(errors,[]);await context.close();console.log('OK unified toolbar, dictionary, patterns, course 0 list, favorites, navigation, offline '+width+'px');
  }
  old=true;const context=await browser.newContext({viewport:{width:390,height:844}}),page=await context.newPage();await page.goto(url);await page.getByRole('button',{name:'Viera',exact:true}).click();await page.waitForFunction(()=>!!navigator.serviceWorker.controller);await page.evaluate(()=>window.beforeUpdate=true);
  old=false;await page.evaluate(async()=>{await (await navigator.serviceWorker.ready).update()});await page.getByRole('button',{name:'Installer la mise à jour',exact:true}).waitFor();assert.match(await page.locator('#pwa-changelog-overlay').innerText(),/1\.3\.61/);assert.match(await page.locator('#pwa-changelog-overlay').innerText(),/Dictionnaire/);assert.equal(await page.evaluate(()=>window.beforeUpdate),true);
  await page.getByRole('button',{name:'Installer la mise à jour',exact:true}).click();await page.waitForFunction(()=>!window.beforeUpdate);await page.waitForFunction(()=>document.querySelector('#pwa-version')?.textContent.includes('1.3.61'));
  for(let i=0;i<2;i++){await page.reload();await page.waitForTimeout(1000);assert.equal(await page.locator('#pwa-changelog-overlay').count(),0);assert.equal(await page.locator('#pwa-notice').isVisible(),false)}await context.close();console.log('OK PWA update 1.3.60 → 1.3.61, consent, no repeated notice');
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);server.close();process.exitCode=1});
