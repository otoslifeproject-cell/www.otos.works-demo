(() => {
  'use strict';
  const qs = (s, scope = document) => scope.querySelector(s);
  const qsa = (s, scope = document) => [...scope.querySelectorAll(s)];
  const on = (el, ev, fn) => { if (el) el.addEventListener(ev, fn); };

  // Hero injection from content-manager localStorage selection
  const initHeroFromStorage = () => {
    try {
      const raw = localStorage.getItem('otosContinuity.homepage.v2');
      if (!raw) return;
      const data = JSON.parse(raw);
      const isMobile = window.innerWidth < 768;
      // Background image
      if (data.image) {
        const homeHero = qs('.home-hero');
        if (homeHero) homeHero.style.backgroundImage = `url('${data.image}')`;
      }
      // Heading — allow empty string
      if (data.heading != null) {
        const h = qs('.index-heading');
        if (h) h.textContent = data.heading;
      }
      // Sub-heading — allow empty string
      if (data.subheading != null) {
        const b = qs('.home-hero__body');
        if (b) b.textContent = data.subheading;
      }
      // Font sizes
      if (data.headingSize) {
        const h = qs('.index-heading');
        if (h) h.style.fontSize = data.headingSize + 'px';
      }
      if (data.subSize) {
        const b = qs('.home-hero__body');
        if (b) b.style.fontSize = data.subSize + 'px';
      }
      // Position — ONLY apply if new posDesktop/posMobile keys exist.
      // Do NOT fall back to old `pos` key — that causes off-screen positioning.
      const pos = isMobile ? data.posMobile : data.posDesktop;
      if (pos && qs('.home-hero')) {
        const content = qs('.home-hero__content');
        if (content) {
          // Safety check: only apply if values are within reasonable bounds
          const x = parseFloat(pos.x);
          const y = parseFloat(pos.y);
          if (isFinite(x) && isFinite(y) && x >= 10 && x <= 90 && y >= 10 && y <= 90) {
            // On very small screens, skip JS position and let CSS centre it
            if (window.innerWidth < 480) {
              content.style.cssText = '';
            } else {
              content.style.position  = 'absolute';
              content.style.left      = x + '%';
              content.style.top       = y + '%';
              content.style.transform = 'translate(-50%, -50%)';
              if (x < 35) {
                content.style.textAlign  = 'left';
                content.style.alignItems = 'flex-start';
              } else if (x > 65) {
                content.style.textAlign  = 'right';
                content.style.alignItems = 'flex-end';
              } else {
                content.style.textAlign  = 'center';
                content.style.alignItems = 'center';
              }
            }
          }
        }
      }
    } catch (e) {}
  };

  const initMobileNav = () => {
    const toggle = qs('[data-nav-toggle]');
    const menu = qs('[data-nav-menu]');
    if (!toggle || !menu) return;
    on(toggle, 'click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      menu.hidden = open;
    });
  };

  const initReveals = () => {
    const items = qsa('[data-reveal]');
    if (!items.length || !('IntersectionObserver' in window)) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-visible');
        obs.unobserve(e.target);
      });
    }, { threshold: 0.14 });
    items.forEach(el => obs.observe(el));
  };

  const initStatCount = () => {
    const values = qsa('[data-stat-value]');
    if (!values.length || !('IntersectionObserver' in window)) return;
    const animate = (el) => {
      const target = Number(el.dataset.statValue);
      if (!Number.isFinite(target)) return;
      const duration = 1200;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        el.textContent = Math.round(progress * target).toLocaleString('en-GB');
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        animate(e.target);
        obs.unobserve(e.target);
      });
    }, { threshold: 0.5 });
    values.forEach(el => obs.observe(el));
  };

  const initFloatingNav = () => {
    if (qs('.floating-next')) return;
    const shell = document.body && document.body.dataset.otosShell;
    if (shell === 'full-scroll' || shell === 'full-scroll2') return;

    const nextBtn = document.querySelector(
      '.page-nav .next, [class*="next-page"], .bottom-nav .nav-next, #btn-next'
    );
    if (!nextBtn) return;

    // Clone as floating version
    const floating = nextBtn.cloneNode(true);
    if (floating.id) floating.removeAttribute('id');
    floating.classList.add('floating-next');
    floating.setAttribute('data-floating-next', 'true');
    document.body.appendChild(floating);

    // Ensure the floating button has the simple label requested
    floating.textContent = 'Next →';

    const footer = document.querySelector('footer, .site-footer');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        floating.style.opacity = entry.isIntersecting ? '0' : '1';
        floating.style.pointerEvents = entry.isIntersecting ? 'none' : 'auto';
      });
    }, { threshold: 0.1 });

    if (footer) observer.observe(footer);
  };

  document.addEventListener('DOMContentLoaded', () => {
    initHeroFromStorage();
    initMobileNav();
    initReveals();
    initStatCount();
    initFloatingNav();
  });
})();
