// wallpaper.js: Custom wallpaper (upload or drag-and-drop an image) and the little toast messages.

/* ---------- wallpaper ---------- */
let bgUrl = null;
function setBgBlob(blob) {
  if (bgUrl) URL.revokeObjectURL(bgUrl);
  const bg = $('#bg');
  if (blob) { bgUrl = URL.createObjectURL(blob); bg.style.backgroundImage = `url("${bgUrl}")`; bg.classList.add('has-img'); }
  else { bgUrl = null; bg.style.backgroundImage = ''; bg.classList.remove('has-img'); }
}
async function useImageFile(file) {
  if (!file || !file.type.startsWith('image/')) { toast('That file is not an image. Try a .jpg, .png or .webp.'); return; }
  try {
    const img = await createImageBitmap(file);
    const scale = Math.min(1, 2560 / Math.max(img.width, img.height));
    const c = document.createElement('canvas'); c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    const blob = await new Promise(r => c.toBlob(r, 'image/jpeg', 0.9));
    setBgBlob(blob);
    const ok = await idb.set('wallpaper', blob);
    toast(ok ? 'Wallpaper set and saved in this browser.' : 'Wallpaper set for now. This browser would not let us save it for next time.');
  } catch (e) { setBgBlob(file); toast('Wallpaper set.'); idb.set('wallpaper', file); }
}
$('#bgUpload').addEventListener('click', () => $('#bgFile').click());
$('#bgFile').addEventListener('change', e => { useImageFile(e.target.files[0]); e.target.value = ''; });
$('#bgClear').addEventListener('click', () => { setBgBlob(null); idb.del('wallpaper'); toast('Back to the default background.'); });
let dragDepth = 0;
window.addEventListener('dragenter', e => { if ([...(e.dataTransfer?.types || [])].includes('Files')) { dragDepth++; document.body.classList.add('dragging'); } });
window.addEventListener('dragleave', () => { dragDepth = Math.max(0, dragDepth - 1); if (!dragDepth) document.body.classList.remove('dragging'); });
window.addEventListener('dragover', e => e.preventDefault());
window.addEventListener('drop', e => { e.preventDefault(); dragDepth = 0; document.body.classList.remove('dragging'); const f = e.dataTransfer?.files?.[0]; if (f) useImageFile(f); });
idb.get('wallpaper').then(b => { if (b) setBgBlob(b); });

let toastT;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2600); }
