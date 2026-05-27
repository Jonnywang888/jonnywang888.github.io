var CACHE_NAME = 'italiano-v2';
var ASSETS = [

];

// ── Install: pre-cache all app shell assets ──
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

// ── Activate: purge old caches ──
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// ── Fetch: cache-first for app shell, network-first for external ──
self.addEventListener('fetch', function(e) {
  var url = new URL(e.request.url);

  // Skip non-GET and chrome-extension requests
  if(e.request.method !== 'GET') return;

  // For local assets: cache-first
  if(url.origin === location.origin) {
    e.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.match(e.request).then(function(cached) {
          var fetched = fetch(e.request).then(function(response) {
            if(response.ok) cache.put(e.request, response.clone());
            return response;
          }).catch(function() {
            return cached;
          });
          return cached || fetched;
        });
      })
    );
    return;
  }

  // For external resources (fonts, etc.): network-first with cache fallback
  e.respondWith(
    caches.open(CACHE_NAME).then(function(cache) {
      return fetch(e.request).then(function(response) {
        if(response.ok) cache.put(e.request, response.clone());
        return response;
      }).catch(function() {
        return cache.match(e.request);
      });
    })
  );
});
