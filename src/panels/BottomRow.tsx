import { Info, Plus, ChevronRight } from 'lucide-react';
import { useStudio } from '../state/StudioContext';
import { CellThumb } from '../three/CellThumb';
import { SCOPE_MODES, microscopeImagePath } from '../data/microscopeModes';

export function MicroscopeView() {
  const { state, dispatch, selectedCell } = useStudio();

  return (
    <section className="bg-white/70 rounded-xl border border-paperDark flex flex-col min-h-0 overflow-hidden">
      <header className="flex items-center gap-1.5 px-4 py-2.5 border-b border-paperDark">
        <span className="text-[11px] font-semibold tracking-[0.2em] text-ink/50">
          MICROSCOPE VIEW
        </span>
        <Info size={12} className="text-ink/30" />
      </header>

      <div className="p-3 grid grid-cols-4 gap-2 items-stretch">
        {SCOPE_MODES.map((m) => {
          const active = state.scopeMode === m.id;
          const plate = microscopeImagePath(selectedCell.id, m.id);
          return (
            <button
              key={m.id}
              type="button"
              onClick={() =>
                dispatch({
                  type: 'SET_SCOPE_MODE',
                  mode: active ? 'none' : m.id,
                })
              }
              aria-pressed={active}
              title={active ? `${m.label} (click to clear)` : m.label}
              className="flex flex-col gap-1.5 text-left focus:outline-none"
            >
              <div
                className={`aspect-square rounded-lg overflow-hidden relative transition ${
                  active
                    ? 'ring-2 ring-accent shadow-md'
                    : 'ring-1 ring-paperDark hover:ring-ink/20'
                }`}
                style={{ background: m.bg }}
              >
                {plate ? (
                  <img
                    src={plate}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0" style={{ filter: m.filter }}>
                    <CellThumb
                      id={selectedCell.id}
                      size="fill"
                      shape="square"
                      border="none"
                    />
                  </div>
                )}
              </div>
              <span
                className={`text-[10px] truncate ${
                  active ? 'text-accent font-medium' : 'text-ink/60'
                }`}
              >
                {m.label}
              </span>
            </button>
          );
        })}
        <button className="aspect-square rounded-lg border border-dashed border-ink/20 flex flex-col items-center justify-center gap-1 text-ink/40 hover:bg-paperDark/40 transition">
          <Plus size={16} />
          <span className="text-[10px]">Add image</span>
        </button>
      </div>
    </section>
  );
}

export function CompareCells() {
  const { selectedCell, cells } = useStudio();

  // Pick "the other one" for VS — first cell that isn't current.
  const other = cells.find((c) => c.id !== selectedCell.id) ?? cells[0]!;

  return (
    <section className="bg-white/70 rounded-xl border border-paperDark flex flex-col min-h-0 overflow-hidden">
      <header className="flex items-center gap-1.5 px-4 py-2.5 border-b border-paperDark">
        <span className="text-[11px] font-semibold tracking-[0.2em] text-ink/50">
          COMPARE CELLS
        </span>
        <Info size={12} className="text-ink/30" />
      </header>

      <div className="flex-1 px-4 py-3 flex flex-col justify-center gap-3">
        <div className="flex items-center gap-3 justify-center">
          <CellChip
            id={selectedCell.id}
            name={selectedCell.nameEn}
            sub="(You are here)"
          />
          <span className="text-xs font-semibold text-accent bg-accent-soft rounded-full w-7 h-7 flex items-center justify-center">
            vs
          </span>
          <CellChip
            id={other.id}
            name={other.nameEn}
            sub={kindSubtitle(other.kingdom)}
          />
        </div>

        <button className="self-center flex items-center gap-1 px-4 py-1.5 rounded-full border border-paperDark text-xs text-ink/70 hover:bg-paperDark/40 transition">
          Open Comparison View
          <ChevronRight size={14} />
        </button>
      </div>
    </section>
  );
}

function CellChip({
  id,
  name,
  sub,
}: {
  id: string;
  name: string;
  sub: string;
}) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-paperDark shadow-sm">
      <CellThumb id={id} size={28} />
      <div className="min-w-0 pr-1">
        <div className="text-xs font-medium text-ink truncate">{name}</div>
        <div className="text-[10px] italic text-ink/50 truncate">{sub}</div>
      </div>
    </div>
  );
}

function kindSubtitle(k: string): string {
  return k === 'prokaryote' ? 'Prokaryotic' : 'Eukaryotic';
}
