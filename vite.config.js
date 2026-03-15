/* eslint-disable no-undef */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  // Alias @ -> src/
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // ✅ Tối ưu build cho production
  build: {
    // Tắt sourcemap trên production để giảm kích thước
    sourcemap: false,
    // Cảnh báo nếu chunk vượt quá 1MB
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        // ✅ Tách vendor libraries thành các chunk riêng (dạng function - tương thích rolldown-vite)
        // Giúp browser cache hiệu quả hơn vì lib ít thay đổi
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Charts (nặng nhất - tách riêng trước)
            if (id.includes('recharts') || id.includes('d3-')) {
              return 'vendor-charts';
            }
            // React core + router
            if (id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react';
            }
            // UI components
            if (id.includes('lucide-react') || id.includes('react-hot-toast') || id.includes('react-datepicker')) {
              return 'vendor-ui';
            }
            // HTTP & utils
            if (id.includes('axios') || id.includes('jwt-decode') || id.includes('date-fns')) {
              return 'vendor-utils';
            }
          }
        },
      },
    },
  },
})