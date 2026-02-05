import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Keeping your existing plugins
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    // 1. Output directly to the extension's media folder
    // 'subtext-profile' is one level deep, so we go up one level (..)
    outDir: '../media', 
    
    // 2. Prevent Vite from clearing the media folder (incase you have other manual icons there)
    emptyOutDir: false, 

    // 3. Ensure files are named 'index.js' and 'index.css' (no hashes)
    rollupOptions: {
      output: {
        entryFileNames: 'index.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'index.css') return 'index.css';
          return '[name][extname]';
        },
      },
    },
    
    // 4. Disable source maps if you don't need them in production to keep it clean
    sourcemap: false, 
  },
});