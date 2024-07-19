<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center h-screen">
      <div class="fixed inset-0 bg-gray-800 bg-opacity-50" @click="closeModal"></div>
      <div class="bg-white rounded-lg shadow-lg p-6 z-10" v-bind="$attrs">
        <slot></slot>
        <button @click="closeModal" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded w-full">
          <slot name="close"></slot>
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(props.modelValue)

const closeModal = () => {
  emit('update:modelValue', false)
}

watch(
  () => props.modelValue,
  (newVal) => {
    isOpen.value = newVal
  }
)
</script>
