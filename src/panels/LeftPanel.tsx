import { startTransition } from 'react';
import { ChevronDown, Star } from 'lucide-react';
import { useStudio } from '../state/StudioContext';
import { CellThumb } from '../three/CellThumb';
import { cellAccent } from '../data/cellIcons';
import { organelleImagePath } from '../three/organelleAssets';

// Cells whose 3D models haven't shipped yet — collapse into a single Todo
// placeholder at the bottom of the list instead of stranding them as
// separately-clickable empty entries.
const TODO_CELL_IDS = new Set(['epithelial-cell', 'bacterial-cell']);

export function CellTypesPanel() {
  const { state, dispatch, cells } = useStudio();
  const liveCells = cells.filter((c) => !TODO_CELL_IDS.has(c.id));
  const todoCells = cells.filter((c) => TODO_CELL_IDS.has(c.id));

  return (
    <section className="bg-white/70 rounded-xl border border-paperDark flex flex-col min-h-0 flex-1">
      <header className="flex items-center justify-between px-4 py-2.5 border-b border-paperDark">
        <div className="flex items-center gap-1.5">
          <span aria-hidden className="text-sm leading-none">🌱</span>
          <span className="text-[11px] font-semibold tracking-[0.2em] text-ink/50">
            CELL TYPES
          </span>
        </div>
        <ChevronDown size={14} className="text-ink/40" />
      </header>

      <ul className="flex-1 overflow-y-auto py-2">
        {liveCells.map((c) => {
          const active = c.id === state.selectedCellId;
          return (
            <li key={c.id} className="px-2">
              <button
                onClick={() =>
                  startTransition(() =>
                    dispatch({ type: 'SELECT_CELL', id: c.id })
                  )
                }
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition text-left ${
                  active
                    ? 'bg-[#e6efd8] border border-olive/30'
                    : 'hover:bg-paperDark/50 border border-transparent'
                }`}
              >
                <CellThumb id={c.id} size={40} shape="square" />
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

        {todoCells.length > 0 && (
          <li className="px-2 pt-1">
            <div
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg border border-dashed border-paperDark text-left opacity-70"
              aria-disabled
              title="3D model coming soon"
            >
              <span
                aria-hidden
                className="w-10 h-10 rounded-lg bg-white border border-paperDark flex items-center justify-center shrink-0 text-base leading-none"
              >
                🧱🧬
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-ink truncate">
                  {todoCells.map((c) => c.nameEn).join(' · ')}
                  <span className="ml-1.5 text-[10px] uppercase tracking-wider text-accent/70 align-middle">
                    (Todo)
                  </span>
                </div>
                <div className="text-[11px] italic text-ink/50 truncate">
                  3D model coming soon
                </div>
              </div>
            </div>
          </li>
        )}
      </ul>
    </section>
  );
}

export function OrganellesPanel() {
  const { state, dispatch, selectedCell } = useStudio();
  const accent = cellAccent(selectedCell.id);

  return (
    <section className="bg-white/70 rounded-xl border border-paperDark flex flex-col min-h-0 flex-1">
      <header className="flex items-center justify-between px-4 py-2.5 border-b border-paperDark">
        <div className="flex items-center gap-1.5">
          <span aria-hidden className="text-accent text-sm leading-none">✦</span>
          <span className="text-[11px] font-semibold tracking-[0.2em] text-ink/50">
            ORGANELLES
          </span>
        </div>
        <ChevronDown size={14} className="text-ink/40" />
      </header>

      <ul className="flex-1 overflow-y-auto py-2 px-3 space-y-0.5">
        {selectedCell.organelles.map((o, idx) => {
          const active = o.id === state.selectedOrganelleId;
          const img = organelleImagePath(selectedCell.id, o.id);
          // Per-organelle hue fallback when no PNG is registered yet.
          const dot = active ? accent : tintForIndex(accent, idx);
          return (
            <li key={o.id}>
              <button
                onClick={() =>
                  startTransition(() =>
                    dispatch({ type: 'SELECT_ORGANELLE', id: o.id })
                  )
                }
                className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-left transition ${
                  active ? 'bg-accent-soft' : 'hover:bg-paperDark/50'
                }`}
              >
                {img ? (
                  <img
                    src={img}
                    alt=""
                    aria-hidden
                    className={`w-7 h-7 rounded-md object-cover shrink-0 bg-white transition ${
                      active
                        ? 'ring-2 ring-accent/50'
                        : 'ring-1 ring-paperDark'
                    }`}
                  />
                ) : (
                  <span
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      active
                        ? 'ring-2 ring-accent/30 ring-offset-1 ring-offset-white'
                        : ''
                    }`}
                    style={{ background: dot }}
                  />
                )}
                <span
                  className={`text-sm truncate ${
                    active ? 'text-ink font-medium' : 'text-ink/80'
                  }`}
                >
                  {o.nameEn}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

const TINT_CYCLE = ['#b46bd4', '#7c4dff', '#c06b4a', '#8a9a5b', '#d9a24a', '#6b8fa5'];
function tintForIndex(_accent: string, i: number): string {
  return TINT_CYCLE[i % TINT_CYCLE.length]!;
}

// Per-cell functional subtitle (matches the reference design — "Nerve Cell",
// "Immune Cell", "Human Tissue Cell", etc., not just kingdom).
const CELL_SUBTITLE: Record<string, string> = {
  'plant-cell': 'Eukaryotic Cell',
  'animal-cell': 'Eukaryotic Cell',
  neuron: 'Nerve Cell',
  'white-blood-cell': 'Immune Cell',
  'epithelial-cell': 'Human Tissue Cell',
  'bacterial-cell': 'Prokaryotic Cell',
  'muscle-cell': 'Muscle Fiber',
};

function kindSubtitle(c: { id: string; kingdom: string }): string {
  return (
    CELL_SUBTITLE[c.id] ??
    (c.kingdom === 'prokaryote' ? 'Prokaryotic Cell' : 'Eukaryotic Cell')
  );
}
