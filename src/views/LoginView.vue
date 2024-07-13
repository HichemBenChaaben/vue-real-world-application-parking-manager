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
            required
            class="w-full px-4 py-2 mt-2 border rounded-lg"
          />
        </div>
        <p v-if="error" class="text-red-400 pt-4">incorrect username or password</p>
        <Button type="submit" :busy="loading" busyText="Login...">submit</Button>
      </form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import useLoginStore from '@/stores/authStore'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import Button from '@/components/Button.vue'

const router = useRouter()
const email = ref<string>()
const password = ref<string>()

const store = useLoginStore()
const { loading, user, error } = storeToRefs(store)

const handleSubmit = async () => {
  store.login({ email: email.value, password: password.value })
}

// if (user) {
//   router.push('/dashboard')
// }
</script>

<style scoped></style>
