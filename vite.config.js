import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/helsinki-cycling-weather/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  rollupOptions: {
    input: {
      main: resolve(__dirname, 'index.html'),
      nested: resolve(__dirname, 'dist/index.html'),
    },
  },
})
