import { defineConfig } from 'vite'
import { nekotonWasmVite } from 'nekoton-wasm-vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), nekotonWasmVite()],
})
