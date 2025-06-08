/**
 * GGenius Enhanced Interactive Experience with Content Management
 * Performance-optimized ES2023+ JavaScript for cyberpunk AI platform
 * @version 2.8.0 - Mobile Navigation Enhanced
 * @author GGenius Team
 */

/**
 * Mobile Navigation Manager - НОВИЙ КЛАС
 * Керує мобільною навігацією та інтерактивністю header
 */
class MobileNavigationManager {
    constructor() {
        this.header = null;
        this.mobileMenuToggle = null;
        this.headerNav = null;
        this.mobileMenuOverlay = null;
        this.isMenuOpen = false;
        this.scrollThreshold = 50;
        this.lastScrollY = 0;
        this.touchStartY = 0;
        this.touchEndY = 0;
        
        this.init();
    }

    /**
     * Ініціалізація мобільної навігації
     */
    init() {
        this.bindElements();
        this.setupEventListeners();
        this.handleInitialState();
        console.log('🔧 Mobile Navigation Manager initialized');
    }

    /**
     * Прив'язка DOM елементів
     */
    bindElements() {
        this.header = document.getElementById('site-header');
        this.mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        this.headerNav = document.getElementById('header-nav');
        this.mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
        
        // Створити overlay якщо не існує
        if (!this.mobileMenuOverlay) {
            this.mobileMenuOverlay = document.createElement('div');
            this.mobileMenuOverlay.className = 'mobile-menu-overlay';
            this.mobileMenuOverlay.id = 'mobile-menu-overlay';
            document.body.appendChild(this.mobileMenuOverlay);
        }
    }

    /**
     * Налаштування event listeners
     */
    setupEventListeners() {
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
        }

        if (this.mobileMenuOverlay) {
            this.mobileMenuOverlay.addEventListener('click', this.closeMobileMenu.bind(this));
        }

        // Закриття меню при кліку на посилання
        if (this.headerNav) {
            this.headerNav.addEventListener('click', (e) => {
                if (e.target.tagName === 'A') {
                    this.closeMobileMenu();
                    this.setActiveNavItem(e.target);
                }
            });
        }

        // Скрол навігація
        window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });

        // Обробка зміни розміру вікна
        window.addEventListener('resize', this.handleResize.bind(this));

        // Обробка ESC клавіші
        document.addEventListener('keydown', this.handleKeyDown.bind(this));

        // Touch events для свайпів
        document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
        document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
    }

    /**
     * Обробка початкового стану
     */
    handleInitialState() {
        this.closeMobileMenu();
        this.updateScrollState();
        this.setActiveNavItemFromHash();
    }

    /**
     * Перемикання мобільного меню
     */
    toggleMobileMenu() {
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    /**
     * Відкриття мобільного меню
     */
    openMobileMenu() {
        if (this.isMenuOpen) return;

        this.isMenuOpen = true;
        
        // Додати класи та атрибути
        if (this.headerNav) {
            this.headerNav.classList.add('mobile-menu-open');
        }
        
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.classList.add('active');
            this.mobileMenuToggle.setAttribute('aria-expanded', 'true');
        }
        
        if (this.mobileMenuOverlay) {
            this.mobileMenuOverlay.classList.add('active');
        }

        // Блокувати скрол body
        document.body.style.overflow = 'hidden';
        
        // Фокус на першому елементі меню
        this.focusFirstMenuItem();

        console.log('📱 Mobile menu opened');
    }

    /**
     * Закриття мобільного меню
     */
    closeMobileMenu() {
        if (!this.isMenuOpen) return;

        this.isMenuOpen = false;
        
        // Видалити класи та атрибути
        if (this.headerNav) {
            this.headerNav.classList.remove('mobile-menu-open');
        }
        
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.classList.remove('active');
            this.mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
        
        if (this.mobileMenuOverlay) {
            this.mobileMenuOverlay.classList.remove('active');
        }

        // Відновити скрол body
        document.body.style.overflow = '';

        console.log('📱 Mobile menu closed');
    }

    /**
     * Обробка скролу
     */
    handleScroll() {
        this.updateScrollState();
        
        // Закрити меню при скролі
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        }
    }

    /**
     * Оновлення стану при скролі
     */
    updateScrollState() {
        const currentScrollY = window.scrollY;
        
        if (this.header) {
            if (currentScrollY > this.scrollThreshold) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
        }
        
        this.lastScrollY = currentScrollY;
    }

    /**
     * Обробка зміни розміру вікна
     */
    handleResize() {
        // Закрити меню при зміні орієнтації або розміру
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        }
        
        // Автоматично закрити меню на великих екранах
        if (window.innerWidth > 768 && this.isMenuOpen) {
            this.closeMobileMenu();
        }
    }

    /**
     * Обробка натискання клавіш
     */
    handleKeyDown(event) {
        if (event.key === 'Escape' && this.isMenuOpen) {
            this.closeMobileMenu();
            this.mobileMenuToggle?.focus();
        }
    }

    /**
     * Обробка початку дотику
     */
    handleTouchStart(event) {
        this.touchStartY = event.touches[0].clientY;
    }

    /**
     * Обробка кінця дотику (свайп)
     */
    handleTouchEnd(event) {
        this.touchEndY = event.changedTouches[0].clientY;
        this.handleSwipe();
    }

    /**
     * Обробка свайпу
     */
    handleSwipe() {
        const swipeDistance = this.touchStartY - this.touchEndY;
        const minSwipeDistance = 50;

        // Свайп вгору - закрити меню
        if (swipeDistance > minSwipeDistance && this.isMenuOpen) {
            this.closeMobileMenu();
        }
    }

    /**
     * Фокус на першому елементі меню
     */
    focusFirstMenuItem() {
        if (this.headerNav) {
            const firstLink = this.headerNav.querySelector('a');
            if (firstLink) {
                setTimeout(() => firstLink.focus(), 100);
            }
        }
    }

    /**
     * Встановлення активного елемента навігації
     */
    setActiveNavItem(clickedItem) {
        if (!this.headerNav) return;

        // Видалити active клас з усіх елементів
        this.headerNav.querySelectorAll('a').forEach(link => {
            link.classList.remove('active');
        });

        // Додати active клас до поточного елемента
        if (clickedItem) {
            clickedItem.classList.add('active');
        }
    }

    /**
     * Встановлення активного елемента з хешу URL
     */
    setActiveNavItemFromHash() {
        const hash = window.location.hash || '#hero';
        const activeLink = this.headerNav?.querySelector(`a[href="${hash}"]`);
        
        if (activeLink) {
            this.setActiveNavItem(activeLink);
        }
    }

    /**
     * Оновлення активного елемента при скролі до секції
     */
    updateActiveNavOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                const activeLink = this.headerNav?.querySelector(`a[href="#${sectionId}"]`);
                if (activeLink) {
                    this.setActiveNavItem(activeLink);
                }
            }
        });
    }

    /**
     * Знищення event listeners
     */
    destroy() {
        window.removeEventListener('scroll', this.handleScroll.bind(this));
        window.removeEventListener('resize', this.handleResize.bind(this));
        document.removeEventListener('keydown', this.handleKeyDown.bind(this));
        document.removeEventListener('touchstart', this.handleTouchStart.bind(this));
        document.removeEventListener('touchend', this.handleTouchEnd.bind(this));
        
        console.log('🧹 Mobile Navigation Manager destroyed');
    }
}

/**
 * Content Management System - Enhanced для роботи з контентом секцій
 */
class ContentManager {
    constructor() {
        this.content = new Map();
        this.currentLanguage = 'uk';
        this.fallbackLanguage = 'en';
        this.isLoaded = false;
        this.loadingPromise = null;
        this.retryCount = 0;
        this.maxRetries = 2;

        // Статичний контент для збережених секцій
        this.staticContent = {
            'uk': {
                // Головна секція
                'hero.status': 'В РОЗРОБЦІ',
                'hero.title': 'GGenius AI',
                'hero.description.intro': 'Вітаємо у майбутньому кіберспорту! GGenius - це передова платформа штучного інтелекту, створена спеціально для Mobile Legends: Bang Bang.',
                'hero.cta.join': 'Приєднатися до спільноти',

                // Як це працює
                'how-it-works.title': 'Як це працює',
                'how-it-works.subtitle': 'Три простих кроки до професійного рівня гри',

                // Roadmap
                'roadmap.title': 'Roadmap',
                'roadmap.q1.2025.date': 'Q1 2025',
                'roadmap.q1.2025.title': 'MVP Launch',
                'roadmap.q1.2025.desc': 'Базова аналітика матчів, розробка та тестування.',
                'roadmap.q2.2025.date': 'Q2 2025',
                'roadmap.q2.2025.title': 'AI Integration',
                'roadmap.q2.2025.desc': 'Запуск нейронної аналітики та AI-тренера.',
                'roadmap.q3.2025.date': 'Q3 2025',
                'roadmap.q3.2025.title': 'Community & Tournaments',
                'roadmap.q3.2025.desc': 'Соціальна платформа та турнірна система.',
                'roadmap.q4.2025.date': 'Q4 2025',
                'roadmap.q4.2025.title': 'Platform Launch & Token',
                'roadmap.q4.2025.desc': 'Повноцінна веб-платформа, запуск GGenius Token.',
                'roadmap.q1.2026.date': 'Q1 2026',
                'roadmap.q1.2026.title': 'Global Expansion',
                'roadmap.q1.2026.desc': 'Міжнародна експансія та партнерства.',

                // Мета
                'meta.title': 'GGenius - AI Революція в Mobile Legends',
                'meta.description': 'Штучний інтелект для аналізу та покращення гри в Mobile Legends: Bang Bang'
            }
        };
    }

    /**
     * Ініціалізація системи контенту
     */
    async init() {
        if (this.loadingPromise) {
            return this.loadingPromise;
        }

        this.loadingPromise = this.loadContentWithTimeout();
        return this.loadingPromise;
    }

    /**
     * Завантаження контенту з timeout
     */
    async loadContentWithTimeout() {
        try {
            console.log('🔄 Loading content with fast fallback...');

            // Використовуємо статичний контент
            this.useStaticContent();

            // Спроба завантаження з lang файлу
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Content loading timeout')), 3000);
            });

            try {
                await Promise.race([
                    this.loadFromExistingLangFiles(),
                    timeoutPromise
                ]);
            } catch (error) {
                console.warn('⚠️ Lang files loading failed or timed out, using static:', error.message);
            }

            this.isLoaded = true;
            this.retryCount = 0;
            console.log('✅ Content loaded successfully');

            this.applyContentToPage();
            return true;
        } catch (error) {
            console.warn('⚠ Content loading failed, using static:', error);
            this.useStaticContent();
            this.applyContentToPage();
            return false;
        }
    }

    /**
     * Завантаження з lang файлів
     */
    async loadFromExistingLangFiles() {
        try {
            const response = await fetch(`/static/lang/${this.currentLanguage}.json`, {
                cache: 'no-cache'
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const langData = await response.json();
            const convertedData = this.convertLangFileToContentStructure(langData);
            const mergedContent = { 
                ...this.staticContent[this.currentLanguage] || this.staticContent.uk, 
                ...convertedData 
            };

            this.content.set(this.currentLanguage, mergedContent);
            console.log(`✅ Loaded content from lang/${this.currentLanguage}.json`);
        } catch (error) {
            console.warn('Failed to load from lang files:', error);
            throw error;
        }
    }

    /**
     * Конвертація структури lang файлу
     */
    convertLangFileToContentStructure(langData) {
        const converted = {};
        const mappings = {
            'projectIntroTitle': 'hero.title',
            'projectIntroDescriptionIntro': 'hero.description.intro',
            'roadmapTitle': 'roadmap.title'
        };

        for (const [oldKey, newKey] of Object.entries(mappings)) {
            if (langData[oldKey]) {
                let value = langData[oldKey];
                if (typeof value === 'string') {
                    value = value.replace(/<[^>]*>/g, '').trim();
                }
                converted[newKey] = value;
            }
        }

        return converted;
    }

    /**
     * Використання статичного контенту
     */
    useStaticContent() {
        this.content.set(this.currentLanguage, this.staticContent[this.currentLanguage] || this.staticContent.uk);
        this.isLoaded = true;
    }

    /**
     * Застосування контенту до сторінки
     */
    applyContentToPage() {
        const currentContent = this.getCurrentContent();
        let appliedCount = 0;

        try {
            document.querySelectorAll('[data-content]').forEach(element => {
                const contentKey = element.getAttribute('data-content');
                const content = this.getContentByKey(contentKey, currentContent);

                if (content) {
                    this.setElementContent(element, content);
                    appliedCount++;
                } else {
                    const fallback = element.querySelector('.fallback-text');
                    if (fallback) {
                        fallback.style.display = 'inline';
                    }
                    console.debug(`Content not found for key: ${contentKey}`);
                }
            });

            if (currentContent['meta.title']) {
                document.title = currentContent['meta.title'];
            }

            document.dispatchEvent(new CustomEvent('content:loaded', {
                detail: { 
                    language: this.currentLanguage,
                    keysLoaded: Object.keys(currentContent).length,
                    elementsUpdated: appliedCount
                }
            }));

            console.log(`📝 Content applied: ${appliedCount} elements updated`);
        } catch (error) {
            console.error('❌ Error applying content to page:', error);
            document.querySelectorAll('.fallback-text').forEach(fallback => {
                fallback.style.display = 'inline';
            });
        }
    }

    /**
     * Встановлення контенту для елемента
     */
    setElementContent(element, content) {
        const contentType = element.getAttribute('data-content-type') || 'text';

        try {
            if (contentType === 'html') {
                element.innerHTML = content;
            } else {
                element.textContent = content;
            }

            const fallback = element.querySelector('.fallback-text');
            if (fallback) {
                fallback.style.display = 'none';
            }
        } catch (error) {
            console.error('Error setting element content:', error);
            const fallback = element.querySelector('.fallback-text');
            if (fallback) {
                fallback.style.display = 'inline';
            }
        }
    }

    /**
     * Отримання контенту за ключем
     */
    getContentByKey(key, content) {
        return content[key] || null;
    }

    /**
     * Отримання поточного контенту
     */
    getCurrentContent() {
        return this.content.get(this.currentLanguage) || 
               this.content.get(this.fallbackLanguage) || 
               this.staticContent[this.currentLanguage] || 
               this.staticContent.uk || {};
    }

    /**
     * Отримання тексту за ключем
     */
    getText(key) {
        if (!this.isLoaded) {
            return this.staticContent.uk[key] || key;
        }

        const content = this.getCurrentContent();
        return this.getContentByKey(key, content) || key;
    }

    /**
     * Зміна мови
     */
    async setLanguage(language) {
        this.currentLanguage = language;
        localStorage.setItem('ggenius-language', language);
        document.documentElement.lang = language;

        try {
            await this.loadFromExistingLangFiles();
            this.applyContentToPage();
        } catch (error) {
            console.warn('Failed to change language, using static content:', error);
            this.useStaticContent();
            this.applyContentToPage();
        }
    }

    /**
     * Отримання статистики
     */
    getContentStats() {
        const currentContent = this.getCurrentContent();
        return {
            language: this.currentLanguage,
            fallbackLanguage: this.fallbackLanguage,
            totalKeys: Object.keys(currentContent).length,
            loadedFromLangFiles: this.isLoaded,
            retryCount: this.retryCount
        };
    }
}

/**
 * Smooth Scroll Manager - НОВИЙ КЛАС
 * Керує плавним скролом та активними секціями
 */
class SmoothScrollManager {
    constructor(navigationManager) {
        this.navigationManager = navigationManager;
        this.isScrolling = false;
        this.scrollTimeout = null;
        
        this.init();
    }

    /**
     * Ініціалізація smooth scroll
     */
    init() {
        this.setupSmoothScrolling();
        this.setupScrollSpy();
        console.log('🔄 Smooth Scroll Manager initialized');
    }

    /**
     * Налаштування плавного скролу
     */
    setupSmoothScrolling() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                
                const targetId = e.target.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    this.scrollToElement(targetElement);
                }
            }
        });
    }

    /**
     * Скрол до елемента
     */
    scrollToElement(element) {
        const headerHeight = this.navigationManager?.header?.offsetHeight || 64;
        const targetPosition = element.offsetTop - headerHeight;
        
        this.isScrolling = true;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        // Оновити URL без перезавантаження
        const targetId = element.getAttribute('id');
        if (targetId) {
            history.pushState(null, '', `#${targetId}`);
        }

        // Скинути флаг скролінгу
        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(() => {
            this.isScrolling = false;
        }, 1000);
    }

    /**
     * Налаштування scroll spy
     */
    setupScrollSpy() {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            if (this.isScrolling) return;

            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');
                    const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
                    
                    if (activeLink && this.navigationManager) {
                        this.navigationManager.setActiveNavItem(activeLink);
                    }
                    
                    // Оновити URL
                    if (sectionId) {
                        history.replaceState(null, '', `#${sectionId}`);
                    }
                }
            });
        }, observerOptions);

        // Спостерігати за всіма секціями
        document.querySelectorAll('section[id]').forEach(section => {
            observer.observe(section);
        });
    }
}

/**
 * Performance Monitor - НОВИЙ КЛАС
 * Моніторинг продуктивності та оптимізація
 */
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            loadTime: 0,
            firstContentfulPaint: 0,
            largestContentfulPaint: 0,
            cumulativeLayoutShift: 0,
            firstInputDelay: 0
        };
        
        this.thresholds = {
            loadTime: 3000,      // 3 секунди
            fcp: 1800,           // 1.8 секунди
            lcp: 2500,           // 2.5 секунди
            cls: 0.1,            // 0.1
            fid: 100             // 100мс
        };
        
        this.init();
    }

    /**
     * Ініціалізація моніторингу
     */
    init() {
        this.measureLoadTime();
        this.measureWebVitals();
        this.setupResourceObserver();
        console.log('⚡ Performance Monitor initialized');
    }

    /**
     * Вимірювання часу завантаження
     */
    measureLoadTime() {
        const loadTime = performance.now();
        this.metrics.loadTime = loadTime;
        
        if (loadTime > this.thresholds.loadTime) {
            console.warn(`⚠️ Slow load time: ${loadTime.toFixed(2)}ms`);
        } else {
            console.log(`✅ Load time: ${loadTime.toFixed(2)}ms`);
        }
    }

    /**
     * Вимірювання Web Vitals
     */
    measureWebVitals() {
        // First Contentful Paint
        if ('PerformanceObserver' in window) {
            const fcpObserver = new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    if (entry.name === 'first-contentful-paint') {
                        this.metrics.firstContentfulPaint = entry.startTime;
                        console.log(`🎨 FCP: ${entry.startTime.toFixed(2)}ms`);
                    }
                }
            });
            
            fcpObserver.observe({ entryTypes: ['paint'] });

            // Largest Contentful Paint
            const lcpObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.metrics.largestContentfulPaint = lastEntry.startTime;
                console.log(`🖼️ LCP: ${lastEntry.startTime.toFixed(2)}ms`);
            });
            
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

            // Cumulative Layout Shift
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                this.metrics.cumulativeLayoutShift = clsValue;
            });
            
            clsObserver.observe({ entryTypes: ['layout-shift'] });

            // First Input Delay
            const fidObserver = new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    this.metrics.firstInputDelay = entry.processingStart - entry.startTime;
                    console.log(`⚡ FID: ${this.metrics.firstInputDelay.toFixed(2)}ms`);
                }
            });
            
            fidObserver.observe({ entryTypes: ['first-input'] });
        }
    }

    /**
     * Спостереження за ресурсами
     */
    setupResourceObserver() {
        if ('PerformanceObserver' in window) {
            const resourceObserver = new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    if (entry.duration > 1000) { // Повільні ресурси (>1с)
                        console.warn(`🐌 Slow resource: ${entry.name} - ${entry.duration.toFixed(2)}ms`);
                    }
                }
            });
            
            resourceObserver.observe({ entryTypes: ['resource'] });
        }
    }

    /**
     * Отримання звіту про продуктивність
     */
    getPerformanceReport() {
        return {
            metrics: this.metrics,
            thresholds: this.thresholds,
            score: this.calculatePerformanceScore(),
            recommendations: this.getRecommendations()
        };
    }

    /**
     * Розрахунок оцінки продуктивності
     */
    calculatePerformanceScore() {
        let score = 100;
        
        // Штрафи за перевищення порогів
        if (this.metrics.loadTime > this.thresholds.loadTime) {
            score -= 20;
        }
        if (this.metrics.firstContentfulPaint > this.thresholds.fcp) {
            score -= 15;
        }
        if (this.metrics.largestContentfulPaint > this.thresholds.lcp) {
            score -= 20;
        }
        if (this.metrics.cumulativeLayoutShift > this.thresholds.cls) {
            score -= 15;
        }
        if (this.metrics.firstInputDelay > this.thresholds.fid) {
            score -= 10;
        }
        
        return Math.max(0, score);
    }

    /**
     * Отримання рекомендацій
     */
    getRecommendations() {
        const recommendations = [];
        
        if (this.metrics.loadTime > this.thresholds.loadTime) {
            recommendations.push('Оптимізуйте завантаження ресурсів');
        }
        if (this.metrics.firstContentfulPaint > this.thresholds.fcp) {
            recommendations.push('Покращте швидкість відображення контенту');
        }
        if (this.metrics.largestContentfulPaint > this.thresholds.lcp) {
            recommendations.push('Оптимізуйте завантаження великих елементів');
        }
        if (this.metrics.cumulativeLayoutShift > this.thresholds.cls) {
            recommendations.push('Зменште зміщення макету');
        }
        if (this.metrics.firstInputDelay > this.thresholds.fid) {
            recommendations.push('Покращте відгук на взаємодію користувача');
        }
        
        return recommendations;
    }
}

/**
 * Головний клас додатка GGenius
 */
class GGeniusApp {
    constructor() {
        this.isLoaded = false;
        this.eventListeners = new Map();
        this.contentManager = new ContentManager();
        this.mobileNavigationManager = null;
        this.smoothScrollManager = null;
        this.performanceMonitor = new PerformanceMonitor();
        
        this.settings = {
            language: localStorage.getItem('ggenius-language') || 'uk',
            reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        };

        this.performance = {
            startTime: performance.now(),
            isLowPerformance: this.detectLowPerformance()
        };

        this.init();
    }

    /**
     * Ініціалізація додатка
     */
    async init() {
        try {
            console.log('🚀 Initializing GGenius App...');

            const initTimeout = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Initialization timeout')), 5000);
            });

            try {
                await Promise.race([
                    this.contentManager.init(),
                    initTimeout
                ]);
            } catch (error) {
                console.warn('⚠️ Content manager init failed or timed out:', error.message);
                this.contentManager.useStaticContent();
                this.contentManager.applyContentToPage();
            }

            // Ініціалізація інших компонентів
            this.mobileNavigationManager = new MobileNavigationManager();
            this.smoothScrollManager = new SmoothScrollManager(this.mobileNavigationManager);

            this.isLoaded = true;
            console.log('✅ GGenius App initialized successfully');

            document.dispatchEvent(new CustomEvent('ggenius:ready', {
                detail: {
                    version: '2.8.0',
                    performance: this.performance.isLowPerformance ? 'low' : 'normal',
                    language: this.settings.language,
                    features: ['mobile-navigation', 'smooth-scroll', 'performance-monitoring']
                }
            }));
        } catch (error) {
            console.error('❌ Failed to initialize GGenius App:', error);
            this.fallbackMode(error);
        }
    }

    /**
     * Виявлення низької продуктивності
     */
    detectLowPerformance() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
        const hasLimitedMemory = navigator.deviceMemory && navigator.deviceMemory < 2;
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        return isSlowConnection || hasLimitedMemory || (isMobile && window.innerWidth < 768);
    }

    /**
     * Fallback режим
     */
    fallbackMode(error) {
        console.log('🔧 Entering fallback mode...');

        document.documentElement.classList.add('fallback-mode');
        document.querySelectorAll('.fallback-text').forEach(element => {
            element.style.display = 'inline';
        });

        if (localStorage.getItem('ggenius-debug') === 'true') {
            const message = document.createElement('div');
            message.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--pink, #ff073a);
                color: white;
                padding: 1rem;
                border-radius: 8px;
                z-index: 10000;
                max-width: 300px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            `;
            message.innerHTML = `
                <strong>Режим fallback</strong><br>
                ${error.message}<br>
                <button onclick="location.reload()" style="
                    background: transparent;
                    border: 1px solid currentColor;
                    color: inherit;
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    margin-top: 0.5rem;
                    cursor: pointer;
                ">Оновити</button>
            `;
            document.body.appendChild(message);
        }

        console.log('✅ Fallback mode activated');
    }

    /**
     * Додавання event listener
     */
    _addEventListener(target, type, listener, key, options = { passive: true }) {
        if (this.eventListeners.has(key)) {
            this._removeEventListener(key);
        }
        target.addEventListener(type, listener, options);
        this.eventListeners.set(key, { target, type, listener, options });
    }

    /**
     * Видалення event listener
     */
    _removeEventListener(key) {
        if (this.eventListeners.has(key)) {
            const { target, type, listener, options } = this.eventListeners.get(key);
            target.removeEventListener(type, listener, options);
            this.eventListeners.delete(key);
        }
    }

    /**
     * Отримання тексту
     */
    getText(key) {
        return this.contentManager.getText(key);
    }

    /**
     * Отримання звіту про продуктивність
     */
    getPerformanceReport() {
        return this.performanceMonitor.getPerformanceReport();
    }

    /**
     * Очищення ресурсів
     */
    destroy() {
        this.eventListeners.forEach((listener, key) => {
            this._removeEventListener(key);
        });
        
        this.mobileNavigationManager?.destroy();
        
        console.log('🧹 GGenius App destroyed');
    }
}

// Ініціалізація
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🚀 DOM Content Loaded, initializing GGenius...');
        setTimeout(() => {
            window.app = new GGeniusApp();
        }, 100);

        if (localStorage.getItem('ggenius-debug') === 'true') {
            document.documentElement.classList.add('debug-mode');
            console.log('🔧 Debug mode enabled');
        }
    });
} else {
    console.log('🚀 DOM already loaded, initializing GGenius...');
    window.app = new GGeniusApp();
}

// Глобальні утиліти для розробки
window.GGeniusDebug = {
    enableDebug() {
        localStorage.setItem('ggenius-debug', 'true');
        document.documentElement.classList.add('debug-mode');
        console.log('🔧 Debug mode enabled');
    },

    disableDebug() {
        localStorage.removeItem('ggenius-debug');
        document.documentElement.classList.remove('debug-mode');
        console.log('🔧 Debug mode disabled');
    },

    getContentStats() {
        return window.app?.contentManager?.getContentStats();
    },

    testContentKey(key) {
        return window.app?.contentManager?.getText(key);
    },

    getPerformanceReport() {
        return window.app?.getPerformanceReport();
    },

    toggleMobileMenu() {
        window.app?.mobileNavigationManager?.toggleMobileMenu();
    },

    forceReload() {
        location.reload();
    }
};

// Експорт для модулів
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        GGeniusApp, 
        ContentManager, 
        MobileNavigationManager, 
        SmoothScrollManager,
        PerformanceMonitor 
    };
}