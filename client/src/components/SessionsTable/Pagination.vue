<template>
  <div class="flex justify-center items-center space-x-4">
    <button
      :disabled="currentPage === 1"
      @click="$emit('previousPage')"
      class="px-4 py-1 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
    >
      Previous
    </button>
    <span class="text-gray-500">{{ currentPage }}</span>
    <button
      :disabled="$props.isLastPage"
      @click="$emit('nextPage')"
      class="px-4 py-1 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
    >
      Next
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Maybe } from 'types'

interface Props {
  isLastPage: Maybe<boolean>
  currentPage: number
}

withDefaults(defineProps<Props>(), {
  currentPage: 1,
  isLastPage: false
})

defineEmits(['nextPage', 'previousPage', 'setPage'])
</script>

<style scoped></style>
