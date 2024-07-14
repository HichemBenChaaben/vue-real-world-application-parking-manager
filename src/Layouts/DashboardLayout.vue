<template>
  <div class="bg-gray-100 flex h-screen overflow-hidden">
    <aside
      class="min-w-[200px] absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-white duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 -translate-x-full border border-l-1"
    >
      <div class="nin-w-[400px] flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6">
        <strong class="text-xl text-blue-500">Parking app</strong>
      </div>
      <div class="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear px-6">
        <ul class="capitalize font-bold">
          <li class="border-b border-gray-100">
            <router-link
              :class="{
                'text-blue-500 font-bold': /^\/dashboard\/?$/.test($route.path),
                'flex w-full p-2 hover:text-blue-500': true
              }"
              to="/dashboard/"
            >
              overview
            </router-link>
          </li>
          <li class="border-b border-gray-100">
            <router-link
              active-class="text-blue-500 font-bold"
              class="p-2 flex w-full hover:text-blue-500"
              to="/dashboard/revenue"
            >
              revenue
            </router-link>
          </li>
        </ul>
      </div>
    </aside>
    <main class="h-full w-full min-h-dvh flex flex-col px-4 overflow-scroll">
      <div
        class="card bg-white p-4 shadow-sm border border-solid border-gray-300 sticky top-0 z-20"
      >
        <div class="flex justify-between">
          <h1 class="font-bold">Welcome {{ user }}</h1>

          <OfflineIndicator />

          <div>
            <button @click="handleLogout">logout</button>
          </div>
        </div>
      </div>
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import useAuthStore from '@/stores/authStore'
import OfflineIndicator from '@/components/OfflineIndicator/OfflineIndicator.vue'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const handleLogout = () => {
  authStore.logout()
}
</script>
