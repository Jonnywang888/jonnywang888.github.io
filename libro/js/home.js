// 首页功能模块
class HomePage {
    constructor() {
        this.selectedUser = null;
        this.selectedBook = null;
        this.init();
    }

    init() {
        this.renderUsers();
        this.bindEvents();
    }

    // 渲染用户选择
    renderUsers() {
        const userGrid = document.getElementById('user-grid');
        if (!userGrid || !window.app.users) return;

        userGrid.innerHTML = '';
        
        window.app.users.forEach(user => {
            const userCard = document.createElement('div');
            userCard.className = 'user-card';
            userCard.dataset.userId = user.id;
            
            userCard.innerHTML = `
                <span class="user-avatar">${user.avatar}</span>
                <div class="user-name">${user.name}</div>
            `;
            
            userCard.addEventListener('click', () => this.selectUser(user.id));
            userGrid.appendChild(userCard);
        });
    }

    // 渲染书籍选择
    renderBooks() {
        const bookGrid = document.getElementById('book-grid');
        const bookSelection = document.getElementById('book-selection');
        
        if (!bookGrid || !window.app.books) return;

        bookGrid.innerHTML = '';
        
        window.app.books.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.className = 'book-card';
            bookCard.dataset.bookId = book.id;
            
            // 获取用户阅读进度
            const userProgress = storageManager.getUserProgress(this.selectedUser);
            const lastChapter = userProgress[book.id];
            const progressText = lastChapter ? `继续阅读 - ${lastChapter}` : '开始阅读';
            
            bookCard.innerHTML = `
                <div class="book-cover">${book.cover}</div>
                <div class="book-title">${book.title}</div>
                <div class="book-author">${book.author}</div>
                <div class="book-description">${book.description}</div>
                <div class="book-progress">${progressText}</div>
            `;
            
            bookCard.addEventListener('click', () => this.selectBook(book.id));
            bookGrid.appendChild(bookCard);
        });
        
        // 显示书籍选择区域
        bookSelection.style.display = 'block';
        
        // 滚动到书籍选择区域
        bookSelection.scrollIntoView({ behavior: 'smooth' });
    }

    // 渲染章节选择
    renderChapters() {
        const bookSelection = document.getElementById('book-selection');
        if (!bookSelection) return;

        // 创建章节选择区域
        let chapterSection = document.getElementById('chapter-selection');
        if (!chapterSection) {
            chapterSection = document.createElement('section');
            chapterSection.id = 'chapter-selection';
            chapterSection.className = 'chapter-selection';
            chapterSection.innerHTML = '<h2>📖 选择章节</h2><div class="chapter-grid" id="chapter-grid"></div>';
            bookSelection.appendChild(chapterSection);
        }

        const chapterGrid = document.getElementById('chapter-grid');
        if (!chapterGrid) return;

        chapterGrid.innerHTML = '';
        
        const chapters = window.app.getBookChapters(this.selectedBook);
        const userProgress = storageManager.getUserProgress(this.selectedUser);
        const lastChapter = userProgress[this.selectedBook];
        
        chapters.forEach((chapterName, index) => {
            const chapterCard = document.createElement('div');
            chapterCard.className = 'chapter-card';
            chapterCard.dataset.chapterName = chapterName;
            
            const isLastRead = lastChapter === chapterName;
            const isFirstChapter = index === 0;
            const shouldHighlight = isLastRead || (!lastChapter && isFirstChapter);
            
            if (shouldHighlight) {
                chapterCard.classList.add('recommended');
            }
            
            chapterCard.innerHTML = `
                <div class="chapter-number">第${index + 1}章</div>
                <div class="chapter-title">${chapterName}</div>
                <div class="chapter-status">${isLastRead ? '上次阅读' : isFirstChapter ? '推荐开始' : '未读'}</div>
            `;
            
            chapterCard.addEventListener('click', () => this.selectChapter(chapterName));
            chapterGrid.appendChild(chapterCard);
        });
        
        // 显示章节选择区域
        chapterSection.style.display = 'block';
        chapterSection.scrollIntoView({ behavior: 'smooth' });
    }

    // 选择用户
    selectUser(userId) {
        this.selectedUser = userId;
        window.app.setCurrentUser(userId);
        
        // 更新用户卡片样式
        document.querySelectorAll('.user-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        const selectedCard = document.querySelector(`[data-user-id="${userId}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }
        
        // 渲染书籍选择
        this.renderBooks();
        
        // 隐藏章节选择
        const chapterSection = document.getElementById('chapter-selection');
        if (chapterSection) {
            chapterSection.style.display = 'none';
        }
    }

    // 选择书籍
    selectBook(bookId) {
        this.selectedBook = bookId;
        window.app.setCurrentBook(bookId);
        
        // 更新书籍卡片样式
        document.querySelectorAll('.book-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        const selectedCard = document.querySelector(`[data-book-id="${bookId}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }
        
        // 渲染章节选择
        this.renderChapters();
    }

    // 选择章节
    selectChapter(chapterName) {
        window.app.setCurrentChapter(chapterName);
        window.app.showReaderPage();
    }

    // 绑定事件
    bindEvents() {
        // 用户卡片点击事件已在renderUsers中绑定
        // 书籍卡片点击事件已在renderBooks中绑定
        // 章节卡片点击事件已在renderChapters中绑定
    }

    // 重置选择
    resetSelection() {
        this.selectedUser = null;
        this.selectedBook = null;
        
        document.querySelectorAll('.user-card, .book-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        const bookSelection = document.getElementById('book-selection');
        const chapterSection = document.getElementById('chapter-selection');
        
        if (bookSelection) {
            bookSelection.style.display = 'none';
        }
        
        if (chapterSection) {
            chapterSection.style.display = 'none';
        }
    }
}

// 创建全局首页实例
window.homePage = new HomePage(); 