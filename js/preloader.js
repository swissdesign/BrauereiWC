/*
 * Preloader animation for the Brauerei Andermatt site.
 *
 * This script animates the complex Andermatt logo (imported from
 * onepager_index.html) using GSAP. The animation sequence fades
 * out various parts of the logo, spins the ring and then brings
 * the pieces back together before fading out the preloader overlay.
 * Immediately after the preloader disappears, the hero headline,
 * tagline and CTA fade in from below. Because this module is
 * imported as a side effect in main.js, it executes once the
 * module is evaluated. All animations are initiated on
 * DOMContentLoaded to ensure the necessary elements exist.
 */

(() => {
  // Only execute if GSAP is available in the global scope.
  if (typeof window === 'undefined' || !window.gsap) return;

  document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    const logo = document.getElementById('andermatt-logo');
    const overlay = document.querySelector('.page-overlay'); // Get the overlay element
    // Copy the markup of the preloader logo into the hero logo.  The
    // hero logo SVG is empty in the markup (index.html) so this
    // dynamically duplicates the complex logo graphics without
    // repeating the entire <svg> code.  Because IDs within the SVG are
    // scoped to the document, there will be duplicate IDs, but they
    // are not referenced outside of their immediate context so this
    // should not conflict with any animations.
    const heroLogoSvg = document.getElementById('andermatt-logo-hero');
    if (heroLogoSvg && logo) {
      heroLogoSvg.innerHTML = logo.innerHTML;
    }

    // Bail early if the preloader or logo does not exist on this page.
    if (!preloader || !logo) return;
    // Register ScrollTrigger in case videoScroll.js needs it later. If
    // ScrollTrigger is already registered this call is a no‑op.
    if (window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }
    // Prepare the transform origins for all animated groups within the logo.
    gsap.set(logo, { transformOrigin: '50% 50%' });
    gsap.set(
      [
        '#logo-text-top',
        '#logo-text-bottom',
        '#logo-hops-left',
        '#logo-hops-right',
        '#logo-river',
        '#logo-ring',
      ],
      { transformOrigin: '50% 50%' }
    );

    // Create a timeline to coordinate logo parts and hero elements.
    const tl = gsap.timeline();
    // Collapse and fade out pieces of the logo outwards and downwards.
    tl.to('#logo-text-top', { duration: 1, y: -80, opacity: 0, ease: 'power2.out' })
      .to('#logo-text-bottom', { duration: 1, y: 80, opacity: 0, ease: 'power2.out' }, '<')
      .to('#logo-hops-left', { duration: 1, x: -60, opacity: 0, ease: 'power2.out' }, '<')
      .to('#logo-hops-right', { duration: 1, x: 60, opacity: 0, ease: 'power2.out' }, '<')
      .to('#logo-river', { duration: 1, scale: 0.8, opacity: 0.5, ease: 'power2.out' }, '<')
      // Rotate the entire logo while pieces are off screen.
      .to(logo, { duration: 2.5, rotation: 360, ease: 'power1.inOut' }, '<')
      // Bring pieces back to their original positions and opacity.
      .to('#logo-text-top', { duration: 1, y: 0, opacity: 1, ease: 'power2.in' }, '-=1')
      .to('#logo-text-bottom', { duration: 1, y: 0, opacity: 1, ease: 'power2.in' }, '<')
      .to('#logo-hops-left', { duration: 1, x: 0, opacity: 1, ease: 'power2.in' }, '<')
      .to('#logo-hops-right', { duration: 1, x: 0, opacity: 1, ease: 'power2.in' }, '<')
      .to('#logo-river', { duration: 1, scale: 1, opacity: 1, ease: 'power2.in' }, '<')
      // Fade out the entire preloader container.
      .to(preloader, {
        duration: 1,
        opacity: 0,
        delay: 0.5,
        onComplete: () => {
          preloader.style.display = 'none';

          // START: Add the overlay animation here
          if (overlay) {
            // This fades the page in from black
            gsap.fromTo(
              overlay,
              { opacity: 1 },
              {
                opacity: 0,
                duration: 1.5,
                ease: 'power2.inOut',
                // Make sure the overlay can't be interacted with after
                onComplete: () => {
                  overlay.style.pointerEvents = 'none';
                },
              }
            );
          }
          // END: Add the overlay animation here
        },
      });

    // After the preloader elements have started fading back in, animate
    // the hero elements to slide up and fade in. Using negative
    // offsets ties these animations to overlap with the tail of the
    // preloader timeline.
    tl.from('#hero-headline', { duration: 1, y: 50, opacity: 0, ease: 'power3.out' }, '-=0.5')
      .from('#hero-tagline', { duration: 1, y: 50, opacity: 0, ease: 'power3.out' }, '-=0.8')
      .from('#hero-cta', { duration: 1, y: 50, opacity: 0, ease: 'power3.out' }, '-=0.8');
  });
})();