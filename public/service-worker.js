self.addEventListener("install", function(event) {
  console.log("[PWA Builder] Install Event processing");
  console.log("[PWA Builder] Skip waiting on install");

  self.skipWaiting();
});

// Allow service-worker to control the current page.
self.addEventListener("activate", function(event) {
  console.log("[PWA Builder] Claiming clients for current page");
  // event.waitUntil(self.clients.claim());
});
