/// <reference lib="webworker" />
interface SWGlobalScope extends ServiceWorkerGlobalScope {
  on: (type: string, listener?: any) => void;
  off: (type: string, listener?: any) => void;
  emit: (method: string, data?: any) => void;
}

((sw: SWGlobalScope) => {
  const swEv = new Map();
  let isActive = false;
  sw.on = (method: string, listener?: any) => {
    if (!swEv.has(method)) {
      swEv.set(method, listener);
    }
    sw.addEventListener(method, listener);
  }
  sw.off = (method: string) => {
    const listener = swEv.get(method);
    swEv.delete(method);
    sw.removeEventListener(method, listener);
  }
  sw.emit = (method: string, data?: any) => {
    sw.dispatchEvent(new CustomEvent(method, { detail: data }));
  }
  console.log(' 1 Hello service worker init .');

  sw.on('install', (event: any) => {
    console.log(' 2 Hello service worker install.');
    event.waitUntil(
      sw.skipWaiting(),
    );
  })

  sw.on('activate', (event: any) => {
    console.log(' 3 Hello service worker activate.');
    isActive = true;

    event.waitUntil(
      sw.clients.claim(),
    );

    sw.emit('checkActivate');
  })

  // sw.on('activated', (_event: any) => {
  //   isActive = true;

  //   console.log('isActive', isActive)
  //   // 發送給 SW 是否啟動
  //   sw.emit('checkActivate');
  //   console.log(' 4 Hello service worker activated.');
  // })

  sw.on('push', (event: any) => {
    console.log(' 5 Hello service worker push.');
    let notifyTitle = 'Hello world!';
    const options = {
      body: 'Yay it works.',
    };
    try {
      const { title, ...pushOption } = event.data.json();
      notifyTitle = title;
      Object.assign(options, pushOption);
    } catch (e) {
      console.error(e);
    }
    event.waitUntil(sw.registration.showNotification(notifyTitle, options));
  })


  // custom event for notification
  sw.on("notification", (event: any) => {
    // 可以发个消息通知页面
    console.log("[Service Worker] Notification click Received.", event);
    const { title, _event } = event.detail;
    _event.waitUntil(
      sw.registration.showNotification(title, event.detail)
    );
  });


  // custom event for checkActivate
  sw.on("checkActivate", (event: any) => {
    console.log("[custom event] checkActivate", event);

    sw.clients.matchAll().then(function (clients) {
      clients.forEach(function (client) {
        console.log('isActive', isActive)
        client.postMessage({ method: "activateCallback", data: { isActive } });
      });
    });
  });

  sw.on("message", (event: any) => {
    console.log("[Service Worker] message", event);
    // 分析 event.data 抓呼叫對應的 Event
    const { data, method } = event.data;
    sw.emit(method, { ...data, _event: event });
  });

})(self as any)