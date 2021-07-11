var CACHE_NAME = 'my-site-cache-v1';

var urlsToCache = [
  'index.html',
  'fallback.json',
  'jquery.js',
  'main.js',
  'main.css',
  'aktifitas.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('in install service worker..cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheNames){
            return cacheNames != CACHE_NAME
        }).map(function(cacheNames){
          return caches.delete(cacheNames)
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event){

  var request = event.request
  var url = new URL(request.url)

  // pisahkan request API dan internal

  if(url.origin === location.origin){
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );  
  }

  else{
    event.respondWith(
      caches.open('aktifitas-cache').then(function(cache){
          return fetch(request).then(function(liveResponse){
            cache.put(request,liveResponse.clone())
            return liveResponse
          })
      }).catch(function(){
        return caches.match(request).then(function(response){
          if(response) return response
          return caches.match('fallback.json')
        })
      })
    );
  }


})
