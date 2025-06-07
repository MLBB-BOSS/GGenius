/**
 * GGenius Enhanced Interactive Experience
 * Performance-optimized ES2023+ JavaScript for cyberpunk AI platform
 * @version 2.0.0
 * @author MLBB-BOSS
 */

class GGeniusApp {
    constructor() {
        this.isLoaded = false;
        this.observers = new Map();
        this.animations = new Map();
        this.performance = {
            startTime: performance.now(),
            metrics: {}
        };
        
        this.init();
    }

    async init() {
        try {
            // Critical path loading
            await this.loadCriticalFeatures();
            await this.setupPerformanceMonitoring();
            await this.initializeUI();
            await this.setupInteractions();
            
            this.isLoaded = true;
            this.trackLoadTime();
            
        } catch (error) {
            console.error('🔥 GGenius initialization failed:', error);
            this.fallbackMode();
        }
    }

    async loadCriticalFeatures() {
        // Loading screen management
        this.loadingScreen = document.getElementById('loadingScreen');
        this.progressBar = document.getElementById('progressBar');
        
        // Start progress simulation
        this.simulateLoading();
        
        // Critical DOM elements
        this.header = document.querySelector('.site-header');
        this.scrollProgress = document.getElementById('scrollProgress');
        this.heroSection = document.querySelector('.hero-section');
        
        // Gaming cursor
        this.setupGamingCursor();
    }

    simulateLoading() {
        let progress = 0;
        const loadingText = document.getElementById('loadingText');
        const messages = [
            'Ініціалізація GGenius AI...',
            'Завантаження нейронних мереж...',
            'Підключення до кіберспорт серверів...',
            'Активація штучного інтелекту...',
            'Готовність до революції!'
        ];

        const updateProgress = () => {
            progress += Math.random() * 15 + 5;
            progress = Math.min(progress, 100);
            
            if (this.progressBar) {
                this.progressBar.style.width = `${progress}%`;
            }
            
            // Update loading message
            const messageIndex = Math.floor((progress / 100) * (messages.length - 1));
            if (loadingText && messages[messageIndex]) {
                loadingText.textContent = messages[messageIndex];
            }
            
            if (progress < 100) {
                setTimeout(updateProgress, 100 + Math.random() * 200);
            } else {
                setTimeout(() => this.hideLoadingScreen(), 500);
            }
        };
        
        updateProgress();
    }

    hideLoadingScreen() {
        if (this.loadingScreen) {
            this.loadingScreen.classList.add('hidden');
            setTimeout(() => {
                this.loadingScreen.style.display = 'none';
            }, 500);
        }
    }

    setupGamingCursor() {
        if (window.innerWidth > 768) {
            const cursor = document.createElement('div');
            cursor.className = 'gaming-cursor';
            cursor.innerHTML = `
                <div class="cursor-dot"></div>
                <div class="cursor-ring"></div>
            `;
            document.body.appendChild(cursor);
            
            let mouseX