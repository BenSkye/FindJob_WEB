import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: "./",
  publicDir: 'public',
  build: {
    chunkSizeWarningLimit: 1000, // Tăng giới hạn cảnh báo lên 1000 kB
    rollupOptions: {
      output: {
        manualChunks(id: any) {
          // Tách các thư viện lớn thành các chunk riêng
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    },
    outDir: 'dist',
  },
  server: {
    port: 2777,
  },
})
