// Optimized preloader.js - Faster loading for better performance
document.addEventListener("DOMContentLoaded", function () {
    const preloader = document.getElementById("preloader");
    const progress = document.querySelector(".progress");
    const progressText = document.getElementById("progress-text");
    const content = document.getElementById("content");
  
    let progressValue = 0;
    
    // Faster preloader - reduced time from 2s to 1s
    const interval = setInterval(() => {
        if (progressValue < 100) {
            progressValue += 10; // Increased increment for faster loading
            progress.style.width = progressValue + "%";
            progressText.textContent = progressValue + "%";
        } else {
            clearInterval(interval);
            
            // Use requestAnimationFrame for smoother transition
            requestAnimationFrame(() => {
                preloader.style.transform = "translateY(-100%)";
                preloader.style.transition = "transform 0.3s ease-out";
                content.style.opacity = "1";
                document.body.style.overflow = "auto";
                
                // Remove preloader after animation
                setTimeout(() => {
                    preloader.style.display = "none";
                }, 300);
            });
        }
    }, 50); // Reduced interval for faster completion
    
    // Ensure content shows even if something goes wrong
    setTimeout(() => {
        if (preloader.style.display !== "none") {
            clearInterval(interval);
            preloader.style.display = "none";
            content.style.opacity = "1";
            document.body.style.overflow = "auto";
        }
    }, 1500); // Maximum preloader time
});