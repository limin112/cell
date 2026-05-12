import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base so the build works on any subpath — GitHub Pages
// (/cell/), Netlify root, S3 folders, file:// previews — without
// caring where it lands. Dev / preview still serve at '/'.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? './' : '/',
  plugins: [react()],
  server: { host: '0.0.0.0', port: 5173 },
}));
