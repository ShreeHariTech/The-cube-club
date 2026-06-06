/**
 * ========================================================
 *  THE CUBE CLUB — Main Animation & Interaction Controller
 * ========================================================
 *  Dependencies: GSAP 3.15, ScrollTrigger, Lenis
 *  All libraries loaded via CDN and available globally.
 * ========================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------
  //  0. PRELOADER
  // --------------------------------------------------
  const preloader = document.querySelector('.preloader');

  const initSite = () => {
    // Fade out the preloader, then boot every animation module
    if (preloader) {
      gsap.to(preloader, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut',
        onComplete: () => {
          preloader.style.display = 'none';
          bootAnimations();
        },
      });
    } else {
      bootAnimations();
    }
  };

  // Small grace period so fonts / critical images can settle
  setTimeout(initSite, 500);

  // --------------------------------------------------
  //  1. GSAP REGISTER
  // --------------------------------------------------
  gsap.registerPlugin(ScrollTrigger);

  // --------------------------------------------------
  //  2. LENIS SMOOTH SCROLL
  // --------------------------------------------------
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  // Sync Lenis ↔ ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // --------------------------------------------------
  //  MASTER BOOT — called after preloader fades
  // --------------------------------------------------
  function bootAnimations() {
    initCursorGlow();
    initNavigation();
    initHeroAnimations();
    initScrollReveals();
    initGoldLines();
    initStatsCounter();
    initHorizontalScroll();
    initJourneyInteractions();
    initTestimonialsCarousel();
    initWeddingParallax();
    initParallaxImages();
    initStaggerChildren();
    initBookingBarVisibility();
    initSmoothAnchors();

    // Refresh ScrollTrigger after everything is wired up
    ScrollTrigger.refresh();
  }

  // ====================================================
  //  3. CUSTOM CURSOR GLOW (desktop only)
  // ====================================================
  function initCursorGlow() {
    // Only on devices that actually have a pointer
    const mql = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!mql.matches) return;

    const glow = document.createElement('div');
    glow.classList.add('cursor-glow');
    document.body.appendChild(glow);

    // Position off-screen initially
    gsap.set(glow, { xPercent: -50, yPercent: -50, x: -100, y: -100 });

    document.addEventListener('mousemove', (e) => {
      gsap.to(glow, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.6,
        ease: 'power3.out',
      });
    });

    // Expand on interactive elements
    const interactiveEls = 'a, button, .btn, input, select, textarea, .nav__hamburger';
    document.querySelectorAll(interactiveEls).forEach((el) => {
      el.addEventListener('mouseenter', () => glow.classList.add('cursor-glow--hover'));
      el.addEventListener('mouseleave', () => glow.classList.remove('cursor-glow--hover'));
    });
  }

  // ====================================================
  //  4. NAVIGATION
  // ====================================================
  function initNavigation() {
    const nav = document.querySelector('.nav');
    const hamburger = document.querySelector('.nav__hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelectorAll('a[href^="#"]');

    if (!nav) return;

    // --- Scroll-based style change ---
    ScrollTrigger.create({
      trigger: document.body,
      start: 'top -100px',
      onEnter: () => nav.classList.add('nav--scrolled'),
      onLeaveBack: () => nav.classList.remove('nav--scrolled'),
    });

    // --- Hamburger toggle ---
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');

        // Lock / unlock scroll when mobile menu is open
        if (isOpen) {
          lenis.stop();
        } else {
          lenis.start();
        }
      });
    }

    // --- Nav link smooth scroll ---
    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        lenis.scrollTo(target, { offset: -80 });

        // Close mobile menu if open
        if (mobileMenu && mobileMenu.classList.contains('active')) {
          hamburger.classList.remove('active');
          mobileMenu.classList.remove('active');
          lenis.start();
        }
      });
    });
  }

  // ====================================================
  //  5. HERO ANIMATIONS (on page load)
  // ====================================================
  function initHeroAnimations() {
    const heroContent = document.querySelector('.hero__content');
    if (!heroContent) return;

    const tl = gsap.timeline({ delay: 0.3 });

    // Eyebrow
    const eyebrow = heroContent.querySelector('.eyebrow');
    if (eyebrow) {
      gsap.set(eyebrow, { opacity: 0, y: 20 });
      tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
    }

    // Heading — word-by-word reveal
    const h1 = heroContent.querySelector('h1');
    if (h1) {
      const words = h1.textContent.trim().split(/\s+/);
      h1.innerHTML = words
        .map((word) => `<span class="word-wrap"><span class="word">${word}</span></span>`)
        .join(' ');

      const wordSpans = h1.querySelectorAll('.word');
      gsap.set(wordSpans, { opacity: 0, y: 30 });
      tl.to(wordSpans, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.08,
      }, '-=0.4');
    }

    // Paragraph
    const p = heroContent.querySelector('p');
    if (p) {
      gsap.set(p, { opacity: 0, y: 20 });
      tl.to(p, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5');
    }

    // CTA Buttons
    const buttons = heroContent.parentElement
      ? document.querySelectorAll('.hero__buttons .btn')
      : [];
    if (buttons.length) {
      gsap.set(buttons, { opacity: 0, y: 20 });
      tl.to(buttons, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.15,
      }, '-=0.4');
    }

    // Scroll indicator
    const scrollCue = document.querySelector('.hero__scroll');
    if (scrollCue) {
      gsap.set(scrollCue, { opacity: 0 });
      tl.to(scrollCue, { opacity: 1, duration: 0.8, ease: 'power2.out' }, '+=0.3');
    }

    // Ken Burns on hero background
    const heroBgImg = document.querySelector('.hero__bg img');
    if (heroBgImg) {
      gsap.to(heroBgImg, {
        scale: 1.1,
        duration: 20,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    }
  }

  // ====================================================
  //  6. SCROLL-TRIGGERED REVEALS
  // ====================================================
  function initScrollReveals() {
    // --- Standard reveals (fade-up) ---
    const reveals = gsap.utils.toArray('.reveal');
    if (reveals.length) {
      gsap.set(reveals, { opacity: 0, y: 40 });
      ScrollTrigger.batch(reveals, {
        start: 'top 85%',
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.15,
          }),
        once: true,
      });
    }

    // --- Reveal from left ---
    const revealsLeft = gsap.utils.toArray('.reveal-left');
    if (revealsLeft.length) {
      gsap.set(revealsLeft, { opacity: 0, x: -50 });
      ScrollTrigger.batch(revealsLeft, {
        start: 'top 85%',
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.15,
          }),
        once: true,
      });
    }

    // --- Reveal from right ---
    const revealsRight = gsap.utils.toArray('.reveal-right');
    if (revealsRight.length) {
      gsap.set(revealsRight, { opacity: 0, x: 50 });
      ScrollTrigger.batch(revealsRight, {
        start: 'top 85%',
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.15,
          }),
        once: true,
      });
    }

    // --- Image clip-path reveals ---
    const imgReveals = gsap.utils.toArray('.img-reveal');
    if (imgReveals.length) {
      gsap.set(imgReveals, { clipPath: 'inset(0 100% 0 0)' });
      imgReveals.forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          once: true,
          onEnter: () =>
            gsap.to(el, {
              clipPath: 'inset(0 0% 0 0)',
              duration: 1.2,
              ease: 'power4.inOut',
            }),
        });
      });
    }
  }

  // ====================================================
  //  7. GOLD LINE ANIMATION
  // ====================================================
  function initGoldLines() {
    const goldLines = gsap.utils.toArray('.gold-line');
    if (!goldLines.length) return;

    gsap.set(goldLines, { scaleX: 0, transformOrigin: 'left center' });

    goldLines.forEach((line) => {
      ScrollTrigger.create({
        trigger: line,
        start: 'top 90%',
        once: true,
        onEnter: () =>
          gsap.to(line, {
            scaleX: 1,
            duration: 1,
            ease: 'power3.inOut',
          }),
      });
    });
  }

  // ====================================================
  //  8. STATS COUNTER ANIMATION
  // ====================================================
  function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat__number[data-count]');
    if (!statNumbers.length) return;

    statNumbers.forEach((el) => {
      const rawValue = el.getAttribute('data-count');
      const target = parseFloat(rawValue) || 0;

      // Read the suffix from data attribute
      const suffix = el.getAttribute('data-suffix') || '';

      // Determine if value is a decimal
      const isDecimal = rawValue.includes('.');
      const obj = { val: 0 };

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            val: target,
            duration: 2,
            ease: 'power1.out',
            snap: { val: isDecimal ? 0.1 : 1 },
            onUpdate: () => {
              const formatted = isDecimal
                ? obj.val.toFixed(1)
                : obj.val.toLocaleString('en-IN');
              el.textContent = formatted + suffix;
            },
          });
        },
      });
    });
  }

  // ====================================================
  //  9. HORIZONTAL SCROLL (Hospitality Section)
  // ====================================================
  function initHorizontalScroll() {
    const section = document.querySelector('.horizontal-section');
    const wrapper = document.querySelector('.horizontal-wrapper');
    if (!section || !wrapper) return;

    const counter = document.querySelector('.horizontal-counter');

    gsap.matchMedia().add('(min-width: 768px)', () => {
      const panels = gsap.utils.toArray('.horizontal-wrapper > *');
      const totalPanels = panels.length || 1;

      const scrollTween = gsap.to(wrapper, {
        x: () => -(wrapper.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          end: () => `+=${wrapper.scrollWidth - window.innerWidth}`,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (counter) {
              const idx = Math.min(
                totalPanels,
                Math.floor(self.progress * totalPanels) + 1
              );
              counter.textContent = `${String(idx).padStart(2, '0')} / ${String(totalPanels).padStart(2, '0')}`;
            }
          },
        },
      });

      return () => {
        // Cleanup when media query no longer matches
        scrollTween.scrollTrigger?.kill();
        scrollTween.kill();
        gsap.set(wrapper, { x: 0 });
      };
    });
  }

  // ====================================================
  //  10. JOURNEY SECTION INTERACTIONS
  // ====================================================
  function initJourneyInteractions() {
    const panels = document.querySelectorAll('.journey__panel');
    if (!panels.length) return;

    panels.forEach((panel) => {
      const bg = panel.querySelector('img');
      const overlay = panel.querySelector('.journey__overlay') || panel.querySelector('::after');
      const contentEls = panel.querySelectorAll('.eyebrow, h2, h3, p, .btn');

      // Set initial states for content elements
      gsap.set(contentEls, { y: 10, opacity: 0.8 });

      panel.addEventListener('mouseenter', () => {
        if (bg) gsap.to(bg, { scale: 1.05, duration: 0.8, ease: 'power2.out' });
        gsap.to(contentEls, {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.05,
        });
      });

      panel.addEventListener('mouseleave', () => {
        if (bg) gsap.to(bg, { scale: 1, duration: 0.8, ease: 'power2.out' });
        gsap.to(contentEls, {
          y: 10,
          opacity: 0.8,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.03,
        });
      });
    });
  }

  // ====================================================
  //  11. TESTIMONIALS CAROUSEL
  // ====================================================
  function initTestimonialsCarousel() {
    const slides = gsap.utils.toArray('.testimonial-card');
    if (!slides.length) return;

    const dots = document.querySelectorAll('.testimonials__dot');
    const prevBtn = document.querySelector('.testimonials__arrow--prev');
    const nextBtn = document.querySelector('.testimonials__arrow--next');

    let current = 0;
    let autoplayTimer = null;

    // Initialise — show first slide, hide rest
    slides.forEach((slide, i) => {
      gsap.set(slide, { opacity: i === 0 ? 1 : 0, display: i === 0 ? 'block' : 'none' });
    });
    updateDots(0);

    function goToSlide(index) {
      if (index === current || !slides[index]) return;

      const outgoing = slides[current];
      const incoming = slides[index];

      gsap.timeline()
        .to(outgoing, {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.in',
          onComplete: () => gsap.set(outgoing, { display: 'none' }),
        })
        .set(incoming, { display: 'block', opacity: 0 })
        .to(incoming, { opacity: 1, duration: 0.5, ease: 'power2.out' });

      current = index;
      updateDots(index);
      resetAutoplay();
    }

    function updateDots(index) {
      dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    }

    function next() {
      goToSlide((current + 1) % slides.length);
    }

    function prev() {
      goToSlide((current - 1 + slides.length) % slides.length);
    }

    function resetAutoplay() {
      clearInterval(autoplayTimer);
      autoplayTimer = setInterval(next, 6000);
    }

    // Wire controls
    if (prevBtn) prevBtn.addEventListener('click', prev);
    if (nextBtn) nextBtn.addEventListener('click', next);
    dots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)));

    // Start autoplay
    resetAutoplay();
  }

  // ====================================================
  //  12. WEDDING GALLERY PARALLAX
  // ====================================================
  function initWeddingParallax() {
    const items = gsap.utils.toArray('.wedding__gallery-item img');
    if (!items.length) return;

    items.forEach((img, i) => {
      // Alternate speeds for depth
      const speed = 30 + (i % 3) * 20; // 30, 50, 70 …

      gsap.to(img, {
        y: speed,
        ease: 'none',
        scrollTrigger: {
          trigger: img.parentElement || img,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      });
    });
  }

  // ====================================================
  //  13. PARALLAX IMAGES
  // ====================================================
  function initParallaxImages() {
    const parallaxEls = gsap.utils.toArray('.parallax-img');
    if (!parallaxEls.length) return;

    parallaxEls.forEach((el) => {
      const speed = parseFloat(el.dataset.speed) || 0.2;
      const distance = 100 * speed;

      gsap.to(el, {
        y: distance,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    });
  }

  // ====================================================
  //  14. STAGGER CHILDREN
  // ====================================================
  function initStaggerChildren() {
    const containers = gsap.utils.toArray('.stagger-children');
    if (!containers.length) return;

    containers.forEach((container) => {
      const children = Array.from(container.children);
      gsap.set(children, { opacity: 0, y: 20 });

      ScrollTrigger.create({
        trigger: container,
        start: 'top 85%',
        once: true,
        onEnter: () =>
          gsap.to(children, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            stagger: 0.1,
          }),
      });
    });
  }

  // ====================================================
  //  15. BOOKING BAR VISIBILITY
  // ====================================================
  function initBookingBarVisibility() {
    const bookingBar = document.querySelector('.booking-bar');
    const hero = document.querySelector('.hero');
    if (!bookingBar || !hero) return;

    ScrollTrigger.create({
      trigger: hero,
      start: 'bottom top',
      onEnter: () => bookingBar.classList.add('visible'),
      onLeaveBack: () => bookingBar.classList.remove('visible'),
    });
  }

  // ====================================================
  //  17. SMOOTH ANCHOR SCROLLING (catch-all)
  // ====================================================
  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      // Skip if already handled by nav links
      if (anchor.closest('.nav') || anchor.closest('.mobile-menu')) return;

      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        lenis.scrollTo(target, { offset: -80 });
      });
    });
  }

  // ====================================================
  //  RESIZE HANDLER — debounced refresh
  // ====================================================
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 250);
  });
});
