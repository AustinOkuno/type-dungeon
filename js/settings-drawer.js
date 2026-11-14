// settings-drawer.js: The settings panel that slides in from the side, and wiring each control to a setting.

/* ---------- settings drawer ---------- */
function toggleSettings(force) {
  const open = force !== undefined ? force : !settingsOpen();
  $('#drawer').classList.toggle('open', open); $('#scrim').classList.toggle('open', open);
  if (open) { syncSettings(); setTimeout(() => $('#closeSettings').focus(), 50); } else { focusInput(); }
}
$('#openSettings').addEventListener('click', () => toggleSettings(true));
$('#closeSettings').addEventListener('click', () => toggleSettings(false));
$('#scrim').addEventListener('click', () => toggleSettings(false));

$('#font').innerHTML = Object.keys(FONTS).map(f => `<option>${f}</option>`).join('');
function syncSettings() {
  $('#themes').innerHTML = Object.entries(THEMES).map(([k, t]) => `<button class="theme ${k === S.theme && !Object.keys(S.custom).length ? 'on' : ''}" data-theme-key="${k}" style="background:${t.bg};color:${t.text}"><span class="sw">${['accent', 'accent2', 'text', 'sub'].map(c => `<i style="background:${t[c]}"></i>`).join('')}</span>${t.name}</button>`).join('');
  const c = colors();
  $('#cAccent').value = c.accent; $('#cText').value = c.text; $('#cBg').value = c.bg;
  $('#bgPos').value = S.bgPos; $('#bgDim').value = S.bgDim; $('#bgBlur').value = S.bgBlur; $('#glass').value = S.glass;
  $('#scanlines').checked = S.scanlines; $('#font').value = S.font; $('#fontSize').value = S.fontSize;
  $('#caret').value = S.caret; $('#smooth').checked = S.smooth; $('#liveStats').checked = S.liveStats; $('#focusMode').checked = S.focusMode;
  $('#sound').value = S.sound; $('#volume').value = S.volume; $('#clock24').checked = S.clock24; $('#clockSecs').checked = S.clockSecs;
  $('#bgDimV').textContent = S.bgDim + '%'; $('#bgBlurV').textContent = S.bgBlur + 'px'; $('#glassV').textContent = S.glass + '%';
  $('#fontSizeV').textContent = S.fontSize + 'px'; $('#volumeV').textContent = S.volume + '%';
}
$('#themes').addEventListener('click', e => { const b = e.target.closest('[data-theme-key]'); if (!b) return; S.theme = b.dataset.themeKey; S.custom = {}; save(); applyLook(); syncSettings(); if (T.finished) drawChart(); });
const bind = (id, key, kind) => $(id).addEventListener('input', e => {
  const el = e.target;
  S[key] = kind === 'bool' ? el.checked : kind === 'num' ? +el.value : el.value;
  save(); applyLook(); syncSettings(); renderClock();
});
bind('#bgPos', 'bgPos'); bind('#bgDim', 'bgDim', 'num'); bind('#bgBlur', 'bgBlur', 'num'); bind('#glass', 'glass', 'num');
bind('#scanlines', 'scanlines', 'bool'); bind('#font', 'font'); bind('#fontSize', 'fontSize', 'num'); bind('#caret', 'caret');
bind('#smooth', 'smooth', 'bool'); bind('#liveStats', 'liveStats', 'bool'); bind('#focusMode', 'focusMode', 'bool');
bind('#sound', 'sound'); bind('#volume', 'volume', 'num'); bind('#clock24', 'clock24', 'bool'); bind('#clockSecs', 'clockSecs', 'bool');
[['#cAccent', 'accent'], ['#cText', 'text'], ['#cBg', 'bg']].forEach(([id, k]) => $(id).addEventListener('input', e => { S.custom = Object.assign({}, S.custom, { [k]: e.target.value }); save(); applyLook(); syncSettings(); }));
$('#sound').addEventListener('change', () => sound(true));
$('#resetAll').addEventListener('click', () => { S = Object.assign({}, DEFAULTS); save(); applyLook(); syncSettings(); renderClock(); newTest(false); toast('Settings reset.'); });
