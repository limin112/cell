import { startTransition } from 'react';
import { StudioProvider, useStudio } from './state/StudioContext';
import { TopBar } from './panels/TopBar';
import { CellTypesPanel, OrganellesPanel } from './panels/LeftPanel';
import { Stage } from './panels/Stage';
import { OrganelleDetails } from './panels/RightPanel';
import { MicroscopeView, CompareCells } from './panels/BottomRow';
import { CellThumb } from './three/CellThumb';

export default function App() {
  return (
    <StudioProvider>
      {/*
        100dvh = dynamic viewport, doesn't jitter when mobile browsers
        collapse / expand their address bar — fixes the 'page keeps
        refreshing' loop when Canvas resize re-triggers vh layout.
      */}
      <div className="h-[100dvh] w-screen flex flex-col overflow-hidden bg-paper relative">
        <TopBar />
        <SocialLinks />

        {/* Mobile layout — single screen, no scroll, just title + 3D + cell strip */}
        <main className="flex-1 min-h-0 p-2 gap-2 flex flex-col lg:hidden">
          <div className="flex-1 min-h-0 flex flex-col">
            <Stage />
          </div>
          <MobileCellStrip />
        </main>

        {/* Desktop layout — full studio grid */}
        <main className="hidden lg:grid flex-1 min-h-0 grid-cols-[230px_1fr_370px] grid-rows-[1fr_auto] gap-3 p-3 overflow-hidden">
          <div className="min-h-0 col-start-1 row-start-1 flex flex-col">
            <CellTypesPanel />
          </div>

          <div className="min-h-0 col-start-2 row-start-1 flex flex-col">
            <Stage />
          </div>

          <div className="min-h-0 col-start-3 row-span-2">
            <OrganelleDetails />
          </div>

          <div className="min-h-[170px] max-h-[200px] col-start-1 row-start-2 flex flex-col">
            <OrganellesPanel />
          </div>

          <div className="grid grid-cols-2 gap-3 min-h-[170px] max-h-[200px] col-start-2 row-start-2">
            <MicroscopeView />
            <CompareCells />
          </div>
        </main>
      </div>
    </StudioProvider>
  );
}

/** Compact horizontal cell switcher for mobile — keeps the rest of the studio
 *  out of the way so the 3D viewport gets the whole screen. */
function MobileCellStrip() {
  const { state, dispatch, cells } = useStudio();
  return (
    <div className="shrink-0 bg-white/70 border border-paperDark rounded-xl px-2 py-2">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
        {cells.map((c) => {
          const active = c.id === state.selectedCellId;
          return (
            <button
              key={c.id}
              onClick={() =>
                startTransition(() =>
                  dispatch({ type: 'SELECT_CELL', id: c.id })
                )
              }
              className={`shrink-0 flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition active:scale-95 ${
                active ? 'bg-[#e6efd8] ring-1 ring-olive/30' : ''
              }`}
            >
              <CellThumb id={c.id} size={44} shape="square" noCanvas />
              <span
                className={`text-[10px] leading-tight max-w-[68px] truncate ${
                  active ? 'text-ink font-medium' : 'text-ink/60'
                }`}
              >
                {c.nameEn}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SocialLinks() {
  return (
    <div className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-50 flex flex-col items-end gap-2 max-w-[calc(100vw-1.5rem)]">
      <div className="hidden sm:block self-start bg-[#fdf2b8] text-ink text-xs font-serif italic px-3 py-1.5 rounded-md shadow-md rotate-[-3deg] border border-[#e9d98a]/60 relative">
        <span aria-hidden className="mr-1">👋</span>
        Like it? Follow me on X!
        <span
          aria-hidden
          className="absolute -bottom-1.5 left-6 w-3 h-3 bg-[#fdf2b8] border-r border-b border-[#e9d98a]/60 rotate-45"
        />
      </div>

      <div className="flex items-center gap-2 sm:gap-3 relative">
        <span
          aria-hidden
          className="hidden sm:block absolute -left-11 top-1/2 -translate-y-1/2 text-3xl pointer-events-none animate-point select-none drop-shadow"
        >
          👉
        </span>

        <a
          href="https://x.com/MinLiBuilds"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow on X: @MinLiBuilds"
          title="x.com/MinLiBuilds"
          className="group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-full bg-black text-white text-xs font-medium animate-breathe hover:bg-[#1a1a1a] active:scale-95 transition-colors relative touch-manipulation"
        >
          <XIcon size={13} />
          <span className="font-semibold tracking-wide">Follow</span>
          <span className="hidden sm:inline text-white/70 group-hover:text-white">@MinLiBuilds</span>
          <span
            aria-hidden
            className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-accent ring-2 ring-paper animate-pulse"
          />
        </a>

        <a
          href="https://github.com/limin112/cell"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Star on GitHub: limin112/cell"
          title="github.com/limin112/cell"
          className="w-9 h-9 rounded-full bg-[#24292e] text-white shadow-md hover:bg-black hover:-translate-y-0.5 hover:shadow-lg active:scale-95 transition-all flex items-center justify-center touch-manipulation"
        >
          <GitHubIcon size={16} />
        </a>
      </div>
    </div>
  );
}

function GitHubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.69-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.06 11.06 0 0 1 5.79 0c2.2-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.27 5.68.41.36.78 1.06.78 2.14v3.18c0 .31.21.68.8.56C20.21 21.38 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}
