console.log('Hello register service worker.')
const urlBase64ToUint8Array = (base64String: string) => {
  var padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  var base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const checkPermission = () => {
  if (!('serviceWorker' in navigator)) {
    throw new Error("No support for service worker!")
  }

  if (!('Notification' in window)) {
    throw new Error("No support for notification API");
  }

  if (!('PushManager' in window)) {
    throw new Error("No support for Push API")
  }
}

const initRegisterSW = async (publishKey: string) => {
  // await navigator.serviceWorker.register('service-worker.js')
  await navigator.serviceWorker.register('/sw.js')
  return navigator.serviceWorker.ready.then(async (registration) => {
    const subscribeOptions = {
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publishKey),
    };
    const pushSubscription = await registration.pushManager.subscribe(subscribeOptions);
    console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
    return registration
  })
}

const requestNotificationPermission = async () => {
  const permission = await Notification.requestPermission();

  if (permission !== 'granted') {
    throw new Error("Notification permission not granted")
  }

}
export default async (publishKey: string) => {
  console.log('publishKey', publishKey)
  checkPermission();
  await requestNotificationPermission();
  return await initRegisterSW(publishKey);
}