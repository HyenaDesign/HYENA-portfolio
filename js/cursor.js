"use strict";

// Also loaded inside the isolated profile frame so the cursor works there.
(() => {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const cursor = document.createElement("div");
  cursor.className = "inverting-cursor";
  cursor.hidden = true;
  cursor.setAttribute("aria-hidden", "true");
  document.body.append(cursor);

  const clickableSelector = 'a[href], button, input[type="button"], input[type="submit"], input[type="reset"], input[type="checkbox"], input[type="radio"], select, summary, [role="button"], [role="link"]';

  function updateCursorSize(target) {
    const control = target.closest(clickableSelector);
    const clickable = control && !control.matches(':disabled, [aria-disabled="true"]');
    cursor.classList.toggle("is-clickable", Boolean(clickable));
  }

  function hideCursor() {
    cursor.hidden = true;
    document.documentElement.classList.remove("has-inverting-cursor");
  }

  document.addEventListener("pointermove", (event) => {
    if (!finePointer.matches || event.pointerType === "touch" ||
        event.target.closest(".has-service-cursor, iframe")) {
      hideCursor();
      return;
    }

    cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
    updateCursorSize(event.target);
    cursor.hidden = false;
    document.documentElement.classList.add("has-inverting-cursor");
  }, { passive: true });

  document.addEventListener("pointerover", (event) => {
    if (finePointer.matches && event.pointerType !== "touch") updateCursorSize(event.target);
  }, { passive: true });

  // Pointer events in an iframe belong to its own document.
  document.querySelectorAll("iframe").forEach((frame) => {
    frame.addEventListener("pointerenter", hideCursor);
  });
  document.documentElement.addEventListener("pointerleave", hideCursor);
  document.addEventListener("pointercancel", hideCursor);
  document.addEventListener("visibilitychange", hideCursor);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Tab") hideCursor();
  });
  window.addEventListener("blur", hideCursor);
  window.addEventListener("resize", hideCursor);
  window.addEventListener("scroll", hideCursor, { passive: true, capture: true });
  finePointer.addEventListener("change", hideCursor);
})();
