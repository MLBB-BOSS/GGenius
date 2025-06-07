/**
 * GGenius Enhanced Interactive Experience
 * Performance-optimized ES2023+ JavaScript for cyberpunk AI platform
 * @version 2.2.3 // Iteration with focused improvements
 * @author MLBB-BOSS
 * @see GGeniusApp
 */

/**
 * @class GGeniusApp
 * @description Main class for initializing and managing the GGenius web application's interactive features.
 * Enhanced with advanced audio system, cyberpunk sound effects, and completed UI/utility functions.
 */
class GGeniusApp {
    /**
     * Initializes the GGeniusApp instance.
     * Sets up properties, binds methods, and starts the initialization process.
     */
    constructor() {
        this.isLoaded = false;
        this.observers = new Map();
        this.animations = new Map(); // Stores requestAnimationFrame IDs or Timeout IDs
        this.eventListeners = new Map(); // To keep track of listeners for easier removal

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

    /**
     * @returns {string} The current version of the script.
     */
    getVersion() {
        return "2.2.3"; 
    }

    /**
     * Detects if the device/browser indicates low performance capabilities or user preference for reduced motion.
     * @returns {boolean} True if low performance mode should be activated.
     */
    detectLowPerformance() {
        const lowRAM = typeof navigator.deviceMemory !== 'undefined' && navigator.deviceMemory < 1; // Less than 1GB RAM
        const lowCores = typeof navigator.hardwareConcurrency !== 'undefined' && navigator.hardwareConcurrency < 2; // Less than 2 CPU cores
        const saveDataEnabled = navigator.connection && navigator.connection.saveData === true;
        const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

        if (lowRAM || lowCores || saveDataEnabled || prefersReducedMotion) {
            console.info('Low performance or reduced motion preference detected.', {lowRAM, lowCores, saveDataEnabled, prefersReducedMotion});
            return true;
        }
        return false;
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
        if (this.performance.isLowPerformance) {
            console.info("🔇 Audio system disabled (performance mode).");
            this.settings.soundsEnabled = false;
            this.settings.musicEnabled = false;
            return;
        }

        try {
            if (!this.audioContext || this.audioContext.state === 'closed') {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
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
            
            console.log('🎵 Advanced audio system initialized');
        } catch (error) {
            console.error('🔇 Failed to initialize audio system:', error);
            this.settings.soundsEnabled = false;
            this.settings.musicEnabled = false;
        }
    }
    
    /**
     * Loads and creates various sound effects using Web Audio API
     * @async
     */
    async loadSoundEffects() {
        const soundConfigs = {
            'button_hover': { type: 'cyberpunk_chirp', frequency: 800, duration: 0.08, volume: 0.15, modulation: { rate: 15, depth: 0.3 } },
            'button_click': { type: 'cyber_beep', frequency: 1200, duration: 0.12, volume: 0.25, envelope: { attack: 0.01, decay: 0.08, sustain: 0.3, release: 0.05 } },
            'nav_select': { type: 'digital_blip', frequency: 600, duration: 0.15, volume: 0.2, filter: { type: 'highpass', frequency: 400 } },
            'tab_switch': { type: 'matrix_sweep', frequency: [400, 800], duration: 0.18, volume: 0.2, sweep: true },
            'accordion_open': { type: 'expand_whoosh', frequency: [200, 600], duration: 0.25, volume: 0.18, noise: { type: 'white', mix: 0.1 } },
            'accordion_close': { type: 'contract_swoosh', frequency: [600, 200], duration: 0.2, volume: 0.15, reverse: true },
            'modal_open': { type: 'portal_open', frequency: [300, 900], duration: 0.35, volume: 0.3, reverb: { roomSize: 0.8, dampening: 0.2, mix: 0.3 } },
            'modal_close': { type: 'portal_close', frequency: [900, 300], duration: 0.25, volume: 0.2, reverse: true },
            'form_success': { type: 'success_chime', frequency: [523, 659, 784], duration: 0.4, volume: 0.3, harmony: true, sparkle: true },
            'form_error': { type: 'error_buzz', frequency: 150, duration: 0.3, volume: 0.25, distortion: 0.4, tremolo: { rate: 8, depth: 0.6 } },
            'notification': { type: 'cyber_notification', frequency: [1000, 1200, 800], duration: 0.5, volume: 0.25, sequence: true },
            'startup': { type: 'system_boot', frequency: [100, 200, 400, 800], duration: 1.2, volume: 0.2, sequence: true, delay: 0.15 },
            'menu_open': { type: 'slide_in', frequency: [400, 600], duration: 0.3, volume: 0.18, slide: true },
            'menu_close': { type: 'slide_out', frequency: [600, 400], duration: 0.25, volume: 0.15, slide: true, reverse: true },
            'card_hover': { type: 'soft_ping', frequency: 400, duration: 0.06, volume: 0.1, soft: true },
            'scroll_milestone': { type: 'achievement_ding', frequency: [659, 831], duration: 0.2, volume: 0.15, sparkle: true, delay: 0.05 },
            'loading_tick': { type: 'digital_blip', frequency: 700, duration: 0.05, volume: 0.1 },
            'loading_complete': { type: 'portal_close', frequency: [900,300], duration: 0.25, volume: 0.2, reverse: true }
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
                    document.removeEventListener('touchstart', unlockAudio);
                    document.removeEventListener('touchend', unlockAudio);
                    document.removeEventListener('click', unlockAudio);
                } catch (error) {
                    console.warn('Failed to unlock audio context:', error);
                }
            }
        };
        document.addEventListener('touchstart', unlockAudio, { once: true, passive: true });
        document.addEventListener('touchend', unlockAudio, { once: true, passive: true });
        document.addEventListener('click', unlockAudio, { once: true, passive: true });
    }

    /**
     * Advanced sound synthesis with cyberpunk effects
     * @param {string} soundName - Name of the sound effect to play
     * @param {Object} [overrides={}] - Optional parameter overrides
     */
    playSound(soundName, overrides = {}) {
        if (!this.settings.soundsEnabled || !this.audioContext || !this.masterGain || this.performance.isLowPerformance || this.audioContext.state === 'closed') {
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
            console.error(`Error playing sound "${soundName}":`, error);
        }
    }

    /**
     * Synthesizes complex sound effects using Web Audio API
     * @param {Object} config - Sound configuration
     */
    synthesizeSound(config) {
        const ctx = this.audioContext;
        if (!ctx || ctx.state === 'closed') return;
        const now = ctx.currentTime;
        
        const {
            type = 'sine', frequency = 440, duration = 0.1, volume = 0.1,
            envelope = { attack: 0.01, decay: 0.05, sustain: 0.5, release: 0.05 },
            modulation, filter, sweep, noise, reverb, harmony, distortion, tremolo,
            sequence, delay, slide, reverse, soft, sparkle
        } = config;

        const frequencies = Array.isArray(frequency) ? frequency : [frequency];
        
        frequencies.forEach((freq, index) => {
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            let waveform = 'sine'; 
            if (type.includes('cyber') || type.includes('digital') || type.includes('beep') || type.includes('blip')) waveform = 'square';
            else if (type.includes('buzz') || type.includes('error') || type.includes('sweep')) waveform = 'sawtooth';
            else if (type.includes('chirp') || type.includes('whoosh') || type.includes('swoosh') || type.includes('ping')) waveform = 'triangle';
            osc.type = waveform;

            const currentStartTime = now + (delay || 0) * (sequence ? index : 0);

            if (sweep || slide) {
                const startFreq = reverse ? frequencies[frequencies.length - 1 - index] : frequencies[index];
                const endFreq = reverse ? frequencies[index] : frequencies[frequencies.length - 1 - index];
                osc.frequency.setValueAtTime(startFreq, currentStartTime);
                osc.frequency.exponentialRampToValueAtTime(endFreq, currentStartTime + duration * 0.8);
            } else if (sequence && frequencies.length > 1) {
                const segmentDuration = duration / frequencies.length;
                osc.frequency.setValueAtTime(freq, currentStartTime + index * segmentDuration);
            } else {
                osc.frequency.setValueAtTime(freq, currentStartTime);
            }

            if (modulation) {
                const lfo = ctx.createOscillator();
                const modGain = ctx.createGain();
                lfo.frequency.setValueAtTime(modulation.rate, currentStartTime);
                modGain.gain.setValueAtTime(modulation.depth * freq, currentStartTime);
                lfo.connect(modGain);
                modGain.connect(osc.frequency);
                lfo.start(currentStartTime);
                lfo.stop(currentStartTime + duration);
            }
            
            const att = envelope.attack;
            const dec = envelope.decay;
            const susVol = volume * envelope.sustain;
            const rel = envelope.release;

            gainNode.gain.setValueAtTime(0, currentStartTime);
            gainNode.gain.linearRampToValueAtTime(volume * (soft ? 0.5 : 1), currentStartTime + att);
            gainNode.gain.linearRampToValueAtTime(susVol, currentStartTime + att + dec);
            gainNode.gain.setValueAtTime(susVol, currentStartTime + duration - rel);
            gainNode.gain.linearRampToValueAtTime(0, currentStartTime + duration);

            if (tremolo) {
                const tremoloLFO = ctx.createOscillator();
                const tremoloGain = ctx.createGain();
                tremoloLFO.frequency.setValueAtTime(tremolo.rate, currentStartTime);
                tremoloGain.gain.setValueAtTime(tremolo.depth, currentStartTime);
                tremoloLFO.connect(tremoloGain);
                tremoloGain.connect(gainNode.gain); 
                tremoloLFO.start(currentStartTime);
                tremoloLFO.stop(currentStartTime + duration);
            }

            let currentNode = gainNode;

            if (noise) {
                const noiseBuffer = this.createNoiseBuffer(noise.type, duration);
                if (noiseBuffer) {
                    const noiseSource = ctx.createBufferSource();
                    const noiseGain = ctx.createGain();
                    noiseSource.buffer = noiseBuffer;
                    noiseGain.gain.setValueAtTime((noise.mix || 0.1) * volume, currentStartTime);
                    noiseSource.connect(noiseGain);
                    noiseGain.connect(currentNode); 
                    noiseSource.start(currentStartTime);
                }
            }
            
            if (filter) {
                const filterNode = ctx.createBiquadFilter();
                filterNode.type = filter.type;
                filterNode.frequency.setValueAtTime(filter.frequency, currentStartTime);
                if (filter.Q) filterNode.Q.setValueAtTime(filter.Q, currentStartTime);
                osc.connect(currentNode); 
                currentNode.connect(filterNode); 
                currentNode = filterNode; 
            } else {
                 osc.connect(currentNode); 
            }
            
            if (distortion) {
                const distortionNode = ctx.createWaveShaper();
                distortionNode.curve = this.createDistortionCurve(distortion);
                currentNode.connect(distortionNode);
                currentNode = distortionNode;
            }
            
            if (reverb) {
                const reverbBuffer = this.createReverbBuffer(reverb.roomSize, reverb.dampening);
                if (reverbBuffer) {
                    const reverbNode = ctx.createConvolver();
                    reverbNode.buffer = reverbBuffer;
                    const dryGain = ctx.createGain();
                    const wetGain = ctx.createGain();
                    dryGain.gain.setValueAtTime(1 - (reverb.mix || 0.3), currentStartTime);
                    wetGain.gain.setValueAtTime(reverb.mix || 0.3, currentStartTime);
                    
                    currentNode.connect(dryGain);
                    dryGain.connect(this.masterGain);
                    
                    currentNode.connect(reverbNode);
                    reverbNode.connect(wetGain);
                    wetGain.connect(this.masterGain);
                } else { 
                    currentNode.connect(this.masterGain);
                }
            } else {
                currentNode.connect(this.masterGain);
            }

            osc.start(currentStartTime);
            osc.stop(currentStartTime + duration);
        });

        if (harmony && frequencies.length === 1) { 
            const intervals = [frequencies[0] * (5/4), frequencies[0] * (3/2)]; 
            intervals.forEach(harmonicFreq => {
                this.synthesizeSound({ ...config, frequency: harmonicFreq, volume: volume * 0.4, harmony: false, sparkle: false, reverb: { ...config.reverb, mix: (config.reverb?.mix || 0.3) * 0.5 } });
            });
        }

        if (sparkle) {
            const sparkleDelay = (delay || 0) * (sequence ? frequencies.length : 0) * 1000;
            setTimeout(() => this.addSparkleEffect(volume * 0.3), duration * 500 + sparkleDelay);
        }
    }

    /**
     * Creates noise buffer for sound synthesis
     * @param {string} [type='white'] - Type of noise (white, pink, brown)
     * @param {number} [duration=1] - Duration in seconds
     * @returns {AudioBuffer | null}
     */
    createNoiseBuffer(type = 'white', duration = 1) {
        if (!this.audioContext || this.audioContext.state === 'closed') return null;
        const sampleRate = this.audioContext.sampleRate;
        const length = sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);

        switch (type.toLowerCase()) {
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
            case 'brown': 
                let lastOut = 0.0;
                for (let i = 0; i < length; i++) {
                    const white = Math.random() * 2 - 1;
                    data[i] = (lastOut + (0.02 * white)) / 1.02;
                    lastOut = data[i];
                    data[i] *= 3.5; 
                }
                break;
            case 'white':
            default:
                for (let i = 0; i < length; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
                break;
        }
        return buffer;
    }

    /**
     * Creates distortion curve for wave shaper
     * @param {number} [amount=0.5] - Distortion amount (0-1, typically 0.1 to 0.9 for usable effect)
     * @returns {Float32Array}
     */
    createDistortionCurve(amount = 0.5) {
        const k = typeof amount === 'number' ? amount * 100 : 50; 
        const n_samples = 44100;
        const curve = new Float32Array(n_samples);
        const deg = Math.PI / 180;
        for (let i = 0; i < n_samples; ++i) {
            const x = i * 2 / n_samples - 1;
            curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
        }
        return curve;
    }

    /**
     * Creates reverb buffer for convolution
     * @param {number} [roomSize=0.5] - Room size (0-1, typically 0.1 to 0.9)
     * @param {number} [dampening=0.5] - Dampening factor (0-1, typically 0.1 to 0.9)
     * @returns {AudioBuffer | null}
     */
    createReverbBuffer(roomSize = 0.5, dampening = 0.5) {
        if (!this.audioContext || this.audioContext.state === 'closed') return null;
        const sampleRate = this.audioContext.sampleRate;
        const length = sampleRate * (roomSize * 2 + 0.5); 
        const impulse = this.audioContext.createBuffer(2, length, sampleRate);
        const impulseL = impulse.getChannelData(0);
        const impulseR = impulse.getChannelData(1);

        for (let i = 0; i < length; i++) {
            const t = i / sampleRate;
            impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - t / (roomSize * 2 + 0.5), dampening * 5 + 1);
            impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - t / (roomSize * 2 + 0.5), dampening * 5 + 1);
        }
        return impulse;
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
                    envelope: { attack: 0.005, decay: 0.05, sustain: 0.1, release: 0.04 }
                });
            }, index * 50);
        });
    }

    /**
     * Plays startup sound sequence
     */
    playStartupSequence() {
        if (!this.settings.soundsEnabled || this.performance.isLowPerformance) return;
        setTimeout(() => this.playSound('startup'), 500);
    }

    /**
     * Updates sound volume and saves to localStorage
     * @param {number} volume - Volume level (0-1)
     */
    setSoundVolume(volume) {
        this.settings.soundVolume = Math.max(0, Math.min(1, volume));
        localStorage.setItem('ggenius-soundVolume', String(this.settings.soundVolume));
        if (this.masterGain && this.audioContext && this.audioContext.state !== 'closed') {
            this.masterGain.gain.setValueAtTime(this.settings.soundVolume, this.audioContext.currentTime);
        }
    }
    
    /**
     * Updates music volume and saves to localStorage
     * @param {number} volume - Volume level (0-1)
     */
    setMusicVolume(volume) {
        this.settings.musicVolume = Math.max(0, Math.min(1, volume));
        localStorage.setItem('ggenius-musicVolume', String(this.settings.musicVolume));
        if (this.ambientGain && this.audioContext && this.audioContext.state !== 'closed') {
            this.ambientGain.gain.setValueAtTime(this.settings.musicVolume, this.audioContext.currentTime);
        }
    }

    /**
     * Toggles sound effects on/off
     * @param {boolean} [enabled=!this.settings.soundsEnabled] - Whether sounds should be enabled. Toggles if undefined.
     */
    toggleSounds(enabled = !this.settings.soundsEnabled) {
        if (this.performance.isLowPerformance && enabled) {
            console.warn("Cannot enable sounds in low performance mode.");
            return;
        }
        this.settings.soundsEnabled = enabled;
        localStorage.setItem('ggenius-soundsEnabled', JSON.stringify(enabled));
        if (enabled && (!this.audioContext || this.audioContext.state === 'closed')) {
            this.initializeAudioSystem(); 
        }
        console.log(`🔊 Sounds ${enabled ? 'enabled' : 'disabled'}`);
    }

    /**
     * Toggles background music on/off
     * @param {boolean} [enabled=!this.settings.musicEnabled] - Whether music should be enabled. Toggles if undefined.
     */
    toggleMusic(enabled = !this.settings.musicEnabled) {
        if (this.performance.isLowPerformance && enabled) {
            console.warn("Cannot enable music in low performance mode.");
            return;
        }
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
        console.log(`🎶 Music ${enabled ? 'enabled' : 'disabled'}`);
    }
    
    /**
     * Simulates a loading process with progress bar and text updates.
     * @async
     */
    async simulateLoading() {
        return new Promise((resolve) => {
            if (!this.progressBar || !this.loadingTextElement) {
                this.hideLoadingScreen(true);
                resolve();
                return;
            }

            let progress = 0;
            const messages = [
                'Ініціалізація GGenius AI...', 'Завантаження нейронних мереж...',
                'Підключення до кіберспорт серверів...', 'Активація штучного інтелекту...',
                'Синхронізація з MLBB API...', 'Готовність до революції!'
            ];
            let messageIndex = 0;

            const updateProgress = () => {
                const increment = Math.random() * 15 + 5;
                progress = Math.min(progress + increment, 100);
                
                if (this.progressBar) {
                    this.progressBar.style.transform = `scaleX(${progress / 100})`;
                    this.progressBar.setAttribute('aria-valuenow', String(Math.round(progress)));
                }
                
                const currentMessageIndex = Math.min(Math.floor((progress / 100) * messages.length), messages.length - 1);
                if (this.loadingTextElement && messages[currentMessageIndex] && messageIndex !== currentMessageIndex) {
                    messageIndex = currentMessageIndex;
                    this.updateLoadingText(messages[messageIndex]);
                    this.playSound('loading_tick');
                }
                
                if (progress < 100) {
                    setTimeout(updateProgress, 100 + Math.random() * 150);
                } else {
                    if (this.progressBar) this.progressBar.style.transform = 'scaleX(1)';
                    if (this.loadingTextElement) this.updateLoadingText(messages[messages.length - 1]);
                    this.playSound('loading_complete');
                    setTimeout(() => {
                        this.hideLoadingScreen();
                        resolve();
                    }, 600);
                }
            };
            updateProgress();
        });
    }
    
    /**
     * Hides the loading screen and triggers entry animations.
     * @param {boolean} [immediate=false] - If true, hides without sound and triggers animations faster.
     */
    hideLoadingScreen(immediate = false) {
        if (!this.loadingScreen || this.loadingScreen.classList.contains('hidden')) return;
        
        this.loadingScreen.classList.add('hidden');
        this.loadingScreen.setAttribute('aria-hidden', 'true');
        
        if (!immediate && !this.performance.isLowPerformance) {
             this.playSound('loading_complete');
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
        this.mobileToggle.classList.toggle('active', shouldBeOpen); // For hamburger animation
        this.navMenu.classList.toggle('open', shouldBeOpen);
        document.body.classList.toggle('menu-open', shouldBeOpen); 
        
        this.playSound(shouldBeOpen ? 'menu_open' : 'menu_close');
        
        if (shouldBeOpen) {
            this.navMenu.querySelector('a[href], button')?.focus();
        } else {
            this.mobileToggle.focus();
        }
    }

    /**
     * Toggles an accordion item.
     * @param {HTMLElement} header - The header element of the accordion.
     * @param {HTMLElement} content - The content element of the accordion.
     */
    toggleAccordion(header, content) {
        const isOpen = header.getAttribute('aria-expanded') === 'true';
        if (isOpen) {
            this.closeAccordion(header, content);
        } else {
            this.openAccordion(header, content);
        }
        this.playSound(isOpen ? 'accordion_close' : 'accordion_open');
    }

    /**
     * Switches to a specific tab.
     * @param {HTMLElement} activeTab - The tab to activate.
     * @param {HTMLElement[]} allTabs - Array of all tab elements in the group.
     * @param {HTMLElement[]} allPanels - Array of all panel elements in the group.
     * @param {boolean} [isInitialSetup=false] - True if called during initial setup.
     */
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
                panel.hidden = false; 
                panel.setAttribute('aria-hidden', 'false');
            } else {
                panel.classList.remove('active');
                panel.hidden = true;
                panel.setAttribute('aria-hidden', 'true');
            }
        });
        
        if (!isInitialSetup) {
            activeTab.focus(); 
            this.playSound('tab_switch');
        }
    }

    /**
     * Shows a demonstration modal.
     */
    showDemoModal() {
        const modalId = 'demo-modal-ggenius';
        if (document.getElementById(modalId)) return; 

        const modalContent = `
            <p>Ласкаво просимо до демонстрації GGenius AI!</p>
            <p>Наразі ця функція знаходиться в розробці. Слідкуйте за оновленнями, щоб першими випробувати революційні можливості GGenius.</p>
            <div class="modal-feature-preview">
                <h4>Що очікувати:</h4>
                <ul>
                    <li>🤖 Глибокий AI-аналіз ваших ігор</li>
                    <li>📈 Персоналізовані рекомендації для покращення</li>
                    <li>🏆 Інтеграція з турнірною платформою</li>
                    <li>📊 Прогнозна аналітика та багато іншого!</li>
                </ul>
            </div>
            <p>Приєднуйтесь до нашої спільноти, щоб не пропустити запуск!</p>
        `;
        const modal = this.createModal({
            id: modalId,
            title: 'GGenius AI Demo',
            content: modalContent,
            actions: [
                { text: 'Підписатися на оновлення', primary: true, action: () => { this.closeModal(modalId); this.scrollToNewsletter(); } },
                { text: 'Закрити', action: () => this.closeModal(modalId) }
            ]
        });
        this.showModal(modal);
    }

    /**
     * Creates a modal element.
     * @param {object} config - Modal configuration.
     * @param {string} config.id - ID for the modal.
     * @param {string} config.title - Title for the modal.
     * @param {string} config.content - HTML content for the modal body.
     * @param {object[]} [config.actions=[]] - Array of action button configurations.
     * @returns {HTMLElement} The created modal element.
     */
    createModal({ id, title, content, actions = [] }) {
        const modalTitleId = `${id}-title`;
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = id;
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', modalTitleId);
        
        let actionsHTML = '';
        if (actions.length > 0) {
            actionsHTML = '<div class="modal-actions">';
            actions.forEach((action, index) => {
                actionsHTML += `<button type="button" class="modal-button ${action.primary ? 'button-primary cta-button primary-cta' : 'button-secondary cta-button secondary-cta'}" data-action-index="${index}">${action.text}</button>`;
            });
            actionsHTML += '</div>';
        }

        modal.innerHTML = `
            <div class="modal-container" role="document">
                <header class="modal-header">
                    <h2 id="${modalTitleId}" class="modal-title">${title}</h2>
                    <button type="button" class="modal-close-button" aria-label="Закрити модальне вікно" data-close-modal>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </header>
                <div class="modal-body">
                    ${content}
                </div>
                ${actionsHTML}
            </div>
        `;
        
        const closeButton = modal.querySelector('[data-close-modal]');
        if (closeButton) {
             this._addEventListener(closeButton, 'click', () => this.closeModal(id), `modalCloseBtn-${id}`);
        }

        this._addEventListener(modal, 'click', (e) => {
            if (e.target === modal) this.closeModal(id); 
        }, `modalOverlayClick-${id}`);
        
        actions.forEach((actionConfig, index) => {
            const button = modal.querySelector(`.modal-actions [data-action-index="${index}"]`);
            if (button && actionConfig.action && typeof actionConfig.action === 'function') {
                this._addEventListener(button, 'click', actionConfig.action, `modalAction-${id}-${index}`);
            }
        });
        return modal;
    }

    /**
     * Shows a modal dialog.
     * @param {HTMLElement} modal - The modal element to show.
     */
    showModal(modal) {
        if (!modal || !modal.id) {
            console.error("Invalid modal element passed to showModal.");
            return;
        }
        this.closeModal(); 

        this.lastFocusedElementBeforeModal = document.activeElement;
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
        this.playSound('modal_open');
    }

    /**
     * Sets up newsletter form submission.
     * @param {HTMLFormElement} form - The newsletter form element.
     * @async
     */
    async setupNewsletterForm(form) {
        this._addEventListener(form, 'submit', async (e) => {
            e.preventDefault();
            const submitButton = form.querySelector('button[type="submit"]');
            const emailInput = form.querySelector('input[type="email"]');
            let emailError = form.querySelector('.error-message#email-error-message');
            
            if (!emailError && emailInput) { 
                emailError = document.createElement('div');
                emailError.id = 'email-error-message';
                emailError.className = 'error-message';
                emailError.setAttribute('role', 'alert');
                emailError.setAttribute('aria-live', 'assertive'); 
                emailInput.parentNode?.insertBefore(emailError, emailInput.nextSibling);
            }

            const email = emailInput?.value.trim();
            if (!this.validateEmail(email)) {
                this.showError('Будь ласка, введіть коректну email адресу.', emailError, emailInput);
                emailInput?.focus();
                this.playSound('form_error');
                return;
            }
            if(emailError) this.clearError(emailError, emailInput);

            const originalButtonText = submitButton.querySelector('.button-text')?.textContent || 'Приєднатися';
            const loadingText = submitButton.dataset.loadingText || 'Підписуємо...';
            const successText = submitButton.dataset.successText || 'Підписано! ✅';
            
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
                this.playSound('form_success');
            } catch (error) {
                console.error('Newsletter signup failed:', error);
                this.showError(error.message || 'Помилка підписки. Спробуйте ще раз.', emailError);
                this.playSound('form_error');
            } finally {
                setTimeout(() => {
                    submitButton.disabled = false;
                    if(submitButton.querySelector('.button-text')) submitButton.querySelector('.button-text').textContent = originalButtonText;
                    submitButton.classList.remove('loading');
                }, 2500); 
            }
        }, 'newsletterSubmit');
    }
    
    /**
     * Copies text to the clipboard.
     * @param {string} text - The text to copy.
     * @param {string} [contentType='Текст'] - Description of the content type for toast messages.
     * @async
     */
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
            this.playSound('button_click');
        } catch (error) {
            console.error('Failed to copy text:', error);
            this.showToast(`Не вдалося скопіювати ${contentType.toLowerCase()}.`, 'error');
            this.playSound('form_error');
        }
    }
    
    /**
     * Shows a toast notification.
     * @param {string} message - The message to display in the toast.
     * @param {'info' | 'success' | 'warning' | 'error'} [type='info'] - The type of toast.
     * @param {number} [duration=3500] - Duration in ms. 0 for persistent.
     * @returns {HTMLElement} The created toast element.
     */
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;
        
        const closeButton = toast.querySelector('.toast-close');
        const toastId = `toast-${Date.now()}-${Math.random().toString(36).substring(2)}`;
        toast.id = toastId;

        const removeHandler = () => this.removeToast(toast); 
        this._addEventListener(closeButton, 'click', removeHandler, `toastClose-${toastId}`);
        
        toastContainer.prepend(toast);
        requestAnimationFrame(() => toast.classList.add('show'));
        
        if (type !== 'error' && type !== 'warning') { 
            this.playSound('notification');
        }
        
        if (duration > 0) {
            const timeoutId = setTimeout(removeHandler, duration);
            this.animations.set(`toastTimeout-${toastId}`, timeoutId); 
        }
        return toast;
    }

    /**
     * Sets up hover interactions for feature cards.
     */
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

    /**
     * Shows a custom context menu.
     * @param {MouseEvent} e - The contextmenu event.
     * @param {HTMLElement} targetElement - The element on which the context menu was triggered.
     */
    showContextMenu(e, targetElement) {
        this.hideContextMenu(); 
        const menu = document.createElement('div');
        menu.className = 'context-menu-ggenius'; 
        menu.setAttribute('role', 'menu');
        menu.id = `context-menu-${Date.now()}`;
        
        let menuItemsHTML = `
            <button role="menuitem" data-action="copy-link">🔗 Копіювати посилання</button>
            <button role="menuitem" data-action="share">🌐 Поділитися</button>
        `;
        if (targetElement.id) {
             menuItemsHTML += `<button role="menuitem" data-action="copy-section-link" data-target-id="${targetElement.id}">📌 Копіювати посилання на цю секцію</button>`;
        }
        if (targetElement.dataset.feature) {
            menuItemsHTML += `<button role="menuitem" data-action="feature-details" data-feature="${targetElement.dataset.feature}">💡 Детальніше про функцію</button>`;
        }

        menu.innerHTML = menuItemsHTML;
        
        menu.style.position = 'fixed';
        menu.style.left = `${e.clientX}px`;
        menu.style.top = `${e.clientY}px`;
        
        document.body.appendChild(menu);
        menu.querySelector('[role="menuitem"]')?.focus(); 
        
        const itemClickHandler = (menuEvent) => {
            const menuItem = menuEvent.target.closest('[role="menuitem"]');
            if (menuItem) {
                const action = menuItem.dataset.action;
                const targetId = menuItem.dataset.targetId; 
                const feature = menuItem.dataset.feature;
                this.handleContextMenuAction(action, targetElement, targetId, feature);
                this.hideContextMenu();
            }
        };
        this._addEventListener(menu, 'click', itemClickHandler, `contextMenuItemClick-${menu.id}`);
        this._addEventListener(menu, 'keydown', (menuEvent) => { 
            if (menuEvent.key === 'Enter' || menuEvent.key === ' ') {
                menuEvent.target.closest('[role="menuitem"]')?.click();
            } else if (menuEvent.key === 'ArrowDown' || menuEvent.key === 'ArrowUp') {
                menuEvent.preventDefault();
                const items = Array.from(menu.querySelectorAll('[role="menuitem"]'));
                let currentIndex = items.indexOf(document.activeElement);
                if (menuEvent.key === 'ArrowDown') {
                    currentIndex = (currentIndex + 1) % items.length;
                } else {
                    currentIndex = (currentIndex - 1 + items.length) % items.length;
                }
                items[currentIndex]?.focus();
            }
        }, `contextMenuItemKeydown-${menu.id}`);

        requestAnimationFrame(() => { 
            const rect = menu.getBoundingClientRect();
            if (rect.right > window.innerWidth) menu.style.left = `${window.innerWidth - rect.width - 5}px`;
            if (rect.bottom > window.innerHeight) menu.style.top = `${window.innerHeight - rect.height - 5}px`;
            if (rect.left < 0) menu.style.left = '5px';
            if (rect.top < 0) menu.style.top = '5px';
        });
    }

    /**
     * Handles actions from the custom context menu.
     * @param {string} action - The action to perform.
     * @param {HTMLElement} targetElement - The original target of the context menu.
     * @param {string} [targetId] - The ID of the target section, if applicable.
     * @param {string} [feature] - The feature name, if applicable.
     */
    handleContextMenuAction(action, targetElement, targetId, feature) {
        let urlToShare = window.location.origin + window.location.pathname;
        if (targetId && (action === "copy-section-link" || action === "share")) { 
            urlToShare += `#${targetId}`;
        } else {
            urlToShare = window.location.href; 
        }

        switch (action) {
            case 'copy-link':
                this.copyToClipboard(window.location.href, 'Посилання на сторінку'); break;
            case 'copy-section-link':
                this.copyToClipboard(urlToShare, 'Посилання на секцію'); break;
            case 'share':
                this.shareContent(document.title, `Подивіться на це: ${targetElement.textContent?.substring(0,50) || 'GGenius'}`, urlToShare); break;
            case 'feature-details':
                this.showToast(`Деталі про функцію '${feature}' будуть доступні незабаром!`, 'info');
                break;
        }
    }

    /**
     * Preloads critical resources.
     */
    preloadResources() {
        const resources = [
            // { href: '/static/images/critical-hero.webp', as: 'image', fetchpriority: 'high' },
            // Add other critical resources if any not covered by HTML preloads.
        ];
        resources.forEach(res => {
            const link = document.createElement('link');
            link.rel = 'preload'; 
            if (res.as) link.as = res.as;
            link.href = res.href;
            if (res.type) link.type = res.type;
            if (res.crossOrigin) link.crossOrigin = res.crossOrigin;
            if (res.fetchpriority) link.setAttribute('fetchpriority', res.fetchpriority);
            document.head.appendChild(link);
        });
    }

    /**
     * Shows an install banner for PWA if available.
     * @param {Event} promptEvent - The 'beforeinstallprompt' event.
     */
    showInstallBanner(promptEvent) {
        document.querySelector('.install-banner-ggenius')?.remove(); 
        const banner = document.createElement('div');
        banner.className = 'install-banner-ggenius'; 
        banner.innerHTML = `
            <div class="install-banner-content">
                <span class="install-banner-icon" aria-hidden="true">🚀</span>
                <p class="install-banner-text">Встановіть GGenius для кращого досвіду!</p>
            </div>
            <div class="install-banner-actions">
                <button type="button" class="install-button button-primary cta-button primary-cta">Встановити</button>
                <button type="button" class="install-close button-secondary cta-button secondary-cta" aria-label="Закрити">Ні, дякую</button>
            </div>
        `;
        
        const installButton = banner.querySelector('.install-button');
        const closeButton = banner.querySelector('.install-close');
        const bannerId = `installBanner-${Date.now()}`;

        this._addEventListener(installButton, 'click', async () => {
            banner.remove();
            if (!promptEvent) return;
            promptEvent.prompt();
            const { outcome } = await promptEvent.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
        }, `installPWAButton-${bannerId}`);
        
        this._addEventListener(closeButton, 'click', () => banner.remove(), `closeInstallBanner-${bannerId}`);
        document.body.appendChild(banner);
        
        setTimeout(() => { if(banner.parentNode) banner.remove(); }, 25000); 
    }

    /**
     * Sets up ambient background music.
     */
    setupBackgroundMusic() { 
        if (!this.settings.musicEnabled || !this.audioContext || this.performance.isLowPerformance || this.audioContext.state === 'closed') {
            this.stopAmbientMusic();
            return;
        }
        if (this.ambientOscillators) return; 

        this.startAmbientMusic(); 
    }

    /**
     * Starts the ambient background music.
     */
    startAmbientMusic() { 
        if (!this.settings.musicEnabled || !this.audioContext || this.performance.isLowPerformance || this.audioContext.state === 'closed') return;
        if (this.ambientOscillators) return; 

        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume().then(() => this._startAmbientMusicLogic());
        } else {
            this._startAmbientMusicLogic();
        }
    }

    /**
     * Internal logic to start ambient music oscillators and effects.
     * @private
     */
    _startAmbientMusicLogic() {
        if (!this.audioContext || !this.ambientGain || this.ambientOscillators || this.audioContext.state === 'closed') return;

        this.ambientOscillators = [
            this.audioContext.createOscillator(), 
            this.audioContext.createOscillator()  
        ];
        
        const now = this.audioContext.currentTime;

        this.ambientOscillators[0].type = 'sine';
        this.ambientOscillators[0].frequency.setValueAtTime(55, now); 
        
        this.ambientOscillators[1].type = 'sawtooth';
        this.ambientOscillators[1].frequency.setValueAtTime(110, now); 
        
        const lfo = this.audioContext.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.1, now); 
        const lfoGain = this.audioContext.createGain();
        lfoGain.gain.setValueAtTime(1, now); 
        lfo.connect(lfoGain);
        lfoGain.connect(this.ambientOscillators[0].frequency);
        
        const shimmerFilter = this.audioContext.createBiquadFilter();
        shimmerFilter.type = 'lowpass';
        shimmerFilter.frequency.setValueAtTime(400, now);
        shimmerFilter.Q.setValueAtTime(1, now);

        this.ambientOscillators[0].connect(this.ambientGain);
        this.ambientOscillators[1].connect(shimmerFilter);
        shimmerFilter.connect(this.ambientGain);

        this.ambientOscillators.forEach(osc => osc.start(now));
        lfo.start(now);
        this.audioNodes.set('ambientLFO', lfo); 
        
        console.log("🌌 Ambient music started.");
    }

    /**
     * Stops the ambient background music.
     */
    stopAmbientMusic() {
        if (this.ambientOscillators && this.audioContext && this.audioContext.state !== 'closed') {
            const now = this.audioContext.currentTime;
            this.ambientOscillators.forEach(osc => {
                try { osc.stop(now); } catch(e) { /* ignore if already stopped */ }
            });
            this.ambientOscillators = null;
            
            if (this.audioNodes.has('ambientLFO')) {
                try { this.audioNodes.get('ambientLFO').stop(now); } catch(e) { /* ignore */ }
                this.audioNodes.delete('ambientLFO');
            }
            console.log("🌌 Ambient music stopped.");
        }
    }

    /**
     * Sets up a custom gaming-style cursor.
     */
    setupGamingCursor() {
        if (this.performance.isLowPerformance || !window.matchMedia?.('(pointer: fine)').matches || window.innerWidth <= 768) return;

        const cursorEl = document.createElement('div');
        cursorEl.className = 'gaming-cursor';
        document.body.appendChild(cursorEl);

        const dot = document.createElement('div');
        dot.className = 'gaming-cursor-dot';
        cursorEl.appendChild(dot);

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        const speed = 0.2; 

        this._addEventListener(window, 'mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }, 'gamingCursorMove');

        const animateCursor = () => {
            cursorX += (mouseX - cursorX) * speed;
            cursorY += (mouseY - cursorY) * speed;
            cursorEl.style.transform = `translate3d(${cursorX - cursorEl.offsetWidth / 2}px, ${cursorY - cursorEl.offsetHeight / 2}px, 0)`;
            this.animations.set('gamingCursor', requestAnimationFrame(animateCursor));
        };
        if (!this.animations.has('gamingCursor')) { // Avoid multiple rAF loops
            this.animations.set('gamingCursor', requestAnimationFrame(animateCursor));
        }


        document.querySelectorAll('a, button, [role="button"], [role="tab"], .feature-card-iui, .mobile-menu-toggle, .category-tab, .contact-link, .accordion-header')
            .forEach(el => {
                const elId = el.id || el.tagName + Math.random().toString(16).slice(2);
                this._addEventListener(el, 'mouseenter', () => cursorEl.classList.add('hover'), `cursorHoverEnter-${elId}`);
                this._addEventListener(el, 'mouseleave', () => cursorEl.classList.remove('hover'), `cursorHoverLeave-${elId}`);
            });
    }

    /**
     * Tracks page load time and First Contentful Paint.
     */
    trackLoadTime() {
        const loadTime = performance.now() - this.performance.startTime;
        this.performance.metrics.pageLoadTime = loadTime;
        console.log(`⏱️ GGenius Page Load Time: ${loadTime.toFixed(2)} ms`);
        
        if (window.performance && window.performance.getEntriesByType) {
            const paintEntries = window.performance.getEntriesByType('paint');
            paintEntries.forEach(entry => {
                if (entry.name === 'first-contentful-paint') {
                    this.performance.metrics.fcp = entry.startTime;
                    console.log(`🎨 First Contentful Paint: ${entry.startTime.toFixed(2)} ms`);
                }
            });
        }
    }

    /**
     * Handles window resize events (debounced).
     * @private
     */
    _handleResize() {
        console.log('Window resized. Current dimensions:', window.innerWidth, 'x', window.innerHeight);
        if (window.innerWidth <= 768 && this.animations.has('gamingCursor')) {
            cancelAnimationFrame(this.animations.get('gamingCursor'));
            this.animations.delete('gamingCursor');
            document.querySelector('.gaming-cursor')?.remove();
        } else if (window.innerWidth > 768 && !this.animations.has('gamingCursor') && !this.performance.isLowPerformance) {
            this.setupGamingCursor();
        }
        if (window.innerWidth > 768 && this.navMenu?.classList.contains('open')) {
            this.toggleMobileMenu(false);
        }
    }

    /**
     * Handles document visibility change events.
     * @private
     */
    _handleVisibilityChange() {
        if (document.visibilityState === 'hidden') {
            this.pauseAnimationsAndAudio();
        } else {
            this.resumeAnimationsAndAudio();
        }
    }

    /**
     * Pauses animations and audio when the page is hidden.
     */
    pauseAnimationsAndAudio() {
        console.log('⏸️ Page hidden. Pausing animations and audio.');
        this.animations.forEach((id, key) => {
            if (key.startsWith('counter-') || key === 'gamingCursor' || key === 'fpsMonitor') { 
                cancelAnimationFrame(id);
            } else if (key.startsWith('toastTimeout-') || key.startsWith('anim-')) { // Assuming these are timeout IDs
                clearTimeout(id);
            }
        });
        if (this.audioContext && this.audioContext.state === 'running') {
            this.audioContext.suspend().catch(e => console.warn("Error suspending audio context:", e));
        }
    }

    /**
     * Resumes animations and audio when the page becomes visible.
     */
    resumeAnimationsAndAudio() {
        console.log('▶️ Page visible. Resuming animations and audio.');
        // Restart rAF loops. Counters might need re-triggering if they were based on scroll.
        // For simplicity, gamingCursor will restart its rAF loop if conditions are met.
        // FPS monitor can also restart.
        if (this.animations.has('gamingCursor') && !document.querySelector('.gaming-cursor')) { 
            if (!this.performance.isLowPerformance && window.matchMedia?.('(pointer: fine)').matches && window.innerWidth > 768) {
                 this.setupGamingCursor(); 
            }
        } else if (this.animations.has('gamingCursor') && document.querySelector('.gaming-cursor')) {
            // If it was just paused, the rAF loop will continue via its own logic or next mousemove
            // To be certain, can re-initiate the rAF if it was truly paused.
            // For now, assuming mousemove will pick it up or it's self-looping.
        }
        if (this.animations.has('fpsMonitor') && (window.location.hostname === 'localhost' || window.location.search.includes('debugFPS'))) {
            // this.setupFrameRateMonitoring(30000); // Could restart it
        }

        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume().catch(e => console.warn("Error resuming audio context:", e));
        }
    }

    /**
     * Activates fallback mode if initialization fails.
     * @param {Error} error - The error that caused the fallback.
     */
    fallbackMode(error) {
        console.error('🚨 Entering fallback mode due to error:', error);
        document.documentElement.classList.add('fallback-mode');
        
        const existingLoadingScreen = document.getElementById('loadingScreen');
        if (existingLoadingScreen) existingLoadingScreen.remove();

        let fallbackMessage = document.getElementById('fallback-message-container');
        if (!fallbackMessage) {
            fallbackMessage = document.createElement('div');
            fallbackMessage.id = 'fallback-message-container';
            fallbackMessage.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; background: #ff4d4d; color: white;
                padding: 15px; text-align: center; z-index: 10000; font-family: sans-serif;
            `;
            document.body.prepend(fallbackMessage);
        }
        fallbackMessage.innerHTML = `
            <p>Виникла помилка під час завантаження GGenius. Деякі інтерактивні функції можуть бути недоступні.</p>
            <p>Будь ласка, спробуйте оновити сторінку. Якщо проблема не зникне, зв'яжіться з підтримкою.</p>
        `;
        this.setupBasicNavigationForFallback();
    }

    /**
     * Sets up basic navigation for fallback mode.
     */
    setupBasicNavigationForFallback() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            this._addEventListener(anchor, 'click', (e) => {
                // Allow default hash change and browser scroll in fallback
            }, `fallbackNav-${anchor.href || Math.random().toString(36).substring(2)}`);
        });
    }

    /**
     * Throttles a function call.
     * @param {Function} func - The function to throttle.
     * @param {number} delay - The throttle delay in ms.
     * @returns {Function} The throttled function.
     */
    throttle(func, delay) {
        let lastCall = 0;
        let timeoutId;
        return (...args) => {
            const now = new Date().getTime();
            clearTimeout(timeoutId);
            if (now - lastCall >= delay) {
                lastCall = now;
                func(...args);
            } else {
                timeoutId = setTimeout(() => {
                    lastCall = new Date().getTime();
                    func(...args);
                }, delay - (now - lastCall));
            }
        };
    }

    /**
     * Debounces a function call.
     * @param {Function} func - The function to debounce.
     * @param {number} delay - The debounce delay in ms.
     * @returns {Function} The debounced function.
     */
    debounce(func, delay) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func(...args);
            }, delay);
        };
    }

    /**
     * Adds an event listener and stores a reference for later removal.
     * @param {EventTarget} target - The target element.
     * @param {string} type - The event type.
     * @param {Function} listener - The event listener.
     * @param {string} key - A unique key for this listener.
     * @param {object} [options={ passive: true }] - Event listener options.
     * @private
     */
    _addEventListener(target, type, listener, key, options = { passive: true }) {
        if (!target || !type || !listener || !key) {
            console.warn('addEventListener: Missing arguments', {target, type, key});
            return;
        }
        this._removeEventListener(key); 
        
        target.addEventListener(type, listener, options);
        this.eventListeners.set(key, { target, type, listener, options });
    }

    /**
     * Removes an event listener by its key.
     * @param {string} key - The unique key of the listener to remove.
     * @private
     */
    _removeEventListener(key) {
        if (this.eventListeners.has(key)) {
            const { target, type, listener, options } = this.eventListeners.get(key);
            target.removeEventListener(type, listener, options);
            this.eventListeners.delete(key);
        }
    }

    /**
     * Cleans up the GGeniusApp instance, removing listeners and observers.
     */
    destroy() {
        console.log('💥 Destroying GGeniusApp instance...');
        if (this.memoryMonitorInterval) clearInterval(this.memoryMonitorInterval);
        
        this.animations.forEach((id, key) => {
            if (key.startsWith('counter-') || key === 'gamingCursor' || key === 'fpsMonitor') {
                 cancelAnimationFrame(id);
            } else if (key.startsWith('toastTimeout-') || key.startsWith('anim-')) {
                clearTimeout(id);
            }
        });
        this.animations.clear();

        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();

        this.eventListeners.forEach((_, key) => this._removeEventListener(key));
        this.eventListeners.clear();
        
        this.stopAmbientMusic();
        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close().catch(e => console.warn("Error closing audio context:", e));
        }

        document.querySelector('.gaming-cursor')?.remove();
        document.getElementById('toast-container-ggenius')?.remove();
        document.querySelector('.install-banner-ggenius')?.remove();
        document.querySelectorAll('.context-menu-ggenius').forEach(menu => menu.remove());
        document.getElementById('scrollProgress')?.remove();

        console.log('💀 GGeniusApp instance destroyed.');
    }
    
    /**
     * Creates the scroll progress bar element.
     * @returns {HTMLElement} The scroll progress bar element.
     */
    createScrollProgress() {
        const progress = document.createElement('div');
        progress.className = 'scroll-progress'; 
        progress.id = 'scrollProgress';
        progress.setAttribute('role', 'progressbar');
        progress.setAttribute('aria-label', 'Прогрес прокрутки сторінки');
        progress.setAttribute('aria-valuenow', '0');
        progress.setAttribute('aria-valuemin', '0');
        progress.setAttribute('aria-valuemax', '100');
        progress.style.transform = 'scaleX(0)'; 
        document.body.prepend(progress);
        return progress;
    }

    /**
     * Updates the text of the loading screen.
     * @param {string} text - The text to display.
     */
    updateLoadingText(text) {
        if (!this.loadingTextElement) return;
        this.loadingTextElement.style.opacity = '0';
        setTimeout(() => {
            this.loadingTextElement.textContent = text;
            this.loadingTextElement.style.opacity = '1';
        }, 150); 
    }
    
    /**
     * Loads critical feature elements and initializes the loading screen.
     * @async
     */
    async loadCriticalFeatures() {
        this.loadingScreen = document.getElementById('loadingScreen');
        this.progressBar = document.getElementById('progressBar');
        this.loadingTextElement = document.getElementById('loadingText'); 
        this.header = document.querySelector('.site-header');
        this.scrollProgress = document.getElementById('scrollProgress') || this.createScrollProgress();
        this.heroSection = document.querySelector('.project-intro-hero'); // Updated selector
        this.navMenu = document.querySelector('#main-menu-list.nav-menu'); // More specific selector
        this.mobileToggle = document.querySelector('#mobileMenuToggle.mobile-menu-toggle'); // More specific
        
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
     * Sets up performance monitoring (WebVitals, Memory, FPS).
     * @async
     */
    async setupPerformanceMonitoring() {
        if (this.performance.isLowPerformance && !window.location.search.includes('forcePerfMonitoring')) {
            console.info("🦥 Low performance mode: Skipping detailed performance monitoring.");
            return;
        }
        if ('PerformanceObserver' in window) this.setupWebVitalsTracking();
        if (performance.memory) this.setupMemoryMonitoring();
        if (window.location.hostname === 'localhost' || window.location.search.includes('debugFPS')) {
            this.setupFrameRateMonitoring(30000); 
        }
    }

    /**
     * Sets up Web Vitals tracking using PerformanceObserver.
     */
    setupWebVitalsTracking() {
        const vitalConfigs = {
            'FCP': { entryTypes: ['paint'], name: 'first-contentful-paint' },
            'LCP': { entryTypes: ['largest-contentful-paint'] },
            'FID': { entryTypes: ['first-input'] }, 
            'CLS': { entryTypes: ['layout-shift'] },
            'INP': { entryTypes: ['event'] } 
        };
        const supportedEntryTypes = PerformanceObserver.supportedEntryTypes || [];
        try {
            const observerCallback = (list) => {
                for (const entry of list.getEntries()) {
                    let vitalNameFound = null;
                    for (const vitalName in vitalConfigs) {
                        const config = vitalConfigs[vitalName];
                        if (config.entryTypes.includes(entry.entryType) || (config.name && entry.name === config.name)) {
                            if (vitalName === 'INP' && entry.name !== 'event') continue; 
                            vitalNameFound = vitalName; break;
                        }
                    }
                    if (vitalNameFound) {
                        const value = entry.value !== undefined ? entry.value : (entry.duration || entry.startTime); 
                        if (vitalNameFound === 'LCP' || vitalNameFound === 'CLS' || vitalNameFound === 'INP' || this.performance.metrics[vitalNameFound] === undefined) {
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
                    if (supportedEntryTypes.includes(type)) typesToObserve.add(type);
                });
            }
            if (typesToObserve.size > 0) {
                observer.observe({ type: Array.from(typesToObserve), buffered: true, durationThreshold: (vitalConfigs.INP ? 16 : undefined) }); 
                this.observers.set('perf-vitals', observer);
            } else {
                console.warn("No supported entry types for Web Vitals observation.");
            }
        } catch (error) {
            console.warn('Failed to setup Web Vitals tracking:', error);
        }
    }
    
    /**
     * Sets up memory usage monitoring.
     */
    setupMemoryMonitoring() {
        const intervalId = setInterval(() => {
            if (!performance.memory) { clearInterval(intervalId); return; }
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

    /**
     * Sets up frame rate monitoring.
     * @param {number} [durationMs=0] - Duration to monitor FPS. 0 for continuous.
     */
    setupFrameRateMonitoring(durationMs = 0) {
        let frameCount = 0; let lastTime = performance.now(); let rafId;
        const startTime = performance.now();
        const countFrames = (currentTime) => {
            frameCount++;
            if (currentTime - lastTime >= 1000) { 
                this.performance.metrics.fps = frameCount; frameCount = 0; lastTime = currentTime;
                if (!this.performance.isLowPerformance && this.performance.metrics.fps < 25 && this.isLoaded) { 
                    console.warn(`📉 Low FPS detected: ${this.performance.metrics.fps}.`);
                }
            }
            if (durationMs > 0 && (currentTime - startTime > durationMs)) {
                console.info(`🏁 FPS Monitoring finished. Last FPS: ${this.performance.metrics.fps || 'N/A'}`);
                cancelAnimationFrame(rafId); this.animations.delete('fpsMonitor'); return;
            }
            rafId = requestAnimationFrame(countFrames); this.animations.set('fpsMonitor', rafId);
        };
        rafId = requestAnimationFrame(countFrames); this.animations.set('fpsMonitor', rafId);
    }

    /**
     * Attempts to optimize memory usage by cleaning up observers and triggering GC.
     */
    optimizeMemory() {
        console.log('🧠 Attempting memory optimization...');
        this.observers.forEach((observer, key) => {
            if (typeof key === 'string' && !key.startsWith('perf-') && key !== 'intersection' && key !== 'logoAnimationObserver') {
                try {
                     // A more direct way to check if observer might be stale is if its 'root' is no longer connected.
                     // However, IntersectionObserver API doesn't directly expose targets for easy DOM check.
                     // We'll rely on specific keys or be more general.
                    if (key.startsWith('io-') && !document.getElementById(key.substring(3)) && !document.querySelector(`[data-observer-key="${key}"]`)) {
                        observer.disconnect(); this.observers.delete(key);
                        console.log(`🧹 Removed potentially stale observer: ${key}`);
                    }
                } catch (e) { /* Ignore */ }
            }
        });
        if (window.gc) { try { window.gc(); console.log("🗑️ Garbage collection triggered."); } catch (e) { console.warn("window.gc() failed.", e); } }
    }

    /**
     * Dynamically enables a more aggressive performance mode.
     */
    enablePerformanceMode() {
        if (document.documentElement.classList.contains('performance-mode-active')) return;
        document.documentElement.classList.add('performance-mode-active', 'low-performance-device');
        console.warn('🎛️ Aggressive performance mode dynamically enabled.');
        if (this.animations.has('gamingCursor')) {
            cancelAnimationFrame(this.animations.get('gamingCursor'));
            this.animations.delete('gamingCursor');
            document.querySelector('.gaming-cursor')?.remove();
        }
        this.stopAmbientMusic();
        document.querySelectorAll('.complex-decoration').forEach(el => el.style.display = 'none');
        document.dispatchEvent(new CustomEvent('ggenius:performancemodeenabled'));
    }

    /**
     * Initializes UI components like navigation, scroll effects, accordions, etc.
     * @async
     */
    async initializeUI() {
        await Promise.all([
            this.setupNavigation(), this.setupScrollEffects(),
            this.setupAccordions(), this.setupTabs(),
            this.setupModals(), this.setupForms()
        ]);
    }

    /**
     * Sets up site navigation, including mobile menu and header scroll behavior.
     */
    setupNavigation() {
        if (!this.mobileToggle || !this.navMenu) {
            console.warn("Mobile toggle or nav menu not found. Check selectors: #mobileMenuToggle, #main-menu-list");
        } else {
            this._addEventListener(this.mobileToggle, 'click', (e) => {
                e.preventDefault(); this.toggleMobileMenu();
            }, 'mobileToggleClick');
        }
        this.setupHeaderScroll(); 
    }
    
    /**
     * Sets up header behavior on scroll (hide/show, add 'scrolled' class).
     */
    setupHeaderScroll() {
        if (!this.header) return;
        let lastScrollY = window.scrollY; let ticking = false;
        const updateHeader = () => {
            const currentScrollY = window.scrollY;
            const isScrolledDown = currentScrollY > lastScrollY && currentScrollY > this.header.offsetHeight;
            this.header.classList.toggle('scrolled', currentScrollY > 50);
            if (isScrolledDown) this.header.classList.add('header-hidden');
            else if (currentScrollY < lastScrollY || currentScrollY <= 50) this.header.classList.remove('header-hidden');
            lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY; ticking = false;
        };
        const onScroll = () => { if (!ticking) { window.requestAnimationFrame(updateHeader); ticking = true; } };
        this._addEventListener(window, 'scroll', onScroll, 'headerScrollHandler'); updateHeader(); 
    }

    /**
     * Sets up scroll-related effects like progress bar, parallax, and intersection observers.
     */
    setupScrollEffects() {
        if (this.scrollProgress) {
            this._addEventListener(window, 'scroll', this.handleScroll, 'scrollProgressUpdater');
            this._handleScroll(); 
        }
        // Parallax setup (requires .hero-floating-elements and .floating-gaming-icon in HTML)
        if (this.heroSection && this.heroSection.querySelector('.project-decorations')) { // Adjusted to use existing .project-decorations
            // this.setupParallax(); // Parallax needs specific elements like .floating-gaming-icon, which are not present
        }
        this.setupIntersectionObserver(); 
    }

    /**
     * Handles scroll events to update the scroll progress bar.
     * @private
     */
    _handleScroll() { 
        if (!this.scrollProgress) return;
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollableHeight <= 0) {
            this.scrollProgress.style.transform = 'scaleX(0)';
            this.scrollProgress.setAttribute('aria-valuenow', '0'); return;
        }
        const scrollPercentage = (window.scrollY / scrollableHeight);
        const boundedPercentage = Math.max(0, Math.min(scrollPercentage, 1)); 
        this.scrollProgress.style.transform = `scaleX(${boundedPercentage})`;
        this.scrollProgress.setAttribute('aria-valuenow', String(Math.round(boundedPercentage * 100)));
    }

    /**
     * Sets up parallax scrolling effects for elements within the hero section.
     * Note: Requires specific HTML structure (.hero-floating-elements, .floating-gaming-icon with data-parallax-speed).
     */
    setupParallax() {
        if (!this.heroSection) return;
        // This selector needs to exist in your HTML if you want parallax.
        // Example: <div class="hero-floating-elements"><div class="floating-gaming-icon" data-parallax-speed="0.3">...</div></div>
        const parallaxContainer = this.heroSection.querySelector('.hero-floating-elements'); 
        if (!parallaxContainer || this.performance.isLowPerformance) return;
        const parallaxElements = Array.from(parallaxContainer.querySelectorAll('.floating-gaming-icon')); 
        if (parallaxElements.length === 0) return;
        let ticking = false;
        const updateParallax = () => {
            const heroRect = this.heroSection.getBoundingClientRect();
            if (heroRect.bottom < 0 || heroRect.top > window.innerHeight) { ticking = false; return; }
            const scrollY = window.scrollY;
            parallaxElements.forEach((element) => {
                let speed = parseFloat(element.dataset.parallaxSpeed);
                if (isNaN(speed) || speed <=0 || speed > 1) speed = 0.2 + Math.random() * 0.2; 
                const yPos = -(scrollY * speed * 0.3); 
                element.style.transform = `translate3d(0, ${yPos.toFixed(2)}px, 0)`;
            });
            ticking = false;
        };
        const onScrollParallax = () => { if (!ticking) { window.requestAnimationFrame(updateParallax); ticking = true; } };
        this._addEventListener(window, 'scroll', onScrollParallax, 'parallaxScrollHandler'); updateParallax(); 
    }

    /**
     * Sets up IntersectionObserver to animate elements when they enter the viewport.
     */
    setupIntersectionObserver() {
        const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -10% 0px' };
        const observerCallback = (entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target); 
                    const sectionId = entry.target.id || entry.target.closest('section[id]')?.id;
                    if (sectionId && entry.intersectionRatio > 0.4) {
                        this.updateActiveNavigation(sectionId);
                    }
                     // Play scroll milestone sound for specific sections
                    if (entry.target.matches('.roadmap-quarter-block, .feature-card-iui, .goal-item')) {
                        this.playSound('scroll_milestone');
                    }
                    if (entry.target.dataset.animateOnce === 'true' || entry.target.classList.contains('animate-once') || entry.target.dataset.aosOnce === 'true') {
                       obs.unobserve(entry.target);
                       // Construct a unique key for the observer map if el.id is not reliable/unique
                       const observerKey = `io-${entry.target.id || entry.target.dataset.aos || `el-${Math.random().toString(36).substring(2)}`}`;
                       this.observers.delete(observerKey); 
                    }
                } else if (entry.target.dataset.animateOnce !== 'true' && !entry.target.classList.contains('animate-once') && !this.performance.isLowPerformance && entry.target.dataset.aosOnce !== 'true') {
                    entry.target.classList.remove('aos-animate', 'animate-in', entry.target.dataset.aos || entry.target.dataset.animation || 'fadeInUp', 'animated');
                }
            });
        };
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        const elementsToObserve = document.querySelectorAll(`
            section[id], .project-intro-card, .feature-card-iui, .roadmap-quarter-block, .goal-item, .tech-category, 
            .project-vision, .project-team, .newsletter-section, .contact-methods, .contact-stats, .accordion-header,
            [data-aos] 
        `); // Added .accordion-header and other elements with data-aos
        if (elementsToObserve.length > 0) {
            elementsToObserve.forEach((el) => {
                observer.observe(el);
                // Construct a unique key for the observer map
                const observerKey = `io-${el.id || el.dataset.aos || `el-${Math.random().toString(36).substring(2)}`}`;
                this.observers.set(observerKey, observer); 
            });
        }
    }

    /**
     * Animates an element, typically on intersection.
     * @param {HTMLElement} element - The element to animate.
     */
    animateElement(element) {
        if (element.classList.contains('animated') && (element.dataset.animateOnce === 'true' || element.classList.contains('animate-once') || element.dataset.aosOnce === 'true')) return; 
        if (this.performance.isLowPerformance) {
            element.style.opacity = '1'; element.style.transform = 'none';
            element.classList.add('animated'); 
            if (element.classList.contains('stat-number') && element.dataset.target) element.textContent = element.dataset.target; 
            return;
        }
        const animationType = element.dataset.aos || element.dataset.animation || 'fadeInUp';
        const delay = parseInt(element.dataset.aosDelay || element.dataset.delay) || 0;
        
        const animationKey = `anim-${element.id || element.dataset.aos || Math.random().toString(36).substring(2)}`;
        const existingTimeoutId = this.animations.get(animationKey);
        if (existingTimeoutId) clearTimeout(existingTimeoutId);

        const timeoutId = setTimeout(() => {
            element.classList.add('aos-animate', 'animate-in', animationType, 'animated'); 
            this.animations.delete(animationKey); 
            if (element.classList.contains('stat-number') && element.dataset.target) this.animateCounter(element);
        }, delay);
        this.animations.set(animationKey, timeoutId); 
    }

    /**
     * Animates a counter from an initial value to a target value.
     * @param {HTMLElement} element - The element containing the counter.
     */
    animateCounter(element) {
        if (this.performance.isLowPerformance) { element.textContent = element.dataset.target || 'N/A'; return; }
        
        const targetValue = element.dataset.target;
        if (targetValue === '∞') { element.textContent = '∞'; return; }

        const target = parseInt(targetValue);
        if (isNaN(target)) { element.textContent = targetValue || 'N/A'; return; }
        
        const duration = parseInt(element.dataset.duration) || 1500; 
        const startTimestamp = performance.now();
        let initialValue = 0;
        const currentText = element.textContent.replace(/[^\d.-]/g, ''); 
        if (currentText !== '') initialValue = parseFloat(currentText);
        if (isNaN(initialValue)) initialValue = 0;

        const counterKey = `counter-${element.id || Math.random().toString(36).substring(2)}`;
        // Clear any existing animation for this counter
        if (this.animations.has(counterKey)) cancelAnimationFrame(this.animations.get(counterKey));

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTimestamp;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3); 
            let currentValue = initialValue + (target - initialValue) * easedProgress;
            if (Number.isInteger(target) && Number.isInteger(initialValue)) {
                element.textContent = String(Math.round(currentValue));
            } else {
                const precision = Math.max((String(target).split('.')[1] || '').length, (String(initialValue).split('.')[1] || '').length, 1);
                element.textContent = currentValue.toFixed(precision);
            }
            if (progress < 1) {
                const rafId = requestAnimationFrame(updateCounter);
                this.animations.set(counterKey, rafId); 
            } else {
                element.textContent = String(target); 
                this.animations.delete(counterKey);
            }
        };
        requestAnimationFrame(updateCounter);
    }

    /**
     * Updates the active state of navigation links based on the currently visible section.
     * @param {string} sectionId - The ID of the currently visible section.
     */
    updateActiveNavigation(sectionId) {
        if (!sectionId) return;
        document.querySelectorAll('.nav-menu .nav-link').forEach(link => {
            link.classList.remove('active'); link.removeAttribute('aria-current');
            const href = link.getAttribute('href');
            if (href && href === `#${sectionId}`) {
                link.classList.add('active'); link.setAttribute('aria-current', 'page');
            }
        });
    }

    /**
     * Sets up accordion functionality for all accordion sections.
     */
    setupAccordions() {
        document.querySelectorAll('.accordion-section').forEach((accordion, index) => {
            const header = accordion.querySelector('.accordion-header');
            const content = accordion.querySelector('.accordion-content');
            if (!header || !content) return;
            const contentId = content.id || `accordion-content-${index}`;
            const headerId = header.id || `accordion-header-${index}`;
            header.id = headerId; content.id = contentId;
            header.setAttribute('role', 'button'); header.setAttribute('aria-controls', contentId); header.tabIndex = 0; 
            content.setAttribute('role', 'region'); content.setAttribute('aria-labelledby', headerId);
            
            const isOpenByDefault = header.getAttribute('aria-expanded') === 'true' || accordion.dataset.openByDefault === 'true'; 
            if (isOpenByDefault) this.openAccordion(header, content, true); 
            else this.closeAccordion(header, content, true); 

            const toggleHandler = () => this.toggleAccordion(header, content);
            this._addEventListener(header, 'click', toggleHandler, `accordionClick-${headerId}`);
            this._addEventListener(header, 'keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleHandler(); }
            }, `accordionKeydown-${headerId}`);
        });
    }

    /**
     * Opens an accordion item.
     * @param {HTMLElement} header - The header element of the accordion.
     * @param {HTMLElement} content - The content element of the accordion.
     * @param {boolean} [initialSetup=false] - True if called during initial setup.
     */
    openAccordion(header, content, initialSetup = false) {
        header.classList.add('active'); header.setAttribute('aria-expanded', 'true');
        content.classList.add('active'); content.setAttribute('aria-hidden', 'false');
        content.hidden = false; 
        requestAnimationFrame(() => { 
            const innerContent = content.firstElementChild; 
            const contentHeight = (innerContent || content).scrollHeight;
            if (initialSetup || this.performance.isLowPerformance) {
                content.style.maxHeight = `${contentHeight}px`; content.style.transition = 'none'; 
                requestAnimationFrame(() => content.style.transition = ''); 
            } else {
                content.style.maxHeight = `${contentHeight}px`;
            }
        });
    }

    /**
     * Closes an accordion item.
     * @param {HTMLElement} header - The header element of the accordion.
     * @param {HTMLElement} content - The content element of the accordion.
     * @param {boolean} [initialSetup=false] - True if called during initial setup.
     */
    closeAccordion(header, content, initialSetup = false) {
        header.classList.remove('active'); header.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = '0px';
        const onTransitionEnd = () => {
            content.classList.remove('active'); content.setAttribute('aria-hidden', 'true');
            content.hidden = true;
            content.removeEventListener('transitionend', onTransitionEnd);
        };
        if (initialSetup || this.performance.isLowPerformance) {
            content.style.transition = 'none'; onTransitionEnd(); 
            requestAnimationFrame(() => content.style.transition = '');
        } else {
            content.addEventListener('transitionend', onTransitionEnd, { once: true });
            setTimeout(() => { 
                if (header.getAttribute('aria-expanded') === 'false') onTransitionEnd();
            }, 550); 
        }
    }

    /**
     * Sets up tab functionality for all tab components.
     */
    setupTabs() {
        document.querySelectorAll('.tabs-component').forEach(tabsComponent => { 
            const tabList = tabsComponent.querySelector('[role="tablist"].feature-categories');
            const panelsContainer = tabsComponent.querySelector('.tab-panels-container'); 
            if (!tabList || !panelsContainer) return;
            const tabs = Array.from(tabList.querySelectorAll('[role="tab"]'));
            const tabPanels = Array.from(panelsContainer.querySelectorAll('[role="tabpanel"]'));
            if (tabs.length === 0 || tabs.length !== tabPanels.length) return;
            tabs.forEach((tab, index) => {
                if (!tab.id) tab.id = `tab-${index}-${Math.random().toString(36).substr(2, 5)}`;
                if (!tabPanels[index].id) tabPanels[index].id = `panel-${index}-${Math.random().toString(36).substr(2, 5)}`;
                tab.setAttribute('aria-controls', tabPanels[index].id);
                tabPanels[index].setAttribute('aria-labelledby', tab.id);
                const switchHandler = () => this.switchTab(tab, tabs, tabPanels);
                this._addEventListener(tab, 'click', switchHandler, `tabClick-${tab.id}`);
                this._addEventListener(tab, 'keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); switchHandler(); }
                }, `tabKeydown-${tab.id}`);
            });
            this._addEventListener(tabList, 'keydown', (e) => {
                 this.handleTabArrowNavigation(e, tabList, tabs, tabPanels);
            }, `tabListKeydown-${tabList.id || 'tabs'}`);
            let activeTabIndex = tabs.findIndex(t => t.classList.contains('active') || t.getAttribute('aria-selected') === 'true');
            if (activeTabIndex === -1) activeTabIndex = 0;
            this.switchTab(tabs[activeTabIndex], tabs, tabPanels, true); 
        });
    }
    
    /**
     * Handles arrow key navigation for tabs.
     * @param {KeyboardEvent} e - The keydown event.
     * @param {HTMLElement} tabList - The tablist element.
     * @param {HTMLElement[]} tabs - Array of tab elements.
     * @param {HTMLElement[]} tabPanels - Array of tab panel elements.
     */
    handleTabArrowNavigation(e, tabList, tabs, tabPanels) {
        const currentTab = e.target.closest('[role="tab"]'); if (!currentTab) return;
        let currentIndex = tabs.indexOf(currentTab); let newIndex = currentIndex;
        const numTabs = tabs.length;
        switch (e.key) {
            case 'ArrowLeft': case 'ArrowUp': e.preventDefault(); newIndex = (currentIndex - 1 + numTabs) % numTabs; break;
            case 'ArrowRight': case 'ArrowDown': e.preventDefault(); newIndex = (currentIndex + 1) % numTabs; break;
            case 'Home': e.preventDefault(); newIndex = 0; break;
            case 'End': e.preventDefault(); newIndex = numTabs - 1; break;
            default: return;
        }
        if (newIndex !== currentIndex) {
            tabs[newIndex].focus(); 
        }
    }

    /**
     * Sets up event listeners for modal triggers.
     */
    setupModals() {
        // Example: Trigger for a demo modal (if a button with this class exists)
        // document.querySelectorAll('.trigger-demo-modal').forEach(button => {
        //     this._addEventListener(button, 'click', () => {
        //         this.showDemoModal();
        //     }, `demoModalTrigger-${button.id || Math.random().toString(36).substring(2)}`);
        // });
        this._addEventListener(document, 'keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal-overlay.show');
                if (openModal) this.closeModal(openModal.id);
            }
        }, 'globalModalEscape');
    }

    /**
     * Closes a modal dialog.
     * @param {string} [modalIdToClose] - The ID of the modal to close. If null, closes any open modal.
     */
    closeModal(modalIdToClose) {
        const modal = modalIdToClose ? document.getElementById(modalIdToClose) : document.querySelector('.modal-overlay.show');
        if (!modal) return;
        const modalId = modal.id; 
        modal.classList.remove('show'); modal.classList.add('closing'); 
        document.body.classList.remove('modal-open');
        this.playSound('modal_close');
        if (this.lastFocusedElementBeforeModal && typeof this.lastFocusedElementBeforeModal.focus === 'function') {
            this.lastFocusedElementBeforeModal.focus(); this.lastFocusedElementBeforeModal = null;
        }
        
        const transitionEndHandler = () => {
            modal.removeEventListener('transitionend', transitionEndHandler); // Clean up listener
            modal.remove();
            this._removeEventListener(`modalCloseBtn-${modalId}`);
            this._removeEventListener(`modalOverlayClick-${modalId}`);
            modal.querySelectorAll('.modal-actions [data-action-index]').forEach((btn, index) => {
                this._removeEventListener(`modalAction-${modalId}-${index}`);
            });
        };
        modal.addEventListener('transitionend', transitionEndHandler, { once: true });
        setTimeout(() => { if (modal.parentNode) transitionEndHandler(); }, 500); 
        this.currentModalFocusableElements = [];
    }

    /**
     * Scrolls to the newsletter form section.
     */
    scrollToNewsletter() {
        const newsletterForm = document.getElementById('newsletterForm'); 
        const targetElement = newsletterForm || document.querySelector('.newsletter-section'); // Fallback
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: this.performance.isLowPerformance ? 'auto' : 'smooth', block: 'center' });
            setTimeout(() => {
                targetElement.querySelector('input[type="email"]')?.focus({preventScroll: true});
            }, 800); 
        }
    }

    /**
     * Sets up form handling, including newsletter and email copying.
     */
    setupForms() {
        const newsletterForm = document.getElementById('newsletterForm'); 
        if (newsletterForm) this.setupNewsletterForm(newsletterForm);
        document.querySelectorAll('.email-link[data-email]').forEach(button => {
            const email = button.dataset.email;
            if (email) {
                const buttonId = button.id || `emailLink-${Math.random().toString(36).substring(2)}`;
                this._addEventListener(button, 'click', () => this.copyToClipboard(email, 'Email адресу'), `copyEmail-${buttonId}`);
            }
        });
    }
    
    /**
     * Shows an error message for a form field.
     * @param {string} message - The error message.
     * @param {HTMLElement} [errorElement] - The element to display the error message.
     * @param {HTMLElement} [inputElement] - The input element associated with the error.
     */
    showError(message, errorElement, inputElement) {
        if (errorElement) {
            errorElement.textContent = message; errorElement.style.display = 'block'; 
        }
        inputElement?.setAttribute('aria-invalid', 'true'); inputElement?.classList.add('input-error');
        this.showToast(message, 'error', 5000); 
    }

    /**
     * Clears an error message for a form field.
     * @param {HTMLElement} [errorElement] - The error message element.
     * @param {HTMLElement} [inputElement] - The input element.
     */
    clearError(errorElement, inputElement) {
        if (errorElement) {
            errorElement.textContent = ''; errorElement.style.display = 'none';
        }
        inputElement?.removeAttribute('aria-invalid'); inputElement?.classList.remove('input-error');
    }

    /**
     * Submits newsletter signup data (simulated).
     * @param {object} data - The form data.
     * @returns {Promise<object>} A promise that resolves or rejects with the submission status.
     * @async
     */
    async submitNewsletterSignup(data) {
        console.log('Submitting newsletter data:', data); 
        return new Promise((resolve, reject) => { 
            setTimeout(() => {
                if (data.email && data.email.includes('fail')) { 
                     reject(new Error('Симульована помилка: ця email адреса не може бути підписана.'));
                } else if (Math.random() > 0.05) { 
                    resolve({ success: true, message: "Successfully subscribed!" });
                } else {
                    reject(new Error('Симульована помилка мережі під час підписки.'));
                }
            }, 1200);
        });
    }

    /**
     * Validates an email address.
     * @param {string} email - The email address to validate.
     * @returns {boolean} True if the email is valid, false otherwise.
     */
    validateEmail(email) {
        if (!email || typeof email !== 'string') return false;
        const emailRegex = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
        return emailRegex.test(String(email).toLowerCase());
    }

    /**
     * Gets an icon for a toast message based on its type.
     * @param {string} type - The toast type.
     * @returns {string} The icon character.
     */
    getToastIcon(type) {
        const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
        return icons[type] || icons.info;
    }

    /**
     * Removes a toast notification.
     * @param {HTMLElement} toast - The toast element to remove.
     */
    removeToast(toast) {
        if (!toast || !toast.parentNode) return;
        const toastId = toast.id;
        
        const timeoutKey = `toastTimeout-${toastId}`;
        if (this.animations.has(timeoutKey)) {
            clearTimeout(this.animations.get(timeoutKey));
            this.animations.delete(timeoutKey);
        }
        this._removeEventListener(`toastClose-${toastId}`);

        toast.classList.remove('show'); toast.classList.add('removing');
        const transitionEndHandler = () => toast.remove();
        toast.addEventListener('transitionend', transitionEndHandler, { once: true });
        setTimeout(() => { if (toast.parentNode) transitionEndHandler(); }, 500); 
    }

    /**
     * Gets or creates the toast container element.
     * @returns {HTMLElement} The toast container element.
     */
    getOrCreateToastContainer() {
        let container = document.getElementById('toast-container-ggenius'); 
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container-ggenius';
            container.className = 'toast-container'; 
            container.setAttribute('aria-live', 'polite');
            document.body.appendChild(container);
        }
        return container;
    }
    
    /**
     * Sets up various user interactions like hover effects, animations, and keyboard navigation.
     * @async
     */
    async setupInteractions() {
        this.setupFeatureCardInteractions();
        const animatedLogoElement = document.querySelector('#ggeniusAnimatedLogo'); // Check if this ID exists in HTML
        if (animatedLogoElement) {
            this.setupLogoAnimation(animatedLogoElement);
        }
        
        this.setupSmoothScrolling(); 
        this.setupKeyboardNavigation(); 
        this.setupContextMenu(); 
    }

    /**
     * Creates a ripple effect on an element.
     * @param {HTMLElement} element - The element to apply the ripple to.
     * @param {MouseEvent} event - The click event.
     */
    createRippleEffect(element, event) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect'; 
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 1.5; 
        const x = event.clientX - rect.left - (size / 2);
        const y = event.clientY - rect.top - (size / 2);
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`; ripple.style.top = `${y}px`;
        if (getComputedStyle(element).position === 'static') element.style.position = 'relative'; 
        element.style.overflow = 'hidden'; 
        element.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
        setTimeout(() => { if (ripple.parentNode) ripple.remove(); }, 700); 
    }

    /**
     * Sets up animation for a logo element on intersection.
     * @param {HTMLElement} logoElement - The logo element to animate.
     */
    setupLogoAnimation(logoElement) { 
        if (!logoElement || this.performance.isLowPerformance) return;
        const animateLogo = () => logoElement.classList.add('animate-logo-active'); 
        const logoObserverKey = `logoAnimationObserver-${logoElement.id || 'logo'}`;
        const logoObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateLogo(); observer.unobserve(entry.target);
                    this.observers.delete(logoObserverKey);
                }
            });
        }, { threshold: 0.2 });
        logoObserver.observe(logoElement); this.observers.set(logoObserverKey, logoObserver);
    }

    /**
     * Sets up smooth scrolling for anchor links.
     */
    setupSmoothScrolling() {
        this._addEventListener(document, 'click', (e) => {
            const anchor = e.target.closest('a[href^="#"]'); if (!anchor) return;
            const targetId = anchor.getAttribute('href');
            if (targetId && targetId.length > 1 && targetId !== '#') { 
                const targetElement = document.getElementById(targetId.substring(1));
                if (targetElement) {
                    e.preventDefault(); this.smoothScrollTo(targetId);
                    if (anchor.closest('.nav-menu.open') && this.mobileToggle?.getAttribute('aria-expanded') === 'true') {
                        this.toggleMobileMenu(false); 
                    }
                }
            }
        }, 'smoothScrollGlobalClick');
    }
    
    /**
     * Smoothly scrolls to a target element.
     * @param {string} targetIdFull - The full href attribute (e.g., "#sectionId").
     */
    smoothScrollTo(targetIdFull) { 
        const targetElement = document.getElementById(targetIdFull.substring(1));
        if (!targetElement) return;
        const headerOffset = this.header?.offsetHeight || 60; 
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset - 15; 
        window.scrollTo({ top: offsetPosition, behavior: this.performance.isLowPerformance ? 'auto' : 'smooth' });
        if (history.pushState) history.pushState(null, null, targetIdFull);
    }

    /**
     * Sets up global keyboard navigation listeners (e.g., for modals).
     */
    setupKeyboardNavigation() {
        this._addEventListener(document, 'keydown', (e) => {
            const openModal = document.querySelector('.modal-overlay.show');
            if (e.key === 'Tab' && openModal && this.currentModalFocusableElements?.length > 0) {
                this.handleModalTabTrap(e); 
            }
        }, 'globalKeydownNav');
    }
    
    /**
     * Handles Tab key trapping within an open modal.
     * @param {KeyboardEvent} e - The keydown event.
     */
    handleModalTabTrap(e) { 
        if (!this.currentModalFocusableElements || this.currentModalFocusableElements.length === 0) return;
        const firstEl = this.currentModalFocusableElements[0];
        const lastEl = this.currentModalFocusableElements[this.currentModalFocusableElements.length - 1];
        if (e.shiftKey) { 
            if (document.activeElement === firstEl) { lastEl.focus(); e.preventDefault(); }
        } else { 
            if (document.activeElement === lastEl) { firstEl.focus(); e.preventDefault(); }
        }
    }

    /**
     * Sets up custom context menu functionality.
     */
    setupContextMenu() {
        this._addEventListener(document, 'contextmenu', (e) => {
            const interactiveTarget = e.target.closest('.feature-card-iui, [data-allow-contextmenu], section[id], article[id]');
            if (interactiveTarget) {
                e.preventDefault(); this.showContextMenu(e, interactiveTarget);
            }
        }, 'globalContextMenu');
        const hideMenuHandler = (e) => {
            if (!e.target.closest('.context-menu-ggenius')) this.hideContextMenu();
        };
        this._addEventListener(document, 'click', hideMenuHandler, 'globalContextMenuHideClick');
        this._addEventListener(document, 'keydown', (e) => {
            if (e.key === 'Escape') this.hideContextMenu();
        }, 'globalContextMenuHideKey');
    }

    /**
     * Hides the custom context menu.
     */
    hideContextMenu() {
        const existingMenu = document.querySelector('.context-menu-ggenius');
        if (existingMenu) {
            this._removeEventListener(`contextMenuItemClick-${existingMenu.id}`);
            this._removeEventListener(`contextMenuItemKeydown-${existingMenu.id}`);
            existingMenu.remove();
        }
    }
    
    /**
     * Shares content using the Web Share API or falls back to clipboard copy.
     * @param {string} title - The title of the content to share.
     * @param {string} text - The text description for sharing.
     * @param {string} url - The URL to share.
     * @async
     */
    async shareContent(title, text, url) {
        const shareData = { title, text, url };
        try {
            if (navigator.share && navigator.canShare?.(shareData)) { 
                await navigator.share(shareData);
                this.showToast('Контент успішно поширено!', 'success');
            } else { 
                await this.copyToClipboard(url, 'Посилання');
                this.showToast('Посилання скопійовано. Поділіться ним вручну!', 'info', 5000);
            }
        } catch (error) {
            if (error.name !== 'AbortError') { 
                console.error('Share API failed:', error);
                this.showToast('Не вдалося поділитися контентом.', 'error');
            }
        }
    }
    
    /**
     * Sets up advanced features like PWA, Service Worker, and preloading.
     * @async
     */
    async setupAdvancedFeatures() {
        if (!this.performance.isLowPerformance) this.preloadResources();
        if ('serviceWorker' in navigator && window.isSecureContext) this.setupServiceWorker();
        this.setupInstallPrompt();
    }

    /**
     * Sets up the Service Worker.
     * @async
     */
    async setupServiceWorker() {
        const swPath = '/sw.js'; // Ensure sw.js is at the root for scope '/'
        try {
            const registration = await navigator.serviceWorker.register(swPath, { scope: '/' });
            console.log('✅ ServiceWorker registered. Scope:', registration.scope);
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                if (newWorker) {
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateAvailable(registration);
                        }
                    });
                }
            });
        } catch (error) {
            console.error('🔥 ServiceWorker registration failed:', error);
        }
        let refreshing;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (refreshing) return;
            window.location.reload(); refreshing = true;
        });
    }

    /**
     * Shows a toast notification when a Service Worker update is available.
     * @param {ServiceWorkerRegistration} registration - The Service Worker registration object.
     */
    showUpdateAvailable(registration) {
        const toastId = `updateToast-${Date.now()}`;
        const toast = this.showToast('Доступна нова версія GGenius! Оновити?', 'info', 0); 
        if (!toast) return; // In case toast creation failed
        toast.id = toastId;
        const toastContent = toast.querySelector('.toast-content');
        if (toastContent) {
            const updateButton = document.createElement('button');
            updateButton.textContent = 'Оновити';
            updateButton.className = 'toast-action button-primary cta-button primary-cta'; 
            updateButton.style.marginLeft = '1em';
            this._addEventListener(updateButton, 'click', () => {
                this.removeToast(toast);
                if (registration.waiting) {
                    registration.waiting.postMessage({ type: 'SKIP_WAITING' }); 
                }
            }, `swUpdateBtn-${toastId}`);
            toastContent.appendChild(updateButton);
        }
    }

    /**
     * Sets up the PWA install prompt.
     */
    setupInstallPrompt() {
        let deferredInstallPrompt = null;
        this._addEventListener(window, 'beforeinstallprompt', (e) => {
            e.preventDefault(); deferredInstallPrompt = e;
            this.showInstallBanner(deferredInstallPrompt);
            console.log('🤝 `beforeinstallprompt` event fired.');
        }, 'beforeInstallPrompt');
        this._addEventListener(window, 'appinstalled', () => {
            deferredInstallPrompt = null; console.log('🎉 GGenius PWA installed!');
            this.showToast('GGenius успішно встановлено!', 'success');
            document.querySelector('.install-banner-ggenius')?.remove();
        }, 'appInstalled');
    }

    /**
     * Placeholder for triggering entry animations not covered by IntersectionObserver.
     * Currently, IntersectionObserver handles most entry animations.
     */
    triggerEntryAnimations() {
        // This method is largely handled by IntersectionObserver now.
    }
}

// Initialize the app
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new GGeniusApp(), { once: true });
} else {
    new GGeniusApp();
}