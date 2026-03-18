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

function getRingItems(ringIndex) {
  // Full breakdown used for on-diagram “evidence ledger” in Static Export.
  // (Matches the prompt’s ring structure.)
  switch (ringIndex) {
    case 0:
      return [
        { label: 'Base annual system burden', value: '~£66k / year (NAO: £20bn ÷ 300,000 high-harm users)', href: 'https://www.nao.org.uk/reports/reducing-the-harm-from-illegal-drugs/' },
        { label: 'Conservative (single-touch total)', value: '£40,070 / person / year', href: 'https://www.gov.uk/government/collections/independent-review-of-drugs-by-professor-dame-carol-black' },
        { label: 'Upper bound', value: '£78,000–£95,000+ / person / year', href: 'https://www.gov.uk/government/collections/independent-review-of-drugs-by-professor-dame-carol-black' },
        { label: 'ADHD multiplier note', value: '2–3× due to relapse loops + non-compliance', href: 'https://pubmed.ncbi.nlm.nih.gov/38388701/' },
      ];
    case 1:
      return [
        { label: 'A&E attendance', value: '£200–£560 / visit', href: 'https://www.kingsfund.org.uk/insight-and-analysis/data-and-charts/key-facts-figures-nhs' },
        { label: 'Ambulance (non-conveyance / with A&E)', value: '£327 / £459', href: 'https://www.kingsfund.org.uk/insight-and-analysis/data-and-charts/key-facts-figures-nhs' },
        { label: 'Inpatient detox (5–10 days)', value: '£3,500–£6,000', href: 'https://www.gov.uk/government/collections/nhs-reference-costs' },
        { label: 'ICU / high dependency bed/day', value: '£1,200–£2,000', href: 'https://www.gov.uk/government/collections/nhs-reference-costs' },
        { label: 'Ward stay per day', value: '£350–£600', href: 'https://www.gov.uk/government/collections/nhs-reference-costs' },
        { label: 'MH crisis intervention', value: '£250–£600', href: 'https://www.gov.uk/government/collections/nhs-reference-costs' },
        { label: 'Missed appointment (DNA)', value: '£80–£150 / slot', href: 'https://www.gov.uk/government/collections/nhs-reference-costs' },
        { label: 'Community addiction session', value: '£80–£150', href: 'https://www.gov.uk/government/collections/nhs-reference-costs' },
      ];
    case 2:
      return [
        { label: 'Police incident (welfare / intoxication)', value: '£200–£700', href: 'https://www.nao.org.uk/reports/reducing-the-harm-from-illegal-drugs/' },
        { label: 'Magistrates court processing', value: '£500–£2,000', href: 'https://www.nao.org.uk/reports/reducing-the-harm-from-illegal-drugs/' },
        { label: 'Probation supervision', value: '£1,200–£3,000 / year', href: 'https://www.nao.org.uk/reports/reducing-the-harm-from-illegal-drugs/' },
      ];
    case 3:
      return [
        { label: 'Temporary accommodation', value: '£50–£100 / night', href: 'https://www.gov.uk/government/collections/temporary-accommodation-statistics' },
        { label: 'Supported housing', value: '£250–£400 / week', href: 'https://www.gov.uk/government/collections/supported-housing' },
        { label: 'Benefits + lost tax contribution', value: '£15,000–£25,000 / year', href: 'https://www.gov.uk/government/collections/dwp-administrative-costs' },
      ];
    case 4:
      return [
        { label: 'Employer productivity loss', value: '£10,000–£25,000 / year', href: 'https://www.gov.uk/government/collections/dwp-administrative-costs' },
        { label: 'Occupational health / EAP load', value: '£500–£2,000', href: 'https://www.gov.uk/government/collections/dwp-administrative-costs' },
        { label: 'Jobcentre Plus case management', value: '£500–£1,500 / year (estimate)', href: 'https://www.nao.org.uk/wp-content/uploads/2025/03/Supporting-people-to-work-through-jobcentres-summary.pdf' },
      ];
    case 5:
      return [
        { label: 'Family / carer therapy + lost work hours', value: '£1,000–£5,000', href: 'https://www.gov.uk/government/collections/nhs-reference-costs' },
        { label: 'CAMHS / youth MH support', value: '£2,000–£6,000', href: 'https://www.gov.uk/government/collections/nhs-reference-costs' },
      ];
    case 6:
      return [
        { label: 'ADHD heritability', value: '~74% (meta-consensus)', href: 'https://pubmed.ncbi.nlm.nih.gov/38388701/' },
        { label: 'Untreated ADHD national cost', value: '£17bn / year', href: 'https://www.england.nhs.uk/mental-health/adhd/' },
        { label: 'Next generation risk context', value: '“Hidden Harm” (children of drug users)', href: 'https://assets.publishing.service.gov.uk/media/5a756e6be5274a3edd9a4dcb/hidden-harm-full.pdf' },
      ];
    case 7:
      return [
        { label: 'Council street-cleaning uplift', value: '£50–£200 / year', href: 'https://www.local.gov.uk/' },
        { label: 'Neighbourhood disruption / ASB case management', value: '£200–£500', href: 'https://www.gov.uk/government/statistics' },
        { label: 'Volunteer/charity hours absorbed', value: 'Non-monetised but real', href: 'https://www.gov.uk/government/statistics/community-life-survey-202425-annual-publication/community-life-survey-202425-volunteering-and-charitable-giving' },
      ];
    default:
      return [];
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

/** Oval ripples (photo perspective: wider than tall). Ring 0 = innermost. */
function getOvalRipple(ringIndex, w, h) {
  const ex = w / 2;
  const ey = h / 2 + h * (h >= w ? 0.038 : 0.032);
  const baseRx = Math.min(w, h) * 0.076;
  const step = Math.min(w, h) * 0.035;
  const rx = baseRx + ringIndex * step;
  const ry = rx * 0.705;
  return { ex, ey, rx, ry };
}

/** Top crest only — specular highlight on water (not a full ring). */
function pathTopArc(ex, ey, rx, ry) {
  return `M ${ex - rx} ${ey} A ${rx} ${ry} 0 1 1 ${ex + rx} ${ey}`;
}

function buildRippleSvgString({
  width,
  height,
  view, // 'conservative' | 'upper'
  mode, // 'static' | 'animated'
  waterTextureSrc, // data URL or URL for photo texture
}) {
  const w = width;
  const h = height;
  const cx = w / 2;
  const cy = h / 2;

  const isWide = w !== 1200 || h !== 1200;
  const usePhotoRipples = Boolean(waterTextureSrc);
  const ringRadii = usePhotoRipples
    ? null
    : [isWide ? 92 : 120, ...[1, 2, 3, 4, 5, 6, 7].map((i) => (isWide ? 92 : 120) + i * (isWide ? 39 : 45))];

  const svg = [];
  svg.push(
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="OTOS premium ripple-effect cost diagram">`
  );

  // Background
  svg.push(`<defs>`);
  svg.push(`<linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">`);
  svg.push(`<stop offset="0%" stop-color="${BG}" stop-opacity="0.98"/>`);
  svg.push(`<stop offset="100%" stop-color="#071022" stop-opacity="1"/>`);
  svg.push(`</linearGradient>`);

  // Water-surface texture (export-safe, no external assets).
  svg.push(`<filter id="waterSurface" x="-30%" y="-30%" width="160%" height="160%">`);
  svg.push(`<feTurbulence type="fractalNoise" baseFrequency="0.010" numOctaves="2" seed="7" result="noise"/>`);
  svg.push(`<feColorMatrix type="matrix" in="noise" values="
      1 0 0 0 0
      0 1 0 0 0
      0 0 1 0 0
      0 0 0 0.32 0" result="noiseAlpha"/>`);
  svg.push(`<feDisplacementMap in="SourceGraphic" in2="noiseAlpha" scale="${isWide ? 10 : 14}" xChannelSelector="R" yChannelSelector="G"/>`);
  svg.push(`</filter>`);

  svg.push(`<radialGradient id="waterVignette" cx="50%" cy="50%" r="62%">`);
  svg.push(`<stop offset="0%" stop-color="rgba(255,255,255,0)" />`);
  svg.push(`<stop offset="55%" stop-color="rgba(255,255,255,0.00)" />`);
  svg.push(`<stop offset="100%" stop-color="rgba(0,0,0,0.26)" />`);
  svg.push(`</radialGradient>`);

  svg.push(`<radialGradient id="specularShine" cx="34%" cy="28%" r="52%">`);
  svg.push(`<stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.16"/>`);
  svg.push(`<stop offset="40%" stop-color="#FFFFFF" stop-opacity="0.06"/>`);
  svg.push(`<stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>`);
  svg.push(`</radialGradient>`);

  // Outer fade mask (ring 7 tail).
  svg.push(`<radialGradient id="outerFade" cx="50%" cy="50%" r="65%">`);
  svg.push(`<stop offset="0%" stop-color="#FFFFFF" stop-opacity="1"/>`);
  svg.push(`<stop offset="70%" stop-color="#FFFFFF" stop-opacity="1"/>`);
  svg.push(`<stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.15"/>`);
  svg.push(`</radialGradient>`);
  svg.push(`<mask id="outerFadeMask">`);
  svg.push(`<rect x="0" y="0" width="${w}" height="${h}" fill="url(#outerFade)"/>`);
  svg.push(`</mask>`);

  svg.push(`<radialGradient id="centreStone" cx="50%" cy="45%" r="60%">`);
  svg.push(`<stop offset="0%" stop-color="#0F6B78" stop-opacity="0.92"/>`);
  svg.push(`<stop offset="55%" stop-color="${RING_COLORS[0]}" stop-opacity="1"/>`);
  svg.push(`<stop offset="100%" stop-color="#071022" stop-opacity="1"/>`);
  svg.push(`</radialGradient>`);

  // Ring glass fill (subtle, helps depth without turning into “donuts”).
  svg.push(`<radialGradient id="ringGlass" cx="50%" cy="50%" r="62%">`);
  svg.push(`<stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.00"/>`);
  svg.push(`<stop offset="55%" stop-color="#FFFFFF" stop-opacity="0.00"/>`);
  svg.push(`<stop offset="78%" stop-color="#FFFFFF" stop-opacity="0.06"/>`);
  svg.push(`<stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.02"/>`);
  svg.push(`</radialGradient>`);

  // Micro highlight around the ring edges.
  svg.push(`<filter id="edgeGlow" x="-35%" y="-35%" width="170%" height="170%">`);
  svg.push(`<feGaussianBlur stdDeviation="1.3" result="b"/>`);
  svg.push(`<feColorMatrix in="b" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.65 0" result="g"/>`);
  svg.push(`<feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge>`);
  svg.push(`</filter>`);

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

  // Photo water: full-bleed merge (no circular crop). Procedural fallback when no texture.
  if (waterTextureSrc) {
    svg.push(
      `<image href="${escapeXml(waterTextureSrc)}" x="0" y="0" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice"/>`
    );
    svg.push(`<rect x="0" y="0" width="${w}" height="${h}" fill="rgba(6,28,42,0.14)"/>`);
    svg.push(
      `<rect x="0" y="0" width="${w}" height="${h}" fill="url(#waterVignette)" opacity="0.55"/>`
    );
  } else {
    const waterR = Math.min(w, h) * 0.44;
    svg.push(`<g id="water" mask="url(#outerFadeMask)">`);
    svg.push(`<circle cx="${cx}" cy="${cy}" r="${waterR}" fill="rgba(10,79,92,0.10)" filter="url(#waterSurface)"/>`);
    svg.push(`<circle cx="${cx}" cy="${cy}" r="${waterR}" fill="url(#specularShine)" opacity="0.95"/>`);
    svg.push(`<circle cx="${cx}" cy="${cy}" r="${waterR}" fill="url(#waterVignette)" opacity="0.98"/>`);
    svg.push(`</g>`);
  }

  const focal = usePhotoRipples ? getOvalRipple(0, w, h) : { ex: cx, ey: cy, rx: isWide ? 46 : 52, ry: isWide ? 46 : 52 };
  const stoneRx = usePhotoRipples ? Math.min(w, h) * 0.052 : isWide ? 46 : 52;
  const stoneRy = stoneRx * 0.72;
  svg.push(`<g id="centre" style="font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;">`);
  if (usePhotoRipples) {
    svg.push(
      `<ellipse cx="${focal.ex}" cy="${focal.ey}" rx="${stoneRx * 1.35}" ry="${stoneRy * 1.35}" fill="url(#ringHalo)" opacity="0.45"/>`
    );
    svg.push(
      `<ellipse cx="${focal.ex}" cy="${focal.ey}" rx="${stoneRx}" ry="${stoneRy}" fill="rgba(8,22,38,0.55)" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>`
    );
    const c = pathTopArc(focal.ex, focal.ey, stoneRx, stoneRy);
    svg.push(
      `<path d="${c}" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1.4" stroke-linecap="round"/>`
    );
    svg.push(
      `<path d="${c}" fill="none" stroke="rgba(200,240,255,0.35)" stroke-width="0.7" stroke-linecap="round"/>`
    );
  } else {
    const stoneR = isWide ? 46 : 52;
    svg.push(`<circle cx="${cx}" cy="${cy}" r="${stoneR + 14}" fill="url(#ringHalo)" opacity="0.65"/>`);
    svg.push(`<circle cx="${cx}" cy="${cy}" r="${stoneR}" fill="url(#centreStone)" stroke="rgba(244,185,66,0.25)" stroke-width="${isWide ? 1.2 : 1.5}"/>`);
    svg.push(`<ellipse cx="${cx - (isWide ? 12 : 14)}" cy="${cy - (isWide ? 14 : 16)}" rx="${isWide ? 12 : 14}" ry="${isWide ? 9 : 10}" fill="#FFFFFF" fill-opacity="0.14"/>`);
  }
  const tx = usePhotoRipples ? focal.ex : cx;
  const ty = usePhotoRipples ? focal.ey : cy;
  svg.push(`<text x="${tx}" y="${ty - 6}" text-anchor="middle" font-size="${isWide ? 14 : 16}" font-weight="800" fill="#E8FAFF" letter-spacing="-0.01em" style="text-shadow:0 1px 8px rgba(0,0,0,0.75)">NIA Individual</text>`);
  svg.push(`<text x="${tx}" y="${ty + 14}" text-anchor="middle" font-size="${isWide ? 11 : 12}" font-weight="600" fill="rgba(232,250,255,0.95)" style="text-shadow:0 1px 6px rgba(0,0,0,0.8)">ADHD + Addiction (crisis)</text>`);
  svg.push(`</g>`);

  svg.push(
    `<g id="rings" stroke-linecap="round" style="font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;"${usePhotoRipples ? '' : ' mask="url(#outerFadeMask)"'}>`
  );

  if (usePhotoRipples) {
    // Draw outer ripples first; highlights = water crest only (no coloured ring stroke).
    for (let ringIndex = 7; ringIndex >= 0; ringIndex--) {
      const { ex, ey, rx, ry } = getOvalRipple(ringIndex, w, h);
      const d = pathTopArc(ex, ey, rx, ry);
      const isAnimHidden = mode === 'animated' ? 'ring--hidden' : '';
      const wGlow = 3.2 + ringIndex * 0.35;
      const wCrest = ringIndex >= 6 ? 1.05 : ringIndex === 7 ? 0.95 : 1.25;
      const tailOp = ringIndex === 7 ? 0.55 : ringIndex === 6 ? 0.85 : 1;
      svg.push(`<g class="ripple-ring--${ringIndex} ${isAnimHidden} ripple-oval-group">`);
      svg.push(
        `<path d="${d}" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="${wGlow}" stroke-linecap="round" filter="url(#softGlow)" opacity="${tailOp * 0.9}"/>`
      );
      svg.push(
        `<path d="${d}" fill="none" stroke="rgba(255,255,255,0.92)" stroke-width="${wCrest}" stroke-linecap="round" opacity="${tailOp}"/>`
      );
      svg.push(
        `<path d="${d}" fill="none" stroke="rgba(185,235,255,0.42)" stroke-width="${Math.max(0.65, wCrest * 0.55)}" stroke-linecap="round" opacity="${tailOp * 0.85}"/>`
      );
      if (ringIndex === 6 && mode === 'animated') {
        svg.push(
          `<path d="${d}" fill="none" stroke="rgba(230,220,255,0.55)" stroke-width="1" stroke-dasharray="3 14" stroke-linecap="round" style="animation: dashShimmer 2.2s linear infinite"/>`
        );
      }
      svg.push(`</g>`);
    }
    for (let ringIndex = 0; ringIndex <= 7; ringIndex++) {
      const { ex, ey, rx, ry } = getOvalRipple(ringIndex, w, h);
      const isAnimHidden = mode === 'animated' ? 'ring--hidden' : '';
      svg.push(
        `<ellipse class="ripple-ring ripple-ring--${ringIndex} ${isAnimHidden}" data-ring="${ringIndex}" cx="${ex}" cy="${ey}" rx="${rx}" ry="${ry}" fill="none" stroke="rgba(255,255,255,0)" stroke-width="56" style="cursor:pointer"/>`
      );
    }
    for (let ringIndex = 0; ringIndex <= 7; ringIndex++) {
      const { ex, ey, rx, ry } = getOvalRipple(ringIndex, w, h);
      const label = ringLabel(ringIndex);
      const key = getRingKeyItem(view, ringIndex);
      const ringTotal = getRingTotal(view, ringIndex);
      const ringTotalForDisplay = mode === 'animated' ? 0 : ringTotal;
      const totalText =
        ringIndex === 0 ? fmtGBP(ringTotalForDisplay) : ringIndex === 6 ? '' : fmtGBP(ringTotalForDisplay);
      const totalFontSize = ringIndex === 0 ? (isWide ? 14 : 16) : isWide ? 12 : 13;
      const labelFontSize = isWide ? 10 : 11;
      const itemFontSize = isWide ? 9 : 10;
      const sourceFontSize = isWide ? 7 : 8;
      const stagger = (ringIndex - 3.5) * (isWide ? 10 : 12);
      const yLabel = ey - ry - 10;
      const xLabel = ex + stagger;
      const yTotal = yLabel + (ringIndex === 0 ? 15 : 13);
      const yItem = yTotal + 16;
      const ySource = yItem + 13;
      const labelFill = ringIndex === 7 ? 'rgba(255,255,255,0.78)' : 'rgba(255,255,255,0.95)';
      svg.push(
        `<text x="${xLabel}" y="${yLabel}" text-anchor="middle" font-size="${labelFontSize}" font-weight="700" fill="${labelFill}" style="text-shadow:0 1px 6px rgba(0,0,0,0.85)">${escapeXml(label)}</text>`
      );
      if (ringIndex !== 6) {
        const totalOpacity = ringIndex === 7 ? 0.88 : 1;
        svg.push(
          `<text id="ring-total-${ringIndex}" class="ring-total" x="${xLabel}" y="${yTotal}" text-anchor="middle" font-size="${totalFontSize}" font-weight="900" fill="${ACCENT_GOLD}" opacity="${totalOpacity}" style="text-shadow:0 1px 8px rgba(0,0,0,0.9)">${escapeXml(totalText)}</text>`
        );
      } else {
        svg.push(
          `<text x="${xLabel}" y="${yTotal}" text-anchor="middle" font-size="${totalFontSize}" font-weight="800" fill="${ACCENT_GOLD}" style="text-shadow:0 1px 8px rgba(0,0,0,0.9)">Future cost breeds</text>`
        );
        svg.push(
          `<text x="${xLabel}" y="${yTotal + 16}" text-anchor="middle" font-size="${itemFontSize}" font-weight="600" fill="rgba(232,250,255,0.92)" style="text-shadow:0 1px 6px rgba(0,0,0,0.85)">Waveform doubles if ignored</text>`
        );
      }
      if (key && key.text) {
        const itemText = key.text.length > 36 ? key.text.slice(0, 35) + '…' : key.text;
        svg.push(
          `<text x="${xLabel}" y="${yItem}" text-anchor="middle" font-size="${itemFontSize}" font-weight="600" fill="rgba(232,250,255,0.94)" style="text-shadow:0 1px 6px rgba(0,0,0,0.88)">${escapeXml(itemText)}</text>`
        );
      }
      const short = shortSourceText(key && key.href);
      if (key && key.href) {
        svg.push(
          `<a href="${key.href}" target="_blank" rel="noopener noreferrer">` +
            `<text x="${xLabel}" y="${ySource}" text-anchor="middle" font-size="${sourceFontSize}" font-style="italic" fill="rgba(255,255,255,0.72)" style="text-shadow:0 1px 4px rgba(0,0,0,0.8)">${escapeXml(short)}</text>` +
            `</a>`
        );
      }
    }
  } else {
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
      svg.push(
        `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#000000" stroke-width="${Math.max(4, stroke + 5)}" stroke-opacity="${ringIndex === 7 ? 0.08 : 0.1}" filter="url(#waterSurface)" vector-effect="non-scaling-stroke"/>`
      );
      svg.push(
        `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="url(#ringGlass)" stroke-width="${Math.max(6, stroke - 1)}" stroke-opacity="${ringIndex === 7 ? 0.55 : 0.75}" vector-effect="non-scaling-stroke"/>`
      );
      svg.push(
        `<circle class="${className}" data-ring="${ringIndex}" cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-opacity="${opacity}" vector-effect="non-scaling-stroke" style="cursor:pointer" filter="url(#edgeGlow)" ${dashAttr}${extra}/>`
      );
      const label = ringLabel(ringIndex);
      const key = getRingKeyItem(view, ringIndex);
      const ringTotal = getRingTotal(view, ringIndex);
      const ringTotalForDisplay = mode === 'animated' ? 0 : ringTotal;
      const totalText =
        ringIndex === 0 ? fmtGBP(ringTotalForDisplay) : ringIndex === 6 ? '' : fmtGBP(ringTotalForDisplay);
      const totalFontSize = ringIndex === 0 ? (isWide ? 14 : 16) : isWide ? 12 : 13;
      const labelFontSize = isWide ? 10 : 11;
      const itemFontSize = isWide ? 9 : 10;
      const sourceFontSize = isWide ? 7 : 8;
      const yBase = cy - r + (isWide ? 6 : 10);
      const yLabel = yBase - 12;
      const yTotal = yBase + (ringIndex === 0 ? 14 : 12);
      const yItem = yBase + 30;
      const ySource = yBase + 44;
      const labelFill = ringIndex === 7 ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.92)';
      svg.push(`<text x="${cx}" y="${yLabel}" text-anchor="middle" font-size="${labelFontSize}" font-weight="700" fill="${labelFill}">${escapeXml(label)}</text>`);
      if (ringIndex !== 6) {
        const totalOpacity = ringIndex === 7 ? 0.85 : 1;
        svg.push(
          `<text id="ring-total-${ringIndex}" class="ring-total" x="${cx}" y="${yTotal}" text-anchor="middle" font-size="${totalFontSize}" font-weight="900" fill="${ACCENT_GOLD}" opacity="${totalOpacity}">${escapeXml(totalText)}</text>`
        );
      } else {
        svg.push(`<text x="${cx}" y="${yTotal}" text-anchor="middle" font-size="${totalFontSize}" font-weight="800" fill="${ACCENT_GOLD}">Future cost breeds</text>`);
        svg.push(
          `<text x="${cx}" y="${yTotal + 16}" text-anchor="middle" font-size="${itemFontSize}" font-weight="600" fill="rgba(232,250,255,0.9)">Waveform doubles if ignored</text>`
        );
      }
      if (key && key.text) {
        const itemText = key.text.length > 40 ? key.text.slice(0, 39) + '…' : key.text;
        svg.push(`<text x="${cx}" y="${yItem}" text-anchor="middle" font-size="${itemFontSize}" font-weight="600" fill="rgba(232,250,255,0.9)">${escapeXml(itemText)}</text>`);
      }
      const short = shortSourceText(key && key.href);
      if (key && key.href) {
        svg.push(
          `<a href="${key.href}" target="_blank" rel="noopener noreferrer">` +
            `<text x="${cx}" y="${ySource}" text-anchor="middle" font-size="${sourceFontSize}" font-style="italic" fill="rgba(255,255,255,0.65)">${escapeXml(short)}</text>` +
            `</a>`
        );
      }
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

  // Evidence ledger (on-diagram itemisation).
  // Always included for "static export" mode; fades in for animated.
  const showLedger = true;
  if (showLedger) {
    const ledgerX = isWide ? 24 : 34;
    const ledgerY = isWide ? 26 : 34;
    const ledgerW = isWide ? 420 : 460;
    const cardH = isWide ? 66 : 72;
    const gap = 10;

    const ledgerStyle =
      mode === 'animated'
        ? 'font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; opacity: 0; animation: ledgerIn 0.9s ease forwards; animation-delay: 0.35s'
        : 'font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
    svg.push(`<g id="evidenceLedger" style="${ledgerStyle}">`);
    svg.push(`<style>@keyframes ledgerIn{from{opacity:0; transform:translateY(8px)}to{opacity:1; transform:translateY(0)}}</style>`);

    svg.push(
      `<text x="${ledgerX}" y="${ledgerY + 10}" font-size="${isWide ? 10 : 11}" font-weight="900" fill="rgba(255,255,255,0.78)" letter-spacing="0.10em">ITEMISED COSTS (RIPPLE EVIDENCE)</text>`
    );

    for (let ringIndex = 0; ringIndex <= 7; ringIndex++) {
      const top = ledgerY + 24 + ringIndex * (cardH + gap);
      const color = RING_COLORS[ringIndex];
      const items = getRingItems(ringIndex);
      const subtotal = ringIndex === 6 ? 'Future cost breeder' : (ringIndex === 0 ? (view === 'conservative' ? '£40,070/yr (cons.)' : '£78k–£95k+/yr') : fmtGBP(getRingTotal(view, ringIndex)));

      // Card
      svg.push(
        `<g>` +
          `<rect x="${ledgerX}" y="${top}" width="${ledgerW}" height="${cardH}" rx="14" fill="rgba(7,16,34,0.62)" stroke="rgba(255,255,255,0.10)" stroke-width="1"/>` +
          `<rect x="${ledgerX}" y="${top}" width="6" height="${cardH}" rx="14" fill="${color}" opacity="0.9"/>` +
          `<text x="${ledgerX + 16}" y="${top + 22}" font-size="${isWide ? 11 : 12}" font-weight="900" fill="rgba(255,255,255,0.92)">${escapeXml(ringLabel(ringIndex))}</text>` +
          `<text x="${ledgerX + ledgerW - 14}" y="${top + 22}" text-anchor="end" font-size="${isWide ? 11 : 12}" font-weight="950" fill="${ACCENT_GOLD}">${escapeXml(subtotal)}</text>` +
        `</g>`
      );

      // Item lines (2 lines for compactness; remaining via tooltip/click panel).
      const lineCount = isWide ? 2 : 2;
      const shown = items.slice(0, lineCount);
      const baseY = top + 42;
      shown.forEach((it, idx) => {
        const y = baseY + idx * 14;
        svg.push(
          `<a href="${it.href}" target="_blank" rel="noopener noreferrer">` +
            `<text x="${ledgerX + 16}" y="${y}" font-size="${isWide ? 9 : 10}" font-weight="650" fill="rgba(232,250,255,0.86)">${escapeXml(it.label)}: <tspan fill="rgba(244,185,66,0.92)" font-weight="900">${escapeXml(it.value)}</tspan></text>` +
          `</a>`
        );
      });

      if (items.length > shown.length) {
        svg.push(
          `<text x="${ledgerX + ledgerW - 14}" y="${top + cardH - 14}" text-anchor="end" font-size="${isWide ? 8 : 9}" font-style="italic" fill="rgba(255,255,255,0.55)">+ ${items.length - shown.length} more items (hover/click ring)</text>`
        );
      }
    }

    svg.push(`</g>`);
  }

  // “End figures explained” block (bottom-left).
  const explainX = isWide ? 24 : 34;
  const explainY = h - (isWide ? 148 : 174);
  const explainW = isWide ? 520 : 560;
  const explainH = isWide ? 124 : 148;
  svg.push(
    `<g id="endFigures" filter="url(#softGlow)">` +
      `<rect x="${explainX}" y="${explainY}" width="${explainW}" height="${explainH}" rx="16" fill="rgba(7,16,34,0.66)" stroke="rgba(244,185,66,0.22)" stroke-width="1"/>` +
      `<text x="${explainX + 16}" y="${explainY + 26}" font-size="${isWide ? 11 : 12}" font-weight="950" fill="rgba(255,255,255,0.86)">END FIGURES — WHAT THEY MEAN</text>` +
      `<text x="${explainX + 16}" y="${explainY + 50}" font-size="${isWide ? 10 : 11}" font-weight="700" fill="rgba(232,250,255,0.85)">Conservative (single-touch): <tspan fill="${ACCENT_GOLD}" font-weight="950">£40,070</tspan> / person / year</text>` +
      `<text x="${explainX + 16}" y="${explainY + 68}" font-size="${isWide ? 10 : 11}" font-weight="700" fill="rgba(232,250,255,0.85)">Upper bound: <tspan fill="${ACCENT_GOLD}" font-weight="950">£78,000–£95,000+</tspan> / person / year</text>` +
      `<text x="${explainX + 16}" y="${explainY + 86}" font-size="${isWide ? 10 : 11}" font-weight="700" fill="rgba(232,250,255,0.85)">Repeat cycles (norm): <tspan fill="${ACCENT_GOLD}" font-weight="950">£100,000+</tspan> annually</text>` +
      `<text x="${explainX + 16}" y="${explainY + 104}" font-size="${isWide ? 10 : 11}" font-weight="700" fill="rgba(232,250,255,0.85)">Lifetime (chronic): <tspan fill="${ACCENT_GOLD}" font-weight="950">£150,000–£250,000+</tspan></text>` +
      `<text x="${explainX + 16}" y="${explainY + (isWide ? 124 : 132)}" font-size="${isWide ? 8 : 9}" font-style="italic" fill="rgba(255,255,255,0.58)">Sources: King’s Fund | GOV.UK | Carol Black Review | NAO | NHS ADHD Taskforce | Faraone et al (2021)</text>` +
    `</g>`
  );

  const dashOffset = mode === 'animated' ? 18 : 0;
  if (!usePhotoRipples) {
    const ring6R = ringRadii[6];
    const shimmerOpacity = 0.65;
    svg.push(
      `<g id="ring6Shimmer" opacity="${shimmerOpacity}" style="${mode === 'animated' ? '' : 'display:none'}">` +
        `<circle cx="${cx}" cy="${cy}" r="${ring6R}" fill="none" stroke="${RING_COLORS[6]}" stroke-width="${Math.max(4, getRingStrokeWidth(view, 6) - 1)}" stroke-dasharray="4 12" stroke-linecap="round" filter="url(#softGlow)" style="transform-origin:${cx}px ${cy}px; animation: dashShimmer 1.5s linear infinite; animation-delay: 0.1s" />` +
        `<circle cx="${cx}" cy="${cy}" r="${ring6R}" fill="none" stroke="rgba(244,185,66,0.55)" stroke-width="${Math.max(2, getRingStrokeWidth(view, 6) - 5)}" stroke-dasharray="1 18" stroke-linecap="round" filter="url(#softGlow)" style="transform-origin:${cx}px ${cy}px; animation: dashShimmer 2.4s linear infinite; animation-delay: 0.15s" />` +
      `</g>`
    );
  }

  // SVG-level animations
  svg.push(
    `<style>
      @keyframes ringFadeUp { 0% { opacity:0; transform: translateY(6px); } 60% { opacity:1; transform: translateY(0px); } 100% { opacity:1; transform: translateY(0px);} }
      @keyframes dashShimmer { 0% { stroke-dashoffset: ${dashOffset}; } 100% { stroke-dashoffset: ${dashOffset + 120}; } }
      .ring--hidden { opacity: 0; }
      .ripple-ring--0.ring--hidden, .ripple-oval-group.ring--hidden.ripple-ring--0 { animation: ringFadeUp 1.0s ease forwards; animation-delay: 0.05s; }
      .ripple-ring--1.ring--hidden, .ripple-oval-group.ring--hidden.ripple-ring--1 { animation: ringFadeUp 1.0s ease forwards; animation-delay: 0.22s; }
      .ripple-ring--2.ring--hidden, .ripple-oval-group.ring--hidden.ripple-ring--2 { animation: ringFadeUp 1.0s ease forwards; animation-delay: 0.38s; }
      .ripple-ring--3.ring--hidden, .ripple-oval-group.ring--hidden.ripple-ring--3 { animation: ringFadeUp 1.0s ease forwards; animation-delay: 0.54s; }
      .ripple-ring--4.ring--hidden, .ripple-oval-group.ring--hidden.ripple-ring--4 { animation: ringFadeUp 1.0s ease forwards; animation-delay: 0.70s; }
      .ripple-ring--5.ring--hidden, .ripple-oval-group.ring--hidden.ripple-ring--5 { animation: ringFadeUp 1.0s ease forwards; animation-delay: 0.86s; }
      .ripple-ring--6.ring--hidden, .ripple-oval-group.ring--hidden.ripple-ring--6 { animation: ringFadeUp 1.0s ease forwards; animation-delay: 1.02s; }
      .ripple-ring--7.ring--hidden, .ripple-oval-group.ring--hidden.ripple-ring--7 { animation: ringFadeUp 1.1s ease forwards; animation-delay: 1.18s; }
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

function exportRippleSvg({ view = 'conservative', mode = 'static', waterTextureSrc } = {}) {
  return buildRippleSvgString({ width: 1200, height: 1200, view, mode, waterTextureSrc });
}

function exportRippleSvg16x9({ view = 'conservative', mode = 'static', waterTextureSrc } = {}) {
  return buildRippleSvgString({ width: 1200, height: 675, view, mode, waterTextureSrc });
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

