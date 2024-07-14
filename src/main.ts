import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import useLoginStore from '@/stores/authStore'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

const store = useLoginStore()
await store.getMe()

// Redirect based on authentication status before mounting the app
if (store.isAuthenticated) {
  router.push('/dashboard')
} else {
  router.push('/')
}

app.mount('#app')
