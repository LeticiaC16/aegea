const CACHE_NAME = 'offline-cache-v1';
const urlsToCache = [
    '/', 
    '/index.html', 
    'https://uva-beryl.vercel.app/cartao_300.txt' // Adicione os links que você quer armazenar em cache
];

// Instalar o Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache); // Adiciona os arquivos ao cache
            })
    );
});

// Ativar o Service Worker
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName); // Apaga caches antigos
                    }
                })
            );
        })
    );
});

// Interceptar as requisições e retornar do cache se offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .catch(() => {
                return caches.match(event.request).then((response) => {
                    if (response) {
                        return response; // Retorna do cache se offline
                    }
                    // Se não encontrar no cache, retorna o fallback (index.html)
                    return caches.match('/index.html');
                });
            })
    );
});
