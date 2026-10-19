'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const ROOT='http://127.0.0.1:8765/';
async function main(){
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const contexts=[];
 try{
  const c=await browser.newContext({viewport:{width:390,height:844},acceptDownloads:true});contexts.push(c);
  const p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto(ROOT,{waitUntil:'domcontentloaded'});
  await p.getByRole('button',{name:'Viera',exact:true}).click();
  await p.locator('#bottomnav [data-page="learn"]').click();
  await p.getByRole('heading',{name:'Mes cours'}).waitFor();
  assert.equal(await p.locator('#week-select option').count(),52,'Le programme conserve 52 semaines');
  const expected=[
   [2,'Dessous de verre réversible',7,'Deux bandes verticales'],
   [3,'Étui à mouchoirs',7,'Bandes horizontales'],
   [4,'Chouchou en tissu',8,'Carré central simple'],
   [5,'Sachet de lavande',8,'Nine-patch, neuf carrés'],
   [6,'Pochon à coulisse',9,'Coins contrastés']
  ];
  for(const [week,title,numSteps,quiltTitle] of expected){
   await p.locator('#week-select').selectOption(String(week));
   await p.getByText('En cours d’écriture · N° '+String(week).padStart(2,'0')).waitFor();
   await p.getByRole('heading',{name:title,exact:true}).waitFor();
   assert.equal(await p.locator('[data-toggle="steps"]').count(),numSteps);
   assert.ok(await p.locator('[data-toggle="mat"]').count()>=4);
   assert.equal(await p.locator('.lesson-figure svg').count(),1);
   assert.equal(await p.locator('.patchwork-one,[data-lesson-patch]').count(),0,'Les blocs restent dans le volet Patchwork');
   assert.equal(await p.locator('.lesson-problem').count(),3);
   assert.equal(await p.locator('.lesson-checkpoints li').count(),3);
   assert.equal(await p.locator('.lesson-patch-done').count(),0,'Aucune validation patchwork dans la couture');
   assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2));
  }
  console.log('OK : cinq cours 2 à 6 complets, schémas, matériels, blocs et diagnostics');
  await p.locator('#week-select').selectOption('2');
  await p.locator('[data-toggle="steps"]').first().check();
  await p.locator('#bottomnav [data-page="quilt"]').click();await p.locator('#patch-week-select').selectOption('2');await p.locator('.lesson-patch-done').click();
  assert.ok(await p.evaluate(()=>state.steps[state.profile].includes(2000)),'La progression Couture est conservée quand on ouvre le Patchwork');
  assert.match(await p.locator('.lesson-patch-done').innerText(),/terminé/i);
  await p.locator('[data-patch-cover]').click();
  assert.equal(await p.locator('.quilt [data-quilt-block="2"]').getAttribute('aria-pressed'),'true');
  console.log('OK : cases personnelles et carré n°2 synchronisés avec la couverture');
  await p.reload({waitUntil:'domcontentloaded'});
  await p.locator('#bottomnav [data-page="learn"]').click();
  await p.locator('#week-select').selectOption('2');
  await p.getByText('En cours d’écriture · N° 02').waitFor();
  assert.ok(await p.locator('[data-toggle="steps"]').first().isChecked());
  console.log('OK : progression sauvegardée après rechargement');
  await p.locator('#week-select').selectOption('7');
  await p.getByText('En cours d’écriture · Contenu à compléter').waitFor();
  await p.locator('#week-select').selectOption('1');
  await p.getByText('Validé à 100 % · Cours 01').waitFor();
  console.log('OK : cours 1 intact et semaines 7–52 toujours prévisionnelles');
  await p.waitForFunction(()=>!!navigator.serviceWorker.controller,{timeout:15000});
  await c.setOffline(true);
  await p.reload({waitUntil:'domcontentloaded'});
  await p.locator('#bottomnav [data-page="learn"]').click();
  await p.locator('#week-select').selectOption('5');
  await p.getByText('En cours d’écriture · N° 05').waitFor({timeout:10000});
  assert.equal(await p.locator('.lesson-figure svg').count(),1);
  console.log('OK : nouvelle leçon, schémas et textes accessibles hors connexion');
  assert.deepEqual(errors,[],'Erreurs JS dans le navigateur');
  await c.setOffline(false);
  const c2=await browser.newContext({viewport:{width:390,height:844}});contexts.push(c2);
  const q=await c2.newPage();await q.goto(ROOT,{waitUntil:'domcontentloaded'});
  await q.getByRole('button',{name:'Mathilde',exact:true}).click();
  await q.locator('#bottomnav [data-page="learn"]').click();
  await q.locator('#week-select').selectOption('2');
  await q.getByText('En cours d’écriture · N° 02').waitFor();
  assert.equal(await q.locator('[data-toggle="steps"]').first().isChecked(),false);
  await q.locator('#bottomnav [data-page="quilt"]').click();await q.locator('#patch-week-select').selectOption('2');assert.equal(await q.locator('.lesson-patch-done').getAttribute('aria-pressed'),'false');
  console.log('OK : progression de Mathilde indépendante de celle de Viera');
 }finally{for(const c of contexts)await c.close();await browser.close()}
}
main().catch(error=>{console.error('Échec cours enrichis :',error.stack||error);process.exitCode=1});
