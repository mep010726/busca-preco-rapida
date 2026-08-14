const CACHE_NAME = "busca-preco-shell-v3";
const SHELL_FILES = ["/", "/index.html", "/styles.css", "/calc.js", "/app.js", "/manifest.json", "/icon-192.png", "/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // So cuida do "shell" do proprio app (mesmo dominio). Chamadas de API
  // (preco/estoque na Mersan, Supabase, CDNs de bibliotecas) sempre vao
  // direto pra rede, pra nunca mostrar preco/estoque desatualizado.
  if (url.origin !== self.location.origin) return;

  // Network-first: sempre tenta buscar a versao mais nova primeiro, e so usa
  // o cache se estiver offline. Isso garante que, ao reabrir o app, ele
  // carrega a atualizacao mais recente em vez de uma copia antiga guardada.
  event.respondWith(
    fetch(event.request)
      .then((resp) => {
        if (resp.ok) {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return resp;
      })
      .catch(() => caches.match(event.request))
  );
});
