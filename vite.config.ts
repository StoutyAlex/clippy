import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  optimizeDeps: {
    include: ['@fingerprintjs/fingerprintjs-pro-react'],
  },
  ssr: {
    noExternal: ['@fingerprintjs/fingerprintjs-pro-react'],
  },
  server: {
    port: 3000,
  },
});
