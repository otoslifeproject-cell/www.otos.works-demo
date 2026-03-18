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

    const defaultSlides = [
      // Top 2 from hero-overlays.html (with fallbacks to continuity/images)
      {
        id: 'hero-1',
        aspect: 'portrait',
        image: 'images/A moment of quiet distress.png',
        fallbacks: ['../assets/hero/hero-1.png', '../assets/hero/hero-1.jpg', '../assets/hero/hero-1.jpeg', '../assets/hero/hero-1.webp'],
        headline: 'When someone is at their lowest — OTOS is already there.',
        subcopy: 'Frontline staff log a touchpoint in seconds. The system does the rest.',
        cta: 'Start with A&E',
        ctaHref: '/continuity/guided-demos.html'
      },
      {
        id: 'hero-2',
        aspect: 'portrait',
        image: 'images/Meaningful conversation in a cosy café.png',
        fallbacks: ['../assets/hero/hero-2.png', '../assets/hero/hero-2.jpg', '../assets/hero/hero-2.jpeg', '../assets/hero/hero-2.webp'],
        headline: 'Built for keyworkers. Engineered around real journeys.',
        subcopy: 'Co-produced with SUN Network and people with lived experience — because the people who use it helped build it.',
        cta: 'Keyworker View',
        ctaHref: '/continuity/guided-demos.html'
      },

      // Playground set (continuity/images)
      {
        id: 'p1',
        aspect: 'landscape',
        image: "images/A breakthrough moment in therapy.png",
        headline: 'When the right support arrives — everything changes.',
        subcopy: 'The moment diagnosis lands right. OTOS holds the pathway so that moment is never missed.',
        cta: \"Read Dean's Story\",
        ctaHref: '/continuity/founder-story.html'
      },
      {
        id: 'p2',
        aspect: 'landscape',
        image: "images/A corridor of colourful doors.png",
        headline: 'World-class services. No shared journey. Until now.',
        subcopy: 'Every door open. Nobody knowing which one you came through last.',
        cta: 'View System Overview',
        ctaHref: '/continuity/how-it-works.html'
      },
      {
        id: 'p3',
        aspect: 'landscape',
        image: "images/A moment of quiet distress.png",
        headline: 'This is where people are lost.',
        subcopy: 'Not in crisis. Not demanding help. Just quietly falling between services. OTOS sees it.',
        cta: 'See How OTOS Works',
        ctaHref: '/continuity/how-it-works.html'
      },
      {
        id: 'p4',
        aspect: 'landscape',
        image: "images/A warm farewell at the doorway.png",
        headline: \"Every good ending is someone's new beginning.\",
        subcopy: 'OTOS makes sure what happens next is never left to chance.',
        cta: 'Keyworker View',
        ctaHref: '/continuity/guided-demos.html'
      },
      {
        id: 'p5',
        aspect: 'landscape',
        image: "images/A warm handshake at sunset.png",
        headline: 'One human. Many services. One joined-up pathway.',
        subcopy: \"The moment of connection shouldn't be the last thing the system sees.\",
        cta: 'View System Overview',
        ctaHref: '/continuity/how-it-works.html'
      },
      {
        id: 'p6',
        aspect: 'landscape',
        image: "images/Cambridge at dusk from above.png",
        headline: 'The tsunami is coming. Nobody can see it building.',
        subcopy: 'Thousands of adults with undiagnosed ADHD cycling through A&E, housing, probation. OTOS is the early warning.',
        cta: 'View System Overview',
        ctaHref: '/continuity/how-it-works.html'
      },
      {
        id: 'p7',
        aspect: 'landscape',
        image: "images/Community conversation in a circle.png",
        headline: 'Community is the continuity.',
        subcopy: 'Co-produced with SUN Network and people with lived experience — because the people who use it helped build it.',
        cta: 'Keyworker View',
        ctaHref: '/continuity/guided-demos.html'
      },
      {
        id: 'p8',
        aspect: 'landscape',
        image: "images/Contemplating the morning brew.png",
        headline: 'Care happens in moments.',
        subcopy: 'Continuity happens in the days between. OTOS quietly fills that space.',
        cta: 'Start Guided Tour',
        ctaHref: '/continuity/guided-demos.html'
      },
      {
        id: 'p9',
        aspect: 'landscape',
        image: "images/Contemplative moment in the park.png",
        headline: 'Six years in the system. Three days to change everything.',
        subcopy: 'The correct diagnosis and medication was the key. OTOS makes sure no one waits that long again.',
        cta: \"Read Dean's Story\",
        ctaHref: '/continuity/founder-story.html'
      },
      {
        id: 'p10',
        aspect: 'landscape',
        image: "images/Golden hour in Cambridge.png",
        headline: 'The silent layer that connects every service.',
        subcopy: 'OTOS syncs CPFT, CGL, CRS, SUN, Primary Care and A&E into one encrypted continuity journey.',
        cta: 'View System Overview',
        ctaHref: '/continuity/how-it-works.html'
      },
      {
        id: 'p11',
        aspect: 'landscape',
        image: "images/hero-7-dean.png",
        headline: 'I am the problem. I built the solution.',
        subcopy: 'Two ICU admissions. Seizures. Probation. Rehab. Cost, carnage and chaos. Undiagnosed ADHD driving it all.',
        cta: \"Read Dean's Story\",
        ctaHref: '/continuity/founder-story.html'
      },
      {
        id: 'p12',
        aspect: 'landscape',
        image: "images/Hesitant arrival at the community centre.png",
        headline: 'The hardest step is the door. OTOS holds what comes after.',
        subcopy: 'Re-engagement after silence. OTOS turns a missed contact into a safe route back.',
        cta: 'See How OTOS Works',
        ctaHref: '/continuity/how-it-works.html'
      },
      {
        id: 'p13',
        aspect: 'landscape',
        image: "images/Man checking phone outside community centre.png",
        headline: 'One tap. The whole system knows.',
        subcopy: 'Frontline staff log a touchpoint in seconds. The system does the rest.',
        cta: 'Start with A&E',
        ctaHref: '/continuity/guided-demos.html'
      },
      {
        id: 'p14',
        aspect: 'landscape',
        image: "images/Man enjoying sunlight in the park.png",
        headline: 'This is what stability looks like.',
        subcopy: 'Calm. Present. Connected. OTOS holds the pathway so this moment can last.',
        cta: \"Read Dean's Story\",
        ctaHref: '/continuity/founder-story.html'
      },
      {
        id: 'p15',
        aspect: 'landscape',
        image: "images/Meaningful conversation in a cosy café.png",
        headline: 'Built for keyworkers. Engineered around real journeys.',
        subcopy: 'No new system. No extra forms. Just clarity about what happened next.',
        cta: 'Keyworker View',
        ctaHref: '/continuity/guided-demos.html'
      },
      {
        id: 'p16',
        aspect: 'landscape',
        image: "images/Morning coffee and a smile.png",
        headline: 'This is what staying connected feels like.',
        subcopy: 'A daily check-in. A small signal. The system quietly noting: still here, still stable.',
        cta: 'Start Guided Tour',
        ctaHref: '/continuity/guided-demos.html'
      },
      {
        id: 'p17',
        aspect: 'landscape',
        image: "images/Morning light and morning routine.png",
        headline: 'Every morning is a data point.',
        subcopy: 'Anonymous. Encrypted. A quiet signal that someone is still on their journey.',
        cta: 'Start Guided Tour',
        ctaHref: '/continuity/guided-demos.html'
      },
      {
        id: 'p18',
        aspect: 'landscape',
        image: "images/Morning reflections in a cozy room.png",
        headline: 'The space between services is where people are lost.',
        subcopy: 'OTOS fills that space. Quietly. Without changing anything you already do.',
        cta: 'See How OTOS Works',
        ctaHref: '/continuity/how-it-works.html'
      },
      {
        id: 'p19',
        aspect: 'landscape',
        image: "images/NHS A&E waiting room buzz.png",
        headline: '463 people waiting. How many will fall through the gap after this?',
        subcopy: 'OTOS gives A&E, CGL and CPFT a shared thread — so discharge is never the end of the story.',
        cta: 'Start with A&E',
        ctaHref: '/continuity/guided-demos.html'
      },
      {
        id: 'p20',
        aspect: 'landscape',
        image: "images/NHS team meeting in progress.png",
        headline: 'World-class services. No shared journey. Until now.',
        subcopy: 'Cambridge has everything it needs. OTOS is the connective tissue that joins it.',
        cta: 'View System Overview',
        ctaHref: '/continuity/how-it-works.html'
      },
      {
        id: 'p21',
        aspect: 'landscape',
        image: "images/Waiting for consultation in the corridor.png",
        headline: 'This is where people are lost.',
        subcopy: 'Between appointments. Between services. In the silence after discharge. OTOS sees it.',
        cta: 'See How OTOS Works',
        ctaHref: '/continuity/how-it-works.html'
      },
      {
        id: 'p22',
        aspect: 'landscape',
        image: "images/Woman reviewing NHS data dashboard.png",
        headline: 'The tsunami is coming. OTOS is the radar.',
        subcopy: 'Early signals. Pattern detection. A city-wide view with zero clinical risk.',
        cta: 'View System Overview',
        ctaHref: '/continuity/how-it-works.html'
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

