/**
 * GGenius Enhanced Interactive Experience
 * Performance-optimized ES2023+ JavaScript for cyberpunk AI platform
 * @version 2.2.0 // Updated version with enhanced audio
 * @author MLBB-BOSS
 * @see GGeniusApp
 */

/**
 * @class GGeniusApp
 * @description Main class for initializing and managing the GGenius web application's interactive features.
 * Enhanced with advanced audio system and cyberpunk sound effects.
 */
class GGeniusApp {
    /**
     * Initializes the GGeniusApp instance.
     * Sets up properties, binds methods, and starts the initialization process.
     */
    constructor() {
        this.isLoaded = false;
        this.observers = new Map();
        this.animations = new Map();
        this.eventListeners = new Map();

        this.settings = {
            soundsEnabled: JSON.parse(localStorage.getItem('ggenius-soundsEnabled')) ?? true,
            musicEnabled: JSON.parse(localStorage.getItem('ggenius-musicEnabled')) ?? false,
            soundVolume: parseFloat(localStorage.getItem('ggenius-soundVolume')) || 0.3,
        };

        // Enhanced Audio System
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
        
        // Bind methods for proper context
        this.handleScroll = this.throttle(this._handleScroll.bind(this), 16); 
        this.handleResize = this.debounce(this._handleResize.bind(this), 200); 
        this.handleVisibilityChange = this._handleVisibilityChange.bind(this); 
        
        this.init();
    }

    /**
     * @returns {string} The current version of the script.
     */
    getVersion() {
        return "2.2.0"; // Updated version
    }

    /**
     * Asynchronously initializes all core components of the application.
     */
    async init() {
        try {
            console.log(`🚀 GGenius AI Revolution initializing... v${this.getVersion()}`);
            
            document.documentElement.classList.add('js-loaded');
            if (this.performance.isLowPerformance) {
                console.warn("🦥 Low performance mode activated based on initial detection.");
                document.documentElement.classList.add('low-performance-device');
            }

            await this.loadCriticalFeatures(); 
            this.setupGlobalEventListeners(); 
            
            // Initialize audio system early
            await this.initializeAudioSystem();
            
            const initialSetupPromises = [
                this.setupPerformanceMonitoring(),
                this.initializeUI(), 
                this.setupInteractions(), 
            ];
            await Promise.all(initialSetupPromises);
            
            await this.setupAdvancedFeatures(); 
            
            this.isLoaded = true;
            this.trackLoadTime();
            
            console.log('✅ GGenius fully initialized');
            document.dispatchEvent(new CustomEvent('ggenius:loaded'));
            
            // Play startup sound
            this.playStartupSequence();
            
        } catch (error) {
            console.error('🔥 GGenius initialization failed:', error);
            this.fallbackMode(error);
        }
    }

    /**
     * Initializes the advanced audio system with Web Audio API
     * @async
     */
    async initializeAudioSystem() {
        if (!this.settings.soundsEnabled || this.performance.isLowPerformance) {
            console.info("🔇 Audio system disabled (settings or performance)");
            return;
        }

        try {
            // Initialize AudioContext
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create master gain node
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.setValueAtTime(this.settings.soundVolume, this.audioContext.currentTime);
            this.masterGain.connect(this.audioContext.destination);

            // Preload sound effects
            await this.loadSoundEffects();
            
            // Setup audio unlock (required for iOS/mobile)
            this.setupAudioUnlock();
            
            console.log('🎵 Advanced audio system initialized');
            
        } catch (error) {
            console.error('🔇 Failed to initialize audio system:', error);
            this.settings.soundsEnabled = false;
        }
    }

    /**
     * Loads and creates various sound effects using Web Audio API
     * @async
     */
    async loadSoundEffects() {
        const soundConfigs = {
            // UI Interaction Sounds
            'button_hover': { 
                type: 'cyberpunk_chirp', 
                frequency: 800, 
                duration: 0.08, 
                volume: 0.15,
                modulation: { rate: 15, depth: 0.3 }
            },
            'button_click': { 
                type: 'cyber_beep', 
                frequency: 1200, 
                duration: 0.12, 
                volume: 0.25,
                envelope: { attack: 0.01, decay: 0.08, sustain: 0.3, release: 0.05 }
            },
            'nav_select': { 
                type: 'digital_blip', 
                frequency: 600, 
                duration: 0.15, 
                volume: 0.2,
                filter: { type: 'highpass', frequency: 400 }
            },
            'tab_switch': { 
                type: 'matrix_sweep', 
                frequency: [400, 800], 
                duration: 0.18, 
                volume: 0.2,
                sweep: true
            },
            'accordion_open': { 
                type: 'expand_whoosh', 
                frequency: [200, 600], 
                duration: 0.25, 
                volume: 0.18,
                noise: { type: 'white', mix: 0.1 }
            },
            'accordion_close': { 
                type: 'contract_swoosh', 
                frequency: [600, 200], 
                duration: 0.2, 
                volume: 0.15,
                reverse: true
            },
            'modal_open': { 
                type: 'portal_open', 
                frequency: [300, 900], 
                duration: 0.35, 
                volume: 0.3,
                reverb: { roomSize: 0.8, dampening: 0.2 }
            },
            'modal_close': { 
                type: 'portal_close', 
                frequency: [900, 300], 
                duration: 0.25, 
                volume: 0.2,
                reverse: true
            },
            'form_success': { 
                type: 'success_chime', 
                frequency: [523, 659, 784], // C5, E5, G5 chord
                duration: 0.4, 
                volume: 0.3,
                harmony: true
            },
            'form_error': { 
                type: 'error_buzz', 
                frequency: 150, 
                duration: 0.3, 
                volume: 0.25,
                distortion: 0.4,
                tremolo: { rate: 8, depth: 0.6 }
            },
            'notification': { 
                type: 'cyber_notification', 
                frequency: [1000, 1200, 800], 
                duration: 0.5, 
                volume: 0.25,
                sequence: true
            },
            'startup': { 
                type: 'system_boot', 
                frequency: [100, 200, 400, 800], 
                duration: 1.2, 
                volume: 0.2,
                sequence: true,
                delay: 0.15
            },
            'menu_open': { 
                type: 'slide_in', 
                frequency: [400, 600], 
                duration: 0.3, 
                volume: 0.18,
                slide: true
            },
            'menu_close': { 
                type: 'slide_out', 
                frequency: [600, 400], 
                duration: 0.25, 
                volume: 0.15,
                slide: true,
                reverse: true
            },
            'card_hover': { 
                type: 'soft_ping', 
                frequency: 400, 
                duration: 0.06, 
                volume: 0.1,
                soft: true
            },
            'scroll_milestone': { 
                type: 'achievement_ding', 
                frequency: [659, 831], // E5, G#5
                duration: 0.2, 
                volume: 0.15,
                sparkle: true
            }
        };

        for (const [name, config] of Object.entries(soundConfigs)) {
            this.soundEffects.set(name, config);
        }

        console.log(`🎼 Loaded ${this.soundEffects.size} sound effects`);
    }

    /**
     * Sets up audio unlock for mobile devices
     */
    setupAudioUnlock() {
        const unlockAudio = async () => {
            if (this.audioContext && this.audioContext.state === 'suspended') {
                try {
                    await this.audioContext.resume();
                    console.log('🔓 Audio context unlocked');
                    
                    // Remove unlock listeners
                    document.removeEventListener('touchstart', unlockAudio);
                    document.removeEventListener('touchend', unlockAudio);
                    document.removeEventListener('click', unlockAudio);
                } catch (error) {
                    console.warn('Failed to unlock audio context:', error);
                }
            }
        };

        // Add unlock event listeners
        document.addEventListener('touchstart', unlockAudio, { once: true, passive: true });
        document.addEventListener('touchend', unlockAudio, { once: true, passive: true });
        document.addEventListener('click', unlockAudio, { once: true, passive: true });
    }

    /**
     * Advanced sound synthesis with cyberpunk effects
     * @param {string} soundName - Name of the sound effect to play
     * @param {Object} overrides - Optional parameter overrides
     */
    playSound(soundName, overrides = {}) {
        if (!this.settings.soundsEnabled || !this.audioContext || !this.masterGain) {
            return;
        }

        const soundConfig = this.soundEffects.get(soundName);
        if (!soundConfig) {
            console.warn(`Sound effect "${soundName}" not found`);
            return;
        }

        try {
            const config = { ...soundConfig, ...overrides };
            this.synthesizeSound(config);
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    }

    /**
     * Synthesizes complex sound effects using Web Audio API
     * @param {Object} config - Sound configuration
     */
    synthesizeSound(config) {
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        
        const {
            type,
            frequency,
            duration,
            volume,
            envelope,
            modulation,
            filter,
            sweep,
            noise,
            reverb,
            harmony,
            distortion,
            tremolo,
            sequence,
            delay,
            slide,
            reverse,
            soft,
            sparkle
        } = config;

        // Create main oscillator(s)
        const frequencies = Array.isArray(frequency) ? frequency : [frequency];
        const oscillators = [];
        const gainNodes = [];

        frequencies.forEach((freq, index) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            // Determine waveform based on type
            let waveform = 'sine';
            if (type.includes('cyber') || type.includes('digital')) waveform = 'square';
            else if (type.includes('buzz') || type.includes('error')) waveform = 'sawtooth';
            else if (type.includes('chirp') || type.includes('beep')) waveform = 'triangle';
            
            osc.type = waveform;
            
            // Set frequency with potential sweep
            if (sweep || slide) {
                const startFreq = reverse ? frequencies[frequencies.length - 1] : frequencies[0];
                const endFreq = reverse ? frequencies[0] : frequencies[frequencies.length - 1];
                osc.frequency.setValueAtTime(startFreq, now);
                osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration * 0.8);
            } else if (sequence && frequencies.length > 1) {
                // Sequence mode: play frequencies in sequence
                const segmentDuration = duration / frequencies.length;
                osc.frequency.setValueAtTime(freq, now + index * segmentDuration);
            } else {
                osc.frequency.setValueAtTime(freq, now);
            }

            // Apply modulation (vibrato/tremolo)
            if (modulation) {
                const lfo = ctx.createOscillator();
                const modGain = ctx.createGain();
                lfo.frequency.setValueAtTime(modulation.rate, now);
                modGain.gain.setValueAtTime(modulation.depth * freq, now);
                lfo.connect(modGain);
                modGain.connect(osc.frequency);
                lfo.start(now);
                lfo.stop(now + duration);
            }

            // Apply envelope
            const att = envelope?.attack || 0.01;
            const dec = envelope?.decay || duration * 0.3;
            const sus = envelope?.sustain || 0.7;
            const rel = envelope?.release || duration * 0.2;

            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(volume * (soft ? 0.5 : 1), now + att);
            gain.gain.linearRampToValueAtTime(volume * sus, now + att + dec);
            gain.gain.setValueAtTime(volume * sus, now + duration - rel);
            gain.gain.linearRampToValueAtTime(0, now + duration);

            // Apply tremolo
            if (tremolo) {
                const tremoloLFO = ctx.createOscillator();
                const tremoloGain = ctx.createGain();
                tremoloLFO.frequency.setValueAtTime(tremolo.rate, now);
                tremoloGain.gain.setValueAtTime(tremolo.depth, now);
                tremoloLFO.connect(tremoloGain);
                tremoloGain.connect(gain.gain);
                tremoloLFO.start(now);
                tremoloLFO.stop(now + duration);
            }

            oscillators.push(osc);
            gainNodes.push(gain);
        });

        // Create audio chain
        let audioChain = gainNodes;

        // Add noise if specified
        if (noise) {
            const noiseBuffer = this.createNoiseBuffer(noise.type, duration);
            const noiseSource = ctx.createBufferSource();
            const noiseGain = ctx.createGain();
            
            noiseSource.buffer = noiseBuffer;
            noiseGain.gain.setValueAtTime(volume * noise.mix, now);
            
            noiseSource.connect(noiseGain);
            audioChain.push(noiseGain);
            
            noiseSource.start(now);
        }

        // Add filter
        let filterNode;
        if (filter) {
            filterNode = ctx.createBiquadFilter();
            filterNode.type = filter.type;
            filterNode.frequency.setValueAtTime(filter.frequency, now);
            if (filter.Q) filterNode.Q.setValueAtTime(filter.Q, now);
        }

        // Add distortion
        let distortionNode;
        if (distortion) {
            distortionNode = ctx.createWaveShaper();
            distortionNode.curve = this.createDistortionCurve(distortion);
        }

        // Add reverb/convolution
        let reverbNode;
        if (reverb) {
            reverbNode = ctx.createConvolver();
            reverbNode.buffer = this.createReverbBuffer(reverb.roomSize, reverb.dampening);
        }

        // Connect audio chain
        oscillators.forEach((osc, index) => {
            osc.connect(gainNodes[index]);
            
            let currentNode = gainNodes[index];
            
            if (filterNode) {
                currentNode.connect(filterNode);
                currentNode = filterNode;
            }
            
            if (distortionNode) {
                currentNode.connect(distortionNode);
                currentNode = distortionNode;
            }
            
            if (reverbNode) {
                const dryGain = ctx.createGain();
                const wetGain = ctx.createGain();
                
                dryGain.gain.setValueAtTime(0.7, now);
                wetGain.gain.setValueAtTime(0.3, now);
                
                currentNode.connect(dryGain);
                currentNode.connect(reverbNode);
                reverbNode.connect(wetGain);
                
                dryGain.connect(this.masterGain);
                wetGain.connect(this.masterGain);
            } else {
                currentNode.connect(this.masterGain);
            }
        });

        // Connect noise to the same chain if present
        audioChain.slice(gainNodes.length).forEach(node => {
            let currentNode = node;
            
            if (filterNode) {
                currentNode.connect(filterNode);
                currentNode = filterNode;
            }
            
            currentNode.connect(this.masterGain);
        });

        // Start and stop oscillators
        oscillators.forEach((osc, index) => {
            const startTime = sequence ? now + index * (delay || 0.1) : now;
            osc.start(startTime);
            osc.stop(startTime + duration);
        });

        // Add sparkle effect for achievement sounds
        if (sparkle) {
            setTimeout(() => {
                this.addSparkleEffect(volume * 0.3);
            }, duration * 500);
        }
    }

    /**
     * Creates noise buffer for sound synthesis
     * @param {string} type - Type of noise (white, pink, brown)
     * @param {number} duration - Duration in seconds
     * @returns {AudioBuffer}
     */
    createNoiseBuffer(type, duration) {
        const sampleRate = this.audioContext.sampleRate;
        const length = sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);

        switch (type) {
            case 'white':
                for (let i = 0; i < length; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
                break;
            case 'pink':
                let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
                for (let i = 0; i < length; i++) {
                    const white = Math.random() * 2 - 1;
                    b0 = 0.99886 * b0 + white * 0.0555179;
                    b1 = 0.99332 * b1 + white * 0.0750759;
                    b2 = 0.96900 * b2 + white * 0.1538520;
                    b3 = 0.86650 * b3 + white * 0.3104856;
                    b4 = 0.55000 * b4 + white * 0.5329522;
                    b5 = -0.7616 * b5 - white * 0.0168980;
                    data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                    data[i] *= 0.11;
                    b6 = white * 0.115926;
                }
                break;
        }

        return buffer;
    }

    /**
     * Creates distortion curve for wave shaper
     * @param {number} amount - Distortion amount (0-1)
     * @returns {Float32Array}
     */
    createDistortionCurve(amount) {
        const samples = 44100;
        const curve = new Float32Array(samples);
        const deg = Math.PI / 180;

        for (let i = 0; i < samples; i++) {
            const x = (i * 2) / samples - 1;
            curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
        }

        return curve;
    }

    /**
     * Creates reverb buffer for convolution
     * @param {number} roomSize - Room size (0-1)
     * @param {number} dampening - Dampening factor (0-1)
     * @returns {AudioBuffer}
     */
    createReverbBuffer(roomSize, dampening) {
        const sampleRate = this.audioContext.sampleRate;
        const length = sampleRate * roomSize * 3;
        const buffer = this.audioContext.createBuffer(2, length, sampleRate);

        for (let channel = 0; channel < 2; channel++) {
            const data = buffer.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                const n = length - i;
                data[i] = (Math.random() * 2 - 1) * Math.pow(n / length, dampening);
            }
        }

        return buffer;
    }

    /**
     * Adds sparkle effect for achievement sounds
     * @param {number} volume - Volume level
     */
    addSparkleEffect(volume) {
        const sparkleFreqs = [1319, 1760, 2093]; // E6, A6, C7
        sparkleFreqs.forEach((freq, index) => {
            setTimeout(() => {
                this.playSound('button_click', {
                    frequency: freq,
                    duration: 0.1,
                    volume: volume * (1 - index * 0.2),
                    envelope: { attack: 0.01, decay: 0.05, sustain: 0.1, release: 0.04 }
                });
            }, index * 50);
        });
    }

    /**
     * Plays startup sound sequence
     */
    playStartupSequence() {
        if (!this.settings.soundsEnabled) return;
        
        setTimeout(() => {
            this.playSound('startup');
        }, 500);
    }

    /**
     * Updates sound volume and saves to localStorage
     * @param {number} volume - Volume level (0-1)
     */
    setSoundVolume(volume) {
        this.settings.soundVolume = Math.max(0, Math.min(1, volume));
        localStorage.setItem('ggenius-soundVolume', String(this.settings.soundVolume));
        
        if (this.masterGain) {
            this.masterGain.gain.setValueAtTime(
                this.settings.soundVolume, 
                this.audioContext.currentTime
            );
        }
    }

    /**
     * Toggles sound effects on/off
     * @param {boolean} enabled - Whether sounds should be enabled
     */
    toggleSounds(enabled = !this.settings.soundsEnabled) {
        this.settings.soundsEnabled = enabled;
        localStorage.setItem('ggenius-soundsEnabled', JSON.stringify(enabled));
        
        if (enabled && !this.audioContext) {
            this.initializeAudioSystem();
        }
        
        console.log(`🔊 Sounds ${enabled ? 'enabled' : 'disabled'}`);
    }

    // Rest of the existing methods remain the same, but update sound calls...

    /**
     * Loads critical features and caches essential DOM elements.
     * Manages the loading screen simulation.
     * @async
     */
    async loadCriticalFeatures() {
        this.loadingScreen = document.getElementById('loadingScreen');
        this.progressBar = document.getElementById('progressBar');
        this.loadingTextElement = document.getElementById('loadingText'); 
        
        this.header = document.querySelector('.site-header');
        this.scrollProgress = document.getElementById('scrollProgress') || this.createScrollProgress();
        this.heroSection = document.querySelector('.hero-section'); 
        this.navMenu = document.querySelector('.nav-menu');
        this.mobileToggle = document.querySelector('.mobile-menu-toggle');
        
        if (this.loadingScreen && !this.performance.isLowPerformance) {
            await this.simulateLoading();
        } else if (this.loadingScreen) {
            this.hideLoadingScreen(true); 
        }
        
        if (!this.performance.isLowPerformance && window.matchMedia?.('(pointer: fine)').matches && window.innerWidth > 768) {
            this.setupGamingCursor();
        }
    }

    /**
     * Hides the loading screen and triggers entry animations.
     * @param {boolean} [immediate=false] - If true, hides without sound and triggers animations faster.
     */
    hideLoadingScreen(immediate = false) {
        if (!this.loadingScreen || this.loadingScreen.classList.contains('hidden')) return;
        
        this.loadingScreen.classList.add('hidden');
        this.loadingScreen.setAttribute('aria-hidden', 'true');
        
        if (!immediate) {
            this.playSound('modal_close'); // Updated sound call
        }
        
        setTimeout(() => {
            this.loadingScreen?.remove();
        }, immediate ? 50 : 500); 
    }

    /**
     * Toggles the mobile navigation menu.
     * @param {boolean} [forceOpen] - Optional. If true, opens the menu. If false, closes it.
     */
    toggleMobileMenu(forceOpen) {
        if (!this.mobileToggle || !this.navMenu) return;

        const shouldBeOpen = typeof forceOpen === 'boolean' ? forceOpen : this.mobileToggle.getAttribute('aria-expanded') !== 'true';
        
        this.mobileToggle.setAttribute('aria-expanded', String(shouldBeOpen));
        this.navMenu.classList.toggle('open', shouldBeOpen);
        document.body.classList.toggle('menu-open', shouldBeOpen); 
        
        // Updated sound calls
        this.playSound(shouldBeOpen ? 'menu_open' : 'menu_close');
        
        if (shouldBeOpen) {
            this.navMenu.querySelector('a[href], button')?.focus();
        } else {
            this.mobileToggle.focus();
        }
    }

    toggleAccordion(header, content) {
        const isOpen = header.getAttribute('aria-expanded') === 'true';
        if (isOpen) {
            this.closeAccordion(header, content);
        } else {
            this.openAccordion(header, content);
        }
        // Updated sound call
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
            if (panel.id === targetPanelId) {
                panel.classList.add('active');
                panel.setAttribute('aria-hidden', 'false');
            } else {
                panel.classList.remove('active');
                panel.setAttribute('aria-hidden', 'true');
            }
        });
        
        if (!isInitialSetup) {
            activeTab.focus(); 
            this.playSound('tab_switch'); // Updated sound call
        }
    }

    setupFeatureCardInteractions() {
        document.querySelectorAll('.feature-card-iui').forEach(card => { 
            this._addEventListener(card, 'mouseenter', () => this.playSound('card_hover'), `cardEnter-${card.id || Math.random()}`);
            this._addEventListener(card, 'click', (e) => {
                this.playSound('button_click'); // Updated sound call
                this.createRippleEffect(e.currentTarget, e);
            }, `cardClick-${card.id || Math.random()}`);
        });
    }

    showModal(modal) {
        if (!modal || !modal.id) {
            console.error("Invalid modal element passed to showModal.");
            return;
        }
        this.closeModal(); 

        document.body.appendChild(modal);
        document.body.classList.add('modal-open');
        
        const focusableElements = Array.from(modal.querySelectorAll(
            'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ));
        this.currentModalFocusableElements = focusableElements; 
        this.firstFocusableElement = focusableElements[0];
        this.lastFocusableElement = focusableElements[focusableElements.length - 1];

        if (this.firstFocusableElement) {
            this.firstFocusableElement.focus();
        } else {
            modal.querySelector('.modal-container')?.setAttribute('tabindex', '-1'); 
            modal.querySelector('.modal-container')?.focus();
        }
        
        requestAnimationFrame(() => modal.classList.add('show')); 
        this.playSound('modal_open'); // Updated sound call
    }

    closeModal(modalIdToClose) {
        const modal = modalIdToClose ? document.getElementById(modalIdToClose) : document.querySelector('.modal-overlay.show');
        if (!modal) return;
        
        modal.classList.remove('show');
        modal.classList.add('closing'); 
        document.body.classList.remove('modal-open');
        
        this.playSound('modal_close'); // Updated sound call
        
        if (this.lastFocusedElementBeforeModal && typeof this.lastFocusedElementBeforeModal.focus === 'function') {
            this.lastFocusedElementBeforeModal.focus();
            this.lastFocusedElementBeforeModal = null;
        }

        const transitionEndHandler = () => {
            modal.remove();
            this._removeEventListener(`modalCloseBtn-${modal.id}`);
            this._removeEventListener(`modalOverlayClick-${modal.id}`);
            modal.querySelectorAll('.modal-actions [data-action-index]').forEach((btn, index) => {
                this._removeEventListener(`modalAction-${modal.id}-${index}`);
            });
        };
        
        modal.addEventListener('transitionend', transitionEndHandler, { once: true });
        setTimeout(() => { if (modal.parentNode) transitionEndHandler(); }, 500); 
        
        this.currentModalFocusableElements = [];
    }

    async setupNewsletterForm(form) {
        this._addEventListener(form, 'submit', async (e) => {
            e.preventDefault();
            const submitButton = form.querySelector('button[type="submit"]');
            const emailInput = form.querySelector('input[type="email"]');
            let emailError = form.querySelector('.error-message#email-error');
            
            if (!emailError && emailInput) { 
                emailError = document.createElement('div');
                emailError.id = 'email-error';
                emailError.className = 'error-message';
                emailError.setAttribute('role', 'alert');
                emailError.setAttribute('aria-live', 'assertive'); 
                emailInput.parentNode?.insertBefore(emailError, emailInput.nextSibling);
            }

            const email = emailInput?.value.trim();
            if (!this.validateEmail(email)) {
                this.showError('Будь ласка, введіть коректну email адресу.', emailError, emailInput);
                emailInput?.focus();
                return;
            }
            if(emailError) this.clearError(emailError, emailInput);

            const originalButtonText = submitButton.querySelector('.button-text')?.textContent || 'Приєднатися';
            const loadingText = submitButton.dataset.loading || 'Підписуємо...';
            const successText = submitButton.dataset.success || 'Підписано! ✅';
            
            submitButton.disabled = true;
            if(submitButton.querySelector('.button-text')) submitButton.querySelector('.button-text').textContent = loadingText;
            submitButton.classList.add('loading');
            
            try {
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                await this.submitNewsletterSignup(data); 
                if(submitButton.querySelector('.button-text')) submitButton.querySelector('.button-text').textContent = successText;
                form.reset();
                this.showToast('Дякуємо! Ви успішно підписалися на розсилку.', 'success');
                this.playSound('form_success'); // Updated sound call
            } catch (error) {
                console.error('Newsletter signup failed:', error);
                this.showError(error.message || 'Помилка підписки. Спробуйте ще раз.', emailError);
                this.playSound('form_error'); // Updated sound call
            } finally {
                setTimeout(() => {
                    submitButton.disabled = false;
                    if(submitButton.querySelector('.button-text')) submitButton.querySelector('.button-text').textContent = originalButtonText;
                    submitButton.classList.remove('loading');
                }, 2500); 
            }
        }, 'newsletterSubmit');
    }

    showToast(message, type = 'info', duration = 3500) { 
        const toastContainer = this.getOrCreateToastContainer();
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', type === 'error' || type === 'warning' ? 'assertive' : 'polite');
        
        const iconHTML = `<span class="toast-icon" aria-hidden="true">${this.getToastIcon(type)}</span>`;
        toast.innerHTML = `
            <div class="toast-content">
                ${iconHTML}
                <span class="toast-message">${message}</span>
            </div>
            <button class="toast-close" type="button" aria-label="Закрити повідомлення">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;
        
        const closeButton = toast.querySelector('.toast-close');
        const removeHandler = () => this.removeToast(toast); 
        this._addEventListener(closeButton, 'click', removeHandler, `toastClose-${toast.id || Math.random()}`);
        
        toastContainer.prepend(toast);
        requestAnimationFrame(() => toast.classList.add('show'));
        
        // Play notification sound
        this.playSound('notification');
        
        if (duration > 0) {
            const timeoutId = setTimeout(removeHandler, duration);
            this.animations.set(`toast-${toast.id || Math.random()}`, timeoutId); 
        }
        return toast;
    }

    async copyToClipboard(text, contentType = 'Текст') {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else { 
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed'; textArea.style.opacity = '0'; textArea.style.pointerEvents = 'none';
                document.body.appendChild(textArea);
                textArea.focus(); textArea.select();
                const successful = document.execCommand('copy');
                textArea.remove();
                if (!successful) throw new Error('Fallback copy command failed.');
            }
            this.showToast(`${contentType} скопійовано!`, 'success');
            this.playSound('button_click'); // Updated sound call
        } catch (error) {
            console.error('Failed to copy text:', error);
            this.showToast(`Не вдалося скопіювати ${contentType.toLowerCase()}.`, 'error');
            this.playSound('form_error'); // Updated sound call
        }
    }

    // Keep all existing methods but update their sound calls to use the new system...
    // (Continue with other existing methods, updating sound calls as needed)

    detectLowPerformance() {
        try {
            const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) {
                console.info("User prefers reduced motion. Activating low performance mode.");
                return true;
            }

            const cpuCores = navigator.hardwareConcurrency;
            const deviceMemory = navigator.deviceMemory;

            const lowSpecCPU = typeof cpuCores === 'number' && cpuCores < 4; 
            const lowSpecMemory = typeof deviceMemory === 'number' && deviceMemory < 4; 

            const connection = navigator.connection;
            const slowConnection = connection?.effectiveType?.includes('2g') || 
                                   (typeof connection?.downlink === 'number' && connection.downlink < 1.5); 

            const isLikelyMobile = window.innerWidth < 768 && window.matchMedia?.('(pointer: coarse)').matches;
            
            let isLowPerf = lowSpecCPU || lowSpecMemory || slowConnection;
            
            if (isLikelyMobile && (lowSpecCPU || lowSpecMemory)) {
                isLowPerf = true; 
            }
            
            console.info(`Performance detection: CPU Cores: ${cpuCores ?? 'N/A'}, Device Memory: ${deviceMemory ?? 'N/A'}GB, Slow Connection: ${slowConnection ?? 'N/A'}, Reduced Motion: ${prefersReducedMotion ?? 'N/A'}, Low Performance: ${isLowPerf}`);
            return isLowPerf;
        } catch (e) {
            console.warn("Error in detectLowPerformance:", e);
            return false; 
        }
    }
    
    setupGlobalEventListeners() {
        this._addEventListener(window, 'resize', this.handleResize);
        this._addEventListener(document, 'visibilitychange', this.handleVisibilityChange);
    }

    async setupPerformanceMonitoring() {
        if (this.performance.isLowPerformance && !window.location.search.includes('forcePerfMonitoring')) {
            console.info("🦥 Low performance mode: Skipping detailed performance monitoring.");
            return;
        }

        if ('PerformanceObserver' in window) {
            this.setupWebVitalsTracking();
        }
        
        if (performance.memory) {
            this.setupMemoryMonitoring();
        }
        
        if (window.location.hostname === 'localhost' || window.location.search.includes('debugFPS')) {
            this.setupFrameRateMonitoring(30000); 
        }
    }

    setupWebVitalsTracking() {
        const vitalConfigs = {
            'FCP': { entryTypes: ['paint'], name: 'first-contentful-paint' },
            'LCP': { entryTypes: ['largest-contentful-paint'] },
            'FID': { entryTypes: ['first-input'] },
            'CLS': { entryTypes: ['layout-shift'] },
        };

        const supportedEntryTypes = PerformanceObserver.supportedEntryTypes || [];

        try {
            const observerCallback = (list) => {
                for (const entry of list.getEntries()) {
                    let vitalNameFound = null;
                    for (const vitalName in vitalConfigs) {
                        const config = vitalConfigs[vitalName];
                        if (config.entryTypes.includes(entry.entryType) || (config.name && entry.name === config.name)) {
                            vitalNameFound = vitalName;
                            break;
                        }
                    }

                    if (vitalNameFound) {
                        const value = entry.value !== undefined ? entry.value : (entry.startTime || entry.duration);
                        if (vitalNameFound === 'LCP' || vitalNameFound === 'CLS' || this.performance.metrics[vitalNameFound] === undefined) {
                             this.performance.metrics[vitalNameFound] = value;
                             console.log(`📊 ${vitalNameFound}:`, value.toFixed(2));
                        }
                    }
                }
            };
            
            const observer = new PerformanceObserver(observerCallback);
            const typesToObserve = new Set();

            for (const vitalName in vitalConfigs) {
                vitalConfigs[vitalName].entryTypes.forEach(type => {
                    if (supportedEntryTypes.includes(type)) {
                        typesToObserve.add(type);
                    }
                });
            }
            
            if (typesToObserve.size > 0) {
                observer.observe({ entryTypes: Array.from(typesToObserve), buffered: true });
                this.observers.set('perf-vitals', observer);
            } else {
                console.warn("No supported entry types for Web Vitals observation.");
            }

        } catch (error) {
            console.warn('Failed to setup Web Vitals tracking:', error);
        }
    }
    
    setupMemoryMonitoring() {
        const intervalId = setInterval(() => {
            if (!performance.memory) { 
                clearInterval(intervalId);
                return;
            }
            const memory = performance.memory;
            this.performance.metrics.memory = {
                used: Math.round(memory.usedJSHeapSize / 1048576), 
                total: Math.round(memory.totalJSHeapSize / 1048576),
                limit: Math.round(memory.jsHeapSizeLimit / 1048576)
            };
            
            if ((memory.usedJSHeapSize / memory.jsHeapSizeLimit) > 0.85) { 
                console.warn('🚨 High memory usage detected:', this.performance.metrics.memory);
                this.optimizeMemory(); 
            }
        }, 60000); 
        this.memoryMonitorInterval = intervalId; 
    }

    setupFrameRateMonitoring(durationMs = 0) {
        let frameCount = 0;
        let lastTime = performance.now();
        let rafId;
        const startTime = performance.now();

        const countFrames = (currentTime) => {
            frameCount++;
            
            if (currentTime - lastTime >= 1000) { 
                this.performance.metrics.fps = frameCount;
                frameCount = 0;
                lastTime = currentTime;
                
                if (!this.performance.isLowPerformance && this.performance.metrics.fps < 25 && this.isLoaded) { 
                    console.warn(`📉 Low FPS detected: ${this.performance.metrics.fps}. Considering dynamic performance adjustments.`);
                }
            }
            
            if (durationMs > 0 && (currentTime - startTime > durationMs)) {
                console.info(`🏁 FPS Monitoring finished after ${durationMs / 1000}s. Last FPS: ${this.performance.metrics.fps || 'N/A'}`);
                cancelAnimationFrame(rafId);
                this.animations.delete('fpsMonitor');
                return;
            }
            rafId = requestAnimationFrame(countFrames);
            this.animations.set('fpsMonitor', rafId);
        };
        
        rafId = requestAnimationFrame(countFrames);
        this.animations.set('fpsMonitor', rafId);
    }

    optimizeMemory() {
        console.log('🧠 Attempting memory optimization...');
        this.observers.forEach((observer, key) => {
            if (typeof key === 'string' && !key.startsWith('perf-') && key !== 'intersection' && key !== 'logoAnimationObserver') {
                try {
                    if (document.querySelector(key) === null) {
                        observer.disconnect();
                        this.observers.delete(key);
                        console.log(`🧹 Removed unused observer for selector: ${key}`);
                    }
                } catch (e) { /* Ignore if key is not a valid selector */ }
            }
        });
        
        if (window.gc) {
            try {
                console.log('Suggesting garbage collection (dev environments)...');
                window.gc();
            } catch (e) { console.warn("window.gc() failed.", e); }
        }
    }

    enablePerformanceMode() {
        if (document.documentElement.classList.contains('performance-mode-active')) return;
        
        document.documentElement.classList.add('performance-mode-active', 'low-performance-device');
        console.warn('🎛️ Aggressive performance mode dynamically enabled.');
        
        if (this.animations.has('gamingCursor')) {
            cancelAnimationFrame(this.animations.get('gamingCursor'));
            this.animations.delete('gamingCursor');
            document.querySelector('.gaming-cursor')?.remove();
            console.info("Disabled gaming cursor for performance.");
        }
        this.stopAmbientMusic();
        document.querySelector('.music-toggle')?.remove();

        document.dispatchEvent(new CustomEvent('ggenius:performancemodeenabled'));
    }

    async initializeUI() {
        await Promise.all([
            this.setupNavigation(),
            this.setupScrollEffects(),
            this.setupAccordions(),
            this.setupTabs(),
            this.setupModals(),
            this.setupForms()
        ]);
    }

    setupNavigation() {
        if (!this.mobileToggle || !this.navMenu) {
            console.warn("Mobile toggle or nav menu not found. Skipping mobile navigation setup.");
        } else {
            this._addEventListener(this.mobileToggle, 'click', (e) => {
                e.preventDefault();
                this.toggleMobileMenu();
            }, 'mobileToggleClick');
        }
        this.setupHeaderScroll(); 
    }
    
    setupHeaderScroll() {
        if (!this.header) return;
        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateHeader = () => {
            const currentScrollY = window.scrollY;
            const isScrolledDown = currentScrollY > lastScrollY && currentScrollY > this.header.offsetHeight;
            
            if (currentScrollY > 50) { 
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }

            if (isScrolledDown) {
                this.header.classList.add('header-hidden'); 
            } else if (currentScrollY < lastScrollY || currentScrollY <= 50) { 
                this.header.classList.remove('header-hidden');
            }
            
            lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(updateHeader);
                ticking = true;
            }
        };
        this._addEventListener(window, 'scroll', onScroll, 'headerScrollHandler');
        updateHeader(); 
    }

    setupScrollEffects() {
        if (this.scrollProgress) {
            this._addEventListener(window, 'scroll', this.handleScroll, 'scrollProgressUpdater');
            this._handleScroll(); 
        }
        
        this.setupParallax(); 
        this.setupIntersectionObserver(); 
    }

    _handleScroll() { 
        if (!this.scrollProgress) return;
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollableHeight <= 0) {
            this.scrollProgress.style.transform = 'scaleX(0)';
            this.scrollProgress.setAttribute('aria-valuenow', '0');
            return;
        }
        const scrollPercentage = (window.scrollY / scrollableHeight);
        const boundedPercentage = Math.max(0, Math.min(scrollPercentage, 1)); 

        this.scrollProgress.style.transform = `scaleX(${boundedPercentage})`;
        this.scrollProgress.setAttribute('aria-valuenow', String(Math.round(boundedPercentage * 100)));
    }

    setupParallax() {
        if (!this.heroSection) {
            return;
        }
        const parallaxContainer = this.heroSection.querySelector('.hero-floating-elements');
        if (!parallaxContainer || this.performance.isLowPerformance) {
            return;
        }
        
        const parallaxElements = Array.from(parallaxContainer.querySelectorAll('.floating-gaming-icon'));
        if (parallaxElements.length === 0) return;

        let ticking = false;
        const updateParallax = () => {
            const heroRect = this.heroSection.getBoundingClientRect();
            if (heroRect.bottom < 0 || heroRect.top > window.innerHeight) { 
                ticking = false;
                return;
            }

            const scrollY = window.scrollY;
            parallaxElements.forEach((element) => {
                const speedAttr = element.dataset.parallaxSpeed;
                let speed = parseFloat(speedAttr);
                if (isNaN(speed) || speed <=0 || speed > 1) speed = 0.2 + Math.random() * 0.2; 

                const yPos = -(scrollY * speed * 0.3); 
                element.style.transform = `translate3d(0, ${yPos.toFixed(2)}px, 0)`;
            });
            ticking = false;
        };
        
        const onScrollParallax = () => {
            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };
        this._addEventListener(window, 'scroll', onScrollParallax, 'parallaxScrollHandler');
        updateParallax(); 
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1, 
            rootMargin: '0px 0px -10% 0px' 
        };

        const observerCallback = (entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target); 
                    
                    if (entry.target.id && entry.intersectionRatio > 0.4) { 
                        this.updateActiveNavigation(entry.target.id);
                    }
                    if (entry.target.dataset.animateOnce === 'true' || entry.target.classList.contains('animate-once')) {
                       obs.unobserve(entry.target);
                       this.observers.delete(`io-${entry.target.id || Math.random().toString(36).substr(2, 9)}`); 
                    }
                } else {
                     if (entry.target.dataset.animateOnce !== 'true' && !entry.target.classList.contains('animate-once') && !this.performance.isLowPerformance) {
                        entry.target.classList.remove('animate-in', entry.target.dataset.animation || 'fadeInUp', 'animated');
                     }
                }
            });
        };
        
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        const elementsToObserve = document.querySelectorAll(`
            .features-section-iui, .roadmap-section, .accordion-section,
            .feature-card-iui, .timeline-item,
            [data-aos]
        `);
        
        if (elementsToObserve.length > 0) {
            elementsToObserve.forEach((el, index) => {
                observer.observe(el);
                this.observers.set(`io-${el.id || `el-${index}`}`, observer); 
            });
        }
    }

    animateElement(element) {
        if (element.classList.contains('animated') && (element.dataset.animateOnce === 'true' || element.classList.contains('animate-once'))) {
            return; 
        }

        if (this.performance.isLowPerformance) {
            element.style.opacity = '1';
            element.style.transform = 'none';
            element.classList.add('animated');
            
            if (element.classList.contains('stat-number') && element.dataset.target) {
                element.textContent = element.dataset.target; 
            }
            return;
        }

        const animationType = element.dataset.animation || 'fadeInUp';
        const delay = parseInt(element.dataset.delay) || 0;
        
        const existingTimeoutId = this.animations.get(element);
        if (existingTimeoutId) clearTimeout(existingTimeoutId);

        const timeoutId = setTimeout(() => {
            element.classList.add('animate-in', animationType, 'animated');
            this.animations.delete(element); 
            
            if (element.classList.contains('stat-number') && element.dataset.target) {
                this.animateCounter(element);
            }
        }, delay);
        this.animations.set(element, timeoutId); 
    }

    animateCounter(element) {
        if (this.performance.isLowPerformance) {
            element.textContent = element.dataset.target || 'N/A';
            return;
        }

        const target = parseInt(element.dataset.target);
        if (isNaN(target)) {
            console.warn("Invalid data-target for counter:", element.dataset.target, element);
            element.textContent = element.dataset.target || 'N/A'; 
            return;
        }
        const duration = parseInt(element.dataset.duration) || 1500; 
        const startTimestamp = performance.now();
        
        let initialValue = 0;
        const currentText = element.textContent.replace(/[^\d.-]/g, ''); 
        if (currentText !== '') {
            initialValue = parseFloat(currentText);
            if (isNaN(initialValue)) initialValue = 0;
        }

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTimestamp;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            let currentValue = initialValue + (target - initialValue) * easedProgress;
            
            if (Number.isInteger(target) && Number.isInteger(initialValue)) {
                currentValue = Math.round(currentValue);
                element.textContent = String(currentValue);
            } else {
                const targetPrecision = (String(target).split('.')[1] || '').length;
                const initialPrecision = (String(initialValue).split('.')[1] || '').length;
                const precision = Math.max(targetPrecision, initialPrecision, 1); 
                element.textContent = currentValue.toFixed(precision);
            }
            
            if (progress < 1) {
                const rafId = requestAnimationFrame(updateCounter);
                this.animations.set(`counter-${element.id || Math.random()}`, rafId); 
            } else {
                element.textContent = String(target); 
                this.animations.delete(`counter-${element.id || Math.random()}`);
            }
        };
        requestAnimationFrame(updateCounter);
    }

    updateActiveNavigation(sectionId) {
        if (!sectionId) return;
        document.querySelectorAll('.nav-menu .nav-link').forEach(link => {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
            const href = link.getAttribute('href');
            if (href && href === `#${sectionId}`) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
    }

    setupAccordions() {
        document.querySelectorAll('.accordion-section').forEach((accordion, index) => {
            const header = accordion.querySelector('.accordion-header');
            const content = accordion.querySelector('.accordion-content');
            
            if (!header || !content) {
                console.warn("Accordion missing header or content:", accordion);
                return;
            }
            
            const contentId = content.id || `accordion-content-${index}`;
            const headerId = header.id || `accordion-header-${index}`;

            header.id = headerId;
            content.id = contentId;

            header.setAttribute('role', 'button');
            header.setAttribute('aria-controls', contentId);
            header.tabIndex = 0; 

            content.setAttribute('role', 'region');
            content.setAttribute('aria-labelledby', headerId);
            
            const isOpenByDefault = accordion.dataset.openByDefault === 'true' || 
                                  (index === 0 && accordion.dataset.openByDefault !== 'false'); 
            
            if (isOpenByDefault) {
                this.openAccordion(header, content, true); 
            } else {
                this.closeAccordion(header, content, true); 
            }
            
            const toggleHandler = () => this.toggleAccordion(header, content);
            this._addEventListener(header, 'click', toggleHandler, `accordionClick-${headerId}`);
            this._addEventListener(header, 'keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleHandler();
                }
            }, `accordionKeydown-${headerId}`);
        });
    }

    openAccordion(header, content, initialSetup = false) {
        header.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
        content.classList.add('active');
        content.setAttribute('aria-hidden', 'false');
        
        requestAnimationFrame(() => { 
            const innerContent = content.firstElementChild; 
            const contentHeight = (innerContent || content).scrollHeight;
            if (initialSetup || this.performance.isLowPerformance) {
                content.style.maxHeight = `${contentHeight}px`;
                content.style.transition = 'none'; 
                requestAnimationFrame(() => content.style.transition = ''); 
            } else {
                content.style.maxHeight = `${contentHeight}px`;
            }
        });
    }

    closeAccordion(header, content, initialSetup = false) {
        header.classList.remove('active');
        header.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = '0px';
        
        const onTransitionEnd = () => {
            content.classList.remove('active');
            content.setAttribute('aria-hidden', 'true');
            content.removeEventListener('transitionend', onTransitionEnd);
        };

        if (initialSetup || this.performance.isLowPerformance) {
            content.style.transition = 'none';
            onTransitionEnd(); 
            requestAnimationFrame(() => content.style.transition = '');
        } else {
            content.addEventListener('transitionend', onTransitionEnd, { once: true });
            setTimeout(onTransitionEnd, 500); 
        }
    }

    setupTabs() {
        document.querySelectorAll('.tabs-component').forEach(tabsComponent => { 
            const tabList = tabsComponent.querySelector('[role="tablist"].feature-categories');
            const panelsContainer = tabsComponent.querySelector('.tab-panels-container'); 
            
            if (!tabList || !panelsContainer) {
                console.warn("Tabs component is missing tablist or panels container.", tabsComponent);
                return;
            }

            const tabs = Array.from(tabList.querySelectorAll('[role="tab"]'));
            const tabPanels = Array.from(panelsContainer.querySelectorAll('[role