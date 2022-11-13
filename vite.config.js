import { defineConfig } from 'vite'
import ElementPlus from 'unplugin-element-plus/vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  // ...
  plugins: [vue(), ElementPlus()],
})
