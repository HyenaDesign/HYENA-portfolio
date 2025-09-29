// Optimized About Page Animations
document.addEventListener('DOMContentLoaded', function() {
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined') {
        // Fallback: elements are already visible via CSS
        return;
    }
    
    // Register ScrollTrigger plugin
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }
    
    // Only run complex animations on larger screens
    const shouldAnimate = window.innerWidth > 768 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!shouldAnimate) {
        // For mobile/reduced motion: ensure all elements are visible
        gsap.set([".reveal-text", ".role-text", ".reveal-text-2", ".reveal-text-3"], { opacity: 1, y: 0 });
        return;
    }
    
    // Enhanced Hero Section Animations (desktop only)
    const heroElements = document.querySelectorAll('.reveal-text, .role-text, .reveal-text-2, .reveal-text-3');
    if (heroElements.length > 0) {
        const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" }});
        
        heroTimeline
            .from(".reveal-text", {
                y: 50,
                opacity: 0,
                duration: 0.8,
                clearProps: "all"
            })
            .from(".role-text", {
                y: 20,
                opacity: 0,
                duration: 0.6,
                clearProps: "all"
            }, "-=0.4")
            .from(".reveal-text-2", {
                y: 20,
                opacity: 0,
                duration: 0.6,
                clearProps: "all"
            }, "-=0.3")
            .from(".reveal-text-3", {
                y: 20,
                opacity: 0,
                duration: 0.6,
                clearProps: "all"
            }, "-=0.3");
    }
    
    // Scroll Progress Animation
    function initScrollProgress() {
        const progressBar = document.querySelector('.scroll-progress');
        if (progressBar) {
            window.addEventListener('scroll', () => {
                const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
                progressBar.style.width = scrolled + '%';
            }, { passive: true });
        }
    }
    
    // Initialize scroll progress
    initScrollProgress();
    
    // Timeline Items Animation (optimized)
    if (shouldAnimate && typeof ScrollTrigger !== 'undefined') {
        gsap.utils.toArray(".timeline-item").forEach((item, index) => {
            gsap.from(item, {
                opacity: 0,
                y: 30,
                duration: 0.6,
                delay: index * 0.1,
                scrollTrigger: {
                    trigger: item,
                    start: "top bottom-=50",
                    end: "bottom center",
                    toggleActions: "play none none none"
                }
            });
        });
        
        // Cards Animation
        gsap.utils.toArray(".about-card").forEach((card, index) => {
            gsap.from(card, {
                opacity: 0,
                y: 40,
                duration: 0.6,
                delay: index * 0.2,
                scrollTrigger: {
                    trigger: card,
                    start: "top bottom-=50",
                    toggleActions: "play none none none"
                }
            });
        });
        
        // Contact section animation
        const contactSection = document.querySelector('.about-contact');
        if (contactSection) {
            gsap.from(contactSection.children, {
                opacity: 0,
                y: 30,
                duration: 0.6,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: contactSection,
                    start: "top bottom-=100",
                    toggleActions: "play none none none"
                }
            });
        }
    }
});

// Additional performance optimizations
window.addEventListener('load', function() {
    // Remove any loading states
    document.body.classList.add('loaded');
    
    // Lazy load images if needed
    const images = document.querySelectorAll('img[data-src]');
    if (images.length > 0 && 'IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
});