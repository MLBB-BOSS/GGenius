/**
 * Gaming-style website enhancements for MLBB community
 * Оптимізовано для продуктивності та сумісності з різними пристроями
 */

class GameWebsiteEnhancer {
    constructor() {
        this.isLoaded = false;
        this.loadingStartTime = Date.now();
        this.minimumLoadingTime = 1500; // Мінімальний час показу завантаження
        this.maximumLoadingTime = 8000; // Максимальний час очікування
        this.resourcesLoaded = {
            fonts: false,
            images: false,
            dom: false
        };
        
        this.init();
    }

    /**
     * Ініціалізує всі компоненти системи
     */
    init() {
        this.setupLoadingManager();
        this.setupScrollProgress();
        this.setupTypingAnimation();
        this.setupGamingCursor();
        this.setupSoundEffects();
        this.setupPerformanceMode();
        this.setupAccordionEffect();
        this.setupMobileNavigation();
        this.setupFormHandlers();
        this.setupIntersectionObserver();
        this.setupErrorHandling();
    }

    /**
     * Управління екраном завантаження з покращеною логікою
     */
    setupLoadingManager() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (!loadingScreen) {
            console.warn('Loading screen element not found');
            return;
        }

        // Встановлюємо максимальний таймаут
        const maxLoadingTimeout = setTimeout(() => {
            console.warn('Loading timeout reached, forcing hide');
            this.hideLoadingScreen();
        }, this.maximumLoadingTime);

        // Перевіряємо готовність DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.resourcesLoaded.dom = true;
                this.checkAllResourcesLoaded();
            });
        } else {
            this.resourcesLoaded.dom = true;
        }

        // Перевіряємо завантаження шрифтів
        this.checkFontsLoaded();

        // Перевіряємо завантаження зображень
        this.checkImagesLoaded();

        // Перевіряємо мінімальний час показу
        setTimeout(() => {
            this.checkAllResourcesLoaded();
        }, this.minimumLoadingTime);

        // Очищаємо таймаут при успішному завантаженні
        this.maxLoadingTimeout = maxLoadingTimeout;
    }

    /**
     * Перевіряє завантаження шрифтів
     */
    async checkFontsLoaded() {
        try {
            if ('fonts' in document) {
                await document.fonts.ready;
                this.resourcesLoaded.fonts = true;
                console.log('Fonts loaded successfully');
            } else {
                // Fallback для старих браузерів
                setTimeout(() => {
                    this.resourcesLoaded.fonts = true;
                }, 2000);
            }
            this.checkAllResourcesLoaded();
        } catch (error) {
            console.warn('Font loading failed:', error);
            this.resourcesLoaded.fonts = true; // Продовжуємо без шрифтів
            this.checkAllResourcesLoaded();
        }
    }

    /**
     * Перевіряє завантаження зображень
     */
    checkImagesLoaded() {
        const images = document.querySelectorAll('img, svg');
        let loadedCount = 0;
        let totalImages = images.length;

        if (totalImages === 0) {
            this.resourcesLoaded.images = true;
            this.checkAllResourcesLoaded();
            return;
        }

        const imageLoadHandler = () => {
            loadedCount++;
            if (loadedCount >= totalImages) {
                this.resourcesLoaded.images = true;
                console.log('All images loaded successfully');
                this.checkAllResourcesLoaded();
            }
        };

        images.forEach((img, index) => {
            if (img.complete || img.readyState === 4) {
                imageLoadHandler();
            } else {
                img.addEventListener('load', imageLoadHandler);
                img.addEventListener('error', () => {
                    console.warn(`Image ${index} failed to load:`, img.src);
                    imageLoadHandler(); // Продовжуємо навіть при помилці
                });
            }
        });

        // Fallback для випадку, коли зображення не завантажуються
        setTimeout(() => {
            if (!this.resourcesLoaded.images) {
                console.warn('Image loading timeout, continuing without all images');
                this.resourcesLoaded.images = true;
                this.checkAllResourcesLoaded();
            }
        }, 5000);
    }

    /**
     * Перевіряє, чи всі ресурси завантажені
     */
    checkAllResourcesLoaded() {
        const allLoaded = Object.values(this.resourcesLoaded).every(loaded => loaded);
        const minimumTimePassed = Date.now() - this.loadingStartTime >= this.minimumLoadingTime;

        if (allLoaded && minimumTimePassed && !this.isLoaded) {
            this.hideLoadingScreen();
        }
    }

    /**
     * Приховує екран завантаження з анімацією
     */
    hideLoadingScreen() {
        if (this.isLoaded) return;
        
        this.isLoaded = true;
        clearTimeout(this.maxLoadingTimeout);

        const loadingScreen = document.getElementById('loadingScreen');
        if (!loadingScreen) return;

        // Додаємо клас для анімації приховування
        loadingScreen.classList.add('hidden');
        
        // Видаляємо елемент з DOM після завершення анімації
        setTimeout(() => {
            if (loadingScreen.parentNode) {
                loadingScreen.parentNode.removeChild(loadingScreen);
            }
            
            // Запускаємо анімації після приховування завантаження
            this.triggerContentAnimations();
            
            console.log('Loading screen hidden successfully');
        }, 500);

        // Оновлюємо ARIA атрибути для доступності
        loadingScreen.setAttribute('aria-hidden', 'true');
    }

    /**
     * Запускає анімації контенту після завантаження
     */
    triggerContentAnimations() {
        // Запускаємо анімації героїчної секції
        const heroElements = document.querySelectorAll('.hero-logo-container, .hero-title, .subtitle, .hero-actions');
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });

        // Запускаємо анімації для карток функцій
        this.animateFeatureCards();
    }

    /**
     * Анімує картки функцій при скролі
     */
    animateFeatureCards() {
        const cards = document.querySelectorAll('.feature-card-iui');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }

    /**
     * Налаштовує Intersection Observer для анімацій при скролі
     */
    setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) {
            console.warn('IntersectionObserver not supported');
            return;
        }

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Спеціальна обробка для різних типів елементів
                    if (entry.target.classList.contains('feature-card-iui')) {
                        this.animateFeatureCard(entry.target);
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Спостерігаємо за елементами для анімації
        const elementsToAnimate = document.querySelectorAll(
            '.feature-card-iui, .tech-item, .stat-item, .contact-link'
        );
        
        elementsToAnimate.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            observer.observe(el);
        });
    }

    /**
     * Анімує окрему картку функції
     */
    animateFeatureCard(card) {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    }

    /**
     * Налаштовує мобільну навігацію
     */
    setupMobileNavigation() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!mobileToggle || !navMenu) return;

        mobileToggle.addEventListener('click', () => {
            const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
            
            mobileToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            
            // Блокуємо скрол при відкритому меню
            document.body.style.overflow = isExpanded ? '' : 'hidden';
        });

        // Закриваємо меню при кліку на посилання
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Закриваємо меню при кліку поза ним
        document.addEventListener('click', (e) => {
            if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
                mobileToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    /**
     * Налаштовує обробники форм
     */
    setupFormHandlers() {
        const newsletterForm = document.querySelector('.newsletter-form');
        if (!newsletterForm) return;

        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = newsletterForm.querySelector('input[type="email"]').value;
            const submitBtn = newsletterForm.querySelector('button[type="submit"]');
            const errorDiv = document.getElementById('email-error');

            if (!this.validateEmail(email)) {
                this.showError('Будь ласка, введіть коректну email адресу', errorDiv);
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Підписуємо...';

            try {
                // Симуляція відправки (замініть на реальний API)
                await this.simulateAPICall();
                
                this.showSuccess('Дякуємо! Ви успішно підписалися на розсилку');
                newsletterForm.reset();
            } catch (error) {
                this.showError('Помилка підписки. Спробуйте ще раз', errorDiv);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Підписатися';
            }
        });

        // Обробка кнопки копіювання email
        const emailButton = document.querySelector('.email-button');
        if (emailButton) {
            emailButton.addEventListener('click', () => {
                const email = emailButton.dataset.email || 'contact@ggenius.mlbb-boss.com';
                this.copyToClipboard(email);
            });
        }
    }

    /**
     * Валідація email адреси
     */
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Копіює текст в буфер обміну
     */
    async copyToClipboard(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                // Fallback для старих браузерів
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
            
            this.showToast('Email адресу скопійовано!', 'success');
        } catch (error) {
            console.error('Failed to copy email:', error);
            this.showToast('Не вдалося скопіювати email', 'error');
        }
    }

    /**
     * Показує Toast повідомлення
     */
    showToast(message, type = 'info', duration = 3000) {
        const toastContainer = document.getElementById('toast-container') || this.createToastContainer();
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'polite');
        
        toastContainer.appendChild(toast);
        
        // Показуємо toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Приховуємо toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
    }

    /**
     * Створює контейнер для Toast повідомлень
     */
    createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
        return container;
    }

    /**
     * Показує повідомлення про помилку
     */
    showError(message, container) {
        if (container) {
            container.textContent = message;
            container.style.display = 'block';
            setTimeout(() => {
                container.style.display = 'none';
            }, 5000);
        } else {
            this.showToast(message, 'error');
        }
    }

    /**
     * Показує повідомлення про успіх
     */
    showSuccess(message) {
        this.showToast(message, 'success');
    }

    /**
     * Симулює API виклик
     */
    simulateAPICall() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.1) { // 90% успіху
                    resolve();
                } else {
                    reject(new Error('Network error'));
                }
            }, 1500);
        });
    }

    /**
     * Налаштовує обробку помилок
     */
    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('JavaScript error:', event.error);
            // Не показуємо помилки користувачу в production
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            event.preventDefault();
        });
    }

    // Scroll progress bar
    setupScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.setAttribute('aria-hidden', 'true');
        document.body.appendChild(progressBar);

        let ticking = false;

        const updateProgress = () => {
            const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = `${Math.min(scrolled, 100)}%`;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateProgress);
                ticking = true;
            }
        }, { passive: true });
    }

    // Gaming cursor effect
    setupGamingCursor() {
        // Вимикаємо на мобільних пристроях
        if (window.innerWidth <= 768) return;

        const cursor = document.createElement('div');
        cursor.className = 'gaming-cursor';
        cursor.innerHTML = '<div class="cursor-dot"></div><div class="cursor-ring"></div>';
        cursor.setAttribute('aria-hidden', 'true');
        document.body.appendChild(cursor);

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Плавна анімація курсора
        const animateCursor = () => {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            
            requestAnimationFrame(animateCursor);
        };

        animateCursor();

        document.addEventListener('mousedown', () => cursor.classList.add('clicked'));
        document.addEventListener('mouseup', () => cursor.classList.remove('clicked'));

        // Ховаємо курсор при виході з вікна
        document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
        document.addEventListener('mouseenter', () => cursor.style.opacity = '1');
    }

    // Typing animation for hero subtitle
    setupTypingAnimation() {
        const subtitle = document.querySelector('.hero-section .subtitle');
        if (!subtitle) return;

        const text = subtitle.textContent;
        subtitle.textContent = '';
        subtitle.style.opacity = '1';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                subtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50 + Math.random() * 50); // Варіативна швидкість
            }
        };
        
        // Запускаємо після приховування завантаження
        setTimeout(typeWriter, 2000);
    }

    // Sound effects for interactions
    setupSoundEffects() {
        if (!window.AudioContext && !window.webkitAudioContext) {
            console.warn('Web Audio API not supported');
            return;
        }

        let audioContext;
        
        const initAudioContext = () => {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
        };

        const playSound = (frequency, duration) => {
            try {
                initAudioContext();
                
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = frequency;
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.05, audioContext.currentTime); // Зменшили гучність
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + duration);
            } catch (error) {
                console.warn('Sound playback failed:', error);
            }
        };

        // Перший клік для ініціалізації аудіо контексту
        document.addEventListener('click', initAudioContext, { once: true });

        document.querySelectorAll('.cta-button, button, .accordion-header').forEach(element => {
            element.addEventListener('click', () => {
                if (audioContext && audioContext.state === 'running') {
                    playSound(800, 0.05);
                }
            });
        });
    }

    // Performance mode toggle
    setupPerformanceMode() {
        const isLowPerformance = 
            navigator.hardwareConcurrency < 4 || 
            navigator.deviceMemory < 4 ||
            navigator.connection?.effectiveType === 'slow-2g' ||
            navigator.connection?.effectiveType === '2g';
        
        if (isLowPerformance) {
            document.body.classList.add('performance-mode');
            console.log('Performance mode enabled');
        }
    }

    // Accordion effect for sections
    setupAccordionEffect() {
        const accordionSections = document.querySelectorAll('.accordion-section');

        accordionSections.forEach((section, index) => {
            const header = section.querySelector('.accordion-header');
            const content = section.querySelector('.accordion-content');

            if (!header || !content) {
                console.warn('Accordion section missing header or content:', section);
                return;
            }

            // Встановлюємо ARIA атрибути для доступності
            header.setAttribute('aria-expanded', 'false');
            header.setAttribute('tabindex', '0');
            content.setAttribute('aria-hidden', 'true');
            content.id = `accordion-content-${index}`;
            header.setAttribute('aria-controls', content.id);
            
            // За замовчуванням відкриваємо першу секцію (Про Проєкт)
            if (index === 0) {
                this.openAccordion(header, content);
            } else {
                content.style.maxHeight = '0px';
            }

            // Обробка кліків та клавіатури
            const toggleAccordion = () => {
                if (header.classList.contains('active')) {
                    this.closeAccordion(header, content);
                } else {
                    this.openAccordion(header, content);
                }
            };

            header.addEventListener('click', toggleAccordion);
            header.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleAccordion();
                }
            });
        });
    }

    /**
     * Відкриває акордеон
     */
    openAccordion(header, content) {
        header.classList.add('active');
        content.classList.add('active');
        
        const innerContent = content.querySelector('.accordion-content-inner');
        const contentHeight = innerContent ? innerContent.scrollHeight : content.scrollHeight;
        content.style.maxHeight = contentHeight + 'px';
        
        header.setAttribute('aria-expanded', 'true');
        content.setAttribute('aria-hidden', 'false');
    }

    /**
     * Закриває акордеон
     */
    closeAccordion(header, content) {
        header.classList.remove('active');
        content.classList.remove('active');
        content.style.maxHeight = '0px';
        
        header.setAttribute('aria-expanded', 'false');
        content.setAttribute('aria-hidden', 'true');
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new GameWebsiteEnhancer();
    });
} else {
    new GameWebsiteEnhancer();
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameWebsiteEnhancer;
}