import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()], server: {
    proxy: {
      '/api': {
        target: 'https://upworkproject.b-cdn.net/',
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/api/, '')
      },
      '/bubble': {
        target: 'https://upworkproject.b-cdn.net/',
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/bubble/, '')
      }
    }
  },
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
