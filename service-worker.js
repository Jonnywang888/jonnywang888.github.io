self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('my-pwa-cache-v1').then(function(cache) {
            return cache.addAll([
                '/index.html',
                '/manifest.json',
                '/icons/app.png',
                // '/icons/icon-512x512.png',
                '/styles.css',   // 如果你有额外的CSS文件
                '/script.js'     // 如果你有额外的JavaScript文件
            ]);
        })
    );
});

// 获取事件：实现缓存优先策略
// self.addEventListener('fetch', function(event) {
//     event.respondWith(
//       caches.match(event.request)  // 尝试从缓存中匹配请求
//         .then(function(response) {
//           if (response) {
//             return response;  // 如果缓存中有匹配的请求，则返回缓存
//           }
//           return fetch(event.request);  // 如果缓存中没有匹配的请求，再发起网络请求
//         }
//       )
//     );
//   });


// 缓存与网络竞争
// self.addEventListener('fetch', event => {
//   event.respondWith(
//     // 从缓存中读取资源
//     caches.match(event.request).then(cachedResponse => {
//       // 发起网络请求
//       const networkFetch = fetch(event.request).then(networkResponse => {
//         // 如果网络请求成功，将响应存入缓存
//         return caches.open('my-cache').then(cache => {
//           cache.put(event.request, networkResponse.clone());
//           return networkResponse; // 返回网络响应
//         });
//       });

//       // 返回缓存中的内容，或者等待网络响应
//       return cachedResponse || networkFetch;
//     })
//   );
// });

// 网络优先
self.addEventListener('fetch', event => {
  event.respondWith(
    // 尝试通过网络获取请求的资源
    fetch(event.request)
      .then(response => {
        // 如果网络请求成功，将其克隆并存入缓存
        return caches.open('my-cache').then(cache => {
          cache.put(event.request, response.clone());
          return response; // 返回网络请求的响应
        });
      })
      .catch(() => {
        // 如果网络请求失败，从缓存中返回资源
        return caches.match(event.request);
      })
  );
});
