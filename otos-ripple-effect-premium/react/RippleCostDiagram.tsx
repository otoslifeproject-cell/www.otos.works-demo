import React, { useEffect, useMemo, useRef, useState } from 'react';
import { buildRippleSvgString, exportRippleSvg16x9, exportRippleSvg } from './rippleSvgExport';
import { TooltipWithSource, TooltipItem, TooltipState } from './TooltipWithSource';
import './ripplePremium.css';

export type RippleView = 'conservative' | 'upper';
export type RippleMode = 'static' | 'animated';

type RingItem = {
  name: string;
  min: number | null;
  max: number | null;
  rangeText: string;
  sourceUrl: string;
};

type RingDetail = {
  title: string;
  items: RingItem[];
};

const ringTotals: Record<RippleView, Record<number, number>> = {
  conservative: { 0: 40070, 1: 9080, 2: 1900, 3: 16350, 4: 11000, 5: 3000, 6: 0, 7: 250 },
  upper: { 0: 86500, 1: 15800, 2: 5700, 3: 27250, 4: 28450, 5: 11000, 6: 0, 7: 700 },
};

// Ring data: kept in component scope so it is truly “hardcoded”
// (deliverable requirement).
const ringDetails: Record<number, RingDetail> = {
  0: {
    title: 'NIA Individual — Undiagnosed ADHD + Crack/Heroin',
    items: [
      {
        name: 'Base system burden (high-harm users)',
        min: 40070,
        max: 86500,
        rangeText: '£40,070 (conservative) to £78k–£95k+ (upper bound)',
        sourceUrl: 'https://www.gov.uk/government/publications/life-sciences-healthcare-goals/addiction-healthcare-goals',
      },
      {
        name: 'ADHD multiplier note',
        min: null,
        max: null,
        rangeText: 'ADHD cases cost system 2–3× more due to treatment failure, medication non-compliance, and relapse loops',
        sourceUrl: 'https://www.gov.uk/government/publications/life-sciences-healthcare-goals/addiction-healthcare-goals',
      },
    ],
  },
  1: {
    title: 'Clinical / NHS',
    items: [
      { name: 'A&E attendance', min: 200, max: 560, rangeText: '£200–£560 per visit', sourceUrl: 'https://www.kingsfund.org.uk/insight-and-analysis/data-and-charts/key-facts-figures-nhs' },
      { name: 'Ambulance (non-conveyance)', min: 327, max: 459, rangeText: '£327 | with A&E: £459', sourceUrl: 'https://www.kingsfund.org.uk/insight-and-analysis/data-and-charts/key-facts-figures-nhs' },
      { name: 'Inpatient detox (5–10 days)', min: 3500, max: 6000, rangeText: '£3,500–£6,000', sourceUrl: 'https://www.gov.uk/government/collections/nhs-reference-costs' },
      { name: 'ICU / high dependency bed/day', min: 1200, max: 2000, rangeText: '£1,200–£2,000', sourceUrl: 'https://www.gov.uk/government/collections/nhs-reference-costs' },
      { name: 'Ward stay per day', min: 350, max: 600, rangeText: '£350–£600', sourceUrl: 'https://www.gov.uk/government/collections/nhs-reference-costs' },
      { name: 'MH crisis intervention', min: 250, max: 600, rangeText: '£250–£600', sourceUrl: 'https://www.gov.uk/government/collections/nhs-reference-costs' },
      { name: 'Missed appointment (DNA)', min: 80, max: 150, rangeText: '£80–£150 per slot', sourceUrl: 'https://www.gov.uk/government/collections/nhs-reference-costs' },
      { name: 'Community addiction session', min: 80, max: 150, rangeText: '£80–£150', sourceUrl: 'https://www.gov.uk/government/collections/nhs-reference-costs' },
    ],
  },
  2: {
    title: 'Criminal Justice',
    items: [
      { name: 'Police incident (welfare/intoxication)', min: 200, max: 700, rangeText: '£200–£700', sourceUrl: 'https://www.nao.org.uk/reports/reducing-the-harm-from-illegal-drugs/' },
      { name: 'Magistrates court processing', min: 500, max: 2000, rangeText: '£500–£2,000', sourceUrl: 'https://www.nao.org.uk/reports/reducing-the-harm-from-illegal-drugs/' },
      { name: 'Probation supervision/year', min: 1200, max: 3000, rangeText: '£1,200–£3,000', sourceUrl: 'https://www.nao.org.uk/reports/reducing-the-harm-from-illegal-drugs/' },
    ],
  },
  3: {
    title: 'Housing & Welfare',
    items: [
      { name: 'Temporary accommodation (per night)', min: 50, max: 100, rangeText: '£50–£100 per night', sourceUrl: 'https://www.gov.uk/government/collections/temporary-accommodation-statistics' },
      { name: 'Supported housing (per week)', min: 250, max: 400, rangeText: '£250–£400 per week', sourceUrl: 'https://www.gov.uk/government/collections/supported-housing' },
      { name: 'Benefits + lost tax contribution/year', min: 15000, max: 25000, rangeText: '£15,000–£25,000', sourceUrl: 'https://www.gov.uk/government/collections/dwp-administrative-costs' },
    ],
  },
  4: {
    title: 'Employment / Economy',
    items: [
      { name: 'Employer productivity loss/year', min: 10000, max: 25000, rangeText: '£10,000–£25,000', sourceUrl: 'https://www.gov.uk/government/collections/dwp-administrative-costs' },
      { name: 'Occupational health / EAP load', min: 500, max: 2000, rangeText: '£500–£2,000', sourceUrl: 'https://www.gov.uk/government/collections/dwp-administrative-costs' },
      { name: 'Jobcentre Plus case management (estimate)/yr', min: 500, max: 1500, rangeText: '£500–£1,500/yr', sourceUrl: 'https://www.gov.uk/government/collections/dwp-administrative-costs' },
    ],
  },
  5: {
    title: 'Family Impact',
    items: [
      { name: 'Family/carer therapy + lost work hours', min: 1000, max: 5000, rangeText: '£1,000–£5,000', sourceUrl: 'https://www.nhs.uk/nhs-services/mental-health-services/mental-health-services-for-children-and-young-people/' },
      { name: 'CAMHS / youth mental health support', min: 2000, max: 6000, rangeText: '£2,000–£6,000', sourceUrl: 'https://www.gov.uk/government/collections/nhs-reference-costs' },
    ],
  },
  6: {
    title: 'The Waveform Doubles (Intergenerational)',
    items: [
      { name: 'ADHD heritability', min: 74, max: 74, rangeText: '~74% (Faraone et al, 2021)', sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/38388701/' },
      { name: 'Untreated ADHD national cost', min: 17000000000, max: 17000000000, rangeText: '£17bn/year (NHS ADHD Taskforce)', sourceUrl: 'https://www.england.nhs.uk/mental-health/adhd/' },
      { name: 'Next-generation SUD risk', min: null, max: null, rangeText: 'Children of addicts 4–8× more likely to develop SUD (Public Health England)', sourceUrl: 'https://assets.publishing.service.gov.uk/media/5a756e6be5274a3edd9a4dcb/hidden-harm-full.pdf' },
    ],
  },
  7: {
    title: 'Community / Society — The Tail',
    items: [
      { name: 'Council street-cleaning uplift', min: 50, max: 200, rangeText: '£50–£200/year per high-harm individual (urban areas)', sourceUrl: 'https://www.local.gov.uk/' },
      { name: 'Neighbourhood disruption / ASB case management', min: 200, max: 500, rangeText: '£200–£500', sourceUrl: 'https://www.gov.uk/government/statistics' },
      { name: 'Volunteer/charity hours absorbed', min: null, max: null, rangeText: 'Non-monetised but real (absorbed community time)', sourceUrl: 'https://www.gov.uk/government/statistics/community-life-survey-202425-annual-publication/community-life-survey-202425-volunteering-and-charitable-giving' },
    ],
  },
};

function fmtGBP(n: number) {
  return `£${new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 }).format(Math.round(n))}`;
}

function ringTotalLabel(view: RippleView, ringIndex: number) {
  if (ringIndex === 0) return view === 'conservative' ? '£40,070 / year' : '£78k–£95k+ / year';
  if (ringIndex === 6) return 'Future cost breeder';
  if (ringIndex === 7) return view === 'conservative' ? '~£250 / year' : '~£700 / year';
  return fmtGBP(ringTotals[view][ringIndex] ?? 0);
}

function itemDisplayPrice(item: RingItem, view: RippleView) {
  if (item.min == null || item.max == null) return item.rangeText;
  return fmtGBP(view === 'conservative' ? item.min : item.max);
}

export function RippleCostDiagram({
  initialView = 'conservative',
  initialMode = 'animated',
}: {
  initialView?: RippleView;
  initialMode?: RippleMode;
}) {
  const [view, setView] = useState<RippleView>(initialView);
  const [mode, setMode] = useState<RippleMode>(initialMode);
  const [selectedRingIndex, setSelectedRingIndex] = useState<number | null>(null);

  const [tooltip, setTooltip] = useState<TooltipState>({
    isOpen: false,
    x: 0,
    y: 0,
    title: '',
    totalLabel: '',
    items: [],
  });

  const hostRef = useRef<HTMLDivElement | null>(null);

  const svgString = useMemo(() => {
    const rippleMode = mode === 'animated' ? 'animated' : 'static';
    return buildRippleSvgString({ width: 1200, height: 1200, view, mode: rippleMode });
  }, [view, mode]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // Attach event listeners to ring circles for hover + click.
    const circles = Array.from(host.querySelectorAll('circle.ripple-ring')) as SVGCircleElement[];
    const cleanupFns: Array<() => void> = [];

    circles.forEach((circle) => {
      const ringIndex = Number(circle.getAttribute('data-ring'));

      const onMouseMove = (e: MouseEvent) => {
        if (selectedRingIndex !== null) return;
        const detail = ringDetails[ringIndex];
        if (!detail) return;

        const items: TooltipItem[] = detail.items.map((it) => ({
          name: it.name,
          displayPrice: itemDisplayPrice(it, view),
          rangeNote: it.rangeText,
          sourceUrl: it.sourceUrl,
        }));

        setTooltip({
          isOpen: true,
          x: e.clientX,
          y: e.clientY,
          title: detail.title,
          totalLabel: ringTotalLabel(view, ringIndex),
          items,
        });
      };

      const onMouseEnter = (e: MouseEvent) => {
        onMouseMove(e);
      };

      const onMouseLeave = () => {
        if (selectedRingIndex !== null) return;
        setTooltip((t) => ({ ...t, isOpen: false }));
      };

      const onClick = () => {
        setSelectedRingIndex(ringIndex);
        setTooltip((t) => ({ ...t, isOpen: false }));
      };

      circle.addEventListener('mousemove', onMouseMove);
      circle.addEventListener('mouseenter', onMouseEnter);
      circle.addEventListener('mouseleave', onMouseLeave);
      circle.addEventListener('click', onClick);

      cleanupFns.push(() => {
        circle.removeEventListener('mousemove', onMouseMove);
        circle.removeEventListener('mouseenter', onMouseEnter);
        circle.removeEventListener('mouseleave', onMouseLeave);
        circle.removeEventListener('click', onClick);
      });
    });

    // Animate counters in SVG after insertion.
    if (mode === 'animated') {
      const duration = 950;
      const start = performance.now();
      const targets = ringTotals[view];
      const ringTextIds = [0, 1, 2, 3, 4, 5, 7];

      ringTextIds.forEach((idx) => {
        const el = host.querySelector(`#ring-total-${idx}`);
        if (!el) return;
        const target = targets[idx] ?? 0;

        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          const v = target * p;
          el.textContent = fmtGBP(v);
          if (p < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      });
    }

    return () => cleanupFns.forEach((fn) => fn());
  }, [svgString, view, mode, selectedRingIndex]);

  const selectedDetail = selectedRingIndex == null ? null : ringDetails[selectedRingIndex];

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
        <div style={{ display: 'flex', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, overflow: 'hidden' }}>
          <button
            type="button"
            onClick={() => {
              setSelectedRingIndex(null);
              setView('conservative');
            }}
            aria-pressed={view === 'conservative'}
            style={{ padding: '10px 12px', border: 0, cursor: 'pointer', fontWeight: 800, background: view === 'conservative' ? 'rgba(244,185,66,0.14)' : 'transparent', color: 'rgba(255,255,255,0.95)' }}
          >
            Conservative
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedRingIndex(null);
              setView('upper');
            }}
            aria-pressed={view === 'upper'}
            style={{ padding: '10px 12px', border: 0, cursor: 'pointer', fontWeight: 800, background: view === 'upper' ? 'rgba(244,185,66,0.14)' : 'transparent', color: 'rgba(255,255,255,0.95)' }}
          >
            Upper Bound
          </button>
        </div>

        <div style={{ display: 'flex', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, overflow: 'hidden' }}>
          <button
            type="button"
            onClick={() => {
              setSelectedRingIndex(null);
              setMode('animated');
            }}
            aria-pressed={mode === 'animated'}
            style={{ padding: '10px 12px', border: 0, cursor: 'pointer', fontWeight: 800, background: mode === 'animated' ? 'rgba(244,185,66,0.14)' : 'transparent', color: 'rgba(255,255,255,0.95)' }}
          >
            Animated
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedRingIndex(null);
              setMode('static');
            }}
            aria-pressed={mode === 'static'}
            style={{ padding: '10px 12px', border: 0, cursor: 'pointer', fontWeight: 800, background: mode === 'static' ? 'rgba(244,185,66,0.14)' : 'transparent', color: 'rgba(255,255,255,0.95)' }}
          >
            Static Export
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16, alignItems: 'start' }}>
        <div style={{ borderRadius: 20, border: '1px solid rgba(255,255,255,0.10)', padding: 14, background: 'rgba(255,255,255,0.02)' }}>
          <div ref={hostRef} dangerouslySetInnerHTML={{ __html: svgString }} />
        </div>

        <aside style={{ background: 'rgba(7,16,34,0.55)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 20, padding: 14 }}>
          <h3 style={{ margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(234,242,255,0.72)', fontSize: 14 }}>
            Click-to-expand breakdown
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
            <strong style={{ fontSize: 16, letterSpacing: '-0.02em' }}>{selectedDetail ? selectedDetail.title : 'Hover a ring'}</strong>
            <span style={{ fontSize: 12, fontWeight: 950, color: 'rgba(255,255,255,0.95)', background: 'rgba(244,185,66,0.14)', border: '1px solid rgba(244,185,66,0.28)', padding: '6px 10px', borderRadius: 999 }}>
              {selectedRingIndex == null ? '—' : ringTotalLabel(view, selectedRingIndex)}
            </span>
          </div>

          {selectedDetail ? (
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {selectedDetail.items.map((it, idx) => (
                <li key={`${it.name}-${idx}`} style={{ padding: 10, borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(7,16,34,0.45)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'baseline' }}>
                    <span style={{ fontWeight: 800, fontSize: 13, color: 'rgba(255,255,255,0.90)' }}>{it.name}</span>
                    <span style={{ fontWeight: 950, fontSize: 13, color: 'var(--gold)', whiteSpace: 'nowrap' }}>{itemDisplayPrice(it, view)}</span>
                  </div>
                  <div style={{ marginTop: 6, fontSize: 11, color: 'rgba(234,242,255,0.55)', fontStyle: 'italic', lineHeight: 1.35 }}>{it.rangeText}</div>
                  <div style={{ marginTop: 8, fontSize: 11, fontStyle: 'italic', color: 'rgba(234,242,255,0.55)' }}>
                    <a href={it.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(244,185,66,0.85)', textDecoration: 'underline', textDecorationColor: 'rgba(244,185,66,0.35)' }}>
                      {it.sourceUrl ? new URL(it.sourceUrl).host.replace(/^www\./, '') : 'Source'}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div style={{ color: 'rgba(234,242,255,0.75)', fontSize: 13, border: '1px dashed rgba(255,255,255,0.18)', padding: 10, borderRadius: 14 }}>
              Click any ring to expand its cost breakdown.
            </div>
          )}
        </aside>
      </div>

      <TooltipWithSource state={tooltip} />
    </div>
  );
}

// Re-export SVG export helpers so consumers can render the 1200×1200 or 16:9 variants.
export { exportRippleSvg, exportRippleSvg16x9 };

