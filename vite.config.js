import { fileURLToPath, URL } from 'node:url'
import topLevelAwait from 'vite-plugin-top-level-await'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    topLevelAwait({
      // The export name of top-level await promise for each chunk module
      promiseExportName: '__tla',
      // The function to generate import names of top-level await promise in each chunk module
      promiseImportName: i => `__tla_${i}`
    })
  ],
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      // '/api': 'http://47.108.165.207:20088/ ',
      // "/alm_framework": {
      //   target: "http://47.108.165.207:20088/api",
      //   timeout: 20 * 60 * 1000,
      //   changeOrigin: true,
      // },
    },
  },
  base: '/music',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
