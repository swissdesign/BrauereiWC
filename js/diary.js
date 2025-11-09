/* =========================================
   diary.js — unified Beer Diary rendering
   Populates index slider, blog grid, and related posts
   ========================================= */

(function () {
  const manifestCache = new Map();

  function normalisePrefix(prefix = ".") {
    if (!prefix || prefix === ".") {
      return ".";
    }
    return prefix.replace(/\/?$/, "");
  }

  function normaliseSlug(slug = "") {
    return slug.replace(/^\.?\/?/, "");
  }

  function buildPostUrl(slug, prefix = ".") {
    const safeSlug = normaliseSlug(slug);
    if (!safeSlug) {
      return "#";
    }
    const safePrefix = normalisePrefix(prefix);
    if (!safePrefix || safePrefix === ".") {
      return `./${safeSlug}`;
    }
    return `${safePrefix}/${safeSlug}`;
  }

  function formatDate(value) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);
  }

  async function fetchPosts(path) {
    if (manifestCache.has(path)) {
      return manifestCache.get(path);
    }

    try {
      const response = await fetch(path, { cache: "no-cache" });
      if (!response.ok) {
        throw new Error(`Failed to load posts manifest: ${response.status}`);
      }
      const data = await response.json();
      const posts = Array.isArray(data)
        ? [...data].sort((a, b) => new Date(b.date) - new Date(a.date))
        : [];
      manifestCache.set(path, posts);
      return posts;
    } catch (error) {
      console.error("diary.js: unable to load posts.json", error);
      const empty = [];
      manifestCache.set(path, empty);
      return empty;
    }
  }

  function createPostCard(post, pathPrefix = ".") {
    const link = document.createElement("a");
    link.className = "post-card group";
    link.href = buildPostUrl(post?.slug, pathPrefix);
    link.setAttribute("role", "listitem");
    link.setAttribute("aria-label", post?.name || "Read entry");

    const imageWrapper = document.createElement("div");
    imageWrapper.className = "post-card__image-wrapper";

    const image = document.createElement("img");
    image.className = "post-card__image";
    image.src = post?.image || "";
    image.alt = post?.imageAlt || "Brauerei Andermatt diary image";
    image.loading = "lazy";
    imageWrapper.appendChild(image);

    const body = document.createElement("div");
    body.className = "post-card__body";

    const date = document.createElement("p");
    date.className = "post-card__date";
    date.textContent = formatDate(post?.date);

    const title = document.createElement("h3");
    title.className = "post-card__title";
    title.textContent = post?.name || "Untitled entry";

    const caption = document.createElement("p");
    caption.className = "post-card__caption";
    caption.textContent = post?.caption || "";

    const cta = document.createElement("span");
    cta.className = "post-card__cta";
    const ctaLabel = document.createElement("span");
    ctaLabel.className = "post-card__cta-label";
    ctaLabel.textContent = "Read entry";
    const arrow = document.createElement("span");
    arrow.className = "post-card__cta-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "→";
    cta.append(ctaLabel, arrow);

    body.append(date, title);
    if (caption.textContent.trim().length > 0) {
      body.appendChild(caption);
    }
    body.appendChild(cta);

    link.append(imageWrapper, body);
    return link;
  }

  function setupScroller(containerId, leftId, rightId) {
    const container = document.getElementById(containerId);
    if (!container || container.dataset.scrollerInitialised === "true") {
      return;
    }

    const left = leftId ? document.getElementById(leftId) : null;
    const right = rightId ? document.getElementById(rightId) : null;

    if (!left && !right) {
      return;
    }

    const scrollDistance = () => {
      const firstCard = container.querySelector(".post-card");
      if (!firstCard) {
        return Math.max(container.clientWidth * 0.9, 320);
      }
      const style = window.getComputedStyle(container);
      const gap = parseFloat(style.columnGap || style.gap || "0");
      return firstCard.offsetWidth + gap;
    };

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
        container.scrollBy({ left: -scrollDistance(), behavior: "smooth" });
      });
    }

    if (right) {
      right.addEventListener("click", () => {
        container.scrollBy({ left: scrollDistance(), behavior: "smooth" });
      });
    }

    container.addEventListener("scroll", updateDisabled, { passive: true });
    window.addEventListener("resize", updateDisabled);
    requestAnimationFrame(updateDisabled);

    container.dataset.scrollerInitialised = "true";
  }

  function renderPosts(container, posts, pathPrefix = ".") {
    if (!container || !Array.isArray(posts) || !posts.length) {
      return;
    }

    container.innerHTML = "";
    if (!container.hasAttribute("role")) {
      container.setAttribute("role", "list");
    }
    container.setAttribute("aria-live", "polite");

    posts.forEach((post) => {
      const card = createPostCard(post, pathPrefix);
      container.appendChild(card);
    });
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const indexContainer = document.getElementById("posts-container");
    const blogGrid = document.getElementById("blog-posts");
    const relatedContainer = document.getElementById("related-posts-container");

    if (!indexContainer && !blogGrid && !relatedContainer) {
      return;
    }

    if (indexContainer) {
      const posts = await fetchPosts("./data/posts.json");
      renderPosts(indexContainer, posts, ".");
      setupScroller("posts-container", "posts-scroll-left", "posts-scroll-right");
    }

    if (blogGrid) {
      const posts = await fetchPosts("./data/posts.json");
      renderPosts(blogGrid, posts, ".");
    }

    if (relatedContainer) {
      const posts = await fetchPosts("../data/posts.json");
      const currentSlug = window.location.pathname.split("/").pop();
      const relatedPosts = posts.filter((post) => {
        const slugFile = normaliseSlug(post.slug || "").split("/").pop();
        return slugFile && slugFile !== currentSlug;
      });
      renderPosts(relatedContainer, relatedPosts, "..");
      setupScroller(
        "related-posts-container",
        "related-posts-scroll-left",
        "related-posts-scroll-right"
      );
    }
  });
})();
