// 主应用类
class BilingualReaderApp {
    constructor() {
        this.currentUser = null;
        this.currentBook = null;
        this.currentChapter = null;
        this.books = [];
        this.users = [];
        this.isInitialized = false;
        
        this.init();
    }

    // 初始化应用
    async init() {
        try {
            this.showLoading(true);
            
            // 加载数据
            await this.loadData();
            
            // 恢复用户状态
            this.restoreUserState();
            
            // 应用设置
            this.applySettings();
            
            // 初始化事件监听
            this.initEventListeners();
            
            this.isInitialized = true;
            this.showLoading(false);
            
            // 检查是否需要直接跳转到阅读页面
            this.checkDirectNavigation();
            
        } catch (error) {
            console.error('应用初始化失败:', error);
            this.showLoading(false);
            this.showError('应用初始化失败，请刷新页面重试');
        }
    }

    // 加载数据
    async loadData() {
        try {
            // 并行加载用户和书籍数据
            const [usersResponse, booksResponse] = await Promise.all([
                fetch('data/users.json'),
                fetch('data/books.json')
            ]);

            if (!usersResponse.ok || !booksResponse.ok) {
                throw new Error('数据加载失败');
            }

            this.users = await usersResponse.json();
            this.books = await booksResponse.json();
            
        } catch (error) {
            console.error('数据加载失败:', error);
            throw error;
        }
    }

    // 恢复用户状态
    restoreUserState() {
        const currentUser = storageManager.getCurrentUser();
        const currentBook = storageManager.getCurrentBook();
        const currentChapter = storageManager.getCurrentChapter();
        
        if (currentUser && currentBook) {
            this.currentUser = currentUser;
            this.currentBook = currentBook;
            this.currentChapter = currentChapter;
        }
    }

    // 应用设置
    applySettings() {
        const settings = storageManager.getSettings();
        
        // 应用字体大小
        document.documentElement.style.setProperty('--font-size', `${settings.fontSize}px`);
        
        // 应用行距
        document.documentElement.style.setProperty('--line-height', settings.lineHeight);
        
        // 应用夜间模式
        if (settings.darkMode) {
            document.body.classList.add('dark-mode');
        }
    }

    // 初始化事件监听
    initEventListeners() {
        // 页面可见性变化事件
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.saveCurrentProgress();
            }
        });

        // 页面卸载事件
        window.addEventListener('beforeunload', () => {
            this.saveCurrentProgress();
        });

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }

    // 检查直接导航
    checkDirectNavigation() {
        if (this.currentUser && this.currentBook && this.currentChapter) {
            // 直接跳转到阅读页面
            this.showReaderPage();
        } else {
            // 显示首页
            this.showHomePage();
        }
    }

    // 显示首页
    showHomePage() {
        document.getElementById('home-page').classList.add('active');
        document.getElementById('reader-page').classList.remove('active');
        
        // 初始化首页
        if (window.homePage) {
            window.homePage.init();
        }
    }

    // 显示阅读页面
    showReaderPage() {
        document.getElementById('home-page').classList.remove('active');
        document.getElementById('reader-page').classList.add('active');
        
        // 初始化阅读页面
        if (window.readerPage) {
            window.readerPage.init();
        }
    }

    // 保存当前进度
    saveCurrentProgress() {
        if (this.currentUser && this.currentBook && this.currentChapter) {
            storageManager.saveUserProgress(
                this.currentUser,
                this.currentBook,
                this.currentChapter
            );
        }
    }

    // 处理键盘快捷键
    handleKeyboardShortcuts(e) {
        // 只在阅读页面处理快捷键
        if (!document.getElementById('reader-page').classList.contains('active')) {
            return;
        }

        switch (e.key) {
            case 'Escape':
                // ESC键返回首页
                e.preventDefault();
                this.showHomePage();
                break;
            case 't':
            case 'T':
                // T键切换翻译显示
                e.preventDefault();
                if (window.readerPage) {
                    window.readerPage.toggleAllTranslations();
                }
                break;
            case 'd':
            case 'D':
                // D键切换夜间模式
                e.preventDefault();
                this.toggleDarkMode();
                break;
            case 'ArrowLeft':
                // 左箭头键：上一章
                e.preventDefault();
                if (window.readerPage) {
                    window.readerPage.previousChapter();
                }
                break;
            case 'ArrowRight':
                // 右箭头键：下一章
                e.preventDefault();
                if (window.readerPage) {
                    window.readerPage.nextChapter();
                }
                break;
        }
    }

    // 切换夜间模式
    toggleDarkMode() {
        const settings = storageManager.getSettings();
        const newDarkMode = !settings.darkMode;
        
        storageManager.updateSetting('darkMode', newDarkMode);
        if (newDarkMode) {
            document.body.classList.add('dark-mode');
            // 如果需要，可以设置主题颜色
            document.querySelector('meta[name="theme-color"]').setAttribute('content', '#2d2d2d');
            // <meta name="theme-color" content="#4A90E2"></meta>
        } else {
            document.body.classList.remove('dark-mode');
            document.querySelector('meta[name="theme-color"]').setAttribute('content', '#4A90E2');
        }
    }

    // 显示加载状态
    showLoading(show) {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = show ? 'flex' : 'none';
        }
    }

    // 显示错误信息
    showError(message) {
        // 创建错误提示
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #ff4444;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        `;
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        // 3秒后自动移除
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 3000);
    }

    // 获取当前用户信息
    getCurrentUserInfo() {
        return this.users.find(user => user.id === this.currentUser);
    }

    // 获取当前书籍信息
    getCurrentBookInfo() {
        return this.books.find(book => book.id === this.currentBook);
    }

    // 获取当前章节信息
    getCurrentChapterInfo() {
        const book = this.getCurrentBookInfo();
        if (book && book.content && this.currentChapter) {
            return {
                title: this.currentChapter,
                sentences: book.content[this.currentChapter] || []
            };
        }
        return null;
    }

    // 获取书籍的所有章节
    getBookChapters(bookId) {
        const book = this.books.find(b => b.id === bookId);
        if (book && book.content) {
            return Object.keys(book.content);
        }
        return [];
    }

    // 设置当前用户
    setCurrentUser(userId) {
        this.currentUser = userId;
        storageManager.setCurrentUser(userId);
    }

    // 设置当前书籍
    setCurrentBook(bookId) {
        this.currentBook = bookId;
        storageManager.setCurrentBook(bookId);
    }

    // 设置当前章节
    setCurrentChapter(chapterName) {
        this.currentChapter = chapterName;
        storageManager.setCurrentChapter(chapterName);
    }
}

// 创建全局应用实例
window.app = new BilingualReaderApp(); 