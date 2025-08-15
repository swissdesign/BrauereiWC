/*
 * Scroll‑scrubbing for the hero video and fade overlay.
 * Uses GSAP ScrollTrigger to tie video playback to scroll progress.
 */

// Immediately invoked function expression to avoid polluting global scope
(() => {
  const video = document.getElementById('hero-video');
  const overlay = document.getElementById('hero-overlay');
  const heroSection = document.getElementById('hero');
  if (!video || !overlay || !heroSection || !window.gsap) return;
  gsap.registerPlugin(ScrollTrigger);

  // Wait for metadata to get correct duration
  function initTimeline() {
    const duration = video.duration || 5;
    ScrollTrigger.create({
      trigger: heroSection,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        // Map scroll progress to video time
        video.currentTime = duration * progress;
        // Fade overlay in as we scroll down
        overlay.style.opacity = progress;
      },
    });
  }

  // Some browsers may report duration 0 until playback starts
  if (video.readyState >= 1) {
    initTimeline();
  } else {
    video.addEventListener('loadedmetadata', initTimeline);
  }
})();