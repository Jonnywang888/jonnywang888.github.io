const CACHE_VERSION = 'pwa-cache-v1.01';
const OFFLINE_CACHE = `offline-${CACHE_VERSION}`;
const STATIC_FILES = [
    '/',
    '/index.html',
    '/manifest.json',
    '/src/app.js',
    '/src/fun.js',
    '/src/styles.css',
    '/src/bwip-js-min.js',
    '/icons/app.png',
    '/icons/load.gif'
];

const normalizeKey = (requestUrl) => {
    const url = new URL(requestUrl);
    return url.pathname;
};

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(OFFLINE_CACHE).then((cache) => cache.addAll(STATIC_FILES))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.map((key) => {
                    if (key !== OFFLINE_CACHE) {
                        return caches.delete(key);
                    }
                    return Promise.resolve();
                })
            )
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('message', (event) => {
    if (event.data === 'clear-cache') {
        event.waitUntil(
            caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
        );
    }
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    if (request.method !== 'GET') {
        event.respondWith(fetch(request));
        return;
    }

    if (url.origin !== self.location.origin) {
        return;
    }

    if (url.pathname.startsWith('/server/')) {
        event.respondWith(fetch(request));
        return;
    }

    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const clone = response.clone();
                    caches.open(OFFLINE_CACHE).then((cache) => cache.put('/index.html', clone));
                    return response;
                })
                .catch(async () => {
                    const cache = await caches.open(OFFLINE_CACHE);
                    return cache.match('/index.html');
                })
        );
        return;
    }

    const cacheKey = normalizeKey(request.url);
    event.respondWith(
        caches.open(OFFLINE_CACHE).then(async (cache) => {
            const cached = await cache.match(cacheKey);
            const networkPromise = fetch(request)
                .then((response) => {
                    if (response && response.ok) {
                        cache.put(cacheKey, response.clone());
                    }
                    return response;
                })
                .catch(() => cached);

            if (cached) {
                return cached;
            }
            return networkPromise;
        })
    );
});
