import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import useLoginStore from '@/stores/authStore'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)

app.component('VueDatePicker', VueDatePicker)

async function initialize() {
  const store = useLoginStore()
  await store.getMe()
  if (store.isAuthenticated) {
    router.push('/dashboard')
  } else {
    router.push('/')
  }
}

initialize()

app.mount('#app')
