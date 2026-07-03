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
    <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-blue-500 transition-all">
      <div className="flex items-center gap-4">
        <input
          type="checkbox"
          checked={completed}
          onChange={onToggle}
          className="w-5 h-5 accent-blue-500 cursor-pointer"
        />

        {time && (
          <span className="text-sm font-mono text-blue-400 bg-blue-500/10 px-2 py-1 rounded-md">
            {time}
          </span>
        )}

        <div>
          <span
            className={`text-lg ${
              completed ? "line-through text-zinc-500" : "text-white"
            }`}
          >
            {title}
          </span>

          <div className="text-xs text-zinc-500 mt-1">
            🔥 {currentStreak}d · {monthlyCount} this month · best {bestStreak}
          </div>
        </div>
      </div>

      <button
        onClick={onDelete}
        className="text-red-400 hover:text-red-500 text-xl"
      >
        🗑️
      </button>
    </div>
  );
}

export default HabitCard;
