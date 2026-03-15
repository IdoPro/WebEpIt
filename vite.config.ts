import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 5173,
        host: '0.0.0.0',
        headers: {
          'Cache-Control': 'no-store',
        },
        proxy: {
          '/api': {
            target: env.VITE_SERVER_URL || 'http://localhost:5000',
            changeOrigin: true,
            rewrite: (path) => path,
          }
        }
      },
      optimizeDeps: {
        force: true,
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
        'process.env.SERVER_URL': JSON.stringify(env.VITE_SERVER_URL || 'http://localhost:5000')
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
