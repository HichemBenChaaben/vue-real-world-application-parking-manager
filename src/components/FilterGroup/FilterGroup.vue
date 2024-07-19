<template>
  <div>
    <button
      v-for="filter in props.activeFilters"
      :key="filter"
      class="text-sm bg-blue-100 rounded-md px-2 py-1 inline-flex justify-center align-center mx-2 capitalize font-semibold group"
      @click.prevent="emits('onResetFilter', filter)"
    >
      <span>{{ filter }}</span>
      <span
        class="ml-4 cursor-pointer group-hover:bg-white group-hover:text-gray-600 inline-flex w-[20px] h-[20px] justify-center align-center text-center font-bold text-[8px] mx-1 bg-gray-600 rounded-full text-white"
      >
        X
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  activeFilters: string[]
}
const emits = defineEmits(['onResetFilter'])
const props = defineProps<Readonly<Props>>()
</script>
