# Name World Cup 🏆

A fun, funny knockout tournament for choosing a **baby or pet name**. Build a squad of up to 32
names, ⭐ your favourites so they get **seeded apart** (they can't clash early), then fight it out
head-to-head until one name lifts the trophy — with plenty of animation and confetti along the way.

## Features

- **Squad builder** — type your own names or tap suggestions (recent top UK baby names, plus pet
  and comedy sets).
- **Seeding** — starred favourites become the top seeds and are spread across the bracket.
- **Bracket sizes** 8 / 16 / 32, with byes for the top seeds when the bracket isn't full.
- **Head-to-head knockout** with upset commentary, an animated bracket minimap, and a champion
  reveal with confetti.
- **Share a squad** — the champion screen copies a link that pre-loads the same names for a friend.
- Everything saves to your browser (`localStorage`), so you can resume mid-tournament.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # seeding + bracket logic
npm run build    # type-check + production build to dist/
```

## Deploy (free, static)

`npm run build` produces a static `dist/` folder. Drop it on any static host:

- **Netlify / Vercel** — import the repo; build command `npm run build`, publish directory `dist`.
- **GitHub Pages** — publish the `dist/` contents (the app uses relative asset paths, so it works
  from a repo subpath).

Then share the URL — each friend runs their own tournament.

## Tech

React + TypeScript + Vite · Tailwind CSS · Framer Motion · canvas-confetti · Vitest.
