// Contact page interactions and functionality

document.addEventListener('DOMContentLoaded', function() {
    initScrollProgress();
    initCardHoverEffects();
    initStatusAnimation();
});

// Scroll progress bar
function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }
}

// Card hover effects and animations
function initCardHoverEffects() {
    const connectionCards = document.querySelectorAll('.connection-card');
    
    connectionCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add ripple effect
            createRippleEffect(this);
            
            // Animate card icon
            const icon = this.querySelector('.card-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.card-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
}

// Create ripple effect on card hover
function createRippleEffect(element) {
    const ripple = document.createElement('div');
    ripple.classList.add('ripple-effect');
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = '50%';
    ripple.style.top = '50%';
    ripple.style.transform = 'translate(-50%, -50%) scale(0)';
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(206, 79, 10, 0.1)';
    ripple.style.pointerEvents = 'none';
    ripple.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
    ripple.style.zIndex = '0';
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.style.transform = 'translate(-50%, -50%) scale(1)';
        ripple.style.opacity = '0';
    }, 10);
    
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 600);
}

// Animate availability status
function initStatusAnimation() {
    const statusLight = document.querySelector('.status-light');
    const statusText = document.querySelector('.status-text h3');
    
    if (statusLight && statusText) {
        // Add extra glow effect on hover
        const statusIndicator = document.querySelector('.status-indicator');
        statusIndicator.addEventListener('mouseenter', function() {
            statusLight.style.boxShadow = '0 0 30px rgba(74, 222, 128, 0.8)';
            statusText.style.color = '#4ade80';
        });
        
        statusIndicator.addEventListener('mouseleave', function() {
            statusLight.style.boxShadow = '0 0 20px rgba(74, 222, 128, 0.5)';
            statusText.style.color = 'var(--white)';
        });
    }
}

// Creative options interaction
document.addEventListener('DOMContentLoaded', function() {
    const creativeOptions = document.querySelectorAll('.creative-option');
    
    creativeOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'translateY(-5px) scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'translateY(-5px) scale(1)';
            }, 150);
            
            // Create floating emoji effect
            createFloatingEmoji(this);
        });
    });
});

// Floating emoji effect
function createFloatingEmoji(element) {
    const emoji = element.querySelector('.option-emoji').textContent;
    const floatingEmoji = document.createElement('div');
    
    floatingEmoji.textContent = emoji;
    floatingEmoji.style.position = 'fixed';
    floatingEmoji.style.fontSize = '2rem';
    floatingEmoji.style.pointerEvents = 'none';
    floatingEmoji.style.zIndex = '9999';
    floatingEmoji.style.transition = 'all 1s ease-out';
    
    const rect = element.getBoundingClientRect();
    floatingEmoji.style.left = (rect.left + rect.width / 2) + 'px';
    floatingEmoji.style.top = (rect.top + rect.height / 2) + 'px';
    
    document.body.appendChild(floatingEmoji);
    
    setTimeout(() => {
        floatingEmoji.style.transform = 'translateY(-100px) scale(1.5)';
        floatingEmoji.style.opacity = '0';
    }, 10);
    
    setTimeout(() => {
        if (floatingEmoji.parentNode) {
            floatingEmoji.parentNode.removeChild(floatingEmoji);
        }
    }, 1000);
}

// Enhanced email reveal with typing effect
window.revealEmail = function() {
    const emailReveal = document.getElementById('email-reveal');
    const emailAddress = document.getElementById('email-address');
    
    if (emailReveal.classList.contains('show')) return;
    
    // Replace with actual email - you should update this
    const email = 'sam.hyenadesign@gmail.com'; // Update this with your actual email
    
    emailReveal.classList.add('show');
    
    // Typing effect
    emailAddress.textContent = '';
    let i = 0;
    const typeInterval = setInterval(() => {
        if (i < email.length) {
            emailAddress.textContent += email.charAt(i);
            i++;
        } else {
            clearInterval(typeInterval);
        }
    }, 50);
};

// Enhanced copy email with better feedback
window.copyEmail = function() {
    const emailAddress = document.getElementById('email-address').textContent;
    const copyBtn = document.querySelector('.copy-email');
    
    navigator.clipboard.writeText(emailAddress).then(function() {
        const originalText = copyBtn.textContent;
        const originalBg = copyBtn.style.background;
        
        copyBtn.textContent = '✓ Copied!';
        copyBtn.style.background = '#4ade80';
        copyBtn.style.transform = 'scale(1.1)';
        
        // Add success animation
        copyBtn.style.animation = 'successPulse 0.3s ease';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = originalBg;
            copyBtn.style.transform = 'scale(1)';
            copyBtn.style.animation = '';
        }, 2000);
    }).catch(function() {
        // Fallback for older browsers
        const tempInput = document.createElement('input');
        tempInput.value = emailAddress;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => {
            copyBtn.textContent = 'Copy';
        }, 2000);
    });
};

// Add CSS for success animation
const style = document.createElement('style');
style.textContent = `
    @keyframes successPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.15); }
        100% { transform: scale(1.1); }
    }
    
    .ripple-effect {
        animation: ripple 0.6s ease-out;
    }
    
    @keyframes ripple {
        to {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);