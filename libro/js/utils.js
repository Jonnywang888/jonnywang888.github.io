// ══════════════════════════════════════
// UTILITY FUNCTIONS
// ══════════════════════════════════════

function todayKey() {
  var d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}

function calcStreak() {
  var streak = 0;
  var now = new Date();
  for(var i=0; i<365; i++) {
    var d = new Date(now); d.setDate(d.getDate()-i);
    var key = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
    if(state.readLog[key] > 0) streak++;
    else if(i > 0) break;
  }
  return streak;
}

function getBookProgress(book) {
  var done = 0, total = 0;
  book.chapters.forEach(function(ch) {
    total += ch.sentences.length;
    var p = state.progress[book.id];
    if(p && p[ch.id] !== undefined) done += Math.min(p[ch.id] + 1, ch.sentences.length);
  });
  return { done: done, total: total, pct: total ? Math.round(done/total*100) : 0 };
}

function createHighlightedText(text) {
  if(!state.settings.highlightWords || state.vocab.length === 0) return text;
  var words = state.vocab.map(function(v) { return v.word; });
  var result = text;
  words.forEach(function(w) {
    var escaped = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var re = new RegExp('\\b(' + escaped + ')\\b', 'gi');
    result = result.replace(re, '<span class="word-highlight" data-word="$1">$1</span>');
  });
  return result;
}

function applyTheme() {
  document.body.classList.toggle('light', !state.settings.dark);
}

function applyFontSize() {
  var el = document.getElementById('sentences-list');
  if(!el) return;
  el.className = '';
  if(state.settings.fontSize !== 'md') el.className = 'font-' + state.settings.fontSize;
}

// ── TRANSLATION ──
var lastTranslation = '';

function translateWord(word) {
  var apiKey = state.settings.apiKey;
  if (!apiKey) {
    lastTranslation = '';
    return Promise.resolve(null);
  }

  return fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: '原始意大利语,翻译成中文.多个含义用","分隔,最多10个,如果不是原形写出词语原形' },
        { role: 'user', content: word }
      ]
    })
  })
    .then(function(r) { return r.ok ? r.json() : null; })
    .then(function(data) {
      if (data && data.choices && data.choices[0] && data.choices[0].message) {
        var content = data.choices[0].message.content.trim();
        try {
          var parsed = JSON.parse(content);
          if (parsed.responseData && parsed.responseData.translatedText) {
            lastTranslation = parsed.responseData.translatedText;
            return lastTranslation;
          }
        } catch(e) {}
        lastTranslation = content;
        return lastTranslation;
      }
      return null;
    })
    .catch(function() { return null; });
}

// ── WORD DETAIL ──
function fetchWordDetail(word) {
  var url = 'https://trustmarket.ddnsgeek.com/app/utile.asp?action=getword&word=' + encodeURIComponent(word);
  return fetch(url)
    .then(function(r) { return r.ok ? r.json() : null; })
    .catch(function() { return null; });
}

// ── TOAST ──
var toastTimer;
function showToast(msg) {
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function() { t.classList.remove('visible'); }, 2000);
}

function showLoginMsg(msg) {
  var el = document.getElementById('login-msg');
  el.textContent = msg;
  el.style.display = 'block';
  setTimeout(function() { el.style.display = 'none'; }, 3000);
}
