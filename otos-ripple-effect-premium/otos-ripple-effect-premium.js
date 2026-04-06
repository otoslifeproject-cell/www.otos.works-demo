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
@@ -286,50 +333,51 @@
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
  const USE_PHOTO_BACKGROUND = false;

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
@@ -344,51 +392,52 @@

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
        // Keep this off for cleaner, more stable ripple animation and a consistent OTOS colour system.
        waterTextureSrc: USE_PHOTO_BACKGROUND ? '../images/Ripple-1024x546.jpg' : undefined,
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
@@ -425,30 +474,40 @@
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
})();
