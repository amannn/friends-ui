"use strict";function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}var precacheConfig=[["/friends-ui/index.html","dec5b624900dd26bb1fab4b75c14b339"],["/friends-ui/static/css/main.dc1dca15.css","b68e6e40ad27b0b0bf9efd0beed48a2d"],["/friends-ui/static/js/main.f00e7478.js","5d547cf3fde8ea66521ab9e1ce44d9f3"],["/friends-ui/static/media/image-1.ab1b22e1.png","ab1b22e16a21a690ae3cd1e489896b8d"],["/friends-ui/static/media/image-10.1e97e195.png","1e97e195e39be37e00a2bab192f7704d"],["/friends-ui/static/media/image-11.bd3bcc26.png","bd3bcc26316e278b4fbe04cfea30a429"],["/friends-ui/static/media/image-2.3d6d2c45.png","3d6d2c45305874c4498e9d86f812e392"],["/friends-ui/static/media/image-3.1a569b91.png","1a569b913607c156d90f11ec143c6e82"],["/friends-ui/static/media/image-4.2ab9702c.png","2ab9702cb7caec121a611f794fe90b70"],["/friends-ui/static/media/image-5.f795e502.png","f795e502755215b9fd71de0c1160893c"],["/friends-ui/static/media/image-6.9483b9d8.png","9483b9d876b8f89c3b2c1f62be671d67"],["/friends-ui/static/media/image-7.58d77a0a.png","58d77a0a4e3a8872ad94df5dc60c0062"],["/friends-ui/static/media/image-8.137e95a7.png","137e95a73811b94945f0402a3ab46506"],["/friends-ui/static/media/image-9.ab93e925.png","ab93e925c26f3b21541b01e63c24962b"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,t){var n=new URL(e);return"/"===n.pathname.slice(-1)&&(n.pathname+=t),n.toString()},cleanResponse=function(e){return e.redirected?("body"in e?Promise.resolve(e.body):e.blob()).then(function(t){return new Response(t,{headers:e.headers,status:e.status,statusText:e.statusText})}):Promise.resolve(e)},createCacheKey=function(e,t,n,a){var r=new URL(e);return a&&r.pathname.match(a)||(r.search+=(r.search?"&":"")+encodeURIComponent(t)+"="+encodeURIComponent(n)),r.toString()},isPathWhitelisted=function(e,t){if(0===e.length)return!0;var n=new URL(t).pathname;return e.some(function(e){return n.match(e)})},stripIgnoredUrlParameters=function(e,t){var n=new URL(e);return n.hash="",n.search=n.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(e){return t.every(function(t){return!t.test(e[0])})}).map(function(e){return e.join("=")}).join("&"),n.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var t=e[0],n=e[1],a=new URL(t,self.location),r=createCacheKey(a,hashParamName,n,/\.\w{8}\./);return[a.toString(),r]}));self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(e){return setOfCachedUrls(e).then(function(t){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(n){if(!t.has(n)){var a=new Request(n,{credentials:"same-origin"});return fetch(a).then(function(t){if(!t.ok)throw new Error("Request for "+n+" returned a response with status "+t.status);return cleanResponse(t).then(function(t){return e.put(n,t)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var t=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(e){return e.keys().then(function(n){return Promise.all(n.map(function(n){if(!t.has(n.url))return e.delete(n)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(e){if("GET"===e.request.method){var t,n=stripIgnoredUrlParameters(e.request.url,ignoreUrlParametersMatching);(t=urlsToCacheKeys.has(n))||(n=addDirectoryIndex(n,"index.html"),t=urlsToCacheKeys.has(n));!t&&"navigate"===e.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],e.request.url)&&(n=new URL("/friends-ui/index.html",self.location).toString(),t=urlsToCacheKeys.has(n)),t&&e.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(n)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(t){return console.warn('Couldn\'t serve response for "%s" from cache: %O',e.request.url,t),fetch(e.request)}))}});