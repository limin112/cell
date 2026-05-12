import { Grid3x3, Library, NotebookPen, Settings, ChevronDown } from 'lucide-react';

export function TopBar() {
  return (
    <header className="h-14 sm:h-16 flex items-center justify-between px-3 sm:px-6 border-b border-paperDark bg-paper/80 backdrop-blur shrink-0">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <Logo />
        <span className="font-serif text-lg sm:text-2xl font-semibold text-ink leading-none truncate">
          Cell Architecture Studio
        </span>
        <span className="hidden lg:flex text-sm italic text-accent/80 items-center gap-1 shrink-0">
          Explore life at the microscopic level
          <span aria-hidden className="text-accent/70">✦</span>
        </span>
      </div>

      <nav className="flex items-center gap-3 sm:gap-6 text-ink/30 select-none shrink-0">
        <div className="hidden md:flex items-center gap-6">
          <NavItem icon={<Grid3x3 size={18} />} label="Gallery" />
          <NavItem icon={<Library size={18} />} label="Library" />
          <NavItem icon={<NotebookPen size={18} />} label="Notebooks" />
          <NavItem icon={<Settings size={18} />} label="Settings" />
        </div>
        <div className="flex items-center gap-1 md:pl-2">
          <div
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-accent/30 overflow-hidden flex items-center justify-center"
            style={{
              background:
                'radial-gradient(circle at 35% 30%, #f6d4c2, #c06b4a 80%)',
              boxShadow: 'inset 0 -4px 8px rgba(0,0,0,0.12)',
            }}
          >
            <span className="text-sm sm:text-base leading-none">🔬</span>
          </div>
          <ChevronDown size={14} className="text-ink/40 hidden sm:block" />
        </div>
      </nav>
    </header>
  );
}

function Logo() {
  // Watercolor-cell logo placeholder until a real SVG/illustration ships.
  return (
    <div
      className="w-10 h-10 rounded-full border border-accent/30 flex items-center justify-center shrink-0"
      style={{
        background:
          'radial-gradient(circle at 30% 30%, #f5e2ff 0%, #c9a8ff 45%, #7c4dff 100%)',
        boxShadow: 'inset 0 -4px 10px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.06)',
      }}
      aria-hidden
    >
      <span className="text-lg leading-none">🧫</span>
    </div>
  );
}

function NavItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 pointer-events-none">
      <div>{icon}</div>
      <span className="text-[10px]">{label}</span>
    </div>
  );
}
