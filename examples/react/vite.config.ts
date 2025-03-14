import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nekotonWasmVite } from 'nekoton-wasm-vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), nekotonWasmVite()],
})
