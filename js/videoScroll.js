/*
 * Scroll-scrubbing for the hero video and fade overlay.
 * Uses GSAP ScrollTrigger to tie video playback to scroll progress.
 */

// Immediately invoked function expression to avoid polluting global scope
(() => {
  const video = document.getElementById('hero-video');
  const overlay = document.getElementById('hero-overlay');
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

    // 1. Fade in the logo and keep it visible for the first half of the scroll
    tl.to(
      heroLogo,
      {
        opacity: 1,
        ease: 'power1.inOut',
        yoyo: true, // Fade in and then back out
        repeat: 1, // Ensures it fades in and out once
      },
      0
    );

    // 2. Fade in the text and button during the second half of the scroll
    tl.fromTo(
      heroTextContainer,
      { opacity: 0 },
      {
        opacity: 1,
        ease: 'power1.in',
      },
      '>-0.5' // Start this animation slightly before the logo finishes fading out
    );

    // 3. Fade to black at the end of the scroll
    tl.to(
      overlay,
      {
        opacity: 1,
        ease: 'power1.in',
      },
      '>-0.2' // Overlap with the end of the text fade-in
    );
  }

  // Some browsers may report duration 0 until playback starts
  if (video.readyState >= 1) {
    initTimeline();
  } else {
    video.addEventListener('loadedmetadata', initTimeline);
  }
})();