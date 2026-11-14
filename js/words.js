// words.js: The word list, the quotes, and genWords() which builds a random line of words (with optional punctuation and numbers).

/* ---------- words ---------- */
const WORDS = ('the be of and a to in he have it that for they with as not on she at by this we you do but from or which one would all will there say who make when can more if no man out other so what time up go about than into could state only new year some take come these know see use get like then first any work now may such give over think most even find day also after way many must look before great back through long where much should well people down own just because good each those feel seem how high too place little world very still nation hand old life tell write become here show house both between need mean call develop under last right move thing general school never same another begin while number part turn real leave might want point form off child few small since against ask late home interest large person end open public follow during present without again hold govern around possible head consider word program problem however lead system set order eye plan run keep face fact group play stand increase early course change help line light night music code screen key quiet window rain tea dream pixel signal terminal shell spark glow ember drift ').trim().split(/\s+/);
const QUOTES = [
  'the old laptop hummed in the dark, fan whirring like a tiny jet, while the cursor blinked and waited for me to say something worth saving.',
  'every key you press is a small promise to your future self that tomorrow your fingers will know the way without you.',
  'we compiled at midnight, ate cold noodles over the keyboard, and swore the bug was a feature until the tests finally turned green.',
  'rain on the window, quiet music in the headphones, a terminal full of soft text, nowhere to be and nothing to prove.',
  'i opened a new tab, ignored the video i meant to watch, and typed until the words stopped feeling like words.',
  'the dungeon is only dark until you learn where the walls are; after that it is just a hallway you walk every night.',
  'slow is smooth and smooth is fast, so keep your eyes on the next word and let your hands catch up on their own.'
];
const rand = n => Math.floor(Math.random() * n);
function genWords(n) {
  const out = []; let cap = true;
  for (let i = 0; i < n; i++) {
    let w = WORDS[rand(WORDS.length)];
    if (out.length && w === out[out.length - 1]) w = WORDS[rand(WORDS.length)];
    if (S.nums && Math.random() < 0.12) { w = String(rand(10000)); }
    else if (S.punct) {
      if (cap) w = w[0].toUpperCase() + w.slice(1);
      cap = false;
      const r = Math.random();
      if (r < 0.1) w += ','; else if (r < 0.17) { w += '.'; cap = true; } else if (r < 0.2) { w += '?'; cap = true; } else if (r < 0.22) { w += '!'; cap = true; }
    }
    out.push(w);
  }
  return out;
}
