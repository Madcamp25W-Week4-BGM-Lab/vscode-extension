import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // <--- THIS IS REQUIRED FOR VS CODE
  build: {
    outDir: 'build',
    rollupOptions: {
      output: {
        // Force consistent filenames so you don't have to keep updating Habits.ts
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    }
  }
})
