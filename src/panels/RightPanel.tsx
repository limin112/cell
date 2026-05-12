import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useStudio } from '../state/StudioContext';
import { getOrganelleMock } from '../data/mockCopy';
import { organelleImagePath } from '../three/organelleAssets';

export function RightColumn() {
  const { selectedOrganelle } = useStudio();

  if (!selectedOrganelle) {
    return (
      <div className="flex flex-col gap-3 min-h-0">
        <section className="bg-white/70 rounded-xl border border-paperDark p-4 flex items-center justify-center text-sm text-ink/40">
          No organelle selected
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 min-h-0 overflow-y-auto">
      <OrganelleDetailsCard />
      <BiologicalNotesCard />
      <WhereItOccursCard />
    </div>
  );
}

function OrganelleDetailsCard() {
  const { state, dispatch, selectedOrganelle, selectedCell } = useStudio();
  if (!selectedOrganelle) return null;
  const mock = getOrganelleMock(selectedOrganelle.id);
  const imgSrc = organelleImagePath(selectedCell.id, selectedOrganelle.id);

  return (
    <section className="bg-white/70 rounded-xl border border-paperDark flex flex-col overflow-hidden shrink-0">
      <header className="flex items-center justify-between px-4 py-2.5 border-b border-paperDark">
        <span className="text-[11px] font-semibold tracking-[0.2em] text-ink/50">
          ORGANELLE DETAILS
        </span>
        <Heart size={14} className="text-accent/70" fill="currentColor" />
      </header>

      <div
        key={`${selectedCell.id}:${selectedOrganelle.id}`}
        className="p-4 space-y-3 fade-rise"
      >
        <div className="flex items-start gap-3">
          <OrganelleBadge src={imgSrc} accent={mock.accent ?? '#7c4dff'} />
          <div className="min-w-0 pt-1">
            <div className="font-serif text-lg font-semibold text-ink truncate">
              {selectedOrganelle.nameEn}
            </div>
            <div className="text-xs italic text-ink/50 truncate">
              {selectedOrganelle.taglineEn ?? selectedOrganelle.tagline}
            </div>
          </div>
        </div>

        <div className="text-xs text-ink/70 space-y-1">
          <AttrRow label="Size" value={mock.size} />
          <AttrRow label="Location" value={mock.location} />
          <AttrRow label="Visible in LM" value={mock.visibleInLM} />
          <div className="flex items-center justify-between gap-3 py-1">
            <span className="text-ink/50">Label</span>
            <div className="flex items-center gap-2">
              <LabelSwitch
                on={state.label}
                onToggle={() => dispatch({ type: 'TOGGLE_LABEL' })}
              />
              <span
                aria-hidden
                className="w-2 h-2 rounded-full"
                style={{
                  background: state.label
                    ? mock.accent ?? '#7c4dff'
                    : '#d4d0c8',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BiologicalNotesCard() {
  const { selectedOrganelle } = useStudio();
  if (!selectedOrganelle) return null;
  const mock = getOrganelleMock(selectedOrganelle.id);

  return (
    <section className="bg-white/70 rounded-xl border border-paperDark overflow-hidden shrink-0">
      <header className="px-4 py-2.5 border-b border-paperDark">
        <span className="font-serif italic text-sm text-accent/80">
          BIOLOGICAL NOTES
        </span>
      </header>

      <div key={selectedOrganelle.id} className="p-4 space-y-3 fade-rise">
        <p className="text-xs leading-relaxed text-ink/80">
          {mock.biologicalNotes}
        </p>
        <div className="bg-[#fdf2b8]/70 rounded-lg px-3 py-2 border border-[#e9d98a] relative">
          <span
            aria-hidden
            className="absolute -top-1.5 -right-1.5 text-accent/70 text-sm"
          >
            ✦
          </span>
          <p className="text-xs italic leading-relaxed text-ink/80">
            <span className="font-semibold not-italic">Fun fact:</span>{' '}
            {mock.funFact}
          </p>
        </div>
      </div>
    </section>
  );
}

function WhereItOccursCard() {
  const { selectedCell } = useStudio();
  return (
    <section className="bg-white/70 rounded-xl border border-paperDark overflow-hidden shrink-0">
      <header className="px-4 py-2.5 border-b border-paperDark">
        <span className="font-serif italic text-sm text-accent/80">
          WHERE IT OCCURS
        </span>
      </header>

      <div className="px-4 py-3">
        <HabitatIllustration cellId={selectedCell.id} />
      </div>
    </section>
  );
}

/** Watercolor habitat (tree / body / petri) + magnifier circle on the right. */
function HabitatIllustration({ cellId }: { cellId: string }) {
  const habitat = HABITAT[cellId] ?? HABITAT.default!;
  return (
    <div className="flex items-center justify-between gap-3 h-40 px-2">
      <div className="flex-1 flex items-center justify-center text-7xl leading-none select-none">
        <span aria-hidden>{habitat.scene}</span>
      </div>
      <svg viewBox="0 0 100 80" className="w-32 h-24 shrink-0">
        <line
          x1="6"
          y1="40"
          x2="40"
          y2="40"
          stroke="#8a9a5b"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
        <circle
          cx="68"
          cy="40"
          r="30"
          fill={habitat.zoomFill}
          stroke="#8a9a5b"
          strokeWidth="1.5"
        />
        <text
          x="68"
          y="50"
          textAnchor="middle"
          fontSize="32"
          fontFamily="serif"
        >
          {habitat.zoom}
        </text>
      </svg>
    </div>
  );
}

const HABITAT: Record<
  string,
  { scene: string; zoom: string; zoomFill: string }
> = {
  'plant-cell': { scene: '🌳', zoom: '🌿', zoomFill: '#e6efd8' },
  'animal-cell': { scene: '🧍', zoom: '🟣', zoomFill: '#efe2f8' },
  neuron: { scene: '🧠', zoom: '⚡', zoomFill: '#f3e6fa' },
  'white-blood-cell': { scene: '🩸', zoom: '🛡️', zoomFill: '#fde4dc' },
  'epithelial-cell': { scene: '🫁', zoom: '🧱', zoomFill: '#fbeed3' },
  'bacterial-cell': { scene: '🧫', zoom: '🦠', zoomFill: '#dfeaf0' },
  'muscle-cell': { scene: '💪', zoom: '💗', zoomFill: '#fde4dc' },
  default: { scene: '🔬', zoom: '🧬', zoomFill: '#efe2f8' },
};

function OrganelleBadge({
  src,
  accent,
}: {
  src: string | null;
  accent: string;
}) {
  const [failed, setFailed] = useState(false);
  if (src && !failed) {
    return (
      <img
        src={src}
        alt=""
        onError={() => setFailed(true)}
        className="w-14 h-14 rounded-xl shrink-0 object-cover"
        style={{
          background: `${accent}15`,
          boxShadow: 'inset 0 0 8px rgba(0,0,0,0.08)',
        }}
      />
    );
  }
  return (
    <div
      className="w-14 h-14 rounded-xl shrink-0"
      style={{
        background: `radial-gradient(circle at 35% 35%, #ffffff, ${accent} 80%)`,
        boxShadow: 'inset 0 0 8px rgba(0,0,0,0.08)',
      }}
    />
  );
}

function AttrRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1 border-b border-paperDark/60 last:border-0">
      <span className="text-ink/50 text-xs">{label}</span>
      <span className="text-ink text-xs text-right flex-1 truncate">
        {value}
      </span>
    </div>
  );
}

function LabelSwitch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-9 h-5 rounded-full transition ${
        on ? 'bg-accent/80' : 'bg-ink/20'
      }`}
      aria-pressed={on}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition shadow ${
          on ? 'left-[18px]' : 'left-0.5'
        }`}
      />
    </button>
  );
}

// Back-compat export — App.tsx imports OrganelleDetails. Re-export as the new
// multi-card column so the existing import keeps working without touching App.
export { RightColumn as OrganelleDetails };
