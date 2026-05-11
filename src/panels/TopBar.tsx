import { Grid3x3, Library, NotebookPen, Settings, ChevronDown } from 'lucide-react';

export function TopBar() {
  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-paperDark bg-paper/80 backdrop-blur shrink-0">
      <div className="flex items-baseline gap-3">
        <span className="font-serif text-xl font-semibold text-ink">
          Cell Architecture Studio
        </span>
        <span className="text-sm italic text-accent/80">
          Explore life at the microscopic level
        </span>
      </div>

      <nav className="flex items-center gap-6 text-ink/30 select-none">
        <NavItem icon={<Grid3x3 size={18} />} label="Gallery" />
        <NavItem icon={<Library size={18} />} label="Library" />
        <NavItem icon={<NotebookPen size={18} />} label="Notebooks" />
        <NavItem icon={<Settings size={18} />} label="Settings" />
        <div className="flex items-center gap-1 pl-2">
          <div
            className="w-8 h-8 rounded-full border border-accent/30"
            style={{
              background:
                'radial-gradient(circle at 35% 35%, #f2c2b2, #c06b4a 70%)',
            }}
          />
          <ChevronDown size={14} className="text-ink/40" />
        </div>
      </nav>
    </header>
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
