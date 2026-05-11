#!/usr/bin/env bash
# SH-3 scaffold script — manual Vite + React + TS + R3F + Tailwind setup
# Avoids interactive `npm create vite` prompts. Writes files directly then installs.

set -euo pipefail
cd /workspaces/6a01547b76b9650c89510bf7/cell-architecture-studio

echo "==> [1/10] Writing package.json"
cat > package.json <<'JSON'
{
  "name": "cell-architecture-studio",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "build": "tsc -b && vite build",
    "preview": "vite preview --host 0.0.0.0",
    "typecheck": "tsc -b --noEmit"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "three": "^0.169.0",
    "@react-three/fiber": "^8.17.10",
    "@react-three/drei": "^9.117.3"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@types/three": "^0.169.0",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.14",
    "typescript": "^5.6.3",
    "vite": "^5.4.11"
  }
}
JSON

echo "==> [2/10] Writing index.html"
cat > index.html <<'HTML'
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cell Architecture Studio</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
HTML

echo "==> [3/10] Writing vite.config.ts"
cat > vite.config.ts <<'TS'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { host: '0.0.0.0', port: 5173 },
});
TS

echo "==> [4/10] Writing tsconfig.json + tsconfig.node.json"
cat > tsconfig.json <<'JSON'
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": false,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
JSON

cat > tsconfig.node.json <<'JSON'
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
JSON

echo "==> [5/10] Writing tailwind.config.js + postcss.config.js"
cat > tailwind.config.js <<'JS'
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Study target: cream paper bg + purple accent + olive/terracotta
        paper: '#faf6ed',
        paperDark: '#f1ebd9',
        ink: '#2e2a3d',
        accent: {
          DEFAULT: '#7c4dff',
          soft: '#ece5ff',
        },
        olive: '#8a9a5b',
        terracotta: '#c06b4a',
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', 'system-ui', 'sans-serif'],
        serif: ['"Noto Serif SC"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
JS

cat > postcss.config.js <<'JS'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
JS

echo "==> [6/10] Creating src/ structure"
mkdir -p src/components src/panels src/three src/state src/types src/styles
# (data/ already contains cells.json)

cat > src/index.css <<'CSS'
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body, #root { height: 100%; }
body {
  @apply bg-paper text-ink font-sans antialiased;
}
CSS

cat > src/types/cells.ts <<'TS'
export type Kingdom = 'prokaryote' | 'eukaryote';
export type Trait = 'multi-nucleated' | 'specialized';

export interface Organelle {
  id: string;
  nameEn: string;
  nameZh: string;
  tagline: string;
  taglineEn?: string;
  shared: boolean;
}

export interface Cell {
  id: string;
  nameEn: string;
  nameZh: string;
  kingdom: Kingdom;
  traits: Trait[];
  tagline: string;
  taglineEn?: string;
  organelles: Organelle[];
}

export interface CellsBundle {
  _meta: Record<string, unknown>;
  cells: Cell[];
}
TS

cat > src/data/cells.ts <<'TS'
import raw from './cells.json';
import type { Cell, CellsBundle } from '../types/cells';

const bundle = raw as unknown as CellsBundle;
export const cells: Cell[] = bundle.cells;
export default cells;
TS

cat > src/main.tsx <<'TSX'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('#root not found');
ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
TSX

cat > src/App.tsx <<'TSX'
import { useState } from 'react';
import { cells } from './data/cells';

export default function App() {
  const [selectedId, setSelectedId] = useState<string>(cells[0]?.id ?? '');
  const selectedCell = cells.find((c) => c.id === selectedId) ?? cells[0];
  if (!selectedCell) return <div>No cells data</div>;

  return (
    <div className="h-screen w-screen grid grid-rows-[auto_1fr] overflow-hidden">
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-6 border-b border-paperDark bg-paper/80 backdrop-blur">
        <div className="flex items-baseline gap-3">
          <span className="font-serif text-xl font-semibold text-accent">Cell Architecture Studio</span>
          <span className="text-sm text-ink/60">Explore life at the microscopic level</span>
        </div>
        <nav className="flex gap-4 text-sm text-ink/30 pointer-events-none select-none">
          <span>Gallery</span><span>Library</span><span>Notebooks</span><span>Settings</span>
        </nav>
      </header>

      {/* Main 4-pane grid */}
      <main className="grid grid-cols-[260px_1fr_320px] grid-rows-[1fr_260px] gap-3 p-3 min-h-0">
        {/* Left: cell list */}
        <aside className="row-span-2 bg-white/70 rounded-xl p-3 border border-paperDark overflow-y-auto">
          <div className="text-xs font-semibold text-ink/50 tracking-wider mb-2">CELL TYPES</div>
          <ul className="space-y-1">
            {cells.map((c) => {
              const active = c.id === selectedId;
              return (
                <li key={c.id}>
                  <button
                    onClick={() => setSelectedId(c.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition ${
                      active ? 'bg-accent-soft border border-accent/30' : 'hover:bg-paperDark/60'
                    }`}
                  >
                    <div className="text-sm font-medium">{c.nameZh}</div>
                    <div className="text-xs text-ink/50">
                      {c.kingdom === 'eukaryote' ? '真核细胞' : '原核细胞'}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Center: 3D viewer placeholder */}
        <section className="bg-white/70 rounded-xl border border-paperDark flex flex-col min-h-0">
          <div className="p-4 border-b border-paperDark">
            <div className="font-serif text-2xl font-semibold">{selectedCell.nameEn}</div>
            <div className="text-sm text-ink/60 italic">{selectedCell.nameZh} · {selectedCell.tagline}</div>
          </div>
          <div className="flex-1 flex items-center justify-center text-ink/30 text-sm">
            [3D viewer placeholder — Phase 3]
          </div>
        </section>

        {/* Right: organelle details */}
        <aside className="bg-white/70 rounded-xl p-4 border border-paperDark overflow-y-auto">
          <div className="text-xs font-semibold text-ink/50 tracking-wider mb-2">ORGANELLES</div>
          <ul className="space-y-2">
            {selectedCell.organelles.map((o) => (
              <li key={o.id} className="p-2 rounded-lg hover:bg-paperDark/60 cursor-pointer">
                <div className="text-sm font-medium">{o.nameZh}</div>
                <div className="text-xs text-ink/60">{o.tagline}</div>
              </li>
            ))}
          </ul>
        </aside>

        {/* Bottom: microscope + compare row */}
        <footer className="col-span-2 bg-white/70 rounded-xl p-4 border border-paperDark flex gap-4 items-center text-sm text-ink/50">
          <div className="flex-1">[Microscope view — Phase 5]</div>
          <div className="w-px self-stretch bg-paperDark" />
          <div className="flex-1">[Compare cells — Phase 5]</div>
        </footer>
      </main>
    </div>
  );
}
TSX

echo "==> [7/10] Writing .gitignore"
cat > .gitignore <<'GI'
node_modules
dist
.DS_Store
*.local
.vite
GI

echo "==> [8/10] Running npm install (this takes a minute)"
npm install --no-audit --no-fund 2>&1 | tail -20

echo "==> [9/10] Running typecheck + build"
npm run build 2>&1 | tail -30

echo "==> [10/10] git init + commit"
git init -q 2>/dev/null || true
git add -A
git -c user.email=6a01547b76b9650c89510bf7@id.helio.im -c user.name="前端工程师" commit -q -m "SH-3 Phase 1: scaffold Vite + React + TS + R3F + Tailwind with cells schema typed" || true
git log --oneline -3

echo "==> DONE"
