const CACHE_VERSION = 'pwa-cache-v1.21';
const OFFLINE_CACHE = `offline-${CACHE_VERSION}`;
const NETWORK_TIMEOUT_MS = 1500;

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

// ─── 工具函数 ────────────────────────────────────────────────

const normalizeKey = (requestUrl) => new URL(requestUrl).pathname;

const fetchWithTimeout = (request, ms = NETWORK_TIMEOUT_MS) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ms);
    return fetch(request, { signal: controller.signal })
        .finally(() => clearTimeout(timer));
};


/**
 * 尝试把合法响应写入缓存（不阻塞主流程）
 */
const updateCache = (cache, key, response) => {
    if (response && response.ok) {
        cache.put(key, response.clone()).catch(() => {});
    }
};

// ─── install ────────────────────────────────────────────────

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(OFFLINE_CACHE)
            .then((cache) => cache.addAll(STATIC_FILES))
            .then(() => self.skipWaiting())
    );
});

// ─── activate ───────────────────────────────────────────────

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys
                    .filter((key) => key !== OFFLINE_CACHE)
                    .map((key) => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

// ─── message ────────────────────────────────────────────────

self.addEventListener('message', (event) => {
    if (event.data === 'clear-cache') {
        event.waitUntil(
            caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
        );
    }
});

// ─── fetch ──────────────────────────────────────────────────

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // 非 GET 请求：直接走网络，不拦截
    if (request.method !== 'GET') return;

    // 跨域请求：不拦截
    if (url.origin !== self.location.origin) return;

    // API 请求：直接走网络，不缓存
    if (url.pathname.startsWith('/server/')) return;

    // 导航请求（页面加载）：超时兜底 → 缓存
    if (request.mode === 'navigate') {
        event.respondWith(handleNavigate(request));
        return;
    }

    // 静态资源：缓存优先，后台刷新
    event.respondWith(handleStaticAsset(request));
});

// ─── 策略：导航请求 ──────────────────────────────────────────
// Network(timeout=3s) → Cache → null
// 有缓存时：超时立即返回缓存，并在后台继续等网络更新缓存

async function handleNavigate(request) {
    const cache = await caches.open(OFFLINE_CACHE);
    const cacheKey = normalizeKey(request.url);   // ✅ fix bug 1
    const cached = await cache.match(cacheKey);

    // 后台网络请求，用完整超时更新缓存
    const networkPromise = fetchWithTimeout(request, NETWORK_TIMEOUT_MS)
        .then((response) => { updateCache(cache, cacheKey, response); return response; })
        .catch(() => null);

    if (cached) {
        // 有缓存：用更短的超时决定是否等网络，超时直接返回缓存
        const raceResult = await Promise.race([
            networkPromise,
            new Promise((resolve) => setTimeout(() => resolve(null), 800)) // ✅ 800ms 给用户
        ]);
        return raceResult || cached;
    }

    const response = await networkPromise;
    return response || new Response('Offline - no cache available', {
        status: 503,
        headers: { 'Content-Type': 'text/plain' }
    });
}
// ─── 策略：静态资源 ──────────────────────────────────────────
// Cache First → 后台 Network 刷新
// 无缓存时 → Network(timeout)

async function handleStaticAsset(request) {
    const cache = await caches.open(OFFLINE_CACHE);
    const cacheKey = normalizeKey(request.url);
    const cached = await cache.match(cacheKey);

    if (cached) {
        // 后台静默刷新缓存，不阻塞响应
        fetchWithTimeout(request)
            .then((response) => updateCache(cache, cacheKey, response))
            .catch(() => {});
        return cached;
    }

    // 无缓存：走网络（带超时）
    try {
        const response = await fetchWithTimeout(request);
        updateCache(cache, cacheKey, response);
        return response;
    } catch {
        return new Response('Resource unavailable offline', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' }
        });
    }
}