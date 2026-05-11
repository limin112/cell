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
