#!/usr/bin/env node
/**
 * Crop 1536×1024 composite organelle sheets into 512×512 per-organelle PNGs.
 *
 * Input:  public/organelle-sheets/{cell-id}-organelle-sheet.png  (5 expected)
 * Output: public/organelles/{cell-id}/{organelle-id}.png         (per-cell)
 *         public/organelles/_shared/{organelle-id}.png           (canonical shared)
 *
 * Shared organelle canonical source = animal-cell sheet (contains all 4 shared
 * in one place — nucleus / mitochondrion / cell-membrane / lysosome).
 */
import { mkdir, access, copyFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import sharp from 'sharp';

const ROOT = resolve(import.meta.dirname, '..');
const SHEETS_DIR = join(ROOT, 'public', 'organelle-sheets');
const OUT_DIR = join(ROOT, 'public', 'organelles');
const TILE = 512;

// (col, row) → organelle id per cell. null = blank.
const SHEET_MAP = {
  'plant-cell': [
    ['cell-wall', 'chloroplast', 'central-vacuole'],
    ['nucleus', 'mitochondrion', null],
  ],
  'animal-cell': [
    ['cell-membrane', 'nucleus', 'mitochondrion'],
    ['endoplasmic-reticulum', 'golgi-apparatus', 'lysosome'],
  ],
  neuron: [
    ['soma', 'dendrites', 'axon'],
    ['myelin-sheath', 'synaptic-terminal', 'nucleus'],
  ],
  'white-blood-cell': [
    ['lobed-nucleus', 'cell-membrane', 'lysosome'],
    ['mitochondrion', 'granules', 'pseudopod'],
  ],
  'muscle-cell': [
    ['myofibril', 'sarcomere', 'sarcoplasmic-reticulum'],
    ['multi-nuclei', 'mitochondrion', 'sarcolemma'],
  ],
};

const SHARED_IDS = new Set(['nucleus', 'mitochondrion', 'cell-membrane', 'lysosome']);
const CANONICAL_SHEET = 'animal-cell';

async function ensureDir(p) {
  await mkdir(p, { recursive: true });
}

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function cropSheet(cellId) {
  const sheetPath = join(SHEETS_DIR, `${cellId}-organelle-sheet.png`);
  if (!(await exists(sheetPath))) {
    console.warn(`[skip] ${cellId}: sheet missing at ${sheetPath}`);
    return { cellId, cropped: [], skipped: true };
  }

  const meta = await sharp(sheetPath).metadata();
  if (meta.width !== 1536 || meta.height !== 1024) {
    console.warn(
      `[warn] ${cellId}: expected 1536×1024, got ${meta.width}×${meta.height}`
    );
  }

  const cellOutDir = join(OUT_DIR, cellId);
  await ensureDir(cellOutDir);

  const map = SHEET_MAP[cellId];
  const cropped = [];

  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 3; col++) {
      const id = map[row][col];
      if (!id) continue;
      const out = join(cellOutDir, `${id}.png`);
      await sharp(sheetPath)
        .extract({ left: col * TILE, top: row * TILE, width: TILE, height: TILE })
        .png({ compressionLevel: 9 })
        .toFile(out);
      cropped.push({ id, row, col, out });
    }
  }

  return { cellId, cropped, skipped: false };
}

async function copyCanonicalShared() {
  const sharedDir = join(OUT_DIR, '_shared');
  await ensureDir(sharedDir);
  const srcDir = join(OUT_DIR, CANONICAL_SHEET);

  const results = [];
  for (const id of SHARED_IDS) {
    const src = join(srcDir, `${id}.png`);
    if (!(await exists(src))) {
      console.warn(`[skip-shared] ${id}: canonical source missing at ${src}`);
      continue;
    }
    const dst = join(sharedDir, `${id}.png`);
    await copyFile(src, dst);
    results.push({ id, dst });
  }
  return results;
}

async function main() {
  await ensureDir(OUT_DIR);
  const report = [];
  for (const cellId of Object.keys(SHEET_MAP)) {
    report.push(await cropSheet(cellId));
  }
  const shared = await copyCanonicalShared();

  console.log('\n=== crop-organelles report ===');
  for (const r of report) {
    if (r.skipped) {
      console.log(`  ${r.cellId}: SKIPPED (sheet missing)`);
      continue;
    }
    const ids = r.cropped.map((c) => c.id).join(', ');
    console.log(`  ${r.cellId}: ${r.cropped.length} tiles → ${ids}`);
  }
  console.log(`  _shared/: ${shared.length} canonical (${shared.map((s) => s.id).join(', ')})`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
