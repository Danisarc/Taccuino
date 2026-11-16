// Taccuino di Rosa: funziona anche senza rete. Cambia VERSIONE a ogni aggiornamento dell'app.
// Vive in una cartella sua, con una memoria sua: tocca solo le copie che cominciano con PREFISSO.
const PREFISSO = "taccuino-rosa-";
const VERSIONE = PREFISSO + "v1";
const FILE = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "img/allenamento.jpg", "img/alimentazione.jpg"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSIONE).then((c) => c.addAll(FILE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((x) => x.startsWith(PREFISSO) && x !== VERSIONE).map((x) => caches.delete(x)))).then(() => self.clients.claim()));
});
// prima la rete (così gli aggiornamenti arrivano subito), se manca si usa la copia salvata
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== self.location.origin) return;   // le ricerche su Open Food Facts vanno dirette in rete
  e.respondWith(
    fetch(e.request).then((r) => {
      const copia = r.clone();
      caches.open(VERSIONE).then((c) => c.put(e.request, copia)).catch(() => {});
      return r;
    }).catch(() => caches.match(e.request, { cacheName: VERSIONE, ignoreSearch: true }).then((r) => r || caches.match("index.html", { cacheName: VERSIONE })))
  );
});
