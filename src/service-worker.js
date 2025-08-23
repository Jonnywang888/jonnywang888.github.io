const cache_name = 'app_cache_v2.0';
const urls = [
  '/index.html',
  '/manifest.json',
  '/icons/app.png',
  '/src/styles.css', 
  '/src/script.js',
  '/src/fun.js',
  '/src/bwip-js-min.js'
];

// 超时时间配置
const FIRST_LOAD_TIMEOUT = 1000;    // 首次加载超时时间：1秒
const NORMAL_TIMEOUT = 5000;        // 正常请求超时时间：5秒
const OFFLINE_TIMEOUT = 1500;       // 离线检测超时时间：1.5秒

// 状态管理
let isFirstLoad = true;
let isOnline = navigator.onLine;
let consecutiveFailures = 0;
const MAX_FAILURES = 3;

// 网络状态监听
self.addEventListener('online', () => {
  isOnline = true;
  consecutiveFailures = 0;
  console.log('网络已连接');
});

self.addEventListener('offline', () => {
  isOnline = false;
  console.log('网络已断开');
});

// 安装事件 - 预缓存关键资源
self.addEventListener('install', async e => {
  console.log('Service Worker 安装中...');
  e.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(cache_name);
        // 分批缓存，避免一次性加载过多资源
        await cache.addAll(urls);
        console.log('预缓存完成');
        await self.skipWaiting();
      } catch (error) {
        console.error('预缓存失败:', error);
      }
    })()
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', async e => {
  console.log('Service Worker 激活中...');
  e.waitUntil(
    (async () => {
      try {
        const keys = await caches.keys();
        await Promise.all(
          keys.map(key => {
            if (key !== cache_name) {
              console.log('删除旧缓存:', key);
              return caches.delete(key);
            }
          })
        );
        await self.clients.claim();
        console.log('Service Worker 激活完成');
      } catch (error) {
        console.error('激活失败:', error);
      }
    })()
  );
});

// Fetch 事件 - 智能资源加载策略
self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);
  
  // 只处理 GET 请求和同源请求
  if (req.method !== 'GET' || url.origin !== self.origin) {
    return;
  }
  
  // 根据资源类型选择策略
  if (isStaticAsset(req.url)) {
    e.respondWith(cacheFirstStrategy(req));
  } else {
    e.respondWith(smartNetworkStrategy(req));
  }
});

// 消息事件处理
self.addEventListener('message', event => {
  const { data } = event;
  
  switch (data) {
    case 'clear-cache':
      clearAllCaches();
      break;
    case 'app-loaded':
      isFirstLoad = false;
      consecutiveFailures = 0;
      console.log('应用加载完成，切换到正常模式');
      break;
    case 'reset-first-load':
      isFirstLoad = true;
      console.log('重置为首次加载状态');
      break;
    case 'check-cache':
      event.ports[0]?.postMessage({
        cacheSize: await getCacheSize(),
        isOnline: isOnline
      });
      break;
  }
});

// 判断是否为静态资源
function isStaticAsset(url) {
  return url.includes('/icons/') || 
         url.includes('/src/') || 
         url.endsWith('.css') || 
         url.endsWith('.js') || 
         url.endsWith('.png') || 
         url.endsWith('.jpg') || 
         url.endsWith('.svg');
}

// 缓存优先策略 - 适用于静态资源
async function cacheFirstStrategy(req) {
  try {
    const cache = await caches.open(cache_name);
    const cached = await cache.match(req);
    
    if (cached) {
      // 后台更新缓存（stale-while-revalidate）
      if (isOnline && !isFirstLoad) {
        backgroundUpdate(req);
      }
      return cached;
    }
    
    // 缓存中没有，尝试网络请求
    const response = await fetchWithTimeout(req, NORMAL_TIMEOUT);
    if (response.ok) {
      cache.put(req, response.clone());
    }
    return response;
    
  } catch (error) {
    console.warn('缓存优先策略失败:', req.url, error.message);
    return createErrorResponse('资源暂时不可用', 503);
  }
}

// 智能网络策略 - 适用于动态内容
async function smartNetworkStrategy(req) {
  const cache = await caches.open(cache_name);
  
  // 如果离线或连续失败过多，直接使用缓存
  if (!isOnline || consecutiveFailures >= MAX_FAILURES) {
    console.log('离线模式或网络不稳定，使用缓存:', req.url);
    return await getCachedOrError(cache, req);
  }
  
  // 动态调整超时时间
  const timeout = calculateTimeout();
  
  try {
    console.log(`请求 ${req.url}，超时: ${timeout}ms，首次: ${isFirstLoad}`);
    
    const response = await fetchWithTimeout(req, timeout);
    
    if (response.ok) {
      // 成功请求，重置失败计数
      consecutiveFailures = 0;
      
      // 异步更新缓存
      cache.put(req, response.clone()).catch(err => 
        console.warn('缓存更新失败:', err)
      );
      
      return response;
    } else {
      throw new Error(`HTTP ${response.status}`);
    }
    
  } catch (error) {
    consecutiveFailures++;
    console.warn(`网络请求失败 (${consecutiveFailures}/${MAX_FAILURES}):`, req.url, error.message);
    
    // 降级到缓存
    const cached = await cache.match(req);
    if (cached) {
      // 如果是首次加载，启动后台更新
      if (isFirstLoad) {
        backgroundUpdate(req);
      }
      return cached;
    }
    
    return createErrorResponse('内容暂时不可用，请检查网络连接', 503);
  }
}

// 带超时的 fetch 请求
function fetchWithTimeout(req, timeout) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  return fetch(req, { signal: controller.signal })
    .finally(() => clearTimeout(timeoutId));
}

// 动态计算超时时间
function calculateTimeout() {
  if (isFirstLoad) {
    return FIRST_LOAD_TIMEOUT;
  }
  
  // 根据连续失败次数调整超时时间
  if (consecutiveFailures > 0) {
    return Math.min(OFFLINE_TIMEOUT, NORMAL_TIMEOUT - (consecutiveFailures * 500));
  }
  
  return NORMAL_TIMEOUT;
}

// 获取缓存或返回错误
async function getCachedOrError(cache, req) {
  const cached = await cache.match(req);
  if (cached) {
    return cached;
  }
  return createErrorResponse('离线状态下内容不可用', 503);
}

// 后台更新缓存
async function backgroundUpdate(req) {
  try {
    console.log('后台更新:', req.url);
    const cache = await caches.open(cache_name);
    const response = await fetchWithTimeout(req, NORMAL_TIMEOUT);
    
    if (response.ok) {
      await cache.put(req, response.clone());
      console.log('后台更新成功:', req.url);
      
      // 通知客户端内容已更新
      notifyClientsOfUpdate(req.url);
    }
  } catch (error) {
    console.warn('后台更新失败:', req.url, error.message);
  }
}

// 通知客户端内容更新
async function notifyClientsOfUpdate(url) {
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage({
      type: 'CACHE_UPDATED',
      url: url
    });
  });
}

// 创建错误响应
function createErrorResponse(message, status) {
  return new Response(
    JSON.stringify({ 
      error: message, 
      timestamp: Date.now(),
      offline: !isOnline 
    }), 
    { 
      status: status,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

// 获取缓存大小信息
async function getCacheSize() {
  try {
    const cache = await caches.open(cache_name);
    const keys = await cache.keys();
    return keys.length;
  } catch (error) {
    return 0;
  }
}

// 清理所有缓存并重新缓存
async function clearAllCaches() {
  try {
    console.log('清理所有缓存...');
    const keys = await caches.keys();
    await Promise.all(keys.map(key => caches.delete(key)));
    
    // 重新缓存关键资源
    const cache = await caches.open(cache_name);
    await cache.addAll(urls);
    
    console.log('缓存清理并重建完成');
    
    // 通知客户端缓存已清理
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({ type: 'CACHE_CLEARED' });
    });
    
  } catch (error) {
    console.error('缓存清理失败:', error);
  }
}

// 预加载关键资源
async function preloadCriticalResources() {
  const criticalUrls = ['/index.html', '/src/styles.css', '/src/script.js'];
  const cache = await caches.open(cache_name);
  
  const preloadPromises = criticalUrls.map(async url => {
    try {
      if (!(await cache.match(url))) {
        const response = await fetch(url);
        if (response.ok) {
          await cache.put(url, response);
        }
      }
    } catch (error) {
      console.warn('预加载失败:', url);
    }
  });
  
  await Promise.allSettled(preloadPromises);
}