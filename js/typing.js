// typing.js: The typing test itself: drawing the words, moving the caret, and handling every key you press.

/* ---------- test state ---------- */
const wordsEl = $('#words'), viewport = $('#viewport');
const caretEl = document.createElement('div');
let wordEls = [], lineStep = 40, T = {}, ticker = null, idleTimer = null;

function newTest(repeat) {
  clearInterval(ticker);
  const words = repeat && T.words ? T.words.slice()
    : S.mode === 'quote' ? QUOTES[rand(QUOTES.length)].split(' ')
    : genWords(S.mode === 'words' ? S.words : 80);
  T = { words, typed: [], input: '', idx: 0, started: false, finished: false, start: 0, keys: 0, okKeys: 0, samples: [], secErr: 0, prevAll: 0 };
  document.body.classList.remove('typing');
  $('#results').hidden = true; $('#typebox').hidden = false; $('#live').style.visibility = '';
  renderAll(); updateLive(); renderModebar();
  focusInput();
}

function renderAll() {
  wordsEl.innerHTML = ''; wordEls = [];
  T.words.forEach(() => addWordEl());
  T.words.forEach((_, i) => renderWord(i));
  wordsEl.appendChild(caretEl);
  wordsEl.style.transform = 'translateY(0)';
  measure(); updateCaret();
}
function addWordEl() { const d = document.createElement('div'); d.className = 'word'; wordsEl.appendChild(d); wordEls.push(d); return d; }
function renderWord(i) {
  const el = wordEls[i]; if (!el) return;
  const w = T.words[i], t = i === T.idx ? T.input : T.typed[i];
  let html = '';
  const len = Math.max(w.length, t ? t.length : 0);
  for (let j = 0; j < len; j++) {
    if (j >= w.length) html += `<span class="extra">${esc(t[j])}</span>`;
    else if (!t || j >= t.length) html += `<span>${esc(w[j])}</span>`;
    else html += `<span class="${t[j] === w[j] ? 'ok' : 'bad'}">${esc(w[j])}</span>`;
  }
  el.innerHTML = html;
  el.classList.toggle('err', i < T.idx && T.typed[i] !== w);
}
const esc = c => c === '<' ? '&lt;' : c === '>' ? '&gt;' : c === '&' ? '&amp;' : c;

function measure() {
  if (!wordEls.length) return;
  const w = wordEls[0], m = parseFloat(getComputedStyle(w).marginTop) || 0;
  lineStep = w.offsetHeight + 2 * m;
  viewport.style.height = (lineStep * 3) + 'px';
}
function updateCaret() {
  const w = wordEls[T.idx]; if (!w) return;
  const spans = w.children, pos = T.input.length;
  let left, top, width;
  if (pos < spans.length) { const s = spans[pos]; left = s.offsetLeft; top = s.offsetTop; width = s.offsetWidth; }
  else { const s = spans[spans.length - 1]; left = s.offsetLeft + s.offsetWidth; top = s.offsetTop; width = s.offsetWidth; }
  const h = w.offsetHeight;
  if (S.caret === 'line') { caretEl.style.left = (left - 1) + 'px'; caretEl.style.top = (top + h * 0.1) + 'px'; caretEl.style.width = ''; }
  else if (S.caret === 'block') { caretEl.style.left = left + 'px'; caretEl.style.top = (top + h * 0.06) + 'px'; caretEl.style.width = width + 'px'; caretEl.style.height = (h * 0.88) + 'px'; }
  else { caretEl.style.left = left + 'px'; caretEl.style.top = (top + h - 3) + 'px'; caretEl.style.width = width + 'px'; }
  if (S.caret !== 'block') caretEl.style.height = S.caret === 'under' ? '3px' : '';
  const line = Math.round((w.offsetTop - wordEls[0].offsetTop) / lineStep);
  wordsEl.style.transform = `translateY(${-Math.max(0, line - 1) * lineStep}px)`;
}
function bumpCaret() {
  caretEl.classList.remove('idle');
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => caretEl.classList.add('idle'), 600);
}

/* ---------- input ---------- */
function startTest() {
  T.started = true; T.start = performance.now();
  document.body.classList.add('typing');
  ticker = setInterval(tick, 100);
}
function tick() {
  if (!T.started || T.finished) return;
  const el = performance.now() - T.start;
  while (el >= (T.samples.length + 1) * 1000) sample(T.samples.length + 1);
  if (S.mode === 'time' && el >= S.time * 1000) return finish();
  updateLive();
}
function typeChar(ch) {
  if (T.finished) return;
  if (!T.started) startTest();
  const w = T.words[T.idx], pos = T.input.length;
  if (pos >= w.length + 10) return;
  const ok = pos < w.length && w[pos] === ch;
  T.keys++; if (ok) T.okKeys++; else T.secErr++;
  T.input += ch;
  renderWord(T.idx); updateCaret(); bumpCaret(); sound(ok);
  if (S.mode !== 'time' && T.idx === T.words.length - 1 && T.input === w) finish();
  else updateLive();
}
function space() {
  if (T.finished || !T.started || T.input === '') return;
  const w = T.words[T.idx], ok = T.input === w;
  T.keys++; if (ok) T.okKeys++; else T.secErr++;
  T.typed[T.idx] = T.input; T.idx++; T.input = '';
  renderWord(T.idx - 1); sound(ok);
  if (S.mode !== 'time' && T.idx >= T.words.length) return finish();
  if (S.mode === 'time' && T.idx > T.words.length - 40) {
    const more = genWords(40), start = T.words.length;
    T.words.push(...more); more.forEach(() => addWordEl()); more.forEach((_, k) => renderWord(start + k));
    wordsEl.appendChild(caretEl);
  }
  renderWord(T.idx); updateCaret(); bumpCaret(); updateLive();
}
function backspace(whole) {
  if (T.finished || !T.started) return;
  if (T.input.length === 0) {
    if (T.idx > 0 && T.typed[T.idx - 1] !== T.words[T.idx - 1]) {
      T.idx--; T.input = whole ? '' : T.typed[T.idx]; T.typed[T.idx] = undefined;
      renderWord(T.idx + 1); renderWord(T.idx);
    }
  } else { T.input = whole ? '' : T.input.slice(0, -1); renderWord(T.idx); }
  updateCaret(); bumpCaret(); updateLive();
}

const settingsOpen = () => $('#drawer').classList.contains('open');
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { e.preventDefault(); toggleSettings(); return; }
  if (settingsOpen()) return;
  if (e.key === 'Tab') { e.preventDefault(); newTest(false); return; }
  if (T.finished) { if (e.key === 'Enter') { e.preventDefault(); newTest(false); } return; }
  if (e.target && e.target.tagName === 'BUTTON' && (e.key === 'Enter')) return;
  if (e.metaKey) return;
  if ((e.ctrlKey || e.altKey) && e.key === 'Backspace') { e.preventDefault(); backspace(true); return; }
  if (e.ctrlKey || e.altKey) return;
  if (e.key === 'Backspace') { e.preventDefault(); backspace(false); return; }
  if (e.key === ' ') { e.preventDefault(); space(); return; }
  if (e.key.length === 1) { e.preventDefault(); typeChar(e.key); }
});
// phones: keydown often has no key, so read characters from the hidden input
const hiddenInput = $('#hiddenInput');
hiddenInput.addEventListener('input', () => {
  const v = hiddenInput.value; hiddenInput.value = '';
  for (const ch of v) ch === ' ' ? space() : typeChar(ch);
});
function focusInput() { try { hiddenInput.focus({ preventScroll: true }); } catch (e) {} }
$('#typebox').addEventListener('click', focusInput);
const setFocused = () => document.body.classList.toggle('unfocused', !document.hasFocus());
window.addEventListener('focus', setFocused); window.addEventListener('blur', setFocused);
setInterval(setFocused, 1000);
