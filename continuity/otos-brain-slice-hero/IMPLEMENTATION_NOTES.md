# OTOS Brain Slice / NHS Layer Install — implementation notes

## File structure

| File | Purpose |
|------|---------|
| `index.html` | Semantic layout: NHS row, mid stack (3D slice, copy, SVG pulses/crackles), SP row + tagline |
| `styles.css` | White canvas, phase selectors on `#app[data-phase="…"]`, 3D cuboid, motion, typography |
| `script.js` | Phase timeline loop, reduced-motion branch, loop snap reset |
| `IMPLEMENTATION_NOTES.md` | This document |

## Asset insertion points

1. **`../brain.png`** (required, canonical)  
   - Referenced in `index.html` on `.face--front .slice-img` only.  
   - Do not substitute `brain-logo.svg` or redraw the silhouette.

2. **NHS logo**  
   - Replace `.nhs-placeholder` (or its inner content) with an official NHS-supplied asset.  
   - Prefer flat SVG or transparent PNG.  
   - **Locked:** no glow, bevel, glass, or restyling — only scale/position inside `.row--nhs`.

3. **Service provider logos**  
   - Replace `.sp-placeholder` blocks inside `.sp-cluster` with `<img>` or inline SVG.  
   - Keep count/order consistent with `pulse-line--sp*` and crackle paths if you reposition anchors.

## Timing variables (keep JS + CSS aligned)

CSS custom properties in `styles.css` `:root`:

- `--dur-forward`, `--dur-rotate`, `--dur-gap`, `--dur-install`, `--dur-transluce`, `--dur-copy`, `--dur-pulse`, `--dur-crackle`, `--dur-sheen`, `--dur-outro`, `--dur-ambient`, `--dur-reveal-eco`

`script.js` `DUR_MS` object must mirror phase lengths that depend on those transitions (especially `approach` ↔ `--dur-forward`, `rotate` ↔ `--dur-rotate`, etc.).

## Phase / state control

- Global: `#app` `data-phase` ∈ `base | approach | rotate | gap | install | layer | complete | outro`
- Loop reset: temporary `.loop-snap` on `#app` removes transitions for one frame when snapping back to `base`

## Tuning selectors (safe to adjust)

| Intent | Where |
|--------|--------|
| Pacing per phase | `script.js` → `DUR_MS` + matching `--dur-*` in `styles.css` |
| Z approach distance | `.app[data-phase="approach"] .slice-pivot` → `translateZ(140px)` |
| Post-rotate Z | shared pivot rule → `translateZ(95px)` |
| Slab thickness (3D) | `--slice-thickness` |
| Gap between NHS / SP | `--gap-shift` (keep coherent with `--slice-thickness`) |
| Pre-install vertical offset | `.slice-anchor` in `rotate` / `gap` → `translateY(-28px)` |
| Translucency strength | `.slice-cube` / `.slice-img` opacity in `layer` + `complete` |
| Pulse stroke | `.pulse-line` stroke / dash / `@keyframes pulseTravel` |
| Crackle intensity | `.crackle` stroke colour, `--dur-crackle`, `cracklePop` keyframes |
| Sheen | `.slice-sheen` gradient + `@keyframes sheenPass` |
| Typography | `.layer-copy__brand`, `.tagline` |
| SP cluster spacing | `.sp-cluster` `gap` |

## Canonically locked (do not alter without new founder sign-off)

- White background only (`--bg`)
- Hero silhouette from **`brain.png`** only (no redraw / trace / simplify)
- **90° horizontal** rotation = **`rotateX(90deg)`** on `.slice-pivot` (not `rotateY`, not 45°)
- Forward motion uses **real `translateZ`** under `perspective`, not scale-only zoom
- Translucency **after** seated install (`layer` / `complete`, not during `install`)
- NHS: authentic treatment only, **no glow**
- **OTOS Continuity™** on the middle layer (`.layer-copy__brand`)
- Restraint: no bounce / spring / neon / cyberpunk styling

## Lottie / export path (prototype limits)

- Today: DOM + CSS 3D + SVG strokes. After Effects / Lottie would rebuild timelines from the same phase list and easing curves.
- Locked story beats should be preserved as composition markers (`base` … `outro`).

## Known limitations

- Edge geometry of the slab is a **bounding cuboid** with gold faces; the **silhouette contour** is exact only on the front face (`brain.png`). True extruded-mesh edges would require WebGL/SVG path extrusion — out of scope for this HTML/CSS prototype.
- NHS / SP marks are **production placeholders** until official files are dropped in.
