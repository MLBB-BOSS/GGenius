/**
 * GGenius Enhanced Interactive Experience with Content Management
 * Performance-optimized ES2023+ JavaScript for cyberpunk AI platform
 * @version 2.7.0 // ВИПРАВЛЕНО: Loading screen та ContentManager
 * @author GGenius Team
 */

/**
 * Content Management System - Enhanced для роботи з існуючими lang файлами
 */
class ContentManager {
    constructor() {
        this.content = new Map();
        this.currentLanguage = 'uk';
        this.fallbackLanguage = 'en';
        this.isLoaded = false;
        this.loadingPromise = null;
        this.retryCount = 0;
        this.maxRetries = 2; // Зменшено для швидшого fallback
        
        // Розширений статичний контент з наявного uk.json
        this.staticContent = {
            'uk': {
                // Навігація
                'header.logo': 'GGenius',
                'nav.about': 'Про проєкт',
                'nav.roadmap': 'Roadmap',
                'nav.home': 'Головна',
                'nav.features': 'Функції',
                'nav.contact': 'Контакти',
                
                // Головна секція
                'hero.status': 'В РОЗРОБЦІ',
                'hero.title': 'GGenius AI',
                'hero.subtitle': 'Революція штучного інтелекту в Mobile Legends',
                'hero.description.intro': 'Вітаємо у майбутньому кіберспорту! GGenius - це передова платформа штучного інтелекту, створена спеціально для Mobile Legends: Bang Bang.',
                'hero.description.mission': '🚀 GGenius — твій успіх — наша місія!',
                'hero.cta.primary': 'Спробувати демо',
                'hero.cta.secondary': 'Дізнатися більше',
                'hero.cta.join': 'Приєднатися до спільноти',
                
                // Функції
                'features.title': 'МОЖЛИВОСТІ AI',
                'features.subtitle': 'Передові технології для вашого успіху',
                'features.categories.analysis': 'Аналіз',
                'features.categories.coaching': 'Навчання', 
                'features.categories.prediction': 'Прогнози',
                
                // Roadmap
                'roadmap.title': 'Roadmap',
                'roadmap.q1.2025.date': 'Q1 2025',
                'roadmap.q1.2025.title': 'MVP Launch',
                'roadmap.q1.2025.desc': 'Базова аналітика матчів, реєстрація користувачів.',
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
                
                // Footer
                'footer.tagline': 'Революція в кіберспорті з AI',
                'footer.copyright': 'GGenius. Всі права захищено.',
                
                // Мета
                'meta.title': 'GGenius - AI Революція в Mobile Legends',
                'meta.description': 'Штучний інтелект для аналізу та покращення гри в Mobile Legends: Bang Bang'
            }
        };
    }

    /**
     * Ініціалізація системи контенту з ШВИДКИМ fallback
     */
    async init() {
        if (this.loadingPromise) {
            return this.loadingPromise;
        }

        this.loadingPromise = this.loadContentWithTimeout();
        return this.loadingPromise;
    }

    /**
     * Завантаження контенту з timeout для швидкого fallback
     */
    async loadContentWithTimeout() {
        try {
            console.log('🔄 Loading content with fast fallback...');
            
            // Спочатку використовуємо статичний контент
            this.useStaticContent();
            
            // Намагаємося завантажити з існуючого lang файлу з timeout
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Content loading timeout')), 3000); // 3 секунди timeout
            });
            
            try {
                await Promise.race([
                    this.loadFromExistingLangFiles(),
                    timeoutPromise
                ]);
            } catch (error) {
                console.warn('⚠️ Lang files loading failed or timed out, using static:', error.message);
                // Продовжуємо зі статичним контентом
            }
            
            this.isLoaded = true;
            this.retryCount = 0;
            console.log('✅ Content loaded successfully');
            
            this.applyContentToPage();
            return true;
            
        } catch (error) {
            console.warn('⚠️ Content loading failed, using static:', error);
            this.useStaticContent();
            this.applyContentToPage();
            return false;
        }
    }

    /**
     * Завантаження з існуючих lang файлів БЕЗ кешування для простоти
     */
    async loadFromExistingLangFiles() {
        try {
            const response = await fetch(`/static/lang/${this.currentLanguage}.json`, {
                cache: 'no-cache',
                signal: AbortSignal.timeout ? AbortSignal.timeout(2000) : undefined // 2 секунди timeout для fetch
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const langData = await response.json();
            
            // Конвертуємо структуру
            const convertedData = this.convertLangFileToContentStructure(langData);
            
            // Об'єднуємо з існуючим статичним контентом
            const mergedContent = { 
                ...this.staticContent[this.currentLanguage] || this.staticContent.uk, 
                ...convertedData 
            };
            
            this.content.set(this.currentLanguage, mergedContent);
            
            console.log('✅ Successfully loaded content from lang/' + this.currentLanguage + '.json');
        } catch (error) {
            console.warn('Failed to load from lang files:', error);
            throw error;
        }
    }

    /**
     * Конвертація структури з uk.json в нашу систему (спрощена версія)
     */
    convertLangFileToContentStructure(langData) {
        const converted = {};
        
        // Базовий маппінг з uk.json
        const mappings = {
            'navAbout': 'nav.about',
            'navRoadmap': 'nav.roadmap',
            'navHome': 'nav.home',
            'projectIntroTitle': 'hero.title',
            'projectIntroSubtitle': 'hero.subtitle',
            'footerTagline': 'footer.tagline',
            'footerCopyright': 'footer.copyright'
        };
        
        // Конвертуємо кожен елемент
        for (const [oldKey, newKey] of Object.entries(mappings)) {
            if (langData[oldKey]) {
                let value = langData[oldKey];
                if (typeof value === 'string') {
                    // Простий cleanup HTML тегів
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
     * Застосування контенту до сторінки з кращою обробкою помилок
     */
    applyContentToPage() {
        const currentContent = this.getCurrentContent();
        let appliedCount = 0;
        
        try {
            // Оновлюємо всі елементи з data-content
            document.querySelectorAll('[data-content]').forEach(element => {
                const contentKey = element.getAttribute('data-content');
                const content = this.getContentByKey(contentKey, currentContent);
                
                if (content) {
                    this.setElementContent(element, content);
                    appliedCount++;
                } else {
                    // Показуємо fallback текст
                    const fallback = element.querySelector('.fallback-text');
                    if (fallback) {
                        fallback.style.display = 'inline';
                    }
                    console.debug(`Content not found for key: ${contentKey}`);
                }
            });

            // Оновлюємо title сторінки
            if (currentContent['meta.title']) {
                document.title = currentContent['meta.title'];
            }

            // Диспетчер події
            document.dispatchEvent(new CustomEvent('content:loaded', {
                detail: { 
                    language: this.currentLanguage,
                    source: 'content-manager',
                    keysLoaded: Object.keys(currentContent).length,
                    elementsUpdated: appliedCount
                }
            }));

            console.log(`📝 Content applied: ${appliedCount} elements updated`);
        } catch (error) {
            console.error('❌ Error applying content to page:', error);
            // Показуємо всі fallback тексти
            document.querySelectorAll('.fallback-text').forEach(fallback => {
                fallback.style.display = 'inline';
            });
        }
    }

    /**
     * Встановлення контенту для елемента
     */
    setElementContent(element, content) {
        const contentType = element.getAttribute('data-content-type') || 'auto';
        
        try {
            switch (contentType) {
                case 'html':
                    element.innerHTML = content;
                    break;
                case 'text':
                    element.textContent = content;
                    break;
                case 'auto':
                default:
                    element.textContent = content;
            }

            // Приховуємо fallback текст
            const fallback = element.querySelector('.fallback-text');
            if (fallback) {
                fallback.style.display = 'none';
            }
        } catch (error) {
            console.error('Error setting element content:', error);
            // Показуємо fallback
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
        // Прямий пошук
        if (content[key]) {
            return content[key];
        }
        
        // Альтернативні ключі
        const alternatives = {
            'features.title': 'Функції',
            'nav.home': 'Головна',
            'nav.about': 'Про проєкт',
            'nav.roadmap': 'Roadmap'
        };
        
        return alternatives[key] || null;
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
    getText(key, variables = {}) {
        if (!this.isLoaded) {
            return this.staticContent.uk[key] || key;
        }

        const content = this.getCurrentContent();
        let text = this.getContentByKey(key, content) || key;
        
        return text;
    }

    /**
     * Зміна мови
     */
    async setLanguage(language) {
        const oldLanguage = this.currentLanguage;
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
 * Головний клас додатка GGenius з ВИПРАВЛЕНИМ завантаженням
 */
class GGeniusApp {
    constructor() {
        this.isLoaded = false;
        this.observers = new Map();
        this.animations = new Map();
        this.eventListeners = new Map();
        
        // DOM елементи
        this.mobileMenuToggle = null;
        this.navMenu = null;
        this.isMenuOpen = false;
        this.loadingScreen = null;
        this.progressBar = null;
        this.loadingTextElement = null;
        
        // Ініціалізуємо менеджер контенту
        this.contentManager = new ContentManager();

        this.settings = {
            soundsEnabled: JSON.parse(localStorage.getItem('ggenius-soundsEnabled')) ?? false, // Вимкнено за замовчуванням
            musicEnabled: JSON.parse(localStorage.getItem('ggenius-musicEnabled')) ?? false,
            language: localStorage.getItem('ggenius-language') || 'uk',
            reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        };

        // Performance метрики
        this.performance = {
            startTime: performance.now(),
            metrics: {},
            isLowPerformance: this.detectLowPerformance()
        };

        // Throttled та debounced функції
        this.handleScroll = this.throttle(this._handleScroll.bind(this), 16);
        this.handleResize = this.debounce(this._handleResize.bind(this), 200);

        // Швидка ініціалізація
        this.init();
    }

    /**
     * ВИПРАВЛЕНА ініціалізація з кращою обробкою помилок та швидким fallback
     */
    async init() {
        try {
            console.log('🚀 Initializing GGenius App...');
            
            // Швидке налаштування DOM
            this.setupDOMReferences();
            
            // Ініціалізуємо контент менеджер з timeout
            const initTimeout = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Initialization timeout')), 5000); // 5 секунд для повної ініціалізації
            });
            
            try {
                await Promise.race([
                    this.contentManager.init(),
                    initTimeout
                ]);
            } catch (error) {
                console.warn('⚠️ Content manager init failed or timed out:', error.message);
                // Продовжуємо з базовою функціональністю
                this.contentManager.useStaticContent();
                this.contentManager.applyContentToPage();
            }
            
            // Основні компоненти
            this.setupNavigation();
            this.setupEventListeners();
            
            // Приховуємо loading screen ЗАВЖДИ після ініціалізації
            this.hideLoadingScreen();
            
            this.isLoaded = true;
            
            console.log('✅ GGenius App initialized successfully');
            
            // Диспетчер події готовності
            document.dispatchEvent(new CustomEvent('ggenius:ready', {
                detail: {
                    version: '2.7.0',
                    performance: this.performance.isLowPerformance ? 'low' : 'normal',
                    language: this.settings.language
                }
            }));
            
        } catch (error) {
            console.error('❌ Failed to initialize GGenius App:', error);
            // ОБОВ'ЯЗКОВО приховуємо loading screen навіть при помилці
            this.hideLoadingScreen();
            this.fallbackMode(error);
        }
    }

    /**
     * Налаштування посилань на DOM елементи
     */
    setupDOMReferences() {
        // Loading screen elements
        this.loadingScreen = document.getElementById('loadingScreen');
        this.progressBar = document.getElementById('progressBar');
        this.loadingTextElement = document.getElementById('loadingText');
        
        // Navigation elements
        this.mobileMenuToggle = document.getElementById('mobileMenuToggle');
        this.navMenu = document.getElementById('main-menu-list');
        
        // Додаткові елементи
        this.header = document.querySelector('.site-header');
        
        console.log('📋 DOM references established:', {
            loadingScreen: !!this.loadingScreen,
            mobileMenuToggle: !!this.mobileMenuToggle,
            navMenu: !!this.navMenu
        });
    }

    /**
     * ВИПРАВЛЕНЕ приховування loading screen
     */
    hideLoadingScreen() {
        if (!this.loadingScreen) {
            console.log('ℹ️ Loading screen not found, skipping hide');
            return;
        }

        try {
            this.loadingScreen.classList.add('hidden');
            this.loadingScreen.setAttribute('aria-hidden', 'true');
            
            // Видаляємо через короткий час
            setTimeout(() => {
                if (this.loadingScreen && this.loadingScreen.parentNode) {
                    this.loadingScreen.remove();
                    console.log('✅ Loading screen removed');
                }
            }, 300);
        } catch (error) {
            console.error('❌ Error hiding loading screen:', error);
            // Форсуємо видалення
            if (this.loadingScreen && this.loadingScreen.parentNode) {
                this.loadingScreen.style.display = 'none';
            }
        }
    }

    /**
     * Налаштування навігації з ВИПРАВЛЕННЯМ мобільного меню
     */
    setupNavigation() {
        console.log('🔧 Setting up navigation...');
        
        if (this.mobileMenuToggle && this.navMenu) {
            this._removeEventListener('mobileToggle');
            
            this._addEventListener(
                this.mobileMenuToggle,
                'click',
                (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    this.toggleMobileMenu();
                },
                'mobileToggle'
            );

            // Закриття меню при кліку на посилання
            const navLinks = this.navMenu.querySelectorAll('.nav-link');
            navLinks.forEach((link, index) => {
                this._addEventListener(
                    link,
                    'click',
                    () => {
                        this.closeMobileMenu();
                    },
                    `navLink-${index}`
                );
            });

            // Закриття меню при кліку поза ним
            this._addEventListener(
                document,
                'click',
                (event) => {
                    if (this.isMenuOpen && 
                        !this.navMenu.contains(event.target) && 
                        !this.mobileMenuToggle.contains(event.target)) {
                        this.closeMobileMenu();
                    }
                },
                'documentClick'
            );

            this.resetMobileMenuState();
            console.log('✅ Mobile menu setup completed');
        } else {
            console.warn('⚠️ Mobile menu elements not found:', {
                toggle: !!this.mobileMenuToggle,
                menu: !!this.navMenu
            });
        }
    }

    /**
     * Скидання стану мобільного меню
     */
    resetMobileMenuState() {
        if (!this.mobileMenuToggle || !this.navMenu) return;

        this.isMenuOpen = false;
        this.mobileMenuToggle.setAttribute('aria-expanded', 'false');
        this.navMenu.classList.remove('active', 'open'); // Видаляємо обидва класи
        document.body.classList.remove('menu-open');
        document.body.style.overflow = '';
    }

    /**
     * Перемикання мобільного меню з ПРАВИЛЬНИМИ класами
     */
    toggleMobileMenu(forceState = null) {
        if (!this.mobileMenuToggle || !this.navMenu) {
            console.error('❌ Cannot toggle menu: elements not found');
            return;
        }

        const shouldBeOpen = forceState !== null ? forceState : !this.isMenuOpen;
        this.isMenuOpen = shouldBeOpen;

        this.mobileMenuToggle.setAttribute('aria-expanded', String(shouldBeOpen));
        this.mobileMenuToggle.classList.toggle('active', shouldBeOpen);
        this.navMenu.classList.toggle('active', shouldBeOpen); // Використовуємо 'active' відповідно до CSS
        document.body.classList.toggle('menu-open', shouldBeOpen);
        document.body.style.overflow = shouldBeOpen ? 'hidden' : '';

        if (shouldBeOpen) {
            const firstLink = this.navMenu.querySelector('.nav-link');
            if (firstLink) {
                setTimeout(() => firstLink.focus(), 100);
            }
        } else {
            this.mobileMenuToggle.focus();
        }

        console.log(`📱 Mobile menu ${shouldBeOpen ? 'opened' : 'closed'}`);
    }

    /**
     * Закриття мобільного меню
     */
    closeMobileMenu() {
        this.toggleMobileMenu(false);
    }

    /**
     * Налаштування event listeners
     */
    setupEventListeners() {
        // Прокрутка
        this._addEventListener(window, 'scroll', this.handleScroll, 'scroll');
        
        // Зміна розміру вікна
        this._addEventListener(window, 'resize', this.handleResize, 'resize');
        
        // Зміна видимості сторінки
        this._addEventListener(document, 'visibilitychange', this.handleVisibilityChange.bind(this), 'visibility');
        
        console.log('📡 Event listeners setup completed');
    }

    /**
     * Обробка прокрутки
     */
    _handleScroll() {
        // Оновлення стану header
        if (this.header) {
            this.header.classList.toggle('scrolled', window.scrollY > 50);
        }
    }

    /**
     * Обробка зміни розміру вікна
     */
    _handleResize() {
        // Закриваємо меню при переході в desktop режим
        if (window.innerWidth > 768 && this.isMenuOpen) {
            this.closeMobileMenu();
        }
    }

    /**
     * Обробка зміни видимості сторінки
     */
    handleVisibilityChange() {
        if (document.hidden && this.isMenuOpen) {
            this.closeMobileMenu();
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
     * ПОКРАЩЕНИЙ fallback режим
     */
    fallbackMode(error) {
        console.log('🔧 Entering fallback mode...');
        
        // Завжди приховуємо loading screen
        this.hideLoadingScreen();
        
        document.documentElement.classList.add('fallback-mode');

        // Показуємо всі fallback тексти
        document.querySelectorAll('.fallback-text').forEach(element => {
            element.style.display = 'inline';
        });

        // Базова навігація
        if (this.mobileMenuToggle && this.navMenu) {
            this.mobileMenuToggle.addEventListener('click', () => {
                this.navMenu.classList.toggle('active');
                this.isMenuOpen = !this.isMenuOpen;
                this.mobileMenuToggle.classList.toggle('active', this.isMenuOpen);
            });
        }

        // Показуємо повідомлення про помилку тільки в режимі розробки
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
     * Throttle utility
     */
    throttle(func, delay) {
        let lastCall = 0;
        return (...args) => {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                func(...args);
            }
        };
    }

    /**
     * Debounce utility
     */
    debounce(func, delay) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    }

    /**
     * Додавання event listener з трекінгом
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
     * Отримання тексту з content manager
     */
    getText(key, variables = {}) {
        return this.contentManager.getText(key, variables);
    }

    /**
     * Очищення ресурсів
     */
    destroy() {
        // Видаляємо всі event listeners
        this.eventListeners.forEach((listener, key) => {
            this._removeEventListener(key);
        });
        
        // Зупиняємо observers
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        
        console.log('🧹 GGenius App destroyed');
    }
}

// Додаємо стилі для loading screen
const loadingStyles = document.createElement('style');
loadingStyles.textContent = `
    .loading-screen {
        position: fixed;
        inset: 0;
        background: linear-gradient(145deg, var(--bg-1, #0a0c0f) 0%, #0d1014 50%, #080a0c 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        transition: opacity 0.5s ease, visibility 0.5s ease;
    }
    
    .loading-screen.hidden {
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
    }
    
    .loading-content {
        text-align: center;
        color: var(--text-1, #ffffff);
        max-width: 400px;
        padding: 2rem;
    }
    
    .loading-logo {
        font-family: var(--f1, system-ui);
        font-size: 3rem;
        font-weight: 900;
        background: linear-gradient(135deg, var(--cyan, #00d4ff), var(--purple, #a55eea));
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 2rem;
        animation: logoGlow 2s ease-in-out infinite alternate;
    }
    
    @keyframes logoGlow {
        0% { filter: brightness(1) drop-shadow(0 0 10px rgba(0, 212, 255, 0.3)); }
        100% { filter: brightness(1.2) drop-shadow(0 0 20px rgba(0, 212, 255, 0.6)); }
    }
    
    .loading-bar {
        width: 100%;
        height: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
        overflow: hidden;
        margin-bottom: 1rem;
    }
    
    .loading-progress {
        height: 100%;
        background: linear-gradient(90deg, var(--cyan, #00d4ff), var(--purple, #a55eea));
        border-radius: 2px;
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.3s ease;
        animation: progressGlow 1.5s ease-in-out infinite;
    }
    
    @keyframes progressGlow {
        0%, 100% { box-shadow: 0 0 10px rgba(0, 212, 255, 0.5); }
        50% { box-shadow: 0 0 20px rgba(0, 212, 255, 0.8); }
    }
    
    .loading-text {
        font-size: 1rem;
        color: var(--text-2, #b0c4de);
        margin: 0;
        animation: textFade 2s ease-in-out infinite;
    }
    
    @keyframes textFade {
        0%, 100% { opacity: 0.7; }
        50% { opacity: 1; }
    }
    
    /* Fallback mode styles */
    .fallback-mode .fallback-text {
        display: inline !important;
    }
    
    .fallback-mode [data-content] {
        opacity: 1;
    }
`;

document.head.appendChild(loadingStyles);

// ВИПРАВЛЕНА ініціалізація з кращим таймінгом
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🚀 DOM Content Loaded, initializing GGenius...');
        
        // Невелика затримка для забезпечення завантаження всіх ресурсів
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
    
    hideLoadingScreen() {
        if (window.app) {
            window.app.hideLoadingScreen();
        }
    },
    
    toggleMobileMenu() {
        if (window.app) {
            window.app.toggleMobileMenu();
        }
    },
    
    getContentStats() {
        return window.app?.contentManager?.getContentStats();
    },
    
    testContentKey(key) {
        return window.app?.contentManager?.getText(key);
    },
    
    forceReload() {
        location.reload();
    }
};

// Експорт для використання в інших модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GGeniusApp, ContentManager };
}