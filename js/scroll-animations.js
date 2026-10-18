"use strict";

// Content stays visible if GSAP cannot load. The hero stays stationary so its
// fixed navbar never gets trapped inside a transformed ancestor.
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();

  media.add("(prefers-reduced-motion: no-preference)", () => {
    const cards = gsap.utils.toArray(".bento-card:not(.bento-card--hero)");
    const directions = [
      { x: -64, y: 0 }, { x: 64, y: 0 },
      { x: -48, y: 24 }, { x: 0, y: 64 }, { x: 48, y: 24 },
      { x: -64, y: 0 }, { x: 64, y: 0 },
      { x: 0, y: 48 }, { x: 0, y: -32 },
    ];
    const cleanup = [];

    cards.forEach((card, index) => {
      const direction = directions[index % directions.length];
      const tween = gsap.fromTo(card, { ...direction, opacity: 0 }, {
        x: 0,
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 94%",
          toggleActions: "play none none reverse",
        },
      });

      // Keyboard navigation must never land on an unrevealed control.
      const revealOnFocus = () => { tween.pause().progress(1); };
      card.addEventListener("focusin", revealOnFocus);
      cleanup.push(() => card.removeEventListener("focusin", revealOnFocus));
    });

    // Stickers follow the reveal of their junction, without inheriting card transforms.
    [
      [".sticker-anchor--mood", ".bento-card--profile"],
      [".sticker-anchor--bold", ".bento-card--work"],
      [".sticker-anchor--volume", ".footer-row"],
    ].forEach(([sticker, trigger]) => {
      const tween = gsap.fromTo(sticker, { opacity: 0, scale: 0.92 }, {
        opacity: 1,
        scale: 1,
        duration: 0.65,
        ease: "power2.out",
        scrollTrigger: { trigger, start: "top 94%", toggleActions: "play none none reverse" },
      });
      const anchor = document.querySelector(sticker);
      const revealOnFocus = () => { tween.pause().progress(1); };
      anchor.addEventListener("focusin", revealOnFocus);
      cleanup.push(() => anchor.removeEventListener("focusin", revealOnFocus));
    });

    return () => cleanup.forEach((removeListener) => removeListener());
  });

  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
}
