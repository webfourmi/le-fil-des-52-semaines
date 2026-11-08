/* De fil en aiguille — cache PWA. Augmenter CACHE_VERSION pour chaque nouvelle version de l'application. */
const CACHE_VERSION = 'fil52-shell-v1.3.31';
const CORE = [
  './','./index.html','./manifest.webmanifest','./data/editions.json','./data/changelog.json',
  './assets/history-antiquity.js','./assets/history-antiquity.css','./assets/patron-toge-romaine.svg','./assets/patron-tunique-romaine.svg','./assets/patrons-romains.html',
  './assets/backup.js','./assets/gallery.js','./assets/personal-gallery.js','./assets/journal-photos.js','./assets/mercerie.js','./assets/journal-album.js','./assets/halloween-voyage.js','./assets/halloween-patrons.html','./assets/cours-02-patron-arrondis.html','./assets/cours-02/photo-1.jpg','./assets/cours-02/photo-2.jpg','./assets/cours-02/photo-3.jpg','./assets/cours-02/photo-4.jpg','./assets/cours-02/photo-5.jpg','./assets/cours-02/photo-6.jpg','./assets/textile-travel.js','./assets/vietnam-nord.js','./assets/vietnam-marque-page.svg','./assets/kantha-etui.js','./assets/kantha-etui.css','./assets/patron-kantha-etui.svg','./assets/patchwork-02-gabarit.html','./assets/patchwork-02/bloc-02-reel.jpg','./assets/patchwork-02/illustration-bloc.webp','./assets/patchwork-02/etape-1-decoupe.webp','./assets/patchwork-02/etape-2-disposition.webp','./assets/patchwork-02/etape-3-superposition.webp','./assets/patchwork-02/etape-4-couture.webp','./assets/patchwork-02/etape-5-repassage.webp','./assets/patchwork-02/etape-6-controle.webp','./assets/lesson-guides.js','./assets/patchwork-courses.js','./assets/patchwork-courses.css','./assets/machine-intro.js','./assets/lesson-photos.js','./assets/lesson-photos.css','./assets/sewing-techniques.js','./assets/projet-cale-porte-chien.js','./assets/projet-boudin-porte.js','./assets/patron-boudin-porte.html','./assets/projet-cale-porte-chien.css','./assets/patron-cale-porte-chien.html','./assets/techniques/sous-doublure.webp','./assets/techniques/doublure.jpg','./assets/techniques/ourlet-invisible-v2.webp',
  './assets/cours-01/01-materiel.webp','./assets/cours-01/02-epinglage.webp','./assets/cours-01/03-coins-degarnis.webp','./assets/cours-01/04-surpiqure.webp','./assets/cours-01/05-marque-page-termine.webp','./assets/travel-updates.css','./assets/atelier.webp',
  './assets/romantic-theme.css','./assets/romantic-botanical.svg','./assets/nav-history.svg','./assets/nav-home-simple.svg','./assets/nav-sewing-simple.svg','./assets/nav-patch-simple.svg','./assets/pwa-icon.svg','./assets/icon-app.svg','./assets/icon-couture.svg','./assets/icon-dico-couture.svg','./assets/icon-couverture.svg','./assets/icon-patchwork.svg','./assets/nav-world.svg','./assets/nav-journal.svg','./assets/nav-print.svg','./assets/nav-backup.svg','./assets/nav-mercerie.svg','./assets/nav-personal.svg','./assets/pwa-icon-192.png','./assets/pwa-icon-512.png','./assets/pwa-icon-180.png','./assets/pwa.js'
];
const base = self.registration.scope;
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_VERSION).then(cache => cache.addAll(CORE)));
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k=>k.startsWith('fil52-shell-') && k!==CACHE_VERSION).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('message', event => {
  if(event.data && event.data.type==='SKIP_WAITING') self.skipWaiting();
});
self.addEventListener('fetch', event => {
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin || !url.href.startsWith(base)) return;
  if(event.request.mode==='navigate' || url.pathname.endsWith('/data/editions.json') || url.pathname.endsWith('/data/changelog.json')){
    event.respondWith((async () => {
      try {
        const response=await fetch(event.request, {cache:'no-store'});
        if(response.ok) {const cache=await caches.open(CACHE_VERSION); await cache.put(event.request,response.clone())}
        return response;
      } catch (_) {
        const cached=await caches.match(event.request);
        return cached || (event.request.mode==='navigate'?await caches.match(new URL('./index.html',base)):Response.error());
      }
    })());
    return;
  }
  event.respondWith((async()=>{
    const cached=await caches.match(event.request);
    if(cached) return cached;
    try {
      const response=await fetch(event.request);
      if(response.ok){const cache=await caches.open(CACHE_VERSION);await cache.put(event.request,response.clone())}
      return response;
    }catch(_){return Response.error()}
  })());
});
