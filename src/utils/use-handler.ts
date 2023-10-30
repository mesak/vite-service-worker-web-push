export default function useHandler() {
  const eventBus = new EventTarget();
  const eventMap = new Map();
  return {
    useEmit: function (method: string, ...args: any[]) {
      eventBus.dispatchEvent(new CustomEvent(method, { detail: args }));
    },
    eventHandler: {
      on: (method: string, callback: EventListenerOrEventListenerObject) => {
        if (!eventMap.has(method)) {
          eventMap.set(method, callback);
        }
        return eventBus.addEventListener(method, callback)
      },
      once (method: string, callback: EventListenerOrEventListenerObject) {
        if (!eventMap.has(method)) {
          eventMap.set(method, callback);
        }
        return eventBus.addEventListener(method, callback, { once: true })
      },
      off: (method: string) => {
        if (eventMap.has(method)) {
          const callback = eventMap.get(method);
          eventMap.delete(method);
          eventBus.removeEventListener(method, callback)
        }
      }
    },
  };
}
