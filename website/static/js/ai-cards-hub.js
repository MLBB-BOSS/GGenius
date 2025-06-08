/**
 * AI Cards Hub Revolution - Interactive Card System
 * @version 2.0.0
 * @author MLBB-BOSS  
 * @date 2025-06-08
 * @description Революційна система AI карток з flip-анімаціями та drag'n'drop
 * 
 * Performance optimized, ES2023 compatible, Mobile-first approach
 */

'use strict';

/**
 * Конфігурація системи
 */
const CONFIG = {
    API_BASE: '/api',
    ANIMATION: {
        FLIP_DURATION: 600,
        STAGGER_DELAY: 100,
        HOVER_SCALE: 1.02,
        DRAG_SCALE: 1.1
    },
    INTERACTION: {
        DRAG_THRESHOLD: 8,
        DOUBLE_CLICK_DELAY: 300,
        DEBOUNCE_DELAY: 250
    },
    STORAGE: {
        SESSION_KEY: 'ggenius-cards-hub',
        STATS_KEY: 'ggenius-stats'
    },
    ACCESSIBILITY: {
        FOCUS_VISIBLE_TIMEOUT: 150,
        ANNOUNCE_DELAY: 100
    }
};

/**
 * Утилітарні функції
 */
class Utils {
    /**
     * Debounce функція для оптимізації подій
     */
    static debounce(func, wait) {
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

    /**
     * Throttle функція для scroll/resize подій
     */
    static throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Безпечна затримка
     */
    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Escape HTML для безпеки
     */
    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Перевірка підтримки браузера
     */
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

    /**
     * Генерація унікального ID
     */
    static generateId(prefix = 'card') {
        return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Отримання даних з sessionStorage
     */
    static getSessionData(key) {
        try {
            const data = sessionStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.warn('Помилка читання sessionStorage:', error);
            return null;
        }
    }

    /**
     * Збереження даних в sessionStorage
     */
    static setSessionData(key, data) {
        try {
            sessionStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.warn('Помилка запису sessionStorage:', error);
            return false;
        }
    }
}

/**
 * Менеджер подій з автоматичним очищенням
 */
class EventManager {
    constructor() {
        this.listeners = new Map();
        this.abortController = new AbortController();
    }

    /**
     * Додавання обробника подій
     */
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

        // Зберігаємо для можливого ручного видалення
        const key = `${element.constructor.name}-${event}-${Date.now()}`;
        this.listeners.set(key, { element, event, handler });

        return key;
    }

    /**
     * Видалення конкретного обробника
     */
    removeEventListener(key) {
        const listener = this.listeners.get(key);
        if (listener) {
            listener.element.removeEventListener(listener.event, listener.handler);
            this.listeners.delete(key);
        }
    }

    /**
     * Очищення всіх обробників
     */
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

    /**
     * Показ нотифікації
     */
    show(message, type = 'info', duration = 4000) {
        const id = Utils.generateId('notification');
        const notification = this.createNotification(message, type, id);
        
        this.container.appendChild(notification);
        this.notifications.set(id, notification);

        // Анімація появи
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Автоматичне видалення
        setTimeout(() => {
            this.hide(id);
        }, duration);

        return id;
    }

    /**
     * Створення елемента нотифікації
     */
    createNotification(message, type, id) {
        const notification = document.createElement('div');
        notification.id = id;
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-message">${Utils.escapeHtml(message)}</span>
            <button class="notification-close" aria-label="Закрити повідомлення">×</button>
        `;

        // Кнопка закриття
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => this.hide(id));

        return notification;
    }

    /**
     * Приховування нотифікації
     */
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

    /**
     * Очищення всіх нотифікацій
     */
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
            totalTime: 0
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
 * Основний клас AI Cards Hub
 */
class AICardsHub {
    constructor() {
        // Ініціалізація підсистем
        this.eventManager = new EventManager();
        this.notifications = new NotificationSystem();
        this.stats = new StatsManager();
        
        // Стан системи
        this.state = {
            cards: new Map(),
            expandedCard: null,
            draggedCard: null,
            viewMode: 'grid',
            isLoading: false,
            isInitialized: false
        };

        // DOM елементи
        this.elements = {};

        // Intersection Observer для ледачого завантаження
        this.intersectionObserver = null;

        // Ініціалізація
        this.init().catch(error => {
            console.error('❌ Критична помилка ініціалізації:', error);
            this.handleCriticalError(error);
        });
    }

    /**
     * Асинхронна ініціалізація
     */
    async init() {
        try {
            console.log('🚀 Ініціалізація AI Cards Hub v2.0...');

            // Перевірка підтримки браузера
            const browserCheck = Utils.checkBrowserSupport();
            if (!browserCheck.supported) {
                this.showFallbackMode(browserCheck.missing);
                return;
            }

            // Ініціалізація DOM
            this.initializeDOM();

            // Налаштування спостерігачів
            this.setupObservers();

            // Налаштування подій
            this.setupEventListeners();

            // Завантаження карток
            await this.loadCards();

            // Завершення ініціалізації
            this.state.isInitialized = true;
            this.stats.increment('sessionCount');
            
            this.notifications.show('🎮 AI Cards Hub готовий до роботи!', 'success');
            console.log('✅ AI Cards Hub успішно ініціалізовано');

        } catch (error) {
            console.error('❌ Помилка ініціалізації:', error);
            throw error;
        }
    }

    /**
     * Ініціалізація DOM елементів
     */
    initializeDOM() {
        // Основні контейнери
        this.elements = {
            container: document.getElementById('ai-cards-container'),
            grid: document.getElementById('cards-hub-grid'),
            loading: document.getElementById('cards-loading'),
            empty: document.getElementById('cards-empty'),
            controls: document.querySelector('.cards-hub-controls'),
            overlay: this.getOrCreateOverlay()
        };

        // Перевірка обов'язкових елементів
        if (!this.elements.container || !this.elements.grid) {
            throw new Error('Відсутні критичні DOM елементи для AI Cards Hub');
        }

        // Налаштування accessibility
        this.setupAccessibility();
    }

    /**
     * Отримання або створення overlay
     */
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

    /**
     * Налаштування accessibility
     */
    setupAccessibility() {
        const { grid } = this.elements;
        
        grid.setAttribute('role', 'grid');
        grid.setAttribute('aria-label', 'AI Cards Hub - Інтерактивні картки');
        grid.setAttribute('tabindex', '0');

        // Screen reader announcements
        if (!document.getElementById('sr-announcements')) {
            const announcer = document.createElement('div');
            announcer.id = 'sr-announcements';
            announcer.className = 'sr-only';
            announcer.setAttribute('aria-live', 'polite');
            announcer.setAttribute('aria-atomic', 'true');
            document.body.appendChild(announcer);
        }
    }

    /**
     * Налаштування спостерігачів
     */
    setupObservers() {
        // Intersection Observer для оптимізації
        if ('IntersectionObserver' in window) {
            this.intersectionObserver = new IntersectionObserver(
                this.handleIntersection.bind(this),
                { rootMargin: '50px', threshold: 0.1 }
            );
        }

        // Resize Observer для адаптивності
        if ('ResizeObserver' in window) {
            this.resizeObserver = new ResizeObserver(
                Utils.throttle(this.handleResize.bind(this), 250)
            );
            this.resizeObserver.observe(this.elements.container);
        }
    }

    /**
     * Налаштування обробників подій
     */
    setupEventListeners() {
        const { grid, overlay, controls } = this.elements;

        // Основні події карток
        this.eventManager.addEventListener(grid, 'click', this.handleCardClick.bind(this));
        this.eventManager.addEventListener(grid, 'dblclick', this.handleCardDoubleClick.bind(this));
        this.eventManager.addEventListener(grid, 'keydown', this.handleKeyNavigation.bind(this));

        // Drag & Drop
        this.setupDragAndDrop();

        // Overlay для закриття розширених карток
        this.eventManager.addEventListener(overlay, 'click', this.closeExpandedCard.bind(this));

        // Глобальні клавіші
        this.eventManager.addEventListener(document, 'keydown', this.handleGlobalKeys.bind(this));

        // Controls
        if (controls) {
            this.setupControlsEvents();
        }

        // Visibility change для паузи анімацій
        this.eventManager.addEventListener(document, 'visibilitychange', this.handleVisibilityChange.bind(this));

        // Збереження стану перед закриттям
        this.eventManager.addEventListener(window, 'beforeunload', this.saveState.bind(this));
    }

    /**
     * Налаштування подій для контролів
     */
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

        // View mode toggle
        const viewModeButtons = document.querySelectorAll('.view-mode-btn');
        viewModeButtons.forEach(btn => {
            this.eventManager.addEventListener(btn, 'click', (e) => {
                this.setViewMode(e.target.dataset.view);
            });
        });
    }

    /**
     * Налаштування Drag & Drop
     */
    setupDragAndDrop() {
        let dragState = {
            isDragging: false,
            startPos: { x: 0, y: 0 },
            currentCard: null
        };

        // Mouse events
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

        // Touch events
        this.setupTouchDrag(dragState);
    }

    /**
     * Touch Drag Support
     */
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

    /**
     * Завантаження карток
     */
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

            // Screen reader announcement
            this.announceToScreenReader(`Завантажено ${cardsData.length} AI карток`);

        } catch (error) {
            console.error('Помилка завантаження карток:', error);
            this.notifications.show('Не вдалося завантажити картки', 'error');
            this.showEmptyState();
        } finally {
            this.state.isLoading = false;
        }
    }

    /**
     * Отримання даних карток
     */
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

    /**
     * Mock дані для розробки
     */
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

    /**
     * Рендеринг карток з оптимізацією
     */
    async renderCards(cardsData) {
        const fragment = document.createDocumentFragment();
        
        // Очищаємо існуючі картки
        this.clearCards();

        for (let i = 0; i < cardsData.length; i++) {
            const cardData = cardsData[i];
            const cardElement = this.createCardElement(cardData, i);
            
            // Зберігаємо стан картки
            this.state.cards.set(cardData.id, {
                element: cardElement,
                data: cardData,
                isFlipped: false,
                actionsLoaded: false
            });

            fragment.appendChild(cardElement);

            // Intersection Observer для ледачого завантаження
            if (this.intersectionObserver) {
                this.intersectionObserver.observe(cardElement);
            }
        }

        this.elements.grid.appendChild(fragment);

        // Запускаємо анімацію появи
        await this.animateCardsEntrance();
    }

    /**
     * Створення елемента картки
     */
    createCardElement(cardData, index) {
        const card = document.createElement('div');
        card.className = `ai-card card-type-${cardData.type}`;
        card.dataset.cardId = cardData.id;
        card.style.animationDelay = `${index * CONFIG.ANIMATION.STAGGER_DELAY}ms`;
        
        // Accessibility
        card.setAttribute('role', 'gridcell');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `${cardData.title}: ${cardData.description}`);

        card.innerHTML = `
            <div class="card-face card-front">
                <div class="card-icon" aria-hidden="true">${cardData.icon}</div>
                <div class="card-title">${Utils.escapeHtml(cardData.title)}</div>
                <div class="card-description">${Utils.escapeHtml(cardData.description)}</div>
                <div class="card-status">
                    <div class="status-indicator" aria-label="Статус: ${cardData.status}"></div>
                    <div class="status-text">${Utils.escapeHtml(cardData.statusText)}</div>
                </div>
            </div>
            <div class="card-face card-back">
                <div class="card-actions" role="list" aria-label="Дії картки"></div>
            </div>
        `;

        return card;
    }

    /**
     * Анімація появи карток
     */
    async animateCardsEntrance() {
        const cards = this.elements.grid.querySelectorAll('.ai-card');
        
        for (let i = 0; i < cards.length; i++) {
            await Utils.delay(CONFIG.ANIMATION.STAGGER_DELAY);
            cards[i].classList.add('animate-in');
        }
    }

    /**
     * Обробка кліку по картці
     */
    async handleCardClick(event) {
        const card = event.target.closest('.ai-card');
        if (!card) return;

        const cardId = card.dataset.cardId;
        const cardState = this.state.cards.get(cardId);

        if (!cardState) return;

        // Обробка кліку по кнопці дії
        const actionButton = event.target.closest('.action-button');
        if (actionButton) {
            await this.handleActionClick(actionButton, cardState);
            return;
        }

        // Обробка кліку по кнопці закриття
        const closeButton = event.target.closest('.close-card');
        if (closeButton) {
            this.closeExpandedCard();
            return;
        }

        // Flip картки
        await this.flipCard(card, cardState);
    }

    /**
     * Flip анімація картки
     */
    async flipCard(cardElement, cardState) {
        if (cardElement.classList.contains('expanded') || this.state.isLoading) return;

        try {
            // Оновлюємо статистику
            this.stats.increment('totalFlips');
            
            // Переключаємо стан
            cardState.isFlipped = !cardState.isFlipped;
            cardElement.classList.toggle('flipped', cardState.isFlipped);

            // Завантаження дій для задньої сторони
            if (cardState.isFlipped && !cardState.actionsLoaded) {
                await this.loadCardActions(cardElement, cardState);
            }

            // Screen reader announcement
            const status = cardState.isFlipped ? 'перевернута' : 'повернута';
            this.announceToScreenReader(`Картка ${cardState.data.title} ${status}`);

        } catch (error) {
            console.error('Помилка flip картки:', error);
            this.notifications.show('Помилка перевертання картки', 'error');
        }
    }

    /**
     * Завантаження дій для картки
     */
    async loadCardActions(cardElement, cardState) {
        const actionsContainer = cardElement.querySelector('.card-actions');
        if (!actionsContainer) return;

        try {
            // Показуємо loading
            actionsContainer.innerHTML = '<div class="loading-actions">⏳ Завантаження...</div>';

            // Отримуємо дії з API або mock
            const actions = await this.fetchCardActions(cardState.data.id);
            
            // Очищаємо контейнер
            actionsContainer.innerHTML = '';

            // Створюємо кнопки дій
            actions.forEach(action => {
                const button = this.createActionButton(action);
                actionsContainer.appendChild(button);
            });

            // Додаємо AI response область
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

    /**
     * Отримання дій картки
     */
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

        // Mock дії
        return this.getMockActions(cardId);
    }

    /**
     * Mock дії для карток
     */
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

    /**
     * Створення кнопки дії
     */
    createActionButton(actionData) {
        const button = document.createElement('button');
        button.className = `action-button ${actionData.primary ? 'primary' : ''}`;
        button.textContent = actionData.text;
        button.dataset.action = actionData.action;
        button.setAttribute('role', 'listitem');
        button.setAttribute('aria-label', actionData.text);
        
        return button;
    }

    /**
     * Обробка дій картки
     */
    async handleActionClick(button, cardState) {
        const action = button.dataset.action;
        const originalText = button.textContent;

        try {
            // UI стан loading
            button.disabled = true;
            button.textContent = '⏳ Обробка...';

            // Виконання дії
            const result = await this.executeAction(action, cardState.data);

            // Оновлення статистики
            this.stats.increment('aiInteractions');
            this.stats.increment('successfulActions');

            // Показ результату
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

    /**
     * Виконання дії
     */
    async executeAction(action, cardData) {
        try {
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

        // Mock результат
        await Utils.delay(Math.random() * 1000 + 500);
        return this.getMockActionResult(action, cardData);
    }

    /**
     * Mock результати дій
     */
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

    /**
     * Показ результату дії
     */
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

    // === UTILITY METHODS ===

    /**
     * Показ loading стану
     */
    showLoadingState() {
        if (this.elements.loading) {
            this.elements.loading.style.display = 'flex';
        }
        if (this.elements.grid) {
            this.elements.grid.style.display = 'none';
        }
    }

    /**
     * Приховування loading стану
     */
    hideLoadingState() {
        if (this.elements.loading) {
            this.elements.loading.style.display = 'none';
        }
        if (this.elements.grid) {
            this.elements.grid.style.display = 'grid';
        }
    }

    /**
     * Показ empty стану
     */
    showEmptyState() {
        this.hideLoadingState();
        if (this.elements.empty) {
            this.elements.empty.style.display = 'flex';
        }
    }

    /**
     * Очищення карток
     */
    clearCards() {
        this.state.cards.clear();
        if (this.elements.grid) {
            this.elements.grid.innerHTML = '';
        }
    }

    /**
     * Оновлення лічильника карток
     */
    updateCardsCounter(count) {
        const counter = document.getElementById('active-cards-count');
        if (counter) {
            counter.textContent = count;
        }
    }

    /**
     * Screen reader announcements
     */
    announceToScreenReader(message) {
        const announcer = document.getElementById('sr-announcements');
        if (announcer) {
            announcer.textContent = message;
            setTimeout(() => {
                announcer.textContent = '';
            }, 1000);
        }
    }

    /**
     * Обробка помилок
     */
    handleError(error, userMessage) {
        console.error(error);
        this.notifications.show(userMessage || 'Сталася помилка', 'error');
    }

    /**
     * Критична помилка
     */
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

    /**
     * Fallback режим для старих браузерів
     */
    showFallbackMode(missingFeatures) {
        console.warn('Fallback режим активовано. Відсутні функції:', missingFeatures);
        this.notifications.show('Браузер частково підтримується. Деякі функції можуть не працювати.', 'warning');
    }

    /**
     * Збереження стану
     */
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

    /**
     * Очищення ресурсів
     */
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

    // === STUB METHODS (для завершення функціональності) ===

    handleCardDoubleClick(event) {
        const card = event.target.closest('.ai-card');
        if (card) {
            this.expandCard(card);
        }
    }

    expandCard(card) {
        console.log('Розширення картки:', card.dataset.cardId);
        // TODO: Implement card expansion
    }

    closeExpandedCard() {
        console.log('Закриття розширеної картки');
        // TODO: Implement card closing
    }

    handleKeyNavigation(event) {
        console.log('Keyboard navigation:', event.key);
        // TODO: Implement keyboard navigation
    }

    handleGlobalKeys(event) {
        if (event.key === 'Escape' && this.state.expandedCard) {
            this.closeExpandedCard();
        }
    }

    startDrag(card) {
        card.classList.add('dragging');
        this.state.draggedCard = card;
    }

    updateDragPosition(card, event) {
        // TODO: Update drag position
    }

    endDrag(card, event) {
        card.classList.remove('dragging');
        this.state.draggedCard = null;
        // TODO: Handle drop
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
            // Pause animations
        } else {
            // Resume animations
        }
    }

    refreshCards() {
        this.loadCards();
    }

    shuffleCards() {
        console.log('Shuffle cards');
        // TODO: Implement shuffle
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
        
        // Update active button
        document.querySelectorAll('.view-mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === mode);
        });
    }
}

// === ГЛОБАЛЬНА ІНІЦІАЛІЗАЦІЯ ===

// Export для можливого використання як модуль
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AICardsHub, Utils };
} else {
    window.AICardsHub = AICardsHub;
    window.AICardsUtils = Utils;
}

// Автоматична ініціалізація
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('ai-cards-container')) {
        try {
            window.aiCardsHub = new AICardsHub();
            console.log('🎮 AI Cards Hub Revolution v2.0 готовий!');
        } catch (error) {
            console.error('❌ Помилка автоініціалізації AI Cards Hub:', error);
        }
    }
});

// Cleanup при закритті сторінки
window.addEventListener('beforeunload', () => {
    if (window.aiCardsHub) {
        window.aiCardsHub.cleanup();
    }
});
