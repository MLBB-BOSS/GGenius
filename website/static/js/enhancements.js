/**
 * @file enhancements.js
 * @description Game-themed website enhancements for the MLBB community.
 * This script provides various visual and interactive effects to enrich the user experience.
 * It adheres to modern JavaScript practices, focusing on performance, accessibility, and robustness.
 * @version 0.3.0
 * @author MLBB-BOSS (via Copilot assistance)
 */

/**
 * @class GameWebsiteEnhancer
 * @description Main class responsible for initializing and managing all website enhancements.
 * It checks for user preferences like reduced motion and detects low-performance environments
 * to adjust effects accordingly, aiming for a world-class quality experience.
 */
class GameWebsiteEnhancer {
    /**
     * @constructor
     * Initializes critical properties like user's preference for reduced motion and
     * detects if the environment is potentially low-performance.
     * Sets up a global error handler for enhancement-specific issues.
     */
    constructor() {
        /** @type {boolean} - True if the user prefers reduced motion. */
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        /** @type {boolean} - True if a low-performance environment is detected. */
        this.isLowPerformance = false; // Will be determined by setupPerformanceMode

        /** @type {object|null} - Stores references to DOM elements for reuse. */
        this.dom = {
            body: document.body,
            // Add other frequently accessed elements here if needed
        };

        this.init();
        this._setupGlobalErrorHandling(); // Налаштування глобального обробника помилок для модуля
    }

    /**
     * @private
     * @description Sets up a global error handler for issues originating from enhancements.
     * Це допомагає централізовано логувати помилки, не перериваючи роботу всього сайту.
     */
    _setupGlobalErrorHandling() {
        window.addEventListener('error', (event) => {
            if (event.filename && event.filename.includes('enhancements.js')) {
                console.warn('[GameWebsiteEnhancer Error]', event.message, event.error);
                // Тут можна додати відправку помилок на сервер аналітики, якщо потрібно
            }
        });
    }

    /**
     * @description Initializes all enhancement modules.
     * It considers performance and accessibility settings before enabling certain features.
     * Послідовність ініціалізації важлива: спочатку визначаємо продуктивність.
     */
    init() {
        this.setupPerformanceMode(); // Дуже важливо викликати першим

        this.setupScrollProgress();
        this.setupGamingCursor(); // Може бути спрощений або відключений у режимі низької продуктивності

        if (!this.prefersReducedMotion && !this.isLowPerformance) {
            this.setupParallaxEffect();
            this.setupTypingAnimation();
        } else {
            // Забезпечити коректне відображення контенту, якщо анімації відключені
            this._handleDisabledAnimations();
        }
        
        this.setupSoundEffects(); // Звуки можуть бути менш вимогливими, але теж варто контролювати
    }

    /**
     * @private
     * @description Ensures content reliant on animations (like typing text) is correctly displayed
     * when animations are disabled due to performance or accessibility settings.
     * Це гарантує, що користувач не втратить важливу інформацію.
     */
    _handleDisabledAnimations() {
        document.querySelectorAll('.typing-animation-target').forEach(el => {
            const textToDisplay = el.dataset.text || el.textContent;
            if (textToDisplay && el.textContent !== textToDisplay) { // Показувати лише якщо текст ще не встановлено
                el.textContent = textToDisplay;
            }
        });
        // Можна додати обробку для інших анімацій, якщо вони приховують контент до запуску
    }

    /**
     * @description Detects low-performance environments and applies a 'performance-mode' class to the body.
     * This allows CSS to selectively disable or reduce resource-intensive styles.
     * Логіка визначення: перевіряє кількість ядер процесора та об'єм оперативної пам'яті.
     * Ці значення є евристичними і можуть потребувати налаштування.
     */
    setupPerformanceMode() {
        const hasHardwareConcurrency = typeof navigator.hardwareConcurrency === 'number';
        const hasDeviceMemory = typeof navigator.deviceMemory === 'number'; // GB

        // Поріг для 'low-performance': менше 4 ядер АБО менше 4GB RAM.
        // Ці значення можуть бути скориговані залежно від цільової аудиторії та складності ефектів.
        this.isLowPerformance = (hasHardwareConcurrency && navigator.hardwareConcurrency < 4) ||
                                (hasDeviceMemory && navigator.deviceMemory < 4);

        if (this.isLowPerformance) {
            this.dom.body.classList.add('performance-mode');
            console.log("Performance mode activated: Animations and effects may be reduced.");
        }
    }

    /**
     * @description Creates and manages a scroll progress bar at the top of the page.
     * Uses `requestAnimationFrame` for smooth updates and `passive` event listener for performance.
     * Обробляє випадок, коли сторінка не прокручується.
     */
    setupScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        // Стилі для progressBar (position, top, left, height, background, z-index) мають бути в CSS.
        this.dom.body.appendChild(progressBar);

        let ticking = false;
        const updateScrollProgress = () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollHeight <= 0) { // Якщо сторінка не прокручується або вміст менший за екран
                progressBar.style.width = '0%';
                ticking = false;
                return;
            }
            const scrolled = (window.scrollY / scrollHeight) * 100;
            progressBar.style.width = `${Math.min(scrolled, 100)}%`; // Обмеження до 100%
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateScrollProgress);
                ticking = true;
            }
        }, { passive: true });

        // Initial update in case the page is already scrolled (e.g., after refresh)
        if (!ticking) {
            window.requestAnimationFrame(updateScrollProgress);
            ticking = true;
        }
    }

    /**
     * @description Implements a custom "gaming" cursor that follows the mouse.
     * Uses `requestAnimationFrame` and CSS transforms for smooth, hardware-accelerated animation.
     * CSS повинен визначати вигляд `.gaming-cursor`, `.cursor-dot`, `.cursor-ring`.
     * Важливо: курсор не повинен заважати взаємодії з елементами сторінки (`pointer-events: none`).
     */
    setupGamingCursor() {
        if (this.isLowPerformance && !this.prefersReducedMotion) { // Можна залишити простий курсор, якщо тільки isLowPerformance
             // console.log("Gaming cursor simplified due to performance mode.");
             // Можна додати клас для спрощеного курсора або повністю відключити
        }
        if(this.prefersReducedMotion) return; // Повністю відключаємо, якщо користувач так бажає

        const cursor = document.createElement('div');
        cursor.className = 'gaming-cursor'; // CSS: pointer-events: none;
        cursor.innerHTML = '<div class="cursor-dot"></div><div class="cursor-ring"></div>';
        this.dom.body.appendChild(cursor);

        let lastX = 0;
        let lastY = 0;
        let ticking = false;

        const updateCursorPosition = () => {
            cursor.style.transform = `translate3d(${lastX}px, ${lastY}px, 0)`;
            ticking = false;
        };

        document.addEventListener('mousemove', (e) => {
            lastX = e.clientX;
            lastY = e.clientY;
            if (!ticking) {
                window.requestAnimationFrame(updateCursorPosition);
                ticking = true;
            }
        }, { passive: true });

        // Ефекти натискання (можна розширити)
        document.addEventListener('mousedown', () => cursor.classList.add('clicked'), { passive: true });
        document.addEventListener('mouseup', () => cursor.classList.remove('clicked'), { passive: true });

        // Приховувати кастомний курсор, коли справжній курсор залишає вікно браузера
        document.addEventListener('mouseleave', () => cursor.classList.add('hidden'), { passive: true });
        document.addEventListener('mouseenter', () => cursor.classList.remove('hidden'), { passive: true });
    }

    /**
     * @description Animates text content of elements with class '.typing-animation-target'.
     * Text can be provided via `data-text` attribute or existing content.
     * Supports `data-typing-speed` (ms) and `data-typing-delay` (ms) attributes.
     * Пропускається, якщо `prefersReducedMotion` або `isLowPerformance`.
     * HTML Example: `<span class="hero-subtitle typing-animation-target" data-text="Welcome!" data-typing-speed="75" data-typing-delay="500"></span>`
     */
    setupTypingAnimation() {
        const targets = document.querySelectorAll('.typing-animation-target');
        if (targets.length === 0) return;

        targets.forEach(target => {
            const textToType = target.dataset.text || target.textContent.trim();
            if (!textToType) return;

            const speed = parseInt(target.dataset.typingSpeed, 10) || 50;
            const initialDelay = parseInt(target.dataset.typingDelay, 10) || 1000;
            
            target.textContent = ''; // Очистити перед початком
            let i = 0;

            const typeCharacter = () => {
                if (i < textToType.length) {
                    target.textContent += textToType.charAt(i);
                    i++;
                    setTimeout(typeCharacter, speed);
                } else {
                    target.classList.add('typing-complete');
                    // Можна додати тут "callback" або подію, якщо потрібно
                }
            };
            setTimeout(typeCharacter, initialDelay);
        });
    }

    /**
     * @description Sets up sound effects for interactive elements.
     * Uses Web Audio API. Handles cases where AudioContext might not be available or needs resuming.
     * Елементи для озвучення: `.cta-button, button, [data-sound-hover], [data-sound-click]`
     * Можна додати контроль гучності та можливість вимкнення звуків користувачем.
     */
    setupSoundEffects() {
        let audioContext;
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn("Web Audio API not supported. Sound effects disabled.", e);
            return;
        }

        // Функція для відтворення звуку. Покращено для обробки стану AudioContext.
        const playSound = (frequency, duration, type = 'sine', volume = 0.05) => {
            if (!audioContext) return;

            // Аудіоконтекст може бути "suspended" до першої взаємодії користувача.
            if (audioContext.state === 'suspended') {
                audioContext.resume().catch(err => console.warn("Failed to resume AudioContext:", err));
            }
            // Не відтворювати звук, якщо контекст все ще не активний.
            if (audioContext.state !== 'running') {
                 // console.log("AudioContext not running. Sound play aborted.");
                return;
            }

            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.type = type; // 'sine', 'square', 'sawtooth', 'triangle'
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            
            gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration); // Плавне затухання

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        };

        // Звук при кліку
        document.querySelectorAll('.cta-button, button, [data-sound-click]').forEach(element => {
            element.addEventListener('click', () => {
                const freq = parseInt(element.dataset.soundClickFreq) || 800;
                const dur = parseFloat(element.dataset.soundClickDur) || 0.1;
                playSound(freq, dur, 'triangle');
            }, { passive: true });
        });

        // Звук при наведенні (приклад, потребує CSS для :hover)
        document.querySelectorAll('[data-sound-hover]').forEach(element => {
            element.addEventListener('mouseenter', () => {
                const freq = parseInt(element.dataset.soundHoverFreq) || 1200;
                const dur = parseFloat(element.dataset.soundHoverDur) || 0.05;
                playSound(freq, dur, 'sine', 0.03);
            }, { passive: true });
        });
        // TODO: Додати можливість завантаження та відтворення коротких аудіофайлів замість генерованих тонів
        // для більш тематичного звучання.
        // TODO: Додати кнопку для користувача, щоб вмикати/вимикати звуки (зберігати вибір у localStorage).
    }

    /**
     * @description Applies a parallax scrolling effect to elements with class '.parallax-bg'.
     * Effect strength can be controlled via `data-parallax-speed` attribute (0.1 to 1.0).
     * Uses `requestAnimationFrame` for performance.
     * Пропускається, якщо `prefersReducedMotion` або `isLowPerformance`.
     * HTML: `<div class="parallax-bg" style="background-image: url(...);" data-parallax-speed="0.3"></div>`
     * CSS: `.parallax-bg` повинен мати `background-attachment: fixed;` (або інші налаштування для parallax)
     *      та визначені розміри.
     */
    setupParallaxEffect() {
        const parallaxElements = document.querySelectorAll('.parallax-bg');
        if (parallaxElements.length === 0) return;

        let ticking = false;

        const updateParallaxPositions = () => {
            parallaxElements.forEach(el => {
                const speed = Math.max(0.1, Math.min(1.0, parseFloat(el.dataset.parallaxSpeed) || 0.5));
                const rect = el.getBoundingClientRect();
                
                // Розрахунок видимості елемента для оптимізації:
                // Якщо елемент не у viewport, можна пропустити оновлення.
                const isInViewport = rect.top < window.innerHeight && rect.bottom >= 0;

                if (isInViewport) {
                    // Простий parallax для background-position. 
                    // Для більш складних ефектів (наприклад, transform) потрібен інший підхід.
                    // Цей варіант передбачає, що CSS елемента налаштований для parallax (напр. background-attachment).
                    const yPos = -(window.scrollY * speed * 0.5); // Коефіцієнт 0.5 для зменшення "сили" ефекту
                    el.style.backgroundPosition = `50% ${yPos}px`;
                }
            });
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateParallaxPositions);
                ticking = true;
            }
        }, { passive: true });

        // Initial update
        if (!ticking) {
            window.requestAnimationFrame(updateParallaxPositions);
            ticking = true;
        }
    }
}

// Initialize enhancements when the DOM is fully loaded and parsed.
document.addEventListener('DOMContentLoaded', () => {
    // Робимо екземпляр доступним глобально для легкого дебагу,
    // але в продакшені це можна прибрати або обмежити.
    window.gameWebsiteEnhancer = new GameWebsiteEnhancer();
    console.log("GameWebsiteEnhancer initialized.");
});

/**
 * TODOs for future enhancements (Креативні ідеї та покращення):
 * 1.  **Advanced Particle Effects:** For backgrounds or interactive elements, controllable via performance settings.
 * 2.  **Gamified Achievements/Notifications:** Pop-ups for specific user actions (e.g., first comment, X visits).
 * 3.  **Thematic Page Transitions:** Smooth, gaming-style transitions between pages (if site is SPA or using Turbo/HTMX).
 * 4.  **Interactive Mini-map/Navigation:** For sites with complex structure.
 * 5.  **User-configurable Themes:** Allow users to select different visual themes (colors, cursors, sound packs).
 * 6.  **Dynamic Content Loading Animations:** Skeletons loaders or thematic spinners for AJAX content.
 * 7.  **Easter Eggs:** Hidden interactive elements or codes for community engagement.
 */