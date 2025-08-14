import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.simple.ts'],
  },
  resolve: {
    alias: {
      // Alias simplifié pour les tests
      '@': resolve(__dirname, './src'),
    },
  },
});
