// Service worker for caching static assets.
// This file provides a very simple offline fallback.  For a full PWA
// implementation consider using Workbox or writing your own caching
// strategies.

const CACHE_NAME = 'brauerei-cache-v1';
const OFFLINE_URL = '/index.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Cache the core assets required for the app to run offline.  The CSS and
      // JavaScript paths were updated during the refactor to a single
      // stylesheet and a single script.  Additional pages (e.g. brewery.html,
      // blog.html) can be added to this array if needed.
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/app.js',
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Network first, fallback to cache
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request).then((resp) => resp || caches.match(OFFLINE_URL)))
  );
});