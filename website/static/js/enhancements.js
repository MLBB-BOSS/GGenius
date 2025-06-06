/**
 * GGenius Advanced Enhancement System
 * Mobile-First Progressive Web App with AI-Powered UX
 * 
 * @author MLBB-BOSS
 * @version 2.0.0
 * @license MIT
 */

class GGeniusAdvancedSystem {
    constructor() {
        this.version = '2.0.0';
        this.isProduction = window.location.hostname !== 'localhost';
        this.isMobile = this.detectMobileDevice();
        this.supportsAdvancedFeatures = this.checkAdvancedSupport();
        
        // Performance monitoring
        this.performanceMetrics = {
            startTime: performance.now(),
            interactions: 0,
            errors: 0
        };
        
        // Mobile-specific configurations
        this.mobileConfig = {
            touchDelay: 300,
            swipeThreshold: 100,
            animationDuration: this.isMobile ? 200 : 300
        };
        
        this.initializeSystem();
    }

    /**
     * Detect mobile device with comprehensive checks
     * @returns {boolean} True if mobile device detected
     */
    detectMobileDevice(): boolean {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
        
        return mobileRegex.test(userAgent) || 
               (window.matchMedia && window.matchMedia('(max-width: 767px)').matches) ||
               ('ontouchstart' in window) ||
               (navigator.maxTouchPoints > 0);
    }

    /**
     * Check for advanced browser features
     * @returns {boolean} True if advanced features supported
     */
    checkAdvancedSupport(): boolean {
        return !!(
            window.IntersectionObserver &&
            window.requestAnimationFrame &&
            window.CSS &&
            window.CSS.supports &&
            window.CSS.supports('backdrop-filter', 'blur(10px)')
        );
    }

    /**
     * Initialize the complete system
     */
    async initializeSystem(): Promise<void> {
        try {
            // Show loading indicator
            this.showLoadingIndicator();
            
            // Initialize core components
            await this.initializeComponents();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Initialize mobile-specific features
            if (this.isMobile) {
                await this.initializeMobileFeatures();
            }
            
            // Setup performance monitoring
            this.setupPerformanceMonitoring();
            
            // Handle initial page state
            await this.handleInitialPageLoad();
            
            // Hide loading indicator
            this.hideLoadingIndicator();
            
            console.log(`✅ GGenius v${this.version} initialized successfully`);
            
        } catch (error) {
            this.handleInitializationError(error);
        }
    }

    /**
     * Initialize core components
     */
    async initializeComponents(): Promise<void> {
        // DOM element references
        this.elements = {
            body: document.body,
            header: document.querySelector('.site-header'),
            mobileMenuToggle: document.querySelector('.mobile-menu-toggle'),
            mobileNavigationOverlay: document.querySelector('.mobile-navigation-overlay'),
            accordions: document.querySelectorAll('.accordion-header'),
            navLinks: document.querySelectorAll('.main-navigation a, .mobile-nav-link'),
            loadingIndicator: document.getElementById('loading-indicator'),
            logo: document.getElementById('ggeniusAnimatedLogo'),
            featureCards: document.querySelectorAll('.feature-card-iui'),
            techItems: document.querySelectorAll('.tech-item'),
            ctaButtons: document.querySelectorAll('.cta-button')
        };

        // Initialize intersection observer for animations
        if (this.supportsAdvancedFeatures) {
            this.initializeIntersectionObserver();
        }

        // Initialize touch gesture handler for mobile
        if (this.isMobile) {
            this.initializeTouchGestures();
        }
    }

    /**
     * Setup comprehensive event listeners
     */
    setupEventListeners(): void {
        // Mobile menu functionality
        if (this.elements.mobileMenuToggle) {
            this.elements.mobileMenuToggle.addEventListener('click', 
                this.toggleMobileMenu.bind(this), { passive: true });
            
            // Keyboard accessibility
            this.elements.mobileMenuToggle.addEventListener('keydown', 
                this.handleMobileMenuKeydown.bind(this));
        }

        // Accordion functionality
        this.elements.accordions.forEach(header => {
            header.addEventListener('click', this.handleAccordionToggle.bind(this));
            header.addEventListener('keydown', this.handleAccordionKeydown.bind(this));
        });

        // Navigation with smooth scrolling
        this.elements.navLinks.forEach(link => {
            link.addEventListener('click', this.handleNavigationClick.bind(this));
        });

        // Scroll events with throttling
        window.addEventListener('scroll', 
            this.throttle(this.handleScroll.bind(this), 16), { passive: true });

        // Resize events with debouncing
        window.addEventListener('resize', 
            this.debounce(this.handleResize.bind(this), 250), { passive: true });

        // Enhanced logo interactions
        if (this.elements.logo) {
            this.setupLogoInteractions();
        }

        // Page visibility for performance optimization
        document.addEventListener('visibilitychange', 
            this.handleVisibilityChange.bind(this));

        // Error handling
        window.addEventListener('error', this.handleGlobalError.bind(this));
        window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));

        // Mobile-specific events
        if (this.isMobile) {
            this.setupMobileSpecificEvents();
        }
    }

    /**
     * Initialize mobile-specific features
     */
    async initializeMobileFeatures(): Promise<void> {
        // Add mobile class to body
        this.elements.body.classList.add('mobile-device');
        
        // Initialize mobile navigation
        this.setupMobileNavigation();
        
        // Setup touch optimizations
        this.setupTouchOptimizations();
        
        // Initialize mobile performance optimizations
        this.setupMobilePerformanceOptimizations();
        
        // Setup mobile accessibility features
        this.setupMobileAccessibility();
    }

    /**
     * Setup mobile navigation system
     */
    setupMobileNavigation(): void {
        if (!this.elements.mobileNavigationOverlay) return;

        // Create backdrop element for blur effect
        const backdrop = document.createElement('div');
        backdrop.className = 'mobile-menu-backdrop';
        backdrop.addEventListener('click', this.closeMobileMenu.bind(this));
        
        this.elements.mobileNavigationOverlay.appendChild(backdrop);

        // Handle navigation links in mobile menu
        const mobileNavLinks = this.elements.mobileNavigationOverlay.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                this.handleNavigationClick(event);
                this.closeMobileMenu();
            });
        });

        // Escape key support
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.isMobileMenuOpen()) {
                this.closeMobileMenu();
            }
        });
    }

    /**
     * Toggle mobile menu with animations and accessibility
     */
    toggleMobileMenu(): void {
        const isOpen = this.isMobileMenuOpen();
        
        if (isOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    /**
     * Open mobile menu with proper focus management
     */
    openMobileMenu(): void {
        const overlay = this.elements.mobileNavigationOverlay;
        const toggle = this.elements.mobileMenuToggle;
        
        if (!overlay || !toggle) return;

        // Set ARIA attributes
        toggle.setAttribute('aria-expanded', 'true');
        overlay.setAttribute('aria-hidden', 'false');
        
        // Add classes for animations
        overlay.classList.add('active');
        this.elements.body.classList.add('mobile-menu-open');
        
        // Focus management
        const firstFocusableElement = overlay.querySelector('.mobile-nav-link');
        if (firstFocusableElement) {
            setTimeout(() => firstFocusableElement.focus(), this.mobileConfig.animationDuration);
        }

        // Track interaction
        this.trackInteraction('mobile_menu_opened');
    }

    /**
     * Close mobile menu with animations
     */
    closeMobileMenu(): void {
        const overlay = this.elements.mobileNavigationOverlay;
        const toggle = this.elements.mobileMenuToggle;
        
        if (!overlay || !toggle) return;

        // Set ARIA attributes
        toggle.setAttribute('aria-expanded', 'false');
        overlay.setAttribute('aria-hidden', 'true');
        
        // Remove classes
        overlay.classList.remove('active');
        this.elements.body.classList.remove('mobile-menu-open');
        
        // Return focus to toggle button
        toggle.focus();

        // Track interaction
        this.trackInteraction('mobile_menu_closed');
    }

    /**
     * Check if mobile menu is open
     */
    isMobileMenuOpen(): boolean {
        return this.elements.mobileNavigationOverlay?.classList.contains('active') || false;
    }

    /**
     * Handle mobile menu keyboard navigation
     */
    handleMobileMenuKeydown(event: KeyboardEvent): void {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.toggleMobileMenu();
        }
    }

    /**
     * Handle accordion toggle with enhanced animations
     */
    handleAccordionToggle(event: Event): void {
        const header = event.currentTarget as HTMLElement;
        const content = header.nextElementSibling as HTMLElement;
        const indicator = header.querySelector('.accordion-indicator') as HTMLElement;
        
        if (!content) return;

        const isExpanded = header.getAttribute('aria-expanded') === 'true';
        
        // Close other accordions for mobile UX (optional)
        if (this.isMobile) {
            this.closeOtherAccordions(header);
        }

        if (isExpanded) {
            this.closeAccordion(header, content, indicator);
        } else {
            this.openAccordion(header, content, indicator);
        }

        // Track interaction
        this.trackInteraction('accordion_toggled', {
            section: header.querySelector('h2')?.textContent || 'unknown',
            action: isExpanded ? 'closed' : 'opened'
        });
    }

    /**
     * Open accordion with smooth animation
     */
    openAccordion(header: HTMLElement, content: HTMLElement, indicator: HTMLElement): void {
        const inner = content.querySelector('.accordion-content-inner') as HTMLElement;
        if (!inner) return;

        // Set ARIA attributes
        header.setAttribute('aria-expanded', 'true');
        
        // Calculate height for smooth animation
        const scrollHeight = inner.scrollHeight;
        content.style.maxHeight = `${scrollHeight}px`;
        
        // Add visual classes
        header.parentElement?.classList.add('accordion-open');
        
        // Animate indicator
        if (indicator) {
            indicator.style.transform = 'rotate(45deg)';
        }

        // Scroll into view on mobile
        if (this.isMobile) {
            setTimeout(() => {
                header.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest' 
                });
            }, this.mobileConfig.animationDuration);
        }
    }

    /**
     * Close accordion with smooth animation
     */
    closeAccordion(header: HTMLElement, content: HTMLElement, indicator: HTMLElement): void {
        // Set ARIA attributes
        header.setAttribute('aria-expanded', 'false');
        
        // Animate closure
        content.style.maxHeight = '0';
        
        // Remove visual classes
        header.parentElement?.classList.remove('accordion-open');
        
        // Reset indicator
        if (indicator) {
            indicator.style.transform = 'rotate(0deg)';
        }
    }

    /**
     * Close other accordions (mobile UX optimization)
     */
    closeOtherAccordions(currentHeader: HTMLElement): void {
        this.elements.accordions.forEach(header => {
            if (header !== currentHeader && header.getAttribute('aria-expanded') === 'true') {
                const content = header.nextElementSibling as HTMLElement;
                const indicator = header.querySelector('.accordion-indicator') as HTMLElement;
                this.closeAccordion(header, content, indicator);
            }
        });
    }

    /**
     * Handle keyboard navigation for accordions
     */
    handleAccordionKeydown(event: KeyboardEvent): void {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.handleAccordionToggle(event);
        }
    }

    /**
     * Handle navigation clicks with smooth scrolling
     */
    handleNavigationClick(event: Event): void {
        const link = event.currentTarget as HTMLAnchorElement;
        const href = link.getAttribute('href');
        
        if (!href || !href.startsWith('#')) return;
        
        event.preventDefault();
        
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (!targetElement) return;

        // Update active navigation
        this.updateActiveNavigation(link);
        
        // Smooth scroll with mobile optimization
        this.smoothScrollToElement(targetElement);
        
        // Track navigation
        this.trackInteraction('navigation_clicked', { target: targetId });
    }

    /**
     * Smooth scroll to element with mobile optimization
     */
    smoothScrollToElement(element: HTMLElement): void {
        const headerHeight = this.elements.header?.offsetHeight || 0;
        const mobileOffset = this.isMobile ? 20 : 40;
        const targetPosition = element.offsetTop - headerHeight - mobileOffset;
        
        // Use native smooth scrolling if supported
        if ('scrollBehavior' in document.documentElement.style) {
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        } else {
            // Fallback animation for older browsers
            this.animateScrollTo(targetPosition);
        }
    }

    /**
     * Fallback scroll animation
     */
    animateScrollTo(targetPosition: number): void {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = this.isMobile ? 500 : 800;
        let startTime: number | null = null;

        const animateScroll = (currentTime: number) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);
            
            window.scrollTo(0, run);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animateScroll);
            }
        };

        requestAnimationFrame(animateScroll);
    }

    /**
     * Easing function for smooth animations
     */
    easeInOutQuad(t: number, b: number, c: number, d: number): number {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    /**
     * Update active navigation state
     */
    updateActiveNavigation(activeLink: HTMLElement): void {
        this.elements.navLinks.forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    /**
     * Handle scroll events with mobile optimizations
     */
    handleScroll(): void {
        const scrollTop = window.pageYOffset;
        
        // Header scroll effect
        if (this.elements.header) {
            const scrollThreshold = this.isMobile ? 30 : 50;
            if (scrollTop > scrollThreshold) {
                this.elements.header.classList.add('scrolled');
            } else {
                this.elements.header.classList.remove('scrolled');
            }
        }

        // Update active navigation based on scroll position
        this.updateNavigationOnScroll();
        
        // Mobile-specific scroll optimizations
        if (this.isMobile) {
            this.handleMobileScrollOptimizations();
        }
    }

    /**
     * Update navigation based on scroll position
     */
    updateNavigationOnScroll(): void {
        const sections = ['home', 'features', 'about', 'contact'];
        const headerHeight = this.elements.header?.offsetHeight || 0;
        const scrollPosition = window.pageYOffset + headerHeight + 100;

        for (let i = sections.length - 1; i >= 0; i--) {
            const section = document.getElementById(sections[i]);
            if (section && scrollPosition >= section.offsetTop) {
                const activeLink = document.querySelector(`[href="#${sections[i]}"]`);
                if (activeLink && !activeLink.classList.contains('active')) {
                    this.updateActiveNavigation(activeLink as HTMLElement);
                }
                break;
            }
        }
    }

    /**
     * Mobile-specific scroll optimizations
     */
    handleMobileScrollOptimizations(): void {
        // Hide mobile address bar on scroll down
        if (window.scrollY > 100) {
            this.elements.body.classList.add('scrolling');
        } else {
            this.elements.body.classList.remove('scrolling');
        }
    }

    /**
     * Handle window resize with mobile-first approach
     */
    handleResize(): void {
        // Update mobile detection
        const wasMobile = this.isMobile;
        this.isMobile = this.detectMobileDevice();
        
        // If device type changed, reinitialize
        if (wasMobile !== this.isMobile) {
            this.reinitializeForDeviceChange();
        }

        // Recalculate accordion heights if open
        this.recalculateAccordionHeights();
        
        // Update mobile menu state
        if (!this.isMobile && this.isMobileMenuOpen()) {
            this.closeMobileMenu();
        }
    }

    /**
     * Reinitialize when device type changes
     */
    async reinitializeForDeviceChange(): Promise<void> {
        if (this.isMobile) {
            await this.initializeMobileFeatures();
        } else {
            this.elements.body.classList.remove('mobile-device', 'mobile-menu-open');
            if (this.isMobileMenuOpen()) {
                this.closeMobileMenu();
            }
        }
    }

    /**
     * Recalculate accordion heights for responsive design
     */
    recalculateAccordionHeights(): void {
        const openAccordions = document.querySelectorAll('.accordion-header[aria-expanded="true"]');
        openAccordions.forEach(header => {
            const content = header.nextElementSibling as HTMLElement;
            const inner = content?.querySelector('.accordion-content-inner') as HTMLElement;
            if (content && inner) {
                content.style.maxHeight = `${inner.scrollHeight}px`;
            }
        });
    }

    /**
     * Setup enhanced logo interactions
     */
    setupLogoInteractions(): void {
        if (!this.elements.logo) return;

        let isHovered = false;

        const handleLogoHover = () => {
            if (isHovered) return;
            isHovered = true;
            
            this.elements.logo.style.animationPlayState = 'paused';
            this.elements.logo.style.transform = 'scale(1.05) rotate(5deg)';
            
            // Add glow effect
            this.elements.logo.style.filter = 'drop-shadow(0 0 20px var(--accent-primary-glow))';
        };

        const handleLogoLeave = () => {
            isHovered = false;
            
            this.elements.logo.style.animationPlayState = 'running';
            this.elements.logo.style.transform = 'scale(1) rotate(0deg)';
            this.elements.logo.style.filter = '';
        };

        const handleLogoClick = () => {
            // Easter egg: Advanced logo animation
            this.elements.logo.style.animation = 'logoSpecialAnimation 2s ease-in-out';
            
            setTimeout(() => {
                this.elements.logo.style.animation = '';
            }, 2000);
            
            this.trackInteraction('logo_clicked');
        };

        this.elements.logo.addEventListener('mouseenter', handleLogoHover);
        this.elements.logo.addEventListener('mouseleave', handleLogoLeave);
        this.elements.logo.addEventListener('click', handleLogoClick);

        // Touch events for mobile
        if (this.isMobile) {
            this.elements.logo.addEventListener('touchstart', handleLogoHover, { passive: true });
            this.elements.logo.addEventListener('touchend', handleLogoLeave, { passive: true });
        }
    }

    /**
     * Initialize intersection observer for scroll animations
     */
    initializeIntersectionObserver(): void {
        const observerOptions = {
            threshold: this.isMobile ? 0.1 : 0.2,
            rootMargin: this.isMobile ? '0px 0px -30px 0px' : '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    this.animateElement(entry.target as HTMLElement);
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const elementsToObserve = [
            ...this.elements.featureCards,
            ...this.elements.techItems,
            ...document.querySelectorAll('.accordion-section')
        ];

        elementsToObserve.forEach(element => {
            observer.observe(element);
        });
    }

    /**
     * Animate element with staggered effects
     */
    animateElement(element: HTMLElement): void {
        const animationClass = element.classList.contains('feature-card-iui') ? 
            'slideInUp' : 'fadeInUp';
        
        element.style.animation = `${animationClass} ${this.mobileConfig.animationDuration}ms ease-out forwards`;
    }

    /**
     * Initialize touch gestures for mobile
     */
    initializeTouchGestures(): void {
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;

        const handleTouchStart = (event: TouchEvent) => {
            touchStartX = event.changedTouches[0].screenX;
            touchStartY = event.changedTouches[0].screenY;
        };

        const handleTouchEnd = (event: TouchEvent) => {
            touchEndX = event.changedTouches[0].screenX;
            touchEndY = event.changedTouches[0].screenY;
            this.handleSwipeGesture();
        };

        const handleSwipeGesture = () => {
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            
            // Horizontal swipe detection
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > this.mobileConfig.swipeThreshold) {
                if (deltaX > 0) {
                    // Swipe right - open mobile menu
                    if (!this.isMobileMenuOpen()) {
                        this.openMobileMenu();
                    }
                } else {
                    // Swipe left - close mobile menu
                    if (this.isMobileMenuOpen()) {
                        this.closeMobileMenu();
                    }
                }
            }
        };

        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    /**
     * Setup mobile-specific events
     */
    setupMobileSpecificEvents(): void {
        // Prevent zoom on double tap for better UX
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (event) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        // Handle orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleResize();
            }, 500);
        });
    }

    /**
     * Setup touch optimizations
     */
    setupTouchOptimizations(): void {
        // Add touch-specific CSS class
        this.elements.body.classList.add('touch-device');
        
        // Optimize touch targets
        const touchElements = document.querySelectorAll('button, a, .accordion-header');
        touchElements.forEach(element => {
            element.classList.add('touch-optimized');
        });
    }

    /**
     * Setup mobile performance optimizations
     */
    setupMobilePerformanceOptimizations(): void {
        // Reduce animation complexity on low-end devices
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
            this.elements.body.classList.add('low-performance-device');
        }

        // Optimize images for mobile
        const images = document.querySelectorAll('img[data-src]');
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target as HTMLImageElement;
                        img.src = img.dataset.src || '';
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    /**
     * Setup mobile accessibility features
     */
    setupMobileAccessibility(): void {
        // Announce page changes to screen readers
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'visually-hidden';
        announcer.id = 'mobile-announcer';
        document.body.appendChild(announcer);

        // Improve focus visibility on mobile
        const focusableElements = document.querySelectorAll('a, button, input, textarea, select');
        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.classList.add('mobile-focused');
            });
            
            element.addEventListener('blur', () => {
                element.classList.remove('mobile-focused');
            });
        });
    }

    /**
     * Handle page visibility changes for performance
     */
    handleVisibilityChange(): void {
        if (document.hidden) {
            // Pause animations and reduce activity
            this.elements.body.style.animationPlayState = 'paused';
            if (this.elements.logo) {
                this.elements.logo.style.animationPlayState = 'paused';
            }
        } else {
            // Resume animations
            this.elements.body.style.animationPlayState = 'running';
            if (this.elements.logo) {
                this.elements.logo.style.animationPlayState = 'running';
            }
        }
    }

    /**
     * Show loading indicator with mobile optimization
     */
    showLoadingIndicator(): void {
        if (this.elements.loadingIndicator) {
            this.elements.loadingIndicator.classList.remove('loading-hidden');
            this.elements.loadingIndicator.setAttribute('aria-hidden', 'false');
        }
    }

    /**
     * Hide loading indicator
     */
    hideLoadingIndicator(): void {
        if (this.elements.loadingIndicator) {
            setTimeout(() => {
                this.elements.loadingIndicator.classList.add('loading-hidden');
                this.elements.loadingIndicator.setAttribute('aria-hidden', 'true');
            }, this.mobileConfig.animationDuration);
        }
    }

    /**
     * Handle initial page load
     */
    async handleInitialPageLoad(): Promise<void> {
        // Handle hash-based navigation
        if (window.location.hash) {
            setTimeout(() => {
                const targetElement = document.querySelector(window.location.hash);
                if (targetElement) {
                    this.smoothScrollToElement(targetElement as HTMLElement);
                }
            }, 100);
        }

        // Trigger initial scroll check
        this.handleScroll();

        // Initialize service worker for PWA features
        if ('serviceWorker' in navigator && this.isProduction) {
            try {
                await navigator.serviceWorker.register('/static/js/sw.js');
                console.log('✅ Service Worker registered successfully');
            } catch (error) {
                console.warn('⚠️ Service Worker registration failed:', error);
            }
        }
    }

    /**
     * Setup performance monitoring
     */
    setupPerformanceMonitoring(): void {
        // Track Core Web Vitals
        if ('PerformanceObserver' in window) {
            // First Contentful Paint
            new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    this.trackPerformance('FCP', entry.startTime);
                }
            }).observe({ entryTypes: ['paint'] });

            // Largest Contentful Paint
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.trackPerformance('LCP', lastEntry.startTime);
            }).observe({ entryTypes: ['largest-contentful-paint'] });
        }

        // Track custom metrics
        this.trackPerformance('initialization_time', performance.now() - this.performanceMetrics.startTime);
    }

    /**
     * Track user interactions for analytics
     */
    trackInteraction(event: string, data?: any): void {
        this.performanceMetrics.interactions++;
        
        // Send to analytics service (placeholder)
        if (this.isProduction) {
            console.log(`📊 Interaction tracked: ${event}`, data);
            // gtag('event', event, data);
        }
    }

    /**
     * Track performance metrics
     */
    trackPerformance(metric: string, value: number): void {
        if (this.isProduction) {
            console.log(`⚡ Performance metric: ${metric} = ${value.toFixed(2)}ms`);
            // Send to monitoring service
        }
    }

    /**
     * Handle global errors
     */
    handleGlobalError(event: ErrorEvent): void {
        this.performanceMetrics.errors++;
        console.error('❌ Global error:', event.error);
        
        if (this.isProduction) {
            // Send to error tracking service
            // Sentry.captureException(event.error);
        }
    }

    /**
     * Handle unhandled promise rejections
     */
    handleUnhandledRejection(event: PromiseRejectionEvent): void {
        this.performanceMetrics.errors++;
        console.error('❌ Unhandled promise rejection:', event.reason);
        
        if (this.isProduction) {
            // Send to error tracking service
        }
    }

    /**
     * Handle initialization errors
     */
    handleInitializationError(error: Error): void {
        console.error('❌ Initialization failed:', error);
        
        // Show fallback UI
        this.showFallbackUI();
        
        if (this.isProduction) {
            // Send to error tracking service
        }
    }

    /**
     * Show fallback UI when JavaScript fails
     */
    showFallbackUI(): void {
        const fallbackMessage = document.createElement('div');
        fallbackMessage.className = 'fallback-message';
        fallbackMessage.innerHTML = `
            <div class="fallback-content">
                <h2>⚠️ Щось пішло не так</h2>
                <p>Спробуйте перезавантажити сторінку або скористайтеся базовою версією сайту.</p>
                <button onclick="window.location.reload()">Перезавантажити</button>
            </div>
        `;
        
        document.body.appendChild(fallbackMessage);
        this.hideLoadingIndicator();
    }

    /**
     * Utility: Throttle function calls
     */
    throttle(func: Function, limit: number): Function {
        let inThrottle: boolean;
        return function(this: any, ...args: any[]) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Utility: Debounce function calls
     */
    debounce(func: Function, wait: number): Function {
        let timeout: NodeJS.Timeout;
        return function(this: any, ...args: any[]) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    /**
     * Get system information for debugging
     */
    getSystemInfo(): object {
        return {
            version: this.version,
            isMobile: this.isMobile,
            supportsAdvancedFeatures: this.supportsAdvancedFeatures,
            isProduction: this.isProduction,
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            performance: this.performanceMetrics
        };
    }
}

// Initialize the system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.ggenius = new GGeniusAdvancedSystem();
});

// Add CSS animations for mobile
const mobileAnimations = `
@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes logoSpecialAnimation {
    0% { transform: scale(1) rotate(0deg); }
    25% { transform: scale(1.1) rotate(5deg); }
    50% { transform: scale(1.2) rotate(-5deg); }
    75% { transform: scale(1.1) rotate(5deg); }
    100% { transform: scale(1) rotate(0deg); }
}

/* Mobile-specific styles */
.mobile-device .feature-card-iui {
    transform: translateY(20px);
    opacity: 0;
    transition: all 0.3s ease-out;
}

.mobile-device .feature-card-iui.animate-in {
    transform: translateY(0);
    opacity: 1;
}

.touch-device button,
.touch-device a {
    -webkit-tap-highlight-color: rgba(0, 123, 255, 0.2);
}

.mobile-focused {
    outline: 2px solid var(--accent-primary) !important;
    outline-offset: 2px;
}

.fallback-message {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(10, 12, 15, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.fallback-content {
    text-align: center;
    padding: 2rem;
    background: var(--secondary-bg-color);
    border-radius: var(--border-radius-lg);
    max-width: 400px;
}

.fallback-content button {
    background: var(--gradient-cta-primary);
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: var(--border-radius-md);
    cursor: pointer;
    margin-top: 1rem;
}

@media (prefers-reduced-motion: reduce) {
    .mobile-device .feature-card-iui {
        transition: none;
    }
}
`;

// Inject mobile animations
const mobileStyleSheet = document.createElement('style');
mobileStyleSheet.textContent = mobileAnimations;
document.head.appendChild(mobileStyleSheet);

// Export for global access
declare global {
    interface Window {
        ggenius: GGeniusAdvancedSystem;
    }
}