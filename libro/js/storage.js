// 本地存储管理
class StorageManager {
    constructor() {
        this.storageKey = 'bilingual-reader';
    }

    // 获取存储数据
    getData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : this.getDefaultData();
        } catch (error) {
            console.error('读取本地存储失败:', error);
            return this.getDefaultData();
        }
    }

    // 保存数据
    saveData(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (error) {
            console.error('保存到本地存储失败:', error);
        }
    }

    // 获取默认数据
    getDefaultData() {
        return {
            currentUser: null,
            currentBook: null,
            currentChapter: null,
            readingProgress: {},
            settings: {
                fontSize: 16,
                lineHeight: 1.6,
                darkMode: false,
                showAllTranslations: false
            }
        };
    }

    // 获取当前用户
    getCurrentUser() {
        return this.getData().currentUser;
    }

    // 设置当前用户
    setCurrentUser(userId) {
        const data = this.getData();
        data.currentUser = userId;
        this.saveData(data);
    }

    // 获取当前书籍
    getCurrentBook() {
        return this.getData().currentBook;
    }

    // 设置当前书籍
    setCurrentBook(bookId) {
        const data = this.getData();
        data.currentBook = bookId;
        this.saveData(data);
    }

    // 获取当前章节
    getCurrentChapter() {
        return this.getData().currentChapter;
    }

    // 设置当前章节
    setCurrentChapter(chapterName) {
        const data = this.getData();
        data.currentChapter = chapterName;
        this.saveData(data);
    }

    // 获取用户阅读进度
    getUserProgress(userId) {
        const data = this.getData();
        return data.readingProgress[userId] || {};
    }

    // 保存用户阅读进度
    saveUserProgress(userId, bookId, status) {
        const data = this.getData();
        if (!data.readingProgress[userId]) {
            data.readingProgress[userId] = {};
        }
        data.readingProgress[userId][bookId] = status;
        this.saveData(data);
    }

    // 获取设置
    getSettings() {
        return this.getData().settings;
    }

    // 保存设置
    saveSettings(settings) {
        const data = this.getData();
        data.settings = { ...data.settings, ...settings };
        this.saveData(data);
    }

    // 更新单个设置
    updateSetting(key, value) {
        const settings = this.getSettings();
        settings[key] = value;
        this.saveSettings(settings);
    }

    // 清除所有数据
    clearAll() {
        try {
            localStorage.removeItem(this.storageKey);
        } catch (error) {
            console.error('清除本地存储失败:', error);
        }
    }

    // 导出数据
    exportData() {
        return this.getData();
    }

    // 导入数据
    importData(data) {
        try {
            this.saveData(data);
            return true;
        } catch (error) {
            console.error('导入数据失败:', error);
            return false;
        }
    }
}

// 创建全局存储实例
window.storageManager = new StorageManager(); 