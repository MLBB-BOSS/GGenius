/**
 * GGenius Progressive Scroll Accordion - Enhanced Version
 * Smooth scrolling with advanced gaming UX
 * 
 * @version 2.1.0
 * @author MLBB-BOSS Team
 * @license MIT
 */

'use strict';

/**
 * Enhanced device detection with performance optimization
 */
class DeviceDetector {
    constructor() {
        this.isMobile = window.innerWidth <= 768;
        this.isLowEnd = this.detectLowEndDevice();
        this.hasTouch = 'ontouchstart' in window;
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.supportsIntersectionObserver = 'IntersectionObserver' in window;
        
        // Performance metrics
        this.performanceScore = this.calculatePerformanceScore();
    }

    detectLowEndDevice() {
        const nav = navigator;
        return (
            (nav.hardwareConcurrency && nav.hardwareConcurrency < 4) ||
            (nav.deviceMemory && nav.deviceMemory < 4) ||
            /Android [4-6]/.test(nav.userAgent) ||
            /iPhone.*OS [8-12]_/.test(nav.userAgent)
        );
    }

    calculatePerformanceScore() {
        let score = 100;
        
        if (this.isLowEnd) score -= 30;
        if (this.isMobile) score -= 10;
        if (!this.supportsIntersectionObserver) score -= 20;
        if (this.prefersReducedMotion) score -= 5;
        
        return Math.max(score, 20);
    }
}

/**
 * Enhanced audio system with spatial effects
 */
class AudioSystem {
    constructor(enabled = true) {
        this.enabled = enabled && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.context = null;
        this.sounds = new Map();
        this.volume = 0.3;
        this.initialized = false;
    }

    async init() {
        if (!this.enabled || this.initialized) return;
        
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            
            // Resume context if suspended
            if (this.context.state === 'suspended') {
                await this.context.resume();
            }
            
            this.createEnhancedSounds();
            this.initialized = true;
            console.log('🎵 Enhanced Audio System ready');
        } catch (error) {
            this.enabled = false;
            console.warn('Audio disabled:', error.message);
        }
    }

    createEnhancedSounds() {
        // Enhanced sound definitions with multiple frequencies
        this.sounds.set('expand', { 
            frequencies: [800, 1000], 
            duration: 0.2, 
            type: 'sine',
            envelope: 'smooth'
        });
        
        this.sounds.set('collapse', { 
            frequencies: [600, 400], 
            duration: 0.15, 
            type: 'sine',
            envelope: 'fade'
        });
        
        this.sounds.set('click', { 
            frequencies: [1000, 1200, 800], 
            duration: 0.1, 
            type: 'square',
            envelope: 'punch'
        });
        
        this.sounds.set('hover', { 
            frequencies: [600], 
            duration: 0.05, 
            type: 'triangle',
            envelope: 'instant'
        });
        
        this.sounds.set('scroll', { 
            frequencies: [400, 500], 
            duration: 0.08, 
            type: 'sawtooth',
            envelope: 'soft'
        });
    }

    play(soundName, options = {}) {
        if (!this.enabled || !this.initialized || !this.context) return;
        
        const sound = this.sounds.get(soundName);
        if (!sound) return;

        try {
            // Create multiple oscillators for richer sound
            sound.frequencies.forEach((freq, index) => {
                setTimeout(() => {
                    this.createTone(freq, sound.duration, sound.type, sound.envelope, options);
                }, index * 20);
            });
        } catch (error) {
            console.warn(`Failed to play sound '${soundName}':`, error);
        }
    }

    createTone(frequency, duration, type, envelope, options = {}) {
        const ctx = this.context;
        const startTime = ctx.currentTime;
        const volume = (options.volume || 1) * this.volume;

        // Create oscillator
        const oscillator = ctx.createOscillator();
        oscillator.frequency.value = frequency;
        oscillator.type = type;

        // Create gain with envelope
        const gain = ctx.createGain();
        this.applyEnvelope(gain, volume, duration, startTime, envelope);

        // Create filter for warmth
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = frequency * 2;
        filter.Q.value = 1;

        // Connect audio graph
        oscillator.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        // Start and stop
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    }

    applyEnvelope(gainNode, volume, duration, startTime, envelope) {
        const gain = gainNode.gain;
        
        switch (envelope) {
            case 'smooth':
                gain.setValueAtTime(0, startTime);
                gain.linearRampToValueAtTime(volume, startTime + 0.02);
                gain.exponentialRampToValueAtTime(0.001, startTime + duration);
                break;
                
            case 'punch':
                gain.setValueAtTime(0, startTime);
                gain.linearRampToValueAtTime(volume * 1.3, startTime + 0.01);
                gain.exponentialRampToValueAtTime(volume * 0.7, startTime + 0.03);
                gain.exponentialRampToValueAtTime(0.001, startTime + duration);
                break;
                
            case 'fade':
                gain.setValueAtTime(volume, startTime);
                gain.exponentialRampToValueAtTime(0.001, startTime + duration);
                break;
                
            case 'soft':
                gain.setValueAtTime(0, startTime);
                gain.linearRampToValueAtTime(volume * 0.8, startTime + duration * 0.3);
                gain.exponentialRampToValueAtTime(0.001, startTime + duration);
                break;
                
            default:
                gain.setValueAtTime(volume, startTime);
                gain.setValueAtTime(0, startTime + duration);
        }
    }

    destroy() {
        if (this.context) {
            this.context.close();
            this.context = null;
        }
        this.initialized = false;
    }
}

/**
 * Enhanced Progressive Scroll Accordion with smooth scrolling
 */
class ProgressiveScrollAccordion {
    constructor(options = {}) {
        // Enhanced device detection
        this.device = new DeviceDetector();
        
        // Adaptive configuration based on device performance
        this.config = {
            sectionSelector: '.progressive-section',
            threshold: this.device.performanceScore > 70 ? [0.2, 0.5, 0.8] : [0.5],
            rootMargin: this.device.isMobile ? '-15% 0px -15% 0px' : '-20% 0px -20% 0px',
            transitionDuration: this.device.performanceScore > 70 ? 800 : 400,
            enableSounds: !this.device.prefersReducedMotion && this.device.performanceScore > 50,
            enableNavigation: true,
            enableKeyboard: !this.device.isMobile,
            enableSmoothScrolling: this.device.performanceScore > 60,
            debounceDelay: this.device.performanceScore > 70 ? 100 : 200,
            ...options
        };

        // Enhanced state management
        this.state = {
            sections: [],
            activeIndex: 0,
            previousIndex: -1,
            isTransitioning: false,
            isInitialized: false,
            visibilityMap: new Map(),
            scrollDirection: 'down',
            lastScrollPosition: 0,
            transitionQueue: []
        };

        // Systems
        this.audio = new AudioSystem(this.config.enableSounds);
        this.observer = null;
        this.navigation = null;
        this.scrollTimeout = null;

        // Enhanced event handlers with better performance
        this.boundHandlers = {
            keydown: this.handleKeydown.bind(this),
            resize: this.debounce(this.handleResize.bind(this), 300),
            scroll: this.throttle(this.handleScroll.bind(this), 16), // 60fps
            visibilityChange: this.handleVisibilityChange.bind(this)
        };

        this.init();
    }

    /**
     * Enhanced initialization with error recovery
     */
    async init() {
        try {
            console.log('🎮 Initializing Enhanced Progressive Accordion...');
            console.log(`📊 Performance Score: ${this.device.performanceScore}/100`);
            
            // Apply performance optimizations
            if (this.device.performanceScore < 50) {
                document.body.classList.add('performance-mode');
                console.log('⚡ Performance mode enabled');
            }

            // Initialize audio system
            await this.audio.init();
            
            // Setup sections with enhanced detection
            await this.setupSections();
            
            // Create enhanced intersection observer
            this.createEnhancedObserver();
            
            // Setup enhanced navigation
            this.setupEnhancedNavigation();
            
            // Bind enhanced events
            this.bindEnhancedEvents();
            
            // Set smart initial state
            this.setSmartInitialState();
            
            this.state.isInitialized = true;
            console.log('✅ Enhanced Accordion initialized successfully');
            
            // Dispatch enhanced ready event
            this.dispatchEvent('accordion:ready', {
                sections: this.state.sections.length,
                performanceScore: this.device.performanceScore,
                config: this.config
            });

        } catch (error) {
            console.error('❌ Enhanced Accordion initialization failed:', error);
            this.fallbackToStatic();
        }
    }

    /**
     * Enhanced section setup with better content detection
     */
    async setupSections() {
        // Auto-detect sections if none found
        let elements = document.querySelectorAll(this.config.sectionSelector);
        
        if (elements.length === 0) {
            const autoSections = document.querySelectorAll('.about-section, .features-section, .contact-section');
            autoSections.forEach(el => el.classList.add('progressive-section'));
            elements = autoSections;
        }

        if (elements.length === 0) {
            throw new Error('No sections found for accordion');
        }

        this.state.sections = Array.from(elements).map((element, index) => {
            const id = element.id || `section-${index}`;
            element.id = id;
            
            // Enhanced section setup
            const header = this.setupEnhancedHeader(element, index);
            const content = this.setupEnhancedContent(element);
            
            // Setup accessibility
            this.setupEnhancedAccessibility(element, header, content, index);
            
            // Calculate natural height for smooth animations
            const naturalHeight = this.calculateNaturalHeight(element);

            return {
                element,
                header,
                content,
                index,
                id,
                isExpanded: false,
                naturalHeight,
                lastVisibilityRatio: 0
            };
        });

        console.log(`📄 Enhanced setup complete: ${this.state.sections.length} sections`);
    }

    /**
     * Enhanced header setup with better interaction
     */
    setupEnhancedHeader(element, index) {
        let header = element.querySelector('.section-header');
        
        if (!header) {
            const h2 = element.querySelector('h2');
            if (h2) {
                header = document.createElement('div');
                header.className = 'section-header';
                h2.parentNode.insertBefore(header, h2);
                header.appendChild(h2);
                
                // Enhanced progress bar
                const progress = document.createElement('div');
                progress.className = 'section-progress';
                progress.setAttribute('aria-hidden', 'true');
                header.appendChild(progress);
            }
        }

        if (header) {
            // Enhanced click handler with feedback
            header.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.config.enableSounds) {
                    this.audio.play('click');
                }
                this.navigateToSection(index);
            });

            // Enhanced hover effects
            header.addEventListener('mouseenter', () => {
                if (this.config.enableSounds && !this.state.isTransitioning) {
                    this.audio.play('hover', { volume: 0.3 });
                }
            });
        }

        return header;
    }

    /**
     * Enhanced content setup with better wrapping
     */
    setupEnhancedContent(element) {
        let content = element.querySelector('.section-content');
        
        if (!content) {
            const existingContent = Array.from(element.children).filter(
                child => !child.classList.contains('section-header')
            );
            
            if (existingContent.length > 0) {
                content = document.createElement('div');
                content.className = 'section-content';
                existingContent.forEach(child => content.appendChild(child));
                element.appendChild(content);
            }
        }

        return content;
    }

    /**
     * Calculate natural height for smooth animations
     */
    calculateNaturalHeight(element) {
        const currentDisplay = element.style.display;
        const currentHeight = element.style.height;
        const currentVisibility = element.style.visibility;
        
        // Temporarily make element visible and auto-height
        element.style.visibility = 'hidden';
        element.style.display = 'block';
        element.style.height = 'auto';
        
        const height = element.offsetHeight;
        
        // Restore original styles
        element.style.display = currentDisplay;
        element.style.height = currentHeight;
        element.style.visibility = currentVisibility;
        
        return height;
    }

    /**
     * Enhanced accessibility setup
     */
    setupEnhancedAccessibility(element, header, content, index) {
        if (!header || !content) return;

        element.setAttribute('role', 'region');
        element.setAttribute('aria-label', `Section ${index + 1}`);
        
        header.setAttribute('role', 'button');
        header.setAttribute('aria-expanded', 'false');
        header.setAttribute('tabindex', '0');
        header.setAttribute('aria-controls', `${element.id}-content`);
        
        content.id = `${element.id}-content`;
        content.setAttribute('aria-hidden', 'true');
        
        // Enhanced keyboard support
        header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (this.config.enableSounds) {
                    this.audio.play('click');
                }
                this.navigateToSection(index);
            }
        });
    }

    /**
     * Enhanced intersection observer with better performance
     */
    createEnhancedObserver() {
        if (!this.device.supportsIntersectionObserver) {
            console.warn('IntersectionObserver not supported, using scroll fallback');
            this.setupScrollFallback();
            return;
        }

        const options = {
            root: null,
            rootMargin: this.config.rootMargin,
            threshold: this.config.threshold
        };

        this.observer = new IntersectionObserver((entries) => {
            this.handleEnhancedIntersection(entries);
        }, options);

        // Observe all sections
        this.state.sections.forEach(section => {
            this.observer.observe(section.element);
        });

        console.log('👁️ Enhanced Intersection Observer created');
    }

    /**
     * Enhanced intersection handling with smarter logic
     */
    handleEnhancedIntersection(entries) {
        if (this.state.isTransitioning) return;

        // Update visibility map with enhanced data
        entries.forEach(entry => {
            const sectionIndex = this.state.sections.findIndex(
                section => section.element === entry.target
            );

            if (sectionIndex !== -1) {
                this.state.visibilityMap.set(sectionIndex, {
                    isIntersecting: entry.isIntersecting,
                    intersectionRatio: entry.intersectionRatio,
                    boundingRect: entry.boundingClientRect,
                    timestamp: performance.now()
                });

                // Update last visibility ratio
                this.state.sections[sectionIndex].lastVisibilityRatio = entry.intersectionRatio;
            }
        });

        // Enhanced candidate selection
        const candidate = this.findEnhancedCandidate();
        
        if (candidate !== null && candidate !== this.state.activeIndex) {
            // Debounce rapid changes
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = setTimeout(() => {
                this.transitionToSection(candidate);
            }, this.config.debounceDelay);
        }
    }

    /**
     * Enhanced candidate selection with intelligent scoring
     */
    findEnhancedCandidate() {
        const visibleSections = Array.from(this.state.visibilityMap.entries())
            .filter(([index, data]) => data.isIntersecting)
            .map(([index, data]) => ({
                index,
                score: this.calculateSectionScore(index, data)
            }))
            .sort((a, b) => b.score - a.score);

        return visibleSections.length > 0 ? visibleSections[0].index : null;
    }

    /**
     * Calculate section visibility score for better selection
     */
    calculateSectionScore(index, visibilityData) {
        let score = visibilityData.intersectionRatio * 100;
        
        // Bonus for center position
        const rect = visibilityData.boundingRect;
        const viewportCenter = window.innerHeight / 2;
        const elementCenter = rect.top + (rect.height / 2);
        const distanceFromCenter = Math.abs(viewportCenter - elementCenter);
        const centerBonus = Math.max(0, 50 - (distanceFromCenter / 10));
        
        score += centerBonus;
        
        // Scroll direction bonus
        if (this.state.scrollDirection === 'down' && index > this.state.activeIndex) {
            score += 10;
        } else if (this.state.scrollDirection === 'up' && index < this.state.activeIndex) {
            score += 10;
        }
        
        return score;
    }

    /**
     * Enhanced scroll handling for direction detection
     */
    handleScroll() {
        const currentPosition = window.pageYOffset;
        
        if (currentPosition > this.state.lastScrollPosition) {
            this.state.scrollDirection = 'down';
        } else if (currentPosition < this.state.lastScrollPosition) {
            this.state.scrollDirection = 'up';
        }
        
        this.state.lastScrollPosition = currentPosition;
        
        // Play subtle scroll sound
        if (this.config.enableSounds && Math.abs(currentPosition - this.state.lastScrollPosition) > 50) {
            this.audio.play('scroll', { volume: 0.1 });
        }
    }

    /**
     * Enhanced section transition with better performance
     */
    async transitionToSection(targetIndex) {
        if (this.state.isTransitioning || targetIndex === this.state.activeIndex) return;

        // Add to transition queue if busy
        if (this.state.isTransitioning) {
            this.state.transitionQueue.push(targetIndex);
            return;
        }

        this.state.isTransitioning = true;
        this.state.previousIndex = this.state.activeIndex;

        try {
            // Play enhanced transition sound
            if (this.config.enableSounds) {
                this.audio.play('expand', { volume: 0.4 });
            }

            // Enhanced parallel transitions for better performance
            const promises = [];

            // Collapse previous section
            if (this.state.previousIndex !== -1) {
                promises.push(this.collapseSection(this.state.previousIndex));
            }

            // Expand target section
            promises.push(this.expandSection(targetIndex));

            // Wait for all transitions
            await Promise.all(promises);

            // Update state
            this.state.activeIndex = targetIndex;

            // Update navigation with animation
            this.updateEnhancedNavigation(targetIndex);

            // Dispatch enhanced event
            this.dispatchEvent('section:changed', {
                previousIndex: this.state.previousIndex,
                currentIndex: targetIndex,
                section: this.state.sections[targetIndex],
                timestamp: performance.now()
            });

        } finally {
            this.state.isTransitioning = false;
            
            // Process queued transitions
            if (this.state.transitionQueue.length > 0) {
                const next = this.state.transitionQueue.shift();
                setTimeout(() => this.transitionToSection(next), 100);
            }
        }
    }

    /**
     * Enhanced section expansion with smooth animations
     */
    async expandSection(index) {
        const section = this.state.sections[index];
        if (!section || section.isExpanded) return;

        const { element, header, content } = section;

        // Update classes with enhanced timing
        element.classList.remove('collapsed');
        element.classList.add('expanded');

        // Update accessibility
        if (header) header.setAttribute('aria-expanded', 'true');
        if (content) content.setAttribute('aria-hidden', 'false');

        // Enhanced height animation
        if (this.config.enableSmoothScrolling) {
            element.style.height = `${section.naturalHeight}px`;
        }

        // Wait for transition with fallback
        await this.waitForEnhancedTransition(element);

        section.isExpanded = true;

        // Dispatch expanded event
        this.dispatchEvent('section:expanded', { 
            section, 
            index,
            timestamp: performance.now()
        });
    }

    /**
     * Enhanced section collapse with smooth animations
     */
    async collapseSection(index) {
        const section = this.state.sections[index];
        if (!section || !section.isExpanded) return;

        const { element, header, content } = section;

        // Play enhanced collapse sound
        if (this.config.enableSounds) {
            this.audio.play('collapse', { volume: 0.3 });
        }

        // Update classes
        element.classList.remove('expanded');
        element.classList.add('collapsed');

        // Update accessibility
        if (header) header.setAttribute('aria-expanded', 'false');
        if (content) content.setAttribute('aria-hidden', 'true');

        // Wait for transition
        await this.waitForEnhancedTransition(element);

        section.isExpanded = false;

        // Dispatch collapsed event
        this.dispatchEvent('section:collapsed', { 
            section, 
            index,
            timestamp: performance.now()
        });
    }

    /**
     * Enhanced transition waiting with better timing
     */
    waitForEnhancedTransition(element) {
        return new Promise(resolve => {
            const timeout = setTimeout(resolve, this.config.transitionDuration + 100);
            
            const onTransitionEnd = (event) => {
                if (event.target === element) {
                    clearTimeout(timeout);
                    element.removeEventListener('transitionend', onTransitionEnd);
                    resolve();
                }
            };
            
            element.addEventListener('transitionend', onTransitionEnd);
        });
    }

    /**
     * Enhanced navigation setup with better styling
     */
    setupEnhancedNavigation() {
        if (!this.config.enableNavigation || this.state.sections.length === 0) return;

        // Remove existing navigation
        const existing = document.querySelector('.scroll-navigation');
        if (existing) existing.remove();

        // Create enhanced navigation
        const nav = document.createElement('nav');
        nav.className = 'scroll-navigation';
        nav.setAttribute('aria-label', 'Section Navigation');
        nav.setAttribute('role', 'navigation');

        // Create enhanced dots
        this.state.sections.forEach((section, index) => {
            const dot = document.createElement('button');
            dot.className = 'nav-dot';
            dot.type = 'button';
            dot.setAttribute('aria-label', `Go to section ${index + 1}: ${section.id}`);
            dot.setAttribute('data-section-index', index);
            
            // Enhanced click handler
            dot.addEventListener('click', () => {
                if (this.config.enableSounds) {
                    this.audio.play('click', { volume: 0.5 });
                }
                this.navigateToSection(index);
            });
            
            // Enhanced hover effects
            dot.addEventListener('mouseenter', () => {
                if (this.config.enableSounds) {
                    this.audio.play('hover', { volume: 0.2 });
                }
            });
            
            nav.appendChild(dot);
        });

        document.body.appendChild(nav);
        this.navigation = nav;

        console.log('🧭 Enhanced Navigation created');
    }

    /**
     * Enhanced navigation update with smooth transitions
     */
    updateEnhancedNavigation(activeIndex) {
        if (!this.navigation) return;

        const dots = this.navigation.querySelectorAll('.nav-dot');
        dots.forEach((dot, index) => {
            const isActive = index === activeIndex;
            
            // Smooth class transitions
            if (isActive) {
                dot.classList.add('active');
                dot.setAttribute('aria-current', 'true');
            } else {
                dot.classList.remove('active');
                dot.setAttribute('aria-current', 'false');
            }
        });
    }

    /**
     * Enhanced navigation to section with smooth scrolling
     */
    navigateToSection(index) {
        const section = this.state.sections[index];
        if (!section) return;

        // Enhanced smooth scroll with better easing
        if (this.config.enableSmoothScrolling) {
            section.element.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest'
            });
        } else {
            // Fallback for low-performance devices
            section.element.scrollIntoView({
                behavior: 'auto',
                block: 'center'
            });
        }
    }

    /**
     * Enhanced event binding with better performance
     */
    bindEnhancedEvents() {
        if (this.config.enableKeyboard) {
            document.addEventListener('keydown', this.boundHandlers.keydown);
        }
        
        window.addEventListener('resize', this.boundHandlers.resize);
        window.addEventListener('scroll', this.boundHandlers.scroll, { passive: true });
        
        // Enhanced visibility handling
        document.addEventListener('visibilitychange', this.boundHandlers.visibilityChange);
        
        console.log('📱 Enhanced events bound');
    }

    /**
     * Enhanced keyboard navigation with more shortcuts
     */
    handleKeydown(event) {
        // Skip if typing in input fields
        if (event.target.matches('input, textarea, [contenteditable]')) return;

        const { key, ctrlKey, shiftKey } = event;
        let handled = false;

        switch (key) {
            case 'ArrowUp':
            case 'k':
                event.preventDefault();
                this.navigateToPrevious();
                handled = true;
                break;
                
            case 'ArrowDown':
            case 'j':
                event.preventDefault();
                this.navigateToNext();
                handled = true;
                break;
                
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
                event.preventDefault();
                const index = parseInt(key) - 1;
                if (index < this.state.sections.length) {
                    this.navigateToSection(index);
                }
                handled = true;
                break;
                
            case 'Home':
                event.preventDefault();
                this.navigateToSection(0);
                handled = true;
                break;
                
            case 'End':
                event.preventDefault();
                this.navigateToSection(this.state.sections.length - 1);
                handled = true;
                break;
                
            case 'Escape':
                // Toggle pause/resume
                this.togglePause();
                handled = true;
                break;
        }

        if (handled && this.config.enableSounds) {
            this.audio.play('click', { volume: 0.3 });
        }
    }

    /**
     * Navigate to previous section
     */
    navigateToPrevious() {
        const prevIndex = Math.max(0, this.state.activeIndex - 1);
        if (prevIndex !== this.state.activeIndex) {
            this.navigateToSection(prevIndex);
        }
    }

    /**
     * Navigate to next section
     */
    navigateToNext() {
        const nextIndex = Math.min(this.state.sections.length - 1, this.state.activeIndex + 1);
        if (nextIndex !== this.state.activeIndex) {
            this.navigateToSection(nextIndex);
        }
    }

    /**
     * Toggle pause/resume functionality
     */
    togglePause() {
        this.state.isPaused = !this.state.isPaused;
        
        if (this.state.isPaused) {
            document.body.classList.add('accordion-paused');
            console.log('⏸️ Accordion paused');
        } else {
            document.body.classList.remove('accordion-paused');
            console.log('▶️ Accordion resumed');
        }
        
        this.dispatchEvent('accordion:toggled', { isPaused: this.state.isPaused });
    }

    /**
     * Handle window resize with smart recalculation
     */
    handleResize() {
        // Update mobile detection
        const wasMobile = this.device.isMobile;
        this.device.isMobile = window.innerWidth <= 768;
        
        if (wasMobile !== this.device.isMobile) {
            // Recreate observer with new settings
            this.observer?.disconnect();
            this.config.threshold = this.device.isMobile ? [0.5] : [0.2, 0.5, 0.8];
            this.config.rootMargin = this.device.isMobile ? '-15% 0px -15% 0px' : '-20% 0px -20% 0px';
            this.createEnhancedObserver();
            
            console.log(`📱 Resized: Mobile mode ${this.device.isMobile ? 'enabled' : 'disabled'}`);
        }

        // Recalculate natural heights
        this.state.sections.forEach(section => {
            section.naturalHeight = this.calculateNaturalHeight(section.element);
        });
    }

    /**
     * Handle visibility change for performance optimization
     */
    handleVisibilityChange() {
        if (document.hidden) {
            // Pause when tab is hidden
            this.state.wasPlayingBeforeHidden = !this.state.isPaused;
            this.state.isPaused = true;
            
            // Suspend audio context
            if (this.audio.context) {
                this.audio.context.suspend();
            }
        } else {
            // Resume when tab becomes visible
            if (this.state.wasPlayingBeforeHidden) {
                this.state.isPaused = false;
            }
            
            // Resume audio context
            if (this.audio.context) {
                this.audio.context.resume();
            }
        }
    }

    /**
     * Set smart initial state based on scroll position
     */
    setSmartInitialState() {
        if (this.state.sections.length === 0) return;

        // Find section closest to viewport center
        const viewportCenter = window.innerHeight / 2;
        let closestIndex = 0;
        let closestDistance = Infinity;

        this.state.sections.forEach((section, index) => {
            const rect = section.element.getBoundingClientRect();
            const elementCenter = rect.top + (rect.height / 2);
            const distance = Math.abs(viewportCenter - elementCenter);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }
        });

        // Set initial state
        this.state.activeIndex = closestIndex;
        this.expandSection(closestIndex);
        this.updateEnhancedNavigation(closestIndex);

        // Collapse others
        this.state.sections.forEach((section, index) => {
            if (index !== closestIndex) {
                section.element.classList.add('collapsed');
            }
        });

        console.log(`🎯 Smart initial state: Section ${closestIndex} active`);
    }

    /**
     * Setup scroll fallback for unsupported browsers
     */
    setupScrollFallback() {
        console.log('🔄 Setting up scroll fallback');
        
        const handleScrollFallback = this.throttle(() => {
            if (this.state.isTransitioning) return;

            const scrollPosition = window.pageYOffset;
            const viewportHeight = window.innerHeight;
            
            // Simple section detection based on scroll position
            let targetIndex = 0;
            
            this.state.sections.forEach((section, index) => {
                const rect = section.element.getBoundingClientRect();
                if (rect.top <= viewportHeight / 2 && rect.bottom >= viewportHeight / 2) {
                    targetIndex = index;
                }
            });

            if (targetIndex !== this.state.activeIndex) {
                this.transitionToSection(targetIndex);
            }
        }, 100);

        window.addEventListener('scroll', handleScrollFallback, { passive: true });
    }

    /**
     * Fallback to static sections
     */
    fallbackToStatic() {
        console.warn('⚠️ Falling back to static sections');
        
        this.state.sections.forEach(section => {
            section.element.classList.remove('progressive-section', 'collapsed', 'expanded');
            section.element.classList.add('static-section');
        });

        // Disable navigation
        if (this.navigation) {
            this.navigation.style.display = 'none';
        }
    }

    /**
     * Utility: Debounce function
     */
    debounce(func, delay) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    /**
     * Utility: Throttle function
     */
    throttle(func, limit) {
        let inThrottle;
        return (...args) => {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Dispatch custom event
     */
    dispatchEvent(eventName, detail = {}) {
        const event = new CustomEvent(eventName, {
            detail: {
                ...detail,
                accordion: this,
                timestamp: performance.now()
            },
            bubbles: true,
            cancelable: true
        });
        
        window.dispatchEvent(event);
        console.log(`📡 Event dispatched: ${eventName}`, detail);
    }

    /**
     * Cleanup and destroy accordion
     */
    destroy() {
        console.log('🗑️ Destroying Enhanced Accordion...');

        // Disconnect observers
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }

        // Remove event listeners
        document.removeEventListener('keydown', this.boundHandlers.keydown);
        window.removeEventListener('resize', this.boundHandlers.resize);
        window.removeEventListener('scroll', this.boundHandlers.scroll);
        document.removeEventListener('visibilitychange', this.boundHandlers.visibilityChange);

        // Clear timeouts
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }

        // Remove navigation
        if (this.navigation) {
            this.navigation.remove();
            this.navigation = null;
        }

        // Destroy audio system
        this.audio?.destroy();

        // Reset sections
        this.state.sections.forEach(section => {
            section.element.classList.remove(
                'progressive-section', 'expanded', 'collapsed', 'static-section'
            );
            
            // Remove custom styles
            section.element.style.height = '';
        });

        // Reset state
        this.state.isInitialized = false;
        this.state.sections = [];
        
        // Dispatch destroyed event
        this.dispatchEvent('accordion:destroyed');
        
        console.log('✅ Enhanced Accordion destroyed successfully');
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Enhanced configuration for GGenius MLBB site
    const config = {
        sectionSelector: '.about-section, .features-section, .contact-section',
        enableSounds: true,
        enableNavigation: true,
        enableKeyboard: true,
        enableSmoothScrolling: true
    };

    // Create global instance with error handling
    try {
        window.progressiveAccordion = new ProgressiveScrollAccordion(config);
        
        // Enhanced event listeners for external integrations
        window.addEventListener('section:changed', (event) => {
            const { previousIndex, currentIndex } = event.detail;
            console.log(`🎯 Section transition: ${previousIndex} → ${currentIndex}`);
            
            // Analytics tracking (if available)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'section_view', {
                    section_index: currentIndex,
                    section_id: event.detail.section?.id,
                    performance_score: event.detail.accordion.device.performanceScore
                });
            }
            
            // Add custom tracking here if needed
        });

        // Handle accordion errors gracefully
        window.addEventListener('accordion:error', (event) => {
            console.error('🚨 Accordion error:', event.detail);
            // Could send to error tracking service
        });

        console.log('🎮 GGenius Enhanced Accordion ready for MLBB domination!');
        
    } catch (error) {
        console.error('❌ Failed to initialize Enhanced Accordion:', error);
        
        // Fallback to basic functionality
        document.querySelectorAll('.progressive-section').forEach(section => {
            section.classList.add('static-section');
        });
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProgressiveScrollAccordion;
}

// AMD support
if (typeof define === 'function' && define.amd) {
    define('ProgressiveScrollAccordion', [], () => ProgressiveScrollAccordion);
}