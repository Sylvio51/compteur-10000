const CACHE_NAME = 'compteur10000-v1';
const OFFLINE_URLS = [
  '/',
  '/index.html',
  '/manifest.json'
  // les autres fichiers sont inclus inline; si tu sépares styles/js, ajoute-les ici
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(OFFLINE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if(req.method !== 'GET') return;
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(resp => {
      // optional: cache new GET responses
      return resp;
    }).catch(()=>caches.match('/index.html')))
  );
});