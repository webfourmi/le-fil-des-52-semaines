'use strict';
const {chromium}=require('playwright');const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({headless:true});try{
 const context=await browser.newContext({viewport:{width:320,height:740}}),page=await context.newPage();
 await page.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded'});
 await page.getByRole('button',{name:'Viera',exact:true}).click();
 assert.deepEqual(await page.locator('#bottomnav button').evaluateAll(buttons=>buttons.map(b=>b.dataset.page)),['home','learn','quilt','world','journal','print']);
 const travel=page.locator('#bottomnav [data-page="world"]');
 assert.equal(await travel.locator('img.nav-art').count(),1);await travel.click();
 await page.locator('.travel-article').first().waitFor();assert.equal(await travel.getAttribute('aria-current'),'page');
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.locator('#bottomnav [data-page="learn"]').click();
 await page.locator('#bottomnav [data-page="quilt"]').click();await page.getByRole('heading',{name:'Mes cours de patchwork'}).waitFor();
 assert.ok(await page.locator('#bottomnav [data-page="quilt"]').evaluate(el=>el.classList.contains('active')));
 await page.waitForFunction(()=>!!navigator.serviceWorker.controller);await context.setOffline(true);await page.reload({waitUntil:'domcontentloaded'});
 await page.locator('#bottomnav [data-page="world"]').click();assert.equal(await page.locator('.travel-chapter').count(),18);
 await page.screenshot({path:'../voyage-mobile.png',fullPage:false});
 console.log('OK : six vraies icônes à 320 px, accès patchwork depuis Mes cours, articles hors connexion');
 }finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
