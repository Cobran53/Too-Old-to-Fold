/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import yaml from '@rollup/plugin-yaml'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy(),
    yaml()
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
  // Removed optimizeDeps.exclude for 'swipe-back' because excluding Ionic
  // internal deps can force dynamic imports that sometimes fail in dev
  // (NS_ERROR_CORRUPTED_CONTENT / MIME type issues). Let Vite optimize
  // these deps normally.
})
