/**
 * GGenius Enhanced Interactive Experience with Content Management
 * Performance-optimized ES2023+ JavaScript for cyberpunk AI platform
 * @version 2.7.1
 * @author GGenius Team
 */

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
 * Головний клас додатка GGenius
 */
class GGeniusApp {
    constructor() {
        this.isLoaded = false;
        this.eventListeners = new Map();
        this.contentManager = new ContentManager();
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

            this.isLoaded = true;
            console.log('✅ GGenius App initialized successfully');

            document.dispatchEvent(new CustomEvent('ggenius:ready', {
                detail: {
                    version: '2.7.1',
                    performance: this.performance.isLowPerformance ? 'low' : 'normal',
                    language: this.settings.language
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
     * Очищення ресурсів
     */
    destroy() {
        this.eventListeners.forEach((listener, key) => {
            this._removeEventListener(key);
        });
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

    forceReload() {
        location.reload();
    }
};

// Експорт для модулів
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GGeniusApp, ContentManager };
}