// Token Configuration
const TOKEN_CONTRACT = 'DU6dwLd4EHQJLWMC8AHGytK6yR571DgKMMthrqN2pump';
const DEXSCREENER_API = `https://api.dexscreener.com/latest/dex/tokens/${TOKEN_CONTRACT}`;
const UPDATE_INTERVAL = 30000; // 30 seconds

// Global token data
let tokenData = {
    price: 0,
    priceChange24h: 0,
    marketCap: 0,
    volume24h: 0,
    lastUpdated: null
};

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
function copyContractAddress() {
    const addressText = TOKEN_CONTRACT;
    navigator.clipboard.writeText(addressText).then(() => {
        // Update all copy buttons
        const copyBtns = document.querySelectorAll('.copy-btn, .copy-btn-hero');
        copyBtns.forEach(btn => {
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i>';
            btn.style.color = '#10b981';
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.color = '';
            }, 2000);
        });
        
        // Show toast notification
        showToast('Contract address copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showToast('Failed to copy address', 'error');
    });
}

// Toast notification system
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Remove toast
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Fetch token data from DexScreener API
async function fetchTokenData() {
    const statusIcon = document.getElementById('data-sync-icon');
    const statusText = document.getElementById('data-status-text');
    
    try {
        statusIcon.classList.add('spinning');
        statusText.textContent = 'Fetching token data...';
        
        const response = await fetch(DEXSCREENER_API);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.pairs && data.pairs.length > 0) {
            // Get the first pair (usually the most liquid)
            const pair = data.pairs[0];
            
            tokenData = {
                price: parseFloat(pair.priceUsd) || 0,
                priceChange24h: parseFloat(pair.priceChange?.h24) || 0,
                marketCap: parseFloat(pair.fdv) || 0,
                volume24h: parseFloat(pair.volume?.h24) || 0,
                lastUpdated: new Date()
            };
            
            updateTokenDisplay();
            statusText.textContent = 'Token data updated successfully';
        } else {
            // No pairs found - token might be new or not trading
            tokenData = {
                price: 0,
                priceChange24h: 0,
                marketCap: 0,
                volume24h: 0,
                lastUpdated: new Date()
            };
            
            updateTokenDisplay();
            statusText.textContent = 'Token not found on DexScreener (may be new)';
        }
        
    } catch (error) {
        console.error('Error fetching token data:', error);
        statusText.textContent = 'Failed to fetch token data';
        showToast('Failed to update token data', 'error');
    } finally {
        statusIcon.classList.remove('spinning');
    }
}

// Update token display with fetched data
function updateTokenDisplay() {
    // Update price
    const priceElement = document.getElementById('token-price');
    if (priceElement) {
        priceElement.textContent = tokenData.price > 0 
            ? `$${tokenData.price.toFixed(6)}` 
            : '$0.00';
    }
    
    // Update price change
    const changeElement = document.getElementById('price-change');
    if (changeElement) {
        const change = tokenData.priceChange24h;
        const isPositive = change > 0;
        const isNegative = change < 0;
        
        changeElement.className = `price-change ${
            isPositive ? 'positive' : isNegative ? 'negative' : ''
        }`;
        
        changeElement.innerHTML = `
            <i class="fas fa-${isPositive ? 'arrow-up' : isNegative ? 'arrow-down' : 'minus'}"></i>
            ${change !== 0 ? `${change > 0 ? '+' : ''}${change.toFixed(2)}%` : '0%'}
        `;
    }
    
    // Update market cap
    const marketCapElement = document.getElementById('market-cap');
    if (marketCapElement) {
        marketCapElement.textContent = tokenData.marketCap > 0 
            ? formatCurrency(tokenData.marketCap) 
            : '$0';
    }
    
    // Update 24h volume
    const volumeElement = document.getElementById('volume-24h');
    if (volumeElement) {
        volumeElement.textContent = tokenData.volume24h > 0 
            ? formatCurrency(tokenData.volume24h) 
            : '$0';
    }
    
    // Update last updated time
    const lastUpdatedElement = document.getElementById('last-updated');
    if (lastUpdatedElement && tokenData.lastUpdated) {
        lastUpdatedElement.textContent = tokenData.lastUpdated.toLocaleTimeString();
    }
}

// Format currency values
function formatCurrency(value) {
    if (value >= 1e9) {
        return `$${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
        return `$${(value / 1e6).toFixed(2)}M`;
    } else if (value >= 1e3) {
        return `$${(value / 1e3).toFixed(2)}K`;
    } else {
        return `$${value.toFixed(2)}`;
    }
}

// Token action functions
function buyToken() {
    const pumpFunUrl = `https://pump.fun/${TOKEN_CONTRACT}`;
    window.open(pumpFunUrl, '_blank');
}

function viewOnDexScreener() {
    const dexScreenerUrl = `https://dexscreener.com/solana/${TOKEN_CONTRACT}`;
    window.open(dexScreenerUrl, '_blank');
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

// Stream functions
function scrollToStream() {
    const streamSection = document.getElementById('stream');
    if (streamSection) {
        const offsetTop = streamSection.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function loadStream(source) {
    const iframe = document.getElementById('primary-stream');
    const fallback = document.getElementById('stream-fallback');
    
    let streamUrl;
    switch(source) {
        case 'youtube':
            streamUrl = 'https://www.youtube.com/embed/Aj1oRNbGJl8?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1';
            break;
        case 'zoodio':
            streamUrl = 'https://www.zoodio.live';
            break;
        case 'moodeng-tv':
            streamUrl = 'https://moodeng.tv';
            break;
        default:
            streamUrl = 'https://www.youtube.com/embed/Aj1oRNbGJl8?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1';
    }
    
    iframe.src = streamUrl;
    fallback.style.display = 'none';
}

function openExternalStream() {
    window.open('https://youtu.be/Aj1oRNbGJl8', '_blank');
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
    }
}

function shareStream() {
    if (navigator.share) {
        navigator.share({
            title: '🦛 MOODENG Live Stream',
            text: 'Watch Moodeng the pygmy hippo live 24/7!',
            url: window.location.href
        });
    } else {
        copyContractAddress();
        showToast('Stream URL copied to clipboard!');
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    // Set contract addresses in display elements
    const contractElements = document.querySelectorAll('#contract-address, #contract-address-display');
    contractElements.forEach(el => {
        el.textContent = TOKEN_CONTRACT;
    });
    
    // Initial token data fetch
    fetchTokenData();
    
    // Set up periodic updates
    setInterval(fetchTokenData, UPDATE_INTERVAL);
    
    console.log('🦛 MOODENG Live initialized!');
    console.log(`Token Contract: ${TOKEN_CONTRACT}`);
    console.log(`Update Interval: ${UPDATE_INTERVAL / 1000}s`);
});

// Add CSS for animations and toast notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .spinning {
        animation: spin 1s linear infinite;
    }
    
    .toast {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #1f2937;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 8px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .toast.show {
        transform: translateX(0);
    }
    
    .toast-success {
        border-left: 4px solid #10b981;
    }
    
    .toast-error {
        border-left: 4px solid #ef4444;
    }
    
    .contract-display {
        margin: 20px 0;
        padding: 16px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .contract-label {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.8);
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .contract-address-hero {
        display: flex;
        align-items: center;
        gap: 12px;
        background: rgba(0, 0, 0, 0.2);
        padding: 12px;
        border-radius: 8px;
    }
    
    .contract-address-hero .address-text {
        font-family: 'Space Grotesk', monospace;
        font-size: 14px;
        color: #fff;
        word-break: break-all;
        flex: 1;
    }
    
    .copy-btn-hero {
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: #fff;
        padding: 8px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .copy-btn-hero:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.05);
    }
    
    .data-status {
        margin-top: 30px;
        padding: 20px;
        background: rgba(0, 0, 0, 0.02);
        border-radius: 12px;
        border: 1px solid rgba(0, 0, 0, 0.05);
    }
    
    .status-item {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        font-size: 14px;
        color: #6b7280;
    }
    
    .last-updated {
        font-size: 12px;
        color: #9ca3af;
    }
`;
document.head.appendChild(style);