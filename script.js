document.getElementById('updateButton').addEventListener('click', () => {
    // 检查是否有新的 Service Worker 可用
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
            for (let registration of registrations) {
                registration.update().then(() => {
                    // 清除所有的缓存
                    caches.keys().then(function(names) {
                        for (let name of names) {
                            caches.delete(name);
                        }
                    }).then(() => {
                        // 在缓存清除后重新加载页面
                        window.location.reload();
                    });
                });
            }
        });
    } else {
        // 如果浏览器不支持 Service Worker，直接重新加载页面
        window.location.reload();
    }
});
