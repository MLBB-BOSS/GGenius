/**
 * GGenius Enhanced Interactive Experience with Content Management
 * Performance-optimized ES2023+ JavaScript for cyberpunk AI platform
 * @version 2.3.0 // Enhanced with content management
 * @author GGenius Team
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
        this.audioNodes = new Map();
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
        this.handleVisibilityChange = this._handleVisibilityChange.bind(this);

        this.currentModalFocusableElements = [];
        this.lastFocusedElementBeforeModal = null;

        this.init();
    }

    getVersion() {
        return "2.3.0";
    }

    async init() {
        try {
            console.log(`🚀 GGenius AI Revolution initializing... v${this.getVersion()}`);
            
            // Показуємо індикатор завантаження контенту
            this.showContentLoadingIndicator();
            
            document.documentElement.classList.add('js-loaded');
            document.body.classList.add('content-loading');
            
            if (this.performance.isLowPerformance) {
                document.documentElement.classList.add('low-performance-device');
            }

            // Встановлюємо мову
            await this.contentManager.setLanguage(this.settings.language);
            
            // Завантажуємо критичні функції
            await this.loadCriticalFeatures();
            
            // Ініціалізуємо контент
            const contentLoaded = await this.contentManager.init();
            
            if (contentLoaded) {
                document.body.classList.remove('content-loading');
                this.hideContentLoadingIndicator();
            } else {
                console.warn('Failed to load content, using fallback');
                this.handleContentLoadFailure();
            }
            
            this.setupGlobalEventListeners();
            await this.initializeAudioSystem();

            await Promise.all([
                this.setupPerformanceMonitoring(),
                this.initializeUI(),
                this.setupInteractions()
            ]);

            await this.setupAdvancedFeatures();
            
            // Встановлюємо обробники для зміни мови
            this.setupLanguageSwitcher();

            this.isLoaded = true;
            this.trackLoadTime();
            console.log('✅ GGenius fully initialized');
            document.dispatchEvent(new CustomEvent('ggenius:loaded'));
            this.playStartupSequence();
            
        } catch (error) {
            console.error('🔥 GGenius initialization failed:', error);
            this.fallbackMode(error);
        }
    }

    /**
     * Показати індикатор завантаження контенту
     */
    showContentLoadingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'content-loading-indicator active';
        indicator.id = 'contentLoadingIndicator';
        document.body.appendChild(indicator);
    }

    /**
     * Приховати індикатор завантаження контенту
     */
    hideContentLoadingIndicator() {
        const indicator = document.getElementById('contentLoadingIndicator');
        if (indicator) {
            indicator.classList.remove('active');
            setTimeout(() => indicator.remove(), 300);
        }
    }

    /**
     * Обробка помилки завантаження контенту
     */
    handleContentLoadFailure() {
        document.body.classList.remove('content-loading');
        this.hideContentLoadingIndicator();
        
        // Показуємо повідомлення про помилку
        this.showToast('Помилка завантаження контенту. Використовується резервний режим.', 'warning', 5000);
        
        // Активуємо fallback контент
        document.querySelectorAll('.fallback-text').forEach(element => {
            element.style.display = 'block';
        });
    }

    /**
     * Налаштування перемикача мови
     */
    setupLanguageSwitcher() {
        // Створюємо перемикач мови, якщо його немає
        this.createLanguageSwitcher();
        
        // Слухаємо події зміни контенту
        document.addEventListener('content:loaded', (event) => {
            console.log(`Content loaded for language: ${event.detail.language}`);
            this.playSound('notification');
        });
    }

    /**
     * Створення перемикача мови
     */
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
            button.addEventListener('click', () => this.changeLanguage(lang.code));
            switcher.appendChild(button);
        });

        // Додаємо до header'а
        const header = document.querySelector('.site-header .header-container');
        if (header) {
            header.appendChild(switcher);
        }
    }

    /**
     * Зміна мови
     */
    async changeLanguage(languageCode) {
        if (this.settings.language === languageCode) return;

        this.showContentLoadingIndicator();
        
        try {
            await this.contentManager.setLanguage(languageCode);
            this.settings.language = languageCode;
            localStorage.setItem('ggenius-language', languageCode);
            
            // Оновлюємо кнопки перемикача
            document.querySelectorAll('.language-switcher button').forEach(btn => {
                btn.classList.toggle('active', btn.textContent.toLowerCase() === languageCode);
            });
            
            this.hideContentLoadingIndicator();
            this.playSound('tab_switch');
            
        } catch (error) {
            console.error('Failed to change language:', error);
            this.hideContentLoadingIndicator();
            this.showToast('Помилка зміни мови', 'error');
        }
    }

    /**
     * Отримання тексту за ключем
     */
    getText(key, variables = {}) {
        return this.contentManager.getText(key, variables);
    }

    /**
     * Динамічне оновлення тексту елемента
     */
    updateElementText(element, contentKey, variables = {}) {
        if (!element) return;
        
        const text = this.getText(contentKey, variables);
        element.textContent = text;
        element.classList.add('content-loaded');
    }

    // Решта методів залишається без змін...
    // [Тут весь попередній код з enhancements.js]

    /**
     * Покращений метод показу модального вікна з підтримкою i18n
     */
    showDemoModal() {
        const modalId = 'demo-modal-ggenius';
        if (document.getElementById(modalId)) return;

        const title = this.getText('demo.modal.title') || 'GGenius AI Demo';
        const content = `
            <p>${this.getText('demo.modal.welcome') || 'Ласкаво просимо до демонстрації GGenius AI!'}</p>
            <p>${this.getText('demo.modal.development') || 'Наразі ця функція в розробці. Слідкуйте за оновленнями!'}</p>
            <button type="button" onclick="app.scrollToNewsletter()">${this.getText('demo.modal.subscribe') || 'Підписатися'}</button>
        `;
        
        const modal = this.createModal({
            id: modalId,
            title: title,
            content: content,
            actions: [{ 
                text: this.getText('common.close') || 'Закрити', 
                action: () => this.closeModal(modalId) 
            }]
        });
        
        this.showModal(modal);
    }

    /**
     * Покращений fallback режим
     */
    fallbackMode(error) {
        document.documentElement.classList.add('fallback-mode');
        document.body.classList.remove('content-loading');
        
        const message = document.createElement('div');
        message.className = 'error-message';
        message.innerHTML = `
            <div class="error-content">
                <h2>🔧 Помилка ініціалізації GGenius</h2>
                <p>Сталася помилка при завантаженні: <code>${error.message}</code></p>
                <p>Спробуйте оновити сторінку або зв'яжіться з підтримкою.</p>
                <button onclick="location.reload()" class="retry-button">🔄 Оновити сторінку</button>
            </div>
        `;
        
        document.body.prepend(message);
        
        // Показуємо fallback контент
        document.querySelectorAll('.fallback-text').forEach(element => {
            element.style.display = 'block';
        });
    }

    // Інші методи залишаються без змін...
}

// Ініціалізація після завантаження DOM
document.addEventListener('DOMContentLoaded', () => {
    window.app = new GGeniusApp();
});

// Експорт для використання в інших модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GGeniusApp;
}