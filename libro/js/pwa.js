// PWA 功能模块
class PWA {
    constructor() {
        this.init();
    }

    init() {
        this.registerServiceWorker();
        this.initInstallPrompt();
    }

    // 注册服务工作者
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('sw.js');
                console.log('Service Worker 注册成功:', registration);
            } catch (error) {
                console.error('Service Worker 注册失败:', error);
            }
        }
    }

    // 初始化安装提示
    initInstallPrompt() {
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            // 阻止默认的安装提示
            e.preventDefault();
            
            // 保存事件以便稍后使用
            deferredPrompt = e;
            
            // 显示自定义安装按钮（如果需要）
            this.showInstallButton();
        });

        // 监听应用安装完成
        window.addEventListener('appinstalled', () => {
            console.log('应用已安装');
            this.hideInstallButton();
        });
    }

    // 显示安装按钮
    showInstallButton() {
        // 可以在这里添加自定义安装按钮的显示逻辑
        console.log('可以安装应用');
    }

    // 隐藏安装按钮
    hideInstallButton() {
        // 可以在这里添加隐藏安装按钮的逻辑
        console.log('应用已安装，隐藏安装按钮');
    }

    // 触发安装
    async triggerInstall() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            
            const { outcome } = await this.deferredPrompt.userChoice;
            console.log('用户选择:', outcome);
            
            this.deferredPrompt = null;
        }
    }
}

// 创建全局PWA实例
window.pwa = new PWA(); 