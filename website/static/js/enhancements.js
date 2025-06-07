/**
 * GGenius Enhanced Interactive Experience
 * Performance-optimized ES2023+ JavaScript for cyberpunk AI platform
 * @version 2.1.2
 * @author MLBB-BOSS
 * @see GGeniusApp
 */
class GGeniusApp {
    constructor() {
        this.isLoaded = false;
        this.observers = new Map();
        this.animations = new Map(); 
        this.eventListeners = new Map();

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
        
        this.handleScroll = this.throttle(this._handleScroll.bind(this), 16); 
        this.handleResize = this.debounce(this._handleResize.bind(this), 200); 
        this.handleVisibilityChange = this._handleVisibilityChange.bind(this); 
        
        this.init();
    }

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
            
            // Make all designated sections/elements visible immediately
            this.makeElementsInitiallyVisible(); 

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

    getVersion() {
        return "2.1.2"; 
    }

    detectLowPerformance() {
        try {
            const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) return true;

            const cpuCores = navigator.hardwareConcurrency;
            const deviceMemory = navigator.deviceMemory; 
            const lowSpecCPU = typeof cpuCores === 'number' && cpuCores < 4; 
            const lowSpecMemory = typeof deviceMemory === 'number' && deviceMemory < 4; 
            const connection = navigator.connection;
            const slowConnection = connection?.effectiveType?.includes('2g') || 
                                   (typeof connection?.downlink === 'number' && connection.downlink < 1.5); 
            const isLikelyMobile = window.innerWidth < 768 && window.matchMedia?.('(pointer: coarse)').matches;
            let isLowPerf = lowSpecCPU || lowSpecMemory || slowConnection;
            if (isLikelyMobile && (lowSpecCPU || lowSpecMemory)) isLowPerf = true; 
            return isLowPerf;
        } catch (e) { return false; }
    }
    
    setupGlobalEventListeners() {
        this._addEventListener(window, 'resize', this.handleResize);
        this._addEventListener(document, 'visibilitychange', this.handleVisibilityChange);
    }

    async loadCriticalFeatures() {
        this.loadingScreen = document.getElementById('loadingScreen');
        this.progressBar = document.getElementById('progressBar');
        this.loadingTextElement = document.getElementById('loadingText'); 
        this.header = document.querySelector('.site-header');
        this.scrollProgress = document.getElementById('scrollProgress') || this.createScrollProgress();
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

    async simulateLoading() {
        return new Promise((resolve) => {
            if (!this.progressBar || !this.loadingTextElement) {
                this.hideLoadingScreen(true); resolve(); return;
            }
            let progress = 0;
            const messages = [
                'Ініціалізація GGenius AI...', 'Завантаження нейронних мереж...',
                'Підключення до кіберспорт серверів...', 'Активація штучного інтелекту...',
                'Синхронізація з MLBB API...', 'Готовність до революції!'
            ];
            const updateProgress = () => {
                progress = Math.min(progress + (Math.random() * 15 + 5), 100);
                if (this.progressBar) {
                    this.progressBar.style.transform = `scaleX(${progress / 100})`;
                    this.progressBar.setAttribute('aria-valuenow', String(Math.round(progress)));
                }
                const msgIdx = Math.min(Math.floor((progress/100)*messages.length), messages.length-1);
                if (this.loadingTextElement && messages[msgIdx] && this.loadingTextElement.textContent !== messages[msgIdx]) {
                    this.updateLoadingText(messages[msgIdx]);
                }
                if (progress < 100) setTimeout(updateProgress, 100 + Math.random() * 150);
                else {
                    if(this.progressBar) this.progressBar.style.transform = 'scaleX(1)';
                    if(this.loadingTextElement) this.updateLoadingText(messages[messages.length-1]);
                    setTimeout(() => { this.hideLoadingScreen(); resolve(); }, 600);
                }
            };
            updateProgress();
        });
    }

    updateLoadingText(text) {
        if (!this.loadingTextElement) return;
        this.loadingTextElement.style.opacity = '0';
        setTimeout(() => {
            this.loadingTextElement.textContent = text;
            this.loadingTextElement.style.opacity = '1';
        }, 150); 
    }

    hideLoadingScreen(immediate = false) {
        if (!this.loadingScreen || this.loadingScreen.classList.contains('hidden')) return;
        this.loadingScreen.classList.add('hidden');
        this.loadingScreen.setAttribute('aria-hidden', 'true');
        if (!immediate) this.playSound(800, 0.1, 0.08, 'sine');
        setTimeout(() => { this.loadingScreen?.remove(); }, immediate ? 50 : 500); 
    }

    createScrollProgress() {
        const progress = document.createElement('div');
        progress.className = 'scroll-progress'; progress.id = 'scrollProgress';
        Object.assign(progress, { role: 'progressbar', 'aria-label': 'Прогрес прокрутки сторінки', 
                                   'aria-valuenow': '0', 'aria-valuemin': '0', 'aria-valuemax': '100' });
        progress.style.transform = 'scaleX(0)'; 
        document.body.prepend(progress); return progress;
    }

    async setupPerformanceMonitoring() { /* ... (no changes, keep as is) ... */ }
    setupWebVitalsTracking() { /* ... (no changes, keep as is) ... */ }
    setupMemoryMonitoring() { /* ... (no changes, keep as is) ... */ }
    setupFrameRateMonitoring(durationMs = 0) { /* ... (no changes, keep as is) ... */ }
    optimizeMemory() { /* ... (no changes, keep as is) ... */ }
    enablePerformanceMode() { /* ... (no changes, keep as is) ... */ }

    async initializeUI() {
        await Promise.all([
            this.setupNavigation(), this.setupScrollEffects(),
            this.setupAccordions(), this.setupTabs(),
            this.setupModals(), this.setupForms()
        ]);
    }

    setupNavigation() {
        if (this.mobileToggle && this.navMenu) {
            this._addEventListener(this.mobileToggle, 'click', (e) => {
                e.preventDefault(); this.toggleMobileMenu();
            }, 'mobileToggleClick');
        }
        this.setupHeaderScroll(); 
    }
    
    toggleMobileMenu(forceOpen) { /* ... (no changes, keep as is) ... */ }
    setupHeaderScroll() { /* ... (no changes, keep as is) ... */ }

    setupScrollEffects() {
        if (this.scrollProgress) {
            this._addEventListener(window, 'scroll', this.handleScroll, 'scrollProgressUpdater');
            this._handleScroll(); 
        }
        // Parallax setup is removed/commented out
        // this.setupParallax(); 
        
        // IntersectionObserver for animations is replaced by makeElementsInitiallyVisible
        // this.setupIntersectionObserver(); 
    }

    _handleScroll() { 
        if (!this.scrollProgress) return;
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollableHeight <= 0) {
            this.scrollProgress.style.transform = 'scaleX(0)';
            this.scrollProgress.setAttribute('aria-valuenow', '0'); return;
        }
        const scrollPercentage = (window.scrollY / scrollableHeight);
        const boundedPercentage = Math.max(0, Math.min(scrollPercentage, 1)); 
        this.scrollProgress.style.transform = `scaleX(${boundedPercentage})`;
        this.scrollProgress.setAttribute('aria-valuenow', String(Math.round(boundedPercentage*100)));
    }

    // Parallax is disabled to remove "floating" effect
    setupParallax() {
        // console.info("Parallax effect disabled.");
        // const parallaxContainer = document.querySelector('.hero-floating-elements'); // Example selector
        // if (!parallaxContainer || this.performance.isLowPerformance) return;
        // ... rest of original parallax logic would be here ...
    }

    /**
     * Makes designated elements visible immediately on load, replacing IntersectionObserver animations.
     */
    makeElementsInitiallyVisible() {
        const elementsToMakeVisible = document.querySelectorAll(`
            .features-section-iui, .roadmap-section, .accordion-section,
            .feature-card-iui, .timeline-item,
            [data-aos] /* If any elements still use this for other non-animation purposes, otherwise remove */
        `);
        
        elementsToMakeVisible.forEach(element => {
            this.setElementVisible(element);
        });
    }

    /**
     * Helper function to make a single element visible immediately.
     * @param {HTMLElement} element - The element to make visible.
     */
    setElementVisible(element) {
        element.style.opacity = '1';
        element.style.transform = 'none'; // Reset any initial transform offsets
        element.classList.add('js-visible-on-load'); // Add a class for CSS if needed, or just rely on inline styles

        // If it's a counter, set its value directly
        if (element.classList.contains('stat-number') && element.dataset.target) {
            const targetValue = element.dataset.target;
            // Basic formatting for potential floats, ensure it's a string
            const numTarget = parseFloat(targetValue);
            if (!isNaN(numTarget) && String(targetValue).includes('.')) {
                 const precision = (String(targetValue).split('.')[1] || '').length || 1;
                 element.textContent = numTarget.toFixed(precision);
            } else {
                 element.textContent = targetValue;
            }
        }
        // Remove specific animation classes if they were setting initial hidden states
        // This depends on how CSS is structured, but for now, inline styles are primary.
        // element.classList.remove('animate-in', 'fadeInUp', 'animated'); // Example
    }
    
    // animateElement and animateCounter are removed as their functionality is replaced or simplified.

    updateActiveNavigation(sectionId) { /* ... (no changes, keep as is) ... */ }
    setupAccordions() { /* ... (no changes, keep as is) ... */ }
    toggleAccordion(header, content) { /* ... (no changes, keep as is) ... */ }
    openAccordion(header, content, initialSetup = false) { /* ... (no changes, keep as is) ... */ }
    closeAccordion(header, content, initialSetup = false) { /* ... (no changes, keep as is) ... */ }
    setupTabs() { /* ... (no changes, keep as is) ... */ }
    switchTab(activeTab, allTabs, allPanels, isInitialSetup = false) { /* ... (no changes, keep as is) ... */ }
    handleTabArrowNavigation(e, tabList, tabs, tabPanels) { /* ... (no changes, keep as is) ... */ }
    setupModals() { /* ... (no changes, keep as is) ... */ }
    showDemoModal() { /* ... (no changes, keep as is) ... */ }
    createModal({ id, title, content, actions = [] }) { /* ... (no changes, keep as is) ... */ }
    showModal(modal) { /* ... (no changes, keep as is) ... */ }
    closeModal(modalIdToClose) { /* ... (no changes, keep as is) ... */ }
    scrollToNewsletter() { /* ... (no changes, keep as is) ... */ }
    setupForms() { /* ... (no changes, keep as is) ... */ }
    setupNewsletterForm(form) { /* ... (no changes, keep as is) ... */ }
    showError(message, errorElement, inputElement) { /* ... (no changes, keep as is) ... */ }
    clearError(errorElement, inputElement) { /* ... (no changes, keep as is) ... */ }
    async submitNewsletterSignup(data) { /* ... (no changes, keep as is) ... */ }
    validateEmail(email) { /* ... (no changes, keep as is) ... */ }
    async copyToClipboard(text, contentType = 'Текст') { /* ... (no changes, keep as is) ... */ }
    showToast(message, type = 'info', duration = 3500) { /* ... (no changes, keep as is) ... */ }
    getToastIcon(type) { /* ... (no changes, keep as is) ... */ }
    removeToast(toast) { /* ... (no changes, keep as is) ... */ }
    getOrCreateToastContainer() { /* ... (no changes, keep as is) ... */ }
    async setupInteractions() { /* ... (no changes, keep as is) ... */ }
    setupFeatureCardInteractions() { /* ... (no changes, keep as is) ... */ }
    createRippleEffect(element, event) { /* ... (no changes, keep as is) ... */ }
    setupLogoAnimation() { /* ... (no changes, keep as is) ... */ }
    setupSmoothScrolling() { /* ... (no changes, keep as is) ... */ }
    smoothScrollTo(targetIdFull) { /* ... (no changes, keep as is) ... */ }
    setupKeyboardNavigation() { /* ... (no changes, keep as is) ... */ }
    handleModalTabTrap(e) { /* ... (no changes, keep as is) ... */ }
    setupContextMenu() { /* ... (no changes, keep as is) ... */ }
    showContextMenu(e, targetElement) { /* ... (no changes, keep as is) ... */ }
    hideContextMenu() { /* ... (no changes, keep as is) ... */ }
    handleContextMenuAction(action, targetElement, targetId) { /* ... (no changes, keep as is) ... */ }
    async shareContent(title, text, url) { /* ... (no changes, keep as is) ... */ }
    async setupAdvancedFeatures() { /* ... (no changes, keep as is) ... */ }
    preloadResources() { /* ... (no changes, keep as is) ... */ }
    async setupServiceWorker() { /* ... (no changes, keep as is) ... */ }
    showUpdateAvailable(registration) { /* ... (no changes, keep as is) ... */ }
    setupInstallPrompt() { /* ... (no changes, keep as is) ... */ }
    showInstallBanner(promptEvent) { /* ... (no changes, keep as is) ... */ }
    setupTypingAnimation() { /* ... (no changes, keep as is) ... */ }
    setupBackgroundMusic() { /* ... (no changes, keep as is) ... */ }
    startAmbientMusic() { /* ... (no changes, keep as is) ... */ }
    _actuallyStartAmbientMusic() { /* ... (no changes, keep as is) ... */ }
    stopAmbientMusic() { /* ... (no changes, keep as is) ... */ }
    setupGamingCursor() { /* ... (no changes, keep as is) ... */ }
    playSound(frequency, duration = 0.1, volume = 0.05, type = 'sine') { /* ... (no changes, keep as is) ... */ }
    // triggerEntryAnimations is removed as its logic is replaced
    trackLoadTime() { /* ... (no changes, keep as is) ... */ }
    _handleResize() { /* ... (no changes, keep as is) ... */ }
    _handleVisibilityChange() { /* ... (no changes, keep as is) ... */ }
    pauseAnimationsAndAudio() { /* ... (no changes, keep as is) ... */ }
    resumeAnimationsAndAudio() { /* ... (no changes, keep as is) ... */ }
    fallbackMode(error) { /* ... (no changes, keep as is) ... */ }
    setupBasicNavigationForFallback() { /* ... (no changes, keep as is) ... */ }
    throttle(func, delay) { /* ... (no changes, keep as is) ... */ }
    debounce(func, delay) { /* ... (no changes, keep as is) ... */ }
    _addEventListener(target, type, listener, key, options = { passive: true }) { /* ... (no changes, keep as is) ... */ }
    _removeEventListener(key) { /* ... (no changes, keep as is) ... */ }
    destroy() { /* ... (no changes, keep as is) ... */ }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new GGeniusApp(), { once: true });
} else {
    new GGeniusApp();
}