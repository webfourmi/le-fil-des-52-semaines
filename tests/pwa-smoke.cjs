'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
const context=await browser.newContext({viewport:{width:390,height:844}});
const page=await context.newPage();
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded'});
await page.getByRole('button',{name:'Moi',exact:true}).click();
const manifest=await page.locator('link[rel="manifest"]').getAttribute('href');
assert.equal(manifest,'./manifest.webmanifest');
const request=await page.request.get('http://127.0.0.1:8765/manifest.webmanifest');
assert.equal(request.status(),200);
const json=await request.json();
assert.equal(json.display,'standalone');
assert.ok(json.icons.some(i=>i.src.endsWith('.svg')));
await page.getByRole('button',{name:'Comment l’installer ?'}).click();
assert.ok(await page.getByText('Sur l’écran d’accueil').count());
assert.ok(await page.getByText('Installer l’application',{exact:false}).count());
assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2));
assert.deepEqual(errors,[]);
console.log('OK : manifeste, guide iPhone/Android, absence de débordement mobile.');
await context.close();
}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
