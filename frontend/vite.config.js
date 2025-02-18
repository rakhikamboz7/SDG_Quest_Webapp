import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['firebase/auth'] // Add this to externalize the firebase/auth module
    }
  },
  plugins: [react(), tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': '/src', // This tells Vite that @ maps to the src directory
      },
    },
  });

