'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  for(const width of [320,390,1280]){
   const ctx=await browser.newContext({viewport:{width,height:width>850?900:844}}),page=await ctx.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded'});
   await page.getByRole('button',{name:'Viera',exact:true}).click();
   const nav=width<=850?'#bottomnav':'#nav';
   await page.locator(nav+' [data-page="learn"]').click();
   await page.waitForFunction(()=>!!upcomingEditions[2]);
   const sew=page.locator('#sewing-course-search'),sewSelect=page.locator('#week-select');
   assert.ok(await sew.isVisible(),'Barre de recherche Couture');
   assert.ok((await sew.boundingBox()).y<(await sewSelect.boundingBox()).y,'Recherche au-dessus du menu Couture');
   await sew.fill('chouchou');
   assert.equal(await page.locator('[data-course-match="sewing"]').count(),1);
   await page.locator('[data-course-match="sewing"]').first().click();
   assert.equal(await sewSelect.inputValue(),'4','Résultat de la recherche Couture');
   await page.locator('#sewing-course-search').fill('reversiBle');
   assert.match(await page.locator('.course-search-count').innerText(),/résultat/i,'Recherche insensible à la casse');
   await page.locator(nav+' [data-page="quilt"]').click();
   const patch=page.locator('#patch-course-search'),patchSelect=page.locator('#patch-week-select');
   assert.ok(await patch.isVisible(),'Recherche Patchwork');
   assert.ok((await patch.boundingBox()).y<(await patchSelect.boundingBox()).y,'Recherche au-dessus du menu Patchwork');
   await patch.fill('etoile');
   assert.ok(await page.locator('[data-course-match="patchwork"]').count()>0,'Recherche sans accent');
   const chosen=await page.locator('[data-course-match="patchwork"]').first().getAttribute('data-course-index');
   await page.locator('[data-course-match="patchwork"]').first().click();
   assert.equal(await patchSelect.inputValue(),chosen,'Résultat de recherche Patchwork');
   await page.locator(nav+' [data-page="print"]').click();
   assert.equal(await page.locator('[data-pattern-preview="halloween"][data-pattern-section]').count(),3,'Trois modèles Halloween dans Patrons');
   await page.locator('[data-pattern-preview="halloween"][data-pattern-section="mini"]').click();
   assert.equal(await page.locator('#pattern-preview-frame').count(),1);
   assert.ok(await page.locator(nav+' [data-page="print"]').isVisible(),'Navigation reste visible pendant consultation');
   assert.match(await page.locator('#pattern-preview-frame').getAttribute('src'),/atelier=mini/);
   assert.equal(await page.frameLocator('#pattern-preview-frame').locator('.sheet').count(),1,'Une planche mini-quilt');
   assert.equal(await page.frameLocator('#pattern-preview-frame').locator('[data-applique="chat-assis-profil"]').count(),1,'Nouveau chat');
   await page.locator('[data-pattern-preview-close]').click();
   assert.equal(await page.locator('#pattern-preview-frame').count(),0);
   await page.locator('[data-pattern-preview="halloween"][data-pattern-section="guirlande"]').click();
   assert.equal(await page.frameLocator('#pattern-preview-frame').locator('.sheet').count(),2,'Deux planches guirlande');
   assert.equal(await page.frameLocator('#pattern-preview-frame').locator('[data-applique="fantome-bras-ouverts"]').count(),1,'Nouveau fantôme');
   assert.ok(await page.locator(nav+' [data-page="home"]').isVisible(),'Accueil accessible pendant lecture du patron');
   await page.locator(nav+' [data-page="world"]').click();
   await page.locator('#culture-article-select').selectOption('world:halloween');
   assert.match(await page.locator('.editorial-head-status').innerText(),/En cours d’écriture/,'Halloween reste brouillon');
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'Aucun débordement '+width);
   assert.deepEqual(errors,[],'Aucune erreur JavaScript');
   await ctx.close();
   console.log('OK V1.1.10 '+width+'px : recherche 52 cours/blocs, Halloween brouillon, chat/fantôme, aperçu avec navigation.');
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1});
