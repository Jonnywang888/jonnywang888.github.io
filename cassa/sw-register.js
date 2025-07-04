// 注册Service Worker以启用PWA功能
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('Service Worker 注册成功:', registration.scope);
            })
            .catch(error => {
                console.error('Service Worker 注册失败:', error);
            });
    });
}