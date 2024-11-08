import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), mkcert(), svgr()],
  server: {
    https: true as unknown as { key: string; cert: string },
  },
});
