<template>
  <thead class="thead">
    <tr>
      <th
        v-for="(header, index) in headers"
        :key="header.text"
        :class="{
          'align-left': header.align === 'left',
          'align-right': header.align === 'right',
          'align-center': header.align === 'center'
        }"
      >
        {{ header.text }}
      </th>
    </tr>
  </thead>
</template>

<script setup lang="ts">
interface Headers {
  align: 'left' | 'right' | 'center'
  text: string
}
interface Props {
  headers: Headers[]
}
const props = defineProps<Props>()
</script>

<style scoped>
.align-left {
  @apply text-left;
}
.align-right {
  @apply text-right;
}
.align-center {
  @apply text-center;
}
.thead th {
  @apply py-4 px-2 border-solid border-b-2 border-gray-200;
}
</style>
