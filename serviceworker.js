// Cache URLs (not filenames) for offline use.
const assets = ["/", "index.css", "app.js", "sw-register.js"];
const version = "v1.1.5";

self.addEventListener('install', e => {
  e.waitUntil(caches.open('assets')
    .then(cache => cache.addAll(assets))
    .catch(err => console.error(err))
  );
});

// Cache-first strategy:
// self.addEventListener('fetch', event => {
//   console.log('Adding event Listener for fetch');
//   event.respondWith(
//     caches.open('assets').then(cache =>
//       cache.match(event.request).then(cachedResponse => {
//         if (cachedResponse) { // Cache HIT
//           return cachedResponse
//         } else { // Cache MISS
//           return fetch(e.request);
//         }
//       })
//     )
//   )
// })

// Network-first strategy:
// self.addEventListener('fetch', event => {
//   console.log('Adding event Listener for fetch');
//   event.respondWith(
//     fetch(event.request)  // ALWAYS go to the network
//       .then(response => {
//         console.log ('Fetch response: ', response.status);
//       })
//       .catch( error => // If network is down, go to the cache
//         caches.open('assets')
//           .then(cache => {
//             return cache.match(request);
//           }) // .then
//       ) // .catch
//     ) // .respondWith
//   } // event
// ); // addEventListener

// Stale while revalidate strategy
self.addEventListener('fetch', event => {
  console.log(`Adding event Listener for fetch. Version ` + version);
  event.respondWith(
    caches.match(event.request) // Cache HIT
      .then(response => {
        console.log('Cache HIT: ', event.request.url);
        const fetchPromise = fetch(event.request).then(
          networkResponse => {
            caches.open("assets").then( cache => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            }); // .then
          } //Network response
        ); // fetchPromise
      return response || fetchPromise;
    }) // caches.match
  ); // respondWith
}); // addEventListener

