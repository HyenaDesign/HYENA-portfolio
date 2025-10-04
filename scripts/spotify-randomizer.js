/**
 * Spotify Random Song Loader
 * Loads a random song iframe from songs.json
 */

class SpotifyRandomizer {
    constructor() {
        this.songsData = null;
        this.currentSong = null;
    }

    /**
     * Initialize the randomizer and load a random song
     */
    async init() {
        try {
            await this.loadSongsData();
            this.loadRandomSong();
        } catch (error) {
            console.error('Failed to initialize Spotify randomizer:', error);
            // Fallback to default song if something goes wrong
            this.loadDefaultSong();
        }
    }

    /**
     * Load songs data from JSON file
     */
    async loadSongsData() {
        try {
            const response = await fetch('./songs.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.songsData = await response.json();
        } catch (error) {
            console.error('Error loading songs data:', error);
            throw error;
        }
    }

    /**
     * Select and load a random song
     */
    loadRandomSong() {
        if (!this.songsData || !this.songsData.songs || this.songsData.songs.length === 0) {
            console.warn('No songs data available, using default song');
            this.loadDefaultSong();
            return;
        }

        // Get random song from the list
        const randomIndex = Math.floor(Math.random() * this.songsData.songs.length);
        this.currentSong = this.songsData.songs[randomIndex];

        // Replace the iframe with the new embed code
        this.replaceIframe(this.currentSong.embed);

        // Log the selected song for debugging
        console.log(`🎵 Now playing: ${this.currentSong.title} by ${this.currentSong.artist}`);
    }

    /**
     * Replace the existing iframe with new embed code
     */
    replaceIframe(embedCode) {
        const heroImageContainer = document.querySelector('.hero-image');
        if (heroImageContainer) {
            // Remove existing iframe
            const existingIframe = heroImageContainer.querySelector('iframe');
            if (existingIframe) {
                existingIframe.remove();
            }
            
            // Insert new iframe
            heroImageContainer.innerHTML = embedCode;
        } else {
            console.error('Hero image container not found');
        }
    }

    /**
     * Load default song as fallback
     */
    loadDefaultSong() {
        const defaultEmbed = '<iframe data-testid="embed-iframe" src="https://open.spotify.com/embed/track/3txlvthoUa9vWvG1zr2Lnr?utm_source=generator&theme=0" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>';
        this.replaceIframe(defaultEmbed);
        console.log('🎵 Loaded default song: infinite source - Deftones');
    }

    /**
     * Get current song info
     */
    getCurrentSong() {
        return this.currentSong;
    }

    /**
     * Manually load next random song (for testing or manual refresh)
     */
    nextRandomSong() {
        this.loadRandomSong();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const spotifyRandomizer = new SpotifyRandomizer();
    spotifyRandomizer.init();

    // Make it globally accessible for debugging
    window.spotifyRandomizer = spotifyRandomizer;
});

// Optional: Add a keyboard shortcut for developers to test (Ctrl+Shift+S)
document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.shiftKey && event.key === 'S') {
        if (window.spotifyRandomizer) {
            window.spotifyRandomizer.nextRandomSong();
        }
    }
});