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

async function render(profile,state,projects,blocks,cultureArticles){
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
   if(!['sewing','patchwork','voyage'].includes(kind))continue;
   add(kind,value,photo.dataUrl,photo.updatedAt);
  }
  for(const photo of personal)add('personal',photo.projectId,photo.dataUrl,photo.updatedAt);
  for(const x of items.values()){
   x.notes=x.kind==='personal'?(state.personalProjects[profile]?.find(v=>v.id===x.value)?.notes||''):x.kind==='sewing'?(state.notes[profile]?.[x.value]||''):(state.journalNotes[profile]?.[x.kind+':'+x.value]||'');
  }
  const sorted=[...items.values()].sort((a,b)=>b.date.localeCompare(a.date));
  target.innerHTML='<h2>Mes réalisations en images</h2><p class="small">'+sorted.length+' création(s) photographiée(s) · '+(journal.length+legacy.length+personal.length)+' photo(s) · Les images restent privées sur cet appareil.</p><label for="album-filter"><b>Rechercher dans mes albums</b></label><input id="album-filter" type="search" placeholder="Titre, tissu, projet, voyage…" autocomplete="off" style="width:100%;padding:12px;margin:8px 0;border:1px solid var(--line);border-radius:12px;font:inherit"><div class="journal-album-grid" id="album-grid"></div><p class="small" id="album-results" role="status"></p>';
  const grid=target.querySelector('#album-grid'),counter=target.querySelector('#album-results');
  function display(q){
   const terms=norm(q).trim().split(/\s+/).filter(Boolean);
   const found=sorted.filter(x=>terms.every(t=>norm(x.title+' '+x.notes+' '+x.kind).includes(t)));
   grid.replaceChildren();
   if(!found.length){grid.innerHTML='<p class="album-empty">Aucune photo ne correspond à cette recherche. Ouvre « Mon carnet » pour ajouter des photos à une réalisation.</p>'}
   for(const x of found){
    const b=document.createElement('button');b.type='button';b.className='journal-album-item';b.dataset.albumOpen=x.value;b.dataset.albumKind=x.kind;b.setAttribute('aria-label','Ouvrir '+x.title);
    const image=document.createElement('img');image.loading='lazy';image.decoding='async';image.width=320;image.height=320;image.alt='Photographie de '+x.title;image.dataset.thumbPending='1';
    const meta=document.createElement('span');meta.className='album-meta';
    const title=document.createElement('b');title.textContent=x.title;
    const subtitle=document.createElement('small');subtitle.textContent=x.count+' photo'+(x.count>1?'s':'')+' · '+(x.kind==='personal'?'Création personnelle':x.kind==='voyage'?'Voyage':x.kind==='sewing'?'Couture':'Patchwork');
    meta.append(title,subtitle);b.append(image,meta);grid.append(b);
   }
   counter.textContent=found.length+' album(s) affiché(s).';
   hydrateThumbnails(grid,found);
  }
  const field=target.querySelector('#album-filter');field.addEventListener('input',()=>display(field.value));
  display('');
 }catch(e){if(token===renderToken&&target.isConnected)target.textContent='Impossible de lire les albums : '+e.message}
}
root.Fil52JournalAlbum={render};
})(globalThis);
