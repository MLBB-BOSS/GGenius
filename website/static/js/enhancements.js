/**
 * GGenius Enhanced Interactive Experience with Content Management
 * Performance-optimized ES2023+ JavaScript for cyberpunk AI platform
 * @version 2.5.0 // Enhanced with existing lang files integration
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
     * Завантаження контенту з існуючих lang файлів
     */
    async loadContent() {
        try {
            console.log('🔄 Loading content from existing lang files...');
            
            // Спочатку використовуємо статичний контент
            this.useStaticContent();
            
            // Потім намагаємося завантажити з існуючого lang файлу
            await this.loadFromExistingLangFiles();
            
            this.isLoaded = true;
            console.log('✅ Content loaded successfully from lang files');
            
            this.applyContentToPage();
            return true;
            
        } catch (error) {
            console.warn('⚠️ Lang files loading failed, using static:', error);
            this.useStaticContent();
            this.applyContentToPage();
            return false;
        }
    }

    /**
     * Завантаження з існуючих lang файлів
     */
    async loadFromExistingLangFiles() {
        try {
            const response = await fetch('/static/lang/uk.json');
            if (response.ok) {
                const langData = await response.json();
                
                // Конвертуємо структуру з uk.json в нашу систему
                const convertedData = this.convertLangFileToContentStructure(langData);
                
                // Об'єднуємо з існуючим статичним контентом
                this.content.set('uk', { 
                    ...this.staticContent.uk, 
                    ...convertedData 
                });
                
                console.log('✅ Successfully loaded content from lang/uk.json');
            }
        } catch (error) {
            console.warn('Failed to load from lang files:', error);
        }
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
            
            // Головна секція
            'revolutionaryProjectBadge': 'hero.status',
            'projectIntroTitle': 'hero.title.about',
            'projectIntroSubtitle': 'hero.subtitle.revolution',
            'projectIntroParagraph1': 'hero.description.mission',
            'projectIntroParagraph2': 'hero.description.extended',
            'projectCTAJoinCommunity': 'hero.cta.join',
            
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
                // Очищуємо HTML теги для простих текстів
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
        const preservedTags = ['<strong>', '</strong>', '<em>', '</em>', '<span class="gradient-text">', '</span>'];
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
        
        return cleaned;
    }

    /**
     * Використання статичного контенту
     */
    useStaticContent() {
        this.content.set('uk', this.staticContent.uk);
        this.isLoaded = true;
    }

    /**
     * Застосування контенту до сторінки з розширеною підтримкою
     */
    applyContentToPage() {
        const currentContent = this.getCurrentContent();
        
        // Оновлюємо всі елементи з data-content
        document.querySelectorAll('[data-content]').forEach(element => {
            const contentKey = element.getAttribute('data-content');
            const content = this.getContentByKey(contentKey, currentContent);
            
            if (content) {
                this.setElementContent(element, content);
            } else {
                // Логування для відладки
                console.debug(`Content not found for key: ${contentKey}`);
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
                keysLoaded: Object.keys(currentContent).length
            }
        }));
    }

    /**
     * Встановлення контенту для елемента з HTML підтримкою
     */
    setElementContent(element, content) {
        const contentType = element.getAttribute('data-content-type') || 'auto';
        
        // Прибираємо loading стан
        element.classList.remove('content-loading');
        
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
        if (key.includes('hero.title')) alternatives.push('projectIntroTitle');
        if (key.includes('hero.subtitle')) alternatives.push('projectIntroSubtitle');
        if (key.includes('nav.about')) alternatives.push('navAbout');
        if (key.includes('nav.roadmap')) alternatives.push('navRoadmap');
        if (key.includes('footer.copyright')) alternatives.push('footerCopyright');
        if (key.includes('footer.tagline')) alternatives.push('footerTagline');
        
        return alternatives;
    }

    /**
     * Отримання поточного контенту
     */
    getCurrentContent() {
        return this.content.get(this.currentLanguage) || this.staticContent.uk || {};
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
        this.currentLanguage = language;
        localStorage.setItem('ggenius-language', language);
        document.documentElement.lang = language;
        
        if (this.isLoaded) {
            // Перезавантажуємо контент для нової мови
            await this.loadFromExistingLangFiles();
            this.applyContentToPage();
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
            totalKeys: Object.keys(currentContent).length,
            loadedFromLangFiles: this.isLoaded,
            availableLanguages: Array.from(this.content.keys())
        };
    }
}

// Решта коду GGeniusApp залишається такою ж, але з оновленим конструктором:

class GGeniusApp {
    constructor() {
        this.isLoaded = false;
        this.observers = new Map();
        this.animations = new Map();
        this.eventListeners = new Map();
        
        // Ініціалізуємо менеджер контенту з підтримкою lang файлів
        this.contentManager = new ContentManager();

        this.settings = {
            soundsEnabled: JSON.parse(localStorage.getItem('ggenius-soundsEnabled')) ?? true,
            musicEnabled: JSON.parse(localStorage.getItem('ggenius-musicEnabled')) ?? false,
            soundVolume: parseFloat(localStorage.getItem('ggenius-soundVolume')) || 0.3,
            musicVolume: parseFloat(localStorage.getItem('ggenius-musicVolume')) || 0.1,
            language: localStorage.getItem('ggenius-language') || 'uk'
        };

        // Решта властивостей залишається така ж...
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

    // Весь решта код GGeniusApp залишається такий же як в попередній версії...
    // [Тут увесь код з попередньої версії]
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
    
    /* Content error handling */
    .content-error {
        color: var(--pink);
        font-style: italic;
        opacity: 0.8;
    }
    
    .content-error::before {
        content: "⚠️ ";
    }
    
    /* Mobile responsive text */
    @media (max-width: 768px) {
        [data-content] {
            font-size: 0.95em;
        }
        
        .language-switcher {
            gap: 0.25rem;
        }
        
        .language-switcher button {
            padding: 0.3rem 0.6rem;
            font-size: 0.75rem;
        }
    }
    
    /* High contrast mode support */
    @media (prefers-contrast: high) {
        .gradient-text {
            -webkit-text-fill-color: var(--cyan);
            background: none;
        }
    }
    
    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
        [data-content] {
            transition: opacity 0.1s ease;
        }
        
        .language-switcher button {
            transition: background-color 0.1s ease, color 0.1s ease;
        }
        
        .language-switcher button:hover {
            transform: none;
        }
    }
    
    /* Debug mode styles */
    .debug-mode [data-content] {
        outline: 1px dashed var(--yellow);
        position: relative;
    }
    
    .debug-mode [data-content]::after {
        content: attr(data-content);
        position: absolute;
        top: -20px;
        left: 0;
        font-size: 10px;
        color: var(--yellow);
        background: var(--bg-1);
        padding: 2px 4px;
        border-radius: 2px;
        white-space: nowrap;
        z-index: 1000;
        pointer-events: none;
    }
`;

document.head.appendChild(enhancedStyle);

// Ініціалізація з розширеною підтримкою lang файлів
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.app = new GGeniusApp();
        
        // Debug mode для розробки
        if (localStorage.getItem('ggenius-debug') === 'true') {
            document.documentElement.classList.add('debug-mode');
            console.log('🔧 Debug mode enabled');
        }
    });
} else {
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
    
    reloadContent() {
        return window.app?.contentManager?.loadContent();
    }
};

// Експорт для використання в інших модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GGeniusApp, ContentManager };
            }
