/**
 * GGenius Enhanced Interactive Experience - Optimized
 * Lightweight ES2023+ JavaScript for fast loading and better UX
 * @version 3.0.0 - Performance Optimized
 * @author MLBB-BOSS
 */

class GGeniusApp {
    constructor() {
        this.isLoaded = false;
        this.observers = new Map();
        this.animations = new Map();
        this.eventListeners = new Map();

        // Simplified settings
        this.settings = {
            soundsEnabled: false, // Disabled by default for performance
            reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        };

        this.performance = {
            startTime: performance.now(),
            isLowPerformance: this.detectLowPerformance()
        };
        
        // Bind methods
        this.handleScroll = this.throttle(this._handleScroll.bind(this), 16);
        this.handleResize = this.debounce(this._handleResize.bind(this), 200);
        this.handleVisibilityChange = this._handleVisibilityChange.bind(this);
        
        this.init();
    }

    async init() {
        try {
            console.log('🚀 GGenius initializing...');
            
            document.documentElement.classList.add('js-loaded');
            
            // Immediate loading setup - no artificial delays
            await this.loadCriticalFeatures();
            this.setupGlobalEventListeners();
            
            // Fast parallel initialization
            await Promise.all([
                this.initializeUI(),
                this.setupInteractions()
            ]);
            
            this.isLoaded = true;
            this.trackLoadTime();
            
            console.log('✅ GGenius fully loaded');
            document.dispatchEvent(new CustomEvent('ggenius:loaded'));
            
        } catch (error) {
            console.error('🔥 GGenius initialization failed:', error);
            this.fallbackMode(error);
        }
    }

    detectLowPerformance() {
        try {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            const isSlowConnection = navigator.connection?.effectiveType?.includes('2g');
            const isLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
            const isOldDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
            
            return prefersReducedMotion || isSlowConnection || isLowMemory || isOldDevice;
        } catch (e) {
            return false;
        }
    }
    
    setupGlobalEventListeners() {
        this._addEventListener(window, 'resize', this.handleResize);
        this._addEventListener(document, 'visibilitychange', this.handleVisibilityChange);
    }

    async loadCriticalFeatures() {
        // Cache DOM elements
        this.loadingScreen = document.getElementById('loadingScreen');
        this.progressBar = document.getElementById('progressBar');
        this.loadingTextElement = document.getElementById('loadingText');
        this.header = document.querySelector('.site-header');
        this.scrollProgress = document.getElementById('scrollProgress') || this.createScrollProgress();
        this.navMenu = document.querySelector('.nav-menu');
        this.mobileToggle = document.querySelector('.mobile-menu-toggle');
        
        // Fast loading - minimal simulation
        if (this.loadingScreen) {
            await this.fastLoading();
        }
    }

    async fastLoading() {
        return new Promise((resolve) => {
            if (!this.progressBar || !this.loadingTextElement) {
                this.hideLoadingScreen(true);
                resolve();
                return;
            }

            // Simple, fast progress
            let progress = 0;
            const messages = [
                'Ініціалізація GGenius AI...',
                'Підготовка інтерфейсу...',
                'Готово!'
            ];

            const updateProgress = () => {
                progress += 33; // Fast increments
                
                if (this.progressBar) {
                    this.progressBar.style.transform = `scaleX(${Math.min(progress, 100) / 100})`;
                }
                
                const messageIndex = Math.min(Math.floor(progress / 34), messages.length - 1);
                if (this.loadingTextElement && messages[messageIndex]) {
                    this.loadingTextElement.textContent = messages[messageIndex];
                }
                
                if (progress >= 100) {
                    setTimeout(() => {
                        this.hideLoadingScreen();
                        resolve();
                    }, 200); // Minimal delay
                } else {
                    setTimeout(updateProgress, 150); // Fast updates
                }
            };
            updateProgress();
        });
    }

    hideLoadingScreen(immediate = false) {
        if (!this.loadingScreen || this.loadingScreen.classList.contains('hidden')) return;
        
        this.loadingScreen.classList.add('hidden');
        this.loadingScreen.setAttribute('aria-hidden', 'true');
        
        setTimeout(() => {
            this.loadingScreen?.remove();
        }, immediate ? 50 : 300);
    }

    createScrollProgress() {
        const progress = document.createElement('div');
        progress.className = 'scroll-progress';
        progress.id = 'scrollProgress';
        progress.setAttribute('role', 'progressbar');
        progress.setAttribute('aria-label', 'Прогрес прокрутки сторінки');
        progress.style.transform = 'scaleX(0)';
        document.body.prepend(progress);
        return progress;
    }

    async initializeUI() {
        await Promise.all([
            this.setupNavigation(),
            this.setupScrollEffects(),
            this.setupAccordions(),
            this.setupTabs(),
            this.setupForms()
        ]);
    }

    setupNavigation() {
        if (this.mobileToggle && this.navMenu) {
            this._addEventListener(this.mobileToggle, 'click', (e) => {
                e.preventDefault();
                this.toggleMobileMenu();
            });
        }
        this.setupHeaderScroll();
    }
    
    toggleMobileMenu(forceOpen) {
        if (!this.mobileToggle || !this.navMenu) return;

        const shouldBeOpen = typeof forceOpen === 'boolean' ? forceOpen : 
            this.mobileToggle.getAttribute('aria-expanded') !== 'true';
        
        this.mobileToggle.setAttribute('aria-expanded', String(shouldBeOpen));
        this.navMenu.classList.toggle('open', shouldBeOpen);
        document.body.classList.toggle('menu-open', shouldBeOpen);
        
        if (shouldBeOpen) {
            this.navMenu.querySelector('a[href], button')?.focus();
        }
    }

    setupHeaderScroll() {
        if (!this.header) return;
        
        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateHeader = () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 50) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }

            if (currentScrollY > lastScrollY && currentScrollY > this.header.offsetHeight) {
                this.header.classList.add('header-hidden');
            } else if (currentScrollY < lastScrollY || currentScrollY <= 50) {
                this.header.classList.remove('header-hidden');
            }
            
            lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        };
        
        this._addEventListener(window, 'scroll', onScroll);
        updateHeader();
    }

    setupScrollEffects() {
        if (this.scrollProgress) {
            this._addEventListener(window, 'scroll', this.handleScroll);
            this._handleScroll();
        }
        
        this.setupIntersectionObserver();
    }

    _handleScroll() {
        if (!this.scrollProgress) return;
        
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollableHeight <= 0) {
            this.scrollProgress.style.transform = 'scaleX(0)';
            return;
        }
        
        const scrollPercentage = window.scrollY / scrollableHeight;
        const boundedPercentage = Math.max(0, Math.min(scrollPercentage, 1));

        this.scrollProgress.style.transform = `scaleX(${boundedPercentage})`;
        this.scrollProgress.setAttribute('aria-valuenow', String(Math.round(boundedPercentage * 100)));
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -10% 0px'
        };

        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    
                    if (entry.target.id && entry.intersectionRatio > 0.4) {
                        this.updateActiveNavigation(entry.target.id);
                    }
                }
            });
        };
        
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        
        // Simplified element selection
        const elementsToObserve = document.querySelectorAll(`
            .features-section-iui, .roadmap-section-v2, .accordion-section,
            .feature-card-iui, .roadmap-quarter-block,
            [data-aos]
        `);
        
        elementsToObserve.forEach(el => observer.observe(el));
        this.observers.set('intersection', observer);
    }

    animateElement(element) {
        if (element.classList.contains('animated')) return;

        // Simple fade-in for low performance or reduced motion
        if (this.performance.isLowPerformance || this.settings.reducedMotion) {
            element.style.opacity = '1';
            element.style.transform = 'none';
            element.classList.add('animated');
            
            // Handle counters immediately
            if (element.classList.contains('stat-number') && element.dataset.target) {
                element.textContent = element.dataset.target;
            }
            return;
        }

        // Standard animation
        const animationType = element.dataset.animation || 'fadeInUp';
        const delay = parseInt(element.dataset.delay) || 0;
        
        setTimeout(() => {
            element.classList.add('animate-in', animationType, 'animated');
            
            if (element.classList.contains('stat-number') && element.dataset.target) {
                this.animateCounter(element);
            }
        }, delay);
    }

    animateCounter(element) {
        if (this.performance.isLowPerformance || this.settings.reducedMotion) {
            element.textContent = element.dataset.target || 'N/A';
            return;
        }

        const target = parseInt(element.dataset.target);
        if (isNaN(target)) {
            element.textContent = element.dataset.target || 'N/A';
            return;
        }
        
        const duration = 1000;
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentValue = Math.round(target * progress);
            
            element.textContent = String(currentValue);
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = String(target);
            }
        };
        
        requestAnimationFrame(updateCounter);
    }

    updateActiveNavigation(sectionId) {
        if (!sectionId) return;
        
        document.querySelectorAll('.nav-menu .nav-link').forEach(link => {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
            
            const href = link.getAttribute('href');
            if (href === `#${sectionId}`) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
    }

    setupAccordions() {
        document.querySelectorAll('.accordion-section').forEach((accordion, index) => {
            const header = accordion.querySelector('.accordion-header');
            const content = accordion.querySelector('.accordion-content');
            
            if (!header || !content) return;
            
            const contentId = content.id || `accordion-content-${index}`;
            const headerId = header.id || `accordion-header-${index}`;

            header.id = headerId;
            content.id = contentId;
            header.setAttribute('aria-controls', contentId);
            header.setAttribute('role', 'button');
            header.tabIndex = 0;
            
            content.setAttribute('aria-labelledby', headerId);
            content.setAttribute('role', 'region');
            
            // First accordion open by default
            const isOpen = index === 0;
            if (isOpen) {
                this.openAccordion(header, content, true);
            } else {
                this.closeAccordion(header, content, true);
            }
            
            const toggleHandler = () => this.toggleAccordion(header, content);
            this._addEventListener(header, 'click', toggleHandler);
            this._addEventListener(header, 'keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleHandler();
                }
            });
        });
    }

    toggleAccordion(header, content) {
        const isOpen = header.getAttribute('aria-expanded') === 'true';
        if (isOpen) {
            this.closeAccordion(header, content);
        } else {
            this.openAccordion(header, content);
        }
    }

    openAccordion(header, content, initialSetup = false) {
        header.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
        content.classList.add('active');
        content.setAttribute('aria-hidden', 'false');
        
        requestAnimationFrame(() => {
            const contentHeight = content.scrollHeight;
            content.style.maxHeight = `${contentHeight}px`;
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

        content.addEventListener('transitionend', onTransitionEnd, { once: true });
        setTimeout(onTransitionEnd, 500);
    }

    setupTabs() {
        // Simplified tab handling for feature categories
        const tabList = document.querySelector('.feature-categories');
        if (!tabList) return;

        const tabs = Array.from(tabList.querySelectorAll('.category-tab'));
        const panels = Array.from(document.querySelectorAll('.tab-content'));

        tabs.forEach((tab, index) => {
            this._addEventListener(tab, 'click', () => {
                this.switchTab(tab, tabs, panels);
            });
        });

        // Initialize first tab as active
        if (tabs.length > 0) {
            this.switchTab(tabs[0], tabs, panels, true);
        }
    }

    switchTab(activeTab, allTabs, allPanels, isInitial = false) {
        allTabs.forEach(tab => {
            tab.classList.remove('active');
            tab.setAttribute('aria-selected', 'false');
        });
        
        activeTab.classList.add('active');
        activeTab.setAttribute('aria-selected', 'true');
        
        const targetPanelId = activeTab.getAttribute('aria-controls');
        allPanels.forEach(panel => {
            if (panel.id === targetPanelId) {
                panel.classList.add('active');
                panel.removeAttribute('hidden');
                panel.setAttribute('aria-hidden', 'false');
            } else {
                panel.classList.remove('active');
                panel.setAttribute('hidden', '');
                panel.setAttribute('aria-hidden', 'true');
            }
        });
        
        if (!isInitial) {
            activeTab.focus();
        }
    }

    setupForms() {
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) this.setupNewsletterForm(newsletterForm);
        
        // Email copy functionality
        document.querySelectorAll('.email-link[data-email]').forEach(button => {
            const email = button.dataset.email;
            if (email) {
                this._addEventListener(button, 'click', () => {
                    this.copyToClipboard(email, 'Email адресу');
                });
            }
        });
    }

    setupNewsletterForm(form) {
        this._addEventListener(form, 'submit', async (e) => {
            e.preventDefault();
            
            const submitButton = form.querySelector('button[type="submit"]');
            const emailInput = form.querySelector('input[type="email"]');
            
            const email = emailInput?.value.trim();
            if (!this.validateEmail(email)) {
                this.showToast('Будь ласка, введіть коректну email адресу.', 'error');
                emailInput?.focus();
                return;
            }

            const originalText = submitButton.querySelector('.button-text')?.textContent || 'Приєднатися';
            
            submitButton.disabled = true;
            if (submitButton.querySelector('.button-text')) {
                submitButton.querySelector('.button-text').textContent = 'Підписуємо...';
            }
            submitButton.classList.add('loading');
            
            try {
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                await this.submitNewsletterSignup(data);
                
                if (submitButton.querySelector('.button-text')) {
                    submitButton.querySelector('.button-text').textContent = 'Підписано! ✅';
                }
                form.reset();
                this.showToast('Дякуємо! Ви успішно підписалися на розсилку.', 'success');
            } catch (error) {
                console.error('Newsletter signup failed:', error);
                this.showToast(error.message || 'Помилка підписки. Спробуйте ще раз.', 'error');
            } finally {
                setTimeout(() => {
                    submitButton.disabled = false;
                    if (submitButton.querySelector('.button-text')) {
                        submitButton.querySelector('.button-text').textContent = originalText;
                    }
                    submitButton.classList.remove('loading');
                }, 2000);
            }
        });
    }

    async submitNewsletterSignup(data) {
        // Simulated API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.1) {
                    resolve({ success: true });
                } else {
                    reject(new Error('Помилка сервера. Спробуйте пізніше.'));
                }
            }, 1000);
        });
    }

    validateEmail(email) {
        if (!email || typeof email !== 'string') return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async copyToClipboard(text, contentType = 'Текст') {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                // Fallback
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                textArea.remove();
            }
            this.showToast(`${contentType} скопійовано!`, 'success');
        } catch (error) {
            console.error('Failed to copy text:', error);
            this.showToast(`Не вдалося скопіювати ${contentType.toLowerCase()}.`, 'error');
        }
    }

    setupInteractions() {
        // Simplified smooth scrolling
        this._addEventListener(document, 'click', (e) => {
            const anchor = e.target.closest('a[href^="#"]');
            if (!anchor) return;

            const targetId = anchor.getAttribute('href');
            if (targetId && targetId.length > 1) {
                const targetElement = document.getElementById(targetId.substring(1));
                if (targetElement) {
                    e.preventDefault();
                    this.smoothScrollTo(targetElement);
                    
                    // Close mobile menu if open
                    if (this.navMenu?.classList.contains('open')) {
                        this.toggleMobileMenu(false);
                    }
                }
            }
        });
    }

    smoothScrollTo(targetElement) {
        const headerOffset = this.header?.offsetHeight || 60;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset - 15;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    showToast(message, type = 'info', duration = 3500) {
        const container = this.getOrCreateToastContainer();
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.setAttribute('role', 'alert');
        
        const iconMap = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        toast.innerHTML = `
            <span class="toast-icon">${iconMap[type] || iconMap.info}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close" aria-label="Закрити">&times;</button>
        `;
        
        const closeButton = toast.querySelector('.toast-close');
        this._addEventListener(closeButton, 'click', () => this.removeToast(toast));
        
        container.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('show'));
        
        if (duration > 0) {
            setTimeout(() => this.removeToast(toast), duration);
        }
        
        return toast;
    }

    removeToast(toast) {
        if (!toast || !toast.parentNode) return;
        
        toast.classList.remove('show');
        toast.classList.add('removing');
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }

    getOrCreateToastContainer() {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        return container;
    }

    trackLoadTime() {
        const loadTime = performance.now() - this.performance.startTime;
        console.log(`📊 Load time: ${loadTime.toFixed(2)}ms`);
        
        // Optional: Send to analytics
        if (window.gtag) {
            gtag('event', 'timing_complete', {
                name: 'load',
                value: Math.round(loadTime)
            });
        }
    }

    _handleResize() {
        // Minimal resize handling
        if (this.navMenu?.classList.contains('open') && window.innerWidth > 768) {
            this.toggleMobileMenu(false);
        }
    }

    _handleVisibilityChange() {
        if (document.hidden) {
            this.pauseAnimations();
        } else {
            this.resumeAnimations();
        }
    }

    pauseAnimations() {
        this.animations.forEach((animationId, key) => {
            if (typeof animationId === 'number') {
                cancelAnimationFrame(animationId);
            }
        });
    }

    resumeAnimations() {
        // Resume if needed
    }

    fallbackMode(error) {
        console.error('Entering fallback mode:', error);
        document.documentElement.classList.add('fallback-mode');
        
        // Hide loading screen immediately
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
        
        // Basic navigation only
        this.setupBasicNavigation();
    }

    setupBasicNavigation() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', () => {
                const isOpen = navMenu.classList.contains('open');
                navMenu.classList.toggle('open', !isOpen);
                mobileToggle.setAttribute('aria-expanded', String(!isOpen));
            });
        }
    }

    throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        
        return function (...args) {
            const currentTime = performance.now();
            
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = performance.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    }

    debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    _addEventListener(target, type, listener, options = { passive: true }) {
        if (!target || typeof listener !== 'function') return;
        
        const key = `${type}_${Math.random().toString(36).substr(2, 9)}`;
        this.eventListeners.set(key, { target, type, listener });
        target.addEventListener(type, listener, options);
        return key;
    }

    destroy() {
        // Cleanup
        this.eventListeners.forEach(({ target, type, listener }) => {
            target.removeEventListener(type, listener);
        });
        this.eventListeners.clear();
        
        this.observers.forEach(observer => {
            if (observer && typeof observer.disconnect === 'function') {
                observer.disconnect();
            }
        });
        this.observers.clear();
        
        this.animations.forEach(animationId => {
            if (typeof animationId === 'number') {
                cancelAnimationFrame(animationId);
            }
        });
        this.animations.clear();
    }
}

// Initialize app
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        try {
            new GGeniusApp();
        } catch (error) {
            console.error('Failed to initialize GGenius:', error);
            // Remove loading screen as fallback
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) loadingScreen.style.display = 'none';
        }
    }, { once: true });
} else {
    try {
        new GGeniusApp();
    } catch (error) {
        console.error('Failed to initialize GGenius:', error);
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) loadingScreen.style.display = 'none';
    }
}