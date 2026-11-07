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
   // La nouvelle version présente aussi les changements automatiquement une seule fois.
   await page.locator('#pwa-changelog-overlay').waitFor();
   assert.match(await page.locator('.pwa-changelog-dialog').innerText(),/1.3.24/,'Présentation automatique de la version');
   await page.getByRole('button',{name:'Fermer',exact:true}).click();
   // Les nouveautés restent consultables et affichent un véritable historique.
   await page.locator('details.pwa-panel summary').click();
   await page.locator('#pwa-changelog-open').click();
   await page.locator('#pwa-changelog-overlay').waitFor();
   assert.match(await page.locator('#pwa-changelog-title').innerText(),/nouveautés/i,'Titre de la liste des changements');
   assert.ok(await page.locator('.pwa-changelog-list li').count()>=3,'Liste explicite des nouveautés');
   assert.equal(await page.locator('.pwa-changelog-dialog select option').count()>=3,true,'Anciennes versions disponibles');
   await page.locator('.pwa-changelog-dialog select').selectOption('1.3.14');
   await page.getByRole('heading',{name:/Navigation mobile/i}).waitFor();
   assert.match(await page.locator('.pwa-changelog-dialog h3').innerText(),/Navigation mobile/i,'Historique des anciennes versions');
   await page.getByRole('button',{name:'Fermer',exact:true}).click();
   assert.equal(await page.locator('#pwa-changelog-overlay').count(),0,'Panneau refermable');
   // Une version installée et consultée ne doit pas se réafficher.
   await page.reload({waitUntil:'domcontentloaded'});
   await page.locator('#app h1').first().waitFor();
   assert.equal(await page.locator('#pwa-changelog-overlay').count(),0,'La notification ne revient pas après recharge');
   assert.equal(await page.evaluate(()=>localStorage.getItem('fil52.changelog.seenVersion')),'1.3.23','Version consultée mémorisée');

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
   assert.equal(await page.locator('#bonus-select option').count(),3,'Menu déroulant incluant les deux projets bonus');
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
   assert.match(await page.locator('[data-bonus-project="dog"]').innerText(),/en cours d’écriture/i,'Statut éditorial conservé');
   await page.locator('#bonus-search').fill('courant air');
   assert.equal(await page.locator('[data-bonus-project="draftstopper"]:visible').count(),1,'Boudin retrouvé par deux mots-clés');
   assert.equal(await page.locator('[data-bonus-project="dog"]:visible').count(),0,'Recherche discrimine les projets');
   await page.locator('#bonus-select').selectOption('draftstopper');
   assert.equal(await page.locator('[data-bonus-project="draftstopper"]:visible').count(),1,'Sélection du boudin dans le menu déroulant');
   await page.locator('[data-bonus-project="draftstopper"] [data-page="draftstopper"]').click();
   assert.match(await page.locator('h1').first().innerText(),/Boudin de porte/,'Tutoriel Bonus boudin accessible');
   assert.equal(await page.locator('.dog-course > .card:not(#boudin-teckel) .dog-steps>li').count(),8,'Huit étapes du modèle simple');
   assert.equal(await page.locator('#boudin-teckel .dog-steps>li').count(),8,'Huit étapes de la variante à tête intégrée');
   assert.match(await page.locator('#boudin-teckel').innerText(),/quatre petites pattes/i,'Quatre pattes prévues');
   assert.match(await page.locator('#boudin-teckel').innerText(),/queue relevée/i,'Queue relevée prévue');
   assert.equal(await page.locator('#boudin-teckel svg').count(),1,'Illustration de la variante teckel');
   assert.match(await page.locator('.dog-course').innerText(),/84 × 20 cm/,'Dimensions exemple cohérentes');
   assert.match(await page.locator('.dog-course').innerText(),/en cours d’écriture/i,'Statut du projet boudin');
   await page.goBack();
   await page.locator('#bonus-select').waitFor();
   assert.equal(await page.evaluate(()=>state.page),'bonus','Retour Android Boudin vers Bonus');
   await page.locator('#bonus-select').selectOption('');

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
   await page.locator('[data-bonus-pattern="draftstopper"] [data-pattern-preview="draftstopper"]').click();
   const draft=page.frameLocator('#pattern-preview-frame');
   assert.equal(await draft.locator('.sheet').count(),4,'Quatre planches A4 avec tête complète du teckel');
   const measures=await draft.locator('svg').first().evaluate(svg=>{
    const circle=svg.querySelector('#boudin-embout').getBBox(),witness=svg.querySelector('#boudin-temoin').getBBox();
    return {circle:[circle.width,circle.height],witness:[witness.width,witness.height],units:svg.getAttribute('width')};
   });
   assert.ok(Math.abs(measures.circle[0]-77.3)<0.2&&Math.abs(measures.circle[1]-77.3)<0.2,'Embout imprimable de 7,7 cm');
   assert.deepEqual(measures.witness,[50,50],'Carré de contrôle 5 cm du boudin');
   assert.equal(measures.units,'210mm','A4 à taille réelle pour le boudin');
   const pieces=await draft.locator('svg').nth(1).evaluate(svg=>{
    const test=svg.querySelector('#teckel-temoin-5cm').getBBox();
    return {units:svg.getAttribute('width'),test:[test.width,test.height],paws:svg.querySelectorAll('#teckel-patte').length,tail:svg.querySelectorAll('#teckel-queue').length,ear:svg.querySelectorAll('#teckel-oreille').length};
   });
   assert.deepEqual(pieces.test,[50,50],'Deuxième carré de contrôle à 5 cm');
   assert.equal(pieces.units,'210mm','Deuxième planche A4 à l’échelle');
   assert.deepEqual([pieces.paws,pieces.tail,pieces.ear],[1,1,1],'Gabarits patte, queue et oreille présents');
   // Égalité des coutures tête/bande de dessus et raccord du cou au corps.
   const tete=await draft.locator('svg').nth(2).evaluate(svg=>{
    const left=svg.querySelector('#teckel-tete-gauche'),right=svg.querySelector('#teckel-tete-droite');
    const upper=left.querySelector('[data-teckel-haut-piqure]').getTotalLength();
    const seam=left.querySelector('path.cut').getBBox();
    const neck=svg.querySelector('#teckel-tete-gauche path[stroke="#2f7959"]').getTotalLength();
    return {hasLeft:!!left,hasRight:!!right,upper,neck,box:[seam.x,seam.y,seam.width,seam.height],units:svg.getAttribute('width')};
   });
   assert.ok(tete.hasLeft&&tete.hasRight,'Deux profils tête en miroir');
   assert.ok(tete.upper>140&&tete.upper<150,'Courbe supérieure de tête dans les dimensions attendues');
   assert.equal(tete.neck,60,'Côté de cou = 60 mm');
   assert.ok(tete.box[0]>20&&tete.box[0]+tete.box[2]<185,'Profil entier sur A4');
   assert.equal(tete.units,'210mm','Profils à taille réelle A4');
   const gusset=await draft.locator('svg').nth(3).evaluate(svg=>{
    const witness=svg.querySelector('#teckel-tete-temoin').getBBox();
    return {
      width:svg.getAttribute('width'),
      witness:[witness.width,witness.height],
      left:svg.querySelector('#teckel-gousset-cote1').getTotalLength(),
      right:svg.querySelector('#teckel-gousset-cote2').getTotalLength(),
      neck:svg.querySelector('path[stroke="#2f7959"]').getTotalLength()
    };
   });
   assert.deepEqual(gusset.witness,[50,50],'Carré de contrôle tête 5 × 5 cm');
   assert.equal(gusset.width,'210mm','Bande de tête à taille réelle A4');
   assert.ok(Math.abs(gusset.left-tete.upper)<0.5&&Math.abs(gusset.right-tete.upper)<0.5,'Coutures latérales et dessus de tête de même longueur');
   assert.ok(Math.abs(tete.neck*2+gusset.neck-180)<0.1,'Cou de 18 cm raccordable au tube fini');
   await page.locator('[data-pattern-preview-close]').click();

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
