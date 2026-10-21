"use strict";

(() => {
  const root = document.documentElement;
  const loader = document.createElement("dialog");
  loader.className = "site-preloader";
  loader.setAttribute("aria-label", "Loading website");
  const image = document.createElement("img");
  image.src = "assets/preloader.svg";
  image.alt = "";
  image.width = 1122;
  image.height = 1122;
  image.fetchPriority = "high";
  loader.append(image);
  document.body.append(loader);
  // Without dialog support, keep the website accessible.
  if (!loader.showModal) { loader.remove(); return; }
  loader.addEventListener("cancel", event => event.preventDefault());
  root.classList.add("is-loading");
  loader.showModal();

  // Load assets in parallel while giving the animation three seconds on screen.
  let minimumTimer;
  const minimumDisplay = new Promise(resolve => {
    minimumTimer = setTimeout(resolve, 3000);
  });
  let resolveReady;
  window.siteReady = new Promise(resolve => { resolveReady = resolve; });
  let finished = false;
  let removed = false;
  function remove() {
    if (removed) return;
    removed = true;
    clearTimeout(minimumTimer);
    loader.close();
    loader.remove();
    root.classList.remove("is-loading");
    resolveReady();
  }
  function finish(immediate = false) {
    if (finished) return;
    finished = true;
    clearTimeout(safetyTimer);
    if (immediate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      remove();
    } else {
      loader.classList.add("is-leaving");
      setTimeout(remove, 240);
    }
  }
  // A stalled image, font or third-party request must not trap the visitor.
  const safetyTimer = setTimeout(() => finish(), 4000);
  const pageLoaded = new Promise(resolve => {
    if (document.readyState !== "loading") resolve();
    else document.addEventListener("DOMContentLoaded", resolve, { once: true });
  });
  pageLoaded.then(async () => {
    // Only visible images and explicitly preloaded hero artwork block entry.
    // Analytics, lazy frames and below-the-fold images can finish independently.
    const images = [...document.images].filter(img => {
      const rect = img.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && rect.bottom > 0 &&
        rect.top < window.innerHeight;
    });
    for (const link of document.querySelectorAll('link[rel="preload"][as="image"]')) {
      const artwork = new Image();
      artwork.src = link.href;
      images.push(artwork);
    }
    await Promise.allSettled([
      minimumDisplay,
      document.fonts?.ready,
      ...images.map(img => img.decode()),
    ]);
    finish();
  });
  // Never restore a blocking loader from the browser's back/forward cache.
  window.addEventListener("pagehide", () => {
    if (finished) remove();
    else finish(true);
  }, { once: true });
})();
