'use strict';
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  for(const width of [320,390,1280]){
   const context=await browser.newContext({viewport:{width,height:850},acceptDownloads:true});
   const page=await context.newPage(),errors=[];
   page.on('pageerror',error=>errors.push(error.message));
   await page.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded'});
   await page.getByRole('button',{name:'Viera',exact:true}).click();
   const nav=width<=850?'#bottomnav':'#nav';
   await page.locator(nav+' [data-page="learn"]').click();
   assert.equal(await page.locator('.bonus-shortcut').count(),0,'Pas de raccourci Bonus en doublon');
   assert.equal(await page.locator('.sewing-section-tabs [data-page="bonus"]').count(),1,'Bonus présent dans la barre des rubriques');
   await page.locator('.sewing-section-tabs [data-page="bonus"]').click();
   assert.match(await page.locator('h1').first().innerText(),/Projets bonus/,'Rubrique bonus autonome');
   // Le bouton Retour Android/du navigateur doit retrouver la vraie page précédente.
   await page.goBack();
   await page.locator('#week-select').waitFor();
   assert.equal(await page.evaluate(()=>state.page),'learn','Retour Bonus → Mes cours');
   await page.locator('.sewing-section-tabs [data-page="bonus"]').click();
   await page.locator('button[data-page="dog"]').click();
   assert.equal(await page.evaluate(()=>state.page),'dog','Ouverture du projet depuis Bonus');
   await page.goBack();
   await page.locator('#bonus-select').waitFor();
   assert.equal(await page.evaluate(()=>state.page),'bonus','Retour Chien → Bonus');

   assert.equal(await page.locator('button[data-page="dog"]').count(),1,'Projet chien dans Bonus');
   assert.equal(await page.locator('#bonus-select option').count(),2,'Menu déroulant de projets bonus');
   await page.locator('#bonus-search').fill('teckel');
   assert.equal(await page.locator('[data-bonus-project="dog"]:visible').count(),1,'Recherche bonus par mot clé');
   await page.locator('#bonus-search').fill('projet introuvable');
   assert.equal(await page.locator('[data-bonus-project="dog"]:visible').count(),0,'Recherche masque une non correspondance');
   assert.equal(await page.locator('#bonus-empty:visible').count(),1,'Message de recherche vide');
   await page.locator('#bonus-select').selectOption('dog');
   assert.equal(await page.locator('#bonus-search').inputValue(),'','Choisir un projet réinitialise la recherche');
   assert.equal(await page.locator('[data-bonus-project="dog"]:visible').count(),1,'Menu choisit le chien');
   await page.locator('#bonus-select').selectOption('');
   assert.equal(await page.locator('[data-bonus-project="dog"]:visible').count(),1,'Option tous les projets');
   assert.match(await page.locator('.bonus-project-entry').innerText(),/en cours d’écriture/i,'Statut éditorial conservé');
   await page.locator('[data-sewing-section="courses"]').click();
   await page.locator('#sewing-course-search').fill('teckel');
   assert.equal(await page.locator('[data-course-match="sewing"][data-course-index="dog"]').count(),1,'Projet indexé par mot-clé');
   await page.locator('[data-course-match="sewing"][data-course-index="dog"]').click();
   assert.equal(await page.locator('h1').first().innerText(),'Cale-porte en forme de chien','Tutoriel à part des 52 cours');
   assert.equal(await page.locator('.dog-steps>li').count(),8,'Huit étapes détaillées');
   assert.match(await page.locator('.dog-course').innerText(),/500 à 700 g/,'Lest prévu');
   assert.match(await page.locator('.dog-course').innerText(),/porte coupe-feu/i,'Précaution sécurité');
   assert.ok(await page.locator(nav+' [data-page="learn"]').isVisible(),'Navigation couture visible');
   assert.equal(await page.locator(nav+' [data-page="learn"]').getAttribute('aria-current'),'page','Surlignage dans Couture');
   await page.locator('[data-dog-add-personal]').click();
   const recorded=await page.evaluate(()=>({
    m:state.personalProjects.m.filter(x=>x.title==='Cale-porte en forme de chien').length,
    f:state.personalProjects.f.filter(x=>x.title==='Cale-porte en forme de chien').length,
    page:state.page,
    kind:journalKind
   }));
   assert.deepEqual(recorded,{m:1,f:0,page:'journal',kind:'personal'},'Un projet perso pour Viera, pas Mathilde');
   await page.locator(nav+' [data-page="learn"]').click();
   await page.locator('.sewing-section-tabs [data-page="bonus"]').click();
   await page.locator('button[data-page="dog"]').click();
   await page.locator('[data-dog-add-personal]').click();
   assert.equal(await page.evaluate(()=>state.personalProjects.m.filter(x=>x.title==='Cale-porte en forme de chien').length),1,'Pas de doublon');
   await page.locator(nav+' [data-page="learn"]').click();
   await page.locator('.sewing-course-tools [data-page="print"]').click();
   await page.locator('[data-bonus-pattern="dog"]').waitFor();
   await page.locator('[data-bonus-pattern="dog"] [data-pattern-preview="dog"]').click();
   const frame=page.frameLocator('#pattern-preview-frame');
   assert.equal(await frame.locator('.sheet').count(),3,'Trois pages A4 du chien');
   const dims=await frame.locator('svg').first().evaluate(svg=>{
    const c=svg.querySelector('#temoin-cinq-cm').getBBox(),d=svg.querySelector('#chien-corps').getBBox();
    return {view:svg.getAttribute('viewBox'),test:[c.width,c.height],dog:[d.x,d.y,d.width,d.height],cut:svg.getAttribute('width')};
   });
   assert.deepEqual(dims.test,[50,50],'Carré test 5 cm à l’impression 100 %');
   assert.equal(dims.view,'0 0 210 297','Dimensions A4 réelles');
   assert.equal(dims.cut,'210mm','SVG exprimé en mm');
   assert.ok(dims.dog[0]>0&&dims.dog[0]+dims.dog[2]<210,'Silhouette complète dans la feuille');
   const pouch=await frame.locator('#poche-lest-coupe').evaluate(x=>{const b=x.getBBox();return[b.width,b.height]});
   assert.deepEqual(pouch,[120,120],'Poche 12 × 12 cm marges incluses');
   assert.equal(await frame.locator('#chien-dessous-triangle').count(),1,'Dessous stabilisateur triangulaire séparé');
   assert.equal(await frame.locator('path.bar[d="M52 209 V217 M163 209 V217"]').count(),1,'Repères A et B des deux côtés');
   assert.ok(await page.locator(nav+' [data-page="learn"]').isVisible(),'Barre visible pendant consultation du patron');
   await page.locator('[data-pattern-preview-close]').click();
   assert.equal(await page.locator('#pattern-preview-frame').count(),0);
   await page.locator(nav+' [data-page="learn"]').click();
   assert.equal(await page.locator('#week-select option').count(),52,'Aucun cours renuméroté');
   assert.equal(await page.evaluate(()=>state.projectsDone.m.length),0,'Aucune coche de cours modifiée');
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'Pas de débordement horizontal '+width);
   assert.deepEqual(errors,[],'Aucune erreur JS');
   await context.close();
   console.log('OK Projet chien teckel : tutoriel, recherche, sauvegarde perso et trois planches A4 '+width+'px');
  }
 }finally{await browser.close()}
})().catch(error=>{console.error(error.stack||error);process.exitCode=1});
