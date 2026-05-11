import { ChevronDown, Star, Plus } from 'lucide-react';
import { useStudio } from '../state/StudioContext';
import { CellThumb } from '../three/CellThumb';

export function CellTypesPanel() {
  const { state, dispatch, cells } = useStudio();

  return (
    <section className="bg-white/70 rounded-xl border border-paperDark flex flex-col min-h-0">
      <header className="flex items-center justify-between px-4 py-2.5 border-b border-paperDark">
        <span className="text-[11px] font-semibold tracking-[0.2em] text-ink/50">
          CELL TYPES
        </span>
        <ChevronDown size={14} className="text-ink/40" />
      </header>

      <ul className="flex-1 overflow-y-auto py-2">
        {cells.map((c) => {
          const active = c.id === state.selectedCellId;
          return (
            <li key={c.id} className="px-2">
              <button
                onClick={() => dispatch({ type: 'SELECT_CELL', id: c.id })}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition text-left ${
                  active
                    ? 'bg-[#e6efd8] border border-olive/30'
                    : 'hover:bg-paperDark/50 border border-transparent'
                }`}
              >
                <CellThumb id={c.id} size={36} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-ink truncate">
                    {c.nameEn}
                  </div>
                  <div className="text-[11px] italic text-ink/50 truncate">
                    {kindSubtitle(c)}
                  </div>
                </div>
                {active && (
                  <Star
                    size={14}
                    className="text-olive shrink-0"
                    fill="currentColor"
                  />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function OrganellesPanel() {
  const { state, dispatch, selectedCell } = useStudio();

  return (
    <section className="bg-white/70 rounded-xl border border-paperDark flex flex-col min-h-0">
      <header className="flex items-center justify-between px-4 py-2.5 border-b border-paperDark">
        <div className="flex items-center gap-1.5">
          <Plus size={12} className="text-accent" strokeWidth={2.5} />
          <span className="text-[11px] font-semibold tracking-[0.2em] text-ink/50">
            ORGANELLES
          </span>
        </div>
      </header>

      <ul className="flex-1 overflow-y-auto py-2 px-3 space-y-0.5">
        {selectedCell.organelles.map((o) => {
          const active = o.id === state.selectedOrganelleId;
          return (
            <li key={o.id}>
              <button
                onClick={() => dispatch({ type: 'SELECT_ORGANELLE', id: o.id })}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition ${
                  active ? 'bg-accent-soft' : 'hover:bg-paperDark/50'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: active ? '#7c4dff' : '#b46bd4' }}
                />
                <span className="text-sm text-ink truncate">{o.nameEn}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function kindSubtitle(c: { kingdom: string; tagline: string }): string {
  return c.kingdom === 'prokaryote' ? 'Prokaryotic Cell' : 'Eukaryotic Cell';
}
