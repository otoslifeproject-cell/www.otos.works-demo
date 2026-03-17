(() => {
  'use strict';
  const qs = (s, scope = document) => scope.querySelector(s);
  const qsa = (s, scope = document) => [...scope.querySelectorAll(s)];
  const on = (el, ev, fn) => { if (el) el.addEventListener(ev, fn); };

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

  document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initReveals();
    initStatCount();
  });
})();
