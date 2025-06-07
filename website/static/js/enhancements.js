/**
 * GGenius Enhanced Interactive Experience
 * Performance-optimized ES2023+ JavaScript for cyberpunk AI platform
 * @version 2.0.1
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
        this.animations = new Map();
        this.audioContext = null;
        this.performance = {
            startTime: performance.now(),
            metrics: {},
            isLowPerformance: this.detectLowPerformance()
        };
        
        // Bind methods for proper context
        this.handleScroll = this.throttle(this.handleScroll.bind(this), 16); // 60 FPS scroll handling
        this.handleResize = this.debounce(this.handleResize.bind(this), 250);
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
        
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
                document.documentElement.classList.add('low-performance-device');
            }

            // Critical path loading sequence
            await this.loadCriticalFeatures();
            await this.setupPerformanceMonitoring();
            await this.initializeUI();
            await this.setupInteractions();
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
        return "2.0.1"; // Should match @version in the header
    }

    /**
     * Detects if the user's device or connection might offer a low-performance experience.
     * @returns {boolean} True if low performance is detected, false otherwise.
     */
    detectLowPerformance() {
        const lowSpec = navigator.hardwareConcurrency < 4 || navigator.deviceMemory < 4;
        const slowConnection = navigator.connection?.effectiveType === 'slow-2g' ||
                               navigator.connection?.effectiveType === '2g';
        const isMobileLegacy = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        // Consider adding a check for prefers-reduced-motion as well, or viewport size for mobile.
        return lowSpec || slowConnection || (isMobileLegacy && lowSpec);
    }

    /**
     * Loads critical features and caches essential DOM elements.
     * Manages the loading screen simulation.
     * @async
     */
    async loadCriticalFeatures() {
        // Loading screen management
        this.loadingScreen = document.getElementById('loadingScreen');
        this.progressBar = document.getElementById('progressBar');
        this.loadingText = document.getElementById('loadingText');
        
        // Critical DOM elements cache
        this.header = document.querySelector('.site-header');
        this.scrollProgress = document.getElementById('scrollProgress') || this.createScrollProgress();
        this.heroSection = document.querySelector('.hero-section');
        this.navMenu = document.querySelector('.nav-menu');
        this.mobileToggle = document.querySelector('.mobile-menu-toggle');
        
        // Start loading simulation
        if (this.loadingScreen) { // Only simulate if loading screen exists
            await this.simulateLoading();
        }
        
        // Setup gaming cursor for desktop if not in low performance mode
        if (!this.performance.isLowPerformance && window.matchMedia('(pointer: fine)').matches && window.innerWidth > 768) {
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
            if (!this.progressBar || !this.loadingText) {
                this.hideLoadingScreen(); // Hide immediately if elements are missing
                resolve();
                return;
            }

            let progress = 0;
            const messages = [
                'Ініціалізація GGenius AI...',
                'Завантаження нейронних мереж...',
                'Підключення до кіберспорт серверів...',
                'Активація штучного інтелекту...',
                'Синхронізація з MLBB API...',
                'Готовність до революції!'
            ];

            const updateProgress = () => {
                const increment = Math.random() * 15 + 8; // Random increment for a more dynamic feel
                progress = Math.min(progress + increment, 100);
                
                if (this.progressBar) {
                    this.progressBar.style.width = `${progress}%`;
                    this.progressBar.setAttribute('aria-valuenow', String(Math.round(progress)));
                }
                
                const messageIndex = Math.min(
                    Math.floor((progress / 100) * (messages.length)), // Ensure it can reach the last message
                    messages.length - 1
                );
                
                if (this.loadingText && messages[messageIndex] && this.loadingText.textContent !== messages[messageIndex]) {
                    this.updateLoadingText(messages[messageIndex]);
                }
                
                if (progress < 100) {
                    setTimeout(updateProgress, 120 + Math.random() * 180);
                } else {
                    // Ensure 100% is shown briefly before hiding
                    if (this.progressBar) this.progressBar.style.width = '100%';
                    if (this.loadingText) this.updateLoadingText(messages[messages.length - 1]);

                    setTimeout(() => {
                        this.hideLoadingScreen();
                        resolve();
                    }, 800); // Delay before hiding
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
        if (!this.loadingText) return;
        
        this.loadingText.style.opacity = '0';
        setTimeout(() => {
            this.loadingText.textContent = text;
            this.loadingText.style.opacity = '1';
        }, 200); // Transition duration
    }

    /**
     * Hides the loading screen and triggers entry animations.
     */
    hideLoadingScreen() {
        if (!this.loadingScreen || this.loadingScreen.classList.contains('hidden')) return;
        
        this.loadingScreen.classList.add('hidden');
        this.loadingScreen.setAttribute('aria-hidden', 'true');
        
        this.playSound(800, 0.1, 0.08); // Success sound, slightly adjusted volume
        
        setTimeout(() => {
            this.loadingScreen?.remove(); // Use optional chaining for safety
            this.triggerEntryAnimations();
        }, 500); // Corresponds to transition duration in CSS
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
        document.body.prepend(progress); // Prepend to ensure it's under the header
        return progress;
    }

    /**
     * Sets up performance monitoring, including Web Vitals, memory, and frame rate.
     * @async
     */
    async setupPerformanceMonitoring() {
        if (this.performance.isLowPerformance) {
            console.log("🦥 Low performance mode: Skipping some monitoring.");
            return; // Optionally skip some monitoring on low-perf devices
        }

        if ('PerformanceObserver' in window) {
            this.setupWebVitalsTracking();
        }
        
        if (performance.memory) { // Check if performance.memory is supported
            this.setupMemoryMonitoring();
        }
        
        this.setupFrameRateMonitoring();
    }

    /**
     * Sets up Web Vitals tracking using PerformanceObserver.
     */
    setupWebVitalsTracking() {
        const vitals = ['FCP', 'LCP', 'FID', 'CLS', 'TTFB'];
        
        vitals.forEach(vital => {
            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        this.performance.metrics[vital] = entry.value !== undefined ? entry.value : entry.startTime;
                        console.log(`📊 ${vital}:`, this.performance.metrics[vital].toFixed(2));
                    }
                });
                
                const entryTypes = this.getObserverTypes(vital);
                if (entryTypes.length > 0) {
                     // Check if browser supports these entry types
                    if (PerformanceObserver.supportedEntryTypes.some(supportedType => entryTypes.includes(supportedType))) {
                        observer.observe({ type: entryTypes[0], buffered: true }); // Observe one type at a time for simplicity or use entryTypes
                    } else {
                        console.warn(`PerformanceObserver does not support entryType(s) for ${vital}: ${entryTypes.join(', ')}`);
                    }
                }
                this.observers.set(`perf-${vital}`, observer);
            } catch (error) {
                console.warn(`Failed to observe ${vital}:`, error);
            }
        });
    }

    /**
     * Gets the PerformanceObserver entry types for a given Web Vital.
     * @param {string} vital - The Web Vital (e.g., 'FCP', 'LCP').
     * @returns {string[]} An array of entry types.
     */
    getObserverTypes(vital) {
        const types = {
            'FCP': ['paint'], // first-contentful-paint
            'LCP': ['largest-contentful-paint'],
            'FID': ['first-input'],
            'CLS': ['layout-shift'],
            'TTFB': ['navigation'] // navigation timing
        };
        return types[vital] || [];
    }

    /**
     * Sets up periodic memory usage monitoring.
     */
    setupMemoryMonitoring() {
        this.memoryMonitorInterval = setInterval(() => {
            const memory = performance.memory;
            this.performance.metrics.memory = {
                used: Math.round(memory.usedJSHeapSize / 1048576), // MB
                total: Math.round(memory.totalJSHeapSize / 1048576),
                limit: Math.round(memory.jsHeapSizeLimit / 1048576)
            };
            
            if ((memory.usedJSHeapSize / memory.jsHeapSizeLimit) > 0.9) {
                console.warn('🚨 High memory usage detected:', this.performance.metrics.memory);
                this.optimizeMemory();
            }
        }, 30000); // Check every 30 seconds
    }

    /**
     * Sets up frame rate (FPS) monitoring.
     */
    setupFrameRateMonitoring() {
        let frameCount = 0;
        let lastTime = performance.now();
        let rafId;

        const countFrames = (currentTime) => {
            frameCount++;
            
            if (currentTime - lastTime >= 1000) {
                this.performance.metrics.fps = frameCount;
                // console.log(` FPS: ${frameCount}`); // Optional: log FPS
                frameCount = 0;
                lastTime = currentTime;
                
                if (!this.performance.isLowPerformance && this.performance.metrics.fps < 30) {
                    console.warn(`📉 Low FPS detected: ${this.performance.metrics.fps}. Considering performance mode.`);
                    // this.enablePerformanceMode(); // Be cautious with auto-enabling, could be temporary
                }
            }
            
            rafId = requestAnimationFrame(countFrames);
        };
        
        rafId = requestAnimationFrame(countFrames);
        this.animations.set('fpsMonitor', rafId); // Store to cancel later if needed
    }

    /**
     * Attempts to optimize memory by clearing unused observers/animations
     * and suggesting garbage collection.
     */
    optimizeMemory() {
        console.log('🧠 Attempting memory optimization...');
        // Clear unused observers
        this.observers.forEach((observer, key) => {
            // A more robust check might be needed if keys aren't just selectors
            if (typeof key === 'string' && !document.querySelector(key) && key !== 'intersection' && !key.startsWith('perf-')) {
                observer.disconnect();
                this.observers.delete(key);
                console.log(`🧹 Removed unused observer: ${key}`);
            }
        });
        
        // Clear completed animations (if they are stored with playState)
        this.animations.forEach((animation, key) => {
            if (animation && typeof animation.playState === 'string' && animation.playState === 'finished') {
                this.animations.delete(key);
                console.log(`🧹 Removed finished animation: ${key}`);
            }
        });
        
        // Suggest garbage collection (non-standard, mostly for dev environments)
        if (window.gc) {
            console.log('Suggesting garbage collection...');
            window.gc();
        }
    }

    /**
     * Enables performance mode by adding a class to the body and adjusting CSS variables.
     */
    enablePerformanceMode() {
        if (document.body.classList.contains('performance-mode')) return;
        
        document.body.classList.add('performance-mode');
        console.log('🎛️ Performance mode enabled due to low FPS or device specs.');
        
        document.documentElement.style.setProperty('--trans', '0.1s');
        document.documentElement.style.setProperty('--trans-fast', '0.05s');
        
        const expensiveEffects = document.querySelectorAll('.hero-section::after, .gaming-cursor, .feature-card-iui.enhanced::before, .feature-card-iui.enhanced::after');
        expensiveEffects.forEach(el => el.style.setProperty('display', 'none', 'important'));
        
        // Further reduce CSS animations or complexity here if needed
        // For example, by adding a class that overrides complex animations.
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
            console.warn("Mobile toggle or nav menu not found.");
            return;
        }

        this.mobileToggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMobileMenu();
        });

        this.navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('href')?.startsWith('#')) {
                    e.preventDefault();
                    const targetId = link.getAttribute('href');
                    this.smoothScrollTo(targetId);
                
                    if (this.navMenu.classList.contains('open')) {
                        this.toggleMobileMenu(false); // Explicitly close
                    }
                }
            });
        });
        this.setupHeaderScroll();
    }
    
    /**
     * Toggles the mobile navigation menu.
     * @param {boolean} [forceOpen] - Optional. If true, opens the menu. If false, closes it.
     */
    toggleMobileMenu(forceOpen) {
        const isOpen = typeof forceOpen === 'boolean' ? !forceOpen : this.mobileToggle.getAttribute('aria-expanded') === 'true';
        
        this.mobileToggle.setAttribute('aria-expanded', String(!isOpen));
        this.navMenu.classList.toggle('open', !isOpen);
        document.body.classList.toggle('menu-open', !isOpen);
        
        this.playSound(isOpen ? 500 : 600, 0.05, 0.07); // Different sound for open/close
        
        if (!isOpen) {
            this.navMenu.querySelector('.nav-link')?.focus();
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
        const handleHeaderScroll = () => {
            const currentScrollY = window.scrollY;
            const isScrolledDown = currentScrollY > lastScrollY;
            const isHeaderFixed = this.header.classList.contains('scrolled');

            if (currentScrollY > 100) {
                if (!isHeaderFixed) this.header.classList.add('scrolled');
                if (isScrolledDown && currentScrollY > 200) { // Hide on scroll down
                    this.header.style.transform = 'translateY(-100%)';
                } else if (!isScrolledDown) { // Show on scroll up
                    this.header.style.transform = 'translateY(0)';
                }
            } else {
                if (isHeaderFixed) this.header.classList.remove('scrolled');
                this.header.style.transform = 'translateY(0)';
            }
            lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY; // For Mobile or negative scrolling
        };
        
        window.addEventListener('scroll', this.throttle(handleHeaderScroll, 100), { passive: true }); // Adjusted throttle
    }

    /**
     * Sets up scroll-related effects like progress bar and parallax.
     */
    setupScrollEffects() {
        if (this.scrollProgress) { // Ensure scrollProgress exists
            window.addEventListener('scroll', this.handleScroll, { passive: true });
        }
        
        // Parallax effect for hero section
        // INFO: This requires HTML elements with class .hero-floating-elements .floating-gaming-icon
        // and corresponding CSS for initial positioning and appearance.
        if (this.heroSection && !this.performance.isLowPerformance && document.querySelector('.hero-floating-elements')) {
            this.setupParallax();
        } else if (this.heroSection && !this.performance.isLowPerformance) {
            // console.warn("Parallax setup skipped: '.hero-floating-elements' not found.");
        }
        
        this.setupIntersectionObserver();
    }

    /**
     * Handles scroll events, updating the scroll progress bar.
     */
    handleScroll() {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollableHeight <= 0) { // Avoid division by zero or negative percentage
            this.scrollProgress.style.width = '0%';
            this.scrollProgress.setAttribute('aria-valuenow', '0');
            return;
        }
        const scrollPercentage = (window.scrollY / scrollableHeight) * 100;
        this.scrollProgress.style.width = `${Math.min(scrollPercentage, 100)}%`;
        this.scrollProgress.setAttribute('aria-valuenow', String(Math.round(scrollPercentage)));
    }

    /**
     * Sets up parallax scrolling effect for designated elements.
     * INFO: Requires HTML elements with class '.hero-floating-elements .floating-gaming-icon'.
     */
    setupParallax() {
        const parallaxContainer = this.heroSection.querySelector('.hero-floating-elements');
        if (!parallaxContainer) return;
        const parallaxElements = parallaxContainer.querySelectorAll('.floating-gaming-icon');
        if (parallaxElements.length === 0) return;

        const handleParallax = () => {
            // Optimized parallax: calculate only when hero section is somewhat visible
            const heroRect = this.heroSection.getBoundingClientRect();
            if (heroRect.bottom < 0 || heroRect.top > window.innerHeight) return;

            const scrollY = window.scrollY;
            parallaxElements.forEach((element, index) => {
                const speed = parseFloat(element.dataset.parallaxSpeed) || (0.3 + index * 0.05);
                // Ensure speed is not too high or negative
                const safeSpeed = Math.max(0.1, Math.min(speed, 0.8));
                const yPos = -(scrollY * safeSpeed * 0.5); // Adjusted for subtle effect
                element.style.transform = `translate3d(0, ${yPos}px, 0)`;
            });
        };
        
        window.addEventListener('scroll', this.throttle(handleParallax, 16), { passive: true });
    }

    /**
     * Sets up IntersectionObserver to trigger animations and other actions when elements enter viewport.
     */
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: [0.1, 0.5, 0.9], // Multiple thresholds for more granular control
            rootMargin: '0px 0px -50px 0px' // Trigger slightly before element is fully in view
        };

        const observerCallback = (entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target, entry.intersectionRatio);
                    
                    if (entry.target.id && entry.intersectionRatio > 0.5) {
                        this.updateActiveNavigation(entry.target.id);
                    }
                    // Optionally unobserve after first animation if it's a one-time effect
                    // if (entry.target.classList.contains('animate-once')) {
                    //    obs.unobserve(entry.target);
                    // }
                } else {
                    // Optional: reset animation if element scrolls out of view and should re-animate
                    // entry.target.classList.remove('animate-in', entry.target.dataset.animation || 'fadeInUp');
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        const elementsToObserve = document.querySelectorAll(`
            .hero-section, .features-section-iui, .roadmap-section,
            .accordion-section, .tech-stack-section,
            .feature-card-iui, .timeline-item, .tech-item,
            [data-aos] /* Generic hook for elements wanting IntersectionObserver-based animation */
        `);
        
        if (elementsToObserve.length > 0) {
            elementsToObserve.forEach(el => observer.observe(el));
            this.observers.set('intersection', observer);
        }
    }

    /**
     * Animates an element when it becomes visible in the viewport.
     * @param {HTMLElement} element - The element to animate.
     * @param {number} ratio - The intersection ratio.
     */
    animateElement(element, ratio) {
        // Ensure animation only runs once if not specified otherwise
        if (element.classList.contains('animated')) return;

        const animationType = element.dataset.animation || 'fadeInUp'; // Default animation
        const delay = parseInt(element.dataset.delay) || 0;
        
        setTimeout(() => {
            element.classList.add('animate-in', animationType, 'animated');
            
            if (element.classList.contains('stat-number') && element.dataset.target) {
                this.animateCounter(element);
            }
            
            // Removed .feature-card-iui specific animation here, rely on CSS or data-attributes
        }, delay);
    }

    /**
     * Animates a number counter from 0 to a target value.
     * @param {HTMLElement} element - The element containing the number.
     */
    animateCounter(element) {
        const target = parseInt(element.dataset.target);
        if (isNaN(target)) {
            console.warn("Invalid data-target for counter:", element);
            return;
        }
        const duration = parseInt(element.dataset.duration) || 2000;
        const start = performance.now();
        const initialValue = parseInt(element.textContent) || 0; // Start from current text or 0

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.round(initialValue + (target - initialValue) * easeOutCubic);
            
            element.textContent = String(currentValue);
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = String(target); // Ensure final value is exact
            }
        };
        requestAnimationFrame(updateCounter);
    }

    /**
     * Updates the active state of navigation links based on the currently visible section.
     * @param {string} sectionId - The ID of the currently visible section.
     */
    updateActiveNavigation(sectionId) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active', 'aria-current');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
    }

    /**
     * Sets up accordion functionality for elements with class '.accordion-section'.
     */
    setupAccordions() {
        document.querySelectorAll('.accordion-section').forEach((accordion, index) => {
            const header = accordion.querySelector('.accordion-header');
            const content = accordion.querySelector('.accordion-content');
            
            if (!header || !content) return;
            
            const contentId = `accordion-content-${index}`;
            const headerId = `accordion-header-${index}`;

            header.id = headerId;
            header.setAttribute('aria-expanded', 'false');
            header.setAttribute('aria-controls', contentId);
            header.setAttribute('role', 'button'); // Ensure it's announced as a button
            header.tabIndex = 0; // Make it focusable

            content.id = contentId;
            content.setAttribute('aria-hidden', 'true');
            content.setAttribute('role', 'region');
            content.setAttribute('aria-labelledby', headerId);
            
            // Open first accordion by default (can be configured via data-attribute)
            const isOpenByDefault = accordion.dataset.openByDefault === 'true' || (index === 0 && !accordion.dataset.openByDefault);
            if (isOpenByDefault) {
                this.openAccordion(header, content);
            }
            
            header.addEventListener('click', () => this.toggleAccordion(header, content));
            header.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleAccordion(header, content);
                }
            });
        });
    }

    /**
     * Toggles the state of an accordion (open/close).
     * @param {HTMLElement} header - The accordion header element.
     * @param {HTMLElement} content - The accordion content element.
     */
    toggleAccordion(header, content) {
        const isOpen = header.getAttribute('aria-expanded') === 'true';
        
        // Optional: Close other accordions if this one is part of a group that should only have one open
        // const parentGroup = header.closest('.accordion-group');
        // if (parentGroup && !isOpen) {
        //     parentGroup.querySelectorAll('.accordion-header[aria-expanded="true"]').forEach(activeHeader => {
        //         if (activeHeader !== header) {
        //             this.closeAccordion(activeHeader, document.getElementById(activeHeader.getAttribute('aria-controls')));
        //         }
        //     });
        // }

        if (isOpen) {
            this.closeAccordion(header, content);
        } else {
            this.openAccordion(header, content);
        }
        this.playSound(isOpen ? 480 : 520, 0.04, 0.06);
    }

    /**
     * Opens a specific accordion.
     * @param {HTMLElement} header - The accordion header.
     * @param {HTMLElement} content - The accordion content.
     */
    openAccordion(header, content) {
        header.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
        content.classList.add('active');
        content.setAttribute('aria-hidden', 'false');
        
        // Calculate height after styles are applied
        requestAnimationFrame(() => {
            const innerContent = content.querySelector('.accordion-content-inner');
            const contentHeight = innerContent ? innerContent.scrollHeight : content.scrollHeight;
            content.style.maxHeight = `${contentHeight}px`;
        });
    }

    /**
     * Closes a specific accordion.
     * @param {HTMLElement} header - The accordion header.
     * @param {HTMLElement} content - The accordion content.
     */
    closeAccordion(header, content) {
        header.classList.remove('active');
        header.setAttribute('aria-expanded', 'false');
        // content.classList.remove('active'); // Remove active class after transition
        content.setAttribute('aria-hidden', 'true');
        content.style.maxHeight = '0px';
        
        // Remove active class after transition for smoother visual
        content.addEventListener('transitionend', () => {
            content.classList.remove('active');
        }, { once: true });
    }

    /**
     * Sets up tab functionality for elements with class '.feature-categories'.
     */
    setupTabs() {
        document.querySelectorAll('.feature-categories').forEach(tabContainer => {
            const tabs = Array.from(tabContainer.querySelectorAll('[role="tab"]'));
            const tabPanels = Array.from(tabContainer.nextElementSibling?.querySelectorAll('[role="tabpanel"]') || // if panels are direct sibling
                                        document.querySelectorAll('.features-grid-iui.tab-content')); // fallback to global search if needed


            if (tabs.length === 0 || tabPanels.length === 0) return;

            tabs.forEach((tab, index) => {
                const panelId = tab.getAttribute('aria-controls');
                const panel = document.getElementById(panelId);

                if (!panel) {
                    console.warn(`Tab panel with ID '${panelId}' not found for tab:`, tab);
                    return;
                }

                tab.addEventListener('click', () => this.switchTab(tab, tabs, tabPanels));
                tab.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.switchTab(tab, tabs, tabPanels);
                    }
                    // Add arrow key navigation for tabs here if desired
                });

                // Initial state: first tab active, or one marked with class 'active'
                if (index === 0 && !tabs.some(t => t.classList.contains('active'))) {
                    tab.classList.add('active');
                    tab.setAttribute('aria-selected', 'true');
                    tab.tabIndex = 0;
                    panel.classList.add('active');
                    panel.setAttribute('aria-hidden', 'false');
                } else if (tab.classList.contains('active')) {
                    tab.setAttribute('aria-selected', 'true');
                    tab.tabIndex = 0;
                    panel.classList.add('active');
                    panel.setAttribute('aria-hidden', 'false');
                } else {
                    tab.setAttribute('aria-selected', 'false');
                    tab.tabIndex = -1;
                    panel.classList.remove('active');
                    panel.setAttribute('aria-hidden', 'true');
                }
            });
        });
    }

    /**
     * Switches to a new tab, updating ARIA attributes and content visibility.
     * @param {HTMLElement} activeTab - The tab to activate.
     * @param {HTMLElement[]} allTabs - An array of all tab elements in the group.
     * @param {HTMLElement[]} allContents - An array of all tab panel elements.
     */
    switchTab(activeTab, allTabs, allContents) {
        allTabs.forEach(tab => {
            tab.classList.remove('active');
            tab.setAttribute('aria-selected', 'false');
            tab.tabIndex = -1;
        });
        
        activeTab.classList.add('active');
        activeTab.setAttribute('aria-selected', 'true');
        activeTab.tabIndex = 0;
        
        const targetId = activeTab.getAttribute('aria-controls');
        
        allContents.forEach(content => {
            content.classList.remove('active');
            content.setAttribute('aria-hidden', 'true');
            if (content.id === targetId) {
                content.classList.add('active');
                content.setAttribute('aria-hidden', 'false');
            }
        });
        
        this.playSound(700, 0.05, 0.07);
    }

    /**
     * Sets up modal dialog functionality.
     */
    setupModals() {
        document.querySelectorAll('.demo-button').forEach(button => {
            button.addEventListener('click', () => this.showDemoModal());
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal-overlay.show');
                if (openModal) this.closeModal();
            }
        });
    }

    /**
     * Shows a demonstration modal.
     * INFO: Relies on CSS for '.modal-overlay', '.modal-container', etc.
     */
    showDemoModal() {
        // Ensure CSS for modal elements like .ai-avatar, .demo-modal-content, .demo-features is present.
        const modalContent = `
            <div class="demo-modal-content">
                <div class="ai-avatar">
                    <div class="avatar-glow"></div>
                    <svg class="ai-brain-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12,2A10,10,0,0,0,2,12A10,10,0,0,0,12,22A10,10,0,0,0,22,12A10,10,0,0,0,12,2M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8L10,17Z" />
                    </svg>
                </div>
                <h3>Демо буде доступне незабаром!</h3>
                <p>Ми активно працюємо над революційним AI-інтерфейсом для аналітики MLBB матчів. Підпишіться на оновлення, щоб першими дізнатися про запуск!</p>
                <div class="demo-features">
                    <div class="demo-feature"><span class="feature-icon" aria-hidden="true">🧠</span>Аналіз матчів в реальному часі</div>
                    <div class="demo-feature"><span class="feature-icon" aria-hidden="true">📊</span>Персональні рекомендації</div>
                    <div class="demo-feature"><span class="feature-icon" aria-hidden="true">🎯</span>Прогнози результатів</div>
                </div>
            </div>
        `;
        const modal = this.createModal({
            title: 'GGenius AI Demo',
            content: modalContent,
            actions: [
                {
                    text: 'Підписатися на оновлення',
                    primary: true,
                    action: () => {
                        this.closeModal();
                        this.scrollToNewsletter();
                    }
                },
                {
                    text: 'Закрити',
                    action: () => this.closeModal()
                }
            ]
        });
        this.showModal(modal);
    }

    /**
     * Creates a modal dialog element.
     * @param {object} options - Modal options.
     * @param {string} options.title - The title of the modal.
     * @param {string} options.content - HTML content for the modal body.
     * @param {Array<object>} [options.actions=[]] - Array of action button configurations.
     * @returns {HTMLElement} The created modal element.
     * INFO: Requires CSS for modal structure and appearance.
     */
    createModal({ title, content, actions = [] }) {
        const modalId = `modal-${Date.now()}`;
        const modalTitleId = `${modalId}-title`;

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = modalId;
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', modalTitleId);
        
        modal.innerHTML = `
            <div class="modal-container" role="document">
                <div class="modal-header">
                    <h2 id="${modalTitleId}" class="modal-title-text">${title}</h2>
                    <button class="modal-close" aria-label="Закрити модальне вікно" data-close-modal>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="modal-content">
                    ${content}
                </div>
                ${actions.length > 0 ? `
                <div class="modal-actions">
                    ${actions.map((action, index) => 
                        `<button class="modal-action ${action.primary ? 'primary' : ''}" data-action-index="${index}">
                            ${action.text}
                        </button>`
                    ).join('')}
                </div>` : ''}
            </div>
        `;
        
        modal.querySelector('[data-close-modal]').addEventListener('click', () => this.closeModal());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal(); // Close on overlay click
        });
        
        actions.forEach((actionConfig, index) => {
            const button = modal.querySelector(`[data-action-index="${index}"]`);
            if (button && actionConfig.action) {
                button.addEventListener('click', actionConfig.action);
            }
        });
        
        return modal;
    }

    /**
     * Shows a modal dialog.
     * @param {HTMLElement} modal - The modal element to show.
     */
    showModal(modal) {
        // Ensure no other modal is open
        this.closeModal(); 

        document.body.appendChild(modal);
        document.body.classList.add('modal-open'); // Prevents background scroll
        
        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        this.firstFocusableElement = focusableElements[0];
        this.lastFocusableElement = focusableElements[focusableElements.length - 1];

        if (this.firstFocusableElement) {
            this.firstFocusableElement.focus();
        }
        
        // Animate in
        requestAnimationFrame(() => { // Ensures element is in DOM for transition
            modal.classList.add('show');
        });
        
        this.playSound(600, 0.1, 0.09);
    }

    /**
     * Closes the currently active modal dialog.
     */
    closeModal() {
        const modal = document.querySelector('.modal-overlay.show'); // Target only visible modals
        if (!modal) return;
        
        modal.classList.remove('show');
        modal.classList.add('closing'); // For CSS animation out
        document.body.classList.remove('modal-open');
        
        // Restore focus to the element that opened the modal if possible
        if (this.lastFocusedElementBeforeModal) {
            this.lastFocusedElementBeforeModal.focus();
            this.lastFocusedElementBeforeModal = null;
        }

        modal.addEventListener('transitionend', () => {
            modal.remove();
        }, { once: true });
    }

    /**
     * Scrolls to the newsletter signup section.
     */
    scrollToNewsletter() {
        const newsletterSection = document.querySelector('#contact .newsletter-signup'); // More specific selector
        if (newsletterSection) {
            newsletterSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
                newsletterSection.querySelector('input[type="email"]')?.focus();
            }, 500 + 250); // Allow time for scroll
        }
    }

    /**
     * Sets up form handling, including newsletter signup and email copying.
     */
    setupForms() {
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) this.setupNewsletterForm(newsletterForm);
        
        document.querySelectorAll('.email-link[data-email]').forEach(button => {
            button.addEventListener('click', () => {
                const email = button.dataset.email;
                if (email) this.copyToClipboard(email, 'Email адресу');
            });
        });
    }

    /**
     * Sets up validation and submission for the newsletter form.
     * @param {HTMLFormElement} form - The newsletter form element.
     */
    setupNewsletterForm(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = form.querySelector('button[type="submit"]');
            const emailInput = form.querySelector('input[type="email"]');
            const emailError = form.querySelector('#email-error') || document.createElement('div'); // Create if not exists
            if (!form.querySelector('#email-error')) {
                emailInput?.parentNode.appendChild(emailError);
                emailError.id = 'email-error';
                emailError.className = 'error-message';
                emailError.setAttribute('role', 'alert');
                emailError.setAttribute('aria-live', 'polite');
            }


            const email = emailInput?.value;
            if (!email || !this.validateEmail(email)) {
                this.showError('Будь ласка, введіть коректну email адресу.', emailError, emailInput);
                emailInput?.focus();
                return;
            }
            this.clearError(emailError, emailInput);

            const originalButtonText = submitButton.querySelector('.button-text')?.textContent || 'Приєднатися';
            const loadingText = submitButton.dataset.loading || 'Підписуємо...';
            const successText = submitButton.dataset.success || 'Підписано! ✅';
            // const errorText = submitButton.dataset.error || 'Помилка ❌'; // Not used directly on button
            
            submitButton.disabled = true;
            if(submitButton.querySelector('.button-text')) submitButton.querySelector('.button-text').textContent = loadingText;
            submitButton.classList.add('loading');
            
            try {
                const formData = new FormData(form);
                // const data = Object.fromEntries(formData.entries()); // Standard way
                const data = {};
                formData.forEach((value, key) => data[key] = value);


                await this.submitNewsletterSignup(data); // API call
                
                if(submitButton.querySelector('.button-text')) submitButton.querySelector('.button-text').textContent = successText;
                form.reset();
                this.showToast('Дякуємо! Ви успішно підписалися на розсилку.', 'success');
                this.playSound(800, 0.15, 0.1);
                
            } catch (error) {
                console.error('Newsletter signup failed:', error);
                this.showError('Помилка підписки. Спробуйте ще раз.', emailError); // Show general error
                // if(submitButton.querySelector('.button-text')) submitButton.querySelector('.button-text').textContent = errorText; // Or original
            } finally {
                setTimeout(() => { // Delay to show success/error before reverting
                    submitButton.disabled = false;
                    if(submitButton.querySelector('.button-text')) submitButton.querySelector('.button-text').textContent = originalButtonText;
                    submitButton.classList.remove('loading');
                }, 3000);
            }
        });
    }
    
    /**
     * Displays an error message for a form field.
     * @param {string} message The error message.
     * @param {HTMLElement} errorElement The HTML element to display the error in.
     * @param {HTMLInputElement} [inputElement] The input element associated with the error.
     */
    showError(message, errorElement, inputElement) {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        inputElement?.setAttribute('aria-invalid', 'true');
        inputElement?.classList.add('input-error'); // For styling
        this.showToast(message, 'error'); // Also show a toast for general visibility
    }

    /**
     * Clears an error message for a form field.
     * @param {HTMLElement} errorElement The HTML element displaying the error.
     * @param {HTMLInputElement} [inputElement] The input element.
     */
    clearError(errorElement, inputElement) {
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
        inputElement?.removeAttribute('aria-invalid');
        inputElement?.classList.remove('input-error');
    }


    /**
     * Simulates submitting newsletter signup data to an API.
     * @param {object} data - The data to submit.
     * @returns {Promise<object>} A promise that resolves with the API response.
     * @private
     */
    async submitNewsletterSignup(data) {
        console.log('Submitting newsletter data:', data);
        // TODO: Replace with actual fetch API call to your backend
        // Example:
        // const response = await fetch('/api/newsletter-signup', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data)
        // });
        // if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
        // return await response.json();

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.1) { // 90% success rate for simulation
                    resolve({ success: true, message: "Successfully subscribed!" });
                } else {
                    reject(new Error('Simulated network error during signup.'));
                }
            }, 1500);
        });
    }

    /**
     * Validates an email address format.
     * @param {string} email - The email address to validate.
     * @returns {boolean} True if the email is valid, false otherwise.
     */
    validateEmail(email) {
        if (!email) return false;
        // More robust regex, but still basic. Server-side validation is key.
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(String(email).toLowerCase());
    }

    /**
     * Copies text to the clipboard.
     * @param {string} text - The text to copy.
     * @param {string} [contentType='Текст'] - A user-friendly name for the content type being copied.
     * @async
     */
    async copyToClipboard(text, contentType = 'Текст') {
        try {
            if (navigator.clipboard && window.isSecureContext) { // Modern async clipboard API
                await navigator.clipboard.writeText(text);
            } else { // Fallback for older browsers / non-secure contexts
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed'; // Prevent scrolling to bottom
                textArea.style.opacity = '0'; // Hide it
                textArea.style.pointerEvents = 'none'; // Prevent interaction
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                const successful = document.execCommand('copy');
                textArea.remove();
                if (!successful) throw new Error('Fallback copy command failed.');
            }
            this.showToast(`${contentType} скопійовано в буфер обміну!`, 'success');
            this.playSound(600, 0.1, 0.08);
        } catch (error) {
            console.error('Failed to copy text:', error);
            this.showToast(`Не вдалося скопіювати ${contentType.toLowerCase()}`, 'error');
        }
    }
    
    // ... (showToast, getToastIcon, removeToast, getOrCreateToastContainer, showError, showSuccess remain largely the same)
    // Updated showToast to handle custom icons and close button better

    /**
     * Displays a toast notification.
     * @param {string} message - The message to display.
     * @param {'info'|'success'|'error'|'warning'} [type='info'] - The type of toast.
     * @param {number} [duration=4000] - How long the toast should be visible (in ms).
     * @returns {HTMLElement} The created toast element.
     * INFO: Requires CSS for .toast-container, .toast, .toast-icon, .toast-close etc.
     */
    showToast(message, type = 'info', duration = 4000) {
        const toastContainer = this.getOrCreateToastContainer();
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`; // Use specific class for type
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', type === 'error' || type === 'warning' ? 'assertive' : 'polite');
        
        const iconHTML = `<span class="toast-icon" aria-hidden="true">${this.getToastIcon(type)}</span>`;
        
        toast.innerHTML = `
            <div class="toast-content">
                ${iconHTML}
                <span class="toast-message">${message}</span>
            </div>
            <button type="button" class="toast-close" aria-label="Закрити повідомлення">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;
        
        const closeButton = toast.querySelector('.toast-close');
        closeButton.addEventListener('click', () => this.removeToast(toast));
        
        toastContainer.prepend(toast); // Prepend for newer toasts on top
        
        // Animate in
        requestAnimationFrame(() => { // Ensure element is in DOM for transition
            toast.classList.add('show');
        });
        
        if (duration > 0) { // Allow indefinite toasts if duration is 0 or less
            setTimeout(() => this.removeToast(toast), duration);
        }
        return toast;
    }

    /**
     * Gets an appropriate icon for a toast type.
     * @param {string} type - The toast type.
     * @returns {string} An emoji icon.
     * @private
     */
    getToastIcon(type) {
        const icons = {
            success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }

    /**
     * Removes a toast notification with an animation.
     * @param {HTMLElement} toast - The toast element to remove.
     * @private
     */
    removeToast(toast) {
        if (!toast || !toast.parentNode) return;
        
        toast.classList.remove('show');
        toast.classList.add('removing'); // For outro animation
        toast.addEventListener('transitionend', () => {
            toast.remove();
        }, { once: true });
        // Fallback if no transition
        setTimeout(() => toast.remove(), 500);
    }

    /**
     * Gets or creates the main container for toast notifications.
     * @returns {HTMLElement} The toast container element.
     * @private
     */
    getOrCreateToastContainer() {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container'; // CSS should style this
            container.setAttribute('aria-live', 'polite'); // Announce toasts as they appear
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
        this.setupSmoothScrolling(); // Already handles its own event listeners
        this.setupKeyboardNavigation(); // Adds global listeners
        this.setupContextMenu(); // Adds global listeners
    }

    /**
     * Sets up hover and click interactions for feature cards.
     * INFO: Relies on CSS for '.ripple-effect' and hover styles.
     */
    setupFeatureCardInteractions() {
        document.querySelectorAll('.feature-card-iui').forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.playSound(400, 0.02, 0.03);
                // CSS should handle hover effects primarily for performance.
                // JS can add a class if needed: e.currentTarget.classList.add('hovering');
            });
            // card.addEventListener('mouseleave', (e) => e.currentTarget.classList.remove('hovering'));
            
            card.addEventListener('click', (e) => {
                this.playSound(800, 0.05, 0.05);
                // INFO: Requires CSS for '.ripple-effect' animation.
                this.createRippleEffect(e.currentTarget, e);
            });
        });
    }

    /**
     * Creates a ripple effect on an element upon click.
     * @param {HTMLElement} element - The element to apply the ripple to.
     * @param {MouseEvent} event - The click event.
     * INFO: Requires CSS for '.ripple-effect' class (position, background, border-radius, transform, animation).
     */
    createRippleEffect(element, event) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect'; // Ensure CSS defines this class
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        // Calculate position relative to the element, not viewport
        const x = event.clientX - rect.left - (size / 2);
        const y = event.clientY - rect.top - (size / 2);
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        // Ensure element can contain absolutely positioned children
        if (getComputedStyle(element).position === 'static') {
            element.style.position = 'relative';
        }
        element.style.overflow = 'hidden'; // Contain ripple
        
        element.appendChild(ripple);
        
        // Remove ripple after animation (CSS animation duration should match)
        ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
        setTimeout(() => ripple.remove(), 600); // Fallback removal
    }

    /**
     * Sets up animation for the main site logo.
     * Relies on IntersectionObserver to trigger when visible.
     */
    setupLogoAnimation() {
        const logo = document.querySelector('#ggeniusAnimatedLogo');
        if (!logo) return;
        
        const animateLogoElements = () => {
            // Animations are defined in CSS, JS just triggers by adding classes or can manipulate SMIL
            // For this setup, CSS animations on .logo-hexagon-frame etc. are expected.
            // If direct SMIL manipulation:
            // const hexagon = logo.querySelector('.logo-hexagon-frame animate');
            // hexagon?.beginElement();
            logo.classList.add('animate-logo-active'); // Add a class to trigger CSS animations
        };
        
        const logoObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateLogoElements();
                    observer.unobserve(entry.target); // Animate once
                }
            });
        }, { threshold: 0.1 });
        
        logoObserver.observe(logo);
        this.observers.set('logoAnimation', logoObserver);
    }

    /**
     * Sets up smooth scrolling for anchor links.
     */
    setupSmoothScrolling() {
        document.addEventListener('click', (e) => {
            const anchor = e.target.closest('a[href^="#"]');
            if (!anchor) return;

            const targetId = anchor.getAttribute('href');
            // Ensure it's a valid ID selector and not just "#"
            if (targetId.length > 1 && document.getElementById(targetId.substring(1))) {
                e.preventDefault();
                this.smoothScrollTo(targetId);
            }
        });
    }

    /**
     * Smoothly scrolls the page to a target element.
     * @param {string} targetId - The ID of the target element (e.g., "#section").
     */
    smoothScrollTo(targetId) {
        const targetElement = document.getElementById(targetId.substring(1)); // Remove #
        if (!targetElement) {
            console.warn(`Smooth scroll target not found: ${targetId}`);
            return;
        }
        
        const headerOffset = this.header?.offsetHeight || 70; // Fallback offset
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset - 20; // Extra 20px padding

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
        
        // Update URL hash without jumping, for history and direct linking
        if (history.pushState) {
            history.pushState(null, null, targetId);
        } else {
            // Fallback for older browsers, might cause a jump
            // window.location.hash = targetId;
        }
    }

    /**
     * Sets up keyboard navigation enhancements (e.g., tab traps, arrow key navigation).
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            const openModal = document.querySelector('.modal-overlay.show');
            if (e.key === 'Tab' && openModal) {
                this.handleModalTabTrap(e, openModal);
            }

            const focusedTabList = e.target.closest('[role="tablist"].feature-categories');
            if (focusedTabList && (e.key.startsWith('Arrow') || e.key === 'Home' || e.key === 'End')) {
                this.handleTabArrowNavigation(e, focusedTabList);
            }
        });
    }
    
    /**
     * Handles arrow key navigation within a tab list.
     * @param {KeyboardEvent} e - The keyboard event.
     * @param {HTMLElement} tabList - The tab list element.
     */
    handleTabArrowNavigation(e, tabList) {
        const tabs = Array.from(tabList.querySelectorAll('[role="tab"]'));
        let currentIndex = tabs.findIndex(tab => tab === document.activeElement);
        if (currentIndex === -1) return; // Not focused on a tab

        let newIndex = currentIndex;

        switch (e.key) {
            case 'ArrowLeft':
            case 'ArrowUp': // Common for vertical tabs too
                e.preventDefault();
                newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
                break;
            case 'ArrowRight':
            case 'ArrowDown':
                e.preventDefault();
                newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
                break;
            case 'Home':
                e.preventDefault();
                newIndex = 0;
                break;
            case 'End':
                e.preventDefault();
                newIndex = tabs.length - 1;
                break;
            default:
                return; // Not a navigation key for tabs
        }

        if (newIndex !== currentIndex) {
            tabs[newIndex].focus();
            // Optionally auto-activate on focus, or require Enter/Space
            // this.switchTab(tabs[newIndex], tabs, ...); // If auto-activation desired
        }
    }


    /**
     * Handles tab trapping within a modal dialog for accessibility.
     * @param {KeyboardEvent} e - The keyboard event.
     * @param {HTMLElement} modal - The modal element.
     * @private
     */
    handleModalTabTrap(e, modal) {
        // this.firstFocusableElement and this.lastFocusableElement should be set when modal is shown
        if (!this.firstFocusableElement || !this.lastFocusableElement) {
            const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusableElements.length === 0) return; // No focusable elements
            this.firstFocusableElement = focusableElements[0];
            this.lastFocusableElement = focusableElements[focusableElements.length - 1];
        }
        
        if (e.shiftKey) { // Shift + Tab
            if (document.activeElement === this.firstFocusableElement) {
                this.lastFocusableElement.focus();
                e.preventDefault();
            }
        } else { // Tab
            if (document.activeElement === this.lastFocusableElement) {
                this.firstFocusableElement.focus();
                e.preventDefault();
            }
        }
    }

    /**
     * Sets up a custom context menu.
     * INFO: Requires CSS for '.context-menu' and its items.
     */
    setupContextMenu() {
        document.addEventListener('contextmenu', (e) => {
            // Only show for specific elements, e.g., feature cards or tech items
            const interactiveTarget = e.target.closest('.feature-card-iui, .tech-item, .hero-logo-container');
            if (interactiveTarget) {
                e.preventDefault();
                this.showContextMenu(e, interactiveTarget);
            }
        });
        
        // Global click listener to hide context menu
        document.addEventListener('click', (e) => {
            // Hide if click is outside the context menu
            if (!e.target.closest('.context-menu')) {
                this.hideContextMenu();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.hideContextMenu();
        });
    }

    /**
     * Shows the custom context menu.
     * @param {MouseEvent} e - The contextmenu event.
     * @param {HTMLElement} targetElement - The element the context menu is for.
     * INFO: Requires CSS for '.context-menu' and its items.
     */
    showContextMenu(e, targetElement) {
        this.hideContextMenu(); // Remove any existing menu
        
        const menu = document.createElement('div');
        menu.className = 'context-menu'; // CSS should style this
        menu.setAttribute('role', 'menu');
        menu.setAttribute('aria-label', 'Контекстне меню');
        
        // Example actions, customize as needed
        let menuItems = `
            <div class="context-menu-item" role="menuitem" tabindex="0" data-action="copy-link">🔗 Копіювати посилання на сторінку</div>
            <div class="context-menu-item" role="menuitem" tabindex="0" data-action="share">📤 Поділитися сторінкою</div>
        `;
        if (targetElement.id) {
             menuItems += `<div class="context-menu-item" role="menuitem" tabindex="0" data-action="copy-section-link" data-target-id="${targetElement.id}">🔗 Копіювати посилання на секцію</div>`;
        }

        menu.innerHTML = menuItems;
        
        menu.style.position = 'fixed';
        menu.style.left = `${e.clientX}px`;
        menu.style.top = `${e.clientY}px`;
        // z-index should be high, e.g., from CSS variable --z-max
        
        document.body.appendChild(menu);
        menu.querySelector('[role="menuitem"]')?.focus(); // Focus first item
        
        menu.addEventListener('click', (menuEvent) => {
            const menuItem = menuEvent.target.closest('.context-menu-item');
            if (menuItem) {
                const action = menuItem.dataset.action;
                const targetId = menuItem.dataset.targetId;
                this.handleContextMenuAction(action, targetElement, targetId);
                this.hideContextMenu();
            }
        });
        menu.addEventListener('keydown', (menuEvent) => {
            if (menuEvent.key === 'Enter' || menuEvent.key === ' ') {
                 const menuItem = menuEvent.target.closest('.context-menu-item');
                 if (menuItem) {
                    menuItem.click(); // Trigger the click handler
                 }
            }
        });

        // Adjust position if out of viewport
        requestAnimationFrame(() => {
            const rect = menu.getBoundingClientRect();
            if (rect.right > window.innerWidth) {
                menu.style.left = `${window.innerWidth - rect.width - 5}px`;
            }
            if (rect.bottom > window.innerHeight) {
                menu.style.top = `${window.innerHeight - rect.height - 5}px`;
            }
        });
    }

    /**
     * Hides the custom context menu.
     */
    hideContextMenu() {
        document.querySelectorAll('.context-menu').forEach(menu => menu.remove());
    }

    /**
     * Handles actions from the custom context menu.
     * @param {string} action - The action to perform.
     * @param {HTMLElement} targetElement - The element the action is related to.
     * @param {string} [targetId] - Optional ID for section-specific actions.
     */
    handleContextMenuAction(action, targetElement, targetId) {
        let urlToCopy = window.location.origin + window.location.pathname;
        if (targetId && action === "copy-section-link") {
            urlToCopy += `#${targetId}`;
        }

        switch (action) {
            case 'copy-link':
                this.copyToClipboard(window.location.href, 'Посилання на сторінку');
                break;
            case 'copy-section-link':
                 this.copyToClipboard(urlToCopy, 'Посилання на секцію');
                break;
            case 'share':
                this.shareContent(
                    'GGenius - AI Революція в MLBB Кіберспорті',
                    'Відкрийте майбутнє кіберспорту з штучним інтелектом!',
                    urlToCopy
                );
                break;
            case 'bookmark': // Note: Programmatic bookmarking is generally not allowed.
                this.showToast('Натисніть Ctrl+D (Cmd+D на Mac) для додавання в закладки.', 'info', 6000);
                break;
        }
    }

    /**
     * Shares content using the Web Share API or fallback.
     * @param {string} title - The title of the content to share.
     * @param {string} text - The description text.
     * @param {string} url - The URL to share.
     * @async
     */
    async shareContent(title, text, url) {
        const shareData = { title, text, url };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
                this.showToast('Контент успішно поширено!', 'success');
            } else {
                await this.copyToClipboard(url, 'Посилання');
                this.showToast('Посилання скопійовано для поширення.', 'info');
            }
        } catch (error) {
            // Don't show error if user cancels share dialog (AbortError)
            if (error.name !== 'AbortError') {
                console.error('Share API failed:', error);
                this.showToast('Не вдалося поділитися.', 'error');
            }
        }
    }
    
    // ... (addToBookmarks, setupAdvancedFeatures, preloadResources, setupServiceWorker, showUpdateAvailable, setupInstallPrompt, showInstallBanner)
    // ... (setupTypingAnimation, setupBackgroundMusic, startAmbientMusic, stopAmbientMusic, setupGamingCursor)
    // ... (playSound, triggerEntryAnimations, trackLoadTime, handleResize, handleVisibilityChange, pauseAnimations, resumeAnimations)
    // ... (fallbackMode, setupBasicNavigation, setupBasicForms, throttle, debounce)

    /**
     * Sets up advanced features like resource preloading, service worker, PWA install prompt, etc.
     * @async
     */
    async setupAdvancedFeatures() {
        this.preloadResources();
        
        if ('serviceWorker' in navigator && window.isSecureContext) { // SW only in secure contexts
            this.setupServiceWorker();
        }
        
        this.setupInstallPrompt(); // PWA install prompt
        
        if (!this.performance.isLowPerformance) {
            this.setupTypingAnimation();
            // this.setupBackgroundMusic(); // Uncomment if background music is desired
        }
    }

    /**
     * Preloads critical resources using <link rel="prefetch"> or other methods.
     */
    preloadResources() {
        const criticalResources = [
            // Example: '/static/images/critical-bg.webp',
            // '/static/fonts/exo2-bold.woff2' // if not covered by CSS font-display
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'prefetch'; // or 'preload' with 'as' attribute if more critical
            link.href = resource;
            // if (resource.endsWith('.woff2')) link.as = 'font'; link.type = 'font/woff2'; link.crossOrigin = "anonymous";
            document.head.appendChild(link);
        });
    }

    /**
     * Registers the service worker and handles updates.
     * INFO: Requires a sw.js file at the specified path (e.g., root or /static/js/sw.js).
     * @async
     */
    async setupServiceWorker() {
        const swPath = '/sw.js'; // IMPORTANT: Adjust this path if sw.js is not at the root.
                               // Consider scope: { scope: '/' } if sw.js is e.g. /js/sw.js
        try {
            const registration = await navigator.serviceWorker.register(swPath);
            console.log('✅ ServiceWorker registered successfully. Scope:', registration.scope);
            
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                if (newWorker) {
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateAvailable(registration); // Pass registration to control update
                        }
                    });
                }
            });
        } catch (error) {
            console.error('🔥 ServiceWorker registration failed:', error);
        }
        // Handle controller change for seamless updates
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            window.location.reload();
        });
    }

    /**
     * Shows a toast notification when a service worker update is available.
     * @param {ServiceWorkerRegistration} registration - The service worker registration object.
     */
    showUpdateAvailable(registration) {
        const toast = this.showToast(
            'Доступна нова версія GGenius! Оновити зараз?',
            'info',
            0 // Indefinite toast until user interacts
        );
        
        const toastContent = toast.querySelector('.toast-content');
        if (toastContent) {
            const updateButton = document.createElement('button');
            updateButton.textContent = 'Оновити';
            updateButton.className = 'toast-action button-primary'; // Add some styling classes
            updateButton.style.marginLeft = '10px';
            updateButton.addEventListener('click', () => {
                toast.remove(); // Close toast
                // Send message to SW to skip waiting and activate new version
                if (registration.waiting) {
                    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                }
                // Reloading is handled by 'controllerchange' listener
            });
            toastContent.appendChild(updateButton);
        }
    }

    /**
     * Sets up the PWA beforeinstallprompt event to allow app installation.
     */
    setupInstallPrompt() {
        let deferredInstallPrompt = null;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault(); // Prevent the mini-infobar from appearing on mobile
            deferredInstallPrompt = e;
            // INFO: CSS for '.install-banner' is required.
            this.showInstallBanner(deferredInstallPrompt); // Show your custom install button
            console.log('🤝 `beforeinstallprompt` event was fired.');
        });
        
        window.addEventListener('appinstalled', () => {
            deferredInstallPrompt = null; // Clear the deferred prompt
            console.log('🎉 GGenius PWA installed successfully!');
            this.showToast('GGenius успішно встановлено!', 'success');
            // Hide install banner if it was still visible
            document.querySelector('.install-banner')?.remove();
        });
    }

    /**
     * Shows a custom UI banner for PWA installation.
     * @param {Event} promptEvent - The beforeinstallprompt event.
     * INFO: Requires CSS for '.install-banner', '.install-button', '.install-close'.
     */
    showInstallBanner(promptEvent) {
        // Remove any existing banner
        document.querySelector('.install-banner')?.remove();

        const banner = document.createElement('div');
        banner.className = 'install-banner'; // Style this with CSS
        // Example HTML, adapt to your design
        banner.innerHTML = `
            <div class="install-content">
                <span class.install-icon" aria-hidden="true">📱</span>
                <div class="install-text">
                    <strong>Встановити GGenius</strong>
                    <small>Швидший доступ та офлайн можливості.</small>
                </div>
                <button type="button" class="install-button button-primary">Встановити</button>
                <button type="button" class="install-close" aria-label="Закрити пропозицію встановлення">✕</button>
            </div>
        `;
        
        const installButton = banner.querySelector('.install-button');
        const closeButton = banner.querySelector('.install-close');

        installButton.addEventListener('click', async () => {
            banner.remove();
            if (!promptEvent) return;
            promptEvent.prompt(); // Show the browser install prompt
            const { outcome } = await promptEvent.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
            // promptEvent = null; // The prompt can only be used once.
        });
        
        closeButton.addEventListener('click', () => banner.remove());
        
        document.body.appendChild(banner);
        // Auto-hide after a while if not interacted with
        setTimeout(() => banner.remove(), 30000);
    }

    /**
     * Sets up a typing animation for the hero section subtitle.
     */
    setupTypingAnimation() {
        const subtitleElement = document.querySelector('.hero-section .subtitle');
        if (!subtitleElement || !subtitleElement.textContent?.trim()) return;
        
        const originalText = subtitleElement.textContent.trim();
        subtitleElement.innerHTML = ''; // Clear current content, use innerHTML for potential entities
        subtitleElement.style.opacity = '1'; // Ensure it's visible
        
        let currentIndex = 0;
        const typeCharacter = () => {
            if (currentIndex < originalText.length) {
                subtitleElement.textContent += originalText[currentIndex];
                currentIndex++;
                const speed = 20 + Math.random() * 50; // Adjusted speed
                setTimeout(typeCharacter, speed);
                
                if (currentIndex % 4 === 0) { // Less frequent sound
                    this.playSound(900 + Math.random() * 100, 0.01, 0.01);
                }
            } else {
                subtitleElement.classList.add('typing-complete'); // Add class for potential cursor blink stop
            }
        };
        
        // Start after a slight delay for other animations
        setTimeout(typeCharacter, this.isLoaded ? 500 : 2500);
    }
    
    /**
     * Sets up optional background music with a toggle control.
     * INFO: Requires CSS for '.music-toggle'.
     */
    setupBackgroundMusic() {
        if (this.performance.isLowPerformance) return;
        
        const musicToggle = document.createElement('button');
        musicToggle.type = 'button';
        musicToggle.className = 'music-toggle'; // Style with CSS
        musicToggle.innerHTML = '🎵'; // Initial state: music off
        musicToggle.title = 'Увімкнути/вимкнути фонову музику';
        musicToggle.setAttribute('aria-label', 'Увімкнути фонову музику');
        musicToggle.setAttribute('aria-pressed', 'false');
        
        document.body.appendChild(musicToggle);
        
        let isPlaying = false;
        
        musicToggle.addEventListener('click', () => {
            if (!this.audioContext) { // Initialize AudioContext on first user interaction
                try {
                    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                } catch (error) {
                    console.error("AudioContext not supported.", error);
                    musicToggle.remove(); // Remove button if audio not supported
                    return;
                }
            }
            // Resume context if suspended
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }

            isPlaying = !isPlaying;
            if (isPlaying) {
                this.startAmbientMusic();
                musicToggle.innerHTML = '🔇';
                musicToggle.title = 'Вимкнути фонову музику';
                musicToggle.setAttribute('aria-pressed', 'true');
            } else {
                this.stopAmbientMusic();
                musicToggle.innerHTML = '🎵';
                musicToggle.title = 'Увімкнути фонову музику';
                musicToggle.setAttribute('aria-pressed', 'false');
            }
        });
    }

    /**
     * Starts playing ambient background music.
     * @private
     */
    startAmbientMusic() {
        if (!this.audioContext || this.ambientOscillators) return; // Already playing or no context
        
        this.ambientGain = this.audioContext.createGain();
        this.ambientGain.gain.setValueAtTime(0.005, this.audioContext.currentTime); // Very subtle
        this.ambientGain.connect(this.audioContext.destination);

        const osc1 = this.audioContext.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(55, this.audioContext.currentTime); // A1
        osc1.connect(this.ambientGain);
        osc1.start();

        const osc2 = this.audioContext.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(82.41, this.audioContext.currentTime); // E2
        // Detune slightly for a chorus effect
        osc2.detune.setValueAtTime(5, this.audioContext.currentTime); // 5 cents
        osc2.connect(this.ambientGain);
        osc2.start();
        
        this.ambientOscillators = [osc1, osc2];
    }

    /**
     * Stops the ambient background music.
     * @private
     */
    stopAmbientMusic() {
        if (this.ambientOscillators && this.audioContext) {
            this.ambientOscillators.forEach(osc => {
                try {
                    osc.stop(this.audioContext.currentTime + 0.1); // Fade out slightly
                    osc.disconnect();
                } catch(e) { /* ignore if already stopped */ }
            });
            this.ambientOscillators = null;
        }
        if (this.ambientGain) {
            this.ambientGain.gain.exponentialRampToValueAtTime(0.00001, this.audioContext.currentTime + 0.1);
            this.ambientGain.disconnect();
            this.ambientGain = null;
        }
    }

    /**
     * Sets up a custom gaming-style cursor.
     * INFO: Requires CSS for '.gaming-cursor', '.cursor-dot', '.cursor-ring'.
     */
    setupGamingCursor() {
        const cursorElement = document.createElement('div');
        cursorElement.className = 'gaming-cursor'; // Ensure CSS styles this
        cursorElement.setAttribute('aria-hidden', 'true');
        cursorElement.innerHTML = `<div class="cursor-dot"></div><div class="cursor-ring"></div>`;
        document.body.appendChild(cursorElement);
        
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let rafId;

        const updateMousePosition = (e) => { mouseX = e.clientX; mouseY = e.clientY; };
        document.addEventListener('mousemove', updateMousePosition);
        
        const animateCursor = () => {
            const easeFactor = 0.18; // Adjust for desired smoothness
            cursorX += (mouseX - cursorX) * easeFactor;
            cursorY += (mouseY - cursorY) * easeFactor;
            cursorElement.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
            rafId = requestAnimationFrame(animateCursor);
        };
        
        rafId = requestAnimationFrame(animateCursor);
        this.animations.set('gamingCursor', rafId);

        const onMouseDown = () => cursorElement.classList.add('clicked');
        const onMouseUp = () => cursorElement.classList.remove('clicked');
        const onMouseLeave = () => cursorElement.style.opacity = '0';
        const onMouseEnter = () => cursorElement.style.opacity = '1';

        document.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mouseup', onMouseUp);
        document.documentElement.addEventListener('mouseleave', onMouseLeave); // Use documentElement for window edge
        document.documentElement.addEventListener('mouseenter', onMouseEnter);

        // Store listeners to remove them in destroy()
        this.gamingCursorListeners = { updateMousePosition, onMouseDown, onMouseUp, onMouseLeave, onMouseEnter };

        // Hover effects for interactive elements
        document.querySelectorAll('a, button, [role="button"], [role="tab"], .accordion-header, .feature-card-iui, .tech-item')
            .forEach(el => {
                el.addEventListener('mouseenter', () => cursorElement.classList.add('hover-interactive'));
                el.addEventListener('mouseleave', () => cursorElement.classList.remove('hover-interactive'));
            });
    }

    /**
     * Plays a sound effect using Web Audio API.
     * @param {number} frequency - The frequency of the sound in Hz.
     * @param {number} [duration=0.1] - Duration of the sound in seconds.
     * @param {number} [volume=0.05] - Volume (0.0 to 1.0).
     */
    playSound(frequency, duration = 0.1, volume = 0.05) {
        if (this.performance.isLowPerformance && volume > 0.02) volume = 0.02; // Quieter on low-perf

        if (!this.audioContext) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (error) {
                // console.warn("AudioContext not supported, cannot play sound.");
                return;
            }
        }
        
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume().catch(err => console.warn("AudioContext resume failed:", err));
        }
        if (this.audioContext.state !== 'running') return; // Don't play if not running

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.type = 'sine'; // 'sine', 'square', 'sawtooth', 'triangle'
            
            gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        } catch (error) {
            console.warn('Sound playback failed:', error);
        }
    }

    /**
     * Triggers entry animations for hero section elements.
     * INFO: Assumes specific CSS classes for animations are defined (e.g., from animate.css or custom).
     */
    triggerEntryAnimations() {
        const heroElementsToAnimate = [
            { selector: '.hero-logo-container', delay: 100, animation: 'fadeInDown' },
            { selector: '.hero-title', delay: 300, animation: 'fadeInUp' },
            // Subtitle is handled by typing animation
            { selector: '.hero-actions', delay: 500, animation: 'fadeInUp' },
            { selector: '.hero-stats', delay: 700, animation: 'fadeIn' }
        ];
        
        heroElementsToAnimate.forEach(item => {
            const element = document.querySelector(item.selector);
            if (element) {
                // Apply styles directly for simple fade/translate or add animation classes
                element.style.opacity = '0'; // Start hidden
                element.style.transition = `opacity 0.5s ease-out ${item.delay / 1000}s, transform 0.5s ease-out ${item.delay / 1000}s`;
                
                requestAnimationFrame(() => { // Ensure styles are applied before transition starts
                    element.style.opacity = '1';
                    // Example transform, adjust based on desired animation from CSS
                    if (item.animation === 'fadeInUp') element.style.transform = 'translateY(0)';
                    if (item.animation === 'fadeInDown') element.style.transform = 'translateY(0)';
                    // For more complex animations, add classes:
                    // setTimeout(() => element.classList.add('animate-in', item.animation), item.delay);
                });
            }
        });
        
        // INFO: Floating elements animation requires HTML for '.floating-gaming-icon'
        // and CSS for 'float3D' animation.
        document.querySelectorAll('.hero-floating-elements .floating-gaming-icon').forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                // element.style.animation = `float3D 12s ease-in-out infinite ${index * 1.5}s alternate`; // Example
            }, 1000 + index * 200);
        });
    }

    /**
     * Tracks and logs the total page load time.
     */
    trackLoadTime() {
        // Ensure this runs after all major async operations might have settled
        // or use performance.mark and performance.measure for more accuracy.
        const loadTime = performance.now() - this.performance.startTime;
        this.performance.metrics.totalAppInitTime = loadTime;
        
        console.log(`🎯 GGenius App initialized in ${loadTime.toFixed(2)}ms`);
        
        if (window.gtag && typeof gtag === 'function') {
            gtag('event', 'timing_complete', {
                name: 'app_init_time',
                value: Math.round(loadTime),
                event_category: 'Performance',
                event_label: 'GGenius App Initialization'
            });
        }
    }

    /**
     * Handles window resize events, e.g., for updating viewport units.
     */
    handleResize() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        if (this.scrollProgress) { // Recalculate scroll progress if needed
            this.handleScroll();
        }
        // Other resize-dependent logic can go here
    }

    /**
     * Handles document visibility changes (tab active/inactive).
     */
    handleVisibilityChange() {
        if (document.hidden) {
            this.pauseAnimationsAndAudio();
        } else {
            this.resumeAnimationsAndAudio();
        }
    }

    /**
     * Pauses animations and audio when the page is not visible.
     */
    pauseAnimationsAndAudio() {
        document.body.classList.add('app-paused'); // For CSS to pause animations
        if (this.ambientGain && this.audioContext && this.audioContext.state === 'running') {
            this.ambientGain.gain.exponentialRampToValueAtTime(0.00001, this.audioContext.currentTime + 0.5);
        }
        // TODO: Pause other specific animations or audio if necessary
        console.log("App paused (visibility hidden)");
    }

    /**
     * Resumes animations and audio when the page becomes visible.
     */
    resumeAnimationsAndAudio() {
        document.body.classList.remove('app-paused');
        if (this.ambientGain && this.audioContext && this.audioContext.state === 'running' && 
            document.querySelector('.music-toggle[aria-pressed="true"]')) { // Only resume if music was on
            this.ambientGain.gain.exponentialRampToValueAtTime(0.005, this.audioContext.currentTime + 0.5);
        }
        // TODO: Resume other specific animations or audio
        console.log("App resumed (visibility visible)");
    }

    /**
     * Activates a fallback mode if critical errors occur during initialization.
     * @param {Error} error - The error that triggered fallback mode.
     */
    fallbackMode(error) {
        console.warn('🔧 Entering fallback mode due to error:', error.message);
        
        document.documentElement.classList.remove('js-loaded');
        document.documentElement.classList.add('js-fallback');

        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) loadingScreen.style.display = 'none'; // Hide loading screen
        
        // Show a user-friendly message on the page
        let fallbackMessage = document.getElementById('fallback-message-container');
        if (!fallbackMessage) {
            fallbackMessage = document.createElement('div');
            fallbackMessage.id = 'fallback-message-container';
            fallbackMessage.style.cssText = 'position:fixed; top:0; left:0; width:100%; background:red; color:white; padding:10px; text-align:center; z-index:10000;';
            document.body.prepend(fallbackMessage);
        }
        fallbackMessage.innerHTML = `Вибачте, сталася помилка завантаження сторінки. Деякі функції можуть бути недоступні. (${error.message})`;

        // Only setup very basic functionality
        this.setupBasicNavigation(); // Ensure basic nav works
        // this.setupBasicForms(); // If forms are critical
    }
    
    /** Basic navigation for fallback mode */
    setupBasicNavigation() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', (e) => {
                e.preventDefault();
                navMenu.style.display = navMenu.style.display === 'block' ? 'none' : 'block';
            });
        }
    }
    
    /** Basic form handling for fallback mode */
    // setupBasicForms() { /* ... */ }


    /**
     * Throttles a function to limit its execution rate.
     * @param {Function} func - The function to throttle.
     * @param {number} delay - The throttle delay in milliseconds.
     * @returns {Function} The throttled function.
     * @private
     */
    throttle(func, delay) {
        let inThrottle;
        let lastArgs;
        let lastThis;
        return function(...args) {
            lastArgs = args;
            lastThis = this;
            if (!inThrottle) {
                func.apply(lastThis, lastArgs);
                inThrottle = true;
                setTimeout(() => {
                    inThrottle = false;
                    // Optionally, call again with last saved args if they changed
                    // func.apply(lastThis, lastArgs); 
                }, delay);
            }
        };
    }

    /**
     * Debounces a function to delay its execution until after a certain period of inactivity.
     * @param {Function} func - The function to debounce.
     * @param {number} delay - The debounce delay in milliseconds.
     * @returns {Function} The debounced function.
     * @private
     */
    debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    /**
     * Cleans up resources, removes event listeners to prevent memory leaks.
     * Call this if the GGeniusApp instance needs to be disposed of.
     */
    destroy() {
        console.log('🧹 Destroying GGeniusApp instance and cleaning up resources...');
        // Remove global event listeners
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        document.removeEventListener('mousemove', this.gamingCursorListeners?.updateMousePosition);
        document.removeEventListener('mousedown', this.gamingCursorListeners?.onMouseDown);
        document.removeEventListener('mouseup', this.gamingCursorListeners?.onMouseUp);
        document.documentElement.removeEventListener('mouseleave', this.gamingCursorListeners?.onMouseLeave);
        document.documentElement.removeEventListener('mouseenter', this.gamingCursorListeners?.onMouseEnter);
        // TODO: Remove listeners from mobileToggle, navMenu, demoButtons, accordions, tabs, forms, contextmenu, etc.
        // This requires storing references to these listeners or iterating through elements and removing specific handlers.

        // Disconnect all IntersectionObserver instances
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();

        // Cancel any ongoing animations or timeouts/intervals
        this.animations.forEach(rafId => cancelAnimationFrame(rafId));
        this.animations.clear();
        if(this.memoryMonitorInterval) clearInterval(this.memoryMonitorInterval);

        // Stop audio and close AudioContext
        this.stopAmbientMusic();
        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close().catch(e => console.warn("Error closing AudioContext:", e));
        }

        // Remove dynamically created elements
        document.querySelector('.gaming-cursor')?.remove();
        document.querySelector('.music-toggle')?.remove();
        document.querySelector('#toast-container')?.remove();
        document.querySelectorAll('.modal-overlay').forEach(modal => modal.remove());
        document.querySelector('.install-banner')?.remove();
        this.scrollProgress?.remove();


        console.log('✅ GGeniusApp destroyed.');
    }
}

// Initialize the app once the DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new GGeniusApp());
} else {
    new GGeniusApp();
}
