/**
 * GGenius Enhanced Interactive Experience
 * Performance-optimized ES2023+ JavaScript for cyberpunk AI platform
 * @version 2.0.0
 * @author MLBB-BOSS
 */

class GGeniusApp {
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
        this.handleScroll = this.throttle(this.handleScroll.bind(this), 16);
        this.handleResize = this.debounce(this.handleResize.bind(this), 250);
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
        
        this.init();
    }

    async init() {
        try {
            console.log('🚀 GGenius AI Revolution initializing...');
            
            // Critical path loading sequence
            await this.loadCriticalFeatures();
            await this.setupPerformanceMonitoring();
            await this.initializeUI();
            await this.setupInteractions();
            await this.setupAdvancedFeatures();
            
            this.isLoaded = true;
            this.trackLoadTime();
            
            console.log('✅ GGenius fully initialized');
            
        } catch (error) {
            console.error('🔥 GGenius initialization failed:', error);
            this.fallbackMode();
        }
    }

    detectLowPerformance() {
        return (
            navigator.hardwareConcurrency < 4 || 
            navigator.deviceMemory < 4 ||
            navigator.connection?.effectiveType === 'slow-2g' ||
            navigator.connection?.effectiveType === '2g' ||
            /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        );
    }

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
        await this.simulateLoading();
        
        // Setup gaming cursor for desktop
        if (!this.performance.isLowPerformance && window.innerWidth > 768) {
            this.setupGamingCursor();
        }
    }

    async simulateLoading() {
        return new Promise((resolve) => {
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
                const increment = Math.random() * 15 + 8;
                progress = Math.min(progress + increment, 100);
                
                if (this.progressBar) {
                    this.progressBar.style.width = `${progress}%`;
                    this.progressBar.setAttribute('aria-valuenow', Math.round(progress));
                }
                
                // Update loading message with smooth transitions
                const messageIndex = Math.min(
                    Math.floor((progress / 100) * (messages.length - 1)),
                    messages.length - 1
                );
                
                if (this.loadingText && messages[messageIndex]) {
                    this.updateLoadingText(messages[messageIndex]);
                }
                
                if (progress < 100) {
                    setTimeout(updateProgress, 120 + Math.random() * 180);
                } else {
                    setTimeout(() => {
                        this.hideLoadingScreen();
                        resolve();
                    }, 800);
                }
            };
            
            updateProgress();
        });
    }

    updateLoadingText(text) {
        if (!this.loadingText) return;
        
        this.loadingText.style.opacity = '0';
        setTimeout(() => {
            this.loadingText.textContent = text;
            this.loadingText.style.opacity = '1';
        }, 200);
    }

    hideLoadingScreen() {
        if (!this.loadingScreen || this.isLoaded) return;
        
        this.loadingScreen.classList.add('hidden');
        this.loadingScreen.setAttribute('aria-hidden', 'true');
        
        // Play success sound
        this.playSound(800, 0.1);
        
        setTimeout(() => {
            if (this.loadingScreen?.parentNode) {
                this.loadingScreen.remove();
            }
            this.triggerEntryAnimations();
        }, 500);
    }

    createScrollProgress() {
        const progress = document.createElement('div');
        progress.className = 'scroll-progress';
        progress.id = 'scrollProgress';
        progress.setAttribute('role', 'progressbar');
        progress.setAttribute('aria-label', 'Прогрес прокрутки сторінки');
        progress.setAttribute('aria-valuenow', '0');
        progress.setAttribute('aria-valuemin', '0');
        progress.setAttribute('aria-valuemax', '100');
        document.body.appendChild(progress);
        return progress;
    }

    async setupPerformanceMonitoring() {
        // Web Vitals monitoring
        if ('PerformanceObserver' in window) {
            this.setupWebVitalsTracking();
        }
        
        // Memory leak detection
        this.setupMemoryMonitoring();
        
        // Frame rate monitoring
        this.setupFrameRateMonitoring();
    }

    setupWebVitalsTracking() {
        const vitals = ['FCP', 'LCP', 'FID', 'CLS', 'TTFB'];
        
        vitals.forEach(vital => {
            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        this.performance.metrics[vital] = entry.value || entry.startTime;
                        console.log(`📊 ${vital}:`, this.performance.metrics[vital]);
                    }
                });
                
                observer.observe({ entryTypes: this.getObserverTypes(vital) });
            } catch (error) {
                console.warn(`Failed to observe ${vital}:`, error);
            }
        });
    }

    getObserverTypes(vital) {
        const types = {
            'FCP': ['paint'],
            'LCP': ['largest-contentful-paint'],
            'FID': ['first-input'],
            'CLS': ['layout-shift'],
            'TTFB': ['navigation']
        };
        return types[vital] || [];
    }

    setupMemoryMonitoring() {
        if (performance.memory) {
            setInterval(() => {
                const memory = performance.memory;
                this.performance.metrics.memory = {
                    used: Math.round(memory.usedJSHeapSize / 1048576), // MB
                    total: Math.round(memory.totalJSHeapSize / 1048576),
                    limit: Math.round(memory.jsHeapSizeLimit / 1048576)
                };
                
                // Warn if memory usage is high
                if (memory.usedJSHeapSize / memory.jsHeapSizeLimit > 0.9) {
                    console.warn('🚨 High memory usage detected');
                    this.optimizeMemory();
                }
            }, 30000); // Check every 30 seconds
        }
    }

    setupFrameRateMonitoring() {
        let frameCount = 0;
        let lastTime = performance.now();
        
        const countFrames = (currentTime) => {
            frameCount++;
            
            if (currentTime - lastTime >= 1000) {
                this.performance.metrics.fps = frameCount;
                frameCount = 0;
                lastTime = currentTime;
                
                // Adjust performance mode based on FPS
                if (this.performance.metrics.fps < 30) {
                    this.enablePerformanceMode();
                }
            }
            
            requestAnimationFrame(countFrames);
        };
        
        requestAnimationFrame(countFrames);
    }

    optimizeMemory() {
        // Clear unused observers
        this.observers.forEach((observer, key) => {
            if (!document.querySelector(key)) {
                observer.disconnect();
                this.observers.delete(key);
            }
        });
        
        // Clear completed animations
        this.animations.forEach((animation, key) => {
            if (animation.playState === 'finished') {
                this.animations.delete(key);
            }
        });
        
        // Force garbage collection if available
        if (window.gc) {
            window.gc();
        }
    }

    enablePerformanceMode() {
        if (document.body.classList.contains('performance-mode')) return;
        
        document.body.classList.add('performance-mode');
        console.log('🎛️ Performance mode enabled');
        
        // Reduce animation complexity
        document.documentElement.style.setProperty('--trans', '0.1s');
        document.documentElement.style.setProperty('--trans-fast', '0.05s');
        
        // Disable expensive effects
        const expensiveElements = document.querySelectorAll('.hero-section::after, .gaming-cursor');
        expensiveElements.forEach(el => el.style.display = 'none');
    }

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

    setupNavigation() {
        if (!this.mobileToggle || !this.navMenu) return;

        // Mobile menu toggle
        this.mobileToggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMobileMenu();
        });

        // Smooth scroll for navigation links
        this.navMenu.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                e.preventDefault();
                const targetId = e.target.getAttribute('href');
                this.smoothScrollTo(targetId);
                
                // Close mobile menu if open
                if (this.navMenu.classList.contains('open')) {
                    this.toggleMobileMenu();
                }
            }
        });

        // Header scroll behavior
        this.setupHeaderScroll();
    }

    toggleMobileMenu() {
        const isOpen = this.mobileToggle.getAttribute('aria-expanded') === 'true';
        
        this.mobileToggle.setAttribute('aria-expanded', !isOpen);
        this.navMenu.classList.toggle('open');
        document.body.classList.toggle('menu-open');
        
        // Play interaction sound
        this.playSound(600, 0.05);
        
        // Manage focus for accessibility
        if (!isOpen) {
            this.navMenu.querySelector('.nav-link')?.focus();
        }
    }

    setupHeaderScroll() {
        if (!this.header) return;
        
        let lastScrollY = window.scrollY;
        let isHeaderHidden = false;
        
        const handleHeaderScroll = () => {
            const currentScrollY = window.scrollY;
            const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
            
            if (currentScrollY > 100) {
                this.header.classList.add('scrolled');
                
                // Auto-hide on scroll down, show on scroll up
                if (scrollDirection === 'down' && !isHeaderHidden && currentScrollY > 200) {
                    this.header.style.transform = 'translateY(-100%)';
                    isHeaderHidden = true;
                } else if (scrollDirection === 'up' && isHeaderHidden) {
                    this.header.style.transform = 'translateY(0)';
                    isHeaderHidden = false;
                }
            } else {
                this.header.classList.remove('scrolled');
                this.header.style.transform = 'translateY(0)';
                isHeaderHidden = false;
            }
            
            lastScrollY = currentScrollY;
        };
        
        window.addEventListener('scroll', this.throttle(handleHeaderScroll, 16), { passive: true });
    }

    setupScrollEffects() {
        if (!this.scrollProgress) return;
        
        window.addEventListener('scroll', this.handleScroll, { passive: true });
        
        // Parallax effect for hero section
        if (this.heroSection && !this.performance.isLowPerformance) {
            this.setupParallax();
        }
        
        // Intersection Observer for animations
        this.setupIntersectionObserver();
    }

    handleScroll() {
        // Update scroll progress
        const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        this.scrollProgress.style.width = `${Math.min(scrollPercentage, 100)}%`;
        this.scrollProgress.setAttribute('aria-valuenow', Math.round(scrollPercentage));
    }

    setupParallax() {
        const parallaxElements = this.heroSection.querySelectorAll('.hero-floating-elements .floating-gaming-icon');
        
        const handleParallax = this.throttle(() => {
            const scrollY = window.scrollY;
            const heroRect = this.heroSection.getBoundingClientRect();
            
            if (heroRect.bottom > 0 && heroRect.top < window.innerHeight) {
                parallaxElements.forEach((element, index) => {
                    const speed = 0.5 + (index * 0.1);
                    const yPos = scrollY * speed;
                    element.style.transform = `translate3d(0, ${yPos}px, 0)`;
                });
            }
        }, 16);
        
        window.addEventListener('scroll', handleParallax, { passive: true });
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: [0.1, 0.5, 0.9],
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target, entry.intersectionRatio);
                    
                    // Update active navigation
                    if (entry.target.id && entry.intersectionRatio > 0.5) {
                        this.updateActiveNavigation(entry.target.id);
                    }
                }
            });
        }, observerOptions);

        // Observe sections and animated elements
        const elementsToObserve = document.querySelectorAll(`
            .hero-section,
            .features-section-iui,
            .roadmap-section,
            .accordion-section,
            .tech-stack-section,
            .feature-card-iui,
            .timeline-item,
            .tech-item
        `);
        
        elementsToObserve.forEach(el => observer.observe(el));
        this.observers.set('intersection', observer);
    }

    animateElement(element, ratio) {
        const animationType = element.dataset.animation || 'fadeInUp';
        const delay = parseInt(element.dataset.delay) || 0;
        
        setTimeout(() => {
            element.classList.add('animate-in', animationType);
            
            // Special handling for different element types
            if (element.classList.contains('stat-number')) {
                this.animateCounter(element);
            }
            
            if (element.classList.contains('feature-card-iui')) {
                this.animateFeatureCard(element);
            }
        }, delay);
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.target || element.textContent) || 0;
        const duration = 2000;
        const start = performance.now();
        const startValue = 0;
        
        const update = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(startValue + (target - startValue) * easeOut);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target; // Ensure final value
            }
        };
        
        requestAnimationFrame(update);
    }

    animateFeatureCard(card) {
        const delay = Array.from(card.parentNode.children).indexOf(card) * 100;
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
            
            // Animate icon
            const icon = card.querySelector('.feature-card-icon svg');
            if (icon) {
                icon.style.animation = 'iconGlow 2s ease-in-out infinite alternate';
            }
        }, delay);
    }

    updateActiveNavigation(sectionId) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }

    setupAccordions() {
        const accordions = document.querySelectorAll('.accordion-section');
        
        accordions.forEach((accordion, index) => {
            const header = accordion.querySelector('.accordion-header');
            const content = accordion.querySelector('.accordion-content');
            
            if (!header || !content) return;
            
            // Setup ARIA attributes
            header.setAttribute('aria-expanded', index === 0 ? 'true' : 'false');
            header.setAttribute('aria-controls', `accordion-${index}`);
            content.id = `accordion-${index}`;
            content.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
            
            // Open first accordion by default
            if (index === 0) {
                this.openAccordion(header, content);
            }
            
            header.addEventListener('click', () => {
                this.toggleAccordion(header, content);
            });
            
            header.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleAccordion(header, content);
                }
            });
        });
    }

    toggleAccordion(header, content) {
        const isOpen = header.classList.contains('active');
        
        if (isOpen) {
            this.closeAccordion(header, content);
        } else {
            // Close other accordions for single-open behavior
            document.querySelectorAll('.accordion-header.active').forEach(activeHeader => {
                if (activeHeader !== header) {
                    const activeContent = document.getElementById(activeHeader.getAttribute('aria-controls'));
                    this.closeAccordion(activeHeader, activeContent);
                }
            });
            
            this.openAccordion(header, content);
        }
        
        this.playSound(500, 0.05);
    }

    openAccordion(header, content) {
        header.classList.add('active');
        content.classList.add('active');
        
        const contentHeight = content.querySelector('.accordion-content-inner').scrollHeight;
        content.style.maxHeight = `${contentHeight}px`;
        
        header.setAttribute('aria-expanded', 'true');
        content.setAttribute('aria-hidden', 'false');
    }

    closeAccordion(header, content) {
        header.classList.remove('active');
        content.classList.remove('active');
        content.style.maxHeight = '0px';
        
        header.setAttribute('aria-expanded', 'false');
        content.setAttribute('aria-hidden', 'true');
    }

    setupTabs() {
        const tabContainers = document.querySelectorAll('.feature-categories');
        
        tabContainers.forEach(container => {
            const tabs = container.querySelectorAll('.category-tab');
            const contents = document.querySelectorAll('.tab-content');
            
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    this.switchTab(tab, tabs, contents);
                });
                
                tab.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.switchTab(tab, tabs, contents);
                    }
                });
            });
        });
    }

    switchTab(activeTab, allTabs, allContents) {
        // Update tab states
        allTabs.forEach(tab => {
            tab.classList.remove('active');
            tab.setAttribute('aria-selected', 'false');
        });
        
        activeTab.classList.add('active');
        activeTab.setAttribute('aria-selected', 'true');
        
        // Update content visibility
        allContents.forEach(content => {
            content.classList.remove('active');
            content.setAttribute('aria-hidden', 'true');
        });
        
        const targetId = activeTab.getAttribute('aria-controls');
        const targetContent = document.getElementById(targetId);
        
        if (targetContent) {
            targetContent.classList.add('active');
            targetContent.setAttribute('aria-hidden', 'false');
        }
        
        this.playSound(700, 0.05);
    }

    setupModals() {
        // Demo button modal functionality
        const demoButtons = document.querySelectorAll('.demo-button');
        
        demoButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.showDemoModal();
            });
        });
        
        // Escape key handler for modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    showDemoModal() {
        const modal = this.createModal({
            title: 'GGenius AI Demo',
            content: `
                <div class="demo-modal-content">
                    <div class="ai-avatar">
                        <div class="avatar-glow"></div>
                        <svg class="ai-brain-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                    </div>
                    <h3>Демо буде доступне незабаром!</h3>
                    <p>Ми працюємо над революційним AI-інтерфейсом для аналітики MLBB матчів. Підпишіться на оновлення, щоб отримати ранній доступ.</p>
                    <div class="demo-features">
                        <div class="demo-feature">
                            <span class="feature-icon">🧠</span>
                            <span>Аналіз матчів в реальному часі</span>
                        </div>
                        <div class="demo-feature">
                            <span class="feature-icon">📊</span>
                            <span>Персональні рекомендації</span>
                        </div>
                        <div class="demo-feature">
                            <span class="feature-icon">🎯</span>
                            <span>Прогнози результатів</span>
                        </div>
                    </div>
                </div>
            `,
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

    createModal({ title, content, actions = [] }) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'modal-title');
        
        modal.innerHTML = `
            <div class="modal-container">
                <div class="modal-header">
                    <h2 id="modal-title">${title}</h2>
                    <button class="modal-close" aria-label="Закрити модальне вікно">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="modal-content">
                    ${content}
                </div>
                <div class="modal-actions">
                    ${actions.map(action => 
                        `<button class="modal-action ${action.primary ? 'primary' : ''}" data-action="${action.text}">
                            ${action.text}
                        </button>`
                    ).join('')}
                </div>
            </div>
        `;
        
        // Add event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => this.closeModal());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal();
        });
        
        actions.forEach(action => {
            const button = modal.querySelector(`[data-action="${action.text}"]`);
            if (button && action.action) {
                button.addEventListener('click', action.action);
            }
        });
        
        return modal;
    }

    showModal(modal) {
        document.body.appendChild(modal);
        document.body.classList.add('modal-open');
        
        // Focus management
        const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            firstFocusable.focus();
        }
        
        // Animate in
        requestAnimationFrame(() => {
            modal.classList.add('show');
        });
        
        this.playSound(600, 0.1);
    }

    closeModal() {
        const modal = document.querySelector('.modal-overlay');
        if (!modal) return;
        
        modal.classList.add('closing');
        document.body.classList.remove('modal-open');
        
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 300);
    }

    scrollToNewsletter() {
        const newsletter = document.querySelector('.newsletter-signup');
        if (newsletter) {
            newsletter.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Focus on email input
            setTimeout(() => {
                const emailInput = newsletter.querySelector('input[type="email"]');
                if (emailInput) {
                    emailInput.focus();
                }
            }, 500);
        }
    }

    setupForms() {
        // Newsletter form
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            this.setupNewsletterForm(newsletterForm);
        }
        
        // Contact email copy functionality
        const emailButtons = document.querySelectorAll('.email-link');
        emailButtons.forEach(button => {
            button.addEventListener('click', () => {
                const email = button.dataset.email || 'mlbb.boss.dev@gmail.com';
                this.copyToClipboard(email);
            });
        });
    }

    setupNewsletterForm(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (!this.validateEmail(data.email)) {
                this.showError('Будь ласка, введіть коректну email адресу');
                return;
            }
            
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.querySelector('.button-text').textContent;
            
            try {
                // Update button state
                submitButton.disabled = true;
                submitButton.querySelector('.button-text').textContent = 'Підписуємо...';
                submitButton.classList.add('loading');
                
                // Simulate API call (replace with real endpoint)
                await this.submitNewsletterSignup(data);
                
                // Success state
                submitButton.querySelector('.button-text').textContent = 'Підписано! ✅';
                form.reset();
                
                this.showToast('Дякуємо! Ви успішно підписалися на розсилку', 'success');
                this.playSound(800, 0.15);
                
            } catch (error) {
                console.error('Newsletter signup failed:', error);
                this.showError('Помилка підписки. Спробуйте ще раз');
                submitButton.querySelector('.button-text').textContent = originalText;
            } finally {
                submitButton.disabled = false;
                submitButton.classList.remove('loading');
                
                // Reset button text after delay
                setTimeout(() => {
                    submitButton.querySelector('.button-text').textContent = originalText;
                }, 3000);
            }
        });
    }

    async submitNewsletterSignup(data) {
        // Simulate API call - replace with actual endpoint
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.1) { // 90% success rate
                    resolve({ success: true });
                } else {
                    reject(new Error('Network error'));
                }
            }, 1500);
        });
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async copyToClipboard(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                textArea.remove();
            }
            
            this.showToast('Email адресу скопійовано в буфер обміну!', 'success');
            this.playSound(600, 0.1);
            
        } catch (error) {
            console.error('Failed to copy text:', error);
            this.showToast('Не вдалося скопіювати email', 'error');
        }
    }

    showToast(message, type = 'info', duration = 4000) {
        const toastContainer = this.getOrCreateToastContainer();
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'polite');
        
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">${this.getToastIcon(type)}</span>
                <span class="toast-message">${message}</span>
            </div>
            <button class="toast-close" aria-label="Закрити повідомлення">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;
        
        // Close button functionality
        toast.querySelector('.toast-close').addEventListener('click', () => {
            this.removeToast(toast);
        });
        
        toastContainer.appendChild(toast);
        
        // Animate in
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });
        
        // Auto remove
        setTimeout(() => {
            this.removeToast(toast);
        }, duration);
        
        return toast;
    }

    getToastIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }

    removeToast(toast) {
        if (!toast || !toast.parentNode) return;
        
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
            container.setAttribute('aria-live', 'polite');
            container.setAttribute('aria-label', 'Повідомлення');
            document.body.appendChild(container);
        }
        return container;
    }

    showError(message) {
        this.showToast(message, 'error');
    }

    showSuccess(message) {
        this.showToast(message, 'success');
    }

    async setupInteractions() {
        // Feature card hover effects
        this.setupFeatureCardInteractions();
        
        // Logo animation
        this.setupLogoAnimation();
        
        // Smooth scrolling
        this.setupSmoothScrolling();
        
        // Keyboard navigation
        this.setupKeyboardNavigation();
        
        // Context menu enhancements
        this.setupContextMenu();
    }

    setupFeatureCardInteractions() {
        const featureCards = document.querySelectorAll('.feature-card-iui');
        
        featureCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.playSound(400, 0.02);
                
                // Enhanced glow effect
                card.style.boxShadow = `
                    0 8px 30px rgba(0, 0, 0, 0.4),
                    0 0 20px rgba(0, 123, 255, 0.5),
                    inset 0 0 20px rgba(0, 123, 255, 0.1)
                `;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.boxShadow = '';
            });
            
            card.addEventListener('click', () => {
                this.playSound(800, 0.05);
                
                // Ripple effect
                this.createRippleEffect(card, event);
            });
        });
    }

    createRippleEffect(element, event) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(0, 123, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 600ms ease-out;
            pointer-events: none;
            z-index: 1;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    setupLogoAnimation() {
        const logo = document.querySelector('#ggeniusAnimatedLogo');
        if (!logo) return;
        
        // Enhanced SVG animation
        const animateLogoElements = () => {
            const hexagon = logo.querySelector('.logo-hexagon-frame');
            const gamepad = logo.querySelector('.logo-gamepad');
            const brain = logo.querySelector('.logo-brain');
            
            if (hexagon) {
                hexagon.style.animation = 'svgDrawStroke 2s ease-out 0.5s forwards';
            }
            
            if (gamepad) {
                gamepad.style.animation = 'svgFadeIn 1s ease-out 1.5s forwards';
            }
            
            if (brain) {
                brain.style.animation = 'svgFadeIn 1s ease-out 2s forwards';
            }
        };
        
        // Trigger animation when logo becomes visible
        const logoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateLogoElements();
                    logoObserver.unobserve(entry.target);
                }
            });
        });
        
        logoObserver.observe(logo);
    }

    setupSmoothScrolling() {
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a[href^="#"]');
            if (!target) return;
            
            e.preventDefault();
            const targetId = target.getAttribute('href');
            this.smoothScrollTo(targetId);
        });
    }

    smoothScrollTo(targetId) {
        const target = document.querySelector(targetId);
        if (!target) return;
        
        const headerHeight = this.header?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Update URL without triggering scroll
        history.pushState(null, null, targetId);
    }

    setupKeyboardNavigation() {
        // Tab trap for modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const modal = document.querySelector('.modal-overlay.show');
                if (modal) {
                    this.handleModalTabTrap(e, modal);
                }
            }
        });
        
        // Arrow key navigation for tabs
        document.addEventListener('keydown', (e) => {
            if (e.target.closest('.feature-categories')) {
                this.handleTabNavigation(e);
            }
        });
    }

    handleModalTabTrap(e, modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }

    handleTabNavigation(e) {
        const tabs = Array.from(e.target.closest('.feature-categories').querySelectorAll('.category-tab'));
        const currentIndex = tabs.indexOf(document.activeElement);
        
        let newIndex;
        
        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
                break;
            case 'ArrowRight':
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
                return;
        }
        
        tabs[newIndex].focus();
        tabs[newIndex].click();
    }

    setupContextMenu() {
        // Custom context menu for enhanced UX
        document.addEventListener('contextmenu', (e) => {
            if (e.target.closest('.feature-card-iui, .tech-item')) {
                e.preventDefault();
                this.showContextMenu(e);
            }
        });
        
        // Hide context menu on click outside
        document.addEventListener('click', () => {
            this.hideContextMenu();
        });
    }

    showContextMenu(e) {
        this.hideContextMenu(); // Remove existing menu
        
        const menu = document.createElement('div');
        menu.className = 'context-menu';
        menu.innerHTML = `
            <div class="context-menu-item" data-action="copy-link">
                <span class="menu-icon">🔗</span>
                Копіювати посилання
            </div>
            <div class="context-menu-item" data-action="share">
                <span class="menu-icon">📤</span>
                Поділитися
            </div>
            <div class="context-menu-item" data-action="bookmark">
                <span class="menu-icon">⭐</span>
                Додати в закладки
            </div>
        `;
        
        menu.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            z-index: 10000;
        `;
        
        document.body.appendChild(menu);
        
        // Handle menu actions
        menu.addEventListener('click', (menuEvent) => {
            const action = menuEvent.target.closest('.context-menu-item')?.dataset.action;
            if (action) {
                this.handleContextMenuAction(action, e.target);
                this.hideContextMenu();
            }
        });
        
        // Position menu to stay within viewport
        const rect = menu.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            menu.style.left = `${e.clientX - rect.width}px`;
        }
        if (rect.bottom > window.innerHeight) {
            menu.style.top = `${e.clientY - rect.height}px`;
        }
    }

    hideContextMenu() {
        const existingMenu = document.querySelector('.context-menu');
        if (existingMenu) {
            existingMenu.remove();
        }
    }

    handleContextMenuAction(action, target) {
        switch (action) {
            case 'copy-link':
                this.copyToClipboard(window.location.href);
                break;
            case 'share':
                this.shareContent();
                break;
            case 'bookmark':
                this.addToBookmarks();
                break;
        }
    }

    async shareContent() {
        const shareData = {
            title: 'GGenius - AI Революція в MLBB Кіберспорті',
            text: 'Відкрийте майбутнє кіберспорту з штучним інтелектом!',
            url: window.location.href
        };
        
        try {
            if (navigator.share) {
                await navigator.share(shareData);
                this.showToast('Контент успішно поділений!', 'success');
            } else {
                // Fallback to copying URL
                await this.copyToClipboard(window.location.href);
                this.showToast('Посилання скопійовано для поділення', 'info');
            }
        } catch (error) {
            console.error('Share failed:', error);
        }
    }

    addToBookmarks() {
        try {
            // Modern browsers don't allow programmatic bookmarking
            // Show instruction instead
            this.showToast('Натисніть Ctrl+D (Cmd+D на Mac) для додавання в закладки', 'info', 6000);
        } catch (error) {
            console.error('Bookmark failed:', error);
        }
    }

    async setupAdvancedFeatures() {
        // Preload critical resources
        this.preloadResources();
        
        // Setup service worker if available
        if ('serviceWorker' in navigator) {
            this.setupServiceWorker();
        }
        
        // Setup Web App Install prompt
        this.setupInstallPrompt();
        
        // Setup typing animation for hero
        this.setupTypingAnimation();
        
        // Setup background music (optional)
        this.setupBackgroundMusic();
    }

    preloadResources() {
        const criticalResources = [
            '/static/images/og-image.webp',
            '/static/images/favicon.svg'
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = resource;
            document.head.appendChild(link);
        });
    }

    async setupServiceWorker() {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('ServiceWorker registered:', registration);
            
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        this.showUpdateAvailable();
                    }
                });
            });
        } catch (error) {
            console.warn('ServiceWorker registration failed:', error);
        }
    }

    showUpdateAvailable() {
        const toast = this.showToast(
            'Доступна нова версія GGenius! Оновити зараз?',
            'info',
            10000
        );
        
        // Add update button to toast
        const updateButton = document.createElement('button');
        updateButton.textContent = 'Оновити';
        updateButton.className = 'toast-action';
        updateButton.addEventListener('click', () => {
            window.location.reload();
        });
        
        toast.querySelector('.toast-content').appendChild(updateButton);
    }

    setupInstallPrompt() {
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            // Show install banner
            this.showInstallBanner(deferredPrompt);
        });
        
        window.addEventListener('appinstalled', () => {
            console.log('GGenius PWA installed');
            this.showToast('GGenius успішно встановлено!', 'success');
        });
    }

    showInstallBanner(prompt) {
        const banner = document.createElement('div');
        banner.className = 'install-banner';
        banner.innerHTML = `
            <div class="install-content">
                <span class="install-icon">📱</span>
                <div class="install-text">
                    <strong>Встановити GGenius</strong>
                    <small>Швидший доступ до AI-аналітики</small>
                </div>
                <button class="install-button">Встановити</button>
                <button class="install-close">✕</button>
            </div>
        `;
        
        document.body.appendChild(banner);
        
        banner.querySelector('.install-button').addEventListener('click', async () => {
            banner.remove();
            prompt.prompt();
            const { outcome } = await prompt.userChoice;
            console.log('Install prompt outcome:', outcome);
        });
        
        banner.querySelector('.install-close').addEventListener('click', () => {
            banner.remove();
        });
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (banner.parentNode) {
                banner.remove();
            }
        }, 10000);
    }

    setupTypingAnimation() {
        const subtitle = document.querySelector('.hero-section .subtitle');
        if (!subtitle) return;
        
        const originalText = subtitle.textContent;
        subtitle.textContent = '';
        subtitle.style.opacity = '1';
        
        let currentIndex = 0;
        
        const typeCharacter = () => {
            if (currentIndex < originalText.length) {
                subtitle.textContent += originalText[currentIndex];
                currentIndex++;
                
                // Variable typing speed for more natural feel
                const speed = 30 + Math.random() * 40;
                setTimeout(typeCharacter, speed);
                
                // Play subtle typing sound
                if (currentIndex % 3 === 0) {
                    this.playSound(800 + Math.random() * 200, 0.01);
                }
            }
        };
        
        // Start typing animation after loading screen
        setTimeout(typeCharacter, 2500);
    }

    setupBackgroundMusic() {
        // Optional ambient background music for enhanced experience
        if (this.performance.isLowPerformance) return;
        
        const musicToggle = document.createElement('button');
        musicToggle.className = 'music-toggle';
        musicToggle.innerHTML = '🎵';
        musicToggle.title = 'Увімкнути/вимкнути фонову музику';
        musicToggle.setAttribute('aria-label', 'Увімкнути фонову музику');
        
        document.body.appendChild(musicToggle);
        
        let isPlaying = false;
        let audioContext;
        let oscillator;
        let gainNode;
        
        musicToggle.addEventListener('click', () => {
            if (!isPlaying) {
                this.startAmbientMusic();
                musicToggle.innerHTML = '🔇';
                musicToggle.setAttribute('aria-label', 'Вимкнути фонову музику');
                isPlaying = true;
            } else {
                this.stopAmbientMusic();
                musicToggle.innerHTML = '🎵';
                musicToggle.setAttribute('aria-label', 'Увімкнути фонову музику');
                isPlaying = false;
            }
        });
    }

    startAmbientMusic() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        // Create simple ambient drone
        const oscillator1 = this.audioContext.createOscillator();
        const oscillator2 = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator1.frequency.setValueAtTime(55, this.audioContext.currentTime); // A1
        oscillator2.frequency.setValueAtTime(82.41, this.audioContext.currentTime); // E2
        
        oscillator1.type = 'sine';
        oscillator2.type = 'triangle';
        
        gainNode.gain.setValueAtTime(0.01, this.audioContext.currentTime); // Very quiet
        
        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator1.start();
        oscillator2.start();
        
        this.ambientOscillators = [oscillator1, oscillator2];
        this.ambientGain = gainNode;
    }

    stopAmbientMusic() {
        if (this.ambientOscillators) {
            this.ambientOscillators.forEach(osc => osc.stop());
            this.ambientOscillators = null;
        }
    }

    setupGamingCursor() {
        const cursor = document.createElement('div');
        cursor.className = 'gaming-cursor';
        cursor.innerHTML = `
            <div class="cursor-dot"></div>
            <div class="cursor-ring"></div>
        `;
        document.body.appendChild(cursor);
        
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        
        // Mouse tracking
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        // Smooth cursor animation
        const animateCursor = () => {
            const ease = 0.15;
            cursorX += (mouseX - cursorX) * ease;
            cursorY += (mouseY - cursorY) * ease;
            
            cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
            requestAnimationFrame(animateCursor);
        };
        
        animateCursor();
        
        // Interaction effects
        document.addEventListener('mousedown', () => {
            cursor.classList.add('clicked');
            this.playSound(1000, 0.02);
        });
        
        document.addEventListener('mouseup', () => {
            cursor.classList.remove('clicked');
        });
        
        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });
        
        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
        });
        
        // Special effects for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .feature-card-iui, .tech-item');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
            });
        });
    }

    playSound(frequency, duration = 0.1, volume = 0.05) {
        if (!this.audioContext) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (error) {
                return; // Audio not supported
            }
        }
        
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        } catch (error) {
            console.warn('Sound playback failed:', error);
        }
    }

    triggerEntryAnimations() {
        // Hero section animations
        const heroElements = [
            '.hero-logo-container',
            '.hero-title',
            '.hero-section .subtitle',
            '.hero-actions',
            '.hero-stats'
        ];
        
        heroElements.forEach((selector, index) => {
            const element = document.querySelector(selector);
            if (element) {
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 200);
            }
        });
        
        // Floating elements animation
        const floatingElements = document.querySelectorAll('.floating-gaming-icon');
        floatingElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.animation = `float3D 12s ease-in-out infinite ${index * 2}s`;
            }, 1000 + index * 300);
        });
    }

    trackLoadTime() {
        const loadTime = performance.now() - this.performance.startTime;
        this.performance.metrics.totalLoadTime = loadTime;
        
        console.log(`🎯 GGenius loaded in ${loadTime.toFixed(2)}ms`);
        
        // Send analytics if needed
        if (window.gtag) {
            gtag('event', 'page_load_time', {
                value: Math.round(loadTime),
                custom_parameter: 'ggenius_load'
            });
        }
    }

    handleResize() {
        // Update viewport units for mobile
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // Recalculate layout if needed
        if (this.scrollProgress) {
            this.handleScroll();
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            // Pause animations and sounds when tab is hidden
            this.pauseAnimations();
        } else {
            // Resume when tab becomes visible
            this.resumeAnimations();
        }
    }

    pauseAnimations() {
        document.body.classList.add('paused');
        
        if (this.ambientOscillators) {
            this.ambientGain.gain.setValueAtTime(0, this.audioContext.currentTime);
        }
    }

    resumeAnimations() {
        document.body.classList.remove('paused');
        
        if (this.ambientOscillators) {
            this.ambientGain.gain.setValueAtTime(0.01, this.audioContext.currentTime);
        }
    }

    fallbackMode() {
        console.warn('🔧 Entering fallback mode');
        
        // Hide loading screen immediately
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
        
        // Show basic functionality
        document.body.classList.add('fallback-mode');
        
        // Minimal functionality for older browsers
        this.setupBasicNavigation();
        this.setupBasicForms();
    }

    setupBasicNavigation() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', () => {
                navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
            });
        }
    }

    setupBasicForms() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Дякуємо за ваш інтерес! Форма буде опрацьована незабаром.');
            });
        });
    }

    // Utility functions
    throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        
        return function (...args) {
            const currentTime = Date.now();
            
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
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

    // Cleanup method for memory management
    destroy() {
        // Remove event listeners
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        
        // Disconnect