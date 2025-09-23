// Performance monitoring script for mobile optimization
document.addEventListener('DOMContentLoaded', function() {
    // Monitor Core Web Vitals
    if ('performance' in window) {
        // First Contentful Paint
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.name === 'first-contentful-paint') {
                    console.log('FCP:', entry.startTime + 'ms');
                }
            }
        });
        observer.observe({ entryTypes: ['paint'] });

        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.startTime + 'ms');
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // Page load metrics
        window.addEventListener('load', function() {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('DOM Content Loaded:', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart + 'ms');
                console.log('Page Load Time:', perfData.loadEventEnd - perfData.navigationStart + 'ms');
            }, 0);
        });
    }
    
    // Log when images load
    const images = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log('Lazy image loaded:', entry.target.alt || entry.target.src);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});