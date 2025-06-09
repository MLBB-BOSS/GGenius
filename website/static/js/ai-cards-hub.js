/**
 * AI Cards Hub Revolution - Interactive Card System
 * @version 3.0.0 - GGenius Integration
 * @author MLBB-BOSS  
 * @date 2025-06-09
 * @description Революційна система AI карток інтегрована з GGenius Core
 * 
 * Performance optimized, ES2023 compatible, Mobile-first approach
 */

'use strict';

/**
 * 🔧 ІНТЕГРОВАНА КОНФІГУРАЦІЯ - Використовує GGENIUS_CONFIG
 */
const getAICardsConfig = () => {
    // Використовуємо глобальну конфігурацію або fallback
    const globalConfig = window.GGENIUS_CONFIG || {};
    
    return {
        // API інтеграція
        API_BASE: globalConfig.API?.BASE_URL || '/api',
        
        // Анімації - синхронізовано з глобальною конфігурацією
        ANIMATION: {
            FLIP_DURATION: globalConfig.ANIMATION?.DURATION_SLOW || 600,
            STAGGER_DELAY: globalConfig.ANIMATION?.STAGGER_DELAY || 100,
            HOVER_SCALE: 1.02,
            DRAG_SCALE: 1.1,
            EASING: globalConfig.ANIMATION?.EASING_SMOOTH || 'cubic-bezier(0.4, 0, 0.2, 1)'
        },
        
        // Взаємодія - синхронізовано
        INTERACTION: {
            DRAG_THRESHOLD: globalConfig.INTERACTION?.TOUCH_THRESHOLD || 8,
            DOUBLE_CLICK_DELAY: globalConfig.INTERACTION?.DOUBLE_TAP_DELAY || 300,
            DEBOUNCE_DELAY: globalConfig.INTERACTION?.DEBOUNCE_SEARCH || 250
        },
        
        // Зберігання - використовуємо глобальні префікси
        STORAGE: {
            SESSION_KEY: (globalConfig.STORAGE?.PREFIX || 'ggenius_v3_') + 'cards-hub',
            STATS_KEY: (globalConfig.STORAGE?.PREFIX || 'ggenius_v3_') + 'stats'
        },
        
        // Accessibility
        ACCESSIBILITY: {
            FOCUS_VISIBLE_TIMEOUT: globalConfig.A11Y?.FOCUS_TIMEOUT || 150,
            ANNOUNCE_DELAY: globalConfig.A11Y?.ANNOUNCE_DELAY || 100,
            REDUCED_MOTION: globalConfig.ANIMATION?.REDUCED_MOTION || false
        },
        
        // Z-Index координація
        Z_INDEX: {
            CARD_OVERLAY: 1499,
            CARD_EXPANDED: 1500,
            NOTIFICATION: 2000
        }
    };
};

// Ініціалізуємо конфігурацію
const CONFIG = getAICardsConfig();

/**
 * 🔧 АДАПТЕР УТИЛІТ - Використовує GGeniusUtils з fallback
 */
class AICardsUtils {
    static get core() {
        return window.GGeniusUtils || window.GGenius?.utils || null;
    }
    
    static debounce(func, wait, options = {}) {
        if (this.core) {
            return this.core.debounce(func, wait, options);
        }
        
        // Fallback реалізація
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit, options = {}) {
        if (this.core) {
            return this.core.throttle(func, limit, options);
        }
        
        // Fallback реалізація
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    static delay(ms, signal) {
        if (this.core) {
            return this.core.delay(ms, signal);
        }
        
        // Fallback реалізація
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static sanitizeHTML(html, options = {}) {
        if (this.core) {
            return this.core.sanitizeHTML(html, options);
        }
        
        // Fallback - базове escape
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    }

    static generateId(prefix = 'card', options = {}) {
        if (this.core) {
            return this.core.generateId(prefix, options);
        }
        
        // Fallback реалізація
        return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    static addEventListenerSafe(element, type, listener, options = {}) {
        if (this.core) {
            return this.core.addEventListenerSafe(element, type, listener, options);
        }
        
        // Fallback - звичайний addEventListener
        element.addEventListener(type, listener, options);
        return null;
    }

    static getDeviceCapabilities() {
        if (this.core) {
            return this.core.getDeviceCapabilities();
        }
        
        // Fallback - базова детекція
        return {
            performanceTier: 'medium',
            device: {
                isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
                isTablet: false,
                isDesktop: true
            },
            features: {
                webGL: !!document.createElement('canvas').getContext('webgl'),
                intersectionObserver: 'IntersectionObserver' in window,
                resizeObserver: 'ResizeObserver' in window
            }
        };
    }

    static escapeHtml(text) {
        return this.sanitizeHTML(text);
    }

    static checkBrowserSupport() {
        const features = {
            'CSS Transform 3D': 'transform' in document.documentElement.style,
            'CSS Transitions': 'transition' in document.documentElement.style,
            'Backdrop Filter': 'backdropFilter' in document.documentElement.style,
            'Fetch API': typeof fetch !== 'undefined',
            'Intersection Observer': 'IntersectionObserver' in window,
            'ResizeObserver': 'ResizeObserver' in window
        };

        const unsupported = Object.entries(features)
            .filter(([, supported]) => !supported)
            .map(([feature]) => feature);

        if (unsupported.length > 0) {
            console.warn('⚠️ Непідтримувані функції:', unsupported);
            return { supported: false, missing: unsupported };
        }

        return { supported: true, missing: [] };
    }

    static getSessionData(key) {
        if (this.core) {
            return this.core.getSecureStorage(key.replace(CONFIG.STORAGE.SESSION_KEY, ''));
        }
        
        // Fallback
        try {
            const data = sessionStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.warn('Помилка читання sessionStorage:', error);
            return null;
        }
    }

    static setSessionData(key, data) {
        if (this.core) {
            return this.core.setSecureStorage(key.replace(CONFIG.STORAGE.SESSION_KEY, ''), data);
        }
        
        // Fallback
        try {
            sessionStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.warn('Помилка запису sessionStorage:', error);
            return false;
        }
    }
}

// Backward compatibility
const Utils = AICardsUtils;

/**
 * Менеджер подій з автоматичним очищенням
 */
class EventManager {
    constructor() {
        this.listeners = new Map();
        this.abortController = new AbortController();
    }

    addEventListener(element, event, handler, options = {}) {
        if (!element || typeof handler !== 'function') {
            console.warn('Невалідні параметри для addEventListener');
            return;
        }

        const finalOptions = {
            ...options,
            signal: this.abortController.signal
        };

        element.addEventListener(event, handler, finalOptions);

        const key = `${element.constructor.name}-${event}-${Date.now()}`;
        this.listeners.set(key, { element, event, handler });

        return key;
    }

    removeEventListener(key) {
        const listener = this.listeners.get(key);
        if (listener) {
            listener.element.removeEventListener(listener.event, listener.handler);
            this.listeners.delete(key);
        }
    }

    cleanup() {
        this.abortController.abort();
        this.listeners.clear();
    }
}

/**
 * Система нотифікацій
 */
class NotificationSystem {
    constructor() {
        this.container = this.createContainer();
        this.notifications = new Map();
    }

    createContainer() {
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'notification-container';
            container.setAttribute('aria-live', 'polite');
            document.body.appendChild(container);
        }
        return container;
    }

    show(message, type = 'info', duration = 4000) {
        const id = Utils.generateId('notification');
        const notification = this.createNotification(message, type, id);
        
        this.container.appendChild(notification);
        this.notifications.set(id, notification);

        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        setTimeout(() => this.hide(id), duration);

        return id;
    }

    createNotification(message, type, id) {
        const notification = document.createElement('div');
        notification.id = id;
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-message">${Utils.sanitizeHTML(message)}</span>
            <button class="notification-close" aria-label="Закрити повідомлення">×</button>
        `;

        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => this.hide(id));

        return notification;
    }

    hide(id) {
        const notification = this.notifications.get(id);
        if (!notification) return;

        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            this.notifications.delete(id);
        }, 300);
    }

    clear() {
        this.notifications.forEach((_, id) => this.hide(id));
    }
}

/**
 * Менеджер статистики
 */
class StatsManager {
    constructor() {
        this.stats = this.loadStats();
        this.startTime = Date.now();
    }

    loadStats() {
        return Utils.getSessionData(CONFIG.STORAGE.STATS_KEY) || {
            totalFlips: 0,
            aiInteractions: 0,
            successfulActions: 0,
            sessionCount: 0,
            totalTime: 0,
            cardExpansions: 0
        };
    }

    saveStats() {
        this.stats.totalTime += Date.now() - this.startTime;
        Utils.setSessionData(CONFIG.STORAGE.STATS_KEY, this.stats);
    }

    increment(key, value = 1) {
        if (key in this.stats) {
            this.stats[key] += value;
            this.updateDisplay(key);
            this.saveStats();
        }
    }

    get(key) {
        return this.stats[key] || 0;
    }

    getSuccessRate() {
        const total = this.stats.aiInteractions;
        return total > 0 ? Math.round((this.stats.successfulActions / total) * 100) : 0;
    }

    getSessionTime() {
        const totalMs = Date.now() - this.startTime;
        const minutes = Math.floor(totalMs / 60000);
        const seconds = Math.floor((totalMs % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    updateDisplay(key) {
        const element = document.getElementById(key.replace(/([A-Z])/g, '-$1').toLowerCase());
        if (element) {
            const value = key === 'successRate' ? this.getSuccessRate() + '%' : 
                          key === 'sessionTime' ? this.getSessionTime() : 
                          this.stats[key];
            element.textContent = value;
        }
    }

    updateAllDisplays() {
        Object.keys(this.stats).forEach(key => this.updateDisplay(key));
        this.updateDisplay('successRate');
        this.updateDisplay('sessionTime');
    }
}

/**
 * 🎮 РОЗШИРЕНИЙ AI CARDS HUB - З інтеграцією GGenius
 */
class AICardsHub {
    constructor(options = {}) {
        // Інтеграційні компоненти
        this.performanceMonitor = null;
        this.webWorkerManager = null;
        this.parentApp = null;
        
        // Існуючі компоненти
        this.eventManager = new EventManager();
        this.notifications = new NotificationSystem();
        this.stats = new StatsManager();
        
        this.state = {
            cards: new Map(),
            expandedCard: null,
            draggedCard: null,
            viewMode: options.viewMode || 'grid',
            isLoading: false,
            isInitialized: false,
            integrationMode: !!window.GGenius // Детекція інтеграційного режиму
        };

        this.elements = {};
        this.intersectionObserver = null;
        this.focusTrapHandler = null;
        this.escapeHandler = null;
        this.overlayClickHandler = null;

        // Автоматична інтеграція з GGenius
        this.autoIntegrate();

        this.init().catch(error => {
            console.error('❌ Критична помилка ініціалізації:', error);
            this.handleCriticalError(error);
        });
    }

    /**
     * 🔗 АВТОМАТИЧНА ІНТЕГРАЦІЯ З GGENIUS
     */
    autoIntegrate() {
        if (window.GGenius) {
            this.parentApp = window.GGenius;
            
            // Автоматично підключаємо performance monitor
            if (window.GGenius.performance) {
                this.setPerformanceMonitor(window.GGenius.performance);
            }
            
            // Автоматично підключаємо web worker manager
            if (window.GGenius.webWorker) {
                this.setWebWorkerManager(window.GGenius.webWorker);
            }
            
            console.log('🔗 AI Cards Hub автоматично інтегровано з GGenius');
        }
    }

    /**
     * 📊 ВСТАНОВЛЕННЯ PERFORMANCE MONITOR
     */
    setPerformanceMonitor(monitor) {
        this.performanceMonitor = monitor;
        console.log('📊 Performance Monitor підключено до AI Cards Hub');
        
        // Інтегруємо метрики
        this.recordMetric = (name, data) => {
            if (this.performanceMonitor) {
                this.performanceMonitor.recordMetric(`cards_${name}`, data);
            }
        };
    }

    /**
     * ⚡ ВСТАНОВЛЕННЯ WEB WORKER MANAGER
     */
    setWebWorkerManager(manager) {
        this.webWorkerManager = manager;
        console.log('⚡ Web Worker Manager підключено до AI Cards Hub');
    }

    /**
     * 🚀 РОЗШИРЕНА ІНІЦІАЛІЗАЦІЯ
     */
    async init() {
        try {
            console.log('🚀 Ініціалізація AI Cards Hub v3.0 (GGenius Integration)...');

            // Записуємо метрику початку ініціалізації
            this.recordMetric('initialization_start', { timestamp: performance.now() });

            const browserCheck = AICardsUtils.checkBrowserSupport();
            if (!browserCheck.supported) {
                this.showFallbackMode(browserCheck.missing);
                return;
            }

            // Детекція device capabilities через GGenius або fallback
            const deviceCapabilities = AICardsUtils.getDeviceCapabilities();
            this.recordMetric('device_capabilities', deviceCapabilities);

            this.initializeDOM();
            this.setupObservers();
            this.setupEventListeners();
            await this.loadCards();

            this.state.isInitialized = true;
            this.stats.increment('sessionCount');
            
            // Записуємо метрику завершення ініціалізації
            const initTime = performance.now();
            this.recordMetric('initialization_complete', { 
                timestamp: initTime,
                duration: initTime 
            });

            // Повідомляємо батьківський додаток про готовність
            if (this.parentApp) {
                this.parentApp.dispatchEvent('cards:initialized', {
                    module: 'aiCards',
                    initTime: initTime
                });
            }
            
            this.notifications.show('🎮 AI Cards Hub готовий до роботи!', 'success');
            console.log('✅ AI Cards Hub успішно ініціалізовано');
        } catch (error) {
            this.recordMetric('initialization_error', { 
                error: error.message,
                stack: error.stack 
            });
            console.error('❌ Помилка ініціалізації:', error);
            throw error;
        }
    }

    initializeDOM() {
        this.elements = {
            container: document.getElementById('ai-cards-container'),
            grid: document.getElementById('cards-hub-grid'),
            loading: document.getElementById('cards-loading'),
            empty: document.getElementById('cards-empty'),
            controls: document.querySelector('.cards-hub-controls'),
            overlay: this.getOrCreateOverlay()
        };

        if (!this.elements.container || !this.elements.grid) {
            throw new Error('Відсутні критичні DOM елементи для AI Cards Hub');
        }

        this.setupAccessibility();
    }

    getOrCreateOverlay() {
        let overlay = document.getElementById('card-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'card-overlay';
            overlay.className = 'card-overlay';
            overlay.setAttribute('aria-hidden', 'true');
            document.body.appendChild(overlay);
        }
        return overlay;
    }

    setupAccessibility() {
        const { grid } = this.elements;
        
        grid.setAttribute('role', 'grid');
        grid.setAttribute('aria-label', 'AI Cards Hub - Інтерактивні картки');
        grid.setAttribute('tabindex', '0');

        if (!document.getElementById('sr-announcements')) {
            const announcer = document.createElement('div');
            announcer.id = 'sr-announcements';
            announcer.className = 'sr-only';
            announcer.setAttribute('aria-live', 'polite');
            announcer.setAttribute('aria-atomic', 'true');
            document.body.appendChild(announcer);
        }
    }

    setupObservers() {
        if ('IntersectionObserver' in window) {
            this.intersectionObserver = new IntersectionObserver(
                this.handleIntersection.bind(this),
                { rootMargin: '50px', threshold: 0.1 }
            );
        }

        if ('ResizeObserver' in window) {
            this.resizeObserver = new ResizeObserver(
                Utils.throttle(this.handleResize.bind(this), 250)
            );
            this.resizeObserver.observe(this.elements.container);
        }
    }

    setupEventListeners() {
        const { grid, controls } = this.elements;

        this.eventManager.addEventListener(grid, 'click', this.handleCardClick.bind(this));
        this.eventManager.addEventListener(grid, 'dblclick', this.handleCardDoubleClick.bind(this));
        this.eventManager.addEventListener(grid, 'keydown', this.handleKeyNavigation.bind(this));
        this.eventManager.addEventListener(document, 'keydown', this.handleGlobalKeys.bind(this));
        this.eventManager.addEventListener(document, 'visibilitychange', this.handleVisibilityChange.bind(this));
        this.eventManager.addEventListener(window, 'beforeunload', this.saveState.bind(this));

        this.setupDragAndDrop();

        if (controls) {
            this.setupControlsEvents();
        }
    }

    setupControlsEvents() {
        const controlActions = {
            'cards-refresh': () => this.refreshCards(),
            'cards-shuffle': () => this.shuffleCards(),
            'cards-reset': () => this.resetCards(),
            'cards-fullscreen': () => this.toggleFullscreen()
        };

        Object.entries(controlActions).forEach(([id, action]) => {
            const element = document.getElementById(id);
            if (element) {
                this.eventManager.addEventListener(element, 'click', action);
            }
        });

        const viewModeButtons = document.querySelectorAll('.view-mode-btn');
        viewModeButtons.forEach(btn => {
            this.eventManager.addEventListener(btn, 'click', (e) => {
                this.setViewMode(e.target.dataset.view);
            });
        });
    }

    setupDragAndDrop() {
        let dragState = {
            isDragging: false,
            startPos: { x: 0, y: 0 },
            currentCard: null
        };

        this.eventManager.addEventListener(this.elements.grid, 'mousedown', (e) => {
            const card = e.target.closest('.ai-card');
            if (!card || card.classList.contains('expanded')) return;

            dragState.startPos = { x: e.clientX, y: e.clientY };
            dragState.currentCard = card;
            card.style.cursor = 'grabbing';
        });

        this.eventManager.addEventListener(document, 'mousemove', (e) => {
            if (!dragState.currentCard) return;

            const distance = Math.sqrt(
                Math.pow(e.clientX - dragState.startPos.x, 2) + 
                Math.pow(e.clientY - dragState.startPos.y, 2)
            );

            if (distance > CONFIG.INTERACTION.DRAG_THRESHOLD && !dragState.isDragging) {
                dragState.isDragging = true;
                this.startDrag(dragState.currentCard);
            }

            if (dragState.isDragging) {
                this.updateDragPosition(dragState.currentCard, e);
            }
        });

        this.eventManager.addEventListener(document, 'mouseup', (e) => {
            if (dragState.isDragging) {
                this.endDrag(dragState.currentCard, e);
            }
            this.resetDragState(dragState);
        });

        this.setupTouchDrag(dragState);
    }

    setupTouchDrag(dragState) {
        this.eventManager.addEventListener(this.elements.grid, 'touchstart', (e) => {
            const card = e.target.closest('.ai-card');
            if (!card || card.classList.contains('expanded')) return;

            const touch = e.touches[0];
            dragState.startPos = { x: touch.clientX, y: touch.clientY };
            dragState.currentCard = card;
        }, { passive: true });

        this.eventManager.addEventListener(document, 'touchmove', (e) => {
            if (!dragState.currentCard) return;

            const touch = e.touches[0];
            const distance = Math.sqrt(
                Math.pow(touch.clientX - dragState.startPos.x, 2) + 
                Math.pow(touch.clientY - dragState.startPos.y, 2)
            );

            if (distance > CONFIG.INTERACTION.DRAG_THRESHOLD && !dragState.isDragging) {
                dragState.isDragging = true;
                this.startDrag(dragState.currentCard);
            }

            if (dragState.isDragging) {
                this.updateDragPosition(dragState.currentCard, touch);
                e.preventDefault();
            }
        }, { passive: false });

        this.eventManager.addEventListener(document, 'touchend', (e) => {
            if (dragState.isDragging) {
                const touch = e.changedTouches[0];
                this.endDrag(dragState.currentCard, touch);
            }
            this.resetDragState(dragState);
        });
    }

    async loadCards() {
        if (this.state.isLoading) return;

        try {
            this.state.isLoading = true;
            this.showLoadingState();

            const cardsData = await this.fetchCardsData();
            
            if (!cardsData?.length) {
                this.showEmptyState();
                return;
            }

            await this.renderCards(cardsData);
            this.updateCardsCounter(cardsData.length);
            this.hideLoadingState();

            this.announceToScreenReader(`Завантажено ${cardsData.length} AI карток`);
        } catch (error) {
            console.error('Помилка завантаження карток:', error);
            this.notifications.show('Не вдалося завантажити картки', 'error');
            this.showEmptyState();
        } finally {
            this.state.isLoading = false;
        }
    }

    async fetchCardsData() {
        try {
            const response = await fetch(`${CONFIG.API_BASE}/cards`, {
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                const data = await response.json();
                return data.cards || data;
            }

            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        } catch (error) {
            console.warn('API недоступний, використовуємо mock дані:', error);
            return this.getMockCardsData();
        }
    }

    getMockCardsData() {
        return [
            {
                id: 'guides_card',
                type: 'guides',
                title: 'Гайди героїв',
                description: 'Актуальні гайди та мета аналіз',
                icon: '🎯',
                status: 'active',
                statusText: '12 нових гайдів',
                priority: 1
            },
            {
                id: 'tournaments_card', 
                type: 'tournaments',
                title: 'Турніри',
                description: 'Наступний матч через 1д 2г',
                icon: '⚔️',
                status: 'active',
                statusText: 'Зареєстровано',
                priority: 2
            },
            {
                id: 'team_finder_card',
                type: 'team-finder', 
                title: 'Пошук команди',
                description: '3 запрошення активні',
                icon: '💬',
                status: 'pending',
                statusText: 'Нові повідомлення',
                priority: 3
            },
            {
                id: 'analytics_card',
                type: 'analytics',
                title: 'Аналітика',
                description: 'KDA 3.2, WinRate 68%',
                icon: '📊', 
                status: 'active',
                statusText: 'Оновлено',
                priority: 4
            }
        ];
    }

    async renderCards(cardsData) {
        const fragment = document.createDocumentFragment();
        
        this.clearCards();

        for (let i = 0; i < cardsData.length; i++) {
            const cardData = cardsData[i];
            const cardElement = this.createCardElement(cardData, i);
            
            this.state.cards.set(cardData.id, {
                element: cardElement,
                data: cardData,
                isFlipped: false,
                actionsLoaded: false
            });

            fragment.appendChild(cardElement);

            if (this.intersectionObserver) {
                this.intersectionObserver.observe(cardElement);
            }
        }

        this.elements.grid.appendChild(fragment);
        await this.animateCardsEntrance();
    }

    createCardElement(cardData, index) {
        const card = document.createElement('div');
        card.className = `ai-card card-type-${cardData.type}`;
        card.dataset.cardId = cardData.id;
        card.style.animationDelay = `${index * CONFIG.ANIMATION.STAGGER_DELAY}ms`;
        
        card.setAttribute('role', 'gridcell');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `${cardData.title}: ${cardData.description}`);

        card.innerHTML = `
            <div class="card-face card-front">
                <div class="card-icon" aria-hidden="true">${cardData.icon}</div>
                <div class="card-title">${Utils.sanitizeHTML(cardData.title)}</div>
                <div class="card-description">${Utils.sanitizeHTML(cardData.description)}</div>
                <div class="card-status">
                    <div class="status-indicator" aria-label="Статус: ${cardData.status}"></div>
                    <div class="status-text">${Utils.sanitizeHTML(cardData.statusText)}</div>
                </div>
            </div>
            <div class="card-face card-back">
                <div class="card-actions" role="list" aria-label="Дії картки"></div>
            </div>
        `;

        return card;
    }

    async animateCardsEntrance() {
        const cards = this.elements.grid.querySelectorAll('.ai-card');
        
        for (let i = 0; i < cards.length; i++) {
            await Utils.delay(CONFIG.ANIMATION.STAGGER_DELAY);
            cards[i].classList.add('animate-in');
        }
    }

    async handleCardClick(event) {
        const card = event.target.closest('.ai-card');
        if (!card) return;

        const cardId = card.dataset.cardId;
        const cardState = this.state.cards.get(cardId);

        if (!cardState) return;

        const actionButton = event.target.closest('.action-button');
        if (actionButton) {
            await this.handleActionClick(actionButton, cardState);
            return;
        }

        const closeButton = event.target.closest('.close-card');
        if (closeButton) {
            this.closeExpandedCard();
            return;
        }

        await this.flipCard(card, cardState);
    }

    async flipCard(cardElement, cardState) {
        if (cardElement.classList.contains('expanded') || this.state.isLoading) return;

        const startTime = performance.now();

        try {
            this.stats.increment('totalFlips');
            this.recordMetric('card_flip_start', { 
                cardId: cardState.data.id,
                cardType: cardState.data.type 
            });
            
            cardState.isFlipped = !cardState.isFlipped;
            cardElement.classList.toggle('flipped', cardState.isFlipped);

            if (cardState.isFlipped && !cardState.actionsLoaded) {
                // Використовуємо web workers для завантаження дій (якщо доступні)
                if (this.webWorkerManager) {
                    const actions = await this.webWorkerManager.processAIData({
                        action: 'loadCardActions',
                        cardId: cardState.data.id,
                        cardData: cardState.data
                    });
                    
                    if (actions) {
                        await this.renderCardActions(cardElement, cardState, actions);
                    } else {
                        await this.loadCardActions(cardElement, cardState);
                    }
                } else {
                    await this.loadCardActions(cardElement, cardState);
                }
            }

            const flipDuration = performance.now() - startTime;
            this.recordMetric('card_flip_complete', { 
                cardId: cardState.data.id,
                duration: flipDuration,
                isFlipped: cardState.isFlipped 
            });

            const status = cardState.isFlipped ? 'перевернута' : 'повернута';
            this.announceToScreenReader(`Картка ${cardState.data.title} ${status}`);
        } catch (error) {
            this.recordMetric('card_flip_error', { 
                cardId: cardState.data.id,
                error: error.message 
            });
            console.error('Помилка flip картки:', error);
            this.notifications.show('Помилка перевертання картки', 'error');
        }
    }

    async loadCardActions(cardElement, cardState) {
        const actionsContainer = cardElement.querySelector('.card-actions');
        if (!actionsContainer) return;

        try {
            actionsContainer.innerHTML = '<div class="loading-actions">⏳ Завантаження...</div>';

            const actions = await this.fetchCardActions(cardState.data.id);
            
            actionsContainer.innerHTML = '';

            actions.forEach(action => {
                const button = this.createActionButton(action);
                actionsContainer.appendChild(button);
            });

            const aiResponse = document.createElement('div');
            aiResponse.className = 'ai-response';
            aiResponse.textContent = 'AI готовий допомогти...';
            actionsContainer.appendChild(aiResponse);

            cardState.actionsLoaded = true;
        } catch (error) {
            console.error('Помилка завантаження дій:', error);
            actionsContainer.innerHTML = '<div class="error-actions">❌ Помилка завантаження</div>';
        }
    }

    async renderCardActions(cardElement, cardState, actions) {
        const actionsContainer = cardElement.querySelector('.card-actions');
        if (!actionsContainer) return;

        try {
            actionsContainer.innerHTML = '';

            actions.forEach(action => {
                const button = this.createActionButton(action);
                actionsContainer.appendChild(button);
            });

            // AI Response з поліпшеною обробкою
            const aiResponse = document.createElement('div');
            aiResponse.className = 'ai-response enhanced';
            aiResponse.innerHTML = `
                <div class="ai-status">
                    <span class="ai-indicator">🤖</span>
                    <span class="ai-text">AI готовий допомогти...</span>
                </div>
            `;
            actionsContainer.appendChild(aiResponse);

            cardState.actionsLoaded = true;
            
            // Анімація появи дій
            await this.animateActionsAppearance(actionsContainer);
            
        } catch (error) {
            console.error('Помилка рендерингу дій:', error);
            actionsContainer.innerHTML = '<div class="error-actions">❌ Помилка завантаження</div>';
        }
    }

    async animateActionsAppearance(container) {
        const actions = container.querySelectorAll('.action-button');
        
        actions.forEach((action, index) => {
            action.style.opacity = '0';
            action.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                action.style.transition = `all ${CONFIG.ANIMATION.FLIP_DURATION / 2}ms ${CONFIG.ANIMATION.EASING}`;
                action.style.opacity = '1';
                action.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }

    async fetchCardActions(cardId) {
        try {
            const response = await fetch(`${CONFIG.API_BASE}/cards/${cardId}/actions`);
            if (response.ok) {
                const data = await response.json();
                return data.actions || [];
            }
        } catch (error) {
            console.warn('API недоступний для дій, використовуємо mock:', error);
        }

        return this.getMockActions(cardId);
    }

    getMockActions(cardId) {
        const actionsMap = {
            'guides_card': [
                { text: '🎯 PDF гайд', action: 'download-guide', primary: true },
                { text: '🤖 AI аналіз', action: 'ai-analysis' },
                { text: '📊 Мета історія', action: 'meta-history' }
            ],
            'tournaments_card': [
                { text: '🏆 Реєстрація', action: 'register', primary: true },
                { text: '📋 Сітка', action: 'bracket' },
                { text: '📈 Прогрес', action: 'progress' }
            ],
            'team_finder_card': [
                { text: '👥 Знайти команду', action: 'find-team', primary: true },
                { text: '⚙️ Фільтри', action: 'filters' },
                { text: '💬 Повідомлення', action: 'message' }
            ],
            'analytics_card': [
                { text: '📊 Звіт', action: 'detailed-report', primary: true },
                { text: '📈 Тренди', action: 'trends' },
                { text: '🎯 Поради', action: 'improvements' }
            ]
        };

        return actionsMap[cardId] || [];
    }

    createActionButton(actionData) {
        const button = document.createElement('button');
        button.className = `action-button ${actionData.primary ? 'primary' : ''}`;
        button.textContent = actionData.text;
        button.dataset.action = actionData.action;
        button.setAttribute('role', 'listitem');
        button.setAttribute('aria-label', actionData.text);
        
        return button;
    }

    async handleActionClick(button, cardState) {
        const action = button.dataset.action;
        const originalText = button.textContent;

        try {
            button.disabled = true;
            button.textContent = '⏳ Обробка...';

            const result = await this.executeAction(action, cardState.data);

            this.stats.increment('aiInteractions');
            this.stats.increment('successfulActions');

            this.showActionResult(cardState, result);
            this.notifications.show(`Дію "${originalText}" виконано успішно!`, 'success');
        } catch (error) {
            console.error('Помилка виконання дії:', error);
            this.notifications.show('Помилка виконання дії', 'error');
        } finally {
            button.disabled = false;
            button.textContent = originalText;
        }
    }

    async executeAction(action, cardData) {
        try {
            // Спробуємо використати web workers для AI обробки
            if (this.webWorkerManager && action.includes('ai')) {
                this.recordMetric('action_execution_webworker', { 
                    action, 
                    cardId: cardData.id 
                });
                
                const result = await this.webWorkerManager.processAIData({
                    action: action,
                    cardData: cardData,
                    timestamp: Date.now()
                });
                
                if (result) {
                    return result;
                }
            }

            // Fallback на звичайне API
            const response = await fetch(`${CONFIG.API_BASE}/cards/${cardData.id}/action`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, cardData })
            });

            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.warn('API недоступний, mock результат:', error);
        }

        await Utils.delay(Math.random() * 1000 + 500);
        return this.getMockActionResult(action, cardData);
    }

    getMockActionResult(action, cardData) {
        const results = {
            'ai-analysis': {
                type: 'ai-response',
                message: `AI аналіз для ${cardData.title} завершено`,
                recommendations: ['Покращити фарм', 'Більше teamfight', 'Оптимізувати білд']
            },
            'download-guide': {
                type: 'download',
                message: 'Гайд готовий до завантаження',
                filename: `guide_${cardData.type}.pdf`
            },
            'register': {
                type: 'success',
                message: 'Успішно зареєстровано на турнір'
            }
        };

        return results[action] || { type: 'success', message: 'Дію виконано успішно' };
    }

    showActionResult(cardState, result) {
        const aiResponse = cardState.element.querySelector('.ai-response');
        if (!aiResponse) return;

        switch (result.type) {
            case 'ai-response':
                aiResponse.innerHTML = `
                    <strong>🤖 AI Результат:</strong><br>
                    ${result.message}<br>
                    ${result.recommendations ? result.recommendations.map(r => `• ${r}`).join('<br>') : ''}
                `;
                break;
            case 'download':
                aiResponse.innerHTML = `<strong>📥 ${result.message}</strong><br>Файл: ${result.filename}`;
                break;
            default:
                aiResponse.innerHTML = `<strong>✅ ${result.message}</strong>`;
        }
    }

    expandCard(cardElement) {
        if (this.state.expandedCard) {
            this.closeExpandedCard();
            return;
        }

        try {
            console.log('🔍 Розширення картки:', cardElement.dataset.cardId);

            if (!cardElement || cardElement.classList.contains('expanded')) {
                return;
            }

            const originalRect = cardElement.getBoundingClientRect();
            cardElement.dataset.originalPosition = JSON.stringify({
                top: originalRect.top,
                left: originalRect.left,
                width: originalRect.width,
                height: originalRect.height
            });

            this.elements.overlay.style.zIndex = CONFIG.Z_INDEX.CARD_OVERLAY;
            this.elements.overlay.classList.add('active');
            this.elements.overlay.setAttribute('aria-hidden', 'false');

            document.body.classList.add('modal-open');
            document.body.style.overflow = 'hidden';

            const closeButton = this.createCloseButton();
            cardElement.appendChild(closeButton);

            cardElement.classList.add('expanded');
            cardElement.setAttribute('aria-modal', 'true');
            cardElement.setAttribute('role', 'dialog');
            cardElement.setAttribute('aria-labelledby', cardElement.querySelector('.card-title')?.id || 'expanded-card-title');
            cardElement.style.zIndex = CONFIG.Z_INDEX.CARD_EXPANDED;

            this.state.expandedCard = cardElement;

            this.setupFocusTrap(cardElement);
            this.setupCloseHandlers(cardElement);

            setTimeout(() => {
                const firstFocusable = this.getFirstFocusableElement(cardElement);
                if (firstFocusable) {
                    firstFocusable.focus();
                } else {
                    closeButton.focus();
                }
            }, 100);

            const cardTitle = cardElement.querySelector('.card-title')?.textContent || 'картка';
            this.announceToScreenReader(`${cardTitle} розширена. Натисніть Escape або кнопку закриття для виходу`);

            this.stats.increment('cardExpansions');

            console.log('✅ Картка успішно розширена');
        } catch (error) {
            console.error('❌ Помилка розширення картки:', error);
            this.handleError(error, 'Не вдалося розширити картку');
            this.cleanupExpandedCard(cardElement);
        }
    }

    createCloseButton() {
        const closeButton = document.createElement('button');
        closeButton.className = 'close-card';
        closeButton.innerHTML = '×';
        closeButton.setAttribute('aria-label', 'Закрити розширену картку');
        closeButton.setAttribute('title', 'Закрити (Escape)');
        closeButton.type = 'button';

        const closeHandler = (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.closeExpandedCard();
        };

        closeButton.addEventListener('click', closeHandler);
        closeButton.addEventListener('touchend', closeHandler);

        closeButton._closeHandler = closeHandler;

        return closeButton;
    }

    setupCloseHandlers(cardElement) {
        this.escapeHandler = (event) => {
            if (event.key === 'Escape' && this.state.expandedCard === cardElement) {
                event.preventDefault();
                this.closeExpandedCard();
            }
        };

        this.overlayClickHandler = (event) => {
            if (event.target === this.elements.overlay) {
                event.preventDefault();
                this.closeExpandedCard();
            }
        };

        document.addEventListener('keydown', this.escapeHandler);
        this.elements.overlay.addEventListener('click', this.overlayClickHandler);
    }

    async closeExpandedCard() {
        if (!this.state.expandedCard) {
            return;
        }

        const cardElement = this.state.expandedCard;

        try {
            console.log('🔒 Закриття розширеної картки');

            cardElement.classList.add('closing');

            await new Promise(resolve => {
                const handleAnimationEnd = () => {
                    cardElement.removeEventListener('animationend', handleAnimationEnd);
                    resolve();
                };
                cardElement.addEventListener('animationend', handleAnimationEnd);

                setTimeout(resolve, 400);
            });

            this.cleanupExpandedCard(cardElement);

            console.log('✅ Картка успішно закрита');
        } catch (error) {
            console.error('❌ Помилка закриття картки:', error);
            this.cleanupExpandedCard(cardElement);
        }
    }

    cleanupExpandedCard(cardElement) {
        try {
            cardElement.classList.remove('expanded', 'closing');
            cardElement.removeAttribute('aria-modal');
            cardElement.removeAttribute('role');
            cardElement.removeAttribute('aria-labelledby');
            cardElement.style.zIndex = '';

            const closeButton = cardElement.querySelector('.close-card');
            if (closeButton) {
                if (closeButton._closeHandler) {
                    closeButton.removeEventListener('click', closeButton._closeHandler);
                    closeButton.removeEventListener('touchend', closeButton._closeHandler);
                }
                closeButton.remove();
            }

            this.elements.overlay.classList.remove('active');
            this.elements.overlay.setAttribute('aria-hidden', 'true');
            this.elements.overlay.style.zIndex = '';

            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';

            if (this.escapeHandler) {
                document.removeEventListener('keydown', this.escapeHandler);
                this.escapeHandler = null;
            }

            if (this.overlayClickHandler) {
                this.elements.overlay.removeEventListener('click', this.overlayClickHandler);
                this.overlayClickHandler = null;
            }

            this.cleanupFocusTrap(cardElement);

            setTimeout(() => {
                if (cardElement.focus) {
                    cardElement.focus();
                }
            }, 100);

            this.state.expandedCard = null;

            this.announceToScreenReader('Картка закрита');
        } catch (error) {
            console.error('❌ Помилка очищення картки:', error);
            this.state.expandedCard = null;
            document.body.style.overflow = '';
            document.body.classList.remove('modal-open');
        }
    }

    setupFocusTrap(cardElement) {
        const focusableElements = this.getFocusableElements(cardElement);
        
        if (focusableElements.length === 0) {
            return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        this.focusTrapHandler = (event) => {
            if (event.key !== 'Tab') return;

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
        };

        cardElement.addEventListener('keydown', this.focusTrapHandler);
    }

    cleanupFocusTrap(cardElement) {
        if (this.focusTrapHandler) {
            cardElement.removeEventListener('keydown', this.focusTrapHandler);
            this.focusTrapHandler = null;
        }
    }

    getFocusableElements(container) {
        const focusableSelectors = [
            'button:not([disabled])',
            '[href]',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
            '[contenteditable="true"]'
        ];

        return Array.from(container.querySelectorAll(focusableSelectors.join(', ')))
            .filter(element => {
                return element.offsetWidth > 0 && 
                       element.offsetHeight > 0 && 
                       !element.hidden &&
                       getComputedStyle(element).visibility !== 'hidden';
            });
    }

    getFirstFocusableElement(container) {
        const focusableElements = this.getFocusableElements(container);
        return focusableElements.length > 0 ? focusableElements[0] : null;
    }

    handleCardDoubleClick(event) {
        event.preventDefault();
        event.stopPropagation();

        const card = event.target.closest('.ai-card');
        if (!card || card.classList.contains('expanded')) {
            return;
        }

        const actionButton = event.target.closest('.action-button');
        const closeButton = event.target.closest('.close-card');
        
        if (actionButton || closeButton) {
            return;
        }

        this.expandCard(card);
    }

    handleGlobalKeys(event) {
        if (event.key === 'Escape' && this.state.expandedCard) {
            event.preventDefault();
            this.closeExpandedCard();
            return;
        }

        if (event.ctrlKey || event.metaKey) {
            switch (event.key) {
                case 'r':
                    if (event.altKey) {
                        event.preventDefault();
                        this.refreshCards();
                    }
                    break;
                case 's':
                    if (event.altKey) {
                        event.preventDefault();
                        this.shuffleCards();
                    }
                    break;
            }
        }
    }

    showLoadingState() {
        if (this.elements.loading) {
            this.elements.loading.style.display = 'flex';
        }
        if (this.elements.grid) {
            this.elements.grid.style.display = 'none';
        }
    }

    hideLoadingState() {
        if (this.elements.loading) {
            this.elements.loading.style.display = 'none';
        }
        if (this.elements.grid) {
            this.elements.grid.style.display = 'grid';
        }
    }

    showEmptyState() {
        this.hideLoadingState();
        if (this.elements.empty) {
            this.elements.empty.style.display = 'flex';
        }
    }

    clearCards() {
        this.state.cards.clear();
        if (this.elements.grid) {
            this.elements.grid.innerHTML = '';
        }
    }

    updateCardsCounter(count) {
        const counter = document.getElementById('active-cards-count');
        if (counter) {
            counter.textContent = count;
        }
    }

    announceToScreenReader(message) {
        const announcer = document.getElementById('sr-announcements');
        if (announcer) {
            announcer.textContent = message;
            setTimeout(() => {
                announcer.textContent = '';
            }, 1000);
        }
    }

    handleError(error, userMessage) {
        console.error(error);
        this.notifications.show(userMessage || 'Сталася помилка', 'error');
    }

    handleCriticalError(error) {
        console.error('Критична помилка:', error);
        document.body.innerHTML += `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
                        background: rgba(0,0,0,0.9); color: white; display: flex; 
                        align-items: center; justify-content: center; z-index: 10000;">
                <div style="text-align: center; padding: 2rem;">
                    <h2>❌ Критична помилка AI Cards Hub</h2>
                    <p>Перезавантажте сторінку або оновіть браузер</p>
                    <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem;">
                        Перезавантажити
                    </button>
                </div>
            </div>
        `;
    }

    showFallbackMode(missingFeatures) {
        console.warn('Fallback режим активовано. Відсутні функції:', missingFeatures);
        this.notifications.show('Браузер частково підтримується. Деякі функції можуть не працювати.', 'warning');
    }

    saveState() {
        const state = {
            viewMode: this.state.viewMode,
            flippedCards: Array.from(this.state.cards.entries())
                .filter(([, cardState]) => cardState.isFlipped)
                .map(([id]) => id)
        };
        Utils.setSessionData(CONFIG.STORAGE.SESSION_KEY, state);
        this.stats.saveStats();
    }

    cleanup() {
        this.eventManager.cleanup();
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        this.notifications.clear();
    }

    handleKeyNavigation(event) {
        console.log('Keyboard navigation:', event.key);
        // TODO: Реалізувати клавіатурну навігацію
    }

    startDrag(card) {
        card.classList.add('dragging');
        this.state.draggedCard = card;
    }

    updateDragPosition(card, event) {
        // TODO: Оновлення позиції при перетягуванні
    }

    endDrag(card, event) {
        card.classList.remove('dragging');
        this.state.draggedCard = null;
        // TODO: Обробка завершення перетягування
    }

    resetDragState(dragState) {
        dragState.isDragging = false;
        dragState.currentCard = null;
        if (dragState.currentCard) {
            dragState.currentCard.style.cursor = '';
        }
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }

    handleResize() {
        console.log('Resize event handled');
    }

    handleVisibilityChange() {
        if (document.hidden) {
            // Призупинити анімації
        } else {
            // Відновити анімації
        }
    }

    refreshCards() {
        this.loadCards();
    }

    shuffleCards() {
        console.log('Shuffle cards');
        // TODO: Реалізувати перемішування карток
    }

    resetCards() {
        this.clearCards();
        this.loadCards();
    }

    toggleFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            this.elements.container.requestFullscreen();
        }
    }

    setViewMode(mode) {
        this.state.viewMode = mode;
        this.elements.grid.className = `cards-hub-grid ${mode}-view`;
        
        document.querySelectorAll('.view-mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === mode);
        });
    }
}

// Глобальна ініціалізація
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AICardsHub, Utils };
} else {
    window.AICardsHub = AICardsHub;
    window.AICardsUtils = Utils;
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('ai-cards-container')) {
        try {
            window.aiCardsHub = new AICardsHub();
            console.log('🎮 AI Cards Hub Revolution v3.0 готовий!');
        } catch (error) {
            console.error('❌ Помилка автоініціалізації AI Cards Hub:', error);
        }
    }
});

window.addEventListener('beforeunload', () => {
    if (window.aiCardsHub) {
        window.aiCardsHub.cleanup();
    }
});