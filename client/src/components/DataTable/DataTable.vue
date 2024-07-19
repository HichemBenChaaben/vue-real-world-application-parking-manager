<template>
  <table class="table">
    <Header :headers="props.data.header"></Header>
    <tbody>
      <slot></slot>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import Header from './Header.vue'
import Row from './Row.vue'
import { defineProps, withDefaults } from 'vue'

interface Props {
  data: {
    header: string[]
    rows: any[]
  }
}

const props = withDefaults(defineProps<Props>(), {
  data: {
    header: ['header1', 'header2', 'header3'].map((h) => ({ text: h, align: 'left' })),
    rows: []
  }
})
</script>

<style scoped>
.table {
  @apply bg-white border border-gray-300 text-sm w-full;
}
</style>
