// Premium OTOS ripple-effect SVG generator (static + animated markup).
// Used by the interactive HTML page and as an export-ready SVG source of truth.
//
// Note: This repository is primarily static HTML/JS, so this file is plain JS.
// The React/TypeScript deliverables are provided in parallel in `react/`.

const RING_COLORS = {
  0: '#0D4F5C', // deep teal / navy
  1: '#1A6B7A', // clinical
  2: '#C0392B', // justice
  3: '#2E4057', // housing navy
  4: '#5D737E', // economy grey-blue
  5: '#7B8C6E', // family sage
  6: '#4A4A8A', // intergenerational purple
  7: '#9B9B9B', // tail grey
};

const ACCENT_GOLD = '#F4B942';
const BG = '#0A1628';

const GBP = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 });

function fmtGBP(n) {
  const num = Number(n);
  if (!Number.isFinite(num)) return String(n);
  return `£${GBP.format(Math.round(num))}`;
}

function ringLabel(i) {
  switch (i) {
    case 0:
      return 'NIA Individual';
    case 1:
      return 'Clinical / NHS';
    case 2:
      return 'Criminal Justice';
    case 3:
      return 'Housing & Welfare';
    case 4:
      return 'Employment / Economy';
    case 5:
      return 'Family Impact';
    case 6:
      return 'The Waveform Doubles';
    case 7:
      return 'Community / Society';
    default:
      return `Ring ${i}`;
  }
}

function getRingKeyItem(view, ringIndex) {
  const v = view; // 'conservative' | 'upper'
  // We display one key £ line per ring in the SVG body.
  // Full breakdown is in the tooltip and click-to-expand panel.
  switch (ringIndex) {
    case 0:
      return {
        text: v === 'conservative' ? 'Conservative system burden: £40,070/year' : 'Upper-bound system burden: £78k–£95k+/year',
        href: 'https://www.gov.uk/government/publications/life-sciences-healthcare-goals/addiction-healthcare-goals',
      };
    case 1:
      return { text: 'A&E attendance: £200–£560 per visit', href: 'https://www.kingsfund.org.uk/insight-and-analysis/data-and-charts/key-facts-figures-nhs' };
    case 2:
      return { text: 'Police incident: £200–£700', href: 'https://www.nao.org.uk/reports/reducing-the-harm-from-illegal-drugs/' };
    case 3:
      return { text: 'Benefits + lost tax: £15,000–£25,000/year', href: 'https://www.gov.uk/government/collections/supported-housing' };
    case 4:
      return { text: 'Employer productivity loss: £10,000–£25,000', href: 'https://www.gov.uk/government/collections/dwp-administrative-costs' };
    case 5:
      return { text: 'Family/carer impact: £1,000–£5,000', href: 'https://www.gov.uk/government/collections/nhs-reference-costs' };
    case 6:
      return { text: 'Untreated ADHD national cost: £17bn/year', href: 'https://www.england.nhs.uk/mental-health/adhd/' };
    case 7:
      return { text: 'Street-cleaning uplift: £50–£200/year', href: 'https://www.local.gov.uk/' };
    default:
      return { text: '—', href: '#' };
  }
}

function getRingTotal(view, ringIndex) {
  // Displayed gold “cost figure” per ring (numeric for the animated counter).
  // For conservative view, use the sub-totals specified in the prompt where available.
  // For upper view, we approximate by scaling using each ring’s stated ranges
  // (keeps the diagram consistent without needing occurrence counts).
  const conservative = {
    0: 40070,
    1: 9080,
    2: 1900,
    3: 16350,
    4: 11000,
    5: 3000,
    6: 0, // future cost breeder: not a “present cost” number
    7: 250, // tail conservatively: ~£50–£200 + ~£200–£500, simplified
  };
  const upper = {
    0: 86500, // midpoint for counter; display range label separately
    1: 15800, // 9,080 scaled by stated min/max ranges
    2: 5700,
    3: 27250,
    4: 28450,
    5: 11000,
    6: 0,
    7: 700, // tail upper: ~£200 + ~£500
  };
  return view === 'conservative' ? conservative[ringIndex] : upper[ringIndex];
}

function getRingStrokeWidth(view, ringIndex) {
  // Stroke widths (visual weight). Derived from totals and then clamped for readability.
  const base = [22, 16, 10, 18, 14, 11, 9, 7];
  const t = getRingTotal(view, ringIndex);
  // Normalize roughly to ring 0.
  const norm = ringIndex === 0 ? 1 : Math.min(2.2, Math.max(0.35, t / Math.max(1, getRingTotal(view, 0))));
  const scaled = base[ringIndex] * (0.85 + norm * 0.55);
  return Math.max(5, Math.min(28, scaled));
}

function getRingOpacity(view, ringIndex) {
  // Ring 7 fades as a “tail”.
  if (ringIndex === 7) return view === 'conservative' ? 0.55 : 0.68;
  if (ringIndex === 6) return 0.9;
  return 0.95;
}

function shortSourceText(url) {
  if (!url) return '';
  try {
    const u = new URL(url);
    const host = u.host.replace(/^www\./, '');
    return host;
  } catch {
    return url;
  }
}

function buildRippleSvgString({
  width,
  height,
  view, // 'conservative' | 'upper'
  mode, // 'static' | 'animated'
}) {
  const w = width;
  const h = height;
  const cx = w / 2;
  const cy = h / 2;

  const isWide = w !== 1200 || h !== 1200;
  // Keep rings within a safe margin.
  const ringRadiusStep = isWide ? 39 : 45;
  const ringRadii = [isWide ? 92 : 120, ...[1, 2, 3, 4, 5, 6, 7].map((i) => (isWide ? 92 : 120) + i * ringRadiusStep)];

  const svg = [];
  svg.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="OTOS premium ripple-effect cost diagram">`);

  // Background
  svg.push(`<defs>`);
  svg.push(`<linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">`);
  svg.push(`<stop offset="0%" stop-color="${BG}" stop-opacity="0.98"/>`);
  svg.push(`<stop offset="100%" stop-color="#071022" stop-opacity="1"/>`);
  svg.push(`</linearGradient>`);
  svg.push(`<radialGradient id="centreStone" cx="50%" cy="45%" r="60%">`);
  svg.push(`<stop offset="0%" stop-color="#0F6B78" stop-opacity="0.92"/>`);
  svg.push(`<stop offset="55%" stop-color="${RING_COLORS[0]}" stop-opacity="1"/>`);
  svg.push(`<stop offset="100%" stop-color="#071022" stop-opacity="1"/>`);
  svg.push(`</radialGradient>`);
  svg.push(`<radialGradient id="ringHalo" cx="50%" cy="50%" r="60%">`);
  svg.push(`<stop offset="0%" stop-color="#F4B942" stop-opacity="0.18"/>`);
  svg.push(`<stop offset="55%" stop-color="#F4B942" stop-opacity="0.05"/>`);
  svg.push(`<stop offset="100%" stop-color="#F4B942" stop-opacity="0"/>`);
  svg.push(`</radialGradient>`);
  svg.push(`<filter id="softGlow" x="-40%" y="-40%" width="180%" height="180%">`);
  svg.push(`<feGaussianBlur stdDeviation="4" result="blur"/>`);
  svg.push(`<feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.9 0" result="col"/>`);
  svg.push(`<feMerge><feMergeNode in="col"/><feMergeNode in="SourceGraphic"/></feMerge>`);
  svg.push(`</filter>`);
  svg.push(`</defs>`);
  svg.push(`<rect x="0" y="0" width="${w}" height="${h}" fill="url(#bgGrad)"/>`);

  // Centre stone
  const stoneR = isWide ? 46 : 52;
  svg.push(`<g id="centre" style="font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;">`);
  svg.push(`<circle cx="${cx}" cy="${cy}" r="${stoneR + 14}" fill="url(#ringHalo)" opacity="0.65"/>`);
  svg.push(`<circle cx="${cx}" cy="${cy}" r="${stoneR}" fill="url(#centreStone)" stroke="rgba(244,185,66,0.25)" stroke-width="${isWide ? 1.2 : 1.5}"/>`);
  svg.push(`<text x="${cx}" y="${cy - 6}" text-anchor="middle" font-size="${isWide ? 14 : 16}" font-weight="800" fill="#E8FAFF" letter-spacing="-0.01em">NIA Individual</text>`);
  svg.push(`<text x="${cx}" y="${cy + 14}" text-anchor="middle" font-size="${isWide ? 11 : 12}" font-weight="600" fill="rgba(232,250,255,0.92)">Undiagnosed ADHD + Crack/Heroin</text>`);
  svg.push(`</g>`);

  // Ring groups
  svg.push(`<g id="rings" stroke-linecap="round" style="font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;">`);

  for (let ringIndex = 0; ringIndex <= 7; ringIndex++) {
    const r = ringRadii[ringIndex];
    const stroke = getRingStrokeWidth(view, ringIndex);
    const opacity = getRingOpacity(view, ringIndex);
    const color = RING_COLORS[ringIndex];
    const isAnimHidden = mode === 'animated' ? 'ring--hidden' : '';
    const className = `ripple-ring ripple-ring--${ringIndex} ${isAnimHidden}`.trim();

    const dash = ringIndex === 6 ? '6 10' : '';
    const extra = ringIndex === 6 ? ' filter="url(#softGlow)"' : '';
    const dashAttr = ringIndex === 6 ? ` stroke-dasharray="${dash}"` : '';

    // Click/hover target: the ring stroke itself.
    svg.push(
      `<circle class="${className}" data-ring="${ringIndex}" cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-opacity="${opacity}" vector-effect="non-scaling-stroke" style="cursor:pointer" ${dashAttr}${extra}/>`
    );

    // Label + numbers + key item + source
    const label = ringLabel(ringIndex);
    const key = getRingKeyItem(view, ringIndex);
    const ringTotal = getRingTotal(view, ringIndex);
    const ringTotalForDisplay = mode === 'animated' ? 0 : ringTotal;
    const totalText = ringIndex === 0
      ? fmtGBP(ringTotalForDisplay)
      : ringIndex === 6
        ? ''
        : fmtGBP(ringTotalForDisplay);
    const totalFontSize = ringIndex === 0 ? (isWide ? 14 : 16) : (isWide ? 12 : 13);
    const labelFontSize = isWide ? 10 : 11;
    const itemFontSize = isWide ? 9 : 10;
    const sourceFontSize = isWide ? 7 : 8;

    const yBase = cy - r + (isWide ? 6 : 10);
    // Position at/near top of each ring band.
    const yLabel = yBase - 12;
    const yTotal = yBase + (ringIndex === 0 ? 14 : 12);
    const yItem = yBase + 30;
    const ySource = yBase + 44;

    // Ring label
    const labelFill = ringIndex === 7 ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.92)';
    svg.push(`<text x="${cx}" y="${yLabel}" text-anchor="middle" font-size="${labelFontSize}" font-weight="700" fill="${labelFill}">${escapeXml(label)}</text>`);

    // Ring total (gold)
    if (ringIndex !== 6) {
      const totalOpacity = ringIndex === 7 ? 0.85 : 1;
      svg.push(
        `<text id="ring-total-${ringIndex}" class="ring-total" x="${cx}" y="${yTotal}" text-anchor="middle" font-size="${totalFontSize}" font-weight="900" fill="${ACCENT_GOLD}" opacity="${totalOpacity}">${escapeXml(totalText)}</text>`
      );
    } else {
      // Future breeder ring: not a present cost number.
      svg.push(`<text x="${cx}" y="${yTotal}" text-anchor="middle" font-size="${totalFontSize}" font-weight="800" fill="${ACCENT_GOLD}">Future cost breeds</text>`);
      svg.push(`<text x="${cx}" y="${yTotal + 16}" text-anchor="middle" font-size="${itemFontSize}" font-weight="600" fill="rgba(232,250,255,0.9)">Waveform doubles if ignored</text>`);
    }

    // Key £ line
    if (key && key.text) {
      const itemText = key.text.length > 40 ? key.text.slice(0, 39) + '…' : key.text;
      svg.push(`<text x="${cx}" y="${yItem}" text-anchor="middle" font-size="${itemFontSize}" font-weight="600" fill="rgba(232,250,255,0.9)">${escapeXml(itemText)}</text>`);
    }

    // Source link small
    const short = shortSourceText(key && key.href);
    if (key && key.href) {
      svg.push(
        `<a xlink:href="${key.href}" target="_blank" rel="noopener noreferrer">` +
          `<text x="${cx}" y="${ySource}" text-anchor="middle" font-size="${sourceFontSize}" font-style="italic" fill="rgba(255,255,255,0.65)">${escapeXml(short)}</text>` +
        `</a>`
      );
    }
  }
  svg.push(`</g>`);

  // Bottom-right callout for total.
  const callX = isWide ? w - 170 : w - 210;
  const callY = isWide ? h - 120 : h - 135;
  const callW = isWide ? 150 : 190;
  const callH = isWide ? 80 : 90;
  svg.push(
    `<g id="totalsCallout" filter="url(#softGlow)">` +
      `<rect x="${callX}" y="${callY}" width="${callW}" height="${callH}" rx="${isWide ? 14 : 16}" fill="rgba(7,16,34,0.65)" stroke="rgba(244,185,66,0.35)" stroke-width="1"/>` +
      `<text x="${callX + callW / 2}" y="${callY + 28}" text-anchor="middle" font-size="${isWide ? 11 : 12}" font-weight="800" fill="rgba(255,255,255,0.72)">TOTAL (STATE COST)</text>` +
      `<text id="total-value" x="${callX + callW / 2}" y="${callY + 52}" text-anchor="middle" font-size="${isWide ? 16 : 18}" font-weight="950" fill="${ACCENT_GOLD}">${escapeXml(
        view === 'conservative' ? fmtGBP(40070) : '£78k–£95k+'
      )}</text>` +
    `</g>`
  );

  // Decorative shimmer ring for Ring 6.
  // The main circle for ring 6 is dashed; this overlay adds a shimmer dashed “orbit”.
  const ring6R = ringRadii[6];
  const shimmerOpacity = 0.65;
  const dashOffset = mode === 'animated' ? 18 : 0;
  svg.push(
    `<g id="ring6Shimmer" opacity="${shimmerOpacity}" style="${mode === 'animated' ? '' : 'display:none'}">` +
      `<circle cx="${cx}" cy="${cy}" r="${ring6R}" fill="none" stroke="${RING_COLORS[6]}" stroke-width="${Math.max(4, getRingStrokeWidth(view, 6) - 1)}" stroke-dasharray="4 12" stroke-linecap="round" filter="url(#softGlow)" style="transform-origin:${cx}px ${cy}px; animation: dashShimmer 1.5s linear infinite; animation-delay: 0.1s" />` +
    `</g>`
  );

  // SVG-level animations (so exports keep shimmer even outside CSS files).
  svg.push(
    `<style>
      @keyframes ringFadeUp { 0% { opacity:0; transform: translateY(6px); } 60% { opacity:1; transform: translateY(0px); } 100% { opacity:1; transform: translateY(0px);} }
      @keyframes dashShimmer { 0% { stroke-dashoffset: ${dashOffset}; } 100% { stroke-dashoffset: ${dashOffset + 120}; } }
      .ring--hidden { opacity: 0; }
      .ripple-ring--0.ring--hidden { animation: ringFadeUp 1.0s ease forwards; animation-delay: 0.05s; }
      .ripple-ring--1.ring--hidden { animation: ringFadeUp 1.0s ease forwards; animation-delay: 0.22s; }
      .ripple-ring--2.ring--hidden { animation: ringFadeUp 1.0s ease forwards; animation-delay: 0.38s; }
      .ripple-ring--3.ring--hidden { animation: ringFadeUp 1.0s ease forwards; animation-delay: 0.54s; }
      .ripple-ring--4.ring--hidden { animation: ringFadeUp 1.0s ease forwards; animation-delay: 0.70s; }
      .ripple-ring--5.ring--hidden { animation: ringFadeUp 1.0s ease forwards; animation-delay: 0.86s; }
      .ripple-ring--6.ring--hidden { animation: ringFadeUp 1.0s ease forwards; animation-delay: 1.02s; }
      .ripple-ring--7.ring--hidden { animation: ringFadeUp 1.1s ease forwards; animation-delay: 1.18s; }
    </style>`
  );

  // Close SVG
  svg.push(`</svg>`);
  return svg.join('');
}

function escapeXml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function exportRippleSvg({ view = 'conservative', mode = 'static' } = {}) {
  return buildRippleSvgString({ width: 1200, height: 1200, view, mode });
}

function exportRippleSvg16x9({ view = 'conservative', mode = 'static' } = {}) {
  return buildRippleSvgString({ width: 1200, height: 675, view, mode });
}

module.exports = {
  exportRippleSvg,
  exportRippleSvg16x9,
  buildRippleSvgString,
};

// Browser fallback (this repo serves scripts directly without bundling).
// Enables `window.OTSRippleSvgExport.buildRippleSvgString(...)`.
if (typeof window !== 'undefined') {
  window.OTSRippleSvgExport = {
    exportRippleSvg,
    exportRippleSvg16x9,
    buildRippleSvgString,
  };
}

