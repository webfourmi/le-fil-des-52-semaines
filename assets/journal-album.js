/* Vue photographique du carnet : lecture seule, aucun changement du stockage ni des sauvegardes. */
(function(root){
'use strict';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
let renderToken=0;
const thumbnails=new Map();
let activeObserver=null;
function compressThumbnail(source){
 if(thumbnails.has(source))return Promise.resolve(thumbnails.get(source));
 return new Promise(resolve=>{
  const image=new Image();
  image.onload=()=>{
   try{
    const side=320,canvas=document.createElement('canvas');canvas.width=side;canvas.height=side;
    const context=canvas.getContext('2d');if(!context)throw Error('Canvas indisponible');
    const ratio=Math.max(side/image.naturalWidth,side/image.naturalHeight);
    const w=image.naturalWidth*ratio,h=image.naturalHeight*ratio;
    context.drawImage(image,(side-w)/2,(side-h)/2,w,h);
    const thumb=canvas.toDataURL('image/jpeg',0.76);
    thumbnails.set(source,thumb);
    if(thumbnails.size>70)thumbnails.delete(thumbnails.keys().next().value);
    resolve(thumb);
   }catch(e){resolve(source)}
  };
  image.onerror=()=>resolve(source);
  image.src=source;
 });
}
function hydrateThumbnails(grid,items){
 activeObserver?.disconnect();
 const buttons=[...grid.querySelectorAll('.journal-album-item')];
 const pending=new Map(buttons.map((b,i)=>[b,items[i]?.cover]));
 let running=0;
 const queue=[];
 function execute(){
  while(running<2&&queue.length){
   const button=queue.shift(),source=pending.get(button);
   if(!source||!button.isConnected)continue;
   pending.delete(button);running++;
   compressThumbnail(source).then(thumb=>{
    if(button.isConnected){const img=button.querySelector('img');if(img){img.src=thumb;delete img.dataset.thumbPending}}
   }).finally(()=>{running--;execute()});
  }
 }
 if(typeof IntersectionObserver==='function'){
  activeObserver=new IntersectionObserver(entries=>{
   for(const e of entries)if(e.isIntersecting){activeObserver?.unobserve(e.target);queue.push(e.target)}
   execute();
  },{rootMargin:'250px'});
  buttons.forEach(b=>activeObserver.observe(b));
 }else{queue.push(...buttons);execute()}
}

async function render(profile,state,projects,blocks,cultureArticles,kindFilter=''){
 const target=document.getElementById('journal-photo-overview'),token=++renderToken;
 if(!target)return;
 try{
  const [journal,legacy,personal]=await Promise.all([
   root.Fil52JournalPhotos.list(profile),
   root.Fil52Gallery.list(profile),
   root.Fil52PersonalPhotos.list(profile)
  ]);
  if(token!==renderToken||!target.isConnected||profile!==state.profile)return;
  const items=new Map();
  const journeys=[...cultureArticles('world'),...cultureArticles('history')];
  function titleFor(kind,value){
   if(kind==='sewing')return 'Couture '+value+' · '+(projects[Number(value)-1]||'Projet');
   if(kind==='patchwork')return 'Patchwork '+value+' · '+(blocks[Number(value)-1]||'Bloc');
   if(kind==='embroidery')return 'Broderie 01 · Mes premiers points de broderie';
   if(kind==='crochet')return 'Crochet 01 · Les étoiles givrées de l’hiver';
   if(kind==='voyage')return journeys.find(x=>x.id===value)?.title||value;
   return state.personalProjects[profile]?.find(x=>x.id===value)?.title||'Création personnelle';
  }
  function add(kind,value,photo,date){
   const id=kind+':'+value,existing=items.get(id)||{kind,value,title:titleFor(kind,value),count:0,cover:null,date:'',notes:''};
   existing.count++;
   if(!existing.cover||date>existing.date){existing.cover=photo;existing.date=date||'';}
   items.set(id,existing);
  }
  for(const photo of legacy){
   if(!Number.isInteger(photo.week)||!['project','block'].includes(photo.type))continue;
   add(photo.type==='project'?'sewing':'patchwork',String(photo.week),photo.dataUrl,photo.updatedAt);
  }
  for(const photo of journal){
   const sep=photo.ref.indexOf(':'),kind=photo.ref.slice(0,sep),value=photo.ref.slice(sep+1);
   if(!['sewing','patchwork','embroidery','crochet','voyage'].includes(kind))continue;
   add(kind,value,photo.dataUrl,photo.updatedAt);
  }
  for(const photo of personal)add('personal',photo.projectId,photo.dataUrl,photo.updatedAt);
  function ensure(kind,value){const id=kind+':'+value;if(!items.has(id))items.set(id,{kind,value,title:titleFor(kind,value),count:0,cover:null,date:'',notes:''})}
  for(const project of state.personalProjects[profile]||[])ensure('personal',project.id);
  for(const n of state.projectsDone[profile]||[])ensure('sewing',String(n));
  for(const [n,note] of Object.entries(state.notes[profile]||{}))if(note.trim())ensure('sewing',n);
  for(const n of state.blocks[profile]||[])ensure('patchwork',String(n));
  for(const ref of state.needleworkDone?.[profile]||[]){const i=ref.indexOf(':');ensure(ref.slice(0,i),ref.slice(i+1))}
  for(const [ref,note] of Object.entries(state.journalNotes[profile]||{}))if(note.trim()){const i=ref.indexOf(':');ensure(ref.slice(0,i),ref.slice(i+1))}
  for(const x of items.values()){
   x.notes=x.kind==='personal'?(state.personalProjects[profile]?.find(v=>v.id===x.value)?.notes||''):x.kind==='sewing'?(state.notes[profile]?.[x.value]||''):(state.journalNotes[profile]?.[x.kind+':'+x.value]||'');
  }
  const sorted=[...items.values()].filter(x=>!kindFilter||x.kind===kindFilter).sort((a,b)=>b.date.localeCompare(a.date));
  const sizeKey='fil52.journal.tileSize.'+profile;let size='medium';try{const saved=localStorage.getItem(sizeKey);if(['small','medium','large'].includes(saved))size=saved}catch(_){}
  target.innerHTML='<h2>Galerie de mes créations</h2><p class="small">'+sorted.length+' création(s) · Photos et notes privées sur cet appareil.</p><div class="album-toolbar"><button type="button" class="album-search-button" data-album-add aria-label="Ajouter une création"><img src="./assets/nav-supply-add.svg" alt=""></button><button type="button" class="album-search-button" id="album-search-toggle" aria-label="Rechercher une création" aria-expanded="false" aria-controls="album-search-panel"><img src="./assets/nav-travel-search.svg" alt=""></button><label class="album-size-label" for="album-size">Taille des vignettes <select id="album-size">'+[['small','Petite'],['medium','Moyenne'],['large','Grande']].map(([value,label])=>'<option value="'+value+'" '+(value===size?'selected':'')+'>'+label+'</option>').join('')+'</select></label><button type="button" class="ghost" data-album-all>Toutes les créations</button></div><div id="album-search-panel" hidden><label for="album-filter">Rechercher dans mes créations</label><input id="album-filter" type="search" placeholder="Titre, tissu, projet…" autocomplete="off" style="width:100%;padding:12px;margin:8px 0;border:1px solid var(--line);border-radius:12px;font:inherit"></div><div class="supply-grid" data-size="'+size+'" id="album-grid"></div><p class="small" id="album-results" role="status"></p>';
  const grid=target.querySelector('#album-grid'),counter=target.querySelector('#album-results');
  function display(q){
   const terms=norm(q).trim().split(/\s+/).filter(Boolean),found=sorted.filter(x=>terms.every(t=>norm(x.title+' '+x.notes+' '+x.kind).includes(t)));grid.replaceChildren();
   if(!found.length)grid.innerHTML='<p class="album-empty">Aucune création à afficher. Ajoute des notes, une photo ou une réalisation terminée dans « Mon carnet ».</p>';
   const icons={sewing:'nav-sewing-simple.svg',patchwork:'nav-patch-simple.svg',embroidery:'nav-embroidery.svg',crochet:'nav-crochet.svg',voyage:'nav-world.svg',personal:'nav-personal.svg'};
   for(const x of found){
    const button=document.createElement('button');button.type='button';button.className='supply-tile journal-album-item';button.dataset.albumOpen=x.value;button.dataset.albumKind=x.kind;button.setAttribute('aria-label','Ouvrir '+x.title);
    const img=document.createElement('img');img.loading='lazy';img.alt='';
    if(x.cover){img.className='supply-tile-photo';img.dataset.thumbPending='1';button.append(img)}else{const placeholder=document.createElement('span');placeholder.className='supply-tile-placeholder';img.src='./assets/'+(icons[x.kind]||icons.personal);placeholder.append(img);button.append(placeholder)}
    const meta=document.createElement('span');meta.className='album-meta';const title=document.createElement('b');title.textContent=x.title;const count=document.createElement('small');count.textContent=x.count+' photo'+(x.count>1?'s':'');meta.append(title,count);button.append(meta);grid.append(button);
   }
   counter.textContent=found.length+' création(s) affichée(s).';hydrateThumbnails(grid,found);
  }
  const field=target.querySelector('#album-filter');field.addEventListener('input',()=>display(field.value));
  target.querySelector('#album-search-toggle').addEventListener('click',e=>{const panel=target.querySelector('#album-search-panel');panel.hidden=!panel.hidden;e.currentTarget.setAttribute('aria-expanded',String(!panel.hidden));if(panel.hidden)display('');else{display(field.value);field.focus()}});
  target.querySelector('#album-size').addEventListener('change',e=>{grid.dataset.size=e.target.value;try{localStorage.setItem(sizeKey,e.target.value)}catch(_){}});
  display('');
 }catch(e){if(token===renderToken&&target.isConnected)target.textContent='Impossible de lire les albums : '+e.message}
}
root.Fil52JournalAlbum={render};
})(globalThis);
