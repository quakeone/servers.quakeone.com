import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8081
  },
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: { 
    preprocessorOptions: {
      scss: { 
        additionalData: `@import "@/scss/_variables.scss"; `
      }
    }
  }
})