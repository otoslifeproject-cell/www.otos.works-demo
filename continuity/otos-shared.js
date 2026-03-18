(() => {
  'use strict';
  const qs = (s, scope = document) => scope.querySelector(s);
  const qsa = (s, scope = document) => [...scope.querySelectorAll(s)];
  const on = (el, ev, fn) => { if (el) el.addEventListener(ev, fn); };

  const ensureHeroCarouselOnPage = () => {
    // Only for Continuity pages (not otos.works marketing site)
    if (!location.pathname.startsWith('/continuity/')) return;

    // Skip if this page already has its own hero
    if (
      document.querySelector('.hero, [class*="hero-img"], [class*="hero-section"], .page-hero')
    ) return;

    // Skip on how-it-works.html specifically (it already has a hero)
    if (location.pathname.includes('how-it-works')) return;

    // Don't duplicate if already mounted
    if (qs('[data-otos-hero-carousel]')) return;

    const navbar = qs('.navbar');
    if (!navbar || !navbar.parentElement) return;

    // Ensure overlay CSS is present
    const hasOverlayCss = !!qsa('link[rel="stylesheet"]').find(l => (l.getAttribute('href') || '').includes('hero-overlays/hero-overlays.css'));
    if (!hasOverlayCss) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/continuity/hero-overlays/hero-overlays.css';
      document.head.appendChild(link);
    }

    // Insert shell after navbar
    const shell = document.createElement('section');
    shell.className = 'otos-hero-carousel-shell';
    shell.setAttribute('aria-label', 'Hero carousel');
    shell.innerHTML = '<div data-otos-hero-carousel></div>';
    navbar.insertAdjacentElement('afterend', shell);

    // Inject minimal styles once
    if (!qs('#otos-carousel-shared-style')) {
      const style = document.createElement('style');
      style.id = 'otos-carousel-shared-style';
      style.textContent = `
        .otos-hero-carousel-shell{
          position: relative;
          width: 100%;
          height: min(48vh, 520px);
          min-height: 320px;
          overflow: hidden;
          background: #000;
        }
        .otos-carousel{ width: 100%; height: 100%; position: relative; }
        .otos-carousel__track{ height: 100%; display: flex; transition: transform 520ms ease; will-change: transform; }
        .otos-carousel__slide{ min-width: 100%; height: 100%; }
        .otos-carousel__slide .hero-block{ height: 100%; }
        .otos-carousel__btn{
          position:absolute; top:50%; transform:translateY(-50%);
          z-index:10; width:44px; height:44px; border-radius:999px;
          border:1px solid rgba(255,255,255,0.18);
          background: rgba(0,0,0,0.35); color:#fff; font-size:26px; line-height:1;
          cursor:pointer; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
        }
        .otos-carousel__btn--prev{ left: 18px; }
        .otos-carousel__btn--next{ right: 18px; }
        .otos-carousel__dots{
          position:absolute; left:50%; transform:translateX(-50%); bottom: 12px;
          z-index:10; display:flex; gap:8px; padding:6px 10px; border-radius:999px;
          background: rgba(0,0,0,0.25); border:1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
        }
        .otos-carousel__dot{ width:7px; height:7px; border-radius:999px; border:0; padding:0; cursor:pointer; background: rgba(255,255,255,0.35); }
        .otos-carousel__dot[aria-selected="true"]{ background: rgba(255,255,255,0.9); }
        @media (prefers-reduced-motion: reduce){ .otos-carousel__track{ transition:none; } }
      `;
      document.head.appendChild(style);
    }

    // Load carousel script if not already loaded
    if (!qs('script[src$="hero-carousel.js"]')) {
      const s = document.createElement('script');
      s.defer = true;
      s.src = '/continuity/hero-carousel.js';
      document.head.appendChild(s);
    }
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

  document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initReveals();
    initStatCount();
    ensureHeroCarouselOnPage();
  });
})();
