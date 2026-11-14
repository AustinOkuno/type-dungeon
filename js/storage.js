// storage.js: Shortcut for finding elements, plus saving data in the browser (localStorage for settings and scores, IndexedDB for the wallpaper image).

const $ = s => document.querySelector(s);

/* ---------- storage ---------- */
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};
const idb = {
  open() { return new Promise((res, rej) => { try { const r = indexedDB.open('type-dungeon', 1); r.onupgradeneeded = () => r.result.createObjectStore('kv'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); } catch (e) { rej(e); } }); },
  async get(k) { try { const db = await this.open(); return await new Promise(res => { const q = db.transaction('kv').objectStore('kv').get(k); q.onsuccess = () => res(q.result); q.onerror = () => res(null); }); } catch (e) { return null; } },
  async set(k, v) { try { const db = await this.open(); await new Promise(res => { const t = db.transaction('kv', 'readwrite'); t.objectStore('kv').put(v, k); t.oncomplete = res; t.onerror = res; }); return true; } catch (e) { return false; } },
  async del(k) { try { const db = await this.open(); db.transaction('kv', 'readwrite').objectStore('kv').delete(k); } catch (e) {} }
};
