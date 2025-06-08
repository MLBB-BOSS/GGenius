/**
 * GGenius Content Management System
 * Система управління контентом для динамічного завантаження тексту
 * @version 1.0.0
 */

class ContentManager {
    constructor() {
        this.content = new Map();
        this.currentLanguage = 'uk';
        this.fallbackLanguage = 'en';
        this.isLoaded = false;
        this.loadingPromise = null;
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
     * Завантаження контенту з JSON файлів
     */
    async loadContent() {
        try {
            console.log('🔄 Loading content...');
            
            const [ukContent, enContent] = await Promise.all([
                this.fetchContentFile('uk'),
                this.fetchContentFile('en')
            ]);

            this.content.set('uk', ukContent);
            this.content.set('en', enContent);
            
            this.isLoaded = true;
            console.log('✅ Content loaded successfully');
            
            // Відразу застосовуємо контент до сторінки
            this.applyContentToPage();
            
            return true;
        } catch (error) {
            console.error('❌ Failed to load content:', error);
            this.fallbackToStaticContent();
            return false;
        }
    }

    /**
     * Завантаження файлу контенту
     */
    async fetchContentFile(language) {
        const response = await fetch(`/static/data/content-${language}.json`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch ${language} content: ${response.status}`);
        }

        const text = await response.text();
        
        // Перевіряємо, чи це валідний JSON
        try {
            return JSON.parse(text);
        } catch (parseError) {
            console.error(`Invalid JSON in ${language} content:`, parseError);
            throw parseError;
        }
    }

    /**
     * Застосування контенту до сторінки
     */
    applyContentToPage() {
        if (!this.isLoaded) {
            console.warn('Content not loaded yet');
            return;
        }

        const currentContent = this.getCurrentContent();
        
        // Знаходимо всі елементи з атрибутом data-content
        document.querySelectorAll('[data-content]').forEach(element => {
            const contentKey = element.getAttribute('data-content');
            const content = this.getContentByKey(contentKey, currentContent);
            
            if (content) {
                this.setElementContent(element, content);
            } else {
                console.warn(`Content not found for key: ${contentKey}`);
            }
        });

        // Оновлюємо мета-дані
        this.updateMetaData(currentContent);
        
        // Диспетчер події про завершення завантаження контенту
        document.dispatchEvent(new CustomEvent('content:loaded', {
            detail: { language: this.currentLanguage }
        }));
    }

    /**
     * Встановлення контенту для елемента
     */
    setElementContent(element, content) {
        const contentType = element.getAttribute('data-content-type') || 'text';
        
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
            default:
                element.textContent = content;
        }

        // Додаємо клас для анімації появи
        element.classList.add('content-loaded');
    }

    /**
     * Отримання контенту за ключем
     */
    getContentByKey(key, content) {
        const keys = key.split('.');
        let current = content;
        
        for (const k of keys) {
            if (current && typeof current === 'object' && k in current) {
                current = current[k];
            } else {
                return null;
            }
        }
        
        return current;
    }

    /**
     * Отримання поточного контенту
     */
    getCurrentContent() {
        return this.content.get(this.currentLanguage) || 
               this.content.get(this.fallbackLanguage) || {};
    }

    /**
     * Зміна мови
     */
    async setLanguage(language) {
        if (this.currentLanguage === language) {
            return;
        }

        this.currentLanguage = language;
        
        // Зберігаємо вибір мови
        localStorage.setItem('ggenius-language', language);
        
        // Оновлюємо атрибут lang у HTML
        document.documentElement.lang = language;
        
        // Якщо контент уже завантажений, застосовуємо його
        if (this.isLoaded) {
            this.applyContentToPage();
        }
    }

    /**
     * Оновлення мета-даних
     */
    updateMetaData(content) {
        if (content.meta) {
            // Оновлюємо title
            if (content.meta.title) {
                document.title = content.meta.title;
            }
            
            // Оновлюємо meta description
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription && content.meta.description) {
                metaDescription.content = content.meta.description;
            }
        }
    }

    /**
     * Резервний режим з статичним контентом
     */
    fallbackToStaticContent() {
        console.log('🔄 Using fallback static content');
        
        // Показуємо всі елементи з класом fallback-text
        document.querySelectorAll('.fallback-text').forEach(element => {
            element.style.display = 'block';
        });
        
        // Приховуємо елементи з data-content, які не мають fallback
        document.querySelectorAll('[data-content]:not(.fallback-text)').forEach(element => {
            if (!element.textContent.trim()) {
                element.style.display = 'none';
            }
        });
    }

    /**
     * Отримання тексту за ключем
     */
    getText(key, variables = {}) {
        if (!this.isLoaded) {
            return key; // Повертаємо ключ як fallback
        }

        const content = this.getCurrentContent();
        let text = this.getContentByKey(key, content);
        
        if (!text) {
            console.warn(`Text not found for key: ${key}`);
            return key;
        }

        // Замінюємо змінні в тексті
        return this.interpolateVariables(text, variables);
    }

    /**
     * Інтерполяція змінних у тексті
     */
    interpolateVariables(text, variables) {
        return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return variables[key] || match;
        });
    }

    /**
     * Перевірка, чи завантажений контент
     */
    isContentLoaded() {
        return this.isLoaded;
    }
}

// Експортуємо клас
window.ContentManager = ContentManager;
