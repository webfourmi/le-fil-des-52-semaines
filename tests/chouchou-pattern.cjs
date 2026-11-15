'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const http=require('node:http');
const path=require('node:path');
const server=http.createServer((req,res)=>{
  let file=path.join(process.cwd(),req.url.split('?')[0].replace('/le-fil-des-52-semaines',''));
  if(req.url==='/'||req.url==='/le-fil-des-52-semaines/')file=path.join(file,'index.html');
  fs.readFile(file,(err,data)=>{
    res.writeHead(err?404:200,{'Content-Type':file.endsWith('.js')?'application/javascript':file.endsWith('.html')?'text/html':file.endsWith('.json')?'application/json':file.endsWith('.css')?'text/css':file.endsWith('.pdf')?'application/pdf':'application/octet-stream'});
    res.end(err?'Not found':data);
  });
}).listen(8766,'127.0.0.1');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:process.env.TEST_BROWSER_CHANNEL||undefined,args:['--no-sandbox']});
 try{
  for(const width of [320,390,1280]){
   const ctx=await browser.newContext({viewport:{width,height:900}});
   const p=await ctx.newPage(),errors=[];
   p.on('pageerror',e=>errors.push(e.message));
   const base=process.env.LIVE_BASE||'http://127.0.0.1:8766/le-fil-des-52-semaines/';
   await p.goto(base,{waitUntil:'domcontentloaded'});
   await p.getByRole('button',{name:'Viera',exact:true}).click();
   await p.waitForFunction(()=>!!upcomingEditions[4]);
   const overlay=p.locator('#pwa-changelog-overlay');
   await overlay.waitFor({state:'visible',timeout:3000}).catch(()=>{});
   if(await overlay.isVisible())await overlay.getByRole('button',{name:'Fermer',exact:true}).click();
   const nav=width<850?'#bottomnav':'#nav';
   await p.locator(nav+' [data-page="learn"]').click();
   await p.locator('[data-sewing-panel="choice"]').click();
   await p.locator('#week-select').selectOption('4');
   assert.equal(await p.evaluate(()=>editorialIsApproved('sewing',4)),false);
   assert.match(await p.locator('.editorial-head-status').innerText(),/Projet en cours d’écriture/);
   assert.equal(await p.locator('.step').count(),7);
   const expected=JSON.parse(fs.readFileSync('data/editions.json','utf8')).issues['4'].steps;
   for(let i=0;i<7;i++){assert.equal(await p.locator('.step b').nth(i).textContent(),expected[i].title);assert.equal(await p.locator('.step p').nth(i).textContent(),expected[i].detail)}
   assert((await p.locator('#app').innerText()).includes('55 × 12 cm'),'Cours doit donner 55 x 12');
   const before=await p.evaluate(()=>JSON.stringify({steps:state.steps,blocks:state.blocks,projectsDone:state.projectsDone}));
   const gallery=p.locator('.sewing-photo-gallery');
   await gallery.evaluate(el=>{const fold=el.closest('details');if(fold)fold.open=true});
   assert.equal(await gallery.locator('img').count(),5);
   for(const img of await gallery.locator('img').all()){
    await img.evaluate(async el=>{el.loading='eager';await el.decode()});
    assert(await img.evaluate(el=>el.naturalWidth>0));
   }
   await gallery.locator('[data-lesson-photo]').first().click();
   await p.locator('.lesson-photo-dialog').waitFor({state:'visible'});
   await p.locator('[data-zoom-photo]').click();
   assert(await p.locator('.lesson-photo-dialog').evaluate(el=>el.classList.contains('photo-zoomed')));
   await p.locator('[data-close-photo]').click();
   await p.waitForFunction(()=>!!navigator.serviceWorker.controller);
   await ctx.setOffline(true);
   await p.reload({waitUntil:'domcontentloaded'});
   await p.locator(nav+' [data-page="learn"]').click();
   await p.locator('.sewing-photo-gallery img').first().waitFor({state:'attached'});
   assert.equal(await p.locator('.sewing-photo-gallery img').count(),5);
   for(const img of await p.locator('.sewing-photo-gallery img').all()){
    await img.evaluate(async el=>{el.loading='eager';await el.decode()});
   }
   await ctx.setOffline(false);
   await p.locator('.sewing-course-pattern [data-pattern-preview="scrunchie"]').click();
   assert.equal(await p.locator('#pattern-category-select').inputValue(),'sewing');
   const frame=p.frameLocator('#pattern-preview-frame');
   await frame.locator('svg.sheet').first().waitFor();
   assert.equal(await frame.locator('svg.sheet').count(),2);
   assert.equal(await frame.locator('svg.sheet').first().getAttribute('viewBox'),'0 0 210 297');
   assert.equal(await frame.locator('rect[width="50"][height="50"]').count(),1);
   assert((await frame.locator('body').innerText()).includes('55 × 12 cm'));
   const PDF=await p.request.get(base+'assets/cours-04-patron-chouchou.pdf');
   assert.equal(PDF.status(),200);
   const bytes=await PDF.body();
   assert.equal(bytes.toString('ascii',0,8),'%PDF-1.4');
   assert(bytes.length>4000);
   assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'Débordement horizontal');
   await p.locator('[data-pattern-preview-close]').click();
   const card=p.locator('.patterncard').filter({has:p.locator('[data-pattern-preview="scrunchie"]')});
   const cardText=await card.textContent();
   assert(cardText.includes('55 × 12 cm'),'Dimensions manquantes dans le HTML : '+cardText.slice(0,350));
   await card.locator('[data-week="4"]').click();
   assert.equal(await p.locator('#week-select').inputValue(),'4');
   assert.equal(await p.evaluate(()=>JSON.stringify({steps:state.steps,blocks:state.blocks,projectsDone:state.projectsDone})),before);
   assert.deepEqual(errors,[]);
   await ctx.close();
   console.log('OK : chouchou adulte, cours, patron 2 A4, PDF et navigation '+width+'px');
  }
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1;server.close()});
