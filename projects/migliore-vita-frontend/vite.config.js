import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
    proxy: {
      '/v1': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  plugins: [react(), tailwindcss()],
});
