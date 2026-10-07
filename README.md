# IFSI

Static HTML + TypeScript + jQuery + Day.js app, built with Vite.

## Data

Seed data lives in `public/data/seed.json` and is served at `/data/seed.json`.
The app is intended to read from `localStorage` first, fall back to the seed
file when nothing is stored, and write only to `localStorage`.

## Scripts

```sh
npm install
npm run dev       # local dev server
npm run build     # typecheck + production build to dist/
npm run preview   # serve the production build
```

## Deploy

Hosted on Vercel, which auto-detects Vite (build `npm run build`, output `dist`).
