// sound.js: Key sounds, generated on the fly with the Web Audio API (no sound files needed).

/* ---------- sound ---------- */
let actx = null, noise = null;
function sound(ok) {
  if (S.sound === 'off' || !S.volume) return;
  try {
    if (!actx) { actx = new (window.AudioContext || window.webkitAudioContext)(); const b = actx.createBuffer(1, actx.sampleRate * 0.08, actx.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; noise = b; }
    const t = actx.currentTime, vol = S.volume / 100 * 0.6, out = actx.createGain(); out.connect(actx.destination);
    if (!ok) { const o = actx.createOscillator(); o.type = 'triangle'; o.frequency.setValueAtTime(240, t); o.frequency.exponentialRampToValueAtTime(140, t + 0.09); out.gain.setValueAtTime(vol * 0.35, t); out.gain.exponentialRampToValueAtTime(0.001, t + 0.1); o.connect(out); o.start(t); o.stop(t + 0.11); return; }
    if (S.sound === 'beep') { const o = actx.createOscillator(); o.type = 'square'; o.frequency.value = 720 + rand(160); out.gain.setValueAtTime(vol * 0.12, t); out.gain.exponentialRampToValueAtTime(0.001, t + 0.035); o.connect(out); o.start(t); o.stop(t + 0.04); return; }
    const src = actx.createBufferSource(); src.buffer = noise; src.playbackRate.value = 0.85 + Math.random() * 0.3;
    const f = actx.createBiquadFilter();
    if (S.sound === 'thock') { f.type = 'lowpass'; f.frequency.value = 1100; out.gain.setValueAtTime(vol, t); out.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      const o = actx.createOscillator(), og = actx.createGain(); o.frequency.setValueAtTime(170 + rand(30), t); o.frequency.exponentialRampToValueAtTime(70, t + 0.05); og.gain.setValueAtTime(vol * 0.5, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.06); o.connect(og); og.connect(actx.destination); o.start(t); o.stop(t + 0.07); }
    else { f.type = 'highpass'; f.frequency.value = 2400; out.gain.setValueAtTime(vol * 0.8, t); out.gain.exponentialRampToValueAtTime(0.001, t + 0.022); }
    src.connect(f); f.connect(out); src.start(t); src.stop(t + 0.07);
  } catch (e) {}
}
