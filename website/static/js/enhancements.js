/**
 * GGenius Enhanced Interactive Experience
 * Performance-optimized ES2023+ JavaScript for cyberpunk AI platform
 * @version 2.1.1 // Updated version
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
        this.handleScroll = this.throttle(this._handleScroll.bind(this), 16); 
        this.handleResize = this.debounce(this._handleResize.bind(this), 200); 
        this.handleVisibilityChange = this._handleVisibilityChange.bind(this); 
        
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

            await this.loadCriticalFeatures(); 
            this.setupGlobalEventListeners(); 
            
            const initialSetupPromises = [
                this.setupPerformanceMonitoring(),
                this.initializeUI(), 
                this.setupInteractions(), 
            ];
            await Promise.all(initialSetupPromises);
            
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
        return "2.1.1"; 
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

            const lowSpecCPU = typeof cpuCores === 'number' && cpuCores < 4; 
            const lowSpecMemory = typeof deviceMemory === 'number' && deviceMemory < 4; 

            const connection = navigator.connection;
            const slowConnection = connection?.effectiveType?.includes('2g') || 
                                   (typeof connection?.downlink === 'number' && connection.downlink < 1.5); 

            const isLikelyMobile = window.innerWidth < 768 && window.matchMedia?.('(pointer: coarse)').matches;
            
            let isLowPerf = lowSpecCPU || lowSpecMemory || slowConnection;
            
            if (isLikelyMobile && (lowSpecCPU || lowSpecMemory)) {
                isLowPerf = true; 
            }
            
            console.info(`Performance detection: CPU Cores: ${cpuCores ?? 'N/A'}, Device Memory: ${deviceMemory ?? 'N/A'}GB, Slow Connection: ${slowConnection ?? 'N/A'}, Reduced Motion: ${prefersReducedMotion}`);
            return isLowPerf;
        } catch (e) {
            console.warn("Error in detectLowPerformance:", e);
            return false; 
        }
    }
    
    /**
     * Sets up global event listeners that are needed early or throughout the app lifecycle.
     */
    setupGlobalEventListeners() {
        this._addEventListener(window, 'resize', this.handleResize);
        this._addEventListener(document, 'visibilitychange', this.handleVisibilityChange);
    }

    /**
     * Loads critical features and caches essential DOM elements.
     * Manages the loading screen simulation.
     * @async
     */
    async loadCriticalFeatures() {
        this.loadingScreen = document.getElementById('loadingScreen');
        this.progressBar = document.getElementById('progressBar');
        this.loadingTextElement = document.getElementById('loadingText'); 
        
        this.header = document.querySelector('.site-header');
        this.scrollProgress = document.getElementById('scrollProgress') || this.createScrollProgress();
        // Hero section is removed, so this will be null, which is handled by dependent functions
        this.heroSection = document.querySelector('.hero-section'); 
        this.navMenu = document.querySelector('.nav-menu');
        this.mobileToggle = document.querySelector('.mobile-menu-toggle');
        
        if (this.loadingScreen && !this.performance.isLowPerformance) {
            await this.simulateLoading();
        } else if (this.loadingScreen) {
            this.hideLoadingScreen(true); 
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
        }, 150); 
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
            // triggerEntryAnimations is now mostly obsolete due to hero section removal
            // but IntersectionObserver will handle animations for other sections.
            // if (!this.performance.isLowPerformance) { 
            //     this.triggerEntryAnimations(); 
            // }
        }, immediate ? 50 : 500); 
    }

    /**
     * Creates the scroll progress bar element if it doesn't exist.
     * @returns {HTMLElement} The scroll progress bar element.
     */
    createScrollProgress() {
        const progress = document.createElement('div');
        progress.className = 'scroll-progress'; 
        progress.id = 'scrollProgress';
        progress.setAttribute('role', 'progressbar');
        progress.setAttribute('aria-label', 'Прогрес прокрутки сторінки');
        progress.setAttribute('aria-valuenow', '0');
        progress.setAttribute('aria-valuemin', '0');
        progress.setAttribute('aria-valuemax', '100');
        progress.style.transform = 'scaleX(0)'; 
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
        
        if (window.location.hostname === 'localhost' || window.location.search.includes('debugFPS')) {
            this.setupFrameRateMonitoring(30000); 
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
            if (!performance.memory) { 
                clearInterval(intervalId);
                return;
            }
            const memory = performance.memory;
            this.performance.metrics.memory = {
                used: Math.round(memory.usedJSHeapSize / 1048576), 
                total: Math.round(memory.totalJSHeapSize / 1048576),
                limit: Math.round(memory.jsHeapSizeLimit / 1048576)
            };
            
            if ((memory.usedJSHeapSize / memory.jsHeapSizeLimit) > 0.85) { 
                console.warn('🚨 High memory usage detected:', this.performance.metrics.memory);
                this.optimizeMemory(); 
            }
        }, 60000); 
        this.memoryMonitorInterval = intervalId; 
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
            
            if (currentTime - lastTime >= 1000) { 
                this.performance.metrics.fps = frameCount;
                frameCount = 0;
                lastTime = currentTime;
                
                if (!this.performance.isLowPerformance && this.performance.metrics.fps < 25 && this.isLoaded) { 
                    console.warn(`📉 Low FPS detected: ${this.performance.metrics.fps}. Considering dynamic performance adjustments.`);
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
            if (typeof key === 'string' && !key.startsWith('perf-') && key !== 'intersection' && key !== 'logoAnimationObserver') { // Updated key
                try {
                    if (document.querySelector(key) === null) {
                        observer.disconnect();
                        this.observers.delete(key);
                        console.log(`🧹 Removed unused observer for selector: ${key}`);
                    }
                } catch (e) { /* Ignore if key is not a valid selector */ }
            }
        });
        
        if (window.gc) {
            try {
                console.log('Suggesting garbage collection (dev environments)...');
                window.gc();
            } catch (e) { console.warn("window.gc() failed.", e); }
        }
    }

    /**
     * Enables performance mode by adding a class to the body and potentially disabling heavy features.
     */
    enablePerformanceMode() {
        if (document.documentElement.classList.contains('performance-mode-active')) return;
        
        document.documentElement.classList.add('performance-mode-active', 'low-performance-device');
        console.warn('🎛️ Aggressive performance mode dynamically enabled.');
        
        if (this.animations.has('gamingCursor')) {
            cancelAnimationFrame(this.animations.get('gamingCursor'));
            this.animations.delete('gamingCursor');
            document.querySelector('.gaming-cursor')?.remove();
            console.info("Disabled gaming cursor for performance.");
        }
        this.stopAmbientMusic();
        document.querySelector('.music-toggle')?.remove();

        document.dispatchEvent(new CustomEvent('ggenius:performancemodeenabled'));
    }

    /**
     * Initializes core UI components like navigation, scroll effects, accordions, etc.
     * @async
     */
    async initializeUI() {
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
        this.setupHeaderScroll(); 
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
        document.body.classList.toggle('menu-open', shouldBeOpen); 
        
        this.playSound(shouldBeOpen ? 600 : 500, 0.05, 0.07, 'square');
        
        if (shouldBeOpen) {
            this.navMenu.querySelector('a[href], button')?.focus();
        } else {
            this.mobileToggle.focus();
        }
    }

    /**
     * Sets up header behavior on scroll (e.g., sticky, auto-hide).
     */
    setupHeaderScroll() {
        if (!this.header) return;
        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateHeader = () => {
            const currentScrollY = window.scrollY;
            const isScrolledDown = currentScrollY > lastScrollY && currentScrollY > this.header.offsetHeight;
            
            if (currentScrollY > 50) { 
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }

            if (isScrolledDown) {
                this.header.classList.add('header-hidden'); 
            } else if (currentScrollY < lastScrollY || currentScrollY <= 50) { 
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
        updateHeader(); 
    }

    /**
     * Sets up scroll-related effects like progress bar and parallax.
     */
    setupScrollEffects() {
        if (this.scrollProgress) {
            this._addEventListener(window, 'scroll', this.handleScroll, 'scrollProgressUpdater');
            this._handleScroll(); 
        }
        
        // Parallax setup will now correctly bail if heroSection is null
        this.setupParallax(); 
        
        this.setupIntersectionObserver(); 
    }

    /**
     * Internal handler for scroll events, updating the scroll progress bar.
     */
    _handleScroll() { 
        if (!this.scrollProgress) return;
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollableHeight <= 0) {
            this.scrollProgress.style.transform = 'scaleX(0)';
            this.scrollProgress.setAttribute('aria-valuenow', '0');
            return;
        }
        const scrollPercentage = (window.scrollY / scrollableHeight);
        const boundedPercentage = Math.max(0, Math.min(scrollPercentage, 1)); 

        this.scrollProgress.style.transform = `scaleX(${boundedPercentage})`;
        this.scrollProgress.setAttribute('aria-valuenow', String(Math.round(boundedPercentage * 100)));
    }

    /**
     * Sets up parallax scrolling effect for designated elements.
     * Now correctly bails out if heroSection or parallaxContainer are not found.
     */
    setupParallax() {
        if (!this.heroSection) { // Hero section was removed
            // console.info("Parallax setup skipped: Hero section not found.");
            return;
        }
        const parallaxContainer = this.heroSection.querySelector('.hero-floating-elements');
        if (!parallaxContainer || this.performance.isLowPerformance) {
            // console.info("Parallax setup skipped: Container not found or low performance mode.");
            return;
        }
        
        const parallaxElements = Array.from(parallaxContainer.querySelectorAll('.floating-gaming-icon'));
        if (parallaxElements.length === 0) return;

        let ticking = false;
        const updateParallax = () => {
            const heroRect = this.heroSection.getBoundingClientRect();
            if (heroRect.bottom < 0 || heroRect.top > window.innerHeight) { 
                ticking = false;
                return;
            }

            const scrollY = window.scrollY;
            parallaxElements.forEach((element) => {
                const speedAttr = element.dataset.parallaxSpeed;
                let speed = parseFloat(speedAttr);
                if (isNaN(speed) || speed <=0 || speed > 1) speed = 0.2 + Math.random() * 0.2; 

                const yPos = -(scrollY * speed * 0.3); 
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
        updateParallax(); 
    }

    /**
     * Sets up IntersectionObserver to trigger animations and other actions when elements enter viewport.
     */
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1, 
            rootMargin: '0px 0px -10% 0px' 
        };

        const observerCallback = (entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target); 
                    
                    if (entry.target.id && entry.intersectionRatio > 0.4) { 
                        this.updateActiveNavigation(entry.target.id);
                    }
                    if (entry.target.dataset.animateOnce === 'true' || entry.target.classList.contains('animate-once')) {
                       obs.unobserve(entry.target);
                       this.observers.delete(`io-${entry.target.id || Math.random().toString(36).substr(2, 9)}`); 
                    }
                } else {
                     if (entry.target.dataset.animateOnce !== 'true' && !entry.target.classList.contains('animate-once') && !this.performance.isLowPerformance) { // Don't reset if low-perf and simplified
                        entry.target.classList.remove('animate-in', entry.target.dataset.animation || 'fadeInUp', 'animated');
                     }
                }
            });
        };
        
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        // Adjusted querySelectorAll to be more general or specific to existing elements
        const elementsToObserve = document.querySelectorAll(`
            .features-section-iui, .roadmap-section, .accordion-section, /* Removed tech-stack-section */
            .feature-card-iui, .timeline-item, /* Removed .tech-item */
            [data-aos]
        `);
        
        if (elementsToObserve.length > 0) {
            elementsToObserve.forEach((el, index) => {
                observer.observe(el);
                this.observers.set(`io-${el.id || `el-${index}`}`, observer); 
            });
        }
    }

    /**
     * Animates an element when it becomes visible in the viewport.
     * Simplifies or skips animation in low performance mode.
     * @param {HTMLElement} element - The element to animate.
     */
    animateElement(element) {
        if (element.classList.contains('animated') && (element.dataset.animateOnce === 'true' || element.classList.contains('animate-once'))) {
            return; 
        }

        // --- MODIFICATION FOR LOW PERFORMANCE ---
        if (this.performance.isLowPerformance) {
            element.style.opacity = '1'; // Make visible immediately
            element.style.transform = 'none'; // Reset any transform from initial CSS state
            element.classList.add('animated'); // Mark as "processed" to avoid re-triggering logic
            
            // For counters, set final value directly in low performance mode
            if (element.classList.contains('stat-number') && element.dataset.target) {
                element.textContent = element.dataset.target; 
            }
            return; // Skip standard animation logic
        }
        // --- END OF MODIFICATION ---


        const animationType = element.dataset.animation || 'fadeInUp';
        const delay = parseInt(element.dataset.delay) || 0;
        
        const existingTimeoutId = this.animations.get(element);
        if (existingTimeoutId) clearTimeout(existingTimeoutId);

        const timeoutId = setTimeout(() => {
            element.classList.add('animate-in', animationType, 'animated');
            this.animations.delete(element); 
            
            if (element.classList.contains('stat-number') && element.dataset.target) {
                this.animateCounter(element);
            }
        }, delay);
        this.animations.set(element, timeoutId); 
    }

    /**
     * Animates a number counter from 0 or current text to a target value.
     * @param {HTMLElement} element - The element containing the number.
     */
    animateCounter(element) {
        // This check is now also inside animateElement for low-perf, but good to keep here too.
        if (this.performance.isLowPerformance) {
            element.textContent = element.dataset.target || 'N/A';
            return;
        }

        const target = parseInt(element.dataset.target);
        if (isNaN(target)) {
            console.warn("Invalid data-target for counter:", element.dataset.target, element);
            element.textContent = element.dataset.target || 'N/A'; 
            return;
        }
        const duration = parseInt(element.dataset.duration) || 1500; 
        const startTimestamp = performance.now();
        
        let initialValue = 0;
        const currentText = element.textContent.replace(/[^\d.-]/g, ''); 
        if (currentText !== '') {
            initialValue = parseFloat(currentText);
            if (isNaN(initialValue)) initialValue = 0;
        }

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTimestamp;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            let currentValue = initialValue + (target - initialValue) * easedProgress;
            
            if (Number.isInteger(target) && Number.isInteger(initialValue)) {
                currentValue = Math.round(currentValue);
                element.textContent = String(currentValue);
            } else {
                const targetPrecision = (String(target).split('.')[1] || '').length;
                const initialPrecision = (String(initialValue).split('.')[1] || '').length;
                const precision = Math.max(targetPrecision, initialPrecision, 1); 
                element.textContent = currentValue.toFixed(precision);
            }
            
            if (progress < 1) {
                const rafId = requestAnimationFrame(updateCounter);
                this.animations.set(`counter-${element.id || Math.random()}`, rafId); 
            } else {
                element.textContent = String(target); 
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
                                  (index === 0 && accordion.dataset.openByDefault !== 'false'); 
            
            if (isOpenByDefault) {
                this.openAccordion(header, content, true); 
            } else {
                this.closeAccordion(header, content, true); 
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
        
        requestAnimationFrame(() => { 
            const innerContent = content.firstElementChild; 
            const contentHeight = (innerContent || content).scrollHeight;
            if (initialSetup || this.performance.isLowPerformance) { // No animation in low perf
                content.style.maxHeight = `${contentHeight}px`;
                content.style.transition = 'none'; 
                requestAnimationFrame(() => content.style.transition = ''); 
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

        if (initialSetup || this.performance.isLowPerformance) { // No animation in low perf
            content.style.transition = 'none';
            onTransitionEnd(); 
            requestAnimationFrame(() => content.style.transition = '');
        } else {
            content.addEventListener('transitionend', onTransitionEnd, { once: true });
            setTimeout(onTransitionEnd, 500); 
        }
    }

    /**
     * Sets up tab functionality with ARIA attributes and keyboard navigation.
     */
    setupTabs() {
        document.querySelectorAll('.tabs-component').forEach(tabsComponent => { 
            const tabList = tabsComponent.querySelector('[role="tablist"].feature-categories');
            const panelsContainer = tabsComponent.querySelector('.tab-panels-container'); 
            
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
            
            this._addEventListener(tabList, 'keydown', (e) => {
                 this.handleTabArrowNavigation(e, tabList, tabs, tabPanels);
            }, `tabListKeydown-${tabList.id || 'tabs'}`);

            let activeTabIndex = tabs.findIndex(t => t.classList.contains('active'));
            if (activeTabIndex === -1) activeTabIndex = 0;
            
            this.switchTab(tabs[activeTabIndex], tabs, tabPanels, true); 
        });
    }

    switchTab(activeTab, allTabs, allPanels, isInitialSetup = false) {
        allTabs.forEach(tab => {
            tab.classList.remove('active');
            tab.setAttribute('aria-selected', 'false');
            tab.tabIndex = -1; 
        });
        
        activeTab.classList.add('active');
        activeTab.setAttribute('aria-selected', 'true');
        activeTab.tabIndex = 0; 
        
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
            activeTab.focus(); 
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
            tabs[newIndex].focus(); 
        }
    }


    /**
     * Sets up modal dialog functionality.
     */
    setupModals() {
        // Demo modal trigger was removed from HTML, this specific selector will not find anything.
        // document.querySelectorAll('.demo-button[data-modal-trigger="demo"]').forEach(button => {
        //     this._addEventListener(button, 'click', () => {
        //         this.lastFocusedElementBeforeModal = document.activeElement; 
        //         this.showDemoModal();
        //     }, `demoModalTrigger-${button.id || Math.random()}`);
        // });
        
        this._addEventListener(document, 'keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal-overlay.show');
                if (openModal) this.closeModal(openModal.id);
            }
        }, 'globalModalEscape');
    }

    // showDemoModal() can be kept if there's another way to trigger it, or removed if not used.
    // For now, keeping it as it's self-contained.
    showDemoModal() {
        const modalId = 'demo-modal-ggenius';
        if (document.getElementById(modalId)) return; 

        const modalContent = `...`; // Content remains the same
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
        
        modal.innerHTML = `...`; // Content remains the same
        
        const closeButton = modal.querySelector('[data-close-modal]');
        if (closeButton) {
             this._addEventListener(closeButton, 'click', () => this.closeModal(id), `modalCloseBtn-${id}`);
        }

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
        this.closeModal(); 

        document.body.appendChild(modal);
        document.body.classList.add('modal-open');
        
        const focusableElements = Array.from(modal.querySelectorAll(
            'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ));
        this.currentModalFocusableElements = focusableElements; 
        this.firstFocusableElement = focusableElements[0];
        this.lastFocusableElement = focusableElements[focusableElements.length - 1];

        if (this.firstFocusableElement) {
            this.firstFocusableElement.focus();
        } else {
            modal.querySelector('.modal-container')?.setAttribute('tabindex', '-1'); 
            modal.querySelector('.modal-container')?.focus();
        }
        
        requestAnimationFrame(() => modal.classList.add('show')); 
        this.playSound(600, 0.1, 0.09, 'sine');
    }

    closeModal(modalIdToClose) {
        const modal = modalIdToClose ? document.getElementById(modalIdToClose) : document.querySelector('.modal-overlay.show');
        if (!modal) return;
        
        modal.classList.remove('show');
        modal.classList.add('closing'); 
        document.body.classList.remove('modal-open');
        
        if (this.lastFocusedElementBeforeModal && typeof this.lastFocusedElementBeforeModal.focus === 'function') {
            this.lastFocusedElementBeforeModal.focus();
            this.lastFocusedElementBeforeModal = null;
        }

        const transitionEndHandler = () => {
            modal.remove();
            this._removeEventListener(`modalCloseBtn-${modal.id}`);
            this._removeEventListener(`modalOverlayClick-${modal.id}`);
            modal.querySelectorAll('.modal-actions [data-action-index]').forEach((btn, index) => {
                this._removeEventListener(`modalAction-${modal.id}-${index}`);
            });
        };
        
        modal.addEventListener('transitionend', transitionEndHandler, { once: true });
        setTimeout(() => { if (modal.parentNode) transitionEndHandler(); }, 500); 
        
        this.currentModalFocusableElements = [];
    }


    scrollToNewsletter() {
        const newsletterSection = document.querySelector('.newsletter-form'); // Simpler selector as contact form section might be gone
        if (newsletterSection) {
            newsletterSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
                newsletterSection.querySelector('input[type="email"]')?.focus({preventScroll: true});
            }, 800); 
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
            let emailError = form.querySelector('.error-message#email-error'); // Generic ID, or ensure it exists
            
            if (!emailError && emailInput) { 
                emailError = document.createElement('div');
                emailError.id = 'email-error'; // Ensure CSS targets this if needed
                emailError.className = 'error-message';
                emailError.setAttribute('role', 'alert');
                emailError.setAttribute('aria-live', 'assertive'); 
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
                await this.submitNewsletterSignup(data); 
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
                }, 2500); 
            }
        }, 'newsletterSubmit');
    }
    
    showError(message, errorElement, inputElement) {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block'; 
        }
        inputElement?.setAttribute('aria-invalid', 'true');
        inputElement?.classList.add('input-error');
        this.showToast(message, 'error', 5000); 
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
        return new Promise((resolve, reject) => { 
            setTimeout(() => {
                if (data.email && data.email.includes('fail')) { 
                     reject(new Error('Симульована помилка: ця email адреса не може бути підписана.'));
                } else if (Math.random() > 0.05) { 
                    resolve({ success: true, message: "Successfully subscribed!" });
                } else {
                    reject(new Error('Симульована помилка мережі під час підписки.'));
                }
            }, 1200);
        });
    }

    validateEmail(email) {
        if (!email || typeof email !== 'string') return false;
        const emailRegex = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
        return emailRegex.test(String(email).toLowerCase());
    }

    async copyToClipboard(text, contentType = 'Текст') {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else { 
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
    
    showToast(message, type = 'info', duration = 3500) { 
        const toastContainer = this.getOrCreateToastContainer();
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', type === 'error' || type === 'warning' ? 'assertive' : 'polite');
        
        const iconHTML = `<span class="toast-icon" aria-hidden="true">${this.getToastIcon(type)}</span>`;
        toast.innerHTML = `...`; // Content remains the same
        
        const closeButton = toast.querySelector('.toast-close');
        const removeHandler = () => this.removeToast(toast); 
        this._addEventListener(closeButton, 'click', removeHandler, `toastClose-${toast.id || Math.random()}`);
        
        toastContainer.prepend(toast);
        requestAnimationFrame(() => toast.classList.add('show'));
        
        if (duration > 0) {
            const timeoutId = setTimeout(removeHandler, duration);
            this.animations.set(`toast-${toast.id || Math.random()}`, timeoutId); 
        }
        return toast;
    }

    getToastIcon(type) {
        const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
        return icons[type] || icons.info;
    }

    removeToast(toast) {
        if (!toast || !toast.parentNode) return;
        const toastId = toast.id || Object.keys(Object.fromEntries(this.animations)).find(k => this.animations.get(k) && k.startsWith('toast-')); 
        if (toastId && this.animations.has(toastId)) {
            clearTimeout(this.animations.get(toastId));
            this.animations.delete(toastId);
        }

        toast.classList.remove('show');
        toast.classList.add('removing');
        
        const transitionEndHandler = () => toast.remove();
        toast.addEventListener('transitionend', transitionEndHandler, { once: true });
        setTimeout(() => { if (toast.parentNode) transitionEndHandler(); }, 500); 
    }

    getOrCreateToastContainer() {
        let container = document.getElementById('toast-container-ggenius'); 
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container-ggenius';
            container.className = 'toast-container'; 
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
        this.setupLogoAnimation(); // Will bail out if logo not found
        this.setupSmoothScrolling(); 
        this.setupKeyboardNavigation(); 
        this.setupContextMenu(); 
    }

    setupFeatureCardInteractions() {
        document.querySelectorAll('.feature-card-iui').forEach(card => { 
            this._addEventListener(card, 'mouseenter', () => this.playSound(400, 0.02, 0.03, 'square'), `cardEnter-${card.id || Math.random()}`);
            this._addEventListener(card, 'click', (e) => {
                this.playSound(800, 0.05, 0.05, 'sine');
                this.createRippleEffect(e.currentTarget, e);
            }, `cardClick-${card.id || Math.random()}`);
        });
    }

    createRippleEffect(element, event) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect'; 
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 1.5; 
        const x = event.clientX - rect.left - (size / 2);
        const y = event.clientY - rect.top - (size / 2);
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        if (getComputedStyle(element).position === 'static') {
            element.style.position = 'relative'; 
        }
        element.style.overflow = 'hidden'; 
        element.appendChild(ripple);
        
        ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
        setTimeout(() => { if (ripple.parentNode) ripple.remove(); }, 700); 
    }

    setupLogoAnimation() {
        const logo = document.querySelector('#ggeniusAnimatedLogo'); 
        if (!logo) { // Logo was part of hero section, which is removed
            // console.info("Logo animation setup skipped: Logo element not found.");
            return;
        }
        
        const animateLogo = () => logo.classList.add('animate-logo-active'); 
        
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
            if (targetId && targetId.length > 1 && targetId !== '#') { 
                const targetElement = document.getElementById(targetId.substring(1));
                if (targetElement) {
                    e.preventDefault();
                    this.smoothScrollTo(targetId);

                    if (anchor.closest('.nav-menu.open') && this.mobileToggle?.getAttribute('aria-expanded') === 'true') {
                        this.toggleMobileMenu(false); 
                    }
                }
            }
        }, 'smoothScrollGlobalClick');
    }
    
    smoothScrollTo(targetIdFull) { 
        const targetElement = document.getElementById(targetIdFull.substring(1));
        if (!targetElement) {
            console.warn(`Smooth scroll target not found: ${targetIdFull}`);
            return;
        }
        
        const headerOffset = this.header?.offsetHeight || 60; 
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset - 15; 

        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        
        if (history.pushState) {
            history.pushState(null, null, targetIdFull);
        }
    }

    setupKeyboardNavigation() {
        this._addEventListener(document, 'keydown', (e) => {
            const openModal = document.querySelector('.modal-overlay.show');
            if (e.key === 'Tab' && openModal && this.currentModalFocusableElements?.length > 0) {
                this.handleModalTabTrap(e); 
            }
        }, 'globalKeydownNav');
    }
    
    handleModalTabTrap(e) { 
        if (!this.currentModalFocusableElements || this.currentModalFocusableElements.length === 0) return;
        
        const firstEl = this.currentModalFocusableElements[0];
        const lastEl = this.currentModalFocusableElements[this.currentModalFocusableElements.length - 1];

        if (e.shiftKey) { 
            if (document.activeElement === firstEl) {
                lastEl.focus();
                e.preventDefault();
            }
        } else { 
            if (document.activeElement === lastEl) {
                firstEl.focus();
                e.preventDefault();
            }
        }
    }

    setupContextMenu() {
        this._addEventListener(document, 'contextmenu', (e) => {
            const interactiveTarget = e.target.closest('.feature-card-iui, [data-allow-contextmenu]'); // Removed .tech-item, .hero-logo-container
            if (interactiveTarget) {
                e.preventDefault();
                this.showContextMenu(e, interactiveTarget);
            }
        }, 'globalContextMenu');
        
        const hideMenuHandler = (e) => {
            if (!e.target.closest('.context-menu-ggenius')) { 
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
        menu.className = 'context-menu-ggenius'; 
        menu.setAttribute('role', 'menu');
        menu.id = `context-menu-${Date.now()}`;
        
        let menuItemsHTML = `...`; // Content remains the same
        if (targetElement.id) {
             menuItemsHTML += `<button role="menuitem" data-action="copy-section-link" data-target-id="${targetElement.id}">🔗 Копіювати посилання на секцію</button>`;
        }
        menu.innerHTML = menuItemsHTML;
        
        menu.style.position = 'fixed';
        menu.style.left = `${e.clientX}px`;
        menu.style.top = `${e.clientY}px`;
        
        document.body.appendChild(menu);
        menu.querySelector('[role="menuitem"]')?.focus();
        
        const itemClickHandler = (menuEvent) => {
            const menuItem = menuEvent.target.closest('[role="menuitem"]');
            if (menuItem) {
                const action = menuItem.dataset.action;
                const targetId = menuItem.dataset.targetId; 
                this.handleContextMenuAction(action, targetElement, targetId);
                this.hideContextMenu();
            }
        };
        this._addEventListener(menu, 'click', itemClickHandler, `contextMenuItemClick-${menu.id}`);
        this._addEventListener(menu, 'keydown', (menuEvent) => { 
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

        requestAnimationFrame(() => { 
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
        if (targetId && (action === "copy-section-link" || action === "share")) { 
            urlToShare += `#${targetId}`;
        } else {
            urlToShare = window.location.href; 
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
            if (navigator.share && navigator.canShare?.(shareData)) { 
                await navigator.share(shareData);
                this.showToast('Контент успішно поширено!', 'success');
            } else { 
                await this.copyToClipboard(url, 'Посилання');
                this.showToast('Посилання скопійовано. Поділіться ним вручну!', 'info', 5000);
            }
        } catch (error) {
            if (error.name !== 'AbortError') { 
                console.error('Share API failed:', error);
                this.showToast('Не вдалося поділитися контентом.', 'error');
            }
        }
    }
    
    async setupAdvancedFeatures() {
        if (!this.performance.isLowPerformance) { 
            this.preloadResources();
            // this.setupTypingAnimation(); // Typing animation was for hero subtitle, which is gone
        }
        
        if ('serviceWorker' in navigator && window.isSecureContext) {
            this.setupServiceWorker();
        }
        this.setupInstallPrompt();
    }

    preloadResources() {
        const resources = []; // Add resources if needed
        resources.forEach(res => {
            const link = document.createElement('link');
            link.rel = res.as === 'style' ? 'preload' : 'prefetch'; 
            if (res.as) link.as = res.as;
            link.href = res.href;
            if (res.type) link.type = res.type;
            if (res.crossOrigin) link.crossOrigin = res.crossOrigin;
            document.head.appendChild(link);
        });
    }

    async setupServiceWorker() {
        const swPath = '/sw.js'; 
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
        let refreshing;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (refreshing) return;
            window.location.reload();
            refreshing = true;
        });
    }

    showUpdateAvailable(registration) {
        const toast = this.showToast('Доступна нова версія GGenius! Оновити?', 'info', 0); 
        const toastContent = toast.querySelector('.toast-content');
        if (toastContent) {
            const updateButton = document.createElement('button');
            updateButton.textContent = 'Оновити';
            updateButton.className = 'toast-action button-primary';
            updateButton.style.marginLeft = '1em';
            this._addEventListener(updateButton, 'click', () => {
                this.removeToast(toast);
                if (registration.waiting) {
                    registration.waiting.postMessage({ type: 'SKIP_WAITING' }); 
                }
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
        document.querySelector('.install-banner-ggenius')?.remove(); 
        const banner = document.createElement('div');
        banner.className = 'install-banner-ggenius'; 
        banner.innerHTML = `...`; // Content remains the same
        
        const installButton = banner.querySelector('.install-button');
        const closeButton = banner.querySelector('.install-close');

        this._addEventListener(installButton, 'click', async () => {
            banner.remove();
            if (!promptEvent) return;
            promptEvent.prompt();
        }, `installPWAButton-${banner.id || Math.random()}`);
        
        this._addEventListener(closeButton, 'click', () => banner.remove(), `closeInstallBanner-${banner.id || Math.random()}`);
        document.body.appendChild(banner);
        setTimeout(() => { if(banner.parentNode) banner.remove(); }, 25000); 
    }

    // setupTypingAnimation is now obsolete as the hero subtitle is gone.
    // setupTypingAnimation() {
    //     const subtitleElement = document.querySelector('.hero-section .subtitle[data-typing-text]');
    //     if (!subtitleElement) return; 
    //     // ... rest of the logic ...
    // }
    
    setupBackgroundMusic() {
        // ... (Implementation remains the same, ensure it's called only if needed) ...
    }
    startAmbientMusic() { /* ... */ }
    _actuallyStartAmbientMusic() { /* ... */ }
    stopAmbientMusic() { /* ... */ }

    setupGamingCursor() {
        // ... (Implementation remains the same) ...
    }

    playSound(frequency, duration = 0.1, volume = 0.05, type = 'sine') {
        // ... (Implementation remains the same) ...
    }

    // triggerEntryAnimations is now largely obsolete as hero section is removed.
    // Its logic for non-hero elements is covered by IntersectionObserver.
    triggerEntryAnimations() {
        // console.info("triggerEntryAnimations called, but most targets are removed.");
        // If any general entry animations are still needed, they can be refactored here
        // or handled solely by IntersectionObserver.
        // For now, this function can be left empty or removed if not called.
    }

    trackLoadTime() {
        // ... (Implementation remains the same) ...
    }
    _handleResize() { /* ... */ }
    _handleVisibilityChange() { /* ... */ }
    pauseAnimationsAndAudio() { /* ... */ }
    resumeAnimationsAndAudio() { /* ... */ }
    fallbackMode(error) { /* ... */ }
    setupBasicNavigationForFallback() { /* ... */ }
    throttle(func, delay) { /* ... */ }
    debounce(func, delay) { /* ... */ }
    _addEventListener(target, type, listener, key, options = { passive: true }) { /* ... */ }
    _removeEventListener(key) { /* ... */ }
    destroy() { /* ... */ }
}

// Initialize the app
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new GGeniusApp(), { once: true });
} else {
    new GGeniusApp();
}