<template>
  <button
    :disabled="busy"
    :class="{ 'bg-blue-600': props.busy }"
    class="capitalize inline-flex w-full px-4 py-2 mt-6 text-white bg-blue-500 rounded-lg justify-center items-center hover:light-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50-500 hover:bg-blue-600"
  >
    <div v-if="props.busy" class="gap-2 flex-center">
      <Loading />
      <div>{{ props.busyText || 'loading...' }}</div>
    </div>
    <slot v-if="!props.busy"></slot>
  </button>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import Loading from './Loading.vue'

interface Props {
  busy?: boolean
  busyText?: string
}
const props = defineProps<Props>()
</script>
<style scoped>
.flex-center {
  @apply inline-flex justify-center items-center;
}
</style>
