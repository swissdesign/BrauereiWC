gsap.registerPlugin(ScrollTrigger);

// Fade out the page overlay as the beer carousel scrolls into view.
// The overlay will already be at full opacity (black) after the hero
// sequence completes.  When the bar section enters the viewport, this
// timeline gradually reduces the overlay opacity to reveal the bar.
const overlay = document.querySelector('.page-overlay');
if (overlay) {
  gsap.timeline({
    scrollTrigger: {
      trigger: '#beer-carousel',
      start: 'top bottom', // begin fading just before the carousel enters
      end: 'top top',     // finish fading when the top of the carousel reaches the top
      scrub: true,
    },
  }).fromTo(
    overlay,
    { opacity: 1 },
    { opacity: 0, ease: 'none' }
  );
}