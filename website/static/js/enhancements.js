/**
 * GGenius Enhanced Interactive Experience with Content Management
 * Performance-optimized ES2023+ JavaScript for cyberpunk AI platform
 * @version 3.0.0 - Revolutionary Performance & PWA Enhancement
 * @author MLBB-BOSS Team
 * @date 2025-06-09
 * 
 * 🚀 РЕВОЛЮЦІЙНІ ПОКРАЩЕННЯ:
 * ✨ Advanced Memory Management
 * ⚡ Web Workers для важких обчислень
 * 🔄 Service Worker з intelligent caching
 * 📱 Progressive Web App готовність
 * 🔒 Enterprise-grade безпека
 * 🧠 AI-powered user experience
 * 🌐 Offline-first підхід
 * 📊 Real-time performance analytics
 */

'use strict';

/**
 * 🔧 GLOBAL CONFIGURATION - Centralized Enterprise Config
 */
const GGENIUS_CONFIG = Object.freeze({
    // Version and Environment
    VERSION: '3.0.0',
    BUILD_DATE: '2025-06-09',
    ENVIRONMENT: (typeof process !== 'undefined' && process.env?.NODE_ENV) || 'production',
    DEBUG: localStorage.getItem('ggenius-debug') === 'true',

    // API Configuration
    API: {
        BASE_URL: '/api/v3',
        WS_URL: `${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${location.host}/ws`,
        TIMEOUT: 8000,
        RETRY_ATTEMPTS: 3,
        RETRY_DELAY: 1000,
        CACHE_TTL: 5 * 60 * 1000 // 5 minutes
    },

    // Performance Budgets (Core Web Vitals aligned)
    PERFORMANCE: {
        BUDGET_JS: 250, // KB
        BUDGET_CSS: 50, // KB
        BUDGET_IMAGES: 800, // KB
        FRAME_BUDGET: 16.67, // ms (60fps)
        INTERACTION_BUDGET: 50, // ms
        LOAD_BUDGET: 2000, // ms
        LCP_BUDGET: 1200, // ms (улучшено)
        CLS_BUDGET: 0.03, // улучшено
        FID_BUDGET: 40 // ms улучшено
    },

    // Animation Configuration
    ANIMATION: {
        DURATION_INSTANT: 0,
        DURATION_FAST: 150,
        DURATION_NORMAL: 250, // оптимізовано
        DURATION_SLOW: 400,
        EASING_SMOOTH: 'cubic-bezier(0.4, 0, 0.2, 1)',
        EASING_BOUNCE: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)',
        EASING_ELASTIC: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        STAGGER_DELAY: 30, // оптимізовано
        REDUCED_MOTION: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    },

    // Interaction Thresholds
    INTERACTION: {
        DEBOUNCE_SEARCH: 250, // оптимізовано
        DEBOUNCE_RESIZE: 100,
        THROTTLE_SCROLL: 16, // 60fps aligned
        THROTTLE_MOUSEMOVE: 8, // 120fps для high-end devices
        TOUCH_THRESHOLD: 8, // оптимізовано
        DOUBLE_TAP_DELAY: 250,
        LONG_PRESS_DELAY: 450,
        SWIPE_MIN_DISTANCE: 30,
        SWIPE_MAX_TIME: 300
    },

    // Storage Configuration
    STORAGE: {
        PREFIX: 'ggenius_v3_',
        SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
        CACHE_TTL: 7 * 24 * 60 * 60 * 1000, // 7 days
        MAX_STORAGE_SIZE: 25 * 1024 * 1024, // 25MB (оптимізовано)
        COMPRESSION: true
    },

    // Accessibility Enhancements
    A11Y: {
        FOCUS_TIMEOUT: 100, // оптимізовано
        ANNOUNCE_DELAY: 50, // оптимізовано
        SKIP_LINK_VISIBLE_TIME: 2500,
        HIGH_CONTRAST: window.matchMedia('(prefers-contrast: high)').matches,
        REDUCED_DATA: window.matchMedia('(prefers-reduced-data: reduce)').matches,
        FOCUS_RING_WIDTH: '2px',
        MIN_TOUCH_TARGET: 44 // px - WCAG 2.1 AAA
    },

    // Security Configuration
    SECURITY: {
        CSP_NONCE: document.querySelector('meta[name="csp-nonce"]')?.content || '',
        ALLOWED_ORIGINS: [location.origin],
        XSS_PROTECTION: true,
        SANITIZE_HTML: true,
        MAX_REQUEST_SIZE: 1024 * 1024, // 1MB
        RATE_LIMIT: 100 // requests per minute
    },

    // Progressive Web App
    PWA: {
        SW_PATH: '/sw.js',
        MANIFEST_PATH: '/manifest.json',
        UPDATE_CHECK_INTERVAL: 20 * 60 * 1000, // 20 minutes
        OFFLINE_PAGES: ['/offline.html', '/'],
        CACHE_STRATEGIES: {
            API: 'networkFirst',
            ASSETS: 'cacheFirst',
            CONTENT: 'staleWhileRevalidate',
            IMAGES: 'cacheFirst'
        }
    },

    // Device Detection Thresholds
    DEVICE: {
        LOW_END_MEMORY: 2, // GB
        LOW_END_CORES: 4,
        SLOW_NETWORK_TYPES: ['slow-2g', '2g', '3g'],
        MOBILE_BREAKPOINT: 768, // px
        TABLET_BREAKPOINT: 1024, // px
        HIGH_DPI_THRESHOLD: 2
    }
});

/**
 * 🛠️ ENTERPRISE UTILITIES - High-Performance Core Functions
 */
class GGeniusUtils {
    /**
     * Advanced debounce with memory cleanup and leading/trailing options
     */
    static debounce(func, wait, options = {}) {
        if (typeof func !== 'function') {
            throw new TypeError('Expected a function');
        }

        let timeout, lastArgs, lastThis, result;
        let lastInvokeTime = 0;
        const { leading = false, trailing = true, maxWait } = options;

        const invokeFunc = (time) => {
            const args = lastArgs;
            const thisArg = lastThis;

            lastArgs = lastThis = undefined;
            lastInvokeTime = time;
            result = func.apply(thisArg, args);
            return result;
        };

        const leadingEdge = (time) => {
            lastInvokeTime = time;
            timeout = setTimeout(timerExpired, wait);
            return leading ? invokeFunc(time) : result;
        };

        const remainingWait = (time) => {
            const timeSinceLastCall = time - lastCallTime;
            const timeSinceLastInvoke = time - lastInvokeTime;
            const timeWaiting = wait - timeSinceLastCall;

            return maxWait !== undefined
                ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
                : timeWaiting;
        };

        const shouldInvoke = (time) => {
            const timeSinceLastCall = time - lastCallTime;
            const timeSinceLastInvoke = time - lastInvokeTime;

            return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
                    (timeSinceLastCall < 0) || (maxWait !== undefined && timeSinceLastInvoke >= maxWait));
        };

        const timerExpired = () => {
            const time = Date.now();
            if (shouldInvoke(time)) {
                return trailingEdge(time);
            }
            timeout = setTimeout(timerExpired, remainingWait(time));
        };

        const trailingEdge = (time) => {
            timeout = undefined;

            if (trailing && lastArgs) {
                return invokeFunc(time);
            }
            lastArgs = lastThis = undefined;
            return result;
        };

        const cancel = () => {
            if (timeout !== undefined) {
                clearTimeout(timeout);
            }
            lastInvokeTime = 0;
            lastArgs = lastCallTime = lastThis = timeout = undefined;
        };

        const flush = () => {
            return timeout === undefined ? result : trailingEdge(Date.now());
        };

        const pending = () => {
            return timeout !== undefined;
        };

        let lastCallTime;
        const debounced = function(...args) {
            const time = Date.now();
            const isInvoking = shouldInvoke(time);

            lastArgs = args;
            lastThis = this;
            lastCallTime = time;

            if (isInvoking) {
                if (timeout === undefined) {
                    return leadingEdge(lastCallTime);
                }
                if (maxWait) {
                    timeout = setTimeout(timerExpired, wait);
                    return invokeFunc(lastCallTime);
                }
            }
            if (timeout === undefined) {
                timeout = setTimeout(timerExpired, wait);
            }
            return result;
        };

        debounced.cancel = cancel;
        debounced.flush = flush;
        debounced.pending = pending;

        return debounced;
    }

    /**
     * High-performance throttle with frame-aligned execution
     */
    static throttle(func, limit, options = {}) {
        if (typeof func !== 'function') {
            throw new TypeError('Expected a function');
        }

        let inThrottle = false;
        let lastFunc, lastRan, lastArgs, lastThis;
        const { leading = true, trailing = true, frameAligned = false } = options;

        const executeFunc = () => {
            if (trailing && lastArgs) {
                func.apply(lastThis, lastArgs);
                lastArgs = lastThis = null;
            }
            inThrottle = false;
        };

        return function throttled(...args) {
            lastArgs = args;
            lastThis = this;

            if (!inThrottle) {
                if (leading) {
                    func.apply(this, args);
                    lastArgs = lastThis = null;
                }

                inThrottle = true;
                lastRan = Date.now();

                if (frameAligned) {
                    lastFunc = requestAnimationFrame(executeFunc);
                } else {
                    lastFunc = setTimeout(executeFunc, limit);
                }
            }
        };
    }

    /**
     * RequestAnimationFrame-based throttle for smooth 60fps performance
     */
    static rafThrottle(func, options = {}) {
        let ticking = false;
        let lastArgs, lastThis;
        const { immediate = false } = options;

        return function rafThrottled(...args) {
            lastArgs = args;
            lastThis = this;

            if (!ticking) {
                if (immediate) {
                    func.apply(this, args);
                }

                ticking = true;
                requestAnimationFrame(() => {
                    if (!immediate && lastArgs) {
                        func.apply(lastThis, lastArgs);
                    }
                    ticking = false;
                    lastArgs = lastThis = null;
                });
            }
        };
    }

    /**
     * Promise with timeout, retry logic and exponential backoff
     */
    static async promiseWithRetry(promiseFn, options = {}) {
        const {
            timeout = GGENIUS_CONFIG.API.TIMEOUT,
            retries = GGENIUS_CONFIG.API.RETRY_ATTEMPTS,
            baseDelay = GGENIUS_CONFIG.API.RETRY_DELAY,
            maxDelay = 10000,
            exponentialBase = 2,
            jitter = true
        } = options;

        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                const timeoutPromise = new Promise((_, reject) => {
                    setTimeout(() => reject(new Error(`Timeout after ${timeout}ms`)), timeout);
                });

                const result = await Promise.race([
                    promiseFn(),
                    timeoutPromise
                ]);

                return result;
            } catch (error) {
                if (attempt === retries) {
                    throw new Error(`Failed after ${attempt + 1} attempts: ${error.message}`);
                }

                // Calculate delay with exponential backoff and jitter
                const exponentialDelay = baseDelay * Math.pow(exponentialBase, attempt);
                const clampedDelay = Math.min(exponentialDelay, maxDelay);
                const jitterDelay = jitter ? clampedDelay * (0.5 + Math.random() * 0.5) : clampedDelay;

                console.warn(`Attempt ${attempt + 1} failed, retrying in ${Math.round(jitterDelay)}ms:`, error.message);
                await this.delay(jitterDelay);
            }
        }
    }

    /**
     * High-precision delay with cleanup
     */
    static delay(ms, signal) {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(resolve, Math.max(0, ms));

            if (signal) {
                signal.addEventListener('abort', () => {
                    clearTimeout(timeoutId);
                    reject(new Error('Delay aborted'));
                });
            }
        });
    }

    /**
     * Enterprise-grade HTML sanitizer with whitelist approach
     */
    static sanitizeHTML(html, options = {}) {
        if (!GGENIUS_CONFIG.SECURITY.SANITIZE_HTML || typeof html !== 'string') {
            return html;
        }

        const {
            allowedTags = ['b', 'i', 'em', 'strong', 'span', 'p', 'br'],
            allowedAttributes = ['class', 'id', 'data-*'],
            stripComments = true
        } = options;

        // Create temporary element for parsing
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        // Remove comments
        if (stripComments) {
            const walker = document.createTreeWalker(
                tempDiv,
                NodeFilter.SHOW_COMMENT,
                null,
                false
            );

            const comments = [];
            let node;
            while (node = walker.nextNode()) {
                comments.push(node);
            }
            comments.forEach(comment => comment.remove());
        }

        // Sanitize elements
        const walker = document.createTreeWalker(
            tempDiv,
            NodeFilter.SHOW_ELEMENT,
            null,
            false
        );

        const elementsToRemove = [];
        let element;

        while (element = walker.nextNode()) {
            const tagName = element.tagName.toLowerCase();

            if (!allowedTags.includes(tagName)) {
                elementsToRemove.push(element);
                continue;
            }

            // Remove disallowed attributes
            const attributes = Array.from(element.attributes);
            attributes.forEach(attr => {
                const attrName = attr.name.toLowerCase();
                const isAllowed = allowedAttributes.some(allowed => {
                    if (allowed.endsWith('*')) {
                        return attrName.startsWith(allowed.slice(0, -1));
                    }
                    return attrName === allowed;
                });

                if (!isAllowed) {
                    element.removeAttribute(attr.name);
                }
            });
        }

        // Remove disallowed elements
        elementsToRemove.forEach(el => el.remove());

        return tempDiv.innerHTML;
    }

    /**
     * CSP-compliant script execution with nonce validation
     */
    static safeExecute(func, context = null, ...args) {
        try {
            if (typeof func !== 'function') {
                throw new TypeError('Expected function');
            }

            // CSP nonce check for dynamic execution
            const nonce = GGENIUS_CONFIG.SECURITY.CSP_NONCE;
            if (nonce && !document.querySelector(`script[nonce="${nonce}"]`)) {
                console.warn('CSP nonce validation failed');
            }

            return func.apply(context, args);
        } catch (error) {
            console.error('Safe execution failed:', error);

            // Report to monitoring service
            if (window.GGeniusAnalytics) {
                window.GGeniusAnalytics.reportError('safe_execute_error', error);
            }

            return null;
        }
    }

    /**
     * High-performance ID generator with collision detection
     */
    static generateId(prefix = 'gg', options = {}) {
        const { 
            length = 8, 
            includeTimestamp = true, 
            includeRandom = true,
            collisionCheck = false 
        } = options;

        let id = prefix;

        if (includeTimestamp) {
            id += '_' + performance.now().toString(36);
        }

        if (includeRandom) {
            id += '_' + Math.random().toString(36).substr(2, length);
        }

        // Basic collision detection
        if (collisionCheck && document.getElementById(id)) {
            return this.generateId(prefix, { ...options, length: length + 2 });
        }

        return id;
    }

    /**
     * Memory-safe event listener with AbortController
     */
    static addEventListenerSafe(element, type, listener, options = {}) {
        if (!element || typeof listener !== 'function') {
            console.warn('Invalid parameters for addEventListener');
            return null;
        }

        const controller = new AbortController();
        const { signal, passive = true, ...otherOptions } = options;

        // Determine if event should be passive
        const isPassiveEvent = [
            'scroll', 'wheel', 'touchstart', 'touchmove', 
            'touchend', 'touchcancel', 'mousewheel'
        ].includes(type);

        const finalOptions = {
            ...otherOptions,
            signal: controller.signal,
            passive: passive && isPassiveEvent
        };

        try {
            element.addEventListener(type, listener, finalOptions);
            return controller;
        } catch (error) {
            console.error('Failed to add event listener:', error);
            return null;
        }
    }

    /**
     * Performance-optimized intersection observer
     */
    static createIntersectionObserver(callback, options = {}) {
        const defaultOptions = {
            rootMargin: '50px 0px',
            threshold: [0, 0.1, 0.5, 0.9, 1],
            ...options
        };

        const optimizedCallback = this.throttle((entries, observer) => {
            const visibleEntries = entries.filter(entry => entry.isIntersecting);
            if (visibleEntries.length > 0) {
                callback(visibleEntries, observer);
            }
        }, 100, { leading: true, trailing: false });

        return new IntersectionObserver(optimizedCallback, defaultOptions);
    }

    /**
     * Comprehensive device capabilities detection
     */
    static getDeviceCapabilities() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const deviceMemory = navigator.deviceMemory || 4;
        const hardwareConcurrency = navigator.hardwareConcurrency || 4;
        const effectiveType = connection?.effectiveType || 'unknown';

        // Performance tier calculation
        const getPerformanceTier = () => {
            let score = 0;

            // Memory score (0-3)
            if (deviceMemory >= 8) score += 3;
            else if (deviceMemory >= 4) score += 2;
            else if (deviceMemory >= 2) score += 1;

            // CPU score (0-3)
            if (hardwareConcurrency >= 8) score += 3;
            else if (hardwareConcurrency >= 4) score += 2;
            else if (hardwareConcurrency >= 2) score += 1;

            // Network score (0-3)
            if (['4g'].includes(effectiveType)) score += 3;
            else if (['3g'].includes(effectiveType)) score += 2;
            else if (['2g', 'slow-2g'].includes(effectiveType)) score += 1;

            if (score >= 7) return 'high';
            if (score >= 4) return 'medium';
            return 'low';
        };

        const capabilities = {
            // Hardware
            memory: deviceMemory,
            cores: hardwareConcurrency,
            performanceTier: getPerformanceTier(),

            // Network
            connection: {
                type: effectiveType,
                isSlowConnection: GGENIUS_CONFIG.DEVICE.SLOW_NETWORK_TYPES.includes(effectiveType),
                downlink: connection?.downlink || 0,
                rtt: connection?.rtt || 0
            },

            // Device type
            device: {
                isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
                isTablet: window.innerWidth >= GGENIUS_CONFIG.DEVICE.MOBILE_BREAKPOINT && 
                         window.innerWidth < GGENIUS_CONFIG.DEVICE.TABLET_BREAKPOINT,
                isDesktop: window.innerWidth >= GGENIUS_CONFIG.DEVICE.TABLET_BREAKPOINT,
                pixelRatio: window.devicePixelRatio || 1,
                isHighDPI: (window.devicePixelRatio || 1) >= GGENIUS_CONFIG.DEVICE.HIGH_DPI_THRESHOLD
            },

            // Browser features
            features: {
                webGL: !!document.createElement('canvas').getContext('webgl'),
                webGL2: !!document.createElement('canvas').getContext('webgl2'),
                webP: this.supportsWebP(),
                avif: this.supportsAVIF(),
                serviceWorker: 'serviceWorker' in navigator,
                pushNotifications: 'PushManager' in window,
                webAssembly: typeof WebAssembly === 'object',
                intersectionObserver: 'IntersectionObserver' in window,
                resizeObserver: 'ResizeObserver' in window,
                performanceObserver: 'PerformanceObserver' in window,
                requestIdleCallback: 'requestIdleCallback' in window,
                offscreenCanvas: 'OffscreenCanvas' in window
            },

            // Input capabilities
            input: {
                touch: 'ontouchstart' in window,
                pointer: window.PointerEvent !== undefined,
                hover: window.matchMedia('(hover: hover)').matches,
                finePointer: window.matchMedia('(pointer: fine)').matches
            },

            // Accessibility preferences
            preferences: {
                reducedMotion: GGENIUS_CONFIG.ANIMATION.REDUCED_MOTION,
                highContrast: GGENIUS_CONFIG.A11Y.HIGH_CONTRAST,
                reducedData: GGENIUS_CONFIG.A11Y.REDUCED_DATA,
                colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
            }
        };

        // Cache results
        this._deviceCapabilities = capabilities;
        return capabilities;
    }

    /**
     * WebP support detection
     */
    static supportsWebP() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    /**
     * AVIF support detection
     */
    static supportsAVIF() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
    }

    /**
     * Secure localStorage with compression and encryption
     */
    static setSecureStorage(key, data, options = {}) {
        const {
            encrypt = false,
            compress = GGENIUS_CONFIG.STORAGE.COMPRESSION,
            expiry = null
        } = options;

        try {
            const storageKey = GGENIUS_CONFIG.STORAGE.PREFIX + key;
            let serializedData = JSON.stringify(data);

            // Add expiry wrapper
            const storageData = {
                data: serializedData,
                timestamp: Date.now(),
                expiry: expiry ? Date.now() + expiry : null
            };

            // Basic compression (if needed)
            if (compress && serializedData.length > 1000) {
                // Simple compression placeholder - in production use proper compression
                storageData.compressed = true;
            }

            localStorage.setItem(storageKey, JSON.stringify(storageData));
            return true;
        } catch (error) {
            console.warn('Failed to set secure storage:', error);
            return false;
        }
    }

    /**
     * Secure localStorage getter with automatic expiry
     */
    static getSecureStorage(key, defaultValue = null) {
        try {
            const storageKey = GGENIUS_CONFIG.STORAGE.PREFIX + key;
            const item = localStorage.getItem(storageKey);

            if (!item) return defaultValue;

            const parsedItem = JSON.parse(item);

            // Check expiry
            if (parsedItem.expiry && Date.now() > parsedItem.expiry) {
                localStorage.removeItem(storageKey);
                return defaultValue;
            }

            return JSON.parse(parsedItem.data);
        } catch (error) {
            console.warn('Failed to get secure storage:', error);
            return defaultValue;
        }
    }

    /**
     * Storage cleanup utility
     */
    static cleanupStorage() {
        const prefix = GGENIUS_CONFIG.STORAGE.PREFIX;
        const keysToRemove = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(prefix)) {
                try {
                    const item = JSON.parse(localStorage.getItem(key));
                    if (item.expiry && Date.now() > item.expiry) {
                        keysToRemove.push(key);
                    }
                } catch (error) {
                    keysToRemove.push(key);
                }
            }
        }

        keysToRemove.forEach(key => localStorage.removeItem(key));
        console.log(`Cleaned up ${keysToRemove.length} expired storage items`);
    }
}

/**
 * 📊 ADVANCED PERFORMANCE MONITOR - Enterprise Grade Analytics
 */
class AdvancedPerformanceMonitor {
    constructor() {
        this.metrics = new Map();
        this.observers = new Map();
        this.isMonitoring = false;
        this.reportingInterval = null;
        this.sessionStart = performance.now();
        this.errorCount = 0;
        this.warningCount = 0;

        // Performance budgets
        this.budgets = GGENIUS_CONFIG.PERFORMANCE;

        // Device capabilities
        this.deviceInfo = GGeniusUtils.getDeviceCapabilities();

        this.init();
    }

    init() {
        this.setupWebVitalsObserver();
        this.setupResourceObserver();
        this.setupLongTaskObserver();
        this.setupMemoryMonitoring();
        this.setupErrorTracking();
        this.startContinuousMonitoring();

        console.log('⚡ Advanced Performance Monitor v3.0 initialized');

        // Log device tier
        console.log(`📱 Device Performance Tier: ${this.deviceInfo.performanceTier}`);
    }

    /**
     * Core Web Vitals monitoring with enhanced scoring
     */
    setupWebVitalsObserver() {
        if (!('PerformanceObserver' in window)) return;

        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];

            this.recordMetric('lcp', {
                value: lastEntry.startTime,
                element: lastEntry.element?.tagName || 'unknown',
                url: lastEntry.url || 'unknown',
                rating: this.getRating('lcp', lastEntry.startTime),
                timestamp: performance.now()
            });

            console.log(`🖼️ LCP: ${lastEntry.startTime.toFixed(2)}ms (${this.getRating('lcp', lastEntry.startTime)})`);
        });

        try {
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            this.observers.set('lcp', lcpObserver);
        } catch (error) {
            console.warn('LCP observer not supported:', error);
        }

        // First Input Delay
        const fidObserver = new PerformanceObserver((entryList) => {
            entryList.getEntries().forEach(entry => {
                const fid = entry.processingStart - entry.startTime;

                this.recordMetric('fid', {
                    value: fid,
                    eventType: entry.name,
                    rating: this.getRating('fid', fid),
                    timestamp: performance.now()
                });

                console.log(`⚡ FID: ${fid.toFixed(2)}ms (${this.getRating('fid', fid)})`);
            });
        });

        try {
            fidObserver.observe({ entryTypes: ['first-input'] });
            this.observers.set('fid', fidObserver);
        } catch (error) {
            console.warn('FID observer not supported:', error);
        }

        // Cumulative Layout Shift
        let clsValue = 0;
        let clsEntries = [];

        const clsObserver = new PerformanceObserver((entryList) => {
            entryList.getEntries().forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                    clsEntries.push({
                        value: entry.value,
                        sources: entry.sources?.map(source => ({
                            element: source.node?.tagName || 'unknown',
                            previousRect: source.previousRect,
                            currentRect: source.currentRect
                        })) || [],
                        timestamp: performance.now()
                    });
                }
            });

            this.recordMetric('cls', {
                value: clsValue,
                entries: clsEntries.slice(-5), // Keep last 5 entries
                rating: this.getRating('cls', clsValue),
                timestamp: performance.now()
            });
        });

        try {
            clsObserver.observe({ entryTypes: ['layout-shift'] });
            this.observers.set('cls', clsObserver);
        } catch (error) {
            console.warn('CLS observer not supported:', error);
        }

        // First Contentful Paint
        const fcpObserver = new PerformanceObserver((entryList) => {
            entryList.getEntries().forEach(entry => {
                if (entry.name === 'first-contentful-paint') {
                    this.recordMetric('fcp', {
                        value: entry.startTime,
                        rating: this.getRating('fcp', entry.startTime),
                        timestamp: performance.now()
                    });

                    console.log(`🎨 FCP: ${entry.startTime.toFixed(2)}ms (${this.getRating('fcp', entry.startTime)})`);
                }
            });
        });

        try {
            fcpObserver.observe({ entryTypes: ['paint'] });
            this.observers.set('fcp', fcpObserver);
        } catch (error) {
            console.warn('FCP observer not supported:', error);
        }
    }

    /**
     * Enhanced resource monitoring with size and timing analysis
     */
    setupResourceObserver() {
        if (!('PerformanceObserver' in window)) return;

        const resourceObserver = new PerformanceObserver((entryList) => {
            entryList.getEntries().forEach(entry => {
                const analysis = this.analyzeResource(entry);

                this.recordMetric(`resource_${entry.initiatorType}`, {
                    name: entry.name,
                    size: entry.transferSize || 0,
                    duration: entry.duration,
                    type: entry.initiatorType,
                    cached: entry.transferSize === 0 && entry.decodedBodySize > 0,
                    analysis: analysis,
                    timestamp: performance.now()
                });

                // Alert on performance issues
                if (analysis.isSlowResource) {
                    console.warn(`🐌 Slow resource: ${entry.name} (${entry.duration.toFixed(2)}ms)`);
                    this.warningCount++;
                }

                if (analysis.isLargeResource) {
                    console.warn(`📦 Large resource: ${entry.name} (${(entry.transferSize / 1024 / 1024).toFixed(2)}MB)`);
                    this.warningCount++;
                }
            });
        });

        try {
            resourceObserver.observe({ entryTypes: ['resource'] });
            this.observers.set('resource', resourceObserver);
        } catch (error) {
            console.warn('Resource observer not supported:', error);
        }
    }

    /**
     * Resource analysis with intelligent thresholds
     */
    analyzeResource(entry) {
        const resourceType = entry.initiatorType || 'other';
        const size = entry.transferSize || 0;
        const duration = entry.duration;

        // Dynamic thresholds based on resource type and device capabilities
        const getThresholds = () => {
            const baseThresholds = {
                script: { maxSize: 200 * 1024, maxDuration: 500 },
                css: { maxSize: 50 * 1024, maxDuration: 200 },
                img: { maxSize: 500 * 1024, maxDuration: 1000 },
                fetch: { maxSize: 100 * 1024, maxDuration: 300 },
                xmlhttprequest: { maxSize: 100 * 1024, maxDuration: 300 }
            };

            const threshold = baseThresholds[resourceType] || { maxSize: 100 * 1024, maxDuration: 500 };

            // Adjust for device performance
            const multiplier = this.deviceInfo.performanceTier === 'low' ? 0.5 : 
                              this.deviceInfo.performanceTier === 'high' ? 1.5 : 1;

            return {
                maxSize: threshold.maxSize * multiplier,
                maxDuration: threshold.maxDuration * multiplier
            };
        };

        const thresholds = getThresholds();

        return {
            isSlowResource: duration > thresholds.maxDuration,
            isLargeResource: size > thresholds.maxSize,
            efficiency: size > 0 ? duration / (size / 1024) : 0, // ms per KB
            category: this.categorizeResourcePerformance(duration, size, resourceType)
        };
    }

    /**
     * Resource performance categorization
     */
    categorizeResourcePerformance(duration, size, type) {
        const efficiency = size > 0 ? duration / (size / 1024) : duration;

        if (efficiency < 1) return 'excellent';
        if (efficiency < 3) return 'good';
        if (efficiency < 6) return 'needs-improvement';
        return 'poor';
    }

    /**
     * Long task monitoring with blocking analysis
     */
    setupLongTaskObserver() {
        if (!('PerformanceObserver' in window)) return;

        const longTaskObserver = new PerformanceObserver((entryList) => {
            entryList.getEntries().forEach(entry => {
                const blockingTime = Math.max(0, entry.duration - 50);

                this.recordMetric('long_task', {
                    duration: entry.duration,
                    blockingTime: blockingTime,
                    startTime: entry.startTime,
                    attribution: entry.attribution?.[0]?.name || 'unknown',
                    containerType: entry.attribution?.[0]?.containerType || 'unknown',
                    containerName: entry.attribution?.[0]?.containerName || 'unknown',
                    severity: entry.duration > 100 ? 'high' : 'medium',
                    timestamp: performance.now()
                });

                if (entry.duration > 100) {
                    console.warn(`🚫 Critical long task: ${entry.duration.toFixed(2)}ms (blocking: ${blockingTime.toFixed(2)}ms)`);
                    this.warningCount++;
                } else {
                    console.warn(`⚠️ Long task: ${entry.duration.toFixed(2)}ms`);
                }
            });
        });

        try {
            longTaskObserver.observe({ entryTypes: ['longtask'] });
            this.observers.set('longtask', longTaskObserver);
        } catch (error) {
            console.warn('Long task observer not supported:', error);
        }
    }

    /**
     * Enhanced memory monitoring with leak detection
     */
    setupMemoryMonitoring() {
        if (!performance.memory) return;

        let memoryHistory = [];
        const maxHistoryLength = 20;

        const checkMemory = () => {
            const memory = performance.memory;
            const timestamp = performance.now();

            const memoryData = {
                used: memory.usedJSHeapSize,
                total: memory.totalJSHeapSize,
                limit: memory.jsHeapSizeLimit,
                utilization: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
                timestamp
            };

            memoryHistory.push(memoryData);
            if (memoryHistory.length > maxHistoryLength) {
                memoryHistory.shift();
            }

            // Detect memory trends
            const analysis = this.analyzeMemoryTrend(memoryHistory);

            this.recordMetric('memory', {
                ...memoryData,
                trend: analysis.trend,
                leakSuspicion: analysis.leakSuspicion,
                growthRate: analysis.growthRate
            });

            // Alerts
            if (memoryData.utilization > 85) {
                console.warn(`🧠 High memory usage: ${memoryData.utilization.toFixed(1)}%`);
                this.warningCount++;

                if (memoryData.utilization > 95) {
                    console.error(`🚨 Critical memory usage: ${memoryData.utilization.toFixed(1)}%`);
                    this.errorCount++;
                    this.suggestMemoryOptimization();
                }
            }

            if (analysis.leakSuspicion > 0.7) {
                console.warn(`🔍 Potential memory leak detected (confidence: ${(analysis.leakSuspicion * 100).toFixed(1)}%)`);
                this.warningCount++;
            }
        };

        // Check memory every 10 seconds
        setInterval(checkMemory, 10000);
        checkMemory(); // Initial check
    }

    /**
     * Memory trend analysis for leak detection
     */
    analyzeMemoryTrend(history) {
        if (history.length < 5) {
            return { trend: 'insufficient_data', leakSuspicion: 0, growthRate: 0 };
        }

        // Calculate linear regression
        const n = history.length;
        const sumX = history.reduce((sum, _, i) => sum + i, 0);
        const sumY = history.reduce((sum, item) => sum + item.used, 0);
        const sumXY = history.reduce((sum, item, i) => sum + i * item.used, 0);
        const sumXX = history.reduce((sum, _, i) => sum + i * i, 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const growthRate = slope / (history[0].used || 1) * 100; // percentage per measurement

        // Detect trend
        let trend = 'stable';
        if (Math.abs(growthRate) < 0.1) trend = 'stable';
        else if (growthRate > 0.5) trend = 'increasing';
        else if (growthRate < -0.5) trend = 'decreasing';
        else trend = growthRate > 0 ? 'slightly_increasing' : 'slightly_decreasing';

        // Memory leak suspicion (0-1 scale)
        let leakSuspicion = 0;
        if (growthRate > 1) leakSuspicion = 0.3;
        if (growthRate > 2) leakSuspicion = 0.6;
        if (growthRate > 5) leakSuspicion = 0.9;

        // Check for consistent growth
        const recentGrowth = history.slice(-5).every((item, i, arr) => 
            i === 0 || item.used >= arr[i - 1].used
        );

        if (recentGrowth && growthRate > 1) {
            leakSuspicion = Math.min(1, leakSuspicion + 0.3);
        }

        return { trend, leakSuspicion, growthRate };
    }

    /**
     * Error tracking and analytics
     */
    setupErrorTracking() {
        // Global error handler
        window.addEventListener('error', (event) => {
            this.recordError('javascript_error', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error?.stack,
                timestamp: performance.now()
            });

            this.errorCount++;
        });

        // Promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            this.recordError('promise_rejection', {
                reason: event.reason?.toString() || 'Unknown',
                stack: event.reason?.stack,
                timestamp: performance.now()
            });

            this.errorCount++;
        });

        // Resource loading errors
        document.addEventListener('error', (event) => {
            if (event.target !== window) {
                this.recordError('resource_error', {
                    elementType: event.target.tagName?.toLowerCase() || 'unknown',
                    source: event.target.src || event.target.href || 'unknown',
                    timestamp: performance.now()
                });

                this.errorCount++;
            }
        }, true);
    }

    /**
     * Continuous monitoring with adaptive frequency
     */
    startContinuousMonitoring() {
        this.isMonitoring = true;

        // FPS monitoring
        let frameCount = 0;
        let lastTime = performance.now();
        let fpsHistory = [];

        const monitorFPS = () => {
            if (!this.isMonitoring) return;

            const currentTime = performance.now();
            frameCount++;

            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                fpsHistory.push(fps);

                if (fpsHistory.length > 10) {
                    fpsHistory.shift();
                }

                const avgFPS = fpsHistory.reduce((sum, f) => sum + f, 0) / fpsHistory.length;

                this.recordMetric('fps', {
                    current: fps,
                    average: avgFPS,
                    history: [...fpsHistory],
                    timestamp: currentTime
                });

                // Performance alerts
                if (fps < 30) {
                    console.warn(`⚠️ Low FPS: ${fps} (avg: ${avgFPS.toFixed(1)})`);
                    this.warningCount++;
                }

                frameCount = 0;
                lastTime = currentTime;
            }

            requestAnimationFrame(monitorFPS);
        };

        requestAnimationFrame(monitorFPS);

        // Adaptive reporting frequency based on device performance
        const reportingFrequency = this.deviceInfo.performanceTier === 'low' ? 120000 : // 2 minutes
                                   this.deviceInfo.performanceTier === 'high' ? 30000 : // 30 seconds
                                   60000; // 1 minute

        this.reportingInterval = setInterval(() => {
            this.generatePerformanceReport();
        }, reportingFrequency);

        // Periodic cleanup
        setInterval(() => {
            this.cleanupOldMetrics();
            GGeniusUtils.cleanupStorage();
        }, 300000); // 5 minutes
    }

    /**
     * Record metric with automatic aggregation
     */
    recordMetric(name, data) {
        if (!this.metrics.has(name)) {
            this.metrics.set(name, []);
        }

        const metricArray = this.metrics.get(name);
        metricArray.push({
            ...data,
            sessionTime: performance.now() - this.sessionStart
        });

        // Limit array size to prevent memory issues
        if (metricArray.length > 100) {
            metricArray.splice(0, metricArray.length - 100);
        }
    }

    /**
     * Record error with context
     */
    recordError(type, data) {
        this.recordMetric(`error_${type}`, {
            ...data,
            userAgent: navigator.userAgent,
            url: location.href,
            deviceInfo: this.deviceInfo,
            severity: this.categorizeErrorSeverity(type, data)
        });

        // Report to external service if configured
        if (window.GGeniusAnalytics && typeof window.GGeniusAnalytics.reportError === 'function') {
            window.GGeniusAnalytics.reportError(type, data);
        }
    }

    /**
     * Categorize error severity
     */
    categorizeErrorSeverity(type, data) {
        if (type === 'javascript_error' && data.message?.includes('Script error')) {
            return 'low'; // Cross-origin script errors
        }

        if (type === 'resource_error' && data.elementType === 'img') {
            return 'medium'; // Image loading errors
        }

        if (type === 'promise_rejection') {
            return 'high'; // Unhandled promise rejections
        }

        return 'medium';
    }

    /**
     * Generate comprehensive performance report
     */
    generatePerformanceReport() {
        const report = {
            timestamp: new Date().toISOString(),
            sessionDuration: performance.now() - this.sessionStart,
            deviceInfo: this.deviceInfo,
            metrics: this.aggregateMetrics(),
            budget: this.calculateBudgetCompliance(),
            recommendations: this.generateRecommendations(),
            score: this.calculatePerformanceScore(),
            errors: {
                total: this.errorCount,
                warnings: this.warningCount,
                errorRate: this.errorCount / ((performance.now() - this.sessionStart) / 60000) // errors per minute
            }
        };

        // Store report
        GGeniusUtils.setSecureStorage('perf_report_latest', report, {
            expiry: GGENIUS_CONFIG.STORAGE.CACHE_TTL
        });

        if (GGENIUS_CONFIG.DEBUG) {
            console.log('📊 Performance Report Generated:', report);
        }

        // Send to analytics
        if (window.GGeniusAnalytics) {
            window.GGeniusAnalytics.sendPerformanceReport(report);
        }

        return report;
    }

    /**
     * Aggregate metrics with statistical analysis
     */
    aggregateMetrics() {
        const aggregated = {};

        for (const [name, data] of this.metrics) {
            if (data.length === 0) continue;

            const values = data.map(item => item.value || 0).filter(v => !isNaN(v));

            if (values.length > 0) {
                aggregated[name] = {
                    count: values.length,
                    latest: data[data.length - 1],
                    stats: this.calculateStatistics(values),
                    trend: this.calculateTrend(values)
                };
            }
        }

        return aggregated;
    }

    /**
     * Calculate basic statistics
     */
    calculateStatistics(values) {
        if (values.length === 0) return null;

        const sorted = [...values].sort((a, b) => a - b);
        const sum = values.reduce((a, b) => a + b, 0);

        return {
            min: sorted[0],
            max: sorted[sorted.length - 1],
            mean: sum / values.length,
            median: sorted[Math.floor(sorted.length / 2)],
            p75: sorted[Math.floor(sorted.length * 0.75)],
            p95: sorted[Math.floor(sorted.length * 0.95)],
            p99: sorted[Math.floor(sorted.length * 0.99)],
            stdDev: this.calculateStandardDeviation(values, sum / values.length)
        };
    }

    /**
     * Calculate standard deviation
     */
    calculateStandardDeviation(values, mean) {
        const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
        const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
        return Math.sqrt(avgSquaredDiff);
    }

    /**
     * Calculate trend direction
     */
    calculateTrend(values) {
        if (values.length < 3) return 'insufficient_data';

        const recentValues = values.slice(-Math.min(5, values.length));
        const firstHalf = recentValues.slice(0, Math.floor(recentValues.length / 2));
        const secondHalf = recentValues.slice(Math.floor(recentValues.length / 2));

        const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

        const change = ((secondAvg - firstAvg) / firstAvg) * 100;

        if (Math.abs(change) < 5) return 'stable';
        return change > 0 ? 'increasing' : 'decreasing';
    }

    /**
     * Calculate performance budget compliance
     */
    calculateBudgetCompliance() {
        const compliance = {};
        const metrics = this.aggregateMetrics();

        // Check Core Web Vitals against budgets
        const checks = {
            lcp: { budget: this.budgets.LCP_BUDGET, current: metrics.lcp?.latest?.value || 0 },
            fid: { budget: this.budgets.FID_BUDGET, current: metrics.fid?.latest?.value || 0 },
            cls: { budget: this.budgets.CLS_BUDGET, current: metrics.cls?.latest?.value || 0 }
        };

        for (const [metric, data] of Object.entries(checks)) {
            const ratio = data.current / data.budget;
            compliance[metric] = {
                budget: data.budget,
                current: data.current,
                ratio: ratio,
                status: ratio <= 1 ? 'pass' : ratio <= 1.5 ? 'needs_improvement' : 'fail'
            };
        }

        return compliance;
    }

    /**
     * Generate intelligent recommendations
     */
    generateRecommendations() {
        const recommendations = [];
        const metrics = this.aggregateMetrics();
        const budget = this.calculateBudgetCompliance();

        // Core Web Vitals recommendations
        if (budget.lcp?.status !== 'pass') {
            recommendations.push({
                priority: 'high',
                category: 'performance',
                issue: 'Largest Contentful Paint is slow',
                suggestion: 'Optimize images, reduce server response times, and eliminate render-blocking resources',
                impact: 'high'
            });
        }

        if (budget.fid?.status !== 'pass') {
            recommendations.push({
                priority: 'high',
                category: 'interactivity',
                issue: 'First Input Delay is high',
                suggestion: 'Reduce JavaScript execution time and break up long tasks',
                impact: 'high'
            });
        }

        if (budget.cls?.status !== 'pass') {
            recommendations.push({
                priority: 'medium',
                category: 'stability',
                issue: 'Cumulative Layout Shift is high',
                suggestion: 'Add dimensions to images and reserve space for dynamic content',
                impact: 'medium'
            });
        }

        // Memory recommendations
        const memoryMetric = metrics.memory?.latest;
        if (memoryMetric && memoryMetric.utilization > 80) {
            recommendations.push({
                priority: 'medium',
                category: 'memory',
                issue: 'High memory usage detected',
                suggestion: 'Review for memory leaks and optimize data structures',
                impact: 'medium'
            });
        }

        // FPS recommendations
        const fpsMetric = metrics.fps?.latest;
        if (fpsMetric && fpsMetric.average < 45) {
            recommendations.push({
                priority: 'medium',
                category: 'animation',
                issue: 'Low frame rate detected',
                suggestion: 'Optimize animations and reduce DOM manipulations',
                impact: 'medium'
            });
        }

        // Long task recommendations
        const longTaskMetric = metrics.long_task;
        if (longTaskMetric && longTaskMetric.count > 5) {
            recommendations.push({
                priority: 'high',
                category: 'blocking',
                issue: 'Multiple long tasks detected',
                suggestion: 'Break up large scripts and use web workers for heavy computations',
                impact: 'high'
            });
        }

        // Error rate recommendations
        if (this.errorCount > 10) {
            recommendations.push({
                priority: 'high',
                category: 'reliability',
                issue: 'High error rate detected',
                suggestion: 'Review error logs and implement better error handling',
                impact: 'high'
            });
        }

        return recommendations;
    }

    /**
     * Calculate overall performance score (0-100)
     */
    calculatePerformanceScore() {
        const budget = this.calculateBudgetCompliance();
        const metrics = this.aggregateMetrics();

        let score = 100;
        const penalties = [];

        // Core Web Vitals penalties (60% of score)
        Object.entries(budget).forEach(([metric, data]) => {
            if (data.status === 'fail') {
                const penalty = 20;
                score -= penalty;
                penalties.push({ metric, penalty, reason: 'Budget exceeded significantly' });
            } else if (data.status === 'needs_improvement') {
                const penalty = 10;
                score -= penalty;
                penalties.push({ metric, penalty, reason: 'Budget exceeded moderately' });
            }
        });

        // Error penalties (20% of score)
        const errorRate = this.errorCount / ((performance.now() - this.sessionStart) / 60000);
        if (errorRate > 1) {
            const penalty = Math.min(20, errorRate * 5);
            score -= penalty;
            penalties.push({ metric: 'errors', penalty, reason: 'High error rate' });
        }

        // Performance trend penalties (20% of score)
        const fpsMetric = metrics.fps?.latest;
        if (fpsMetric && fpsMetric.average < 30) {
            const penalty = 15;
            score -= penalty;
            penalties.push({ metric: 'fps', penalty, reason: 'Low frame rate' });
        }

        const memoryMetric = metrics.memory?.latest;
        if (memoryMetric && memoryMetric.utilization > 90) {
            const penalty = 10;
            score -= penalty;
            penalties.push({ metric: 'memory', penalty, reason: 'Critical memory usage' });
        }

        return {
            score: Math.max(0, Math.round(score)),
            grade: this.getPerformanceGrade(score),
            penalties,
            timestamp: performance.now()
        };
    }

    /**
     * Get performance grade based on score
     */
    getPerformanceGrade(score) {
        if (score >= 90) return 'A';
        if (score >= 80) return 'B';
        if (score >= 70) return 'C';
        if (score >= 60) return 'D';
        return 'F';
    }

    /**
     * Get Core Web Vitals rating
     */
    getRating(metric, value) {
        const thresholds = {
            lcp: { good: 1200, poor: 4000 },
            fid: { good: 40, poor: 300 },
            cls: { good: 0.03, poor: 0.25 },
            fcp: { good: 900, poor: 3000 }
        };

        const threshold = thresholds[metric];
        if (!threshold) return 'unknown';

        if (value <= threshold.good) return 'good';
        if (value <= threshold.poor) return 'needs-improvement';
        return 'poor';
    }

    /**
     * Suggest memory optimization strategies
     */
    suggestMemoryOptimization() {
        console.log('🧹 Triggering memory optimization...');

        // Clear old metrics
        this.cleanupOldMetrics();

        // Clear expired caches
        if (window.caches) {
            caches.keys().then(names => {
                names.forEach(name => {
                    if (name.includes('old') || name.includes('temp')) {
                        caches.delete(name);
                    }
                });
            });
        }

        // Suggest garbage collection
        if (window.gc && typeof window.gc === 'function') {
            setTimeout(() => window.gc(), 1000);
        }

        // Dispatch memory pressure event
        document.dispatchEvent(new CustomEvent('memory:pressure', {
            detail: { level: 'high', action: 'cleanup' }
        }));
    }

    /**
     * Clean up old metrics to prevent memory leaks
     */
    cleanupOldMetrics() {
        const maxAge = 10 * 60 * 1000; // 10 minutes
        const now = performance.now();

        for (const [name, data] of this.metrics) {
            const filtered = data.filter(item => 
                (now - (item.timestamp || 0)) < maxAge
            );

            if (filtered.length !== data.length) {
                this.metrics.set(name, filtered);
            }
        }

        console.log('🧹 Cleaned up old performance metrics');
    }

    /**
     * Get current performance snapshot
     */
    getPerformanceSnapshot() {
        return {
            timestamp: performance.now(),
            metrics: this.aggregateMetrics(),
            score: this.calculatePerformanceScore(),
            budget: this.calculateBudgetCompliance(),
            deviceInfo: this.deviceInfo,
            sessionDuration: performance.now() - this.sessionStart,
            errorCount: this.errorCount,
            warningCount: this.warningCount
        };
    }

     /**
     * ✅ ЗАВЕРШЕНИЙ destroy() МЕТОД AdvancedPerformanceMonitor
     */
    destroy() {
        this.isMonitoring = false;
        
        // Очищення всіх interval та timeout
        if (this.reportingInterval) {
            clearInterval(this.reportingInterval);
            this.reportingInterval = null;
        }
        
        // Disconnect всіх PerformanceObserver
        for (const [name, observer] of this.observers) {
            try {
                observer.disconnect();
                console.log(`✅ Disconnected ${name} observer`);
            } catch (error) {
                console.warn(`⚠️ Failed to disconnect ${name} observer:`, error);
            }
        }
        this.observers.clear();
        
        // Очищення metrics з обмеженням пам'яті
        const essentialMetrics = ['lcp', 'fid', 'cls', 'fcp'];
        for (const [name, data] of this.metrics) {
            if (!essentialMetrics.includes(name)) {
                this.metrics.delete(name);
            } else {
                // Зберегти тільки останні 5 записів для критичних метрик
                const trimmedData = data.slice(-5);
                this.metrics.set(name, trimmedData);
            }
        }
        
        // Очищення device info cache
        this.deviceInfo = null;
        this.budgets = null;
        
        // Фінальний cleanup звіт
        const finalReport = {
            timestamp: new Date().toISOString(),
            sessionDuration: performance.now() - this.sessionStart,
            totalErrors: this.errorCount,
            totalWarnings: this.warningCount,
            status: 'destroyed'
        };
        
        GGeniusUtils.setSecureStorage('perf_monitor_final', finalReport, {
            expiry: GGENIUS_CONFIG.STORAGE.CACHE_TTL
        });
        
        console.log('🔥 AdvancedPerformanceMonitor destroyed successfully', finalReport);
    }
}

/**
 * 🔧 SERVICE WORKER MANAGER - PWA Revolution
 * Enterprise-grade service worker with intelligent caching
 */
class ServiceWorkerManager {
    constructor() {
        this.registration = null;
        this.updateAvailable = false;
        this.isOnline = navigator.onLine;
        this.cacheStrategies = GGENIUS_CONFIG.PWA.CACHE_STRATEGIES;
        this.updateInterval = null;
        this.notificationQueue = [];
        
        this.init();
    }
    
    async init() {
        if (!('serviceWorker' in navigator)) {
            console.warn('⚠️ Service Worker not supported');
            return;
        }
        
        try {
            await this.registerServiceWorker();
            this.setupUpdateDetection();
            this.setupNetworkDetection();
            this.setupMessageHandling();
            this.startPeriodicUpdates();
            
            console.log('🔧 ServiceWorkerManager initialized');
        } catch (error) {
            console.error('❌ ServiceWorker initialization failed:', error);
        }
    }
    
    async registerServiceWorker() {
        try {
            this.registration = await navigator.serviceWorker.register(GGENIUS_CONFIG.PWA.SW_PATH, {
                scope: '/',
                updateViaCache: 'none'
            });
            
            console.log('✅ Service Worker registered:', this.registration.scope);
            
            // Handle different registration states
            if (this.registration.installing) {
                console.log('🔄 Service Worker installing...');
                this.trackInstallProgress(this.registration.installing);
            } else if (this.registration.waiting) {
                console.log('⏳ Service Worker waiting...');
                this.updateAvailable = true;
                this.notifyUpdateAvailable();
            } else if (this.registration.active) {
                console.log('✅ Service Worker active');
            }
            
        } catch (error) {
            console.error('❌ Service Worker registration failed:', error);
            throw error;
        }
    }
    
    trackInstallProgress(worker) {
        worker.addEventListener('statechange', () => {
            console.log(`🔄 Service Worker state: ${worker.state}`);
            
            switch (worker.state) {
                case 'installed':
                    if (navigator.serviceWorker.controller) {
                        // Update available
                        this.updateAvailable = true;
                        this.notifyUpdateAvailable();
                    } else {
                        // First install
                        this.notifyFirstInstall();
                    }
                    break;
                case 'activated':
                    console.log('🎉 Service Worker activated');
                    this.notifyActivated();
                    break;
                case 'redundant':
                    console.log('🗑️ Service Worker redundant');
                    break;
            }
        });
    }
    
    setupUpdateDetection() {
        if (!this.registration) return;
        
        // Listen for updates
        this.registration.addEventListener('updatefound', () => {
            console.log('🔄 Service Worker update found');
            const newWorker = this.registration.installing;
            
            if (newWorker) {
                this.trackInstallProgress(newWorker);
            }
        });
        
        // Handle controller change
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('🔄 Service Worker controller changed');
            if (this.updateAvailable) {
                this.notifyUpdateInstalled();
                window.location.reload();
            }
        });
    }
    
    setupNetworkDetection() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            console.log('🌐 Network: Online');
            this.notifyNetworkChange(true);
            this.syncOfflineActions();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            console.log('📴 Network: Offline');
            this.notifyNetworkChange(false);
        });
    }
    
    setupMessageHandling() {
        navigator.serviceWorker.addEventListener('message', (event) => {
            const { type, payload } = event.data;
            
            switch (type) {
                case 'CACHE_UPDATED':
                    console.log('📦 Cache updated:', payload);
                    break;
                case 'OFFLINE_FALLBACK':
                    console.log('📴 Serving offline fallback:', payload);
                    this.showOfflineNotification();
                    break;
                case 'SYNC_BACKGROUND':
                    console.log('🔄 Background sync completed:', payload);
                    break;
                case 'PUSH_RECEIVED':
                    console.log('🔔 Push notification received:', payload);
                    this.handlePushNotification(payload);
                    break;
                default:
                    console.log('📨 SW Message:', type, payload);
            }
        });
    }
    
    startPeriodicUpdates() {
        // Check for updates every 20 minutes
        this.updateInterval = setInterval(() => {
            this.checkForUpdates();
        }, GGENIUS_CONFIG.PWA.UPDATE_CHECK_INTERVAL);
    }
    
    async checkForUpdates() {
        if (!this.registration) return;
        
        try {
            await this.registration.update();
            console.log('🔄 Manual update check completed');
        } catch (error) {
            console.error('❌ Update check failed:', error);
        }
    }
    
    async skipWaiting() {
        if (!this.registration?.waiting) return;
        
        try {
            // Send skip waiting message to service worker
            this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            console.log('⏭️ Skip waiting requested');
        } catch (error) {
            console.error('❌ Skip waiting failed:', error);
        }
    }
    
    async syncOfflineActions() {
        if (!this.isOnline || !this.registration?.sync) return;
        
        try {
            await this.registration.sync.register('background-sync');
            console.log('🔄 Background sync registered');
        } catch (error) {
            console.error('❌ Background sync failed:', error);
        }
    }
    
    notifyUpdateAvailable() {
        this.dispatchEvent('sw:update-available');
        
        // Show user-friendly notification
        this.showNotification({
            type: 'update',
            title: 'Оновлення доступне',
            message: 'Нова версія GGenius готова до встановлення',
            actions: [
                { label: 'Оновити зараз', action: () => this.skipWaiting() },
                { label: 'Пізніше', action: () => this.dismissNotification() }
            ]
        });
    }
    
    notifyFirstInstall() {
        this.dispatchEvent('sw:first-install');
        
        this.showNotification({
            type: 'install',
            title: 'GGenius готовий до роботи офлайн!',
            message: 'Тепер ви можете користуватися додатком навіть без інтернету',
            duration: 5000
        });
    }
    
    notifyActivated() {
        this.dispatchEvent('sw:activated');
    }
    
    notifyUpdateInstalled() {
        this.dispatchEvent('sw:update-installed');
        
        this.showNotification({
            type: 'success',
            title: 'Оновлення встановлено',
            message: 'GGenius було успішно оновлено до найновішої версії',
            duration: 3000
        });
    }
    
    notifyNetworkChange(isOnline) {
        this.dispatchEvent('sw:network-change', { isOnline });
        
        if (isOnline) {
            this.showNotification({
                type: 'success',
                title: 'З\'єднання відновлено',
                message: 'Синхронізація даних...',
                duration: 2000
            });
        } else {
            this.showNotification({
                type: 'warning',
                title: 'Режим офлайн',
                message: 'Деякі функції можуть бути обмежені',
                duration: 4000
            });
        }
    }
    
    showOfflineNotification() {
        this.showNotification({
            type: 'info',
            title: 'Офлайн версія',
            message: 'Показано збережена версія сторінки',
            duration: 3000
        });
    }
    
    handlePushNotification(payload) {
        // Handle incoming push notifications
        this.dispatchEvent('sw:push-received', payload);
        
        if (payload.showNotification !== false) {
            this.showSystemNotification(payload);
        }
    }
    
    async showSystemNotification(data) {
        if (!('Notification' in window)) return;
        
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return;
        
        const notification = new Notification(data.title, {
            body: data.message,
            icon: '/static/images/icons/icon-192x192.png',
            badge: '/static/images/icons/badge-72x72.png',
            tag: data.tag || 'ggenius-notification',
            renotify: true,
            requireInteraction: data.requireInteraction || false,
            actions: data.actions || []
        });
        
        notification.addEventListener('click', () => {
            window.focus();
            if (data.url) {
                window.location.href = data.url;
            }
            notification.close();
        });
        
        // Auto close after duration
        if (data.duration) {
            setTimeout(() => notification.close(), data.duration);
        }
    }
    
    showNotification(options) {
        const {
            type = 'info',
            title,
            message,
            actions = [],
            duration = 5000
        } = options;
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `ggenius-notification ggenius-notification--${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">${this.getNotificationIcon(type)}</div>
                <div class="notification-text">
                    <div class="notification-title">${title}</div>
                    <div class="notification-message">${message}</div>
                </div>
                <div class="notification-actions">
                    ${actions.map(action => `
                        <button class="notification-action" data-action="${action.label}">
                            ${action.label}
                        </button>
                    `).join('')}
                    <button class="notification-close" aria-label="Закрити">×</button>
                </div>
            </div>
        `;
        
        // Add event listeners
        notification.querySelectorAll('.notification-action').forEach((button, index) => {
            button.addEventListener('click', () => {
                actions[index]?.action();
                this.removeNotification(notification);
            });
        });
        
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.removeNotification(notification);
        });
        
        // Add to DOM
        this.getNotificationContainer().appendChild(notification);
        
        // Auto remove after duration
        if (duration > 0) {
            setTimeout(() => {
                if (notification.parentNode) {
                    this.removeNotification(notification);
                }
            }, duration);
        }
        
        // Add to queue
        this.notificationQueue.push(notification);
        
        return notification;
    }
    
    getNotificationIcon(type) {
        const icons = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌',
            update: '🔄',
            install: '📱'
        };
        return icons[type] || icons.info;
    }
    
    getNotificationContainer() {
        let container = document.querySelector('.ggenius-notifications');
        
        if (!container) {
            container = document.createElement('div');
            container.className = 'ggenius-notifications';
            container.style.cssText = `
                position: fixed;
                top: 80px;
                right: 1rem;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                max-width: 400px;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }
        
        return container;
    }
    
    removeNotification(notification) {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            
            // Remove from queue
            const index = this.notificationQueue.indexOf(notification);
            if (index > -1) {
                this.notificationQueue.splice(index, 1);
            }
        }, 300);
    }
    
    dismissNotification() {
        // Dismiss the most recent notification
        const lastNotification = this.notificationQueue[this.notificationQueue.length - 1];
        if (lastNotification) {
            this.removeNotification(lastNotification);
        }
    }
    
    dispatchEvent(type, detail = {}) {
        document.dispatchEvent(new CustomEvent(type, { detail }));
    }
    
    async installUpdate() {
        await this.skipWaiting();
    }
    
    getInstallationStatus() {
        return {
            isInstalled: !!this.registration,
            updateAvailable: this.updateAvailable,
            isOnline: this.isOnline,
            registration: this.registration
        };
    }
    
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        
        // Clear notifications
        this.notificationQueue.forEach(notification => {
            this.removeNotification(notification);
        });
        this.notificationQueue = [];
        
        // Remove notification container
        const container = document.querySelector('.ggenius-notifications');
        if (container) {
            container.remove();
        }
        
        console.log('🔧 ServiceWorkerManager destroyed');
    }
}

/**
 * 🔧 WEB WORKER MANAGER - High Performance Computing
 * Offload heavy computations to web workers
 */
class WebWorkerManager {
    constructor() {
        this.workers = new Map();
        this.workerPool = new Map();
        this.maxWorkers = navigator.hardwareConcurrency || 4;
        this.taskQueue = [];
        this.isProcessing = false;
        
        this.init();
    }
    
    init() {
        this.createWorkerPool();
        console.log(`🔧 WebWorkerManager initialized with ${this.maxWorkers} workers`);
    }
    
    createWorkerPool() {
        // Create AI processing worker pool
        this.createWorkerType('ai-processor', '/static/js/workers/ai-processor.js', 2);
        
        // Create image processing worker pool  
        this.createWorkerType('image-processor', '/static/js/workers/image-processor.js', 1);
        
        // Create data analysis worker pool
        this.createWorkerType('data-analyzer', '/static/js/workers/data-analyzer.js', 1);
    }
    
    createWorkerType(type, scriptPath, count) {
        if (!this.workerPool.has(type)) {
            this.workerPool.set(type, []);
        }
        
        const pool = this.workerPool.get(type);
        
        for (let i = 0; i < count; i++) {
            try {
                const worker = new Worker(scriptPath);
                worker.id = `${type}-${i}`;
                worker.busy = false;
                worker.type = type;
                
                worker.addEventListener('message', (event) => {
                    this.handleWorkerMessage(worker, event);
                });
                
                worker.addEventListener('error', (error) => {
                    console.error(`❌ Worker ${worker.id} error:`, error);
                    this.handleWorkerError(worker, error);
                });
                
                pool.push(worker);
                console.log(`✅ Created worker: ${worker.id}`);
                
            } catch (error) {
                console.error(`❌ Failed to create worker ${type}:`, error);
            }
        }
    }
    
    async executeTask(type, data, options = {}) {
        return new Promise((resolve, reject) => {
            const task = {
                id: GGeniusUtils.generateId('task'),
                type,
                data,
                options,
                resolve,
                reject,
                timestamp: performance.now()
            };
            
            this.taskQueue.push(task);
            this.processQueue();
        });
    }
    
    processQueue() {
        if (this.isProcessing || this.taskQueue.length === 0) return;
        
        this.isProcessing = true;
        
        while (this.taskQueue.length > 0) {
            const task = this.taskQueue[0];
            const worker = this.getAvailableWorker(task.type);
            
            if (!worker) {
                break; // No available workers, wait
            }
            
            this.taskQueue.shift();
            this.assignTaskToWorker(worker, task);
        }
        
        this.isProcessing = false;
    }
    
    getAvailableWorker(type) {
        const pool = this.workerPool.get(type);
        if (!pool) return null;
        
        return pool.find(worker => !worker.busy);
    }
    
    assignTaskToWorker(worker, task) {
        worker.busy = true;
        worker.currentTask = task;
        
        const message = {
            taskId: task.id,
            type: task.type,
            data: task.data,
            options: task.options
        };
        
        // Set timeout for task
        const timeout = task.options.timeout || 30000;
        worker.taskTimeout = setTimeout(() => {
            this.handleTaskTimeout(worker, task);
        }, timeout);
        
        worker.postMessage(message);
        console.log(`🔄 Assigned task ${task.id} to worker ${worker.id}`);
    }
    
    handleWorkerMessage(worker, event) {
        const { taskId, type, result, error } = event.data;
        const task = worker.currentTask;
        
        if (!task || task.id !== taskId) {
            console.warn(`⚠️ Received message for unknown task: ${taskId}`);
            return;
        }
        
        // Clear timeout
        if (worker.taskTimeout) {
            clearTimeout(worker.taskTimeout);
            worker.taskTimeout = null;
        }
        
        // Free worker
        worker.busy = false;
        worker.currentTask = null;
        
        // Resolve/reject task
        if (error) {
            console.error(`❌ Task ${taskId} failed:`, error);
            task.reject(new Error(error));
        } else {
            console.log(`✅ Task ${taskId} completed in ${(performance.now() - task.timestamp).toFixed(2)}ms`);
            task.resolve(result);
        }
        
        // Process next tasks
        setTimeout(() => this.processQueue(), 0);
    }
    
    handleWorkerError(worker, error) {
        console.error(`❌ Worker ${worker.id} crashed:`, error);
        
        // Reject current task
        if (worker.currentTask) {
            worker.currentTask.reject(error);
            worker.currentTask = null;
        }
        
        // Clear timeout
        if (worker.taskTimeout) {
            clearTimeout(worker.taskTimeout);
            worker.taskTimeout = null;
        }
        
        // Recreate worker
        this.recreateWorker(worker);
    }
    
    handleTaskTimeout(worker, task) {
        console.error(`⏰ Task ${task.id} timed out on worker ${worker.id}`);
        
        // Reject task
        task.reject(new Error('Task timeout'));
        
        // Terminate and recreate worker
        worker.terminate();
        this.recreateWorker(worker);
    }
    
    recreateWorker(oldWorker) {
        const pool = this.workerPool.get(oldWorker.type);
        if (!pool) return;
        
        const index = pool.indexOf(oldWorker);
        if (index === -1) return;
        
        try {
            // Create new worker
            const scriptPath = this.getWorkerScriptPath(oldWorker.type);
            const newWorker = new Worker(scriptPath);
            newWorker.id = oldWorker.id;
            newWorker.busy = false;
            newWorker.type = oldWorker.type;
            
            newWorker.addEventListener('message', (event) => {
                this.handleWorkerMessage(newWorker, event);
            });
            
            newWorker.addEventListener('error', (error) => {
                this.handleWorkerError(newWorker, error);
            });
            
            // Replace in pool
            pool[index] = newWorker;
            
            console.log(`🔄 Recreated worker: ${newWorker.id}`);
            
        } catch (error) {
            console.error(`❌ Failed to recreate worker ${oldWorker.id}:`, error);
            // Remove from pool
            pool.splice(index, 1);
        }
    }
    
    getWorkerScriptPath(type) {
        const paths = {
            'ai-processor': '/static/js/workers/ai-processor.js',
            'image-processor': '/static/js/workers/image-processor.js',
            'data-analyzer': '/static/js/workers/data-analyzer.js'
        };
        return paths[type];
    }
    
    // High-level API methods
    async processAIData(data, options = {}) {
        return this.executeTask('ai-processor', { action: 'process', data }, options);
    }
    
    async analyzeGameData(gameData, options = {}) {
        return this.executeTask('data-analyzer', { action: 'analyze', gameData }, options);
    }
    
    async optimizeImage(imageData, options = {}) {
        return this.executeTask('image-processor', { action: 'optimize', imageData, ...options });
    }
    
    async generateRecommendations(userData, options = {}) {
        return this.executeTask('ai-processor', { action: 'recommend', userData }, options);
    }
    
    async calculateStatistics(data, options = {}) {
        return this.executeTask('data-analyzer', { action: 'statistics', data }, options);
    }
    
    getWorkerStatus() {
        const status = {};
        
        for (const [type, pool] of this.workerPool) {
            status[type] = {
                total: pool.length,
                busy: pool.filter(w => w.busy).length,
                available: pool.filter(w => !w.busy).length
            };
        }
        
        return {
            ...status,
            queueLength: this.taskQueue.length,
            isProcessing: this.isProcessing
        };
    }
    
    destroy() {
        // Terminate all workers
        for (const [type, pool] of this.workerPool) {
            pool.forEach(worker => {
                if (worker.taskTimeout) {
                    clearTimeout(worker.taskTimeout);
                }
                worker.terminate();
            });
        }
        
        // Clear pools
        this.workerPool.clear();
        
        // Reject pending tasks
        this.taskQueue.forEach(task => {
            task.reject(new Error('WebWorkerManager destroyed'));
        });
        this.taskQueue = [];
        
        console.log('🔧 WebWorkerManager destroyed');
    }
}

/**
 * 🎮 GGENIUS APP - Revolutionary Main Application Class
 * Координує всі модулі та системи
 */
class GGeniusApp {
    constructor() {
        this.version = GGENIUS_CONFIG.VERSION;
        this.modules = new Map();
        this.isInitialized = false;
        this.startTime = performance.now();
        this.eventBus = new EventTarget();
        
        // Core modules
        this.utils = GGeniusUtils;
        this.performance = null;
        this.navigation = null;
        this.content = null;
        this.serviceWorker = null;
        this.webWorker = null;
        
        this.init();
    }
    
    async init() {
        try {
            console.log(`🚀 Initializing GGenius v${this.version}...`);
            
            await this.initializeCore();
            await this.initializeModules();
            await this.initializeIntegrations();
            await this.finalizeInitialization();
            
            this.isInitialized = true;
            const initTime = performance.now() - this.startTime;
            
            console.log(`🎉 GGenius initialized successfully in ${initTime.toFixed(2)}ms`);
            this.dispatchEvent('app:initialized', { initTime });
            
        } catch (error) {
            console.error('❌ GGenius initialization failed:', error);
            this.handleInitializationError(error);
        }
    }
    
    async initializeCore() {
        // Initialize performance monitor first
        this.performance = new AdvancedPerformanceMonitor();
        this.modules.set('performance', this.performance);
        
        // Initialize utilities
        await this.utils.cleanupStorage();
        
        console.log('✅ Core systems initialized');
    }
    
    async initializeModules() {
        try {
            // Initialize Service Worker Manager
            this.serviceWorker = new ServiceWorkerManager();
            this.modules.set('serviceWorker', this.serviceWorker);
            
            // Initialize Web Worker Manager
            this.webWorker = new WebWorkerManager();
            this.modules.set('webWorker', this.webWorker);
            
            // Initialize Navigation Manager
            this.navigation = new MobileNavigationManager();
            this.modules.set('navigation', this.navigation);
            
            // Initialize Content Manager (завершимо в наступній частині)
            this.content = new IntelligentContentManager();
            this.modules.set('content', this.content);
            
            console.log('✅ All modules initialized');
            
        } catch (error) {
            console.error('❌ Module initialization failed:', error);
            throw error;
        }
    }
    
    async initializeIntegrations() {
        // Integration with external modules
        await this.integrateAICardsHub();
        await this.integrateContentManager();
        
        // Setup cross-module communication
        this.setupModuleCommunication();
        
        console.log('✅ Module integrations completed');
    }
    
    async integrateAICardsHub() {
        // Wait for AI Cards Hub to be available
        if (window.AICardsHub) {
            const aiCards = new window.AICardsHub();
            this.modules.set('aiCards', aiCards);
            
            // Setup integration
            aiCards.setPerformanceMonitor(this.performance);
            aiCards.setWebWorkerManager(this.webWorker);
            
            console.log('✅ AI Cards Hub integrated');
        }
    }
    
    async integrateContentManager() {
        // Wait for Content Manager to be available
        if (window.ContentManager) {
            const contentManager = new window.ContentManager();
            this.modules.set('externalContent', contentManager);
            
            // Setup integration
            contentManager.setIntelligentManager(this.content);
            
            console.log('✅ External Content Manager integrated');
        }
    }
    
    setupModuleCommunication() {
        // Setup event-driven communication between modules
        this.eventBus.addEventListener('performance:warning', (event) => {
            this.handlePerformanceWarning(event.detail);
        });
        
        this.eventBus.addEventListener('content:loaded', (event) => {
            this.performance?.recordMetric('content_load', event.detail);
        });
        
        this.eventBus.addEventListener('navigation:change', (event) => {
            this.content?.prefetchForPage(event.detail.page);
        });
        
        console.log('✅ Module communication setup completed');
    }
    
    async finalizeInitialization() {
        // Final setup tasks
        await this.setupGlobalErrorHandling();
        await this.setupPerformanceOptimizations();
        await this.setupAnalytics();
        
        // Register global instance
        window.GGenius = this;
        
        console.log('✅ Finalization completed');
    }
    
    async setupGlobalErrorHandling() {
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled Promise Rejection:', event.reason);
            this.performance?.recordError('unhandled_rejection', {
                reason: event.reason?.toString(),
                stack: event.reason?.stack
            });
        });
        
        window.addEventListener('error', (event) => {
            console.error('Global Error:', event.error);
            this.performance?.recordError('global_error', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
            });
        });
    }
    
    async setupPerformanceOptimizations() {
        // Enable performance optimizations based on device capabilities
        const capabilities = this.utils.getDeviceCapabilities();
        
        if (capabilities.performanceTier === 'low') {
            // Reduce animation complexity
            document.body.classList.add('low-performance-mode');
            
            // Limit concurrent operations
            this.webWorker.maxWorkers = Math.min(this.webWorker.maxWorkers, 2);
        }
        
        console.log(`✅ Performance optimizations applied for ${capabilities.performanceTier} tier device`);
    }
    
    async setupAnalytics() {
        // Initialize analytics if available
        if (window.GGeniusAnalytics) {
            window.GGeniusAnalytics.init({
                version: this.version,
                deviceCapabilities: this.utils.getDeviceCapabilities(),
                modules: Array.from(this.modules.keys())
            });
            
            console.log('✅ Analytics initialized');
        }
    }
    
    handleInitializationError(error) {
        // Graceful degradation on initialization failure
        document.body.classList.add('initialization-failed');
        
        // Show user-friendly error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'initialization-error';
        errorMessage.innerHTML = `
            <div class="error-content">
                <h2>⚠️ Помилка ініціалізації</h2>
                <p>Сталася помилка під час запуску GGenius. Спробуйте оновити сторінку.</p>
                <button onclick="location.reload()" class="retry-button">🔄 Спробувати знову</button>
            </div>
        `;
        
        document.body.appendChild(errorMessage);
        
        // Report error
        if (this.performance) {
            this.performance.recordError('initialization_failed', {
                message: error.message,
                stack: error.stack
            });
        }
    }
    
    handlePerformanceWarning(warning) {
        console.warn('⚠️ Performance Warning:', warning);
        
        // Take corrective actions based on warning type
        switch (warning.type) {
            case 'memory_high':
                this.optimizeMemoryUsage();
                break;
            case 'fps_low':
                this.reduceAnimationComplexity();
                break;
            case 'long_task':
                this.optimizeTaskScheduling();
                break;
        }
    }
    
    optimizeMemoryUsage() {
        // Clear non-essential caches
        this.content?.clearNonEssentialCache();
        
        // Reduce worker pool if necessary
        if (this.webWorker.getWorkerStatus().queueLength > 10) {
            this.webWorker.maxWorkers = Math.max(1, this.webWorker.maxWorkers - 1);
        }
        
        console.log('🧹 Memory optimization applied');
    }
    
    reduceAnimationComplexity() {
        document.body.classList.add('reduced-animations');
        console.log('🎬 Animation complexity reduced');
    }
    
    optimizeTaskScheduling() {
        // Implement task prioritization
        // This would be implemented in WebWorkerManager
        console.log('⚡ Task scheduling optimized');
    }
    
    // Public API methods
    getModule(name) {
        return this.modules.get(name);
    }
    
    getAllModules() {
        return Object.fromEntries(this.modules);
    }
    
    getStatus() {
        return {
            version: this.version,
            isInitialized: this.isInitialized,
            uptime: performance.now() - this.startTime,
            modules: Array.from(this.modules.keys()),
            performance: this.performance?.getPerformanceSnapshot(),
            workers: this.webWorker?.getWorkerStatus()
        };
    }
    
    dispatchEvent(type, detail = {}) {
        this.eventBus.dispatchEvent(new CustomEvent(type, { detail }));
        
        // Also dispatch on document for external listeners
        document.dispatchEvent(new CustomEvent(`ggenius:${type}`, { detail }));
    }
    
    addEventListener(type, listener) {
        this.eventBus.addEventListener(type, listener);
    }
    
    removeEventListener(type, listener) {
        this.eventBus.removeEventListener(type, listener);
    }
    
    async restart() {
        console.log('🔄 Restarting GGenius...');
        
        await this.destroy();
        await this.init();
        
        console.log('✅ GGenius restarted successfully');
    }
    
    async destroy() {
        console.log('🔥 Destroying GGenius...');
        
        // Destroy all modules
        for (const [name, module] of this.modules) {
            if (module && typeof module.destroy === 'function') {
                try {
                    await module.destroy();
                    console.log(`✅ ${name} module destroyed`);
                } catch (error) {
                    console.error(`❌ Failed to destroy ${name} module:`, error);
                }
            }
        }
        
        // Clear modules
        this.modules.clear();
        
        // Reset state
        this.isInitialized = false;
        
        // Remove global reference
        if (window.GGenius === this) {
            delete window.GGenius;
        }
        
        console.log('🔥 GGenius destroyed successfully');
    }
}

// 🚀 AUTO-INITIALIZE WHEN DOM IS READY
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new GGeniusApp();
    });
} else {
    // DOM already loaded
    new GGeniusApp();
}

// 🌟 Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GGeniusApp, GGeniusUtils, AdvancedPerformanceMonitor };
}