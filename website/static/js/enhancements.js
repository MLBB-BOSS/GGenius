/**
 * GGenius Enhanced Interactive Experience
 * Performance-optimized ES2023+ JavaScript for cyberpunk AI platform
 * @version 2.2.5 // Enhanced with robust audio, UI, and error handling
 * @author GGenius Team
 * @see GGeniusApp
 */

/**
 * @class GGeniusApp
 * @description Основний клас для ініціалізації та управління інтерактивними функціями веб-додатку GGenius.
 * Покращено розширеною аудіосистемою, кіберпанковими звуковими ефектами та завершеними функціями UI/утилітами.
 */
class GGeniusApp {
    constructor() {
        this.isLoaded = false;
        this.observers = new Map();
        this.animations = new Map();
        this.eventListeners = new Map();

        this.settings = {
            soundsEnabled: JSON.parse(localStorage.getItem('ggenius-soundsEnabled')) ?? true,
            musicEnabled: JSON.parse(localStorage.getItem('ggenius-musicEnabled')) ?? false,
            soundVolume: parseFloat(localStorage.getItem('ggenius-soundVolume')) || 0.3,
            musicVolume: parseFloat(localStorage.getItem('ggenius-musicVolume')) || 0.1,
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
        return "2.2.5";
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

            await this.loadCriticalFeatures();
            this.setupGlobalEventListeners();
            await this.initializeAudioSystem();

            await Promise.all([
                this.setupPerformanceMonitoring(),
                this.initializeUI(),
                this.setupInteractions()
            ]);

            await this.setupAdvancedFeatures();

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

    async initializeAudioSystem() {
        if (this.performance.isLowPerformance) {
            this.settings.soundsEnabled = false;
            this.settings.musicEnabled = false;
            return;
        }

        try {
            if (!this.audioContext || this.audioContext.state === 'closed') {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }

            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }

            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.setValueAtTime(this.settings.soundVolume, this.audioContext.currentTime);
            this.masterGain.connect(this.audioContext.destination);

            this.ambientGain = this.audioContext.createGain();
            this.ambientGain.gain.setValueAtTime(this.settings.musicVolume, this.audioContext.currentTime);
            this.ambientGain.connect(this.audioContext.destination);

            await this.loadSoundEffects();
            this.setupAudioUnlock();

            if (this.settings.musicEnabled) {
                this.startAmbientMusic();
            }
        } catch (error) {
            console.error('🔇 Failed to initialize audio system:', error);
            this.settings.soundsEnabled = false;
            this.settings.musicEnabled = false;
        }
    }

    async loadSoundEffects() {
        const soundConfigs = {
            'button_hover': { type: 'cyberpunk_chirp', frequency: 800, duration: 0.08, volume: 0.15 },
            'button_click': { type: 'cyber_beep', frequency: 1200, duration: 0.12, volume: 0.25 },
            'nav_select': { type: 'digital_blip', frequency: 600, duration: 0.15, volume: 0.2 },
            'tab_switch': { type: 'matrix_sweep', frequency: [400, 800], duration: 0.18, volume: 0.2, sweep: true },
            'accordion_open': { type: 'expand_whoosh', frequency: [200, 600], duration: 0.25, volume: 0.18 },
            'accordion_close': { type: 'contract_swoosh', frequency: [600, 200], duration: 0.2, volume: 0.15 },
            'modal_open': { type: 'portal_open', frequency: [300, 900], duration: 0.35, volume: 0.3 },
            'modal_close': { type: 'portal_close', frequency: [900, 300], duration: 0.25, volume: 0.2 },
            'form_success': { type: 'success_chime', frequency: [523, 659, 784], duration: 0.4, volume: 0.3 },
            'form_error': { type: 'error_buzz', frequency: 150, duration: 0.3, volume: 0.25 },
            'notification': { type: 'cyber_notification', frequency: [1000, 1200, 800], duration: 0.5, volume: 0.25 },
            'startup': { type: 'system_boot', frequency: [100, 200, 400, 800], duration: 1.2, volume: 0.2 },
            'menu_open': { type: 'slide_in', frequency: [400, 600], duration: 0.3, volume: 0.18 },
            'menu_close': { type: 'slide_out', frequency: [600, 400], duration: 0.25, volume: 0.15 },
            'card_hover': { type: 'soft_ping', frequency: 400, duration: 0.06, volume: 0.1 },
            'scroll_milestone': { type: 'achievement_ding', frequency: [659, 831], duration: 0.2, volume: 0.15 },
            'loading_tick': { type: 'digital_blip', frequency: 700, duration: 0.05, volume: 0.1 },
            'loading_complete': { type: 'portal_close', frequency: [900, 300], duration: 0.25, volume: 0.2 }
        };
        for (const [name, config] of Object.entries(soundConfigs)) {
            this.soundEffects.set(name, config);
        }
    }

    setupAudioUnlock() {
        const unlockAudio = async () => {
            if (this.audioContext?.state === 'suspended') {
                await this.audioContext.resume();
                document.removeEventListener('touchstart', unlockAudio);
                document.removeEventListener('touchend', unlockAudio);
                document.removeEventListener('click', unlockAudio);
            }
        };
        document.addEventListener('touchstart', unlockAudio, { once: true, passive: true });
        document.addEventListener('touchend', unlockAudio, { once: true, passive: true });
        document.addEventListener('click', unlockAudio, { once: true, passive: true });
    }

    playSound(soundName, overrides = {}) {
        if (!this.settings.soundsEnabled || !this.audioContext || this.audioContext.state === 'closed' || this.performance.isLowPerformance) {
            return;
        }
        const soundConfig = this.soundEffects.get(soundName);
        if (!soundConfig) return;
        try {
            const config = { ...soundConfig, ...overrides };
            this.synthesizeSound(config);
        } catch (error) {
            console.error(`Error playing sound "${soundName}":`, error);
        }
    }

    synthesizeSound(config) {
        const ctx = this.audioContext;
        if (!ctx || ctx.state === 'closed') return;
        const now = ctx.currentTime;
        const { frequency = 440, duration = 0.1, volume = 0.1 } = config;
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(Array.isArray(frequency) ? frequency[0] : frequency, now);
        gainNode.gain.setValueAtTime(volume, now);
        osc.connect(gainNode);
        gainNode.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + duration);
    }

    setSoundVolume(volume) {
        this.settings.soundVolume = Math.max(0, Math.min(1, volume));
        localStorage.setItem('ggenius-soundVolume', String(this.settings.soundVolume));
        if (this.masterGain && this.audioContext?.state !== 'closed') {
            this.masterGain.gain.setValueAtTime(this.settings.soundVolume, this.audioContext.currentTime);
        }
    }

    setMusicVolume(volume) {
        this.settings.musicVolume = Math.max(0, Math.min(1, volume));
        localStorage.setItem('ggenius-musicVolume', String(this.settings.musicVolume));
        if (this.ambientGain && this.audioContext?.state !== 'closed') {
            this.ambientGain.gain.setValueAtTime(this.settings.musicVolume, this.audioContext.currentTime);
        }
    }

    toggleSounds(enabled = !this.settings.soundsEnabled) {
        if (this.performance.isLowPerformance && enabled) return;
        this.settings.soundsEnabled = enabled;
        localStorage.setItem('ggenius-soundsEnabled', JSON.stringify(enabled));
        if (enabled && (!this.audioContext || this.audioContext.state === 'closed')) {
            this.initializeAudioSystem();
        }
    }

    toggleMusic(enabled = !this.settings.musicEnabled) {
        if (this.performance.isLowPerformance && enabled) return;
        this.settings.musicEnabled = enabled;
        localStorage.setItem('ggenius-musicEnabled', JSON.stringify(enabled));
        if (enabled) {
            if (!this.audioContext || this.audioContext.state === 'closed') {
                this.initializeAudioSystem().then(() => this.startAmbientMusic());
            } else {
                this.startAmbientMusic();
            }
        } else {
            this.stopAmbientMusic();
        }
    }

    async simulateLoading() {
        return new Promise((resolve) => {
            if (!this.loadingScreen) {
                resolve();
                return;
            }
            if (!this.progressBar || !this.loadingTextElement) {
                this.hideLoadingScreen(true);
                resolve();
                return;
            }

            let progress = 0;
            const messages = [
                'Ініціалізація GGenius AI...', 'Завантаження нейронних мереж...',
                'Підключення до кіберспорт серверів...', 'Активація штучного інтелекту...',
                'Синхронізація з eSports API...', 'Готовність до революції!'
            ];
            let messageIndex = 0;

            const updateProgress = () => {
                progress = Math.min(progress + Math.random() * 15 + 5, 100);
                this.progressBar.style.transform = `scaleX(${progress / 100})`;
                this.progressBar.setAttribute('aria-valuenow', String(Math.round(progress)));

                const currentMessageIndex = Math.min(Math.floor((progress / 100) * messages.length), messages.length - 1);
                if (messageIndex !== currentMessageIndex) {
                    messageIndex = currentMessageIndex;
                    this.updateLoadingText(messages[messageIndex]);
                    this.playSound('loading_tick');
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
        if (!immediate) this.playSound('loading_complete');
        setTimeout(() => this.loadingScreen?.remove(), immediate ? 50 : 500);
    }

    toggleMobileMenu(forceOpen) {
        if (!this.mobileToggle || !this.navMenu) return;
        const shouldBeOpen = typeof forceOpen === 'boolean' ? forceOpen : this.mobileToggle.getAttribute('aria-expanded') !== 'true';
        this.mobileToggle.setAttribute('aria-expanded', String(shouldBeOpen));
        this.mobileToggle.classList.toggle('active', shouldBeOpen);
        this.navMenu.classList.toggle('open', shouldBeOpen);
        document.body.classList.toggle('menu-open', shouldBeOpen);
        this.playSound(shouldBeOpen ? 'menu_open' : 'menu_close');
        if (shouldBeOpen) this.navMenu.querySelector('a[href], button')?.focus();
        else this.mobileToggle.focus();
    }

    toggleAccordion(header, content) {
        const isOpen = header.getAttribute('aria-expanded') === 'true';
        if (isOpen) this.closeAccordion(header, content);
        else this.openAccordion(header, content);
        this.playSound(isOpen ? 'accordion_close' : 'accordion_open');
    }

    switchTab(activeTab, allTabs, allPanels, isInitialSetup = false) {
        allTabs.forEach(tab => {
            tab.classList.remove('active');
            tab.setAttribute('aria-selected', 'false');
            tab.tabIndex = -1;
        });
        activeTab.classList.add('active');
        activeTab.setAttribute('aria-selected', 'true');
        activeTab.tabIndex = 0;

        const targetPanelId = activeTab.getAttribute('aria-controls');
        allPanels.forEach(panel => {
            panel.hidden = panel.id !== targetPanelId;
            panel.setAttribute('aria-hidden', String(panel.id !== targetPanelId));
        });

        if (!isInitialSetup) {
            activeTab.focus();
            this.playSound('tab_switch');
        }
    }

    showDemoModal() {
        const modalId = 'demo-modal-ggenius';
        if (document.getElementById(modalId)) return;

        const modalContent = `
            <p>Ласкаво просимо до демонстрації GGenius AI!</p>
            <p>Наразі ця функція в розробці. Слідкуйте за оновленнями!</p>
            <button type="button" onclick="app.scrollToNewsletter()">Підписатися</button>
        `;
        const modal = this.createModal({
            id: modalId,
            title: 'GGenius AI Demo',
            content: modalContent,
            actions: [{ text: 'Закрити', action: () => this.closeModal(modalId) }]
        });
        this.showModal(modal);
    }

    createModal({ id, title, content, actions = [] }) {
        const modalTitleId = `${id}-title`;
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = id;
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', modalTitleId);

        let actionsHTML = actions.map((action, index) => 
            `<button type="button" data-action-index="${index}">${action.text}</button>`
        ).join('');

        modal.innerHTML = `
            <div class="modal-container">
                <h2 id="${modalTitleId}">${title}</h2>
                <button type="button" data-close-modal aria-label="Закрити">X</button>
                <div class="modal-body">${content}</div>
                <div class="modal-actions">${actionsHTML}</div>
            </div>
        `;

        this._addEventListener(modal.querySelector('[data-close-modal]'), 'click', () => this.closeModal(id), `modalCloseBtn-${id}`);
        actions.forEach((action, index) => {
            const button = modal.querySelector(`[data-action-index="${index}"]`);
            this._addEventListener(button, 'click', action.action, `modalAction-${id}-${index}`);
        });
        return modal;
    }

    showModal(modal) {
        this.lastFocusedElementBeforeModal = document.activeElement;
        document.body.appendChild(modal);
        document.body.classList.add('modal-open');
        modal.querySelector('.modal-container')?.focus();
        requestAnimationFrame(() => modal.classList.add('show'));
        this.playSound('modal_open');
    }

    async setupNewsletterForm(form) {
        this._addEventListener(form, 'submit', async (e) => {
            e.preventDefault();
            const emailInput = form.querySelector('input[type="email"]');
            const email = emailInput?.value.trim();
            if (!this.validateEmail(email)) {
                this.showToast('Некоректна email адреса.', 'error');
                this.playSound('form_error');
                return;
            }
            try {
                await this.submitNewsletterSignup({ email });
                this.showToast('Успішно підписано!', 'success');
                this.playSound('form_success');
                form.reset();
            } catch (error) {
                this.showToast('Помилка підписки.', 'error');
                this.playSound('form_error');
            }
        }, 'newsletterSubmit');
    }

    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast('Скопійовано!', 'success');
            this.playSound('button_click');
        } catch (error) {
            this.showToast('Помилка копіювання.', 'error');
            this.playSound('form_error');
        }
    }

    showToast(message, type = 'info', duration = 3500) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `<span>${message}</span>`;
        const container = this.getOrCreateToastContainer();
        container.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('show'));
        if (duration > 0) setTimeout(() => this.removeToast(toast), duration);
        return toast;
    }

    setupFeatureCardInteractions() {
        document.querySelectorAll('.feature-card-iui').forEach(card => {
            const cardId = card.id || `card-${Math.random().toString(36).substring(2)}`;
            this._addEventListener(card, 'mouseenter', () => this.playSound('card_hover'), `cardEnter-${cardId}`);
            this._addEventListener(card, 'click', (e) => {
                this.playSound('button_click');
                this.createRippleEffect(e.currentTarget, e);
            }, `cardClick-${cardId}`);
        });
    }

    startAmbientMusic() {
        if (!this.settings.musicEnabled || !this.audioContext || this.audioContext.state === 'closed' || this.performance.isLowPerformance) return;
        if (this.ambientOscillators) return;

        this.ambientOscillators = [this.audioContext.createOscillator()];
        this.ambientOscillators[0].type = 'sine';
        this.ambientOscillators[0].frequency.setValueAtTime(55, this.audioContext.currentTime);
        this.ambientOscillators[0].connect(this.ambientGain);
        this.ambientOscillators[0].start();
    }

    stopAmbientMusic() {
        if (this.ambientOscillators && this.audioContext?.state !== 'closed') {
            this.ambientOscillators.forEach(osc => osc.stop());
            this.ambientOscillators = null;
        }
    }

    setupGamingCursor() {
        if (this.performance.isLowPerformance || window.innerWidth <= 768) return;
        const cursorEl = document.createElement('div');
        cursorEl.className = 'gaming-cursor';
        document.body.appendChild(cursorEl);

        let mouseX = 0, mouseY = 0;
        const animateCursor = () => {
            cursorEl.style.left = `${mouseX}px`;
            cursorEl.style.top = `${mouseY}px`;
            this.animations.set('gamingCursor', requestAnimationFrame(animateCursor));
        };
        this._addEventListener(window, 'mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }, 'gamingCursorMove');
        animateCursor();
    }

    trackLoadTime() {
        const loadTime = performance.now() - this.performance.startTime;
        this.performance.metrics.pageLoadTime = loadTime;
    }

    _handleResize() {
        if (window.innerWidth <= 768 && this.animations.has('gamingCursor')) {
            cancelAnimationFrame(this.animations.get('gamingCursor'));
            this.animations.delete('gamingCursor');
            document.querySelector('.gaming-cursor')?.remove();
        } else if (window.innerWidth > 768 && !this.animations.has('gamingCursor')) {
            this.setupGamingCursor();
        }
    }

    _handleVisibilityChange() {
        if (document.visibilityState === 'hidden') {
            this.pauseAnimationsAndAudio();
        } else {
            this.resumeAnimationsAndAudio();
        }
    }

    pauseAnimationsAndAudio() {
        this.animations.forEach((id, key) => {
            if (key === 'gamingCursor') cancelAnimationFrame(id);
        });
        if (this.audioContext?.state === 'running') this.audioContext.suspend();
    }

    resumeAnimationsAndAudio() {
        if (!this.animations.has('gamingCursor') && window.innerWidth > 768) {
            this.setupGamingCursor();
        }
        if (this.audioContext?.state === 'suspended') this.audioContext.resume();
    }

    fallbackMode(error) {
        document.documentElement.classList.add('fallback-mode');
        const message = document.createElement('div');
        message.innerHTML = `<p>Помилка завантаження GGenius: ${error.message}. Спробуйте оновити сторінку.</p>`;
        document.body.prepend(message);
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
        this._removeEventListener(key);
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

    destroy() {
        this.animations.forEach(id => cancelAnimationFrame(id));
        this.animations.clear();
        this.eventListeners.forEach((_, key) => this._removeEventListener(key));
        this.eventListeners.clear();
        this.stopAmbientMusic();
        if (this.audioContext?.state !== 'closed') this.audioContext.close();
    }

    createScrollProgress() {
        const progress = document.createElement('div');
        progress.id = 'scrollProgress';
        progress.setAttribute('role', 'progressbar');
        progress.setAttribute('aria-valuenow', '0');
        document.body.prepend(progress);
        return progress;
    }

    updateLoadingText(text) {
        if (this.loadingTextElement) this.loadingTextElement.textContent = text;
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

    async setupPerformanceMonitoring() {
        if (this.performance.isLowPerformance) return;
        this.setupFrameRateMonitoring();
    }

    setupFrameRateMonitoring() {
        let frameCount = 0;
        let lastTime = performance.now();
        const countFrames = (currentTime) => {
            frameCount++;
            if (currentTime - lastTime >= 1000) {
                this.performance.metrics.fps = frameCount;
                frameCount = 0;
                lastTime = currentTime;
            }
            this.animations.set('fpsMonitor', requestAnimationFrame(countFrames));
        };
        requestAnimationFrame(countFrames);
    }

    async initializeUI() {
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupAccordions();
        this.setupTabs();
    }

    setupNavigation() {
        if (this.mobileToggle) {
            this._addEventListener(this.mobileToggle, 'click', () => this.toggleMobileMenu(), 'mobileToggleClick');
        }
    }

    setupScrollEffects() {
        this._addEventListener(window, 'scroll', this.handleScroll, 'scrollProgressUpdater');
        this._handleScroll();
    }

    _handleScroll() {
        const scrollPercentage = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        this.scrollProgress.style.transform = `scaleX(${scrollPercentage})`;
        this.scrollProgress.setAttribute('aria-valuenow', String(Math.round(scrollPercentage * 100)));
    }

    setupAccordions() {
        document.querySelectorAll('.accordion-section').forEach((accordion, index) => {
            const header = accordion.querySelector('.accordion-header');
            const content = accordion.querySelector('.accordion-content');
            if (!header || !content) return;
            header.setAttribute('aria-controls', `content-${index}`);
            content.id = `content-${index}`;
            this._addEventListener(header, 'click', () => this.toggleAccordion(header, content), `accordionClick-${index}`);
        });
    }

    openAccordion(header, content) {
        header.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = `${content.scrollHeight}px`;
    }

    closeAccordion(header, content) {
        header.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = '0';
    }

    setupTabs() {
        document.querySelectorAll('.tabs-component').forEach(tabsComponent => {
            const tabs = Array.from(tabsComponent.querySelectorAll('[role="tab"]'));
            const panels = Array.from(tabsComponent.querySelectorAll'[role="tabpanel"]'));
            tabs.forEach((tab, index) => {
                tab.setAttribute('aria-controls', panels[index].id);
                this._addEventListener(tab, 'click', () => this.switchTab(tab, tabs, panels), `tabClick-${index}`);
            });
            this.switchTab(tabs[0], tabs, panels, true);
        });
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.remove();
            document.body.classList.remove('modal-open');
            this.playSound('modal_close');
        }
    }

    scrollToNewsletter() {
        document.getElementById('newsletterForm')?.scrollIntoView({ behavior: 'smooth' });
    }

    setupForms() {
        const form = document.getElementById('newsletterForm');
        if (form) this.setupNewsletterForm(form);
    }

    showError(message) {
        this.showToast(message, 'error');
    }

    async submitNewsletterSignup(data) {
        return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 1000));
    }

    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    removeToast(toast) {
        toast?.remove();
    }

    getOrCreateToastContainer() {
        let container = document.getElementById('toast-container-ggenius');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container-ggenius';
            document.body.appendChild(container);
        }
        return container;
    }

    async setupInteractions() {
        this.setupFeatureCardInteractions();
        this.setupSmoothScrolling();
    }

    createRippleEffect(element, event) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
        element.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    setupSmoothScrolling() {
        this._addEventListener(document, 'click', (e) => {
            const anchor = e.target.closest('a[href^="#"]');
            if (anchor) {
                e.preventDefault();
                const targetId = anchor.getAttribute('href').substring(1);
                document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
            }
        }, 'smoothScrollGlobalClick');
    }

    async setupAdvancedFeatures() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(error => console.error('ServiceWorker failed:', error));
        }
    }
}

const app = new GGeniusApp();
window.app = app;