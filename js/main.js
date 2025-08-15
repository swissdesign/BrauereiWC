/*
 * Entry point for the Brauerei Andermatt site.
 * This module imports the other modules to initialise functionality.
 */

import './videoScroll.js';
import './carousel.js';
import './modal.js';
import './diary.js';
import './contactForm.js';

// Once the DOM is ready, hide the preloader after a short delay and
// update the current year in any designated element.
document.addEventListener('DOMContentLoaded', () => {
  const preloader = document.getElementById('preloader');
  // Delay removal to allow time for GSAP preloader animation if used
  setTimeout(() => {
    if (preloader) preloader.classList.add('hidden');
  }, 1000);
  // Example: update year if #current-year exists
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});