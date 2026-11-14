// main.js: Starts the game once every other file has loaded. Keep this file last.

/* ---------- boot ---------- */
window.addEventListener('resize', () => { measure(); updateCaret(); if (T.finished) drawChart(); });
applyLook(); renderClock(); setInterval(renderClock, 1000); renderToday(); newTest(false); setFocused();
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measure(); updateCaret(); });
document.fonts && document.fonts.addEventListener && document.fonts.addEventListener('loadingdone', () => { measure(); updateCaret(); });
