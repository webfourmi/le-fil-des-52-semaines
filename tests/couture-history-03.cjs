'use strict';
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
(async()=>{
  const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  try{
    for(const width of [320,390,1280]){
      const context=await browser.newContext({viewport:{width,height:width<900?850:900}});
      const page=await context.newPage(),errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      await page.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded'});
      await page.getByRole('button',{name:'Viera',exact:true}).click();
      await page.locator((width<=850?'#bottomnav':'#nav')+' [data-page="world"]').click();
      await page.locator('[data-culture-tab="history"]').click();
      await page.locator('#culture-article-select').selectOption('history:medieval-03');
      await page.locator('#medieval-article-title').waitFor();
      assert.equal(await page.locator('.editorial-head-status').innerText(),'✎ En cours d’écriture');
      assert.equal(await page.locator('.medieval-stitch-card').count(),9);
      assert.equal(await page.locator('.medieval-sewing-steps li').count(),8);
      assert.equal(await page.locator('.medieval-chapter').count(),9);
      assert(await page.locator('#medieval-workshop-title').innerText().then(x=>x.includes('aumônière')));
      const text=await page.locator('.medieval-article').innerText();
      for(const term of ['XIe','XIVe','broderie','Bayeux','tailleur','Opus Anglicanum','aumônière'])assert(text.includes(term),'Manque '+term);
      assert((await page.locator('.medieval-article img').count())>=3);
      for(const path of ['assets/aumoniere-medievale-patron.html','assets/aumoniere-fleur.svg','assets/aumoniere-points.svg']){
        assert.equal((await page.request.get('http://127.0.0.1:8765/'+path)).status(),200,path);
      }
      assert.deepEqual(errors,[]);
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'Débordement article '+width);
      if(width>850){
        await page.locator('#nav [data-page="print"]').click();
        await page.getByRole('heading',{name:'Aumônière brodée et neuf points à la main'}).waitFor();
      }
      assert.deepEqual(errors,[]);
      await context.close();console.log('OK histoire médiévale et atelier '+width+'px');
    }
    const context=await browser.newContext({viewport:{width:1200,height:900}});
    const page=await context.newPage();
    await page.goto('http://127.0.0.1:8765/assets/aumoniere-medievale-patron.html',{waitUntil:'domcontentloaded'});
    assert.equal(await page.locator('.sheet').count(),5);
    const sizes=await page.locator('.pattern-frame').evaluate(el=>{const r=el.getBoundingClientRect();return {width:r.width,height:r.height}});
    assert(Math.abs(sizes.width-180*96/25.4)<2,'Patron incorrect largeur '+sizes.width);
    assert(Math.abs(sizes.height-230*96/25.4)<2,'Patron incorrect hauteur '+sizes.height);
    assert.equal(await page.locator('.test-box').count(),1);
    await context.close();console.log('OK patron à taille réelle 180 x 230 mm et 5 pages A4');
  }finally{await browser.close();}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1});