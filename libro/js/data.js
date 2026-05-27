// ══════════════════════════════════════
// BOOK LIBRARY — Loaded from server
// ══════════════════════════════════════
let BOOKS_URL = '/books';
const LOGIN_URL = 'https://trustmarket.ddnsfree.com/test/book.asp';
const BOOKS = [];

/**
 * Load all book .json files from the server BOOKS_URL.
 *
 * Fetches the directory listing page and parses it for <a href="*.json">
 * links, then fetches each book file in parallel. Works with Apache,
 * Nginx autoindex, Python http.server, and similar directory listings.
 *
 * Each .json file should contain a single book object matching the
 * BOOKS entry schema: { id, title, author, emoji, level, chapters }
 *
 * @returns {Promise<number>}  count of successfully loaded books
 */
async function loadBooksFromServer() {
  try {
    // Step 0 — clear existing books to prevent duplicates on reload
    BOOKS.length = 0;

    // Step 1 — fetch directory listing and extract .json links
    var dirResp = await fetch(BOOKS_URL + '/');
    if (!dirResp.ok) {
      console.warn('loadBooks: cannot access directory (' + dirResp.status + ')');
      return 0;
    }
    var html = await dirResp.text();
    // Match all href attributes pointing to .json files
    var re = /href\s*=\s*["']([^"']+\.json)["']/gi;
    var bookFiles = [];
    var m;
    while ((m = re.exec(html)) !== null) {
      // Extract bare filename: strip leading path and query string
      var name = m[1].replace(/^.*[\\/]/, '').split('?')[0];
      if (name !== 'index.json' && bookFiles.indexOf(name) === -1) {
        bookFiles.push(name);
      }
    }

    if (bookFiles.length === 0) {
      console.warn('loadBooks: no .json files found in directory listing');
      return 0;
    }

    // Step 2 — fetch each book JSON in parallel
    var results = await Promise.all(
      bookFiles.map(function(file) {
        var url = BOOKS_URL + '/' + file;
        return fetch(url)
          .then(function(r) {
            if (!r.ok) {
              console.error('loadBooks: HTTP ' + r.status + ' for ' + url);
              return null;
            }
            return r.json().catch(function(err) {
              console.error('loadBooks: JSON parse error for ' + url + ' — ' + err.message);
              return null;
            });
          })
          .catch(function(err) {
            console.error('loadBooks: fetch failed for ' + url + ' — ' + err.message);
            return null;
          });
      })
    );

    var count = 0;
    for (var i = 0; i < results.length; i++) {
      if (results[i]) {
        // Support both a single book object and an array of books
        if (Array.isArray(results[i])) {
          BOOKS.push.apply(BOOKS, results[i]);
          count += results[i].length;
        } else {
          BOOKS.push(results[i]);
          count++;
        }
      }
    }
    return count;
  } catch(e) {
    console.warn('loadBooks failed:', e);
    return 0;
  }
}

// ══════════════════════════════════════
// APPLICATION STATE
// ══════════════════════════════════════
const state = {
  currentPage: 'home',
  currentBook: null,
  currentChapter: null,
  vocab: [],
  progress: {},       // { bookId: { chapterId: lastSentenceIdx } }
  lastReadAt: {},     // { bookId: timestamp } — for sorting by recency
  settings: { dark: true, fontSize: 'md', showTranslation: false, highlightWords: true },
  user: null,
  readLog: {},        // { 'YYYY-MM-DD': sentenceCount }
  stats: { totalSentences: 0 },
  selectedWord: '',
  selectedWordPos: { x: 0, y: 0 },
  lastSync: null,
  progressUpdatedAt: {}   // { bookId: timestamp } — sync metadata
};

// ══════════════════════════════════════
// PERSISTENCE (localStorage)
// ══════════════════════════════════════
function saveState() {
  try {
    localStorage.setItem('it_vocab', JSON.stringify(state.vocab));
    localStorage.setItem('it_progress', JSON.stringify(state.progress));
    localStorage.setItem('it_lastread', JSON.stringify(state.lastReadAt));
    localStorage.setItem('it_settings', JSON.stringify(state.settings));
    localStorage.setItem('it_user', JSON.stringify(state.user));
    localStorage.setItem('it_readlog', JSON.stringify(state.readLog));
    localStorage.setItem('it_stats', JSON.stringify(state.stats));
    localStorage.setItem('it_lastsync', JSON.stringify(state.lastSync));
    localStorage.setItem('it_progress_updated', JSON.stringify(state.progressUpdatedAt));
  } catch(e) {}
}

function loadState() {
  try {
    var v = localStorage.getItem('it_vocab'); if(v) state.vocab = JSON.parse(v);
    var p = localStorage.getItem('it_progress'); if(p) state.progress = JSON.parse(p);
    var l = localStorage.getItem('it_lastread'); if(l) state.lastReadAt = JSON.parse(l);
    var s = localStorage.getItem('it_settings'); if(s) Object.assign(state.settings, JSON.parse(s));
    var u = localStorage.getItem('it_user'); if(u) state.user = JSON.parse(u);
    if(state.user && state.user.token) {
      BOOKS_URL = 'https://trustmarket.ddnsfree.com/test/books/' + encodeURIComponent(state.user.username);
    }
    var r = localStorage.getItem('it_readlog'); if(r) state.readLog = JSON.parse(r);
    var st = localStorage.getItem('it_stats'); if(st) Object.assign(state.stats, JSON.parse(st));
    var ls = localStorage.getItem('it_lastsync'); if(ls) state.lastSync = JSON.parse(ls);
    var pu = localStorage.getItem('it_progress_updated'); if(pu) state.progressUpdatedAt = JSON.parse(pu);
  } catch(e) {}
}
