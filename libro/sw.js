// 服务工作者 - 离线缓存
const CACHE_NAME = 'bilingual-reader-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles/main.css',
    '/styles/home.css',
    '/styles/reader.css',
    '/js/app.js',
    '/js/home.js',
    '/js/reader.js',
    '/js/storage.js',
    '/js/pwa.js',
    '/data/users.json',
    '/data/books.json',
    '/manifest.json'
];

// 安装事件
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('缓存已打开');
                return cache.addAll(urlsToCache);
            })
    );
});

// 激活事件
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('删除旧缓存:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// 获取事件
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // 如果找到缓存的响应，则返回缓存
                if (response) {
                    return response;
                }
                
                // 否则从网络获取
                return fetch(event.request).then(
                    (response) => {
                        // 检查是否获得有效响应
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // 克隆响应
                        const responseToCache = response.clone();
                        
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    }
                );
            })
            .catch(() => {
                // 如果网络请求失败，尝试返回缓存的离线页面
                if (event.request.destination === 'document') {
                    return caches.match('/index.html');
                }
            })
    );
}); 