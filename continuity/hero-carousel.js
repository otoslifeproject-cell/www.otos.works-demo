(() => {
  'use strict';

  const qs = (s, scope = document) => scope.querySelector(s);

  const preloadImage = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(src);
      img.onerror = () => reject(new Error(`Failed to load ${src}`));
      img.src = src;
    });

  const escapeHtml = (s) =>
    String(s)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');

  function buildSlideMarkup(slide, idx, total) {
    const headline = escapeHtml(slide.headline);
    const sub = escapeHtml(slide.subcopy);
    const cta = escapeHtml(slide.cta);
    const ctaHref = escapeHtml(slide.ctaHref || '#');

    return `
      <div class="otos-carousel__slide" data-slide="${idx}" aria-hidden="${idx === 0 ? 'false' : 'true'}">
        <div class="hero-block ${slide.aspect === 'portrait' ? 'hero-block--portrait' : 'hero-block--landscape'} hero-block--fill" style="background-image: ${slide._bgCss}; background-size: cover; background-position: center center;">
          <div class="hero-block__overlay">
            <div class="hero-logo-strip">
              <img class="hero-logo-strip__brain" src="../assets/brain.png" alt="">
              <span class="hero-logo-strip__wordmark">OTOS</span>
            </div>
            <div></div>
            <div class="hero-copy">
              <h2 class="hero-headline">${headline}</h2>
              <p class="hero-sub">${sub}</p>
              <a href="${ctaHref}" class="hero-cta">${cta}</a>
            </div>
          </div>
        </div>
      </div>
    `.trim();
  }

  async function resolveSlideBackground(slide) {
    const candidates = [slide.image, ...(slide.fallbacks || [])].filter(Boolean);
    for (const src of candidates) {
      try {
        await preloadImage(src);
        return `url('${src.replaceAll("'", "\\'")}')`;
      } catch {
        // try next
      }
    }
    return `linear-gradient(135deg, #2a3544 0%, #0f172a 100%)`;
  }

  async function initHeroCarousel() {
    const mount = qs('[data-otos-hero-carousel]');
    if (!mount) return;

    const STORAGE_KEY = 'otosContinuity.carousel.v1.payload';

    // Fallback slides: if LocalStorage is empty (fresh/locked session),
    // use the first 6 real files in continuity/images/.
    const defaultSlides = [
      {
        id: 'fb1',
        image: 'images/A breakthrough moment in therapy.png',
        headline: 'One human. Many services. One joined-up pathway.',
        subcopy: 'OTOS Continuity — built by someone who lived inside the gaps.',
        cta: 'See how it works',
        ctaHref: '/continuity/how-it-works.html',
        aspect: 'landscape'
      },
      {
        id: 'fb2',
        image: 'images/A corridor of colourful doors.png',
        headline: 'You refer someone. Then what?',
        subcopy: 'OTOS Continuity — built by someone who lived inside the gaps.',
        cta: 'See how it works',
        ctaHref: '/continuity/how-it-works.html',
        aspect: 'landscape'
      },
      {
        id: 'fb3',
        image: 'images/A moment of quiet distress.png',
        headline: 'The failure is not in the care — it is in the space between it.',
        subcopy: 'OTOS Continuity — built by someone who lived inside the gaps.',
        cta: 'See how it works',
        ctaHref: '/continuity/how-it-works.html',
        aspect: 'landscape'
      },
      {
        id: 'fb4',
        image: 'images/A warm farewell at the doorway.png',
        headline: 'Recovery support for life.',
        subcopy: 'OTOS Continuity — built by someone who lived inside the gaps.',
        cta: 'See how it works',
        ctaHref: '/continuity/how-it-works.html',
        aspect: 'landscape'
      },
      {
        id: 'fb5',
        image: 'images/A warm handshake at sunset.png',
        headline: 'Low integration. Low disruption. High clarity.',
        subcopy: 'OTOS Continuity — built by someone who lived inside the gaps.',
        cta: 'See how it works',
        ctaHref: '/continuity/how-it-works.html',
        aspect: 'landscape'
      },
      {
        id: 'fb6',
        image: 'images/Cambridge at dusk from above.png',
        headline: 'Out The Other Side.',
        subcopy: 'OTOS Continuity — built by someone who lived inside the gaps.',
        cta: 'See how it works',
        ctaHref: '/continuity/how-it-works.html',
        aspect: 'landscape'
      }
    ];

    const loadManagedSlides = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || !Array.isArray(parsed.slides) || !parsed.slides.length) return null;
        return parsed.slides
          .filter(s => s && typeof s.image === 'string' && s.image.trim())
          .map((s, i) => ({
            id: s.id || `m${i + 1}`,
            aspect: s.aspect === 'portrait' ? 'portrait' : 'landscape',
            image: s.image,
            headline: s.headline || '',
            subcopy: s.subcopy || '',
            cta: s.cta || 'Learn more',
            ctaHref: s.ctaHref || '#',
            fallbacks: Array.isArray(s.fallbacks) ? s.fallbacks : []
          }));
      } catch {
        return null;
      }
    };

    const slides = loadManagedSlides() || defaultSlides;

    // Resolve backgrounds with fallbacks (prevents blank slides)
    for (const s of slides) {
      // s.image is relative to /continuity/ when used on index.html
      s._bgCss = await resolveSlideBackground({
        image: s.image,
        fallbacks: (s.fallbacks || []).map(f => f)
      });
    }

    mount.innerHTML = `
      <div class="otos-carousel" aria-label="OTOS hero carousel">
        <div class="otos-carousel__track">
          ${slides.map((s, i) => buildSlideMarkup(s, i, slides.length)).join('')}
        </div>
        <button class="otos-carousel__btn otos-carousel__btn--prev" type="button" aria-label="Previous slide">‹</button>
        <button class="otos-carousel__btn otos-carousel__btn--next" type="button" aria-label="Next slide">›</button>
        <div class="otos-carousel__dots" role="tablist" aria-label="Slides">
          ${slides
            .map((_, i) => `<button class="otos-carousel__dot" type="button" role="tab" aria-label="Go to slide ${i + 1}" aria-selected="${i === 0 ? 'true' : 'false'}" data-dot="${i}"></button>`)
            .join('')}
        </div>
      </div>
    `;

    const track = qs('.otos-carousel__track', mount);
    const slideEls = [...mount.querySelectorAll('.otos-carousel__slide')];
    const dotEls = [...mount.querySelectorAll('.otos-carousel__dot')];
    const prevBtn = qs('.otos-carousel__btn--prev', mount);
    const nextBtn = qs('.otos-carousel__btn--next', mount);

    let idx = 0;
    let timer = null;

    const apply = (newIdx) => {
      idx = (newIdx + slideEls.length) % slideEls.length;
      track.style.transform = `translateX(${idx * -100}%)`;
      slideEls.forEach((el, i) => el.setAttribute('aria-hidden', i === idx ? 'false' : 'true'));
      dotEls.forEach((el, i) => el.setAttribute('aria-selected', i === idx ? 'true' : 'false'));
    };

    const kick = () => {
      if (timer) clearInterval(timer);
      timer = setInterval(() => apply(idx + 1), 4000);
    };

    prevBtn?.addEventListener('click', () => { apply(idx - 1); kick(); });
    nextBtn?.addEventListener('click', () => { apply(idx + 1); kick(); });
    dotEls.forEach((d) => d.addEventListener('click', () => { apply(Number(d.dataset.dot)); kick(); }));

    // Touch swipe
    let startX = null;
    track.addEventListener('touchstart', (e) => { startX = e.touches?.[0]?.clientX ?? null; }, { passive: true });
    track.addEventListener('touchend', (e) => {
      if (startX == null) return;
      const endX = e.changedTouches?.[0]?.clientX ?? startX;
      const dx = endX - startX;
      if (Math.abs(dx) > 48) {
        apply(idx + (dx < 0 ? 1 : -1));
        kick();
      }
      startX = null;
    }, { passive: true });

    apply(0);
    kick();
  }

  document.addEventListener('DOMContentLoaded', () => {
    initHeroCarousel().catch(() => {
      // No-op: carousel should never break the page
    });
  });
})();

