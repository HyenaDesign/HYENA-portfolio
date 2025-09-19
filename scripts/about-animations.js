// Import Space Mono font
const link = document.createElement('link');
link.href = 'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap';
link.rel = 'stylesheet';
document.head.appendChild(link);

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Hero Section Animations
const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" }});

heroTimeline
    .from(".reveal-text", {
        y: 100,
        opacity: 0,
        duration: 1,
        clearProps: "all"
    })
    .from(".role-text", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        clearProps: "all"
    }, "-=0.5")
    .from(".reveal-text-2", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        clearProps: "all"
    }, "-=0.3")
    .from(".reveal-text-3", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        clearProps: "all"
    }, "-=0.3")
    .from(".image-wrapper", {
        x: 50,
        opacity: 0,
        duration: 1,
        clearProps: "all"
    }, "-=0.8");

// Scroll Progress Animation


// Timeline Items Animation
gsap.utils.toArray(".timeline-item").forEach(item => {
    gsap.from(item, {
        opacity: 0,
        y: 30,
        duration: 1,
        scrollTrigger: {
            trigger: item,
            start: "top bottom-=100",
            end: "bottom center",
            toggleActions: "play none none reverse"
        }
    });
});

// Skills Animation
gsap.utils.toArray(".skill-level").forEach(level => {
    const percentage = level.getAttribute("data-level") + "%";
    
    gsap.to(level, {
        "--level": percentage,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
            trigger: level,
            start: "top bottom-=100",
            toggleActions: "play none none reverse"
        }
    });
});