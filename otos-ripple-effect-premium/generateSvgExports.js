/* eslint-disable no-console */
// Generates export-ready static SVG files for presentations.
// Usage: node generateSvgExports.js

const fs = require('fs');
const path = require('path');
const { exportRippleSvg, exportRippleSvg16x9 } = require('./rippleSvgExport.js');

const exportsDir = path.join(__dirname, 'exports');
if (!fs.existsSync(exportsDir)) fs.mkdirSync(exportsDir, { recursive: true });

// Embed a photo texture so the exported SVG looks like real water.
// (We keep it self-contained via a base64 data URL.)
const rippleTexturePath = path.join(__dirname, '..', 'images', 'Ripple-1024x546.jpg');
let waterTextureSrc = null;
try {
  const buf = fs.readFileSync(rippleTexturePath);
  waterTextureSrc = `data:image/jpeg;base64,${buf.toString('base64')}`;
} catch (e) {
  console.warn('Water texture image not found; using procedural water only.', e && e.message ? e.message : e);
}

const targets = [
  { view: 'conservative', w: '1200x1200', fn: exportRippleSvg },
  { view: 'upper', w: '1200x1200', fn: exportRippleSvg },
  { view: 'conservative', w: '1200x675', fn: exportRippleSvg16x9 },
  { view: 'upper', w: '1200x675', fn: exportRippleSvg16x9 },
];

for (const t of targets) {
  const svg = t.fn({ view: t.view, mode: 'static', waterTextureSrc });
  const fileName = `ripple-premium-${t.view}-${t.w}-static.svg`;
  const outPath = path.join(exportsDir, fileName);
  fs.writeFileSync(outPath, svg, 'utf8');
  console.log('Wrote:', outPath);
}

console.log('Done.');

