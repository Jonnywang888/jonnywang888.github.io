// 阅读页面功能模块
class ReaderPage {
    constructor() {
        this.currentChapter = null;
        this.sentences = [];
        this.showAllTranslations = false;
    }

    init() {
        this.loadChapter();
        this.updateHeader();
        this.bindEvents();
        this.applySettings();
    }

    // 加载章节内容
    loadChapter() {
        const chapterInfo = window.app.getCurrentChapterInfo();
        if (!chapterInfo) {
            console.error('无法加载章节');
            return;
        }

        this.currentChapter = chapterInfo;
        this.sentences = chapterInfo.sentences;
        this.renderContent();
    }

    // 渲染内容
    renderContent() {
        const chapterContent = document.getElementById('chapter-content');
        if (!chapterContent || !this.sentences.length) {
            console.error('无法渲染内容');
            return;
        }

        chapterContent.innerHTML = '';
        
        this.sentences.forEach((sentence, index) => {
            const sentencePair = document.createElement('div');
            sentencePair.className = 'sentence-pair';
            sentencePair.dataset.sentenceIndex = index;
            
            sentencePair.innerHTML = `
                <div class="italian-sentence">${sentence.ita}</div>
                <div class="chinese-sentence ${this.showAllTranslations ? '' : 'hidden'}">${sentence.chi}</div>
                <div class="sentence-controls">
                    <button class="toggle-translation-btn btn-small" data-index="${index}">
                        ${this.showAllTranslations ? '隐藏' : '显示'}
                    </button>
                </div>
            `;
            
            chapterContent.appendChild(sentencePair);
        });

        // 绑定句子级别的翻译切换事件
        this.bindSentenceEvents();
        
        // 确保全局按钮状态正确
        const toggleAllBtn = document.getElementById('toggle-all-translations');
        if (toggleAllBtn) {
            toggleAllBtn.textContent = this.showAllTranslations ? '隐藏全部' : '显示全部';
        }
    }

    // 绑定句子级别事件
    bindSentenceEvents() {
        document.querySelectorAll('.toggle-translation-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.toggleSentenceTranslation(index);
            });
        });
    }

    // 切换单个句子翻译
    toggleSentenceTranslation(index) {
        const sentencePair = document.querySelector(`[data-sentence-index="${index}"]`);
        if (!sentencePair) return;

        const chineseSentence = sentencePair.querySelector('.chinese-sentence');
        const toggleBtn = sentencePair.querySelector('.toggle-translation-btn');
        
        if (chineseSentence.classList.contains('hidden')) {
            chineseSentence.classList.remove('hidden');
            toggleBtn.textContent = '隐藏';
        } else {
            chineseSentence.classList.add('hidden');
            toggleBtn.textContent = '显示';
        }
    }

    // 更新页面头部
    updateHeader() {
        const bookInfo = window.app.getCurrentBookInfo();
        const chapterInfo = this.currentChapter;
        
        if (bookInfo) {
            document.getElementById('current-book-title').textContent = bookInfo.title;
        }
        
        if (chapterInfo) {
            document.getElementById('current-chapter-title').textContent = chapterInfo.title;
        }
    }

    // 绑定事件
    bindEvents() {
        // 返回按钮
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                window.app.showHomePage();
            });
        }

        // 上一章按钮
        const prevChapterBtn = document.getElementById('prev-chapter-btn');
        if (prevChapterBtn) {
            prevChapterBtn.addEventListener('click', () => {
                this.previousChapter();
            });
        }

        // 下一章按钮
        const nextChapterBtn = document.getElementById('next-chapter-btn');
        if (nextChapterBtn) {
            nextChapterBtn.addEventListener('click', () => {
                this.nextChapter();
            });
        }

        // 全局翻译切换
        const toggleAllBtn = document.getElementById('toggle-all-translations');
        if (toggleAllBtn) {
            toggleAllBtn.addEventListener('click', () => {
                this.toggleAllTranslations();
            });
        }

        // 设置按钮
        const settingsBtn = document.getElementById('settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                this.openSettings();
            });
        }

        // 关闭设置按钮
        const closeSettingsBtn = document.getElementById('close-settings');
        if (closeSettingsBtn) {
            closeSettingsBtn.addEventListener('click', () => {
                this.closeSettings();
            });
        }

        // 设置面板点击外部关闭
        const settingsPanel = document.getElementById('settings-panel');
        if (settingsPanel) {
            settingsPanel.addEventListener('click', (e) => {
                if (e.target === settingsPanel) {
                    this.closeSettings();
                }
            });
        }

        // 字体大小设置
        const fontSizeSlider = document.getElementById('font-size');
        if (fontSizeSlider) {
            fontSizeSlider.addEventListener('input', (e) => {
                this.updateFontSize(e.target.value);
            });
        }

        // 行距设置
        const lineHeightSlider = document.getElementById('line-height');
        if (lineHeightSlider) {
            lineHeightSlider.addEventListener('input', (e) => {
                this.updateLineHeight(e.target.value);
            });
        }

        // 夜间模式设置
        const darkModeCheckbox = document.getElementById('dark-mode');
        if (darkModeCheckbox) {
            darkModeCheckbox.addEventListener('change', (e) => {
                this.toggleDarkMode(e.target.checked);
            });
        }
    }

    // 切换全局翻译显示
    toggleAllTranslations() {
        this.showAllTranslations = !this.showAllTranslations;
        
        const chineseSentences = document.querySelectorAll('.chinese-sentence');
        const toggleBtns = document.querySelectorAll('.toggle-translation-btn');
        const toggleAllBtn = document.getElementById('toggle-all-translations');
        
        chineseSentences.forEach((sentence, index) => {
            if (this.showAllTranslations) {
                sentence.classList.remove('hidden');
                if (toggleBtns[index]) {
                    toggleBtns[index].textContent = '隐藏';
                }
            } else {
                sentence.classList.add('hidden');
                if (toggleBtns[index]) {
                    toggleBtns[index].textContent = '显示';
                }
            }
        });
        
        if (toggleAllBtn) {
            toggleAllBtn.textContent = this.showAllTranslations ? '隐藏全部' : '显示全部';
        }
        
        // 保存设置
        storageManager.updateSetting('showAllTranslations', this.showAllTranslations);
    }

    // 打开设置面板
    openSettings() {
        const settingsPanel = document.getElementById('settings-panel');
        if (settingsPanel) {
            settingsPanel.classList.add('open');
            this.loadSettingsValues();
        }
    }

    // 关闭设置面板
    closeSettings() {
        const settingsPanel = document.getElementById('settings-panel');
        if (settingsPanel) {
            settingsPanel.classList.remove('open');
        }
    }

    // 加载设置值
    loadSettingsValues() {
        const settings = storageManager.getSettings();
        
        const fontSizeSlider = document.getElementById('font-size');
        const fontSizeValue = document.getElementById('font-size-value');
        if (fontSizeSlider && fontSizeValue) {
            fontSizeSlider.value = settings.fontSize;
            fontSizeValue.textContent = `${settings.fontSize}px`;
        }
        
        const lineHeightSlider = document.getElementById('line-height');
        const lineHeightValue = document.getElementById('line-height-value');
        if (lineHeightSlider && lineHeightValue) {
            lineHeightSlider.value = settings.lineHeight;
            lineHeightValue.textContent = settings.lineHeight;
        }
        
        const darkModeCheckbox = document.getElementById('dark-mode');
        if (darkModeCheckbox) {
            darkModeCheckbox.checked = settings.darkMode;
        }
    }

    // 更新字体大小
    updateFontSize(size) {
        const fontSizeValue = document.getElementById('font-size-value');
        if (fontSizeValue) {
            fontSizeValue.textContent = `${size}px`;
        }
        document.documentElement.style.setProperty('--font-size', `${size}px`);
        storageManager.updateSetting('fontSize', parseInt(size));
    }

    // 更新行距
    updateLineHeight(height) {
        const lineHeightValue = document.getElementById('line-height-value');
        if (lineHeightValue) {
            lineHeightValue.textContent = height;
        }
        
        document.documentElement.style.setProperty('--line-height', height);
        storageManager.updateSetting('lineHeight', parseFloat(height));
    }

    // 切换夜间模式
    toggleDarkMode(enabled) {
        if (enabled) {
            document.body.classList.add('dark-mode');
            document.querySelector('meta[name="theme-color"]').setAttribute('content', '#2d2d2d');
        } else {
            document.body.classList.remove('dark-mode');
            document.querySelector('meta[name="theme-color"]').setAttribute('content', '#4A90E2');

        }
        storageManager.updateSetting('darkMode', enabled);
    }

    // 应用设置
    applySettings() {
        const settings = storageManager.getSettings();
        this.showAllTranslations = settings.showAllTranslations;
        
        // 重新渲染以应用翻译显示设置
        if (this.sentences.length) {
            this.renderContent();
            
            // 确保全局按钮状态正确
            const toggleAllBtn = document.getElementById('toggle-all-translations');
            if (toggleAllBtn) {
                toggleAllBtn.textContent = this.showAllTranslations ? '隐藏全部' : '显示全部';
            }
        }
    }

    // 跳转到下一章
    nextChapter() {
        const chapters = window.app.getBookChapters(window.app.currentBook);
        const currentIndex = chapters.indexOf(window.app.currentChapter);
        
        if (currentIndex < chapters.length - 1) {
            const nextChapter = chapters[currentIndex + 1];
            window.app.setCurrentChapter(nextChapter);
            this.loadChapter();
            this.updateHeader();
        }
    }

    // 跳转到上一章
    previousChapter() {
        const chapters = window.app.getBookChapters(window.app.currentBook);
        const currentIndex = chapters.indexOf(window.app.currentChapter);
        
        if (currentIndex > 0) {
            const prevChapter = chapters[currentIndex - 1];
            window.app.setCurrentChapter(prevChapter);
            this.loadChapter();
            this.updateHeader();
        }
    }
}

// 创建全局阅读页面实例
window.readerPage = new ReaderPage(); 