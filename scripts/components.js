// Component loader utility
class ComponentLoader {
    static async loadComponent(elementId, componentPath) {
        try {
            const response = await fetch(componentPath);
            if (!response.ok) {
                throw new Error(`Failed to load component: ${response.status}`);
            }
            const html = await response.text();
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = html;
                return true;
            }
            return false;
        } catch (error) {
            console.error(`Error loading component from ${componentPath}:`, error);
            return false;
        }
    }

    static async loadNavbar() {
        const success = await this.loadComponent('navbar-container', 'components/navbar.html');
        if (success) {
            // Set active navigation item based on current page
            this.setActiveNavItem();
            // Initialize navigation functionality
            this.initializeNavigation();
        }
        return success;
    }

    static async loadFooter() {
        return await this.loadComponent('footer-container', 'components/footer.html');
    }

    static setActiveNavItem() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            if (href === currentPage || 
                (currentPage === 'index.html' && href.includes('#projects')) ||
                (currentPage === '' && href.includes('#projects'))) {
                link.classList.add('active');
            }
        });
    }

    static initializeNavigation() {
        // Initialize hamburger menu
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');

        if (hamburger && navLinks) {
            hamburger.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                    navLinks.classList.remove('active');
                }
            });

            // Close menu when clicking on a link
            const links = navLinks.querySelectorAll('a');
            links.forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                });
            });
        }
    }

    static async loadAllComponents() {
        const promises = [
            this.loadNavbar(),
            this.loadFooter()
        ];
        
        try {
            const results = await Promise.all(promises);
            return results.every(result => result);
        } catch (error) {
            console.error('Error loading components:', error);
            return false;
        }
    }
}

// Auto-load components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    ComponentLoader.loadAllComponents();
});

// Export for manual use if needed
window.ComponentLoader = ComponentLoader;