// Maps cell.id -> /public GLB path. Populated as Tripo3D exports land.
// Cells without an entry fall back to the placeholder render in <Stage>.
//
// All paths go through import.meta.env.BASE_URL so the same code works
// at site root ('/') and at sub-paths like GitHub Pages '/cell/'.

const BASE = import.meta.env.BASE_URL;

export const CELL_MODEL_URL: Record<string, string> = {
  'plant-cell': `${BASE}models/plant-cell.glb`,
  'animal-cell': `${BASE}models/animal-cell.glb`,
  neuron: `${BASE}models/neuron.glb`,
  'white-blood-cell': `${BASE}models/white-blood-cell.glb`,
  'muscle-cell': `${BASE}models/muscle-cell.glb`,
};

export function cellModelUrl(id: string): string | null {
  return CELL_MODEL_URL[id] ?? null;
}
