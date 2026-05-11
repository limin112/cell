# Cell Architecture Studio

互动式 3D 细胞生物学探索器,面向中国小学 / 初中学生。
七种细胞类型,二十九种细胞器,真实显微镜参考照片,全部在浏览器里渲染。

An interactive 3D cell-biology explorer for middle-school students.
Seven cell types, twenty-nine organelles, real light-microscopy
reference photos, all rendered in the browser.

## Demo

<p align="center">
  <video src="https://github.com/limin112/cell/raw/main/docs/cell-1080p.mp4" controls width="720" muted></video>
</p>

📽️ [点这里下载或在线观看 / Click to download or watch](https://github.com/limin112/cell/raw/main/docs/cell-1080p.mp4)

---

# 中文版

## 简介

界面把一个风格化的 3D 细胞放在中间,旁边是真实的显微镜照片,
再用通俗的中文解释贴在侧栏 —— 目标是让学生把课本插图看到的东西
跟显微镜下真实看到的东西对得上。

2026-05-11 由 Helio AI 团队四小时做出的 demo。
鸣谢见 [AUTHORS.md](./AUTHORS.md)。

## 技术栈

- **React 18 + TypeScript + Vite** —— SPA 外壳,无 SSR。
- **react-three-fiber + drei + three.js** —— 3D 视口,
  OrbitControls、Bounds 自动 fit、按实例 clone 场景。
- **Tailwind CSS** —— 整个 UI,奶油纸背景,柔和阴影。
- **sharp + puppeteer (仅 dev)** —— 构建期图片裁剪
  (`scripts/crop-organelles.mjs`) 和无头 WebGL 截图 (`scripts/shot.mjs`)。

## 目录

```
src/
  data/           细胞 schema + 细胞器文案 (v2 中文原生)
  panels/         5 个面板组件 (TopBar / Left / Stage / Right / Bottom)
  state/          React Context + useReducer 全局 state
  three/          R3F viewer、细胞器资源查表、细胞缩略图
  types/          类型定义

public/
  models/         5 个 Tripo3D GLB (plant / animal / neuron / WBC / muscle)
  organelle-sheets/   作者生成的合成大图 (每张 1536x1024)
  organelles/     裁剪后的 512x512 单器官 PNG + _shared 共用
  thumbs/         CellThumb 缓存种子

artifacts/cell-studio/
  prompts.v2.md           36 张风格化渲染图的 GPT-image prompt
  copy.phase5.v2.json     30 个细胞器文案的唯一来源
  organelle-layout-prompts.v1.md   5 细胞合成大图 prompt + 裁剪规格
  lm-refs/<cell-id>/      显微镜原图 + ATTRIBUTION.md

scripts/
  crop-organelles.mjs     1536x1024 大图 -> 29 个 per-cell + 4 个 shared
  shot.mjs                无头 WebGL 截图,用于冒烟测试
```

## 跑起来

```bash
npm ci
npm run dev       # http://localhost:5173
npm run build     # 输出到 dist/
npm run typecheck
```

## 3D 资产怎么做的

1. 作者在 GPT image 2 用 `prompts.v2.md` 里的 Style Anchor v2 prompt
   为每种细胞生成关键帧插画。
2. 关键帧丢到 [Tripo3D](https://www.tripo3d.ai/) 做 image-to-3D,导出 GLB。
3. GLB 放到 `public/models/{cell-id}.glb`,viewer 的 `assetRegistry.ts` 会自动接管。
4. 右侧细胞器徽章用合成大图: 作者跑 5 细胞 × 6 面板的 prompt,把 1536x1024
   PNG 放入 `public/organelle-sheets/`,再用 `scripts/crop-organelles.mjs`
   裁出 512x512 单器官 PNG。

## 部署

静态站,任何 host 都可以。第一次 demo 部署用了 Netlify Drop
(拖 `dist/` 到 https://app.netlify.com/drop)。

## License

MIT,详见 [LICENSE](./LICENSE)。

`artifacts/cell-studio/lm-refs/` 下的显微镜参考照片**不在**本项目
MIT license 范围内 —— 每张图保留各自的上游 license (CC0 / CC BY /
CC BY-SA / 公共领域)。再分发时请按对应细胞 `ATTRIBUTION.md` 表里
的 attribution 来。

---

# English

## Overview

**Audience**: 中国小学 / 初中生. The UI puts a stylized 3D cell in
the center, a real microscope photo next to it, and plain-language
Chinese explanations on the side — the point is for students to
match what they see in a textbook illustration to what they'd see
under a real microscope.

Built 2026-05-11 as a four-hour demo by a Helio AI team.
See [AUTHORS.md](./AUTHORS.md) for credits.

## Tech stack

- **React 18 + TypeScript + Vite** — SPA shell, no SSR.
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
