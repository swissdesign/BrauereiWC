/*
 * Entry point for the Brauerei Andermatt site.
 * This module imports the other modules to initialise functionality.
 */

import './videoScroll.js';
import './carousel.js';
import './modal.js';
import './diary.js';
import './contactForm.js';
// Import the new preloader animation.  This module sets up a GSAP
// timeline that animates the Andermatt logo and then fades out
// the preloader overlay.  It also animates the hero headline,
// tagline and CTA once the logo finishes.  See preloader.js for
// details.
import './preloader.js';

// Once the DOM is ready, hide the preloader after a short delay and
// update the current year in any designated element.
document.addEventListener('DOMContentLoaded', () => {
  // Update the current year in any element with id="current-year".
  // This runs on DOMContentLoaded so the element exists before
  // assignment.  The preloader animation is now handled in
  // preloader.js and will hide the overlay automatically.
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});