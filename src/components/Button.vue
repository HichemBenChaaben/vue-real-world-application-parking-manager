<template>
  <button
    :disabled="props.busy"
    :class="[buttonClasses, { 'bg-blue-600': props.busy }]"
    class="capitalize inline-flex px-4 py-2 rounded-lg justify-center items-center focus:outline-none focus:ring-2 focus:ring-opacity-50"
  >
    <div v-if="props.busy" class="gap-2 flex-center">
      <Loading />
      <div>{{ props.busyText || 'loading...' }}</div>
    </div>
    <slot v-if="!props.busy"></slot>
  </button>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'
import Loading from './Loading.vue'

interface Props {
  busy?: boolean
  busyText?: string
  variant?: 'primary' | 'secondary' | 'info' | 'subtle' | 'outlined'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xlg'
}
const props = defineProps<Props>()

const buttonClasses = computed((): string => {
  let sizeClass = 'px-4 py-2'
  switch (props.size) {
    case 'xs':
      sizeClass = 'px-2 py-1 text-xs'
      break
    case 'sm':
      sizeClass = 'px-3 py-1.5 text-sm'
      break
    case 'md':
      sizeClass = 'px-4 py-2 text-base'
      break
    case 'lg':
      sizeClass = 'px-6 py-3 text-lg'
      break
    case 'xlg':
      sizeClass = 'px-8 py-4 text-xl'
      break
    default:
      break
  }

  switch (props.variant) {
    case 'secondary':
      return `bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500 ${sizeClass}`
    case 'info':
      return `bg-blue-300 text-white hover:bg-blue-400 focus:ring-blue-300 ${sizeClass}`
    case 'subtle':
      return `bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-200 ${sizeClass}`
    case 'outlined':
      return `bg-transparent text-blue-500 border border-blue-500 hover:bg-blue-50 focus:ring-blue-500 ${sizeClass}`
    case 'primary':
    default:
      return `bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500 ${sizeClass}`
  }
})
</script>

<style scoped>
.flex-center {
  @apply inline-flex justify-center items-center;
}
</style>
