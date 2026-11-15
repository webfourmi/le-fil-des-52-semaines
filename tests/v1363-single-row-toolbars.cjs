const {chromium}=require('playwright');
const assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),baseline=new Map();let old=false;
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp'};
const server=http.createServer((req,res)=>{try{const file=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\//,'')||'index.html',target=path.resolve(root,file);if(!target.startsWith(root+path.sep))throw Error();let bytes;if(old){if(!baseline.has(file))baseline.set(file,execFileSync('git',['show','ff462a2:'+file],{cwd:root,maxBuffer:20e6,stdio:['ignore','pipe','ignore']}));bytes=baseline.get(file)}else bytes=fs.readFileSync(target);res.writeHead(200,{'Content-Type':(mime[path.extname(file)]||'application/octet-stream')+'; charset=utf-8','Cache-Control':'no-store'});res.end(bytes)}catch{res.writeHead(404);res.end()}});
async function row(page,selector,count){
 const boxes=await page.locator(selector+' button').evaluateAll(xs=>xs.map(x=>{const r=x.getBoundingClientRect();return {x:r.x,right:r.right,y:r.y,width:r.width,height:r.height}}));
 assert.equal(boxes.length,count);assert.ok(Math.max(...boxes.map(x=>x.y))-Math.min(...boxes.map(x=>x.y))<5,'Single row '+selector);
 const screen=await page.evaluate(()=>innerWidth);assert.ok(boxes.every(x=>x.x>=0&&x.right<=screen+1&&x.height>=44),'Visible touch targets '+selector);
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No page overflow');
}
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/';
 const browser=await chromium.launch({headless:true,channel:process.env.TEST_BROWSER_CHANNEL||undefined});
 try{
  for(const width of [320,360,390,600,601,768,1366]){
   const context=await browser.newContext({viewport:{width,height:844},isMobile:width<600,hasTouch:width<600}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(url);await page.getByRole('button',{name:'Viera',exact:true}).click();const nav=await page.locator('#nav [data-page="learn"]').isVisible()?'#nav':'#bottomnav';await page.locator(nav+' [data-page="learn"]').click();
   for(const section of ['courses','techniques','bonus']){await page.locator('[data-sewing-section="'+section+'"]').click();await row(page,'.sewing-section-tabs',7);if(section==='courses')await page.screenshot({path:'../barre-couture-'+width+'.png',fullPage:false});await page.locator('[data-sewing-panel="search"]').click();assert.equal(await page.locator('#sewing-search-panel').isVisible(),true);await page.locator('[data-sewing-panel="choice"]').click();assert.equal(await page.locator('#sewing-choice-panel').isVisible(),true);await page.locator('[data-dico-toggle]').click();assert.equal(await page.locator('#dico-couture').isVisible(),true);await page.locator('[data-dico-toggle]').click();}
   await page.locator(nav+' [data-page="quilt"]').click();await row(page,'.patchwork-tools',6);await page.screenshot({path:'../barre-patchwork-'+width+'.png',fullPage:false});await page.locator('[data-patch-panel="search"]').click();assert.equal(await page.locator('#patch-course-search').isVisible(),true);await page.locator('[data-patch-panel="choice"]').click();await page.locator('#patch-week-select').selectOption('2');assert.equal(await page.evaluate(()=>state.patchWeek),2);
   await page.locator(nav+' [data-page="world"]').click();await row(page,'.culture-tabs',4);await page.locator('[data-travel-panel="search"]').click();assert.equal(await page.locator('#travel-search').isVisible(),true);
   await page.locator(nav+' [data-page="supply"]').click();await row(page,'.supply-tools',2);
   await page.waitForFunction(()=>!!navigator.serviceWorker.controller);await context.setOffline(true);await page.reload();await page.locator(nav+' [data-page="learn"]').click();await row(page,'.sewing-section-tabs',7);assert.deepEqual(errors,[]);await context.close();console.log('OK all toolbars one row, visible targets, menus and offline '+width+'px');
  }
  old=true;const context=await browser.newContext({viewport:{width:390,height:844}}),page=await context.newPage();await page.goto(url);await page.getByRole('button',{name:'Viera',exact:true}).click();await page.waitForFunction(()=>!!navigator.serviceWorker.controller);await page.evaluate(()=>window.beforeUpdate=true);
  old=false;await page.evaluate(async()=>{await (await navigator.serviceWorker.ready).update()});await page.getByRole('button',{name:'Installer la mise à jour',exact:true}).waitFor();assert.match(await page.locator('#pwa-changelog-overlay').innerText(),/1\.3\.63/);assert.match(await page.locator('#pwa-changelog-overlay').innerText(),/seule ligne/);assert.equal(await page.evaluate(()=>window.beforeUpdate),true);
  await page.getByRole('button',{name:'Installer la mise à jour',exact:true}).click();await page.waitForFunction(()=>!window.beforeUpdate);await page.waitForFunction(()=>document.querySelector('#pwa-version')?.textContent.includes('1.3.63'));
  for(let i=0;i<2;i++){await page.reload();await page.waitForTimeout(1000);assert.equal(await page.locator('#pwa-changelog-overlay').count(),0);assert.equal(await page.locator('#pwa-notice').isVisible(),false)}await context.close();console.log('OK PWA update 1.3.62 → 1.3.63, consent, no repeated notice');
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);server.close();process.exitCode=1});
