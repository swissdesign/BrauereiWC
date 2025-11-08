(function () {
  "use strict";

  function getElements() {
    return {
      body: document.body,
      preloader: document.getElementById("preloader"),
      mainContent: document.getElementById("main-content"),
    };
  }

  function revealWithoutAnimation(elements) {
    const { body, preloader, mainContent } = elements;

    if (preloader) {
      preloader.style.opacity = "0";
      preloader.style.visibility = "hidden";
      preloader.style.pointerEvents = "none";
    }

    if (body) {
      body.classList.remove("is-loading");
    }

    if (mainContent) {
      mainContent.classList.remove("opacity-0");
      mainContent.style.opacity = "1";
      mainContent.style.visibility = "visible";
    }
  }

  function animateOut(elements) {
    const { body, preloader, mainContent } = elements;
    const gsapInstance = window.gsap;

    if (!gsapInstance || !preloader || !mainContent) {
      revealWithoutAnimation(elements);
      return;
    }

    const timeline = gsapInstance.timeline({
      defaults: { duration: 0.5, ease: "power2.out" },
      onComplete: () => {
        if (body) {
          body.classList.remove("is-loading");
        }
      },
    });

    timeline
      .to(preloader, {
        autoAlpha: 0,
        onStart: () => {
          preloader.style.pointerEvents = "none";
        },
        onComplete: () => {
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
  }

  window.addEventListener(
    "load",
    () => {
      animateOut(getElements());
    },
    { once: true },
  );
})();
