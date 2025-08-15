/*
 * Scroll-scrubbing for the hero video and fade overlay.
 * Uses GSAP ScrollTrigger to tie video playback to scroll progress.
 */

// Immediately invoked function expression to avoid polluting global scope
(() => {
  const video = document.getElementById('hero-video');
  // Use the global page overlay rather than the hero‑specific overlay so
  // that the black fade can transition between sections.  The
  // `.page-overlay` element is defined in index.html and used by
  // preloader.js and carousel.js as well.  If it doesn't exist the
  // script simply bails out.
  const overlay = document.querySelector('.page-overlay');
  const heroSection = document.getElementById('hero');
  const heroLogo = document.getElementById('hero-logo');
  const heroTextContainer = document.getElementById('hero-text-container');
  if (!video || !overlay || !heroSection || !heroLogo || !heroTextContainer || !window.gsap) return;
  gsap.registerPlugin(ScrollTrigger);

  // Wait for metadata to get correct duration
  function initTimeline() {
    const duration = video.duration || 5;
    /*
      Create a GSAP timeline to manage all animations tied to the scroll.
      The total scroll duration is extended to twice the viewport height
      to give the animations enough room to play out smoothly.
    */
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: `+=${window.innerHeight * 2}`, // Extend scroll duration
        pin: true,
        scrub: true,
      },
    });

    // Animate the video to play through its entire duration
    tl.to(
      video,
      {
        currentTime: duration,
        ease: 'none',
      },
      0
    );

    // 1. Prepare the hero logo to be fully visible at the start of the
    // scroll.  We'll then fade it out as the user begins to scroll.
    gsap.set(heroLogo, { opacity: 1 });
    // Fade the logo out over the first portion of the scroll.  The
    // duration here defines how far into the timeline the fade out
    // occurs relative to the other animations.
    tl.to(
      heroLogo,
      {
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
      },
      0
    );

    // 2. Fade in the hero text roughly halfway through the scroll and
    // then fade it back out before the end.  Splitting the fade into
    // two separate tweens provides more granular control over when
    // each phase occurs.
    tl.fromTo(
      heroTextContainer,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1,
        ease: 'power2.inOut',
      },
      1
    );
    tl.to(
      heroTextContainer,
      {
        opacity: 0,
        duration: 1,
        ease: 'power2.inOut',
      },
      2
    );

    // 3. Fade the page overlay to black near the end of the scroll.
    tl.to(
      overlay,
      {
        opacity: 1,
        duration: 1,
        ease: 'power2.inOut',
      },
      3
    );
  }

  // Some browsers may report duration 0 until playback starts
  if (video.readyState >= 1) {
    initTimeline();
  } else {
    video.addEventListener('loadedmetadata', initTimeline);
  }
})();