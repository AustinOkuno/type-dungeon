# Type Dungeon

A cozy typing-speed game that runs in your browser. Type the words, watch your WPM and accuracy, and beat your personal best.

**▶ Play it now: [austinokuno.github.io/type-dungeon](https://austinokuno.github.io/type-dungeon/)**

> **Early prototype.** This is the first version of Type Dungeon and the starting point for a bigger project. Expect things to change as it grows.

## Features

- **Three modes:** timed (15/30/60/120s), word count (10/25/50/100), and quotes
- **Optional punctuation and numbers** for harder tests
- **Results screen** with WPM, raw speed, accuracy, consistency and a per-second chart
- **Personal bests and daily stats** saved in your browser
- **Make it yours:** six themes, custom colors, fonts, caret styles, key sounds, CRT scanlines, and your own wallpaper (drag any image onto the page)

## Planned

Ideas for where this goes next (not promises, and the order may change):

- Background music and more key sounds
- More stats: progress over time and your weakest keys
- More word lists and quotes

## How to play

Play it at the link above, or open `index.html` in any modern browser, and start typing.

| Key | Action |
| --- | --- |
| `tab` | restart / next test |
| `esc` | open settings |
| `ctrl` + `backspace` | clear the current word |

## How it's built

Plain HTML, CSS and JavaScript. There's no framework, no build step and no server, so you can open `index.html` straight from your computer (or host it on GitHub Pages) and it just works. Settings and scores are stored in your browser's `localStorage`, and your wallpaper in `IndexedDB`, so nothing leaves your computer.

## Project structure

```
index.html              the page itself: layout and buttons, plus links to the files below
styles.css              all the styling: colors, layout, animations
js/
  storage.js            saving settings and scores in the browser
  settings.js           themes, fonts, defaults, and applying them to the page
  words.js              the word list, quotes, and random word generator
  typing.js             the typing test: drawing words, the caret, handling key presses
  stats.js              WPM, accuracy, results screen, chart, personal bests
  sound.js              key sounds (made with the Web Audio API, no audio files)
  clock.js              the big clock and greeting
  modebar.js            the time / words / quote bar above the test
  wallpaper.js          custom wallpaper upload and drag-and-drop, toast messages
  settings-drawer.js    the settings panel and its controls
  main.js               starts the game (always loaded last)
```

The JavaScript files are plain scripts that share one global scope, so a later file can use anything an earlier one defines. Because of that, the order of the `<script>` tags at the bottom of `index.html` matters: keep `storage.js` first and `main.js` last.
