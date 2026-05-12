import { useState } from 'react';
import {
  Box,
  Layers,
  Circle,
  RotateCcw,
  EyeOff,
  Eye,
  Maximize2,
  Camera,
  Cuboid,
} from 'lucide-react';
import { useStudio } from '../state/StudioContext';
import type { ViewMode } from '../state/StudioContext';
import { STAGE_TIP } from '../data/mockCopy';
import { cellAccent } from '../data/cellIcons';
import { CellViewer } from '../three/CellViewer';
import { cellModelUrl } from '../three/assetRegistry';
import { scopeFilter } from '../data/microscopeModes';

export function Stage() {
  const { state, dispatch, selectedCell } = useStudio();
  const [resetNonce, setResetNonce] = useState(0);
  const [spinning, setSpinning] = useState(true);
  const modelUrl = cellModelUrl(selectedCell.id);
  const filter = scopeFilter(state.scopeMode);

  return (
    <section className="bg-white/70 rounded-xl border border-paperDark flex flex-col min-h-0 overflow-hidden relative">
      {/* Title — compact so the 3D viewport gets max height */}
      <div key={selectedCell.id} className="px-6 pt-3 pb-1 shrink-0 fade-rise">
        <h2 className="font-serif text-3xl font-semibold text-ink leading-tight">
          {selectedCell.nameEn}
        </h2>
        <p className="text-xs italic text-ink/60 mt-0.5">
          {kindSubtitle(selectedCell.kingdom)}
        </p>
      </div>

      {/* Viewport area — expanded; toolbars overlay on top */}
      <div className="flex-1 relative min-h-0 mx-3 mb-3 rounded-lg overflow-hidden transition-all duration-300 ease-out">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 55%, ${cellAccent(
              selectedCell.id
            )}30, transparent 65%), radial-gradient(ellipse at 35% 45%, #7c4dff20, transparent 55%), #faf6ed`,
          }}
        />

        {/* Drei-Html-like sticky tip (Phase 3 will move it into <Html> inside the Canvas) */}
        <div className="absolute top-4 left-4 max-w-[180px] px-3 py-2 bg-[#fdf2b8] text-ink text-xs font-serif leading-relaxed rotate-[-2deg] shadow-sm">
          <pre className="whitespace-pre-wrap font-serif italic">
            {STAGE_TIP}
          </pre>
        </div>

        {/* VIEW MODE + Cross-Section (top-right) */}
        <ViewModeChip />

        {/* 3D viewport — real GLB if registered, placeholder otherwise */}
        {modelUrl ? (
          <div
            className="absolute inset-0 transition-[filter] duration-300 ease-out"
            style={{ filter }}
          >
            <CellViewer
              url={modelUrl}
              accent={cellAccent(selectedCell.id)}
              autoRotate={spinning}
              resetNonce={resetNonce}
            />
          </div>
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
            style={{ filter }}
          >
            <div
              className="w-[62%] h-[70%] rounded-[45%_55%_60%_40%/50%_60%_40%_50%] opacity-90"
              style={{
                background: `radial-gradient(ellipse at 35% 35%, #ffffff, ${cellAccent(
                  selectedCell.id
                )}55 50%, ${cellAccent(selectedCell.id)}88 100%)`,
                filter: 'blur(0.5px)',
              }}
            />
            <span className="absolute text-ink/30 text-xs mt-[35%]">
              [Tripo3D asset pending · placeholder]
            </span>
          </div>
        )}

        {/* Bottom-left toolbar */}
        <StageToolbar
          onReset={() => {
            dispatch({ type: 'RESET_VIEW' });
            setResetNonce((n) => n + 1);
          }}
          onToggleRotate={() => setSpinning((s) => !s)}
          spinning={spinning}
          hasModel={!!modelUrl}
        />

        {/* Bottom-right screenshot + 3D export */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <ToolbarButton icon={<Camera size={14} />} label="Screenshot" />
          <ToolbarButton icon={<Cuboid size={14} />} label="3D Export" />
        </div>
      </div>
    </section>
  );
}

function ViewModeChip() {
  const { state, dispatch } = useStudio();
  const modes: { id: ViewMode; icon: React.ReactNode; label: string }[] = [
    { id: 'solid', icon: <Box size={14} />, label: 'Solid' },
    { id: 'layered', icon: <Layers size={14} />, label: 'Layered' },
    { id: 'sliced', icon: <Circle size={14} />, label: 'Sliced' },
  ];

  return (
    <div className="absolute top-4 right-4 bg-[#e6efd8]/80 backdrop-blur rounded-xl px-3 py-2 border border-olive/20 flex flex-col gap-2 shadow-sm">
      <div className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] text-ink/50">
        VIEW MODE
      </div>
      <div className="flex items-center gap-1">
        {modes.map((m) => {
          const active = state.viewMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => dispatch({ type: 'SET_VIEW_MODE', mode: m.id })}
              title={m.label}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${
                active
                  ? 'bg-white shadow border border-olive/30 text-olive'
                  : 'text-ink/40 hover:bg-white/60'
              }`}
            >
              {m.icon}
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-between gap-3 text-[11px] text-ink/60 pt-1 border-t border-olive/20">
        <span>Cross-Section</span>
        <Switch
          on={state.crossSection}
          onToggle={() => dispatch({ type: 'TOGGLE_CROSS_SECTION' })}
        />
      </div>
    </div>
  );
}

function StageToolbar({
  onReset,
  onToggleRotate,
  spinning,
  hasModel,
}: {
  onReset: () => void;
  onToggleRotate: () => void;
  spinning: boolean;
  hasModel: boolean;
}) {
  return (
    <div className="absolute bottom-3 left-3 flex items-center gap-2">
      <ToolbarButton
        icon={<RotateCcw size={14} />}
        label={spinning ? 'Pause' : 'Rotate'}
        onClick={onToggleRotate}
        disabled={!hasModel}
      />
      <ToolbarButton icon={<Maximize2 size={14} />} label="Isolate" />
      <ToolbarButton icon={<EyeOff size={14} />} label="Hide Others" />
      <ToolbarButton
        icon={<Eye size={14} />}
        label="Reset View"
        onClick={onReset}
      />
    </div>
  );
}

function ToolbarButton({
  icon,
  label,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 border border-paperDark text-xs text-ink/70 hover:bg-white hover:text-ink transition shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {icon}
      {label}
    </button>
  );
}

function Switch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-8 h-4 rounded-full transition ${
        on ? 'bg-olive/80' : 'bg-ink/20'
      }`}
      aria-pressed={on}
    >
      <span
        className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition ${
          on ? 'left-[18px]' : 'left-0.5'
        }`}
      />
    </button>
  );
}

function kindSubtitle(k: string): string {
  return k === 'prokaryote' ? 'Prokaryotic Cell' : 'Eukaryotic Cell';
}
