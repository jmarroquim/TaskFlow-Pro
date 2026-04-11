self.addEventListener('install', function (e) {
    console.log('Service Worker instalado');
});

self.addEventListener('fetch', function (e) {
    // apenas necessário para ativar PWA
});

//“esta app pode funcionar offline”