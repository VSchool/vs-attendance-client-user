import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: "./__test__/setup.ts",
    watch: false,
    clearMocks: true,
    name: 'VS Attendance User'
  }
})
