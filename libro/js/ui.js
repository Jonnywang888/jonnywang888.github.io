// ══════════════════════════════════════
// SHARED STATE
// ══════════════════════════════════════
var editingWord = null;
var vocabBookFilter = null;

// ══════════════════════════════════════
// NAVIGATION
// ══════════════════════════════════════
function navigateTo(page) {
  state.currentPage = page;
  document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
  document.querySelectorAll('.nav-btn').forEach(function(b) { b.classList.remove('active'); });
  document.getElementById(page + '-page').classList.add('active');
  document.querySelector('.nav-btn[data-page="' + page + '"]').classList.add('active');

  var titles = { home:'Italiano', reading:'阅读', vocab:'生词本', stats:'学习统计', settings:'设置' };
  document.getElementById('page-title').textContent = titles[page] || 'Italiano';

  if(page === 'home') renderHome();
  if(page === 'vocab') {
    vocabBookFilter = state.currentBook ? state.currentBook.title : null;
    renderVocab();
  }
  if(page === 'stats') renderStats();
  if(page === 'settings') renderSettings();
  if(page === 'reading') renderReadingIndex();

  document.getElementById('content').scrollTop = 0;
}

// ══════════════════════════════════════
// HOME PAGE
// ══════════════════════════════════════
function renderHome() {
  var hour = new Date().getHours();
  var greetings = [
    [5,12,'Buongiorno','今天也一起阅读意大利语吧'],
    [12,17,'Buon pomeriggio','午后阅读，最是惬意'],
    [17,21,'Buona sera','傍晚是沉浸阅读的好时光'],
    [21,24,'Buona notte','睡前再读几句意大利语']
  ];
  var g = greetings.find(function(a) { return hour >= a[0] && hour < a[1]; }) || greetings[0];
  document.getElementById('greeting-text').textContent = g[2];
  document.getElementById('greeting-sub').textContent = g[3];

  var today = todayKey();
  document.getElementById('today-sentences').textContent = state.readLog[today] || 0;
  document.getElementById('streak-num').textContent = calcStreak();
  document.getElementById('total-words').textContent = state.vocab.length;
  document.getElementById('total-sentences').textContent = state.stats.totalSentences || 0;

  // Show only the most recently read book (or prompt if none)
  var booksEl = document.getElementById('home-books');
  booksEl.innerHTML = '';
  if (BOOKS.length === 0) {
    booksEl.innerHTML = '<p style="font-size:13px; color:var(--text3); padding:12px 0">正在从服务器加载书籍…</p>';
  } else {
    // Find the most recently read book
    var recentBook = null;
    var recentTime = 0;
    BOOKS.forEach(function(book) {
      var t = state.lastReadAt[book.id] || 0;
      if (t > recentTime) { recentTime = t; recentBook = book; }
    });
    // If no book was ever read, pick the first one in BOOKS
    if (!recentBook) recentBook = BOOKS[0];

    var prog = getBookProgress(recentBook);
    var card = document.createElement('div');
    card.className = 'book-card';
    card.innerHTML =
      '<div class="book-cover">' + recentBook.emoji + '</div>' +
      '<div style="flex:1">' +
        '<div class="book-title">' + recentBook.title + '</div>' +
        '<div class="book-author">' + recentBook.author + ' · ' + recentBook.level + '</div>' +
        '<div class="progress-bar"><div class="progress-fill" style="width:' + prog.pct + '%"></div></div>' +
        '<div class="progress-txt">' + prog.done + ' / ' + prog.total + ' 句</div>' +
        '<button class="resume-btn">' + (prog.done > 0 ? '继续阅读' : '开始阅读') + '</button>' +
      '</div>';
    card.querySelector('.resume-btn').addEventListener('click', function(e) {
      e.stopPropagation();
      openBook(recentBook.id);
    });
    booksEl.appendChild(card);
  }

  // Recent vocab
  var recentEl = document.getElementById('recent-words-home');
  recentEl.innerHTML = '';
  var recent = [].concat(state.vocab).reverse().slice(0, 8);
  if(recent.length === 0) {
    recentEl.innerHTML = '<p style="font-size:13px; color:var(--text3)">长按阅读中的单词即可添加生词</p>';
  } else {
    recent.forEach(function(w) {
      var pill = document.createElement('span');
      pill.className = 'word-pill';
      pill.innerHTML = '<span class="word-pill-it">' + w.word + '</span><span class="word-pill-zh">' + w.translation + '</span>';
      pill.onclick = function() { navigateTo('vocab'); };
      recentEl.appendChild(pill);
    });
  }
}

// ══════════════════════════════════════
// READING PAGE
// ══════════════════════════════════════
function renderReadingIndex() {
  // Resume from last reading position if available
  if (state.currentBook) {
    var book = state.currentBook;
    // Find the chapter to resume
    var chapter = state.currentChapter;
    if (!chapter) {
      // Look for saved progress in this book
      var bookProg = state.progress[book.id];
      if (bookProg) {
        var bestIdx = -1;
        Object.keys(bookProg).forEach(function(chId) {
          if (bookProg[chId] > bestIdx) {
            bestIdx = bookProg[chId];
            var found = book.chapters.find(function(ch) { return ch.id === chId; });
            if (found) chapter = found;
          }
        });
      }
      // Fallback: first chapter
      if (!chapter && book.chapters.length > 0) chapter = book.chapters[0];
    }
    if (chapter) {
      openChapter(book, chapter);
      return;
    }
  }

  // No previous position — show book selection
  document.getElementById('reading-book-sel').style.display = 'block';
  document.getElementById('reading-chapter-sel').style.display = 'none';
  document.getElementById('reading-view').style.display = 'none';

  renderBookList();
}

// ══════════════════════════════════════
// BOOK LIST (sorted, with completed filter)
// ══════════════════════════════════════
var showCompletedBooks = false;

function renderBookList() {
  var list = document.getElementById('book-sel-list');
  var hint = document.getElementById('book-filter-hint');
  var btn = document.getElementById('book-filter-btn');
  list.innerHTML = '';

  if (BOOKS.length === 0) {
    list.innerHTML = '<p style="font-size:13px; color:var(--text3); padding:12px 0">正在从服务器加载书籍…</p>';
    hint.textContent = '';
    btn.style.display = 'none';
    return;
  }

  // Sort by lastReadAt descending (most recent first), unreached at the end
  var sorted = [].concat(BOOKS).sort(function(a, b) {
    var ta = state.lastReadAt[a.id] || 0;
    var tb = state.lastReadAt[b.id] || 0;
    return tb - ta;
  });

  var completed = [];
  var active = [];
  sorted.forEach(function(book) {
    var prog = getBookProgress(book);
    if (prog.pct >= 100) {
      completed.push(book);
    } else {
      active.push(book);
    }
  });

  var visible = active.concat(showCompletedBooks ? completed : []);
  var hiddenCount = completed.length;

  if (hiddenCount > 0) {
    hint.textContent = '已隐藏 ' + hiddenCount + ' 本已读';
    btn.style.display = 'inline-block';
    btn.textContent = showCompletedBooks ? '隐藏已读' : '显示全部';
    btn.onclick = function() {
      showCompletedBooks = !showCompletedBooks;
      renderBookList();
    };
  } else {
    hint.textContent = '';
    btn.style.display = 'none';
  }

  if (visible.length === 0) {
    list.innerHTML = '<p style="font-size:13px; color:var(--text3); padding:12px 0">没有更多书籍了</p>';
    return;
  }

  visible.forEach(function(book) {
    var prog = getBookProgress(book);
    var item = document.createElement('div');
    item.className = 'book-item-sel' + (state.currentBook && state.currentBook.id === book.id ? ' selected' : '');
    item.innerHTML =
      '<div class="book-cover">' + book.emoji + '</div>' +
      '<div style="flex:1">' +
        '<div class="book-title">' + book.title + '</div>' +
        '<div class="book-author">' + book.author + '</div>' +
        '<div class="progress-bar" style="margin-top:8px"><div class="progress-fill" style="width:' + prog.pct + '%"></div></div>' +
        '<div class="progress-txt">' + prog.pct + '% · ' + prog.done + '/' + prog.total + '句</div>' +
      '</div>';
    item.onclick = function() { openBook(book.id); };
    list.appendChild(item);
  });
}

function openBook(bookId) {
  var book = BOOKS.find(function(b) { return b.id === bookId; });
  if(!book) return;
  state.currentBook = book;
  navigateTo('reading');
  showChapterList(book);
}

function showChapterList(book) {
  document.getElementById('reading-book-sel').style.display = 'none';
  document.getElementById('reading-chapter-sel').style.display = 'block';
  document.getElementById('reading-view').style.display = 'none';
  document.getElementById('chapter-sel-book-title').textContent = book.title;

  var list = document.getElementById('chapter-list');
  list.innerHTML = '';
  book.chapters.forEach(function(ch, i) {
    var prog = state.progress[book.id];
    var isDone = prog && prog[ch.id] !== undefined && prog[ch.id] >= ch.sentences.length - 1;
    var item = document.createElement('div');
    item.className = 'chapter-item' + (isDone ? ' done' : '');
    item.innerHTML =
      '<div class="chapter-num">' + (isDone ? '✓' : i+1) + '</div>' +
      '<div style="flex:1">' +
        '<div class="chapter-name">' + ch.title + '</div>' +
        '<div class="chapter-count">' + (ch.subtitle || '') + ' · ' + ch.sentences.length + '句</div>' +
      '</div>' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" stroke-width="1.5"><path d="M9 18l6-6-6-6"/></svg>';
    item.onclick = function() { openChapter(book, ch); };
    list.appendChild(item);
  });
}

function openChapter(book, chapter) {
  state.currentBook = book;
  state.currentChapter = chapter;
  state.lastReadAt[book.id] = Date.now();
  saveState();
  document.getElementById('reading-book-sel').style.display = 'none';
  document.getElementById('reading-chapter-sel').style.display = 'none';
  document.getElementById('reading-view').style.display = 'block';
  document.getElementById('reading-chapter-name').textContent = book.title + ' · ' + chapter.title;
  renderSentences(chapter);
}

function renderSentences(chapter) {
  var container = document.getElementById('sentences-list');
  container.innerHTML = '';
  var savedPos = (state.progress[state.currentBook.id] || {})[chapter.id] || 0;

  chapter.sentences.forEach(function(sent, idx) {
    var block = document.createElement('div');
    block.className = 'sentence-block' + (idx === savedPos ? ' current' : '');
    block.dataset.idx = idx;

    var wordMap = createHighlightedText(sent.it);
    var showTrans = state.settings.showTranslation;

    block.innerHTML =
      '<div class="sentence-it">' + wordMap  +
        '<button class="translate-btn" title="翻译">翻译</button>' +
      '</div>' +
      '<div class="sentence-zh' + (showTrans ? ' visible' : '') + '">' + sent.zh + '</div>';

    // Translate button — toggle translation visibility
    block.querySelector('.translate-btn').addEventListener('click', function(e) {
      e.stopPropagation();
      block.querySelector('.sentence-zh').classList.toggle('visible');
    });

    block.addEventListener('click', function(e) {
      if(e.target.closest('.word-highlight')) return;
      if(e.target.closest('.translate-btn')) return;

      // Update progress — record last-clicked sentence as reading position
      var prev = (state.progress[state.currentBook.id] || {})[chapter.id] || 0;
      trackProgress(state.currentBook.id, chapter.id, idx);
      // Only count genuinely new sentences toward stats
      if(idx > prev) {
        var today = todayKey();
        state.readLog[today] = (state.readLog[today] || 0) + (idx - prev);
        state.stats.totalSentences = (state.stats.totalSentences || 0) + (idx - prev);
      }
      saveState();

      document.querySelectorAll('.sentence-block').forEach(function(b) { b.classList.remove('current'); });
      block.classList.add('current');
      updateProgressTxt(chapter);
      scheduleSync(5000);
    });

    setupLongPress(block);
    container.appendChild(block);
  });

  updateProgressTxt(chapter);
  applyFontSize();

  setTimeout(function() {
    var cur = container.querySelector('.sentence-block[data-idx="' + savedPos + '"]');
    if(cur) cur.scrollIntoView({ behavior: 'auto', block: 'center' });
  });
}

function updateProgressTxt(chapter) {
  var prog = (state.progress[state.currentBook.id] || {})[chapter.id] || 0;
  document.getElementById('reading-progress-txt').textContent = (prog+1) + '/' + chapter.sentences.length;
}

// ── LONG PRESS / WORD SELECTION ──
var longPressTimer;
function setupLongPress(block) {
  block.addEventListener('mouseup', function() { clearTimeout(longPressTimer); });
  block.addEventListener('touchend', function(e) {
    clearTimeout(longPressTimer);
    var sel = window.getSelection ? window.getSelection().toString().trim() : '';
    if(sel && sel.length > 0 && sel.length < 30) showContextMenu(sel, e.changedTouches[0]);
  });
  block.addEventListener('mouseup', function(e) {
    var sel = window.getSelection ? window.getSelection().toString().trim() : '';
    if(sel && sel.length > 0 && sel.length < 30) showContextMenu(sel, e);
  });
}

// ── CONTEXT MENU ──
function showContextMenu(word, e) {
  state.selectedWord = word;
  lastTranslation = '';
  var menu = document.getElementById('ctx-menu');
  document.getElementById('ctx-word-display').textContent = word;
  document.getElementById('ctx-result').style.display = 'none';
  menu.classList.add('visible');
  var x = Math.min(e.clientX || e.pageX, window.innerWidth - 180);
  var y = Math.min(e.clientY || e.pageY, window.innerHeight - 120);
  menu.style.left = x + 'px';
  menu.style.top = y + 'px';
}

// ══════════════════════════════════════
// VOCAB PAGE
// ══════════════════════════════════════
function renderVocab(filter) {
  var query = filter || document.getElementById('vocab-search').value.toLowerCase();

  // Build book filter options from vocab
  var bookTitles = [];
  state.vocab.forEach(function(w) {
    var t = w.bookTitle || '未归类';
    if(bookTitles.indexOf(t) === -1) bookTitles.push(t);
  });
  bookTitles.sort();

  // Populate book filter dropdown
  var sel = document.getElementById('vocab-book-filter');
  var currentVal = sel.value;
  sel.innerHTML = '<option value="">全部生词 (' + state.vocab.length + ')</option>';
  bookTitles.forEach(function(t) {
    var count = state.vocab.filter(function(w) { return (w.bookTitle || '未归类') === t; }).length;
    sel.innerHTML += '<option value="' + t + '">' + t + ' (' + count + ')</option>';
  });
  // Restore previous selection, or default to current reading book
  if(currentVal && bookTitles.indexOf(currentVal) !== -1) {
    sel.value = currentVal;
  } else if(vocabBookFilter && bookTitles.indexOf(vocabBookFilter) !== -1) {
    sel.value = vocabBookFilter;
  } else {
    sel.value = '';
  }

  // Filter by selected book — also exclude soft-deleted entries
  var bookFilter = sel.value;
  var words = [].concat(state.vocab).reverse().filter(function(w) { return !w.deleted; });
  if(bookFilter) words = words.filter(function(w) { return (w.bookTitle || '未归类') === bookFilter; });
  if(query) words = words.filter(function(w) { return w.word.toLowerCase().includes(query) || w.translation.includes(query); });

  var totalCount = bookFilter ? words.length : state.vocab.length;
  document.getElementById('vocab-count-txt').textContent = '共 ' + totalCount + ' 个生词';
  var list = document.getElementById('vocab-list');
  list.innerHTML = '';

  if(words.length === 0) {
    list.innerHTML =
      '<div class="vocab-empty">' +
        '<div class="vocab-empty-icon">📝</div>' +
        '<p style="font-size:15px; margin-bottom:8px">' + (state.vocab.length === 0 ? '生词本是空的' : '该书籍下没有生词') + '</p>' +
        '<p style="font-size:13px">在阅读时长按选中单词添加生词</p>' +
      '</div>';
    return;
  }

  words.forEach(function(w) {
    var item = document.createElement('div');
    item.className = 'vocab-item';
    item.innerHTML =
      '<div style="flex:1; min-width:0">' +
        '<div class="vocab-it">' + w.word + '</div>' +
        '<div class="vocab-zh">' + w.translation + '</div>' +
        (w.example ? '<div class="vocab-meta">"' + w.example + '"</div>' : '') +
      '</div>' +
      '<div class="vocab-actions">' +
        '<button class="vocab-act-detail" data-action="detail" data-word="' + w.word + '">详情</button>' +
        '<div class="vocab-act-group">' +
          '<button class="vocab-act-btn" data-action="edit" data-word="' + w.word + '" aria-label="编辑">' +
            '<svg viewBox="0 0 24 24"><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>' +
          '</button>' +
          '<button class="vocab-act-btn vocab-del" data-word="' + w.word + '" aria-label="删除">' +
            '<svg viewBox="0 0 24 24"><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>' +
          '</button>' +
        '</div>' +
      '</div>';
    item.querySelector('.vocab-del').onclick = function(e) {
      e.stopPropagation();
      deleteWord(w.word);
    };
    item.querySelector('[data-action="detail"]').onclick = function(e) {
      e.stopPropagation();
      openWordDetail(w.word);
    };
    item.querySelector('[data-action="edit"]').onclick = function(e) {
      e.stopPropagation();
      openEditModal(w);
    };
    list.appendChild(item);
  });
}

function deleteWord(word) {
  var w = state.vocab.find(function(v) { return v.word === word; });
  if (w) {
    w.deleted = true;
    w.updatedAt = Date.now();
  }
  saveState();
  renderVocab();
  syncNow();
  showToast('已删除生词');
}

// ══════════════════════════════════════
// WORD DETAIL MODAL
// ══════════════════════════════════════
function openWordDetail(word) {
  var modal = document.getElementById('detail-modal');
  var title = document.getElementById('detail-word-title');
  var body = document.getElementById('detail-body');
  title.textContent = word;
  body.innerHTML = '<p class="detail-loading">正在查询 "' + word + '"…</p>';
  modal.classList.add('visible');

  fetchWordDetail(word).then(function(data) {
    if (!data || data.length === 0) {
      body.innerHTML = '<p class="detail-loading">未找到 "' + word + '" 的详细解释</p>';
      return;
    }
    var html = '';
    data.forEach(function(entry) {
      // Decode unicode escapes in the s field, preserve <br> and <hr>
      var s = entry.s || '';
      // Make it safe: allow <br>, <hr>, <b>, <i> tags
      html += '<div class="detail-entry">' + s + '</div>';
    });
    body.innerHTML = html;
  }).catch(function() {
    body.innerHTML = '<p class="detail-loading">查询失败，请检查网络连接</p>';
  });
}

function openEditModal(w) {
  editingWord = w;
  document.getElementById('modal-title').textContent = '编辑生词';
  document.getElementById('modal-word').style.display = 'block';
  document.getElementById('modal-word-input').style.display = 'none';
  document.getElementById('modal-word').textContent = w.word;
  document.getElementById('modal-translation').value = w.translation || '';
  document.getElementById('modal-example').value = w.example || '';
  document.getElementById('modal-translation').focus();
  document.getElementById('add-modal').classList.add('visible');
}

// ══════════════════════════════════════
// ADD WORD MODAL
// ══════════════════════════════════════
function openAddModal(word, translation) {
  if (word) {
    var existing = state.vocab.find(function(w) { return w.word.toLowerCase() === word.toLowerCase(); });
    if(existing) { showToast('"' + word + '" 已在生词本中'); return; }
  }
  editingWord = null;
  document.getElementById('modal-title').textContent = '添加生词';
  if (word) {
    document.getElementById('modal-word').style.display = 'block';
    document.getElementById('modal-word-input').style.display = 'none';
    document.getElementById('modal-word').textContent = word;
  } else {
    document.getElementById('modal-word').style.display = 'none';
    document.getElementById('modal-word-input').style.display = 'block';
    document.getElementById('modal-word-input').value = '';
    document.getElementById('modal-word-input').focus();
  }
  document.getElementById('modal-translation').value = translation || '';
  document.getElementById('modal-example').value = '';
  if (word && !translation) {
    document.getElementById('modal-translation').focus();
  } else if (translation) {
    document.getElementById('modal-example').focus();
  }
  document.getElementById('add-modal').classList.add('visible');
}

// ══════════════════════════════════════
// STATS PAGE
// ══════════════════════════════════════
function renderStats() {
  var now = new Date();
  var year = now.getFullYear(), month = now.getMonth();
  var firstDay = new Date(year, month, 1).getDay();
  var daysInMonth = new Date(year, month+1, 0).getDate();
  var grid = document.getElementById('calendar-grid');
  grid.innerHTML = '';
  for(var i=0; i<firstDay; i++) {
    var empty = document.createElement('div');
    empty.className = 'cal-day dimmed';
    grid.appendChild(empty);
  }
  for(var d=1; d<=daysInMonth; d++) {
    var key = year + '-' + String(month+1).padStart(2,'0') + '-' + String(d).padStart(2,'0');
    var count = state.readLog[key] || 0;
    var el = document.createElement('div');
    var isToday = d === now.getDate();
    el.className = 'cal-day' + (isToday ? ' today' : count >= 10 ? ' read-more' : count > 0 ? ' read' : '');
    el.title = d + '日: ' + count + '句';
    grid.appendChild(el);
  }

  // Bar chart (last 7 days)
  var chart = document.getElementById('bar-chart');
  chart.innerHTML = '';
  var days7 = [];
  for(var i=6; i>=0; i--) {
    var d2 = new Date(now); d2.setDate(d2.getDate()-i);
    var key2 = d2.getFullYear() + '-' + String(d2.getMonth()+1).padStart(2,'0') + '-' + String(d2.getDate()).padStart(2,'0');
    days7.push({ key: key2, count: state.readLog[key2] || 0, isToday: i===0, label: ['日','一','二','三','四','五','六'][d2.getDay()] });
  }
  var maxCount = Math.max.apply(null, days7.map(function(d) { return d.count; }).concat(1));
  days7.forEach(function(day) {
    var col = document.createElement('div');
    col.className = 'chart-bar-col';
    var h = Math.max(Math.round(day.count/maxCount*70), day.count > 0 ? 6 : 3);
    col.innerHTML =
      '<div class="chart-bar' + (day.isToday ? ' today' : '') + '" style="height:' + h + 'px"></div>' +
      '<div class="chart-bar-lbl">' + (day.count || '') + '</div>' +
      '<div class="chart-bar-lbl">' + day.label + '</div>';
    chart.appendChild(col);
  });

  // Stats numbers
  document.getElementById('stat-days').textContent = Object.keys(state.readLog).filter(function(k) { return state.readLog[k] > 0; }).length;
  document.getElementById('stat-all-sentences').textContent = state.stats.totalSentences || 0;
  document.getElementById('stat-words').textContent = state.vocab.length;
  document.getElementById('stat-streak').textContent = calcStreak();
}

// ══════════════════════════════════════
// SETTINGS PAGE
// ══════════════════════════════════════
function renderSettings() {
  document.getElementById('dark-toggle').className = 'toggle' + (state.settings.dark ? ' on' : '');
  document.getElementById('translate-toggle').className = 'toggle' + (state.settings.showTranslation ? ' on' : '');
  document.getElementById('highlight-toggle').className = 'toggle' + (state.settings.highlightWords ? ' on' : '');

  document.querySelectorAll('.font-size-btn').forEach(function(b) {
    b.classList.toggle('active', b.dataset.size === state.settings.fontSize);
  });

  if(state.user) {
    document.getElementById('login-form-wrap').style.display = 'none';
    document.getElementById('logged-in-wrap').style.display = 'block';
    document.getElementById('logged-name').textContent = state.user.username;
    document.getElementById('logged-avatar').textContent = state.user.username[0].toUpperCase();
  } else {
    document.getElementById('login-form-wrap').style.display = 'block';
    document.getElementById('logged-in-wrap').style.display = 'none';
  }
}
