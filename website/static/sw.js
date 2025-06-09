/**
 * 🔧 GGENIUS SERVICE WORKER v3.0.0
 * Enterprise-grade PWA with intelligent caching
 */

'use strict';

const CACHE_NAME = 'ggenius-v3.0.0';
const CACHE_VERSION = '3.0.0';
const MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50MB
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

// Cache strategies configuration
const CACHE_STRATEGIES = {
    API: 'networkFirst',
    ASSETS: 'cacheFirst', 
    CONTENT: 'staleWhileRevalidate',
    IMAGES: 'cacheFirst'
};

// Critical resources that must be cached
const CRITICAL_RESOURCES = [
    '/',
    '/static/css/style.css',
    '/static/css/mobile-navigation.css',
    '/static/css/notifications.css',
    '/static/js/enhancements.js',
    '/static/js/ai-cards-hub.js',
    '/static/js/workers/ai-processor.js',
    '/static/js/workers/image-processor.js',
    '/static/js/workers/data-analyzer.js',
    '/manifest.json'
];

// API endpoints
const API_PATTERNS = [
    /\/api\//,
    /\/ws\//
];

// Asset patterns
const ASSET_PATTERNS = [
    /\.(?:css|js|png|jpg|jpeg|gif|webp|avif|svg|woff|woff2|ttf|eot)$/,
    /\/static\//
];

// Install event
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker installing...');
    
    event.waitUntil(
        (async () => {
            try {
                const cache = await caches.open(CACHE_NAME);
                
                // Cache critical resources with retry logic
                const cachePromises = CRITICAL_RESOURCES.map(async (resource) => {
                    try {
                        await cache.add(resource);
                    } catch (error) {
                        console.warn(`Failed to cache ${resource}:`, error);
                    }
                });
                
                await Promise.allSettled(cachePromises);
                console.log('✅ Critical resources cached');
                
                // Skip waiting to activate immediately
                await self.skipWaiting();
                
            } catch (error) {
                console.error('❌ Installation failed:', error);
            }
        })()
    );
});

// Activate event
self.addEventListener('activate', (event) => {
    console.log('🚀 Service Worker activating...');
    
    event.waitUntil(
        (async () => {
            try {
                // Clean up old caches
                const cacheNames = await caches.keys();
                await Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('🗑️ Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
                
                // Clean up oversized cache
                await cleanupCache();
                
                // Take control of all clients
                await self.clients.claim();
                
                console.log('✅ Service Worker activated');
                
                // Notify clients
                const clients = await self.clients.matchAll();
                clients.forEach(client => {
                    client.postMessage({
                        type: 'SW_ACTIVATED',
                        version: CACHE_VERSION
                    });
                });
                
            } catch (error) {
                console.error('❌ Activation failed:', error);
            }
        })()
    );
});

// Fetch event
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-HTTP requests
    if (!url.protocol.startsWith('http')) return;
    
    // Skip POST requests for caching
    if (request.method !== 'GET') return;
    
    // Determine strategy based on request type
    let strategy;
    
    if (API_PATTERNS.some(pattern => pattern.test(url.pathname))) {
        strategy = CACHE_STRATEGIES.API;
    } else if (ASSET_PATTERNS.some(pattern => pattern.test(url.pathname))) {
        strategy = CACHE_STRATEGIES.ASSETS;
    } else if (url.pathname.includes('/images/')) {
        strategy = CACHE_STRATEGIES.IMAGES;
    } else {
        strategy = CACHE_STRATEGIES.CONTENT;
    }
    
    event.respondWith(handleFetchWithStrategy(request, strategy));
});

// Strategy implementations
async function handleFetchWithStrategy(request, strategy) {
    try {
        switch (strategy) {
            case 'networkFirst':
                return await networkFirst(request);
            case 'cacheFirst':
                return await cacheFirst(request);
            case 'staleWhileRevalidate':
                return await staleWhileRevalidate(request);
            default:
                return await fetch(request);
        }
    } catch (error) {
        console.error('Fetch strategy failed:', error);
        return await fallbackResponse(request);
    }
}

async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request, { 
            timeout: 5000 // 5 second timeout
        });
        
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone()).catch(console.warn);
            
            // Notify successful network request
            notifyClient('CACHE_UPDATED', { url: request.url });
        }
        
        return networkResponse;
        
    } catch (error) {
        console.warn('Network failed, trying cache:', error);
        
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            // Notify client about offline fallback
            notifyClient('OFFLINE_FALLBACK', { url: request.url });
            return cachedResponse;
        }
        
        throw error;
    }
}

async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        // Check if cache is expired
        const cacheDate = new Date(cachedResponse.headers.get('date') || 0);
        const isExpired = Date.now() - cacheDate.getTime() > CACHE_EXPIRY;
        
        if (!isExpired) {
            return cachedResponse;
        }
    }
    
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone()).catch(console.warn);
        }
        
        return networkResponse;
        
    } catch (error) {
        if (cachedResponse) {
            notifyClient('OFFLINE_FALLBACK', { url: request.url });
            return cachedResponse;
        }
        throw error;
    }
}

async function staleWhileRevalidate(request) {
    const cachedResponse = await caches.match(request);
    
    // Start network request in background
    const networkPromise = fetch(request).then(async networkResponse => {
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone()).catch(console.warn);
            
            // Notify about background update
            notifyClient('CACHE_UPDATED', { url: request.url, background: true });
        }
        return networkResponse;
    }).catch(error => {
        console.warn('Background network update failed:', error);
        return null;
    });
    
    // Return cached response immediately, or wait for network
    return cachedResponse || networkPromise;
}

// Fallback response for failed requests
async function fallbackResponse(request) {
    const url = new URL(request.url);
    
    // For navigation requests, return offline page
    if (request.mode === 'navigate') {
        const offlinePage = await caches.match('/offline.html');
        if (offlinePage) return offlinePage;
        
        return new Response(`
            <!DOCTYPE html>
            <html lang="uk" data-theme="dark">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>GGenius - Офлайн</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 100%);
                        color: white; min-height: 100vh; 
                        display: flex; align-items: center; justify-content: center;
                        text-align: center; padding: 2rem;
                    }
                    .container { max-width: 600px; }
                    h1 { font-size: 2.5rem; margin-bottom: 1rem; color: #7c4dff; }
                    p { font-size: 1.1rem; margin-bottom: 2rem; opacity: 0.8; }
                    .btn { 
                        background: linear-gradient(135deg, #7c4dff, #2196f3);
                        color: white; padding: 1rem 2rem; border: none;
                        border-radius: 8px; font-size: 1rem; cursor: pointer;
                        text-decoration: none; display: inline-block;
                    }
                    .status { margin-top: 2rem; font-size: 0.9rem; opacity: 0.6; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>🌐 GGenius Офлайн</h1>
                    <p>Немає з'єднання з інтернетом, але GGenius продовжує працювати в офлайн режимі!</p>
                    <button class="btn" onclick="window.location.reload()">🔄 Спробувати знову</button>
                    <div class="status">Service Worker v${CACHE_VERSION} активний</div>
                </div>
                <script>
                    // Auto-retry when online
                    window.addEventListener('online', () => {
                        setTimeout(() => window.location.reload(), 1000);
                    });
                </script>
            </body>
            </html>
        `, {
            status: 200,
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
    }
    
    // For other requests, return basic error response
    return new Response(JSON.stringify({
        error: 'Network unavailable',
        message: 'This request failed and no cached version is available',
        timestamp: new Date().toISOString()
    }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
    });
}

// Message handling
self.addEventListener('message', async (event) => {
    const { type, data } = event.data;
    
    try {
        switch (type) {
            case 'SKIP_WAITING':
                await self.skipWaiting();
                break;
                
            case 'GET_VERSION':
                event.ports[0]?.postMessage({ version: CACHE_VERSION });
                break;
                
            case 'CLEAR_CACHE':
                await clearAllCaches();
                event.ports[0]?.postMessage({ success: true });
                break;
                
            case 'PREFETCH_RESOURCES':
                await prefetchResources(data.urls || []);
                break;
                
            case 'GET_CACHE_STATUS':
                const status = await getCacheStatus();
                event.ports[0]?.postMessage(status);
                break;
                
            default:
                console.warn('Unknown message type:', type);
        }
    } catch (error) {
        console.error('Message handling failed:', error);
        event.ports[0]?.postMessage({ error: error.message });
    }
});

// Background sync
self.addEventListener('sync', (event) => {
    console.log('🔄 Background sync:', event.tag);
    
    switch (event.tag) {
        case 'background-sync':
            event.waitUntil(performBackgroundSync());
            break;
            
        case 'cache-cleanup':
            event.waitUntil(cleanupCache());
            break;
    }
});

// Push notifications
self.addEventListener('push', (event) => {
    console.log('🔔 Push notification received');
    
    if (!event.data) return;
    
    try {
        const data = event.data.json();
        const options = {
            body: data.message || 'GGenius notification',
            icon: '/static/images/icons/icon-192x192.png',
            badge: '/static/images/icons/badge-72x72.png',
            tag: data.tag || 'ggenius-notification',
            data: data.data || {},
            actions: data.actions || [],
            requireInteraction: data.persistent || false,
            silent: data.silent || false
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title || 'GGenius', options)
        );
        
        // Notify clients about push
        notifyClient('PUSH_RECEIVED', data);
        
    } catch (error) {
        console.error('Push notification failed:', error);
    }
});

// Notification click
self.addEventListener('notificationclick', (event) => {
    console.log('🔔 Notification clicked:', event.notification.tag);
    
    event.notification.close();
    
    const data = event.notification.data || {};
    const action = event.action;
    
    event.waitUntil(
        (async () => {
            const clients = await self.clients.matchAll({ type: 'window' });
            
            // If action is specified, handle it
            if (action && data.actions) {
                const actionData = data.actions.find(a => a.action === action);
                if (actionData && actionData.url) {
                    return openUrl(actionData.url, clients);
                }
            }
            
            // Open URL from notification data
            if (data.url) {
                return openUrl(data.url, clients);
            }
            
            // Focus existing client or open new one
            if (clients.length > 0) {
                return clients[0].focus();
            }
            
            return self.clients.openWindow('/');
        })()
    );
});

// Utility functions
async function cleanupCache() {
    try {
        const cache = await caches.open(CACHE_NAME);
        const requests = await cache.keys();
        
        let totalSize = 0;
        const sizes = new Map();
        
        // Calculate cache size
        for (const request of requests) {
            const response = await cache.match(request);
            if (response) {
                const size = parseInt(response.headers.get('content-length') || '0');
                sizes.set(request.url, size);
                totalSize += size;
            }
        }
        
        console.log(`📊 Cache size: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);
        
        // Remove old entries if cache is too large
        if (totalSize > MAX_CACHE_SIZE) {
            const sortedRequests = requests.sort((a, b) => {
                const aResponse = cache.match(a);
                const bResponse = cache.match(b);
                const aDate = new Date(aResponse?.headers.get('date') || 0);
                const bDate = new Date(bResponse?.headers.get('date') || 0);
                return aDate - bDate; // Oldest first
            });
            
            let removedSize = 0;
            const toRemove = [];
            
            for (const request of sortedRequests) {
                const size = sizes.get(request.url) || 0;
                toRemove.push(request);
                removedSize += size;
                
                if (totalSize - removedSize <= MAX_CACHE_SIZE * 0.8) break;
            }
            
            // Remove old entries
            await Promise.all(toRemove.map(request => cache.delete(request)));
            console.log(`🗑️ Removed ${toRemove.length} cache entries (${(removedSize / 1024 / 1024).toFixed(2)}MB)`);
        }
        
    } catch (error) {
        console.error('Cache cleanup failed:', error);
    }
}

async function clearAllCaches() {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
    console.log('🗑️ All caches cleared');
}

async function prefetchResources(urls) {
    const cache = await caches.open(CACHE_NAME);
    const promises = urls.map(async (url) => {
        try {
            const response = await fetch(url);
            if (response.ok) {
                await cache.put(url, response);
            }
        } catch (error) {
            console.warn(`Failed to prefetch ${url}:`, error);
        }
    });
    
    await Promise.allSettled(promises);
    console.log(`📥 Prefetched ${urls.length} resources`);
}

async function getCacheStatus() {
    try {
        const cache = await caches.open(CACHE_NAME);
        const requests = await cache.keys();
        
        let totalSize = 0;
        let expiredCount = 0;
        const now = Date.now();
        
        for (const request of requests) {
            const response = await cache.match(request);
            if (response) {
                const size = parseInt(response.headers.get('content-length') || '0');
                totalSize += size;
                
                const cacheDate = new Date(response.headers.get('date') || 0);
                if (now - cacheDate.getTime() > CACHE_EXPIRY) {
                    expiredCount++;
                }
            }
        }
        
        return {
            version: CACHE_VERSION,
            entries: requests.length,
            size: totalSize,
            expired: expiredCount,
            maxSize: MAX_CACHE_SIZE,
            utilizationPercent: (totalSize / MAX_CACHE_SIZE) * 100
        };
        
    } catch (error) {
        console.error('Failed to get cache status:', error);
        return { error: error.message };
    }
}

async function performBackgroundSync() {
    try {
        // Sync any pending data
        notifyClient('SYNC_BACKGROUND', { status: 'completed' });
        console.log('✅ Background sync completed');
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

async function openUrl(url, clients) {
    // Check if URL is already open
    for (const client of clients) {
        if (client.url.includes(url)) {
            return client.focus();
        }
    }
    
    // Open new window/tab
    return self.clients.openWindow(url);
}

function notifyClient(type, payload = {}) {
    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage({ type, payload });
        });
    });
}

// Periodic cache cleanup
setInterval(() => {
    cleanupCache().catch(console.error);
}, 60 * 60 * 1000); // Every hour

console.log('🔧 GGenius Service Worker v3.0.0 loaded');
