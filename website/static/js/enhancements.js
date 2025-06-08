/**
 * GGenius Enhanced Interactive Experience with Content Management
 * Performance-optimized ES2023+ JavaScript for cyberpunk AI platform
 * @version 2.6.0 // Fixed navigation and enhanced performance
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
        this.maxRetries = 3;
        
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
     * Ініціалізація системи контенту з підтримкою існуючих lang файлів
     */
    async init() {
        if (this.loadingPromise) {
            return this.loadingPromise;
        }

        this.loadingPromise = this.loadContent();
        return this.loadingPromise;
    }

    /**
     * Завантаження контенту з існуючих lang файлів з retry логікою
     */
    async loadContent() {
        try {
            console.log('🔄 Loading content from existing lang files...');
            
            // Спочатку використовуємо статичний контент
            this.useStaticContent();
            
            // Потім намагаємося завантажити з існуючого lang файлу
            await this.loadFromExistingLangFiles();
            
            this.isLoaded = true;
            this.retryCount = 0;
            console.log('✅ Content loaded successfully from lang files');
            
            this.applyContentToPage();
            return true;
            
        } catch (error) {
            console.warn('⚠️ Lang files loading failed:', error);
            
            if (this.retryCount < this.maxRetries) {
                this.retryCount++;
                console.log(`🔄 Retrying... (${this.retryCount}/${this.maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, 1000 * this.retryCount));
                return this.loadContent();
            }
            
            console.warn('⚠️ Max retries reached, using static content');
            this.useStaticContent();
            this.applyContentToPage();
            return false;
        }
    }

    /**
     * Завантаження з існуючих lang файлів з кешуванням
     */
    async loadFromExistingLangFiles() {
        try {
            // Перевіряємо кеш
            const cacheKey = `ggenius-lang-${this.currentLanguage}`;
            const cachedData = this.getCachedContent(cacheKey);
            
            if (cachedData && this.isCacheValid(cachedData.timestamp)) {
                console.log('📁 Using cached content');
                this.content.set(this.currentLanguage, cachedData.content);
                return;
            }

            const response = await fetch(`/static/lang/${this.currentLanguage}.json`, {
                cache: 'no-cache',
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const langData = await response.json();
            
            // Конвертуємо структуру з uk.json в нашу систему
            const convertedData = this.convertLangFileToContentStructure(langData);
            
            // Об'єднуємо з існуючим статичним контентом
            const mergedContent = { 
                ...this.staticContent[this.currentLanguage] || this.staticContent.uk, 
                ...convertedData 
            };
            
            this.content.set(this.currentLanguage, mergedContent);
            
            // Кешуємо результат
            this.setCachedContent(cacheKey, mergedContent);
            
            console.log('✅ Successfully loaded content from lang/' + this.currentLanguage + '.json');
        } catch (error) {
            console.warn('Failed to load from lang files:', error);
            throw error;
        }
    }

    /**
     * Кешування контенту в localStorage
     */
    setCachedContent(key, content) {
        try {
            const cacheData = {
                content,
                timestamp: Date.now(),
                version: '2.6.0'
            };
            localStorage.setItem(key, JSON.stringify(cacheData));
        } catch (error) {
            console.warn('Failed to cache content:', error);
        }
    }

    /**
     * Отримання кешованого контенту
     */
    getCachedContent(key) {
        try {
            const cached = localStorage.getItem(key);
            return cached ? JSON.parse(cached) : null;
        } catch (error) {
            console.warn('Failed to get cached content:', error);
            return null;
        }
    }

    /**
     * Перевірка валідності кешу (1 година)
     */
    isCacheValid(timestamp) {
        const cacheTimeout = 60 * 60 * 1000; // 1 година
        return Date.now() - timestamp < cacheTimeout;
    }

    /**
     * Конвертація структури з uk.json в нашу систему
     */
    convertLangFileToContentStructure(langData) {
        const converted = {};
        
        // Прямий маппінг з uk.json
        const mappings = {
            // Навігація
            'navAbout': 'nav.about',
            'navRoadmap': 'nav.roadmap',
            'navHome': 'nav.home',
            'navFeatures': 'nav.features',
            'navContact': 'nav.contact',
            
            // Головна секція
            'revolutionaryProjectBadge': 'hero.status',
            'projectIntroTitle': 'hero.title',
            'projectIntroSubtitle': 'hero.subtitle',
            'projectIntroParagraph1': 'hero.description.intro',
            'projectIntroParagraph2': 'hero.description.mission',
            'projectCTAJoinCommunity': 'hero.cta.join',
            'projectCTAPrimary': 'hero.cta.primary',
            'projectCTASecondary': 'hero.cta.secondary',
            
            // Функції
            'featuresTitle': 'features.title',
            'featuresSubtitle': 'features.subtitle',
            
            // Roadmap
            'roadmapMainTitle': 'roadmap.title',
            'roadmapQ12025Date': 'roadmap.q1.2025.date',
            'roadmapQ12025Title': 'roadmap.q1.2025.title',
            'roadmapQ12025Desc': 'roadmap.q1.2025.desc',
            'roadmapQ12025Feature1': 'roadmap.q1.2025.feature1',
            'roadmapQ12025Feature2': 'roadmap.q1.2025.feature2',
            'roadmapQ12025Feature3': 'roadmap.q1.2025.feature3',
            
            'roadmapQ22025Date': 'roadmap.q2.2025.date',
            'roadmapQ22025Title': 'roadmap.q2.2025.title',
            'roadmapQ22025Desc': 'roadmap.q2.2025.desc',
            'roadmapQ22025Feature1': 'roadmap.q2.2025.feature1',
            'roadmapQ22025Feature2': 'roadmap.q2.2025.feature2',
            'roadmapQ22025Feature3': 'roadmap.q2.2025.feature3',
            
            'roadmapQ32025Date': 'roadmap.q3.2025.date',
            'roadmapQ32025Title': 'roadmap.q3.2025.title',
            'roadmapQ32025Desc': 'roadmap.q3.2025.desc',
            'roadmapQ32025Feature1': 'roadmap.q3.2025.feature1',
            'roadmapQ32025Feature2': 'roadmap.q3.2025.feature2',
            'roadmapQ32025Feature3': 'roadmap.q3.2025.feature3',
            
            'roadmapQ42025Date': 'roadmap.q4.2025.date',
            'roadmapQ42025Title': 'roadmap.q4.2025.title',
            'roadmapQ42025Desc': 'roadmap.q4.2025.desc',
            'roadmapQ42025Feature1': 'roadmap.q4.2025.feature1',
            'roadmapQ42025Feature2': 'roadmap.q4.2025.feature2',
            'roadmapQ42025Feature3': 'roadmap.q4.2025.feature3',
            
            'roadmapQ12026Date': 'roadmap.q1.2026.date',
            'roadmapQ12026Title': 'roadmap.q1.2026.title',
            'roadmapQ12026Desc': 'roadmap.q1.2026.desc',
            'roadmapQ12026Feature1': 'roadmap.q1.2026.feature1',
            'roadmapQ12026Feature2': 'roadmap.q1.2026.feature2',
            'roadmapQ12026Feature3': 'roadmap.q1.2026.feature3',
            
            // Footer
            'footerTagline': 'footer.tagline',
            'footerCopyright': 'footer.copyright'
        };
        
        // Конвертуємо кожен елемент
        for (const [oldKey, newKey] of Object.entries(mappings)) {
            if (langData[oldKey]) {
                let value = langData[oldKey];
                if (typeof value === 'string') {
                    value = this.cleanHtmlTags(value);
                }
                converted[newKey] = value;
            }
        }
        
        return converted;
    }

    /**
     * Очищення HTML тегів для простих текстів
     */
    cleanHtmlTags(text) {
        if (typeof text !== 'string') return text;
        
        // Зберігаємо деякі важливі теги
        const preservedTags = [
            '<strong>', '</strong>', 
            '<em>', '</em>', 
            '<span class="gradient-text">', '</span>',
            '<br>', '<br/>', '<br />'
        ];
        let cleaned = text;
        
        // Замінюємо збережені теги на placeholder
        const placeholders = {};
        preservedTags.forEach((tag, index) => {
            const placeholder = `__PRESERVE_${index}__`;
            placeholders[placeholder] = tag;
            cleaned = cleaned.replace(new RegExp(tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), placeholder);
        });
        
        // Видаляємо інші HTML теги
        cleaned = cleaned.replace(/<[^>]*>/g, '');
        
        // Повертаємо збережені теги
        for (const [placeholder, originalTag] of Object.entries(placeholders)) {
            cleaned = cleaned.replace(new RegExp(placeholder, 'g'), originalTag);
        }
        
        return cleaned.trim();
    }

    /**
     * Використання статичного контенту
     */
    useStaticContent() {
        this.content.set(this.currentLanguage, this.staticContent[this.currentLanguage] || this.staticContent.uk);
        this.isLoaded = true;
    }

    /**
     * Застосування контенту до сторінки з розширеною підтримкою
     */
    applyContentToPage() {
        const currentContent = this.getCurrentContent();
        let appliedCount = 0;
        
        // Оновлюємо всі елементи з data-content
        document.querySelectorAll('[data-content]').forEach(element => {
            const contentKey = element.getAttribute('data-content');
            const content = this.getContentByKey(contentKey, currentContent);
            
            if (content) {
                this.setElementContent(element, content);
                appliedCount++;
            } else {
                // Логування для відладки
                console.debug(`Content not found for key: ${contentKey}`);
                element.classList.add('content-error');
            }
        });

        // Оновлюємо title сторінки
        if (currentContent['meta.title']) {
            document.title = currentContent['meta.title'];
        }

        // Оновлюємо meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && currentContent['meta.description']) {
            metaDesc.content = currentContent['meta.description'];
        }

        // Диспетчер події
        document.dispatchEvent(new CustomEvent('content:loaded', {
            detail: { 
                language: this.currentLanguage,
                source: 'lang-files',
                keysLoaded: Object.keys(currentContent).length,
                elementsUpdated: appliedCount
            }
        }));

        console.log(`📝 Content applied: ${appliedCount} elements updated`);
    }

    /**
     * Встановлення контенту для елемента з HTML підтримкою
     */
    setElementContent(element, content) {
        const contentType = element.getAttribute('data-content-type') || 'auto';
        
        // Прибираємо loading стан
        element.classList.remove('content-loading', 'content-error');
        
        try {
            switch (contentType) {
                case 'html':
                    element.innerHTML = content;
                    break;
                case 'text':
                    element.textContent = content;
                    break;
                case 'placeholder':
                    element.placeholder = content;
                    break;
                case 'title':
                    element.title = content;
                    break;
                case 'aria-label':
                    element.setAttribute('aria-label', content);
                    break;
                case 'auto':
                default:
                    // Автоматичне визначення: якщо містить HTML теги, вставляємо як HTML
                    if (this.containsHtmlTags(content)) {
                        element.innerHTML = content;
                    } else {
                        element.textContent = content;
                    }
            }

            // Додаємо клас завантаженого контенту
            element.classList.add('content-loaded');
            
            // Приховуємо fallback текст
            const fallback = element.querySelector('.fallback-text');
            if (fallback) {
                fallback.style.display = 'none';
            }
        } catch (error) {
            console.error('Error setting element content:', error);
            element.classList.add('content-error');
        }
    }

    /**
     * Перевірка наявності HTML тегів
     */
    containsHtmlTags(text) {
        if (typeof text !== 'string') return false;
        return /<[^>]*>/g.test(text);
    }

    /**
     * Отримання контенту за ключем з fallback логікою
     */
    getContentByKey(key, content) {
        // Прямий пошук
        if (content[key]) {
            return content[key];
        }
        
        // Пошук з альтернативними ключами
        const alternativeKeys = this.getAlternativeKeys(key);
        for (const altKey of alternativeKeys) {
            if (content[altKey]) {
                return content[altKey];
            }
        }
        
        return null;
    }

    /**
     * Генерація альтернативних ключів для сумісності
     */
    getAlternativeKeys(key) {
        const alternatives = [];
        
        // Конвертація dot notation в camelCase для сумісності з uk.json
        const camelCase = key.replace(/\./g, '').replace(/([A-Z])/g, (match, p1, offset) => 
            offset > 0 ? p1.toLowerCase() : p1
        );
        alternatives.push(camelCase);
        
        // Пошук схожих ключів
        const keyMappings = {
            'hero.title': ['projectIntroTitle', 'heroTitle'],
            'hero.subtitle': ['projectIntroSubtitle', 'heroSubtitle'],
            'nav.about': ['navAbout'],
            'nav.roadmap': ['navRoadmap'],
            'nav.home': ['navHome'],
            'nav.features': ['navFeatures'],
            'nav.contact': ['navContact'],
            'footer.copyright': ['footerCopyright'],
            'footer.tagline': ['footerTagline'],
            'features.title': ['featuresTitle'],
            'features.subtitle': ['featuresSubtitle']
        };
        
        for (const [pattern, mappings] of Object.entries(keyMappings)) {
            if (key.includes(pattern) || key === pattern) {
                alternatives.push(...mappings);
            }
        }
        
        return alternatives;
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
     * Отримання тексту за ключем з розширеною логікою
     */
    getText(key, variables = {}) {
        if (!this.isLoaded) {
            return this.staticContent.uk[key] || key;
        }

        const content = this.getCurrentContent();
        let text = this.getContentByKey(key, content) || key;
        
        // Замінюємо змінні
        return this.interpolateVariables(text, variables);
    }

    /**
     * Інтерполяція змінних у тексті
     */
    interpolateVariables(text, variables) {
        if (typeof text !== 'string') return text;
        
        return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return variables[key] || match;
        });
    }

    /**
     * Зміна мови з підтримкою існуючих lang файлів
     */
    async setLanguage(language) {
        const oldLanguage = this.currentLanguage;
        this.currentLanguage = language;
        localStorage.setItem('ggenius-language', language);
        document.documentElement.lang = language;
        
        try {
            // Перезавантажуємо контент для нової мови
            await this.loadFromExistingLangFiles();
            this.applyContentToPage();
            
            // Повідомляємо про зміну мови
            document.dispatchEvent(new CustomEvent('language:changed', {
                detail: { 
                    from: oldLanguage, 
                    to: language,
                    success: true
                }
            }));
        } catch (error) {
            console.error('Failed to change language:', error);
            // Повертаємося до попередньої мови
            this.currentLanguage = oldLanguage;
            document.documentElement.lang = oldLanguage;
            
            document.dispatchEvent(new CustomEvent('language:changed', {
                detail: { 
                    from: oldLanguage, 
                    to: language,
                    success: false,
                    error: error.message
                }
            }));
        }
    }

    /**
     * Додавання нового контенту в runtime
     */
    addContent(key, value, language = this.currentLanguage) {
        if (!this.content.has(language)) {
            this.content.set(language, {});
        }
        
        const langContent = this.content.get(language);
        langContent[key] = value;
        
        // Оновлюємо відповідні елементи на сторінці
        document.querySelectorAll(`[data-content="${key}"]`).forEach(element => {
            this.setElementContent(element, value);
        });
    }

    /**
     * Отримання статистики завантаженого контенту
     */
    getContentStats() {
        const currentContent = this.getCurrentContent();
        return {
            language: this.currentLanguage,
            fallbackLanguage: this.fallbackLanguage,
            totalKeys: Object.keys(currentContent).length,
            loadedFromLangFiles: this.isLoaded,
            availableLanguages: Array.from(this.content.keys()),
            retryCount: this.retryCount,
            hasCache: !!this.getCachedContent(`ggenius-lang-${this.currentLanguage}`)
        };
    }

    /**
     * Очищення кешу
     */
    clearCache() {
        const languages = ['uk', 'en'];
        languages.forEach(lang => {
            localStorage.removeItem(`ggenius-lang-${lang}`);
        });
        console.log('🗑️ Content cache cleared');
    }
}

/**
 * Головний клас додатка GGenius з повною функціональністю
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
        
        // Ініціалізуємо менеджер контенту з підтримкою lang файлів
        this.contentManager = new ContentManager();

        this.settings = {
            soundsEnabled: JSON.parse(localStorage.getItem('ggenius-soundsEnabled')) ?? true,
            musicEnabled: JSON.parse(localStorage.getItem('ggenius-musicEnabled')) ?? false,
            soundVolume: parseFloat(localStorage.getItem('ggenius-soundVolume')) || 0.3,
            musicVolume: parseFloat(localStorage.getItem('ggenius-musicVolume')) || 0.1,
            language: localStorage.getItem('ggenius-language') || 'uk',
            reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            highContrast: window.matchMedia('(prefers-contrast: high)').matches
        };

        // Audio система
        this.audioContext = null;
        this.soundEffects = new Map();
        this.ambientOscillators = null;
        this.ambientGain = null;
        this.masterGain = null;

        // Performance метрики
        this.performance = {
            startTime: performance.now(),
            metrics: {},
            isLowPerformance: this.detectLowPerformance()
        };

        // Throttled та debounced функції
        this.handleScroll = this.throttle(this._handleScroll.bind(this), 16);
        this.handleResize = this.debounce(this._handleResize.bind(this), 200);

        this.init();
    }

    /**
     * Ініціалізація додатка
     */
    async init() {
        try {
            console.log('🚀 Initializing GGenius App...');
            
            // Ініціалізуємо контент менеджер
            await this.contentManager.init();
            
            // Встановлюємо мову
            await this.contentManager.setLanguage(this.settings.language);
            
            // Ініціалізуємо основні компоненти
            this.setupDOMReferences();
            this.setupNavigation();
            this.setupEventListeners();
            this.setupIntersectionObserver();
            this.setupAudio();
            this.setupPerformanceMonitoring();
            this.setupAccessibility();
            
            this.isLoaded = true;
            
            // Запускаємо анімації
            this.startInitialAnimations();
            
            console.log('✅ GGenius App initialized successfully');
            
            // Диспетчер події готовності
            document.dispatchEvent(new CustomEvent('ggenius:ready', {
                detail: {
                    version: '2.6.0',
                    performance: this.performance.isLowPerformance ? 'low' : 'normal',
                    language: this.settings.language
                }
            }));
            
        } catch (error) {
            console.error('❌ Failed to initialize GGenius App:', error);
            // Fallback ініціалізація
            this.setupBasicFunctionality();
        }
    }

    /**
     * Налаштування посилань на DOM елементи
     */
    setupDOMReferences() {
        this.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        
        // Додаткові елементи
        this.header = document.querySelector('header');
        this.heroSection = document.querySelector('.hero-section');
        this.loadingScreen = document.querySelector('.loading-screen');
        
        console.log('📋 DOM references established');
    }

    /**
     * Налаштування навігації з фіксом класів
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
                    (event) => {
                        this.closeMobileMenu();
                        this.handleNavLinkClick(event, link);
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

            // Закриття меню при натисканні Escape
            this._addEventListener(
                document,
                'keydown',
                (event) => {
                    if (event.key === 'Escape' && this.isMenuOpen) {
                        this.closeMobileMenu();
                    }
                },
                'escapeKey'
            );

            this.resetMobileMenuState();
            console.log('✅ Mobile menu setup completed');
        } else {
            console.error('❌ Mobile menu elements not found');
        }
    }

    /**
     * Скидання стану мобільного меню (ВИПРАВЛЕНО)
     */
    resetMobileMenuState() {
        if (!this.mobileMenuToggle || !this.navMenu) return;

        this.isMenuOpen = false;
        this.mobileMenuToggle.setAttribute('aria-expanded', 'false');
        this.navMenu.classList.remove('active'); // Використовуємо 'active' замість 'open'
        document.body.classList.remove('menu-open');
        document.body.style.overflow = '';
        
        // Прибираємо focus trap
        this.removeFocusTrap();
    }

    /**
     * Перемикання мобільного меню (ВИПРАВЛЕНО)
     */
    toggleMobileMenu(forceState = null) {
        if (!this.mobileMenuToggle || !this.navMenu) {
            console.error('❌ Cannot toggle menu: elements not found');
            return;
        }

        const shouldBeOpen = forceState !== null ? forceState : !this.isMenuOpen;
        this.isMenuOpen = shouldBeOpen;

        this.mobileMenuToggle.setAttribute('aria-expanded', String(shouldBeOpen));
        this.navMenu.classList.toggle('active', shouldBeOpen); // Використовуємо 'active'
        document.body.classList.toggle('menu-open', shouldBeOpen);
        document.body.style.overflow = shouldBeOpen ? 'hidden' : '';

        if (shouldBeOpen) {
            this.setupFocusTrap();
            this.playSound('menuOpen');
            
            // Фокус на першому посиланні
            const firstLink = this.navMenu.querySelector('.nav-link');
            if (firstLink) {
                setTimeout(() => firstLink.focus(), 100);
            }
        } else {
            this.removeFocusTrap();
            this.playSound('menuClose');
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
     * Відкриття мобільного меню
     */
    openMobileMenu() {
        this.toggleMobileMenu(true);
    }

    /**
     * Налаштування focus trap для меню
     */
    setupFocusTrap() {
        if (!this.navMenu) return;

        const focusableElements = this.navMenu.querySelectorAll(
            'a, button, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        this.focusTrapHandler = (event) => {
            if (event.key === 'Tab') {
                if (event.shiftKey) {
                    if (document.activeElement === firstElement) {
                        event.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        event.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        };

        document.addEventListener('keydown', this.focusTrapHandler);
    }

    /**
     * Видалення focus trap
     */
    removeFocusTrap() {
        if (this.focusTrapHandler) {
            document.removeEventListener('keydown', this.focusTrapHandler);
            this.focusTrapHandler = null;
        }
    }

    /**
     * Обробка кліку на навігаційне посилання
     */
    handleNavLinkClick(event, link) {
        const href = link.getAttribute('href');
        
        // Плавна прокрутка для якорних посилань
        if (href && href.startsWith('#')) {
            event.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                this.smoothScrollTo(targetElement);
                this.playSound('navigate');
            }
        }
        
        // Оновлення активного стану
        this.updateActiveNavLink(link);
    }

    /**
     * Оновлення активного навігаційного посилання
     */
    updateActiveNavLink(activeLink) {
        // Прибираємо активний клас з усіх посилань
        this.navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            link.setAttribute('aria-current', 'false');
        });
        
        // Додаємо активний клас до поточного посилання
        activeLink.classList.add('active');
        activeLink.setAttribute('aria-current', 'page');
    }

    /**
     * Плавна прокрутка до елемента
     */
    smoothScrollTo(element, offset = 80) {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
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
        
        // Зміна мови
        this._addEventListener(document, 'language:changed', this.handleLanguageChange.bind(this), 'languageChange');
        
        // Помилки контенту
        this._addEventListener(document, 'content:error', this.handleContentError.bind(this), 'contentError');
        
        console.log('📡 Event listeners setup completed');
    }

    /**
     * Обробка прокрутки
     */
    _handleScroll() {
        const scrollY = window.scrollY;
        
        // Оновлення стану header
        if (this.header) {
            this.header.classList.toggle('scrolled', scrollY > 50);
        }
        
        // Паралакс ефекти (тільки для потужних пристроїв)
        if (!this.performance.isLowPerformance && this.heroSection) {
            const parallaxElements = this.heroSection.querySelectorAll('[data-parallax]');
            parallaxElements.forEach(element => {
                const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
                const yPos = -(scrollY * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        }
        
        // Оновлення progress bar
        this.updateScrollProgress();
    }

    /**
     * Оновлення progress bar прокрутки
     */
    updateScrollProgress() {
        const progressBar = document.querySelector('.scroll-progress');
        if (!progressBar) return;
        
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = (window.scrollY / scrollHeight) * 100;
        
        progressBar.style.width = `${Math.min(scrollProgress, 100)}%`;
    }

    /**
     * Обробка зміни розміру вікна
     */
    _handleResize() {
        // Закриваємо меню при переході в desktop режим
        if (window.innerWidth > 768 && this.isMenuOpen) {
            this.closeMobileMenu();
        }
        
        // Оновлення метрик продуктивності
        this.performance.isLowPerformance = this.detectLowPerformance();
        
        console.log('📐 Window resized, menu closed if needed');
    }

    /**
     * Обробка зміни видимості сторінки
     */
    handleVisibilityChange() {
        if (document.hidden) {
            // Пауза анімацій та звуків при приховуванні
            this.pauseAllAnimations();
            this.stopAmbientSound();
        } else {
            // Відновлення при поверненні
            this.resumeAllAnimations();
            if (this.settings.musicEnabled) {
                this.startAmbientSound();
            }
        }
    }

    /**
     * Обробка зміни мови
     */
    handleLanguageChange(event) {
        const { success, error } = event.detail;
        
        if (success) {
            console.log('🌐 Language changed successfully');
            this.showNotification('Мову змінено успішно', 'success');
        } else {
            console.error('❌ Language change failed:', error);
            this.showNotification('Помилка зміни мови', 'error');
        }
    }

    /**
     * Обробка помилок контенту
     */
    handleContentError(event) {
        const { key, error } = event.detail;
        console.warn(`⚠️ Content error for key "${key}":`, error);
        
        // Можна додати фоллбек логіку тут
    }

    /**
     * Налаштування Intersection Observer
     */
    setupIntersectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -20% 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    this.playSound('reveal');
                } else {
                    entry.target.classList.remove('visible');
                }
            });
        }, observerOptions);

        // Спостереження за елементами з анімаціями
        document.querySelectorAll('.animate-on-scroll').forEach(element => {
            observer.observe(element);
        });

        this.observers.set('intersection', observer);
        console.log('👁️ Intersection Observer setup completed');
    }

    /**
     * Налаштування аудіо системи
     */
    setupAudio() {
        if (!this.settings.soundsEnabled && !this.settings.musicEnabled) {
            console.log('🔇 Audio disabled by user settings');
            return;
        }

        try {
            // Створюємо AudioContext при першій взаємодії користувача
            const initAudio = () => {
                if (!this.audioContext) {
                    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    this.setupAudioNodes();
                    console.log('🎵 Audio system initialized');
                }
                document.removeEventListener('click', initAudio);
                document.removeEventListener('touchstart', initAudio);
            };

            document.addEventListener('click', initAudio, { once: true });
            document.addEventListener('touchstart', initAudio, { once: true });
            
        } catch (error) {
            console.warn('⚠️ Audio system not available:', error);
        }
    }

    /**
     * Налаштування аудіо нодів
     */
    setupAudioNodes() {
        if (!this.audioContext) return;

        this.masterGain = this.audioContext.createGain();
        this.masterGain.connect(this.audioContext.destination);
        
        this.ambientGain = this.audioContext.createGain();
        this.ambientGain.connect(this.masterGain);
        this.ambientGain.gain.value = this.settings.musicVolume;
    }

    /**
     * Програвання звукового ефекту
     */
    playSound(soundName) {
        if (!this.settings.soundsEnabled || !this.audioContext) return;

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            // Налаштування звуку залежно від типу
            const soundConfig = this.getSoundConfig(soundName);
            oscillator.frequency.setValueAtTime(soundConfig.frequency, this.audioContext.currentTime);
            oscillator.type = soundConfig.type;
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.settings.soundVolume * soundConfig.volume, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + soundConfig.duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + soundConfig.duration);
            
        } catch (error) {
            console.warn('⚠️ Failed to play sound:', error);
        }
    }

    /**
     * Конфігурація звуків
     */
    getSoundConfig(soundName) {
        const configs = {
            menuOpen: { frequency: 800, type: 'sine', volume: 0.3, duration: 0.2 },
            menuClose: { frequency: 600, type: 'sine', volume: 0.2, duration: 0.15 },
            navigate: { frequency: 1000, type: 'triangle', volume: 0.2, duration: 0.1 },
            reveal: { frequency: 1200, type: 'sine', volume: 0.1, duration: 0.3 },
            error: { frequency: 300, type: 'sawtooth', volume: 0.4, duration: 0.5 },
            success: { frequency: 880, type: 'sine', volume: 0.3, duration: 0.3 }
        };
        
        return configs[soundName] || configs.navigate;
    }

    /**
     * Запуск фонової музики
     */
    startAmbientSound() {
        if (!this.settings.musicEnabled || !this.audioContext || this.ambientOscillators) return;

        try {
            this.ambientOscillators = [];
            
            // Створюємо кілька осциляторів для багатошарового звуку
            const frequencies = [220, 330, 440];
            
            frequencies.forEach((freq, index) => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.ambientGain);
                
                oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                oscillator.type = 'sine';
                gainNode.gain.setValueAtTime(0.05 / frequencies.length, this.audioContext.currentTime);
                
                oscillator.start();
                this.ambientOscillators.push({ oscillator, gainNode });
            });
            
            console.log('🎵 Ambient sound started');
        } catch (error) {
            console.warn('⚠️ Failed to start ambient sound:', error);
        }
    }

    /**
     * Зупинка фонової музики
     */
    stopAmbientSound() {
        if (!this.ambientOscillators) return;

        try {
            this.ambientOscillators.forEach(({ oscillator }) => {
                oscillator.stop();
            });
            this.ambientOscillators = null;
            console.log('🎵 Ambient sound stopped');
        } catch (error) {
            console.warn('⚠️ Failed to stop ambient sound:', error);
        }
    }

    /**
     * Налаштування моніторингу продуктивності
     */
    setupPerformanceMonitoring() {
        // Метрики загрузки
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            this.performance.metrics = {
                domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
                totalLoadTime: performance.now() - this.performance.startTime
            };
            
            console.log('📊 Performance metrics:', this.performance.metrics);
        });

        // Моніторинг FPS (тільки для debug режиму)
        if (localStorage.getItem('ggenius-debug') === 'true') {
            this.startFPSMonitoring();
        }
    }

    /**
     * Моніторинг FPS
     */
    startFPSMonitoring() {
        let fps = 0;
        let lastTime = performance.now();
        
        const measureFPS = (currentTime) => {
            fps++;
            if (currentTime >= lastTime + 1000) {
                console.log(`🎮 FPS: ${fps}`);
                fps = 0;
                lastTime = currentTime;
            }
            requestAnimationFrame(measureFPS);
        };
        
        requestAnimationFrame(measureFPS);
    }

    /**
     * Виявлення низької продуктивності
     */
    detectLowPerformance() {
        // Перевіряємо характеристики пристрою
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
        const hasLimitedMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        return isSlowConnection || hasLimitedMemory || (isMobile && window.innerWidth < 768);
    }

    /**
     * Налаштування доступності
     */
    setupAccessibility() {
        // Підтримка зменшення анімацій
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        this.settings.reducedMotion = prefersReducedMotion.matches;
        
        prefersReducedMotion.addEventListener('change', (e) => {
            this.settings.reducedMotion = e.matches;
            this.updateAnimationSettings();
        });

        // Підтримка високого контрасту
        const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');
        this.settings.highContrast = prefersHighContrast.matches;
        
        prefersHighContrast.addEventListener('change', (e) => {
            this.settings.highContrast = e.matches;
            document.documentElement.classList.toggle('high-contrast', e.matches);
        });

        // Налаштування skip links
        this.setupSkipLinks();
        
        console.log('♿ Accessibility features setup completed');
    }

    /**
     * Налаштування skip links
     */
    setupSkipLinks() {
        const skipLinks = document.querySelectorAll('.skip-link');
        skipLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.focus();
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    /**
     * Оновлення налаштувань анімацій
     */
    updateAnimationSettings() {
        const root = document.documentElement;
        
        if (this.settings.reducedMotion) {
            root.style.setProperty('--animation-duration', '0.01s');
            root.style.setProperty('--transition-duration', '0.01s');
        } else {
            root.style.removeProperty('--animation-duration');
            root.style.removeProperty('--transition-duration');
        }
    }

    /**
     * Запуск початкових анімацій
     */
    startInitialAnimations() {
        if (this.settings.reducedMotion) {
            console.log('🎭 Animations disabled due to user preference');
            return;
        }

        // Приховуємо loading screen
        if (this.loadingScreen) {
            setTimeout(() => {
                this.loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    this.loadingScreen.style.display = 'none';
                }, 500);
            }, 1000);
        }

        // Анімація появи основних елементів
        const animatedElements = document.querySelectorAll('.animate-on-load');
        animatedElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('visible');
            }, index * 100);
        });
    }

    /**
     * Пауза всіх анімацій
     */
    pauseAllAnimations() {
        document.documentElement.style.setProperty('--animation-play-state', 'paused');
    }

    /**
     * Відновлення всіх анімацій
     */
    resumeAllAnimations() {
        document.documentElement.style.removeProperty('--animation-play-state');
    }

    /**
     * Показ сповіщення
     */
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        
        document.body.appendChild(notification);
        
        // Анімація появи
        setTimeout(() => notification.classList.add('visible'), 10);
        
        // Автоматичне приховування
        setTimeout(() => {
            notification.classList.remove('visible');
            setTimeout(() => notification.remove(), 300);
        }, duration);
        
        this.playSound(type === 'error' ? 'error' : 'success');
    }

    /**
     * Базова функціональність як fallback
     */
    setupBasicFunctionality() {
        console.log('🔧 Setting up basic functionality...');
        
        // Мінімальна навігація
        this.setupDOMReferences();
        if (this.mobileMenuToggle && this.navMenu) {
            this.mobileMenuToggle.addEventListener('click', () => {
                this.navMenu.classList.toggle('active');
                this.isMenuOpen = !this.isMenuOpen;
            });
        }
        
        // Базовий content manager
        this.contentManager.useStaticContent();
        this.contentManager.applyContentToPage();
    }

    /**
     * Throttle функція
     */
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

    /**
     * Debounce функція
     */
    debounce(func, delay) {
        let timeoutId;
        
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    /**
     * Додавання event listener з трекінгом
     */
    _addEventListener(element, event, handler, key) {
        // Видаляємо попередній listener якщо існує
        this._removeEventListener(key);
        
        element.addEventListener(event, handler);
        this.eventListeners.set(key, { element, event, handler });
    }

    /**
     * Видалення event listener
     */
    _removeEventListener(key) {
        const listener = this.eventListeners.get(key);
        if (listener) {
            listener.element.removeEventListener(listener.event, listener.handler);
            this.eventListeners.delete(key);
        }
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
        
        // Зупиняємо аудіо
        this.stopAmbientSound();
        if (this.audioContext) {
            this.audioContext.close();
        }
        
        // Очищуємо кеш
        this.contentManager.clearCache();
        
        console.log('🧹 GGenius App destroyed');
    }

    /**
     * Оновлення налаштувань
     */
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        
        // Збереження в localStorage
        Object.keys(newSettings).forEach(key => {
            localStorage.setItem(`ggenius-${key}`, JSON.stringify(newSettings[key]));
        });
        
        // Застосування змін
        if ('language' in newSettings) {
            this.contentManager.setLanguage(newSettings.language);
        }
        
        if ('musicEnabled' in newSettings) {
            if (newSettings.musicEnabled) {
                this.startAmbientSound();
            } else {
                this.stopAmbientSound();
            }
        }
        
        console.log('⚙️ Settings updated:', newSettings);
    }

    /**
     * Отримання статистики додатка
     */
    getStats() {
        return {
            version: '2.6.0',
            isLoaded: this.isLoaded,
            performance: this.performance,
            settings: this.settings,
            content: this.contentManager.getContentStats(),
            activeListeners: this.eventListeners.size,
            activeObservers: this.observers.size
        };
    }
}

// Створюємо розширені стилі для покращеної анімації контенту
const enhancedStyle = document.createElement('style');
enhancedStyle.textContent = `
    /* Enhanced content loading animations */
    [data-content] {
        transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
    }
    
    [data-content].content-loading {
        opacity: 0.6;
        transform: translateY(5px);
    }
    
    [data-content].content-loaded {
        opacity: 1;
        transform: translateY(0);
    }
    
    /* Gradient text support */
    .gradient-text {
        background: linear-gradient(135deg, var(--cyan), var(--purple));
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        display: inline-block;
    }
    
    /* Language switcher enhancements */
    .language-switcher {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        margin-left: auto;
    }
    
    .language-switcher button {
        padding: 0.4rem 0.8rem;
        border-radius: 6px;
        font-weight: 600;
        font-size: 0.875rem;
        transition: all 0.2s ease;
        cursor: pointer;
        border: 1px solid var(--cyan);
        background: transparent;
        color: var(--cyan);
    }
    
    .language-switcher button.active,
    .language-switcher button:hover {
        background: var(--cyan);
        color: var(--bg-1);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(var(--cyan-rgb), 0.3);
    }
    
    /* Navigation menu active state fix */
    .nav-menu.active {
        opacity: 1;
        visibility: visible