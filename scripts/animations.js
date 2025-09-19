// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Hero section animations
    gsap.from('.hero-content h1', {
        duration: 1.2,
        y: 100,
        opacity: 0,
        ease: 'power4.out'
    });

    gsap.from('.hero-content p', {
        duration: 1.2,
        y: 50,
        opacity: 0,
        delay: 0.3,
        ease: 'power4.out'
    });

    // Feature cards animation
    gsap.from('.feature-card', {
        scrollTrigger: {
            trigger: '.features',
            start: 'top center+=100',
            toggleActions: 'play none none reverse'
        },
        duration: 0.8,
        y: 50,
        opacity: 0,
        stagger: 0.2,
        ease: 'power2.out'
    });

    // Projects section animation
    gsap.from('.project-card', {
        scrollTrigger: {
            trigger: '.projects',
            start: 'top center+=100',
            toggleActions: 'play none none reverse'
        },
        duration: 0.6,
        scale: 0.8,
        opacity: 0,
        stagger: 0.1,
        ease: 'back.out(1.7)'
    });

    // Skills section animation
    gsap.from('.skill-row', {
        scrollTrigger: {
            trigger: '.skills',
            start: 'top center+=100',
            toggleActions: 'play none none reverse'
        },
        duration: 0.8,
        x: -50,
        opacity: 0,
        stagger: 0.1,
        ease: 'power2.out'
    });

    // Animate skill bars
    gsap.from('.skill-bar-fill', {
        scrollTrigger: {
            trigger: '.skills',
            start: 'top center+=100',
            toggleActions: 'play none none reverse'
        },
        duration: 1.5,
        width: 0,
        stagger: 0.1,
        ease: 'power2.inOut'
    });

    // Resources section animation
    gsap.from('.resource-card', {
        scrollTrigger: {
            trigger: '.resources',
            start: 'top center+=100',
            toggleActions: 'play none none reverse'
        },
        duration: 0.8,
        y: 50,
        opacity: 0,
        stagger: 0.2,
        ease: 'power2.out'
    });

    // Social icons animation
    gsap.from('.socials ul li', {
        scrollTrigger: {
            trigger: '.socials',
            start: 'top bottom-=100',
            toggleActions: 'play none none reverse'
        },
        duration: 0.5,
        scale: 0,
        opacity: 0,
        stagger: 0.1,
        ease: 'back.out(2)'
    });
});