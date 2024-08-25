import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': ['http://localhost:5000/', 'https://7335-2400-adc5-16a-a200-1060-7de4-8e99-9cf.ngrok-free.app/'],
    },
  },
  plugins: [react()],
})
