import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/predict': {
        target: 'http://127.0.0.1:5000', // 👈 your Flask backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
