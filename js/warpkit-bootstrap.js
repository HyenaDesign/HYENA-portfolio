"use strict";

// Paint the existing poster and typography before compiling the GPU scene.
// Keep the vendor runtime, scene parameters, resolution and animation speed intact.
(() => {
  const base = new URL("../warpkit/", document.currentScript.src);
  const scene = document.querySelector("warpkit-scene");
  if (!scene) return;
  const name = scene.getAttribute("name");
  if (!["hero-section", "profile"].includes(name)) return;

  function script(url) {
    return new Promise((resolve, reject) => {
      const element = document.createElement("script");
      element.src = new URL(url, base).href;
      element.onload = resolve;
      element.onerror = reject;
      document.head.append(element);
    });
  }

  async function start() {
    try {
      await script("warpkit-runtime-1.4.0.js");
      await script(`scenes/${name}.js`);
    } catch {
      // CSS keeps the original poster visible if the renderer cannot load.
      console.warn("WarpKit could not load; keeping the scene poster.");
    }
  }

  function schedule() {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if ("requestIdleCallback" in window) window.requestIdleCallback(start, { timeout: 700 });
      else setTimeout(start, 0);
    }));
  }

  // The profile is a same-origin frame: it must also wait for the parent's
  // loader, and stop rendering when its card scrolls out of the viewport.
  let ready = window.siteReady;
  let frame;
  try {
    frame = window.frameElement;
    if (frame) ready = window.parent.siteReady;
  } catch { /* Standalone or cross-origin embeds use their own readiness. */ }
  function activate() {
    if (frame && "IntersectionObserver" in window.parent) {
      let started = false;
      const observer = new window.parent.IntersectionObserver(([entry]) => {
        scene.toggleAttribute("paused", !entry.isIntersecting);
        if (entry.isIntersecting && !started) {
          started = true;
          schedule();
        }
      });
      observer.observe(frame);
    } else schedule();
  }
  if (ready) ready.then(activate);
  else activate();
})();
