/**
 * GGenius Progressive Scroll Accordion - Simplified Version
 * Lightweight and efficient MLBB gaming website enhancement
 * 
 * @version 2.0.0
 * @author MLBB-BOSS Team
 * @license MIT
 */

'use strict';

/**
 * Lightweight device detection
 */
class DeviceDetector {
    constructor() {
        this.isMobile = window.innerWidth <= 768;
        this.isLowEnd = navigator.hardwareConcurrency < 4 || navigator.deviceMemory < 4;
        this.hasTouch = 'ontouchstart' in window;
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
}

/**
 * Simple audio system for gaming effects
 */
class AudioSystem {
    constructor(enabled = true) {
        this.enabled = enabled && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.context = null;
        this.sounds = new Map();
        this.volume = 0.3;
    }

    async init() {
        if (!this.enabled) return;
        
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.createSounds();
            console.log('🎵 Audio system ready');
        } catch (error) {
            this.enabled = false;
            console.warn('Audio disabled:', error.message);
        }
    }

    createSounds() {
        this.sounds.set('expand', { freq: 800, duration: 0.15 });
        this.sounds.set('collapse', { freq: 400, duration: 0.1 });
        this.sounds.set('click', { freq: 1000, duration: 0.08 });
        this.sounds.set('hover', { freq: 600, duration: 0.05 });
    }

    play(soundName) {
        if (!this.enabled || !this.context) return;
        
        const sound = this.sounds.get(soundName);
        if (!sound) return;

        const oscillator = this.context.createOscillator();
        const gain = this.context.createGain();
        
        oscillator.frequency.value = sound.freq;
        oscillator.type = 'sine';
        
        gain.gain.setValueAtTime(0, this.context.currentTime);
        gain.gain.linearRampToValueAtTime(this.volume, this.context.currentTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + sound.duration);
        
        oscillator.connect(gain);
        gain.connect(this.context.destination);
        
        oscillator.start();
        oscillator.stop(this.context.currentTime + sound.duration);
    }

    destroy() {
        if (this.context) {
            this.context.close();
            this.context = null;
        }
    }
}

/**
 * Main Progressive Scroll Accordion - Simplified
 */
class ProgressiveScrollAccordion {
    constructor(options = {}) {
        // Device detection
        this.device = new DeviceDetector();
        
        // Configuration
        this.config = {
            sectionSelector: '.progressive-section',
            threshold: this.device.isMobile ? 0.3 : 0.5,
            rootMargin: '-20% 0px -20% 0px',
            transitionDuration: this.device.isLowEnd ? 300 : 600,
            enableSounds: !this.device.prefersReducedMotion && !this.device.isLowEnd,
            enableNavigation: true,
            enableKeyboard: !this.device.isMobile,
            ...options
        };

        // State
        this.state = {
            sections: [],
            activeIndex: 0,
            isTransitioning: false,
            isInitialized: false
        };

        // Systems
        this.audio = new AudioSystem(this.config.enableSounds);
        this.observer = null;
        this.navigation = null;

        // Event handlers
        this.boundHandlers = {
            keydown: this.handleKeydown.bind(this),
            resize: this.debounce(this.handleResize.bind(this), 300)
        };

        this.init();
    }

    /**
     * Initialize accordion system
     */
    async init() {
        try {
            console.log('🎮 Initializing Progressive Accordion...');
            
            // Apply performance mode
            if (this.device.isLowEnd) {
                document.body.classList.add('performance-mode');
            }

            // Initialize audio
            await this.audio.init();
            
            // Setup sections
            this.setupSections();
            
            // Create intersection observer
            this.createObserver();
            
            // Setup navigation
            this.setupNavigation();
            
            // Bind events
            this.bindEvents();
            
            // Set initial state
            this.setInitialState();
            
            this.state.isInitialized = true;
            console.log('✅ Accordion initialized successfully');
            
            // Dispatch ready event
            window.dispatchEvent(new CustomEvent('accordion:ready', {
                detail: { sections: this.state.sections.length }
            }));

        } catch (error) {
            console.error('❌ Accordion initialization failed:', error);
            this.fallbackToStatic();
        }
    }

    /**
     * Setup sections with basic structure
     */
    setupSections() {
        const elements = document.querySelectorAll(this.config.sectionSelector);
        
        if (elements.length === 0) {
            // Auto-detect sections
            const autoSections = document.querySelectorAll('.about-section, .features-section, .contact-section');
            autoSections.forEach(el => el.classList.add('progressive-section'));
        }

        const sectionElements = document.querySelectorAll(this.config.sectionSelector);
        
        this.state.sections = Array.from(sectionElements).map((element, index) => {
            const id = element.id || `section-${index}`;
            element.id = id;
            
            // Setup header
            const header = this.setupSectionHeader(element, index);
            
            // Setup content
            const content = this.setupSectionContent(element);
            
            // Setup accessibility
            this.setupAccessibility(element, header, content, index);

            return {
                element,
                header,
                content,
                index,
                id,
                isExpanded: false
            };
        });

        console.log(`📄 Setup ${this.state.sections.length} sections`);
    }

    /**
     * Setup section header
     */
    setupSectionHeader(element, index) {
        let header = element.querySelector('.section-header');
        
        if (!header) {
            const h2 = element.querySelector('h2');
            if (h2) {
                header = document.createElement('div');
                header.className = 'section-header';
                h2.parentNode.insertBefore(header, h2);
                header.appendChild(h2);
                
                // Add progress bar
                const progress = document.createElement('div');
                progress.className = 'section-progress';
                header.appendChild(progress);
            }
        }

        // Add click handler
        if (header) {
            header.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToSection(index);
            });
        }

        return header;
    }

    /**
     * Setup section content
     */
    setupSectionContent(element) {
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
     * Setup accessibility
     */
    setupAccessibility(element, header, content, index) {
        if (!header || !content) return;

        element.setAttribute('role', 'region');
        element.setAttribute('aria-label', `Section ${index + 1}`);
        
        header.setAttribute('role', 'button');
        header.setAttribute('aria-expanded', 'false');
        header.setAttribute('tabindex', '0');
        
        content.setAttribute('aria-hidden', 'true');
        
        // Keyboard support
        header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.navigateToSection(index);
            }
        });
    }

    /**
     * Create intersection observer
     */
    createObserver() {
        if (!('IntersectionObserver' in window)) {
            console.warn('IntersectionObserver not supported');
            return;
        }

        const options = {
            root: null,
            rootMargin: this.config.rootMargin,
            threshold: this.config.threshold
        };

        this.observer = new IntersectionObserver((entries) => {
            if (this.state.isTransitioning) return;

            // Find best candidate
            const visibleEntries = entries.filter(entry => entry.isIntersecting);
            
            if (visibleEntries.length === 0) return;

            // Get section with highest intersection ratio
            const best = visibleEntries.reduce((prev, current) => 
                current.intersectionRatio > prev.intersectionRatio ? current : prev
            );

            const sectionIndex = this.state.sections.findIndex(
                section => section.element === best.target
            );

            if (sectionIndex !== -1 && sectionIndex !== this.state.activeIndex) {
                this.transitionToSection(sectionIndex);
            }
        }, options);

        // Observe all sections
        this.state.sections.forEach(section => {
            this.observer.observe(section.element);
        });

        console.log('👁️ Intersection Observer created');
    }

    /**
     * Transition to section
     */
    async transitionToSection(targetIndex) {
        if (this.state.isTransitioning) return;

        this.state.isTransitioning = true;
        const previousIndex = this.state.activeIndex;

        try {
            // Play sound
            if (this.config.enableSounds) {
                this.audio.play('expand');
            }

            // Collapse previous
            if (previousIndex !== -1) {
                await this.collapseSection(previousIndex);
            }

            // Expand target
            await this.expandSection(targetIndex);

            // Update state
            this.state.activeIndex = targetIndex;

            // Update navigation
            this.updateNavigation(targetIndex);

            // Dispatch event
            window.dispatchEvent(new CustomEvent('section:changed', {
                detail: { previousIndex, currentIndex: targetIndex }
            }));

        } finally {
            this.state.isTransitioning = false;
        }
    }

    /**
     * Expand section
     */
    async expandSection(index) {
        const section = this.state.sections[index];
        if (!section || section.isExpanded) return;

        const { element, header, content } = section;

        // Update classes
        element.classList.remove('collapsed');
        element.classList.add('expanded');

        // Update accessibility
        if (header) header.setAttribute('aria-expanded', 'true');
        if (content) content.setAttribute('aria-hidden', 'false');

        // Wait for transition
        await this.waitForTransition(element);

        section.isExpanded = true;

        // Dispatch event
        window.dispatchEvent(new CustomEvent('section:expanded', {
            detail: { section, index }
        }));
    }

    /**
     * Collapse section
     */
    async collapseSection(index) {
        const section = this.state.sections[index];
        if (!section || !section.isExpanded) return;

        const { element, header, content } = section;

        // Play sound
        if (this.config.enableSounds) {
            this.audio.play('collapse');
        }

        // Update classes
        element.classList.remove('expanded');
        element.classList.add('collapsed');

        // Update accessibility
        if (header) header.setAttribute('aria-expanded', 'false');
        if (content) content.setAttribute('aria-hidden', 'true');

        // Wait for transition
        await this.waitForTransition(element);

        section.isExpanded = false;

        // Dispatch event
        window.dispatchEvent(new CustomEvent('section:collapsed', {
            detail: { section, index }
        }));
    }

    /**
     * Wait for CSS transition
     */
    waitForTransition(element) {
        return new Promise(resolve => {
            const timeout = setTimeout(resolve, this.config.transitionDuration);
            
            const onTransitionEnd = () => {
                clearTimeout(timeout);
                element.removeEventListener('transitionend', onTransitionEnd);
                resolve();
            };
            
            element.addEventListener('transitionend', onTransitionEnd, { once: true });
        });
    }

    /**
     * Setup navigation dots
     */
    setupNavigation() {
        if (!this.config.enableNavigation || this.state.sections.length === 0) return;

        // Remove existing
        const existing = document.querySelector('.scroll-navigation');
        if (existing) existing.remove();

        // Create navigation
        const nav = document.createElement('nav');
        nav.className = 'scroll-navigation';
        nav.setAttribute('aria-label', 'Section Navigation');

        this.state.sections.forEach((section, index) => {
            const dot = document.createElement('button');
            dot.className = 'nav-dot';
            dot.type = 'button';
            dot.setAttribute('aria-label', `Go to section ${index + 1}`);
            
            dot.addEventListener('click', () => this.navigateToSection(index));
            
            nav.appendChild(dot);
        });

        document.body.appendChild(nav);
        this.navigation = nav;

        console.log('🧭 Navigation created');
    }

    /**
     * Update navigation state
     */
    updateNavigation(activeIndex) {
        if (!this.navigation) return;

        const dots = this.navigation.querySelectorAll('.nav-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeIndex);
        });
    }

    /**
     * Navigate to section
     */
    navigateToSection(index) {
        const section = this.state.sections[index];
        if (!section) return;

        // Play sound
        if (this.config.enableSounds) {
            this.audio.play('click');
        }

        // Smooth scroll
        section.element.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }

    /**
     * Bind events
     */
    bindEvents() {
        if (this.config.enableKeyboard) {
            document.addEventListener('keydown', this.boundHandlers.keydown);
        }
        
        window.addEventListener('resize', this.boundHandlers.resize);
        
        // Visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.audio) {
                this.audio.context?.suspend();
            } else if (this.audio) {
                this.audio.context?.resume();
            }
        });

        console.log('📱 Events bound');
    }

    /**
     * Handle keyboard navigation
     */
    handleKeydown(event) {
        // Skip if typing in input
        if (event.target.matches('input, textarea, [contenteditable]')) return;

        const { key } = event;
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
        }

        if (handled && this.config.enableSounds) {
            this.audio.play('click');
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
     * Handle window resize
     */
    handleResize() {
        // Update mobile detection
        const wasMobile = this.device.isMobile;
        this.device.isMobile = window.innerWidth <= 768;
        
        if (wasMobile !== this.device.isMobile) {
            // Recreate observer with new settings
            this.observer?.disconnect();
            this.config.threshold = this.device.isMobile ? 0.3 : 0.5;
            this.createObserver();
        }
    }

    /**
     * Set initial state
     */
    setInitialState() {
        if (this.state.sections.length === 0) return;

        // Expand first section by default
        this.expandSection(0);
        this.updateNavigation(0);

        // Collapse others
        this.state.sections.slice(1).forEach(section => {
            section.element.classList.add('collapsed');
        });
    }

    /**
     * Fallback to static sections
     */
    fallbackToStatic() {
        console.warn('⚠️ Falling back to static sections');
        
        this.state.sections.forEach(section => {
            section.element.classList.remove('progressive-section', 'collapsed');
            section.element.classList.add('static-section');
        });
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
     * Destroy accordion
     */
    destroy() {
        // Disconnect observer
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }

        // Remove events
        document.removeEventListener('keydown', this.boundHandlers.keydown);
        window.removeEventListener('resize', this.boundHandlers.resize);

        // Remove navigation
        if (this.navigation) {
            this.navigation.remove();
            this.navigation = null;
        }

        // Destroy audio
        this.audio?.destroy();

        // Reset sections
        this.state.sections.forEach(section => {
            section.element.classList.remove(
                'progressive-section', 'expanded', 'collapsed'
            );
        });

        console.log('🗑️ Accordion destroyed');
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Configuration for GGenius MLBB site
    const config = {
        sectionSelector: '.about-section, .features-section, .contact-section',
        enableSounds: true,
        enableNavigation: true,
        enableKeyboard: true
    };

    // Create global instance
    window.progressiveAccordion = new ProgressiveScrollAccordion(config);

    // Add event listeners for external integrations
    window.addEventListener('section:changed', (event) => {
        console.log(`🎯 Section changed: ${event.detail.previousIndex} → ${event.detail.currentIndex}`);
        
        // Analytics tracking (if available)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'section_view', {
                section_index: event.detail.currentIndex
            });
        }
    });
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProgressiveScrollAccordion;
}