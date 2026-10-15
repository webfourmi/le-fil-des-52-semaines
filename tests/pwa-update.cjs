'use strict';
/* Essai réel de cycle de mise à jour du service worker, exécuté avec Chromium.
   Le script sert deux versions successives du même service worker sur localhost,
   puis vérifie que le rechargement se fait uniquement après acceptation.
*/
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.webmanifest':'application/manifest+json','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp'};
let revision=1;
async function serve(req,res){
 try{
  const pathname=new URL(req.url,'http://localhost').pathname;
  let relative=decodeURIComponent(pathname).replace(/^\/+/, '') || 'index.html';
  const absolute=path.resolve(root,relative);
  if(!absolute.startsWith(root+path.sep))throw Error('Invalid path');
  let bytes=await fs.readFile(absolute);
  if(relative==='sw.js'){
   let source=bytes.toString('utf8');
   source=source.replace("fil52-shell-v0.5.0","fil52-shell-v0.5.test."+revision);
   bytes=Buffer.from(source+'\n// Browser test revision: '+revision+'\n');
  }
  res.writeHead(200,{'Content-Type':mime[path.extname(relative)]||'application/octet-stream','Cache-Control':'no-store'});
  res.end(bytes);
 }catch(_){res.writeHead(404);res.end('Not found');}
}
async function main(){
 const server=http.createServer((req,res)=>{serve(req,res).catch(e=>{console.error(e);res.writeHead(500);res.end()})});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const port=server.address().port,origin='http://127.0.0.1:'+port+'/';
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  const context=await browser.newContext({viewport:{width:390,height:844}});
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(origin,{waitUntil:'domcontentloaded'});
  await page.getByRole('button',{name:'Moi',exact:true}).click();
  await page.locator('#bottomnav [data-page="journal"]').click();
  await page.locator('[data-note="1"]').fill('Une note à garder même après mise à jour.');
  await page.waitForFunction(()=>!!navigator.serviceWorker.controller,{timeout:15000});
  await page.evaluate(()=>{window.__notReloadedMarker='en train de coudre'});
  revision=2;
  await page.evaluate(async()=>{
   const reg=await navigator.serviceWorker.ready;
   await reg.update();
  });
  await page.getByText('Une nouvelle version de l’application est prête.').waitFor({timeout:15000});
  assert.equal(await page.evaluate(()=>window.__notReloadedMarker),'en train de coudre');
  assert.equal(await page.locator('[data-note="1"]').inputValue(),'Une note à garder même après mise à jour.');
  const waiting=await page.evaluate(async()=>!!(await navigator.serviceWorker.ready).waiting);
  assert.equal(waiting,true,'Mise à jour en attente de confirmation utilisateur');
  console.log('OK : nouvelle version annoncée, pas de rechargement forcé');
  await page.getByRole('button',{name:'Mettre à jour',exact:true}).click();
  await page.waitForFunction(()=>!window.__notReloadedMarker,{timeout:15000});
  await page.locator('#bottomnav [data-page="journal"]').click();
  assert.equal(await page.locator('[data-note="1"]').inputValue(),'Une note à garder même après mise à jour.');
  const active=await page.evaluate(async()=>(await navigator.serviceWorker.ready).active?.scriptURL||'');
  assert.ok(active.endsWith('/sw.js'));
  assert.deepEqual(errors,[],'Aucune erreur JavaScript dans le navigateur');
  console.log('OK : mise à jour acceptée et carnet personnel préservé');
  await context.close();
 }finally{
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
 }
}
main().catch(err=>{console.error('Échec test de mise à jour',err.stack||err);process.exitCode=1});
