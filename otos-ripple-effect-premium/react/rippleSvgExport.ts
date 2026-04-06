/* eslint-disable @typescript-eslint/no-var-requires */
// Static SVG export helpers (TypeScript deliverable).
//
// These wrappers delegate to the repo’s shared JS generator:
// `../rippleSvgExport.js`

export type RippleView = 'conservative' | 'upper';
export type RippleMode = 'static' | 'animated';

type BuildArgs = {
  width: number;
  height: number;
  view: RippleView;
  mode: RippleMode;
};

const mod = require('../rippleSvgExport.js') as {
  exportRippleSvg: (args?: { view?: RippleView; mode?: RippleMode }) => string;
  exportRippleSvg16x9: (args?: { view?: RippleView; mode?: RippleMode }) => string;
  buildRippleSvgString: (args: BuildArgs) => string;
};

export function buildRippleSvgString(args: BuildArgs) {
  return mod.buildRippleSvgString(args);
}

export function exportRippleSvg(args: { view?: RippleView; mode?: RippleMode } = {}) {
  return mod.exportRippleSvg(args);
}

// 16:9 widescreen variant for presentations.
export function exportRippleSvg16x9(args: { view?: RippleView; mode?: RippleMode } = {}) {
  return mod.exportRippleSvg16x9(args);
}

