// Cache URLs (not filenames) for offline use.
const assets = ["/", "index.css", "app.js", "sw-register.js"];

self.addEventListener('install', e => {
  e.waitUntil(caches.open('assets')
    .then(cache => cache.addAll(assets))
  );
});

// Cache-first strategy:
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open('assets').then(cache =>
      cache.match(e.request).then(cachedResponse => {
        if (cachedResponse) { // Cache HIT
          return cachedResponse
        } else { // Cache MISS
          return fetch(e.request);
        }
      })
    )
  )
})