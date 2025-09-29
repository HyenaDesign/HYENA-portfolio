// CMS Content Loader
class CMSLoader {
    constructor() {
        this.baseUrl = window.location.origin;
    }

    // Load YAML content from _data directory
    async loadYAML(filename) {
        try {
            const response = await fetch(`${this.baseUrl}/_data/${filename}`);
            if (!response.ok) {
                throw new Error(`Failed to load ${filename}`);
            }
            const text = await response.text();
            return this.parseYAML(text);
        } catch (error) {
            console.warn(`Could not load ${filename}:`, error);
            return null;
        }
    }

    // Simple YAML parser for basic key-value pairs
    parseYAML(yamlText) {
        const lines = yamlText.split('\n');
        const result = {};
        let currentKey = null;
        let currentValue = '';
        let isMultiline = false;

        for (let line of lines) {
            line = line.trim();
            
            if (line === '' || line.startsWith('#')) continue;
            
            if (line.includes(': |')) {
                currentKey = line.split(': |')[0];
                isMultiline = true;
                currentValue = '';
                continue;
            }
            
            if (isMultiline) {
                if (line.startsWith('  ')) {
                    currentValue += line.substring(2) + '\n';
                } else {
                    if (currentKey) {
                        result[currentKey] = currentValue.trim();
                    }
                    isMultiline = false;
                    currentKey = null;
                }
            }
            
            if (line.includes(': ') && !isMultiline) {
                const [key, ...valueParts] = line.split(': ');
                const value = valueParts.join(': ');
                
                if (value.startsWith('"') && value.endsWith('"')) {
                    result[key] = value.slice(1, -1);
                } else if (value.startsWith('[') && value.endsWith(']')) {
                    result[key] = JSON.parse(value);
                } else {
                    result[key] = value;
                }
            }
        }
        
        if (isMultiline && currentKey) {
            result[currentKey] = currentValue.trim();
        }
        
        return result;
    }

    // Load and inject home page content
    async loadHomeContent() {
        const homeData = await this.loadYAML('home.yml');
        if (!homeData) return;

        // Update hero title
        const heroTitle = document.querySelector('.hero-content h1');
        if (heroTitle && homeData.hero_title) {
            heroTitle.textContent = homeData.hero_title;
        }

        // Update hero subtitle
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle && homeData.hero_subtitle) {
            heroSubtitle.textContent = homeData.hero_subtitle;
        }
    }

    // Load and inject about page content
    async loadAboutContent() {
        const aboutData = await this.loadYAML('about.yml');
        if (!aboutData) return;

        // Update page title
        const pageTitle = document.querySelector('.about-hero h1');
        if (pageTitle && aboutData.title) {
            pageTitle.textContent = aboutData.title;
        }

        // Update bio
        const bioElement = document.querySelector('.about-bio');
        if (bioElement && aboutData.bio) {
            bioElement.innerHTML = this.markdownToHTML(aboutData.bio);
        }
    }

    // Load and inject contact page content
    async loadContactContent() {
        const contactData = await this.loadYAML('contact.yml');
        if (!contactData) return;

        // Update email
        const emailElement = document.querySelector('.contact-email');
        if (emailElement && contactData.email) {
            emailElement.textContent = contactData.email;
            emailElement.href = `mailto:${contactData.email}`;
        }

        // Update phone
        const phoneElement = document.querySelector('.contact-phone');
        if (phoneElement && contactData.phone) {
            phoneElement.textContent = contactData.phone;
            phoneElement.href = `tel:${contactData.phone}`;
        }
    }

    // Simple markdown to HTML converter
    markdownToHTML(markdown) {
        return markdown
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');
    }

    // Initialize based on current page
    init() {
        const path = window.location.pathname;
        
        if (path === '/' || path.includes('index.html')) {
            this.loadHomeContent();
        } else if (path.includes('about.html')) {
            this.loadAboutContent();
        } else if (path.includes('contact.html')) {
            this.loadContactContent();
        }
    }
}

// Initialize CMS loader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const cmsLoader = new CMSLoader();
    cmsLoader.init();
});