<template>
  <h1 class="title">
    <slot name="title"></slot>
  </h1>
  <p class="line">
    <slot name="line"></slot>
  </p>
</template>
<script setup lang="ts"></script>
<style scoped>
.title {
  @apply text-4xl font-semibold capitalize mb-0;
}
.line {
  @apply text-base text-gray-700 m-0 mb-4;
}
</style>
