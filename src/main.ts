import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import useLoginStore from '@/stores/authStore'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)

async function initialize() {
  const store = useLoginStore()
  await store.getMe()

  // Redirect based on authentication status before mounting the app
  if (store.isAuthenticated) {
    router.push('/dashboard')
  } else {
    router.push('/')
  }
}

initialize()

app.mount('#app')
