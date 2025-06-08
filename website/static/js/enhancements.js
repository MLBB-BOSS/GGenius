/**
 * GGenius Enhanced Interactive Experience - Fixed Mobile Menu
 * @version 2.6.0 - Mobile Menu Fix & Hero Redesign
 */

// ... (попередній код ContentManager залишається без змін) ...

class GGeniusApp {
    constructor() {
        this.isLoaded = false;
        this.observers = new Map();
        this.animations = new Map();
        this.eventListeners = new Map();
        
        // Ініціалізуємо менеджер контенту
        this.contentManager = new ContentManager();

        this.settings = {
            soundsEnabled: JSON.parse(localStorage.getItem('ggenius-soundsEnabled')) ?? true,
            musicEnabled: JSON.parse(localStorage.getItem('ggenius-musicEnabled')) ?? false,
            soundVolume: parseFloat(localStorage.getItem('ggenius-soundVolume')) || 0.3,
            musicVolume: parseFloat(localStorage.getItem('ggenius-musicVolume')) || 0.1,
            language: localStorage.getItem('ggenius-language') || 'uk'
        };

        // Mobile menu elements - критично для роботи меню
        this.mobileMenuToggle = null;
        this.navMenu = null;
        this.isMenuOpen = false;

        this.audioContext = null;
        this.soundEffects = new Map();
        this.ambientOscillators = null;
        this.ambientGain = null;
        this.masterGain = null;

        this.performance = {
            startTime: performance.now(),
            metrics: {},
            isLowPerformance: this.detectLowPerformance()
        };

        this.handleScroll = this.throttle(this._handleScroll.bind(this), 16);
        this.handleResize = this.debounce(this._handleResize.bind(this), 200);

        // Прив'язуємо методи до контексту для правильної роботи
        this.toggleMobileMenu = this.toggleMobileMenu.bind(this);
        this.closeMobileMenu = this.closeMobileMenu.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);

        this.init();
    }

    getVersion() {
        return "2.6.0";
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
            
            document.documentElement.classList.add('js-loaded');
            
            if (this.performance.isLowPerformance) {
                document.documentElement.classList.add('low-performance-device');
            }

            // Встановлюємо мову
            await this.contentManager.setLanguage(this.settings.language);
            
            // Завантажуємо критичні функції ПЕРШИМИ
            await this.loadCriticalFeatures();
            
            // Ініціалізуємо контент
            await this.contentManager.init();
            
            // Налаштовуємо глобальні обробники подій
            this.setupGlobalEventListeners();
            
            // Ініціалізуємо аудіо систему
            await this.initializeAudioSystem();

            // Паралельно запускаємо інші системи
            await Promise.all([
                this.setupPerformanceMonitoring(),
                this.initializeUI(),
                this.setupInteractions()
            ]);

            // Налаштовуємо перемикач мови
            this.setupLanguageSwitcher();

            this.isLoaded = true;
            this.trackLoadTime();
            console.log('✅ GGenius fully initialized');
            document.dispatchEvent(new CustomEvent('ggenius:loaded'));
            
        } catch (error) {
            console.error('🔥 GGenius initialization failed:', error);
            this.fallbackMode(error);
        }
    }

    async loadCriticalFeatures() {
        // Завантажуємо критичні елементи DOM
        this.loadingScreen = document.getElementById('loadingScreen');
        this.progressBar = document.getElementById('progressBar');
        this.loadingTextElement = document.getElementById('loadingText');
        
        // КРИТИЧНО: ініціалізуємо мобільне меню
        this.mobileMenuToggle = document.getElementById('mobileMenuToggle');
        this.navMenu = document.getElementById('main-menu-list');
        
        // Перевіряємо наявність елементів меню
        if (!this.mobileMenuToggle) {
            console.error('❌ Mobile menu toggle not found! ID: mobileMenuToggle');
        }
        if (!this.navMenu) {
            console.error('❌ Navigation menu not found! ID: main-menu-list');
        }

        this.scrollProgress = this.createScrollProgress();

        // Симуляція завантаження тільки якщо екран завантаження присутній
        if (this.loadingScreen && !this.performance.isLowPerformance) {
            await this.simulateLoading();
        } else if (this.loadingScreen) {
            this.hideLoadingScreen(true);
        }
    }

    setupGlobalEventListeners() {
        // Основні обробники подій
        this._addEventListener(window, 'scroll', this.handleScroll, 'scroll');
        this._addEventListener(window, 'resize', this.handleResize, 'resize');
        this._addEventListener(document, 'visibilitychange', this._handleVisibilityChange.bind(this), 'visibility');
        
        // Обробники для закриття меню при кліку поза ним
        this._addEventListener(document, 'click', this.handleOutsideClick, 'outsideClick');
        this._addEventListener(window, 'resize', this.closeMobileMenu, 'resizeCloseMenu');
    }

    async initializeUI() {
        // Налаштовуємо навігацію (включаючи мобільне меню)
        this.setupNavigation();
        
        // Налаштовуємо ефекти прокрутки
        this.setupScrollEffects();
        
        // Налаштовуємо вкладки
        this.setupTabs();
    }

    /**
     * Налаштування навігації з виправленим мобільним меню
     */
    setupNavigation() {
        console.log('🔧 Setting up navigation...');
        
        // Перевіряємо наявність елементів
        if (!this.mobileMenuToggle) {
            this.mobileMenuToggle = document.getElementById('mobileMenuToggle');
        }
        if (!this.navMenu) {
            this.navMenu = document.getElementById('main-menu-list');
        }

        if (this.mobileMenuToggle && this.navMenu) {
            console.log('✅ Mobile menu elements found, setting up listeners...');
            
            // Видаляємо попередні обробники (якщо були)
            this._removeEventListener('mobileToggle');
            
            // Додаємо новий обробник
            this._addEventListener(
                this.mobileMenuToggle, 
                'click', 
                (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    console.log('📱 Mobile menu toggle clicked');
                    this.toggleMobileMenu();
                }, 
                'mobileToggle',
                { passive: false }
            );

            // Додаємо обробники для закриття меню при кліку на посилання
            const navLinks = this.navMenu.querySelectorAll('.nav-link');
            navLinks.forEach((link, index) => {
                this._addEventListener(
                    link,
                    'click',
                    () => {
                        console.log('📱 Nav link clicked, closing menu');
                        this.closeMobileMenu();
                    },
                    `navLink-${index}`
                );
            });

            // Ініціалізуємо початковий стан
            this.resetMobileMenuState();
            
            console.log('✅ Mobile menu setup completed');
        } else {
            console.error('❌ Mobile menu elements not found:', {
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
        this.mobileMenuToggle.classList.remove('active');
        this.navMenu.classList.remove('open');
        document.body.classList.remove('menu-open');
        
        console.log('🔄 Mobile menu state reset');
    }

    /**
     * Перемикання мобільного меню
     */
    toggleMobileMenu(forceState = null) {
        if (!this.mobileMenuToggle || !this.navMenu) {
            console.error('❌ Cannot toggle menu: elements not found');
            return;
        }

        // Визначаємо новий стан
        const shouldBeOpen = forceState !== null ? forceState : !this.isMenuOpen;
        
        console.log(`📱 Toggling mobile menu: ${this.isMenuOpen} → ${shouldBeOpen}`);
        
        this.isMenuOpen = shouldBeOpen;
        
        // Оновлюємо атрибути та класи
        this.mobileMenuToggle.setAttribute('aria-expanded', String(shouldBeOpen));
        this.mobileMenuToggle.classList.toggle('active', shouldBeOpen);
        this.navMenu.classList.toggle('open', shouldBeOpen);
        document.body.classList.toggle('menu-open', shouldBeOpen);
        
        // Керуємо фокусом
        if (shouldBeOpen) {
            // Фокус на першому елементі меню
            const firstLink = this.navMenu.querySelector('.nav-link');
            if (firstLink) {
                setTimeout(() => firstLink.focus(), 100);
            }
        } else {
            // Повертаємо фокус на кнопку меню
            this.mobileMenuToggle.focus();
        }

        // Запобігаємо прокрутці фону при відкритому меню
        if (shouldBeOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        console.log(`✅ Mobile menu ${shouldBeOpen ? 'opened' : 'closed'}`);
    }

    /**
     * Закриття мобільного меню
     */
    closeMobileMenu() {
        if (this.isMenuOpen) {
            this.toggleMobileMenu(false);
        }
    }

    /**
     * Обробка кліків поза меню
     */
    handleOutsideClick(event) {
        if (!this.isMenuOpen || !this.mobileMenuToggle || !this.navMenu) return;

        const isClickInsideMenu = this.navMenu.contains(event.target);
        const isClickOnToggle = this.mobileMenuToggle.contains(event.target);
        
        if (!isClickInsideMenu && !isClickOnToggle) {
            console.log('📱 Outside click detected, closing menu');
            this.closeMobileMenu();
        }
    }

    // ... (решта методів залишається без змін, але додаємо кілька важливих) ...

    async simulateLoading() {
        return new Promise((resolve) => {
            if (!this.loadingScreen || !this.progressBar) {
                resolve();
                return;
            }

            let progress = 0;
            const messages = [
                'Ініціалізація GGenius AI...',
                'Завантаження контенту...',
                'Підключення до серверів...',
                'Налаштування інтерфейсу...',
                'Готовність до роботи!'
            ];
            let messageIndex = 0;

            const updateProgress = () => {
                progress = Math.min(progress + Math.random() * 12 + 8, 100);
                this.progressBar.style.transform = `scaleX(${progress / 100})`;

                const currentMessageIndex = Math.min(Math.floor((progress / 100) * messages.length), messages.length - 1);
                if (messageIndex !== currentMessageIndex) {
                    messageIndex = currentMessageIndex;
                    this.updateLoadingText(messages[messageIndex]);
                }

                if (progress < 100) {
                    setTimeout(updateProgress, 120 + Math.random() * 180);
                } else {
                    setTimeout(() => {
                        this.hideLoadingScreen();
                        resolve();
                    }, 300);
                }
            };
            
            this.updateLoadingText(messages[0]);
            updateProgress();
        });
    }

    hideLoadingScreen(immediate = false) {
        if (!this.loadingScreen || this.loadingScreen.classList.contains('hidden')) return;
        
        this.loadingScreen.classList.add('hidden');
        this.loadingScreen.setAttribute('aria-hidden', 'true');
        
        setTimeout(() => {
            if (this.loadingScreen) {
                this.loadingScreen.remove();
            }
        }, immediate ? 50 : 600);
    }

    updateLoadingText(text) {
        if (this.loadingTextElement) {
            this.loadingTextElement.textContent = text;
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
        
        // Додатково: приховуємо/показуємо header при прокрутці
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
            
            // Активуємо перший таб
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
                    // Закриваємо мобільне меню перед прокруткою
                    this.closeMobileMenu();
                    setTimeout(() => {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                }
            }
        }, 'smoothScroll');
    }

    // ... (решта методів ContentManager і utility функції залишаються без змін) ...

    async initializeAudioSystem() {
        if (this.performance.isLowPerformance) {
            this.settings.soundsEnabled = false;
            this.settings.musicEnabled = false;
            return;
        }

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.setValueAtTime(this.settings.soundVolume, this.audioContext.currentTime);
            this.masterGain.connect(this.audioContext.destination);
        } catch (error) {
            console.warn('Audio system not available:', error);
            this.settings.soundsEnabled = false;
        }
    }

    async setupPerformanceMonitoring() {
        if (this.performance.isLowPerformance) return;
        // Моніторинг продуктивності
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
            
            // Оновлюємо кнопки
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
        // При зміні розміру вікна закриваємо мобільне меню
        if (window.innerWidth > 768) {
            this.closeMobileMenu();
        }
    }

    _handleVisibilityChange() {
        if (document.visibilityState === 'hidden') {
            // Закриваємо меню при переході в фон
            this.closeMobileMenu();
        }
    }

    fallbackMode(error) {
        document.documentElement.classList.add('fallback-mode');
        
        // Показуємо всі fallback елементи
        document.querySelectorAll('.fallback-text').forEach(element => {
            element.style.display = 'block';
        });
        
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

// Ініціалізація з розширеною підтримкою відладки
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🚀 DOM Content Loaded, initializing GGenius...');
        window.app = new GGeniusApp();
        
        // Debug mode для розробки
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
    }
};

// Експорт для використання в інших модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GGeniusApp, ContentManager };
}