const cache_name = 'app_cache_v1.9';
const urls = [
  '/index.html',
  '/manifest.json',
  '/icons/app.png',
  '/src/styles.css', 
  '/src/script.js',
  '/src/fun.js',
  '/src/bwip-js-min.js'
];

// 安装事件 - 缓存资源
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(cache_name)
      .then(cache => {
        console.log('Caching app shell');
        return cache.addAll(urls);
      })
      .then(() => {
        // 强制激活新的 Service Worker
        return self.skipWaiting();
      })
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== cache_name) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // 立即控制所有客户端
        return self.clients.claim();
      })
  );
});

// 拦截网络请求
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);
  
  // 对于 index.html 或根路径，优先使用缓存
  if (requestUrl.pathname === '/' || requestUrl.pathname === '/index.html') {
    event.respondWith(
      caches.match('/index.html')
        .then(cachedResponse => {
          if (cachedResponse) {
            console.log('Serving index.html from cache');
            return cachedResponse;
          }
          // 如果缓存中没有，则从网络获取
          return fetch(event.request)
            .then(response => {
              // 缓存新的响应
              const responseClone = response.clone();
              caches.open(cache_name)
                .then(cache => {
                  cache.put('/index.html', responseClone);
                });
              return response;
            });
        })
        .catch(() => {
          // 网络和缓存都失败时的回退
          return new Response('App is offline', {
            status: 200,
            headers: { 'Content-Type': 'text/html' }
          });
        })
    );
    return;
  }
  
  // 对于其他所有请求，采用网络优先策略
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // 网络请求成功，更新缓存（仅对静态资源）
        if (response.status === 200 && urls.includes(requestUrl.pathname)) {
          const responseClone = response.clone();
          caches.open(cache_name)
            .then(cache => {
              cache.put(event.request, responseClone);
            });
        }
        return response;
      })
      .catch(() => {
        // 网络失败，尝试从缓存获取
        console.log('Network failed, trying cache for:', event.request.url);
        return caches.match(event.request)
          .then(cachedResponse => {
            if (cachedResponse) {
              console.log('Serving from cache:', event.request.url);
              return cachedResponse;
            }
            // 如果缓存中也没有，返回错误响应
            return new Response('Resource not available offline', {
              status: 503,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// 监听消息事件（可选，用于手动更新缓存）
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'UPDATE_CACHE') {
    event.waitUntil(
      caches.open(cache_name)
        .then(cache => {
          return cache.addAll(urls);
        })
    );
  }
});