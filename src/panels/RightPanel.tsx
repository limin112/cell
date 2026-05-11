import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useStudio } from '../state/StudioContext';
import { getOrganelleMock } from '../data/mockCopy';
import { organelleImagePath } from '../three/organelleAssets';

export function OrganelleDetails() {
  const { state, dispatch, selectedOrganelle, selectedCell } = useStudio();
  const mock = getOrganelleMock(selectedOrganelle?.id);
  const imgSrc = selectedOrganelle
    ? organelleImagePath(selectedCell.id, selectedOrganelle.id)
    : null;

  if (!selectedOrganelle) {
    return (
      <section className="bg-white/70 rounded-xl border border-paperDark p-4 min-h-0 flex items-center justify-center text-sm text-ink/40">
        No organelle selected
      </section>
    );
  }

  return (
    <section className="bg-white/70 rounded-xl border border-paperDark flex flex-col min-h-0 overflow-hidden">
      <header className="flex items-center justify-between px-4 py-2.5 border-b border-paperDark">
        <span className="text-[11px] font-semibold tracking-[0.2em] text-ink/50">
          ORGANELLE DETAILS
        </span>
        <Heart size={14} className="text-accent/70" fill="currentColor" />
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Mini preview + names */}
        <div className="flex items-start gap-3">
          <OrganelleBadge
            src={imgSrc}
            accent={mock.accent ?? '#7c4dff'}
          />
          <div className="min-w-0 pt-1">
            <div className="font-serif text-lg font-semibold text-ink truncate">
              {selectedOrganelle.nameEn}
            </div>
            <div className="text-xs italic text-ink/50 truncate">
              {selectedOrganelle.tagline}
            </div>
          </div>
        </div>

        {/* Attributes */}
        <div className="text-xs text-ink/70 space-y-1.5 pt-2">
          <AttrRow label="Size" value={mock.size} />
          <AttrRow label="Location" value={mock.location} />
          <AttrRow label="Visible in LM" value={mock.visibleInLM} />
          <div className="flex items-center justify-between gap-3 py-1">
            <span className="text-ink/50">Label</span>
            <LabelSwitch
              on={state.label}
              onToggle={() => dispatch({ type: 'TOGGLE_LABEL' })}
            />
          </div>
        </div>

        {/* Biological notes */}
        <section>
          <div className="text-[11px] font-semibold tracking-[0.2em] text-ink/50 mb-1.5">
            BIOLOGICAL NOTES
          </div>
          <p className="text-xs leading-relaxed text-ink/80">
            {mock.biologicalNotes}
          </p>
        </section>

        {/* Fun fact */}
        <div className="bg-[#fdf2b8]/70 rounded-lg px-3 py-2 border border-[#e9d98a]">
          <div className="text-[11px] text-ink font-semibold mb-0.5 italic">
            Fun fact:
          </div>
          <p className="text-xs italic leading-relaxed text-ink/80">
            {mock.funFact}
          </p>
        </div>
      </div>
    </section>
  );
}

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
