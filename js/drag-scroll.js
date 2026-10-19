"use strict";

(() => {
  const root = document.documentElement;
  const interactive = 'a, button, input, textarea, select, label, summary, [contenteditable]:not([contenteditable="false"]), [role="button"], [role="link"], [role="slider"], iframe, video, audio, canvas, warpkit-scene, [data-no-drag-scroll]';
  let gesture = null;
  let suppressClickUntil = 0;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let frame = 0;
  let targetY = window.scrollY;
  let velocity = 0;
  let frameTime = 0;

  const clampY = value => Math.max(0, Math.min(value, root.scrollHeight - window.innerHeight));

  function stopAnimation() {
    cancelAnimationFrame(frame);
    frame = 0;
    velocity = 0;
  }

  function animate(now) {
    frame = 0;
    const dt = Math.min(32, Math.max(1, now - frameTime));
    frameTime = now;
    if (!gesture) {
      const decay = Math.exp(-dt / 300);
      targetY = clampY(targetY + velocity * 300 * (1 - decay));
      velocity *= decay;
    }
    const nextY = window.scrollY + (targetY - window.scrollY) * (1 - Math.exp(-dt / 40));
    window.scrollTo({ top: nextY, behavior: "instant" });
    if (Math.abs(targetY - window.scrollY) > 1 || (!gesture && Math.abs(velocity) > 0.02)) {
      frame = requestAnimationFrame(animate);
    } else {
      window.scrollTo({ top: targetY, behavior: "instant" });
    }
  }

  function schedule() {
    if (frame) return;
    frameTime = performance.now();
    frame = requestAnimationFrame(animate);
  }

  function finish(coast = false) {
    if (!gesture) return;
    const { pointerId, dragging, lastMove } = gesture;
    gesture = null;
    root.classList.remove("is-drag-scrolling");
    if (root.hasPointerCapture(pointerId)) root.releasePointerCapture(pointerId);
    if (dragging) suppressClickUntil = Date.now() + 250;
    if (coast && dragging && !reducedMotion.matches) {
      velocity = performance.now() - lastMove < 80 ? velocity : 0;
      schedule();
    } else stopAnimation();
  }

  function cancel() { finish(); stopAnimation(); }

  document.addEventListener("pointerdown", (event) => {
    cancel();
    suppressClickUntil = 0;
    // Touch keeps native scrolling; Shift-drag keeps native text selection.
    if (event.pointerType !== "mouse" || event.button !== 0 || !event.isPrimary ||
        event.shiftKey || event.ctrlKey || event.metaKey || event.altKey ||
        event.target.closest(interactive)) return;
    gesture = {
      pointerId: event.pointerId,
      startY: event.clientY,
      scrollY: window.scrollY,
      dragging: false,
      lastY: event.clientY,
      lastMove: performance.now(),
    };
  });

  document.addEventListener("pointermove", (event) => {
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    if (!(event.buttons & 1)) { finish(); return; }
    const distance = event.clientY - gesture.startY;
    if (!gesture.dragging) {
      if (Math.abs(distance) < 6) return;
      gesture.dragging = true;
      root.classList.add("is-drag-scrolling");
      root.setPointerCapture(event.pointerId);
      window.getSelection()?.removeAllRanges();
    }
    event.preventDefault();
    const now = performance.now();
    const dt = Math.max(8, now - gesture.lastMove);
    const sample = Math.max(-2, Math.min(2, (gesture.lastY - event.clientY) / dt));
    velocity = dt > 80 ? sample : velocity * 0.35 + sample * 0.65;
    gesture.lastY = event.clientY;
    gesture.lastMove = now;
    targetY = clampY(gesture.scrollY - distance);
    if (reducedMotion.matches) window.scrollTo({ top: targetY, behavior: "instant" });
    else schedule();
  }, { passive: false });

  document.addEventListener("dragstart", (event) => {
    if (gesture) event.preventDefault();
  });
  document.addEventListener("click", (event) => {
    if (Date.now() < suppressClickUntil) {
      event.preventDefault();
      event.stopImmediatePropagation();
      suppressClickUntil = 0;
    }
  }, true);
  for (const type of ["pointerup", "pointercancel", "lostpointercapture"]) {
    document.addEventListener(type, (event) => {
      if (gesture?.pointerId === event.pointerId) finish(type === "pointerup");
    });
  }
  window.addEventListener("blur", cancel);
  window.addEventListener("wheel", cancel, { passive: true });
  document.addEventListener("keydown", cancel);
  reducedMotion.addEventListener("change", cancel);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancel();
  });
})();
