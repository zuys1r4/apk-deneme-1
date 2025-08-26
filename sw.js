const CACHE = "barisha-tv-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./logo.png",
  "./manifest.webmanifest",
  "https://cdn.jsdelivr.net/npm/hls.js@latest"
];

// İlk kurulumda temel dosyaları önbelleğe al
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

// Eski cache'leri temizle
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
});

// Ağ isteği yakalama
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);

  // HLS canlı akışlarını cache'leme (m3u8/ts)
  if (url.pathname.endsWith(".m3u8") || url.pathname.endsWith(".ts")) return;

  e.respondWith(
    caches.match(e.request).then(res =>
      res || fetch(e.request).catch(() => caches.match("./"))
    )
  );
});
