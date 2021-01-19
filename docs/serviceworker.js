'use strict';

let cn = '1.24';
let cacheWhiteList = ['1.24'];
let assetsList = [
    '/index.html',
    '/share.html',
    '/index.js',
    '/share.js',
    '/LocationHelper.js',
    '/data.js',
    '/assets/fonts/iconfont/material-icons.css',
    '/assets/fonts/iconfont/MaterialIcons-Regular.eot',
    '/assets/fonts/iconfont/MaterialIcons-Regular.ijmap',
    '/assets/fonts/iconfont/MaterialIcons-Regular.svg',
    '/assets/fonts/iconfont/MaterialIcons-Regular.ttf',
    '/assets/fonts/iconfont/MaterialIcons-Regular.woff',
    '/assets/fonts/iconfont/MaterialIcons-Regular.woff2',
    '/assets/images/icon/128.png',
    '/assets/images/icon/144.png',
    '/assets/images/icon/152.png',
    '/assets/images/icon/192.png',
    '/assets/images/icon/384.png',
    '/assets/images/icon/512.png',
    '/assets/images/icon/72.png',
    '/assets/images/icon/96.png',
    '/assets/js/jquery.min.js',
    '/assets/materialize/css/materialize.min.css',
    '/assets/materialize/js/materialize.min.js'
];

// Install Event
self.addEventListener('install', event=>{
    // Open the cache
    event.waitUntil(caches.open(cn)
        .then(cache=>{
            // Fetch all the assets from the array
            return cache.addAll(assetsList);
        }).then(()=>{
            console.log("done caching");
        })
    );
});


self.addEventListener('fetch', event=>{
    event.respondWith(
        caches.match(event.request)
            .then(response=>{
                //Fallback to network
                return response || fetch(event.request);
            })
            .catch(r=>{
                let method = event.request.method;

                if(method !== 'POST'){
                    return caches.match('index.html');
                }

            })
    );
});

// Remove Old Caches
self.addEventListener('activate', (event)=>{
    event.waitUntil(
        caches.keys().then((keyList)=>{
            return Promise.all(keyList.map((key)=>{
                if(cacheWhiteList.indexOf(key) === -1){
                    return caches.delete(key);
                }
            }));
        })
    );
});
