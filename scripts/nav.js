document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // Only add event listener if both elements exist
    if (hamburger && navLinks) {
        hamburger.setAttribute('aria-expanded', 'false');

        hamburger.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', String(isOpen));
            
            // Toggle hamburger animation if it has spans (contact page style)
            const spans = hamburger.querySelectorAll('span');
            if (spans.length > 0) {
                hamburger.classList.toggle('active');
            }
        });

        document.addEventListener('click', (event) => {
            if (!navLinks.classList.contains('active')) return;
            if (hamburger.contains(event.target) || navLinks.contains(event.target)) return;

            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });

        document.addEventListener('keydown', (event) => {
            if (event.key !== 'Escape') return;

            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    }
    
    // Close menu when clicking on nav links
    const navLinkElements = document.querySelectorAll('.nav-link');
    navLinkElements.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks) {
                navLinks.classList.remove('active');
            }
            if (hamburger) {
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    });
});
