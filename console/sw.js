/* Service worker : rend la console installable et utilisable hors ligne.
   Les fichiers de données sont toujours cherchés sur le réseau en premier,
   pour que la console affiche la dernière collecte sans rechargement forcé. */
const CACHE = "console-plein-ecran-v2";
const COQUILLE = ["./index.html", "./console.css", "./console.js", "./icone.svg", "./manifest.webmanifest"];
const DONNEES = /(veille|attente|illustrations|data)\.js$|\.json$/;

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(COQUILLE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(cles =>
    Promise.all(cles.filter(c => c !== CACHE).map(c => caches.delete(c)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;

  if (DONNEES.test(url.pathname)) {
    e.respondWith(fetch(e.request).then(r => {
      const copie = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copie));
      return r;
    }).catch(() => caches.match(e.request)));
    return;
  }

  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
