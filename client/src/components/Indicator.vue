<template>
  <span :class="spanClasses">
    <span :class="dotClasses"></span>
    <slot></slot>
  </span>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

type Variant = 'primary' | 'secondary' | 'success'

interface Props {
  readonly variant?: Variant
  readonly active?: boolean
}

const props = defineProps<Props>()

const spanClasses = computed(() => {
  const baseClasses =
    'inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full capitalize'

  const variantClasses = {
    primary:
      'bg-blue-100 border border-solid border-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    secondary:
      'bg-gray-100 border border-solid border-gray-200 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    success:
      'bg-green-100 border border-solid border-green-200 text-green-800 dark:bg-green-900 dark:text-green-300'
  }

  return `${baseClasses} ${variantClasses[props.variant || 'success']}`
})

const dotClasses = computed(() => {
  const baseDotClasses = 'w-2 h-2 rounded-full me-1'

  const variantDotClasses = {
    primary: 'bg-blue-500',
    secondary: 'bg-gray-500',
    success: 'bg-green-500'
  }

  return `${baseDotClasses} ${variantDotClasses[props.variant || 'success']}`
})
</script>
