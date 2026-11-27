// Taccuino di Rosa: funziona anche senza rete. Cambia VERSIONE a ogni aggiornamento dell'app.
// Vive in una cartella sua, con una memoria sua: tocca solo le copie che cominciano con PREFISSO.
const PREFISSO = "taccuino-rosa-";
const VERSIONE = PREFISSO + "v35";
const FILE = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "img/allenamento.jpg", "img/alimentazione.jpg", "font/archivo.woff2", "img/pasti/col.jpg", "img/pasti/spu.jpg", "img/pasti/pra.jpg", "img/pasti/mer.jpg", "img/pasti/cen.jpg", "img/pasti/prep.jpg", "img/rep/bevande.jpg", "img/rep/carne.jpg", "img/rep/dolci.jpg", "img/rep/frutta.jpg", "img/rep/frutta_secca.jpg", "img/rep/latticini.jpg", "img/rep/legumi.jpg", "img/rep/mio.jpg", "img/rep/olio.jpg", "img/rep/pane.jpg", "img/rep/pasta.jpg", "img/rep/patate.jpg", "img/rep/pesce.jpg", "img/rep/polveri.jpg", "img/rep/resto.jpg", "img/rep/salumi.jpg", "img/rep/uova.jpg", "img/rep/verdura.jpg"]
  // foto degli esercizi (img/es): servono anche senza rete, in palestra
  .concat("abductor-1 abductor-2 bulgaro-1 bulgaro-2 chest-press-1 chest-press-2 dead-bug-1 dead-bug-2 face-pull-1 face-pull-2 goblet-1 goblet-2 hip-thrust-1 hip-thrust-2 lat-1 lat-2 laterali-man-1 laterali-man-2 leg-curl-1 leg-curl-2 leg-press-1 leg-press-2 lento-man-1 lento-man-2 pallof-1 pallof-2 ponte-fem-1 ponte-fem-2 posteriori-seduta-1 posteriori-seduta-2 pulley-1 pulley-2 rematore-man-1 rematore-man-2 rumeno-man-1 rumeno-man-2".split(" ").map((x) => "img/es/" + x + ".jpg"));

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
