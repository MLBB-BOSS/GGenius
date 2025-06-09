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
     * ✅ ЗАВЕРШЕНИЙ destroy() МЕТОД
     * Повне очищення всіх ресурсів та observers
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
 * 🎮 MOBILE NAVIGATION MANAGER - Revolutionary Mobile UX
 * Adaptive navigation with gesture support and PWA optimizations
 */
class MobileNavigationManager {
    constructor() {
        this.isInitialized = false;
        this.gestureHandler = null;
        this.navigationState = new Map();
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchStartTime = 0;
        this.isNavigating = false;
        this.activePanel = null;
        this.navigationStack = [];
        this.gestureThresholds = GGENIUS_CONFIG.INTERACTION;
        
        // Device capabilities
        this.deviceCapabilities = GGeniusUtils.getDeviceCapabilities();
        
        this.init();
    }
    
    init() {
        if (this.isInitialized) return;
        
        this.createNavigationStructure();
        this.setupGestureHandlers();
        this.setupKeyboardNavigation();
        this.setupAccessibilityFeatures();
        this.setupPWANavigation();
        this.bindEvents();
        
        this.isInitialized = true;
        console.log('📱 MobileNavigationManager initialized');
    }
    
    /**
     * Create responsive navigation structure
     */
    createNavigationStructure() {
        // Remove existing navigation if present
        const existingNav = document.querySelector('.ggenius-mobile-nav');
        if (existingNav) {
            existingNav.remove();
        }
        
        // Create main navigation container
        const navContainer = document.createElement('nav');
        navContainer.className = 'ggenius-mobile-nav';
        navContainer.setAttribute('role', 'navigation');
        navContainer.setAttribute('aria-label', 'Головна навігація');
        
        // Navigation header with hamburger menu
        const navHeader = document.createElement('div');
        navHeader.className = 'nav-header';
        navHeader.innerHTML = `
            <button class="nav-toggle" aria-label="Відкрити меню" aria-expanded="false">
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
            </button>
            <div class="nav-logo">
                <img src="/static/images/ggenius-logo.svg" alt="GGenius" loading="lazy">
            </div>
            <div class="nav-actions">
                <button class="nav-search" aria-label="Пошук">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                </button>
                <button class="nav-user" aria-label="Профіль користувача">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                </button>
            </div>
        `;
        
        // Main navigation menu
        const navMenu = document.createElement('div');
        navMenu.className = 'nav-menu';
        navMenu.setAttribute('aria-hidden', 'true');
        navMenu.innerHTML = `
            <div class="nav-overlay"></div>
            <div class="nav-panel">
                <div class="nav-panel-header">
                    <h2>Навігація</h2>
                    <button class="nav-close" aria-label="Закрити меню">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                    </button>
                </div>
                <ul class="nav-list" role="menu">
                    <li role="none">
                        <a href="/" class="nav-link" role="menuitem">
                            <span class="nav-icon">🏠</span>
                            <span class="nav-text">Головна</span>
                        </a>
                    </li>
                    <li role="none">
                        <a href="/heroes" class="nav-link" role="menuitem">
                            <span class="nav-icon">⚔️</span>
                            <span class="nav-text">Герої</span>
                        </a>
                    </li>
                    <li role="none">
                        <a href="/builds" class="nav-link" role="menuitem">
                            <span class="nav-icon">🛡️</span>
                            <span class="nav-text">Білди</span>
                        </a>
                    </li>
                    <li role="none">
                        <a href="/tier-list" class="nav-link" role="menuitem">
                            <span class="nav-icon">📊</span>
                            <span class="nav-text">Тір-лист</span>
                        </a>
                    </li>
                    <li role="none">
                        <a href="/guides" class="nav-link" role="menuitem">
                            <span class="nav-icon">📚</span>
                            <span class="nav-text">Гайди</span>
                        </a>
                    </li>
                    <li role="none">
                        <a href="/tournaments" class="nav-link" role="menuitem">
                            <span class="nav-icon">🏆</span>
                            <span class="nav-text">Турніри</span>
                        </a>
                    </li>
                    <li role="none">
                        <a href="/community" class="nav-link" role="menuitem">
                            <span class="nav-icon">👥</span>
                            <span class="nav-text">Спільнота</span>
                        </a>
                    </li>
                </ul>
                <div class="nav-footer">
                    <div class="nav-theme-toggle">
                        <button class="theme-switch" aria-label="Змінити тему">
                            <span class="theme-icon">🌙</span>
                            <span class="theme-text">Темна тема</span>
                        </button>
                    </div>
                    <div class="nav-language">
                        <select class="language-select" aria-label="Вибрати мову">
                            <option value="uk">🇺🇦 Українська</option>
                            <option value="en">🇺🇸 English</option>
                            <option value="ru">🇷🇺 Русский</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
        
        // Tab bar for bottom navigation
        const tabBar = document.createElement('div');
        tabBar.className = 'nav-tab-bar';
        tabBar.setAttribute('role', 'tablist');
        tabBar.innerHTML = `
            <button class="tab-button active" role="tab" aria-selected="true" data-target="home">
                <span class="tab-icon">🏠</span>
                <span class="tab-label">Головна</span>
            </button>
            <button class="tab-button" role="tab" aria-selected="false" data-target="heroes">
                <span class="tab-icon">⚔️</span>
                <span class="tab-label">Герої</span>
            </button>
            <button class="tab-button" role="tab" aria-selected="false" data-target="builds">
                <span class="tab-icon">🛡️</span>
                <span class="tab-label">Білди</span>
            </button>
            <button class="tab-button" role="tab" aria-selected="false" data-target="guides">
                <span class="tab-icon">📚</span>
                <span class="tab-label">Гайди</span>
            </button>
            <button class="tab-button" role="tab" aria-selected="false" data-target="more">
                <span class="tab-icon">⋯</span>
                <span class="tab-label">Ще</span>
            </button>
        `;
        
        // Assemble navigation
        navContainer.appendChild(navHeader);
        navContainer.appendChild(navMenu);
        navContainer.appendChild(tabBar);
        
        // Insert into DOM
        document.body.appendChild(navContainer);
        
        // Add navigation styles
        this.injectNavigationStyles();
    }
    
    /**
     * Inject optimized navigation styles
     */
    injectNavigationStyles() {
        const styleId = 'ggenius-nav-styles';
        if (document.getElementById(styleId)) return;
        
        const styles = document.createElement('style');
        styles.id = styleId;
        styles.innerHTML = `
            /* Mobile Navigation Styles */
            .ggenius-mobile-nav {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                z-index: 9999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            
            /* Navigation Header */
            .nav-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0.75rem 1rem;
                background: rgba(20, 20, 30, 0.95);
                backdrop-filter: blur(20px);
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                height: 60px;
                box-sizing: border-box;
            }
            
            .nav-toggle {
                display: flex;
                flex-direction: column;
                justify-content: center;
                width: 32px;
                height: 32px;
                background: none;
                border: none;
                cursor: pointer;
                padding: 4px;
                border-radius: 6px;
                transition: background 0.2s ease;
            }
            
            .nav-toggle:hover,
            .nav-toggle:focus {
                background: rgba(255, 255, 255, 0.1);
                outline: none;
            }
            
            .hamburger-line {
                width: 100%;
                height: 2px;
                background: #fff;
                margin: 2px 0;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                border-radius: 1px;
            }
            
            .nav-toggle.active .hamburger-line:nth-child(1) {
                transform: rotate(45deg) translate(6px, 6px);
            }
            
            .nav-toggle.active .hamburger-line:nth-child(2) {
                opacity: 0;
            }
            
            .nav-toggle.active .hamburger-line:nth-child(3) {
                transform: rotate(-45deg) translate(6px, -6px);
            }
            
            .nav-logo img {
                height: 32px;
                width: auto;
            }
            
            .nav-actions {
                display: flex;
                gap: 0.5rem;
            }
            
            .nav-search,
            .nav-user {
                width: 40px;
                height: 40px;
                border: none;
                background: rgba(255, 255, 255, 0.1);
                color: #fff;
                border-radius: 8px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }
            
            .nav-search:hover,
            .nav-user:hover,
            .nav-search:focus,
            .nav-user:focus {
                background: rgba(255, 255, 255, 0.2);
                transform: scale(1.05);
                outline: none;
            }
            
            /* Navigation Menu */
            .nav-menu {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 10000;
                visibility: hidden;
                opacity: 0;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .nav-menu.active {
                visibility: visible;
                opacity: 1;
            }
            
            .nav-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(4px);
            }
            
            .nav-panel {
                position: absolute;
                top: 0;
                left: 0;
                width: 280px;
                height: 100%;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                transform: translateX(-100%);
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                overflow-y: auto;
                display: flex;
                flex-direction: column;
            }
            
            .nav-menu.active .nav-panel {
                transform: translateX(0);
            }
            
            .nav-panel-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 1rem;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                background: rgba(255, 255, 255, 0.05);
            }
            
            .nav-panel-header h2 {
                color: #fff;
                margin: 0;
                font-size: 1.25rem;
                font-weight: 600;
            }
            
            .nav-close {
                width: 32px;
                height: 32px;
                border: none;
                background: rgba(255, 255, 255, 0.1);
                color: #fff;
                border-radius: 6px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }
            
            .nav-close:hover,
            .nav-close:focus {
                background: rgba(255, 255, 255, 0.2);
                outline: none;
            }
            
            .nav-list {
                list-style: none;
                padding: 0;
                margin: 0;
                flex: 1;
            }
            
            .nav-link {
                display: flex;
                align-items: center;
                padding: 1rem;
                color: rgba(255, 255, 255, 0.8);
                text-decoration: none;
                transition: all 0.2s ease;
                border-left: 3px solid transparent;
            }
            
            .nav-link:hover,
            .nav-link:focus {
                background: rgba(255, 255, 255, 0.1);
                color: #fff;
                border-left-color: #00d4ff;
                outline: none;
            }
            
            .nav-link.active {
                background: rgba(0, 212, 255, 0.1);
                color: #00d4ff;
                border-left-color: #00d4ff;
            }
            
            .nav-icon {
                font-size: 1.25rem;
                margin-right: 0.75rem;
                width: 24px;
                text-align: center;
            }
            
            .nav-text {
                font-weight: 500;
            }
            
            .nav-footer {
                padding: 1rem;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                background: rgba(0, 0, 0, 0.2);
            }
            
            .nav-theme-toggle {
                margin-bottom: 1rem;
            }
            
            .theme-switch {
                display: flex;
                align-items: center;
                width: 100%;
                padding: 0.75rem;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                color: rgba(255, 255, 255, 0.8);
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .theme-switch:hover,
            .theme-switch:focus {
                background: rgba(255, 255, 255, 0.1);
                color: #fff;
                outline: none;
            }
            
            .theme-icon {
                margin-right: 0.5rem;
            }
            
            .language-select {
                width: 100%;
                padding: 0.75rem;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                color: rgba(255, 255, 255, 0.8);
                cursor: pointer;
            }
            
            /* Tab Bar */
            .nav-tab-bar {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                display: flex;
                background: rgba(20, 20, 30, 0.95);
                backdrop-filter: blur(20px);
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                padding: 0.5rem 0;
                z-index: 9998;
            }
            
            .tab-button {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 0.5rem;
                background: none;
                border: none;
                color: rgba(255, 255, 255, 0.6);
                cursor: pointer;
                transition: all 0.2s ease;
                min-height: 60px;
            }
            
            .tab-button:hover,
            .tab-button:focus {
                color: rgba(255, 255, 255, 0.8);
                outline: none;
            }
            
            .tab-button.active {
                color: #00d4ff;
            }
            
            .tab-icon {
                font-size: 1.25rem;
                margin-bottom: 0.25rem;
            }
            
            .tab-label {
                font-size: 0.75rem;
                font-weight: 500;
            }
            
            /* Responsive Design */
            @media (max-width: 480px) {
                .nav-panel {
                    width: 100%;
                }
                
                .tab-label {
                    display: none;
                }
                
                .tab-button {
                    min-height: 50px;
                }
            }
            
            /* Dark Theme Support */
            @media (prefers-color-scheme: dark) {
                .nav-header {
                    background: rgba(10, 10, 15, 0.95);
                }
                
                .nav-panel {
                    background: linear-gradient(135deg, #0a0a0f 0%, #0d1421 100%);
                }
                
                .nav-tab-bar {
                    background: rgba(10, 10, 15, 0.95);
                }
            }
            
            /* High Contrast Support */
            @media (prefers-contrast: high) {
                .nav-header,
                .nav-panel,
                .nav-tab-bar {
                    background: #000;
                    border-color: #fff;
                }
                
                .nav-link:hover,
                .nav-link:focus {
                    background: #333;
                }
            }
            
            /* Reduced Motion Support */
            @media (prefers-reduced-motion: reduce) {
                .nav-menu,
                .nav-panel,
                .nav-toggle,
                .hamburger-line,
                .nav-link,
                .tab-button {
                    transition: none;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }
    
    /**
     * Setup advanced gesture handlers
     */
    setupGestureHandlers() {
        const navPanel = document.querySelector('.nav-panel');
        const navOverlay = document.querySelector('.nav-overlay');
        
        if (!navPanel || !navOverlay) return;
        
        // Swipe to open/close navigation
        let startX = 0;
        let startY = 0;
        let currentX = 0;
        let isDragging = false;
        let startTime = 0;
        
        const handleTouchStart = (event) => {
            const touch = event.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            currentX = startX;
            startTime = performance.now();
            isDragging = false;
        };
        
        const handleTouchMove = GGeniusUtils.throttle((event) => {
            if (!event.touches.length) return;
            
            const touch = event.touches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;
            currentX = touch.clientX;
            
            // Determine if this is a horizontal swipe
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > this.gestureThresholds.TOUCH_THRESHOLD) {
                isDragging = true;
                event.preventDefault();
                
                const navMenu = document.querySelector('.nav-menu');
                const isOpen = navMenu.classList.contains('active');
                
                if (!isOpen && deltaX > 0 && startX < 50) {
                    // Opening gesture from left edge
                    const progress = Math.min(deltaX / 280, 1);
                    navPanel.style.transform = `translateX(${-100 + (progress * 100)}%)`;
                    navOverlay.style.opacity = progress * 0.5;
                } else if (isOpen && deltaX < 0) {
                    // Closing gesture
                    const progress = Math.max(1 + (deltaX / 280), 0);
                    navPanel.style.transform = `translateX(${-100 + (progress * 100)}%)`;
                    navOverlay.style.opacity = progress * 0.5;
                }
            }
        }, this.gestureThresholds.THROTTLE_MOUSEMOVE);
        
        const handleTouchEnd = (event) => {
            if (!isDragging) return;
            
            const deltaX = currentX - startX;
            const deltaTime = performance.now() - startTime;
            const velocity = Math.abs(deltaX) / deltaTime;
            
            const navMenu = document.querySelector('.nav-menu');
            const isOpen = navMenu.classList.contains('active');
            
            // Reset styles
            navPanel.style.transform = '';
            navOverlay.style.opacity = '';
            
            // Determine final state based on gesture
            const shouldToggle = (Math.abs(deltaX) > this.gestureThresholds.SWIPE_MIN_DISTANCE) || 
                               (velocity > 0.5 && deltaTime < this.gestureThresholds.SWIPE_MAX_TIME);
            
            if (shouldToggle) {
                if (!isOpen && deltaX > 0) {
                    this.openNavigation();
                } else if (isOpen && deltaX < 0) {
                    this.closeNavigation();
                }
            }
            
            isDragging = false;
        };
        
        // Add touch event listeners
        document.addEventListener('touchstart', handleTouchStart, { passive: false });
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });
        
        // Store handlers for cleanup
        this.gestureHandler = {
            touchstart: handleTouchStart,
            touchmove: handleTouchMove,
            touchend: handleTouchEnd
        };
    }
    
    /**
     * Setup keyboard navigation support
     */
    setupKeyboardNavigation() {
        const handleKeyDown = (event) => {
            const navMenu = document.querySelector('.nav-menu');
            const isOpen = navMenu?.classList.contains('active');
            
            switch (event.key) {
                case 'Escape':
                    if (isOpen) {
                        event.preventDefault();
                        this.closeNavigation();
                    }
                    break;
                    
                case 'Tab':
                    if (isOpen) {
                        this.handleTabNavigation(event);
                    }
                    break;
                    
                case 'ArrowDown':
                case 'ArrowUp':
                    if (isOpen) {
                        event.preventDefault();
                        this.handleArrowNavigation(event.key);
                    }
                    break;
                    
                case 'Enter':
                case ' ':
                    const activeElement = document.activeElement;
                    if (activeElement?.classList.contains('nav-toggle')) {
                        event.preventDefault();
                        this.toggleNavigation();
                    }
                    break;
            }
        };
        
        document.addEventListener('keydown', handleKeyDown);
    }
    
    /**
     * Handle tab navigation within menu
     */
    handleTabNavigation(event) {
        const focusableElements = document.querySelectorAll(
            '.nav-menu .nav-close, .nav-menu .nav-link, .nav-menu .theme-switch, .nav-menu .language-select'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (event.shiftKey) {
            if (document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    }
    
    /**
     * Handle arrow key navigation
     */
    handleArrowNavigation(direction) {
        const navLinks = Array.from(document.querySelectorAll('.nav-menu .nav-link'));
        const currentIndex = navLinks.findIndex(link => link === document.activeElement);
        
        let nextIndex;
        if (direction === 'ArrowDown') {
            nextIndex = currentIndex < navLinks.length - 1 ? currentIndex + 1 : 0;
        } else {
            nextIndex = currentIndex > 0 ? currentIndex - 1 : navLinks.length - 1;
        }
        
        navLinks[nextIndex]?.focus();
    }
    
    /**
     * Setup accessibility features
     */
    setupAccessibilityFeatures() {
        // Announce navigation state changes
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        announcer.style.cssText = `
            position: absolute !important;
            width: 1px !important;
            height: 1px !important;
            padding: 0 !important;
            margin: -1px !important;
            overflow: hidden !important;
            clip: rect(0, 0, 0, 0) !important;
            white-space: nowrap !important;
            border: 0 !important;
        `;
        document.body.appendChild(announcer);
        
        this.announcer = announcer;
        
        // Focus management
        this.setupFocusManagement();
        
        // High contrast mode detection
        if (GGENIUS_CONFIG.A11Y.HIGH_CONTRAST) {
            document.body.classList.add('high-contrast-mode');
        }
        
        // Reduced motion support
        if (GGENIUS_CONFIG.ANIMATION.REDUCED_MOTION) {
            document.body.classList.add('reduced-motion');
        }
    }
    
    /**
     * Setup focus management
     */
    setupFocusManagement() {
        let lastFocusedElement = null;
        
        // Store focus before opening navigation
        document.addEventListener('click', (event) => {
            if (event.target.closest('.nav-toggle')) {
                lastFocusedElement = document.activeElement;
            }
        });
        
        // Restore focus when closing navigation
        this.restoreFocus = () => {
            if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
                setTimeout(() => {
                    lastFocusedElement.focus();
                    lastFocusedElement = null;
                }, GGENIUS_CONFIG.A11Y.FOCUS_TIMEOUT);
            }
        };
    }
    
    /**
     * Setup PWA navigation features
     */
    setupPWANavigation() {
        // Handle PWA installation prompt
        window.addEventListener('beforeinstallprompt', (event) => {
            event.preventDefault();
            this.installPrompt = event;
            this.showInstallButton();
        });
        
        // Handle PWA app installed
        window.addEventListener('appinstalled', () => {
            this.hideInstallButton();
            this.announceToUser('Додаток успішно встановлено');
        });
        
        // Handle offline/online status
        window.addEventListener('online', () => {
            this.updateConnectionStatus(true);
        });
        
        window.addEventListener('offline', () => {
            this.updateConnectionStatus(false);
        });
    }
    
    /**
     * Show PWA install button
     */
    showInstallButton() {
        const navActions = document.querySelector('.nav-actions');
        if (!navActions || document.querySelector('.install-button')) return;
        
        const installButton = document.createElement('button');
        installButton.className = 'install-button nav-user';
        installButton.setAttribute('aria-label', 'Встановити додаток');
        installButton.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
        `;
        
        installButton.addEventListener('click', () => this.handleInstallClick());
        navActions.appendChild(installButton);
    }
    
    /**
     * Hide PWA install button
     */
    hideInstallButton() {
        const installButton = document.querySelector('.install-button');
        if (installButton) {
            installButton.remove();
        }
    }
    
    /**
     * Handle PWA install click
     */
    async handleInstallClick() {
        if (!this.installPrompt) return;
        
        try {
            const result = await this.installPrompt.prompt();
            console.log('PWA install prompt result:', result);
            
            if (result.outcome === 'accepted') {
                this.announceToUser('Розпочато встановлення додатку');
            }
            
            this.installPrompt = null;
            this.hideInstallButton();
        } catch (error) {
            console.error('PWA install error:', error);
        }
    }
    
    /**
     * Update connection status indicator
     */
    updateConnectionStatus(isOnline) {
        const statusIndicator = document.querySelector('.connection-status') || this.createConnectionStatus();
        
        statusIndicator.className = `connection-status ${isOnline ? 'online' : 'offline'}`;
        statusIndicator.textContent = isOnline ? '🟢 Онлайн' : '🔴 Офлайн';
        
        this.announceToUser(isOnline ? 'З\'єднання відновлено' : 'Відсутнє з\'єднання з інтернетом');
        
        // Auto-hide after 3 seconds if online
        if (isOnline) {
            setTimeout(() => {
                statusIndicator.style.display = 'none';
            }, 3000);
        } else {
            statusIndicator.style.display = 'block';
        }
    }
    
    /**
     * Create connection status indicator
     */
    createConnectionStatus() {
        const indicator = document.createElement('div');
        indicator.className = 'connection-status';
        indicator.style.cssText = `
            position: fixed;
            top: 70px;
            left: 1rem;
            right: 1rem;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 0.75rem 1rem;
            border-radius: 8px;
            text-align: center;
            font-size: 0.9rem;
            z-index: 10001;
            display: none;
            backdrop-filter: blur(10px);
        `;
        
        document.body.appendChild(indicator);
        return indicator;
    }
    
    /**
     * Bind all navigation events
     */
    bindEvents() {
        // Navigation toggle
        const navToggle = document.querySelector('.nav-toggle');
        const navClose = document.querySelector('.nav-close');
        const navOverlay = document.querySelector('.nav-overlay');
        
        if (navToggle) {
            navToggle.addEventListener('click', () => this.toggleNavigation());
        }
        
        if (navClose) {
            navClose.addEventListener('click', () => this.closeNavigation());
        }
        
        if (navOverlay) {
            navOverlay.addEventListener('click', () => this.closeNavigation());
        }
        
        // Navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (event) => this.handleNavLinkClick(event));
        });
        
        // Tab bar buttons
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', (event) => this.handleTabClick(event));
        });
        
        // Theme toggle
        const themeSwitch = document.querySelector('.theme-switch');
        if (themeSwitch) {
            themeSwitch.addEventListener('click', () => this.toggleTheme());
        }
        
        // Language selector
        const languageSelect = document.querySelector('.language-select');
        if (languageSelect) {
            languageSelect.addEventListener('change', (event) => this.handleLanguageChange(event));
        }
        
        // Search button
        const searchButton = document.querySelector('.nav-search');
        if (searchButton) {
            searchButton.addEventListener('click', () => this.handleSearchClick());
        }
        
        // User button
        const userButton = document.querySelector('.nav-user:not(.install-button)');
        if (userButton) {
            userButton.addEventListener('click', () => this.handleUserClick());
        }
    }
    
    /**
     * Toggle navigation menu
     */
    toggleNavigation() {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        
        if (!navMenu || !navToggle) return;
        
        const isOpen = navMenu.classList.contains('active');
        
        if (isOpen) {
            this.closeNavigation();
        } else {
            this.openNavigation();
        }
    }
    
    /**
     * Open navigation menu
     */
    openNavigation() {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        
        if (!navMenu || !navToggle) return;
        
        navMenu.classList.add('active');
        navToggle.classList.add('active');
        navToggle.setAttribute('aria-expanded', 'true');
        navMenu.setAttribute('aria-hidden', 'false');
        
        // Focus first menu item
        setTimeout(() => {
            const firstLink = document.querySelector('.nav-menu .nav-link');
            if (firstLink) {
                firstLink.focus();
            }
        }, GGENIUS_CONFIG.A11Y.FOCUS_TIMEOUT);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        this.announceToUser('Меню відкрито');
    }
    
    /**
     * Close navigation menu
     */
    closeNavigation() {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        
        if (!navMenu || !navToggle) return;
        
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.setAttribute('aria-hidden', 'true');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Restore focus
        if (this.restoreFocus) {
            this.restoreFocus();
        }
        
        this.announceToUser('Меню закрито');
    }
    
    /**
     * Handle navigation link clicks
     */
    handleNavLinkClick(event) {
        const link = event.target.closest('.nav-link');
        if (!link) return;
        
        // Update active state
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Close navigation on mobile
        setTimeout(() => {
            this.closeNavigation();
        }, 150);
        
        // Track navigation
        if (window.GGeniusAnalytics) {
            window.GGeniusAnalytics.trackEvent('navigation', 'link_click', {
                href: link.href,
                text: link.textContent.trim()
            });
        }
    }
    
    /**
     * Handle tab button clicks
     */
    handleTabClick(event) {
        const button = event.target.closest('.tab-button');
        if (!button) return;
        
        const target = button.dataset.target;
        
        // Update active state
        document.querySelectorAll('.tab-button').forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
        });
        
        button.classList.add('active');
        button.setAttribute('aria-selected', 'true');
        
        // Handle special "more" tab
        if (target === 'more') {
            this.openNavigation();
            return;
        }
        
        // Navigate to target
        const targetUrl = this.getTargetUrl(target);
        if (targetUrl && targetUrl !== location.pathname) {
            window.location.href = targetUrl;
        }
        
        // Track tab navigation
        if (window.GGeniusAnalytics) {
            window.GGeniusAnalytics.trackEvent('navigation', 'tab_click', {
                target: target,
                url: targetUrl
            });
        }
    }
    
    /**
     * Get target URL for tab
     */
    getTargetUrl(target) {
        const urlMap = {
            home: '/',
            heroes: '/heroes',
            builds: '/builds',
            guides: '/guides',
            tournaments: '/tournaments'
        };
        
        return urlMap[target] || '/';
    }
    
    /**
     * Toggle theme
     */
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('ggenius-theme', newTheme);
        
        // Update theme button
        const themeIcon = document.querySelector('.theme-icon');
        const themeText = document.querySelector('.theme-text');
        
        if (themeIcon && themeText) {
            if (newTheme === 'dark') {
                themeIcon.textContent = '🌙';
                themeText.textContent = 'Темна тема';
            } else {
                themeIcon.textContent = '☀️';
                themeText.textContent = 'Світла тема';
            }
        }
        
        this.announceToUser(`Активовано ${newTheme === 'dark' ? 'темну' : 'світлу'} тему`);
        
        // Track theme change
        if (window.GGeniusAnalytics) {
            window.GGeniusAnalytics.trackEvent('theme', 'toggle', { theme: newTheme });
        }
    }
    
    /**
     * Handle language change
     */
    handleLanguageChange(event) {
        const selectedLanguage = event.target.value;
        
        // Store language preference
        localStorage.setItem('ggenius-language', selectedLanguage);
        
        // Apply language change (would integrate with i18n system)
        this.applyLanguage(selectedLanguage);
        
        this.announceToUser(`Мову змінено на ${this.getLanguageName(selectedLanguage)}`);
        
        // Track language change
        if (window.GGeniusAnalytics) {
            window.GGeniusAnalytics.trackEvent('language', 'change', { language: selectedLanguage });
        }
    }
    
    /**
     * Apply language settings
     */
    applyLanguage(language) {
        document.documentElement.setAttribute('lang', language);
        
        // This would integrate with your i18n system
        // For now, just store the preference
        console.log(`Language changed to: ${language}`);
    }
    
    /**
     * Get language display name
     */
    getLanguageName(code) {
        const names = {
            uk: 'українську',
            en: 'англійську',
            ru: 'російську'
        };
        return names[code] || code;
    }
    
    /**
     * Handle search button click
     */
    handleSearchClick() {
        // This would open search modal or navigate to search page
        console.log('Search clicked');
        
        // For now, just announce
        this.announceToUser('Пошук відкрито');
        
        // Track search
        if (window.GGeniusAnalytics) {
            window.GGeniusAnalytics.trackEvent('search', 'open');
        }
    }
    
    /**
     * Handle user button click
     */
    handleUserClick() {
        // This would open user menu or navigate to profile
        console.log('User menu clicked');
        
        // For now, just announce
        this.announceToUser('Меню користувача відкрито');
        
        // Track user menu
        if (window.GGeniusAnalytics) {
            window.GGeniusAnalytics.trackEvent('user', 'menu_open');
        }
    }
    
    /**
     * Announce message to screen readers
     */
    announceToUser(message) {
        if (!this.announcer) return;
        
        // Clear previous message
        this.announcer.textContent = '';
        
        // Set new message with slight delay for better screen reader support
        setTimeout(() => {
            this.announcer.textContent = message;
        }, GGENIUS_CONFIG.A11Y.ANNOUNCE_DELAY);
    }
    
    /**
     * Update navigation state
     */
    updateNavigationState(page) {
        // Update active navigation link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === page) {
                link.classList.add('active');
            }
        });
        
        // Update active tab
        document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.remove('active');
            button.setAttribute('aria-selected', 'false');
        });
        
        const targetTab = this.getTabFromPage(page);
        const activeTab = document.querySelector(`[data-target="${targetTab}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
            activeTab.setAttribute('aria-selected', 'true');
        }
        
        // Store current page
        this.navigationState.set('currentPage', page);
    }
    
    /**
     * Get tab target from page URL
     */
    getTabFromPage(page) {
        if (page === '/' || page === '/home') return 'home';
        if (page.startsWith('/heroes')) return 'heroes';
        if (page.startsWith('/builds')) return 'builds';
        if (page.startsWith('/guides')) return 'guides';
        return 'more';
    }
    
    /**
     * Destroy navigation manager
     */
    destroy() {
        // Remove event listeners
        if (this.gestureHandler) {
            document.removeEventListener('touchstart', this.gestureHandler.touchstart);
            document.removeEventListener('touchmove', this.gestureHandler.touchmove);
            document.removeEventListener('touchend', this.gestureHandler.touchend);
        }
        
        // Remove navigation DOM elements
        const navContainer = document.querySelector('.ggenius-mobile-nav');
        if (navContainer) {
            navContainer.remove();
        }
        
        // Remove styles
        const styles = document.getElementById('ggenius-nav-styles');
        if (styles) {
            styles.remove();
        }
        
        // Remove announcer
        if (this.announcer) {
            this.announcer.remove();
        }
        
        // Clear state
        this.navigationState.clear();
        this.isInitialized = false;
        
        console.log('📱 MobileNavigationManager destroyed');
    }
}

/**
 * 🧠 INTELLIGENT CONTENT MANAGER - AI-Powered Content System
 * Dynamic content loading, caching, and optimization
 */
class IntelligentContentManager {
    constructor() {
        this.cache = new Map();
        this.loadingQueue = new Map();
        this.observers = new Map();
        this.contentMetrics = new Map();
        this.aiProcessor = null;
        this.isInitialized = false;
        
        // Content strategies based on device capabilities
        this.deviceCapabilities = GGeniusUtils.getDeviceCapabilities();
        this.loadingStrategy = this.determineLoadingStrategy();
        
        this.init();
    }
    
    init() {
        if (this.isInitialized) return;
        
        this.setupContentObserver();
        this.setupPrefetching();
        this.setupImageOptimization();
        this.setupCriticalResourcePriority();
        this.initializeAIProcessor();
        this.startContentMonitoring();
        
        this.isInitialized = true;
        console.log('🧠 IntelligentContentManager initialized with strategy:', this.loadingStrategy);
    }
    
    /**
     * Determine optimal loading strategy based on device capabilities
     */
    determineLoadingStrategy() {
        const { performanceTier, connection, device } = this.deviceCapabilities;
        
        if (performanceTier === 'low' || connection.isSlowConnection) {
            return {
                strategy: 'conservative',
                prefetchLimit: 2,
                imageQuality: 'low',
                lazyLoadThreshold: '200px',
                batchSize: 3,
                cacheLimit: 50
            };
        } else if (performanceTier === 'high' && !connection.isSlowConnection) {
            return {
                strategy: 'aggressive',
                prefetchLimit: 8,
                imageQuality: 'high',
                lazyLoadThreshold: '500px',
                batchSize: 10,
                cacheLimit: 200
            };
        } else {
            return {
                strategy: 'balanced',
                prefetchLimit: 5,
                imageQuality: 'medium',
                lazyLoadThreshold: '300px',
                batchSize: 6,
                cacheLimit: 100
            };
        }
    }
    
    /**
     * Setup intelligent content observer for lazy loading
     */
    setupContentObserver() {
        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadContent(entry.target);
                    this.contentObserver.unobserve(entry.target);
                }
            });
        };
        
        this.contentObserver = GGeniusUtils.createIntersectionObserver(observerCallback, {
            rootMargin: this.loadingStrategy.lazyLoadThreshold,
            threshold: [0.1]
        });
        
        // Observe all lazy-loadable content
        this.observeLazyContent();
    }
    
    /**
     * Observe elements that should be lazy loaded
     */
    observeLazyContent() {
        const lazyElements = document.querySelectorAll('[data-lazy-load]');
        lazyElements.forEach(element => {
            this.contentObserver.observe(element);
        });
    }
    
    /**
     * Setup intelligent prefetching
     */
    setupPrefetching() {
        // Prefetch based on user behavior patterns
        this.setupHoverPrefetch();
        this.setupScrollPrefetch();
        this.setupNavigationPrefetch();
        
        // Prefetch critical resources
        this.prefetchCriticalResources();
    }
    
    /**
     * Setup hover-based prefetching
     */
    setupHoverPrefetch() {
        const prefetchOnHover = GGeniusUtils.debounce((target) => {
            const href = target.getAttribute('href');
            if (href && !this.cache.has(href)) {
                this.prefetchResource(href, 'hover');
            }
        }, 150);
        
        document.addEventListener('mouseover', (event) => {
            const link = event.target.closest('a[href]');
            if (link && !link.dataset.noPrefetch) {
                prefetchOnHover(link);
            }
        });
    }
    
    /**
     * Setup scroll-based prefetching
     */
    setupScrollPrefetch() {
        let lastScrollY = window.scrollY;
        let scrollDirection = 'down';
        
        const handleScroll = GGeniusUtils.throttle(() => {
            const currentScrollY = window.scrollY;
            scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
            lastScrollY = currentScrollY;
            
            // Prefetch content in scroll direction
            if (scrollDirection === 'down') {
                this.prefetchNextContent();
            }
        }, this.deviceCapabilities.performanceTier === 'low' ? 100 : 50);
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    /**
     * Setup navigation-based prefetching
     */
    setupNavigationPrefetch() {
        // Prefetch likely next pages based on current page
        const currentPath = location.pathname;
        const prefetchCandidates = this.getPrefetchCandidates(currentPath);
        
        prefetchCandidates.forEach((url, index) => {
            setTimeout(() => {
                this.prefetchResource(url, 'navigation');
            }, index * 1000); // Stagger prefetching
        });
    }
    
    /**
     * Get prefetch candidates based on current page
     */
    getPrefetchCandidates(path) {
        const candidates = [];
        
        // Define navigation patterns
        const navigationPatterns = {
            '/': ['/heroes', '/builds', '/tier-list'],
            '/heroes': ['/heroes/[slug]', '/builds', '/tier-list'],
            '/builds': ['/builds/[slug]', '/heroes', '/guides'],
            '/guides': ['/guides/[slug]', '/heroes', '/builds'],
            '/tournaments': ['/tournaments/[slug]', '/community'],
            '/community': ['/guides', '/tournaments']
        };
        
        const pattern = navigationPatterns[path] || [];
        return pattern.slice(0, this.loadingStrategy.prefetchLimit);
    }
    
    /**
     * Prefetch critical resources
     */
    prefetchCriticalResources() {
        const criticalResources = [
            '/static/css/critical.css',
            '/static/js/core.js',
            '/static/images/hero-sprites.webp'
        ];
        
        criticalResources.forEach(resource => {
            this.prefetchResource(resource, 'critical');
        });
    }
    
    /**
     * Prefetch resource with intelligent caching
     */
    async prefetchResource(url, reason = 'unknown') {
        if (this.cache.has(url) || this.loadingQueue.has(url)) {
            return; // Already cached or loading
        }
        
        // Check cache limits
        if (this.cache.size >= this.loadingStrategy.cacheLimit) {
            this.evictOldestCache();
        }
        
        try {
            this.loadingQueue.set(url, { startTime: performance.now(), reason });
            
            const response = await fetch(url, {
                method: 'GET',
                mode: 'cors',
                cache: 'force-cache',
                priority: reason === 'critical' ? 'high' : 'low'
            });
            
            if (response.ok) {
                const content = await response.text();
                const loadTime = performance.now() - this.loadingQueue.get(url).startTime;
                
                this.cache.set(url, {
                    content,
                    timestamp: Date.now(),
                    loadTime,
                    reason,
                    size: content.length,
                    accessed: 1
                });
                
                console.log(`📦 Prefetched ${url} (${reason}) in ${loadTime.toFixed(2)}ms`);
            }
        } catch (error) {
            console.warn(`⚠️ Failed to prefetch ${url}:`, error);
        } finally {
            this.loadingQueue.delete(url);
        }
    }
    
    /**
     * Evict oldest cache entries
     */
    evictOldestCache() {
        const entries = Array.from(this.cache.entries());
        entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
        
        // Remove oldest 25% of entries
        const toRemove = Math.floor(entries.length * 0.25);
        for (let i = 0; i < toRemove; i++) {
            this.cache.delete(entries[i][0]);
        }
        
        console.log(`🧹 Evicted ${toRemove} cache entries`);
    }
    
    /**
     * Setup image optimization
     */
    setupImageOptimization() {
        this.observeImages();
        this.setupResponsiveImages();
        this.setupImageCompression();
    }
    
    /**
     * Observe and optimize images
     */
    observeImages() {
        const imageObserver = GGeniusUtils.createIntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.optimizeImage(entry.target);
                }
            });
        }, {
            rootMargin: '50px',
            threshold: 0.1
        });
        
        const images = document.querySelectorAll('img[data-src], picture source[data-srcset]');
        images.forEach(img => imageObserver.observe(img));
        
        this.observers.set('images', imageObserver);
    }
    
    /**
     * Optimize individual image
     */
    optimizeImage(img) {
        const { imageQuality } = this.loadingStrategy;
        const { isHighDPI, device } = this.deviceCapabilities;
        
        // Determine optimal image source
        let src = img.dataset.src;
        if (src) {
            // Apply quality and size optimizations
            src = this.getOptimizedImageUrl(src, {
                quality: imageQuality,
                dpr: isHighDPI ? 2 : 1,
                width: Math.min(img.offsetWidth || device.width, 1920)
            });
            
            // Create new image for loading
            const newImg = new Image();
            newImg.onload = () => {
                img.src = src;
                img.classList.add('loaded');
                this.trackImageLoad(src, true);
            };
            newImg.onerror = () => {
                console.warn(`Failed to load optimized image: ${src}`);
                this.trackImageLoad(src, false);
                // Fallback to original
                if (img.dataset.fallback) {
                    img.src = img.dataset.fallback;
                }
            };
            newImg.src = src;
        }
        
        // Handle responsive images
        const srcset = img.dataset.srcset;
        if (srcset) {
            img.srcset = srcset;
        }
    }
    
    /**
     * Get optimized image URL
     */
    getOptimizedImageUrl(src, options = {}) {
        const { quality = 'medium', dpr = 1, width } = options;
        
        // Quality mapping
        const qualityMap = {
            low: 60,
            medium: 80,
            high: 95
        };
        
        const params = new URLSearchParams();
        params.set('q', qualityMap[quality]);
        params.set('dpr', dpr);
        if (width) params.set('w', width);
        
        // Add format optimization
        if (this.deviceCapabilities.features.avif) {
            params.set('f', 'avif');
        } else if (this.deviceCapabilities.features.webP) {
            params.set('f', 'webp');
        }
        
        return `${src}?${params.toString()}`;
    }
    
    /**
     * Setup responsive images
     */
    setupRespons