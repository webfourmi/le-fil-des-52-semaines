/* Albums du journal : jusque cinq photos par création, indépendants des photos pédagogiques.
 * Stockage local IndexedDB, aucun transfert automatique. Photos historiques de l'ancien journal préservées.
 */
(function(root){
'use strict';
const DATABASE='fil52.journal-photos.v1',STORE='photos',MAX_PER_ENTRY=5,MAX_PHOTOS=650;
const validProfile=p=>p==='m'||p==='f';
const validRef=ref=>typeof ref==='string'&&/^(?:(?:sewing|patchwork):(?:[1-9]|[1-4][0-9]|5[0-2])|voyage:(?:world|history):[a-z0-9-]{1,40})$/.test(ref);
const validPhotoId=id=>typeof id==='string'&&/^[A-Za-z0-9-]{1,90}$/.test(id);
const check=(p,msg)=>{if(!p)throw Error(msg)};
const key=(profile,ref,id)=>profile+':'+ref+':'+id;
let opening;
function db(){
 check(!!root.indexedDB,'La galerie photo n’est pas disponible sur cet appareil.');
 if(!opening)opening=new Promise((resolve,reject)=>{
  const req=root.indexedDB.open(DATABASE,1);
  req.onupgradeneeded=()=>req.result.createObjectStore(STORE,{keyPath:'id'});
  req.onsuccess=()=>resolve(req.result);
  req.onerror=()=>reject(req.error||Error('Ouverture de la galerie impossible.'));
 }).catch(e=>{opening=null;throw e});
 return opening;
}
function validate(row,profile){
 check(validProfile(profile),'Profil photo invalide.');
 check(row&&typeof row==='object'&&!Array.isArray(row),'Photo invalide.');
 check(validRef(row.ref)&&validPhotoId(row.photoId),'Référence photo incorrecte.');
 check(typeof row.dataUrl==='string'&&row.dataUrl.length<=root.Fil52Gallery.MAX_DATAURL&&/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(row.dataUrl),'Image non valide.');
 return {id:key(profile,row.ref,row.photoId),profile,ref:row.ref,photoId:row.photoId,dataUrl:row.dataUrl,updatedAt:typeof row.updatedAt==='string'&&Number.isFinite(Date.parse(row.updatedAt))?row.updatedAt:new Date().toISOString()};
}
function newId(){return 'j'+(root.crypto?.randomUUID?.()||Date.now().toString(36)+'-'+Math.random().toString(36).slice(2));}
async function list(profile){
 check(validProfile(profile),'Profil incorrect.');
 const database=await db();
 return new Promise((resolve,reject)=>{
  const req=database.transaction(STORE,'readonly').objectStore(STORE).getAll();
  req.onsuccess=()=>resolve((req.result||[]).filter(x=>x.profile===profile).sort((a,b)=>a.updatedAt.localeCompare(b.updatedAt)));
  req.onerror=()=>reject(req.error||Error('Lecture des photos impossible.'));
 });
}
async function listFor(profile,ref){
 check(validRef(ref),'Projet invalide.');
 return (await list(profile)).filter(row=>row.ref===ref);
}
async function add(profile,ref,file,legacyCount=0){
 check(validProfile(profile)&&validRef(ref),'Référence du journal incorrecte.');
 const all=await list(profile);
 check(all.length<MAX_PHOTOS,'La galerie du journal a atteint sa capacité maximale.');
 check(all.filter(x=>x.ref===ref).length+legacyCount<MAX_PER_ENTRY,'Cinq photos maximum pour cette réalisation.');
 const dataUrl=await root.Fil52Gallery.compress(file);
 const row=validate({ref,photoId:newId(),dataUrl,updatedAt:new Date().toISOString()},profile);
 const database=await db();
 return new Promise((resolve,reject)=>{
  const tx=database.transaction(STORE,'readwrite');tx.objectStore(STORE).put(row);
  tx.oncomplete=()=>resolve(row);
  tx.onerror=()=>reject(tx.error||Error('Impossible de sauvegarder cette photo.'));
  tx.onabort=()=>reject(tx.error||Error('La sauvegarde de la photo a été interrompue.'));
 });
}
async function remove(profile,ref,photoId){
 check(validProfile(profile)&&validRef(ref)&&validPhotoId(photoId),'Photo incorrecte.');
 const database=await db();
 return new Promise((resolve,reject)=>{
  const tx=database.transaction(STORE,'readwrite');tx.objectStore(STORE).delete(key(profile,ref,photoId));
  tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error||Error('Suppression impossible.'));
 });
}
async function replace(profile,photos){
 check(validProfile(profile)&&Array.isArray(photos)&&photos.length<=MAX_PHOTOS,'Album invalide.');
 const seen=new Set(),counts={};
 const rows=photos.map(p=>{
  const row=validate(p,profile);
  check(!seen.has(row.id),'Photo dupliquée dans la sauvegarde.');seen.add(row.id);
  counts[row.ref]=(counts[row.ref]||0)+1;
  check(counts[row.ref]<=MAX_PER_ENTRY,'Plus de cinq photos pour une réalisation.');
  return row;
 });
 const database=await db();
 return new Promise((resolve,reject)=>{
  const tx=database.transaction(STORE,'readwrite'),store=tx.objectStore(STORE),scan=store.openCursor();
  scan.onsuccess=()=>{const c=scan.result;if(c){if(c.value?.profile===profile)c.delete();c.continue();}else for(const row of rows)store.put(row)};
  tx.oncomplete=()=>resolve(rows.length);tx.onerror=()=>reject(tx.error||Error('Restauration des photos impossible.'));
  tx.onabort=()=>reject(tx.error||Error('Restauration interrompue.'));
 });
}
root.Fil52JournalPhotos={MAX_PER_ENTRY,MAX_PHOTOS,validRef,validate,list,listFor,add,remove,replace};
})(globalThis);
