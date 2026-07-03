type HabitCardProps = {
  title: string;
  time: string;
  completed: boolean;
  currentStreak: number;
  monthlyCount: number;
  bestStreak: number;
  onToggle: () => void;
  onDelete: () => void;
};

function HabitCard({
  title,
  time,
  completed,
  currentStreak,
  monthlyCount,
  bestStreak,
  onToggle,
  onDelete,
}: HabitCardProps) {
  return (
    <div
      className={`group flex items-center gap-4 rounded-2xl border p-4 transition ${
        completed
          ? "border-emerald-500/30 bg-emerald-500/5"
          : "border-white/10 bg-slate-900/60 hover:border-white/20"
      }`}
    >
      <button
        onClick={onToggle}
        aria-label={completed ? "Mark as not done" : "Mark as done"}
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition ${
          completed
            ? "border-emerald-500 bg-emerald-500 text-white"
            : "border-slate-600 hover:border-violet-400"
        }`}
      >
        {completed && <CheckIcon />}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {time && (
            <span className="rounded-md bg-violet-500/10 px-2 py-0.5 font-mono text-xs text-violet-300">
              {time}
            </span>
          )}

          <span
            className={`truncate text-base font-medium ${
              completed ? "text-slate-500 line-through" : "text-white"
            }`}
          >
            {title}
          </span>
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
          <span className="text-amber-400">
            🔥 {currentStreak} day{currentStreak === 1 ? "" : "s"}
          </span>
          <span className="text-slate-600">·</span>
          <span>{monthlyCount} this month</span>
          <span className="text-slate-600">·</span>
          <span>best {bestStreak}</span>
        </div>
      </div>

      <button
        onClick={onDelete}
        aria-label="Delete habit"
        className="shrink-0 rounded-lg p-2 text-slate-500 opacity-100 transition hover:bg-red-500/10 hover:text-red-400 md:opacity-0 md:group-hover:opacity-100"
      >
        <TrashIcon />
      </button>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

export default HabitCard;
