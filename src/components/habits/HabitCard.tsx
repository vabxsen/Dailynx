type HabitCardProps = {
  title: string;
  completed: boolean;
  onToggle: () => void;
  onDelete: () => void;
};

function HabitCard({
  title,
  completed,
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

        <span
          className={`text-lg ${
            completed
              ? "line-through text-zinc-500"
              : "text-white"
          }`}
        >
          {title}
        </span>
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