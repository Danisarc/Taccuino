// Taccuino (cartella umberto): funziona anche senza rete. Cambia VERSIONE a ogni aggiornamento dell'app.
// Vive in una cartella sua, con una memoria sua: tocca solo le copie che cominciano con PREFISSO.
const PREFISSO = "taccuino-umberto-";
const VERSIONE = PREFISSO + "v4";
const FILE = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "img/allenamento.jpg", "img/alimentazione.jpg", "font/archivo.woff2", "img/pasti/col.jpg", "img/pasti/spu.jpg", "img/pasti/pra.jpg", "img/pasti/mer.jpg", "img/pasti/cen.jpg", "img/pasti/prep.jpg",
  "img/trazione-basso.png", "img/trazione-alto.png", "img/foto-alto.jpg", "img/foto-da-dietro.jpg"]
  // foto degli esercizi (img/es): servono anche senza rete, in palestra
  .concat("affondi-1 affondi-2 calf-man-1 calf-man-2 crunch-cavo-1 crunch-cavo-2 crunch-inverso-1 crunch-inverso-2 plank-lato-1 plank-lato-2 rollout-1 rollout-2 curl-cavo-1 curl-cavo-2 curl-inclinata-1 curl-inclinata-2 estensioni-man-1 estensioni-man-2 gambe-sbarra-1 gambe-sbarra-2 goblet-1 goblet-2 lat-1 lat-2 laterali-cavo-1 laterali-cavo-2 laterali-panca-1 laterali-panca-2 laterali-piedi-1 laterali-piedi-2 leg-ext-1 leg-ext-2 martello-1 martello-2 negative-1 negative-2 panca-incl-man-1 panca-incl-man-2 panca-piana-man-1 panca-piana-man-2 pectoral-1 pectoral-2 posteriori-panca-1 posteriori-panca-2 rematore-bil-1 rematore-bil-2 rematore-man-1 rematore-man-2 rumeno-1g-1 rumeno-1g-2 rumeno-bil-1 rumeno-bil-2 spinte-cavo-1 spinte-cavo-2 squat-bil-1 squat-bil-2 trazioni-1 trazioni-2".split(" ").map((x) => "img/es/" + x + ".jpg"));

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
