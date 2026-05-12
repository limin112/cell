#!/usr/bin/env node
/**
 * Compress textures embedded in GLB files under public/models/.
 *
 * Why textures, not geometry: Tripo3D exports ship with EXT_meshopt_compression
 * already applied to geometry; re-encoding with Draco actually grows the file.
 * The remaining size sits in baseline PNG textures (often 2K, ~3–4 MB each).
 * Re-encoding them to WebP + resizing to a sensible cap cuts each GLB roughly
 * in half with no visible quality change at thumbnail scale.
 *
 * Run:
 *   node scripts/compress-models.mjs
 */
import { readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { statSync } from 'node:fs';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { textureCompress } from '@gltf-transform/functions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import sharp from 'sharp';

const ROOT = resolve(import.meta.dirname, '..');
const MODELS_DIR = resolve(ROOT, 'public', 'models');

await MeshoptDecoder.ready;
await MeshoptEncoder.ready;

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({
    'meshopt.decoder': MeshoptDecoder,
    'meshopt.encoder': MeshoptEncoder,
  });

async function compressOne(filename) {
  const path = resolve(MODELS_DIR, filename);
  const beforeBytes = statSync(path).size;
  const doc = await io.read(path);

  await doc.transform(
    textureCompress({
      encoder: sharp,
      targetFormat: 'webp',
      // Cap texture resolution; cells are small on screen, 1024 is plenty.
      resize: [1024, 1024],
      quality: 80,
    })
  );

  await io.write(path, doc);
  const afterBytes = statSync(path).size;
  const ratio = ((afterBytes / beforeBytes) * 100).toFixed(1);
  console.log(
    `  ${filename}  ${(beforeBytes / 1024).toFixed(1)} KB → ${(afterBytes / 1024).toFixed(1)} KB  (${ratio}%)`
  );
}

async function main() {
  const entries = await readdir(MODELS_DIR);
  const glbs = entries.filter((n) => n.endsWith('.glb')).sort();
  console.log(`Compressing ${glbs.length} GLB files in ${MODELS_DIR}\n`);
  for (const f of glbs) {
    await compressOne(f);
  }
  console.log('\nDone.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
