/*
 * Horizontal scroll for the beer carousel and partner marquee.
 * On large screens, vertical scrolling moves the beer items horizontally.
 * On small screens, items stack vertically for a mobile‑friendly layout.
 */

(() => {
  const section = document.getElementById('bar-section');
  const carousel = document.getElementById('beer-carousel');
  const items = carousel ? Array.from(carousel.children) : [];
  if (!section || !carousel || !items.length || !window.gsap) return;
  gsap.registerPlugin(ScrollTrigger);

  // Create a horizontal scroll animation only on wide screens
  function setupHorizontal() {
    const totalItems = items.length;
    gsap.to(items, {
      xPercent: -100 * (totalItems - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${carousel.scrollWidth - window.innerWidth}`,
        pin: true,
        scrub: true,
      },
    });
  }

  // Destroy existing ScrollTriggers before re‑initialising
  function cleanup() {
    ScrollTrigger.getAll().forEach((st) => st.kill());
    gsap.set(items, { xPercent: 0 });
  }

  // Responsive setup based on media query
  function init() {
    cleanup();
    const mq = window.matchMedia('(min-width: 1024px)');
    if (mq.matches) {
      setupHorizontal();
    }
  }

  // Initialise and re‑initialise on resize
  init();
  window.addEventListener('resize', init);
})();