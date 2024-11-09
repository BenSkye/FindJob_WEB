import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({
    jsxRuntime: 'automatic'
  })],
  resolve: {
    alias: {
      'react': 'react',
      'react-dom': 'react-dom'
    }
  },
  optimizeDeps: {
    include: ['@ckeditor/ckeditor5-react', '@ckeditor/ckeditor5-build-classic']
  },
  build: {
    commonjsOptions: {
      include: [/@ckeditor\/.*/, /node_modules/]
    }
  },
  root: "./",
  publicDir: 'public',
  server: {
    port: 2709,
  },
})
