import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Repo name = 'cell'. When deployed to https://limin112.github.io/cell/
// Vite needs the base path so asset URLs resolve correctly.
// In dev / preview it falls back to '/'.
const base = process.env.GITHUB_ACTIONS ? '/cell/' : '/';

export default defineConfig({
  base,
  plugins: [react()],
  server: { host: '0.0.0.0', port: 5173 },
});
