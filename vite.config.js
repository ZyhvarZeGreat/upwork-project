import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()], server: {
    proxy: {
      '/api': {
        target: 'https://saei4yhgnxaxqtdhgyym3mzo3m0kdhaa.lambda-url.us-east-1.on.aws/',
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/api/, '')
      },
      '/bubble': {
        target: 'https://s5c3butdxpd62qaq7g35v26uk40gswlj.lambda-url.us-east-1.on.aws/',
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
