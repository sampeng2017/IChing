# IChing Web

Local web migration of the original Windows Phone `易經占蔔` app.

## Features

- 即時起卦 using 梅花易數年月日時起卦.
- 隨機起卦 using browser crypto randomness when available.
- Browse all 64 gua with previous/next controls and a selector.
- Change the moving line manually for browsing.
- View 卦辭, 卦象, 偈語, 主占斷, 分類占斷, 卦象結構, and 梅花易術.
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

