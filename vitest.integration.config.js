import { defineConfig } from 'vitest/config'
export default defineConfig({
  define: { 'import.meta.env.VITE_FIREBASE_PROJECT_ID': JSON.stringify('demo-fit5032-test'), 'import.meta.env.VITE_USE_FIREBASE_EMULATORS': JSON.stringify('true') },
  test: { environment: 'node', include: ['tests/*.integration.test.js'], testTimeout: 15000, hookTimeout: 30000, fileParallelism: false },
})
