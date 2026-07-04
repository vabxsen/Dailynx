import { Zap } from "lucide-react";

import { useXp } from "../../contexts/XPContext";

type Props = {
  className?: string;
};

/** Compact "Lv N" pill with a mini progress bar, for the Sidebar/Navbar. */
function LevelBadge({ className = "" }: Props) {
  const { level } = useXp();

  return (
    <div
      className={`flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2 ${className}`}
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-lime/15 text-lime">
        <Zap className="h-3.5 w-3.5" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold leading-none text-white">
          Lv {level.level}
        </p>
        <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-lime transition-[width] duration-700 ease-out"
            style={{ width: `${Math.min(level.progress, 1) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default LevelBadge;
