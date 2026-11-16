// Taccuino palestra: funziona anche senza rete. Cambia VERSIONE a ogni aggiornamento dell'app.
// Cancella solo le proprie copie vecchie (taccuino-v…): le altre app della stessa origine, come rosa/, hanno le loro.
const VERSIONE = "taccuino-v13";
const FILE = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "img/allenamento.jpg", "img/alimentazione.jpg",
  "img/trazione-basso.png", "img/trazione-alto.png", "img/foto-alto.jpg", "img/foto-da-dietro.jpg"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSIONE).then((c) => c.addAll(FILE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((x) => /^taccuino-v\d/.test(x) && x !== VERSIONE).map((x) => caches.delete(x)))).then(() => self.clients.claim()));
});
// prima la rete (così gli aggiornamenti arrivano subito), se manca si usa la copia salvata
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== self.location.origin) return;   // le ricerche su Open Food Facts vanno dirette in rete
  if (new URL(e.request.url).pathname.includes("/rosa/")) return;   // la cartella di Rosa ha il suo service worker e la sua memoria
  e.respondWith(
    fetch(e.request).then((r) => {
      const copia = r.clone();
      caches.open(VERSIONE).then((c) => c.put(e.request, copia)).catch(() => {});
      return r;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then((r) => r || caches.match("index.html")))
  );
});
