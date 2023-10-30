import { ref } from "vue";
const hasServiceWorker = ref(false);
const worker = ref<ServiceWorkerContainer | null>(null);
const eventBus = new EventTarget();

// 接收 SW 啟動狀態
eventBus.addEventListener('activateCallback', (event: any) => {
  // console.log('eventBus activateCallback', event.detail)
  hasServiceWorker.value = event.detail.isActive;
});
if ('serviceWorker' in navigator) {
  (async (sw) => {
    worker.value = sw;
    sw.addEventListener("message", (event: any) => {
      // 處理 SW 發送過來的訊息，轉換成 Event
      // console.log("From [ServiceWorker] Received message", event.data);
      // console.log('in use worker ', event.data)
      eventBus.dispatchEvent(new CustomEvent(event.data.method, { detail: event.data.data }));
    });
    sw.addEventListener("controllerchange", () => {
      if (sw.controller) {
        worker.value = sw;
        sw.controller.postMessage({ method: 'checkActivate' })
      }
    });
    (await sw.ready).active?.postMessage({ method: 'checkActivate' })
    // init(navigator.serviceWorker);
  })(navigator.serviceWorker);
}

// 發送給 SW 是否啟動
export default function useWorker() {
  return {
    worker: worker.value,
    hasServiceWorker,
    workerEmit: (eventName: string, data?: any) => {
      if (!hasServiceWorker.value || !worker.value || !worker.value.controller) {
        return console.error('worker.controller is null')
      }
      const controller = worker.value.controller;
      // console.log('workerEmit controller', controller)
      if (controller) {
        controller.postMessage({ method: eventName, data })
      }
    }
  }
}

