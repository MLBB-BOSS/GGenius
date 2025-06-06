/**
 * Gaming-style website enhancements for MLBB community
 */

class GameWebsiteEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollProgress();
        this.setupParallaxEffect();
        this.setupTypingAnimation();
        this.setupGamingCursor();
        this.setupSoundEffects();
        this.setupPerformanceMode();
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

        // Add sound to buttons
        document.querySelectorAll('.cta-button, button').forEach(button => {
            button.addEventListener('click', () => playSound(800, 0.1));
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
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new GameWebsiteEnhancer();
});
