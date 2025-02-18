import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      external: ['firebase/auth'], // Externalize the firebase/auth module if necessary
    },
  },
  resolve: {
    alias: {
      '@': '/src', // This tells Vite that @ maps to the src directory
    },
  },
});
