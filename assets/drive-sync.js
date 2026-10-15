/* Google Drive personnel pour Le fil des 52 semaines.
   API officielle Drive v3 + Google Identity Services (OAuth token model).
   Aucun jeton n'est placé dans localStorage ou dans un dépôt public. */
(function(root){
  'use strict';
  const SCOPE='https://www.googleapis.com/auth/drive.file';
  const API='https://www.googleapis.com/drive/v3';
  const UPLOAD='https://www.googleapis.com/upload/drive/v3/files';
  const FOLDER='Le fil des 52 semaines';
  let token=null, expiresAt=0, email='', displayName='', tokenClient=null, busy=false;
  const ensure=(ok,message)=>{if(!ok)throw new Error(message)};
  function isConfigured(){
    const id=root.FIL52_GOOGLE_CLIENT_ID;
    return typeof id==='string'&&/^\d+-[a-zA-Z0-9_-]+\.apps\.googleusercontent\.com$/.test(id);
  }
  function connected(){return !!token&&Date.now()<expiresAt-60000}
  function status(){return {configured:isConfigured(),connected:connected(),email,displayName,busy}}
  function requireConnection(){ensure(connected(),'Connexion Google expirée. Reconnectez votre compte pour continuer.')}
  async function request(path,init={}){
    requireConnection();
    const {headers={},...options}=init;
    const response=await fetch(path.startsWith('https://')?path:API+path,{
      ...options,headers:{Authorization:'Bearer '+token,...headers},
      cache:'no-store'
    });
    if(!response.ok){
      if(response.status===401){token=null;expiresAt=0;throw new Error('Session Google expirée. Reconnectez-vous.')}
      let info='';try{const error=await response.json();info=error?.error?.message||''}catch(_){}
      throw new Error('Google Drive : erreur '+response.status+(info?' ('+info.slice(0,180)+')':''));
    }
    if(response.status===204)return null;
    return response.json();
  }
  async function getAccount(){
    const info=await request('/about?fields=user(emailAddress,displayName)');
    const user=info.user||{};
    email=String(user.emailAddress||'');
    displayName=String(user.displayName||'');
    return {email,displayName};
  }
  function connect(){
    ensure(isConfigured(),'La connexion Google n’est pas encore configurée par l’administratrice.');
    ensure(root.google?.accounts?.oauth2?.initTokenClient,'Le service de connexion Google ne s’est pas chargé. Vérifiez Internet ou les bloqueurs de scripts.');
    ensure(!busy,'Une connexion est déjà en cours.');
    busy=true;
    return new Promise((resolve,reject)=>{
      try{
        tokenClient=root.google.accounts.oauth2.initTokenClient({
          client_id:root.FIL52_GOOGLE_CLIENT_ID,
          scope:SCOPE,
          callback:async response=>{
            busy=false;
            if(response?.error||!response?.access_token){
              reject(new Error('Autorisation Google refusée ou interrompue.'));return;
            }
            token=response.access_token;
            expiresAt=Date.now()+Math.max(60,Number(response.expires_in)||3500)*1000;
            try{resolve(await getAccount())}
            catch(error){token=null;expiresAt=0;reject(error)}
          },
          error_callback:()=>{busy=false;reject(new Error('Fenêtre Google fermée ou bloquée.'))}
        });
        tokenClient.requestAccessToken({prompt:'select_account'});
      }catch(error){busy=false;reject(error)}
    });
  }
  function disconnect(){
    const old=token;
    token=null;expiresAt=0;email='';displayName='';
    if(old&&root.google?.accounts?.oauth2?.revoke)root.google.accounts.oauth2.revoke(old,()=>{});
  }
  function encodedQuery(obj){
    return new URLSearchParams(obj).toString();
  }
  async function listFolder(){
    const q="name = '"+FOLDER.replace(/'/g,"\\'")+"' and mimeType = 'application/vnd.google-apps.folder' and trashed = false";
    const result=await request('/files?'+encodedQuery({q,fields:'nextPageToken,files(id,name,modifiedTime)',pageSize:'100'}));
    return result.files?.[0]||null;
  }
  async function findFolder({create=false}={}){
    const existing=await listFolder();
    if(existing||!create)return existing;
    return request('/files?fields=id,name',{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({name:FOLDER,mimeType:'application/vnd.google-apps.folder'})});
  }
  function snapshotName(profile){
    const iso=new Date().toISOString().replace(/[:.]/g,'-');
    return 'carnet-'+(profile==='f'?'mathilde':'moi')+'-'+iso+'.json';
  }
  async function listSnapshots(profile){
    ensure(profile==='m'||profile==='f','Profil invalide.');
    const folder=await findFolder();
    if(!folder)return [];
    const q="'"+folder.id+"' in parents and name contains 'carnet-' and trashed = false";
    const result=await request('/files?'+encodedQuery({q,orderBy:'modifiedTime desc',pageSize:'100',fields:'nextPageToken,files(id,name,modifiedTime,size,appProperties)'}));
    return (result.files||[]).filter(f=>f.appProperties?.fil52==='progress-v2'&&f.appProperties?.profile===profile).map(f=>({
      id:f.id,name:f.name,modifiedTime:f.modifiedTime||'',size:Number(f.size||0)
    })).slice(0,30);
  }
  async function saveSnapshot(state,profile){
    ensure(root.Fil52Backup?.exportData,'Outil de sauvegarde indisponible.');
    ensure(profile==='m'||profile==='f','Profil invalide.');
    const file=root.Fil52Backup.exportData(state,profile);
    const folder=await findFolder({create:true});
    const name=snapshotName(profile);
    const boundary='fil52_'+Date.now();
    const payload=new Blob([
      '--'+boundary+'\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n',
      JSON.stringify({name,parents:[folder.id],mimeType:'application/json',
        appProperties:{fil52:'progress-v2',profile}}),
      '\r\n--'+boundary+'\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n',
      JSON.stringify(file,null,2),
      '\r\n--'+boundary+'--\r\n'
    ],{type:'multipart/related; boundary='+boundary});
    const created=await request(UPLOAD+'?uploadType=multipart&fields=id,name,modifiedTime',
      {method:'POST',headers:{'Content-Type':'multipart/related; boundary='+boundary},body:payload});
    return {id:created.id,name:created.name,modifiedTime:created.modifiedTime};
  }
  async function loadSnapshot(id,profile){
    ensure(/^[A-Za-z0-9_-]{8,}$/.test(id),'Identifiant Drive invalide.');
    ensure(root.Fil52Backup?.parseBackup,'Outil de sauvegarde indisponible.');
    const meta=await request('/files/'+encodeURIComponent(id)+'?fields=id,name,appProperties,modifiedTime');
    ensure(meta?.appProperties?.fil52==='progress-v2'&&meta.appProperties.profile===profile,
      'Ce fichier ne correspond pas à votre carnet.');
    const response=await fetch(API+'/files/'+encodeURIComponent(id)+'?alt=media',{
      headers:{Authorization:'Bearer '+token},cache:'no-store'
    });
    ensure(response.ok,'Téléchargement Drive impossible (code '+response.status+').');
    const text=await response.text();
    const backup=root.Fil52Backup.parseBackup(text);
    ensure(backup.profile===profile,'Cette sauvegarde appartient à un autre carnet.');
    return {backup,name:meta.name,modifiedTime:meta.modifiedTime};
  }
  root.Fil52Drive={SCOPE,isConfigured,status,connect,disconnect,saveSnapshot,listSnapshots,loadSnapshot};
})(globalThis);
