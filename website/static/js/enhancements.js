/**
 * GGenius Enhanced Interactive Experience
 * Performance-optimized ES2023+ JavaScript for cyberpunk AI platform
 * @version 2.1.0 // Updated version
 * @author MLBB-BOSS
 * @see GGeniusApp
 */

/**
 * @class GGeniusApp
 * @description Main class for initializing and managing the GGenius web application's interactive features.
 * It handles loading sequences, performance monitoring, UI setup, interactions, and advanced features
 * like service workers and PWA installation prompts.
 */
class GGeniusApp {
    /**
     * Initializes the GGeniusApp instance.
     * Sets up properties, binds methods, and starts the initialization process.
     */
    constructor() {
        this.isLoaded = false;
        this.observers = new Map();
        this.animations = new Map(); // Stores requestAnimationFrame IDs
        this.eventListeners = new Map(); // To keep track of listeners for easier removal

        this.settings = {
            soundsEnabled: JSON.parse(localStorage.getItem('ggenius-soundsEnabled')) ?? true,
            musicEnabled: JSON.parse(localStorage.getItem('ggenius-musicEnabled')) ?? false,
        };

        this.audioContext = null;
        this.ambientOscillators = null;
        this.ambientGain = null;
        
        this.performance = {
            startTime: performance.now(),
            metrics: {},
            isLowPerformance: this.detectLowPerformance()
        };
        
        // Bind methods for proper context
        // Using arrow functions for event handlers can sometimes simplify context binding,
        // but explicit bind() is fine and clear.
        this.handleScroll = this.throttle(this._handleScroll.bind(this), 16); // Renamed internal handler
        this.handleResize = this.debounce(this._handleResize.bind(this), 200); // Renamed internal handler
        this.handleVisibilityChange = this._handleVisibilityChange.bind(this); // Renamed internal handler
        
        this.init();
    }

    /**
     * Asynchronously initializes all core components of the application.
     * This includes critical features, performance monitoring, UI elements,
     * interactions, and advanced functionalities.
     * @async
     */
    async init() {
        try {
            console.log(`🚀 GGenius AI Revolution initializing... v${this.getVersion()}`);
            
            document.documentElement.classList.add('js-loaded');
            if (this.performance.isLowPerformance) {
                console.warn("🦥 Low performance mode activated based on initial detection.");
                document.documentElement.classList.add('low-performance-device');
            }

            // Critical path loading sequence
            await this.loadCriticalFeatures(); // DOM caching, loading screen
            this.setupGlobalEventListeners(); // Add early global listeners
            
            // These can start concurrently after critical DOM is ready
            const initialSetupPromises = [
                this.setupPerformanceMonitoring(),
                this.initializeUI(), // UI elements like nav, accordions, tabs
                this.setupInteractions(), // Hover effects, smooth scroll, keyboard nav
            ];
            await Promise.all(initialSetupPromises);
            
            // Advanced features can load last or even be deferred further
            await this.setupAdvancedFeatures(); 
            
            this.isLoaded = true;
            this.trackLoadTime();
            
            console.log('✅ GGenius fully initialized');
            document.dispatchEvent(new CustomEvent('ggenius:loaded'));
            
        } catch (error) {
            console.error('🔥 GGenius initialization failed:', error);
            this.fallbackMode(error);
        }
    }

    /**
     * @returns {string} The current version of the script.
     */
    getVersion() {
        return "2.1.0"; 
    }

    /**
     * Detects if the user's device or connection might offer a low-performance experience.
     * @returns {boolean} True if low performance is detected, false otherwise.
     */
    detectLowPerformance() {
        try {
            const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) {
                console.info("User prefers reduced motion. Activating low performance mode.");
                return true;
            }

            const cpuCores = navigator.hardwareConcurrency;
            const deviceMemory = navigator.deviceMemory; // GB

            const lowSpecCPU = typeof cpuCores === 'number' && cpuCores < 4; // Less than 4 cores
            const lowSpecMemory = typeof deviceMemory === 'number' && deviceMemory < 4; // Less than 4GB RAM

            const connection = navigator.connection;
            const slowConnection = connection?.effectiveType?.includes('2g') || 
                                   (typeof connection?.downlink === 'number' && connection.downlink < 1.5); // Less than 1.5 Mbps

            const isLikelyMobile = window.innerWidth < 768 && window.matchMedia?.('(pointer: coarse)').matches;
            
            let isLowPerf = lowSpecCPU || lowSpecMemory || slowConnection;
            
            if (isLikelyMobile && (lowSpecCPU || lowSpecMemory)) {
                isLowPerf = true; 
            }
            
            console.info(`Performance detection: CPU Cores: ${cpuCores ?? 'N/A'}, Device Memory: ${deviceMemory ?? 'N/A'}GB, Slow Connection: ${slowConnection ?? 'N/A'}, Reduced Motion: ${prefersReducedMotion}, Likely Mobile: ${isLikelyMobile}. Low Perf: ${isLowPerf}`);
            return isLowPerf;
        } catch (e) {
            console.warn("Error in detectLowPerformance:", e);
            return false; // Default to not low performance on error
        }
    }
    
    /**
     * Sets up global event listeners that are needed early or throughout the app lifecycle.
     */
    setupGlobalEventListeners() {
        this._addEventListener(window, 'resize', this.handleResize);
        this._addEventListener(document, 'visibilitychange', this.handleVisibilityChange);
        // Scroll listener for scrollProgress is added in setupScrollEffects if element exists
    }

    /**
     * Loads critical features and caches essential DOM elements.
     * Manages the loading screen simulation.
     * @async
     */
    async loadCriticalFeatures() {
        this.loadingScreen = document.getElementById('loadingScreen');
        this.progressBar = document.getElementById('progressBar');
        this.loadingTextElement = document.getElementById('loadingText'); // Renamed to avoid conflict
        
        this.header = document.querySelector('.site-header');
        this.scrollProgress = document.getElementById('scrollProgress') || this.createScrollProgress();
        this.heroSection = document.querySelector('.hero-section');
        this.navMenu = document.querySelector('.nav-menu');
        this.mobileToggle = document.querySelector('.mobile-menu-toggle');
        
        if (this.loadingScreen && !this.performance.isLowPerformance) {
            await this.simulateLoading();
        } else if (this.loadingScreen) {
            this.hideLoadingScreen(true); // Hide immediately in low performance
        }
        
        if (!this.performance.isLowPerformance && window.matchMedia?.('(pointer: fine)').matches && window.innerWidth > 768) {
            this.setupGamingCursor();
        }
    }

    /**
     * Simulates a loading process with progress bar and text updates.
     * @async
     * @returns {Promise<void>} A promise that resolves when loading simulation is complete.
     */
    async simulateLoading() {
        return new Promise((resolve) => {
            if (!this.progressBar || !this.loadingTextElement) {
                this.hideLoadingScreen(true);
                resolve();
                return;
            }

            let progress = 0;
            const messages = [
                'Ініціалізація GGenius AI...', 'Завантаження нейронних мереж...',
                'Підключення до кіберспорт серверів...', 'Активація штучного інтелекту...',
                'Синхронізація з MLBB API...', 'Готовність до революції!'
            ];

            const updateProgress = () => {
                const increment = Math.random() * 15 + 5;
                progress = Math.min(progress + increment, 100);
                
                if (this.progressBar) {
                    // OPTIMIZED: Use transform for progress bar animation
                    this.progressBar.style.transform = `scaleX(${progress / 100})`;
                    this.progressBar.setAttribute('aria-valuenow', String(Math.round(progress)));
                }
                
                const messageIndex = Math.min(Math.floor((progress / 100) * messages.length), messages.length - 1);
                if (this.loadingTextElement && messages[messageIndex] && this.loadingTextElement.textContent !== messages[messageIndex]) {
                    this.updateLoadingText(messages[messageIndex]);
                }
                
                if (progress < 100) {
                    setTimeout(updateProgress, 100 + Math.random() * 150);
                } else {
                    if (this.progressBar) this.progressBar.style.transform = 'scaleX(1)';
                    if (this.loadingTextElement) this.updateLoadingText(messages[messages.length - 1]);
                    setTimeout(() => {
                        this.hideLoadingScreen();
                        resolve();
                    }, 600);
                }
            };
            updateProgress();
        });
    }

    /**
     * Updates the loading text with a fade transition.
     * @param {string} text - The new text to display.
     */
    updateLoadingText(text) {
        if (!this.loadingTextElement) return;
        
        this.loadingTextElement.style.opacity = '0';
        setTimeout(() => {
            this.loadingTextElement.textContent = text;
            this.loadingTextElement.style.opacity = '1';
        }, 150); // Faster transition
    }

    /**
     * Hides the loading screen and triggers entry animations.
     * @param {boolean} [immediate=false] - If true, hides without sound and triggers animations faster.
     */
    hideLoadingScreen(immediate = false) {
        if (!this.loadingScreen || this.loadingScreen.classList.contains('hidden')) return;
        
        this.loadingScreen.classList.add('hidden');
        this.loadingScreen.setAttribute('aria-hidden', 'true');
        
        if (!immediate) {
            this.playSound(800, 0.1, 0.08, 'sine');
        }
        
        setTimeout(() => {
            this.loadingScreen?.remove();
            if (!this.performance.isLowPerformance) { // Only trigger complex entry animations if not low-perf
                this.triggerEntryAnimations();
            }
        }, immediate ? 50 : 500); // Faster if immediate
    }

    /**
     * Creates the scroll progress bar element if it doesn't exist.
     * @returns {HTMLElement} The scroll progress bar element.
     */
    createScrollProgress() {
        const progress = document.createElement('div');
        progress.className = 'scroll-progress'; // CSS should style this with transform-origin: left;
        progress.id = 'scrollProgress';
        progress.setAttribute('role', 'progressbar');
        progress.setAttribute('aria-label', 'Прогрес прокрутки сторінки');
        progress.setAttribute('aria-valuenow', '0');
        progress.setAttribute('aria-valuemin', '0');
        progress.setAttribute('aria-valuemax', '100');
        progress.style.transform = 'scaleX(0)'; // Initial state for JS control
        document.body.prepend(progress);
        return progress;
    }

    /**
     * Sets up performance monitoring, including Web Vitals, memory, and frame rate.
     * @async
     */
    async setupPerformanceMonitoring() {
        if (this.performance.isLowPerformance && !window.location.search.includes('forcePerfMonitoring')) {
            console.info("🦥 Low performance mode: Skipping detailed performance monitoring.");
            return;
        }

        if ('PerformanceObserver' in window) {
            this.setupWebVitalsTracking();
        }
        
        if (performance.memory) {
            this.setupMemoryMonitoring();
        }
        
        // Only run FPS monitoring for a short period or in dev mode to reduce overhead
        if (window.location.hostname === 'localhost' || window.location.search.includes('debugFPS')) {
            this.setupFrameRateMonitoring(30000); // Monitor for 30 seconds then stop
        }
    }

    /**
     * Sets up Web Vitals tracking using a single PerformanceObserver.
     */
    setupWebVitalsTracking() {
        const vitalConfigs = {
            'FCP': { entryTypes: ['paint'], name: 'first-contentful-paint' },
            'LCP': { entryTypes: ['largest-contentful-paint'] },
            'FID': { entryTypes: ['first-input'] },
            'CLS': { entryTypes: ['layout-shift'] },
            // TTFB is often better measured server-side or via navigation timing directly
            // 'TTFB': { entryTypes: ['navigation'], name: 'responseStart' } // Example for TTFB
        };

        const supportedEntryTypes = PerformanceObserver.supportedEntryTypes || [];

        try {
            const observerCallback = (list) => {
                for (const entry of list.getEntries()) {
                    let vitalNameFound = null;
                    for (const vitalName in vitalConfigs) {
                        const config = vitalConfigs[vitalName];
                        if (config.entryTypes.includes(entry.entryType) || (config.name && entry.name === config.name)) {
                            vitalNameFound = vitalName;
                            break;
                        }
                    }

                    if (vitalNameFound) {
                        const value = entry.value !== undefined ? entry.value : (entry.startTime || entry.duration);
                        // LCP and CLS can have multiple entries, take the latest/cumulative
                        if (vitalNameFound === 'LCP' || vitalNameFound === 'CLS' || this.performance.metrics[vitalNameFound] === undefined) {
                             this.performance.metrics[vitalNameFound] = value;
                             console.log(`📊 ${vitalNameFound}:`, value.toFixed(2));
                        }
                    }
                }
            };
            
            const observer = new PerformanceObserver(observerCallback);
            const typesToObserve = new Set();

            for (const vitalName in vitalConfigs) {
                vitalConfigs[vitalName].entryTypes.forEach(type => {
                    if (supportedEntryTypes.includes(type)) {
                        typesToObserve.add(type);
                    }
                });
            }
            
            if (typesToObserve.size > 0) {
                observer.observe({ entryTypes: Array.from(typesToObserve), buffered: true });
                this.observers.set('perf-vitals', observer);
            } else {
                console.warn("No supported entry types for Web Vitals observation.");
            }

        } catch (error) {
            console.warn('Failed to setup Web Vitals tracking:', error);
        }
    }
    
    /**
     * Sets up periodic memory usage monitoring.
     */
    setupMemoryMonitoring() {
        const intervalId = setInterval(() => {
            if (!performance.memory) { // Check again in case it became unavailable
                clearInterval(intervalId);
                return;
            }
            const memory = performance.memory;
            this.performance.metrics.memory = {
                used: Math.round(memory.usedJSHeapSize / 1048576), // MB
                total: Math.round(memory.totalJSHeapSize / 1048576),
                limit: Math.round(memory.jsHeapSizeLimit / 1048576)
            };
            
            if ((memory.usedJSHeapSize / memory.jsHeapSizeLimit) > 0.85) { // Threshold 85%
                console.warn('🚨 High memory usage detected:', this.performance.metrics.memory);
                this.optimizeMemory(); // Attempt to free up resources
            }
        }, 60000); // Check every 60 seconds
        this.memoryMonitorInterval = intervalId; // Store to clear later
    }

    /**
     * Sets up frame rate (FPS) monitoring for a limited duration or continuously.
     * @param {number} [durationMs=0] - Duration to monitor FPS in milliseconds. 0 for continuous.
     */
    setupFrameRateMonitoring(durationMs = 0) {
        let frameCount = 0;
        let lastTime = performance.now();
        let rafId;
        const startTime = performance.now();

        const countFrames = (currentTime) => {
            frameCount++;
            
            if (currentTime - lastTime >= 1000) { // Update FPS every second
                this.performance.metrics.fps = frameCount;
                // console.log(`🕹️ FPS: ${frameCount}`); // Optional: log FPS
                frameCount = 0;
                lastTime = currentTime;
                
                if (!this.performance.isLowPerformance && this.performance.metrics.fps < 25 && this.isLoaded) { // Check after initial load
                    console.warn(`📉 Low FPS detected: ${this.performance.metrics.fps}. Considering dynamic performance adjustments.`);
                    // this.enablePerformanceMode(); // Be cautious with auto-enabling
                }
            }
            
            if (durationMs > 0 && (currentTime - startTime > durationMs)) {
                console.info(`🏁 FPS Monitoring finished after ${durationMs / 1000}s. Last FPS: ${this.performance.metrics.fps || 'N/A'}`);
                cancelAnimationFrame(rafId);
                this.animations.delete('fpsMonitor');
                return;
            }
            rafId = requestAnimationFrame(countFrames);
            this.animations.set('fpsMonitor', rafId);
        };
        
        rafId = requestAnimationFrame(countFrames);
        this.animations.set('fpsMonitor', rafId);
    }

    /**
     * Attempts to optimize memory by clearing unused observers/animations
     * and suggesting garbage collection.
     */
    optimizeMemory() {
        console.log('🧠 Attempting memory optimization...');
        this.observers.forEach((observer, key) => {
            // Improved check for observers that might be tied to non-DOM elements
            if (typeof key === 'string' && !key.startsWith('perf-') && key !== 'intersection' && key !== 'logoAnimation') {
                // More specific logic might be needed if keys are not just selectors
                // For now, assume if a selector-based key's element is gone, observer can be disconnected.
                try {
                    if (document.querySelector(key) === null) {
                        observer.disconnect();
                        this.observers.delete(key);
                        console.log(`🧹 Removed unused observer for selector: ${key}`);
                    }
                } catch (e) { /* Ignore if key is not a valid selector */ }
            }
        });
        
        // This is a placeholder for more advanced animation cleanup if needed
        // this.animations.forEach((rafId, key) => { ... });
        
        if (window.gc) {
            try {
                console.log('Suggesting garbage collection (dev environments)...');
                window.gc();
            } catch (e) { console.warn("window.gc() failed.", e); }
        }
    }

    /**
     * Enables performance mode by adding a class to the body and potentially disabling heavy features.
     * This is a more aggressive version of `low-performance-device` class.
     */
    enablePerformanceMode() {
        if (document.documentElement.classList.contains('performance-mode-active')) return;
        
        document.documentElement.classList.add('performance-mode-active', 'low-performance-device');
        console.warn('🎛️ Aggressive performance mode dynamically enabled.');
        
        // Optionally, disable very heavy JS-driven effects here
        if (this.animations.has('gamingCursor')) {
            cancelAnimationFrame(this.animations.get('gamingCursor'));
            this.animations.delete('gamingCursor');
            document.querySelector('.gaming-cursor')?.remove();
            console.info("Disabled gaming cursor for performance.");
        }
        // Stop background music if any
        this.stopAmbientMusic();
        document.querySelector('.music-toggle')?.remove();

        // Dispatch an event that other components can listen to for disabling features
        document.dispatchEvent(new CustomEvent('ggenius:performancemodeenabled'));
    }

    /**
     * Initializes core UI components like navigation, scroll effects, accordions, etc.
     * @async
     */
    async initializeUI() {
        // These can run in parallel
        await Promise.all([
            this.setupNavigation(),
            this.setupScrollEffects(),
            this.setupAccordions(),
            this.setupTabs(),
            this.setupModals(),
            this.setupForms()
        ]);
    }

    /**
     * Sets up navigation, including mobile menu toggle and smooth scrolling.
     */
    setupNavigation() {
        if (!this.mobileToggle || !this.navMenu) {
            console.warn("Mobile toggle or nav menu not found. Skipping mobile navigation setup.");
        } else {
            this._addEventListener(this.mobileToggle, 'click', (e) => {
                e.preventDefault();
                this.toggleMobileMenu();
            }, 'mobileToggleClick');
        }

        // Smooth scroll for nav links is handled by setupSmoothScrolling globally
        // Active link highlighting on scroll is handled by IntersectionObserver in updateActiveNavigation
        this.setupHeaderScroll(); // Handles header behavior
    }
    
    /**
     * Toggles the mobile navigation menu.
     * @param {boolean} [forceOpen] - Optional. If true, opens the menu. If false, closes it.
     */
    toggleMobileMenu(forceOpen) {
        if (!this.mobileToggle || !this.navMenu) return;

        const shouldBeOpen = typeof forceOpen === 'boolean' ? forceOpen : this.mobileToggle.getAttribute('aria-expanded') !== 'true';
        
        this.mobileToggle.setAttribute('aria-expanded', String(shouldBeOpen));
        this.navMenu.classList.toggle('open', shouldBeOpen);
        document.body.classList.toggle('menu-open', shouldBeOpen); // For potential overflow:hidden or overlay
        
        this.playSound(shouldBeOpen ? 600 : 500, 0.05, 0.07, 'square');
        
        if (shouldBeOpen) {
            this.navMenu.querySelector('a[href], button')?.focus();
        } else {
            this.mobileToggle.focus();
        }
    }

    /**
     * Sets up header behavior on scroll (e.g., sticky, auto-hide).
     * Uses requestAnimationFrame for smoother updates.
     */
    setupHeaderScroll() {
        if (!this.header) return;
        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateHeader = () => {
            const currentScrollY = window.scrollY;
            const isScrolledDown = currentScrollY > lastScrollY && currentScrollY > this.header.offsetHeight;
            
            if (currentScrollY > 50) { // Threshold to add 'scrolled' class (e.g., for background change)
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }

            // Auto-hide logic (can be refined based on desired behavior)
            if (isScrolledDown) {
                this.header.classList.add('header-hidden'); // CSS: .header-hidden { transform: translateY(-100%); }
            } else if (currentScrollY < lastScrollY || currentScrollY <= 50) { // Show on scroll up or near top
                this.header.classList.remove('header-hidden');
            }
            
            lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(updateHeader);
                ticking = true;
            }
        };
        this._addEventListener(window, 'scroll', onScroll, 'headerScrollHandler');
        updateHeader(); // Initial check
    }

    /**
     * Sets up scroll-related effects like progress bar and parallax.
     */
    setupScrollEffects() {
        if (this.scrollProgress) {
            this._addEventListener(window, 'scroll', this.handleScroll, 'scrollProgressUpdater');
            this._handleScroll(); // Initial call to set progress
        }
        
        if (this.heroSection && !this.performance.isLowPerformance && document.querySelector('.hero-floating-elements')) {
            this.setupParallax();
        }
        
        this.setupIntersectionObserver(); // For scroll-triggered animations
    }

    /**
     * Internal handler for scroll events, updating the scroll progress bar.
     * Called by the throttled this.handleScroll.
     */
    _handleScroll() { // Renamed to avoid conflict with throttled public method
        if (!this.scrollProgress) return;
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollableHeight <= 0) {
            this.scrollProgress.style.transform = 'scaleX(0)';
            this.scrollProgress.setAttribute('aria-valuenow', '0');
            return;
        }
        const scrollPercentage = (window.scrollY / scrollableHeight);
        const boundedPercentage = Math.max(0, Math.min(scrollPercentage, 1)); // Ensure 0-1 range

        this.scrollProgress.style.transform = `scaleX(${boundedPercentage})`;
        this.scrollProgress.setAttribute('aria-valuenow', String(Math.round(boundedPercentage * 100)));
    }

    /**
     * Sets up parallax scrolling effect for designated elements.
     */
    setupParallax() {
        const parallaxContainer = this.heroSection?.querySelector('.hero-floating-elements');
        if (!parallaxContainer) return;
        const parallaxElements = Array.from(parallaxContainer.querySelectorAll('.floating-gaming-icon'));
        if (parallaxElements.length === 0) return;

        let ticking = false;
        const updateParallax = () => {
            const heroRect = this.heroSection.getBoundingClientRect();
            if (heroRect.bottom < 0 || heroRect.top > window.innerHeight) { // Optimize: only calc if visible
                ticking = false;
                return;
            }

            const scrollY = window.scrollY;
            parallaxElements.forEach((element) => {
                // Ensure data-parallax-speed is a number, fallback to a sensible default
                const speedAttr = element.dataset.parallaxSpeed;
                let speed = parseFloat(speedAttr);
                if (isNaN(speed) || speed <=0 || speed > 1) speed = 0.2 + Math.random() * 0.2; // Random subtle speed

                const yPos = -(scrollY * speed * 0.3); // More subtle effect
                element.style.transform = `translate3d(0, ${yPos.toFixed(2)}px, 0)`;
            });
            ticking = false;
        };
        
        const onScrollParallax = () => {
            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };
        this._addEventListener(window, 'scroll', onScrollParallax, 'parallaxScrollHandler');
        updateParallax(); // Initial call
    }

    /**
     * Sets up IntersectionObserver to trigger animations and other actions when elements enter viewport.
     */
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1, // Single threshold for simplicity, can be array [0.1, 0.5]
            rootMargin: '0px 0px -10% 0px' // Trigger when 10% of element is from bottom
        };

        const observerCallback = (entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target); // Pass only target
                    
                    if (entry.target.id && entry.intersectionRatio > 0.4) { // More than 40% visible
                        this.updateActiveNavigation(entry.target.id);
                    }
                    // Unobserve if it's a one-time animation
                    if (entry.target.dataset.animateOnce === 'true' || entry.target.classList.contains('animate-once')) {
                       obs.unobserve(entry.target);
                       this.observers.delete(`io-${entry.target.id || Math.random().toString(36).substr(2, 9)}`); // Clean up observer map
                    }
                } else {
                    // Optional: Reset animation if element scrolls out and should re-animate
                     if (entry.target.dataset.animateOnce !== 'true' && !entry.target.classList.contains('animate-once')) {
                        entry.target.classList.remove('animate-in', entry.target.dataset.animation || 'fadeInUp', 'animated');
                     }
                }
            });
        };
        
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        const elementsToObserve = document.querySelectorAll(`
            .hero-section > *:not(style):not(script), /* Direct children of hero */
            .features-section-iui, .roadmap-section, .accordion-section, .tech-stack-section,
            .feature-card-iui, .timeline-item, .tech-item,
            [data-aos] /* Generic hook */
        `);
        
        if (elementsToObserve.length > 0) {
            elementsToObserve.forEach((el, index) => {
                observer.observe(el);
                // Store individual observers if needed, or the main one under a general key
                this.observers.set(`io-${el.id || `el-${index}`}`, observer); // Store with a unique key
            });
            // this.observers.set('mainIntersectionObserver', observer); // Or one main observer
        }
    }

    /**
     * Animates an element when it becomes visible in the viewport.
     * @param {HTMLElement} element - The element to animate.
     */
    animateElement(element) {
        if (element.classList.contains('animated') && (element.dataset.animateOnce === 'true' || element.classList.contains('animate-once'))) {
            return; // Don't re-animate if already animated and animate-once
        }

        const animationType = element.dataset.animation || 'fadeInUp';
        const delay = parseInt(element.dataset.delay) || 0;
        
        // Clear any existing animation timeout for this element to prevent multiple triggers
        const existingTimeoutId = this.animations.get(element);
        if (existingTimeoutId) clearTimeout(existingTimeoutId);

        const timeoutId = setTimeout(() => {
            element.classList.add('animate-in', animationType, 'animated');
            this.animations.delete(element); // Remove from map after execution
            
            if (element.classList.contains('stat-number') && element.dataset.target) {
                this.animateCounter(element);
            }
        }, delay);
        this.animations.set(element, timeoutId); // Store timeout ID associated with the element
    }

    /**
     * Animates a number counter from 0 or current text to a target value.
     * @param {HTMLElement} element - The element containing the number.
     */
    animateCounter(element) {
        const target = parseInt(element.dataset.target);
        if (isNaN(target)) {
            console.warn("Invalid data-target for counter:", element.dataset.target, element);
            element.textContent = element.dataset.target || 'N/A'; // Display target if not a number
            return;
        }
        const duration = parseInt(element.dataset.duration) || 1500; // Slightly faster default
        const startTimestamp = performance.now();
        
        // Attempt to parse current text as starting point, fallback to 0
        let initialValue = 0;
        const currentText = element.textContent.replace(/[^\d.-]/g, ''); // Clean non-numeric chars
        if (currentText !== '') {
            initialValue = parseFloat(currentText);
            if (isNaN(initialValue)) initialValue = 0;
        }

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTimestamp;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic function: f(t) = 1 - (1-t)^3
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            let currentValue = initialValue + (target - initialValue) * easedProgress;
            
            // Formatting: if target is integer, round. If float, keep precision.
            if (Number.isInteger(target) && Number.isInteger(initialValue)) {
                currentValue = Math.round(currentValue);
                element.textContent = String(currentValue);
            } else {
                // Determine precision from target or initialValue
                const targetPrecision = (String(target).split('.')[1] || '').length;
                const initialPrecision = (String(initialValue).split('.')[1] || '').length;
                const precision = Math.max(targetPrecision, initialPrecision, 1); // At least 1 decimal for floats
                element.textContent = currentValue.toFixed(precision);
            }
            
            if (progress < 1) {
                const rafId = requestAnimationFrame(updateCounter);
                this.animations.set(`counter-${element.id || Math.random()}`, rafId); // Store to cancel if needed
            } else {
                element.textContent = String(target); // Ensure final value is exact
                this.animations.delete(`counter-${element.id || Math.random()}`);
            }
        };
        requestAnimationFrame(updateCounter);
    }

    /**
     * Updates the active state of navigation links based on the currently visible section.
     * @param {string} sectionId - The ID of the currently visible section.
     */
    updateActiveNavigation(sectionId) {
        if (!sectionId) return;
        document.querySelectorAll('.nav-menu .nav-link').forEach(link => {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
            // Check if href attribute exists and matches
            const href = link.getAttribute('href');
            if (href && href === `#${sectionId}`) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
    }

    /**
     * Sets up accordion functionality with ARIA attributes and smooth animation.
     */
    setupAccordions() {
        document.querySelectorAll('.accordion-section').forEach((accordion, index) => {
            const header = accordion.querySelector('.accordion-header');
            const content = accordion.querySelector('.accordion-content');
            
            if (!header || !content) {
                console.warn("Accordion missing header or content:", accordion);
                return;
            }
            
            const contentId = content.id || `accordion-content-${index}`;
            const headerId = header.id || `accordion-header-${index}`;

            header.id = headerId;
            content.id = contentId;

            header.setAttribute('role', 'button');
            header.setAttribute('aria-controls', contentId);
            header.tabIndex = 0; 

            content.setAttribute('role', 'region');
            content.setAttribute('aria-labelledby', headerId);
            
            const isOpenByDefault = accordion.dataset.openByDefault === 'true' || 
                                  (index === 0 && accordion.dataset.openByDefault !== 'false'); // Open first by default unless specified not to
            
            if (isOpenByDefault) {
                this.openAccordion(header, content, true); // true for initial setup (no animation)
            } else {
                this.closeAccordion(header, content, true); // true for initial setup
            }
            
            const toggleHandler = () => this.toggleAccordion(header, content);
            this._addEventListener(header, 'click', toggleHandler, `accordionClick-${headerId}`);
            this._addEventListener(header, 'keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleHandler();
                }
            }, `accordionKeydown-${headerId}`);
        });
    }

    toggleAccordion(header, content) {
        const isOpen = header.getAttribute('aria-expanded') === 'true';
        if (isOpen) {
            this.closeAccordion(header, content);
        } else {
            this.openAccordion(header, content);
        }
        this.playSound(isOpen ? 480 : 520, 0.04, 0.06, 'triangle');
    }

    openAccordion(header, content, initialSetup = false) {
        header.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
        content.classList.add('active');
        content.setAttribute('aria-hidden', 'false');
        
        // Animate maxHeight
        requestAnimationFrame(() => { // Ensure styles are applied before getting scrollHeight
            const innerContent = content.firstElementChild; // Assume content is wrapped for accurate scrollHeight
            const contentHeight = (innerContent || content).scrollHeight;
            if (initialSetup) {
                content.style.maxHeight = `${contentHeight}px`;
                content.style.transition = 'none'; // No transition on initial setup
                requestAnimationFrame(() => content.style.transition = ''); // Re-enable after setup
            } else {
                content.style.maxHeight = `${contentHeight}px`;
            }
        });
    }

    closeAccordion(header, content, initialSetup = false) {
        header.classList.remove('active');
        header.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = '0px';
        
        const onTransitionEnd = () => {
            content.classList.remove('active');
            content.setAttribute('aria-hidden', 'true');
            content.removeEventListener('transitionend', onTransitionEnd);
        };

        if (initialSetup) {
            content.style.transition = 'none';
            onTransitionEnd(); // Apply immediately
            requestAnimationFrame(() => content.style.transition = '');
        } else {
            content.addEventListener('transitionend', onTransitionEnd, { once: true });
            // Fallback if transitionend doesn't fire (e.g., display:none interrupting)
            setTimeout(onTransitionEnd, 500); // Match CSS transition duration
        }
    }

    /**
     * Sets up tab functionality with ARIA attributes and keyboard navigation.
     */
    setupTabs() {
        document.querySelectorAll('.tabs-component').forEach(tabsComponent => { // Assume a wrapper
            const tabList = tabsComponent.querySelector('[role="tablist"].feature-categories');
            const panelsContainer = tabsComponent.querySelector('.tab-panels-container'); // Assumed container for panels
            
            if (!tabList || !panelsContainer) {
                console.warn("Tabs component is missing tablist or panels container.", tabsComponent);
                return;
            }

            const tabs = Array.from(tabList.querySelectorAll('[role="tab"]'));
            const tabPanels = Array.from(panelsContainer.querySelectorAll('[role="tabpanel"]'));

            if (tabs.length === 0 || tabs.length !== tabPanels.length) {
                console.warn("Mismatch between tabs and tab panels or no tabs found.", tabsComponent);
                return;
            }
            
            // Link tabs to panels if not already done by aria-controls
            tabs.forEach((tab, index) => {
                if (!tab.id) tab.id = `tab-${index}-${Math.random().toString(36).substr(2, 5)}`;
                if (!tabPanels[index].id) tabPanels[index].id = `panel-${index}-${Math.random().toString(36).substr(2, 5)}`;
                
                tab.setAttribute('aria-controls', tabPanels[index].id);
                tabPanels[index].setAttribute('aria-labelledby', tab.id);

                const switchHandler = () => this.switchTab(tab, tabs, tabPanels);
                this._addEventListener(tab, 'click', switchHandler, `tabClick-${tab.id}`);
                this._addEventListener(tab, 'keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        switchHandler();
                    }
                }, `tabKeydown-${tab.id}`);
            });
            
            // Keyboard navigation for tablist
            this._addEventListener(tabList, 'keydown', (e) => {
                 this.handleTabArrowNavigation(e, tabList, tabs, tabPanels);
            }, `tabListKeydown-${tabList.id || 'tabs'}`);

            // Activate initial tab (first one or one with .active class)
            let activeTabIndex = tabs.findIndex(t => t.classList.contains('active'));
            if (activeTabIndex === -1) activeTabIndex = 0;
            
            this.switchTab(tabs[activeTabIndex], tabs, tabPanels, true); // true for initial setup
        });
    }

    switchTab(activeTab, allTabs, allPanels, isInitialSetup = false) {
        allTabs.forEach(tab => {
            tab.classList.remove('active');
            tab.setAttribute('aria-selected', 'false');
            tab.tabIndex = -1; // Not focusable unless active
        });
        
        activeTab.classList.add('active');
        activeTab.setAttribute('aria-selected', 'true');
        activeTab.tabIndex = 0; // Active tab is focusable
        
        const targetPanelId = activeTab.getAttribute('aria-controls');
        allPanels.forEach(panel => {
            if (panel.id === targetPanelId) {
                panel.classList.add('active');
                panel.setAttribute('aria-hidden', 'false');
            } else {
                panel.classList.remove('active');
                panel.setAttribute('aria-hidden', 'true');
            }
        });
        
        if (!isInitialSetup) {
            activeTab.focus(); // Move focus to the newly activated tab
            this.playSound(700, 0.05, 0.07, 'sine');
        }
    }
    
    handleTabArrowNavigation(e, tabList, tabs, tabPanels) {
        const currentTab = e.target.closest('[role="tab"]');
        if (!currentTab) return;

        let currentIndex = tabs.indexOf(currentTab);
        let newIndex = currentIndex;
        const numTabs = tabs.length;

        switch (e.key) {
            case 'ArrowLeft': case 'ArrowUp':
                e.preventDefault();
                newIndex = (currentIndex - 1 + numTabs) % numTabs;
                break;
            case 'ArrowRight': case 'ArrowDown':
                e.preventDefault();
                newIndex = (currentIndex + 1) % numTabs;
                break;
            case 'Home':
                e.preventDefault();
                newIndex = 0;
                break;
            case 'End':
                e.preventDefault();
                newIndex = numTabs - 1;
                break;
            default: return;
        }

        if (newIndex !== currentIndex) {
            // this.switchTab(tabs[newIndex], tabs, tabPanels); // Option 1: Activate on arrow
            tabs[newIndex].focus(); // Option 2: Only move focus, activate on Enter/Space
        }
    }


    /**
     * Sets up modal dialog functionality.
     */
    setupModals() {
        // Assuming .demo-button is the trigger for the specific demo modal
        document.querySelectorAll('.demo-button[data-modal-trigger="demo"]').forEach(button => {
            this._addEventListener(button, 'click', () => {
                this.lastFocusedElementBeforeModal = document.activeElement; // Store focus
                this.showDemoModal();
            }, `demoModalTrigger-${button.id || Math.random()}`);
        });
        
        // Global Escape key listener for modals
        this._addEventListener(document, 'keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal-overlay.show');
                if (openModal) this.closeModal(openModal.id);
            }
        }, 'globalModalEscape');
    }

    showDemoModal() {
        const modalId = 'demo-modal-ggenius';
        if (document.getElementById(modalId)) return; // Prevent multiple demo modals

        const modalContent = `
            <div class="demo-modal-content">
                <div class="ai-avatar">
                    <div class="avatar-glow"></div>
                    <svg class="ai-brain-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12,2A10,10,0,0,0,2,12A10,10,0,0,0,12,22A10,10,0,0,0,22,12A10,10,0,0,0,12,2M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8L10,17Z" /></svg>
                </div>
                <h3>Демо буде доступне незабаром!</h3>
                <p>Ми активно працюємо над революційним AI-інтерфейсом для аналітики MLBB матчів. Підпишіться на оновлення!</p>
                <div class="demo-features">
                    <div class="demo-feature"><span class="feature-icon" aria-hidden="true">🧠</span>Аналіз матчів в реальному часі</div>
                    <div class="demo-feature"><span class="feature-icon" aria-hidden="true">📊</span>Персональні рекомендації</div>
                    <div class="demo-feature"><span class="feature-icon" aria-hidden="true">🎯</span>Прогнози результатів</div>
                </div>
            </div>
        `;
        const modal = this.createModal({
            id: modalId,
            title: 'GGenius AI Demo',
            content: modalContent,
            actions: [
                { text: 'Підписатися на оновлення', primary: true, action: () => { this.closeModal(modalId); this.scrollToNewsletter(); } },
                { text: 'Закрити', action: () => this.closeModal(modalId) }
            ]
        });
        this.showModal(modal);
    }

    createModal({ id, title, content, actions = [] }) {
        const modalTitleId = `${id}-title`;
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = id;
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', modalTitleId);
        
        // Using a template string for cleaner HTML structure
        modal.innerHTML = `
            <div class="modal-container" role="document">
                <header class="modal-header">
                    <h2 id="${modalTitleId}" class="modal-title-text">${title}</h2>
                    <button class="modal-close" aria-label="Закрити модальне вікно" data-close-modal>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </header>
                <div class="modal-body">${content}</div>
                ${actions.length > 0 ? `
                <footer class="modal-actions">
                    ${actions.map((action, index) => 
                        `<button class="modal-action ${action.primary ? 'primary' : ''}" data-action-index="${index}">${action.text}</button>`
                    ).join('')}
                </footer>` : ''}
            </div>
        `;
        
        const closeButton = modal.querySelector('[data-close-modal]');
        if (closeButton) {
             this._addEventListener(closeButton, 'click', () => this.closeModal(id), `modalCloseBtn-${id}`);
        }

        // Close on overlay click
        this._addEventListener(modal, 'click', (e) => {
            if (e.target === modal) this.closeModal(id);
        }, `modalOverlayClick-${id}`);
        
        actions.forEach((actionConfig, index) => {
            const button = modal.querySelector(`.modal-actions [data-action-index="${index}"]`);
            if (button && actionConfig.action) {
                this._addEventListener(button, 'click', actionConfig.action, `modalAction-${id}-${index}`);
            }
        });
        return modal;
    }

    showModal(modal) {
        if (!modal || !modal.id) {
            console.error("Invalid modal element passed to showModal.");
            return;
        }
        // Ensure no other modal is open by ID, or close all if needed
        this.closeModal(); // Closes any currently open modal

        document.body.appendChild(modal);
        document.body.classList.add('modal-open');
        
        // Focus management
        const focusableElements = Array.from(modal.querySelectorAll(
            'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ));
        this.currentModalFocusableElements = focusableElements; // Store for tab trap
        this.firstFocusableElement = focusableElements[0];
        this.lastFocusableElement = focusableElements[focusableElements.length - 1];

        if (this.firstFocusableElement) {
            this.firstFocusableElement.focus();
        } else {
            modal.querySelector('.modal-container')?.setAttribute('tabindex', '-1'); // Make container focusable if nothing else is
            modal.querySelector('.modal-container')?.focus();
        }
        
        requestAnimationFrame(() => modal.classList.add('show')); // Animate in
        this.playSound(600, 0.1, 0.09, 'sine');
    }

    closeModal(modalIdToClose) {
        const modal = modalIdToClose ? document.getElementById(modalIdToClose) : document.querySelector('.modal-overlay.show');
        if (!modal) return;
        
        modal.classList.remove('show');
        modal.classList.add('closing'); // For CSS animation out
        document.body.classList.remove('modal-open');
        
        if (this.lastFocusedElementBeforeModal && typeof this.lastFocusedElementBeforeModal.focus === 'function') {
            this.lastFocusedElementBeforeModal.focus();
            this.lastFocusedElementBeforeModal = null;
        }

        const transitionEndHandler = () => {
            modal.remove();
            // Clean up specific listeners for this modal if they were added with unique keys
            this._removeEventListener(`modalCloseBtn-${modal.id}`);
            this._removeEventListener(`modalOverlayClick-${modal.id}`);
            modal.querySelectorAll('.modal-actions [data-action-index]').forEach((btn, index) => {
                this._removeEventListener(`modalAction-${modal.id}-${index}`);
            });
        };
        
        modal.addEventListener('transitionend', transitionEndHandler, { once: true });
        // Fallback if transitionend doesn't fire
        setTimeout(() => {
            if (modal.parentNode) transitionEndHandler();
        }, 500); // Match CSS animation duration
        
        this.currentModalFocusableElements = [];
    }


    scrollToNewsletter() {
        const newsletterSection = document.querySelector('#contact-form-section .newsletter-form'); // Adjusted selector
        if (newsletterSection) {
            newsletterSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
                newsletterSection.querySelector('input[type="email"]')?.focus({preventScroll: true});
            }, 800); // Increased delay for scroll
        }
    }

    /**
     * Sets up form handling, including newsletter signup and email copying.
     */
    setupForms() {
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) this.setupNewsletterForm(newsletterForm);
        
        document.querySelectorAll('.email-link[data-email]').forEach(button => {
            const email = button.dataset.email;
            if (email) {
                this._addEventListener(button, 'click', () => this.copyToClipboard(email, 'Email адресу'), `copyEmail-${button.id || Math.random()}`);
            }
        });
    }

    setupNewsletterForm(form) {
        this._addEventListener(form, 'submit', async (e) => {
            e.preventDefault();
            const submitButton = form.querySelector('button[type="submit"]');
            const emailInput = form.querySelector('input[type="email"]');
            let emailError = form.querySelector('.error-message#email-error-newsletter'); // Specific ID
            
            if (!emailError && emailInput) { // Create error message display if not present
                emailError = document.createElement('div');
                emailError.id = 'email-error-newsletter';
                emailError.className = 'error-message';
                emailError.setAttribute('role', 'alert');
                emailError.setAttribute('aria-live', 'assertive'); // Assertive for errors
                emailInput.parentNode?.insertBefore(emailError, emailInput.nextSibling);
            }

            const email = emailInput?.value.trim();
            if (!this.validateEmail(email)) {
                this.showError('Будь ласка, введіть коректну email адресу.', emailError, emailInput);
                emailInput?.focus();
                return;
            }
            if(emailError) this.clearError(emailError, emailInput);

            const originalButtonText = submitButton.querySelector('.button-text')?.textContent || 'Приєднатися';
            const loadingText = submitButton.dataset.loading || 'Підписуємо...';
            const successText = submitButton.dataset.success || 'Підписано! ✅';
            
            submitButton.disabled = true;
            if(submitButton.querySelector('.button-text')) submitButton.querySelector('.button-text').textContent = loadingText;
            submitButton.classList.add('loading');
            
            try {
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());

                await this.submitNewsletterSignup(data); // API call
                
                if(submitButton.querySelector('.button-text')) submitButton.querySelector('.button-text').textContent = successText;
                form.reset();
                this.showToast('Дякуємо! Ви успішно підписалися на розсилку.', 'success');
                this.playSound(800, 0.15, 0.1, 'triangle');
                
            } catch (error) {
                console.error('Newsletter signup failed:', error);
                this.showError(error.message || 'Помилка підписки. Спробуйте ще раз.', emailError);
            } finally {
                setTimeout(() => {
                    submitButton.disabled = false;
                    if(submitButton.querySelector('.button-text')) submitButton.querySelector('.button-text').textContent = originalButtonText;
                    submitButton.classList.remove('loading');
                }, 2500); // Slightly shorter delay
            }
        }, 'newsletterSubmit');
    }
    
    showError(message, errorElement, inputElement) {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block'; // Ensure it's visible
        }
        inputElement?.setAttribute('aria-invalid', 'true');
        inputElement?.classList.add('input-error');
        this.showToast(message, 'error', 5000); // Longer duration for error toasts
    }

    clearError(errorElement, inputElement) {
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
        inputElement?.removeAttribute('aria-invalid');
        inputElement?.classList.remove('input-error');
    }

    async submitNewsletterSignup(data) {
        console.log('Submitting newsletter data:', data);
        // TODO: Replace with actual fetch API call
        // const API_ENDPOINT = '/api/v1/newsletter/subscribe'; // Example
        // try {
        //     const response = await fetch(API_ENDPOINT, {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        //         body: JSON.stringify(data)
        //     });
        //     if (!response.ok) {
        //         const errorData = await response.json().catch(() => ({ message: `HTTP Error: ${response.statusText}` }));
        //         throw new Error(errorData.message || `API Error: ${response.status}`);
        //     }
        //     return await response.json();
        // } catch (networkError) {
        //     console.error("Network or API error:", networkError);
        //     throw new Error("Не вдалося підключитися до сервера. Перевірте інтернет-з'єднання.");
        // }

        return new Promise((resolve, reject) => { // Simulation
            setTimeout(() => {
                if (data.email && data.email.includes('fail')) { // Simulate failure for specific email
                     reject(new Error('Симульована помилка: ця email адреса не може бути підписана.'));
                } else if (Math.random() > 0.05) { // 95% success
                    resolve({ success: true, message: "Successfully subscribed!" });
                } else {
                    reject(new Error('Симульована помилка мережі під час підписки.'));
                }
            }, 1200);
        });
    }

    validateEmail(email) {
        if (!email || typeof email !== 'string') return false;
        // A more comprehensive regex (but still not foolproof, server-side is key)
        const emailRegex = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
        return emailRegex.test(String(email).toLowerCase());
    }

    async copyToClipboard(text, contentType = 'Текст') {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else { // Fallback
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed'; textArea.style.opacity = '0'; textArea.style.pointerEvents = 'none';
                document.body.appendChild(textArea);
                textArea.focus(); textArea.select();
                const successful = document.execCommand('copy');
                textArea.remove();
                if (!successful) throw new Error('Fallback copy command failed.');
            }
            this.showToast(`${contentType} скопійовано!`, 'success');
            this.playSound(600, 0.1, 0.08, 'sine');
        } catch (error) {
            console.error('Failed to copy text:', error);
            this.showToast(`Не вдалося скопіювати ${contentType.toLowerCase()}.`, 'error');
        }
    }
    
    showToast(message, type = 'info', duration = 3500) { // Default duration slightly less
        const toastContainer = this.getOrCreateToastContainer();
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', type === 'error' || type === 'warning' ? 'assertive' : 'polite');
        
        const iconHTML = `<span class="toast-icon" aria-hidden="true">${this.getToastIcon(type)}</span>`;
        toast.innerHTML = `
            <div class="toast-content">${iconHTML}<span class="toast-message">${message}</span></div>
            <button type="button" class="toast-close" aria-label="Закрити повідомлення">
                <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>`;
        
        const closeButton = toast.querySelector('.toast-close');
        const removeHandler = () => this.removeToast(toast); // Store handler for removal
        this._addEventListener(closeButton, 'click', removeHandler, `toastClose-${toast.id || Math.random()}`);
        
        toastContainer.prepend(toast);
        requestAnimationFrame(() => toast.classList.add('show'));
        
        if (duration > 0) {
            const timeoutId = setTimeout(removeHandler, duration);
            this.animations.set(`toast-${toast.id || Math.random()}`, timeoutId); // Store to clear if closed manually
        }
        return toast;
    }

    getToastIcon(type) {
        const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
        return icons[type] || icons.info;
    }

    removeToast(toast) {
        if (!toast || !toast.parentNode) return;
        const toastId = toast.id || Object.keys(Object.fromEntries(this.animations)).find(k => this.animations.get(k) && k.startsWith('toast-')); // Attempt to find associated timeout
        if (toastId && this.animations.has(toastId)) {
            clearTimeout(this.animations.get(toastId));
            this.animations.delete(toastId);
        }

        toast.classList.remove('show');
        toast.classList.add('removing');
        
        const transitionEndHandler = () => toast.remove();
        toast.addEventListener('transitionend', transitionEndHandler, { once: true });
        setTimeout(() => { if (toast.parentNode) transitionEndHandler(); }, 500); // Fallback
    }

    getOrCreateToastContainer() {
        let container = document.getElementById('toast-container-ggenius'); // More specific ID
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container-ggenius';
            container.className = 'toast-container'; // Ensure CSS targets this
            container.setAttribute('aria-live', 'polite');
            document.body.appendChild(container);
        }
        return container;
    }
    
    /**
     * Sets up various user interactions like hover effects, animations, and keyboard navigation.
     * @async
     */
    async setupInteractions() {
        this.setupFeatureCardInteractions();
        this.setupLogoAnimation();
        this.setupSmoothScrolling(); // Global click listener for anchor links
        this.setupKeyboardNavigation(); // Global keydown for modals, tabs
        this.setupContextMenu(); // Global contextmenu and click/keydown for hiding
    }

    setupFeatureCardInteractions() {
        document.querySelectorAll('.feature-card-iui').forEach(card => { // Ensure this class exists
            this._addEventListener(card, 'mouseenter', () => this.playSound(400, 0.02, 0.03, 'square'), `cardEnter-${card.id || Math.random()}`);
            this._addEventListener(card, 'click', (e) => {
                this.playSound(800, 0.05, 0.05, 'sine');
                this.createRippleEffect(e.currentTarget, e);
            }, `cardClick-${card.id || Math.random()}`);
        });
    }

    createRippleEffect(element, event) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect'; // CSS: position:absolute, background, border-radius, animation (scale & opacity)
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 1.5; // Make ripple larger
        const x = event.clientX - rect.left - (size / 2);
        const y = event.clientY - rect.top - (size / 2);
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        if (getComputedStyle(element).position === 'static') {
            element.style.position = 'relative'; // For correct positioning of absolute ripple
        }
        element.style.overflow = 'hidden'; // Contain ripple
        element.appendChild(ripple);
        
        // CSS animation should handle removal or JS via animationend
        ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
        setTimeout(() => { if (ripple.parentNode) ripple.remove(); }, 700); // Fallback, match CSS animation
    }

    setupLogoAnimation() {
        const logo = document.querySelector('#ggeniusAnimatedLogo'); // Ensure this ID exists
        if (!logo) return;
        
        const animateLogo = () => logo.classList.add('animate-logo-active'); // CSS handles animation
        
        const logoObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateLogo();
                    observer.unobserve(entry.target);
                    this.observers.delete('logoAnimationObserver');
                }
            });
        }, { threshold: 0.2 });
        
        logoObserver.observe(logo);
        this.observers.set('logoAnimationObserver', logoObserver);
    }

    setupSmoothScrolling() {
        this._addEventListener(document, 'click', (e) => {
            const anchor = e.target.closest('a[href^="#"]');
            if (!anchor) return;

            const targetId = anchor.getAttribute('href');
            if (targetId && targetId.length > 1 && targetId !== '#') { // Check not just "#"
                const targetElement = document.getElementById(targetId.substring(1));
                if (targetElement) {
                    e.preventDefault();
                    this.smoothScrollTo(targetId);

                    // Close mobile menu if a nav link was clicked
                    if (anchor.closest('.nav-menu.open') && this.mobileToggle?.getAttribute('aria-expanded') === 'true') {
                        this.toggleMobileMenu(false); // Explicitly close
                    }
                }
            }
        }, 'smoothScrollGlobalClick');
    }
    
    smoothScrollTo(targetIdFull) { // targetIdFull includes '#'
        const targetElement = document.getElementById(targetIdFull.substring(1));
        if (!targetElement) {
            console.warn(`Smooth scroll target not found: ${targetIdFull}`);
            return;
        }
        
        const headerOffset = this.header?.offsetHeight || 60; // Default offset
        const elementPosition = targetElement.getBoundingClientRect().top;
        // Add a small buffer (e.g., 10-20px) below the header
        const offsetPosition = elementPosition + window.scrollY - headerOffset - 15; 

        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        
        // Update URL hash carefully
        if (history.pushState) {
            // Debounce or throttle if called very frequently from other sources
            history.pushState(null, null, targetIdFull);
        }
    }

    setupKeyboardNavigation() {
        this._addEventListener(document, 'keydown', (e) => {
            const openModal = document.querySelector('.modal-overlay.show');
            if (e.key === 'Tab' && openModal && this.currentModalFocusableElements?.length > 0) {
                this.handleModalTabTrap(e); // Pass only event
            }
            // Tab arrow navigation is handled within setupTabs via listener on tabList
        }, 'globalKeydownNav');
    }
    
    handleModalTabTrap(e) { // Removed 'modal' param, uses this.currentModalFocusableElements
        if (!this.currentModalFocusableElements || this.currentModalFocusableElements.length === 0) return;
        
        const firstEl = this.currentModalFocusableElements[0];
        const lastEl = this.currentModalFocusableElements[this.currentModalFocusableElements.length - 1];

        if (e.shiftKey) { /* Shift + Tab */
            if (document.activeElement === firstEl) {
                lastEl.focus();
                e.preventDefault();
            }
        } else { /* Tab */
            if (document.activeElement === lastEl) {
                firstEl.focus();
                e.preventDefault();
            }
        }
    }

    setupContextMenu() {
        this._addEventListener(document, 'contextmenu', (e) => {
            const interactiveTarget = e.target.closest('.feature-card-iui, .tech-item, .hero-logo-container, [data-allow-contextmenu]');
            if (interactiveTarget) {
                e.preventDefault();
                this.showContextMenu(e, interactiveTarget);
            }
        }, 'globalContextMenu');
        
        const hideMenuHandler = (e) => {
            if (!e.target.closest('.context-menu-ggenius')) { // Specific class for our menu
                this.hideContextMenu();
            }
        };
        this._addEventListener(document, 'click', hideMenuHandler, 'globalContextMenuHideClick');
        this._addEventListener(document, 'keydown', (e) => {
            if (e.key === 'Escape') this.hideContextMenu();
        }, 'globalContextMenuHideKey');
    }

    showContextMenu(e, targetElement) {
        this.hideContextMenu(); 
        const menu = document.createElement('div');
        menu.className = 'context-menu-ggenius'; // Specific class
        menu.setAttribute('role', 'menu');
        menu.id = `context-menu-${Date.now()}`;
        
        let menuItemsHTML = `
            <button role="menuitem" data-action="copy-link">🔗 Копіювати посилання</button>
            <button role="menuitem" data-action="share">📤 Поділитися</button>`;
        if (targetElement.id) {
             menuItemsHTML += `<button role="menuitem" data-action="copy-section-link" data-target-id="${targetElement.id}">🔗 Копіювати посилання на секцію</button>`;
        }
        menu.innerHTML = menuItemsHTML;
        
        menu.style.position = 'fixed';
        menu.style.left = `${e.clientX}px`;
        menu.style.top = `${e.clientY}px`;
        // CSS should handle z-index, appearance
        
        document.body.appendChild(menu);
        menu.querySelector('[role="menuitem"]')?.focus();
        
        const itemClickHandler = (menuEvent) => {
            const menuItem = menuEvent.target.closest('[role="menuitem"]');
            if (menuItem) {
                const action = menuItem.dataset.action;
                const targetId = menuItem.dataset.targetId; // For section link
                this.handleContextMenuAction(action, targetElement, targetId);
                this.hideContextMenu();
            }
        };
        this._addEventListener(menu, 'click', itemClickHandler, `contextMenuItemClick-${menu.id}`);
        this._addEventListener(menu, 'keydown', (menuEvent) => { // Basic arrow key nav for menu items
            if (menuEvent.key === 'Enter' || menuEvent.key === ' ') {
                menuEvent.target.closest('[role="menuitem"]')?.click();
            } else if (menuEvent.key === 'ArrowDown' || menuEvent.key === 'ArrowUp') {
                menuEvent.preventDefault();
                const items = Array.from(menu.querySelectorAll('[role="menuitem"]'));
                let currentIndex = items.indexOf(document.activeElement);
                if (menuEvent.key === 'ArrowDown') {
                    currentIndex = (currentIndex + 1) % items.length;
                } else {
                    currentIndex = (currentIndex - 1 + items.length) % items.length;
                }
                items[currentIndex]?.focus();
            }
        }, `contextMenuItemKeydown-${menu.id}`);

        requestAnimationFrame(() => { // Adjust position if out of viewport
            const rect = menu.getBoundingClientRect();
            if (rect.right > window.innerWidth) menu.style.left = `${window.innerWidth - rect.width - 5}px`;
            if (rect.bottom > window.innerHeight) menu.style.top = `${window.innerHeight - rect.height - 5}px`;
            if (rect.left < 0) menu.style.left = '5px';
            if (rect.top < 0) menu.style.top = '5px';
        });
    }

    hideContextMenu() {
        const existingMenu = document.querySelector('.context-menu-ggenius');
        if (existingMenu) {
            this._removeEventListener(`contextMenuItemClick-${existingMenu.id}`);
            this._removeEventListener(`contextMenuItemKeydown-${existingMenu.id}`);
            existingMenu.remove();
        }
    }

    handleContextMenuAction(action, targetElement, targetId) {
        let urlToShare = window.location.origin + window.location.pathname;
        if (targetId && (action === "copy-section-link" || action === "share")) { // Share can also use section link
            urlToShare += `#${targetId}`;
        } else {
            urlToShare = window.location.href; // Default to current full URL for general share/copy
        }

        switch (action) {
            case 'copy-link':
                this.copyToClipboard(window.location.href, 'Посилання на сторінку'); break;
            case 'copy-section-link':
                this.copyToClipboard(urlToShare, 'Посилання на секцію'); break;
            case 'share':
                this.shareContent(document.title, `Подивіться на це: ${targetElement.textContent?.substring(0,50) || 'GGenius'}`, urlToShare); break;
        }
    }

    async shareContent(title, text, url) {
        const shareData = { title, text, url };
        try {
            if (navigator.share && navigator.canShare?.(shareData)) { // Check if canShare
                await navigator.share(shareData);
                this.showToast('Контент успішно поширено!', 'success');
            } else { // Fallback or if cannot share this data
                await this.copyToClipboard(url, 'Посилання');
                this.showToast('Посилання скопійовано. Поділіться ним вручну!', 'info', 5000);
            }
        } catch (error) {
            if (error.name !== 'AbortError') { // User cancelled share
                console.error('Share API failed:', error);
                this.showToast('Не вдалося поділитися контентом.', 'error');
            }
        }
    }
    
    async setupAdvancedFeatures() {
        if (!this.performance.isLowPerformance) { // Only load these if not in low-perf
            this.preloadResources();
            this.setupTypingAnimation();
            // this.setupBackgroundMusic(); // Uncomment if music is desired and implemented
        }
        
        if ('serviceWorker' in navigator && window.isSecureContext) {
            this.setupServiceWorker();
        }
        this.setupInstallPrompt();
    }

    preloadResources() {
        const resources = [
            // { href: '/static/fonts/exo2-bold.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
            // { href: '/static/images/hero-background.webp', as: 'image' }
        ];
        resources.forEach(res => {
            const link = document.createElement('link');
            link.rel = res.as === 'style' ? 'preload' : 'prefetch'; // Use preload for critical, prefetch for likely next
            if (res.as) link.as = res.as;
            link.href = res.href;
            if (res.type) link.type = res.type;
            if (res.crossOrigin) link.crossOrigin = res.crossOrigin;
            document.head.appendChild(link);
        });
    }

    async setupServiceWorker() {
        const swPath = '/sw.js'; // Ensure sw.js is at the root or adjust path and scope
        try {
            const registration = await navigator.serviceWorker.register(swPath, { scope: '/' });
            console.log('✅ ServiceWorker registered. Scope:', registration.scope);
            
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                if (newWorker) {
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateAvailable(registration);
                        }
                    });
                }
            });
        } catch (error) {
            console.error('🔥 ServiceWorker registration failed:', error);
        }
        // Reload page on controller change to activate new SW
        let refreshing;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (refreshing) return;
            window.location.reload();
            refreshing = true;
        });
    }

    showUpdateAvailable(registration) {
        const toast = this.showToast('Доступна нова версія GGenius! Оновити?', 'info', 0); // Indefinite
        const toastContent = toast.querySelector('.toast-content');
        if (toastContent) {
            const updateButton = document.createElement('button');
            updateButton.textContent = 'Оновити';
            updateButton.className = 'toast-action button-primary';
            updateButton.style.marginLeft = '1em';
            this._addEventListener(updateButton, 'click', () => {
                this.removeToast(toast);
                if (registration.waiting) {
                    registration.waiting.postMessage({ type: 'SKIP_WAITING' }); // SW must handle this
                }
                // Reload is handled by 'controllerchange'
            }, `swUpdateBtn-${toast.id || Math.random()}`);
            toastContent.appendChild(updateButton);
        }
    }

    setupInstallPrompt() {
        let deferredInstallPrompt = null;
        this._addEventListener(window, 'beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredInstallPrompt = e;
            this.showInstallBanner(deferredInstallPrompt);
            console.log('🤝 `beforeinstallprompt` event fired.');
        }, 'beforeInstallPrompt');
        
        this._addEventListener(window, 'appinstalled', () => {
            deferredInstallPrompt = null;
            console.log('🎉 GGenius PWA installed!');
            this.showToast('GGenius успішно встановлено!', 'success');
            document.querySelector('.install-banner-ggenius')?.remove();
        }, 'appInstalled');
    }

    showInstallBanner(promptEvent) {
        document.querySelector('.install-banner-ggenius')?.remove(); // Remove old one
        const banner = document.createElement('div');
        banner.className = 'install-banner-ggenius'; // Specific class
        banner.innerHTML = `
            <div class="install-content">
                <span class="install-icon" aria-hidden="true">📱</span>
                <div class="install-text"><strong>Встановити GGenius</strong><small>Швидкий доступ та офлайн.</small></div>
                <button type="button" class="install-button button-primary">Встановити</button>
                <button type="button" class="install-close" aria-label="Закрити">✕</button>
            </div>`;
        
        const installButton = banner.querySelector('.install-button');
        const closeButton = banner.querySelector('.install-close');

        this._addEventListener(installButton, 'click', async () => {
            banner.remove();
            if (!promptEvent) return;
            promptEvent.prompt();
            // const { outcome } = await promptEvent.userChoice; // userChoice is not always available
            // console.log(`User response to install prompt: ${outcome}`);
            // deferredInstallPrompt = null; // Handled by appinstalled or if prompt is used
        }, `installPWAButton-${banner.id || Math.random()}`);
        
        this._addEventListener(closeButton, 'click', () => banner.remove(), `closeInstallBanner-${banner.id || Math.random()}`);
        document.body.appendChild(banner);
        setTimeout(() => { if(banner.parentNode) banner.remove(); }, 25000); // Auto-hide
    }

    setupTypingAnimation() {
        const subtitleElement = document.querySelector('.hero-section .subtitle[data-typing-text]');
        if (!subtitleElement) return;
        
        const originalText = subtitleElement.dataset.typingText || subtitleElement.textContent.trim();
        if (!originalText) return;

        subtitleElement.textContent = ''; // Clear for typing
        subtitleElement.style.opacity = '1'; // Ensure visibility
        
        // Add cursor element
        let cursor = subtitleElement.querySelector('.typing-cursor');
        if (!cursor) {
            cursor = document.createElement('span');
            cursor.className = 'typing-cursor'; // CSS: .typing-cursor { display: inline-block; width: 2px; background: currentColor; animation: blink 1s step-end infinite; }
            cursor.setAttribute('aria-hidden', 'true');
            cursor.innerHTML = '&#x2588;'; // Block cursor, or use CSS border
            subtitleElement.appendChild(cursor);
        }

        let currentIndex = 0;
        const typeCharacter = () => {
            if (currentIndex < originalText.length) {
                cursor.insertAdjacentText('beforebegin', originalText[currentIndex]);
                currentIndex++;
                const speed = 30 + Math.random() * 60;
                setTimeout(typeCharacter, speed);
                if (currentIndex % 5 === 0) this.playSound(900 + Math.random() * 100, 0.01, 0.01, 'square');
            } else {
                cursor.style.animationPlayState = 'paused'; // Stop blinking
                cursor.style.opacity = '0'; // Hide cursor
                subtitleElement.classList.add('typing-complete');
            }
        };
        setTimeout(typeCharacter, this.isLoaded ? 300 : 1500); // Delay start
    }
    
    setupBackgroundMusic() {
        if (this.performance.isLowPerformance) return;
        
        const musicToggle = document.createElement('button');
        musicToggle.type = 'button';
        musicToggle.className = 'music-toggle'; // Style with CSS (position, icon)
        musicToggle.title = this.settings.musicEnabled ? 'Вимкнути фонову музику' : 'Увімкнути фонову музику';
        musicToggle.innerHTML = this.settings.musicEnabled ? '🔇<span class="visually-hidden">Вимкнути музику</span>' : '🎵<span class="visually-hidden">Увімкнути музику</span>';
        musicToggle.setAttribute('aria-pressed', String(this.settings.musicEnabled));
        document.body.appendChild(musicToggle);

        this._addEventListener(musicToggle, 'click', () => {
            if (!this.audioContext) {
                try { this.audioContext = new (window.AudioContext || window.webkitAudioContext)(); } 
                catch (e) { console.error("AudioContext not supported.", e); musicToggle.remove(); return; }
            }
            if (this.audioContext.state === 'suspended') this.audioContext.resume();

            this.settings.musicEnabled = !this.settings.musicEnabled;
            localStorage.setItem('ggenius-musicEnabled', JSON.stringify(this.settings.musicEnabled));
            
            if (this.settings.musicEnabled) {
                this.startAmbientMusic();
                musicToggle.innerHTML = '🔇<span class="visually-hidden">Вимкнути музику</span>';
                musicToggle.title = 'Вимкнути фонову музику';
                musicToggle.setAttribute('aria-pressed', 'true');
            } else {
                this.stopAmbientMusic();
                musicToggle.innerHTML = '🎵<span class="visually-hidden">Увімкнути музику</span>';
                musicToggle.title = 'Увімкнути фонову музику';
                musicToggle.setAttribute('aria-pressed', 'false');
            }
        }, 'musicToggle');

        if (this.settings.musicEnabled) { // Auto-start if was enabled previously
            if (!this.audioContext) { // Ensure context is created if trying to auto-play
                 try { this.audioContext = new (window.AudioContext || window.webkitAudioContext)(); } catch(e){}
            }
            if (this.audioContext && this.audioContext.state === 'suspended') {
                // Need user interaction to resume, so can't auto-play reliably here.
                // User will need to click the toggle once.
                console.info("AudioContext suspended. Music will start on first interaction with toggle.");
            } else if (this.audioContext) {
                 this.startAmbientMusic();
            }
        }
    }

    startAmbientMusic() {
        if (!this.audioContext || this.ambientOscillators) return;
        if (this.audioContext.state !== 'running') {
            this.audioContext.resume().then(() => this._actuallyStartAmbientMusic()).catch(e => console.warn("Failed to resume AudioContext for music", e));
        } else {
            this._actuallyStartAmbientMusic();
        }
    }
    
    _actuallyStartAmbientMusic() {
        this.ambientGain = this.audioContext.createGain();
        this.ambientGain.gain.setValueAtTime(0.0001, this.audioContext.currentTime); // Start silent
        this.ambientGain.gain.exponentialRampToValueAtTime(0.006, this.audioContext.currentTime + 2); // Fade in
        this.ambientGain.connect(this.audioContext.destination);

        const osc1 = this.audioContext.createOscillator();
        osc1.type = 'sine'; osc1.frequency.setValueAtTime(55, this.audioContext.currentTime); // A1
        osc1.connect(this.ambientGain); osc1.start();

        const osc2 = this.audioContext.createOscillator();
        osc2.type = 'triangle'; osc2.frequency.setValueAtTime(82.41, this.audioContext.currentTime); // E2
        osc2.detune.setValueAtTime(6, this.audioContext.currentTime);
        osc2.connect(this.ambientGain); osc2.start();
        
        this.ambientOscillators = [osc1, osc2];
    }

    stopAmbientMusic() {
        if (this.ambientGain && this.audioContext) {
            this.ambientGain.gain.exponentialRampToValueAtTime(0.00001, this.audioContext.currentTime + 0.5); // Fade out
        }
        if (this.ambientOscillators && this.audioContext) {
            this.ambientOscillators.forEach(osc => {
                try { osc.stop(this.audioContext.currentTime + 0.6); osc.disconnect(); } catch(e) {}
            });
            this.ambientOscillators = null;
        }
         // Don't disconnect gain immediately, let it fade out
        setTimeout(() => {
            this.ambientGain?.disconnect();
            this.ambientGain = null;
        }, 600);
    }

    setupGamingCursor() {
        const cursorElement = document.createElement('div');
        cursorElement.className = 'gaming-cursor';
        cursorElement.setAttribute('aria-hidden', 'true');
        cursorElement.innerHTML = `<div class="cursor-dot"></div><div class="cursor-ring"></div>`;
        document.body.appendChild(cursorElement);
        
        let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
        let rafId;

        const updateMousePos = (e) => { mouseX = e.clientX; mouseY = e.clientY; };
        this._addEventListener(document, 'mousemove', updateMousePos, 'gamingCursorMove');
        
        const animateCursor = () => {
            const ease = 0.15; // Softer easing
            cursorX += (mouseX - cursorX) * ease;
            cursorY += (mouseY - cursorY) * ease;
            cursorElement.style.transform = `translate3d(${cursorX.toFixed(1)}px, ${cursorY.toFixed(1)}px, 0)`;
            rafId = requestAnimationFrame(animateCursor);
        };
        rafId = requestAnimationFrame(animateCursor);
        this.animations.set('gamingCursor', rafId);

        const onMouseDown = () => cursorElement.classList.add('clicked');
        const onMouseUp = () => cursorElement.classList.remove('clicked');
        const onMouseLeave = () => cursorElement.style.opacity = '0';
        const onMouseEnter = () => cursorElement.style.opacity = '1';

        this._addEventListener(document, 'mousedown', onMouseDown, 'gamingCursorDown');
        this._addEventListener(document, 'mouseup', onMouseUp, 'gamingCursorUp');
        this._addEventListener(document.documentElement, 'mouseleave', onMouseLeave, 'gamingCursorDocLeave');
        this._addEventListener(document.documentElement, 'mouseenter', onMouseEnter, 'gamingCursorDocEnter');

        document.querySelectorAll('a, button, [role="button"], [role="tab"], .accordion-header, .feature-card-iui, .tech-item, input, textarea, select')
            .forEach(el => {
                this._addEventListener(el, 'mouseenter', () => cursorElement.classList.add('hover-interactive'), `gcInteractiveEnter-${el.id || Math.random()}`);
                this._addEventListener(el, 'mouseleave', () => cursorElement.classList.remove('hover-interactive'), `gcInteractiveLeave-${el.id || Math.random()}`);
            });
    }

    playSound(frequency, duration = 0.1, volume = 0.05, type = 'sine') {
        if (!this.settings.soundsEnabled) return;
        if (this.performance.isLowPerformance && volume > 0.02) volume = 0.02;

        if (!this.audioContext) {
            try { this.audioContext = new (window.AudioContext || window.webkitAudioContext)(); } 
            catch (e) { return; } // Cannot play sound
        }
        if (this.audioContext.state === 'suspended') this.audioContext.resume().catch(() => {});
        if (this.audioContext.state !== 'running') return;

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.type = type; // sine, square, sawtooth, triangle
            gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.00001, this.audioContext.currentTime + duration);
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        } catch (error) {
            console.warn('Sound playback failed:', error);
        }
    }

    triggerEntryAnimations() { // Assumes CSS transitions are set up for opacity and transform
        const heroElements = [
            { selector: '.hero-logo-container', delay: 50, transform: 'translateY(-20px)' },
            { selector: '.hero-title', delay: 200, transform: 'translateY(20px)' },
            // Subtitle handled by typing animation
            { selector: '.hero-actions', delay: 350, transform: 'translateY(20px)' },
            { selector: '.hero-stats', delay: 500, transform: 'translateY(15px)' } // Or just opacity
        ];
        
        heroElements.forEach(item => {
            const element = document.querySelector(item.selector);
            if (element) {
                element.style.opacity = '0';
                if (item.transform) element.style.transform = item.transform;
                element.style.transition = `opacity 0.6s ease-out ${item.delay / 1000}s, transform 0.6s ease-out ${item.delay / 1000}s`;
                
                requestAnimationFrame(() => { // Ensure initial styles are applied
                    requestAnimationFrame(() => { // Then trigger transition
                        element.style.opacity = '1';
                        if (item.transform) element.style.transform = 'translateY(0)';
                    });
                });
            }
        });
        
        // Floating elements animation (ensure CSS for 'float3D' or similar exists)
        document.querySelectorAll('.hero-floating-elements .floating-gaming-icon').forEach((element, index) => {
            element.style.opacity = '0'; // Start hidden
            element.style.animationDelay = `${0.8 + index * 0.15}s`; // Staggered delay
            element.classList.add('animate-float'); // Add class to trigger CSS animation
             // CSS: .animate-float { opacity: 1; animation: float3D 12s ease-in-out infinite alternate; }
        });
    }

    trackLoadTime() {
        // Use Navigation Timing API for more accurate load times if available
        if (performance.getEntriesByType) { // Check if API is available
            const navTiming = performance.getEntriesByType("navigation")[0];
            if (navTiming) {
                 this.performance.metrics.domContentLoaded = navTiming.domContentLoadedEventEnd - navTiming.startTime;
                 this.performance.metrics.pageLoadTime = navTiming.loadEventEnd - navTiming.startTime;
                 console.log(`🕒 DOMContentLoaded: ${this.performance.metrics.domContentLoaded.toFixed(0)}ms, PageLoad: ${this.performance.metrics.pageLoadTime.toFixed(0)}ms`);
            }
        }
        const appInitTime = performance.now() - this.performance.startTime;
        this.performance.metrics.totalAppInitTime = appInitTime;
        console.log(`🎯 GGenius App JS initialized in ${appInitTime.toFixed(0)}ms`);
        
        if (typeof gtag === 'function') { // Check if gtag is defined
            gtag('event', 'timing_complete', {
                name: 'js_init_time', value: Math.round(appInitTime), event_category: 'Performance'
            });
            if(this.performance.metrics.pageLoadTime) {
                gtag('event', 'timing_complete', {
                    name: 'page_load_time', value: Math.round(this.performance.metrics.pageLoadTime), event_category: 'Performance'
                });
            }
        }
    }

    _handleResize() { // Renamed internal handler
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        if (this.scrollProgress) this._handleScroll(); // Recalculate scroll
        // Close mobile menu on larger screens if it was open
        if (window.innerWidth > 768 && this.navMenu?.classList.contains('open')) {
            this.toggleMobileMenu(false);
        }
    }

    _handleVisibilityChange() { // Renamed internal handler
        if (document.hidden) {
            this.pauseAnimationsAndAudio();
        } else {
            this.resumeAnimationsAndAudio();
        }
    }

    pauseAnimationsAndAudio() {
        document.body.classList.add('app-paused'); // For CSS to pause animations
        // Pause Web Audio API based ambient music if playing
        if (this.settings.musicEnabled && this.ambientGain && this.audioContext?.state === 'running') {
            this.ambientGain.gain.exponentialRampToValueAtTime(0.00001, this.audioContext.currentTime + 0.5);
        }
        // Cancel rAF loops
        this.animations.forEach(id => {
            if (typeof id === 'number') cancelAnimationFrame(id); // Check if it's rAF id
            else if (typeof id === 'object' && id !== null && typeof id.pause === 'function') id.pause(); // Web Animations API
        });
        console.info("App paused (visibility hidden). Animations and audio (if any) paused.");
    }

    resumeAnimationsAndAudio() {
        document.body.classList.remove('app-paused');
        if (this.settings.musicEnabled && this.ambientGain && this.audioContext?.state === 'running') {
            this.ambientGain.gain.exponentialRampToValueAtTime(0.006, this.audioContext.currentTime + 0.5); // Restore volume
        }
        // Restart rAF loops (more complex, depends on how they were stored/managed)
        // For simple rAF like gaming cursor, it might restart itself if mouse moves.
        // For FPS monitor, it might need explicit restart if paused.
        // For now, CSS animations will resume due to class removal.
        console.info("App resumed (visibility visible).");
    }

    fallbackMode(error) {
        console.warn('🔧 Entering fallback mode. Error:', error.message, error.stack);
        document.documentElement.classList.remove('js-loaded');
        document.documentElement.classList.add('js-fallback', 'low-performance-device'); // Assume low perf in fallback

        document.getElementById('loadingScreen')?.remove();
        
        let fallbackMsgContainer = document.getElementById('fallback-message-container-ggenius');
        if (!fallbackMsgContainer) {
            fallbackMsgContainer = document.createElement('div');
            fallbackMsgContainer.id = 'fallback-message-container-ggenius';
            fallbackMsgContainer.style.cssText = 'position:fixed; top:0; left:0; width:100%; background: #c0392b; color:white; padding:12px; text-align:center; z-index:20000; font-size: 1rem; border-bottom: 2px solid #a93226;';
            document.body.prepend(fallbackMsgContainer);
        }
        fallbackMsgContainer.innerHTML = `Вибачте, сталася помилка завантаження. Деякі функції можуть бути недоступні. <br><small>${error.message}</small>`;
        
        // Only setup very basic, safe navigation
        this.setupBasicNavigationForFallback();
    }
    
    setupBasicNavigationForFallback() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        if (mobileToggle && navMenu) {
            // Remove any existing advanced listeners before adding basic one
            this._removeEventListener('mobileToggleClick'); // Use the key given to _addEventListener

            this._addEventListener(mobileToggle, 'click', (e) => {
                e.preventDefault();
                const isOpen = navMenu.style.display === 'block';
                navMenu.style.display = isOpen ? 'none' : 'block';
                mobileToggle.setAttribute('aria-expanded', String(!isOpen));
            }, 'fallbackMobileToggle');
        }
    }

    /**
     * Throttles a function call to once per specified delay.
     * Calls the function immediately on the first call, then waits for delay.
     * @param {Function} func The function to throttle.
     * @param {number} delay The throttle delay in milliseconds.
     * @returns {Function} The new throttled function.
     */
    throttle(func, delay) {
        let inThrottle = false;
        let lastArgs = null;
        let lastThis = null;
        let timeoutId = null;

        return function throttled(...args) {
            lastArgs = args;
            lastThis = this;

            if (!inThrottle) {
                func.apply(lastThis, lastArgs);
                inThrottle = true;
                timeoutId = setTimeout(() => {
                    inThrottle = false;
                    // If there was a call during the throttle period, execute it now.
                    // This makes it behave a bit like a trailing edge debounce within the throttle.
                    // Remove if only leading edge execution is desired.
                    // if (lastArgs) { 
                    //    func.apply(lastThis, lastArgs);
                    // }
                }, delay);
            }
        };
    }

    /**
     * Debounces a function: executes only after `delay` ms of inactivity.
     * @param {Function} func The function to debounce.
     * @param {number} delay The debounce delay in milliseconds.
     * @returns {Function} The new debounced function.
     */
    debounce(func, delay) {
        let timeoutId;
        return function debounced(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }

    /**
     * Helper to add event listener and store it for cleanup.
     * @param {EventTarget} target - The element to attach the listener to.
     * @param {string} type - The event type.
     * @param {Function} listener - The event listener function.
     * @param {string} [key] - Optional unique key to identify the listener for removal.
     * @param {object} [options] - Optional event listener options.
     */
    _addEventListener(target, type, listener, key, options = { passive: true }) {
        if (!target) {
            // console.warn(`Target for event listener "${type}" not found (key: ${key || 'N/A'}).`);
            return;
        }
        target.addEventListener(type, listener, options);
        if (key) {
            this.eventListeners.set(key, { target, type, listener, options });
        }
    }

    /**
     * Helper to remove a stored event listener.
     * @param {string} key - The unique key of the listener to remove.
     */
    _removeEventListener(key) {
        const stored = this.eventListeners.get(key);
        if (stored) {
            stored.target.removeEventListener(stored.type, stored.listener, stored.options);
            this.eventListeners.delete(key);
        }
    }
    
    /**
     * Cleans up resources, removes event listeners to prevent memory leaks.
     */
    destroy() {
        console.log('🧹 Destroying GGeniusApp instance...');
        
        // Remove all stored event listeners
        this.eventListeners.forEach(({ target, type, listener, options }, key) => {
            target.removeEventListener(type, listener, options);
        });
        this.eventListeners.clear();

        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();

        this.animations.forEach(id => {
            if (typeof id === 'number') cancelAnimationFrame(id);
            else if (typeof id ==='number') clearTimeout(id); // For timeouts stored here
        });
        this.animations.clear();

        if(this.memoryMonitorInterval) clearInterval(this.memoryMonitorInterval);
        this.memoryMonitorInterval = null;

        this.stopAmbientMusic();
        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close().catch(e => console.warn("Error closing AudioContext:", e));
            this.audioContext = null;
        }

        // Remove dynamically created elements
        document.querySelector('.gaming-cursor')?.remove();
        document.querySelector('.music-toggle')?.remove();
        document.querySelector('#toast-container-ggenius')?.remove();
        document.querySelectorAll('.modal-overlay').forEach(modal => modal.remove());
        document.querySelector('.install-banner-ggenius')?.remove();
        this.scrollProgress?.remove();
        
        // Reset any global state if necessary
        document.documentElement.classList.remove('js-loaded', 'low-performance-device', 'performance-mode-active', 'js-fallback');
        document.body.classList.remove('menu-open', 'modal-open', 'app-paused');

        console.log('✅ GGeniusApp destroyed.');
    }
}

// Initialize the app
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new GGeniusApp(), { once: true });
} else {
    new GGeniusApp();
}
