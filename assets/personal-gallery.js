/* Photos des créations libres, isolées des 52 cours et des autres profils.
 * Stockage privé IndexedDB. Aucune transmission réseau.
 */
(function(root){
'use strict';
const NAME='fil52.personal-photos.v1',STORE='photos';
const MAX_PHOTOS=100,MAX_PER_PROJECT=20;
const validProfile=p=>p==='m'||p==='f';
const validId=x=>typeof x==='string'&&/^[a-zA-Z0-9_-]{1,64}$/.test(x);
const check=(ok,msg)=>{if(!ok)throw Error(msg)};
const key=(profile,projectId,photoId)=>profile+':'+projectId+':'+photoId;
let opening;
function database(){
 check(!!root.indexedDB,'La galerie personnelle est indisponible sur cet appareil.');
 if(!opening)opening=new Promise((resolve,reject)=>{
  const request=root.indexedDB.open(NAME,1);
  request.onupgradeneeded=()=>request.result.createObjectStore(STORE,{keyPath:'id'});
  request.onsuccess=()=>resolve(request.result);
  request.onerror=()=>reject(request.error||Error('Impossible d’ouvrir la galerie.'));
 }).catch(e=>{opening=null;throw e});
 return opening;
}
function validate(row,profile){
 check(validProfile(profile),'Profil incorrect.');
 check(row&&typeof row==='object'&&!Array.isArray(row),'Photo personnelle invalide.');
 check(validId(row.projectId)&&validId(row.photoId),'Référence de photo invalide.');
 check(typeof row.dataUrl==='string'&&row.dataUrl.length<=root.Fil52Gallery.MAX_DATAURL&&/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(row.dataUrl),'Image personnelle invalide.');
 return {id:key(profile,row.projectId,row.photoId),profile,projectId:row.projectId,photoId:row.photoId,dataUrl:row.dataUrl,updatedAt:typeof row.updatedAt==='string'&&Number.isFinite(Date.parse(row.updatedAt))?row.updatedAt:new Date().toISOString()};
}
function newId(){return 'p'+(root.crypto?.randomUUID?.()||Date.now().toString(36)+'-'+Math.random().toString(36).slice(2));}
async function list(profile){
 check(validProfile(profile),'Profil incorrect.');
 const db=await database();
 return new Promise((resolve,reject)=>{
  const request=db.transaction(STORE,'readonly').objectStore(STORE).getAll();
  request.onsuccess=()=>resolve((request.result||[]).filter(row=>row.profile===profile).sort((a,b)=>a.updatedAt.localeCompare(b.updatedAt)));
  request.onerror=()=>reject(request.error||Error('Lecture des photos impossible.'));
 });
}
async function add(profile,projectId,file){
 check(validProfile(profile)&&validId(projectId),'Projet incorrect.');
 const existing=await list(profile);
 check(existing.length<MAX_PHOTOS,'La galerie personnelle contient déjà 100 photos.');
 check(existing.filter(x=>x.projectId===projectId).length<MAX_PER_PROJECT,'20 photos maximum par projet.');
 check(typeof root.Fil52Gallery.compress==='function','Mets à jour l’application avant d’ajouter des photos personnelles.');
 const dataUrl=await root.Fil52Gallery.compress(file);
 const result=validate({projectId,photoId:newId(),dataUrl,updatedAt:new Date().toISOString()},profile);
 const db=await database();
 return new Promise((resolve,reject)=>{
  const tx=db.transaction(STORE,'readwrite');
  tx.objectStore(STORE).put(result);
  tx.oncomplete=()=>resolve(result);
  tx.onerror=()=>reject(tx.error||Error('Enregistrement impossible (espace de stockage ?).'));
  tx.onabort=()=>reject(tx.error||Error('Enregistrement interrompu.'));
 });
}
async function remove(profile,projectId,photoId){
 check(validProfile(profile)&&validId(projectId)&&validId(photoId),'Photo incorrecte.');
 const db=await database();
 return new Promise((resolve,reject)=>{
  const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).delete(key(profile,projectId,photoId));
  tx.oncomplete=()=>resolve();
  tx.onerror=()=>reject(tx.error||Error('Suppression impossible.'));
 });
}
async function replace(profile,photos,projectIds){
 check(validProfile(profile),'Profil incorrect.');
 check(Array.isArray(photos)&&photos.length<=MAX_PHOTOS,'Album personnel invalide.');
 check(Array.isArray(projectIds)&&projectIds.every(validId),'Liste de projets invalide.');
 const allowed=new Set(projectIds),unique=new Set(),count={};
 const items=photos.map(row=>{
  const item=validate(row,profile);
  check(allowed.has(item.projectId),'Photographie associée à un projet inexistant.');
  check(!unique.has(item.id),'Photographie dupliquée.');
  unique.add(item.id);count[item.projectId]=(count[item.projectId]||0)+1;
  check(count[item.projectId]<=MAX_PER_PROJECT,'Trop de photos dans un projet.');
  return item;
 });
 const db=await database();
 return new Promise((resolve,reject)=>{
  const tx=db.transaction(STORE,'readwrite'),store=tx.objectStore(STORE),cursor=store.openCursor();
  cursor.onsuccess=()=>{const row=cursor.result;
   if(row){if(row.value?.profile===profile)row.delete();row.continue()}
   else for(const photo of items)store.put(photo);
  };
  tx.oncomplete=()=>resolve(items.length);
  tx.onerror=()=>reject(tx.error||Error('Restauration des photos impossible.'));
  tx.onabort=()=>reject(tx.error||Error('Restauration des photos interrompue.'));
 });
}
root.Fil52PersonalPhotos={MAX_PHOTOS,MAX_PER_PROJECT,validId,newId,validate,list,add,remove,replace};
})(globalThis);
