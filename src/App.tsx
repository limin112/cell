import { StudioProvider } from './state/StudioContext';
import { TopBar } from './panels/TopBar';
import { CellTypesPanel, OrganellesPanel } from './panels/LeftPanel';
import { Stage } from './panels/Stage';
import { OrganelleDetails } from './panels/RightPanel';
import { MicroscopeView, CompareCells } from './panels/BottomRow';

export default function App() {
  return (
    <StudioProvider>
      <div className="h-screen w-screen flex flex-col overflow-hidden bg-paper relative">
        <TopBar />
        <SocialLinks />

        <main className="flex-1 min-h-0 grid grid-cols-[230px_1fr_370px] grid-rows-[1fr_auto] gap-3 p-3">
          {/* Row 1 — main panels */}
          <div className="min-h-0 flex flex-col gap-3">
            <div className="flex-1 min-h-0">
              <CellTypesPanel />
            </div>
          </div>

          <Stage />

          <div className="row-span-2 min-h-0">
            <OrganelleDetails />
          </div>

          {/* Row 2 — bottom row under left + center (compact, gives Stage more height) */}
          <div className="min-h-[170px] max-h-[200px]">
            <OrganellesPanel />
          </div>
          <div className="grid grid-cols-2 gap-3 min-h-[170px] max-h-[200px]">
            <MicroscopeView />
            <CompareCells />
          </div>
        </main>
      </div>
    </StudioProvider>
  );
}

function SocialLinks() {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {/* Hand-written sticky note — arrow points down-left at the X button */}
      <div className="self-start bg-[#fdf2b8] text-ink text-xs font-serif italic px-3 py-1.5 rounded-md shadow-md rotate-[-3deg] border border-[#e9d98a]/60 relative">
        <span aria-hidden className="mr-1">👋</span>
        Like it? Follow me on X!
        <span
          aria-hidden
          className="absolute -bottom-1.5 left-6 w-3 h-3 bg-[#fdf2b8] border-r border-b border-[#e9d98a]/60 rotate-45"
        />
      </div>

      <div className="flex items-center gap-3 relative">
        {/* Pointing finger — anchored to the row, sits left of the X button */}
        <span
          aria-hidden
          className="absolute -left-11 top-1/2 -translate-y-1/2 text-3xl pointer-events-none animate-point select-none drop-shadow"
        >
          👉
        </span>

        {/* X — primary CTA: breathing pill, leftmost so the finger points right at it */}
        <a
          href="https://x.com/MinLiBuilds"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow on X: @MinLiBuilds"
          title="x.com/MinLiBuilds"
          className="group flex items-center gap-2 px-3.5 py-2 rounded-full bg-black text-white text-xs font-medium animate-breathe hover:bg-[#1a1a1a] transition-colors relative"
        >
          <XIcon size={13} />
          <span className="font-semibold tracking-wide">Follow</span>
          <span className="text-white/70 group-hover:text-white">@MinLiBuilds</span>
          <span
            aria-hidden
            className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-accent ring-2 ring-paper animate-pulse"
          />
        </a>

        {/* GitHub — secondary, small icon-only chip to the right */}
        <a
          href="https://github.com/limin112/cell"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Star on GitHub: limin112/cell"
          title="github.com/limin112/cell"
          className="w-9 h-9 rounded-full bg-[#24292e] text-white shadow-md hover:bg-black hover:-translate-y-0.5 hover:shadow-lg transition-all flex items-center justify-center"
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
  // Lucide doesn't ship a current X glyph; inline the simple wordmark path.
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
