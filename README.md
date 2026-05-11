# Cell Architecture Studio

An interactive 3D cell-biology explorer for middle-school students.
Seven cell types, twenty-nine organelles, real light-microscopy
reference photos, all rendered in the browser.

**Audience**: 中国小学 / 初中生. The UI puts a stylized 3D cell in
the center, a real microscope photo next to it, and plain-language
Chinese explanations on the side — the point is for students to
match what they see in a textbook illustration to what they'd see
under a real microscope.

Built 2026-05-11 as a four-hour demo by a Helio AI team.
See [AUTHORS.md](./AUTHORS.md) for credits.

---

## Tech stack

- **React 18 + TypeScript + Vite** — SPA shell, no SSR, no
  server-side rendering.
- **react-three-fiber + drei + three.js** — 3D viewer with
  OrbitControls, Bounds auto-fit, and per-instance scene cloning.
- **Tailwind CSS** — the whole UI, cream paper background, soft
  shadows.
- **sharp + puppeteer (dev only)** — build-time image cropping
  (`scripts/crop-organelles.mjs`) and headless WebGL screenshots
  (`scripts/shot.mjs`).

## Layout

```
src/
  data/           cell schema + organelle copy (v2 ZH-native)
  panels/         5 panel components (TopBar / Left / Stage / Right / Bottom)
  state/          React Context + useReducer studio state
  three/          R3F viewer, organelle asset lookup, cell thumbnails
  types/          typed schema definitions

public/
  models/         5 Tripo3D GLBs (plant / animal / neuron / WBC / muscle)
  organelle-sheets/   owner-generated composite sheets (1536x1024 each)
  organelles/     cropped 512x512 per-cell + _shared canonical
  thumbs/         CellThumb cache seeds

artifacts/cell-studio/
  prompts.v2.md           GPT-image prompts for the 36 stylized renders
  copy.phase5.v2.json     single source of truth for all 30 organelle entries
  organelle-layout-prompts.v1.md   5-cell composite sheet prompts + crop spec
  lm-refs/<cell-id>/      native LM photos + ATTRIBUTION.md

scripts/
  crop-organelles.mjs     1536x1024 sheet -> 29 per-cell PNGs + 4 shared
  shot.mjs                headless WebGL screenshot for smoke tests
```

## Run it

```bash
npm ci
npm run dev       # http://localhost:5173
npm run build     # writes dist/
npm run typecheck
```

## How the 3D assets are made

1. Owner generates a keyframe illustration per cell in GPT image 2
   using the Style Anchor v2 prompts in `prompts.v2.md`.
2. Keyframe goes into [Tripo3D](https://www.tripo3d.ai/) as an
   image-to-3D source -> GLB download.
3. GLB lands in `public/models/{cell-id}.glb` and the viewer's
   `assetRegistry.ts` picks it up automatically.
4. For the right-side organelle badges, owner runs the composite
   sheet prompts (5 cells x 6 panels each) in GPT image 2, drops the
   1536x1024 PNGs into `public/organelle-sheets/`, and
   `scripts/crop-organelles.mjs` crops them into per-organelle
   512x512 PNGs.

## Deploy

Static site, any host. Used Netlify Drop for the first demo deploy
(drag `dist/` at https://app.netlify.com/drop).

## License

MIT. See [LICENSE](./LICENSE).

The microscopy reference photos under
`artifacts/cell-studio/lm-refs/` are NOT covered by the project's
MIT license — each photo keeps its own upstream license (CC0 / CC BY
/ CC BY-SA / public domain). Honor the attribution table in each
cell's `ATTRIBUTION.md` when redistributing.
