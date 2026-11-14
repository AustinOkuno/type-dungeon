// modebar.js: The mode bar above the words: time / words / quote, punctuation, numbers and test length.

/* ---------- modebar ---------- */
function renderModebar() {
  document.querySelectorAll('[data-mode]').forEach(b => b.classList.toggle('on', b.dataset.mode === S.mode));
  $('#mbPunct').classList.toggle('on', S.punct); $('#mbNums').classList.toggle('on', S.nums);
  const q = S.mode === 'quote';
  ['#mbPunct', '#mbNums', '#sep1', '#sep2'].forEach(s => $(s).hidden = q);
  const opts = S.mode === 'time' ? [15, 30, 60, 120] : S.mode === 'words' ? [10, 25, 50, 100] : [];
  const cur = S.mode === 'time' ? S.time : S.words;
  $('#amounts').innerHTML = opts.map(o => `<button data-amount="${o}" class="${o === cur ? 'on' : ''}">${o}</button>`).join('');
}
$('#modebar').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.mode) S.mode = b.dataset.mode;
  if (b.dataset.toggle) S[b.dataset.toggle] = !S[b.dataset.toggle];
  if (b.dataset.amount) S[S.mode === 'time' ? 'time' : 'words'] = +b.dataset.amount;
  save(); b.blur(); newTest(false);
});
$('#nextBtn').addEventListener('click', () => newTest(false));
$('#repeatBtn').addEventListener('click', () => newTest(true));
