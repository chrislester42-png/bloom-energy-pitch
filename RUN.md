# Bloom pitch site — how to run

Next.js 16 + React 19 + Tailwind v4 + Framer Motion. Built per the spec in
`../Website Plan and Spec.md` and the design-taste-frontend ruleset.

## Run locally

```bash
cd "08 Website/bloom-site"
npm install        # first time only
npm run dev        # http://localhost:3000
```

`npm run build` then `npm run start` for a production build.

## What's here so far

- **Hero + signature cell-grid motif** (`components/Hero.tsx`, `components/CellGrid.tsx`)
- **Theme tokens** — charcoal base + single ember accent (`app/globals.css`)
- **Financial dataset** parsed from the Excel (`data/financials.ts`) — drives the
  model + valuation scenarios. Regenerate when `BE_financials.xlsx` updates.
- A placeholder "8 beats" section listing the deck to come.

## Structure

```
app/            layout (fonts), globals (theme), page (composition)
components/     Hero, CellGrid  (interactive = 'use client' leaf components)
data/           financials.ts  (single source of truth for numbers)
```

## Next build steps

Sections 1–3, 5, 6, 8 from a `content.ts`, then the interactive financial model
(Section 4) and valuation scenarios (Section 7), then deploy to Vercel.

## Deploy to Netlify

This site is a **static export** (`output: "export"` in `next.config.ts`), so it's
just HTML/CSS/JS — no server runtime needed.

```bash
npm run build      # produces the /out folder
```

Then either:

- **Drag-and-drop:** open https://app.netlify.com/drop and drop the `out/` folder. Instant URL.
- **Git (recommended):** push this repo, "Add new site" in Netlify. It reads
  `netlify.toml` automatically — build command `npm run build`, publish dir `out`.
- **CLI:** `npx netlify deploy --prod --dir=out`

No env vars or backend required.
