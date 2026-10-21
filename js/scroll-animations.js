"use strict";

// One-time reveals need no scroll listener or continuously running animation
// engine. Keep content visible until it enters, including if JavaScript fails.
(() => {
  if (!("IntersectionObserver" in window)) return;
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const pending = new Map();
  const active = new Map();
  let observer;

  function stop(element) {
    active.get(element)?.cancel();
    active.delete(element);
  }

  function reveal(element, animate = true) {
    const kind = pending.get(element);
    if (!kind) return;
    pending.delete(element);
    observer?.unobserve(element);
    if (!animate || motion.matches || !element.animate) return;
    const animation = element.animate([
      { opacity: 0.35, transform: kind === "sticker" ? "scale(0.96)" : "translateY(24px)" },
      { opacity: 1, transform: "none" },
    ], { duration: 450, easing: "cubic-bezier(0.22, 1, 0.36, 1)" });
    active.set(element, animation);
    animation.onfinish = () => { active.delete(element); };
  }

  function start() {
    if (motion.matches) return;
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) reveal(entry.target);
      }
      if (!pending.size) observer.disconnect();
    }, { threshold: 0 });

    document.querySelectorAll(".bento-card:not(.bento-card--hero), .sticker-anchor").forEach(element => {
      // Do not transform the live GPU portrait and its iframe during scrolling.
      if (element.classList.contains("bento-card--profile")) return;
      pending.set(element, element.classList.contains("sticker-anchor") ? "sticker" : "card");
      observer.observe(element);
    });
  }

  // Focused controls remain steady and immediately readable.
  document.addEventListener("focusin", event => {
    const element = event.target.closest(".bento-card, .sticker-anchor");
    if (element) { reveal(element, false); stop(element); }
  });
  motion.addEventListener("change", () => {
    if (!motion.matches) return;
    observer?.disconnect();
    pending.clear();
    for (const element of active.keys()) stop(element);
  });
  if (window.siteReady) window.siteReady.then(start);
  else start();
})();
