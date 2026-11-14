// settings.js: Themes, fonts, default settings, and applyLook() which turns the current settings into colors and styles on the page.

/* ---------- settings ---------- */
const THEMES = {
  cocoa:   { name: 'cocoa',        bg: '#1d1512', sub: '#7a6355', text: '#f0e1cf', accent: '#e3a857', accent2: '#7d2a33', error: '#e26d6d' },
  maroon:  { name: 'maroon night', bg: '#1a0f12', sub: '#77525a', text: '#f2dfe0', accent: '#e0707b', accent2: '#5e1b28', error: '#ff9a7a' },
  mint:    { name: 'mint',         bg: '#1b1f1a', sub: '#61705d', text: '#e4ecdf', accent: '#8fc25a', accent2: '#35552a', error: '#e07a6a' },
  sakura:  { name: 'sakura',       bg: '#241a1f', sub: '#80646f', text: '#f6e6ec', accent: '#f2a7c3', accent2: '#6b2d45', error: '#ff7b8a' },
  amber:   { name: 'crt amber',    bg: '#120d08', sub: '#6e5224', text: '#ffcf80', accent: '#ffb000', accent2: '#4a3210', error: '#ff5a3c' },
  paper:   { name: 'paper',        bg: '#e9dfd2', sub: '#a39283', text: '#3a2a24', accent: '#8c2f39', accent2: '#cdb7a2', error: '#c0392b' }
};
const FONTS = {
  'JetBrains Mono': '"JetBrains Mono"', 'Ubuntu Mono': '"Ubuntu Mono"', 'IBM Plex Mono': '"IBM Plex Mono"',
  'Space Mono': '"Space Mono"', 'VT323 (terminal)': '"VT323"', 'Nunito (rounded)': '"Nunito"'
};
const DEFAULTS = {
  theme: 'cocoa', custom: {}, font: 'JetBrains Mono', fontSize: 28, caret: 'line', smooth: true,
  liveStats: true, focusMode: true, sound: 'thock', volume: 45, clock24: false, clockSecs: false,
  bgDim: 50, bgBlur: 0, glass: 72, bgPos: 'right', scanlines: true,
  mode: 'time', time: 30, words: 25, punct: false, nums: false
};
let S = Object.assign({}, DEFAULTS, store.get('td-settings', {}));
const save = () => store.set('td-settings', S);

const rgb = h => { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); const n = parseInt(h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const lum = h => { const [r, g, b] = rgb(h); return (0.299 * r + 0.587 * g + 0.114 * b) / 255; };
const colors = () => Object.assign({}, THEMES[S.theme] || THEMES.cocoa, S.custom);

function applyLook() {
  const c = colors(), R = document.documentElement.style;
  ['bg', 'sub', 'text', 'accent', 'accent2', 'error'].forEach(k => R.setProperty('--' + k, c[k]));
  R.setProperty('--accent-rgb', rgb(c.accent).join(','));
  R.setProperty('--accent2-rgb', rgb(c.accent2).join(','));
  R.setProperty('--text-rgb', rgb(c.text).join(','));
  R.setProperty('--bg-rgb', rgb(c.bg).join(','));
  R.setProperty('--panel', `rgba(${rgb(c.bg).join(',')},${S.glass / 100})`);
  R.setProperty('--dim', `rgba(${rgb(c.bg).join(',')},${S.bgDim / 100})`);
  R.setProperty('--line', `rgba(${rgb(c.text).join(',')},.1)`);
  R.setProperty('--blur', S.bgBlur + 'px');
  R.setProperty('--bgpos', S.bgPos);
  R.setProperty('--type-font', `${FONTS[S.font] || FONTS['JetBrains Mono']}, ui-monospace, Menlo, monospace`);
  R.setProperty('--type-size', `min(${S.fontSize}px, 6.6vw)`);
  R.colorScheme = lum(c.bg) > 0.5 ? 'light' : 'dark';
  $('#scan').classList.toggle('off', !S.scanlines);
  caretEl.className = 'caret ' + (S.caret === 'line' ? '' : S.caret) + (S.smooth ? ' smooth' : '') + ' idle';
  $('#live').classList.toggle('hide-stats', !S.liveStats);
  document.body.classList.toggle('focusmode', S.focusMode);
  requestAnimationFrame(() => { measure(); updateCaret(); });
}
