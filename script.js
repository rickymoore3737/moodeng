// Mobile Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Copy contract address functionality
const copyBtn = document.querySelector('.copy-btn');
if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
        const addressText = document.querySelector('.address-text').textContent;
        try {
            await navigator.clipboard.writeText(addressText);
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
const animateElements = document.querySelectorAll('.token-card, .sidebar-card, .visual-card');
animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Stream player interaction
const streamPlayer = document.querySelector('.stream-player');
if (streamPlayer) {
    streamPlayer.addEventListener('load', () => {
        console.log('Stream loaded successfully');
    });
    
    streamPlayer.addEventListener('error', () => {
        console.error('Stream failed to load');
        // Could add fallback content here
    });
}

// Button click effects
const buttons = document.querySelectorAll('.btn');
buttons.forEach(btn => {
    btn.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Price update simulation (replace with real API)
function updateTokenPrice() {
    const priceElement = document.querySelector('.price-value');
    const changeElement = document.querySelector('.price-change');
    
    if (priceElement && changeElement) {
        // Simulate price changes
        const currentPrice = parseFloat(priceElement.textContent.replace('$', ''));
        const change = (Math.random() - 0.5) * 0.0001;
        const newPrice = Math.max(0.001, currentPrice + change);
        const percentChange = ((newPrice - currentPrice) / currentPrice * 100);
        
        priceElement.textContent = `$${newPrice.toFixed(5)}`;
        
        if (percentChange >= 0) {
            changeElement.className = 'price-change positive';
            changeElement.innerHTML = `<i class="fas fa-arrow-up"></i>+${percentChange.toFixed(2)}%`;
        } else {
            changeElement.className = 'price-change negative';
            changeElement.innerHTML = `<i class="fas fa-arrow-down"></i>${percentChange.toFixed(2)}%`;
        }
    }
}

// Update price every 30 seconds
setInterval(updateTokenPrice, 30000);

// Viewer count simulation
function updateViewerCount() {
    const viewerElements = document.querySelectorAll('.status-indicator span');
    viewerElements.forEach(element => {
        if (element.textContent.includes('viewers')) {
            const baseCount = 1200;
            const variation = Math.floor(Math.random() * 100);
            const newCount = baseCount + variation;
            element.textContent = `LIVE - ${newCount.toLocaleString()} viewers`;
        }
    });
}

// Update viewer count every 10 seconds
setInterval(updateViewerCount, 10000);

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('MOODENG Live platform loaded successfully!');
    
    // Add loading states
    const cards = document.querySelectorAll('.token-card, .sidebar-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// Stream Management Functions
function scrollToStream() {
    document.getElementById('stream').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

function loadStream(source) {
    const iframe = document.getElementById('primary-stream');
    const fallback = document.getElementById('stream-fallback');
    
    switch(source) {
        case 'zoodio':
            iframe.src = 'https://www.zoodio.live';
            break;
        case 'moodeng-tv':
            iframe.src = 'https://www.moodeng.tv';
            break;
        default:
            iframe.src = 'https://www.zoodio.live';
    }
    
    fallback.style.display = 'none';
    iframe.style.display = 'block';
}

function openExternalStream() {
    window.open('https://www.zoodio.live', '_blank');
}

function refreshStream() {
    const iframe = document.getElementById('primary-stream');
    const currentSrc = iframe.src;
    iframe.src = '';
    setTimeout(() => {
        iframe.src = currentSrc;
    }, 100);
}

function toggleFullscreen() {
    const iframe = document.getElementById('primary-stream');
    if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
    } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen();
    } else if (iframe.msRequestFullscreen) {
        iframe.msRequestFullscreen();
    }
}

function shareStream() {
    if (navigator.share) {
        navigator.share({
            title: 'Watch Moodeng Live!',
            text: 'Check out the adorable Moodeng live from Thailand!',
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('Link copied to clipboard!');
        });
    }
}

// Auto-refresh viewer count (simulated)
function updateViewerCount() {
    const viewerElement = document.getElementById('viewer-count');
    if (viewerElement) {
        const baseCount = 1200;
        const variation = Math.floor(Math.random() * 500);
        const currentCount = baseCount + variation;
        viewerElement.textContent = `LIVE - ${currentCount.toLocaleString()} viewers`;
    }
}

// Initialize stream functionality
document.addEventListener('DOMContentLoaded', function() {
    // Update viewer count every 30 seconds
    updateViewerCount();
    setInterval(updateViewerCount, 30000);
    
    // Handle iframe load errors
    const iframe = document.getElementById('primary-stream');
    iframe.addEventListener('error', function() {
        document.getElementById('stream-fallback').style.display = 'block';
        iframe.style.display = 'none';
    });
});