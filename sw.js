const CACHE_NAME = 'rpl-smkn4-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/blog.html',
  '/article.html',
  '/assets/css/style.min.css',
  '/assets/js/main.min.js',
  '/assets/js/vendor.js',
  '/assets/fonts/inter-var.woff2',
  '/assets/img/icons/logo.svg'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Activate event
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});