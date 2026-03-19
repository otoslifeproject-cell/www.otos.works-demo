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
    const imgSrc = escapeHtml(slide._imgSrc || slide.image || '');

    return `
      <div class="carousel-slide" data-hero-slide aria-hidden="${idx === 0 ? 'false' : 'true'}">
        <img src="${imgSrc}" alt="">
        <div class="carousel-overlay">
          <p class="carousel-headline">${headline}</p>
          <p class="carousel-sub">${sub}</p>
        </div>
      </div>
    `.trim();
  }

  async function resolveSlideImageSrc(slide) {
    // For the built-in carousel we trust the filesystem; fallbacks handle manager variants.
    const candidates = [slide.image, ...(slide.fallbacks || [])].filter(Boolean);
    return candidates[0] || '';
  }

  async function initHeroCarousel() {
    const mount = qs('[data-otos-hero-carousel]');
    if (!mount) return;

    const STORAGE_KEY = 'otosContinuity.carousel.v1.payload';

    // Fallback slides: if LocalStorage is empty (fresh/locked session),
    // show every image currently present in continuity/images/ (no limit).
    const allImageFiles = [
      'A breakthrough moment in therapy.png',
      'A corridor of colourful doors.png',
      'A moment of quiet distress.png',
      'A warm farewell at the doorway.png',
      'A warm handshake at sunset.png',
      'Cambridge at dusk from above.png',
      'Community conversation in a circle.png',
      'Consulting with OTOS dashboard in office.png',
      'Contemplating the morning brew.png',
      'Contemplative moment in the park.png',
      'Engaging conversation at NHS Community Hub.png',
      'Focused on progress in the office.png',
      'Golden hour in Cambridge.png',
      'Hesitant arrival at the community centre.png',
      'Man checking phone outside community centre.png',
      'Man enjoying sunlight in the park.png',
      'Meaningful conversation in a cosy café.png',
      'Morning coffee and a smile.png',
      'Morning light and morning routine.png',
      'Morning reflections in a cozy room.png',
      'NHS A&E waiting room buzz.png',
      'NHS nurse assists patient with OTOS tool.png',
      'NHS team meeting in progress.png',
      'Professional at work with data dashboard.png',
      'Ripple-1024x546 copy.jpg',
      'Ripple-1024x546.jpg',
      'The+Ripple+Effect+of+Nature+Connectedness+diagram (1).webp',
      'The+Ripple+Effect+of+Nature+Connectedness+diagram.webp',
      'Therapist reviewing OTOS app progress.png',
      'Therapist reviewing options on smartphone.png',
      'Waiting for consultation in the corridor.png',
      'Woman reviewing NHS data dashboard.png',
      'Woman showing OTOS app at community centre.png',
      'hero-7-dean.png',
      'roadmap final.png',
      'sun-dashboard-devices.png',
    ];

    const defaultSub =
      'OTOS Continuity — built by someone who lived inside the gaps.';

    const copyByFile = {
      'A breakthrough moment in therapy.png': {
        headline: 'When the right support arrives — everything changes.',
        subcopy:
          'The moment diagnosis lands right. OTOS holds the pathway so that moment is never missed.',
        cta: 'Read Dean\'s Story',
        ctaHref: '/continuity/how-it-works.html',
      },
      'A corridor of colourful doors.png': {
        headline: 'World-class services. No shared journey. Until now.',
        subcopy:
          'Every door open. Nobody knowing which one you came through last.',
        cta: 'View System Overview',
        ctaHref: '/continuity/how-it-works.html',
      },
      'A moment of quiet distress.png': {
        headline: 'This is where people are lost.',
        subcopy:
          'Not in crisis. Not demanding help. Just quietly falling between services. OTOS sees it.',
        cta: 'See How OTOS Works',
        ctaHref: '/continuity/how-it-works.html',
      },
      'A warm farewell at the doorway.png': {
        headline: 'Every good ending is someone\'s new beginning.',
        subcopy:
          'OTOS makes sure what happens next is never left to chance.',
        cta: 'Keyworker View',
        ctaHref: '/continuity/how-it-works.html',
      },
      'A warm handshake at sunset.png': {
        headline: 'One human. Many services. One joined-up pathway.',
        subcopy:
          'The moment of connection shouldn\'t be the last thing the system sees.',
        cta: 'View System Overview',
        ctaHref: '/continuity/how-it-works.html',
      },
      'Cambridge at dusk from above.png': {
        headline: 'The tsunami is coming. Nobody can see it building.',
        subcopy:
          'Thousands of adults with undiagnosed ADHD cycling through A&E, housing, probation. OTOS is the early warning.',
        cta: 'View System Overview',
        ctaHref: '/continuity/how-it-works.html',
      },
      'Community conversation in a circle.png': {
        headline: 'Community is the continuity.',
        subcopy:
          'Co-produced with SUN Network and people with lived experience — because the people who use it helped build it.',
        cta: 'Keyworker View',
        ctaHref: '/continuity/how-it-works.html',
      },
      'Contemplating the morning brew.png': {
        headline: 'Care happens in moments. Continuity happens in the days between.',
        subcopy: 'OTOS quietly fills that space.',
        cta: 'Start Guided Tour',
        ctaHref: '/continuity/how-it-works.html',
      },
      'Contemplative moment in the park.png': {
        headline: 'Six years in the system. Three days to change everything.',
        subcopy:
          'The correct diagnosis and medication was the key. OTOS makes sure no one waits that long again.',
        cta: 'Read Dean\'s Story',
        ctaHref: '/continuity/how-it-works.html',
      },
      'Golden hour in Cambridge.png': {
        headline: 'The silent layer that connects every service.',
        subcopy:
          'OTOS syncs CPFT, CGL, CRS, SUN, Primary Care and A&E into one encrypted continuity journey.',
        cta: 'View System Overview',
        ctaHref: '/continuity/how-it-works.html',
      },
      'hero-7-dean.png': {
        headline: 'I am the problem. I built the solution.',
        subcopy:
          'Two ICU admissions. Seizures. Probation. Rehab. Cost, carnage and chaos. Undiagnosed ADHD driving it all.',
        cta: 'Read Dean\'s Story',
        ctaHref: '/continuity/how-it-works.html',
      },
      'Hesitant arrival at the community centre.png': {
        headline: 'The hardest step is the door. OTOS holds what comes after.',
        subcopy:
          'Re-engagement after silence. OTOS turns a missed contact into a safe route back to connection and community.',
        cta: 'See How OTOS Works',
        ctaHref: '/continuity/how-it-works.html',
      },
      'Man checking phone outside community centre.png': {
        headline: 'One tap. The whole system knows.',
        subcopy:
          'Frontline staff log a touchpoint in seconds. The system does the rest.',
        cta: 'Start with A&E',
        ctaHref: '/continuity/how-it-works.html',
      },
      'Man enjoying sunlight in the park.png': {
        headline: 'This is what stability looks like.',
        subcopy: 'Calm. Present. Connected. OTOS holds the pathway so this moment can last.',
        cta: 'Read Dean\'s Story',
        ctaHref: '/continuity/how-it-works.html',
      },
      'Meaningful conversation in a cosy café.png': {
        headline: 'Built for keyworkers. Engineered around real journeys.',
        subcopy: 'No new system. No extra forms. Just clarity about what happened next.',
        cta: 'Keyworker View',
        ctaHref: '/continuity/how-it-works.html',
      },
      'Morning coffee and a smile.png': {
        headline: 'This is what staying connected feels like.',
        subcopy:
          'A daily check-in. A small signal. The system quietly noting: still here, still stable, still connected.',
        cta: 'Start Guided Tour',
        ctaHref: '/continuity/how-it-works.html',
      },
      'Morning light and morning routine.png': {
        headline: 'Every morning is a data point.',
        subcopy:
          'Anonymous. Encrypted. A quiet signal that someone is still on their journey.',
        cta: 'Start Guided Tour',
        ctaHref: '/continuity/how-it-works.html',
      },
      'Morning reflections in a cozy room.png': {
        headline: 'The space between services is where people are lost.',
        subcopy: 'OTOS fills that space. Quietly. Without changing anything you already do.',
        cta: 'See How OTOS Works',
        ctaHref: '/continuity/how-it-works.html',
      },
      'NHS A&E waiting room buzz.png': {
        headline: '463 people waiting. How many will fall through the gap after this?',
        subcopy:
          'OTOS gives A&E, CGL and CPFT a shared thread — so discharge is never the end of the story.',
        cta: 'Start with A&E',
        ctaHref: '/continuity/how-it-works.html',
      },
      'NHS team meeting in progress.png': {
        headline: 'World-class services. No shared journey. Until now.',
        subcopy:
          'Cambridge has everything it needs. OTOS is the connective tissue that joins it.',
        cta: 'View System Overview',
        ctaHref: '/continuity/how-it-works.html',
      },
      'Waiting for consultation in the corridor.png': {
        headline: 'This is where people are lost.',
        subcopy:
          'Between appointments. Between services. In the silence after discharge. OTOS sees it.',
        cta: 'See How OTOS Works',
        ctaHref: '/continuity/how-it-works.html',
      },
      'Woman reviewing NHS data dashboard.png': {
        headline: 'The tsunami is coming. OTOS is the radar.',
        subcopy:
          'Early signals. Pattern detection. A city-wide view with zero clinical risk.',
        cta: 'View System Overview',
        ctaHref: '/continuity/how-it-works.html',
      },
    };

    const defaultSlides = allImageFiles.map((filename, i) => {
      const copy = copyByFile[filename] || {
        headline: 'OTOS Continuity',
        subcopy: defaultSub,
        cta: 'See how it works',
        ctaHref: '/continuity/how-it-works.html',
      };

      return {
        id: `fb${i + 1}`,
        image: `images/${filename}`,
        headline: copy.headline,
        subcopy: copy.subcopy,
        cta: copy.cta,
        ctaHref: copy.ctaHref,
        aspect: 'landscape',
      };
    });

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

    console.log('Carousel: ' + slides.length + ' slides loaded');

    // Resolve <img> sources with fallbacks (prevents broken/bare slides)
    for (const s of slides) {
      // s.image is relative to /continuity/ when used on index.html
      s._imgSrc = await resolveSlideImageSrc({
        image: s.image,
        fallbacks: (s.fallbacks || []).map(f => f)
      });
    }

    mount.innerHTML = `
      <div class="otos-carousel" aria-label="OTOS hero carousel">
        <div class="carousel-wrapper">
          ${slides.map((s, i) => buildSlideMarkup(s, i, slides.length)).join('')}
        </div>
        <button class="otos-carousel__btn otos-carousel__btn--prev" type="button" aria-label="Previous slide">‹</button>
        <button class="otos-carousel__btn otos-carousel__btn--next" type="button" aria-label="Next slide">›</button>
        <div class="otos-carousel__dots carousel-dots" role="tablist" aria-label="Slides">
          ${slides
            .map((_, i) => `<button class="otos-carousel__dot carousel-dot" type="button" role="tab" aria-label="Go to slide ${i + 1}" aria-selected="${i === 0 ? 'true' : 'false'}" data-dot="${i}"></button>`)
            .join('')}
        </div>
      </div>
    `;

    const wrapper = qs('.carousel-wrapper', mount);
    const slideEls = [...mount.querySelectorAll('.carousel-slide')];
    const dotEls = [...mount.querySelectorAll('.carousel-dot')];
    const prevBtn = qs('.otos-carousel__btn--prev', mount);
    const nextBtn = qs('.otos-carousel__btn--next', mount);

    let idx = 0;
    let timer = null;

    const apply = (newIdx) => {
      idx = (newIdx + slideEls.length) % slideEls.length;
      slideEls.forEach((el, i) => {
        const active = i === idx;
        el.classList.toggle('is-active', active);
        el.setAttribute('aria-hidden', active ? 'false' : 'true');
      });
      dotEls.forEach((el, i) => {
        const active = i === idx;
        el.classList.toggle('is-active', active);
        el.setAttribute('aria-selected', active ? 'true' : 'false');
      });
    };

    const kick = () => {
      if (timer) clearInterval(timer);
      timer = setInterval(() => apply(idx + 1), 6000);
    };

    prevBtn?.addEventListener('click', () => { apply(idx - 1); kick(); });
    nextBtn?.addEventListener('click', () => { apply(idx + 1); kick(); });
    dotEls.forEach((d) => d.addEventListener('click', () => { apply(Number(d.dataset.dot)); kick(); }));

    // Touch swipe
    let startX = null;
    wrapper?.addEventListener('touchstart', (e) => { startX = e.touches?.[0]?.clientX ?? null; }, { passive: true });
    wrapper?.addEventListener('touchend', (e) => {
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

    initCarouselLightbox(mount);
  }

  /** Scrim/hover are in hero-overlays.css; opens full-size image on slide photo click */
  function initCarouselLightbox(mount) {
    let lb = document.getElementById('otos-lightbox');
    if (!lb) {
      lb = document.createElement('div');
      lb.id = 'otos-lightbox';
      lb.setAttribute('role', 'dialog');
      lb.setAttribute('aria-modal', 'true');
      lb.setAttribute('aria-label', 'Enlarged carousel image');
      lb.innerHTML =
        '<button type="button" id="otos-lightbox-close" aria-label="Close">&times;</button>' +
        '<img id="otos-lightbox-img" src="" alt="" />';
      document.body.appendChild(lb);

      const lightboxImg = document.getElementById('otos-lightbox-img');
      const closeBtn = document.getElementById('otos-lightbox-close');

      const close = () => {
        lb.classList.remove('open');
        document.body.style.overflow = '';
      };

      lb.addEventListener('click', (e) => {
        if (e.target === lb) close();
      });
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        close();
      });
      lightboxImg.addEventListener('click', (e) => e.stopPropagation());

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lb.classList.contains('open')) close();
      });
    }

    const lightboxImg = document.getElementById('otos-lightbox-img');

    mount.addEventListener('click', (e) => {
      const t = e.target;
      if (!t || t.tagName !== 'IMG') return;
      const slide = t.closest('.carousel-slide');
      if (!slide || !slide.classList.contains('is-active')) return;
      e.preventDefault();
      e.stopPropagation();
      lightboxImg.src = t.currentSrc || t.src;
      lightboxImg.alt = t.alt || '';
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initHeroCarousel().catch(() => {
      // No-op: carousel should never break the page
    });
  });
})();

