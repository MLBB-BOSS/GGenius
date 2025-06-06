/**
 * Gaming-style website enhancements for MLBB community
 */

class GameWebsiteEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollProgress();
        // this.setupParallaxEffect(); // Якщо ця функція існує, залиште її
        this.setupTypingAnimation();
        this.setupGamingCursor();
        this.setupSoundEffects();
        this.setupPerformanceMode();
        this.setupAccordionEffect(); // Додаємо виклик нового методу
    }

    // Scroll progress bar
    setupScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = `${scrolled}%`;
        });
    }

    // Gaming cursor effect
    setupGamingCursor() {
        const cursor = document.createElement('div');
        cursor.className = 'gaming-cursor';
        cursor.innerHTML = '<div class="cursor-dot"></div><div class="cursor-ring"></div>';
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        document.addEventListener('mousedown', () => cursor.classList.add('clicked'));
        document.addEventListener('mouseup', () => cursor.classList.remove('clicked'));
    }

    // Typing animation for hero subtitle
    setupTypingAnimation() {
        const subtitle = document.querySelector('.hero-section .subtitle');
        if (!subtitle) return;

        const text = subtitle.textContent;
        subtitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                subtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }

    // Sound effects for interactions
    setupSoundEffects() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        const playSound = (frequency, duration) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        };

        document.querySelectorAll('.cta-button, button, .accordion-header').forEach(element => {
            element.addEventListener('click', () => playSound(800, 0.05)); // Зменшив тривалість для швидких кліків
        });
    }

    // Performance mode toggle
    setupPerformanceMode() {
        const isLowPerformance = navigator.hardwareConcurrency < 4 || 
                                navigator.deviceMemory < 4;
        
        if (isLowPerformance) {
            document.body.classList.add('performance-mode');
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
            content.setAttribute('aria-hidden', 'true');
            
            // За замовчуванням відкриваємо першу секцію (Про Проєкт)
            if (index === 0) {
                header.classList.add('active');
                content.classList.add('active');
                const innerContent = content.querySelector('.accordion-content-inner');
                content.style.maxHeight = (innerContent ? innerContent.scrollHeight : content.scrollHeight) + 'px';
                header.setAttribute('aria-expanded', 'true');
                content.setAttribute('aria-hidden', 'false');
            } else {
                content.style.maxHeight = '0px'; // Переконуємось, що інші закриті
            }

            header.addEventListener('click', () => {
                const isActive = header.classList.contains('active');

                // Опціонально: закривати інші відкриті секції (якщо потрібен режим "тільки одна відкрита")
                // if (!isActive) {
                //     accordionSections.forEach(otherSection => {
                //         if (otherSection !== section) {
                //             const otherHeader = otherSection.querySelector('.accordion-header');
                //             const otherContent = otherSection.querySelector('.accordion-content');
                //             if (otherHeader && otherContent && otherHeader.classList.contains('active')) {
                //                 otherHeader.classList.remove('active');
                //                 otherContent.classList.remove('active');
                //                 otherContent.style.maxHeight = '0px';
                //                 otherHeader.setAttribute('aria-expanded', 'false');
                //                 otherContent.setAttribute('aria-hidden', 'true');
                //             }
                //         }
                //     });
                // }

                header.classList.toggle('active');
                content.classList.toggle('active');

                if (header.classList.contains('active')) {
                    const innerContent = content.querySelector('.accordion-content-inner');
                    content.style.maxHeight = (innerContent ? innerContent.scrollHeight : content.scrollHeight) + 'px';
                    header.setAttribute('aria-expanded', 'true');
                    content.setAttribute('aria-hidden', 'false');
                } else {
                    content.style.maxHeight = '0px';
                    header.setAttribute('aria-expanded', 'false');
                    content.setAttribute('aria-hidden', 'true');
                }
            });
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new GameWebsiteEnhancer();
});
