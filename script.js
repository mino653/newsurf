// SurfNetwork Minecraft Website - Enhanced JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initLoadingScreen();
    initThemeToggle();
    initNavigation();
    initMusicPlayer();
    initStore();
    initScrollAnimations();
    initContactForm();
    initCopyIP();
    initParticleEffects();
    initServerStats();
    initMinecraftEffects();
});

// Theme Toggle
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    // Theme toggle functionality
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Add transition effect
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    });
}

function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// Loading Screen
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Simulate loading
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        // Start animations after loading
        setTimeout(() => {
            initHeroAnimations();
        }, 500);
    }, 3000);
}

// Hero Animations
function initHeroAnimations() {
    const titleWords = document.querySelectorAll('.title-word');
    const subtitle = document.querySelector('.subtitle-text');
    const buttons = document.querySelector('.hero-buttons');
    const stats = document.querySelector('.server-stats');
    
    // Animate title words
    titleWords.forEach((word, index) => {
        setTimeout(() => {
            word.style.animation = 'wordSlideIn 0.8s ease forwards';
        }, index * 200);
    });
    
    // Animate subtitle
    setTimeout(() => {
        subtitle.style.animation = 'fadeIn 1s ease forwards';
    }, 800);
    
    // Animate buttons
    setTimeout(() => {
        buttons.style.animation = 'fadeIn 1s ease forwards';
    }, 1000);
    
    // Animate stats
    setTimeout(() => {
        stats.style.animation = 'fadeIn 1s ease forwards';
    }, 1200);
}

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Animate hamburger bars
        const bars = hamburger.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            if (hamburger.classList.contains('active')) {
                bar.style.transform = `rotate(${index === 0 ? 45 : index === 1 ? 0 : -45}deg) translate(${index === 0 ? '5px, 5px' : index === 1 ? '0, 0' : '5px, -5px'})`;
            } else {
                bar.style.transform = 'none';
            }
        });
    });

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            
            // Reset hamburger bars
            const bars = hamburger.querySelectorAll('.bar');
            bars.forEach(bar => {
                bar.style.transform = 'none';
            });
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = 'var(--minecraft-white)';
            navbar.style.backdropFilter = 'none';
        }
    });
}

// Music Player functionality
function initMusicPlayer() {
    const musicPlayer = document.getElementById('music-player');
    const playPauseBtn = document.getElementById('play-pause');
    const nextSongBtn = document.getElementById('next-song');
    const volumeToggleBtn = document.getElementById('volume-toggle');
    const closeMusicBtn = document.getElementById('close-music');
    const currentSongSpan = document.getElementById('current-song');
    const popupSongName = document.getElementById('popup-song-name');
    const nowPlayingPopup = document.getElementById('now-playing-popup');

    // Custom music tracks
    const musicTracks = [
        { name: 'SurfNetwork Theme', generator: 'surfTheme' },
        { name: 'Adventure Awaits', generator: 'adventureTheme' },
        { name: 'Mining Melody', generator: 'miningTheme' },
        { name: 'Crafting Symphony', generator: 'melody' },
        { name: 'End Dimension', generator: 'adventureTheme' }
    ];

    let currentTrackIndex = 0;
    let isPlaying = false;
    let isMuted = false;
    let musicGenerator = null;
    let autoHideTimer = null;
    let interactionTimer = null;

    // Initialize music generator
    async function initMusicGenerator() {
        if (window.MusicGenerator) {
            musicGenerator = new window.MusicGenerator();
            await musicGenerator.init();
        }
    }

    // Play/Pause functionality
    playPauseBtn.addEventListener('click', async function() {
        if (!musicGenerator) {
            await initMusicGenerator();
        }

        if (isPlaying) {
            if (musicGenerator) {
                musicGenerator.stopTrack();
            }
            playPauseBtn.innerHTML = '<span class="music-icon">▶</span>';
            isPlaying = false;
        } else {
            if (musicGenerator) {
                const currentTrack = musicTracks[currentTrackIndex];
                musicGenerator.playTrack(currentTrack.name);
                isPlaying = true;
                playPauseBtn.innerHTML = '<span class="music-icon">⏸</span>';
                showNowPlayingPopup();
            } else {
                showMessage('Music generator not available. Using fallback audio.', 'info');
                playPauseBtn.innerHTML = '<span class="music-icon">⏸</span>';
                isPlaying = true;
            }
        }
    });

    // Next song functionality
    nextSongBtn.addEventListener('click', async function() {
        currentTrackIndex = (currentTrackIndex + 1) % musicTracks.length;
        updateCurrentSong();
        showNowPlayingPopup();
        
        if (isPlaying && musicGenerator) {
            musicGenerator.stopTrack();
            const currentTrack = musicTracks[currentTrackIndex];
            musicGenerator.playTrack(currentTrack.name);
        }
    });

    // Volume toggle
    volumeToggleBtn.addEventListener('click', function() {
        isMuted = !isMuted;
        volumeToggleBtn.innerHTML = isMuted ? '<span class="music-icon">🔇</span>' : '<span class="music-icon">🔊</span>';
    });

    // Close music player
    closeMusicBtn.addEventListener('click', function() {
        musicPlayer.classList.add('hidden');
        if (musicGenerator && isPlaying) {
            musicGenerator.stopTrack();
            isPlaying = false;
            playPauseBtn.innerHTML = '<span class="music-icon">▶</span>';
        }
    });

    // Auto-hide functionality
    function startAutoHideTimer() {
        clearTimeout(autoHideTimer);
        autoHideTimer = setTimeout(() => {
            if (!musicPlayer.classList.contains('hidden')) {
                musicPlayer.classList.add('auto-hidden');
            }
        }, 5000);
    }

    function resetAutoHideTimer() {
        clearTimeout(autoHideTimer);
        musicPlayer.classList.remove('auto-hidden');
        startAutoHideTimer();
    }

    // Add event listeners for interaction
    musicPlayer.addEventListener('mouseenter', function() {
        musicPlayer.classList.remove('auto-hidden');
        clearTimeout(autoHideTimer);
    });

    musicPlayer.addEventListener('mouseleave', function() {
        startAutoHideTimer();
    });

    // Track any interaction with music player
    const musicPlayerElements = musicPlayer.querySelectorAll('button');
    musicPlayerElements.forEach(element => {
        element.addEventListener('click', resetAutoHideTimer);
        element.addEventListener('mouseenter', resetAutoHideTimer);
    });

    // Update current song display
    function updateCurrentSong() {
        const currentTrack = musicTracks[currentTrackIndex];
        currentSongSpan.textContent = currentTrack.name;
        popupSongName.textContent = currentTrack.name;
    }

    // Show now playing popup
    function showNowPlayingPopup() {
        nowPlayingPopup.classList.add('show');
        setTimeout(() => {
            nowPlayingPopup.classList.remove('show');
        }, 3000);
    }

    // Initialize
    updateCurrentSong();
    initMusicGenerator();
    
    // Start auto-hide timer
    startAutoHideTimer();
    
    // Auto-start music after a delay
    setTimeout(() => {
        if (!isPlaying) {
            playPauseBtn.click();
        }
    }, 4000);
}

// Store functionality
function initStore() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const productCards = document.querySelectorAll('.product-card');
    const buyBtns = document.querySelectorAll('.buy-btn');
    const cartSummary = document.getElementById('cart-summary');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    let cart = [];
    let total = 0;

    // Product data
    const products = {
        'vip': { name: 'VIP Rank', price: 9.99, category: 'ranks' },
        'mvp': { name: 'MVP Rank', price: 19.99, category: 'ranks' },
        'elite': { name: 'Elite Rank', price: 39.99, category: 'ranks' },
        'coins-1000': { name: '1000 Coins', price: 4.99, category: 'coins' },
        'coins-5000': { name: '5000 Coins', price: 19.99, category: 'coins' },
        'coins-10000': { name: '10000 Coins', price: 34.99, category: 'coins' },
        'rainbow-trail': { name: 'Rainbow Trail', price: 2.99, category: 'cosmetics' },
        'firework-cape': { name: 'Firework Cape', price: 4.99, category: 'cosmetics' },
        'xp-booster': { name: 'XP Booster', price: 7.99, category: 'boosters' },
        'coin-booster': { name: 'Coin Booster', price: 7.99, category: 'boosters' }
    };

    // Category filtering with animation
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Animate category change
            productCards.forEach(card => {
                if (card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease';
                } else {
                    card.style.animation = 'fadeOut 0.3s ease';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Add to cart functionality with animation
    buyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-product');
            const product = products[productId];
            
            if (product) {
                addToCart(product);
                
                // Animate button
                this.innerHTML = '<div class="loading"></div> Adding...';
                this.style.background = 'var(--minecraft-green)';
                
                setTimeout(() => {
                    this.innerHTML = 'Purchase';
                    this.style.background = '';
                }, 2000);
            }
        });
    });

    // Add item to cart
    function addToCart(product) {
        cart.push(product);
        total += product.price;
        updateCartDisplay();
        showMessage(`${product.name} added to cart!`, 'success');
        
        // Animate cart
        cartSummary.style.animation = 'slideInDown 0.3s ease';
    }

    // Update cart display
    function updateCartDisplay() {
        if (cart.length === 0) {
            cartSummary.style.display = 'none';
            return;
        }

        cartSummary.style.display = 'block';
        cartItems.innerHTML = '';

        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.style.animation = 'fadeIn 0.3s ease';
            cartItem.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 2px solid var(--minecraft-black);">
                    <span style="font-family: 'Minecraft', monospace; font-weight: 700;">${item.name}</span>
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <span style="font-family: 'Minecraft', monospace; font-weight: 700; color: var(--minecraft-green);">$${item.price.toFixed(2)}</span>
                        <button onclick="removeFromCart(${index})" style="background: var(--minecraft-red); border: 2px solid var(--minecraft-black); color: var(--minecraft-white); padding: 8px 15px; font-family: 'Minecraft', monospace; font-weight: 700; cursor: pointer; transition: all 0.2s ease;">Remove</button>
                    </div>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });

        cartTotal.textContent = total.toFixed(2);
    }

    // Remove from cart (global function)
    window.removeFromCart = function(index) {
        total -= cart[index].price;
        cart.splice(index, 1);
        updateCartDisplay();
    };

    // Checkout functionality
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            showMessage('Your cart is empty!', 'error');
            return;
        }

        // Simulate checkout process
        this.innerHTML = '<div class="loading"></div> Processing...';
        this.disabled = true;

        setTimeout(() => {
            showMessage('Purchase successful! Check your email for confirmation.', 'success');
            cart = [];
            total = 0;
            updateCartDisplay();
            this.innerHTML = 'Checkout';
            this.disabled = false;
        }, 2000);
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('.feature-card, .product-card, .contact-item, .stat-card, .feature-item');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const floatingBlocks = document.querySelectorAll('.floating-block');
        const particles = document.querySelectorAll('.particle');
        
        floatingBlocks.forEach((block, index) => {
            const speed = 0.5 + (index * 0.1);
            block.style.transform = `translateY(${scrolled * speed}px)`;
        });
        
        particles.forEach((particle, index) => {
            const speed = 0.3 + (index * 0.05);
            particle.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Simulate form submission
        submitBtn.innerHTML = '<div class="loading"></div> Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            showMessage('Message sent successfully! We\'ll get back to you soon.', 'success');
            this.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Copy IP functionality
function initCopyIP() {
    const copyIPBtn = document.getElementById('copy-ip-btn');
    
    copyIPBtn.addEventListener('click', function() {
        const ip = 'play.surfnetwork.com';
        
        // Try to copy to clipboard
        if (navigator.clipboard) {
            navigator.clipboard.writeText(ip).then(() => {
                showMessage('Server IP copied to clipboard!', 'success');
                this.innerHTML = '<div class="btn-icon">✓</div><div class="btn-text"><span class="btn-main">Copied!</span><span class="btn-sub">play.surfnetwork.com</span></div>';
                this.style.background = 'var(--minecraft-green)';
                
                setTimeout(() => {
                    this.innerHTML = '<div class="btn-icon">🌐</div><div class="btn-text"><span class="btn-main">Copy IP</span><span class="btn-sub">play.surfnetwork.com</span></div>';
                    this.style.background = '';
                }, 2000);
            });
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = ip;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showMessage('Server IP copied to clipboard!', 'success');
        }
    });
}

// Particle effects
function initParticleEffects() {
    const particlesContainer = document.querySelector('.particles');
    
    // Add more dynamic particles
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Server stats animation
function initServerStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.textContent);
        if (!isNaN(target)) {
            animateNumber(stat, 0, target, 2000);
        }
    });
}

// Animate number counting
function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * progress);
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Minecraft-specific effects
function initMinecraftEffects() {
    // Add block break effect to buttons
    const buttons = document.querySelectorAll('.minecraft-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Create block break particles
            createBlockBreakEffect(this);
        });
    });
    
    // Add hover effects to cards
    const cards = document.querySelectorAll('.feature-card, .product-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '6px 6px 0 var(--minecraft-shadow)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '4px 4px 0 var(--minecraft-shadow)';
        });
    });
}

// Create block break effect
function createBlockBreakEffect(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = 'var(--minecraft-green)';
        particle.style.border = '1px solid var(--minecraft-black)';
        particle.style.borderRadius = '0';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1000';
        
        const angle = (i / 8) * Math.PI * 2;
        const velocity = 50 + Math.random() * 50;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        document.body.appendChild(particle);
        
        let x = 0;
        let y = 0;
        let opacity = 1;
        
        const animate = () => {
            x += vx * 0.016;
            y += vy * 0.016;
            vy += 200 * 0.016; // gravity
            opacity -= 0.02;
            
            particle.style.transform = `translate(${x}px, ${y}px)`;
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                document.body.removeChild(particle);
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// Utility function to scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Show message function
function showMessage(text, type = 'info') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    
    // Add to top of page
    document.body.insertBefore(message, document.body.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        message.remove();
    }, 5000);
}

// Add CSS for fadeOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0.8); }
    }
`;
document.head.appendChild(style);

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.keyCode);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Easter egg activated!
        showMessage('🎉 Easter egg found! You\'re awesome! 🎉', 'success');
        
        // Add some fun effects
        document.body.style.animation = 'rainbow 2s ease-in-out';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 2000);
        
        konamiCode = [];
    }
});

// Add rainbow animation for easter egg
const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        25% { filter: hue-rotate(90deg); }
        50% { filter: hue-rotate(180deg); }
        75% { filter: hue-rotate(270deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(rainbowStyle);

// Add some human-like touches
setTimeout(() => {
    // Random helpful tips
    const tips = [
        "💡 Tip: Use the music player to set the perfect gaming mood!",
        "🎮 Pro tip: Join our Discord for exclusive events and giveaways!",
        "⭐ Don't forget to rate us 5 stars if you enjoy the server!",
        "🎁 Check out our daily rewards for free items!",
        "🏆 Compete on our leaderboards for amazing prizes!",
        "🔥 New players get a welcome bonus - join now!",
        "💎 VIP members get exclusive access to special areas!",
        "🎵 Try different music tracks for different vibes!",
        "📱 Follow us on social media for updates!",
        "🌟 We're always adding new features - stay tuned!"
    ];
    
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    showMessage(randomTip, 'info');
}, 15000);

// Add more personal touches
setTimeout(() => {
    // Show a welcome message with server info
    const welcomeMessages = [
        "Welcome to SurfNetwork! 🏄‍♂️",
        "Ready for an epic Minecraft adventure? ⚔️",
        "Join thousands of players worldwide! 🌍",
        "Your Minecraft journey starts here! 🚀"
    ];
    
    const randomWelcome = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
    showMessage(randomWelcome, 'success');
}, 8000);

// Simulate online player count changes
setInterval(() => {
    const playerCount = document.getElementById('online-players');
    if (playerCount) {
        const currentCount = parseInt(playerCount.textContent);
        const change = Math.floor(Math.random() * 6) - 3; // -3 to +3
        const newCount = Math.max(50, Math.min(200, currentCount + change));
        
        if (newCount !== currentCount) {
            animateNumber(playerCount, currentCount, newCount, 1000);
        }
    }
}, 30000); // Update every 30 seconds

// Add typing effect to hero title
function addTypingEffect() {
    const titleWords = document.querySelectorAll('.title-word');
    titleWords.forEach((word, index) => {
        const text = word.textContent;
        word.textContent = '';
        word.style.opacity = '1';
        
        setTimeout(() => {
            let i = 0;
            const typeInterval = setInterval(() => {
                word.textContent += text.charAt(i);
                i++;
                if (i >= text.length) {
                    clearInterval(typeInterval);
                }
            }, 100);
        }, index * 1000);
    });
}

// Initialize typing effect after page load
setTimeout(addTypingEffect, 2000);