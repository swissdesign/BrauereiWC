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
    /*
      Tie the hero video playback and fade to scroll.  The hero section is pinned in place
      while the user scrolls through a length greater than a single viewport.  During the
      first portion of the scroll the video scrubs from beginning to end; during the final
      portion the overlay fades from transparent to black.  This gives the impression that
      the clip completes before the transition to the bar section begins.

      We allocate 80% of the scroll distance to scrubbing the video and the last 20% to
      fading to black.  Adjust `scrubPortion` below to fine‑tune the ratio.
    */
    const scrubPortion = 0.8;
    ScrollTrigger.create({
      trigger: heroSection,
      start: 'top top',
      // Extend the end point to add extra scroll length for the fade.  Using a multiple
      // of the viewport height ensures consistent behaviour on different screen sizes.
      end: () => '+=' + window.innerHeight * 1.25,
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        const totalProgress = self.progress;
        // Compute video progress relative to the scrubbing portion
        const videoProgress = Math.min(totalProgress / scrubPortion, 1);
        video.currentTime = duration * videoProgress;
        // Fade the overlay only during the final part of the scroll
        let opacity = 0;
        if (totalProgress > scrubPortion) {
          const fadeProgress = (totalProgress - scrubPortion) / (1 - scrubPortion);
          opacity = Math.min(fadeProgress, 1);
        }
        overlay.style.opacity = opacity;
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