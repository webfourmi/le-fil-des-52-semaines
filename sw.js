/* De fil en aiguille — cache PWA. Augmenter CACHE_VERSION pour chaque nouvelle version de l'application. */
const CACHE_VERSION = 'fil52-shell-v1.1.16';
const CORE = [
  './','./index.html','./manifest.webmanifest','./data/editions.json',
  './assets/backup.js','./assets/gallery.js','./assets/personal-gallery.js','./assets/journal-photos.js','./assets/halloween-voyage.js','./assets/halloween-patrons.html','./assets/cours-02-patron-arrondis.html','./assets/textile-travel.js','./assets/lesson-guides.js','./assets/patchwork-courses.js','./assets/patchwork-courses.css','./assets/machine-intro.js','./assets/lesson-photos.js','./assets/lesson-photos.css',
  './assets/cours-01/01-materiel.webp','./assets/cours-01/02-epinglage.webp','./assets/cours-01/03-coins-degarnis.webp','./assets/cours-01/04-surpiqure.webp','./assets/cours-01/05-marque-page-termine.webp','./assets/travel-updates.css','./assets/atelier.webp',
  './assets/romantic-theme.css','./assets/romantic-botanical.svg','./assets/nav-history.svg','./assets/nav-home-simple.svg','./assets/nav-sewing-simple.svg','./assets/nav-patch-simple.svg','./assets/pwa-icon.svg','./assets/icon-app.svg','./assets/icon-couture.svg','./assets/icon-dico-couture.svg','./assets/icon-couverture.svg','./assets/icon-patchwork.svg','./assets/nav-world.svg','./assets/nav-journal.svg','./assets/nav-print.svg','./assets/nav-backup.svg','./assets/nav-personal.svg','./assets/pwa-icon-192.png','./assets/pwa-icon-512.png','./assets/pwa-icon-180.png','./assets/pwa.js'
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
  if(event.request.mode==='navigate' || url.pathname.endsWith('/data/editions.json')){
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
