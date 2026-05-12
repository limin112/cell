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
    <div className="fixed bottom-3 right-3 z-50 flex items-center gap-2">
      <a
        href="https://github.com/limin112"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
        title="GitHub @limin112"
        className="w-9 h-9 rounded-full bg-white/80 border border-paperDark shadow-sm flex items-center justify-center text-ink/70 hover:text-ink hover:bg-white transition backdrop-blur"
      >
        <GitHubIcon size={16} />
      </a>
      <a
        href="https://x.com/MinLiBuilds"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="X (Twitter)"
        title="X @MinLiBuilds"
        className="w-9 h-9 rounded-full bg-white/80 border border-paperDark shadow-sm flex items-center justify-center text-ink/70 hover:text-ink hover:bg-white transition backdrop-blur"
      >
        <XIcon size={14} />
      </a>
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
