// Lookup map for per-organelle illustration PNGs cropped from the composite
// sheets (see `scripts/crop-organelles.mjs` + `organelle-layout-prompts.v1.md`).
//
// Contract: the crop pipeline writes files to
//   public/organelles/{cell-id}/{organelle-id}.png         (per-cell variant)
//   public/organelles/_shared/{organelle-id}.png           (canonical shared)
//
// Lookup preference:
//   1. If the organelle is in SHARED_IDS → use the canonical shared path.
//      (All cells share one rendering for nucleus / mito / membrane / lysosome
//       per the spec, to avoid cross-cell visual drift.)
//   2. Otherwise → per-cell path.
//
// If the PNG hasn't been generated yet (owner hasn't posted the sheet for this
// cell), the caller falls back to the accent color block.
//
// `HAS_SHEET` is the set of cell ids whose sheet has landed AND been cropped.
// Update it when new sheets arrive — or read from a manifest in a later pass.

const SHARED_IDS = new Set<string>([
  'nucleus',
  'mitochondrion',
  'cell-membrane',
  'lysosome',
]);

// Cells whose organelle sheet is ready. Toggle entries on as crops ship.
// Flipped on 2026-05-11: all 5 sheets delivered by owner, cropped by
// scripts/crop-organelles.mjs (29 per-cell PNGs + 4 shared canonical).
// epithelial-cell / bacterial-cell paused this round → stay absent → fallback.
const HAS_SHEET: Set<string> = new Set<string>([
  'plant-cell',
  'animal-cell',
  'neuron',
  'white-blood-cell',
  'muscle-cell',
]);

export function organelleImagePath(
  cellId: string,
  organelleId: string
): string | null {
  if (SHARED_IDS.has(organelleId)) {
    // Canonical shared rendering requires the animal-cell sheet to be present.
    return HAS_SHEET.has('animal-cell')
      ? `/organelles/_shared/${organelleId}.png`
      : null;
  }
  if (!HAS_SHEET.has(cellId)) return null;
  return `/organelles/${cellId}/${organelleId}.png`;
}

export function markSheetAvailable(cellId: string): void {
  HAS_SHEET.add(cellId);
}

export const SHEET_ORGANELLE_MAP: Record<string, Array<Array<string | null>>> = {
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
