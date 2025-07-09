const cache_name = 'app_cache_v1.7';
const urls = [
  '/index.html',
  '/manifest.json',
  '/icons/app.png',
  '/src/styles.css', 
  '/src/script.js',
  '/src/fun.js' ,
  '/src/bwip-js-min.js'
]

// 超时时间配置
const FIRST_LOAD_TIMEOUT = 200; // 首次加载超时时间：200毫秒
const NORMAL_TIMEOUT = 3000;    // 正常请求超时时间：3秒

// 记录是否为首次加载
let isFirstLoad = true;

// 安装事件
self.addEventListener('install', async e => {
  console.log('Service Worker 安装中...');
  const cache = await caches.open(cache_name);
  await cache.addAll(urls);
  await self.skipWaiting();
})

// 监听激活事件
self.addEventListener('activate', async e => {
  console.log('Service Worker 激活中...');
  const keys = await caches.keys();
  keys.forEach(key => {
    if (key !== cache_name) {
      caches.delete(key);
    }
  });
  await self.clients.claim();
})

// 监听fetch事件
self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);
  
  // 只处理同源请求
  if (url.origin !== self.origin) {
    return;
  }
  
  // 根据资源类型选择不同策略
  if (req.url.includes('icons/')) {
    e.respondWith(cachefirst(req));
  } else {
    // 主要资源使用智能超时策略
    e.respondWith(smartNetworkFirst(req));
  }
})

// 监听message事件
self.addEventListener('message', event => {
  if (event.data === 'clear-cache') {
    clearOldCaches();
  } else if (event.data === 'app-loaded') {
    // 应用加载完成后，设置为非首次加载
    isFirstLoad = false;
    console.log('应用已加载完成，后续请求使用正常超时时间');
  }
});

// 缓存优先策略
async function cachefirst(req) {
  const cache = await caches.open(cache_name);
  const cached = await cache.match(req);
  
  if (cached) {
    return cached;
  } else {
    try {
      const fresh = await fetch(req);
      cache.put(req, fresh.clone());
      return fresh;
    } catch (e) {
      console.log('网络请求失败，无缓存可用:', req.url);
      return new Response('Network error', { status: 408 });
    }
  }
}

// 智能网络优先策略 - 根据是否首次加载调整超时时间
async function smartNetworkFirst(req) {
  const cache = await caches.open(cache_name);
  
  // 根据是否首次加载选择不同的超时时间
  const timeout = isFirstLoad ? FIRST_LOAD_TIMEOUT : NORMAL_TIMEOUT;
  
  try {
    console.log(`请求 ${req.url}，超时时间: ${timeout}ms，首次加载: ${isFirstLoad}`);
    
    // 使用Promise.race实现超时机制
    const networkPromise = fetch(req);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Network timeout')), timeout)
    );
    
    const fresh = await Promise.race([networkPromise, timeoutPromise]);
    
    // 成功获取到网络响应，更新缓存
    cache.put(req, fresh.clone());
    return fresh;
    
  } catch (e) {
    console.log(`网络请求超时(${timeout}ms)或失败，使用缓存:`, req.url);
    const cached = await cache.match(req);
    
    if (cached) {
      // 如果是首次加载且有缓存，在后台继续尝试网络请求来更新缓存
      if (isFirstLoad) {
        backgroundUpdate(req);
      }
      return cached;
    } else {
      return new Response('Not available', { status: 503 });
    }
  }
}

// 后台更新缓存
async function backgroundUpdate(req) {
  try {
    console.log('后台更新缓存:', req.url);
    const cache = await caches.open(cache_name);
    const fresh = await fetch(req);
    cache.put(req, fresh.clone());
    console.log('后台更新成功:', req.url);
  } catch (e) {
    console.log('后台更新失败:', req.url);
  }
}

// 清理旧缓存
async function clearOldCaches() {
  const keys = await caches.keys();
  keys.forEach(key => caches.delete(key));
  const cache = await caches.open(cache_name);
  await cache.addAll(urls);
  await self.skipWaiting();
  await self.clients.claim();
}

// 监听页面可见性变化，重置首次加载标志
self.addEventListener('message', event => {
  if (event.data === 'clear-cache') {
    clearOldCaches();
  } else if (event.data === 'app-loaded') {
    isFirstLoad = false;
    console.log('应用已加载完成，后续请求使用正常超时时间');
  } else if (event.data === 'reset-first-load') {
    isFirstLoad = true;
    console.log('重置为首次加载状态');
  }
});