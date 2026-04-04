(function () {
  'use strict';

  const svgTarget = document.getElementById('ripple-svg-target');
  if (!svgTarget) return;

  const introLayer = document.getElementById('ripple-campaign-intro');
  let campaignIntroHoldTimer = null;

  function clearCampaignIntro() {
    if (campaignIntroHoldTimer != null) {
      clearTimeout(campaignIntroHoldTimer);
      campaignIntroHoldTimer = null;
    }
    if (introLayer) {
      introLayer.innerHTML = '';
      introLayer.classList.remove('is-hold');
      introLayer.setAttribute('aria-hidden', 'true');
    }
  }

  function getBuildRippleSvgString() {
    const api = window.OTSRippleSvgExport;
    return api && typeof api.buildRippleSvgString === 'function' ? api.buildRippleSvgString : null;
  }
  if (!getBuildRippleSvgString()) {
    svgTarget.innerHTML = '<div class="ripple-error" style="padding:2rem;color:rgba(255,255,255,0.9);font-size:1rem;">Diagram script failed to load. Ensure <code>rippleSvgExport.js</code> loads before this file.</div>';

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const existing = Array.from(document.querySelectorAll('script[src]')).find((script) => {
        try {
          return new URL(script.src, window.location.href).href === new URL(src, window.location.href).href;
        } catch {
          return false;
        }
      });

      if (existing) {
        // Script already present and parsed.
        if (getBuildRippleSvgString()) {
          resolve(src);
        } else {
          reject(new Error(`Script present but API missing: ${src}`));
        }
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.addEventListener('load', () => resolve(src), { once: true });
      script.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), { once: true });
      document.head.appendChild(script);
    });
  }

  async function ensureSvgBuilderLoaded() {
    if (getBuildRippleSvgString()) return true;

    const candidates = [
      'rippleSvgExport.js',
      './rippleSvgExport.js',
      '/continuity/otos-ripple-effect-premium/rippleSvgExport.js',
    ];

    for (const src of candidates) {
      try {
        await loadScript(src);
        if (getBuildRippleSvgString()) return true;
      } catch {
        // Try next candidate path.
      }
    }

    return false;
  }
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
@@ -425,30 +472,40 @@
      btn.addEventListener('click', () => {
        currentMode = btn.dataset.mode;
        lockedRingIndex = null;
        setTogglesPressed();
        renderSvg();
      });
    });

    const playBtn = document.getElementById('ripple-play-intro');
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        currentMode = 'animated';
        lockedRingIndex = null;
        setTogglesPressed();
        svgTarget.innerHTML = '';
        requestAnimationFrame(() => {
          renderSvg();
          requestAnimationFrame(() => {
            startCampaignIntro();
          });
        });
      });
    }
  }

  setTogglesPressed();
  initToggles();
  renderSvg();
})();
  async function boot() {
    const loaded = await ensureSvgBuilderLoaded();
    if (!loaded) {
      svgTarget.innerHTML =
        '<div class="ripple-error" style="padding:2rem;color:rgba(255,255,255,0.9);font-size:1rem;">Diagram script failed to load. Tried <code>rippleSvgExport.js</code> in local and <code>/continuity/otos-ripple-effect-premium/</code> paths.</div>';
      return;
    }

    setTogglesPressed();
    initToggles();
    renderSvg();
  }

  boot();
})();ue');
    }
  }

  function getBuildRippleSvgString() {
    const api = window.OTSRippleSvgExport;
    return api && typeof api.buildRippleSvgString === 'function' ? api.buildRippleSvgString : null;
  }
  if (!getBuildRippleSvgString()) {
    svgTarget.innerHTML = '<div class="ripple-error" style="padding:2rem;color:rgba(255,255,255,0.9);font-size:1rem;">Diagram script failed to load. Ensure <code>rippleSvgExport.js</code> loads before this file.</div>';
  }
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

  /** Dramatic 7–8s campaign layer: only invoked from ▶ Play intro (diagram unchanged). */
  function startCampaignIntro() {
    if (!introLayer) return;
    if (campaignIntroHoldTimer != null) {
      clearTimeout(campaignIntroHoldTimer);
      campaignIntroHoldTimer = null;
    }
    introLayer.classList.remove('is-hold');
    introLayer.innerHTML = '';

    const api = window.OTSRippleSvgExport;
    const focalFn = api && typeof api.getCampaignIntroFocals === 'function' ? api.getCampaignIntroFocals : null;
    const W = 1200;
    const H = 1200;
    let focals;
    if (focalFn) {
      focals = focalFn(W, H);
    } else {
      const ex = W / 2;
      const ey = H / 2 + H * 0.032;
      focals = [
        { x: ex - W * 0.11, y: ey - H * 0.065, label: 'REFERRAL' },
        { x: ex, y: ey, label: 'DISCHARGE' },
        { x: ex + W * 0.105, y: ey + H * 0.055, label: 'CRISIS POINT' },
      ];
    }

    const baseDelays = [0, 2.5, 5];
    const ringRadii = [48, 96, 144, 192, 240];
    let body = '';
    focals.forEach((fp, di) => {
      const bd = baseDelays[di];
      const fx = fp.x;
      const fy = fp.y;
      const lab = escapeHtml(String(fp.label || '').toUpperCase());
      const flashD = bd + 0.35;

      body +=
        `<g transform="translate(${fx},${fy})">` +
        `<g class="intro-drop-fall" style="animation: rippleIntro_dropFall 0.35s ease-in forwards; animation-delay: ${bd}s;">` +
        `<ellipse cx="0" cy="0" rx="5" ry="6.5" fill="#ffffff"/>` +
        `</g></g>`;

      body +=
        `<g transform="translate(${fx},${fy})">` +
        `<circle r="46" fill="url(#introFlashRadial)" class="intro-flash" style="animation: rippleIntro_flash 0.3s ease-out forwards; animation-delay: ${flashD}s"/>` +
        `</g>`;

      ringRadii.forEach((r, ri) => {
        const rd = flashD + ri * 0.3;
        body +=
          `<g transform="translate(${fx},${fy})">` +
          `<circle r="${r}" fill="none" stroke="rgba(255,255,255,0.92)" stroke-width="1.35" class="intro-impact-ring" vector-effect="non-scaling-stroke" style="animation: rippleIntro_ringExpand 2.2s ease-out forwards; animation-delay: ${rd}s"/>` +
          `</g>`;
      });

      body +=
        `<text class="ripple-intro-label" x="${fx}" y="${fy + 26}" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="600" font-family="Inter, ui-sans-serif, system-ui, sans-serif" ` +
        `style="letter-spacing:2.5px;opacity:0;text-transform:uppercase;animation: rippleIntro_labelIn 0.55s ease-out forwards;animation-delay:${flashD}s">${lab}</text>`;
    });

    introLayer.innerHTML =
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200" preserveAspectRatio="xMidYMid meet" class="ripple-campaign-intro-svg" aria-hidden="true">` +
      `<defs>` +
      `<radialGradient id="introFlashRadial" cx="50%" cy="50%" r="50%">` +
      `<stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>` +
      `<stop offset="50%" stop-color="#ffffff" stop-opacity="0.3"/>` +
      `<stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>` +
      `</radialGradient>` +
      `</defs>` +
      body +
      `</svg>`;
    introLayer.setAttribute('aria-hidden', 'false');

    campaignIntroHoldTimer = setTimeout(() => {
      campaignIntroHoldTimer = null;
      introLayer.classList.add('is-hold');
      introLayer.setAttribute('aria-hidden', 'true');
    }, 7500);
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
    clearCampaignIntro();
    const buildFn = getBuildRippleSvgString();
    if (!buildFn) {
      svgTarget.innerHTML = '<div class="ripple-error" style="padding:2rem;color:rgba(255,255,255,0.9);font-size:1rem;">Diagram script not loaded. Check that <code>rippleSvgExport.js</code> is available.</div>';
      return;
    }
    const mode = currentMode === 'animated' ? 'animated' : 'static';
    const view = currentView === 'upper' ? 'upper' : 'conservative';
    let svgString;
    try {
      svgString = buildFn({
        width: 1200,
        height: 1200,
        view,
        mode,
        waterTextureSrc: '../images/Ripple-1024x546.jpg',
      });
    } catch (err) {
      console.error('Ripple SVG build failed:', err);
      svgTarget.innerHTML = '<div class="ripple-error" style="padding:2rem;color:rgba(255,255,255,0.9);font-size:1rem;">Diagram failed to build. See console.</div>';
      return;
    }
    svgTarget.innerHTML = svgString;

    // Hit targets are circle (no photo) or ellipse (photo ripples).
    const hitEls = svgTarget.querySelectorAll('.ripple-ring[data-ring]');
    hitEls.forEach((circle) => {
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

    const playBtn = document.getElementById('ripple-play-intro');
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        currentMode = 'animated';
        lockedRingIndex = null;
        setTogglesPressed();
        svgTarget.innerHTML = '';
        requestAnimationFrame(() => {
          renderSvg();
          requestAnimationFrame(() => {
            startCampaignIntro();
          });
        });
      });
    }
  }

  setTogglesPressed();
  initToggles();
  renderSvg();
})();

