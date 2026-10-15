'use strict';
// Vérifie la PWA sur le véritable type de chemin GitHub Pages : /le-fil-des-52-semaines/.
// Un serveur de test isole délibérément tous les fichiers hors de ce préfixe.
const { chromium } = require('playwright');
const { strict: assert } = require('node:assert');
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const prefix = '/le-fil-des-52-semaines/';
const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp'};
async function handler(req,res){
 try{
   const url=new URL(req.url,'http://localhost');
   if(!url.pathname.startsWith(prefix))throw Error('Outside deployment prefix');
   const relative=decodeURIComponent(url.pathname.slice(prefix.length))||'index.html';
   const target=path.resolve(root,relative);
   if(!target.startsWith(root+path.sep))throw Error('Unsafe path');
   const data=await fs.readFile(target);
   res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream','Cache-Control':'no-store'});
   res.end(data);
 }catch(_){res.writeHead(404);res.end('Not found')}
}
async function main(){
 const server=http.createServer((req,res)=>handler(req,res).catch(err=>{console.error(err);res.writeHead(500);res.end()}));
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base='http://127.0.0.1:'+server.address().port+prefix;
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
   const context=await browser.newContext({viewport:{width:390,height:844},acceptDownloads:true});
   const page=await context.newPage();
   const errors=[];page.on('pageerror',error=>errors.push(error.message));
   await page.goto(base,{waitUntil:'domcontentloaded'});
   const manifest=await page.evaluate(async()=>{
     const href=document.querySelector('link[rel="manifest"]').href;
     const data=await (await fetch(href)).json();
     return {href,id:data.id,scope:data.scope,start_url:data.start_url};
   });
   assert.equal(manifest.href,base+'manifest.webmanifest');
   assert.equal(new URL(manifest.id,base).pathname,prefix);
   assert.equal(new URL(manifest.scope,base).pathname,prefix);
   assert.equal(new URL(manifest.start_url,base).pathname,prefix);
   await page.getByRole('button',{name:'Moi',exact:true}).click();
   await page.getByRole('button',{name:'Sauvegarder mon carnet',exact:true}).click();
   await page.getByRole('heading',{name:/Sauvegarde de/}).waitFor();
   await page.locator('#bottomnav [data-page="home"]').click();
   await page.getByRole('button',{name:'Comment l’installer ?'}).click();
   assert.ok(await page.getByText('importe ta sauvegarde personnelle',{exact:false}).count());
   console.log('OK : installation GitHub Pages sous-chemin, guide sauvegarde avant installation.');
   await page.locator('#bottomnav [data-page="journal"]').click();
   await page.locator('[data-note="1"]').fill('Note locale depuis le préfixe GitHub Pages.');
   await page.waitForFunction(()=>!!navigator.serviceWorker.controller,{timeout:15000});
   const worker=await page.evaluate(async()=>{
     const registration=await navigator.serviceWorker.ready;
     return {scope:registration.scope,script:registration.active?.scriptURL};
   });
   assert.equal(worker.scope,base);
   assert.equal(worker.script,base+'sw.js');
   await context.setOffline(true);
   await page.reload({waitUntil:'domcontentloaded',timeout:20000});
   await page.locator('#bottomnav [data-page="journal"]').click();
   assert.equal(await page.locator('[data-note="1"]').inputValue(),'Note locale depuis le préfixe GitHub Pages.');
   const edition=await page.evaluate(async()=>{
     const response=await fetch('./data/editions.json');
     return await response.json();
   });
   assert.ok(edition.published.includes(1));
   assert.deepEqual(errors,[],'Erreurs navigateur : '+errors.join(', '));
   console.log('OK : cache et journal hors connexion sous /le-fil-des-52-semaines/.');
   await context.close();
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
}
main().catch(err=>{console.error('Échec test de sous-chemin GitHub Pages',err.stack||err);process.exitCode=1});
