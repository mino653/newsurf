// SurfNetwork Minecraft Website - Enhanced JavaScript

import {
    getDB,
    getState,
    clear,
    redirect
} from './util.js';

EQuery(async function () {
    // Initialize all features
    
    initLoadingScreen();
    initThemeToggle();
    initContactForm();

    let userdata;
    getDB(state => {
        if (state.userdata !== undefined) {
            const loginLink = EQuery('#loginNavLink');
            userdata = state.userdata;
            loginLink.removeChildren()
                .removeAttr('href')
                .click(showUserMenu)
                .append([EQuery.elemt('i', null, 'fas fa-user me-2'), userdata.username]);
        }
    });

    const ipRevealBtn = EQuery('#ipRevealBtn');
    const ipDisplay = EQuery('#ipDisplay');
    const themeIcon = EQuery('#themeIcon');

    function showUserMenu(e) {
        e.preventDefault();
        // Create dropdown menu for user options
        const existingMenu = EQuery('.user-menu');
        if (existingMenu[0]) {
            existingMenu.remove();
            return;
        }

        const btn1 = EQuery.elemt('a', [
            EQuery.elemt('i', null, 'fas fa-user me-2'), 'Profile'
        ], 'd-block text-decoration-none text-dark py-2');
        const btn2 = EQuery.elemt('a', [
            EQuery.elemt('i', null, 'fas fa-shopping-bag me-2'), 'My Purchases'
        ], 'd-block text-decoration-none text-dark py-2');
        const btn3 = EQuery.elemt('a', [
            EQuery.elemt('i', null, 'fas fa-sign-out-alt me-2'), 'Logout'
        ], 'd-block text-decoration-none text-dark py-2');

        btn1.click(() => redirect('./profile.html'));
        // btn2.click(() => redirect('./profile.html')); IDK
        btn3.click(() => redirect('./logout.html'));

        const menu = EQuery.elemt('div', [
            EQuery.elemt('div', [
                EQuery.elemt('div', [
                    EQuery.elemt('i', null, 'fas fa-user text-white')
                ], 'avatar bg-primary rounded-circle d-flex align-items-center justify-content-center me-3', null, 'width: 40px;height: 40px'),
                EQuery.elemt('div'[
                    EQuery.elemt('div', userdata.username, 'fw-bold'),
                    EQuery.elemt('small', userdata.email, 'text-muted')
                ])
            ], 'd-flex align-items-center mb-3'),
            EQuery.elemt('hr'),
            btn1, btn2, btn3
        ], 'user-menu position-absolute bg-white border rounded shadow-lg p-3', null, 'top: 100%; right: 0; min-width: 200px; z-index: 1000;');

        const navbar = EQuery('.navbar-nav');
        const loginItem = navbar.find('li:last-child');
        loginItem.css('position: relative')
        loginItem.append(menu);

        // Close menu when clicking outside
        setTimeout(() => {
            EQuery(document).click(function closeMenu(e) {
                if (!menu[0].contains(e.target)) {
                    menu.remove();
                    EQuery(document).off('click')
                }
            });
        }, 100);
    }

    getStats();
    setInterval(getStats, 30000);

    async function getStats() {
        let response = await (await fetch('https://surfnetwork-api.onrender.com/get-server-stats', { method: 'post' })).json();

        EQuery('#ip').text(response.ip);
        console.log(response)
        EQuery('#serverStatus').addClass(response.status.online ? 'bg-success' : 'bg-fail').text(response.status.online ? 'Online' : 'Offline');
        EQuery('#playersCount').text(response.status.count + '/' + response.max + ' Players');
        EQuery('#serverVersion').text(response.status.version);
        EQuery('#serverUptime').text(response.status.uptime);
        EQuery('#totalPlayers').text(response.status.total);
        EQuery('#playerCount').text(response.status.count);
        EQuery('#playersAvg').text(response.status.average);
    }

    async function updateServerStatus() {
        const playerCountElement = document.getElementById('playerCount');
        if (playerCountElement) {
            setInterval(async function () {
                let response = await (await fetch('https://surfnetwork-api.onrender.com/player-count', { method: 'post' })).json().catch(function (e) {
                    throw new Error(e);
                });
                const currentCount = response.status.count;
                const maxCount = response.status.max;
                playerCountElement.textContent = `${currentCount}/${maxCount} Players`;
            }, 5000);
        }
    }

    // Theme Toggle
    function initThemeToggle() {
        const themeToggle = EQuery('#theme-toggle');
        const themeIcon = themeToggle.find('.theme-icon');

        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        EQuery(document.documentElement).attr('data-theme', savedTheme);
        updateThemeIcon(savedTheme);

        // Theme toggle functionality
        themeToggle.click(function () {
            const currentTheme = EQuery(document.documentElement).getAttr('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            EQuery(document.documentElement).attr('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);

            // Add transition effect
            EQuery('body').css('transistion: all .3s ease');
            setTimeout(() => {
                EQuery('body').css('transistion: ');
            }, 300);
        });
    }

    function updateThemeIcon(theme) {
        const themeIcon = EQuery('.theme-icon');
        themeIcon.find('span').text(theme === 'dark' ? 'clear_day' : 'bedtime');
    }

   // Loading Screen with rotating messages - stops when loading is done
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingText = document.getElementById('loading-text');
    
    // Array of loading messages
    const loadingMessages = [
        'Loading chunks...',
        'Spawning entities...',
        'Generating terrain...',
        'Building structures...',
        'Loading textures...',
        'Preparing world...',
        'Initializing server...',
        'Connecting to database...',
        'Loading player data...',
        'Almost there...'
    ];
    
    let messageIndex = 0;
    let isFirstLoad = true;
    let messageTimer = null;
    let isLoading = true;
    
    // Function to change loading message
    function changeLoadingMessage() {
        if (!isLoading) return; // Stop if loading is done
        
        if (isFirstLoad) {
            // First message stays longer
            messageTimer = setTimeout(() => {
                isFirstLoad = false;
                messageIndex = 1;
                loadingText.textContent = loadingMessages[messageIndex];
                changeLoadingMessage();
            }, 2000);
        } else {
            // Cycle through messages
            messageTimer = setTimeout(() => {
                if (!isLoading) return; // Check again before changing
                
                messageIndex = (messageIndex + 1) % loadingMessages.length;
                loadingText.textContent = loadingMessages[messageIndex];
                
                // Keep cycling every 2 seconds
                changeLoadingMessage();
            }, 2000);
        }
    }
    
    // Start cycling messages
    changeLoadingMessage();
    
    // Function to stop loading
    function stopLoading() {
        isLoading = false;
        clearTimeout(messageTimer); // Stop message cycling
        
        // Show final message
        loadingText.textContent = 'Done!';
        loadingText.style.animation = 'none';
        
        // Hide loading screen after showing final message
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            
            // Start animations after loading
            setTimeout(() => {
                initHeroAnimations();
            }, 500);
        }, 1000);
    }
    
    // Check if page is fully loaded
    if (document.readyState === 'complete') {
        stopLoading();
    } else {
        window.addEventListener('load', function() {
            // Small delay to ensure everything is loaded
            setTimeout(stopLoading, 500);
        });
    }
    
    // Fallback: stop loading after maximum time (10 seconds)
    setTimeout(() => {
        if (isLoading) {
            stopLoading();
        }
    }, 10000);
}

    // Hero Animations
    function initHeroAnimations() {
        const titleWords = EQuery('.title-word');
        const subtitle = EQuery('.subtitle-text');
        const buttons = EQuery('.hero-buttons');
        const stats = EQuery('.server-stats');

        // Animate title words
        titleWords.each((index, word) => {
            setTimeout(() => {
                word.style.animation = 'wordSlideIn 0.8s ease forwards';
            }, index * 200);
        });

        // Animate subtitle
        setTimeout(() => {
            subtitle.css('animations: fadeIn 1s ease forwards');
        }, 800);

        // Animate buttons
        setTimeout(() => {
            buttons.css('animation: fadeIn 1s ease forwards');
        }, 1000);

        // Animate stats
        setTimeout(() => {
            stats.css('animation: fadeIn 1s ease forwards');
        }, 1200);
    }

    // Navigation functionality
    function initNavigation() {
        const hamburger = EQuery('.hamburger');
        const navMenu = EQuery('.nav-menu');
        const navLinks = EQuery('.nav-link');
        const acctBtn = EQuery('#account-btn');
        const dropdownMenu = EQuery('#secondary-dropmenu');
        const logoutBtn = EQuery('.dropdown .logout');
        let state = getState();
        let dropdown = false;

        // Mobile menu toggle
        hamburger.click(function () {
            hamburger.toggleClass('active');
            navMenu.toggleClass('active');

            // Animate hamburger bars
            const bars = hamburger.find('.bar');
            bars.each((index, bar) => {
                if (hamburger.hasClass('active')) {
                    EQuery(bar).css(`transform: rotate(${index === 0 ? 45 : index === 1 ? 0 : -45}deg) translate(${index === 0 ? '5px, 5px' : index === 1 ? '0, 0' : '5px, -5px'})${index === 1 ? ' scaleX(.1)' : ''}`);
                } else {
                    EQuery(bar).css('transform: none');
                }
            });
        });

        acctBtn.click(function () {
            dropdown = !dropdown;
            if (dropdown) {
                dropdownMenu.show().css('animation: slideInDown 0.3s ease forwards');
                acctBtn.find('span').text('keyboard_arrow_up');
            } else {
                dropdownMenu.css('animation: slideInDown 0.3s ease forwards reverse');
                setTimeout(function () {dropdownMenu.hide()}, 300);
                acctBtn.find('span').text('keyboard_arrow_down');
            }
        });

        EQuery(document).click(function (e) {
            let exceptions = (() => {
                let arr = []
                EQuery('.dropdown, .dropdown *').each((i, elt) => {
                    arr.push(elt);
                });
                return arr;
            })();
            let navExceptions = (() => {
                let arr = [];
                EQuery('.nav-menu, .nav-menu *, .hamburger, .hamburger *').each((i, elt) => {
                    arr.push(elt);
                });
                return arr;
            })();
            if (e.path) {
                let elts = e.path;
                for (let i = 0;i < elts.length;i++) {
                    if (exceptions.indexOf(elts[i]) === -1) {
                        dropdown = false;
                        dropdownMenu.css('animation: slideInDown 0.3s ease forwards reverse');
                        setTimeout(function () {dropdownMenu.hide()}, 300);
                        acctBtn.find('span').text('keyboard_arrow_down');
                    }

                    if (navExceptions.indexOf(elts[i]) === -1) {
                        navMenu.removeClass('active');
                        hamburger.find('.bar').css('transform: none');
                    }
                    break;
                }
            } else {
                if (exceptions.indexOf(e.target) === -1) {
                    dropdown = false;
                    dropdownMenu.css('animation: slideInDown 0.3s ease forwards reverse');
                    setTimeout(function () {dropdownMenu.hide()}, 300);
                    acctBtn.find('span').text('keyboard_arrow_down');
                }
                
                if (navExceptions.indexOf(e.target) === -1) {
                    navMenu.removeClass('active');
                    hamburger.find('.bar').css('transform: none');
                }
            }
        });

        logoutBtn.click(clear);

        // Close mobile menu when clicking on links
        navLinks.click(function () {
            hamburger.removeClass('active');
            navMenu.removeClass('active');

            // Reset hamburger bars
            const bars = hamburger.find('.bar');
            bars.css('transform: none');
        });

        // Smooth scrolling for navigation links
        navLinks.each((index, link) => {
            EQuery(link).click(function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = EQuery(targetId)[0];

                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Navbar background on scroll
        const scrollBtn = EQuery('#scroll-to-top');
    
        window.addEventListener('scroll', function () {
            const navbar = EQuery('.navbar');
            if (window.scrollY > 50) {
                navbar.css('backdrop-filter: blur(10px);');
            } else {
                navbar.css('backdrop-filter: none');
            }

            if (window.pageYOffset > 300) {
                scrollBtn.addClass('show');
            } else {
                scrollBtn.removeClass('show');
            }
        });

        scrollBtn.click(function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        if (state.userdata !== undefined) {
            EQuery('[data-visibility=loggedin]').show();
            EQuery('[data-visibility=loggedout]').hide();
            EQuery('[data-visibility=invalidemail]').hide();
        } else {
            EQuery('[data-visibility=loggedin]').hide();
            EQuery('[data-visibility=loggedout]').show();
            EQuery('[data-visibility=invalidemail]').hide();
        }

        if (state.confirm_email == false) {
            EQuery('[data-visibility=invalidemail]').show();
        } 
    }

    // Music Player functionality
    function initMusicPlayer() {
        const musicPlayer = EQuery('#music-player');
        const playPauseBtn = EQuery('#play-pause');
        const nextSongBtn = EQuery('#next-song');
        const volumeToggleBtn = EQuery('#volume-toggle');
        const closeMusicBtn = EQuery('#close-music');
        const currentSongSpan = EQuery('#current-song');
        const popupSongName = EQuery('#popup-song-name');
        const nowPlayingPopup = EQuery('#now-playing-popup');

        // Custom music tracks
        const musicTracks = [
            { name: 'SurfNetwork Theme', generator: 'surfTheme' },
            { name: 'Adventure Awaits', generator: 'adventureTheme' },
            { name: 'Mining Melody', generator: 'miningTheme' },
            { name: 'Crafting Symphony', generator: 'melody' },
            { name: 'End Dimension', generator: 'adventureTheme' }
        ];

        let currentTrackIndex = 0;
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
        playPauseBtn.click(async function () {
            if (!musicGenerator) {
                await initMusicGenerator();
            }

            if (musicGenerator) {
                if (musicGenerator.isPlaying) {
                    musicGenerator.stopTrack();
                    musicGenerator.isPlaying = false;
                    playPauseBtn.find('.music-icon span').text('play_arrow');
                } else {
                    const currentTrack = musicTracks[currentTrackIndex];
                    musicGenerator.isPlaying = true;
                    musicGenerator.playTrack(currentTrack.name);
                    playPauseBtn.find('.music-icon span').text('pause');
                    showNowPlayingPopup();
                }
            } else {
                showMessage('Music generator not available. Using fallback audio.', 'info');
                playPauseBtn.find('.music-icon span').text('play_arrow');
                isPlaying = true;
            }
        });

        // Next song functionality
        nextSongBtn.click(async function () {
            currentTrackIndex = (currentTrackIndex + 1) % musicTracks.length;
            updateCurrentSong();
            showNowPlayingPopup();

            if (musicGenerator && musicGenerator.isPlaying) {
                musicGenerator.stopTrack();
                const currentTrack = musicTracks[currentTrackIndex];
                musicGenerator.playTrack(currentTrack.name);
            }
        });

        // Volume toggle
        volumeToggleBtn.click(function () {
            isMuted = !isMuted;
            volumeToggleBtn.find('.music-icon span').text(isMuted ? 'voulume_up' : 'volume_off');
        });

        // Close music player
        closeMusicBtn.click(function () {
            musicPlayer.addClass('hidden');
            if (musicGenerator && musicGenerator.isPlaying) {
                musicGenerator.stopTrack();
                musicGenerator.isPlaying = false;
                playPauseBtn.html('<span class="music-icon">▶</span>');

            }
        });

        // Auto-hide functionality
        function startAutoHideTimer() {
            clearTimeout(autoHideTimer);
            autoHideTimer = setTimeout(() => {
                if (!musicPlayer.hasClass('hidden')) {
                    musicPlayer.addClass('auto-hidden');
                }
            }, 5000);
        }

        function resetAutoHideTimer() {
            clearTimeout(autoHideTimer);
            musicPlayer.removeClass('auto-hidden');
            startAutoHideTimer();
        }

        // Add event listeners for interaction
        musicPlayer.mouseenter(function () {
            musicPlayer.removeClass('auto-hidden');
            clearTimeout(autoHideTimer);
        });

        musicPlayer.mouseleave(function () {
            startAutoHideTimer();
        });

        // Track any interaction with music player
        const musicPlayerElements = musicPlayer.find('button');
        musicPlayerElements.click(resetAutoHideTimer);
        musicPlayerElements.mouseenter(resetAutoHideTimer);

        // Update current song display
        function updateCurrentSong() {
            const currentTrack = musicTracks[currentTrackIndex];
            currentSongSpan.text(currentTrack.name);
            popupSongName.text(currentTrack.name);
        }

        // Show now playing popup
        function showNowPlayingPopup() {
            nowPlayingPopup.addClass('show');
            setTimeout(() => {
                nowPlayingPopup.removeClass('show');
            }, 3000);
        }

        musicPlayer.css('visibility: visible');

        // Initialize
        updateCurrentSong();
        initMusicGenerator();

        // Start auto-hide timer
        startAutoHideTimer();

        // Auto-start music after a delay
        setTimeout(() => {
            if (!musicGenerator.isPlaying) {
                if (playPauseBtn[0]) playPauseBtn[0].click();
            }
        }, 4000);
    }

    // Store functionality
    async function initStore() {
        const categoryBtns = EQuery('.category-btn');
        const productCards = EQuery('.product-card');
        const buyBtns = EQuery('.buy-btn');
        const cartSummary = EQuery('#cart-summary');
        const cartItems = EQuery('#cart-items');
        const cartTotal = EQuery('#cart-total');
        const checkoutBtn = EQuery('#checkout-btn');
        const shoppingBtn = EQuery('#shopping-cart-btn');

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

        // products = await loadProducts();

        // Category filtering with animation
        categoryBtns.each((index, btn) => {
            EQuery(btn).click(function () {
                const category = this.getAttribute('data-category');

                // Update active button
                categoryBtns.each((i, b) => b.removeClass('active'));
                this.addClass('active');

                // Animate category change
                productCards.each(card => {
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
        buyBtns.each(btn => {
            EQuery(btn).click(function () {
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
            cartSummary.css('animation: slideInDown 0.3s ease');
        }

        // Update cart display
        function updateCartDisplay() {
            if (cart.length === 0) {
                cartSummary.hide();
                return;
            }

            cartSummary.show();
            cartItems.html('');

            cart.each((item, index) => {
                const cartItem = EQuery.elemt('div', null, 'cart-item', null, 'animation: fadeIn 0.3s ease');
                cartItem.html(`<div style="display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 2px solid var(--minecraft-black);"><span style="font-family: 'Minecraft', monospace; font-weight: 700;">${item.name}</span><div style="display: flex; align-items: center; gap: 15px;"><span style="font-family: 'Minecraft', monospace; font-weight: 700; color: var(--minecraft-green);">$${item.price.toFixed(2)}</span><button onclick="removeFromCart(${index})" style="background: var(--minecraft-red); border: 2px solid var(--minecraft-black); color: var(--minecraft-white); padding: 8px 15px; font-family: 'Minecraft', monospace; font-weight: 700; cursor: pointer; transition: all 0.2s ease;">Remove</button></div></div>`);
                cartItems.append(cartItem);
            });

            cartTotal.textContent = total.toFixed(2);
        }

        // Remove from cart (global function)
        window.removeFromCart = function (index) {
            total -= cart[index].price;
            cart.splice(index, 1);
            updateCartDisplay();
        };

        // Checkout functionality
        checkoutBtn.click(function () {
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

        shoppingBtn.click(function () {
            scrollToSection('store');
        });
    }

    // Scroll animations
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    EQuery(entry.target).addClass('visible').css('transform:translateY(0px)');
                } else {
                    EQuery(entry.target).removeClass('visible').css('transform:translateY(50px)');
                }
            });
        }, observerOptions);

        // Add animation classes to elements
        const animatedElements = EQuery('.feature-card, .product-card, .contact-item, .stat-card, .feature-item').addClass('fade-in');
        animatedElements.each((i, el) => {
            observer.observe(el);
        });

        // Parallax effect for hero section
        EQuery(window).on('scroll', function () {
            const scrolled = window.pageYOffset;
            const floatingBlocks = EQuery('.floating-block');
            const particles = EQuery('.particle');

            floatingBlocks.each((index, block) => {
                const speed = 0.5 + (index * 0.1);
                block.css(`transform: translateY(${scrolled * speed}px)`);
            });

            particles.each((index, particle) => {
                const speed = 0.3 + (index * 0.05);
                particle.css(`transform: translateY(${scrolled * speed}px)`);
            });
        });
    }

    // Contact form functionality
    function initContactForm() {
        const contactForm = EQuery('#contact-form');

        contactForm.submit(function (e) {
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
        const copyIPBtn = EQuery('#copy-ip-btn');

        copyIPBtn.click(function () {
            const ip = 'play.surfnetwork.xyz';

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
                const textArea = EQuery.elemt('textarea').val(ip);
                EQuery('body').add(textArea);
                textArea[0].select();
                document.execCommand('copy');
                textArea.remove();
                showMessage('Server IP copied to clipboard!', 'success');
            }
        });
    }

    // Particle effects
    function initParticleEffects() {
        const particlesContainer = EQuery('.particles');

        // Add more dynamic particles
        for (let i = 0; i < 20; i++) {
            const particle = EQuery.elemt('div', null, 'particle', null, `left: ${Math.random() * 100}%;animation-delay: ${Math.random() * 8}s;animation-duration: ${Math.random() * 4 + 4}s`);
            particlesContainer.append(particle);
        }
    }

    // Server stats animation
    function initServerStats() {
        const statNumbers = EQuery('.stat-number');

        statNumbers.each((i, stat) => {
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

    function initAdminMessages() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, observerOptions);

        // Observe admin message cards
        const adminCards = EQuery('.admin-message-card');
        adminCards.each((i, card) => {
            EQuery(card).css('animation-play-style: paused');
            observer.observe(card);
        });

        // Add click effect to Steve faces
        const steveFaces = EQuery('.steve-face');
        steveFaces.click(function() {
            EQuery(this).css('animation: none');
            setTimeout(() => {
                EQuery(this).css('animation: steveBounce 2s ease-in-out infinite');
            }, 100);
            
            // Show fun message
            showMessage('Steve says: "Thanks for clicking!" 🎮', 'success');
        });
    }

    // Minecraft-specific effects
    function initMinecraftEffects() {
        // Add block break effect to buttons
        const buttons = EQuery('.minecraft-btn');

        window.addEventListener('click', function (e) {
            if (e.target.classList.contains('minecraft-btn')) {
                createBlockBreakEffect(e);
            }
        });

        // Add hover effects to cards
        const cards = EQuery('.feature-card, .product-card');
        cards.mouseenter(function () {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '6px 6px 0 var(--minecraft-shadow)';
        });

        cards.mouseleave(function () {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '4px 4px 0 var(--minecraft-shadow)';
        });
    }

    // Create block break effect
    function createBlockBreakEffect(event) {
        const centerX = event.x;
        const centerY = event.y;

        for (let i = 0; i < 8; i++) {
            const particle = EQuery.elemt('div')
                .css(`position: fixed;left: ${centerX}px;top: ${centerY}px;width:4px;height: 4px;background: var(--minecraft-green);border: 1px solid var(--minecraft-black);border-radius:0;pointer-events: none;z-index: 1000`);

            const angle = (i / 8) * Math.PI * 2;
            const velocity = 50 + Math.random() * 50;
            let vx = Math.cos(angle) * velocity;
            let vy = Math.sin(angle) * velocity;

            EQuery('body').append(particle);

            let x = 0;
            let y = 0;
            let opacity = 1;

            const animate = () => {
                x += vx * 0.016;
                y += vy * 0.016;
                vy += 200 * 0.016; // gravity
                opacity -= 0.02;

                particle.css(`transform: translate(${x}px, ${y}px);opacity: opacity`);

                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    particle.remove();
                }
            };
            requestAnimationFrame(animate);
        }
    }

    // Utility function to scroll to section
    function scrollToSection(sectionId) {
        const section = EQuery(`#${sectionId}`)[0];
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
        const existingMessages = EQuery('.message');
        existingMessages.each((i, msg) => msg.remove());

        const message = EQuery.elemt('div', text, `message ${type}`, null, 'position: fixed;top: 40px;left: 12px;z-index: 99999999');

        // Add to top of page
        EQuery('body').prepend(message);

        // Auto remove after 5 seconds
        setTimeout(() => {
            message.remove();
        }, 5000);
    }

    // Add CSS for fadeOut animation
    const style = EQuery.elemt('style', `
    @keyframes fadeOut {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0.8); }
    }
`);
    EQuery('head').append(style);

    // Easter egg: Konami code
    const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

    let konamiCode = [];
    const easterEggs = {
        '38,38,40,40,37,39,37,39,66,65': function () {
            EQuery('body').css('animation: rainbow 2s ease-in-out infinite');
            setTimeout(() => {
                document.body.style.animation = '';
            }, 6000);
        }
    }

    EQuery(document).keydown(function (e) {
        konamiCode.push(e.keyCode);

        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }

        for (let codes in easterEggs) {
            if (konamiCode.join(',') === codes) {
                showMessage('🎉 Easter egg found! You\'re awesome! 🎉', 'success');
                easterEggs[codes]();
                konamiCode = []
                break;
            }
        }
/*
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            // Easter egg activated!
            showMessage('🎉 Easter egg found! You\'re awesome! 🎉', 'success');

            // Add some fun effects
            EQuery('body').css('animation: rainbow 2s ease-in-out infinite');
            setTimeout(() => {
                document.body.style.animation = '';
            }, 6000);

            konamiCode = [];
        }*/
    });

    // Add rainbow animation for easter egg
    const rainbowStyle = EQuery.elemt('style', `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        25% { filter: hue-rotate(90deg); }
        50% { filter: hue-rotate(180deg); }
        75% { filter: hue-rotate(270deg); }
        100% { filter: hue-rotate(360deg); }
    }
`);
    EQuery('head').append(rainbowStyle);

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

    // Add typing effect to hero title
    function addTypingEffect() {
        const titleWords = EQuery('.title-word');
        titleWords.each((index, word) => {
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
});