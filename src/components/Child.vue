<template>
  <button
    type="button"
    class="gary"
    @click="useEmit('test-notification', 'test abcd child')"
  >
    call by child trigger useWebNotification bbb
  </button>
</template>
<script setup lang="ts">
import { useHandler } from "../utils/use-handler";
const { eventHandler, useEmit } = useHandler();

defineOptions({ name: 'Child' });

interface Emits {
  (e: 'emitHandler', method: string, data: any): void;
}
const emit = defineEmits<Emits>();
eventHandler.on("test-notification", (e: any) => {
  const [content] = e.detail;
  console.log(content);
  emit("emitHandler", "test-notification", content);
});

</script>