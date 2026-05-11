// Maps cell.id -> /public GLB path. Populated as Tripo3D exports land.
// Cells without an entry fall back to the placeholder render in <Stage>.

export const CELL_MODEL_URL: Record<string, string> = {
  'plant-cell': '/models/plant-cell.glb',
  'animal-cell': '/models/animal-cell.glb',
  neuron: '/models/neuron.glb',
  'white-blood-cell': '/models/white-blood-cell.glb',
  'muscle-cell': '/models/muscle-cell.glb',
};

export function cellModelUrl(id: string): string | null {
  return CELL_MODEL_URL[id] ?? null;
}
