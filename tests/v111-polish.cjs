'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const url='http://127.0.0.1:8765/';
async function main(){
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  await fs.mkdir('tests/screenshots',{recursive:true});
  for(const width of [320,390,1280]){
   const ctx=await browser.newContext({viewport:{width,height:850}});
   const page=await ctx.newPage(),errs=[];
   page.on('pageerror',e=>errs.push(e.message));
   await page.goto(url,{waitUntil:'domcontentloaded'});
   await page.getByRole('button',{name:'Viera',exact:true}).click();
   // Insérer uniquement dans le stockage du navigateur de test un ancien carnet.
   await page.evaluate(()=>{
    const p=JSON.parse(localStorage.getItem('fil52.progress.v1'));
    p.names={m:'Moi',f:'Mathilde'};
    p.notes.m={'1':'Un souvenir de couture qui ne doit pas être effacé.'};
    p.projectsDone.m=[1];
    p.blocks.m=[1];
    localStorage.setItem('fil52.progress.v1',JSON.stringify(p));
   });
   await page.reload({waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>!!upcomingEditions[2]&&state.published.includes(2),{timeout:12000});
   const stateRead=await page.evaluate(()=>({profile:state.profile,name:state.names.m,other:state.names.f,notes:state.notes.m['1'],done:state.projectsDone.m.slice(),blocks:state.blocks.m.slice(),persistedIdentity:localStorage.getItem('fil52.identity')}));
   assert.equal(stateRead.profile,'m');assert.equal(stateRead.persistedIdentity,'m');
   assert.equal(stateRead.name,'Viera');assert.equal(stateRead.other,'Mathilde');
   assert.equal(stateRead.notes,'Un souvenir de couture qui ne doit pas être effacé.');
   assert.deepEqual(stateRead.done,[1]);assert.deepEqual(stateRead.blocks,[1]);
   await page.getByText("L'atelier de Mathilde & Viera",{exact:false}).waitFor();
   const top=page.locator('.hero-actions');
   assert.equal(await top.locator('button').count(),2);
   assert.equal(await top.locator('button').first().getAttribute('aria-label'),'Ouvrir le cours 2');
   assert.equal(await top.locator('button').nth(1).getAttribute('aria-label'),'Ouvrir le patchwork 2');
   assert.equal((await top.locator('button').first().innerText()).trim(),'');
   assert.equal((await top.locator('button').nth(1).innerText()).trim(),'');
   const images=await top.locator('img').all();assert.equal(images.length,2);
   for(const img of images)assert.ok(await img.evaluate(n=>n.complete&&n.naturalWidth>0));
   const pixels=await page.locator('.hero-editorial h1').evaluate(e=>parseFloat(getComputedStyle(e).fontSize));
   assert.ok(pixels<= (width>850?43:29),'Titre non réduit : '+pixels+'px');
   const nav=width<=850?'#bottomnav':'#nav';
   const trio=['nav-home-simple.svg','nav-sewing-simple.svg','nav-patch-simple.svg'];
   for(const [i,key] of ['home','learn','quilt'].entries()){
    const button=page.locator(nav+' [data-page="'+key+'"]'),im=button.locator('img.nav-art');
    assert.equal((await im.getAttribute('src')).split('/').pop(),trio[i]);
    assert.ok(await im.evaluate(n=>n.complete&&n.naturalWidth>0));
   }
   await page.screenshot({path:'tests/screenshots/v11-ajustements-'+width+'.png',fullPage:false});
   await top.locator('button').first().click();
   assert.equal(await page.locator('#week-select').inputValue(),'2');
   await page.locator(nav+' [data-page="home"]').click();
   await page.locator('.hero-actions .home-patch').click();
   await page.getByRole('heading',{name:'Mes cours de patchwork'}).waitFor();assert.equal(await page.locator('#patch-week-select').inputValue(),'2');
   const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('fil52.progress.v1')));
   assert.equal(stored.notes.m['1'],'Un souvenir de couture qui ne doit pas être effacé.');
   assert.deepEqual(stored.projectsDone.m,[1]);assert.deepEqual(stored.blocks.m,[1]);
   assert.equal(stored.names.m,'Viera');
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2));
   assert.deepEqual(errs,[]);
   await ctx.close();
   console.log('OK : Viera, carnet historique conservé, petits titres, pictos sobres, raccourcis accessibles à '+width+'px');
  }
 }finally{await browser.close()}
}
main().catch(e=>{console.error(e);process.exitCode=1});
