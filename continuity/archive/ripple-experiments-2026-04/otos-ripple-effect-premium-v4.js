(function () {
  'use strict';

  function setStatusMessage(msg) {
    const target = document.getElementById('ripple-svg-target');
    if (!target) return;
    target.innerHTML =
      '<div style="padding:14px 16px;border-radius:12px;border:1px solid rgba(255,255,255,0.12);background:rgba(7,16,34,0.45);color:#EAF2FF;font:600 14px/1.5 Inter,system-ui,sans-serif;">' +
      msg +
      '</div>';
  }

  function abs(url) {
    return new URL(url, window.location.href).href;
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const full = abs(src);
      const existing = Array.from(document.querySelectorAll('script[src]')).find(
        (s) => abs(s.getAttribute('src')) === full
      );
      if (existing) {
        // If already present, assume loaded/managed by browser; continue.
        resolve(full);
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => resolve(full);
      script.onerror = () => reject(new Error('Failed to load: ' + src));
      document.head.appendChild(script);
    });
  }

  async function loadWithCandidates(candidates, validateFn, label) {
    for (const src of candidates) {
      try {
        await loadScript(src);
        if (!validateFn || validateFn()) return src;
      } catch (_) {}
    }
    throw new Error(label + ' not available in candidate paths.');
  }

  async function boot() {
    try {
      setStatusMessage('Loading ripple diagram assets…');

      // 1) Load export engine first
      await loadWithCandidates(
        [
          '/continuity/otos-ripple-effect-premium/rippleSvgExport.js',
          './otos-ripple-effect-premium/rippleSvgExport.js',
          'otos-ripple-effect-premium/rippleSvgExport.js'
        ],
        () => !!(window.OTSRippleSvgExport && typeof window.OTSRippleSvgExport.buildRippleSvgString === 'function'),
        'rippleSvgExport.js'
      );

      // 2) Load main interaction script
      await loadWithCandidates(
        [
          '/continuity/otos-ripple-effect-premium/otos-ripple-effect-premium.js',
          './otos-ripple-effect-premium/otos-ripple-effect-premium.js',
          'otos-ripple-effect-premium/otos-ripple-effect-premium.js'
        ],
        // Main script self-inits and paints into #ripple-svg-target.
        () => true,
        'otos-ripple-effect-premium.js'
      );
    } catch (err) {
      console.error(err);
      setStatusMessage(
        'Could not load diagram scripts. Check console/network for 404/CORS and confirm both files exist under /continuity/otos-ripple-effect-premium/.'
      );
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
