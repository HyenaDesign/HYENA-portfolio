"use strict";

(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const status = document.createElement("span");
  status.className = "sticker-status";
  status.setAttribute("role", "status");
  document.body.append(status);
  const pending = new Set();

  document.querySelectorAll(".foil-sticker[data-sticker-name]").forEach((button) => {
    const anchor = button.closest(".sticker-anchor");
    button.addEventListener("click", () => {
      if (button.disabled) return;
      const moveFocus = document.activeElement === button;
      button.disabled = true;
      anchor.classList.add("is-scraping");
      let finished = false;
      let fallback = 0;

      function finish() {
        if (finished) return;
        finished = true;
        clearTimeout(fallback);
        pending.delete(finish);
        button.removeEventListener("animationend", onEnd);
        anchor.classList.remove("is-scraping");
        anchor.classList.add("is-scraped");
        button.setAttribute("aria-hidden", "true");
        status.textContent = `${button.dataset.stickerName} sticker scraped off.`;
      }

      function onEnd(event) {
        if (event.target === button && event.animationName === "sticker-scrape") finish();
      }

      // Move keyboard focus to the nearby card, not to an invisible button.
      if (moveFocus) document.querySelector(anchor.dataset.focusTarget)?.focus({ preventScroll: true });
      if (reducedMotion.matches) {
        finish();
      } else {
        pending.add(finish);
        button.addEventListener("animationend", onEnd);
        fallback = setTimeout(finish, 1000);
      }
    });
  });

  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) pending.forEach((finish) => finish());
  });
})();
