/*
 * Handles opening and closing of the contact form and a simple submission
 * animation.  Replace the form submission logic with your preferred
 * endpoint (e.g. Formspree, Netlify forms or a serverless function).
 */

(() => {
  const btn = document.getElementById('whisper-btn');
  const modal = document.getElementById('contact-modal');
  const closeBtn = modal ? modal.querySelector('.close-btn') : null;
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');
  if (!btn || !modal || !form) return;
  btn.addEventListener('click', () => {
    modal.classList.remove('hidden');
  });
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  }
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Honeypot check
    if (form.honeypot && form.honeypot.value) return;
    // TODO: send data to endpoint.  For now just show success.
    form.classList.add('hidden');
    if (successMsg) {
      successMsg.classList.remove('hidden');
    }
  });
})();