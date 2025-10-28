// SurfNetwork Minecraft Website - Enhanced JavaScript

import {
    getDB,
    getState,
    clear,
    redirect,
    fetchWithTimeout,
    setState
} from './util.js';
import { PumpkinEasterEgg } from './pumpkin-easter-egg.js';
import { halloweenBats, halloweenFog } from './halloween-easter-egg.js';
import { initEvents } from './events.js';
import { initForum, updateForumList } from './forums.js';

EQuery(async function () {
    initLoadingScreen();
    // initThemeToggle();
    initContactForm();

    EQuery.includeHTML()

    let userdata;
    getDB(state => {
        if (state !== undefined && state.userdata !== undefined) {
            userdata = state.userdata;
        }
    });

    // Initialize server stats and start polling
    async function initServerPolling() {
        // Initial stats fetch
        await getStats();
        await updateServerStatus();

        // Set up polling intervals
        setInterval(getStats, 30000);
        setInterval(updateServerStatus, 30000);
    }

    async function getStats() {
        try {    
            const response = await fetchWithTimeout('https://surfnetwork-api.onrender.com/get-server-stats', {
                timeout: 5000 // 5 second timeout
            });

            if (!response || !response.status) {
                throw new Error('Invalid server response');
            }

            // Update UI elements
            EQuery('#ip').text(response.ip || 'Unavailable');
            EQuery('#serverStatus')
                .removeClass('bg-success bg-fail')
                .addClass(response.status.online ? 'bg-success' : 'bg-fail')
                .text(response.status.online ? 'Online' : 'Offline');
            
            // Animate player count
            const currentPlayers = Number(EQuery('#online-players').text()) || 0;
            animateNumber(EQuery('#online-players')[0], currentPlayers, response.status.count, 200);
            
            // Update other stats
            EQuery('#serverVersion').text(response.status.version || '1.21.5');
            EQuery('#serverUptime').text(response.status.uptime || '0');
            EQuery('#totalPlayers').text(response.status.total || '0');
            EQuery('#playerCount').text(response.status.count || '0');
            EQuery('#playersAvg').text(response.status.average || '0');

        } catch (e) {
            console.error('Failed to fetch server stats:', e);
            
            // Set offline state
            EQuery('#ip').text('Unavailable');
            EQuery('#serverStatus').removeClass('bg-success').addClass('bg-fail').text('Offline');
            EQuery('#online-players').text('0');
            EQuery('#uptime').text('0');
            EQuery('#rating').text('0');
            EQuery('#serverVersion').text('1.21.5');
            EQuery('#serverUptime').text('0');
            EQuery('#totalPlayers').text('0');
            EQuery('#playerCount').text('0');
            EQuery('#playersAvg').text('0');
            
            showMessage('Server status unavailable. Please try again later.', 'error');
        }
    }

    async function updateServerStatus() {
        try {
            const response = await fetchWithTimeout('https://surfnetwork-api.onrender.com/player-count', {
                method: 'post',
                timeout: 5000
            });

            if (!response || !response.status) {
                throw new Error('Invalid response');
            }

            const currentCount = response.status.count;
            const maxCount = response.status.max;
            
            const playerCountElements = document.querySelectorAll('#playerCount');
            playerCountElements.forEach(element => {
                element.textContent = `${currentCount}/${maxCount} Players`;
            });

        } catch (e) {
            console.error('Failed to update player count:', e);
        }
    }

    // Start server polling
    initServerPolling().catch(err => {
        console.error('Failed to initialize server polling:', err);
        showMessage('Unable to connect to server. Please refresh the page.', 'error');
    });

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
        // Initialize all components directly
        try {
            // Initialize core components first
            initHeroSlider();
            initNavigation();
            initHeroAnimations();
            
            // Then initialize visual elements
            initParticleEffects();
            initScrollAnimations();
            initMinecraftEffects();
            
            // Finally initialize interactive elements
            initStore();
            initAdminMessages();
            initServerStats();
            initEvents();
            updateForumList();
            initCopyIP();

            // Initialize forum if on forum page
            if (window.location.pathname.includes('forums')) {
                initForum();
            }

            // Hide loading screen immediately
            const loadingScreen = EQuery('#loading-screen');
            if (loadingScreen) {
                loadingScreen.css('display: none');
            }
        } catch (error) {
            console.error('Initialization error:', error);
        }
    }
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

    // Simple Hero Slider initializer using existing markup (.swiper-slide, .button-prev, .button-next)
    function initHeroSlider() {
        try {
            const wrapper = EQuery('.hero .swiper-wrapper');
            const slides = Array.from(wrapper.find('.swiper-slide'));
            if (!slides.length) return;

            // Find initial active slide or default to 0
            let current = slides.findIndex(s => EQuery(s).hasClass('swiper-slide-active'));
            if (current === -1) current = 0;

            // Animated slide change with enter/exit classes
            function changeSlide(newIndex, dir) {
                if (newIndex === current) return;
                const prev = EQuery(slides[current]);
                const next = EQuery(slides[newIndex]);

                // Clean classes
                prev.removeClass('slide-enter-left', 'slide-enter-right', 'slide-exit-left', 'slide-exit-right');
                next.removeClass('slide-enter-left', 'slide-enter-right', 'slide-exit-left', 'slide-exit-right');

                // Direction: 'next' means new slide comes from right -> prev exits left
                if (dir === 'next') {
                    next.addClass('slide-enter-right');
                    // Force reflow so transition starts
                    // eslint-disable-next-line no-unused-expressions
                    next.offsetHeight;
                    next.addClass('swiper-slide-active');
                    prev.addClass('slide-exit-left');
                } else {
                    next.addClass('slide-enter-left');
                    // eslint-disable-next-line no-unused-expressions
                    next.offsetHeight;
                    next.addClass('swiper-slide-active');
                    prev.addClass('slide-exit-right');
                }

                // After animation, clean up classes and set current
                setTimeout(() => {
                    prev.removeClass('swiper-slide-active', 'slide-exit-left', 'slide-exit-right');
                    next.removeClass('slide-enter-left', 'slide-enter-right');
                    current = newIndex;
                    // update dots if present
                    if (typeof setActiveDot === 'function') setActiveDot(current);
                }, 820); // matches CSS transition (~800ms)
            }

            const prevBtn = wrapper.find('.button-prev');
            const nextBtn = wrapper.find('.button-next');

            prevBtn.click(() => {
                const nextIndex = (current - 1 + slides.length) % slides.length;
                changeSlide(nextIndex, 'prev');
                resetAutoplay();
            });

            nextBtn.click(() => {
                const nextIndex = (current + 1) % slides.length;
                changeSlide(nextIndex, 'next');
                resetAutoplay();
            });

            // Keyboard support
            EQuery(document).keydown(e => {
                if (e.key === 'ArrowLeft') prevBtn && prevBtn.click();
                if (e.key === 'ArrowRight') nextBtn && nextBtn.click();
            });

            // Autoplay
            let autoplay = setInterval(() => {
                const nextIndex = (current + 1) % slides.length;
                changeSlide(nextIndex, 'next');
            }, 5000);

            let paused = false;

            function pauseAutoplay() {
                paused = true;
                clearInterval(autoplay);
            }

            function resumeAutoplay() {
                if (!paused) return; // only resume if previously paused
                paused = false;
                autoplay = setInterval(() => {
                    const nextIndex = (current + 1) % slides.length;
                    changeSlide(nextIndex, 'next');
                }, 5000);
            }

            function resetAutoplay() {
                clearInterval(autoplay);
                if (!paused) {
                    autoplay = setInterval(() => {
                        const nextIndex = (current + 1) % slides.length;
                        changeSlide(nextIndex, 'next');
                    }, 5000);
                }
            }

            // Touch/swipe support
            let startX = 0;
            wrapper.touchstart(e => {
                startX = e.touches[0].clientX;
            });
            wrapper.touchend(e => {
                const endX = e.changedTouches[0].clientX;
                const dx = endX - startX;
                if (Math.abs(dx) > 50) {
                    if (dx > 0) prevBtn[0] && prevBtn[0].click();
                    else nextBtn[0] && nextBtn[0].click();
                }
            });

            // Pause on hover (desktop) and resume on leave
            wrapper.mouseenter(() => pauseAutoplay());
            wrapper.mouseleave(() => resumeAutoplay());

            // Create dot indicators
            const dotsContainer = EQuery.elemt('div', null, 'slider-dots');
            const dots = [];
            slides.forEach((s, i) => {
                const dot = EQuery.elemt('div', null, `dot${i === current ? ' active' : ''}`);
                dot.click(() => {
                    changeSlide(i, i > current ? 'next' : 'prev');
                    resetAutoplay();
                });
                dots.push(dot);
                dotsContainer.append(dot);
            });
            wrapper.append(dotsContainer);

            function setActiveDot(idx) {
                dots.forEach((d, i) => {
                    if (i === idx) EQuery(d).addClass('active');
                    else EQuery(d).removeClass('active');
                });
            }

            // Ensure initial state: clear classes and set the initial active slide and dots
            slides.forEach((s, i) => {
                EQuery(s).removeClass('swiper-slide-active', 'slide-enter-left', 'slide-enter-right', 'slide-exit-left', 'slide-exit-right');
                if (i !== current) {
                    // keep non-active slides hidden (CSS will handle display)
                }
            });
            EQuery(slides[current]).addClass('swiper-slide-active');
            if (typeof setActiveDot === 'function') setActiveDot(current);
        } catch (err) {
            console.error('initHeroSlider error', err);
        }
    }

    // Navigation functionality
    function initNavigation() {
        const hamburger = EQuery('.hamburger');
        const navMenu = EQuery('.nav-menu');
        const navLinks = EQuery('.nav-link[href*=\'#\']');
        const acctBtn = EQuery('#account-btn');
        const dropdownMenu = EQuery('#secondary-dropmenu');
        const logoutBtn = EQuery('.dropdown .logout');
        const pointerRing = EQuery.elemt('div').css('left: 0;top: 0;width: 0;height: 0;padding: 1.5rem;border: .1px solid #f1f1f1;position: fixed;border-radius: 10rem;transition: transform .1s;pointer-events: none;z-index: 9999;')
        const pointerDot = EQuery.elemt('div').css('left: 0;top: 0;margin-top: -.5rem;margin-left: -.3rem;width: 0;height: 0;border: 2.5px solid #b29a7b;position: fixed;border-radius: .4rem;pointer-events: none;transition: border-color 0.5s, transform;z-index: 9999;')
        let state = getState();
        let pointerdown = false;
        let expandNav = false;
        let dropdown = false;

        EQuery('body').prepend([pointerDot, pointerRing]);

        // Mobile menu toggle
        hamburger.click(function () {
            expandNav = !expandNav
            if (expandNav) {
                hamburger.addClass('active');
                navMenu.addClass('active');
            } else {
                hamburger.removeClass('active');
                navMenu.removeClass('active');
            }

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
                acctBtn.find('span.material-symbols-outlined').text('keyboard_arrow_up');
            } else {
                dropdownMenu.css('animation: slideInDown 0.3s ease forwards reverse');
                setTimeout(function () {dropdownMenu.hide()}, 300);
                acctBtn.find('span.material-symbols-outlined').text('keyboard_arrow_down');
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
                        acctBtn.find('span.material-symbols-outlined').text('keyboard_arrow_down');
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
                    acctBtn.find('span.material-symbols-outlined').text('keyboard_arrow_down');
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
        navLinks.click(function (e) {
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

        EQuery(document).mousemove(function (e) {
            pointerDot.css(`border-color: rgb(171, 171, 171);transform: translate(${e.x}px, ${e.y}px);`);
            pointerRing.css(`border-color: rgb(241, 241, 241);transform: translate(calc(${e.x}px - ${pointerdown ? 14 : 26}px), calc(${e.y}px - ${pointerdown ? 14 : 26}px));`);
        });

        EQuery(document).mousedown(function (e) {
            pointerdown = true;
            pointerRing.css('padding: 10px');
            pointerDot.css(`border-color: rgb(171, 171, 171);transform: translate(${e.x}px, ${e.y}px);`);
            pointerRing.css(`border-color: rgb(241, 241, 241);transform: translate(calc(${e.x}px - ${pointerdown ? 14 : 26}px), calc(${e.y}px - ${pointerdown ? 14 : 26}px));`);
        });

        EQuery(document).mouseup(function (e) {
            pointerdown = false;
            pointerRing.css('padding: 25px');
            pointerDot.css(`border-color: rgb(171, 171, 171);transform: translate(${e.x}px, ${e.y}px);`);
            pointerRing.css(`border-color: rgb(241, 241, 241);transform: translate(calc(${e.x}px - ${pointerdown ? 14 : 26}px), calc(${e.y}px - ${pointerdown ? 14 : 26}px));`);
        })

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

        if (state.confirm_email === false) {
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
            volumeToggleBtn.find('.music-icon span').text(isMuted ? 'volume_off' : 'volume_up');
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
        categoryBtns.click(function () {
            const category = this.getAttribute('data-category');

            // Update active button
            categoryBtns.removeClass('active');
            EQuery(this).addClass('active');

            // Animate category change
            productCards.each((i, card) => {
                if (card.getAttribute('data-category') === category) {
                    EQuery(card).show().css('animation: fadeIn .5s ease');
                } else {
                    EQuery(card).css('animation: fadeOut .5s ease');
                    setTimeout(() => {
                        EQuery(card).hide();
                    }, 500);
                }
            });
        });

        // Add to cart functionality with animation
        buyBtns.click(async function () {
            const productId = this.getAttribute('data-product');
            const product = products[productId];
            const state = getState();

            if (state.userdata === undefined) {
                showMessage('You require an account to make a purchase', 'warn');
                return;
            }

            if (state.userdata.confirm_email === false) {
                showMessage('You require a verified email to make a purchase', 'warn');
                return;
            }

            if (product) {
                try {                
                    // Animate button
                    EQuery(this).css('background-color: var(--minecraft-green)').html('<div class="loading"></div> Adding...');
                    const response = await fetchWithTimeout(`https://surfnetwork-api.onrender.com/confirm-purchase?user-id=${state.userdata.id}&product-id=${productId}`);

                    if (response.ok) {
                        addToCart(product)
                    } else {
                        showMessage(`Purchase failed: ${response.message}`, 'error');
                    }
                    EQuery(this).css('background: ').text('Purchase');
                } catch (e) {
                    showMessage('Failed to fetch server stats. Timedout 30000ms.', 'error');
                }
            }
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
            state.cart = cart;
            setState(state);
            if (cart.length === 0) {
                cartSummary.hide();
                return;
            }

            cartSummary.show();
            cartItems.removeChildren();

            cart.forEach((item, index) => {
                const btn = EQuery.elemt('button', 'Remove').css('background: var(--minecraft-red); border: 2px solid var(--minecraft-black); color: var(--text-primary); padding: 8px 15px; font-family: \'Minecraft\', monospace; font-weight: 700; cursor: pointer; transition: all 0.2s ease;');
                const cartItem = EQuery.elemt('div', [
                    EQuery.elemt('div', [
                        EQuery.elemt('span', item.name).css('font-family: \'Minecraft\', monospace;color: var(--bg-primary);font-weight: 700;'),
                        EQuery.elemt('div', [
                            EQuery.elemt('span', `$${item.price.toFixed(2)}`).css('font-family: \'Minecraft\', monospace; font-weight: 700; color: var(--minecraft-green);'), btn
                        ]).css('display: flex; align-items: center; gap: 15px;')
                    ]).css('display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 2px solid var(--minecraft-black);')
                ]);
                btn.click(() => removeFromCart(index));
                cartItems.append(cartItem);
            });

            cartTotal.text(total.toFixed(2));
        }

        // Remove from cart (global function)
        window.removeFromCart = function (index) {
            total -= cart[index].price;
            cart.splice(index, 1);
            updateCartDisplay();
        };

        // Checkout functionality
        checkoutBtn.click(function () {
            const _this = this;
            if (cart.length === 0) {
                showMessage('Your cart is empty!', 'error');
                return;
            }

            // Simulate checkout process
            EQuery(this).attr({disabled: true}).html('<div class="loading"></div> Processing...');

            setTimeout(() => {
                showMessage('Purchase successful! Check your email for confirmation.', 'success');
                cart = [];
                total = 0;
                updateCartDisplay();
                EQuery(_this).attr({disabled: false}).text('Checkout');
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
                    EQuery(entry.target).addClass('visible');
                } else {
                    EQuery(entry.target).removeClass('visible');
                }
            });
        }, observerOptions);

        // Add animation classes to elements
        const animatedElements = EQuery('.feature-card, .product-card, .event-card, .forum-category, .contact-item, .stat-card, .feature-item').addClass('fade-in');
        const animatedFadeInUp = EQuery('.h2-baslik, .custom-button, footer .logo, .footer-info, .footer-social').addClass('fadeInUp');
        const animatedFadeInRight = EQuery('.contact-form, .about-item, .footer-quick-links, .forum-cta').addClass('fadeInRight');
        animatedElements.each((i, el) => {
            observer.observe(el);
        });
        animatedFadeInUp.each((i, el) => {
            observer.observe(el);
        });
        animatedFadeInRight.each((i, el) => {
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

    async function initAdminMessages() {
        const list = EQuery('#member_list_staff_members');
        const prevBtn = EQuery('#admin-message-list .pagination a:first-child');
        const indexCount = EQuery('#admin-message-list .pagination a:nth-child(2)');
        const nextBtn = EQuery('#admin-message-list .pagination a:last-child');
        const itemsCount = 5;
        let index = 0;
        let messages = {};
        
        try {
            const response = await fetchWithTimeout('https://surfnetwork-api.onrender.com/get-admin-messages');
            messages = response;
        } catch (e) {
            showMessage(`Failed to fetch admin data: ${e}`, 'error');
            messages = {
                page: [],
                pageCount: 0
            };
        }

        const pageCount = messages.pageCount;
        const pages = messages.page;
        const chunk = setChunk(0, pageCount > itemsCount ? itemsCount : 1, pages);

        updateAdminMessages(index, chunk);

        function updateAdminMessages(i, chunk) {
            const max = chunk.length;
            if (pageCount === 0) return;
            let pages = chunk[i];
            list.removeChildren();

            pages.forEach(page => {
                let badges = [];

                for (let j = 0; j < page.badges; j++) {
                    badges.push(EQuery.elemt('span', page.badge[j].content, `badge ${page.badge[j].badgeType}`));
                }

                let elt = EQuery.elemt('div', [
                    EQuery.elemt('div', [
                        EQuery.elemt('img', null, 'avatar-img members-staff-av e-round-medium', {src: page.imageSource}),
                        EQuery.elemt('div', [
                            EQuery.elemt('span', [
                                page.playerName,
                                ...badges
                            ], 'username', null, `color: ${page.assentColor}`),
                            EQuery.elemt('div', [EQuery.elemt('span', page.playerDetails, 'ui e-opacity e-small')], 'description')
                        ], 'flex-grow-1')
                    ], 'e-flex list-header'),
                    EQuery.elemt('div', [
                        EQuery.elemt('div', page.messageContent, 'admin-message'),
                        EQuery.elemt('div', page.timeDiff, 'message-details e-small e-opacity')
                    ], 'list-content')
                ], 'e-marin-bottom list-container');
                list.append(elt);
            });

            indexCount.text(i + 1);
            prevBtn.removeClass('disabled');
            nextBtn.removeClass('disabled');
            if (i === 0) prevBtn.addClass('disabled');
            else if (i === max - 1) nextBtn.addClass('disabled');
        }

        prevBtn.click(function () {
            index -= index !== 0 ? 1 : 0;
            updateAdminMessages(index, chunk);
        });

        nextBtn.click(function () {
            index += index !== chunk.length - 1 ? 1 : 0;
            updateAdminMessages(index, chunk);
        });

        function setChunk(start, count, items) {
            let arr = [];
            
            while (items.length > count) {
                arr.push([...items.splice(start, count)]);
            }

            arr.push([...items]);
            
            return arr;
        }
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
        const color = EQuery(event.target).getStyleValue('background-color')

        for (let i = 0; i < 8; i++) {
            const particle = EQuery.elemt('div')
                .css(`position: fixed;left: ${centerX}px;top: ${centerY}px;width:4px;height: 4px;background: ${color};border: .5px solid var(--minecraft-black);border-radius:0;pointer-events: none;z-index: 1000`);

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

        const message = EQuery.elemt('div', text, `message ${type}`, null, 'position: fixed;top: 40px;left: 12px;z-index: 9999');

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
    let konamiCode = {};
    const easterEggs = {
        'ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,b,a': function () {
            EQuery('body>* *').css('animation: rainbow 2s ease-in-out infinite');
            showMessage('🎉 Party easter egg 🎉', 'success');
            setTimeout(() => {
                EQuery('body>* *').css('animation: none');
            }, 6000);
        },
        'ArrowUp,ArrowRight,ArrowUp,ArrowRight,ArrowDown,ArrowLeft,ArrowDown,ArrowLeft,h,a,l,l,o,w,e,e,n': halloweenEasterEgg,
        '3,1,h,a,l,l,o,w,e,e,n': function () {
            const easterEgg = new PumpkinEasterEgg();
            easterEgg.triggerPumpkinAnimation();
        }
    }

    for (let codes in easterEggs) {
        konamiCode[codes] = [];
    }

    EQuery(document).keydown(function (e) {
        for (let codes in easterEggs) {
            konamiCode[codes].push(e.key);
            if (konamiCode[codes].length > codes.split(',').length) {
                konamiCode[codes].shift();
            }
            if (konamiCode[codes].join(',') === codes) {
                easterEggs[codes]();
                konamiCode[codes] = []
                break;
            }
        }
    });

    function halloweenEasterEgg() {
        let canvas = new EQuery.canvas();
        let target = EQuery.elemt('div', [
            EQuery.elemt('div', canvas.domElement).css('position: relative;top: 0;left: 0;height: 100%;width: 100%'),
            EQuery.elemt('img', null, null, {src: '/assets/circle-samhain.png'}, 'position: absolute;top: 20px;right: 80px;z-index: 10;height: 20%;width: 20%;')
        ]).css('position: fixed;top:0;left: 0;height: 100vh;width: 100vw;background: #00000013;z-index: 999;animation: fadeIn .3s');
        EQuery('body').append(target);

        let c = halloweenFog(canvas);
        let h = halloweenBats({
            target: target
        });
        setTimeout(function () {
            target.css('animation: .5s fadeOut');
            setTimeout(() => {
                target.remove();
                h.stop();
            }, 500);
        }, 30000);
        
        showMessage('Happy Halloween!', 'halloween');
    }

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
    setInterval(() => {
        // Random helpful tips
        const tips = [
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
            "Happy Halloween 🎃",
            "Join us in out Halloween party",
            "The frights are here!"
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