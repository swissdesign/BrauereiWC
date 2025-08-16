/* =========================================
   app.js — Brauerei Andermatt (LLM Build)
   Description: Single‑file JS for rapid AI prototyping.
   ========================================= */

/* ===== SECTION: Imports & Globals (keep minimal) ===== */
"use strict";

// Ensure GSAP and ScrollTrigger are available globally.  They are loaded via
// CDN in index.html.  Register the ScrollTrigger plugin exactly once.  If
// either gsap or ScrollTrigger is not present on the window, the
// registration call safely does nothing.  This prevents duplicate
// registrations that could occur if multiple modules attempted to register.
if (typeof window !== "undefined" && window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

/* ===== SECTION: DOM Query Cache ===== */
// All element references are obtained within their respective init functions.
// Deferring queries until they are needed ensures that the DOM has loaded
// fully and prevents null dereference errors when certain sections are not
// present on the current page.

/* ===== SECTION: Preloader ===== */
/**
 * Initialise the preloader animation.  This function duplicates the
 * preloader logo into the hero logo container, animates the logo parts
 * using GSAP and fades out the page overlay when complete.  It is
 * idempotent and will bail early if the necessary elements do not exist
 * or if GSAP is unavailable.  The timeline also animates the hero text
 * elements from below after the preloader finishes.
 */
function initPreloader() {
  if (typeof window === "undefined" || !window.gsap) return;
  const preloader = document.getElementById("preloader");
  const logo = document.getElementById("andermatt-logo");
  const overlay = document.querySelector(".page-overlay");
  const heroLogoSvg = document.getElementById("andermatt-logo-hero");

  // Clone the contents of the main logo into the hero logo container.  The
  // duplicated IDs inside the SVG are acceptable because they are scoped to
  // their respective <svg> elements and are not manipulated outside this
  // animation.
  if (heroLogoSvg && logo) {
    heroLogoSvg.innerHTML = logo.innerHTML;
  }

  // Exit early if the preloader or logo is missing.
  if (!preloader || !logo) return;

  // Prepare transform origins for the animated groups.  Without this the
  // rotations and translations pivot incorrectly.
  gsap.set(logo, { transformOrigin: "50% 50%" });
  gsap.set(
    [
      "#logo-text-top",
      "#logo-text-bottom",
      "#logo-hops-left",
      "#logo-hops-right",
      "#logo-river",
      "#logo-ring",
    ],
    { transformOrigin: "50% 50%" }
  );

  // Compose a timeline to orchestrate the logo collapse, rotation and return.
  const tl = gsap.timeline();
  // Collapse and fade out pieces of the logo outward and downward.
  tl.to("#logo-text-top", { duration: 1, y: -80, opacity: 0, ease: "power2.out" })
    .to("#logo-text-bottom", { duration: 1, y: 80, opacity: 0, ease: "power2.out" }, "<")
    .to("#logo-hops-left", { duration: 1, x: -60, opacity: 0, ease: "power2.out" }, "<")
    .to("#logo-hops-right", { duration: 1, x: 60, opacity: 0, ease: "power2.out" }, "<")
    .to("#logo-river", { duration: 1, scale: 0.8, opacity: 0.5, ease: "power2.out" }, "<")
    // Rotate the entire logo while pieces are off screen.
    .to(logo, { duration: 2.5, rotation: 360, ease: "power1.inOut" }, "<")
    // Bring pieces back to their original positions and full opacity.
    .to("#logo-text-top", { duration: 1, y: 0, opacity: 1, ease: "power2.in" }, "-=1")
    .to("#logo-text-bottom", { duration: 1, y: 0, opacity: 1, ease: "power2.in" }, "<")
    .to("#logo-hops-left", { duration: 1, x: 0, opacity: 1, ease: "power2.in" }, "<")
    .to("#logo-hops-right", { duration: 1, x: 0, opacity: 1, ease: "power2.in" }, "<")
    .to("#logo-river", { duration: 1, scale: 1, opacity: 1, ease: "power2.in" }, "<")
    // Fade out the preloader container.  When complete, hide the
    // preloader and fade the page overlay from black to transparent.
    .to(preloader, {
      duration: 1,
      opacity: 0,
      delay: 0.5,
      onComplete: () => {
        preloader.style.display = "none";
        if (overlay) {
          gsap.fromTo(
            overlay,
            { opacity: 1 },
            {
              opacity: 0,
              duration: 1.5,
              ease: "power2.inOut",
              onComplete: () => {
                // Prevent overlay from blocking interactions once faded out
                overlay.style.pointerEvents = "none";
              },
            }
          );
        }
      },
    });

  // Animate the hero elements sliding in from below.  Even if the
  // corresponding elements (#hero-tagline, #hero-cta) are not present
  // on the page, GSAP will ignore them without throwing errors.
  tl.from("#hero-headline", { duration: 1, y: 50, opacity: 0, ease: "power3.out" }, "-=0.5")
    .from("#hero-tagline", { duration: 1, y: 50, opacity: 0, ease: "power3.out" }, "-=0.8")
    .from("#hero-cta", { duration: 1, y: 50, opacity: 0, ease: "power3.out" }, "-=0.8");
}

/* ===== SECTION: Hero Scroll & Overlay ===== */
/**
 * Initialise scroll‑scrubbing for the hero video and overlay fades.  The
 * timeline ties the video's currentTime, hero logo opacity, hero text
 * fades and page overlay fade‑to‑black to the user's scroll progress.  It
 * pins the hero section during the scroll.  If any required DOM
 * elements are missing the function safely returns.
 */
function initHeroScroll() {
  if (typeof window === "undefined" || !window.gsap) return;
  const video = document.getElementById("hero-video");
  const overlay = document.querySelector(".page-overlay");
  const heroSection = document.getElementById("hero");
  const heroLogo = document.getElementById("hero-logo");
  const heroTextContainer = document.getElementById("hero-text-container");
  if (!video || !overlay || !heroSection || !heroLogo || !heroTextContainer) return;

  function buildTimeline() {
    const duration = video.duration || 5;
    const tl = gsap.timeline({
     scrollTrigger: {
       trigger: heroSection,
       start: "top top",
       end: `+=${window.innerHeight * 2}`,
       pin: true,
       scrub: true,
       anticipatePin: 1
     },
   });
    // Play the video through its duration as you scroll
    tl.to(
      video,
      {
        currentTime: duration,
        ease: "none",
      },
      0
    );
    // Ensure the logo is visible at the start and fade it out as scroll begins
    gsap.set(heroLogo, { opacity: 1 });
    tl.to(
      heroLogo,
      {
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      },
      0
    );
    // Fade the hero text container in and then out during the scroll
    tl.fromTo(
      heroTextContainer,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1,
        ease: "power2.inOut",
      },
      1
    );
    tl.to(
      heroTextContainer,
      {
        opacity: 0,
        duration: 1,
        ease: "power2.inOut",
      },
      2
    );
   // when fading the overlay to black near the end:
tl.to(overlay, {
  opacity: 1,
  duration: 1,
  ease: "power2.inOut",
  overwrite: "auto",
  onStart: () => { overlay.style.pointerEvents = "none"; },
}, 3);
     ScrollTrigger.refresh();
}
  // Some browsers do not report video.duration until metadata is loaded
if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
  buildTimeline();
} else {
  video.addEventListener('loadedmetadata', () => {
    buildTimeline();
  }, { once: true });
}

/* ===== SECTION: Bar / Beer Carousel & Partner Marquee ===== */
/**
 * Fade out the page overlay as the beer carousel scrolls into view.  The
 * overlay is assumed to be fully opaque (black) when this function runs
 * after the hero scroll completes.  As the carousel enters the viewport
 * the overlay's opacity is reduced to reveal the bar section.  A ScrollTrigger
 * timeline ties the fade to the scroll progress.
 */
function initCarouselFade() {
  if (typeof window === "undefined" || !window.gsap) return;
  const overlay = document.querySelector(".page-overlay");
  const carousel = document.getElementById("beer-carousel");
  if (!overlay || !carousel) return;
  gsap.timeline({
  scrollTrigger: {
    trigger: carousel,
    start: "top bottom",
    end: "top top",
    scrub: true,
  },
}).fromTo(
  overlay,
  { opacity: 1 },
  {
    opacity: 0,
    ease: "none",
    // Important: do NOT set the start state until the trigger actually starts
    immediateRender: false,
    overwrite: "auto",
    onStart: () => {
      overlay.style.pointerEvents = "none";
    },
  }
);
}

/* ===== SECTION: Product Modal ===== */
/**
 * Attach click handlers to beer items to open a modal with product details.
 * The modal content is generated on demand based on static beer data.
 * Clicking outside the modal content or on the close button will hide
 * the modal.  Event listeners are attached once during initialisation.
 */
function initProductModal() {
  const modal = document.getElementById("product-modal");
  const modalBody = document.getElementById("product-modal-body");
  if (!modal || !modalBody) return;

  // Data for each beer; in a future implementation this could come from an API
  const beerData = {
    ipa: {
      name: "IPA",
      abv: "5.6 % ABV",
      tagline: "More hops than a mountain goat.",
      notes:
        "Bright citrus, pine resin and a crisp, bitter finish that echoes off the peaks.",
      pairs: "Spicy food, sharp cheddar and summiting your goals.",
    },
    helles: {
      name: "Helles",
      abv: "5.0 % ABV",
      tagline: "Crisper than the alpine air.",
      notes: "Subtle malt sweetness with a clean, refreshing finish.",
      pairs: "Bratwurst, pretzels and lakeside afternoons.",
    },
    weizen: {
      name: "Weizen",
      abv: "5.0 % ABV",
      tagline: "Cloudy with a chance of genius.",
      notes:
        "Classic notes of banana and clove with a soft, full‑bodied mouthfeel.",
      pairs: "Weisswurst, salads and sunny patios.",
    },
  };

  // When a beer item is clicked, populate and show the modal
  document.querySelectorAll(".beer-item").forEach((item) => {
    item.addEventListener("click", () => {
      const type = item.dataset.beer;
      const data = beerData[type];
      if (!data) return;
      modalBody.innerHTML = `
        <div class="flex flex-col items-center text-center">
          <div class="w-32 h-32 mb-4">
            <img src="./media/images/products/${type}.webp" alt="${data.name}" class="w-full h-full object-contain" />
          </div>
          <h3 class="font-playfair text-3xl mb-2">${data.name}</h3>
          <p class="italic mb-4">${data.tagline}</p>
          <p class="text-sm mb-2"><strong>ABV:</strong> ${data.abv}</p>
          <div class="text-left space-y-2">
            <p><strong>Tasting Notes:</strong> ${data.notes}</p>
            <p><strong>Pairs With:</strong> ${data.pairs}</p>
          </div>
        </div>
      `;
      modal.classList.remove("hidden");
    });
  });
  // Close the modal when clicking the close button or the backdrop
  document.querySelectorAll(".product-modal-close").forEach((btn) => {
    btn.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  });
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });
}

/* ===== SECTION: Diary / Posts ===== */
/**
 * Fetch posts from a local JSON file and render them in the latest posts
 * section or the full blog page.  Posts are sorted newest first.  The
 * function handles fetch failures gracefully by logging an error and
 * rendering nothing.  If neither posts container exists on the page
 * the function simply returns.
 */
function initDiary() {
  const latestContainer = document.getElementById("posts-container");
  const blogContainer = document.getElementById("blog-posts");
  // If neither container is present there is nothing to render
  if (!latestContainer && !blogContainer) return;

  async function fetchPosts() {
    try {
      const res = await fetch("./data/posts.json");
      const posts = await res.json();
      posts.sort((a, b) => new Date(b.date) - new Date(a.date));
      return posts;
    } catch (err) {
      // Silently swallow fetch errors on local file loads to avoid console noise.  When
      // the fetch fails (e.g. when served from file:// without a server) an empty
      // array is returned and no posts are rendered.
      return [];
    }
  }

  function createPostCard(post) {
    const card = document.createElement("article");
    card.className =
      "border rounded-lg overflow-hidden shadow-sm bg-white dark:bg-gray-800";
    card.innerHTML = `
      <div class="h-48 w-full overflow-hidden">
        <img src="${post.image}" alt="${post.name}" class="w-full h-full object-cover" loading="lazy" />
      </div>
      <div class="p-4">
        <h3 class="font-playfair text-xl mb-1">${post.name}</h3>
        <time class="block text-xs text-gray-500 mb-2" datetime="${post.date}">${new Date(
          post.date
        ).toLocaleDateString("de-CH")}</time>
        <p class="text-sm">${post.caption}</p>
      </div>
    `;
    return card;
  }

  fetchPosts().then((posts) => {
    if (latestContainer) {
      posts.slice(0, 3).forEach((post) => {
        latestContainer.appendChild(createPostCard(post));
      });
    }
    if (blogContainer) {
      posts.forEach((post) => {
        blogContainer.appendChild(createPostCard(post));
      });
    }
  });
}

/* ===== SECTION: Contact Form ===== */
/**
 * Handles opening and closing of the contact form modal and a simple
 * submission animation.  A honeypot field prevents spam.  Upon
 * successful submission the form hides and a thank you message is shown.
 */
function initContactForm() {
  const btn = document.getElementById("whisper-btn");
  const modal = document.getElementById("contact-modal");
  const closeBtn = modal ? modal.querySelector(".close-btn") : null;
  const form = document.getElementById("contact-form");
  const successMsg = document.getElementById("form-success");
  if (!btn || !modal || !form) return;
  btn.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  }
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    // Honeypot check – if the hidden field is filled, treat as spam
    if (form.honeypot && form.honeypot.value) return;
    // In a production site, form data would be posted here.  Instead
    // we simply hide the form and show the success message.
    form.classList.add("hidden");
    if (successMsg) {
      successMsg.classList.remove("hidden");
    }
  });
}

/* ===== SECTION: Bootstrap (DOMContentLoaded) ===== */
// Wait for the DOM to be fully parsed before initialising features.  Each
// init function guards against missing elements so no errors are thrown
// on pages where certain sections do not exist.
document.addEventListener("DOMContentLoaded", () => {
  // Initialise preloader animation
  initPreloader();
  // Initialise hero scroll behaviour
  initHeroScroll();
  // Initialise the bar carousel overlay fade
  initCarouselFade();
  // Initialise product modal handlers
  initProductModal();
  // Initialise diary posts rendering
  initDiary();
  // Initialise contact form
  initContactForm();
  // Update any element with id="current-year" to the current year
  const yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
