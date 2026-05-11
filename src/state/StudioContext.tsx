import { createContext, useContext, useReducer, ReactNode } from 'react';
import type { Cell, Organelle } from '../types/cells';
import { cells } from '../data/cells';

type ViewMode = 'solid' | 'layered' | 'sliced';

interface StudioState {
  selectedCellId: string;
  selectedOrganelleId: string | null;
  viewMode: ViewMode;
  crossSection: boolean;
  label: boolean;
}

type StudioAction =
  | { type: 'SELECT_CELL'; id: string }
  | { type: 'SELECT_ORGANELLE'; id: string | null }
  | { type: 'SET_VIEW_MODE'; mode: ViewMode }
  | { type: 'TOGGLE_CROSS_SECTION' }
  | { type: 'TOGGLE_LABEL' }
  | { type: 'RESET_VIEW' };

const initial: StudioState = {
  selectedCellId: cells[0]?.id ?? '',
  selectedOrganelleId: cells[0]?.organelles[0]?.id ?? null,
  viewMode: 'layered',
  crossSection: true,
  label: true,
};

function reducer(s: StudioState, a: StudioAction): StudioState {
  switch (a.type) {
    case 'SELECT_CELL': {
      const cell = cells.find((c) => c.id === a.id);
      return {
        ...s,
        selectedCellId: a.id,
        selectedOrganelleId: cell?.organelles[0]?.id ?? null,
      };
    }
    case 'SELECT_ORGANELLE':
      return { ...s, selectedOrganelleId: a.id };
    case 'SET_VIEW_MODE':
      return { ...s, viewMode: a.mode };
    case 'TOGGLE_CROSS_SECTION':
      return { ...s, crossSection: !s.crossSection };
    case 'TOGGLE_LABEL':
      return { ...s, label: !s.label };
    case 'RESET_VIEW':
      return { ...s, viewMode: 'layered', crossSection: true };
    default:
      return s;
  }
}

interface Ctx {
  state: StudioState;
  dispatch: React.Dispatch<StudioAction>;
  selectedCell: Cell;
  selectedOrganelle: Organelle | null;
  cells: Cell[];
}

const StudioCtx = createContext<Ctx | null>(null);

export function StudioProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const selectedCell = cells.find((c) => c.id === state.selectedCellId) ?? cells[0]!;
  const selectedOrganelle =
    selectedCell.organelles.find((o) => o.id === state.selectedOrganelleId) ?? null;

  return (
    <StudioCtx.Provider value={{ state, dispatch, selectedCell, selectedOrganelle, cells }}>
      {children}
    </StudioCtx.Provider>
  );
}

export function useStudio(): Ctx {
  const ctx = useContext(StudioCtx);
  if (!ctx) throw new Error('useStudio must be used inside StudioProvider');
  return ctx;
}

export type { ViewMode };
