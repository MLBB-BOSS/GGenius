/**
 * GGenius Progressive Scroll Accordion System
 * Revolutionary MLBB gaming website enhancement
 * 
 * @version 3.0.0
 * @author MLBB-BOSS Team
 * @license MIT
 * @since 2025-01-27
 */

'use strict';

/**
 * Performance monitoring utilities for optimization
 */
class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
        this.observers = new Set();
        this.thresholds = {
            init: 1000,     // 1s max initialization
            transition: 100, // 100ms max transition
            render: 16       // 16ms max render (60fps)
        };
    }

    /**
     * Start performance measurement
     * @param {string} label - Measurement label
     */
    start(label) {
        this.metrics.set(label, {
            startTime: performance.now(),
            label
        });
    }

    /**
     * End performance measurement and log result
     * @param {string} label - Measurement label
     * @returns {number} Duration in milliseconds
     */
    end(label) {
        const metric = this.metrics.get(label);
        if (!metric) return 0;

        const duration = performance.now() - metric.startTime;
        const threshold = this.thresholds[label] || 100;
        
        const status = duration > threshold ? '🐌' : '⚡';
        console.debug(`${status} ${label}: ${duration.toFixed(2)}ms`);
        
        this.metrics.delete(label);
        return duration;
    }

    /**
     * Measure function execution time with error handling
     * @param {Function} fn - Function to measure
     * @param {string} label - Measurement label
     * @returns {Promise<any>} Function result
     */
    async measure(fn, label) {
        this.start(label);
        try {
            const result = await fn();
            this.end(label);
            return result;
        } catch (error) {
            this.end(label);
            console.error(`❌ Performance measure failed for ${label}:`, error);
            throw error;
        }
    }

    /**
     * Get performance summary
     * @returns {Object} Performance statistics
     */
    getSummary() {
        return {
            activeMetrics: this.metrics.size,
            thresholds: this.thresholds
        };
    }
}

/**
 * Advanced device capability detection with caching
 */
class DeviceCapabilityDetector {
    constructor() {
        this.capabilities = this.detectCapabilities();
        this.mediaQueries = this.setupMediaQueries();
        
        // Cache results for performance
        this._cache = new Map();
    }

    /**
     * Detect comprehensive device performance capabilities
     * @returns {Object} Device capabilities
     */
    detectCapabilities() {
        const nav = navigator;
        const isLowEnd = this.isLowEndDevice();
        const isMobile = this.isMobileDevice();
        
        return {
            // Hardware specifications
            cores: nav.hardwareConcurrency || 1,
            memory: nav.deviceMemory || 1,
            platform: nav.platform || 'unknown',
            
            // Network conditions
            connection: nav.connection || nav.mozConnection || nav.webkitConnection,
            isSlowNetwork: this.isSlowNetwork(),
            isOffline: !nav.onLine,
            
            // Device characteristics
            isLowEnd,
            isMobile,
            isTablet: this.isTabletDevice(),
            isTouch: 'ontouchstart' in window,
            hasHover: window.matchMedia('(hover: hover)').matches,
            
            // Display capabilities
            pixelRatio: window.devicePixelRatio || 1,
            colorDepth: screen.colorDepth || 24,
            screenSize: {
                width: screen.width,
                height: screen.height,
                availWidth: screen.availWidth,
                availHeight: screen.availHeight
            },
            
            // Browser capabilities
            supportsIntersectionObserver: 'IntersectionObserver' in window,
            supportsResizeObserver: 'ResizeObserver' in window,
            supportsWebGL: this.supportsWebGL(),
            supportsWebGL2: this.supportsWebGL2(),
            supportsBackdropFilter: this.supportsBackdropFilter(),
            supportsContainerQueries: this.supportsContainerQueries(),
            supportsViewportUnits: this.supportsViewportUnits(),
            
            // Performance hints
            preferReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            preferHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
            prefersDarkScheme: window.matchMedia('(prefers-color-scheme: dark)').matches,
            
            // Gaming-specific capabilities
            supportsGamepadAPI: 'getGamepads' in navigator,
            supportsWebAudio: 'AudioContext' in window || 'webkitAudioContext' in window,
            supportsFullscreen: 'requestFullscreen' in document.documentElement,
            
            // Calculated recommendations
            shouldUsePerformanceMode: isLowEnd || this.isSlowNetwork(),
            maxAnimationDuration: isLowEnd ? 300 : (isMobile ? 500 : 800),
            enableParticles: !isLowEnd && !this.isSlowNetwork() && !this.preferReducedMotion,
            enableAdvancedEffects: !isLowEnd && window.devicePixelRatio <= 2,
            recommendedFPS: isLowEnd ? 30 : 60
        };
    }

    /**
     * Setup media query listeners for dynamic updates
     * @returns {Object} Media query matchers
     */
    setupMediaQueries() {
        const queries = {
            mobile: window.matchMedia('(max-width: 768px)'),
            tablet: window.matchMedia('(min-width: 769px) and (max-width: 1024px)'),
            desktop: window.matchMedia('(min-width: 1025px)'),
            retina: window.matchMedia('(-webkit-min-device-pixel-ratio: 2)'),
            reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)'),
            darkMode: window.matchMedia('(prefers-color-scheme: dark)')
        };

        // Add listeners for capability updates
        Object.entries(queries).forEach(([key, query]) => {
            query.addEventListener('change', () => {
                this.updateCapability(key, query.matches);
            });
        });

        return queries;
    }

    /**
     * Update specific capability dynamically
     * @param {string} key - Capability key
     * @param {any} value - New value
     */
    updateCapability(key, value) {
        switch (key) {
            case 'mobile':
                this.capabilities.isMobile = value;
                break;
            case 'reducedMotion':
                this.capabilities.preferReducedMotion = value;
                this.capabilities.enableParticles = !value && !this.capabilities.isLowEnd;
                break;
            case 'darkMode':
                this.capabilities.prefersDarkScheme = value;
                break;
        }

        // Dispatch capability change event
        window.dispatchEvent(new CustomEvent('capability:changed', {
            detail: { key, value, capabilities: this.capabilities }
        }));
    }

    /**
     * Check if device is low-end with advanced detection
     * @returns {boolean}
     */
    isLowEndDevice() {
        const nav = navigator;
        
        // Hardware-based detection
        const lowCores = nav.hardwareConcurrency && nav.hardwareConcurrency < 4;
        const lowMemory = nav.deviceMemory && nav.deviceMemory < 4;
        
        // User agent based detection for older devices
        const oldAndroid = /Android [4-6]/.test(nav.userAgent);
        const oldIOS = /OS [8-12]_/.test(nav.userAgent);
        const oldChrome = /Chrome\/[1-5][0-9]/.test(nav.userAgent);
        
        // Performance-based heuristics
        const slowCanvas = this.isCanvasSlow();
        
        return lowCores || lowMemory || oldAndroid || oldIOS || oldChrome || slowCanvas;
    }

    /**
     * Test canvas performance for device capability assessment
     * @returns {boolean}
     */
    isCanvasSlow() {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 100;
            canvas.height = 100;
            const ctx = canvas.getContext('2d');
            
            const start = performance.now();
            
            // Simple rendering test
            for (let i = 0; i < 1000; i++) {
                ctx.fillRect(Math.random() * 100, Math.random() * 100, 10, 10);
            }
            
            const duration = performance.now() - start;
            return duration > 100; // More than 100ms for simple ops indicates slow device
        } catch {
            return true; // Assume slow if can't test
        }
    }

    /**
     * Enhanced network speed detection
     * @returns {boolean}
     */
    isSlowNetwork() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (!connection) return false;
        
        const slowTypes = ['slow-2g', '2g'];
        const isSlowType = slowTypes.includes(connection.effectiveType);
        const isSlowSpeed = connection.downlink && connection.downlink < 1.5;
        const isHighRTT = connection.rtt && connection.rtt > 300;
        
        return isSlowType || isSlowSpeed || isHighRTT;
    }

    /**
     * Detect mobile devices with enhanced accuracy
     * @returns {boolean}
     */
    isMobileDevice() {
        const mobileRegex = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
        const userAgentMobile = mobileRegex.test(navigator.userAgent);
        const screenMobile = window.innerWidth <= 768 && 'ontouchstart' in window;
        const orientationMobile = 'orientation' in window;
        
        return userAgentMobile || (screenMobile && orientationMobile);
    }

    /**
     * Detect tablet devices specifically
     * @returns {boolean}
     */
    isTabletDevice() {
        const tabletRegex = /iPad|Android.*(?!Mobile)|Tablet|PlayBook|Silk/i;
        const userAgentTablet = tabletRegex.test(navigator.userAgent);
        const screenTablet = window.innerWidth > 768 && window.innerWidth <= 1024 && 'ontouchstart' in window;
        
        return userAgentTablet || screenTablet;
    }

    /**
     * Enhanced WebGL support detection
     * @returns {boolean}
     */
    supportsWebGL() {
        try {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            return !!(context && context.getParameter && context.getParameter(context.VERSION));
        } catch {
            return false;
        }
    }

    /**
     * WebGL 2.0 support detection
     * @returns {boolean}
     */
    supportsWebGL2() {
        try {
            const canvas = document.createElement('canvas');
            return !!(canvas.getContext('webgl2'));
        } catch {
            return false;
        }
    }

    /**
     * Enhanced backdrop-filter support detection
     * @returns {boolean}
     */
    supportsBackdropFilter() {
        return (
            CSS.supports('backdrop-filter', 'blur(1px)') || 
            CSS.supports('-webkit-backdrop-filter', 'blur(1px)')
        );
    }

    /**
     * Container queries support detection
     * @returns {boolean}
     */
    supportsContainerQueries() {
        return CSS.supports('container-type', 'inline-size');
    }

    /**
     * Viewport units support detection
     * @returns {boolean}
     */
    supportsViewportUnits() {
        return CSS.supports('height', '100vh') && CSS.supports('width', '100vw');
    }
}

/**
 * Advanced gaming audio system with spatial audio and dynamic range
 */
class GameAudioSystem {
    constructor(enabled = true) {
        this.enabled = enabled;
        this.audioContext = null;
        this.soundBank = new Map();
        this.soundInstances = new Set();
        this.masterVolume = 0.3;
        this.initialized = false;
        this.spatialAudio = null;
        
        // Audio configuration
        this.config = {
            maxConcurrentSounds: 8,
            fadeTime: 0.1,
            reverbEnabled: false,
            spatialEnabled: false
        };
    }

    /**
     * Initialize advanced audio system with error recovery
     */
    async init() {
        if (!this.enabled || this.initialized) return;

        try {
            // Create audio context with optimal settings
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
                latencyHint: 'interactive',
                sampleRate: 44100
            });
            
            // Handle audio context state
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
            // Create master audio graph
            await this.createAudioGraph();
            
            // Pre-generate sound bank
            await this.generateSoundBank();
            
            // Setup spatial audio if supported
            if (this.config.spatialEnabled) {
                this.setupSpatialAudio();
            }
            
            this.initialized = true;
            console.log('🎵 Advanced Game Audio System initialized');
        } catch (error) {
            console.warn('Audio system initialization failed:', error);
            this.enabled = false;
        }
    }

    /**
     * Create master audio processing graph
     */
    async createAudioGraph() {
        const ctx = this.audioContext;
        
        // Master gain control
        this.masterGain = ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.masterVolume, ctx.currentTime);
        
        // Compressor for dynamic range control
        this.compressor = ctx.createDynamicsCompressor();
        this.compressor.threshold.setValueAtTime(-24, ctx.currentTime);
        this.compressor.knee.setValueAtTime(30, ctx.currentTime);
        this.compressor.ratio.setValueAtTime(12, ctx.currentTime);
        this.compressor.attack.setValueAtTime(0.003, ctx.currentTime);
        this.compressor.release.setValueAtTime(0.25, ctx.currentTime);
        
        // Optional reverb
        if (this.config.reverbEnabled) {
            this.reverb = await this.createReverb();
            this.reverbGain = ctx.createGain();
            this.reverbGain.gain.setValueAtTime(0.2, ctx.currentTime);
        }
        
        // Connect audio graph
        this.masterGain.connect(this.compressor);
        this.compressor.connect(ctx.destination);
        
        if (this.reverb) {
            this.masterGain.connect(this.reverbGain);
            this.reverbGain.connect(this.reverb);
            this.reverb.connect(ctx.destination);
        }
    }

    /**
     * Create convolution reverb
     * @returns {ConvolverNode} Reverb node
     */
    async createReverb() {
        const ctx = this.audioContext;
        const convolver = ctx.createConvolver();
        
        // Generate impulse response for reverb
        const length = ctx.sampleRate * 2; // 2 seconds
        const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const channelData = impulse.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                const decay = Math.pow(1 - i / length, 2);
                channelData[i] = (Math.random() * 2 - 1) * decay;
            }
        }
        
        convolver.buffer = impulse;
        return convolver;
    }

    /**
     * Setup spatial audio capabilities
     */
    setupSpatialAudio() {
        if ('AudioListener' in window && this.audioContext.listener) {
            this.spatialAudio = {
                listener: this.audioContext.listener,
                enabled: true
            };
            
            // Set default listener orientation
            if (this.spatialAudio.listener.forwardX) {
                this.spatialAudio.listener.forwardX.setValueAtTime(0, this.audioContext.currentTime);
                this.spatialAudio.listener.forwardY.setValueAtTime(0, this.audioContext.currentTime);
                this.spatialAudio.listener.forwardZ.setValueAtTime(-1, this.audioContext.currentTime);
            }
        }
    }

    /**
     * Generate comprehensive sound bank for gaming interactions
     */
    async generateSoundBank() {
        const sounds = {
            // UI Interactions
            expand: { 
                frequency: [800, 1000], 
                duration: 0.15, 
                type: 'sine', 
                envelope: 'fadeInOut',
                gain: 0.6 
            },
            collapse: { 
                frequency: [600, 400], 
                duration: 0.12, 
                type: 'sine', 
                envelope: 'fadeOut',
                gain: 0.4 
            },
            hover: { 
                frequency: 1200, 
                duration: 0.05, 
                type: 'square', 
                envelope: 'instant',
                gain: 0.3 
            },
            click: { 
                frequency: [800, 1200, 800], 
                duration: 0.08, 
                type: 'sawtooth', 
                envelope: 'punch',
                gain: 0.5 
            },
            
            // Gaming Events
            success: { 
                frequency: [523, 659, 784, 1047], 
                duration: 0.4, 
                type: 'sine', 
                envelope: 'chord',
                gain: 0.7 
            },
            error: { 
                frequency: [200, 150], 
                duration: 0.25, 
                type: 'square', 
                envelope: 'harsh',
                gain: 0.6 
            },
            notification: { 
                frequency: [880, 1108], 
                duration: 0.2, 
                type: 'triangle', 
                envelope: 'bell',
                gain: 0.5 
            },
            
            // Navigation
            swipeLeft: { 
                frequency: [400, 200], 
                duration: 0.1, 
                type: 'sawtooth', 
                envelope: 'slide',
                gain: 0.4 
            },
            swipeRight: { 
                frequency: [200, 400], 
                duration: 0.1, 
                type: 'sawtooth', 
                envelope: 'slide',
                gain: 0.4 
            },
            
            // Special Effects
            powerUp: { 
                frequency: [220, 330, 440, 660], 
                duration: 0.6, 
                type: 'sawtooth', 
                envelope: 'powerUp',
                gain: 0.8 
            },
            levelComplete: { 
                frequency: [523, 659, 784, 1047, 1319], 
                duration: 1.0, 
                type: 'sine', 
                envelope: 'celebration',
                gain: 0.9 
            }
        };

        for (const [name, config] of Object.entries(sounds)) {
            this.soundBank.set(name, config);
        }
    }

    /**
     * Play sound with advanced options and spatial positioning
     * @param {string} soundName - Sound to play
     * @param {Object} options - Playback options
     */
    play(soundName, options = {}) {
        if (!this.enabled || !this.initialized || !this.audioContext) return;

        const soundConfig = this.soundBank.get(soundName);
        if (!soundConfig) {
            console.warn(`Sound '${soundName}' not found in bank`);
            return;
        }

        // Limit concurrent sounds for performance
        if (this.soundInstances.size >= this.config.maxConcurrentSounds) {
            console.debug('Max concurrent sounds reached, skipping');
            return;
        }

        try {
            const soundInstance = this.createSoundInstance(soundConfig, options);
            this.soundInstances.add(soundInstance);
            
            // Auto-cleanup when sound finishes
            setTimeout(() => {
                this.soundInstances.delete(soundInstance);
            }, (soundConfig.duration + 0.1) * 1000);
            
        } catch (error) {
            console.warn(`Failed to play sound '${soundName}':`, error);
        }
    }

    /**
     * Create and configure sound instance
     * @param {Object} config - Sound configuration
     * @param {Object} options - Override options
     * @returns {Object} Sound instance
     */
    createSoundInstance(config, options) {
        const ctx = this.audioContext;
        const startTime = ctx.currentTime;
        const duration = options.duration || config.duration;
        const baseGain = (options.volume || 1) * (config.gain || 0.5) * this.masterVolume;

        const instance = {
            startTime,
            duration,
            nodes: []
        };

        // Handle different sound types
        if (Array.isArray(config.frequency)) {
            this.createChordSound(config, options, instance, baseGain);
        } else {
            this.createToneSound(config, options, instance, baseGain);
        }

        return instance;
    }

    /**
     * Create chord/sequence sound
     * @param {Object} config - Sound configuration
     * @param {Object} options - Override options
     * @param {Object} instance - Sound instance
     * @param {number} baseGain - Base gain level
     */
    createChordSound(config, options, instance, baseGain) {
        config.frequency.forEach((freq, index) => {
            const delay = config.envelope === 'chord' ? 0 : index * 0.05;
            const duration = config.duration * (config.envelope === 'chord' ? 1 : 0.8);
            
            setTimeout(() => {
                const toneInstance = this.createTone(
                    freq, 
                    duration, 
                    config.type, 
                    baseGain * (1 - index * 0.1), // Slight volume decay for harmony
                    options
                );
                instance.nodes.push(...toneInstance);
            }, delay * 1000);
        });
    }

    /**
     * Create single tone sound
     * @param {Object} config - Sound configuration
     * @param {Object} options - Override options
     * @param {Object} instance - Sound instance
     * @param {number} baseGain - Base gain level
     */
    createToneSound(config, options, instance, baseGain) {
        const toneInstance = this.createTone(
            config.frequency,
            config.duration,
            config.type,
            baseGain,
            options
        );
        instance.nodes.push(...toneInstance);
    }

    /**
     * Create individual tone with advanced envelope and effects
     * @param {number} frequency - Frequency in Hz
     * @param {number} duration - Duration in seconds
     * @param {string} type - Oscillator type
     * @param {number} volume - Volume level
     * @param {Object} options - Additional options
     * @returns {Array} Array of audio nodes
     */
    createTone(frequency, duration, type, volume, options = {}) {
        const ctx = this.audioContext;
        const startTime = ctx.currentTime;
        const nodes = [];
        
        // Create oscillator
        const oscillator = ctx.createOscillator();
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, startTime);
        nodes.push(oscillator);

        // Create gain with envelope
        const gainNode = ctx.createGain();
        this.applyEnvelope(gainNode, volume, duration, startTime, options.envelope);
        nodes.push(gainNode);

        // Create filter for tone shaping
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(frequency * 3, startTime);
        filter.Q.setValueAtTime(1, startTime);
        nodes.push(filter);

        // Optional spatial positioning
        let finalNode = gainNode;
        if (this.spatialAudio && options.position) {
            const panner = ctx.createPanner();
            panner.panningModel = 'HRTF';
            panner.positionX.setValueAtTime(options.position.x || 0, startTime);
            panner.positionY.setValueAtTime(options.position.y || 0, startTime);
            panner.positionZ.setValueAtTime(options.position.z || 0, startTime);
            finalNode = panner;
            nodes.push(panner);
        }

        // Connect audio graph
        oscillator.connect(filter);
        filter.connect(gainNode);
        if (finalNode !== gainNode) {
            gainNode.connect(finalNode);
        }
        finalNode.connect(this.masterGain);

        // Start and schedule stop
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);

        return nodes;
    }

    /**
     * Apply envelope to gain node
     * @param {GainNode} gainNode - Gain node to modify
     * @param {number} volume - Peak volume
     * @param {number} duration - Total duration
     * @param {number} startTime - Start time
     * @param {string} envelope - Envelope type
     */
    applyEnvelope(gainNode, volume, duration, startTime, envelope = 'fadeInOut') {
        const gain = gainNode.gain;
        
        switch (envelope) {
            case 'instant':
                gain.setValueAtTime(volume, startTime);
                gain.setValueAtTime(0, startTime + duration);
                break;
                
            case 'fadeIn':
                gain.setValueAtTime(0, startTime);
                gain.linearRampToValueAtTime(volume, startTime + this.config.fadeTime);
                gain.setValueAtTime(volume, startTime + duration);
                break;
                
            case 'fadeOut':
                gain.setValueAtTime(volume, startTime);
                gain.exponentialRampToValueAtTime(0.001, startTime + duration);
                break;
                
            case 'fadeInOut':
                gain.setValueAtTime(0, startTime);
                gain.linearRampToValueAtTime(volume, startTime + this.config.fadeTime);
                gain.exponentialRampToValueAtTime(0.001, startTime + duration - this.config.fadeTime);
                break;
                
            case 'punch':
                gain.setValueAtTime(0, startTime);
                gain.linearRampToValueAtTime(volume * 1.2, startTime + 0.01);
                gain.exponentialRampToValueAtTime(volume * 0.8, startTime + 0.05);
                gain.exponentialRampToValueAtTime(0.001, startTime + duration);
                break;
                
            case 'bell':
                gain.setValueAtTime(0, startTime);
                gain.linearRampToValueAtTime(volume, startTime + 0.02);
                gain.exponentialRampToValueAtTime(volume * 0.3, startTime + duration * 0.3);
                gain.exponentialRampToValueAtTime(0.001, startTime + duration);
                break;
                
            default:
                gain.setValueAtTime(0, startTime);
                gain.linearRampToValueAtTime(volume, startTime + 0.01);
                gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        }
    }

    /**
     * Set master volume with smooth transition
     * @param {number} volume - Volume level (0-1)
     * @param {number} fadeTime - Fade duration in seconds
     */
    setVolume(volume, fadeTime = 0.1) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        
        if (this.masterGain && this.audioContext) {
            const currentTime = this.audioContext.currentTime;
            this.masterGain.gain.linearRampToValueAtTime(
                this.masterVolume, 
                currentTime + fadeTime
            );
        }
    }

    /**
     * Stop all currently playing sounds
     */
    stopAll() {
        this.soundInstances.forEach(instance => {
            instance.nodes.forEach(node => {
                if (node.stop) {
                    try {
                        node.stop();
                    } catch (e) {
                        // Node may already be stopped
                    }
                }
            });
        });
        this.soundInstances.clear();
    }

    /**
     * Cleanup and destroy audio system
     */
    destroy() {
        this.stopAll();
        
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
        
        this.soundBank.clear();
        this.initialized = false;
        console.log('🔇 Audio system destroyed');
    }
}

/**
 * Main Progressive Scroll Accordion System
 */
class ProgressiveScrollAccordion {
    /**
     * Initialize the Progressive Scroll Accordion
     * @param {Object} options - Configuration options
     */
    constructor(options = {}) {
        // Performance monitoring
        this.perf = new PerformanceMonitor();
        this.perf.start('accordion-init');

        // Device capabilities detection
        this.device = new DeviceCapabilityDetector();
        
        // Smart configuration based on device capabilities
        this.config = {
            // Core selectors
            sectionSelector: '.progressive-section',
            headerSelector: '.section-header',
            contentSelector: '.section-content',
            containerSelector: '.scroll-accordion-container',
            
            // Intersection Observer settings
            threshold: this.device.capabilities.isMobile ? 0.3 : 0.5,
            rootMargin: this.device.capabilities.isMobile ? '-10% 0px -10% 0px' : '-15% 0px -15% 0px',
            
            // Animation settings
            transitionDuration: this.device.capabilities.maxAnimationDuration,
            enableSounds: !this.device.capabilities.preferReducedMotion && !this.device.capabilities.isLowEnd,
            enableParticles: this.device.capabilities.enableParticles,
            enableAdvancedEffects: this.device.capabilities.enableAdvancedEffects,
            
            // Feature toggles
            enableNavigation: true,
            enableKeyboard: !this.device.capabilities.isMobile,
            enableAnalytics: true,
            enablePreloading: !this.device.capabilities.isSlowNetwork,
            enableTouchGestures: this.device.capabilities.isTouch,
            
            // Performance options
            optimizeForTouch: this.device.capabilities.isTouch,
            maxConcurrentAnimations: this.device.capabilities.isLowEnd ? 1 : 3,
            debounceDelay: this.device.capabilities.isMobile ? 150 : 100,
            throttleDelay: this.device.capabilities.isLowEnd ? 32 : 16, // 30fps vs 60fps
            
            // Override with user options
            ...options
        };

        // State management
        this.state = {
            sections: [],
            currentActiveIndex: 0,
            previousActiveIndex: -1,
            isTransitioning: false,
            isInitialized: false,
            isPaused: false,
            visibilityMap: new Map(),
            animationQueue: [],
            performanceMode: this.device.capabilities.shouldUsePerformanceMode,
            lastScrollPosition: 0,
            scrollDirection: 'down'
        };

        // Systems
        this.audio = new GameAudioSystem(this.config.enableSounds);
        this.analytics = new Map();

        // Observers
        this.observers = {
            intersection: null,
            resize: null,
            mutation: null
        };

        // Event handlers with proper binding
        this.boundHandlers = {
            resize: this.debounce(this.handleResize.bind(this), this.config.debounceDelay),
            scroll: this.throttle(this.handleScroll.bind(this), this.config.throttleDelay),
            visibilityChange: this.handleVisibilityChange.bind(this),
            keydown: this.handleKeydown.bind(this),
            touchStart: this.handleTouchStart.bind(this),
            touchMove: this.handleTouchMove.bind(this),
            touchEnd: this.handleTouchEnd.bind(this),
            beforeUnload: this.handleBeforeUnload.bind(this),
            capabilityChanged: this.handleCapabilityChanged.bind(this)
        };

        // Touch gesture state
        this.touchState = {
            startY: 0,
            currentY: 0,
            startTime: 0,
            isScrolling: false,
            velocity: 0
        };

        // Initialize system
        this.init().catch(error => {
            console.error('Failed to initialize accordion:', error);
            this.handleInitializationError(error);
        });
    }

    /**
     * Initialize the complete accordion system
     */
    async init() {
        try {
            console.log('🎮 Initializing GGenius Progressive Scroll Accordion...');
            console.log('📊 Device capabilities:', this.device.capabilities);

            // Apply performance optimizations early
            if (this.state.performanceMode) {
                document.body.classList.add('performance-mode');
                console.log('⚡ Performance mode enabled');
            }

            // Initialize subsystems
            await this.perf.measure(() => this.initializeSubsystems(), 'subsystems');
            
            // Setup DOM structure
            await this.perf.measure(() => this.setupSections(), 'sections');
            
            // Create observers
            await this.perf.measure(() => this.createObservers(), 'observers');
            
            // Setup user interactions
            this.setupNavigation();
            this.setupKeyboardControls();
            this.setupTouchGestures();
            
            // Bind all events
            this.bindEvents();
            
            // Set initial state
            await this.setInitialState();
            
            // Mark as initialized
            this.state.isInitialized = true;
            this.perf.end('accordion-init');
            
            // Dispatch ready event for external integrations
            this.dispatchCustomEvent('accordion:ready', {
                sections: this.state.sections.length,
                performanceMode: this.state.performanceMode,
                capabilities: this.device.capabilities,
                config: this.config
            });

            console.log('✅ Progressive Scroll Accordion initialized successfully');

        } catch (error) {
            console.error('❌ Accordion initialization failed:', error);
            throw error;
        }
    }

    /**
     * Initialize all subsystems
     */
    async initializeSubsystems() {
        // Initialize audio system
        if (this.config.enableSounds) {
            await this.audio.init();
        }

        // Setup analytics if enabled
        if (this.config.enableAnalytics) {
            this.setupAnalytics();
        }

        // Preload resources if enabled
        if (this.config.enablePreloading) {
            this.preloadResources();
        }

        // Setup error tracking
        this.setupErrorTracking();
    }

    /**
     * Setup comprehensive error tracking
     */
    setupErrorTracking() {
        window.addEventListener('error', (event) => {
            if (event.filename?.includes('progressive-accordion')) {
                console.error('🐛 Accordion runtime error:', event.error);
                this.handleRuntimeError(event.error);
            }
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('🐛 Accordion unhandled promise rejection:', event.reason);
            this.handleRuntimeError(event.reason);
        });
    }

    /**
     * Setup sections with enhanced structure and validation
     */
    async setupSections() {
        const sectionElements = document.querySelectorAll(this.config.sectionSelector);
        
        if (sectionElements.length === 0) {
            throw new Error(`No sections found with selector: ${this.config.sectionSelector}`);
        }

        console.log(`📄 Found ${sectionElements.length} sections to process`);

        // Process each section
        this.state.sections = Array.from(sectionElements).map((element, index) => {
            return this.processSectionElement(element, index);
        });

        // Create container if it doesn't exist
        this.ensureContainerExists();

        // Validate section structure
        this.validateSectionStructure();

        console.log(`✅ Processed ${this.state.sections.length} sections successfully`);
    }

    /**
     * Process individual section element
     * @param {HTMLElement} element - Section element
     * @param {number} index - Section index
     * @returns {Object} Section configuration
     */
    processSectionElement(element, index) {
        // Add progressive section class
        element.classList.add('progressive-section');
        
        // Generate unique ID if missing
        const id = element.id || `section-${index}`;
        element.id = id;

        // Setup section header
        const header = this.setupSectionHeader(element, index);
        
        // Setup section content
        const content = this.setupSectionContent(element);
        
        // Add accessibility attributes
        this.setupAccessibility(element, header, content, index);
        
        // Setup section-specific events
        this.setupSectionEvents(element, index);

        return {
            element,
            header,
            content,
            index,
            id,
            isExpanded: false,
            isVisible: false,
            animationState: 'idle', // idle, expanding, collapsing
            lastUpdateTime: 0
        };
    }

    /**
     * Setup section header with enhanced structure
     * @param {HTMLElement} element - Section element
     * @param {number} index - Section index
     * @returns {HTMLElement} Header element
     */
    setupSectionHeader(element, index) {
        let header = element.querySelector(this.config.headerSelector);
        
        if (!header) {
            // Create header if it doesn't exist
            const h2 = element.querySelector('h2');
            if (h2) {
                header = document.createElement('div');
                header.className = 'section-header';
                h2.parentNode.insertBefore(header, h2);
                header.appendChild(h2);
            } else {
                throw new Error(`Section ${index} missing header element`);
            }
        }

        // Add progress indicator if it doesn't exist
        if (!header.querySelector('.section-progress')) {
            const progressBar = document.createElement('div');
            progressBar.className = 'section-progress';
            progressBar.setAttribute('aria-hidden', 'true');
            header.appendChild(progressBar);
        }

        // Add click handler for manual control
        header.addEventListener('click', (event) => {
            event.preventDefault();
            this.handleHeaderClick(index);
        });

        return header;
    }

    /**
     * Setup section content wrapper
     * @param {HTMLElement} element - Section element
     * @returns {HTMLElement} Content element
     */
    setupSectionContent(element) {
        let content = element.querySelector(this.config.contentSelector);
        
        if (!content) {
            // Wrap existing content
            const existingContent = Array.from(element.children).filter(
                child => !child.classList.contains('section-header')
            );
            
            if (existingContent.length > 0) {
                content = document.createElement('div');
                content.className = 'section-content';
                
                existingContent.forEach(child => {
                    content.appendChild(child);
                });
                
                element.appendChild(content);
            } else {
                throw new Error('Section has no content to wrap');
            }
        }

        return content;
    }

    /**
     * Setup accessibility attributes for screen readers
     * @param {HTMLElement} element - Section element
     * @param {HTMLElement} header - Header element
     * @param {HTMLElement} content - Content element
     * @param {number} index - Section index
     */
    setupAccessibility(element, header, content, index) {
        // Section accessibility
        element.setAttribute('role', 'region');
        element.setAttribute('aria-label', `Section ${index + 1}`);
        
        // Header accessibility
        header.setAttribute('role', 'button');
        header.setAttribute('aria-expanded', 'false');
        header.setAttribute('aria-controls', `${element.id}-content`);
        header.setAttribute('tabindex', '0');
        
        // Content accessibility
        content.id = `${element.id}-content`;
        content.setAttribute('role', 'region');
        content.setAttribute('aria-hidden', 'true');
        
        // Keyboard support for header
        header.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.handleHeaderClick(index);
            }
        });
    }

    /**
     * Setup section-specific event listeners
     * @param {HTMLElement} element - Section element
     * @param {number} index - Section index
     */
    setupSectionEvents(element, index) {
        // Mouse events for enhanced UX
        element.addEventListener('mouseenter', () => {
            if (!this.state.isTransitioning && this.config.enableSounds) {
                this.audio.play('hover', { volume: 0.3 });
            }
        });

        // Focus events for accessibility
        element.addEventListener('focusin', () => {
            element.classList.add('focused');
        });

        element.addEventListener('focusout', () => {
            element.classList.remove('focused');
        });
    }

    /**
     * Ensure container wrapper exists
     */
    ensureContainerExists() {
        let container = document.querySelector(this.config.containerSelector);
        
        if (!container) {
            container = document.createElement('div');
            container.className = 'scroll-accordion-container';
            
            const firstSection = this.state.sections[0]?.element;
            if (firstSection) {
                firstSection.parentNode.insertBefore(container, firstSection);
                
                // Move all sections into container
                this.state.sections.forEach(section => {
                    container.appendChild(section.element);
                });
            }
        }

        this.containerElement = container;
    }

    /**
     * Validate section structure integrity
     */
    validateSectionStructure() {
        const issues = [];

        this.state.sections.forEach((section, index) => {
            if (!section.header) {
                issues.push(`Section ${index} missing header`);
            }
            
            if (!section.content) {
                issues.push(`Section ${index} missing content`);
            }
            
            if (!section.element.id) {
                issues.push(`Section ${index} missing ID`);
            }
        });

        if (issues.length > 0) {
            console.warn('⚠️ Section structure issues:', issues);
        }
    }

    /**
     * Create all necessary observers for scroll and resize tracking
     */
    createObservers() {
        // Create Intersection Observer for scroll detection
        this.createIntersectionObserver();
        
        // Create Resize Observer for responsive updates
        this.createResizeObserver();
        
        // Create Mutation Observer for dynamic content changes
        this.createMutationObserver();
    }

    /**
     * Create and configure Intersection Observer
     */
    createIntersectionObserver() {
        if (!this.device.capabilities.supportsIntersectionObserver) {
            console.warn('IntersectionObserver not supported, using fallback');
            this.setupScrollFallback();
            return;
        }

        const options = {
            root: null,
            rootMargin: this.config.rootMargin,
            threshold: [0, this.config.threshold, 1]
        };

        this.observers.intersection = new IntersectionObserver((entries) => {
            this.handleIntersectionEntries(entries);
        }, options);

        // Observe all sections
        this.state.sections.forEach(section => {
            this.observers.intersection.observe(section.element);
        });

        console.log('👁️ Intersection Observer created and observing sections');
    }

    /**
     * Handle intersection observer entries with enhanced logic
     * @param {Array} entries - Intersection entries
     */
    handleIntersectionEntries(entries) {
        if (this.state.isPaused) return;

        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        
        // Update visibility map
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
            }
        });

        // Find best candidate for expansion
        const candidate = this.findBestExpansionCandidate(visibleEntries);
        
        if (candidate !== null && candidate !== this.state.currentActiveIndex) {
            this.requestSectionTransition(candidate);
        }
    }

    /**
     * Find the best section to expand based on visibility and scroll direction
     * @param {Array} visibleEntries - Currently visible entries
     * @returns {number|null} Best section index or null
     */
    findBestExpansionCandidate(visibleEntries) {
        if (visibleEntries.length === 0) return null;

        // Sort by intersection ratio and position
        const candidates = visibleEntries
            .map(entry => {
                const sectionIndex = this.state.sections.findIndex(
                    section => section.element === entry.target
                );
                return {
                    index: sectionIndex,
                    ratio: entry.intersectionRatio,
                    top: entry.boundingClientRect.top,
                    height: entry.boundingClientRect.height
                };
            })
            .filter(candidate => candidate.index !== -1)
            .sort((a, b) => {
                // Prioritize by intersection ratio, then by scroll direction
                if (Math.abs(a.ratio - b.ratio) < 0.1) {
                    return this.state.scrollDirection === 'down' ? a.index - b.index : b.index - a.index;
                }
                return b.ratio - a.ratio;
            });

        return candidates.length > 0 ? candidates[0].index : null;
    }

    /**
     * Request section transition with debouncing and validation
     * @param {number} targetIndex - Target section index
     */
    requestSectionTransition(targetIndex) {
        // Debounce rapid requests
        if (this.transitionTimeout) {
            clearTimeout(this.transitionTimeout);
        }

        this.transitionTimeout = setTimeout(() => {
            this.performSectionTransition(targetIndex);
        }, 50);
    }

    /**
     * Perform the actual section transition with comprehensive handling
     * @param {number} targetIndex - Target section index
     */
    async performSectionTransition(targetIndex) {
        if (this.state.isTransitioning || 
            targetIndex < 0 || 
            targetIndex >= this.state.sections.length ||
            targetIndex === this.state.currentActiveIndex) {
            return;
        }

        this.state.isTransitioning = true;
        this.state.previousActiveIndex = this.state.currentActiveIndex;
        
        try {
            await this.perf.measure(async () => {
                // Play transition sound
                if (this.config.enableSounds) {
                    this.audio.play('expand', { volume: 0.5 });
                }

                // Collapse previous section
                if (this.state.previousActiveIndex !== -1) {
                    await this.collapseSection(this.state.previousActiveIndex);
                }

                // Expand target section
                await this.expandSection(targetIndex);

                // Update state
                this.state.currentActiveIndex = targetIndex;

                // Update navigation
                this.updateNavigation(targetIndex);

                // Update analytics
                this.trackSectionView(targetIndex);

                // Dispatch transition event
                this.dispatchCustomEvent('section:changed', {
                    previousIndex: this.state.previousActiveIndex,
                    currentIndex: targetIndex,
                    section: this.state.sections[targetIndex]
                });

            }, 'transition');

        } finally {
            this.state.isTransitioning = false;
        }
    }

    /**
     * Expand specific section with enhanced animations
     * @param {number} sectionIndex - Section to expand
     */
    async expandSection(sectionIndex) {
        const section = this.state.sections[sectionIndex];
        if (!section || section.isExpanded) return;

        section.animationState = 'expanding';
        
        // Update element classes
        section.element.classList.remove('collapsed');
        section.element.classList.add('expanded');
        
        // Update accessibility
        section.header.setAttribute('aria-expanded', 'true');
        section.content.setAttribute('aria-hidden', 'false');
        
        // Trigger CSS animations
        await this.waitForTransition(section.element);
        
        section.isExpanded = true;
        section.animationState = 'idle';
        section.lastUpdateTime = performance.now();

        // Dispatch expanded event
        this.dispatchCustomEvent('section:expanded', { section, index: sectionIndex });
    }

    /**
     * Collapse specific section with enhanced animations
     * @param {number} sectionIndex - Section to collapse
     */
    async collapseSection(sectionIndex) {
        const section = this.state.sections[sectionIndex];
        if (!section || !section.isExpanded) return;

        section.animationState = 'collapsing';

        // Play collapse sound
        if (this.config.enableSounds) {
            this.audio.play('collapse', { volume: 0.3 });
        }
        
        // Update element classes
        section.element.classList.remove('expanded');
        section.element.classList.add('collapsed');
        
        // Update accessibility
        section.header.setAttribute('aria-expanded', 'false');
        section.content.setAttribute('aria-hidden', 'true');
        
        // Wait for CSS transition
        await this.waitForTransition(section.element);
        
        section.isExpanded = false;
        section.animationState = 'idle';
        section.lastUpdateTime = performance.now();

        // Dispatch collapsed event
        this.dispatchCustomEvent('section:collapsed', { section, index: sectionIndex });
    }

    /**
     * Wait for CSS transition to complete
     * @param {HTMLElement} element - Element to monitor
     * @returns {Promise} Promise that resolves when transition completes
     */
    waitForTransition(element) {
        return new Promise((resolve) => {
            const timeout = setTimeout(resolve, this.config.transitionDuration);
            
            const onTransitionEnd = () => {
                clearTimeout(timeout);
                element.removeEventListener('transitionend', onTransitionEnd);
                resolve();
            };
            
            element.addEventListener('transitionend', onTransitionEnd);
        });
    }

    /**
     * Create resize observer for responsive updates
     */
    createResizeObserver() {
        if (!this.device.capabilities.supportsResizeObserver) {
            console.warn('ResizeObserver not supported, using window resize');
            return;
        }

        this.observers.resize = new ResizeObserver((entries) => {
            this.handleResize(entries);
        });

        // Observe container
        if (this.containerElement) {
            this.observers.resize.observe(this.containerElement);
        }
    }

    /**
     * Create mutation observer for dynamic content changes
     */
    createMutationObserver() {
        this.observers.mutation = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    this.handleContentMutation(mutation);
                }
            });
        });

        // Observe each section's content
        this.state.sections.forEach(section => {
            this.observers.mutation.observe(section.content, {
                childList: true,
                subtree: true
            });
        });
    }

    /**
     * Handle content mutations for dynamic updates
     * @param {MutationRecord} mutation - Mutation record
     */
    handleContentMutation(mutation) {
        // Find which section was mutated
        const sectionIndex = this.state.sections.findIndex(section => 
            section.content.contains(mutation.target)
        );

        if (sectionIndex !== -1 && sectionIndex === this.state.currentActiveIndex) {
            // Recalculate expanded section height
            this.recalculateSectionHeight(sectionIndex);
        }
    }

    /**
     * Recalculate section height after content changes
     * @param {number} sectionIndex - Section index
     */
    recalculateSectionHeight(sectionIndex) {
        const section = this.state.sections[sectionIndex];
        if (section?.isExpanded) {
            // Force height recalculation
            section.element.style.height = 'auto';
            
            // Trigger reflow
            section.element.offsetHeight;
        }
    }

    /**
     * Setup navigation dots with enhanced features
     */
    setupNavigation() {
        if (!this.config.enableNavigation) return;

        // Remove existing navigation
        const existingNav = document.querySelector('.scroll-navigation');
        if (existingNav) existingNav.remove();

        // Create navigation container
        const nav = document.createElement('nav');
        nav.className = 'scroll-navigation';
        nav.setAttribute('aria-label', 'Section Navigation');
        nav.setAttribute('role', 'navigation');

        // Create dots for each section
        this.state.sections.forEach((section, index) => {
            const dot = this.createNavigationDot(section, index);
            nav.appendChild(dot);
        });

        // Add to document
        document.body.appendChild(nav);
        
        this.navigationElement = nav;
        console.log('🧭 Navigation created with', this.state.sections.length, 'dots');
    }

    /**
     * Create individual navigation dot
     * @param {Object} section - Section configuration
     * @param {number} index - Section index
     * @returns {HTMLElement} Navigation dot element
     */
    createNavigationDot(section, index) {
        const dot = document.createElement('button');
        dot.className = 'nav-dot';
        dot.setAttribute('aria-label', `Go to section ${index + 1}: ${section.id}`);
        dot.setAttribute('data-section-index', index);
        dot.type = 'button';
        
        // Click handler
        dot.addEventListener('click', (event) => {
            event.preventDefault();
            this.navigateToSection(index);
        });

        // Keyboard support
        dot.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.navigateToSection(index);
            }
        });

        return dot;
    }

    /**
     * Update navigation state
     * @param {number} activeIndex - Currently active section index
     */
    updateNavigation(activeIndex) {
        if (!this.navigationElement) return;

        const dots = this.navigationElement.querySelectorAll('.nav-dot');
        dots.forEach((dot, index) => {
            const isActive = index === activeIndex;
            dot.classList.toggle('active', isActive);
            dot.setAttribute('aria-current', isActive ? 'true' : 'false');
        });
    }

    /**
     * Navigate to specific section with smooth scrolling
     * @param {number} sectionIndex - Target section index
     */
    async navigateToSection(sectionIndex) {
        const section = this.state.sections[sectionIndex];
        if (!section) return;

        // Play navigation sound
        if (this.config.enableSounds) {
            this.audio.play('click', { volume: 0.4 });
        }

        // Smooth scroll to section
        section.element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
        });

        // Track navigation
        this.trackNavigation(sectionIndex);
    }

    /**
     * Setup comprehensive keyboard controls
     */
    setupKeyboardControls() {
        if (!this.config.enableKeyboard) return;

        document.addEventListener('keydown', this.boundHandlers.keydown);
        console.log('⌨️ Keyboard controls enabled');
    }

    /**
     * Handle keyboard events with gaming-style controls
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleKeydown(event) {
        // Skip if user is typing in input fields
        if (this.isTypingInInput(event.target)) return;

        const { key, ctrlKey, altKey, shiftKey } = event;
        let handled = false;

        switch (key) {
            // Navigation
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
                
            // Direct navigation
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                event.preventDefault();
                const index = parseInt(key) - 1;
                if (index < this.state.sections.length) {
                    this.navigateToSection(index);
                }
                handled = true;
                break;
                
            // Control functions
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
                
            // Pause/Resume (for presentations)
            case ' ':
                if (ctrlKey) {
                    event.preventDefault();
                    this.togglePause();
                    handled = true;
                }
                break;
                
            // Debug info
            case 'i':
                if (ctrlKey && altKey) {
                    event.preventDefault();
                    this.showDebugInfo();
                    handled = true;
                }
                break;
        }

        if (handled && this.config.enableSounds) {
            this.audio.play('click', { volume: 0.3 });
        }
    }

    /**
     * Check if user is typing in an input field
     * @param {HTMLElement} target - Event target
     * @returns {boolean} True if typing in input
     */
    isTypingInInput(target) {
        return target && (
            target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable
        );
    }

    /**
     * Navigate to previous section
     */
    navigateToPrevious() {
        const prevIndex = Math.max(0, this.state.currentActiveIndex - 1);
        if (prevIndex !== this.state.currentActiveIndex) {
            this.navigateToSection(prevIndex);
        }
    }

    /**
     * Navigate to next section
     */
    navigateToNext() {
        const nextIndex = Math.min(this.state.sections.length - 1, this.state.currentActiveIndex + 1);
        if (nextIndex !== this.state.currentActiveIndex) {
            this.navigateToSection(nextIndex);
        }
    }

    /**
     * Setup touch gesture support for mobile devices
     */
    setupTouchGestures() {
        if (!this.config.enableTouchGestures