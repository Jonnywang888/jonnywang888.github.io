const cache_name = 'app_cache_v2.11';
const urls = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/app.png',
  '/src/styles.css', 
  '/src/script.js',
  '/src/fun.js',
  '/src/bwip-js-min.js',
  '/icons/*'
];

// 安装事件 - 缓存资源
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(cache_name)
      .then(cache => {
        console.log('Caching app shell');
        // 过滤掉通配符模式，只缓存具体的文件
        const specificUrls = urls.filter(url => !url.includes('*'));
        return cache.addAll(specificUrls);
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

// 检查请求是否匹配缓存优先的模式
function shouldUseCache(requestUrl) {
  const pathname = requestUrl.pathname;
  
  return urls.some(pattern => {
    if (pattern.includes('*')) {
      // 处理通配符模式，如 '/icons/*'
      const basePattern = pattern.replace('*', '');
      return pathname.startsWith(basePattern);
    } else {
      // 精确匹配
      return pathname === pattern;
    }
  });
}

// 拦截网络请求
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);
  
  // 检查是否应该使用缓存优先策略
  if (shouldUseCache(requestUrl)) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            console.log('Serving from cache:', event.request.url);
            return cachedResponse;
          }
          
          // 缓存中没有，从网络获取并缓存
          return fetch(event.request)
            .then(response => {
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(cache_name)
                  .then(cache => {
                    cache.put(event.request, responseClone);
                  });
              }
              return response;
            })
            .catch(() => {
              // 网络也失败时的回退
              return new Response('Resource not available', {
                status: 503,
                headers: { 'Content-Type': 'text/plain' }
              });
            });
        })
    );
    return;
  }
  
  // 对于不在 urls 列表中的请求，采用网络优先策略
  event.respondWith(
    fetch(event.request)
      .then(response => {
        return response;
      })
      .catch(() => {
        // 网络失败，尝试从缓存获取
        console.log('Network failed, trying cache for:', event.request.url);
        return caches.match(event.request)
          .then(cachedResponse => {
            if (cachedResponse) {
              console.log('Serving from cache as fallback:', event.request.url);
              return cachedResponse;
            }
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
          // 过滤掉通配符模式，只缓存具体的文件
          const specificUrls = urls.filter(url => !url.includes('*'));
          return cache.addAll(specificUrls);
        })
    );
  }
});