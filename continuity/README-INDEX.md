# Continuity Repo Index

Last updated: 2026-04-05

## 1) Canonical live pages

Use these as source-of-truth pages for live updates.

- `continuity/index.html` — continuity landing.
- `continuity/full-scroll3.html` — primary full-scroll experience.
- `continuity/otos-ripple-effect-premium/otos-ripple-effect-premium.html` — canonical ripple premium page.
- `continuity/otos-ripple-cascade.html` — canonical ripple cascade page.
- `continuity/work-index.html` — work overview.
- `continuity/work-founder.html` — founder work page.
- `continuity/reporting.html` — reporting page.
- `continuity/quotes.html` — quotes page.

## 2) Experimental / archive pages

Do not edit these first when making production updates.

- `continuity/archive/` — archived experiments and superseded versions.
- `continuity/full-scroll2-archive.html` — archived full-scroll variant.
- `continuity/ripplecostanimation.html` and `continuity/ripplecostanimation/index.html` — older ripple experiment builds.
- Any root `*-v*.html/css/js` files outside canonical folders should be treated as experimental unless explicitly promoted.

## 3) Shared components

Reusable files that multiple pages depend on.

- `continuity/otos-shared.css`
- `continuity/otos-shared.js`
- `continuity/hero-carousel.js`
- `continuity/diagrams/otos-continuity-shared.css`
- `continuity/otos-ripple-effect-premium/rippleSvgExport.js`

### Ripple Premium canonical set
- `continuity/otos-ripple-effect-premium/otos-ripple-effect-premium.html`
- `continuity/otos-ripple-effect-premium/otos-ripple-effect-premium.css`
- `continuity/otos-ripple-effect-premium/otos-ripple-effect-premium.js`
- `continuity/otos-ripple-effect-premium/rippleSvgExport.js`

## 4) Assets / images sources

Primary continuity image locations.

- `continuity/images/` — production image assets.
- `assets/` — shared brand/visual assets outside continuity folder.
- `continuity/hero-overlays/` — overlay-specific media and screenshots.

## Working rules (important)

1. If a file is not listed as canonical here, treat it as experimental until reviewed.
2. Prefer updating shared component files instead of duplicating scripts/styles.
3. Archive superseded variants instead of deleting immediately.
4. Keep page-specific experimental files under `continuity/archive/` with dated folders.
