// ══════════════════════════════════════
// EVENT BINDINGS
// ══════════════════════════════════════

// Navigation
document.querySelectorAll('.nav-btn').forEach(function(btn) {
  btn.addEventListener('click', function() { navigateTo(btn.dataset.page); });
});

// Theme toggle (top bar)
document.getElementById('theme-btn').onclick = function() {
  state.settings.dark = !state.settings.dark;
  applyTheme();
  saveState();
};

// Settings — dark toggle
document.getElementById('dark-toggle').onclick = function() {
  state.settings.dark = !state.settings.dark;
  this.classList.toggle('on', state.settings.dark);
  applyTheme();
  saveState();
};

// Settings — translation toggle
document.getElementById('translate-toggle').onclick = function() {
  state.settings.showTranslation = !state.settings.showTranslation;
  this.classList.toggle('on', state.settings.showTranslation);
  saveState();
};

// Settings — highlight toggle
document.getElementById('highlight-toggle').onclick = function() {
  state.settings.highlightWords = !state.settings.highlightWords;
  this.classList.toggle('on', state.settings.highlightWords);
  saveState();
};

// Settings — font size buttons
document.querySelectorAll('.font-size-btn').forEach(function(btn) {
  btn.onclick = function() {
    state.settings.fontSize = this.dataset.size;
    document.querySelectorAll('.font-size-btn').forEach(function(b) { b.classList.remove('active'); });
    this.classList.add('active');
    applyFontSize();
    saveState();
  };
});

// Settings — login
document.getElementById('login-btn').onclick = function() {
  var u = document.getElementById('login-username').value.trim();
  var p = document.getElementById('login-password').value.trim();
  if(!u || !p) { showLoginMsg('请输入用户名和密码'); return; }

  var btn = this;
  btn.disabled = true;
  btn.textContent = '登录中…';

  fetch(LOGIN_URL + '?action=login&id=' + encodeURIComponent(u) + '&pin=' + encodeURIComponent(p))
    .then(function(r) { return r.ok ? r.json() : null; })
    .then(function(data) {
      btn.disabled = false;
      btn.textContent = '登录';
      if (data && data.login) {
        state.user = { username: u, token: data.token };
        BOOKS_URL = '/books/' + encodeURIComponent(u);
        saveState();
        renderSettings();
        showToast('欢迎回来，' + u + '！');
        loadBooksFromServer().then(function() {
          if (state.currentPage === 'home') renderHome();
          if (state.currentPage === 'reading') renderReadingIndex();
          syncAfterLogin();
        });
      } else {
        showLoginMsg('用户名或密码错误');
      }
    })
    .catch(function() {
      btn.disabled = false;
      btn.textContent = '登录';
      showLoginMsg('登录失败，请检查网络');
    });
};

// Settings — register
document.getElementById('register-btn').onclick = function() {
  var u = document.getElementById('login-username').value.trim();
  if(!u) { showLoginMsg('请输入用户名'); return; }
  state.user = { username: u };
  saveState();
  renderSettings();
  showToast('账号已创建，欢迎 ' + u + '！');
};

// Settings — logout
document.getElementById('logout-btn').onclick = function() {
  state.user = null;
  BOOKS_URL = '/books';
  saveState();
  renderSettings();
  showToast('已退出登录');
};

// Settings — export vocab
document.getElementById('export-btn').onclick = function() {
  var data = state.vocab.map(function(w) { return w.word + '\t' + w.translation + '\t' + (w.example || ''); }).join('\n');
  var blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'italiano_vocab.txt';
  a.click();
  showToast('生词本已导出');
};

// Settings — clear data
document.getElementById('clear-data-btn').onclick = function() {
  if(confirm('确定要清除所有数据吗？此操作不可撤销。')) {
    state.vocab = [];
    state.progress = {};
    state.progressUpdatedAt = {};
    state.readLog = {};
    state.stats = { totalSentences: 0 };
    state.lastSync = null;
    saveState();
    showToast('数据已清除');
    renderSettings();
  }
};

// Word highlight click (delegated)
document.addEventListener('click', function(e) {
  if(e.target.closest('.word-highlight')) {
    var word = e.target.dataset.word;
    showContextMenu(word, e);
    e.stopPropagation();
  }
});

// Close context menu on outside click
document.addEventListener('click', function(e) {
  if(!e.target.closest('.ctx-menu') && !e.target.closest('.word-highlight')) {
    document.getElementById('ctx-menu').classList.remove('visible');
  }
});

// Context menu — add to vocab
document.getElementById('ctx-add').onclick = function() {
  document.getElementById('ctx-menu').classList.remove('visible');
  openAddModal(state.selectedWord, lastTranslation);
};

// Context menu — translate
document.getElementById('ctx-explain').onclick = function() {
  var resultEl = document.getElementById('ctx-result');
  var textEl = document.getElementById('ctx-result-text');
  textEl.textContent = '翻译中…';
  resultEl.style.display = 'block';

  translateWord(state.selectedWord).then(function(translated) {
    if (translated) {
      textEl.textContent = translated;
    } else {
      textEl.textContent = '翻译失败，请重试';
    }
  });
};

// Reading back buttons
document.getElementById('back-to-books').onclick = function() {
  document.getElementById('reading-book-sel').style.display = 'block';
  document.getElementById('reading-chapter-sel').style.display = 'none';
  renderBookList();
};

document.getElementById('back-to-chapters').onclick = function() {
  if(state.currentBook) showChapterList(state.currentBook);
};

// Vocab search
document.getElementById('vocab-search').addEventListener('input', function() { renderVocab(); });

// Vocab book filter
document.getElementById('vocab-book-filter').addEventListener('change', function() {
  vocabBookFilter = this.value;
  document.getElementById('vocab-search').value = '';
  renderVocab();
});

// Manual add word button
document.getElementById('vocab-add-btn').onclick = function() {
  openAddModal('', '');
};

// Modal handlers
document.getElementById('modal-cancel').onclick = function() {
  document.getElementById('add-modal').classList.remove('visible');
  editingWord = null;
};

document.getElementById('modal-save').onclick = function() {
  // Read word from display (auto-selected) or manual input
  var wordInput = document.getElementById('modal-word-input');
  var word = wordInput.style.display === 'none'
    ? document.getElementById('modal-word').textContent
    : wordInput.value.trim();
  if(!word) { showToast('请输入单词'); return; }
  var trans = document.getElementById('modal-translation').value.trim();
  if(!trans) { showToast('请输入翻译'); return; }

  if (editingWord) {
    // Update existing word
    editingWord.translation = trans;
    editingWord.example = document.getElementById('modal-example').value.trim();
    editingWord.updatedAt = Date.now();
    saveState();
    document.getElementById('add-modal').classList.remove('visible');
    showToast('"' + word + '" 已更新');
    editingWord = null;
    renderVocab();
    syncNow();
  } else {
    // Check duplicate for manual add
    var existing = state.vocab.find(function(w) { return w.word.toLowerCase() === word.toLowerCase(); });
    if(existing) { showToast('"' + word + '" 已在生词本中'); return; }
    // Add new word
    var now = Date.now();
    state.vocab.push({
      word: word,
      translation: trans,
      example: document.getElementById('modal-example').value.trim(),
      addedAt: now,
      updatedAt: now,
      deleted: false,
      bookTitle: wordInput.style.display === 'none'
        ? (state.currentBook ? state.currentBook.title : null)
        : (vocabBookFilter || (state.currentBook ? state.currentBook.title : null))
    });
    saveState();
    document.getElementById('add-modal').classList.remove('visible');
    showToast('"' + word + '" 已添加到生词本 ✓');
    if(state.currentChapter) renderSentences(state.currentChapter);
    renderVocab();
    syncNow();
  }
};

document.getElementById('add-modal').addEventListener('click', function(e) {
  if(e.target === document.getElementById('add-modal')) {
    document.getElementById('add-modal').classList.remove('visible');
    editingWord = null;
  }
});

// Word detail modal
document.getElementById('detail-close').onclick = function() {
  document.getElementById('detail-modal').classList.remove('visible');
};
document.getElementById('detail-modal').addEventListener('click', function(e) {
  if(e.target === document.getElementById('detail-modal')) {
    document.getElementById('detail-modal').classList.remove('visible');
  }
});

// ══════════════════════════════════════
// SYNC — foreground check
// ══════════════════════════════════════
document.addEventListener('visibilitychange', function() {
  if (!document.hidden && state.user && state.user.token) {
    syncPushPull();
  }
});

// ══════════════════════════════════════
// SERVICE WORKER
// ══════════════════════════════════════
if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('js/sw.js').catch(function() {});
}

// ══════════════════════════════════════
// INIT
// ══════════════════════════════════════
(function init() {
  loadState();
  applyTheme();
  applyFontSize();
  renderHome();

  // Load books from server, then re-render
  loadBooksFromServer().then(function(count) {
    // Always re-render to replace the "loading..." placeholder
    if (state.currentPage === 'home') renderHome();
    if (state.currentPage === 'reading') renderReadingIndex();

    // Sync if user is logged in
    if (state.user && state.user.token) {
      syncAfterLogin();
    }

    // Seed demo vocab only on fresh session with no books from server
    if (count === 0 && state.vocab.length === 0 && state.stats.totalSentences === 0) {
      seedDemoData();
      renderHome();
    }
  }).catch(function() {
    if (state.vocab.length === 0 && state.stats.totalSentences === 0) {
      seedDemoData();
      renderHome();
    }
  });

  function seedDemoData() {
    var now = Date.now();
    state.vocab = [];
    state.readLog[todayKey()] = 5;
    var yesterday = new Date(); yesterday.setDate(yesterday.getDate()-1);
    var yKey = yesterday.getFullYear() + '-' + String(yesterday.getMonth()+1).padStart(2,'0') + '-' + String(yesterday.getDate()).padStart(2,'0');
    state.readLog[yKey] = 12;
    state.stats.totalSentences = 17;
    saveState();
  }
})();
document.addEventListener('contextmenu', e => e.preventDefault());