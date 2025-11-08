/**
 * index.js — Landing page behaviour for Brauerei Andermatt.
 * Orchestrates the preloader, smooth scrolling navigation,
 * and GSAP-driven scroll animations.
 */

(function () {
  const gsapInstance = window.gsap;

  function logMissingGsap() {
    console.error("GSAP failed to load. Animations will be skipped.");
  }

  function registerPlugins() {
    if (!gsapInstance) {
      logMissingGsap();
      return false;
    }

    if (window.ScrollTrigger) {
      gsapInstance.registerPlugin(window.ScrollTrigger);
    } else {
      console.warn("ScrollTrigger is unavailable; scroll effects disabled.");
    }

    if (window.ScrollToPlugin) {
      gsapInstance.registerPlugin(window.ScrollToPlugin);
    } else {
      console.warn(
        "ScrollToPlugin is unavailable; smooth navigation disabled.",
      );
    }

    return true;
  }

  function queryElements() {
    return {
      body: document.body,
      preloader: document.getElementById("preloader"),
      preloaderLogo: document.getElementById("andermatt-logo-preloader"),
      mainContent: document.getElementById("main-content"),
      sideNav: document.getElementById("side-nav"),
      heroSection: document.getElementById("hero-section"),
      heroImage: document.getElementById("hero-image"),
      beerCarousel: document.getElementById("beer-carousel"),
      barSection: document.getElementById("bar-section"),
      brewerySection: document.getElementById("brewery-section"),
    };
  }

  function updateViewportUnit() {
    document.documentElement.style.setProperty(
      "--vh",
      `${window.innerHeight * 0.01}px`,
    );
  }

  function bindViewportUpdates() {
    updateViewportUnit();
    window.addEventListener("resize", updateViewportUnit);
  }

  function createPreloaderTimeline(logo) {
    if (!gsapInstance || !logo) {
      return null;
    }

    const timeline = gsapInstance.timeline({
      defaults: { ease: "power2.out", duration: 1 },
    });

    gsapInstance.set(logo, { transformOrigin: "50% 50%" });
    gsapInstance.set(logo.querySelectorAll("g"), {
      transformOrigin: "50% 50%",
    });

    timeline
      .to(logo.querySelector("#logo-text-top"), { y: -80, opacity: 0 })
      .to(logo.querySelector("#logo-text-bottom"), { y: 80, opacity: 0 }, "<")
      .to(logo.querySelector("#logo-hops-left"), { x: -60, opacity: 0 }, "<")
      .to(logo.querySelector("#logo-hops-right"), { x: 60, opacity: 0 }, "<")
      .to(logo.querySelector("#logo-river"), { scale: 0.8, opacity: 0.5 }, "<")
      .to(logo.querySelector("#logo-ring"), { scale: 1.1, duration: 1.2 }, "<")
      .to(logo, { scale: 0.4, duration: 1.2, ease: "power2.inOut" }, "<");

    return timeline;
  }

  function revealContent(elements) {
    const { body, mainContent } = elements;

    if (body) {
      body.classList.remove("is-loading");
    }

    if (mainContent) {
      mainContent.classList.remove("opacity-0");
      mainContent.style.opacity = "1";
      mainContent.style.visibility = "visible";
    }
  }

  function playPreloaderExit(elements) {
    const { preloader, mainContent, body } = elements;

    return new Promise((resolve) => {
      const complete = () => {
        revealContent(elements);
        resolve();
      };

      if (!preloader || !mainContent || !gsapInstance) {
        if (preloader) {
          preloader.classList.add("preloader--hidden");
          preloader.style.opacity = "0";
          preloader.style.visibility = "hidden";
          preloader.style.pointerEvents = "none";
        }

        complete();
        return;
      }

      const timeline = gsapInstance.timeline({
        defaults: { duration: 0.5, ease: "power2.out" },
        onComplete: complete,
      });

      timeline
        .set(mainContent, { autoAlpha: 0 })
        .to(preloader, {
          autoAlpha: 0,
          onStart: () => {
            preloader.style.pointerEvents = "none";
          },
          onComplete: () => {
            preloader.classList.add("preloader--hidden");
            if (body) {
              body.classList.remove("is-loading");
            }
          },
        })
        .to(
          mainContent,
          {
            autoAlpha: 1,
            clearProps: "opacity,visibility",
            onStart: () => {
              mainContent.classList.remove("opacity-0");
            },
          },
          "<",
        );
    });
  }

  function bindSideNavigation(elements) {
    if (!gsapInstance || !window.ScrollToPlugin) {
      return;
    }

    const { sideNav } = elements;
    if (!sideNav) {
      return;
    }

    sideNav.addEventListener("click", (event) => {
      const link = event.target.closest("a");
      if (!link || !link.hash) {
        return;
      }

      const target = document.querySelector(link.hash);
      if (!target) {
        return;
      }

      event.preventDefault();
      gsapInstance.to(window, {
        duration: 1.5,
        ease: "power2.inOut",
        scrollTo: { y: target, offsetY: 1 },
      });
    });
  }

  function initHeroAnimation(elements) {
    const { heroSection, heroImage } = elements;
    const ScrollTrigger = window.ScrollTrigger;

    if (!gsapInstance || !ScrollTrigger || !heroSection) {
      return;
    }

    gsapInstance
      .timeline({
        scrollTrigger: {
          trigger: heroSection,
          pin: true,
          start: "top top",
          end: "+=100%",
          scrub: 1,
        },
      })
      .to("#logo-container", { opacity: 0, ease: "power1.inOut" }, 0.3)
      .to("#welcome-text", { opacity: 1, ease: "power1.inOut" }, 0.5)
      .to(
        ["#welcome-text", "#welcome-overlay", "#hero-image"],
        { opacity: 0, ease: "power1.inOut" },
        0.8,
      );

    if (heroImage) {
      gsapInstance.to(heroImage, {
        scale: 1.2,
        ease: "none",
        scrollTrigger: {
          trigger: heroSection,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }
  }

  function initBarAnimation(elements) {
    const { barSection, beerCarousel } = elements;
    const ScrollTrigger = window.ScrollTrigger;

    if (!gsapInstance || !ScrollTrigger || !barSection || !beerCarousel) {
      return;
    }

    const distance = () =>
      Math.max(0, beerCarousel.scrollWidth - window.innerWidth);

    gsapInstance.to(beerCarousel, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: barSection,
        start: "top top",
        end: () => `+=${distance()}`,
        scrub: 1,
        pin: true,
        invalidateOnRefresh: true,
      },
    });
  }

  function initBreweryAnimation(elements) {
    const { brewerySection } = elements;
    const ScrollTrigger = window.ScrollTrigger;

    if (!gsapInstance || !ScrollTrigger || !brewerySection) {
      return;
    }

    gsapInstance.from("#brewery-section .max-w-4xl > *", {
      scrollTrigger: {
        trigger: brewerySection,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 50,
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.2,
    });
  }

  function initScrollAnimations(elements) {
    initHeroAnimation(elements);
    initBarAnimation(elements);
    initBreweryAnimation(elements);

    if (window.ScrollTrigger) {
      window.ScrollTrigger.refresh();
      if (!initScrollAnimations.resizeBound) {
        window.addEventListener("resize", () => window.ScrollTrigger.refresh());
        initScrollAnimations.resizeBound = true;
      }
    }
  }

  function startSite() {
    const elements = queryElements();

    if (gsapInstance && typeof gsapInstance.normalizeScroll === "function") {
      gsapInstance.normalizeScroll(true);
    }

    if (!registerPlugins()) {
      revealContent(elements);
      if (elements.preloader) {
        elements.preloader.classList.add("preloader--hidden");
        elements.preloader.style.opacity = "0";
        elements.preloader.style.visibility = "hidden";
        elements.preloader.style.pointerEvents = "none";
      }
      return;
    }

    if (
      window.ScrollTrigger &&
      typeof window.ScrollTrigger.normalizeScroll === "function"
    ) {
      window.ScrollTrigger.normalizeScroll(true);
    }

    bindViewportUpdates();
    bindSideNavigation(elements);

    if (elements.preloaderLogo) {
      createPreloaderTimeline(elements.preloaderLogo);
    }

    const finalize = () => {
      playPreloaderExit(elements).then(() => {
        initScrollAnimations(elements);
      });
    };

    if (document.readyState === "complete") {
      finalize();
    } else {
      window.addEventListener("load", finalize, { once: true });
    }
  }

  document.addEventListener("DOMContentLoaded", startSite);
})();
