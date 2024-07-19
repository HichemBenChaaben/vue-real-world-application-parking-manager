import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import Components from 'unplugin-vue-components/vite'

// https://vitejs.dev/config/
export default defineConfig({
  root: 'client',
  server: {
    port: 3001, // run the frontend of different port on dev
    proxy: {
      '/v1': {
        target: 'http://localhost:3000', // Proxy requests to our express server
        changeOrigin: true
      },
      '/auth': {
        target: 'http://localhost:3000', // Proxy requests to our express server
        changeOrigin: true
      }
    }
  },
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    Components({
      dirs: ['src/components'],
      extensions: ['vue'],
      dts: true,
      types: [
        {
          from: 'vue-router',
          names: ['RouterLink', 'RouterView']
        }
      ]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./client/src', import.meta.url))
    }
  }
})
