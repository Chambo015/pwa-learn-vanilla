const staticCacheName = "pwa-learn-static-v5";
const dynamicCacheName = "pwa-learn-dynamic-v5";



const assetUrls = [
  "index.html",
  "/js/app.js",
  "/css/main.css",
]

const htmlOfflineResponse = new Response(
    '<b>HTML</b> Контент недоступен в автономном режиме',
    {
      status: 200,
      headers: {
          'Content-type': 'text/html',
      },
    },
);

self.addEventListener("install", async (event) => {
  console.log("🚂 Service Worker installing.");

  const cache = await caches.open(staticCacheName);
  await cache.addAll(assetUrls);
})

self.addEventListener("activate", async (event) => {
  console.log("✅ Service Worker activating.");

  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.filter(name => name !== staticCacheName)
    .filter(name => name !== dynamicCacheName)
    .map(name => caches.delete(name))
  )

  console.log('@cacheNames', cacheNames);
});

self.addEventListener("fetch", (event) => {
  console.log("🛜 Fetch intercepted for: ", event.request.url);

  const { request } = event;

  const url = new URL(request.url);

  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(networkFirst(request));
  }
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  return cached ?? await fetch(request);
}

async function networkFirst(request) {
  const cache = await caches.open(dynamicCacheName);
  try {
    const response = await fetch(request);
    const responseClone = response.clone();
    await cache.put(request, responseClone);
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    return cached ?? htmlOfflineResponse
  }
};