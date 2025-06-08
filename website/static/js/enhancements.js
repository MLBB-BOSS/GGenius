/**
 * AI Cards Hub Revolution - Interactive Card System
 * Революційна система інтерактивних AI карток для GGenius
 * 
 * @version 1.0.0
 * @author MLBB-BOSS
 * @description Система живих AI-модулів з flip-анімаціями та drag'n'drop
 */

'use strict';

/**
 * Основний клас для управління AI Cards Hub
 */
class AICardsHub {
    constructor() {
        // Конфігурація
        this.config = {
            apiBase: '/api',
            flipDuration: 600,
            dragThreshold: 5,
            animationDelay: 100,
            maxRetries: 3,
            debounceDelay: 300,
            sessionStorageKey: 'ggenius-cards-hub'
        };

        // Стан системи
        this.state = {
            cards: new Map(),
            expandedCard: null,
            draggedCard: null,
            isDragging: false,
            isLoading: false,
            viewMode: 'grid',
            sessionData: this.loadSessionData()
        };

        // Статистика
        this.stats = {
            totalFlips: 0,
            aiInteractions: 0,
            sessionStartTime: Date.now(),
            successfulActions: 0
        };

        // Event listeners
        this.eventListeners = new Map();
        
        // Ініціалізація
        this.init();
    }

    /**
     * Ініціалізація системи
     */
    async init() {
        try {
            console.log('🚀 Ініціалізація AI Cards Hub...');
            
            // Перевіряємо підтримку браузера
            if (!this.checkBrowserSupport()) {
                this.showFallbackMode();
                return;
            }

            // Налаштовуємо DOM
            this.setupDOM();
            
            // Налаштовуємо обробники подій
            this.setupEventListeners();
            
            // Налаштовуємо drag & drop
            this.setupDragAndDrop();
            
            // Завантажуємо картки
            await this.loadCards();
            
            // Запускаємо статистику
            this.startSessionTracking();
            
            // Показуємо успішну ініціалізацію
            this.showNotification('AI Cards Hub готовий до роботи! 🎮', 'success');
            
            console.log('✅ AI Cards Hub успішно ініціалізовано');
            
        } catch (error) {
            console.error('❌ Помилка ініціалізації AI Cards Hub:', error);
            this.handleError(error, 'Не вдалося ініціалізувати Cards Hub');
        }
    }

    /**
     * Перевірка підтримки браузера
     */
    checkBrowserSupport() {
        const required = {
            css: {
                transform3d: 'transform' in document.documentElement.style,
                transition: 'transition' in document.documentElement.style,
                backdropFilter: 'backdropFilter' in document.documentElement.style
            },
            js: {
                fetch: typeof fetch !== 'undefined',
                promise: typeof Promise !== 'undefined',
                map: typeof Map !== 'undefined'
            }
        };

        const unsupported = [];
        
        Object.entries(required).forEach(([category, features]) => {
            Object.entries(features).forEach(([feature, supported]) => {
                if (!supported) {
                    unsupported.push(`${category}.${feature}`);
                }
            });
        });

        if (unsupported.length > 0) {
            console.warn('⚠️ Деякі функції не підтримуються:', unsupported);
            return false;
        }

        return true;
    }

    /**
     * Налаштування DOM елементів
     */
    setupDOM() {
        // Отримуємо основні елементи
        this.elements = {
            container: document.getElementById('ai-cards-container'),
            grid: document.getElementById('cards-hub-grid'),
            loading: document.getElementById('cards-loading'),
            empty: document.getElementById('cards-empty'),
            controls: document.querySelector('.cards-hub-controls'),
            overlay: document.getElementById('card-overlay'),
            notifications: document.getElementById('notification-container')
        };

        // Перевіряємо наявність обов'язкових елементів
        const required = ['container', 'grid'];
        required.forEach(key => {
            if (!this.elements[key]) {
                throw new Error(`Відсутній обов'язковий DOM елемент: ${key}`);
            }
        });

        // Створюємо відсутні елементи
        this.createMissingElements();
        
        // Налаштовуємо ARIA атрибути
        this.setupAccessibility();
    }

    /**
     * Створення відсутніх DOM елементів
     */
    createMissingElements() {
        // Створюємо overlay якщо відсутній
        if (!this.elements.overlay) {
            this.elements.overlay = document.createElement('div');
            this.elements.overlay.id = 'card-overlay';
            this.elements.overlay.className = 'card-overlay';
            this.elements.overlay.setAttribute('aria-hidden', 'true');
            document.body.appendChild(this.elements.overlay);
        }

        // Створюємо контейнер для нотифікацій
        if (!this.elements.notifications) {
            this.elements.notifications = document.createElement('div');
            this.elements.notifications.id = 'notification-container';
            this.elements.notifications.className = 'notification-container';
            this.elements.notifications.setAttribute('aria-live', 'polite');
            document.body.appendChild(this.elements.notifications);
        }
    }

    /**
     * Налаштування accessibility
     */
    setupAccessibility() {
        // ARIA labels для grid
        this.elements.grid.setAttribute('role', 'grid');
        this.elements.grid.setAttribute('aria-label', 'AI Cards Hub - Інтерактивні картки');
        
        // Keyboard navigation
        this.elements.grid.setAttribute('tabindex', '0');
        
        // Screen reader announcements
        const announcement = document.createElement('div');
        announcement.className = 'sr-only';
        announcement.setAttribute('aria-live', 'polite');
        announcement.id = 'cards-announcements';
        document.body.appendChild(announcement);
        this.elements.announcements = announcement;
    }

    /**
     * Налаштування обробників подій
     */
    setupEventListeners() {
        // Клік по картках
        this.addEventListener(this.elements.grid, 'click', this.handleCardClick.bind(this));
        
        // Подвійний клік для розширення
        this.addEventListener(this.elements.grid, 'dblclick', this.handleCardDoubleClick.bind(this));
        
        // Keyboard navigation
        this.addEventListener(this.elements.grid, 'keydown', this.handleKeyNavigation.bind(this));
        
        // Закриття розширеної картки
        this.addEventListener(this.elements.overlay, 'click', this.closeExpandedCard.bind(this));
        this.addEventListener(document, 'keydown', this.handleGlobalKeydown.bind(this));
        
        // Controls
        this.setupControlsListeners();
        
        // Resize для адаптивності
        this.addEventListener(window, 'resize', this.debounce(this.handleResize.bind(this), this.config.debounceDelay));
        
        // Visibility change для паузи анімацій
        this.addEventListener(document, 'visibilitychange', this.handleVisibilityChange.bind(this));
        
        // Before unload для збереження сесії
        this.addEventListener(window, 'beforeunload', this.saveSessionData.bind(this));
    }

    /**
     * Налаштування обробників для контролів
     */
    setupControlsListeners() {
        // Кнопки управління
        const controls = {
            'cards-refresh': this.refreshCards.bind(this),
            'cards-shuffle': this.shuffleCards.bind(this),
            'cards-reset': this.resetCards.bind(this),
            'cards-fullscreen': this.toggleFullscreen.bind(this)
        };

        Object.entries(controls).forEach(([id, handler]) => {
            const element = document.getElementById(id);
            if (element) {
                this.addEventListener(element, 'click', handler);
            }
        });

        // View mode toggle
        const viewModeButtons = document.querySelectorAll('.view-mode-btn');
        viewModeButtons.forEach(btn => {
            this.addEventListener(btn, 'click', (e) => {
                const mode = e.target.dataset.view;
                this.setViewMode(mode);
            });
        });

        // Floating button
        const floatingBtn = document.getElementById('floating-cards-hub');
        if (floatingBtn) {
            this.addEventListener(floatingBtn, 'click', this.scrollToCardsHub.bind(this));
        }
    }

    /**
     * Налаштування drag & drop
     */
    setupDragAndDrop() {
        let startPos = { x: 0, y: 0 };
        let isDragging = false;

        // Mouse events
        this.addEventListener(this.elements.grid, 'mousedown', (e) => {
            const card = e.target.closest('.ai-card');
            if (!card || card.classList.contains('expanded')) return;

            startPos = { x: e.clientX, y: e.clientY };
            this.prepareDrag(card, e);
        });

        this.addEventListener(document, 'mousemove', (e) => {
            if (!this.state.draggedCard) return;

            const distance = Math.sqrt(
                Math.pow(e.clientX - startPos.x, 2) + 
                Math.pow(e.clientY - startPos.y, 2)
            );

            if (distance > this.config.dragThreshold && !isDragging) {
                isDragging = true;
                this.startDrag(this.state.draggedCard, e);
            }

            if (isDragging) {
                this.updateDrag(e);
            }
        });

        this.addEventListener(document, 'mouseup', (e) => {
            if (isDragging) {
                this.endDrag(e);
            }
            isDragging = false;
            this.state.draggedCard = null;
        });

        // Touch events для мобільних
        this.setupTouchEvents();
        
        // Drop zones
        this.setupDropZones();
    }

    /**
     * Налаштування touch events
     */
    setupTouchEvents() {
        let touchStartPos = { x: 0, y: 0 };
        let isTouchDragging = false;

        this.addEventListener(this.elements.grid, 'touchstart', (e) => {
            const card = e.target.closest('.ai-card');
            if (!card || card.classList.contains('expanded')) return;

            const touch = e.touches[0];
            touchStartPos = { x: touch.clientX, y: touch.clientY };
            this.prepareDrag(card, touch);
        }, { passive: false });

        this.addEventListener(document, 'touchmove', (e) => {
            if (!this.state.draggedCard) return;

            const touch = e.touches[0];
            const distance = Math.sqrt(
                Math.pow(touch.clientX - touchStartPos.x, 2) + 
                Math.pow(touch.clientY - touchStartPos.y, 2)
            );

            if (distance > this.config.dragThreshold && !isTouchDragging) {
                isTouchDragging = true;
                this.startDrag(this.state.draggedCard, touch);
                e.preventDefault();
            }

            if (isTouchDragging) {
                this.updateDrag(touch);
                e.preventDefault();
            }
        }, { passive: false });

        this.addEventListener(document, 'touchend', (e) => {
            if (isTouchDragging) {
                const touch = e.changedTouches[0];
                this.endDrag(touch);
            }
            isTouchDragging = false;
            this.state.draggedCard = null;
        });
    }

    /**
     * Налаштування drop zones
     */
    setupDropZones() {
        const dropZones = document.querySelectorAll('.drop-zone');
        
        dropZones.forEach(zone => {
            this.addEventListener(zone, 'dragover', (e) => {
                e.preventDefault();
                zone.classList.add('drag-over');
            });

            this.addEventListener(zone, 'dragleave', (e) => {
                if (!zone.contains(e.relatedTarget)) {
                    zone.classList.remove('drag-over');
                }
            });

            this.addEventListener(zone, 'drop', (e) => {
                e.preventDefault();
                zone.classList.remove('drag-over');
                
                if (this.state.draggedCard) {
                    this.handleCardDrop(this.state.draggedCard, zone);
                }
            });
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

            // Simulate API call або використовуємо реальний API
            const cardsData = await this.fetchCardsData();
            
            if (!cardsData || cardsData.length === 0) {
                this.showEmptyState();
                return;
            }

            // Очищаємо існуючі картки
            this.clearCards();
            
            // Створюємо нові картки
            await this.createCards(cardsData);
            
            // Оновлюємо статистику
            this.updateCardsCounter(cardsData.length);
            
            // Приховуємо loading state
            this.hideLoadingState();
            
            // Announce для screen readers
            this.announceToScreenReader(`Завантажено ${cardsData.length} AI карток`);
            
        } catch (error) {
            console.error('Помилка завантаження карток:', error);
            this.handleError(error, 'Не вдалося завантажити картки');
            this.showEmptyState();
        } finally {
            this.state.isLoading = false;
        }
    }

    /**
     * Отримання даних карток (може бути замінено на реальний API)
     */
    async fetchCardsData() {
        // Спробуємо спочатку реальний API
        try {
            const response = await fetch(`${this.config.apiBase}/cards`);
            if (response.ok) {
                const data = await response.json();
                return data.cards || data;
            }
        } catch (error) {
            console.warn('API недоступний, використовуємо mock дані:', error);
        }

        // Fallback на mock дані
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    {
                        id: 'guides_card',
                        type: 'guides',
                        title: 'Гайди героїв',
                        description: 'Актуальні гайди та мета аналіз',
                        icon: '🎯',
                        status: 'active',
                        statusText: '12 нових гайдів',
                        priority: 1,
                        actions: [
                            { text: '🎯 Завантажити PDF гайд', action: 'download-guide', primary: true },
                            { text: '🤖 AI-аналіз героя', action: 'ai-analysis' },
                            { text: '📊 Історія мети', action: 'meta-history' },
                            { text: '💡 Персональні поради', action: 'personal-tips' }
                        ]
                    },
                    {
                        id: 'tournaments_card',
                        type: 'tournaments',
                        title: 'Турніри',
                        description: 'Наступний матч через 1д 2г',
                        icon: '⚔️',
                        status: 'active',
                        statusText: 'Зареєстровано',
                        priority: 2,
                        actions: [
                            { text: '🏆 Зареєструватись', action: 'register', primary: true },
                            { text: '📋 Сітка турніру', action: 'bracket' },
                            { text: '📈 Мій прогрес', action: 'progress' },
                            { text: '🎥 Дивитись стрім', action: 'watch-stream' }
                        ]
                    },
                    {
                        id: 'team_finder_card',
                        type: 'team-finder',
                        title: 'Пошук команди',
                        description: '3 запрошення активні',
                        icon: '💬',
                        status: 'pending',
                        statusText: 'Нові повідомлення',
                        priority: 3,
                        actions: [
                            { text: '👥 Знайти команду', action: 'find-team', primary: true },
                            { text: '⚙️ Налаштувати фільтри', action: 'filters' },
                            { text: '💬 Надіслати повідомлення', action: 'message' },
                            { text: '🤖 AI-підбір гравців', action: 'ai-match' }
                        ]
                    },
                    {
                        id: 'analytics_card',
                        type: 'analytics',
                        title: 'Аналітика',
                        description: 'KDA 3.2, WinRate 68%',
                        icon: '📊',
                        status: 'active',
                        statusText: 'Оновлено',
                        priority: 4,
                        actions: [
                            { text: '📊 Детальний звіт', action: 'detailed-report', primary: true },
                            { text: '📈 Тренд за 30 днів', action: 'trends' },
                            { text: '🎯 Що покращити', action: 'improvements' },
                            { text: '🏅 Порівняти з про', action: 'compare-pro' }
                        ]
                    }
                ]);
            }, 1000); // Симулюємо затримку мережі
        });
    }

    /**
     * Створення карток
     */
    async createCards(cardsData) {
        const fragment = document.createDocumentFragment();
        
        for (let i = 0; i < cardsData.length; i++) {
            const cardData = cardsData[i];
            const cardElement = this.createCardElement(cardData);
            
            // Додаємо затримку для анімації появи
            cardElement.style.animationDelay = `${i * this.config.animationDelay}ms`;
            
            // Зберігаємо дані картки
            this.state.cards.set(cardData.id, {
                element: cardElement,
                data: cardData,
                isFlipped: false,
                actions: cardData.actions || []
            });
            
            fragment.appendChild(cardElement);
        }
        
        this.elements.grid.appendChild(fragment);
    }

    /**
     * Створення елемента картки
     */
    createCardElement(cardData) {
        const card = document.createElement('div');
        card.className = `ai-card card-type-${cardData.type}`;
        card.dataset.cardId = cardData.id;
        card.setAttribute('role', 'gridcell');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `${cardData.title}: ${cardData.description}`);
        
        card.innerHTML = `
            <div class="card-face card-front">
                <div class="card-icon" aria-hidden="true">${cardData.icon}</div>
                <div class="card-title">${this.escapeHtml(cardData.title)}</div>
                <div class="card-description">${this.escapeHtml(cardData.description)}</div>
                <div class="card-status">
                    <div class="status-indicator" aria-label="Статус: ${cardData.status}"></div>
                    <div class="status-text">${this.escapeHtml(cardData.statusText)}</div>
                </div>
            </div>
            <div class="card-face card-back">
                <div class="card-actions" role="list" aria-label="Дії картки">
                    <!-- Дії будуть додані динамічно -->
                </div>
            </div>
        `;
        
        return card;
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

        // Перевіряємо чи це клік по кнопці дії
        const actionButton = event.target.closest('.action-button');
        if (actionButton) {
            await this.handleActionClick(actionButton, cardState);
            return;
        }

        // Перевіряємо чи це клік по кнопці закриття
        const closeButton = event.target.closest('.close-card');
        if (closeButton) {
            this.closeExpandedCard();
            return;
        }

        // Flip картки
        await this.flipCard(card, cardState);
    }

    /**
     * Перевертання картки
     */
    async flipCard(cardElement, cardState) {
        if (cardElement.classList.contains('expanded')) return;
        
        try {
            // Оновлюємо статистику
            this.stats.totalFlips++;
            this.updateStatistic('total-flips', this.stats.totalFlips);
            
            // Переключаємо стан
            cardState.isFlipped = !cardState.isFlipped;
            cardElement.classList.toggle('flipped', cardState.isFlipped);
            
            // Якщо перевертаємо на задню сторону і дії ще не завантажені
            if (cardState.isFlipped && !cardState.actionsLoaded) {
                await this.loadCardActions(cardElement, cardState);
            }
            
            // Announce для screen readers
            const status = cardState.isFlipped ? 'перевернута' : 'повернута';
            this.announceToScreenReader(`Картка ${cardState.data.title} ${status}`);
            
        } catch (error) {
            console.error('Помилка перевертання картки:', error);
            this.handleError(error, 'Не вдалося перевернути картку');
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
            actionsContainer.innerHTML = '<div class="loading-actions">Завантаження дій...</div>';
            
            // Симулюємо загрузку (може бути замінено на реальний API)
            await this.delay(500);
            
            // Очищаємо контейнер
            actionsContainer.innerHTML = '';
            
            // Створюємо кнопки дій
            cardState.actions.forEach(action => {
                const button = this.createActionButton(action);
                actionsContainer.appendChild(button);
            });
            
            // Додаємо AI відповідь якщо є
            if (cardState.actions.length > 0) {
                const aiResponse = document.createElement('div');
                aiResponse.className = 'ai-response';
                aiResponse.textContent = 'AI готовий допомогти з аналітикою та порадами...';
                actionsContainer.appendChild(aiResponse);
            }
            
            cardState.actionsLoaded = true;
            
        } catch (error) {
            console.error('Помилка завантаження дій:', error);
            actionsContainer.innerHTML = '<div class="error-actions">Помилка завантаження дій</div>';
        }
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
     * Обробка подвійного кліку (розширення картки)
     */
    handleCardDoubleClick(event) {
        const card = event.target.closest('.ai-card');
        if (!card) return;

        this.expandCard(card);
    }

    /**
     * Розширення картки
     */
    expandCard(cardElement) {
        if (this.state.expandedCard) {
            this.closeExpandedCard();
        }

        try {
            // Додаємо overlay
            this.elements.overlay.classList.add('active');
            this.elements.overlay.setAttribute('aria-hidden', 'false');
            
            // Додаємо кнопку закриття
            const closeButton = document.createElement('button');
            closeButton.className = 'close-card';
            closeButton.innerHTML = '×';
            closeButton.setAttribute('aria-label', 'Закрити розширену картку');
            cardElement.appendChild(closeButton);
            
            // Розширюємо картку
            cardElement.classList.add('expanded');
            this.state.expandedCard = cardElement;
            
            // Блокуємо скролл body
            document.body.style.overflow = 'hidden';
            
            // Focus trap
            this.setupFocusTrap(cardElement);
            
            // Announce для screen readers
            const cardTitle = cardElement.querySelector('.card-title')?.textContent || 'картка';
            this.announceToScreenReader(`${cardTitle} розширена. Натисніть Escape для закриття`);
            
        } catch (error) {
            console.error('Помилка розширення картки:', error);
            this.handleError(error, 'Не вдалося розширити картку');
        }
    }

    /**
     * Закриття розширеної картки
     */
    closeExpandedCard() {
        if (!this.state.expandedCard) return;

        try {
            // Приховуємо overlay
            this.elements.overlay.classList.remove('active');
            this.elements.overlay.setAttribute('aria-hidden', 'true');
            
            // Видаляємо кнопку закриття
            const closeButton = this.state.expandedCard.querySelector('.close-card');
            if (closeButton) {
                closeButton.remove();
            }
            
            // Згортаємо картку
            this.state.expandedCard.classList.remove('expanded');
            
            // Відновлюємо скролл
            document.body.style.overflow = '';
            
            // Повертаємо фокус
            this.state.expandedCard.focus();
            
            this.state.expandedCard = null;
            
        } catch (error) {
            console.error('Помилка закриття картки:', error);
        }
    }

    /**
     * Налаштування focus trap для розширеної картки
     */
    setupFocusTrap(cardElement) {
        const focusableElements = cardElement.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        // Focus на перший елемент
        firstElement.focus();
        
        // Обробник Tab
        const handleTab = (e) => {
            if (e.key !== 'Tab') return;
            
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        };
        
        cardElement.addEventListener('keydown', handleTab);
        
        // Очищаємо при закритті
        const cleanup = () => {
            cardElement.removeEventListener('keydown', handleTab);
        };
        
        // Зберігаємо cleanup функцію
        cardElement.focusTrapCleanup = cleanup;
    }

    /**
     * Обробка клавіатурної навігації
     */
    handleKeyNavigation(event) {
        const { key, target } = event;
        const card = target.closest('.ai-card');
        
        if (!card) return;
        
        switch (key) {
            case 'Enter':
            case ' ':
                event.preventDefault();
                this.flipCard(card, this.state.cards.get(card.dataset.cardId));
                break;
                
            case 'ArrowRight':
            case 'ArrowDown':
                event.preventDefault();
                this.focusNextCard(card);
                break;
                
            case 'ArrowLeft':
            case 'ArrowUp':
                event.preventDefault();
                this.focusPreviousCard(card);
                break;
                
            case 'Home':
                event.preventDefault();
                this.focusFirstCard();
                break;
                
            case 'End':
                event.preventDefault();
                this.focusLastCard();
                break;
        }
    }

    /**
     * Фокус на наступну картку
     */
    focusNextCard(currentCard) {
        const cards = Array.from(this.elements.grid.querySelectorAll('.ai-card'));
        const currentIndex = cards.indexOf(currentCard);
        const nextCard = cards[currentIndex + 1] || cards[0];
        nextCard.focus();
    }

    /**
     * Фокус на попередню картку
     */
    focusPreviousCard(currentCard) {
        const cards = Array.from(this.elements.grid.querySelectorAll('.ai-card'));
        const currentIndex = cards.indexOf(currentCard);
        const prevCard = cards[currentIndex - 1] || cards[cards.length - 1];
        prevCard.focus();
    }

    /**
     * Фокус на першу картку
     */
    focusFirstCard() {
        const firstCard = this.elements.grid.querySelector('.ai-card');
        if (firstCard) firstCard.focus();
    }

    /**
     * Фокус на останню картку
     */
    focusLastCard() {
        const cards = this.elements.grid.querySelectorAll('.ai-card');
        const lastCard = cards[cards.length - 1];
        if (lastCard) lastCard.focus();
    }

    /**
     * Глобальна обробка клавіш
     */
    handleGlobalKeydown(event) {
        if (event.key === 'Escape') {
            if (this.state.expandedCard) {
                this.closeExpandedCard();
            }
        }
    }

    /**
     * Обробка дій картки
     */
    async handleActionClick(button, cardState) {
        const action = button.dataset.action;
        
        if (!action) return;
        
        try {
            // Показуємо loading стан кнопки
            const originalText = button.textContent;
            button.disabled = true;
            button.textContent = '⏳ Обробка...';
            
            // Виконуємо дію
            const result = await this.executeAction(action, cardState.data);
            
            // Оновлюємо статистику
            this.stats.aiInteractions++;
            this.stats.successfulActions++;
            this.updateStatistic('ai-interactions', this.stats.aiInteractions);
            this.updateStatistic('success-rate', Math.round((this.stats.successfulActions / this.stats.aiInteractions) * 100));
            
            // Показуємо результат
            this.showActionResult(cardState, result);
            
            // Показуємо успішне повідомлення
            this.showNotification(`Дія "${originalText}" виконана успішно! ✅`, 'success');
            
        } catch (error) {
            console.error('Помилка виконання дії:', error);
            this.handleError(error, 'Не вдалося виконати дію');
        } finally {
            // Відновлюємо кнопку
            button.disabled = false;
            button.textContent = originalText;
        }
    }

    /**
     * Виконання дії
     */
    async executeAction(action, cardData) {
        // Спробуємо реальний API
        try {
            const response = await fetch(`${this.config.apiBase}/cards/${cardData.id}/action`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action, cardData })
            });
            
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.warn('API недоступний, використовуємо mock відповіді:', error);
        }
        
        // Fallback на mock відповіді
        return this.getMockActionResult(action, cardData);
    }

    /**
     * Mock результати для дій
     */
    async getMockActionResult(action, cardData) {
        // Симулюємо затримку
        await this.delay(Math.random() * 1000 + 500);
        
        const mockResults = {
            'ai-analysis': {
                type: 'ai-response',
                data: {
                    recommendations: [
                        'Покращити фарм у ранній грі (+15% ефективності)',
                        'Більше участі в командних боях',
                        'Оптимізувати білд під поточну мету'
                    ],
                    confidence: 0.92,
                    analysis: `AI аналіз для ${cardData.title} завершено успішно!`
                }
            },
            'download-guide': {
                type: 'download',
                data: {
                    url: `/downloads/guide_${cardData.type}.pdf`,
                    filename: `Гайд_${cardData.title}.pdf`,
                    size: '2.1 MB'
                }
            },
            'register': {
                type: 'registration',
                data: {
                    status: 'success',
                    tournamentId: 'mlbb_championship_2024',
                    nextMatch: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
                }
            },
            'find-team': {
                type: 'team-search',
                data: {
                    matches: 5,
                    recommendations: ['Team Alpha', 'Team Beta', 'Team Gamma'],
                    searchId: 'search_' + Date.now()
                }
            }
        };
        
        return mockResults[action] || {
            type: 'success',
            data: { message: `Дія ${action} виконана успішно!` }
        };
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
                    <strong>🤖 AI Рекомендації:</strong><br>
                    ${result.data.recommendations.map(rec => `• ${rec}`).join('<br>')}
                    <br><small>Впевненість: ${Math.round(result.data.confidence * 100)}%</small>
                `;
                break;
                
            case 'download':
                aiResponse.innerHTML = `
                    <strong>📥 Завантаження:</strong><br>
                    Файл: ${result.data.filename}<br>
                    Розмір: ${result.data.size}
                `;
                // Тут можна додати реальне завантаження
                break;
                
            case 'registration':
                aiResponse.innerHTML = `
                    <strong>🏆 Реєстрація:</strong><br>
                    Статус: Успішно зареєстровано<br>
                    Наступний матч: ${new Date(result.data.nextMatch).toLocaleDateString()}
                `;
                break;
                
            case 'team-search':
                aiResponse.innerHTML = `
                    <strong>👥 Пошук команди:</strong><br>
                    Знайдено ${result.data.matches} команд<br>
                    Рекомендації: ${result.data.recommendations.join(', ')}
                `;
                break;
                
            default:
                aiResponse.innerHTML = `
                    <strong>✅ Результат:</strong><br>
                    ${result.data.message}
                `;
        }
    }

    // ... (продовження коду в наступній частині)
}

// Глобальні утиліти та ініціалізація
window.AICardsHub = AICardsHub;

// Ініціалізація при завантаженні DOM
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.aiCardsHub = new AICardsHub();
        console.log('🎮 AI Cards Hub Revolution готовий до роботи!');
    } catch (error) {
        console.error('❌ Критична помилка ініціалізації:', error);
    }
});