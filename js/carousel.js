gsap.registerPlugin(ScrollTrigger);

// Fade out overlay when beer carousel scrolls into view
const overlay = document.querySelector('.page-overlay');
if (overlay) {
  // Initially set the overlay to be transparent
  gsap.set(overlay, { opacity: 0 });

  // Fade in the overlay
  gsap.to(overlay, {
    opacity: 1,
    duration: 1, // Adjust the duration as you like
    ease: 'power2.inOut'
  });

  gsap.timeline({
    scrollTrigger: {
      trigger: '#beer-carousel',
      start: 'top center',
      end: 'bottom center',
      scrub: true,
    }
  }).to(overlay, { opacity: 0, ease: 'none' });
}