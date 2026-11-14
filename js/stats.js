// stats.js: Scoring: WPM, accuracy and consistency, the results screen, the per-second chart, personal bests and today's stats.

/* ---------- stats ---------- */
function counts() {
  let correct = 0, incorrect = 0, extra = 0, missed = 0, good = 0, all = 0;
  const cmp = (w, t, committed) => {
    for (let j = 0; j < Math.max(w.length, t.length); j++) {
      if (j >= w.length) extra++;
      else if (j >= t.length) { if (committed) missed++; }
      else if (t[j] === w[j]) correct++; else incorrect++;
    }
  };
  for (let i = 0; i < T.idx; i++) {
    const w = T.words[i], t = T.typed[i] || '';
    all += t.length + 1; if (t === w) good += w.length + 1; cmp(w, t, true);
  }
  const w = T.words[T.idx] || '', t = T.input;
  all += t.length; if (t && w.startsWith(t)) good += t.length; cmp(w, t, false);
  return { correct, incorrect, extra, missed, good, all };
}
function sample(sec) {
  const c = counts();
  T.samples.push({ wpm: c.good / 5 / (sec / 60), raw: (c.all - T.prevAll) / 5 * 60, err: T.secErr });
  T.prevAll = c.all; T.secErr = 0;
}
function updateLive() {
  const el = T.started ? (performance.now() - T.start) / 1000 : 0;
  $('#liveTimer').textContent = S.mode === 'time' ? Math.max(0, Math.ceil(S.time - el)) : `${T.idx}/${T.words.length}`;
  const c = counts();
  $('#liveWpm').textContent = el > 0.5 ? Math.round(c.good / 5 / (el / 60)) : 0;
  $('#liveAcc').textContent = T.keys ? Math.round(T.okKeys / T.keys * 100) : 100;
}

function finish() {
  if (T.finished) return;
  T.finished = true; clearInterval(ticker);
  const ms = S.mode === 'time' ? S.time * 1000 : performance.now() - T.start;
  const secs = ms / 1000;
  if (S.mode !== 'time' && secs - T.samples.length > 0.2) {
    const c = counts(), part = secs - T.samples.length;
    T.samples.push({ wpm: c.good / 5 / (secs / 60), raw: (c.all - T.prevAll) / 5 * 60 / part, err: T.secErr });
  }
  const c = counts();
  const wpm = c.good / 5 / (secs / 60), raw = c.all / 5 / (secs / 60);
  const acc = T.keys ? T.okKeys / T.keys * 100 : 0;
  const raws = T.samples.map(s => s.raw), mean = raws.reduce((a, b) => a + b, 0) / (raws.length || 1);
  const sd = Math.sqrt(raws.reduce((a, b) => a + (b - mean) ** 2, 0) / (raws.length || 1));
  const cons = mean ? Math.max(0, 100 * (1 - sd / mean)) : 0;
  const label = S.mode === 'quote' ? 'quote' : `${S.mode} ${S.mode === 'time' ? S.time : S.words}${S.punct ? ' @' : ''}${S.nums ? ' #' : ''}`;

  const pbs = store.get('td-pb', {}), key = label, prev = pbs[key] || 0;
  const isPb = wpm > prev && acc >= 75 && secs >= 5;
  if (isPb) { pbs[key] = Math.round(wpm * 100) / 100; store.set('td-pb', pbs); }
  if (secs >= 3) {
    const hist = store.get('td-history', []);
    hist.push({ ts: Date.now(), wpm: Math.round(wpm), acc: Math.round(acc), secs: Math.round(secs), label });
    store.set('td-history', hist.slice(-300));
  }

  document.body.classList.remove('typing');
  $('#typebox').hidden = true; $('#results').hidden = false; $('#live').style.visibility = 'hidden';
  $('#rWpm').textContent = Math.round(wpm);
  $('#rAcc').textContent = Math.round(acc) + '%';
  $('#rPb').hidden = !(isPb && prev > 0);
  $('#rType').textContent = label;
  $('#rRaw').textContent = Math.round(raw);
  $('#rChars').textContent = `${c.correct}/${c.incorrect}/${c.extra}/${c.missed}`;
  $('#rCons').textContent = Math.round(cons) + '%';
  $('#rTime').textContent = Math.round(secs) + 's';
  $('#rBest').textContent = Math.round(Math.max(prev, isPb ? wpm : 0));
  drawChart();
  renderToday();
  $('#nextBtn').focus({ preventScroll: true });
}

function drawChart() {
  const cv = $('#chart'), dpr = window.devicePixelRatio || 1;
  const W = cv.clientWidth, H = cv.clientHeight; if (!W) return;
  cv.width = W * dpr; cv.height = H * dpr;
  const g = cv.getContext('2d'); g.scale(dpr, dpr);
  const cs = getComputedStyle(document.documentElement), col = n => cs.getPropertyValue(n).trim();
  const data = T.samples; if (!data.length) return;
  const max = Math.max(20, Math.ceil(Math.max(...data.map(d => Math.max(d.wpm, d.raw))) / 20) * 20);
  const L = 34, R = 8, Tp = 18, B = 22, pw = W - L - R, ph = H - Tp - B;
  const x = i => L + (data.length === 1 ? pw / 2 : i / (data.length - 1) * pw);
  const y = v => Tp + ph - v / max * ph;
  g.font = '11px ' + col('--type-font'); g.fillStyle = col('--sub'); g.strokeStyle = `rgba(${col('--text-rgb')},.08)`; g.lineWidth = 1;
  for (let k = 0; k <= 4; k++) { const v = max / 4 * k, yy = y(v); g.beginPath(); g.moveTo(L, yy); g.lineTo(W - R, yy); g.stroke(); g.textAlign = 'right'; g.fillText(Math.round(v), L - 6, yy + 4); }
  const step = Math.max(1, Math.ceil(data.length / 10)); g.textAlign = 'center';
  data.forEach((d, i) => { if (i % step === 0 || i === data.length - 1) g.fillText(i + 1, x(i), H - 5); });
  const line = (key, color, w) => { g.beginPath(); data.forEach((d, i) => i ? g.lineTo(x(i), y(d[key])) : g.moveTo(x(i), y(d[key]))); g.strokeStyle = color; g.lineWidth = w; g.lineJoin = 'round'; g.stroke(); };
  // wpm area
  g.beginPath(); data.forEach((d, i) => i ? g.lineTo(x(i), y(d.wpm)) : g.moveTo(x(i), y(d.wpm)));
  g.lineTo(x(data.length - 1), y(0)); g.lineTo(x(0), y(0)); g.closePath();
  const grad = g.createLinearGradient(0, Tp, 0, Tp + ph); grad.addColorStop(0, `rgba(${col('--accent-rgb')},.28)`); grad.addColorStop(1, `rgba(${col('--accent-rgb')},0)`);
  g.fillStyle = grad; g.fill();
  line('raw', col('--sub'), 1.5); line('wpm', col('--accent'), 2.5);
  const last = data[data.length - 1]; g.fillStyle = col('--accent'); g.beginPath(); g.arc(x(data.length - 1), y(last.wpm), 4, 0, Math.PI * 2); g.fill();
  g.fillStyle = col('--error');
  data.forEach((d, i) => { if (d.err) { g.beginPath(); g.arc(x(i), y(d.raw), Math.min(2.5 + d.err, 6), 0, Math.PI * 2); g.fill(); } });
}

function renderToday() {
  const hist = store.get('td-history', []), today = new Date().toDateString();
  const t = hist.filter(h => new Date(h.ts).toDateString() === today);
  const el = $('#today');
  if (!t.length) { el.innerHTML = '<span>no tests yet today. press any key to begin</span>'; return; }
  const mins = Math.round(t.reduce((a, h) => a + h.secs, 0) / 60);
  const best = Math.max(...t.map(h => h.wpm)), acc = Math.round(t.reduce((a, h) => a + h.acc, 0) / t.length);
  const lastFive = t.slice(-5).map(h => h.wpm);
  el.innerHTML = `<span>today <b>${t.length}</b> tests</span><span><b>${mins}</b> min typed</span><span>best <b>${best}</b> wpm</span><span>avg acc <b>${acc}%</b></span><span>recent <b>${lastFive.join(' · ')}</b></span>`;
}
