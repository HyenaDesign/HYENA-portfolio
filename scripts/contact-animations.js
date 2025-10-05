// Contact page GSAP animations

document.addEventListener('DOMContentLoaded', function() {
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined') {
        setTimeout(initContactAnimations, 100);
        return;
    }
    initContactAnimations();
});

function initContactAnimations() {
    // Register ScrollTrigger plugin
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }
    
    // Hero text animations
    initHeroAnimations();
    
    // Connection cards animations
    initConnectionCardsAnimations();
    
    // Creative section animations
    initCreativeSectionAnimations();
    
    // Status section animations
    initStatusAnimations();
    
    // Scroll-triggered animations
    initScrollAnimations();
}

function initHeroAnimations() {
    // Add animate-in classes for CSS animations as fallback
    document.querySelector('.hero-title')?.classList.add('animate-in');
    document.querySelector('.hero-subtitle')?.classList.add('animate-in');
    document.querySelector('.hero-description')?.classList.add('animate-in');
    
    // Enhanced GSAP animations (will override CSS animations)
    const tl = gsap.timeline({ delay: 0.5 });
    
    // Reset and animate hero text elements
    gsap.set(['.hero-title', '.hero-subtitle', '.hero-description'], {
        y: 50,
        opacity: 0
    });
    
    tl.to('.hero-title', {
        duration: 1.2,
        y: 0,
        opacity: 1,
        ease: 'power3.out'
    })
    .to('.hero-subtitle', {
        duration: 1,
        y: 0,
        opacity: 1,
        ease: 'power3.out'
    }, '-=0.8')
    .to('.hero-description', {
        duration: 1,
        y: 0,
        opacity: 1,
        ease: 'power3.out'
    }, '-=0.6');
    
    // Add floating animation to hero title
    gsap.to('.contact-hero h1', {
        duration: 4,
        y: -10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 2
    });
}

function initConnectionCardsAnimations() {
    const cards = document.querySelectorAll('.connection-card');
    
    cards.forEach((card, index) => {
        // Initial animation when scrolled into view
        gsap.set(card, { y: 100, opacity: 0 });
        
        ScrollTrigger.create({
            trigger: card,
            start: 'top 85%',
            onEnter: () => {
                gsap.to(card, {
                    duration: 0.8,
                    y: 0,
                    opacity: 1,
                    ease: 'power3.out',
                    delay: index * 0.2
                });
            }
        });
        
        // Hover animations
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                duration: 0.4,
                scale: 1.02,
                y: -10,
                ease: 'power2.out'
            });
            
            // Animate card icon
            const icon = card.querySelector('.card-icon');
            if (icon) {
                gsap.to(icon, {
                    duration: 0.3,
                    scale: 1.1,
                    rotation: 5,
                    ease: 'back.out(2)'
                });
            }
            
            // Animate connection links
            const links = card.querySelectorAll('.connection-link');
            gsap.to(links, {
                duration: 0.3,
                scale: 1.05,
                stagger: 0.1,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                duration: 0.4,
                scale: 1,
                y: 0,
                ease: 'power2.out'
            });
            
            const icon = card.querySelector('.card-icon');
            if (icon) {
                gsap.to(icon, {
                    duration: 0.3,
                    scale: 1,
                    rotation: 0,
                    ease: 'power2.out'
                });
            }
            
            const links = card.querySelectorAll('.connection-link');
            gsap.to(links, {
                duration: 0.3,
                scale: 1,
                ease: 'power2.out'
            });
        });
    });
}

function initCreativeSectionAnimations() {
    const creativeOptions = document.querySelectorAll('.creative-option');
    
    // Stagger animation when scrolled into view
    ScrollTrigger.create({
        trigger: '.creative-options',
        start: 'top 80%',
        onEnter: () => {
            gsap.fromTo(creativeOptions, 
                {
                    y: 50,
                    opacity: 0,
                    scale: 0.8
                },
                {
                    duration: 0.6,
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    stagger: 0.15,
                    ease: 'back.out(1.2)'
                }
            );
        }
    });
    
    // Animate creative prompt background
    ScrollTrigger.create({
        trigger: '.creative-prompt',
        start: 'top 85%',
        onEnter: () => {
            gsap.from('.prompt-content', {
                duration: 1,
                scale: 0.9,
                opacity: 0,
                ease: 'power3.out'
            });
        }
    });
    
    // Add hover effects to creative options
    creativeOptions.forEach(option => {
        option.addEventListener('mouseenter', () => {
            gsap.to(option, {
                duration: 0.3,
                y: -10,
                scale: 1.05,
                ease: 'power2.out'
            });
            
            const emoji = option.querySelector('.option-emoji');
            if (emoji) {
                gsap.to(emoji, {
                    duration: 0.3,
                    scale: 1.2,
                    rotation: 10,
                    ease: 'back.out(2)'
                });
            }
        });
        
        option.addEventListener('mouseleave', () => {
            gsap.to(option, {
                duration: 0.3,
                y: 0,
                scale: 1,
                ease: 'power2.out'
            });
            
            const emoji = option.querySelector('.option-emoji');
            if (emoji) {
                gsap.to(emoji, {
                    duration: 0.3,
                    scale: 1,
                    rotation: 0,
                    ease: 'power2.out'
                });
            }
        });
    });
}

function initStatusAnimations() {
    // Animate status indicator
    ScrollTrigger.create({
        trigger: '.status-indicator',
        start: 'top 80%',
        onEnter: () => {
            gsap.from('.status-indicator', {
                duration: 0.8,
                scale: 0.8,
                opacity: 0,
                ease: 'back.out(1.5)'
            });
        }
    });
    
    // Animate process steps
    const steps = document.querySelectorAll('.step');
    ScrollTrigger.create({
        trigger: '.process-steps',
        start: 'top 80%',
        onEnter: () => {
            gsap.fromTo(steps,
                {
                    y: 30,
                    opacity: 0
                },
                {
                    duration: 0.6,
                    y: 0,
                    opacity: 1,
                    stagger: 0.2,
                    ease: 'power3.out'
                }
            );
        }
    });
    
    // Animate step numbers
    steps.forEach(step => {
        const stepNumber = step.querySelector('.step-number');
        
        ScrollTrigger.create({
            trigger: step,
            start: 'top 85%',
            onEnter: () => {
                gsap.from(stepNumber, {
                    duration: 0.5,
                    scale: 0,
                    rotation: 180,
                    ease: 'back.out(2)',
                    delay: 0.3
                });
            }
        });
    });
}

function initScrollAnimations() {
    // Parallax effect for section titles
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        gsap.to(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            },
            y: -50,
            ease: 'none'
        });
    });
    
    // Background gradient animation based on scroll
    gsap.to('body', {
        scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1
        },
        background: 'linear-gradient(180deg, #000000 0%, #1a0a05 50%, #000000 100%)',
        ease: 'none'
    });
}

// Email reveal animation
window.revealEmailAnimated = function() {
    const emailReveal = document.getElementById('email-reveal');
    const emailAddress = document.getElementById('email-address');
    const trigger = document.querySelector('.email-trigger');
    
    if (emailReveal.classList.contains('show')) return;
    
    // Update email here
    const email = 'sam.hyenadesign@gmail.com'; // Replace with actual email
    
    // Animate button transformation
    gsap.to(trigger, {
        duration: 0.3,
        scale: 0.9,
        ease: 'power2.inOut',
        onComplete: () => {
            emailReveal.classList.add('show');
            
            // Animate email reveal
            gsap.from('.email-content', {
                duration: 0.5,
                scale: 0.8,
                opacity: 0,
                ease: 'back.out(1.5)'
            });
            
            // Typing animation
            emailAddress.textContent = '';
            let i = 0;
            const typeInterval = setInterval(() => {
                if (i < email.length) {
                    emailAddress.textContent += email.charAt(i);
                    i++;
                } else {
                    clearInterval(typeInterval);
                    
                    // Highlight animation
                    gsap.to(emailAddress, {
                        duration: 0.3,
                        scale: 1.05,
                        yoyo: true,
                        repeat: 1,
                        ease: 'power2.inOut'
                    });
                }
            }, 50);
        }
    });
    
    gsap.to(trigger, {
        duration: 0.3,
        scale: 1,
        ease: 'power2.inOut',
        delay: 0.3
    });
};

// Enhanced copy animation
window.copyEmailAnimated = function() {
    const emailAddress = document.getElementById('email-address').textContent;
    const copyBtn = document.querySelector('.copy-email');
    
    navigator.clipboard.writeText(emailAddress).then(function() {
        const originalText = copyBtn.textContent;
        
        // Success animation sequence
        const tl = gsap.timeline();
        
        tl.to(copyBtn, {
            duration: 0.1,
            scale: 0.9,
            ease: 'power2.in'
        })
        .to(copyBtn, {
            duration: 0.3,
            scale: 1.1,
            background: '#4ade80',
            ease: 'back.out(2)',
            onStart: () => {
                copyBtn.textContent = '✓ Copied!';
            }
        })
        .to(copyBtn, {
            duration: 0.2,
            scale: 1,
            ease: 'power2.out'
        })
        .to(copyBtn, {
            duration: 0.3,
            background: 'var(--orange)',
            delay: 1.5,
            onStart: () => {
                copyBtn.textContent = originalText;
            }
        });
    });
};

// Replace original functions with animated versions
window.revealEmail = window.revealEmailAnimated;
window.copyEmail = window.copyEmailAnimated;