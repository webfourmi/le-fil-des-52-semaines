const {chromium}=require('playwright');
const assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),baseline=new Map();let old=false;
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp'};
const server=http.createServer((req,res)=>{try{const file=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\//,'')||'index.html',target=path.resolve(root,file);if(!target.startsWith(root+path.sep))throw Error();let bytes;if(old){if(!baseline.has(file))baseline.set(file,execFileSync('git',['show','b9b24a5:'+file],{cwd:root,maxBuffer:20e6,stdio:['ignore','pipe','ignore']}));bytes=baseline.get(file)}else bytes=fs.readFileSync(target);res.writeHead(200,{'Content-Type':(mime[path.extname(file)]||'application/octet-stream')+'; charset=utf-8','Cache-Control':'no-store'});res.end(bytes)}catch{res.writeHead(404);res.end()}});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/';
 const browser=await chromium.launch({headless:true,channel:process.env.TEST_BROWSER_CHANNEL||undefined});
 try{
  for(const width of [320,390,393,1366]){
   const context=await browser.newContext({viewport:{width,height:844},isMobile:width<600,hasTouch:width<600}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(url);await page.getByRole('button',{name:'Viera',exact:true}).click();const nav=await page.locator('#nav [data-page="learn"]').isVisible()?'#nav':'#bottomnav';await page.locator(nav+' [data-page="learn"]').click();await page.locator('[data-sewing-panel="choice"]').click();
   for(const course of [1,2,3,4]){
    await page.locator('#week-select').selectOption(String(course));
    const row=page.locator('.course-title-row');assert.equal(await row.count(),1);assert.equal(await row.locator('.course-number').innerText(),'N° 0'+course);
    const positions=await row.locator(':scope > *').evaluateAll(xs=>xs.map(x=>{const r=x.getBoundingClientRect();return {x:r.x,right:r.right,center:r.y+r.height/2}}));assert.equal(positions.length,3);assert.ok(positions[0].right<=positions[1].x+1&&positions[1].right<=positions[2].x+1);assert.ok(Math.max(...positions.map(x=>x.center))-Math.min(...positions.map(x=>x.center))<3);
    const materials=page.locator('[data-course-fold="'+course+':materials"]'),settings=page.locator('[data-course-fold="'+course+':settings"]');
    for(const fold of [materials,settings]){assert.equal(await fold.getAttribute('open'),null);assert.equal(await fold.locator('.course-fold-body').isVisible(),false)}
    if(course===4){await row.scrollIntoViewIfNeeded();await page.screenshot({path:'../cours-titre-'+width+'.png',fullPage:false});if(width===320)assert.ok((await row.locator('h2').boundingBox()).height<25,'Chouchou title fits one line')}
    await materials.locator('summary').click();assert.equal(await materials.locator('.course-fold-body').isVisible(),true);await page.waitForFunction(key=>courseFoldsOpen.has(key),course+':materials');
    const checkbox=materials.locator('input[type=checkbox]').first();await checkbox.check();assert.equal(await checkbox.isChecked(),true);
    await row.locator('[data-sewing-favorite]').click();assert.equal(await row.locator('[data-sewing-favorite]').getAttribute('aria-pressed'),'true');assert.equal(await materials.locator('.course-fold-body').isVisible(),true);assert.equal(await checkbox.isChecked(),true);
    await settings.locator('summary').click();assert.equal(await settings.locator('.course-fold-body').isVisible(),true);await settings.locator('summary').click();assert.equal(await settings.locator('.course-fold-body').isVisible(),false);
    await materials.locator('summary').click();assert.equal(await materials.locator('.course-fold-body').isVisible(),false);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   }
   await page.waitForFunction(()=>!!navigator.serviceWorker.controller);await context.setOffline(true);await page.reload();await page.locator(nav+' [data-page="learn"]').click();await page.locator('[data-sewing-panel="choice"]').click();await page.locator('#week-select').selectOption('4');const materials=page.locator('[data-course-fold="4:materials"]');assert.equal(await materials.getAttribute('open'),null);await materials.locator('summary').click();assert.equal(await materials.locator('input[type=checkbox]').first().isChecked(),true);assert.deepEqual(errors,[]);await context.close();console.log('OK course 1–4 header, folds, checks, favorites, offline '+width+'px');
  }
  old=true;const context=await browser.newContext({viewport:{width:390,height:844}}),page=await context.newPage();await page.goto(url);await page.getByRole('button',{name:'Viera',exact:true}).click();await page.waitForFunction(()=>!!navigator.serviceWorker.controller);await page.evaluate(()=>window.beforeUpdate=true);
  old=false;await page.evaluate(async()=>{await (await navigator.serviceWorker.ready).update()});await page.getByRole('button',{name:'Installer la mise à jour',exact:true}).waitFor();assert.match(await page.locator('#pwa-changelog-overlay').innerText(),/1\.3\.65/);assert.match(await page.locator('#pwa-changelog-overlay').innerText(),/repliées/);assert.equal(await page.evaluate(()=>window.beforeUpdate),true);
  await page.getByRole('button',{name:'Installer la mise à jour',exact:true}).click();await page.waitForFunction(()=>!window.beforeUpdate);await page.waitForFunction(()=>document.querySelector('#pwa-version')?.textContent.includes('1.3.65'));
  for(let i=0;i<2;i++){await page.reload();await page.waitForTimeout(1000);assert.equal(await page.locator('#pwa-changelog-overlay').count(),0);assert.equal(await page.locator('#pwa-notice').isVisible(),false)}await context.close();console.log('OK PWA update 1.3.64 → 1.3.65, consent, no repeated notice');
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);server.close();process.exitCode=1});
