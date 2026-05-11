// Small emoji placeholders for each cell in the LEFT list. Phase 6 will swap
// these for real thumbnails once GLB assets ship.

export const CELL_ICON: Record<string, string> = {
  'plant-cell': '🌿',
  'animal-cell': '🟢',
  neuron: '🧠',
  'white-blood-cell': '⚪',
  'epithelial-cell': '🧱',
  'bacterial-cell': '🧬',
  'muscle-cell': '💪',
};

export function cellIcon(id: string): string {
  return CELL_ICON[id] ?? '🔬';
}

// Small color accent per cell (used for bullet dots etc.)
export const CELL_ACCENT: Record<string, string> = {
  'plant-cell': '#8a9a5b',
  'animal-cell': '#7c4dff',
  neuron: '#b46bd4',
  'white-blood-cell': '#c06b4a',
  'epithelial-cell': '#d9a24a',
  'bacterial-cell': '#6b8fa5',
  'muscle-cell': '#c06b4a',
};

export function cellAccent(id: string): string {
  return CELL_ACCENT[id] ?? '#7c4dff';
}
