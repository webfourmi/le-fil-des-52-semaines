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
 const dimension=(value,label)=>{if(value==null||value==='')return null;const n=Number(value);if(!Number.isFinite(n)||n<0||n>100000)fail(label+' incorrecte.');return Math.round(n*100)/100};
 return {id:obj.id,name,category,unit,width:dimension(obj.width,'Largeur'),length:dimension(obj.length,'Longueur'),amount:Math.round(amount*100)/100,color:clean(obj.color,60),location:clean(obj.location,90),notes:clean(obj.notes,1000),photo:typeof obj.photo==='string'&&/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(obj.photo)&&obj.photo.length<=160000?obj.photo:'',updatedAt:typeof obj.updatedAt==='string'&&Number.isFinite(Date.parse(obj.updatedAt))?obj.updatedAt:new Date().toISOString()};
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
function add(profile,values){const items=list(profile);if(items.length>=MAX)fail('Limite de 250 fournitures atteinte.');const id='s'+(root.crypto?.randomUUID?.()||Date.now().toString(36)+Math.random().toString(36).slice(2));items.unshift(validate({...values,id,updatedAt:new Date().toISOString()}));save(profile,items);return id}
function update(profile,id,values){const items=list(profile),idx=items.findIndex(x=>x.id===id);if(idx<0)fail('Fourniture introuvable.');items[idx]=validate({...items[idx],...values,id,updatedAt:new Date().toISOString()});save(profile,items)}
function photoData(file){if(!file||file.size>8000000||!['image/jpeg','image/png','image/webp'].includes(file.type))return Promise.reject(Error('Photo JPG, PNG ou WebP de 8 Mo maximum.'));return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onerror=()=>reject(Error('Lecture impossible.'));reader.onload=()=>{const img=new Image();img.onerror=()=>reject(Error('Image illisible.'));img.onload=()=>{try{const side=380,ratio=Math.min(1,side/Math.max(img.naturalWidth,img.naturalHeight)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.naturalWidth*ratio));canvas.height=Math.max(1,Math.round(img.naturalHeight*ratio));const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);let data='';for(const quality of [.78,.65,.48]){data=canvas.toDataURL('image/jpeg',quality);if(data.length<=160000)break}if(data.length>160000)throw Error('Photo trop grande après réduction.');resolve(data)}catch(e){reject(e)}};img.src=String(reader.result)};reader.readAsDataURL(file)})}
function photoFile(profile,id,file){return photoData(file).then(photo=>update(profile,id,{photo}))}
function remove(profile,id){save(profile,list(profile).filter(x=>x.id!==id))}
function exportJSON(profile){return JSON.stringify({format:'fil52.mercerie',schema:VERSION,profile,exportedAt:new Date().toISOString(),items:list(profile)},null,2)}
function importJSON(profile,json){if(json.length>1000000)fail('Fichier trop volumineux.');const data=JSON.parse(json);if(data?.format!=='fil52.mercerie'||data.schema!==VERSION||data.profile!==profile)fail('Ce fichier ne correspond pas à cet inventaire personnel.');const items=parse(JSON.stringify(data.items));return save(profile,items)}
const escape=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const view={profile:'',mode:'list',id:'',searchOpen:false,query:''};
function show(profile,mode='list',id=''){
 if(view.profile!==profile){view.searchOpen=false;view.query=''}
 Object.assign(view,{profile,mode,id});
}
function toggleSearch(profile){
 if(view.profile!==profile)show(profile);
 view.mode='list';view.searchOpen=!view.searchOpen;
}
function filter(query=view.query){
 view.query=query;
 const normalize=value=>String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('fr');
 const terms=normalize(view.searchOpen?query:'').split(/\s+/).filter(Boolean);let count=0;
 for(const card of document.querySelectorAll('[data-supply-card]')){card.hidden=!terms.every(term=>normalize(card.dataset.supplySearch).includes(term));if(!card.hidden)count++}
 const countNode=document.getElementById('supply-count');if(countNode)countNode.textContent=terms.length?count+' fourniture(s) trouvée(s).':'';
}
function toolbar(){return `<nav class="supply-tools" aria-label="Outils de ma mercerie"><button type="button" class="culture-tab ${view.mode==='add'?'selected':''}" data-supply-view="add" aria-label="Ajouter une fourniture" title="Ajouter une fourniture"><img src="./assets/nav-supply-add.svg" alt="" width="64" height="64"></button><button type="button" class="culture-tab ${view.searchOpen?'selected':''}" data-supply-search-toggle aria-label="Rechercher une fourniture" title="Rechercher une fourniture" aria-expanded="${view.searchOpen}" aria-controls="supply-search-panel"><img src="./assets/nav-travel-search.svg" alt="" width="64" height="64"></button></nav>`}
function form(item){
 const editing=!!item,x=item||{name:'',category:'',width:null,length:null,color:'',location:'',notes:'',photo:''};
 return `<section class="card section supply-editor"><button type="button" class="ghost" data-supply-view="${editing?'detail':'list'}" ${editing?'data-supply-id="'+escape(x.id)+'"':''}>← ${editing?'Retour à la fiche':'Mes fournitures'}</button><h2 id="supply-form-title">${editing?'Modifier la fourniture':'Ajouter une fourniture'}</h2><form id="supply-new" class="supply-form" aria-labelledby="supply-form-title" ${editing?'data-supply-id="'+escape(x.id)+'"':''}>
 <label>Nom <input name="name" maxlength="100" required value="${escape(x.name)}" placeholder="Ex. Coton fleuri bleu"></label>
 <label>Catégorie <select name="category" required><option value="">Choisir une catégorie</option>${categories.map(c=>`<option ${c===x.category?'selected':''}>${escape(c)}</option>`).join('')}</select></label>
 <label>Largeur en cm (facultatif) <input name="width" type="number" min="0" max="100000" step="0.01" value="${x.width??''}"></label>
 <label>Longueur en cm (facultatif) <input name="length" type="number" min="0" max="100000" step="0.01" value="${x.length??''}"></label>
 <label>Couleur (facultatif) <input name="color" maxlength="60" value="${escape(x.color)}"></label>
 <label>Rangement (facultatif) <input name="location" maxlength="90" value="${escape(x.location)}" placeholder="Boîte, tiroir…"></label>
 ${editing?`<details class="supply-wide"><summary>Quantité et unité du stock</summary><div class="supply-stock-fields"><label>Quantité <input name="amount" type="number" min="0" max="100000" step="0.01" value="${x.amount}"></label><label>Unité <select name="unit">${units.map(u=>`<option ${u===x.unit?'selected':''}>${escape(u)}</option>`).join('')}</select></label></div></details>`:''}
 <label class="supply-wide">Photo (facultatif) <input name="initialPhoto" type="file" accept="image/jpeg,image/png,image/webp"></label>
 ${x.photo?`<div class="supply-wide"><img class="supply-photo" src="${x.photo}" alt="Photo actuelle de ${escape(x.name)}"><label class="supply-remove-photo"><input type="checkbox" name="removePhoto"> Supprimer la photo actuelle</label></div>`:''}
 <label class="supply-wide">Notes (facultatif) <textarea name="notes" maxlength="1000" rows="3" placeholder="Composition, projet prévu…">${escape(x.notes)}</textarea></label>
 <div class="actions supply-wide"><button class="primary" type="submit">${editing?'Enregistrer les modifications':'Ajouter à ma mercerie'}</button><button class="secondary" type="button" data-supply-view="${editing?'detail':'list'}" ${editing?'data-supply-id="'+escape(x.id)+'"':''}>Annuler</button></div><p class="supply-wide small">Les dimensions sont en centimètres. Seuls le nom et la catégorie sont obligatoires.</p></form></section>`;
}
function detail(item){
 return `<section class="card section supply-detail"><button type="button" class="ghost" data-supply-view="list">← Mes fournitures</button><h2>${escape(item.name)}</h2>${item.photo?`<img class="supply-detail-photo" src="${item.photo}" alt="${escape(item.name)}">`:`<div class="supply-detail-placeholder" aria-hidden="true"><img src="./assets/nav-mercerie.svg" alt="" width="80" height="80"></div>`}<dl class="supply-details"><dt>Catégorie</dt><dd>${escape(item.category)}</dd>${item.width!==null?'<dt>Largeur</dt><dd>'+item.width+' cm</dd>':''}${item.length!==null?'<dt>Longueur</dt><dd>'+item.length+' cm</dd>':''}${item.amount?'<dt>Stock</dt><dd>'+item.amount+' '+escape(item.unit)+'</dd>':''}${item.color?'<dt>Couleur</dt><dd>'+escape(item.color)+'</dd>':''}${item.location?'<dt>Rangement</dt><dd>'+escape(item.location)+'</dd>':''}${item.notes?'<dt>Notes</dt><dd class="supply-notes">'+escape(item.notes)+'</dd>':''}</dl><div class="actions"><button type="button" class="primary" data-supply-edit="${escape(item.id)}">Modifier la fiche</button><button type="button" class="secondary" data-supply-delete="${escape(item.id)}">Supprimer</button></div></section>`;
}
function render(profile){
 if(view.profile!==profile)show(profile);
 let items;try{items=list(profile)}catch(e){return '<h1>Ma mercerie</h1><p role="alert">Inventaire inaccessible : '+escape(e.message)+'</p>'}
 const current=items.find(x=>x.id===view.id);
 const head='<span class="eyebrow">Mon atelier personnel</span><h1>Ma mercerie</h1>'+toolbar();
 if(view.mode==='add')return head+form();
 if(view.mode==='edit'&&current)return head+form(current);
 if(view.mode==='detail'&&current)return head+detail(current);
 view.mode='list';
 return head+`<section class="card section"><h2>Mes fournitures <small>(${items.length})</small></h2><div id="supply-search-panel" ${view.searchOpen?'':'hidden'}><label for="supply-search">Rechercher une fourniture</label><input id="supply-search" type="search" value="${escape(view.query)}" placeholder="Nom, catégorie, couleur, rangement…" autocomplete="off"></div><div id="supply-list" class="supply-grid">
 ${items.map(x=>`<button type="button" class="supply-tile" data-supply-view="detail" data-supply-id="${escape(x.id)}" data-supply-card="${escape(x.id)}" data-supply-search="${escape([x.name,x.category,x.color,x.notes,x.location].join(' '))}" aria-label="Voir la fiche de ${escape(x.name)}">${x.photo?`<img class="supply-tile-photo" src="${x.photo}" alt="" loading="lazy">`:'<span class="supply-tile-placeholder"><img src="./assets/nav-mercerie.svg" alt="" width="72" height="72"></span>'}<strong>${escape(x.name)}</strong></button>`).join('')||'<p>Ta mercerie est encore vide. Touche l’icône d’ajout pour enregistrer une fourniture.</p>'}</div><p id="supply-count" class="small" aria-live="polite"></p></section>
 <section class="card section"><h2>Sauvegarder ma mercerie</h2><p class="small">Tes fournitures et leurs photos sont comprises dans la sauvegarde de mercerie et dans les nouvelles sauvegardes générales du carnet.</p><div class="actions"><button type="button" class="secondary" id="supply-export">Télécharger ma mercerie</button><label class="secondary supply-import-label">Restaurer ma mercerie <input id="supply-import" type="file" accept=".json,application/json"></label></div></section>`;
}
async function submitForm(profile,form){
 const data=new FormData(form),id=form.dataset.supplyId,existing=id?list(profile).find(x=>x.id===id):null;
 if(id&&!existing)fail('Fourniture introuvable.');
 if(!categories.includes(data.get('category')))fail('Choisis une catégorie.');
 const values={name:data.get('name'),category:data.get('category'),width:data.get('width'),length:data.get('length'),color:data.get('color'),location:data.get('location'),notes:data.get('notes'),unit:existing?data.get('unit'):'cm',amount:existing?data.get('amount'):Number(data.get('length')||0)};
 // Quand le stock en cm suit la longueur, garder les deux mesures cohérentes.
 if(existing&&values.unit==='cm'&&existing.unit==='cm'&&Number(values.amount)===existing.amount&&(existing.amount===existing.length||existing.amount===0))values.amount=Number(values.length||0);
 const photo=data.get('initialPhoto');
 if(photo instanceof File&&photo.size)values.photo=await photoData(photo);
 else if(data.has('removePhoto'))values.photo='';
 let savedId=id;
 if(existing)update(profile,id,values);else savedId=add(profile,values);
 if(view.profile===profile)show(profile,'detail',savedId);
 return savedId;
}
function download(profile){
 const blob=new Blob([exportJSON(profile)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download='mercerie-'+(profile==='m'?'viera':'mathilde')+'.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
}
root.Fil52Mercerie={render,show,toggleSearch,filter,submitForm,list,add,update,remove,photoFile,download,importJSON,exportJSON,validProfile,validateItems:items=>parse(JSON.stringify(items)),replace:save};
})(globalThis);
