'use strict';
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const fs=require('node:fs/promises');
const ROOT='http://127.0.0.1:8765/';
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  await fs.mkdir('tests/screenshots',{recursive:true});
  for(const width of [320,390,1280]){
   const ctx=await browser.newContext({viewport:{width,height:width>850?900:844}});
   const page=await ctx.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto(ROOT+'assets/cours-02-patron-arrondis.html',{waitUntil:'load'});
   const dimensions=await page.evaluate(()=>{
    const svg=document.querySelector('.sheet svg');
    function data(id){let el=document.getElementById(id),bb=el.getBBox();return {x:bb.x,y:bb.y,w:bb.width,h:bb.height,rx:+(el.getAttribute('rx')||0)};}
    return {view:svg.getAttribute('viewBox'),tissu:data('patron-tissu'),piqure:data('ligne-piqure'),h630:data('patron-h630'),temoin:data('carre-temoin'),page:getComputedStyle(document.querySelector('.sheet')).width};
   });
   assert.equal(dimensions.view,'0 0 210 297','A4 en millimètres');
   assert.deepEqual(dimensions.tissu,{x:77,y:49,w:120,h:120,rx:15},'Coupe : 12 × 12 cm avec rayon 1,5 cm');
   assert.deepEqual(dimensions.piqure,{x:87,y:59,w:100,h:100,rx:5},'Couture à 1 cm du bord');
   assert.deepEqual(dimensions.h630,{x:54,y:184,w:100,h:100,rx:5},'H630 facultatif 10 × 10 cm');
   assert.deepEqual(dimensions.temoin,{x:17,y:44,w:50,h:50,rx:0},'Carré témoin 5 cm');
   assert.equal(await page.locator('.sheet').count(),1,'Patron imprimable sur une feuille');
   assert.equal(await page.locator('svg path.stop').count(),1,'Deux repères de l’ouverture 4 cm');
   assert.deepEqual(errors,[]);
   if(width===390)await page.screenshot({path:'tests/screenshots/v119-patron-cours02-mobile.png',fullPage:false});
   await page.goto(ROOT,{waitUntil:'domcontentloaded'});
   await page.getByRole('button',{name:'Viera',exact:true}).click();
   const nav=width<=850?'#bottomnav':'#nav';
   await page.locator(nav+' [data-page="learn"]').click();
   await page.locator('#week-select').selectOption('2');
   assert.match(await page.locator('.editorial-head-status').innerText(),/En cours d’écriture/,'Pas de validation automatique du cours 2');
   await page.locator('.sewing-course-pattern a[href="./assets/cours-02-patron-arrondis.html"]').waitFor();
   await page.locator(nav+' [data-page="print"]').click();
   await page.locator('[data-pattern-kind="sewing"]').click();
   assert.equal(await page.locator('a[href="./assets/cours-02-patron-arrondis.html"]').count(),1,'Patron dans la bibliothèque');
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'Pas de débordement '+width);
   await page.waitForFunction(()=>!!navigator.serviceWorker.controller,{timeout:15000});
   await ctx.setOffline(true);
   await page.goto(ROOT+'assets/cours-02-patron-arrondis.html',{waitUntil:'load'});
   assert.equal(await page.locator('#patron-tissu').count(),1,'Patron disponible hors ligne');
   await ctx.setOffline(false);await ctx.close();
   console.log('OK v1.1.9 · Patron cours 2 A4 100 %, arrondis et couture, bibliothèque, offline : '+width+'px');
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1});
