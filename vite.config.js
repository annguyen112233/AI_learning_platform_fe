import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path' // <--- Bắt buộc phải có dòng này

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // Thêm đoạn này để dùng alias @
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})