import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync } from 'fs';

// Builds popup, options, and background service worker (all ES modules)
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-manifest',
      closeBundle() {
        if (!existsSync('dist')) mkdirSync('dist', { recursive: true });
        if (!existsSync('dist/icons')) mkdirSync('dist/icons', { recursive: true });
        copyFileSync('manifest.json', 'dist/manifest.json');
        const iconSizes = [16, 32, 48, 128];
        iconSizes.forEach(size => {
          const src = `public/icons/icon${size}.png`;
          const dst = `dist/icons/icon${size}.png`;
          if (existsSync(src)) copyFileSync(src, dst);
        });
      }
    }
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup.html'),
        options: resolve(__dirname, 'options.html'),
        background: resolve(__dirname, 'src/background/index.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'background') return 'background.js';
          return 'assets/[name]-[hash].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    sourcemap: false,
    minify: false,
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
  },
});
