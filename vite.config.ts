import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    svgr(),
    nodePolyfills({
      protocolImports: true
    })
  ],
  build: {
    target: 'esnext'
  }
});
