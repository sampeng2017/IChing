# IChing Web

Local web migration of the original Windows Phone `易經占蔔` app.

## Features

- 即時起卦 using 梅花易數年月日時起卦.
- 隨機起卦 using browser crypto randomness when available.
- Browse all 64 gua with previous/next controls and a selector.
- Change the moving line manually for browsing.
- View 卦辭, 卦象, 偈語, 主占斷, 分類占斷, 卦象結構, and 梅花易術.
- About / Method section explaining 梅花易數 and 六十四卦 browsing.
- Saved reading history in local browser storage.
- Share/copy and text export for reading results.
- Installable offline PWA assets, including iPhone-friendly icons and screenshots.
- Lunar calendar conversion via `solarlunar`.

## Setup

```bash
npm install
npm run generate:data
npm run dev
```

Open the Vite URL printed in the terminal, usually:

```text
http://127.0.0.1:5173/
```

## Scripts

```bash
npm run generate:data   # Convert original .resx files into JSON
npm run validate:data   # Validate converted resource completeness
npm test                # Run Node tests
npm run build           # Production build
npm run preview         # Preview production build locally
```

## Offline Use

The production build uses a generated service worker to precache local HTML, CSS, JavaScript, image, icon, screenshot, and manifest assets. Run `npm run build` and serve `dist/` with `npm run preview` or any static web server to test installable offline behavior.

## Disclaimer

This app is for traditional culture, Yi Jing study, reference, and entertainment. It is not legal, medical, financial, psychological, investment, or other professional advice.

## Source Layout

- `src/core/bagua.js`: trigrams, hexagrams, changing lines, 互卦/錯卦/綜卦, five phases.
- `src/core/chinese-calendar.js`: lunar date wrapper around `solarlunar`.
- `src/core/divination.js`: random and time-based casting.
- `src/core/descriptions.js`: tab content and generated interpretations.
- `src/data/*.json`: converted Traditional Chinese resources.
- `public/images`: original hexagram and background assets.
- `scripts/convert-resx.mjs`: resource conversion and validation.

## Notes

The original custom lunar calendar table had known mismatches around several dates, including `1954-11-25` and the 2033 leap month. This version uses `solarlunar`, expanding supported Gregorian dates to `1900-01-31` through `2100-12-31`.
