import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        list: resolve(__dirname, 'index.html'),
        detail: resolve(__dirname, 'todo.html')
      }
    }
  }
});
