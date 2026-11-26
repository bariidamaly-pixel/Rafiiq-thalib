const CACHE_NAME = 'rafiq-al-talib-v3';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(k => k.startsWith('rafiq-') && k !== CACHE_NAME).map(k => caches.delete(k))
  )));
  self.clients.claim();
});

// internet dulu, simpanan hanya dipakai kalau offline
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request, { cache: 'no-cache' }).then(res => {
      if (res.ok) {
        const copy = res.clone();
        e.waitUntil(caches.open(CACHE_NAME).then(c => c.put(e.request, copy)));
      }
      return res;
    }).catch(() => caches.match(e.request))
  );
});
