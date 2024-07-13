<template>
  <RouterView />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import useLoginStore from '@/stores/authStore'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const route = useRouter()
const store = useLoginStore()
const { user } = storeToRefs(store)

onMounted(() => {
  if (!user) {
    route.push('/')
  }
})
</script>

<style scoped></style>
