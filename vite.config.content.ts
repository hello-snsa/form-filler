import { defineConfig } from 'vite';
import { resolve } from 'path';

// Builds content.js as a fully self-contained IIFE.
// Content scripts run in the page's origin, so they cannot resolve relative
// extension imports. Everything must be inlined into one file.
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: false, // append to the dist created by the main build
    lib: {
      entry: resolve(__dirname, 'src/content/index.ts'),
      name: 'IndianAutoFillContent',
      formats: ['iife'],
      fileName: () => 'content.js',
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        entryFileNames: 'content.js',
      },
    },
    sourcemap: false,
    minify: false,
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
});
