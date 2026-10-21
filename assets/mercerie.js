/* Mercerie locale V1.3. Deux inventaires distincts, sans serveur. */
(function(root){
'use strict';
const KEY=p=>'fil52.mercerie.v1.'+p,VERSION=1,MAX=250;
const categories=['Tissu','Fil','Ruban','Bouton','Entoilage','Mercerie','Autre'];
const units=['cm','m','pièce','bobine','coupon'];
const validProfile=p=>p==='m'||p==='f';
function fail(message){throw Error(message)}
function clean(t,max){return String(t??'').trim().slice(0,max)}
function validate(obj){
 if(!obj||typeof obj!=='object'||Array.isArray(obj))fail('Fourniture incorrecte.');
 if(!/^[A-Za-z0-9_-]{3,90}$/.test(obj.id))fail('Identifiant incorrect.');
 const name=clean(obj.name,100);if(!name)fail('Indique le nom de la fourniture.');
 const category=categories.includes(obj.category)?obj.category:'Autre';
 const unit=units.includes(obj.unit)?obj.unit:'pièce';
 const amount=Number(obj.amount);if(!Number.isFinite(amount)||amount<0||amount>100000)fail('Quantité incorrecte.');
 return {id:obj.id,name,category,unit,amount:Math.round(amount*100)/100,color:clean(obj.color,60),location:clean(obj.location,90),notes:clean(obj.notes,1000),photo:typeof obj.photo==='string'&&/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(obj.photo)&&obj.photo.length<=160000?obj.photo:'',updatedAt:typeof obj.updatedAt==='string'&&Number.isFinite(Date.parse(obj.updatedAt))?obj.updatedAt:new Date().toISOString()};
}
function parse(raw){
 if(!raw)return [];
 const data=JSON.parse(raw);
 if(!Array.isArray(data)||data.length>MAX)fail('Inventaire incorrect.');
 const items=data.map(validate);
 if(new Set(items.map(x=>x.id)).size!==items.length)fail('Fournitures dupliquées.');
 return items;
}
function list(profile){if(!validProfile(profile))fail('Profil incorrect.');return parse(localStorage.getItem(KEY(profile)))}
function save(profile,items){if(!validProfile(profile)||items.length>MAX)fail('Inventaire trop important.');const checked=parse(JSON.stringify(items));localStorage.setItem(KEY(profile),JSON.stringify(checked));return checked}
function add(profile,values){const items=list(profile);if(items.length>=MAX)fail('Limite de 250 fournitures atteinte.');const id='s'+(root.crypto?.randomUUID?.()||Date.now().toString(36)+Math.random().toString(36).slice(2));items.unshift(validate({...values,id,updatedAt:new Date().toISOString()}));save(profile,items)}
function update(profile,id,values){const items=list(profile),idx=items.findIndex(x=>x.id===id);if(idx<0)fail('Fourniture introuvable.');items[idx]=validate({...items[idx],...values,id,updatedAt:new Date().toISOString()});save(profile,items)}
function photoFile(profile,id,file){if(!file||file.size>8000000||!['image/jpeg','image/png','image/webp'].includes(file.type))return Promise.reject(Error('Photo JPG, PNG ou WebP de 8 Mo maximum.'));return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onerror=()=>reject(Error('Lecture impossible.'));reader.onload=()=>{const img=new Image();img.onerror=()=>reject(Error('Image illisible.'));img.onload=()=>{try{const side=380,ratio=Math.min(1,side/Math.max(img.naturalWidth,img.naturalHeight)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.naturalWidth*ratio));canvas.height=Math.max(1,Math.round(img.naturalHeight*ratio));const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);let data='';for(const quality of [.78,.65,.48]){data=canvas.toDataURL('image/jpeg',quality);if(data.length<=160000)break}if(data.length>160000)throw Error('Photo trop grande après réduction.');update(profile,id,{photo:data});resolve()}catch(e){reject(e)}};img.src=String(reader.result)};reader.readAsDataURL(file)})}
function remove(profile,id){save(profile,list(profile).filter(x=>x.id!==id))}
function exportJSON(profile){return JSON.stringify({format:'fil52.mercerie',schema:VERSION,profile,exportedAt:new Date().toISOString(),items:list(profile)},null,2)}
function importJSON(profile,json){if(json.length>1000000)fail('Fichier trop volumineux.');const data=JSON.parse(json);if(data?.format!=='fil52.mercerie'||data.schema!==VERSION||data.profile!==profile)fail('Ce fichier ne correspond pas à cet inventaire personnel.');const items=parse(JSON.stringify(data.items));return save(profile,items)}
const escape=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function render(profile){
 let items;try{items=list(profile)}catch(e){return '<h1>Ma mercerie</h1><p role="alert">Inventaire inaccessible : '+escape(e.message)+'</p>'}
 return `<span class="eyebrow">Mon atelier personnel</span><h1>Ma mercerie</h1>
 <p class="lead">Un inventaire de tes tissus, fils et petites fournitures. Il reste privé sur cet appareil et distinct de celui de l’autre couturière.</p>
 <div class="card section"><h2>Ajouter une fourniture</h2><form id="supply-new" class="supply-form">
 <label>Nom <input name="name" maxlength="100" required placeholder="Ex. Coton fleuri bleu"></label>
 <label>Catégorie <select name="category">${categories.map(x=>'<option>'+x+'</option>').join('')}</select></label>
 <label>Quantité <input name="amount" type="number" min="0" max="100000" step="0.01" required value="1"></label>
 <label>Unité <select name="unit">${units.map(x=>'<option>'+x+'</option>').join('')}</select></label>
 <label>Couleur <input name="color" maxlength="60" placeholder="Facultatif"></label>
 <label>Rangement <input name="location" maxlength="90" placeholder="Boîte, tiroir…"></label>
 <label class="supply-wide">Notes <textarea name="notes" maxlength="1000" rows="2" placeholder="Composition, dimensions du coupon, projet prévu…"></textarea></label>
 <button class="primary" type="submit">＋ Ajouter à ma mercerie</button></form></div>
 <section class="card section"><h2>Mes fournitures <small>(${items.length})</small></h2><label for="supply-search">Rechercher une fourniture</label><input id="supply-search" type="search" placeholder="Nom, matière, couleur…" autocomplete="off"><div id="supply-list" class="supply-list">
 ${items.map(x=>`<article class="supply-item" data-supply-card="${escape(x.id)}" data-supply-search="${escape([x.name,x.category,x.color,x.notes,x.location].join(' '))}"><div>${x.photo?`<img class="supply-photo" src="${x.photo}" alt="Photo du tissu ou de la fourniture ${escape(x.name)}" loading="lazy">`:''}<b>${escape(x.name)}</b><small>${escape(x.category)} · ${escape(x.amount)} ${escape(x.unit)}${x.color?' · '+escape(x.color):''}${x.location?' · '+escape(x.location):''}</small>${x.notes?'<p>'+escape(x.notes)+'</p>':''}</div><div class="actions"><label class="secondary">📷 Photo <input type="file" accept="image/jpeg,image/png,image/webp" data-supply-photo="${escape(x.id)}" style="max-width:125px"></label><button type="button" class="secondary" data-supply-edit="${escape(x.id)}">Modifier</button><button type="button" class="secondary" data-supply-delete="${escape(x.id)}">Supprimer</button></div></article>`).join('')||'<p>Ta mercerie est encore vide. Ajoute ton premier coupon !</p>'}</div><p id="supply-count" class="small" aria-live="polite"></p></section>
 <section class="card section"><h2>Sauvegarder ma mercerie</h2><p class="small">Pour cette première version, l’inventaire possède sa propre sauvegarde JSON. Il n’est pas encore inclus dans la sauvegarde générale du carnet. Les petites photos de fournitures sont comprises dans cette sauvegarde de mercerie.</p><div class="actions"><button type="button" class="secondary" id="supply-export">Télécharger ma mercerie</button><label class="secondary">Restaurer ma mercerie <input id="supply-import" type="file" accept=".json,application/json"></label></div></section>`;
}
function download(profile){
 const blob=new Blob([exportJSON(profile)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download='mercerie-'+(profile==='m'?'viera':'mathilde')+'.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
}
root.Fil52Mercerie={render,list,add,update,remove,photoFile,download,importJSON,exportJSON,validProfile,validateItems:items=>parse(JSON.stringify(items)),replace:save};
})(globalThis);
