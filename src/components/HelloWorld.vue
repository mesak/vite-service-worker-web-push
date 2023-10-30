<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Install
    <a href="https://github.com/vuejs/language-tools" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>

  <div class="card">
    <button type="button" class="waring" @click="useEmit('off-send')">
      off send
    </button>
    <button type="button" class="success" @click="useEmit('send')">
      trigger send
    </button>
    <button type="button" class="success" @click="useEmit('send', 2)">
      trigger send 2
    </button>
    <button type="button" class="success" @click="useEmit('send-once')">
      send once
    </button>
  </div>
  <div class="card">
    <button type="button" class="info" @click="useEmit('test-notification')">
      trigger useWebNotification
    </button>
    <button
      type="button"
      class="info"
      @click="useEmit('test-notification', 'test bbb')"
    >
      trigger useWebNotification bbb
    </button>
  </div>
  <Child @emitHandler="useEmit" />
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useWebNotification } from "@vueuse/core";
import { useHandler, useWorker } from "../utils";
const { eventHandler, useEmit } = useHandler();

import Child from "./Child.vue";
defineProps<{ msg: string }>();

const { hasServiceWorker, workerEmit } = useWorker();
const count = ref(0);

eventHandler.on("off-send", () => {
  eventHandler.off("send");
});

eventHandler.on("send", (e: any) => {
  console.log(e);

  console.log("detail", e.detail);
  console.log("send");
  console.log("hasServiceWorker.value", hasServiceWorker.value);

  if (hasServiceWorker.value) {
    workerEmit("notification", {
      title: "test1",
      body: "test2",
    });
  }
});

eventHandler.once("send-once", () => {
  console.log("send once");
  alert("send");
});

eventHandler.on("test-notification", (e: any) => {
  console.log(e);
  const [content] = e.detail;
  const title = content ?? "Hello, world from VueUse!";
  const { isSupported, show } = useWebNotification({
    title,
    dir: "auto",
    lang: "en",
    renotify: true,
    tag: "test",
  });
  if (isSupported.value) {
    show();
  }
});
</script>
<style scoped>
.read-the-docs {
  color: #888;
}
</style>
