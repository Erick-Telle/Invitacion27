import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src',
  envDir: resolve(__dirname),
  publicDir: '../public',
  base: './',
  server: {
    host: true, // Expone automáticamente la web en la red local WiFi
    open: true,
    port: 5173,
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        admin: resolve(__dirname, 'src/admin.html'),
      },
    },
  },
});
