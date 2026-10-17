'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const base='http://127.0.0.1:8765/';
const six=['home','learn','quilt','world','journal','print'];
const eight=[...six,'backup','personal'];
const assets={
home:'icon-app.svg',learn:'icon-couture.svg',quilt:'icon-patchwork.svg',
world:'nav-world.svg',journal:'nav-journal.svg',print:'nav-print.svg',
backup:'nav-backup.svg',personal:'nav-personal.svg'
};
async function verifyMenu(page,id,keys){
 const buttons=page.locator(id+' button');
 assert.deepEqual(await buttons.evaluateAll(btns=>btns.map(el=>el.dataset.page)),keys);
 for(const key of keys){
  const btn=page.locator(id+' button[data-page="'+key+'"]');
  const img=btn.locator('img.nav-art');
  assert.equal(await img.count(),1,key+' image missing');
  assert.equal((await img.getAttribute('src')).split('/').pop(),assets[key]);
  assert.ok(await img.evaluate(e=>e.complete&&e.naturalWidth>0),'broken image '+key);
  assert.ok((await btn.innerText()).trim().length>0,'missing label for '+key);
 }
}
async function main(){
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  for(const width of [320,390,1440]){
   const ctx=await browser.newContext({viewport:{width,height:810}});
   const page=await ctx.newPage();
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base,{waitUntil:'domcontentloaded'});
   await page.getByRole('button',{name:'Moi',exact:true}).click();
   const isMobile=width<=850;
   await verifyMenu(page,isMobile?'#bottomnav':'#nav',isMobile?six:eight);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'horizontal overflow at '+width);
   if(isMobile){
    const buttons=page.locator('#bottomnav button');
    const positions=await buttons.evaluateAll(bs=>bs.map(e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,width:r.width}}));
    assert.equal(positions.length,6);
    assert.ok(positions.every(p=>p.left>=-1&&p.right<=width+1&&p.width>=45),'icons should fit: '+JSON.stringify(positions));
    for(let i=1;i<positions.length;i++)assert.ok(positions[i].left>=positions[i-1].right-1);
   }
   const menu=isMobile?'#bottomnav':'#nav';
   await page.locator(menu+' [data-page="quilt"]').click();
   await page.getByRole('heading',{name:'Ma couverture de 52 blocs'}).waitFor();
   assert.equal(await page.locator(menu+' [data-page="quilt"]').getAttribute('aria-current'),'page');
   assert.equal(await page.locator(menu+' [data-page="learn"]').getAttribute('aria-current'),'false');
   await page.locator(menu+' [data-page="world"]').click();
   await page.getByRole('heading',{name:'Histoires à coudre'}).waitFor();
   await page.locator(menu+' [data-page="journal"]').click();
   await page.getByRole('heading',{name:/Mon journal|Journal de/}).waitFor();
   await page.locator(menu+' [data-page="home"]').click();
   await page.waitForFunction(()=>navigator.serviceWorker.controller!==null,{timeout:15000});
   await ctx.setOffline(true);
   await page.reload({waitUntil:'domcontentloaded'});
   await verifyMenu(page,menu,isMobile?six:eight);
   await page.locator(menu+' [data-page="quilt"]').click();
   await page.getByRole('heading',{name:'Ma couverture de 52 blocs'}).waitFor();
   await ctx.setOffline(false);
   assert.deepEqual(errors,[],errors.join('; '));
   await ctx.close();
   console.log('OK : navigation illustrée, six accès mobile, huit ordinateur, hors connexion à '+width+' px');
  }
 }finally{await browser.close()}
}
main().catch(e=>{console.error('Échec de la navigation illustrée :',e.stack||e);process.exitCode=1});
