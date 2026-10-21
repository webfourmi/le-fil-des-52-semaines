/* Galerie personnelle de De fil en aiguille.
 * Photos conservées localement dans IndexedDB, jamais envoyées au site.
 * Une ancienne photo par projet et par bloc, pour chaque profil.
 */
(function(root){
'use strict';
const DB_NAME='fil52.galerie.v1',STORE='photos',MAX_FILE=12*1024*1024;
const TYPES=['project','block'],PROFILE=['m','f'],MAX_DATAURL=420000;
const invalid=(condition,msg)=>{if(!condition)throw Error(msg)};
const key=(profile,week,type)=>profile+':'+type+':'+week;
function check(profile,week,type){invalid(PROFILE.includes(profile),'Profil invalide.');invalid(Number.isInteger(week)&&week>=1&&week<=52,'Numéro de cours invalide.');invalid(TYPES.includes(type),'Type de photo invalide.')}
let dbPromise=null;
function db(){
 if(!root.indexedDB)return Promise.reject(Error('Ce navigateur ne permet pas la galerie locale.'));
 if(!dbPromise)dbPromise=new Promise((resolve,reject)=>{
  const req=root.indexedDB.open(DB_NAME,1);
  req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(STORE))req.result.createObjectStore(STORE,{keyPath:'id'})};
  req.onsuccess=()=>resolve(req.result);
  req.onerror=()=>reject(req.error||Error('IndexedDB inaccessible.'));
 }).catch(e=>{dbPromise=null;throw e});
 return dbPromise;
}
async function list(profile){
 invalid(PROFILE.includes(profile),'Profil invalide.');
 const database=await db();
 return new Promise((resolve,reject)=>{
  const tx=database.transaction(STORE,'readonly'),request=tx.objectStore(STORE).getAll();
  request.onsuccess=()=>resolve((request.result||[]).filter(x=>x.profile===profile).sort((a,b)=>a.week-b.week||TYPES.indexOf(a.type)-TYPES.indexOf(b.type)));
  request.onerror=()=>reject(request.error);
 });
}
async function get(profile,week,type){
 check(profile,week,type);const database=await db();
 return new Promise((resolve,reject)=>{
  const req=database.transaction(STORE,'readonly').objectStore(STORE).get(key(profile,week,type));
  req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>reject(req.error);
 });
}
function decodeImage(file){
 return new Promise((resolve,reject)=>{
  const url=URL.createObjectURL(file),im=new Image();
  im.onload=()=>{URL.revokeObjectURL(url);resolve(im)};
  im.onerror=()=>{URL.revokeObjectURL(url);reject(Error('Impossible de décoder cette image.'))};
  im.src=url;
 });
}
async function compress(file){
 invalid(file&&file.size>0&&file.size<=MAX_FILE,'Photo trop volumineuse (12 Mo maximum).');
 invalid(['image/jpeg','image/png','image/webp'].includes(file.type),'Format accepté : JPEG, PNG ou WebP.');
 const im=await decodeImage(file);
 invalid(im.naturalWidth>0&&im.naturalHeight>0,'Photo illisible.');
 const scale=Math.min(1,960/Math.max(im.naturalWidth,im.naturalHeight));
 const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(im.naturalWidth*scale));canvas.height=Math.max(1,Math.round(im.naturalHeight*scale));
 const ctx=canvas.getContext('2d');invalid(ctx,'Canvas non disponible.');
 ctx.fillStyle='#ffffff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(im,0,0,canvas.width,canvas.height);
 let output='';
 for(const quality of [.78,.65,.50,.38]){output=canvas.toDataURL('image/jpeg',quality);if(output.length<=MAX_DATAURL)break}
 invalid(output.startsWith('data:image/jpeg;base64,')&&output.length<=MAX_DATAURL,'L’image reste trop grande après réduction.');
 return output;
}
function validatePhoto(photo,profile){
 invalid(photo&&typeof photo==='object'&&!Array.isArray(photo),'Photographie invalide.');
 check(profile,photo.week,photo.type);
 invalid(typeof photo.dataUrl==='string'&&photo.dataUrl.startsWith('data:image/jpeg;base64,')&&photo.dataUrl.length<=MAX_DATAURL&&/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(photo.dataUrl),'Contenu de photographie invalide.');
 return {id:key(profile,photo.week,photo.type),profile,week:photo.week,type:photo.type,dataUrl:photo.dataUrl,updatedAt:typeof photo.updatedAt==='string'&&Number.isFinite(Date.parse(photo.updatedAt))?photo.updatedAt:new Date().toISOString()};
}
async function upsert(profile,week,type,file){
 check(profile,week,type);
 const dataUrl=await compress(file);
 const item=validatePhoto({week,type,dataUrl,updatedAt:new Date().toISOString()},profile);
 const database=await db();
 return new Promise((resolve,reject)=>{
  const tx=database.transaction(STORE,'readwrite');
  tx.objectStore(STORE).put(item);
  tx.oncomplete=()=>resolve(item);
  tx.onerror=()=>reject(tx.error||Error('Enregistrement impossible : espace disque peut-être insuffisant.'));
  tx.onabort=()=>reject(tx.error||Error('Enregistrement annulé.'));
 });
}
async function remove(profile,week,type){
 check(profile,week,type);const database=await db();
 return new Promise((resolve,reject)=>{
  const tx=database.transaction(STORE,'readwrite');tx.objectStore(STORE).delete(key(profile,week,type));
  tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error||Error('Suppression impossible.'));
 });
}
async function replace(profile,photos){
 invalid(PROFILE.includes(profile),'Profil invalide.');
 invalid(Array.isArray(photos)&&photos.length<=104,'Album invalide.');
 const map=new Map();
 for(const photo of photos){const item=validatePhoto(photo,profile);invalid(!map.has(item.id),'Doublon de photographie dans la sauvegarde.');map.set(item.id,item)}
 const database=await db();
 return new Promise((resolve,reject)=>{
  const tx=database.transaction(STORE,'readwrite'),store=tx.objectStore(STORE);
  const scan=store.openCursor();
  scan.onsuccess=()=>{const cursor=scan.result;
   if(cursor){if(cursor.value?.profile===profile)cursor.delete();cursor.continue();}
   else for(const item of map.values())store.put(item);
  };
  tx.oncomplete=()=>resolve(map.size);
  tx.onerror=()=>reject(tx.error||Error('Restauration de la galerie impossible.'));
  tx.onabort=()=>reject(tx.error||Error('Restauration de la galerie interrompue.'));
 });
}
root.Fil52Gallery={TYPES,MAX_FILE,MAX_DATAURL,compress,list,get,upsert,remove,replace,validatePhoto};
})(globalThis);
