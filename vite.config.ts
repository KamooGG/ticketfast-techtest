import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Esto se inyecta al inicio de TODOS los <style lang="scss">
        // Usa @use (Sass moderno). El archivo se llama _variables.scss
        additionalData: `@use "@/styles/variables" as *; @use "@/styles/globals" as *;`
      }
    }
  }
})
