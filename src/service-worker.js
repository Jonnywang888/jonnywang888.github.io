const CACHE_NAME = 'cassa-app-v1.33';
const ASSETS = [
    './',
    './index.html'
];

// 安装Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('缓存打开');
                return cache.addAll(ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// 激活Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cacheName => {
                    return cacheName !== CACHE_NAME;
                }).map(cacheName => {
                    return caches.delete(cacheName);
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 拦截网络请求
self.addEventListener('fetch', event => {
    // 跳过不支持缓存的请求（如数据API）
    if (event.request.url.includes('.asp')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // 如果在缓存中找到响应，则返回缓存的版本
                if (response) {
                    return response;
                }

                // 否则尝试从网络获取
                return fetch(event.request).then(networkResponse => {
                    // 检查是否收到有效响应
                    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                        return networkResponse;
                    }

                    // 克隆响应，因为响应是流，只能使用一次
                    const responseToCache = networkResponse.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });

                    return networkResponse;
                });
            })
            .catch(() => {
                // 如果网络和缓存都失败，返回离线页面
                if (event.request.url.includes('html')) {
                    return caches.match('./index.html');
                }
                return new Response('网络请求失败，请检查您的网络连接。', {
                    status: 503,
                    statusText: 'Service Unavailable',
                    headers: new Headers({
                        'Content-Type': 'text/plain'
                    })
                });
            })
    );
});
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