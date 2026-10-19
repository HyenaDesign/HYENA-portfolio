"use strict";

// Keep the floating menu available on upward scroll and keyboard focus.
(() => {
  const navigation = document.querySelector(".navbar");
  if (!navigation) return;

  let previousY = Math.max(0, window.scrollY);
  let direction = 0;
  let distance = 0;

  window.addEventListener("scroll", () => {
    const currentY = Math.max(0, window.scrollY);
    const delta = currentY - previousY;
    previousY = currentY;

    if (currentY < 120) {
      navigation.classList.remove("is-scroll-hidden");
      distance = 0;
      return;
    }
    if (!delta) return;
    const nextDirection = Math.sign(delta);
    distance = nextDirection === direction ? distance + Math.abs(delta) : Math.abs(delta);
    direction = nextDirection;
    if (distance < 12) return;

    navigation.classList.toggle("is-scroll-hidden", direction > 0);
    distance = 0;
  }, { passive: true });

  navigation.addEventListener("focusin", () => {
    navigation.classList.remove("is-scroll-hidden");
  });
})();
