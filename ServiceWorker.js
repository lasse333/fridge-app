const version = 1

const staticCacheName = 'site-static-v' + version;
let db

const database = {
  init: function() {
    const DBOpenRequest = self.indexedDB.open("itemDB", 1);

    DBOpenRequest.onerror = (event) => {
        //console.error("DB error: ", event)
    }

        
    DBOpenRequest.onsuccess = (event) => {
        //console.log("DB success: ", event)
        db = DBOpenRequest.result
        //console.log(db)
        
    }

    DBOpenRequest.onupgradeneeded = (event) => {
        //console.log("Upgrading IDB from", event.oldVersion, "to", event.newVersion || db.version, event)

        db = DBOpenRequest.result
        //console.log(db)
        if (!db.objectStoreNames.contains("items")) db.createObjectStore("items", { keyPath: "uuid" })
    }
  },
  write: function(item) {
    let tx = db.transaction("items", "readwrite")
    
    tx.oncomplete = (event) => {
        //console.log(event)
    }

    tx.onerror = (error) => {
        //console.error(error)
    }

    let store = tx.objectStore("items")
    let request = store.add(item)
  },
  delete: function(uuid) {
    let tx = db.transaction("items", "readwrite")
    
    tx.oncomplete = (event) => {
        //console.log(event)
    }

    tx.onerror = (error) => {
        //console.error(error) 
    }

    let store = tx.objectStore("items")
    let request = store.delete(uuid)
  },
  update: function(item) {
    let tx = db.transaction("items", "readwrite")
    
    tx.oncomplete = (event) => {
        //console.log(event)
    }

    tx.onerror = (error) => {
        //console.error(error)
    }

    let store = tx.objectStore("items")
    let request = store.put(item)
  }
}

const assets = [
  "/index.html",
  "/manifest.json",
  "/favicon.ico",
  "/assets/css/style.css",
  "/assets/icons/Add.svg",
  "/assets/icons/Back.svg",
  "/assets/icons/Fridge.svg",
  "/assets/icons/Remove.svg",
  "/assets/icons/Settings.svg",
  "/assets/js/components/camera.js",
  "/assets/js/components/datetime.js",
  "/assets/js/components/localstorage.js",
  "/assets/js/components/navbar.js",
  "/assets/js/components/uuid.js",
  "/assets/js/components/language.js",
  "/assets/js/pages/AddItem.js",
  "/assets/js/pages/Fridge.js",
  "/assets/js/pages/Item.js",
  "/assets/js/pages/Settings.js",
  "/assets/js/App.js",
  "/assets/js/FastHTML.js",
  "/assets/js/index.js",
  "/assets/images/logo-large.png",
  "/assets/images/logo-small.png",
  "/assets/images/logo-solid-small.png",
  "/assets/images/logo-solid-large.png",
  "/assets/images/logo-vector.svg"
]

let langSetting = "en"

const langText = {
  "en": {
    "expiredItems": {
      "title": "Item(s) has expired",
      "body": " item(s) is expired in your fridge"
    },
    "emptyFridge": {
      "title": "Fridge is empty",
      "body": "Refill your fridge"
    },
    "checkFridge": {
      "title": "Check your fridge",
      "body": "A Friendly reminder to check your fridge :)"
    }
  },
  "da": {
    "expiredItems": {
      "title": "Ting er udløbet",
      "body": " ting i dit køleskab er udløbet"
    },
    "emptyFridge": {
      "title": "Dit køleskab er tomt",
      "body": "Genopfyld dit køleskab"
    },
    "checkFridge": {
      "title": "Kig i dit køleskab",
      "body": "En venlig påmindelse om at tage et kig i dit køleskab :)"
    }
  },
  "de": {
    "expiredItems": {
      "title": "Item(s) has expired",
      "body": " item(s) is expired in your fridge"
    },
    "emptyFridge": {
      "title": "Dein Kühlschrank ist leer",
      "body": "Fülle deinen Kühlschrank wieder auf"
    },
    "checkFridge": {
      "title": "Überprüfe deinen Kühlschrank",
      "body": "Eine kleine Erinnerung, dass der Kühlschrank überprüft werden soll :)"
    }
  }
}

self.addEventListener("install", evt => {
  ////console.log("Service Worker installed", evt)
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      //console.log('caching shell assets');
      cache.addAll(assets);
    })
  )
})

// activate event
self.addEventListener('activate', evt => {
  ////console.log('service worker activated');
  database.init()
  evt.waitUntil(
    () => {
      // service worker script

      caches.keys().then(keys => {
        ////console.log(keys);

        return Promise.all(keys
          .filter(key => key !== staticCacheName)
          .map(key => caches.delete(key))
        );
      })
    }
  );
});



self.addEventListener('fetch', evt => {
  ////console.log('fetch event', evt);
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request).then(fetchRes => {
        return fetchRes
      });
    }).catch(() => {
      if (evt.request.url.split(location.origin)[1].indexOf('.') == -1) {
        //console.log("loaded index.html")
        return caches.match('/index.html');
      }
    })
  );
});

self.addEventListener("message", (event) => {
  let data = JSON.parse(event.data)
  //console.log(data)
  switch (data.c) {

    case "LANG":
      langSetting = data.d
      break

    case "ADD":
      database.write(data.d)
      break

    case "UPDATE":
      database.update(data.d)
      break

    case "DELETE":
      database.delete(data.d.uuid)
      break

    default:
      break
  }
  //self.registration.showNotification("Test", {body: "Hello"})
})


self.addEventListener('periodicsync', (event) => {
  //console.log("hello", event)
  if (event.tag === 'check-expired' /*|| event.tag === "test-tag-from-devtools"*/) {
    event.waitUntil((() => {
      let tx = db.transaction("items", "readonly")
    
      tx.oncomplete = (event) => {
          //console.log(event)

          let data = request.result
          let expiredItems = []
          data.forEach(item => {
            if (item.ExperationDate != "") {
              if (Math.ceil((+item.ExperationDate-Date.now())/1000/60/60/24) < 1) {
                expiredItems.push(item)
              }
            }
          });

          //console.log(expiredItems)

          if (expiredItems.length > 0) {
            self.registration.showNotification(langText[langSetting]["expiredItems"]["title"], {body: expiredItems.length + langText[langSetting]["expiredItems"]["body"], icon: "/assets/images/logo-solid-small.png"})
          } else if (data.length == 0) {
            self.registration.showNotification(langText[langSetting]["emptyFridge"]["title"], {body: langText[langSetting]["emptyFridge"]["body"], icon: "/assets/images/logo-solid-small.png"})
          } else {
            self.registration.showNotification(langText[langSetting]["checkFridge"]["title"], {body: langText[langSetting]["checkFridge"]["body"], icon: "/assets/images/logo-solid-small.png"})
          }
      }

      tx.onerror = (error) => {
          //console.error(error)
      }

      let store = tx.objectStore("items")
      let request = store.getAll()

      

      //self.registration.showNotification("Test", {body: "Hello"/*, image: JSON.parse(self.localStorage["items"])[0].ImageData*/})
    })())
  } else if (event.tag === "test-tag-from-devtools") {
    console.log(langSetting)
  }

});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  clients.openWindow('/fridge');
},false)