/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Served from GitHub Pages under /cncf-wrapped/
  base: '/cncf-wrapped/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
  },
})
