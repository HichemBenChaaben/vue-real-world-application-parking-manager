<template>
  <div class="flex justify-center items-center h-screen">
    <div class="w-96 p-6 bg-white rounded-lg shadow-xl">
      <h1 class="text-3xl font-bold text-center">Login</h1>

      <form @submit.prevent="handleSubmit" novalidate>
        <div class="mt-6">
          <label for="email" class="block text-gray-600">Email:</label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            class="w-full px-4 py-2 mt-2 border rounded-lg"
          />
        </div>
        <div class="mt-4">
          <label for="password" class="block text-gray-600">Password:</label>
          <input
            type="password"
            id="password"
            v-model="password"
            autocomplete="current-password"
            required
            class="w-full px-4 py-2 mt-2 border rounded-lg"
          />
        </div>
        <p v-if="error" class="text-red-400 pt-4">incorrect username or password</p>
        <div class="py-6 w-full">
          <Button
            type="submit"
            class="w-full"
            :busy="loading"
            :disabled="loading"
            busyText="Logging..."
          >
            Login
          </Button>
        </div>
        <div v-if="expiredParam" class="text-red-400 text-md">session expired</div>
      </form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import useLoginStore from '@/stores/authStore'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import Button from '@/components/Button.vue'

const email = ref<string>()
const password = ref<string>()
const hasErrors = ref(false)
const store = useLoginStore()
const loading = ref(false)

const router = useRouter()
const route = useRoute()

const expiredParam = ref(route.query.expired)

watchEffect(() => {
  expiredParam.value = route.query.expired
})

const { error, isAuthenticated } = storeToRefs(store)

const handleSubmit = async () => {
  try {
    loading.value = true
    hasErrors.value = false
    await store.login({
      email: email.value,
      password: password.value
    })
  } catch (error) {
    hasErrors.value = true
  } finally {
    loading.value = false
    if (isAuthenticated.value) {
      router.push('/dashboard')
    }
  }
}
</script>

<style scoped></style>
