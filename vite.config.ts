import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/pubkytecture/',
  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
    proxy: {
      '/api/httprelay': {
        target: 'https://demo.httprelay.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/httprelay/, ''),
      },
    },
  },
  optimizeDeps: {
    exclude: ['@synonymdev/pubky'],
  },
})
