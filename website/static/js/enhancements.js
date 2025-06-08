/**
 * GGenius Enhanced Interactive Experience - FIXED Loading Screen
 * @version 2.7.0 - Critical Loading Screen Fix
 * Fixes: Infinite loading, mobile blocking, auto-hide timeout
 */

/**
 * Content Manager for dynamic language support
 */
class ContentManager {
    constructor() {
        this.currentLanguage = 'uk';
        this.content = {};
        this.fallbackContent = {
            uk: {
                'meta.title': 'GGenius - AI Революція в Mobile Legends',
                'header.logo': 'GGenius',
                'nav.home': 'Головна',
                'nav.about': 'Про проєкт',
                'nav.roadmap': 'Roadmap',
                'hero.title': 'GGenius AI',
                'hero.subtitle': '<span class="gradient-text">Революція штучного інтелекту</span> в Mobile Legends',
                'hero.status': 'В РОЗРОБЦІ',
                'hero.description.intro': 'Вітаємо у майбутньому кіберспорту! GGenius - це передова платформа штучного інтелекту, створена спеціально для Mobile Legends: Bang Bang.',
                'hero.description.mission': '🚀 <strong>GGenius</strong> — твій успіх — наша місія!',
                'hero.cta.primary': 'Спробувати демо',
                'hero.cta.secondary': 'Дізнатися більше',
                'hero.cta.join': 'Приєднатися до спільноти',
                'features.title': 'МОЖЛИВОСТІ AI',
                'features.subtitle': 'Передові технології для вашого успіху',
                'features.categories.analysis': 'Аналіз',
                'features.categories.coaching': 'Навчання',
                'features.categories.prediction': 'Прогнози',
                'roadmap.title': 'Roadmap',
                'roadmap.q1.2025.date': 'Q1 2025',
                'roadmap.q1.2025.title': 'MVP Launch',
                'roadmap.q1.2025.desc': 'Базова аналітика матчів, реєстрація користувачів.',
                'roadmap.q1.2025.feature1': 'Match Analytics Engine',
                'roadmap.q1.2025.feature2': 'User Registration System',
                'roadmap.q1.2025.feature3': 'Basic Statistics Dashboard',
                'roadmap.q2.2025.date': 'Q2 2025',
                'roadmap.q2.2025.title': 'AI Integration',
                'roadmap.q2.2025.desc': 'Запуск нейронної аналітики та AI-тренера.',
                'roadmap.q2.2025.feature1': 'Neural Network Analysis',
                'roadmap.q2.2025.feature2': 'AI Personal Trainer',
                'roadmap.q2.2025.feature3': 'Computer Vision Integration',
                'footer.tagline': 'Революція в кіберспорті з AI',
                'footer.copyright': '© 2025 GGenius. Всі права захищено.'
            },
            en: {
                'meta.title': 'GGenius - AI Revolution in Mobile Legends',
                'header.logo': 'GGenius',
                'nav.home': 'Home',
                'nav.about': 'About',
                'nav.roadmap': 'Roadmap',
                'hero.title': 'GGenius AI',
                'hero.subtitle': '<span class="gradient-text">Artificial Intelligence Revolution</span> in Mobile Legends',
                'hero.status': 'IN DEVELOPMENT',
                'hero.description.intro': 'Welcome to the future of esports! GGenius is an advanced AI platform created specifically for Mobile Legends: Bang Bang.',
                'hero.description.mission': '🚀 <strong>GGenius</strong> — your success is our mission!',
                'hero.cta.primary': 'Try Demo',
                'hero.cta.secondary': 'Learn More',
                'hero.cta.join': 'Join Community',
                'features.title': 'AI CAPABILITIES',
                'features.subtitle': 'Advanced technologies for your success',
                'features.categories.analysis': 'Analysis',
                'features.categories.coaching': 'Training',
                'features.categories.prediction': 'Predictions',
                'roadmap.title': 'Roadmap',
                'footer.tagline': 'Revolution in esports with AI',
                'footer.copyright': '© 2025 GGenius. All rights reserved.'
            }
        };
        this.isLoaded = false;
    }

    async init() {
        try {
            this.content = this.fallbackContent;
            this.isLoaded = true;
            await this.updateContent();
            console.log('✅ ContentManager initialized successfully');
        } catch (error) {
            console.warn('⚠️ ContentManager fallback mode:', error);
            this.content = this.fallbackContent;
            this.isLoaded = true;
        }
    }

    async setLanguage(languageCode) {
        if (this.currentLanguage === languageCode) return;
        
        this.currentLanguage = languageCode;
        await this.updateContent();
        
        document.dispatchEvent(new CustomEvent('content:loaded', {
            detail: { language: languageCode }
        }));
    }

    async updateContent() {
        if (!this.isLoaded) return;

        const elements = document.querySelectorAll('[data-content]');
        elements.forEach(element => {
            const key = element.getAttribute('data-content');
            const contentType = element.getAttribute('data-content-type') || 'text';
            const content = this.getText(key);
            
            if (content && content !== key) {
                if (contentType === 'html') {
                    element.innerHTML = content;
                } else {
                    element.textContent = content;
                }
                element.classList.add('content-loaded');
            }
        });
    }

    getText(key, variables = {}) {
        const content = this.content[this.currentLanguage]?.[key] || 
                       this.content.uk?.[key] || 
                       key;
        
        return Object.keys(variables).reduce((text, variable) => {
            return text.replace(new RegExp(`{${variable}}`, 'g'), variables[variable]);
        }, content);
    }

    getContentStats() {
        return {
            currentLanguage: this.currentLanguage,
            loadedKeys: Object.keys(this.content[this.currentLanguage] || {}),
            isLoaded: this.isLoaded
        };
    }

    async loadContent() {
        return this.init();
    }
}

/**
 * Main GGenius Application Class - FIXED VERSION
 */
class GGeniusApp {
    constructor() {
        this.isLoaded = false;
        this.loadingStartTime = performance.now();
        this.maxLoadingTime = 8000; // Максимум 8 секунд
        this.minimumLoadingTime = 2000; // Мінімум 2 секунди
        this.forceHideTimeout = null;
        this.contentLoadTimeout = null;
        
        // Managers and systems
        this.contentManager = new ContentManager();
        this.observers = new Map();
        this.animations = new Map();
        this.eventListeners = new Map();

        // Settings
        this.settings = {
            soundsEnabled: JSON.parse(localStorage.getItem('ggenius-soundsEnabled')) ?? true,
            musicEnabled: JSON.parse(localStorage.getItem('ggenius-musicEnabled')) ?? false,
            soundVolume: parseFloat(localStorage.getItem('ggenius-soundVolume')) || 0.3,
            musicVolume: parseFloat(localStorage.getItem('ggenius-musicVolume')) || 0.1,
            language: localStorage.getItem('ggenius-language') || 'uk'
        };

        // Mobile menu elements
        this.mobileMenuToggle = null;
        this.navMenu = null;
        this.isMenuOpen = false;

        // Loading screen elements
        this.loadingScreen = null;
        this.progressBar = null;
        this.loadingTextElement = null;

        // Performance tracking
        this.performance = {
            startTime: performance.now(),
            metrics: {},
            isLowPerformance: this.detectLowPerformance()
        };

        // Bind methods
        this.handleScroll = this.throttle(this._handleScroll.bind(this), 16);
        this.handleResize = this.debounce(this._handleResize.bind(this), 200);
        this.toggleMobileMenu = this.toggleMobileMenu.bind(this);
        this.closeMobileMenu = this.closeMobileMenu.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.forceHideLoading = this.forceHideLoading.bind(this);

        this.init();
    }

    getVersion() {
        return "2.7.0";
    }

    detectLowPerformance() {
        const lowRAM = navigator.deviceMemory && navigator.deviceMemory < 1;
        const lowCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 2;
        const saveDataEnabled = navigator.connection && navigator.connection.saveData;
        const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        return lowRAM || lowCores || saveDataEnabled || prefersReducedMotion;
    }

    async init() {
        try {
            console.log(`🚀 GGenius AI Revolution initializing... v${this.getVersion()}`);
            
            // Встановлюємо CSS клас для JS
            document.documentElement.classList.add('js-loaded');
            
            // Додаємо клас для слабких пристроїв
            if (this.performance.isLowPerformance) {
                document.documentElement.classList.add('low-performance-device');
                this.maxLoadingTime = 5000; // Скорочуємо час для слабких пристроїв
                this.minimumLoadingTime = 1000;
            }

            // КРИТИЧНО: Встановлюємо таймаут безпеки для loading screen
            this.setupLoadingScreenSafety();

            // Завантажуємо критичні елементи
            await this.loadCriticalElements();
            
            // Ініціалізуємо контент менеджер
            await this.contentManager.init();

            // Налаштовуємо інтерфейс
            this.setupGlobalEventListeners();
            await this.initializeUI();
            await this.setupInteractions();

            // Налаштовуємо перемикач мови
            this.setupLanguageSwitcher();

            // Показуємо завантаження (якщо потрібно)
            if (this.loadingScreen && !this.performance.isLowPerformance) {
                await this.simulateLoading();
            } else {
                this.hideLoadingScreen(true);
            }

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
     * КРИТИЧНО: Налаштування безпеки loading screen
     */
    setupLoadingScreenSafety() {
        // Абсолютний таймаут - завжди приховує loading screen
        this.forceHideTimeout = setTimeout(() => {
            console.warn('⚠️ Force hiding loading screen due to timeout');
            this.forceHideLoading();
        }, this.maxLoadingTime);

        // Резервний таймаут для контенту
        this.contentLoadTimeout = setTimeout(() => {
            console.warn('⚠️ Content load timeout, showing fallback');
            this.showFallbackContent();
        }, this.maxLoadingTime / 2);

        // Слухач для сховання при помилці
        window.addEventListener('error', () => {
            console.error('❌ Page error detected, hiding loading screen');
            this.forceHideLoading();
        });

        // Слухач для сховання при завантаженні
        window.addEventListener('load', () => {
            console.log('✅ Window loaded, hiding loading screen');
            setTimeout(() => this.forceHideLoading(), this.minimumLoadingTime);
        });
    }

    /**
     * Примусове приховування loading screen
     */
    forceHideLoading() {
        if (this.forceHideTimeout) {
            clearTimeout(this.forceHideTimeout);
            this.forceHideTimeout = null;
        }
        
        if (this.contentLoadTimeout) {
            clearTimeout(this.contentLoadTimeout);
            this.contentLoadTimeout = null;
        }

        this.hideLoadingScreen(true);
    }

    /**
     * Показ fallback контенту
     */
    showFallbackContent() {
        document.querySelectorAll('.fallback-text').forEach(element => {
            element.style.display = 'block';
        });
        
        document.documentElement.classList.add('fallback-mode');
    }

    async loadCriticalElements() {
        // Завантажуємо loading screen елементи
        this.loadingScreen = document.getElementById('loadingScreen');
        this.progressBar = document.getElementById('progressBar');
        this.loadingTextElement = document.getElementById('loadingText');
        
        // Завантажуємо мобільне меню
        this.mobileMenuToggle = document.getElementById('mobileMenuToggle');
        this.navMenu = document.getElementById('main-menu-list');
        
        // Створюємо scroll progress bar
        this.scrollProgress = this.createScrollProgress();

        // Перевіряємо наявність критичних елементів
        if (!this.mobileMenuToggle) {
            console.error('❌ Mobile menu toggle not found!');
        }
        if (!this.navMenu) {
            console.error('❌ Navigation menu not found!');
        }

        console.log('✅ Critical elements loaded');
    }

    async simulateLoading() {
        return new Promise((resolve) => {
            if (!this.loadingScreen || !this.progressBar) {
                resolve();
                return;
            }

            let progress = 0;
            const messages = [
                'Ініціалізація GGenius AI...',
                'Завантаження інтерфейсу...',
                'Підключення до систем...',
                'Налаштування функцій...',
                'Останні приготування...',
                'Готово!'
            ];
            let messageIndex = 0;

            const updateProgress = () => {
                const increment = Math.random() * 15 + 5; // 5-20% за раз
                progress = Math.min(progress + increment, 100);
                
                if (this.progressBar) {
                    this.progressBar.style.transform = `scaleX(${progress / 100})`;
                }

                // Оновлюємо повідомлення
                const currentMessageIndex = Math.min(
                    Math.floor((progress / 100) * messages.length), 
                    messages.length - 1
                );
                
                if (messageIndex !== currentMessageIndex) {
                    messageIndex = currentMessageIndex;
                    this.updateLoadingText(messages[messageIndex]);
                }

                if (progress < 100) {
                    const delay = this.performance.isLowPerformance ? 100 : 150;
                    setTimeout(updateProgress, delay + Math.random() * 100);
                } else {
                    // Переконуємося, що мінімальний час пройшов
                    const elapsed = performance.now() - this.loadingStartTime;
                    const remainingTime = Math.max(0, this.minimumLoadingTime - elapsed);
                    
                    setTimeout(() => {
                        this.hideLoadingScreen();
                        resolve();
                    }, remainingTime);
                }
            };
            
            this.updateLoadingText(messages[0]);
            setTimeout(updateProgress, 100); // Невелика затримка перед початком
        });
    }

    hideLoadingScreen(immediate = false) {
        if (!this.loadingScreen || this.loadingScreen.classList.contains('hidden')) {
            return;
        }
        
        console.log('🎯 Hiding loading screen...');
        
        // Очищаємо таймаути
        if (this.forceHideTimeout) {
            clearTimeout(this.forceHideTimeout);
            this.forceHideTimeout = null;
        }
        
        if (this.contentLoadTimeout) {
            clearTimeout(this.contentLoadTimeout);
            this.contentLoadTimeout = null;
        }

        // Приховуємо loading screen
        this.loadingScreen.classList.add('hidden');
        this.loadingScreen.setAttribute('aria-hidden', 'true');
        
        // Відновлюємо прокрутку body
        document.body.style.overflow = '';
        
        // Видаляємо елемент з DOM
        const removeDelay = immediate ? 100 : 600;
        setTimeout(() => {
            if (this.loadingScreen && this.loadingScreen.parentNode) {
                this.loadingScreen.remove();
                this.loadingScreen = null;
            }
        }, removeDelay);

        console.log('✅ Loading screen hidden successfully');
    }

    updateLoadingText(text) {
        if (this.loadingTextElement) {
            this.loadingTextElement.textContent = text;
        }
    }

    setupGlobalEventListeners() {
        // Основні обробники подій
        this._addEventListener(window, 'scroll', this.handleScroll, 'scroll');
        this._addEventListener(window, 'resize', this.handleResize, 'resize');
        this._addEventListener(document, 'visibilitychange', this._handleVisibilityChange.bind(this), 'visibility');
        
        // Обробники для мобільного меню
        this._addEventListener(document, 'click', this.handleOutsideClick, 'outsideClick');
        this._addEventListener(window, 'resize', this.closeMobileMenu, 'resizeCloseMenu');

        // Обробники клавіатури
        this._addEventListener(document, 'keydown', this._handleKeyDown.bind(this), 'keydown');
    }

    _handleKeyDown(event) {
        // ESC закриває мобільне меню
        if (event.key === 'Escape' && this.isMenuOpen) {
            this.closeMobileMenu();
        }
    }

    async initializeUI() {
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupTabs();
        console.log('✅ UI initialized');
    }

    setupNavigation() {
        console.log('🔧 Setting up navigation...');
        
        if (this.mobileMenuToggle && this.navMenu) {
            // Видаляємо попередні обробники
            this._removeEventListener('mobileToggle');
            
            // Додаємо новий обробник
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

            // Додаємо обробники для навігаційних посилань
            const navLinks = this.navMenu.querySelectorAll('.nav-link');
            navLinks.forEach((link, index) => {
                this._addEventListener(
                    link,
                    'click',
                    () => this.closeMobileMenu(),
                    `navLink-${index}`
                );
            });

            this.resetMobileMenuState();
            console.log('✅ Mobile menu setup completed');
        } else {
            console.error('❌ Mobile menu elements not found');
        }
    }

    resetMobileMenuState() {
        if (!this.mobileMenuToggle || !this.navMenu) return;

        this.isMenuOpen = false;
        this.mobileMenuToggle.setAttribute('aria-expanded', 'false');
        this.mobileMenuToggle.classList.remove('active');
        this.navMenu.classList.remove('open');
        document.body.classList.remove('menu-open');
        document.body.style.overflow = '';
    }

    toggleMobileMenu(forceState = null) {
        if (!this.mobileMenuToggle || !this.navMenu) {
            console.error('❌ Cannot toggle menu: elements not found');
            return;
        }

        const shouldBeOpen = forceState !== null ? forceState : !this.isMenuOpen;
        
        this.isMenuOpen = shouldBeOpen;
        
        // Оновлюємо атрибути та класи
        this.mobileMenuToggle.setAttribute('aria-expanded', String(shouldBeOpen));
        this.mobileMenuToggle.classList.toggle('active', shouldBeOpen);
        this.navMenu.classList.toggle('open', shouldBeOpen);
        document.body.classList.toggle('menu-open', shouldBeOpen);
        
        // Керуємо прокруткою
        document.body.style.overflow = shouldBeOpen ? 'hidden' : '';

        // Керуємо фокусом
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

    closeMobileMenu() {
        if (this.isMenuOpen) {
            this.toggleMobileMenu(false);
        }
    }

    handleOutsideClick(event) {
        if (!this.isMenuOpen || !this.mobileMenuToggle || !this.navMenu) return;

        const isClickInsideMenu = this.navMenu.contains(event.target);
        const isClickOnToggle = this.mobileMenuToggle.contains(event.target);
        
        if (!isClickInsideMenu && !isClickOnToggle) {
            this.closeMobileMenu();
        }
    }

    createScrollProgress() {
        const progress = document.createElement('div');
        progress.id = 'scrollProgress';
        progress.setAttribute('role', 'progressbar');
        progress.setAttribute('aria-valuenow', '0');
        progress.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: linear-gradient(90deg, var(--cyan), var(--purple));
            transform: scaleX(0);
            transform-origin: left;
            z-index: var(--z-max, 9999);
            transition: transform 0.1s ease;
            box-shadow: 0 0 10px rgba(var(--cyan-rgb), 0.5);
        `;
        document.body.prepend(progress);
        return progress;
    }

    setupScrollEffects() {
        this._handleScroll();
    }

    _handleScroll() {
        if (!this.scrollProgress) return;
        
        const scrollPercentage = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        this.scrollProgress.style.transform = `scaleX(${Math.max(0, Math.min(1, scrollPercentage))})`;
        
        // Приховуємо/показуємо header при прокрутці
        const header = document.querySelector('.site-header');
        if (header) {
            const scrolled = window.scrollY > 50;
            header.classList.toggle('scrolled', scrolled);
        }
    }

    setupTabs() {
        document.querySelectorAll('.tabs-component').forEach(tabsComponent => {
            const tabs = Array.from(tabsComponent.querySelectorAll('[role="tab"]'));
            const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));
            
            tabs.forEach((tab, index) => {
                this._addEventListener(tab, 'click', () => {
                    this.switchTab(tab, tabs, panels);
                }, `tab-${index}`);
            });
            
            if (tabs.length > 0) {
                this.switchTab(tabs[0], tabs, panels, true);
            }
        });
    }

    switchTab(activeTab, allTabs, allPanels, isInitialSetup = false) {
        allTabs.forEach(tab => {
            tab.classList.remove('active');
            tab.setAttribute('aria-selected', 'false');
        });
        
        activeTab.classList.add('active');
        activeTab.setAttribute('aria-selected', 'true');

        const targetPanelId = activeTab.getAttribute('aria-controls');
        allPanels.forEach(panel => {
            panel.hidden = panel.id !== targetPanelId;
            panel.classList.toggle('active', panel.id === targetPanelId);
        });

        if (!isInitialSetup) {
            activeTab.focus();
        }
    }

    async setupInteractions() {
        this.setupFeatureCardInteractions();
        this.setupSmoothScrolling();
    }

    setupFeatureCardInteractions() {
        document.querySelectorAll('.feature-card-iui').forEach(card => {
            this._addEventListener(card, 'click', (e) => {
                this.createRippleEffect(e.currentTarget, e);
            }, `card-${Math.random()}`);
        });
    }

    setupSmoothScrolling() {
        this._addEventListener(document, 'click', (e) => {
            const anchor = e.target.closest('a[href^="#"]');
            if (anchor) {
                e.preventDefault();
                const targetId = anchor.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);
                if (target) {
                    this.closeMobileMenu();
                    setTimeout(() => {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                }
            }
        }, 'smoothScroll');
    }

    setupLanguageSwitcher() {
        this.createLanguageSwitcher();
        
        document.addEventListener('content:loaded', (event) => {
            console.log(`Content loaded for language: ${event.detail.language}`);
        });
    }

    createLanguageSwitcher() {
        const existingSwitcher = document.getElementById('languageSwitcher');
        if (existingSwitcher) return;

        const switcher = document.createElement('div');
        switcher.id = 'languageSwitcher';
        switcher.className = 'language-switcher';
        
        const languages = [
            { code: 'uk', name: 'УК' },
            { code: 'en', name: 'EN' }
        ];

        languages.forEach(lang => {
            const button = document.createElement('button');
            button.textContent = lang.name;
            button.className = this.settings.language === lang.code ? 'active' : '';
            
            this._addEventListener(button, 'click', () => this.changeLanguage(lang.code), `lang-${lang.code}`);
            switcher.appendChild(button);
        });

        const header = document.querySelector('.site-header .header-container');
        if (header) {
            header.appendChild(switcher);
        }
    }

    async changeLanguage(languageCode) {
        if (this.settings.language === languageCode) return;

        try {
            await this.contentManager.setLanguage(languageCode);
            this.settings.language = languageCode;
            localStorage.setItem('ggenius-language', languageCode);
            
            document.querySelectorAll('.language-switcher button').forEach(btn => {
                const isActive = btn.textContent.toLowerCase() === languageCode;
                btn.classList.toggle('active', isActive);
            });
            
        } catch (error) {
            console.error('Failed to change language:', error);
        }
    }

    showDemoModal() {
        const modalId = 'demo-modal-ggenius';
        if (document.getElementById(modalId)) return;

        const modal = this.createModal({
            id: modalId,
            title: 'GGenius AI Demo',
            content: `
                <p>Ласкаво просимо до демонстрації GGenius AI!</p>
                <p>Наразі ця функція в розробці. Слідкуйте за оновленнями!</p>
            `,
            actions: [{ 
                text: 'Закрити', 
                action: () => this.closeModal(modalId) 
            }]
        });
        
        this.showModal(modal);
    }

    createModal({ id, title, content, actions = [] }) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = id;
        modal.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
            backdrop-filter: blur(5px);
        `;

        const container = document.createElement('div');
        container.style.cssText = `
            background: var(--bg-2);
            border-radius: 12px;
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
            border: 1px solid rgba(var(--cyan-rgb), 0.3);
            box-shadow: var(--shadow-2xl);
        `;

        container.innerHTML = `
            <h2 style="margin-bottom: 1rem; color: var(--text-1);">${title}</h2>
            <div style="margin-bottom: 2rem; color: var(--text-2);">${content}</div>
            <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                ${actions.map((action, index) => 
                    `<button data-action-index="${index}" style="
                        background: var(--g-button-primary);
                        color: var(--bg-1);
                        border: none;
                        padding: 0.5rem 1rem;
                        border-radius: 6px;
                        cursor: pointer;
                        font-weight: 600;
                        transition: all 0.2s ease;
                    ">${action.text}</button>`
                ).join('')}
            </div>
        `;

        modal.appendChild(container);

        actions.forEach((action, index) => {
            const button = container.querySelector(`[data-action-index="${index}"]`);
            this._addEventListener(button, 'click', action.action, `modal-action-${index}`);
        });

        return modal;
    }

    showModal(modal) {
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
        });
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.remove();
                document.body.style.overflow = '';
            }, 300);
        }
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
            border-radius: 50%;
            background: radial-gradient(circle, rgba(var(--cyan-rgb), 0.6) 0%, transparent 70%);
            transform: scale(0);
            animation: ripple 600ms linear;
            pointer-events: none;
            z-index: 1000;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    trackLoadTime() {
        const loadTime = performance.now() - this.performance.startTime;
        this.performance.metrics.pageLoadTime = loadTime;
        console.log(`⚡ Page loaded in ${loadTime.toFixed(2)}ms`);
    }

    _handleResize() {
        if (window.innerWidth > 768) {
            this.closeMobileMenu();
        }
    }

    _handleVisibilityChange() {
        if (document.visibilityState === 'hidden') {
            this.closeMobileMenu();
        }
    }

    fallbackMode(error) {
        // Примусово приховуємо loading screen
        this.forceHideLoading();
        
        document.documentElement.classList.add('fallback-mode');
        this.showFallbackContent();
        
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--pink);
            color: var(--text-1);
            padding: 1rem;
            border-radius: 8px;
            z-index: 10000;
            max-width: 300px;
            box-shadow: var(--shadow-xl);
        `;
        message.innerHTML = `
            <strong>Помилка ініціалізації</strong><br>
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

    // Utility methods
    throttle(func, delay) {
        let lastCall = 0;
        return (...args) => {
            const now = new Date().getTime();
            if (now - lastCall >= delay) {
                lastCall = now;
                func(...args);
            }
        };
    }

    debounce(func, delay) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    }

    _addEventListener(target, type, listener, key, options = { passive: true }) {
        if (this.eventListeners.has(key)) {
            this._removeEventListener(key);
        }
        
        target.addEventListener(type, listener, options);
        this.eventListeners.set(key, { target, type, listener, options });
    }

    _removeEventListener(key) {
        if (this.eventListeners.has(key)) {
            const { target, type, listener, options } = this.eventListeners.get(key);
            target.removeEventListener(type, listener, options);
            this.eventListeners.delete(key);
        }
    }

    getText(key, variables = {}) {
        return this.contentManager.getText(key, variables);
    }
}

// Ініціалізація з покращеною обробкою помилок
function initializeGGenius() {
    try {
        console.log('🚀 Starting GGenius initialization...');
        window.app = new GGeniusApp();
        
        // Debug mode
        if (localStorage.getItem('ggenius-debug') === 'true') {
            document.documentElement.classList.add('debug-mode');
            console.log('🔧 Debug mode enabled');
        }
    } catch (error) {
        console.error('💥 Fatal initialization error:', error);
        
        // Екстремальний fallback
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.remove();
            }
            document.body.style.overflow = '';
            
            const errorMessage = document.createElement('div');
            errorMessage.innerHTML = `
                <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                            background: var(--bg-2); padding: 2rem; border-radius: 12px; 
                            border: 2px solid var(--pink); color: var(--text-1); 
                            text-align: center; z-index: 10000; max-width: 400px;">
                    <h3 style="color: var(--pink); margin-bottom: 1rem;">⚠️ Помилка завантаження</h3>
                    <p style="margin-bottom: 1rem;">GGenius не може завантажитися.</p>
                    <button onclick="location.reload()" style="
                        background: var(--cyan); color: var(--bg-1); border: none; 
                        padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer;">
                        🔄 Перезавантажити
                    </button>
                </div>
            `;
            document.body.appendChild(errorMessage);
        }, 1000);
    }
}

// Запуск з множинними точками входу
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGGenius);
} else {
    // DOM вже завантажений
    initializeGGenius();
}

// Резервний запуск через window.onload
window.addEventListener('load', () => {
    if (!window.app) {
        console.warn('⚠️ Backup initialization triggered');
        initializeGGenius();
    }
});

// Глобальні утиліти для розробки та відладки
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
    
    forceHideLoading() {
        if (window.app && window.app.forceHideLoading) {
            window.app.forceHideLoading();
            console.log('🎯 Loading screen force hidden via debug');
        }
    },
    
    testMobileMenu() {
        if (window.app) {
            window.app.toggleMobileMenu();
            console.log('📱 Mobile menu toggled via debug');
        }
    },
    
    getContentStats() {
        return window.app?.contentManager?.getContentStats();
    },
    
    testContentKey(key) {
        return window.app?.contentManager?.getText(key);
    },
    
    reloadContent() {
        return window.app?.contentManager?.loadContent();
    },
    
    getPerformanceMetrics() {
        return window.app?.performance;
    },
    
    simulateError() {
        throw new Error('Debug: Simulated error for testing');
    }
};

// Експорт для використання в інших модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GGeniusApp, ContentManager };
}