// Service Worker for Web Outright
// Provides basic caching for better performance

const CACHE_NAME = 'weboutright-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/main.js',
  '/schema.json',
  // Add optimized images after compression
  // '/img/img-1-optimized.png',
  // '/img/img-2-optimized.png',
  // '/img/img-3-optimized.png',
  // '/img/img-4-optimized.png',
  // '/img/img-5-optimized.png',
  // '/img/contact-optimized.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});
