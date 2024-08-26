import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': [' https://a8b3-2400-adc5-16a-a200-fdc3-22cf-e142-b6e5.ngrok-free.app/',],
    },
  },
  plugins: [react()],
})
