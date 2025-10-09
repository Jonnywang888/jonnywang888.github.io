// Service Worker - 缓存优先策略
const CACHE_NAME = 'cache-first-v1';
const CACHE_EXPIRY_TIME = 10 * 24 * 60 * 60 * 1000; // 24小时缓存过期时间

// 安装Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker 安装中...');
  
  // 预缓存重要资源（可选）
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('缓存已创建');
      // 可以在这里预缓存一些重要的静态资源
      // return cache.addAll(['/index.html', '/app.js', '/style.css']);
    })
  );
  
  // 强制激活新的Service Worker
  self.skipWaiting();
});

// 激活Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker 激活中...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // 清理旧缓存
          if (cacheName !== CACHE_NAME) {
            console.log('删除旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // 立即控制所有客户端
      return self.clients.claim();
    })
  );
});

// 拦截网络请求
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  
  // 只处理GET请求
  if (request.method !== 'GET') {
    return;
  }
  
  // 检查是否为.asp请求
  if (url.pathname.toLowerCase().includes('.asp')) {
    console.log('跳过.asp请求的缓存:', url.href);
    // 对于.asp请求，直接走网络，不使用缓存
    return;
  }
  
  // 对其他请求使用缓存优先策略
  event.respondWith(cacheFirstStrategy(request));
});

// 缓存优先策略实现
async function cacheFirstStrategy(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('从缓存返回:', request.url);
      
      // 检查缓存是否过期
      const cachedDate = cachedResponse.headers.get('sw-cached-date');
      if (cachedDate) {
        const cacheTime = new Date(cachedDate).getTime();
        const now = Date.now();
        
        if (now - cacheTime > CACHE_EXPIRY_TIME) {
          console.log('缓存已过期，后台更新:', request.url);
          // 缓存过期，但先返回旧缓存，然后后台更新
          updateCacheInBackground(request, cache);
        }
      }
      
      return cachedResponse;
    }
    
    // 缓存中没有，从网络获取
    console.log('从网络获取:', request.url);
    const networkResponse = await fetch(request);
    
    // 只缓存成功的响应
    if (networkResponse.status === 200) {
      await cacheResponse(cache, request, networkResponse.clone());
    }
    
    return networkResponse;
    
  } catch (error) {
    console.error('缓存策略错误:', error);
    
    // 如果网络也失败，尝试返回缓存（即使可能过期）
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('网络失败，返回过期缓存:', request.url);
      return cachedResponse;
    }
    
    // 如果都没有，返回错误页面或默认响应
    return new Response('网络错误，内容不可用', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// 缓存响应
async function cacheResponse(cache, request, response) {
  // 添加缓存时间戳
  const responseToCache = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: {
      ...Object.fromEntries(response.headers.entries()),
      'sw-cached-date': new Date().toISOString()
    }
  });
  
  await cache.put(request, responseToCache);
  console.log('已缓存:', request.url);
}

// 后台更新缓存
async function updateCacheInBackground(request, cache) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.status === 200) {
      await cacheResponse(cache, request, networkResponse);
      console.log('后台缓存更新完成:', request.url);
    }
  } catch (error) {
    console.error('后台更新失败:', error);
  }
}

// 消息处理（用于与主线程通信）
self.addEventListener('message', event => {
  console.log('收到消息:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME).then(() => {
      console.log('缓存已清理');
      // 检查是否有端口可用
      if (event.ports && event.ports[0]) {
        event.ports[0].postMessage({ success: true });
      } else {
        // 使用postMessage回复
        self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({ type: 'CACHE_CLEARED', success: true });
          });
        });
      }
    }).catch(error => {
      console.error('清理缓存失败:', error);
      if (event.ports && event.ports[0]) {
        event.ports[0].postMessage({ success: false, error: error.message });
      }
    });
  }
});

// 处理与客户端的通信错误
self.addEventListener('error', event => {
  console.error('Service Worker 错误:', event.error);
});

// 处理未捕获的Promise拒绝
self.addEventListener('unhandledrejection', event => {
  console.error('未处理的Promise拒绝:', event.reason);
  event.preventDefault();
});