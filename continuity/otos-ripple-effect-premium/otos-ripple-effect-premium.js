(function () {
  'use strict';

  const { buildRippleSvgString } = window.OTSRippleSvgExport;

  const svgTarget = document.getElementById('ripple-svg-target');
  const tooltip = document.getElementById('ripple-tooltip');

  const selectedRingTitle = document.getElementById('selected-ring-title');
  const selectedRingBadge = document.getElementById('selected-ring-badge');
  const selectedRingItems = document.getElementById('selected-ring-items');

  const GBP = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 });
  const fmtGBP = (n) => `£${GBP.format(Math.round(n))}`;

  const ringTotals = {
    conservative: { 0: 40070, 1: 9080, 2: 1900, 3: 16350, 4: 11000, 5: 3000, 6: 0, 7: 250 },
    upper: { 0: 86500, 1: 15800, 2: 5700, 3: 27250, 4: 28450, 5: 11000, 6: 0, 7: 700 },
  };

  const ringDetails = {
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

  function keyPriceText(item, view) {
    if (item.min == null || item.max == null) return item.rangeText;
    return view === 'conservative' ? `Conservative: ${fmtGBP(item.min)}${item.rangeText ? '' : ''}` : `Upper: ${fmtGBP(item.max)}${item.rangeText ? '' : ''}`;
  }

  function getItemDisplayPrice(item, view) {
    if (item.min == null || item.max == null) return item.rangeText;
    const value = view === 'conservative' ? item.min : item.max;
    return fmtGBP(value);
  }

  function getItemRangeNote(item) {
    if (!item.rangeText) return '';
    return item.rangeText;
  }

  function ringShortBadge(view, ringIndex) {
    if (ringIndex === 0) {
      return view === 'conservative' ? '£40,070 / year' : '£78k–£95k+ / year';
    }
    const t = ringTotals[view][ringIndex];
    if (ringIndex === 6) return 'Future cost breeder';
    if (ringIndex === 7) return view === 'conservative' ? '~£250 / year' : '~£700 / year';
    return fmtGBP(t);
  }

  function showTooltip(ringIndex, x, y) {
    const detail = ringDetails[ringIndex];
    if (!detail) return;

    const itemsHtml = detail.items
      .map((it) => {
        const price = getItemDisplayPrice(it, currentView);
        const rangeNote = getItemRangeNote(it);
        return `<li>${escapeHtml(it.name)} — <span style="color:var(--gold);font-weight:950">${escapeHtml(price)}</span>
          <div class="tip-source">${escapeHtml(rangeNote)}</div>
          <div class="tip-source"><a href="${escapeHtml(it.sourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(shortHost(it.sourceUrl))}</a></div>
        </li>`;
      })
      .join('');

    tooltip.innerHTML =
      `<h4>${escapeHtml(detail.title)}</h4>` +
      `<div class="tip-total">${escapeHtml(ringShortBadge(currentView, ringIndex))}</div>` +
      `<ul>${itemsHtml}</ul>`;

    tooltip.classList.add('is-visible');
    tooltip.setAttribute('aria-hidden', 'false');
    tooltip.style.left = `${x + 14}px`;
    tooltip.style.top = `${y + 14}px`;
  }

  function hideTooltip() {
    tooltip.classList.remove('is-visible');
    tooltip.setAttribute('aria-hidden', 'true');
  }

  function renderAside(ringIndex) {
    const detail = ringDetails[ringIndex];
    if (!detail) return;

    selectedRingTitle.textContent = detail.title;
    selectedRingBadge.textContent = ringShortBadge(currentView, ringIndex);

    selectedRingItems.innerHTML = detail.items
      .map((it) => {
        const price = getItemDisplayPrice(it, currentView);
        const rangeNote = getItemRangeNote(it);
        return (
          `<li>` +
          `<div class="ripple-itemTop">` +
          `<span>${escapeHtml(it.name)}</span>` +
          `<span class="ripple-itemPrice">${escapeHtml(price)}</span>` +
          `</div>` +
          `<div class="ripple-itemSource">${escapeHtml(rangeNote)}</div>` +
          `<div class="ripple-itemSource"><a href="${escapeHtml(it.sourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(
            shortHost(it.sourceUrl)
          )}</a></div>` +
          `</li>`
        );
      })
      .join('');
  }

  function shortHost(url) {
    try {
      const u = new URL(url);
      return u.host.replace(/^www\./, '');
    } catch {
      return url;
    }
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&apos;');
  }

  let currentView = 'conservative';
  let currentMode = 'animated';
  let lockedRingIndex = null;

  function updateButtonPressed(selector, key) {
    document.querySelectorAll(selector).forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset[key] === btn.getAttribute(`data-${key}`) && btn.dataset[key] === key));
    });
  }

  function setTogglesPressed() {
    document.querySelectorAll('[data-view]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset.view === currentView));
    });
    document.querySelectorAll('[data-mode]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset.mode === currentMode));
    });
  }

  function animateRingCounters() {
    if (currentMode !== 'animated') return;
    const duration = 950;
    const t0 = performance.now();

    const targets = ringTotals[currentView];
    const ringEls = Array.from(svgTarget.querySelectorAll('text#ring-total-0, text#ring-total-1, text#ring-total-2, text#ring-total-3, text#ring-total-4, text#ring-total-5, text#ring-total-7'));

    const animateOne = (el, target) => {
      const loop = (now) => {
        const p = Math.min(1, (now - t0) / duration);
        const v = target * p;
        el.textContent = fmtGBP(v);
        if (p < 1) requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    };

    ringEls.forEach((el) => {
      const id = el.getAttribute('id') || '';
      const ringIndex = Number(id.replace('ring-total-', ''));
      const target = targets[ringIndex] || 0;
      animateOne(el, target);
    });
  }

  function renderSvg() {
    const mode = currentMode === 'animated' ? 'animated' : 'static';
    const view = currentView === 'upper' ? 'upper' : 'conservative';
    const svgString = buildRippleSvgString({ width: 1200, height: 1200, view, mode });
    svgTarget.innerHTML = svgString;

    // Bind hover + click on ring circles.
    const circles = svgTarget.querySelectorAll('circle.ripple-ring');
    circles.forEach((circle) => {
      const ringIndex = Number(circle.getAttribute('data-ring'));

      circle.addEventListener('mousemove', (e) => {
        if (lockedRingIndex !== null) return;
        showTooltip(ringIndex, e.clientX, e.clientY);
      });

      circle.addEventListener('mouseenter', (e) => {
        if (lockedRingIndex !== null) return;
        showTooltip(ringIndex, e.clientX, e.clientY);
      });

      circle.addEventListener('mouseleave', () => {
        if (lockedRingIndex !== null) return;
        hideTooltip();
      });

      circle.addEventListener('click', () => {
        lockedRingIndex = ringIndex;
        renderAside(ringIndex);
        hideTooltip();
      });
    });

    // Initial panel if nothing selected.
    if (lockedRingIndex === null) {
      selectedRingTitle.textContent = 'Hover a ring';
      selectedRingBadge.textContent = '—';
      selectedRingItems.innerHTML = `<li style="color:rgba(234,242,255,0.75);border-style:dashed">Click any ring to expand its cost breakdown.</li>`;
    }

    animateRingCounters();
  }

  function initToggles() {
    document.querySelectorAll('[data-view]').forEach((btn) => {
      btn.addEventListener('click', () => {
        currentView = btn.dataset.view === 'upper' ? 'upper' : 'conservative';
        lockedRingIndex = null;
        setTogglesPressed();
        renderSvg();
      });
    });
    document.querySelectorAll('[data-mode]').forEach((btn) => {
      btn.addEventListener('click', () => {
        currentMode = btn.dataset.mode;
        lockedRingIndex = null;
        setTogglesPressed();
        renderSvg();
      });
    });
  }

  // Fix pressed state: since the HTML uses data-view/data-mode rather than nested attributes,
  // we just call setTogglesPressed once after first render.
  setTogglesPressed();
  initToggles();
  renderSvg();
})();

