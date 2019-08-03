'use strict';

let cn = '1.11';
let cacheWhiteList = ['1.11'];
let assetsList = [
    '/project-tren/index.html',
    '/project-tren/index.js',
    '/project-tren/LocationHelper.js',
    '/project-tren/data.js',
    '/project-tren/assets/fonts/iconfont/material-icons.css',
    '/project-tren/assets/fonts/iconfont/MaterialIcons-Regular.eot',
    '/project-tren/assets/fonts/iconfont/MaterialIcons-Regular.ijmap',
    '/project-tren/assets/fonts/iconfont/MaterialIcons-Regular.svg',
    '/project-tren/assets/fonts/iconfont/MaterialIcons-Regular.ttf',
    '/project-tren/assets/fonts/iconfont/MaterialIcons-Regular.woff',
    '/project-tren/assets/fonts/iconfont/MaterialIcons-Regular.woff2',
    '/project-tren/assets/images/icon/128.png',
    '/project-tren/assets/images/icon/144.png',
    '/project-tren/assets/images/icon/152.png',
    '/project-tren/assets/images/icon/192.png',
    '/project-tren/assets/images/icon/384.png',
    '/project-tren/assets/images/icon/512.png',
    '/project-tren/assets/images/icon/72.png',
    '/project-tren/assets/images/icon/96.png',
    '/project-tren/assets/js/jquery.min.js',
    '/project-tren/assets/materialize/css/materialize.min.css',
    '/project-tren/assets/materialize/js/materialize.min.js'
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
