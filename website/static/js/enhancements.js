/**
 * GGenius Enhanced Interactive Experience with Content Management
 * Performance-optimized ES2023+ JavaScript for cyberpunk AI platform
 * @version 2.4.0 // Fixed content management integration
 * @author GGenius Team
 */

/**
 * Content Management System
 * Система управління контентом для динамічного завантаження тексту
 */
class ContentManager {
    constructor() {
        this.content = new Map();
        this.currentLanguage = 'uk';
        this.fallbackLanguage = 'en';
        this.isLoaded = false;
        this.loadingPromise = null;
        
        // Статичний контент як fallback
        this.staticContent = {
            'uk': {
                'header.logo': 'GGenius',
                'hero.title': 'GGenius AI',
                'hero.subtitle': 'Революція штучного інтелекту в Mobile Legends',
                'hero.status': 'В розробці',
                'hero.description.intro': 'Вітаємо у майбутньому кіберспорту! GGenius - це передова платформа штучного інтелекту, створена спеціально для Mobile Legends: Bang Bang.',
                'hero.cta.primary': 'Спробувати демо',
                'hero.cta.secondary': 'Дізнатися більше',
                'features.title': 'Можливості AI',
                'nav.home': 'Головна',
                'nav.features': 'Функції',
                'nav.about': 'Про нас',
                'nav.contact': 'Контакти'
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

        this.loadingPromise = this.loadContent();
        return this.loadingPromise;
    }

    /**
     * Завантаження контенту
     */
    async loadContent() {
        try {
            console.log('🔄 Loading content...');
            
            // Спочатку використовуємо статичний контент
            this.useStaticContent();
            
            // Потім намагаємося завантажити динамічний
            await this.loadDynamicContent();
            
            this.isLoaded = true;
            console.log('✅ Content loaded successfully');
            
            this.applyContentToPage();
            return true;
            
        } catch (error) {
            console.warn('⚠️ Dynamic content loading failed, using static:', error);
            this.useStaticContent();
            this.applyContentToPage();
            return false;
        }
    }

    /**
     * Використання статичного контенту
     */
    useStaticContent() {
        this.content.set('uk', this.staticContent.uk);
        this.isLoaded = true;
    }

    /**
     * Завантаження динамічного контенту
     */
    async loadDynamicContent() {
        try {
            const response = await fetch('/static/data/content-uk.json');
            if (response.ok) {
                const data = await response.json();
                this.content.set('uk', { ...this.staticContent.uk, ...data });
            }
        } catch (error) {
            console.warn('Failed to load dynamic content:', error);
        }
    }

    /**
     * Застосування контенту до сторінки
     */
    applyContentToPage() {
        const currentContent = this.getCurrentContent();
        
        // Оновлюємо всі елементи з data-content
        document.querySelectorAll('[data-content]').forEach(element => {
            const contentKey = element.getAttribute('data-content');
            const content = this.getContentByKey(contentKey, currentContent);
            
            if (content) {
                this.setElementContent(element, content);
            }
        });

        // Оновлюємо title сторінки
        if (currentContent['meta.title']) {
            document.title = currentContent['meta.title'];
        }

        // Диспетчер події
        document.dispatchEvent(new CustomEvent('content:loaded', {
            detail: { language: this.currentLanguage }
        }));
    }

    /**
     * Встановлення контенту для елемента
     */
    setElementContent(element, content) {
        const contentType = element.getAttribute('data-content-type') || 'text';
        
        // Прибираємо loading стан
        element.classList.remove('content-loading');
        
        switch (contentType) {
            case 'html':
                element.innerHTML = content;
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
            default:
                element.textContent = content;
        }

        // Додаємо клас завантаженого контенту
        element.classList.add('content-loaded');
        
        // Приховуємо fallback текст
        const fallback = element.querySelector('.fallback-text');
        if (fallback) {
            fallback.style.display = 'none';
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
        return this.content.get(this.currentLanguage) || this.staticContent.uk || {};
    }

    /**
     * Отримання тексту за ключем
     */
    getText(key, variables = {}) {
        if (!this.isLoaded) {
            return this.staticContent.uk[key] || key;
        }

        const content = this.getCurrentContent();
        let text = content[key] || key;
        
        // Замінюємо змінні
        return this.interpolateVariables(text, variables);
    }

    /**
     * Інтерполяція змінних
     */
    interpolateVariables(text, variables) {
        if (typeof text !== 'string') return text;
        
        return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return variables[key] || match;
        });
    }

    /**
     * Зміна мови
     */
    async setLanguage(language) {
        this.currentLanguage = language;
        localStorage.setItem('ggenius-language', language);
        document.documentElement.lang = language;
        
        if (this.isLoaded) {
            this.applyContentToPage();
        }
    }
}

/**
 * Основний клас додатку GGenius
 */
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

        this.init();
    }

    getVersion() {
        return "2.4.0";
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
            
            // Завантажуємо критичні функції
            await this.loadCriticalFeatures();
            
            // Ініціалізуємо контент
            await this.contentManager.init();
            
            this.setupGlobalEventListeners();
            await this.initializeAudioSystem();

            await Promise.all([
                this.setupPerformanceMonitoring(),
                this.initializeUI(),
                this.setupInteractions()
            ]);

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
        this.loadingScreen = document.getElementById('loadingScreen');
        this.progressBar = document.getElementById('progressBar');
        this.loadingTextElement = document.getElementById('loadingText');
        this.scrollProgress = this.createScrollProgress();
        this.navMenu = document.querySelector('#main-menu-list');
        this.mobileToggle = document.querySelector('#mobileMenuToggle');

        if (this.loadingScreen && !this.performance.isLowPerformance) {
            await this.simulateLoading();
        } else if (this.loadingScreen) {
            this.hideLoadingScreen(true);
        }
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
                'Завантаження контенту...',
                'Підключення до серверів...',
                'Готовність до роботи!'
            ];
            let messageIndex = 0;

            const updateProgress = () => {
                progress = Math.min(progress + Math.random() * 15 + 5, 100);
                this.progressBar.style.transform = `scaleX(${progress / 100})`;

                const currentMessageIndex = Math.min(Math.floor((progress / 100) * messages.length), messages.length - 1);
                if (messageIndex !== currentMessageIndex) {
                    messageIndex = currentMessageIndex;
                    this.updateLoadingText(messages[messageIndex]);
                }

                if (progress < 100) {
                    setTimeout(updateProgress, 100 + Math.random() * 150);
                } else {
                    this.hideLoadingScreen();
                    resolve();
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
        }, immediate ? 50 : 500);
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
        `;
        document.body.prepend(progress);
        return progress;
    }

    setupGlobalEventListeners() {
        this._addEventListener(window, 'scroll', this.handleScroll, 'scroll');
        this._addEventListener(window, 'resize', this.handleResize, 'resize');
        this._addEventListener(document, 'visibilitychange', this._handleVisibilityChange.bind(this), 'visibility');
    }

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

    async initializeUI() {
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupTabs();
    }

    setupNavigation() {
        if (this.mobileToggle) {
            this._addEventListener(this.mobileToggle, 'click', () => this.toggleMobileMenu(), 'mobileToggle');
        }
    }

    setupScrollEffects() {
        this._handleScroll();
    }

    _handleScroll() {
        if (!this.scrollProgress) return;
        
        const scrollPercentage = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        this.scrollProgress.style.transform = `scaleX(${Math.max(0, Math.min(1, scrollPercentage))})`;
    }

    setupTabs() {
        document.querySelectorAll('.tabs-component').forEach(tabsComponent => {
            const tabs = Array.from(tabsComponent.querySelectorAll('[role="tab"]'));
            const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));
            
            tabs.forEach((tab, index) => {
                this._addEventListener(tab, 'click', () => this.switchTab(tab, tabs, panels), `tab-${index}`);
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
                    target.scrollIntoView({ behavior: 'smooth' });
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
        switcher.style.cssText = `
            display: flex;
            gap: 0.5rem;
            align-items: center;
        `;
        
        const languages = [
            { code: 'uk', name: 'УК' },
            { code: 'en', name: 'EN' }
        ];

        languages.forEach(lang => {
            const button = document.createElement('button');
            button.textContent = lang.name;
            button.style.cssText = `
                background: ${this.settings.language === lang.code ? 'var(--cyan)' : 'transparent'};
                border: 1px solid var(--cyan);
                color: ${this.settings.language === lang.code ? 'var(--bg-1)' : 'var(--cyan)'};
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.75rem;
                text-transform: uppercase;
                transition: all 0.2s ease;
            `;
            
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
                btn.style.background = isActive ? 'var(--cyan)' : 'transparent';
                btn.style.color = isActive ? 'var(--bg-1)' : 'var(--cyan)';
            });
            
        } catch (error) {
            console.error('Failed to change language:', error);
        }
    }

    toggleMobileMenu(forceOpen) {
        if (!this.mobileToggle || !this.navMenu) return;
        
        const shouldBeOpen = typeof forceOpen === 'boolean' ? forceOpen : this.mobileToggle.getAttribute('aria-expanded') !== 'true';
        
        this.mobileToggle.setAttribute('aria-expanded', String(shouldBeOpen));
        this.mobileToggle.classList.toggle('active', shouldBeOpen);
        this.navMenu.classList.toggle('open', shouldBeOpen);
        document.body.classList.toggle('menu-open', shouldBeOpen);
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
        `;

        container.innerHTML = `
            <h2 style="margin-bottom: 1rem; color: var(--text-1);">${title}</h2>
            <div style="margin-bottom: 2rem; color: var(--text-2);">${content}</div>
            <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                ${actions.map((action, index) => 
                    `<button data-action-index="${index}" style="
                        background: var(--blue);
                        color: var(--text-1);
                        border: none;
                        padding: 0.5rem 1rem;
                        border-radius: 6px;
                        cursor: pointer;
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
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
        
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
        // Handle resize events
    }

    _handleVisibilityChange() {
        if (document.visibilityState === 'hidden') {
            // Pause animations when tab is hidden
        } else {
            // Resume animations when tab is visible
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

// Створюємо стилі для анімацій
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .content-loading {
        opacity: 0.5;
        animation: pulse 1.5s infinite;
    }
    
    .content-loaded {
        opacity: 1;
        animation: none;
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 0.8; }
    }
    
    .fallback-text {
        display: none;
    }
    
    .fallback-mode .fallback-text {
        display: block !important;
    }
`;
document.head.appendChild(style);

// Ініціалізація після завантаження DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.app = new GGeniusApp();
    });
} else {
    window.app = new GGeniusApp();
}

// Експорт для використання в інших модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GGeniusApp;
}