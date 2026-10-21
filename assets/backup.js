/* Sauvegardes personnelles de De fil en aiguille. Aucune donnée transférée. */
(function(root){
  'use strict';
  const FORMAT='le-fil-des-52-semaines.personnel',SCHEMA=6,MAX_FILE_SIZE=320*1024*1024;
  const arrKinds=['mat','steps','blocks','ready','projectsDone'];
  const objectKinds=['notes','ratings'];
  const validProfile=p=>p==='m'||p==='f';
  const plain=o=>o!==null&&typeof o==='object'&&!Array.isArray(o);
  function check(condition,message){if(!condition)throw Error(message)}
  function numbers(value,kind){
    check(Array.isArray(value)&&value.length<=4000,'Liste '+kind+' invalide.');
    const low=kind==='steps'||kind==='mat'?0:1;
    const high=kind==='steps'||kind==='mat'?100000:52;
    check(value.every(v=>Number.isInteger(v)&&v>=low&&v<=high),'Numéro incorrect dans '+kind+'.');
    return [...new Set(value)];
  }
  function notes(value){
    check(plain(value)&&Object.keys(value).length<=52,'Notes invalides.');
    const result={};
    for(const [k,v] of Object.entries(value)){
      check(/^(?:[1-9]|[1-4][0-9]|5[0-2])$/.test(k)&&typeof v==='string'&&v.length<=12000,'Note incorrecte pour le numéro '+k+'.');
      result[k]=v;
    }
    return result;
  }
  function ratings(value){
    check(plain(value)&&Object.keys(value).length<=52,'Évaluations invalides.');
    const result={};
    for(const [k,v] of Object.entries(value)){
      check(/^(?:[1-9]|[1-4][0-9]|5[0-2])$/.test(k)&&Number.isInteger(v)&&v>=1&&v<=5,'Évaluation incorrecte pour le numéro '+k+'.');
      result[k]=v;
    }
    return result;
  }
  function personalProjects(value){
    check(Array.isArray(value)&&value.length<=40,'Liste de projets personnels invalide.');
    const ids=new Set();
    return value.map(project=>{
      check(plain(project)&&root.Fil52PersonalPhotos.validId(project.id)&&!ids.has(project.id),'Projet personnel invalide ou dupliqué.');
      ids.add(project.id);
      check(typeof project.title==='string'&&project.title.trim().length>=1&&project.title.length<=100,'Nom de projet personnel incorrect.');
      check(typeof project.notes==='string'&&project.notes.length<=5000,'Notes personnelles trop longues.');
      check(typeof project.createdAt==='string'&&Number.isFinite(Date.parse(project.createdAt)),'Date de projet personnel invalide.');
      return {id:project.id,title:project.title,notes:project.notes,createdAt:project.createdAt};
    });
  }
  function cultureIds(value,kind){
    check(Array.isArray(value)&&value.length<=100,'Liste de lecture '+kind+' invalide.');
    check(value.every(id=>typeof id==='string'&&/^(world|history):[a-z0-9-]{1,40}$/.test(id)),'Identifiant de lecture invalide.');
    return [...new Set(value)];
  }
  function journalExtras(map,kind){
    check(plain(map)&&Object.keys(map).length<=200,'Données du journal '+kind+' invalides.');
    const result={};for(const [ref,value] of Object.entries(map)){
      check(root.Fil52JournalPhotos.validRef(ref)&& (kind==='notes'?(typeof value==='string'&&value.length<=12000):(Number.isInteger(value)&&value>=1&&value<=5)),'Entrée du journal invalide.');result[ref]=value;
    }return result;
  }
  function validateData(data,schema=SCHEMA){
    check(plain(data),'Données de couture manquantes.');
    const output={};
    for(const kind of arrKinds)output[kind]=numbers(data[kind],kind);
    output.notes=notes(data.notes);
    output.ratings=ratings(data.ratings);
    if(schema>=4)output.personalProjects=personalProjects(data.personalProjects);
    if(schema>=5){output.cultureFavorites=cultureIds(data.cultureFavorites,'favoris');output.cultureRead=cultureIds(data.cultureRead,'terminés');}
    if(schema>=6){output.journalNotes=journalExtras(data.journalNotes,'notes');output.journalRatings=journalExtras(data.journalRatings,'ratings');}
    return output;
  }
  function exportData(state,profile,photos=[],personalPhotos=[],journalPhotos=[]){
    check(validProfile(profile),'Identité personnelle non choisie.');
    const data={};
    for(const kind of [...arrKinds,...objectKinds])data[kind]=state[kind]?.[profile];
    data.personalProjects=state.personalProjects?.[profile]||[];
    data.cultureFavorites=state.cultureFavorites?.[profile]||[];
    data.cultureRead=state.cultureRead?.[profile]||[];
    data.journalNotes=state.journalNotes?.[profile]||{};
    data.journalRatings=state.journalRatings?.[profile]||{};
    check(Array.isArray(photos)&&photos.length<=104,'Album invalide.');
    const validated=validateData(data);
    check(Array.isArray(personalPhotos)&&personalPhotos.length<=root.Fil52PersonalPhotos.MAX_PHOTOS,'Galerie des projets personnels invalide.');
    const ids=validated.personalProjects.map(x=>x.id);
    const validatedPersonal=personalPhotos.map(p=>root.Fil52PersonalPhotos.validate(p,profile));
    check(validatedPersonal.every(p=>ids.includes(p.projectId)),'Photographie sans projet personnel.');
    check(Array.isArray(journalPhotos)&&journalPhotos.length<=root.Fil52JournalPhotos.MAX_PHOTOS,'Album du journal invalide.');
    const validatedJournal=journalPhotos.map(x=>root.Fil52JournalPhotos.validate(x,profile));
    const byRef={};for(const x of validatedJournal){byRef[x.ref]=(byRef[x.ref]||0)+1;check(byRef[x.ref]<=5,'Plus de cinq photos par réalisation.');}
    return {format:FORMAT,schema:SCHEMA,profile,exportedAt:new Date().toISOString(),data:validated,photos:photos.map(x=>({week:x.week,type:x.type,dataUrl:x.dataUrl,updatedAt:x.updatedAt})),personalPhotos:validatedPersonal.map(({projectId,photoId,dataUrl,updatedAt})=>({projectId,photoId,dataUrl,updatedAt})),journalPhotos:validatedJournal.map(({ref,photoId,dataUrl,updatedAt})=>({ref,photoId,dataUrl,updatedAt}))};
  }
  function parseBackup(text){
    check(typeof text==='string'&&text.length<=MAX_FILE_SIZE&&text.length>0,'Fichier vide ou trop grand.');
    let file;try{file=JSON.parse(text)}catch(e){throw Error('Ce fichier ne contient pas un JSON valide.')}
    check(plain(file)&&file.format===FORMAT&&(file.schema===SCHEMA||file.schema===5||file.schema===4||file.schema===3||file.schema===2),'Format de sauvegarde incompatible.');
    check(validProfile(file.profile),'Identité de sauvegarde inconnue.');
    check(typeof file.exportedAt==='string'&&Number.isFinite(Date.parse(file.exportedAt)),'Date de sauvegarde invalide.');
    const photos=file.schema===2?[]:file.photos;
    check(Array.isArray(photos)&&photos.length<=104,'Album manquant ou invalide.');
    const validPhotos=photos.map(x=>root.Fil52Gallery.validatePhoto(x,file.profile));
    const data=validateData(file.data,file.schema);
    const personal=file.schema<4?[]:file.personalPhotos;
    check(Array.isArray(personal)&&personal.length<=root.Fil52PersonalPhotos.MAX_PHOTOS,'Album des projets personnels invalide.');
    const photoKeys=new Set(),projectIds=new Set((data.personalProjects||[]).map(x=>x.id)),perProject={};
    const validatedPersonal=personal.map(row=>{
      const item=root.Fil52PersonalPhotos.validate(row,file.profile);
      check(projectIds.has(item.projectId),'Photo appartenant à un projet inconnu.');
      check(!photoKeys.has(item.id),'Photographie personnelle dupliquée.');
      photoKeys.add(item.id);
      perProject[item.projectId]=(perProject[item.projectId]||0)+1;
      check(perProject[item.projectId]<=root.Fil52PersonalPhotos.MAX_PER_PROJECT,'Trop de photos dans un projet personnel.');
      return item;
    });
    const journalFile=file.schema>=6?file.journalPhotos:[];
    check(Array.isArray(journalFile)&&journalFile.length<=root.Fil52JournalPhotos.MAX_PHOTOS,'Photos du journal invalides.');
    const journalKeys=new Set(),counts={};
    const journalPhotos=journalFile.map(item=>{
      const row=root.Fil52JournalPhotos.validate(item,file.profile);
      check(!journalKeys.has(row.id),'Photo du journal dupliquée.');journalKeys.add(row.id);
      counts[row.ref]=(counts[row.ref]||0)+1;
      check(counts[row.ref]<=5,'Plus de cinq photos pour une réalisation.');return row;
    });
    return {profile:file.profile,exportedAt:file.exportedAt,data,photos:validPhotos,
      personalPhotos:validatedPersonal,journalPhotos,legacy:file.schema===2,preservePersonal:file.schema<4,preserveJournal:file.schema<6,schema:file.schema};
  }
  function applyBackup(state,backup,profile){
    check(validProfile(profile)&&backup.profile===profile,'Cette sauvegarde appartient à un autre espace personnel.');
    const data=validateData(backup.data,backup.schema||SCHEMA);
    const next={...state};
    for(const kind of [...arrKinds,...objectKinds])next[kind]={...state[kind],[profile]:data[kind]};
    if(!backup.preservePersonal)next.personalProjects={...(state.personalProjects||{m:[],f:[]}),[profile]:data.personalProjects};
    if((backup.schema||SCHEMA)>=5){
      for(const kind of ['cultureFavorites','cultureRead'])next[kind]={...(state[kind]||{m:[],f:[]}),[profile]:data[kind]};
    }
    if((backup.schema||SCHEMA)>=6){
      for(const kind of ['journalNotes','journalRatings'])next[kind]={...(state[kind]||{m:{},f:{}}),[profile]:data[kind]};
    }
    return next;
  }
  root.Fil52Backup={FORMAT,SCHEMA,MAX_FILE_SIZE,exportData,parseBackup,applyBackup};
})(globalThis);
