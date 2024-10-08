const cache_name = 'app_cache_v1.5';
const urls = [
  '/index.html',
  '/manifest.json',
  '/icons/app.png',
  '/styles.css',   // 如果你有额外的CSS文件
  '/script.js',
  '/fun.js'     // 如果你有额外的JavaScript文件
]
// 安装事件
self.addEventListener('install', async e => {
  // 配置缓存
  const cache = await caches.open(cache_name);
  await cache.addAll(urls);
  await self.skipWaiting();
})
// 监听激活事件
self.addEventListener('activate', async e => {
  const keys = await caches.keys();
  keys.forEach(key => {
    // 如果缓存名不是当前缓存名，则删除
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
  if (url.origin !== self.origin) {
    return;
  }
  if (req.url.includes('icons/')) {
    e.respondWith(cachefirst(req));
  } else {
    e.respondWith(networkfirst(req));
  }
})
// 监听message事件
self.addEventListener('message', event => {
  if (event.data === 'clear-cache') {
    clearOldCaches();
  }
});

// 缓存优先策略
async function cachefirst(req) {
  const cache = await caches.open(cache_name);
  const cached = await cache.match(req);
  // 如果有缓存，则返回缓存
  if (cached) {
    return cached;
  } else {
    const fresh = await fetch(req);
    // 克隆内容到缓存内
    cache.put(req, fresh.clone());
    return fresh;
  }
};
// 网络优先策略
async function networkfirst(req) {
  const cache = await caches.open(cache_name);
  try{
    const fresh = await fetch(req);
    // 克隆内容到缓存内
    cache.put(req, fresh.clone());
    return fresh;
  } catch(e) {
    const cached = await cache.match(req);
    return cached;
  }
}

// 清理旧缓存
async function clearOldCaches() {
  alert('清理旧缓存')
  const keys = await caches.keys();
  keys.forEach(key => caches.delete(key));
  const cache = await caches.open(cache_name);
  await cache.addAll(urls);
  await self.skipWaiting();
  await self.clients.claim();  // 立即接管页面
}
