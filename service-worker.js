self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('my-pwa-cache-v1').then(function(cache) {
            return cache.addAll([
                '/',
                '/manifest.json',
                // '/icons/icon-192x192.png',
                // '/icons/icon-512x512.png',
                '/styles.css',   // 如果你有额外的CSS文件
                '/script.js'     // 如果你有额外的JavaScript文件
            ]);
        })
    );
});

// 获取事件：实现缓存优先策略
self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)  // 尝试从缓存中匹配请求
        .then(function(response) {
          if (response) {
            return response;  // 如果缓存中有匹配的请求，则返回缓存
          }
          return fetch(event.request);  // 如果缓存中没有匹配的请求，再发起网络请求
        }
      )
    );
  });
  
