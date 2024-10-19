// scripts/script.js

// Ensure the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Timeline for Hero Section
  const heroTimeline = gsap.timeline();
  heroTimeline
    .from(".hero-content h1", {
      duration: 1,
      y: -50,
      opacity: 0,
      ease: "back.out(1.7)",
    })
    .from(".hero-content p", {
      duration: 1,
      y: 30,
      opacity: 0,
      ease: "power2.out",
      delay: -0.5, // Overlap with the previous animation
    }, "-=0.5") // Set overlap time relative to the previous animation

    // Continuous floating effect for the hero section text
    .to(".hero-content h1", {
      y: -10,
      yoyo: true,
      repeat: -1,
      duration: 1.5,
      ease: "sine.inOut",
    });

  // ScrollTrigger for Features Section
  gsap.utils.toArray('.feature-card').forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 80%", // Trigger when top of the card is 80% down the viewport
        toggleActions: "play none none none",
      },
      duration: 0.75,
      opacity: 0,
      y: 30,
      ease: "power2.out",
      delay: index * 0.1 // Staggered delay
    });
  });

  // ScrollTrigger for Projects Section
  gsap.utils.toArray('.project-card').forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 80%",
        toggleActions: "play none none none",
      },
      duration: 0.75,
      opacity: 0,
      scale: 0.7,
      ease: "back.out(1.7)",
      delay: index * 0.1 // Staggered delay
    });
  });

  // Adding hover effects to resource cards
  const resourceCards = document.querySelectorAll('.resource-card');
  resourceCards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, { scale: 1.05, duration: 0.3, ease: "power2.out" });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { scale: 1, duration: 0.3, ease: "power2.out" });
    });
  });

  // ScrollTrigger for About Section
  gsap.from("#about", {
    scrollTrigger: {
      trigger: "#about",
      start: "top 80%",
      toggleActions: "play none none none",
    },
    duration: 1,
    opacity: 0,
    y: 30,
    ease: "power2.out"
  });

  // ScrollTrigger for Newsletter Section
  gsap.from("#newsletter", {
    scrollTrigger: {
      trigger: "#newsletter",
      start: "top 80%",
      toggleActions: "play none none none",
    },
    duration: 1,
    opacity: 0,
    y: 30,
    ease: "power2.out"
  });

  // Background float animation (if you have a background element)
  gsap.to(".hero-banner", {
    backgroundPosition: "0% 100%",
    yoyo: true,
    repeat: -1,
    duration: 8,
    ease: "linear",
  });

  // Add any other dynamic animations you want for different sections.
});
