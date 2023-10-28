/// <reference lib="webworker" />
interface SWGlobalScope extends ServiceWorkerGlobalScope {
  on: (type: string, listener?: any) => void;
  off: (type: string, listener?: any) => void;
}

((sw: SWGlobalScope) => {
  sw.on = (type: string, listener?: any) => sw.addEventListener(type, listener);
  sw.off = (type: string, listener?: any) => sw.removeEventListener(type, listener);
  console.log(' 1 Hello service worker init .');

  sw.on('install', (event: any) => {
    console.log(' 2 Hello service worker install.');
    event.waitUntil(
      sw.skipWaiting(),
    );
  })

  sw.on('activate', (event: any) {
    console.log(' 3 Hello service worker activate.');
    event.waitUntil(
      sw.clients.claim(),
    );
  })

  sw.on('activated', (_event: any) => {
    console.log(' 4 Hello service worker activated.');
  })

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

})(self as any)