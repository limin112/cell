import { StudioProvider } from './state/StudioContext';
import { TopBar } from './panels/TopBar';
import { CellTypesPanel, OrganellesPanel } from './panels/LeftPanel';
import { Stage } from './panels/Stage';
import { OrganelleDetails } from './panels/RightPanel';
import { MicroscopeView, CompareCells } from './panels/BottomRow';

export default function App() {
  return (
    <StudioProvider>
      <div className="h-screen w-screen flex flex-col overflow-hidden bg-paper">
        <TopBar />

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
