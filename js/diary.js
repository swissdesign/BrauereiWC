/* =========================================
   diary.js — dynamic journal rendering
   Mirrors DTA journal behaviour for BrauereiWC
   ========================================= */

(function () {
  const manifestCache = { data: null };

  const PAGE_TYPES = {
    INDEX: "index",
    GRID: "grid",
    POST: "post",
  };

  function detectPageType() {
    if (document.getElementById("blog-posts")) {
      return PAGE_TYPES.GRID;
    }
    if (document.getElementById("journal-scroll-container")) {
      return PAGE_TYPES.POST;
    }
    if (document.getElementById("posts-container")) {
      return PAGE_TYPES.INDEX;
    }
    return null;
  }

  function manifestPathFor(pageType) {
    switch (pageType) {
      case PAGE_TYPES.POST:
        return "../data/posts.json";
      default:
        return "./data/posts.json";
    }
  }

  async function getManifest(pageType) {
    if (manifestCache.data) {
      return manifestCache.data;
    }
    const path = manifestPathFor(pageType);
    try {
      const response = await fetch(path, { cache: "no-cache" });
      if (!response.ok) {
        throw new Error(`Failed to fetch manifest (${response.status})`);
      }
      const data = await response.json();
      manifestCache.data = Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("diary.js: unable to load posts.json", error);
      manifestCache.data = [];
    }
    return manifestCache.data;
  }

  function entryHref(slug, pageType) {
    if (!slug) return "#";
    if (pageType === PAGE_TYPES.POST) {
      const parts = slug.split("/");
      return `./${parts[parts.length - 1]}`;
    }
    return `./${slug}`;
  }

  function entryImageSrc(imagePath, pageType) {
    if (!imagePath) return "";
    if (/^https?:/i.test(imagePath)) {
      return imagePath;
    }
    if (pageType === PAGE_TYPES.POST) {
      return `../${imagePath}`;
    }
    return `./${imagePath}`;
  }

  function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  function createScrollerCard(entry, pageType) {
    const article = document.createElement("article");
    article.className =
      "journal-card group relative flex h-full w-full flex-col overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:ring-amber-300/60";
    article.setAttribute("role", "listitem");

    const link = document.createElement("a");
    link.href = entryHref(entry.slug, pageType);
    link.className = "absolute inset-0 z-10";
    link.setAttribute("aria-label", entry.name || "Read entry");

    const imageWrapper = document.createElement("div");
    imageWrapper.className = "aspect-[4/3] overflow-hidden";

    const img = document.createElement("img");
    img.src = entryImageSrc(entry.image, pageType);
    img.alt = entry.imageAlt || "";
    img.loading = "lazy";
    img.className =
      "h-full w-full object-cover transition duration-500 group-hover:scale-105";
    imageWrapper.appendChild(img);

    const body = document.createElement("div");
    body.className = "flex flex-col gap-3 px-6 py-5";

    const date = document.createElement("p");
    date.className = "text-xs uppercase tracking-[0.3em] text-amber-300/80";
    date.textContent = formatDate(entry.date);

    const title = document.createElement("h3");
    title.className = "text-lg font-semibold text-white group-hover:text-amber-200";
    title.textContent = entry.name || "Untitled";

    const caption = document.createElement("p");
    caption.className = "text-sm text-white/70";
    caption.textContent = entry.caption || "";

    body.append(date, title, caption);
    article.append(link, imageWrapper, body);
    return article;
  }

  function createGridCard(entry, pageType) {
    const article = document.createElement("article");
    article.className =
      "journal-grid-card group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-black/10 transition duration-300 hover:-translate-y-1 hover:shadow-2xl dark:bg-white/5 dark:ring-white/10";
    article.setAttribute("role", "listitem");

    const link = document.createElement("a");
    link.href = entryHref(entry.slug, pageType);
    link.className = "absolute inset-0 z-10";
    link.setAttribute("aria-label", entry.name || "Read entry");

    const imageWrapper = document.createElement("div");
    imageWrapper.className = "aspect-[4/3] overflow-hidden";

    const img = document.createElement("img");
    img.src = entryImageSrc(entry.image, pageType);
    img.alt = entry.imageAlt || "";
    img.loading = "lazy";
    img.className =
      "h-full w-full object-cover transition duration-500 group-hover:scale-105";
    imageWrapper.appendChild(img);

    const body = document.createElement("div");
    body.className = "flex flex-1 flex-col gap-3 px-6 py-6";

    const date = document.createElement("p");
    date.className = "text-xs uppercase tracking-[0.3em] text-amber-600/80 dark:text-amber-300/80";
    date.textContent = formatDate(entry.date);

    const title = document.createElement("h3");
    title.className = "text-xl font-semibold text-gray-900 transition group-hover:text-evergreen dark:text-white";
    title.textContent = entry.name || "Untitled";

    const caption = document.createElement("p");
    caption.className = "text-sm text-gray-600 dark:text-white/70";
    caption.textContent = entry.caption || "";

    const cta = document.createElement("span");
    cta.className = "mt-auto inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-evergreen transition group-hover:text-evergreen-dark dark:text-amber-300 dark:group-hover:text-amber-200";
    cta.textContent = "Read entry";

    body.append(date, title, caption, cta);
    article.append(link, imageWrapper, body);
    return article;
  }

  function attachScrollButtons(container, options = {}) {
    if (!container) return;
    const left = options.leftId ? document.getElementById(options.leftId) : null;
    const right = options.rightId ? document.getElementById(options.rightId) : null;
    if (!left && !right) return;

    if (container.dataset.navBound === "true") {
      return;
    }
    container.dataset.navBound = "true";

    const scrollAmount = () => Math.max(container.clientWidth * 0.9, 320);

    const updateDisabled = () => {
      if (left) {
        left.disabled = container.scrollLeft <= 0;
      }
      if (right) {
        const maxScroll = container.scrollWidth - container.clientWidth - 1;
        right.disabled = container.scrollLeft >= maxScroll;
      }
    };

    if (left) {
      left.addEventListener("click", () => {
        container.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
      });
    }
    if (right) {
      right.addEventListener("click", () => {
        container.scrollBy({ left: scrollAmount(), behavior: "smooth" });
      });
    }

    container.addEventListener("scroll", updateDisabled, { passive: true });
    window.addEventListener("resize", updateDisabled);
    requestAnimationFrame(updateDisabled);
  }

  async function loadJournalScroller(containerId, pageType, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const manifest = await getManifest(pageType);
    if (!manifest.length) return;

    const sorted = [...manifest]
      .filter((entry) => entry && entry.slug)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    const filtered = options.excludeSlug
      ? sorted.filter((entry) => entry.slug !== options.excludeSlug)
      : sorted;

    const limit = options.limit ? Math.max(0, options.limit) : filtered.length;
    const entries = filtered.slice(0, limit);

    container.innerHTML = "";
    container.setAttribute("role", "list");
    container.setAttribute("aria-live", "polite");

    entries.forEach((entry) => {
      const card = createScrollerCard(entry, pageType);
      container.appendChild(card);
    });

    if (options.scrollNav) {
      attachScrollButtons(container, options.scrollNav);
    }
  }

  async function loadJournalGrid(containerId, pageType) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const manifest = await getManifest(pageType);
    if (!manifest.length) return;

    const sorted = [...manifest]
      .filter((entry) => entry && entry.slug)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    container.innerHTML = "";
    container.setAttribute("role", "list");
    container.setAttribute("aria-live", "polite");

    sorted.forEach((entry) => {
      const card = createGridCard(entry, pageType);
      container.appendChild(card);
    });
  }

  function initialise() {
    const pageType = detectPageType();
    if (!pageType) return;

    if (pageType === PAGE_TYPES.INDEX) {
      loadJournalScroller("posts-container", pageType, {
        limit: 6,
        scrollNav: {
          leftId: "posts-scroll-left",
          rightId: "posts-scroll-right",
        },
      });
      return;
    }

    if (pageType === PAGE_TYPES.GRID) {
      loadJournalGrid("blog-posts", pageType);
      return;
    }

    if (pageType === PAGE_TYPES.POST) {
      const path = window.location.pathname;
      const fileName = path.split("/").filter(Boolean).pop() || "";
      const currentSlug = `blog/${fileName}`;
      loadJournalScroller("journal-scroll-container", pageType, {
        excludeSlug: currentSlug,
        scrollNav: {
          leftId: "journal-scroll-left",
          rightId: "journal-scroll-right",
        },
      });
      return;
    }
  }

  document.addEventListener("DOMContentLoaded", initialise);
})();
