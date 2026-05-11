export type ScopeModeId = 'none' | 'light' | 'stained' | 'electron';

export interface ScopeMode {
  id: Exclude<ScopeModeId, 'none'>;
  label: string;
  /** CSS filter applied to the rendered cell to fake the optical look. */
  filter: string;
  /** Soft wash behind the cell so corners aren't pure white. */
  bg: string;
}

export const SCOPE_MODES: ScopeMode[] = [
  {
    id: 'light',
    label: 'Light Microscope',
    filter: 'saturate(0.55) brightness(1.08) sepia(0.18) hue-rotate(25deg)',
    bg: 'radial-gradient(circle at 30% 30%, #d6e2ad, #9fb26b)',
  },
  {
    id: 'stained',
    label: 'Stained Selection',
    filter: 'saturate(1.6) hue-rotate(255deg) contrast(1.05)',
    bg: 'radial-gradient(circle at 30% 30%, #e3c4f0, #b46bd4)',
  },
  {
    id: 'electron',
    label: 'Electron Microscope',
    filter: 'grayscale(1) contrast(1.35) brightness(0.9)',
    bg: 'radial-gradient(circle at 30% 30%, #8a8896, #3b3946)',
  },
];

export function scopeFilter(id: ScopeModeId): string {
  if (id === 'none') return 'none';
  return SCOPE_MODES.find((m) => m.id === id)?.filter ?? 'none';
}

// Cells whose real microscopy plates (light/stained/electron) have shipped
// under `public/microscope/{cell-id}/{mode}.png`. Toggle entries on as plates
// are produced. Cells absent here fall back to the CSS-filter render.
const HAS_PLATE: Set<string> = new Set<string>([]);

export function microscopeImagePath(
  cellId: string,
  mode: Exclude<ScopeModeId, 'none'>
): string | null {
  if (!HAS_PLATE.has(cellId)) return null;
  return `/microscope/${cellId}/${mode}.png`;
}

