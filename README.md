# Type Dungeon

A cozy typing-speed game that runs in your browser. Type the words, watch your WPM and accuracy, and beat your personal best.

## Features

- **Three modes:** timed (15/30/60/120s), word count (10/25/50/100), and quotes
- **Optional punctuation and numbers** for harder tests
- **Results screen** with WPM, raw speed, accuracy, consistency and a per-second chart
- **Personal bests and daily stats** saved in your browser
- **Make it yours:** six themes, custom colors, fonts, caret styles, key sounds, CRT scanlines, and your own wallpaper (drag any image onto the page)

## How to play

Open `index.html` in any modern browser and start typing.

| Key | Action |
| --- | --- |
| `tab` | restart / next test |
| `esc` | open settings |
| `ctrl` + `backspace` | clear the current word |

## How it's built

One single file, `index.html`, using plain HTML, CSS and JavaScript. There's no framework, no build step and no server. Settings and scores are stored in your browser's `localStorage`, and your wallpaper in `IndexedDB`, so nothing leaves your computer.
