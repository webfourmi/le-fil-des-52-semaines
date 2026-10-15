/* Sauvegardes personnelles du Fil des 52 semaines. Aucune donnée transférée. */
(function(root){
  'use strict';
  const FORMAT='le-fil-des-52-semaines.personnel',SCHEMA=2,MAX_FILE_SIZE=2*1024*1024;
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
      check(/^(?:[1-9]|[1-4][0-9]|5[0-2])$/.test(k)&&typeof v==='string'&&v.length<=12000,'Note incorrecte pour la semaine '+k+'.');
      result[k]=v;
    }
    return result;
  }
  function ratings(value){
    check(plain(value)&&Object.keys(value).length<=52,'Évaluations invalides.');
    const result={};
    for(const [k,v] of Object.entries(value)){
      check(/^(?:[1-9]|[1-4][0-9]|5[0-2])$/.test(k)&&Number.isInteger(v)&&v>=1&&v<=5,'Évaluation incorrecte pour la semaine '+k+'.');
      result[k]=v;
    }
    return result;
  }
  function validateData(data){
    check(plain(data),'Données de couture manquantes.');
    const output={};
    for(const kind of arrKinds)output[kind]=numbers(data[kind],kind);
    output.notes=notes(data.notes);
    output.ratings=ratings(data.ratings);
    return output;
  }
  function exportData(state,profile){
    check(validProfile(profile),'Identité personnelle non choisie.');
    const data={};
    for(const kind of [...arrKinds,...objectKinds])data[kind]=state[kind]?.[profile];
    return {format:FORMAT,schema:SCHEMA,profile,exportedAt:new Date().toISOString(),data:validateData(data)};
  }
  function parseBackup(text){
    check(typeof text==='string'&&text.length<=MAX_FILE_SIZE&&text.length>0,'Fichier vide ou trop grand.');
    let file;try{file=JSON.parse(text)}catch(e){throw Error('Ce fichier ne contient pas un JSON valide.')}
    check(plain(file)&&file.format===FORMAT&&file.schema===SCHEMA,'Format de sauvegarde incompatible.');
    check(validProfile(file.profile),'Identité de sauvegarde inconnue.');
    check(typeof file.exportedAt==='string'&&Number.isFinite(Date.parse(file.exportedAt)),'Date de sauvegarde invalide.');
    return {profile:file.profile,exportedAt:file.exportedAt,data:validateData(file.data)};
  }
  function applyBackup(state,backup,profile){
    check(validProfile(profile)&&backup.profile===profile,'Cette sauvegarde appartient à un autre espace personnel.');
    const data=validateData(backup.data);
    const next={...state};
    for(const kind of [...arrKinds,...objectKinds])next[kind]={...state[kind],[profile]:data[kind]};
    return next;
  }
  root.Fil52Backup={FORMAT,SCHEMA,MAX_FILE_SIZE,exportData,parseBackup,applyBackup};
})(globalThis);
