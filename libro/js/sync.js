// ══════════════════════════════════════
// DATA SYNC ENGINE
// ══════════════════════════════════════

var _syncBusy = false;
var _syncTimer = null;

// Ensure all vocab entries have updatedAt and deleted fields
function _migrateVocab() {
  state.vocab.forEach(function(w) {
    if (!w.updatedAt) w.updatedAt = w.addedAt || Date.now();
    if (w.deleted === undefined) w.deleted = false;
  });
  if (!state.progressUpdatedAt) state.progressUpdatedAt = {};
}

// Collect local changes since state.lastSync
function _collectChanges() {
  var rawLastSync = state.lastSync || 0;
  var since = Math.min(rawLastSync, Date.now());
  var changes = { vocab: [], progress: {} };

  if (rawLastSync > Date.now()) {
    console.warn('[sync] lastSync (' + rawLastSync + ') is ahead of client time (' + Date.now() +
                 '), capping since to client time. Diff: ' + (rawLastSync - Date.now()) + 'ms');
  }

  state.vocab.forEach(function(w) {
    changes.vocab.push({
      word: w.word,
      translation: w.translation,
      example: w.example || '',
      bookTitle: w.bookTitle || '',
      addedAt: w.addedAt,
      updatedAt: w.updatedAt,
      deleted: !!w.deleted
    });

  });

  for (var bookId in state.progress) {
    if (state.progress.hasOwnProperty(bookId)) {
      var t = (state.progressUpdatedAt || {})[bookId] || 0;
      changes.progress[bookId] = {
        chapters: JSON.stringify(state.progress[bookId]),
        updatedAt: t
      };
    }
  }

  return changes;
}

// Merge server changes into local state — last-write-wins
function _mergeServer(changes) {
  if (!changes) return;

  // Merge vocab
  (changes.vocab || []).forEach(function(sv) {
    var local = null;
    for (var i = 0; i < state.vocab.length; i++) {
      if (state.vocab[i].word.toLowerCase() === sv.word.toLowerCase()) {
        local = state.vocab[i];
        break;
      }
    }

    if (local) {
      // Server wins only if strictly newer
      if (sv.updatedAt > (local.updatedAt || 0)) {
        local.translation = sv.translation;
        local.example = sv.example || '';
        local.bookTitle = sv.bookTitle || local.bookTitle;
        local.updatedAt = sv.updatedAt;
        local.deleted = !!sv.deleted;
      }
    } else if (!sv.deleted) {
      // New word from server
      state.vocab.push({
        word: sv.word,
        translation: sv.translation,
        example: sv.example || '',
        bookTitle: sv.bookTitle || '',
        addedAt: sv.addedAt || sv.updatedAt,
        updatedAt: sv.updatedAt,
        deleted: false
      });
    }
  });

  // Merge progress
  if (changes.progress) {
    for (var bookId in changes.progress) {
      if (changes.progress.hasOwnProperty(bookId)) {
        var sp = changes.progress[bookId];
        var localT = (state.progressUpdatedAt || {})[bookId] || 0;
        if (sp.updatedAt > localT) {
          state.progress[bookId] = sp.chapters;
          if (!state.progressUpdatedAt) state.progressUpdatedAt = {};
          state.progressUpdatedAt[bookId] = sp.updatedAt;
        }
      }
    }
  }

  // Purge soft-deleted tombstone entries older than 30 days
  var cutoff = Date.now() - 30 * 86400000;
  state.vocab = state.vocab.filter(function(w) {
    return !w.deleted || w.updatedAt > cutoff;
  });
}

// ── Full pull — new device with empty local data
async function syncPullFull() {
  if (!state.user || !state.user.token) { console.log('[syncPull] no user/token'); return; }
  try {
    var url = LOGIN_URL + '?action=getdata&id=' + encodeURIComponent(state.user.username)
            + '&token=' + encodeURIComponent(state.user.token);
    console.log('[syncPull] fetching...');
    var resp = await fetch(url);
    console.log('[syncPull] status=' + resp.status);
    if (!resp.ok) { console.warn('[syncPull] HTTP error ' + resp.status); return; }
    var data = await resp.json();
    console.log('[syncPull] data.ok=' + data.ok + ', vocab=' + (data.vocab ? data.vocab.length : 0));
    if (!data.ok) { console.warn('[syncPull] server returned ok=false'); return; }

    // Replace vocab
    state.vocab = (data.vocab || []).map(function(w) {
      if (!w.updatedAt) w.updatedAt = w.addedAt || Date.now();
      w.deleted = !!w.deleted;
      return w;
    });

    // Replace progress
    if (data.progress) {
      for (const key in data.progress) {
        console.log(data.progress[key])
        data.progress[key] = JSON.parse(data.progress[key])
      }
      state.progress = data.progress;
      state.progressUpdatedAt = data.progressUpdatedAt || {};
    }

    // Recalculate total sentences from synced progress
    state.stats.totalSentences = 0;
    for (var bookId in state.progress) {
      if (state.progress.hasOwnProperty(bookId)) {
        for (var chId in state.progress[bookId]) {
          if (state.progress[bookId].hasOwnProperty(chId)) {
            state.stats.totalSentences += state.progress[bookId][chId] + 1;
          }
        }
      }
    }

    state.lastSync = Math.min(data.serverTime || Date.now(), Date.now());
    saveState();

    if (state.currentPage === 'home') renderHome();
    if (state.currentPage === 'vocab') renderVocab();
    if (state.currentPage === 'reading') renderReadingIndex();
  } catch(e) {
    console.warn('syncPullFull: failed — ' + e.message);
  }
}

// ── Incremental bi-directional sync
async function syncPushPull() {
  if (_syncBusy) { console.log('[sync] busy, skipping'); return; }
  if (!state.user || !state.user.token) { console.log('[sync] no user/token, skipping'); return; }

  _syncBusy = true;
  try {
    _migrateVocab();
    var changes = _collectChanges();

    var body = JSON.stringify({
      action: 'sync',
      id: state.user.username,
      token: state.user.token,
      lastSync: state.lastSync || 0,
      changes: changes
    });

    var resp = await fetch(LOGIN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body
    });

    if (!resp.ok) { console.warn('[sync] HTTP error ' + resp.status); _syncBusy = false; return; }
    var data = await resp.json();

    if (!data.ok) { console.warn('[sync] server returned ok=false'); _syncBusy = false; return; }

    _mergeServer(data.changes);
    state.lastSync = Math.min(data.serverTime || Date.now(), Date.now());
    saveState();

    // Re-render current page
    if (state.currentPage === 'vocab') renderVocab();
    if (state.currentPage === 'home') renderHome();
  } catch(e) {
    console.warn('[sync] failed — ' + e.message);
  }
  _syncBusy = false;
}

// ── Debounced sync — for frequent triggers like progress updates
function scheduleSync(delay) {
  clearTimeout(_syncTimer);
  _syncTimer = setTimeout(syncPushPull, delay || 0);
}

// ── Immediate sync — for vocab add/edit/delete
function syncNow() {
  scheduleSync(0);
}

// ── Update progress with sync metadata
function trackProgress(bookId, chapterId, idx) {
  if (!state.progress[bookId]) state.progress[bookId] = {};
  state.progress[bookId][chapterId] = idx;
  if (!state.progressUpdatedAt) state.progressUpdatedAt = {};
  state.progressUpdatedAt[bookId] = Date.now();
}

// ── Sync after login — full pull if local is empty, otherwise incremental
async function syncAfterLogin() {
  _migrateVocab();
  var hasLocal = state.vocab.length > 0 || Object.keys(state.progress).length > 0;
  if (hasLocal) {
    await syncPushPull();
  } else {
    await syncPullFull();
  }
}
