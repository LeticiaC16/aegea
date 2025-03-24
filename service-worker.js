const CACHE_NAME = "offline-cache-v6";
const urlsToCache = [
    "/",
    "index.html",
    "https://uva-beryl.vercel.app/cartao_310.txt", // Arquivo .txt
    "https://uva-beryl.vercel.app/cartao_310.png", // Arquivo .png
];

// Quando o Service Worker é instalado
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache).then(() => {
                console.log("Arquivos armazenados no cache com sucesso!");
            }).catch((error) => {
                console.error("Erro ao armazenar os arquivos no cache:", error);
            });
        })
    );
    self.skipWaiting();
});

// Quando o Service Worker é ativado
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache); // Deleta caches antigos
                    }
                })
            );
        })
    );
});

// Quando o Service Worker intercepta uma requisição
self.addEventListener("fetch", (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request).then((response) => {
                if (response) {
                    console.log(`Retornando arquivo do cache: ${event.request.url}`);
                    return response; // Retorna o arquivo do cache
                }

                // Caso o arquivo não seja encontrado no cache, retorna index.html como fallback
                console.log("Arquivo não encontrado no cache. Retornando index.html");
                return caches.match("index.html");
            }).catch((error) => {
                console.error("Erro ao acessar o cache:", error);
            });
        })
    );
});
