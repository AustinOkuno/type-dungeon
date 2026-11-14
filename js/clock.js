// clock.js: The big clock and greeting in the top-left corner.

/* ---------- clock ---------- */
function renderClock() {
  const d = new Date(); let h = d.getHours(); const m = String(d.getMinutes()).padStart(2, '0'), s = String(d.getSeconds()).padStart(2, '0');
  let ap = '';
  if (!S.clock24) { ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12; } else h = String(h).padStart(2, '0');
  $('#clockTime').innerHTML = `${h}:${m}${S.clockSecs ? `<span class="secs">:${s}</span>` : ''}${ap ? `<span class="ampm">${ap}</span>` : ''}`;
  const hr = d.getHours(), greet = hr < 5 ? 'up late' : hr < 12 ? 'good morning' : hr < 18 ? 'good afternoon' : 'good evening';
  $('#clockDate').textContent = `${greet} · ${d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).toLowerCase()}`;
  $('#footClock').innerHTML = `<kbd>tab</kbd> restart <kbd>esc</kbd> settings`;
}
