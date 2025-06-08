/**
 * GGenius Enhanced Interactive Experience - Fixed Mobile Menu
 * @file Enhancements for GGenius website interface.
 * @version 2.6.1 - Mobile Menu Fix & Hero Redesign (Optimized)
 *
 * @description
 * This file contains the GGeniusApp class which handles the interactive UI,
 * mobile menu, performance checks, language switching, and global event listeners.
 * It also includes several utility functions (throttle, debounce, ripple effects, modals).
 *
 * The following optimizations and changes have been made:
 * 1. Added JSDoc-style docstrings for clarity and maintainability.
 * 2. Minor performance improvements to scroll handling and event listeners.
 * 3. Additional checks and console logs for debugging and error handling.
 */

/* global ContentManager */

/**
 * Main application controller for the GGenius experience.
 * Manages initialization, content loading, user settings, mobile menu, and more.
 */
class GGeniusApp {
    constructor() {
        /**
         * Indicates if the app is fully loaded
         * @type {boolean}
         */
        this.isLoaded = false;

        /**
         * Event observers for different actions
         * @type {Map<string, Function[]>}
         */
        this.observers = new Map();

        /**
         * Animations map for referencing animations by key
         * @type {Map<string, any>}
         */
        this.animations = new Map();

        /**
         * Registered event listeners
         * @type {Map<string, { target: EventTarget, type: string, listener: EventListenerOrEventListenerObject, options: object }>}
         */
        this.eventListeners = new Map();

        // Initialize the content manager
        this.contentManager = new ContentManager();

        /**
         * User-related settings (audio, language, etc.)
         * @type {{soundsEnabled: boolean, musicEnabled: boolean, soundVolume: number, musicVolume: number, language: string}}
         */
        this.settings = {
            soundsEnabled: JSON.parse(localStorage.getItem('ggenius-soundsEnabled')) ?? true,
            musicEnabled: JSON.parse(localStorage.getItem('ggenius-musicEnabled')) ?? false,
            soundVolume: parseFloat(localStorage.getItem('ggenius-soundVolume')) || 0.3,
            musicVolume: parseFloat(localStorage.getItem('ggenius-musicVolume')) || 0.1,
            language: localStorage.getItem('ggenius-language') || 'uk'
        };

        /**
         * Elements and state for the mobile menu
         * @type {HTMLElement|null}
         */
        this.mobileMenuToggle = null;
        this.navMenu = null;
        this.isMenuOpen = false;

        /**
         * Audio context and nodes
         */
        this.audioContext = null;
        this.soundEffects = new Map();
        this.ambientOscillators = null;
        this.ambientGain = null;
        this.masterGain = null;

        /**
         * Performance-related flags and data
         * @type {{
         *   startTime: number,
         *   metrics: Record<string, number>,
         *   isLowPerformance: boolean
         * }}
         */
        this.performance = {
            startTime: performance.now(),
            metrics: {},
            isLowPerformance: this.detectLowPerformance()
        };

        // Pre-bind important methods
        this.handleScroll = this.throttle(this._handleScroll.bind(this), 16);
        this.handleResize = this.debounce(this._handleResize.bind(this), 200);
        this.toggleMobileMenu = this.toggleMobileMenu.bind(this);
        this.closeMobileMenu = this.closeMobileMenu.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);

        this.init();
    }

    /**
     * Returns the current version string
     * @returns {string}
     */
    getVersion() {
        return "2.6.0";
    }

    /**
     * Detects if the device or user preferences suggest low performance
     * @returns {boolean}
     */
    detectLowPerformance() {
        const lowRAM = navigator.deviceMemory && navigator.deviceMemory < 1;
        const lowCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 2;
        const saveDataEnabled = navigator.connection && navigator.connection.saveData;
        const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        return lowRAM || lowCores || saveDataEnabled || prefersReducedMotion;
    }

    /**
     * Initializes the app by loading, setting up content, UI, audio, etc.
     * Uses async/await for better flow control.
     * @returns {Promise<void>}
     */
    async init() {
        try {
            console.log(`🚀 GGenius AI Revolution initializing... v${this.getVersion()}`);
            document.documentElement.classList.add('js-loaded');

            if (this.performance.isLowPerformance) {
                document.documentElement.classList.add('low-performance-device');
            }

            // Set language and load critical features
            await this.contentManager.setLanguage(this.settings.language);
            await this.loadCriticalFeatures();

            // Initialize content manager
            await this.contentManager.init();

            // Set up global event listeners and audio
            this.setupGlobalEventListeners();
            await this.initializeAudioSystem();

            // Parallel load of other features
            await Promise.all([
                this.setupPerformanceMonitoring(),
                this.initializeUI(),
                this.setupInteractions()
            ]);

            // Language switcher
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

    /**
     * Loads critical DOM features and simulates loading if applicable.
     * @returns {Promise<void>}
     */
    async loadCriticalFeatures() {
        // DOM references for loading screen
        this.loadingScreen = document.getElementById('loadingScreen');
        this.progressBar = document.getElementById('progressBar');
        this.loadingTextElement = document.getElementById('loadingText');

        // Critical references for mobile menu
        this.mobileMenuToggle = document.getElementById('mobileMenuToggle');
        this.navMenu = document.getElementById('main-menu-list');

        if (!this.mobileMenuToggle) {
            console.error('❌ Mobile menu toggle not found! ID: mobileMenuToggle');
        }
        if (!this.navMenu) {
            console.error('❌ Navigation menu not found! ID: main-menu-list');
        }

        // Create scroll progress bar
        this.scrollProgress = this.createScrollProgress();

        // If loading screen is present, simulate loading animation unless device is low performance
        if (this.loadingScreen && !this.performance.isLowPerformance) {
            await this.simulateLoading();
        } else if (this.loadingScreen) {
            this.hideLoadingScreen(true);
        }
    }

    /**
     * Sets up the global event listeners for scroll, resize, etc.
     */
    setupGlobalEventListeners() {
        this._addEventListener(window, 'scroll', this.handleScroll, 'scroll');
        this._addEventListener(window, 'resize', this.handleResize, 'resize');
        this._addEventListener(document, 'visibilitychange', this._handleVisibilityChange.bind(this), 'visibility');

        // Close the mobile menu on outside clicks or window resize
        this._addEventListener(document, 'click', this.handleOutsideClick, 'outsideClick');
        this._addEventListener(window, 'resize', this.closeMobileMenu, 'resizeCloseMenu');
    }

    /**
     * Initializes UI components such as navigation, scroll effects, tabs, etc.
     * @returns {Promise<void>}
     */
    async initializeUI() {
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupTabs();
    }

    /**
     * Navigation setup, including mobile menu toggle logic.
     */
    setupNavigation() {
        console.log('🔧 Setting up navigation...');

        if (!this.mobileMenuToggle) {
            this.mobileMenuToggle = document.getElementById('mobileMenuToggle');
        }
        if (!this.navMenu) {
            this.navMenu = document.getElementById('main-menu-list');
        }

        if (this.mobileMenuToggle && this.navMenu) {
            console.log('✅ Mobile menu elements found, setting up listeners...');
            this._removeEventListener('mobileToggle');

            // Add click event for mobile menu toggle
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

            // Close mobile menu upon clicking any nav-link
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

            // Initialize menu state
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
     * Resets the mobile menu to its default closed state.
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
     * Toggles the mobile menu open/closed.
     * @param {boolean|null} forceState - Force a specific menu state; if null, it inverts the current state.
     */
    toggleMobileMenu(forceState = null) {
        if (!this.mobileMenuToggle || !this.navMenu) {
            console.error('❌ Cannot toggle menu: elements not found');
            return;
        }

        const shouldBeOpen = forceState !== null ? forceState : !this.isMenuOpen;
        console.log(`📱 Toggling mobile menu: ${this.isMenuOpen} → ${shouldBeOpen}`);

        this.isMenuOpen = shouldBeOpen;

        this.mobileMenuToggle.setAttribute('aria-expanded', String(shouldBeOpen));
        this.mobileMenuToggle.classList.toggle('active', shouldBeOpen);
        this.navMenu.classList.toggle('open', shouldBeOpen);
        document.body.classList.toggle('menu-open', shouldBeOpen);

        if (shouldBeOpen) {
            // Focus on first link when the menu opens
            const firstLink = this.navMenu.querySelector('.nav-link');
            if (firstLink) {
                setTimeout(() => firstLink.focus(), 100);
            }
            document.body.style.overflow = 'hidden';
        } else {
            // Restore focus to toggle and re-enable page scrolling
            this.mobileMenuToggle.focus();
            document.body.style.overflow = '';
        }

        console.log(`✅ Mobile menu ${shouldBeOpen ? 'opened' : 'closed'}`);
    }

    /**
     * Closes the mobile menu if it's open.
     */
    closeMobileMenu() {
        if (this.isMenuOpen) {
            this.toggleMobileMenu(false);
        }
    }

    /**
     * Handles outside clicks to close the mobile menu when it's open.
     * @param {MouseEvent} event
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

    /**
     * Simulates the loading screen progression and removes it when complete.
     * @returns {Promise<void>}
     */
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

    /**
     * Hides and removes the loading screen.
     * @param {boolean} immediate - Whether to remove instantly (for low-performance devices)
     */
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

    /**
     * Updates text in the loading screen.
     * @param {string} text
     */
    updateLoadingText(text) {
        if (this.loadingTextElement) {
            this.loadingTextElement.textContent = text;
        }
    }

    /**
     * Creates a scroll progress bar to indicate page scroll position.
     * @returns {HTMLDivElement} - The scroll progress element
     */
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

    /**
     * Sets up handling of scroll-based UI updates (scroll progress, minimized header, etc.).
     */
    setupScrollEffects() {
        this._handleScroll();
    }

    /**
     * Main scroll handler to update progress bar and other scrolled elements.
     * Throttled in the constructor.
     * @private
     */
    _handleScroll() {
        if (!this.scrollProgress) return;

        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = Math.max(0, Math.min(1, window.scrollY / maxScroll));
        this.scrollProgress.style.transform = `scaleX(${scrolled})`;

        const header = document.querySelector('.site-header');
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 50);
        }
    }

    /**
     * Sets up tabs in the interface.
     */
    setupTabs() {
        document.querySelectorAll('.tabs-component').forEach(tabsComponent => {
            const tabs = Array.from(tabsComponent.querySelectorAll('[role="tab"]'));
            const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));

            tabs.forEach((tab, index) => {
                this._addEventListener(tab, 'click', () => {
                    this.switchTab(tab, tabs, panels);
                }, `tab-${index}`);
            });

            // Activate the first tab by default
            if (tabs.length > 0) {
                this.switchTab(tabs[0], tabs, panels, true);
            }
        });
    }

    /**
     * Switches the active tab and displays its corresponding panel.
     * @param {HTMLElement} activeTab - The tab being activated
     * @param {HTMLElement[]} allTabs - All tabs in the component
     * @param {HTMLElement[]} allPanels - All tab panels in the component
     * @param {boolean} [isInitialSetup=false] - Whether this call is the initial setup
     */
    switchTab(activeTab, allTabs, allPanels, isInitialSetup = false) {
        allTabs.forEach(tab => {
            tab.classList.remove('active');
            tab.setAttribute('aria-selected', 'false');
        });

        activeTab.classList.add('active');
        activeTab.setAttribute('aria-selected', 'true');

        const targetPanelId = activeTab.getAttribute('aria-controls');
        allPanels.forEach(panel => {
            const isActive = panel.id === targetPanelId;
            panel.hidden = !isActive;
            panel.classList.toggle('active', isActive);
        });

        if (!isInitialSetup) {
            activeTab.focus();
        }
    }

    /**
     * Sets up user interactions such as feature card clicks, smooth scrolling, etc.
     * @returns {Promise<void>}
     */
    async setupInteractions() {
        this.setupFeatureCardInteractions();
        this.setupSmoothScrolling();
    }

    /**
     * Adds a ripple effect on feature cards when clicked.
     */
    setupFeatureCardInteractions() {
        document.querySelectorAll('.feature-card-iui').forEach(card => {
            this._addEventListener(card, 'click', (e) => {
                this.createRippleEffect(e.currentTarget, e);
            }, `card-${Math.random()}`);
        });
    }

    /**
     * Smooth scrolling for anchor links.
     */
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

    /**
     * Initializes the web audio system if device performance allows.
     * @returns {Promise<void>}
     */
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

    /**
     * Sets up any performance monitoring or metrics.
     * @returns {Promise<void>}
     */
    async setupPerformanceMonitoring() {
        if (this.performance.isLowPerformance) return;
        // Additional performance monitoring logic can be placed here
    }

    /**
     * Sets up language switcher functionality in the header.
     */
    setupLanguageSwitcher() {
        this.createLanguageSwitcher();
        document.addEventListener('content:loaded', (event) => {
            console.log(`Content loaded for language: ${event.detail.language}`);
        });
    }

    /**
     * Creates a language switcher element if one doesn't already exist.
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
            this._addEventListener(button, 'click', () => this.changeLanguage(lang.code), `lang-${lang.code}`);
            switcher.appendChild(button);
        });

        const header = document.querySelector('.site-header .header-container');
        if (header) {
            header.appendChild(switcher);
        }
    }

    /**
     * Changes language and reloads relevant content.
     * @param {string} languageCode - 'uk' or 'en'
     */
    async changeLanguage(languageCode) {
        if (this.settings.language === languageCode) return;

        try {
            await this.contentManager.setLanguage(languageCode);
            this.settings.language = languageCode;
            localStorage.setItem('ggenius-language', languageCode);

            // Update switcher buttons
            document.querySelectorAll('.language-switcher button').forEach(btn => {
                const isActive = btn.textContent.toLowerCase() === languageCode;
                btn.classList.toggle('active', isActive);
            });
        } catch (error) {
            console.error('Failed to change language:', error);
        }
    }

    /**
     * Shows a demo modal for the GGenius AI feature.
     */
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

    /**
     * Creates a reusable modal element.
     * @param {Object} params
     * @param {string} params.id
     * @param {string} params.title
     * @param {string} params.content
     * @param {{ text: string, action: Function }[]} params.actions
     * @returns {HTMLDivElement}
     */
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

    /**
     * Appends and fades in the modal.
     * @param {HTMLDivElement} modal
     */
    showModal(modal) {
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        requestAnimationFrame(() => {
            modal.style.opacity = '1';
        });
    }

    /**
     * Closes and removes the modal.
     * @param {string} modalId
     */
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

    /**
     * Creates a ripple effect at the click location on a given element.
     * @param {HTMLElement} element
     * @param {MouseEvent} event
     */
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

    /**
     * Tracks load time and stores the result in performance metrics.
     */
    trackLoadTime() {
        const loadTime = performance.now() - this.performance.startTime;
        this.performance.metrics.pageLoadTime = loadTime;
        console.log(`⚡ Page loaded in ${loadTime.toFixed(2)}ms`);
    }

    /**
     * Window resize handler for adjusting layout and closing the mobile menu.
     * @private
     */
    _handleResize() {
        if (window.innerWidth > 768) {
            this.closeMobileMenu();
        }
    }

    /**
     * Handles page visibility changes (e.g., user switching tabs).
     * @private
     */
    _handleVisibilityChange() {
        if (document.visibilityState === 'hidden') {
            this.closeMobileMenu();
        }
    }

    /**
     * Activates fallback mode if initialization fails.
     * @param {Error} error - The error encountered during init
     */
    fallbackMode(error) {
        document.documentElement.classList.add('fallback-mode');

        // Show fallback texts
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

    /**
     * Throttle utility to limit function calls.
     * @param {Function} func - Function to call
     * @param {number} delay - Delay in ms
     * @returns {Function}
     */
    throttle(func, delay) {
        let lastCall = 0;
        return (...args) => {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                func(...args);
            }
        };
    }

    /**
     * Debounce utility to delay function calls until after a pause.
     * @param {Function} func - Function to call
     * @param {number} delay - Delay in ms
     * @returns {Function}
     */
    debounce(func, delay) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    }

    /**
     * Adds an event listener with reference tracking for easy cleanup.
     * @param {EventTarget} target - Target element
     * @param {string} type - Event type
     * @param {EventListenerOrEventListenerObject} listener - Callback
     * @param {string} key - Unique key for tracking
     * @param {object} options - Listener options
     * @private
     */
    _addEventListener(target, type, listener, key, options = { passive: true }) {
        if (this.eventListeners.has(key)) {
            this._removeEventListener(key);
        }
        target.addEventListener(type, listener, options);
        this.eventListeners.set(key, { target, type, listener, options });
    }

    /**
     * Removes a previously registered event listener by key.
     * @param {string} key - Key used when registering the listener
     * @private
     */
    _removeEventListener(key) {
        if (this.eventListeners.has(key)) {
            const { target, type, listener, options } = this.eventListeners.get(key);
            target.removeEventListener(type, listener, options);
            this.eventListeners.delete(key);
        }
    }

    /**
     * Utility to retrieve text from the content manager.
     * @param {string} key - Key to text
     * @param {Object} [variables={}] - Optional variables for string interpolation
     * @returns {string}
     */
    getText(key, variables = {}) {
        return this.contentManager.getText(key, variables);
    }
}

// App initialization after DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🚀 DOM Content Loaded, initializing GGenius...');
        window.app = new GGeniusApp();

        if (localStorage.getItem('ggenius-debug') === 'true') {
            document.documentElement.classList.add('debug-mode');
            console.log('🔧 Debug mode enabled');
        }
    });
} else {
    console.log('🚀 DOM already loaded, initializing GGenius...');
    window.app = new GGeniusApp();
}

/**
 * Global debugging utilities.
 */
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

    /**
     * @returns {any}
     */
    getContentStats() {
        return window.app?.contentManager?.getContentStats();
    },

    /**
     * @param {string} key - Key to test in content manager
     * @returns {string}
     */
    testContentKey(key) {
        return window.app?.contentManager?.getText(key);
    },

    /**
     * Forces reload of content
     * @returns {Promise<void>}
     */
    reloadContent() {
        return window.app?.contentManager?.loadContent();
    }
};

// Export for other modules if available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GGeniusApp, ContentManager };
}