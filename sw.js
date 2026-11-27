// Taccuino palestra: funziona anche senza rete. Cambia VERSIONE a ogni aggiornamento dell'app.
// Cancella solo le proprie copie vecchie (taccuino-v…): le altre app della stessa origine, come rosa/, hanno le loro.
const VERSIONE = "taccuino-v52";
const FILE = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "img/allenamento.jpg", "img/alimentazione.jpg", "font/archivo.woff2", "img/pasti/col.jpg", "img/pasti/spu.jpg", "img/pasti/pra.jpg", "img/pasti/mer.jpg", "img/pasti/cen.jpg", "img/pasti/prep.jpg", "img/rep/bevande.jpg", "img/rep/carne.jpg", "img/rep/dolci.jpg", "img/rep/frutta.jpg", "img/rep/frutta_secca.jpg", "img/rep/latticini.jpg", "img/rep/legumi.jpg", "img/rep/mio.jpg", "img/rep/olio.jpg", "img/rep/pane.jpg", "img/rep/pasta.jpg", "img/rep/patate.jpg", "img/rep/pesce.jpg", "img/rep/polveri.jpg", "img/rep/resto.jpg", "img/rep/salumi.jpg", "img/rep/uova.jpg", "img/rep/verdura.jpg",
  "img/trazione-basso.png", "img/trazione-alto.png", "img/foto-alto.jpg", "img/foto-da-dietro.jpg"]
  // foto degli esercizi (img/es): servono anche senza rete, in palestra
  .concat("affondi-1 affondi-2 appesa-1 bulgaro-1 bulgaro-2 calf-libero-1 calf-libero-2 calf-man-1 calf-man-2 corsa-1 corsa-2 crunch-cavo-1 crunch-cavo-2 crunch-inverso-1 crunch-inverso-2 crunch-peso-1 crunch-peso-2 curl-inclinata-1 curl-inclinata-2 estensioni-man-1 estensioni-man-2 gambe-sbarra-1 gambe-sbarra-2 hack-1 hack-2 lat-1 lat-2 laterali-cavo-1 laterali-cavo-2 laterali-panca-1 laterali-panca-2 laterali-piedi-1 laterali-piedi-2 leg-curl-1 leg-curl-2 leg-ext-1 leg-ext-2 martello-1 martello-2 negative-1 negative-2 panca-incl-bil-1 panca-incl-bil-2 panca-incl-man-1 panca-incl-man-2 panca-piana-man-1 panca-piana-man-2 plank-lato-1 plank-lato-2 posteriori-panca-1 posteriori-panca-2 rematore-bil-1 rematore-bil-2 rematore-man-1 rematore-man-2 rollout-1 rollout-2 rumeno-1g-1 rumeno-1g-2 rumeno-bil-1 rumeno-bil-2 scapolari-1 scapolari-2 tricipiti-cavo-1 tricipiti-cavo-2".split(" ").map((x) => "img/es/" + x + ".jpg"));

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSIONE).then((c) => c.addAll(FILE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((x) => /^taccuino-v\d/.test(x) && x !== VERSIONE).map((x) => caches.delete(x)))).then(() => self.clients.claim()));
});
// prima la rete (così gli aggiornamenti arrivano subito), se manca si usa la copia salvata
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== self.location.origin) return;   // le ricerche su Open Food Facts vanno dirette in rete
  if (/\/(rosa|umberto)\//.test(new URL(e.request.url).pathname)) return;   // le cartelle degli altri atleti hanno il loro service worker e la loro memoria
  e.respondWith(
    fetch(e.request).then((r) => {
      const copia = r.clone();
      caches.open(VERSIONE).then((c) => c.put(e.request, copia)).catch(() => {});
      return r;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then((r) => r || caches.match("index.html")))
  );
});
