/* Smart Shishu Shikkha - Service Worker
 * - Pre-caches the app shell resiliently (one missing file can no longer break everything).
 * - Navigation: network-first, falling back to the cached page, then /offline.html.
 * - Next.js static assets: cache-first (they are content-hashed and immutable).
 * - Other same-origin GET files (icons, images, fonts): stale-while-revalidate.
 * - /api/* is never cached.
 */
const CACHE_VERSION = "v2";
const CACHE_NAME = `smart-shishu-${CACHE_VERSION}`;
const OFFLINE_URL = "/offline.html";

const PRECACHE_ASSETS = [
  "/",
  OFFLINE_URL,
  "/manifest.webmanifest",
  "/icons/app-logo.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-maskable.png",
  "/images/hero-classroom.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // add() each file on its own: if one fails the others are still stored.
      await Promise.all(
        PRECACHE_ASSETS.map((url) =>
          cache.add(new Request(url, { cache: "reload" })).catch((err) => {
            console.warn("[SW] precache skipped:", url, err);
          })
        )
      );
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)));
      await self.clients.claim();
    })()
  );
});

function isCacheable(response) {
  return response && response.status === 200 && response.type === "basic";
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // never touch third-party requests
  if (url.pathname.startsWith("/api/")) return; // AI answers must always be live

  // 1) Page navigations
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        try {
          const fresh = await fetch(request);
          if (isCacheable(fresh)) {
            // The app is a single page: keep one copy under "/" (query strings like ?tab=math are ignored).
            cache.put("/", fresh.clone());
          }
          return fresh;
        } catch {
          return (
            (await cache.match(request, { ignoreSearch: true })) ||
            (await cache.match("/")) ||
            (await cache.match(OFFLINE_URL)) ||
            new Response("Offline", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } })
          );
        }
      })()
    );
    return;
  }

  // 2) Immutable, content-hashed Next.js files
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(request);
        if (cached) return cached;
        const fresh = await fetch(request);
        if (isCacheable(fresh)) cache.put(request, fresh.clone());
        return fresh;
      })()
    );
    return;
  }

  // 3) Everything else on our own origin: stale-while-revalidate
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request);
      const network = fetch(request)
        .then((fresh) => {
          if (isCacheable(fresh)) cache.put(request, fresh.clone());
          return fresh;
        })
        .catch(() => undefined);
      if (cached) {
        network.catch(() => undefined);
        return cached;
      }
      const fresh = await network;
      return fresh || new Response("", { status: 504 });
    })()
  );
});
